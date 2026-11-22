(function (root) {
  const BZ = root.BZ = root.BZ || {};
  const E = BZ.E;
  const M = BZ.Meta = {};

  M.dayKey = function (d) {
    d = d || new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  };
  M.dayStart = function (d) { d = d ? new Date(d) : new Date(); d.setHours(0, 0, 0, 0); return d; };
  M.nextDay = function () { const d = M.dayStart(); d.setDate(d.getDate() + 1); return d; };
  M.weekStart = function (d) {
    const x = M.dayStart(d);
    const wd = (x.getDay() + 6) % 7;
    x.setDate(x.getDate() - wd);
    return x;
  };
  M.weekKey = d => M.dayKey(M.weekStart(d));
  M.weekEnd = function (d) { const x = M.weekStart(d); x.setDate(x.getDate() + 7); return x; };
  function hash(str) {
    let h = 2166136261;
    for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
  }
  M.hash = hash;

  M.ensure = function (s) {
    s.daily = s.daily || { streak: 0, bestStreak: 0, lastClaim: '', questDay: '', quests: [] };
    s.league = s.league || { week: '', tier: 0, points: 0, bestTier: 0, history: [], pending: null };
    s.quick = s.quick || { slot: -1, tasks: [], done: 0 };
    s.seed = s.seed || (Math.random() * 1e9) >>> 0;
    s.playerName = s.playerName || '';
  };

  M.streakStatus = function (s) {
    const today = M.dayKey();
    const y = new Date(); y.setDate(y.getDate() - 1);
    const yesterday = M.dayKey(y);
    const d = s.daily;
    if (d.lastClaim === today) return { canClaim: false, streak: d.streak, index: (d.streak - 1) % 7 };
    const next = d.lastClaim === yesterday ? d.streak + 1 : 1;
    return { canClaim: true, streak: next, index: (next - 1) % 7 };
  };
  M.claimStreak = function (s) {
    const st = M.streakStatus(s);
    if (!st.canClaim) return null;
    s.daily.streak = st.streak;
    s.daily.bestStreak = Math.max(s.daily.bestStreak || 0, st.streak);
    s.daily.lastClaim = M.dayKey();
    const r = BZ.STREAK_REWARDS[st.index];
    M.addPoints(s, 'streak');
    return BZ.P.grant(s, r);
  };

  M.questGen = function (s) {
    const today = M.dayKey();
    if (s.daily.questDay === today) return false;
    const rnd = E.rng(hash(today + ':' + s.seed));
    const pool = BZ.QUEST_POOL.filter(q => !q.needsSwarm || s.swarms > 0 || E.pendingRJ(s) > 0);
    const picked = [];
    const tiers = [0, 1, 2];
    while (picked.length < 3) {
      const tot = pool.reduce((a, q) => a + q.w, 0);
      let x = rnd() * tot, q = pool[0];
      for (const p of pool) { x -= p.w; if (x <= 0) { q = p; break; } }
      if (picked.some(p => p.id === q.id)) continue;
      const tier = tiers[picked.length];
      let target = q.amounts[tier];
      if (q.id === 'earn') target = Math.max(1000, E.cache(s).baseHps * 60 * target);
      picked.push({ id: q.id, tier, target, prog: 0, claimed: false });
    }
    s.daily.quests = picked;
    s.daily.questDay = today;
    return true;
  };
  M.questProgress = function (s, id, amount, absolute) {
    const lists = [s.daily.quests, (s.quick && s.quick.tasks) || []];
    for (const list of lists) for (const q of list) {
      if (q.id !== id || q.claimed) continue;
      if (absolute) q.prog = Math.max(q.prog, amount);
      else q.prog += amount;
    }
  };
  M.questDone = q => q.prog >= q.target;
  M.claimQuest = function (s, i) {
    const q = s.daily.quests[i];
    if (!q || q.claimed || !M.questDone(q)) return false;
    q.claimed = true;
    s.quests = (s.quests || 0) + 1;
    M.addPoints(s, 'quest');
    return BZ.P.grant(s, BZ.QUEST_REWARDS[q.tier] || BZ.QUEST_REWARDS[0]);
  };

  M.quickSlot = (now) => Math.floor((now || Date.now()) / (BZ.QUICK_EVERY * 1000));
  M.quickEnd = () => (M.quickSlot() + 1) * BZ.QUICK_EVERY * 1000;
  M.quickGen = function (s) {
    const slot = M.quickSlot();
    if (s.quick.slot === slot) return false;
    const rnd = E.rng(hash('quick:' + slot + ':' + s.seed));
    const pool = BZ.QUICK_POOL.slice();
    const tasks = [];
    for (let i = 0; i < 2; i++) {
      const q = pool.splice(Math.floor(rnd() * pool.length), 1)[0];
      let target = q.amounts[i];
      if (q.id === 'earn') target = Math.max(500, E.cache(s).baseHps * 60 * target);
      tasks.push({ id: q.id, tier: i, target, prog: 0, claimed: false });
    }
    s.quick.slot = slot;
    s.quick.tasks = tasks;
    return true;
  };
  M.quickReward = (s, q) => q.tier === 0 ? { warp: 240 } : { egg: 1 };
  M.claimQuick = function (s, i) {
    const q = s.quick.tasks[i];
    if (!q || q.claimed || !M.questDone(q)) return null;
    q.claimed = true;
    s.quick.done = (s.quick.done || 0) + 1;
    const r = Object.assign({}, M.quickReward(s, q));
    if (s.quick.done % 8 === 0) r.core = 1;
    return BZ.P.grant(s, r);
  };

  M.LEAGUE_ON = false;
  M.addPoints = function (s, kind, mult) {
    if (!M.LEAGUE_ON) return;
    const v = (BZ.LEAGUE_POINTS[kind] || 0) * (mult || 1);
    if (!v) return;
    M.leagueRoll(s);
    s.league.points += v;
  };

  const NAMES = ['Mellifera', 'Waxwing', 'Beeatrice', 'Nectarine', 'Sir Buzzalot', 'Queenie', 'Lavender', 'Stinger', 'Drizzle', 'Amberly', 'Bumble', 'Clover', 'Dandelion', 'Goldie', 'Hexa', 'Jellybean', 'Marigold', 'Saffron', 'Sunny', 'Tupelo', 'Wildflower', 'Zinnia', 'Apis', 'Honeydew', 'Maple', 'Melli', 'Pollen Pal', 'Comb Over', 'Buzzy', 'Fuzzball', 'Sweet Pea', 'Thistle', 'Acacia', 'Heather', 'Linden', 'Sage', 'Poppy', 'Juniper', 'Briar', 'Peony', 'Hive Five', 'Bee Kind', 'Mead Maker', 'Wax On', 'Royal Rae', 'Drone Ranger', 'Nectar Nick', 'Busy Bea', 'Golden Gus', 'Honey Hana', 'Petal', 'Tansy', 'Sorrel', 'Yarrow', 'Bramble', 'Fennel', 'Mimosa', 'Orchid', 'Rosemary', 'Willow'];

  M.tierBase = t => 800 * Math.pow(1.4, t);

  M.bots = function (s, week, tier) {
    const rnd = E.rng(hash(week + ':' + tier + ':' + s.seed));
    const hist = s.league.history.slice(-3);
    const avg = hist.length ? hist.reduce((a, h) => a + h.points, 0) / hist.length : 0;
    const base = avg > 0 ? M.tierBase(tier) * 0.6 + avg * 0.4 : M.tierBase(tier);
    const bots = [];
    const used = new Set();
    for (let i = 0; i < 19; i++) {
      let name;
      do { name = NAMES[Math.floor(rnd() * NAMES.length)]; } while (used.has(name));
      used.add(name);
      if (rnd() < 0.3) name += ' ' + (1 + Math.floor(rnd() * 99));
      const z = (rnd() + rnd() + rnd() - 1.5) * 1.15;
      const skill = Math.exp(z * 0.55) * (0.55 + i / 19 * 0.9);
      const days = [];
      for (let d = 0; d < 7; d++) days.push(rnd() < 0.15 ? 0.05 : 0.4 + rnd());
      const dsum = days.reduce((a, b) => a + b, 0);
      const startH = 6 + rnd() * 6, endH = startH + 8 + rnd() * 8;
      bots.push({ name, final: Math.round(base * skill), days: days.map(x => x / dsum), startH, endH, color: Math.floor(rnd() * 6) });
    }
    return bots;
  };
  M.botScore = function (b, frac) {
    const dayF = frac * 7;
    let sum = 0;
    for (let d = 0; d < 7; d++) {
      if (dayF >= d + 1) sum += b.days[d];
      else if (dayF > d) {
        const h = (dayF - d) * 24;
        const p = Math.max(0, Math.min(1, (h - b.startH) / (b.endH - b.startH)));
        sum += b.days[d] * p;
        break;
      }
    }
    return Math.round(b.final * sum);
  };
  M.weekFrac = function (now) {
    now = now || new Date();
    const s = M.weekStart(now).getTime(), e = M.weekEnd(now).getTime();
    return Math.max(0, Math.min(1, (now.getTime() - s) / (e - s)));
  };

  M.standings = function (s, frac) {
    const L = s.league;
    const bots = M.bots(s, L.week, L.tier);
    const sf = Math.min(0.95, L.startFrac || 0);
    const eff = Math.max(0, (frac - sf) / (1 - sf));
    const list = bots.map(b => ({ name: b.name, points: Math.round(M.botScore(b, eff) * (1 - sf)), bot: true, color: b.color }));
    list.push({ name: s.playerName || BZ.t('league_you'), points: Math.round(L.points), you: true });
    list.sort((a, b) => b.points - a.points || (a.you ? -1 : 1));
    list.forEach((e, i) => { e.rank = i + 1; });
    return list;
  };

  M.REWARDS = [120, 80, 60, 45, 35, 25, 22, 20, 18, 16, 15, 14, 13, 12, 11, 10, 10, 10, 10, 10];

  M.leagueRoll = function (s) {
    const L = s.league;
    const wk = M.weekKey();
    if (!L.week) { L.week = wk; L.points = 0; L.startFrac = M.weekFrac(); return null; }
    if (L.week === wk) return null;
    const list = M.standings(s, 1);
    const me = list.find(e => e.you);
    const rank = me.rank;
    const egg = Math.max(1, Math.round((M.REWARDS[rank - 1] || 10) / 20));
    const fromTier = L.tier;
    let move = 0;
    if (rank <= 5 && L.tier < BZ.LEAGUE_TIERS.length - 1) move = 1;
    else if (rank >= 16 && L.tier > 0) move = -1;
    L.tier += move;
    L.bestTier = Math.max(L.bestTier || 0, L.tier);
    L.history.push({ week: L.week, tier: fromTier, rank, points: Math.round(L.points) });
    if (L.history.length > 20) L.history.shift();
    E.addTickets(s, { egg });
    L.pending = { rank, egg, move, tier: L.tier, fromTier };
    L.week = wk;
    L.points = 0;
    L.startFrac = 0;
    return L.pending;
  };

  M.dropBee = function (s, minRarity, rnd) {
    rnd = rnd || Math.random;
    const rs = BZ.RARITIES.map((r, i) => ({ i, w: i >= (minRarity || 0) ? r.w : 0 }));
    const tot = rs.reduce((a, r) => a + r.w, 0);
    let x = rnd() * tot, rar = rs.length - 1;
    for (const r of rs) { x -= r.w; if (x <= 0 && r.w > 0) { rar = r.i; break; } }
    const pool = BZ.BEES.filter(b => b.r === rar && !b.limited);
    const bee = pool[Math.floor(rnd() * pool.length)];
    s.bees = s.bees || {};
    const before = BZ.E.beeLevel(s, bee.id);
    const isNew = !s.bees[bee.id];
    s.bees[bee.id] = (s.bees[bee.id] || 0) + 1;
    s._dirty = true;
    const after = BZ.E.beeLevel(s, bee.id);
    return { id: bee.id, isNew, levelUp: after > before && !isNew, level: after };
  };

})(typeof window !== 'undefined' ? window : globalThis);
