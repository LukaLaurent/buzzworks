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
    s.league = Object.assign({ week: '', tier: 0, points: 0, bestTier: 0, gid: '', prev: null, pending: null, history: [] }, s.league || {});
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

  M.addPoints = function (s, kind, mult) {
    const v = (BZ.LEAGUE_POINTS[kind] || 0) * (mult || 1);
    if (!v) return;
    M.leagueRoll(s);
    s.league.points += v;
  };
  M.weekFrac = function (now) {
    now = now || new Date();
    const a = M.weekStart(now).getTime(), b = M.weekEnd(now).getTime();
    return Math.max(0, Math.min(1, (now.getTime() - a) / (b - a)));
  };
  M.leagueRoll = function (s) {
    const L = s.league;
    const wk = M.weekKey();
    if (L.week === wk) return false;
    if (L.week && L.gid) L.prev = { week: L.week, gid: L.gid, points: Math.round(L.points), tier: L.tier || 0 };
    L.week = wk;
    L.points = 0;
    L.gid = '';
    return true;
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
