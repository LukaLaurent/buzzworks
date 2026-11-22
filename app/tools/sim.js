const path = require('path');
require(path.join(__dirname, '../src/data.js'));
require(path.join(__dirname, '../src/engine.js'));
const BZ = globalThis.BZ;
const E = BZ.E;

const args = Object.fromEntries(process.argv.slice(2).map(a => a.split('=')));
const HOURS = Number(args.hours || 6);
const TAPS = Number(args.taps || 3);
const ACTIVE = Number(args.active || 0.35);
const SWARM_AT = Number(args.swarm || 2);
const world = Number(args.world || 0);

function fmt(n) {
  if (n < 1000) return n.toFixed(1);
  const e = Math.floor(Math.log10(n));
  return (n / Math.pow(10, e)).toFixed(2) + 'e' + e;
}
function hms(t) { const h = Math.floor(t / 3600), m = Math.floor(t % 3600 / 60); return h + 'h' + String(m).padStart(2, '0'); }

function deltaFor(s, fn) {
  const before = E.cache(s).baseHps;
  const snap = JSON.stringify({ owned: s.owned, upg: s.upg, honey: s.honey, upgCount: s.upgCount, milestones: s.milestones });
  E.mute = true;
  fn();
  E.mute = false;
  s._dirty = true;
  const after = E.recalc(s).baseHps;
  const o = JSON.parse(snap);
  Object.assign(s, o);
  s._dirty = true;
  E.recalc(s);
  return after - before;
}

function bestAction(s) {
  const hps = Math.max(E.cache(s).baseHps, 0.5);
  let best = null, bestT = Infinity;
  for (const p of BZ.PRODUCERS) {
    const cost = E.unitCost(s, p.id);
    if (cost > s.honey + hps * 3600) continue;
    const d = deltaFor(s, () => { s.honey = cost * 2; E.buy(s, p.id, 1); });
    if (d <= 0) continue;
    const t = Math.max(0, cost - s.honey) / hps + cost / d;
    if (t < bestT) { bestT = t; best = { type: 'p', id: p.id, cost }; }
  }
  for (const u of E.availableUpgrades(s)) {
    if (u.cost > s.honey + hps * 3600) continue;
    let d;
    if (u.kind === 'tap' || u.kind === 'lucky') d = hps * 0.05;
    else d = deltaFor(s, () => { s.honey = u.cost * 2; E.buyUpgrade(s, u.id); });
    if (d <= 0) continue;
    const t = Math.max(0, u.cost - s.honey) / hps + u.cost / d;
    if (t < bestT) { bestT = t; best = { type: 'u', id: u.id, cost: u.cost }; }
  }
  return best;
}

function buyQueen(s) {
  const order = ['mind', 'decree', 'touch', 'wisdom', 'headstart', 'charm', 'nap', 'thrift', 'elixir', 'combo'];
  let bought = true;
  while (bought) {
    bought = false;
    let cheapest = null;
    for (const id of order) {
      if (E.queenMaxed(s, id)) continue;
      const c = E.queenCost(s, id);
      if (!cheapest || c < cheapest.c) cheapest = { id, c };
    }
    if (cheapest && s.rj >= cheapest.c) { E.buyQueen(s, cheapest.id); bought = true; }
  }
}

const s = E.newState(world);
const firsts = {};
const powers = {};
let events = { lucky: 0, milestone: 0, swarm: 0, upgrade: 0 };
E.on((st, type, d) => {
  if (events[type] !== undefined) events[type]++;
  if (type === 'power' && powers[d.power] === undefined) powers[d.power] = st.played;
});
const dt = Number(args.dt || 0.5);
const total = HOURS * 3600;
let nextLog = 600;
let tapAcc = 0;
while (s.played < total) {
  const cycle = s.played % 3600;
  const active = cycle < ACTIVE * 3600;
  if (active) {
    tapAcc += TAPS * dt;
    while (tapAcc >= 1) { E.tap(s); tapAcc--; }
    if (s.luckyOn) E.catchLucky(s);
  } else if (s.luckyOn) s.luckyOn = null;
  E.tick(s, dt);
  E.checkAchievements(s);
  for (let i = 0; i < 20; i++) {
    const a = bestAction(s);
    if (!a || a.cost > s.honey) break;
    if (a.type === 'p') E.buy(s, a.id, 1); else E.buyUpgrade(s, a.id);
  }
  for (const p of BZ.PRODUCERS) if (s.owned[p.id] > 0 && firsts[p.id] === undefined) firsts[p.id] = s.played;
  if (Math.floor(s.played) % 60 === 0) s._lastPend = E.pendingRJ(s);
  const pend = E.pendingRJ(s);
  if (active && pend >= 1 && pend >= Math.max(3, s.rjEarned) * (SWARM_AT - 1) && (s._lastPend === undefined || pend - (s._lastPend||0) < pend * 0.02 || s.runTime > 3000) && s.runTime > 600) {
    console.log(`  swarm at ${hms(s.played)} run ${hms(s.runTime)} +${pend} RJ (total ${s.rjEarned + pend}) hps ${fmt(E.cache(s).baseHps)}`);
    E.swarm(s);
    buyQueen(s);
  }
  const pc = E.pendingCrowns(s);
  if (active && pc >= Math.max(1, s.crowns || 0) && s.runTime > 600) {
    console.log(`  CORONATION at ${hms(s.played)} +${pc} crowns (total ${s.crowns + pc})`);
    E.coronate(s);
    buyQueen(s);
  }
  if (s.played >= nextLog) {
    nextLog += s.played < 3600 ? 600 : Number(args.log || 3600);
    const own = BZ.PRODUCERS.filter(p => s.owned[p.id]).map(p => p.id.slice(0, 4) + s.owned[p.id]).join(' ');
    console.log(`${hms(s.played)} g ${fmt(E.cache(s).global)} wm ${fmt(E.cache(s).prodMult.worker)} cm ${fmt(E.cache(s).prodMult.celestial||0)} q ${JSON.stringify(s.queen)} honey ${fmt(s.runHoney)} hps ${fmt(E.cache(s).baseHps)} tap ${fmt(E.tapValue(s))} pendRJ ${pend} rj ${fmt(s.rjEarned)} cr ${s.crowns} ach ${E.achCount(s)} upg ${Object.keys(s.upg).length} | ${own}`);
  }
}
console.log('firsts', Object.entries(firsts).map(([k, v]) => k + ' ' + hms(v)).join(', '));
console.log('events', JSON.stringify(events), 'tickets', JSON.stringify(s.tickets), 'achievements', E.achCount(s));
console.log('powers', Object.entries(powers).map(([k, v]) => k + ':' + hms(v)).join(' '));
console.log('final runHoney', fmt(s.runHoney), 'lifetime', fmt(s.lifetime));
