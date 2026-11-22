(function (root) {
  const BZ = root.BZ = root.BZ || {};
  const E = BZ.E, M = BZ.Meta, P = BZ.P;
  const O = BZ.Online = { group: null, groupAt: 0, boards: {}, busy: false, error: '' };

  O.FIELDS = ['honey', 'crowns', 'essence', 'bees', 'level', 'trophies'];

  function worlds(s) {
    const list = [s];
    for (const k in s.otherWorlds || {}) list.push(s.otherWorlds[k]);
    return list;
  }
  O.name = function (s) {
    const n = (s.playerName || '').trim();
    if (n) return n.slice(0, 18);
    const id = BZ.Cloud.uid() || String(s.seed || 0);
    let h = 0;
    for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
    return 'Bee ' + String(1000 + h % 9000);
  };
  O.stats = function (s) {
    const ws = worlds(s);
    return {
      honey: ws.reduce((a, w) => a + (w.lifetime || 0), 0),
      crowns: ws.reduce((a, w) => a + (w.crowns || 0) + (w.crownsSpent || 0), 0),
      essence: s.essence || 0,
      bees: BZ.BEES.filter(b => s.bees && s.bees[b.id]).length,
      level: s.level || 1,
      trophies: ws.reduce((a, w) => a + Object.keys(w.ach || {}).length, 0)
    };
  };
  O.profile = function (s) {
    return Object.assign({ name: O.name(s), tier: s.league.tier || 0, v: 2 }, O.stats(s));
  };
  O.entry = (s, points) => ({ n: O.name(s), p: Math.round(points === undefined ? s.league.points : points), l: s.level || 1 });

  O.standings = function (g) {
    if (!g || !g.scores) return [];
    const me = BZ.Cloud.uid();
    const list = Object.keys(g.scores).map(uid => Object.assign({ uid, you: uid === me }, g.scores[uid]));
    list.sort((a, b) => (b.p || 0) - (a.p || 0) || (a.you ? -1 : 1));
    list.forEach((e, i) => { e.rank = i + 1; });
    return list;
  };
  O.zones = n => ({ up: Math.max(1, Math.ceil(n / 4)), down: n >= 4 ? Math.floor(n / 4) : 0 });

  async function finalize(s) {
    const L = s.league;
    const prev = L.prev;
    await BZ.Cloud.setScore(prev.gid, O.entry(s, prev.points)).catch(() => {});
    const g = await BZ.Cloud.group(prev.gid);
    const list = O.standings(g);
    const me = list.find(e => e.you);
    L.prev = null;
    if (!me) return;
    const n = list.length;
    const z = O.zones(n);
    let move = 0;
    if (me.rank <= z.up && L.tier < BZ.LEAGUE_TIERS.length - 1) move = 1;
    else if (z.down && me.rank > n - z.down && L.tier > 0) move = -1;
    const fromTier = L.tier;
    L.tier += move;
    L.bestTier = Math.max(L.bestTier || 0, L.tier);
    const reward = { egg: Math.max(2, 12 - me.rank) };
    if (n >= 3 && me.rank <= 3) reward.royal = 4 - me.rank;
    if (move > 0) reward.core = 1;
    const got = P.grant(s, reward);
    L.history = (L.history || []).concat([{ week: prev.week, tier: fromTier, rank: me.rank, n, points: prev.points }]).slice(-20);
    L.pending = { rank: me.rank, n, move, tier: L.tier, got };
  }

  O.sync = async function (s) {
    const C = BZ.Cloud;
    if (!C.signedIn() || O.busy) return false;
    O.busy = true;
    try {
      M.leagueRoll(s);
      const L = s.league;
      if (L.prev && L.prev.gid) await finalize(s);
      if (!L.gid) L.gid = await C.joinGroup(L.week, L.tier || 0, O.entry(s));
      else await C.setScore(L.gid, O.entry(s));
      await C.publish(O.profile(s));
      O.group = await C.group(L.gid);
      O.groupAt = Date.now();
      O.error = '';
      return true;
    } catch (e) {
      O.error = String(e && e.message || e);
      if (BZ.Log) BZ.Log.error('online sync: ' + O.error);
      return false;
    } finally { O.busy = false; }
  };

  O.board = async function (s, field) {
    const C = BZ.Cloud;
    const cached = O.boards[field];
    if (cached && Date.now() - cached.at < 60000) return cached;
    const list = await C.top(field, 50);
    const mine = O.stats(s)[field];
    const rank = C.signedIn() ? await C.rankOf(field, mine).catch(() => 0) : 0;
    const out = { at: Date.now(), list, rank, mine };
    O.boards[field] = out;
    return out;
  };
})(typeof window !== 'undefined' ? window : globalThis);
