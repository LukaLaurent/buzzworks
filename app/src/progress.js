(function (root) {
  const BZ = root.BZ = root.BZ || {};
  const E = BZ.E, M = BZ.Meta;
  const P = BZ.P = {};

  BZ.BEES.push(
    { id: 'phoenix', r: 3, kind: 'honey', v: 0.3, c: ['#E8603C', '#3A1E22'], limited: true, name: { en: 'Phoenix bee', fr: 'Abeille phénix' } },
    { id: 'aurora', r: 3, kind: 'luckyDur', v: 0.15, c: ['#5ADBA8', '#1F3A44'], limited: true, name: { en: 'Aurora bee', fr: 'Abeille aurore' } },
    { id: 'monarch', r: 3, kind: 'rj', v: 0.12, c: ['#B48AE8', '#2A1E3A'], limited: true, name: { en: 'Monarch bee', fr: 'Abeille monarque' } },
    { id: 'crystal', r: 3, kind: 'cost', v: 0.05, c: ['#BFE6F2', '#3D6A7A'], limited: true, name: { en: 'Crystal bee', fr: 'Abeille de cristal' } },
    { id: 'sunflare', r: 3, kind: 'honey', v: 0.2, c: ['#FFB938', '#7A3A00'], limited: true, pass: true, name: { en: 'Sunflare bee', fr: 'Abeille éruption' } }
  );
  BZ.BEES.sort((a, b) => a.r - b.r);
  BZ.BEES.forEach(b => { BZ.BEE_BY_ID[b.id] = b; });

  P.SHARED = ['tickets', 'pity', 'bees', 'cores', 'coreSlots', 'parts', 'skins', 'skin', 'xp', 'level', 'pass', 'daily', 'quick', 'ads', 'ess', 'prime', 'primeStones', 'rubies', 'essenceTotal', 'essShop', 'worldsOpen', 'otherWorlds', 'event', 'battleEsc', 'flags', 'seed', 'playerName', 'league', 'quests', 'ticketBees', 'created', 'danceReady', 'cloud'];

  P.XP = { buy: 1, upgrade: 4, milestone: 6, lucky: 10, quest: 50, quick: 15, swarm: 80, achievement: 8, hatch: 5, power: 5, coronation: 300, bless: 10, ticket: 6 };
  P.xpFor = L => Math.round(40 * Math.pow(L, 1.7));
  P.UNLOCKS = { daily: 2, bees: 3, workshop: 5, league: 5, event: 5, pass: 6 };

  P.PASS_TIERS = 50;
  P.SEASON_DAYS = 7;
  P.SEASON_EPOCH = Date.UTC(2026, 0, 5);
  P.passNeed = tier => 500 + 50 * (tier - 1);
  P.passTotal = (() => { let t = 0; for (let i = 1; i <= 50; i++) t += 500 + 50 * (i - 1); return t; })();
  P.passReward = function (tier) {
    if (tier === 50) return { mystic: 1, bee: 'sunflare', royal: 10 };
    if (tier === 25) return { skin: 'sunflower', legend: 1 };
    if (tier % 10 === 0) return { royal: 5, legend: 1 };
    if (tier % 5 === 0) return { core: 10 };
    if (tier % 4 === 0) return { part: 2, egg: 10 };
    if (tier % 7 === 0) return { boost: 'x2', egg: 15 };
    return tier % 2 ? { egg: 10 } : { egg: 15 };
  };

  P.FEATURED = ['phoenix', 'aurora', 'monarch', 'crystal'];
  P.FEATURED_EPIC = ['emerald', 'cuckoo', 'frost', 'ruby'];

  P.BLESSINGS = [
    { id: 'bloom', r: 0, honey: 0.25 },
    { id: 'quick', r: 0, luckyFreq: 0.15 },
    { id: 'paws', r: 0, tap: 0.6 },
    { id: 'thrift', r: 0, cost: 0.05 },
    { id: 'elixir', r: 0, luckyDur: 0.2 },
    { id: 'dew', r: 0, offlineH: 1 },
    { id: 'spark', r: 0, combo: 0.25 },
    { id: 'focus', r: 1, focus: 3 },
    { id: 'jelly', r: 1, rj: 0.12 },
    { id: 'rhythm', r: 1, combo: 0.5, tap: 0.3 },
    { id: 'nectar', r: 1, honey: 0.6 },
    { id: 'ticket', r: 1, ticketFreq: 0.4 },
    { id: 'breeze', r: 1, luckyFreq: 0.25, luckyDur: 0.25 },
    { id: 'workers', r: 1, honey: 0.2, tap: 1 },
    { id: 'crown', r: 2, honey: 1.2 },
    { id: 'golden', r: 2, luckyFreq: 0.45 },
    { id: 'royal', r: 2, rj: 0.25 },
    { id: 'beam', r: 2, focus: 6 },
    { id: 'harvest', r: 2, honey: 0.6, rj: 0.12 },
    { id: 'nap', r: 2, offlineH: 4, honey: 0.3 },
    { id: 'sunburst', r: 3, honey: 3 },
    { id: 'grace', r: 3, rj: 0.6, honey: 0.5 },
    { id: 'storm', r: 3, luckyFreq: 1, luckyDur: 0.5, ticketFreq: 0.5 },
    { id: 'bargain', r: 3, cost: 0.2, honey: 0.5 },
    { id: 'celestial', r: 4, honey: 8, rj: 1 },
    { id: 'goldenage', r: 4, honey: 2, tap: 3, luckyFreq: 2 }
  ];
  P.BLESS_ODDS = [0, 0.3, 0.1, 0.025, 0.004];
  P.BLESS_BY_ID = {};
  P.BLESSINGS.forEach(b => { P.BLESS_BY_ID[b.id] = b; });
  P.BLESS_AT = [1e5, 1e9, 1e13, 1e17];

  P.AD_CAPS = { boost: 6, offline: 3, ticket: 3, reroll: 3 };

  P.essLvl = (s, id) => (!s.battle && s.essShop && s.essShop[id]) || 0;
  P.essCost = (s, id) => { const x = BZ.ESS_BY_ID[id]; return Math.ceil(x.base * Math.pow(x.growth, P.essLvl(s, id))); };
  P.essMaxed = (s, id) => BZ.ESS_BY_ID[id].max > 0 && P.essLvl(s, id) >= BZ.ESS_BY_ID[id].max;
  P.essReqMet = (s, id) => { const r = BZ.ESS_BY_ID[id].req; return !r || P.essLvl(s, r[0]) >= r[1]; };
  P.buyEss = function (s, id) {
    if (P.essMaxed(s, id) || !P.essReqMet(s, id)) return false;
    const c = P.essCost(s, id);
    const w = BZ.ESS_BY_ID[id].w;
    if ((s.ess[w] || 0) < c) return false;
    s.ess[w] -= c;
    s.essShop[id] = P.essLvl(s, id) + 1;
    s._dirty = true;
    return true;
  };
  P.crownName = (i, cap) => { const g = BZ.Game && BZ.Game.main; const w = (g && g.battle && i === g.world && BZ.E.world(g)) || BZ.WORLDS[i] || BZ.WORLDS[0]; const v = BZ.n(w.crown); return !cap && BZ.F.lang === 'fr' ? v[0].toLowerCase() + v.slice(1) : v; };
  P.essName = i => { const v = BZ.n(BZ.ESSENCES[i].name); return BZ.F.lang === 'fr' ? v[0].toLowerCase() + v.slice(1) : v; };
  P.applyGift = function (s, d) {
    const add = (v, x) => Math.max(0, (v || 0) + x);
    const num = v => (typeof v === 'number' && isFinite(v) ? v : 0);
    for (const k of ['egg', 'royal', 'core', 'legend', 'mystic']) if (num(d[k])) s.tickets[k] = add(s.tickets[k], num(d[k]));
    if (num(d.mystic) > 0) s.flags.mystic = 1;
    if (num(d.legend) > 0) s.flags.legend = 1;
    if (typeof d.boost === 'string' && BZ.BOOST_BY_ID[d.boost]) E.addBoost(s, d.boost);
    if (num(d.primeStones)) s.primeStones = add(s.primeStones, num(d.primeStones));
    if (Array.isArray(d.ess)) d.ess.forEach((v, i) => { v = num(v); if (!v || i >= s.ess.length) return; s.ess[i] = add(s.ess[i], v); if (v > 0) s.essenceTotal = (s.essenceTotal || 0) + v; });
    if (num(d.honey) > 0) E.gainHoney(s, num(d.honey));
    else if (num(d.honey) < 0) s.honey = add(s.honey, num(d.honey));
    if (num(d.rj)) s.rj = add(s.rj, num(d.rj));
    if (num(d.crowns)) s.crowns = add(s.crowns, num(d.crowns));
    if (num(d.levels)) { s.level = Math.max(1, (s.level || 1) + Math.round(num(d.levels))); s.xp = 0; }
    if (num(d.passXp)) { P.passRoll(s); s.pass.xp = add(s.pass.xp, num(d.passXp)); }
    if (num(d.league)) s.league.points = add(s.league.points, num(d.league));
    if (num(d.parts) > 0) for (let i = 0; i < Math.min(200, num(d.parts)); i++) P.addPart(s);
    if (d.lgReset) s.league.points = 0;
    if (d.lgKick) { s.league.gid = ''; s.league.points = 0; }
    if (d.rename) s.playerName = '';
    s._dirty = true;
    if (d.op && P.DEV_OPS[d.op] !== undefined) { const ns = P.applyOp(s, d.op, d.target, num(d.amt)); ns._dirty = true; return ns; }
    return s;
  };
  P.treeCount = (s, w) => BZ.ESSENCE_SHOP.filter(x => w === undefined || x.w === w).length;
  P.treeDoneCount = (s, w) => BZ.ESSENCE_SHOP.filter(x => (w === undefined || x.w === w) && P.essMaxed(s, x.id)).length;
  P.treeDone = s => P.treeDoneCount(s) === P.treeCount(s);
  P.primeCost = s => Math.ceil(BZ.PRIME_COST * Math.pow(BZ.PRIME_GROWTH, s.prime || 0));
  P.canPrime = s => P.treeDone(s) && (s.primeStones || 0) >= 1 && s.ess.every(v => v >= P.primeCost(s));
  P.rubyChance = s => (BZ.RUBY_CHANCE + BZ.ESS_BY_ID.ruby.v * P.essLvl(s, 'ruby')) * E.boostV(s, 'stone');
  P.rubyPool = s => BZ.RUBY.filter(x => !x.worlds || (s.worldsOpen || [0]).length >= x.worlds);
  P.rubyRoll = function (s, r) {
    const rnd = r || Math.random;
    const pool = P.rubyPool(s);
    const sb = E.boostV(s, 'stone');
    const wt = it => it.w * (it.id === 'stone' && sb > 1 ? 1.5 * sb : 1);
    const tot = pool.reduce((a, x) => a + wt(x), 0);
    let v = rnd() * tot, x = pool[pool.length - 1];
    for (const it of pool) { v -= wt(it); if (v <= 0) { x = it; break; } }
    s.rubies = (s.rubies || 0) + 1;
    let got = [];
    if (x.id === 'stone') s.primeStones = (s.primeStones || 0) + 1;
    else if (x.id === 'ess') { s.ess[s.world] = (s.ess[s.world] || 0) + x.v; s.essenceTotal = (s.essenceTotal || 0) + x.v; }
    else if (x.boost) E.addBoost(s, x.boost);
    else if (x.id === 'warp') got = P.grant(s, { warp: x.v * 60 });
    else got = P.grant(s, { [x.id]: x.v });
    s._dirty = true;
    return { x, got, world: s.world };
  };
  P.doPrime = function (s) {
    if (!P.canPrime(s)) return null;
    const keep = {};
    for (const k of P.SHARED) keep[k] = s[k];
    keep.prime = (s.prime || 0) + 1;
    keep.primeStones = (s.primeStones || 0) - 1;
    keep.ess = BZ.ESSENCES.map(() => 0);
    keep.essShop = {};
    keep.worldsOpen = [0];
    keep.otherWorlds = {};
    const ns = P.freshWorld(keep, 0);
    ns.flags.worlds = 1;
    return ns;
  };
  P.mindAllowed = function (s) {
    const need = BZ.QUEEN_BY_ID.mind.need;
    const cr = (s.crowns || 0) + (s.crownsSpent || 0);
    return need.filter(n => cr >= n).length;
  };

  P.ensure = function (s) {
    s.tickets = Object.assign({ egg: 0, royal: 0, core: 0, legend: 0, mystic: 0 }, s.tickets || {});
    if (s.gems) { s.tickets.egg += Math.floor(s.gems / 25); }
    if (s.amber) { s.tickets.royal += Math.floor(s.amber / 120); }
    delete s.gems; delete s.amber; delete s.vipPts; delete s.perm; delete s.deals; delete s.vipChest; delete s.subUntil; delete s.subClaim; delete s.scouts; delete s.rushData; delete s.mode;
    s.pity = Object.assign({ std: 0, stdEpic: 0, royal: 0, royalEpic: 0, core: 0, coreEpic: 0, legend: 0, legendEpic: 0, mystic: 0, mysticEpic: 0, guarantee: false }, s.pity || {});
    s.cores = s.cores || {};
    s.coreSlots = s.coreSlots || [];
    s.parts = s.parts || {};
    s.skins = s.skins || { meadow: 1 };
    if (!BZ.SKIN_BY_ID[s.skin] || BZ.SKIN_BY_ID[s.skin].world) s.skin = 'meadow';
    s.xp = s.xp || 0;
    s.level = s.level || 1;
    if (!s.pass || s.pass.prem) s.pass = { season: s.pass ? s.pass.season : -1, xp: (s.pass && s.pass.xp) || 0, got: (s.pass && s.pass.free) || {} };
    s.bless = s.bless || [];
    s.blessOffer = s.blessOffer || null;
    s.blessDone = s.blessDone || [];
    s.ads = s.ads || { day: '', c: {} };
    delete s.purchases;
    if (!Array.isArray(s.ess)) s.ess = [s.essence || 0];
    while (s.ess.length < BZ.ESSENCES.length) s.ess.push(0);
    s.essShop = s.essShop || {};
    if (s.essenceTotal === undefined) s.essenceTotal = s.essence || 0;
    delete s.essence;
    s.prime = s.prime || 0;
    s.flags = s.flags || {};
    if (s.flags.seenVersion === undefined) s.flags.seenVersion = (s.lifetime || 0) < 1e4 ? BZ.VERSION : '';
    s.primeStones = s.primeStones || 0;
    s.rubies = s.rubies || 0;
    if (s.queen && s.queen.mind > P.mindAllowed(s)) { s.queen.mind = P.mindAllowed(s); if (!s.queen.mind) delete s.queen.mind; }
    s.worldsOpen = s.worldsOpen || [0];
    s.otherWorlds = s.otherWorlds || {};
    s.flags = s.flags || {};
    s.world = s.world || 0;
    s.runAch = s.runAch || {};
    s.crownsSpent = s.crownsSpent || 0;
    s.crownsBonus = s.crownsBonus || 0;
    s.cloud = s.cloud || {};
    P.passRoll(s);
    P.flagCheck(s);
  };

  P.essHoney = s => ['honey', 'blaze', 'glow', 'forge', 'nectar', 'phoenix'].reduce((a, id) => a * Math.pow(1 + BZ.ESS_BY_ID[id].v, P.essLvl(s, id)), 1);
  P.coreSlotCount = s => 2 + ((s.level || 1) >= 20 ? 1 : 0) + P.essLvl(s, 'slot');
  P.ownedSkins = s => BZ.SKINS.filter(x => !x.world && x.id !== 'meadow' && s.skins[x.id]).length;

  P.mods = function (s) {
    const m = { honey: 1, luckyFreq: 1, luckyDur: 1, tap: 1, cost: 1, rj: 1, combo: 0, offlineH: 0, offline: 1, ticketFreq: 1, prodX: {} };
    if (!s.battle) m.honey *= 1 + 0.01 * Math.max(0, (s.level || 1) - 1);
    m.honey *= P.essHoney(s);
    m.rj *= Math.pow(1 + BZ.ESS_BY_ID.jelly.v, P.essLvl(s, 'jelly'));
    m.luckyFreq *= 1 + BZ.ESS_BY_ID.lucky.v * P.essLvl(s, 'lucky');
    m.ticketFreq *= 1 + BZ.ESS_BY_ID.tickets.v * P.essLvl(s, 'tickets');
    m.offlineH += BZ.ESS_BY_ID.nap.v * P.essLvl(s, 'nap');
    m.tap *= Math.pow(1 + BZ.ESS_BY_ID.tap.v, P.essLvl(s, 'tap'));
    m.luckyDur *= 1 + BZ.ESS_BY_ID.fortune.v * P.essLvl(s, 'fortune');
    m.rj *= Math.pow(1 + BZ.ESS_BY_ID.ash.v, P.essLvl(s, 'ash'));
    m.rj *= Math.pow(1 + BZ.ESS_BY_ID.regal.v, P.essLvl(s, 'regal'));
    m.luckyDur *= 1 + BZ.ESS_BY_ID.chill.v * P.essLvl(s, 'chill');
    m.tap *= Math.pow(1 + BZ.ESS_BY_ID.tide.v, P.essLvl(s, 'tide'));
    m.cost *= 1 - BZ.ESS_BY_ID.heart.v * P.essLvl(s, 'heart');
    m.honey *= Math.pow(2, s.battle ? 0 : s.prime || 0);
    const w = E.world(s).mods;
    if (w.honey) m.honey *= w.honey;
    if (w.luckyFreq) m.luckyFreq *= w.luckyFreq;
    if (w.luckyDur) m.luckyDur *= w.luckyDur;
    if (w.tap) m.tap *= w.tap;
    if (w.rj) m.rj *= w.rj;
    if (w.offline) m.offline *= w.offline;
    if (w.offlineH) m.offlineH += w.offlineH;
    if (s.skins && !s.battle) {
      m.honey *= 1 + 0.03 * P.ownedSkins(s);
      const sk = BZ.SKIN_BY_ID[s.skin];
      const b = sk && sk.boost;
      if (b) {
        if (b.honey) m.honey *= 1 + b.honey;
        if (b.tap) m.tap *= 1 + b.tap;
        if (b.offlineH) m.offlineH += b.offlineH;
        if (b.luckyFreq) m.luckyFreq *= 1 + b.luckyFreq;
        if (b.luckyDur) m.luckyDur *= 1 + b.luckyDur;
        if (b.cost) m.cost *= 1 - b.cost;
        if (b.rj) m.rj *= 1 + b.rj;
      }
    }
    const cs = P.coreStats(s);
    m.honey *= 1 + cs.honey;
    m.tap *= 1 + cs.tap;
    m.cost *= 1 - Math.min(0.4, cs.cost);
    m.luckyFreq *= 1 + cs.luckyFreq + cs.lucky;
    m.luckyDur *= 1 + cs.luckyDur + cs.lucky;
    m.offlineH += cs.offlineH;
    m.ticketFreq *= 1 + cs.ticketFreq;
    m.rj *= 1 + cs.rj;
    m.combo += cs.combo;
    for (const entry of s.bless || []) {
      const b = P.BLESS_BY_ID[entry.id];
      if (!b) continue;
      if (b.honey) m.honey *= 1 + b.honey;
      if (b.luckyFreq) m.luckyFreq *= 1 + b.luckyFreq;
      if (b.luckyDur) m.luckyDur *= 1 + b.luckyDur;
      if (b.tap) m.tap *= 1 + b.tap;
      if (b.cost) m.cost *= 1 - b.cost;
      if (b.rj) m.rj *= 1 + b.rj;
      if (b.combo) m.combo += b.combo;
      if (b.ticketFreq) m.ticketFreq *= 1 + b.ticketFreq;
      if (b.focus && entry.target) m.prodX[entry.target] = (m.prodX[entry.target] || 1) * b.focus;
      if (b.offlineH) m.offlineH += b.offlineH;
    }
    return m;
  };

  P.coreStats = function (s) {
    const out = { honey: 0, tap: 0, cost: 0, luckyFreq: 0, luckyDur: 0, lucky: 0, offlineH: 0, ticketFreq: 0, rj: 0, combo: 0 };
    if (s.battle) return out;
    const n = P.coreSlotCount(s);
    (s.coreSlots || []).slice(0, n).forEach(id => {
      const c = BZ.CORE_BY_ID[id];
      const l = E.coreLevel(s, id);
      if (c && l) out[c.kind] += c.v * l;
    });
    return out;
  };
  P.equipCore = function (s, id) {
    if (!s.cores[id]) return false;
    const i = s.coreSlots.indexOf(id);
    if (i >= 0) { s.coreSlots.splice(i, 1); s._dirty = true; return 'off'; }
    if (s.coreSlots.length >= P.coreSlotCount(s)) return 'full';
    s.coreSlots.push(id);
    s._dirty = true;
    return 'on';
  };

  P.addPart = function (s, rnd) {
    rnd = rnd || Math.random;
    const pool = BZ.SKINS.filter(x => x.parts > 0 && !s.skins[x.id]);
    if (!pool.length) { E.addTickets(s, { core: 1 }); return { k: 'core', v: 1 }; }
    const sk = pool[Math.floor(rnd() * pool.length)];
    s.parts[sk.id] = (s.parts[sk.id] || 0) + 1;
    if (s.parts[sk.id] >= sk.parts) {
      s.skins[sk.id] = 1;
      delete s.parts[sk.id];
      s._dirty = true;
      return { k: 'skin', v: sk.id };
    }
    return { k: 'part', v: sk.id };
  };

  P.grant = function (s, r) {
    const got = [];
    if (!r) return got;
    if (r.egg) { E.addTickets(s, { egg: r.egg }); got.push({ k: 'egg', v: r.egg }); }
    if (r.royal) { E.addTickets(s, { royal: r.royal }); got.push({ k: 'royal', v: r.royal }); }
    if (r.core) { E.addTickets(s, { core: r.core }); got.push({ k: 'core', v: r.core }); }
    if (r.legend) { E.addTickets(s, { legend: r.legend }); s.flags.legend = 1; got.push({ k: 'legend', v: r.legend }); }
    if (r.mystic) { E.addTickets(s, { mystic: r.mystic }); s.flags.mystic = 1; got.push({ k: 'mystic', v: r.mystic }); }
    if (r.part) for (let i = 0; i < r.part; i++) got.push(P.addPart(s));
    if (r.skin) { s.skins[r.skin] = 1; s._dirty = true; got.push({ k: 'skin', v: r.skin }); }
    if (r.boost) { E.addBoost(s, r.boost); got.push({ k: 'boost', v: r.boost }); }
    if (r.warp) { const h = Math.max(50, E.cache(s).baseHps * r.warp); E.gainHoney(s, h); got.push({ k: 'honey', v: h }); }
    if (r.bee) { s.bees[r.bee] = (s.bees[r.bee] || 0) + 1; s._dirty = true; got.push({ k: 'bee', v: r.bee }); }
    return got;
  };

  P.adsRoll = function (s) {
    const today = M.dayKey();
    if (s.ads.day !== today) { s.ads.day = today; s.ads.c = {}; }
  };
  P.adLeft = function (s, place) {
    P.adsRoll(s);
    return Math.max(0, (P.AD_CAPS[place] || 0) - (s.ads.c[place] || 0));
  };
  P.adUse = function (s, place) {
    P.adsRoll(s);
    s.ads.c[place] = (s.ads.c[place] || 0) + 1;
  };

  P.addXp = function (s, kind, n) {
    const base = (P.XP[kind] || 0) * (n || 1) * E.boostV(s, 'xp');
    if (!base) return [];
    s.xp += base;
    P.passRoll(s);
    s.pass.xp += base;
    const ups = [];
    while (s.xp >= P.xpFor(s.level)) {
      s.xp -= P.xpFor(s.level);
      s.level++;
      ups.push(s.level);
    }
    if (ups.length) s._dirty = true;
    return ups;
  };
  P.levelReward = function (L) {
    const r = { egg: 5 + Math.floor(L / 5) };
    if (L % 3 === 0) r.core = 3;
    if (L % 4 === 0) r.part = 1;
    if (L % 5 === 0) r.royal = 2;
    if (L % 10 === 0) { r.royal = 5; r.core = 5; }
    return r;
  };

  P.flagCheck = function (s) {
    const f = s.flags;
    let changed = null;
    if (!f.queen && (s.swarms > 0 || s.rjLife > 0 || s.coronations > 0 || s.runHoney >= 3e8 || s.worldsOpen.length > 1)) { f.queen = 1; changed = 'queen'; }
    if (!f.worlds && ((s.crowns || 0) + (s.crownsSpent || 0) >= 1 || (s.essenceTotal || 0) > 0 || s.worldsOpen.length > 1)) { f.worlds = 1; changed = 'worlds'; }
    return changed;
  };
  P.unlocked = function (s, tab) {
    if (tab === 'queen') return !!s.flags.queen;
    if (tab === 'worlds') return !!s.flags.worlds;
    return (s.level || 1) >= (P.UNLOCKS[tab] || 0);
  };
  P.lockText = function (s, tab) {
    if (tab === 'queen') return BZ.t('lock_queen');
    if (tab === 'worlds') return BZ.t('lock_worlds');
    return BZ.t('locked_tab', { p: BZ.t('tab_' + tab), n: P.UNLOCKS[tab] });
  };

  P.season = (now) => Math.floor(((now || Date.now()) - P.SEASON_EPOCH) / (P.SEASON_DAYS * 86400000));
  P.seasonEnd = (now) => P.SEASON_EPOCH + (P.season(now) + 1) * P.SEASON_DAYS * 86400000;
  P.passRoll = function (s) {
    const se = P.season();
    if (s.pass.season !== se) s.pass = { season: se, xp: 0, got: {} };
  };
  P.passTier = function (s) {
    let left = s.pass.xp, t = 0;
    while (t < P.PASS_TIERS && left >= P.passNeed(t + 1)) { left -= P.passNeed(t + 1); t++; }
    return t;
  };
  P.passInTier = function (s) {
    let left = s.pass.xp, t = 0;
    while (t < P.PASS_TIERS && left >= P.passNeed(t + 1)) { left -= P.passNeed(t + 1); t++; }
    return t >= P.PASS_TIERS ? 1 : left / P.passNeed(t + 1);
  };
  P.passClaim = function (s, tier) {
    if (tier > P.passTier(s) || s.pass.got[tier]) return null;
    s.pass.got[tier] = 1;
    return P.grant(s, P.passReward(tier));
  };
  P.PASS_INF_XP = 2500;
  P.PASS_INF_REWARD = { egg: 3, boost: 'x2s' };
  P.passInfEarned = s => Math.max(0, Math.floor((s.pass.xp - P.passTotal) / P.PASS_INF_XP));
  P.passInfReady = s => Math.max(0, P.passInfEarned(s) - (s.pass.inf || 0));
  P.passInfIn = s => s.pass.xp < P.passTotal ? 0 : ((s.pass.xp - P.passTotal) % P.PASS_INF_XP) / P.PASS_INF_XP;
  P.passInfClaim = function (s) {
    const k = P.passInfReady(s);
    if (!k) return null;
    s.pass.inf = (s.pass.inf || 0) + k;
    const got = P.grant(s, { egg: P.PASS_INF_REWARD.egg * k });
    for (let i = 0; i < k; i++) E.addBoost(s, P.PASS_INF_REWARD.boost);
    got.push({ k: 'boost', v: P.PASS_INF_REWARD.boost, n: k });
    s._dirty = true;
    return got;
  };
  P.passClaimAll = function (s) {
    const out = [];
    for (let i = 1; i <= P.passTier(s); i++) { const a = P.passClaim(s, i); if (a) out.push(...a); }
    const inf = P.passInfClaim(s); if (inf) out.push(...inf);
    return out;
  };
  P.passReady = function (s) {
    if (P.passInfReady(s)) return true;
    for (let i = 1; i <= P.passTier(s); i++) if (!s.pass.got[i]) return true;
    return false;
  };

  P.week = (now) => Math.floor(((now || Date.now()) - P.SEASON_EPOCH) / (7 * 86400000));
  P.featured = () => P.FEATURED[P.week() % P.FEATURED.length];
  P.featuredEpic = () => P.FEATURED_EPIC[P.week() % P.FEATURED_EPIC.length];
  P.weekEnd = () => P.SEASON_EPOCH + (P.week() + 1) * 7 * 86400000;

  function pickRarity(rates, rnd) {
    const tot = rates.reduce((a, b) => a + b, 0);
    let x = rnd() * tot;
    for (let i = 0; i < rates.length; i++) { x -= rates[i]; if (x <= 0 && rates[i] > 0) return i; }
    return rates.length - 1;
  }
  P.legendChance = function (bn, pity) {
    const b = BZ.BANNERS[bn];
    if (pity + 1 >= b.hard) return 1;
    const base = b.rates[3] / b.rates.reduce((a, c) => a + c, 0);
    if (pity + 1 <= b.soft) return base;
    return Math.min(1, base + (pity + 1 - b.soft) * 0.06);
  };
  P.roll = function (s, bn, rnd) {
    rnd = rnd || Math.random;
    const b = BZ.BANNERS[bn];
    const ek = bn + 'Epic';
    const L = E.boostV(s, 'hatch');
    s.pity[bn] = s.pity[bn] || 0; s.pity[ek] = s.pity[ek] || 0;
    let rar;
    if (b.mythic && rnd() < b.mythic * (b.hard === 1 ? 1 : L)) rar = 4;
    else if (rnd() < Math.min(1, P.legendChance(bn, s.pity[bn]) * L)) rar = 3;
    else {
      rar = pickRarity(b.rates.slice(0, 2).concat([b.rates[2] * L]), rnd);
      if (s.pity[ek] + 1 >= b.epicEvery && rar < 2) rar = 2;
    }
    s.pity[bn] = rar === 3 ? 0 : rar === 4 ? s.pity[bn] : s.pity[bn] + 1;
    s.pity[ek] = rar >= 2 ? 0 : s.pity[ek] + 1;
    if (bn === 'core') {
      const pool = BZ.CORES.filter(x => x.r === rar);
      const id = pool[Math.floor(rnd() * pool.length)].id;
      const before = E.coreLevel(s, id);
      const isNew = !s.cores[id];
      s.cores[id] = (s.cores[id] || 0) + 1;
      if (isNew && s.coreSlots.length < P.coreSlotCount(s)) s.coreSlots.push(id);
      s._dirty = true;
      const after = E.coreLevel(s, id);
      return { id, core: true, isNew, levelUp: after > before && !isNew, level: after, r: rar };
    }
    const pool = BZ.BEES.filter(x => x.r === rar && !x.limited);
    let id;
    if (bn === 'royal' && rar === 3) {
      if (s.pity.guarantee || rnd() < 0.5) { id = P.featured(); s.pity.guarantee = false; }
      else { id = pool[Math.floor(rnd() * pool.length)].id; s.pity.guarantee = true; }
    } else if (bn === 'royal' && rar === 2 && rnd() < 0.5) {
      id = P.featuredEpic();
    } else {
      id = pool[Math.floor(rnd() * pool.length)].id;
    }
    const before = E.beeLevel(s, id);
    const isNew = !s.bees[id];
    s.bees[id] = (s.bees[id] || 0) + 1;
    s._dirty = true;
    const after = E.beeLevel(s, id);
    return { id, isNew, levelUp: after > before && !isNew, level: after, r: rar };
  };
  P.PULL_MAX = 500;
  P.pull = function (s, bn, count, free) {
    const key = BZ.BANNERS[bn].ticket;
    if (count === 'all') count = Math.min(P.PULL_MAX, s.tickets[key] || 0);
    if (!(count >= 1)) return null;
    if (!free) {
      if ((s.tickets[key] || 0) < count) return null;
      s.tickets[key] -= count;
    }
    const out = [];
    for (let i = 0; i < count; i++) out.push(P.roll(s, bn));
    return out;
  };

  P.blessCheck = function (s) {
    let n = 0;
    for (let i = 0; i < P.BLESS_AT.length; i++) {
      const key = 'h' + i;
      if (s.runHoney >= P.BLESS_AT[i] && !s.blessDone.includes(key)) { s.blessDone.push(key); n++; }
    }
    if (!n) return false;
    if (s.blessOffer) { s.blessMore = (s.blessMore || 0) + n; s.blessTotal = (s.blessTotal || 1) + n; return 'more'; }
    P.blessOffer(s);
    s.blessMore = n - 1;
    s.blessTotal = n;
    return true;
  };
  P.blessStep = s => ({ total: Math.max(1, s.blessTotal || 1), step: Math.max(1, (s.blessTotal || 1) - (s.blessMore || 0)) });
  P.blessOffer = function (s) {
    const taken = new Set((s.bless || []).map(b => b.id));
    const picks = [];
    let guard = 0;
    while (picks.length < 3 && guard++ < 200) {
      const roll = Math.random();
      const O = P.BLESS_ODDS;
      const r = roll < O[4] ? 4 : roll < O[4] + O[3] ? 3 : roll < O[4] + O[3] + O[2] ? 2 : roll < O[4] + O[3] + O[2] + O[1] ? 1 : 0;
      const pool = P.BLESSINGS.filter(b => b.r === r && !taken.has(b.id) && !picks.some(p => p.id === b.id));
      if (!pool.length) continue;
      const b = pool[Math.floor(Math.random() * pool.length)];
      const entry = { id: b.id };
      if (b.focus) {
        const owned = BZ.PRODUCERS.filter(p => (s.owned[p.id] || 0) > 0);
        const list = owned.length ? owned : BZ.PRODUCERS.slice(0, 3);
        entry.target = list[Math.floor(Math.random() * list.length)].id;
      }
      picks.push(entry);
    }
    s.blessOffer = picks;
  };
  P.blessPick = function (s, i) {
    if (!s.blessOffer || !s.blessOffer[i]) return null;
    const e = s.blessOffer[i];
    s.bless.push(e);
    s.blessOffer = null;
    if ((s.blessMore || 0) > 0) { s.blessMore--; P.blessOffer(s); }
    else { s.blessMore = 0; s.blessTotal = 0; }
    s._dirty = true;
    return e;
  };
  P.onSwarm = function (s) {
    s.bless = [];
    s.blessDone = [];
    s.blessOffer = null;
    s.blessMore = 0;
    s.blessTotal = 0;
    if (s.swarms > 0 || s.coronations > 0) { P.blessOffer(s); s.blessTotal = 1; }
  };

  P.strip = function (s) {
    const out = {};
    for (const k in s) if (k[0] !== '_' && !P.SHARED.includes(k)) out[k] = s[k];
    return out;
  };
  P.attach = function (base, shared) {
    const ns = Object.assign({}, base);
    for (const k of P.SHARED) ns[k] = shared[k];
    ns.bless = ns.bless || [];
    ns.blessDone = ns.blessDone || [];
    ns.blessOffer = ns.blessOffer || null;
    ns.runAch = ns.runAch || {};
    ns.crownsSpent = ns.crownsSpent || 0;
    ns.crownsBonus = ns.crownsBonus || 0;
    ns._dirty = true;
    return ns;
  };
  P.freshWorld = function (shared, idx) {
    const fresh = P.strip(E.newState(idx));
    fresh.world = idx;
    const ns = P.attach(fresh, shared);
    ns.luckyOn = null; ns.ticketOn = null;
    return ns;
  };
  P.travel = function (s, idx) {
    if (idx === s.world || !s.worldsOpen.includes(idx)) return null;
    const stash = P.strip(s);
    stash.lastSave = Date.now();
    stash.luckyOn = null; stash.ticketOn = null;
    s.otherWorlds[s.world] = stash;
    const target = s.otherWorlds[idx];
    delete s.otherWorlds[idx];
    let ns;
    if (target) {
      ns = P.attach(target, s);
      ns.world = idx;
      ns.luckyOn = null; ns.ticketOn = null;
      for (const p of BZ.PRODUCERS) if (ns.owned[p.id] === undefined) ns.owned[p.id] = 0;
      ns.auto = Object.assign({ upg: true, prod: true, swarm: false, swarmAt: 2 }, ns.auto || {});
    } else ns = P.freshWorld(s, idx);
    return ns;
  };
  P.worldCrowns = (s, idx) => idx === s.world ? s.crowns || 0 : ((s.otherWorlds[idx] && s.otherWorlds[idx].crowns) || 0);
  P.worldCost = (s, idx) => Math.max(1, Math.ceil(BZ.WORLDS[idx].cost * (1 - BZ.ESS_BY_ID.map.v * P.essLvl(s, 'map'))));
  P.canOpenWorld = function (s, idx) {
    const w = BZ.WORLDS[idx];
    if (!w || s.worldsOpen.includes(idx) || idx !== P.nextWorld(s)) return false;
    const prev = P.worldState(s, idx - 1);
    return !!prev && (prev.crowns || 0) >= P.worldCost(s, idx);
  };
  P.openWorld = function (s, idx) {
    if (!P.canOpenWorld(s, idx)) return false;
    const cost = P.worldCost(s, idx);
    const prev = P.worldState(s, idx - 1);
    prev.crowns -= cost;
    prev.crownsSpent = (prev.crownsSpent || 0) + cost;
    s.worldsOpen.push(idx);
    s._dirty = true;
    return true;
  };
  P.worldState = (s, idx) => idx === s.world ? s : s.otherWorlds[idx] || null;
  P.sellValue = function (s, idx) {
    const w = P.worldState(s, idx === undefined ? s.world : idx);
    if (!w) return 0;
    const earned = (w.crowns || 0) + (w.crownsSpent || 0);
    if (earned < BZ.SELL_MIN) return 0;
    const hw = BZ.WORLDS[idx === undefined ? s.world : idx].hard;
    return Math.floor(Math.pow(earned, 1.15) * ((hw && hw.ess) || 1));
  };
  P.worldInfo = function (s, idx) {
    const w = P.worldState(s, idx);
    if (!w) return s.worldsOpen.includes(idx) ? { hps: 0, crowns: 0, earned: 0, lifetime: 0, run: 0, rj: 0 } : null;
    if (idx === s.world) return { hps: E.hps(s), crowns: s.crowns || 0, earned: (s.crowns || 0) + (s.crownsSpent || 0), lifetime: s.lifetime, run: s.runHoney, rj: s.rj };
    const tmp = P.attach(w, s);
    tmp.world = idx;
    tmp.buffs = []; tmp.boosts = [];
    E.recalc(tmp);
    return { hps: tmp._c.baseHps, crowns: w.crowns || 0, earned: (w.crowns || 0) + (w.crownsSpent || 0), lifetime: w.lifetime || 0, run: w.runHoney || 0, rj: w.rj || 0 };
  };
  P.nextWorld = s => { const i = BZ.WORLDS.findIndex((w, k) => !s.worldsOpen.includes(k)); return i < 0 ? BZ.WORLDS.length : i; };
  P.resetWorld = function (s, idx) {
    if (idx === s.world) return P.freshWorld(s, s.world);
    if (!s.worldsOpen.includes(idx)) return s;
    const fresh = P.strip(E.newState(idx));
    fresh.world = idx;
    s.otherWorlds[idx] = fresh;
    return s;
  };
  P.closeWorld = function (s, idx) {
    if (!idx || !s.worldsOpen.includes(idx)) return s;
    let ns = s;
    if (idx === s.world) ns = P.travel(s, 0) || s;
    delete ns.otherWorlds[idx];
    ns.worldsOpen = ns.worldsOpen.filter(k => k !== idx);
    ns._dirty = true;
    return ns;
  };
  P.DEV_OPS = {
    openWorld: 'world', closeWorld: 'world', resetWorld: 'world', setCrowns: 'world+amt',
    addBee: 'bee+amt', removeBee: 'bee', addCore: 'core+amt', removeCore: 'core', addSkin: 'skin', removeSkin: 'skin',
    setPrime: 'amt', setLevel: 'amt', resetPity: '', resetPass: '', newQuests: '', newLq: '', clearBoosts: '', maxTrees: '', resetTrees: ''
  };
  P.applyOp = function (s, op, tg, amt) {
    amt = typeof amt === 'number' && isFinite(amt) ? amt : 0;
    const wi = +tg;
    switch (op) {
      case 'openWorld': if (BZ.WORLDS[wi] && !s.worldsOpen.includes(wi)) { s.worldsOpen.push(wi); s.worldsOpen.sort((a, b) => a - b); s.flags.worlds = 1; } return s;
      case 'closeWorld': return P.closeWorld(s, wi);
      case 'resetWorld': return P.resetWorld(s, wi);
      case 'setCrowns': { const w = P.worldState(s, wi); if (w) w.crowns = Math.max(0, Math.round(amt)); return s; }
      case 'addBee': if (BZ.BEE_BY_ID[tg]) s.bees[tg] = (s.bees[tg] || 0) + Math.max(1, Math.round(amt) || 1); return s;
      case 'removeBee': delete s.bees[tg]; return s;
      case 'addCore': if (BZ.CORE_BY_ID[tg]) s.cores[tg] = (s.cores[tg] || 0) + Math.max(1, Math.round(amt) || 1); return s;
      case 'removeCore': delete s.cores[tg]; s.coreSlots = (s.coreSlots || []).filter(id => id !== tg); return s;
      case 'addSkin': if (BZ.SKIN_BY_ID[tg]) s.skins[tg] = 1; return s;
      case 'removeSkin': if (tg !== 'meadow') { delete s.skins[tg]; if (s.skin === tg) s.skin = 'meadow'; } return s;
      case 'setPrime': s.prime = Math.max(0, Math.round(amt)); return s;
      case 'setLevel': s.level = Math.max(1, Math.round(amt)); s.xp = 0; return s;
      case 'resetPity': for (const k in s.pity) s.pity[k] = k === 'guarantee' ? false : 0; return s;
      case 'resetPass': s.pass = { season: s.pass.season, xp: 0, got: {}, inf: 0 }; return s;
      case 'newQuests': s.daily.questDay = ''; BZ.Meta.questGen(s); return s;
      case 'newLq': if (s.league) { s.league.lq = null; BZ.Meta.lqGen(s); } return s;
      case 'clearBoosts': s.boosts = []; return s;
      case 'maxTrees': BZ.ESSENCE_SHOP.forEach(x => { s.essShop[x.id] = x.max; }); return s;
      case 'resetTrees': s.essShop = {}; return s;
    }
    return s;
  };
  P.sellWorld = function (s, idx) {
    if (idx === undefined) idx = s.world;
    const gain = P.sellValue(s, idx);
    if (gain < 1) return null;
    s.ess[idx] = (s.ess[idx] || 0) + gain;
    s.essenceTotal = (s.essenceTotal || 0) + gain;
    if (idx === s.world) return { state: P.freshWorld(s, s.world), gain };
    const fresh = P.strip(E.newState(idx));
    fresh.world = idx;
    s.otherWorlds[idx] = fresh;
    return { state: s, gain };
  };

})(typeof window !== 'undefined' ? window : globalThis);
