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
  BZ.BEES.forEach(b => { BZ.BEE_BY_ID[b.id] = b; });

  P.SHARED = ['tickets', 'pity', 'bees', 'cores', 'coreSlots', 'parts', 'skins', 'skin', 'xp', 'level', 'pass', 'daily', 'quick', 'ads', 'purchases', 'essence', 'worldsOpen', 'otherWorlds', 'flags', 'seed', 'playerName', 'league', 'quests', 'ticketBees', 'created', 'danceReady', 'cloud'];

  P.XP = { buy: 1, upgrade: 4, milestone: 6, lucky: 10, quest: 50, quick: 15, swarm: 80, achievement: 8, hatch: 5, power: 5, coronation: 300, bless: 10, ticket: 6 };
  P.xpFor = L => Math.round(40 * Math.pow(L, 1.7));
  P.UNLOCKS = { daily: 2, bees: 3, workshop: 5, pass: 6 };

  P.PASS_TIERS = 30;
  P.PASS_XP = 300;
  P.SEASON_DAYS = 28;
  P.SEASON_EPOCH = Date.UTC(2026, 0, 5);
  P.passReward = function (tier) {
    if (tier === 30) return { bee: 'sunflare' };
    if (tier === 20) return { skin: 'sunflower' };
    if (tier % 10 === 0) return { royal: 2 };
    if (tier % 5 === 0) return { core: 2 };
    if (tier % 3 === 0) return { part: 1 };
    if (tier % 2 === 0) return { egg: 2 };
    return tier % 4 === 1 ? { boost: 'x2' } : { egg: 1 };
  };

  P.FEATURED = ['phoenix', 'aurora', 'monarch', 'crystal'];
  P.FEATURED_EPIC = ['emerald', 'cuckoo', 'frost', 'ruby'];

  P.BLESSINGS = [
    { id: 'bloom', r: 0, honey: 0.4 },
    { id: 'quick', r: 0, luckyFreq: 0.2 },
    { id: 'paws', r: 0, tap: 1 },
    { id: 'thrift', r: 0, cost: 0.08 },
    { id: 'elixir', r: 0, luckyDur: 0.25 },
    { id: 'focus', r: 1, focus: 4 },
    { id: 'jelly', r: 1, rj: 0.15 },
    { id: 'rhythm', r: 1, combo: 0.5 },
    { id: 'nectar', r: 1, honey: 0.8 },
    { id: 'ticket', r: 1, ticketFreq: 0.5 },
    { id: 'crown', r: 2, honey: 1.5 },
    { id: 'golden', r: 2, luckyFreq: 0.5 },
    { id: 'royal', r: 2, rj: 0.3 }
  ];
  P.BLESS_BY_ID = {};
  P.BLESSINGS.forEach(b => { P.BLESS_BY_ID[b.id] = b; });
  P.BLESS_AT = [1e5, 1e9, 1e13, 1e17];

  P.AD_CAPS = { boost: 6, offline: 3, ticket: 3, reroll: 3 };
  P.NOADS_PRICE = 1.99;

  P.ensure = function (s) {
    s.tickets = Object.assign({ egg: 0, royal: 0, core: 0 }, s.tickets || {});
    if (s.gems) { s.tickets.egg += Math.floor(s.gems / 25); }
    if (s.amber) { s.tickets.royal += Math.floor(s.amber / 120); }
    delete s.gems; delete s.amber; delete s.vipPts; delete s.perm; delete s.deals; delete s.vipChest; delete s.subUntil; delete s.subClaim; delete s.scouts; delete s.rushData; delete s.mode;
    s.pity = Object.assign({ std: 0, stdEpic: 0, royal: 0, royalEpic: 0, core: 0, coreEpic: 0, guarantee: false }, s.pity || {});
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
    s.purchases = { noads: !!(s.purchases && s.purchases.noads) };
    s.essence = s.essence || 0;
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

  P.essPerk = (s, id) => { const p = BZ.ESSENCE_PERKS.find(x => x.id === id); return !!p && (s.essence || 0) >= p.at; };
  P.adsFree = s => !!(s.purchases && s.purchases.noads);
  P.coreSlotCount = s => 2 + ((s.level || 1) >= 20 ? 1 : 0) + (P.essPerk(s, 'slot') ? 1 : 0);
  P.ownedSkins = s => BZ.SKINS.filter(x => !x.world && x.id !== 'meadow' && s.skins[x.id]).length;

  P.mods = function (s) {
    const m = { honey: 1, luckyFreq: 1, luckyDur: 1, tap: 1, cost: 1, rj: 1, combo: 0, offlineH: 0, offline: 1, ticketFreq: 1, prodX: {} };
    m.honey *= 1 + 0.01 * Math.max(0, (s.level || 1) - 1);
    const es = s.essence || 0;
    m.honey *= 1 + BZ.ESSENCE_BONUS * es;
    m.rj *= 1 + 0.03 * es;
    if (P.essPerk(s, 'lucky')) m.luckyFreq *= 1.2;
    const w = E.world(s).mods;
    if (w.honey) m.honey *= w.honey;
    if (w.luckyFreq) m.luckyFreq *= w.luckyFreq;
    if (w.luckyDur) m.luckyDur *= w.luckyDur;
    if (w.tap) m.tap *= w.tap;
    if (w.rj) m.rj *= w.rj;
    if (w.offline) m.offline *= w.offline;
    if (w.offlineH) m.offlineH += w.offlineH;
    if (s.skins) {
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
    }
    return m;
  };

  P.coreStats = function (s) {
    const out = { honey: 0, tap: 0, cost: 0, luckyFreq: 0, luckyDur: 0, lucky: 0, offlineH: 0, ticketFreq: 0, rj: 0, combo: 0 };
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
    const base = (P.XP[kind] || 0) * (n || 1);
    if (!base) return [];
    s.xp += base;
    P.passRoll(s);
    s.pass.xp = Math.min(P.PASS_TIERS * P.PASS_XP, s.pass.xp + base);
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
    const r = { egg: 1 + Math.floor(L / 10) };
    if (L % 3 === 0) r.core = 1;
    if (L % 4 === 0) r.part = 1;
    if (L % 5 === 0) r.royal = 1;
    return r;
  };

  P.flagCheck = function (s) {
    const f = s.flags;
    let changed = null;
    if (!f.queen && (s.swarms > 0 || s.rjLife > 0 || s.coronations > 0 || s.runHoney >= 3e8 || s.worldsOpen.length > 1)) { f.queen = 1; changed = 'queen'; }
    if (!f.worlds && ((s.crowns || 0) + (s.crownsSpent || 0) >= 1 || s.essence > 0 || s.worldsOpen.length > 1)) { f.worlds = 1; changed = 'worlds'; }
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
  P.passTier = s => Math.min(P.PASS_TIERS, Math.floor(s.pass.xp / P.PASS_XP));
  P.passClaim = function (s, tier) {
    if (tier > P.passTier(s) || s.pass.got[tier]) return null;
    s.pass.got[tier] = 1;
    return P.grant(s, P.passReward(tier));
  };
  P.passClaimAll = function (s) {
    const out = [];
    for (let i = 1; i <= P.passTier(s); i++) { const a = P.passClaim(s, i); if (a) out.push(...a); }
    return out;
  };
  P.passReady = function (s) {
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
    let rar;
    if (rnd() < P.legendChance(bn, s.pity[bn])) rar = 3;
    else {
      rar = pickRarity(b.rates.slice(0, 3), rnd);
      if (s.pity[ek] + 1 >= b.epicEvery && rar < 2) rar = 2;
    }
    s.pity[bn] = rar === 3 ? 0 : s.pity[bn] + 1;
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
  P.pull = function (s, bn, count, free) {
    const key = BZ.BANNERS[bn].ticket;
    if (!free) {
      if ((s.tickets[key] || 0) < count) return null;
      s.tickets[key] -= count;
    }
    const out = [];
    for (let i = 0; i < count; i++) out.push(P.roll(s, bn));
    return out;
  };

  P.blessCheck = function (s) {
    if (s.blessOffer) return false;
    for (let i = 0; i < P.BLESS_AT.length; i++) {
      const key = 'h' + i;
      if (s.runHoney >= P.BLESS_AT[i] && !s.blessDone.includes(key)) {
        s.blessDone.push(key);
        P.blessOffer(s);
        return true;
      }
    }
    return false;
  };
  P.blessOffer = function (s) {
    const taken = new Set((s.bless || []).map(b => b.id));
    const picks = [];
    let guard = 0;
    while (picks.length < 3 && guard++ < 200) {
      const roll = Math.random();
      const r = roll < 0.12 ? 2 : roll < 0.45 ? 1 : 0;
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
    s._dirty = true;
    return e;
  };
  P.onSwarm = function (s) {
    s.bless = [];
    s.blessDone = [];
    s.blessOffer = null;
    if (s.swarms > 0 || s.coronations > 0) P.blessOffer(s);
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
  P.canOpenWorld = function (s, idx) {
    const w = BZ.WORLDS[idx];
    return !!w && !s.worldsOpen.includes(idx) && idx === s.worldsOpen.length && (s.crowns || 0) >= w.cost;
  };
  P.openWorld = function (s, idx) {
    if (!P.canOpenWorld(s, idx)) return false;
    const w = BZ.WORLDS[idx];
    s.crowns -= w.cost;
    s.crownsSpent = (s.crownsSpent || 0) + w.cost;
    s.worldsOpen.push(idx);
    s._dirty = true;
    return true;
  };
  P.sellValue = function (s) {
    const earned = (s.crowns || 0) + (s.crownsSpent || 0);
    if (earned < BZ.SELL_MIN) return 0;
    return Math.floor(Math.pow(earned, 1.15) * (1 + 0.25 * (s.world || 0)));
  };
  P.sellWorld = function (s) {
    const gain = P.sellValue(s);
    if (gain < 1) return null;
    s.essence = (s.essence || 0) + gain;
    const ns = P.freshWorld(s, s.world);
    return { state: ns, gain };
  };

  P.Billing = {
    available: () => !!(root.BZ_BILLING && root.BZ_BILLING.buy),
    buy(id) { return root.BZ_BILLING.buy(id); }
  };
  P.priceText = function (price) {
    return BZ.lang === 'fr' ? price.toFixed(2).replace('.', ',') + ' €' : '€' + price.toFixed(2);
  };
})(typeof window !== 'undefined' ? window : globalThis);
