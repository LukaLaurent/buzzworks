(function (root) {
  const BZ = root.BZ = root.BZ || {};
  const P = BZ.PRODUCERS;

  const E = BZ.E = {};
  const listeners = [];
  E.on = fn => listeners.push(fn);
  E.emit = (s, type, data) => { if (E.mute) return; for (const fn of listeners) fn(s, type, data); };

  E.rng = function (seed) {
    let a = seed >>> 0;
    return function () {
      a = (a + 0x6D2B79F5) >>> 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  };

  E.newState = function (world) {
    const s = {
      v: 2, world: world || 0,
      honey: 0, runHoney: 0, lifetime: 0,
      owned: {}, upg: {}, ach: {}, runAch: {},
      taps: 0, runTaps: 0, lucky: 0, runLucky: 0, swarms: 0, rj: 0, rjEarned: 0, runUpg: 0,
      queen: {}, bees: {}, crowns: 0, crownsSpent: 0, crownsBonus: 0, rjLife: 0, coronations: 0,
      tickets: { egg: 0, royal: 0, core: 0, legend: 0, mystic: 0 },
      buffs: [], boosts: [],
      combo: 0, comboIdle: 9, maxCombo: 0,
      luckyT: 40, luckyOn: null, ticketT: 70, ticketOn: null, ticketBees: 0,
      played: 0, runTime: 0, bestHps: 0, upgCount: 0, milestones: 0, quests: 0,
      auto: { upg: true, prod: true, swarm: false, swarmAt: 2 },
      skin: 'meadow', skins: { meadow: 1 },
      danceReady: 0,
      created: Date.now(), lastSave: Date.now()
    };
    P.forEach(p => { s.owned[p.id] = 0; });
    s._dirty = true;
    return s;
  };

  E.world = s => (s.battle && BZ.BATTLE_WORLD) || BZ.WORLDS[s.world || 0] || BZ.WORLDS[0];
  E.growth = s => E.world(s).mods.growth || BZ.COST_GROWTH;
  E.qlvl = (s, id) => (s.queen && s.queen[id]) || 0;

  E.milestoneCount = function (n) {
    let c = 0;
    for (const m of BZ.MILESTONES) { if (n >= m) c++; else break; }
    return c;
  };
  E.nextMilestone = function (n) {
    for (const m of BZ.MILESTONES) if (n < m) return m;
    return n + 100;
  };
  E.prevMilestone = function (n) {
    let p = 0;
    for (const m of BZ.MILESTONES) { if (n >= m) p = m; else break; }
    return p;
  };
  E.colonyLevel = function (s) {
    let min = Infinity;
    for (const p of P) min = Math.min(min, s.owned[p.id] || 0);
    let c = 0;
    for (const m of BZ.COLONY_MILESTONES) { if (min >= m) c++; else break; }
    return c;
  };
  E.ownTotal = function (s) {
    let t = 0;
    for (const p of P) t += s.owned[p.id] || 0;
    return t;
  };

  E.colonyMult = s => BZ.COLONY_MULT + (BZ.P && BZ.P.essLvl ? BZ.ESS_BY_ID.colony.v * BZ.P.essLvl(s, 'colony') : 0);
  E.achCount = s => Object.keys(s.ach).length;
  E.beeLevel = function (s, id) {
    const c = (s.bees && s.bees[id]) || 0;
    let l = 0;
    for (const x of BZ.BEE_LEVELS) { if (c >= x) l++; else break; }
    return l;
  };
  E.coreLevel = function (s, id) {
    const c = (s.cores && s.cores[id]) || 0;
    let l = 0;
    for (const x of BZ.BEE_LEVELS) { if (c >= x) l++; else break; }
    return l;
  };
  E.beeBonus = function (s) {
    const out = { honey: 0, tap: 0, luckyFreq: 0, luckyDur: 0, cost: 0, offline: 0, rj: 0, combo: 0 };
    if (!s.bees || s.battle) return out;
    for (const b of BZ.BEES) {
      const l = E.beeLevel(s, b.id);
      if (l) out[b.kind] += b.v * l;
    }
    out.cost = Math.min(0.5, out.cost);
    return out;
  };
  E.rjMult = s => 1 + BZ.RJ_BONUS * Math.pow(s.rjEarned, BZ.RJ_CURVE);
  E.perk = (s, id) => { const p = BZ.CROWN_PERKS.find(x => x.id === id); return !!p && (s.crowns || 0) >= p.at; };
  E.crownMult = s => 1 + BZ.CROWN_BONUS * Math.sqrt(s.crowns || 0);
  E.crownRJ = s => 1 + BZ.CROWN_RJ * Math.sqrt(s.crowns || 0);
  E.crownsEarned = s => (s.crowns || 0) + (s.crownsSpent || 0) - (s.crownsBonus || 0);
  E.hard = s => E.world(s).hard || {};
  E.crownDiv = s => BZ.CROWN_DIVISOR * (E.hard(s).crown || 1);
  E.pendingCrowns = function (s) {
    const total = Math.floor(Math.sqrt(((s.rjLife || 0) + E.pendingRJ(s)) / E.crownDiv(s)));
    return Math.max(0, total - E.crownsEarned(s));
  };
  E.crownNext = function (s) {
    const c = E.crownsEarned(s) + E.pendingCrowns(s) + 1;
    return c * c * E.crownDiv(s);
  };
  E.mods = s => (BZ.P && BZ.P.mods) ? BZ.P.mods(s) : null;

  E.recalc = function (s) {
    const c = s._c = s._c || {};
    const prodMult = {};
    P.forEach(p => { prodMult[p.id] = Math.pow(2, E.milestoneCount(s.owned[p.id] || 0)); });
    let tapFlat = 0, tapMult = 1, tapPct = 0, luckyFreq = 1, luckyDur = 1, glob = 1;
    for (const id in s.upg) {
      const u = BZ.UPGRADE_BY_ID[id];
      if (!u) continue;
      if (u.kind === 'prod') prodMult[u.target] *= u.mult;
      else if (u.kind === 'synergy') prodMult[u.target] *= 1 + u.pct * (s.owned[u.source] || 0);
      else if (u.kind === 'tap') { tapFlat += u.flat; tapMult *= u.tmult; tapPct += u.pct; }
      else if (u.kind === 'lucky') { luckyFreq *= u.freq; luckyDur *= u.dur; }
      else if (u.kind === 'global') glob *= u.mult;
    }
    let g = glob;
    g *= E.rjMult(s);
    g *= 1 + BZ.ACH_BONUS * E.achCount(s);
    g *= 1 + 0.25 * E.qlvl(s, 'decree') * (E.perk(s, 'decree') ? 2 : 1);
    g *= E.crownMult(s);
    const bb = E.beeBonus(s);
    c.bees = bb;
    g *= 1 + bb.honey;
    luckyFreq *= 1 + bb.luckyFreq;
    luckyDur *= 1 + bb.luckyDur;
    tapMult *= 1 + bb.tap;
    g *= Math.pow(E.colonyMult(s), E.colonyLevel(s));
    const pm = E.mods(s);
    c.mods = pm;
    let ticketFreq = 1;
    if (pm) {
      g *= pm.honey;
      luckyFreq *= pm.luckyFreq;
      luckyDur *= pm.luckyDur;
      tapMult *= pm.tap;
      ticketFreq *= pm.ticketFreq;
      for (const pid in pm.prodX) prodMult[pid] *= pm.prodX[pid];
    }
    luckyFreq *= (1 + 0.08 * E.qlvl(s, 'charm')) * (E.perk(s, 'lucky') ? 1.25 : 1);
    luckyDur *= 1 + 0.1 * E.qlvl(s, 'elixir');
    tapMult *= 1 + 0.5 * E.qlvl(s, 'touch');
    c.global = g;
    c.rate = {};
    let base = 0;
    for (const p of P) {
      const r = p.prod * (s.owned[p.id] || 0) * prodMult[p.id] * g;
      c.rate[p.id] = r;
      base += r;
    }
    c.prodMult = prodMult;
    c.baseHps = base;
    c.tapFlat = tapFlat; c.tapMult = tapMult; c.tapPct = tapPct;
    c.luckyFreq = luckyFreq; c.luckyDur = luckyDur; c.ticketFreq = ticketFreq;
    c.comboMax = 2 + 0.5 * E.qlvl(s, 'combo') + bb.combo + (pm ? pm.combo : 0);
    c.thrift = Math.pow(0.97, E.qlvl(s, 'thrift')) * (1 - bb.cost) * (pm ? pm.cost : 1);
    c.growth = E.growth(s);
    s._dirty = false;
    return c;
  };
  E.cache = s => (s._dirty || !s._c) ? E.recalc(s) : s._c;

  E.tempMult = function (s) {
    let m = 1;
    for (const b of s.buffs) if (b.mult) m *= b.mult;
    for (const b of s.boosts) if (b.mult) m *= b.mult;
    return m;
  };
  E.boostV = function (s, kind) {
    let m = 1;
    for (const b of s.boosts || []) { const d = BZ.BOOST_BY_ID[b.id]; if (d && d.kind === kind) m *= d.v; }
    return m;
  };
  E.tapBuff = function (s) {
    let m = 1;
    for (const b of s.buffs) if (b.tap) m *= b.tap;
    return m;
  };
  E.hps = s => E.cache(s).baseHps * E.tempMult(s);
  E.comboMult = function (s) {
    const c = E.cache(s);
    return 1 + Math.min(s.combo, 100) / 100 * (c.comboMax - 1);
  };
  E.tapValue = function (s) {
    const c = E.cache(s);
    const base = (1 + c.tapFlat) * c.tapMult + c.tapPct * E.hps(s);
    return base * E.comboMult(s) * E.tapBuff(s);
  };

  E.unitCost = function (s, pid) {
    const p = BZ.PRODUCERS.find(x => x.id === pid);
    const c = E.cache(s);
    return p.cost * Math.pow(c.growth, s.owned[pid] || 0) * c.thrift;
  };
  E.cost = function (s, pid, n) {
    const u = E.unitCost(s, pid);
    const g = E.cache(s).growth;
    return u * (Math.pow(g, n) - 1) / (g - 1);
  };
  E.maxAffordable = function (s, pid) {
    const u = E.unitCost(s, pid);
    const g = E.cache(s).growth;
    if (s.honey < u) return 0;
    return Math.max(0, Math.floor(Math.log(s.honey * (g - 1) / u + 1) / Math.log(g)));
  };
  E.buyAmount = function (s, pid, mode) {
    if (mode === 'max') return Math.max(1, E.maxAffordable(s, pid));
    if (mode === 'next') { const o = s.owned[pid] || 0; return E.nextMilestone(o) - o; }
    return mode;
  };

  E.buy = function (s, pid, n) {
    if (n <= 0) return false;
    const cost = E.cost(s, pid, n);
    if (cost > s.honey * (1 + 1e-9)) return false;
    s.honey = Math.max(0, s.honey - cost);
    const before = s.owned[pid] || 0;
    const msBefore = E.milestoneCount(before);
    const colBefore = E.colonyLevel(s);
    s.owned[pid] = before + n;
    const msAfter = E.milestoneCount(s.owned[pid]);
    s._dirty = true;
    E.emit(s, 'buy', { pid, n });
    if (msAfter > msBefore) {
      s.milestones += msAfter - msBefore;
      E.emit(s, 'milestone', { pid, count: msAfter - msBefore, at: BZ.MILESTONES[msAfter - 1] });
    }
    const colAfter = E.colonyLevel(s);
    if (colAfter > colBefore) E.emit(s, 'colony', { level: colAfter });
    return true;
  };

  E.upgradeUnlocked = function (s, u) {
    const r = u.req;
    if (r.own && (s.owned[r.own[0]] || 0) < r.own[1]) return false;
    if (r.total && s.runHoney < r.total) return false;
    if (r.lucky && s.lucky < r.lucky) return false;
    if (r.taps && s.taps < r.taps) return false;
    if (r.ownAny && E.ownTotal(s) < r.ownAny) return false;
    return true;
  };
  E.availableUpgrades = function (s) {
    const out = [];
    for (const u of BZ.UPGRADES) if (!s.upg[u.id] && E.upgradeUnlocked(s, u)) out.push(u);
    return out;
  };
  E.buyUpgrade = function (s, id) {
    const u = BZ.UPGRADE_BY_ID[id];
    if (!u || s.upg[id] || !E.upgradeUnlocked(s, u) || s.honey < u.cost) return false;
    s.honey -= u.cost;
    s.upg[id] = 1;
    s.upgCount++;
    s.runUpg = (s.runUpg || 0) + 1;
    s._dirty = true;
    E.emit(s, 'upgrade', { id });
    return true;
  };

  E.gainHoney = function (s, amt) {
    if (!(amt > 0)) return;
    const before = s.runHoney;
    s.honey = Math.min(1e300, s.honey + amt);
    s.runHoney = Math.min(1e300, s.runHoney + amt);
    s.lifetime = Math.min(1e300, s.lifetime + amt);
    const pb = before > 0 ? Math.floor(Math.log10(before)) : -1;
    const pa = Math.floor(Math.log10(s.runHoney));
    if (pa > pb && pa >= 2) E.emit(s, 'power', { power: pa, count: pa - Math.max(pb, 1) });
  };

  E.addTickets = function (s, r) {
    if (!r) return;
    s.tickets = s.tickets || { egg: 0, royal: 0, core: 0 };
    for (const k of ['egg', 'royal', 'core', 'legend', 'mystic']) if (r[k]) s.tickets[k] = (s.tickets[k] || 0) + r[k];
  };

  E.tap = function (s) {
    s.combo = Math.min(100, s.combo + 1);
    s.comboIdle = 0;
    if (s.combo > s.maxCombo) s.maxCombo = s.combo;
    const v = E.tapValue(s);
    E.gainHoney(s, v);
    s.taps++; s.runTaps++;
    E.emit(s, 'tap', { value: v, combo: s.combo });
    return v;
  };

  E.luckyInterval = function (s, r) {
    const c = E.cache(s);
    const rnd = r || Math.random;
    if (s.boosts.some(b => b.id === 'luckyswarm')) return 8;
    return (80 + rnd() * 100) / c.luckyFreq;
  };
  E.ticketInterval = function (s, r) {
    const rnd = r || Math.random;
    return (200 + rnd() * 140) / E.cache(s).ticketFreq;
  };

  E.pickLucky = function (s, r) {
    const rnd = r || Math.random;
    const list = BZ.LUCKY_EFFECTS;
    const tot = list.reduce((a, e) => a + e.w, 0);
    let x = rnd() * tot;
    for (const e of list) { x -= e.w; if (x <= 0) return e; }
    return list[0];
  };

  E.catchLucky = function (s, effectId, r) {
    const c = E.cache(s);
    const eff = effectId ? BZ.LUCKY_EFFECTS.find(e => e.id === effectId) : E.pickLucky(s, r);
    s.luckyOn = null;
    s.lucky++; s.runLucky++;
    const out = { id: eff.id };
    if (eff.id === 'rush') {
      s.buffs = s.buffs.filter(b => b.id !== 'rush');
      s.buffs.push({ id: 'rush', mult: eff.mult, t: eff.dur * c.luckyDur, max: eff.dur * c.luckyDur });
    } else if (eff.id === 'frenzy') {
      s.buffs = s.buffs.filter(b => b.id !== 'frenzy');
      s.buffs.push({ id: 'frenzy', tap: eff.mult, t: eff.dur * c.luckyDur, max: eff.dur * c.luckyDur });
    } else if (eff.id === 'harvest') {
      const amt = Math.max(13, c.baseHps * 60 * eff.minutes * c.luckyDur);
      E.gainHoney(s, amt);
      out.amount = amt;
    } else if (eff.id === 'storm') {
      out.drops = eff.drops;
      out.dur = eff.dur * c.luckyDur;
    } else if (eff.id === 'ticket') {
      E.addTickets(s, { egg: eff.egg });
      out.amount = eff.egg;
    }
    s._dirty = true;
    E.emit(s, 'lucky', out);
    return out;
  };

  E.catchTicket = function (s, r) {
    const rnd = r || Math.random;
    s.ticketOn = null;
    s.ticketBees = (s.ticketBees || 0) + 1;
    const x = rnd();
    const out = x < 0.06 ? { core: 1 } : x < 0.22 ? { egg: 2 } : { egg: 1 };
    E.addTickets(s, out);
    E.emit(s, 'ticketBee', out);
    return out;
  };

  E.stormDrop = function (s) {
    const c = E.cache(s);
    const eff = BZ.LUCKY_EFFECTS.find(e => e.id === 'storm');
    const amt = Math.max(5, c.baseHps * 60 * eff.minutes);
    E.gainHoney(s, amt);
    return amt;
  };

  E.pendingRJ = function (s) {
    if (s.runHoney < BZ.RJ_MIN) return 0;
    const w = E.rjWisdom(s);
    return Math.floor(BZ.RJ_SCALE * Math.pow(s.runHoney / BZ.RJ_DIVISOR, BZ.RJ_POWER) * w * (E.hard(s).rj || 1));
  };
  E.rjWisdom = function (s) {
    const pm = E.mods(s);
    return (1 + 0.1 * E.qlvl(s, 'wisdom')) * (1 + E.beeBonus(s).rj) * E.crownRJ(s) * (pm ? pm.rj : 1);
  };
  E.headstart = function (s) {
    const l = E.qlvl(s, 'headstart');
    return l > 0 ? 50 * Math.pow(25, l) : 0;
  };
  E.swarm = function (s) {
    const gain = E.pendingRJ(s);
    if (gain < 1) return 0;
    s.rj += gain;
    s.rjEarned += gain;
    s.rjLife = (s.rjLife || 0) + gain;
    s.swarms++;
    E.resetRun(s);
    E.emit(s, 'swarm', { gain });
    return gain;
  };
  E.resetRun = function (s) {
    s.honey = 0;
    s.runHoney = 0;
    s.runTaps = 0;
    s.runLucky = 0;
    s.runTime = 0;
    s.runUpg = 0;
    s.runAch = {};
    const kept = {};
    if (E.perk(s, 'keep')) for (const id in s.upg) { const u = BZ.UPGRADE_BY_ID[id]; if (u && (u.kind === 'tap' || u.kind === 'lucky')) kept[id] = 1; }
    s.upg = kept;
    P.forEach(p => { s.owned[p.id] = 0; });
    if (E.perk(s, 'start')) P.slice(0, 5).forEach(p => { s.owned[p.id] = 25; });
    const st = BZ.P && BZ.P.essLvl ? BZ.P.essLvl(s, 'start') : 0;
    if (st) { const n = BZ.ESS_BY_ID.start.v[st - 1]; P.slice(0, 10).forEach(p => { s.owned[p.id] = Math.max(s.owned[p.id], n); }); }
    s.buffs = [];
    s.combo = 0;
    s._dirty = true;
    const hs = E.headstart(s);
    if (hs > 0) s.honey = hs;
    if (BZ.P && BZ.P.onSwarm) BZ.P.onSwarm(s);
  };
  E.coronate = function (s) {
    let gain = E.pendingCrowns(s);
    if (gain < 1) return 0;
    const pend = E.pendingRJ(s);
    s.rjLife = (s.rjLife || 0) + pend;
    const kiln = BZ.P && BZ.P.essLvl ? BZ.P.essLvl(s, 'kiln') : 0;
    if (kiln) gain = Math.floor(gain * (1 + BZ.ESS_BY_ID.kiln.v * kiln));
    const extra = BZ.P && BZ.P.essLvl ? BZ.P.essLvl(s, 'crown') : 0;
    if (extra) { gain += extra; s.crownsBonus = (s.crownsBonus || 0) + extra; }
    s.crowns = (s.crowns || 0) + gain;
    s.coronations = (s.coronations || 0) + 1;
    s.queen = {};
    s.rj = 0;
    s.rjEarned = 0;
    s._dirty = true;
    if (E.perk(s, 'egg')) E.addTickets(s, { royal: 3 });
    E.resetRun(s);
    E.emit(s, 'coronation', { gain });
    return gain;
  };

  E.queenNeed = function (s, id) {
    const q = BZ.QUEEN_BY_ID[id];
    if (!q.need) return 0;
    return q.need[Math.min(q.need.length - 1, E.qlvl(s, id))];
  };
  E.queenLocked = (s, id) => !!BZ.QUEEN_BY_ID[id].need && !E.queenMaxed(s, id) && (s.crowns || 0) + (s.crownsSpent || 0) < E.queenNeed(s, id);
  E.queenCost = function (s, id) {
    const q = BZ.QUEEN_BY_ID[id];
    const w = BZ.P && BZ.P.essLvl ? 1 - BZ.ESS_BY_ID.wisdom.v * BZ.P.essLvl(s, 'wisdom') : 1;
    return Math.ceil(q.base * Math.pow(q.growth, E.qlvl(s, id)) * w);
  };
  E.queenMaxed = function (s, id) {
    const q = BZ.QUEEN_BY_ID[id];
    return q.max > 0 && E.qlvl(s, id) >= q.max;
  };
  E.buyQueen = function (s, id) {
    if (E.queenMaxed(s, id) || E.queenLocked(s, id)) return false;
    const c = E.queenCost(s, id);
    if (s.rj < c) return false;
    s.rj -= c;
    s.queen[id] = E.qlvl(s, id) + 1;
    s._dirty = true;
    E.emit(s, 'queen', { id });
    return true;
  };

  E.offlineCap = function (s) {
    const pm = E.mods(s);
    return (2 + E.qlvl(s, 'nap') + (E.perk(s, 'nap') ? 4 : 0) + (pm ? pm.offlineH : 0)) * 3600;
  };

  E.addBoost = function (s, id, durOverride) {
    const b = BZ.BOOST_BY_ID[id];
    if (!b) return;
    const dur = durOverride || b.dur;
    const ex = s.boosts.find(x => x.id === id);
    if (ex) { ex.t += dur; ex.max = Math.max(ex.max, ex.t); }
    else s.boosts.push({ id, mult: b.mult || 0, t: dur, max: dur });
    if (id === 'luckyswarm') s.luckyT = Math.min(s.luckyT, 2);
    s._dirty = true;
    E.emit(s, 'boost', { id });
  };

  E.bestBuy = function (s) {
    const c = E.cache(s);
    let best = null, bestScore = Infinity;
    for (const p of P) {
      const cost = E.unitCost(s, p.id);
      const o = s.owned[p.id] || 0;
      const gain = p.prod * c.prodMult[p.id] * c.global * ((E.milestoneCount(o + 1) > E.milestoneCount(o)) ? (o + 1) * 2 - o : 1);
      const score = cost / Math.max(gain, 1e-300);
      if (score < bestScore) { bestScore = score; best = p.id; }
    }
    return best;
  };

  E.autoStep = function (s) {
    const lvl = E.qlvl(s, 'mind');
    if (!lvl) return;
    if (lvl >= 1 && s.auto.upg) {
      for (const u of E.availableUpgrades(s)) {
        if (u.cost <= s.honey) E.buyUpgrade(s, u.id); else break;
      }
    }
    if (lvl >= 2 && s.auto.prod) {
      const mode = s.auto.prodMode || 'best';
      for (let i = 0; i < 25; i++) {
        const id = E.bestBuy(s);
        if (!id) break;
        if (mode === 'best') { if (E.unitCost(s, id) > s.honey) break; E.buy(s, id, 1); continue; }
        const n = E.buyAmount(s, id, mode);
        if (n < 1 || E.cost(s, id, n) > s.honey) break;
        E.buy(s, id, n);
      }
    }
    if (lvl >= 3 && s.auto.swarm) {
      const pend = E.pendingRJ(s);
      if (pend >= 1 && pend >= Math.max(1, s.rjEarned) * (s.auto.swarmAt - 1)) E.swarm(s);
    }
  };

  E.tick = function (s, dt, opts) {
    opts = opts || {};
    const c = E.cache(s);
    const hps = c.baseHps * E.tempMult(s);
    E.gainHoney(s, hps * dt);
    s.played += dt;
    s.runTime += dt;
    let changed = false;
    for (const b of s.buffs) { b.t -= dt; if (b.t <= 0) changed = true; }
    for (const b of s.boosts) { b.t -= dt; if (b.t <= 0) changed = true; }
    if (changed) {
      const ended = s.buffs.filter(b => b.t <= 0).concat(s.boosts.filter(b => b.t <= 0));
      s.buffs = s.buffs.filter(b => b.t > 0);
      s.boosts = s.boosts.filter(b => b.t > 0);
      s._dirty = true;
      ended.forEach(b => E.emit(s, 'buffEnd', { id: b.id }));
    }
    s.comboIdle += dt;
    if (s.comboIdle > 0.8 && s.combo > 0) s.combo = Math.max(0, s.combo - dt * 40);
    if (hps > s.bestHps) s.bestHps = hps;
    if (!opts.offline) {
      if (s.luckyOn) {
        s.luckyOn.t -= dt;
        if (s.luckyOn.t <= 0) { s.luckyOn = null; E.emit(s, 'luckyGone'); }
      } else {
        s.luckyT -= dt;
        if (s.luckyT <= 0) {
          const life = s.boosts.some(b => b.id === 'luckyswarm') ? 7 : 12;
          s.luckyOn = { t: life, max: life, red: !s.battle && (opts.rng || Math.random)() < (BZ.P && BZ.P.rubyChance ? BZ.P.rubyChance(s) : BZ.RUBY_CHANCE) };
          s.luckyT = E.luckyInterval(s, opts.rng);
          E.emit(s, 'luckySpawn', s.luckyOn);
        }
      }
      if (s.ticketOn) {
        s.ticketOn.t -= dt;
        if (s.ticketOn.t <= 0) { s.ticketOn = null; E.emit(s, 'ticketGone'); }
      } else {
        s.ticketT = (s.ticketT === undefined ? 60 : s.ticketT) - dt;
        if (s.ticketT <= 0 && !s.battle) {
          s.ticketOn = { t: 10, max: 10 };
          s.ticketT = E.ticketInterval(s, opts.rng);
          E.emit(s, 'ticketSpawn', s.ticketOn);
        }
      }
    }
    s._autoAcc = (s._autoAcc || 0) + dt;
    if (s._autoAcc >= 0.5) { s._autoAcc = 0; E.autoStep(s); }
  };

  E.offline = function (s, secs) {
    const cap = E.offlineCap(s);
    const t = Math.min(secs, cap);
    const before = s.honey;
    const lifeBefore = s.lifetime;
    let left = t;
    const step = t > 3600 ? 30 : 10;
    while (left > 0) {
      const d = Math.min(step, left);
      E.tick(s, d, { offline: true });
      left -= d;
    }
    const pm = E.mods(s);
    const extra = (s.lifetime - lifeBefore) * (E.beeBonus(s).offline + (pm ? pm.offline - 1 : 0));
    if (extra > 0) E.gainHoney(s, extra);
    return { secs: t, capped: secs > cap, earned: s.lifetime - lifeBefore, net: s.honey - before };
  };

  E.ACH_TESTS = {
    lifetime: (s, a) => s.lifetime >= a.value,
    hps: (s, a) => E.cache(s).baseHps >= a.value,
    taps: (s, a) => s.taps >= a.value,
    lucky: (s, a) => s.lucky >= a.value,
    swarms: (s, a) => s.swarms >= a.value,
    rj: (s, a) => s.rjEarned >= a.value,
    upgrades: (s, a) => s.upgCount >= a.value,
    combo: (s, a) => s.maxCombo >= a.value,
    quests: (s, a) => (s.quests || 0) >= a.value,
    streak: (s, a) => ((s.daily && s.daily.bestStreak) || 0) >= a.value,
    colony: (s, a) => E.colonyLevel(s) >= a.value,
    crowns: (s, a) => E.crownsEarned(s) >= a.value,
    level: (s, a) => (s.level || 1) >= a.value,
    bees: (s, a) => BZ.BEES.filter(b => s.bees && s.bees[b.id]).length >= a.value,
    beelvl: (s, a) => BZ.BEES.some(b => E.beeLevel(s, b.id) >= a.value),
    cores: (s, a) => BZ.CORES.filter(x => s.cores && s.cores[x.id]).length >= a.value,
    skins: (s, a) => BZ.SKINS.filter(x => !x.world && x.id !== 'meadow' && s.skins && s.skins[x.id]).length >= a.value,
    worlds: (s, a) => ((s.worldsOpen && s.worldsOpen.length) || 1) >= a.value
  };
  E.RUN_TESTS = {
    runHoney: s => s.runHoney,
    runOwn: s => E.ownTotal(s),
    runUpg: s => s.runUpg || 0,
    runLucky: s => s.runLucky || 0,
    runTaps: s => s.runTaps || 0,
    runColony: s => E.colonyLevel(s)
  };
  E.runProgress = (s, a) => E.RUN_TESTS[a.test](s);
  E.checkAchievements = function (s) {
    const got = [];
    if (s.battle) return got;
    if (s.battle) return got;
    for (const a of BZ.ACHIEVEMENTS) {
      if (s.ach[a.id]) continue;
      let ok;
      if (a.test.startsWith('own:')) ok = (s.owned[a.test.slice(4)] || 0) >= a.value;
      else ok = E.ACH_TESTS[a.test](s, a);
      if (ok) { s.ach[a.id] = 1; E.addTickets(s, a.reward); got.push(a); }
    }
    s.runAch = s.runAch || {};
    const run = [];
    for (const a of BZ.RUN_ACH) {
      if (s.runAch[a.id]) continue;
      if (E.RUN_TESTS[a.test](s) >= a.value) { s.runAch[a.id] = 1; E.addTickets(s, a.reward); run.push(a); }
    }
    if (got.length) { s._dirty = true; got.forEach(a => E.emit(s, 'achievement', a)); }
    if (run.length) run.forEach(a => E.emit(s, 'runAchievement', a));
    return got;
  };
})(typeof window !== 'undefined' ? window : globalThis);
