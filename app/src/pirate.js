(function (root) {
  const BZ = root.BZ;
  const E = BZ.E, F = BZ.F, P = BZ.P, UI = BZ.UI, t = BZ.t, n = BZ.n, ic = BZ.icon;
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  BZ.addStrings({
    pi_name: 'The Black Sail', pi_sub: 'Vanishes in {t}', pi_d: 'It drifts out of the fog and never stays long. Those who board it rarely come back empty handed.',
    pi_board: 'Board', pi_go_t: 'The fog closes behind you', pi_go_d: 'Five minutes. Make honey, take what you can.', pi_hint: 'What may lie in the hold', pi_bar: 'Pirate raid',
    pi_tier: 'Loot {n} / {m}', pi_next: 'Next loot at {v}', pi_maxed: 'Hold emptied!', pi_over_t: 'Raid over!', pi_over_d: 'You looted {v} honey worth of treasure.', pi_t0: 'A few coins', pi_t1: 'Deckhand chest', pi_t2: 'Officer chest', pi_t3: 'Captain chest', pi_t4: 'The whole hold',
    pi_gone: 'The pirate ship sailed away', pi_used: 'You already raided this ship', pi_chance: '{p} chance',
    pi_l0: 'Under {v}', pi_l: 'From {v}', pi_honey: 'Half of your honey', pi_rewards: 'Treasure by honey made'
  }, {
    pi_name: 'La Voile noire', pi_sub: 'Disparaît dans {t}', pi_d: 'Il surgit de la brume et ne reste jamais longtemps. Ceux qui montent à bord en reviennent rarement les mains vides.',
    pi_board: 'Monter à bord', pi_go_t: 'La brume se referme derrière vous', pi_go_d: 'Cinq minutes. Produisez du miel, prenez ce que vous pouvez.', pi_hint: 'Ce que la cale pourrait cacher', pi_bar: 'Raid pirate',
    pi_tier: 'Butin {n} / {m}', pi_next: 'Butin suivant à {v}', pi_maxed: 'Cale vidée !', pi_over_t: 'Raid terminé !', pi_over_d: 'Vous avez pillé l’équivalent de {v} de miel.', pi_t0: 'Quelques pièces', pi_t1: 'Coffre du mousse', pi_t2: 'Coffre de l’officier', pi_t3: 'Coffre du capitaine', pi_t4: 'Toute la cale',
    pi_gone: 'Le bateau pirate est reparti', pi_used: 'Vous avez déjà pillé ce navire', pi_chance: '{p} de chance',
    pi_l0: 'Moins de {v}', pi_l: 'À partir de {v}', pi_honey: 'La moitié de votre miel', pi_rewards: 'Trésor selon le miel produit'
  });

  BZ.PIRATE_TIERS = [
    { at: 0, r: { egg: 10 } },
    { at: 1e8, r: { egg: 15, core: 3 } },
    { at: 1e11, r: { legend: 1, boost: 'x10' } },
    { at: 1e13, r: { legend: 2, boost: 'x10', half: 1 }, mystic: 0.3, stone: 0.05 },
    { at: 1e15, r: { mystic: 1, legend: 2, boost: 'x10', half: 1 }, stone: 0.2 }
  ];
  BZ.PIRATE_MIN = 5;

  const KEY = 'buzzworks.pirate', WIN = 2 * 3600000, STAY = 10 * 60000;
  const Pi = BZ.Pirate = {};
  const G = () => BZ.Game;
  const real = () => G().realMain();
  const now = () => Date.now();
  function hash(str) { let h = 2166136261; for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }

  Pi.slot = function (w, seed) {
    const rnd = E.rng(hash('pirate:' + w + ':' + (seed || 0)));
    if (rnd() > 0.75) return null;
    const start = w * WIN + Math.floor(rnd() * (WIN - STAY));
    return { w, start, end: start + STAY };
  };
  Pi.current = function (s, at) {
    at = at || now();
    s = s || real();
    if (!s) return null;
    if (Pi.force && at < Pi.force.end) return Pi.force;
    const w = Math.floor(at / WIN);
    for (const k of [w, w - 1]) {
      const sl = Pi.slot(k, s.seed);
      if (sl && at >= sl.start && at < sl.end) return sl;
    }
    return null;
  };
  Pi.state = s => { s.pirate = Object.assign({ used: null, raids: 0 }, s.pirate || {}); return s.pirate; };
  Pi.active = function () {
    const g = G();
    if (!g || !g.main || g.battle) return null;
    const s = real();
    if (!s.flags || !s.flags.worlds) return null;
    const sl = Pi.current(s);
    if (!sl || Pi.state(s).used === sl.w) return null;
    return sl;
  };
  Pi.tier = sc => { let k = 0; BZ.PIRATE_TIERS.forEach((x, i) => { if (sc >= x.at) k = i; }); return k; };

  Pi.shipSvg = function (size) {
    return '<svg class="pi-ship-svg" viewBox="-110 -120 220 170" width="' + size + '" height="' + Math.round(size * 170 / 220) + '" aria-hidden="true">' + Pi.shipBody() + '</svg>';
  };
  Pi.shipBody = function () {
    let d = '<g class="pi-rock"><path d="M-14,-110 L-14,-8" stroke="#3A2414" stroke-width="7" stroke-linecap="round"/><path d="M34,-80 L34,-8" stroke="#3A2414" stroke-width="6" stroke-linecap="round"/>';
    d += '<path class="pi-sail" d="M-12,-104 Q22,-80 -12,-28 Q-58,-60 -12,-104 Z" fill="#20252B" stroke="#0E1114" stroke-width="3"/><path class="pi-sail b" d="M36,-76 Q60,-58 36,-24 Q10,-48 36,-76 Z" fill="#2A3038" stroke="#0E1114" stroke-width="3"/>';
    d += '<g transform="translate(-20 -64)"><circle r="11" fill="#F5F3EF"/><circle cx="-4" cy="-2" r="2.6" fill="#20252B"/><circle cx="4" cy="-2" r="2.6" fill="#20252B"/><path d="M-4,6 h8" stroke="#20252B" stroke-width="2"/><path d="M-14,10 L14,22 M14,10 L-14,22" stroke="#F5F3EF" stroke-width="4" stroke-linecap="round"/></g>';
    d += '<path class="pi-flag" d="M-14,-112 L14,-104 L-14,-96 Z" fill="#D64545"/>';
    d += '<path d="M-96,-12 L96,-12 L74,30 Q0,44 -74,30 Z" fill="#7A4A26" stroke="#3A2414" stroke-width="4" stroke-linejoin="round"/><path d="M-90,-2 H90" stroke="#E0A526" stroke-width="4"/><path d="M-80,14 H80" stroke="#5C3618" stroke-width="3"/>';
    [-54, -22, 10, 42].forEach(x => { d += '<circle cx="' + x + '" cy="8" r="5" fill="#20252B" stroke="#E0A526" stroke-width="2"/>'; });
    d += '<path d="M-96,-12 L-108,-30 L-84,-12 Z" fill="#7A4A26" stroke="#3A2414" stroke-width="3"/><path d="M96,-12 L112,-26 L100,-6 Z" fill="#7A4A26" stroke="#3A2414" stroke-width="3"/></g>';
    d += '<path class="pi-wave" d="M-120,34 q20,-10 40,0 t40,0 t40,0 t40,0 t40,0 t40,0" stroke="#BFE3E0" stroke-width="5" fill="none" stroke-linecap="round" opacity="0.8"/>';
    return d;
  };
  Pi.SPOTS = { wide: [[190, 280], [350, 940], [560, 940], [830, 940], [1750, 760], [1790, 940]], tall: [[150, -150], [150, -30], [720, 270], [750, 1310], [720, 1420]] };
  Pi.spot = function (sl, tall) {
    const list = Pi.SPOTS[tall ? 'tall' : 'wide'];
    return list[hash('spot:' + sl.w + ':' + (real() ? real().seed : 0)) % list.length];
  };
  Pi.mapHtml = function (tall) {
    const sl = Pi.active();
    if (!sl) return '';
    const sp = Pi.spot(sl, tall), sc = tall ? 0.9 : 0.85, flip = hash('dir:' + sl.w) % 2 ? -1 : 1;
    let fog = '';
    for (let k = 0; k < 4; k++) fog += '<ellipse class="pi-fog" style="animation-delay:-' + (k * 2.2) + 's" cx="' + (-130 + k * 85) + '" cy="' + (20 - (k % 2) * 30) + '" rx="' + (90 + k * 10) + '" ry="30"/>';
    return '<g class="wm-pirate" transform="translate(' + sp[0] + ' ' + sp[1] + ') scale(' + (sc * flip) + ' ' + sc + ')"><g class="pi-sailing"><ellipse cx="0" cy="40" rx="120" ry="16" fill="#061418" opacity="0.55"/>' + Pi.shipBody() + '</g>' + fog + '</g>';
  };
  Pi.cardHtml = function () {
    const sl = Pi.active();
    if (!sl) return '<div class="wm-hd"><div><h3>' + t('pi_name') + '</h3></div><button class="wm-x" data-wm="close">' + ic('close') + '</button></div><p class="wm-line">' + t('pi_gone') + '</p>';
    let h = '<div class="wm-hd"><span class="wm-sw pi-sw">' + Pi.shipSvg(52) + '</span><div><h3>' + t('pi_name') + '</h3><div class="wm-tw2 num" data-t="' + sl.end + '" data-tfmt="pi_sub">' + esc(t('pi_sub', { t: F.time(Math.max(0, sl.end - now()) / 1000) })) + '</div></div><button class="wm-x" data-wm="close">' + ic('close') + '</button></div>';
    h += '<p class="wm-line pi-d">' + t('pi_d') + '</p>';
    h += '<div class="pi-hint"><small>' + t('pi_hint') + '</small><span>' + BZ.eggSvg('mystic', 22) + BZ.eggSvg('legend', 22) + '<i class="pi-q">' + ic('gem') + '</i><i class="pi-q">' + ic('bolt') + '</i><i class="pi-q">' + ic('drop') + '</i></span></div>';
    h += '<div class="wm-acts"><button class="btn btn-primary" data-pi="board">' + ic('boss') + t('pi_board') + '</button></div>';
    return h;
  };

  Pi.start = function () {
    const g = G(), s = real();
    if (g.battle) return;
    const sl = Pi.active();
    if (!sl) { UI.toast('info', t('pi_gone')); return; }
    Pi.state(s).used = sl.w;
    g.save();
    if (UI.mapOpen && UI.mapOpen()) UI.closeMap();
    BZ.Audio.play('luckySpawn');
    UI.modal('<div class="hero ev-pop"><div class="ev-pop-boss pi-pop">' + Pi.shipSvg(170) + '</div><h4>' + t('pi_go_t') + '</h4><p>' + t('pi_go_d') + '</p></div><div class="row center"><button class="btn btn-primary" data-close>' + ic('boss') + t('pi_board') + '</button></div>', false);
    UI.onModalClose = () => Pi.enter({ w: sl.w, end: now() + BZ.PIRATE_MIN * 60000 });
  };
  Pi.enter = function (info, stored) {
    const g = G();
    if (g.battle) return;
    const base = g.main;
    const bs = stored || BZ.Event.makeState(base, 'pirate');
    bs.battle = 2;
    g.battle = Object.assign({ real: base, pirate: 1 }, info);
    g.main = bs;
    if (BZ.Scene) { BZ.Scene.removeLucky(false); BZ.Scene.removeLucky(false, 'ticket'); }
    E.recalc(bs);
    g.refreshScene();
    UI.structureChanged();
    UI.show('hive');
    bar();
    Pi.persist();
    g.save();
    if (BZ.Log) BZ.Log.info('pirate raid start');
  };
  Pi.persist = function () {
    const g = G();
    if (!g.battle || !g.battle.pirate) return;
    try { localStorage.setItem(KEY, JSON.stringify({ info: { w: g.battle.w, end: g.battle.end }, state: BZ.Store.serialize(g.main) })); } catch (e) {}
  };
  function loot(s, sc, rnd) {
    rnd = rnd || Math.random;
    const k = Pi.tier(sc), tr = BZ.PIRATE_TIERS[k];
    const r = Object.assign({}, tr.r);
    const half = !!r.half;
    delete r.half;
    if (tr.mystic && rnd() < tr.mystic) r.mystic = (r.mystic || 0) + 1;
    let stone = false;
    if (tr.stone && rnd() < tr.stone) { s.primeStones = (s.primeStones || 0) + 1; stone = true; }
    const got = P.grant(s, r);
    let honey = 0;
    if (half && s.honey > 0) { honey = s.honey * 0.5; E.gainHoney(s, honey); }
    s._dirty = true;
    return { k, r, stone, honey, got };
  }
  Pi.loot = loot;
  Pi.leave = function (silent) {
    const g = G();
    const b = g.battle;
    if (!b || !b.pirate) return;
    const sc = Math.floor(g.main.lifetime || 0);
    g.main = b.real;
    g.battle = null;
    try { localStorage.removeItem(KEY); } catch (e) {}
    const res = loot(g.main, sc);
    const ps = Pi.state(g.main);
    ps.raids = (ps.raids || 0) + 1;
    ps.best = Math.max(ps.best || 0, sc);
    if (BZ.Scene) { BZ.Scene.removeLucky(false); BZ.Scene.removeLucky(false, 'ticket'); }
    E.recalc(g.main);
    g.refreshScene();
    UI.structureChanged();
    bar();
    g.save();
    BZ.Audio.play(res.k >= 3 ? 'swarm' : 'lucky');
    if (!silent) showLoot(res, sc);
    else Pi.pendingLoot = { res, sc };
    if (BZ.Log) BZ.Log.info('pirate raid ' + sc + ' tier ' + res.k + (res.stone ? ' +stone' : ''));
  };
  function showLoot(res, sc) {
    let chips = UI.rewardChips(res.r);
    if (res.honey > 0) chips += '<span class="rw bst">' + ic('drop') + '+' + F.num(res.honey) + '</span>';
    if (res.stone) chips += '<span class="rw rwstone">' + ic('gem') + t('rr_stone') + '</span>';
    UI.queueModal('<div class="hero ev-pop' + (res.k >= 3 ? ' pi-big' : '') + '"><div class="ev-pop-boss pi-pop">' + Pi.shipSvg(150) + '</div><h4>' + t('pi_over_t') + '</h4><p><b>' + t('pi_t' + res.k) + '</b><br>' + esc(t('pi_over_d', { v: F.num(sc) })) + '</p><div class="ev-chips">' + chips + '</div></div><div class="row center"><button class="btn btn-primary" data-close>' + t('ok') + '</button></div>');
  }
  Pi.resume = function () {
    let raw = null;
    try { raw = JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) {}
    if (!raw || !raw.info || !raw.state) return;
    const g = G();
    const st = g.migrateState(raw.state);
    st.battle = 2;
    if (now() < raw.info.end) { Pi.enter(raw.info, st); return; }
    g.battle = Object.assign({ real: g.main, pirate: 1 }, raw.info);
    g.main = st;
    Pi.leave();
  };

  function bar() {
    let el = document.getElementById('piBar');
    const g = G();
    if (!g.battle || !g.battle.pirate) { if (el) el.remove(); return; }
    if (!el) {
      el = document.createElement('div'); el.id = 'piBar'; el.className = 'bt-bar ev-bar pi-bar';
      el.innerHTML = '<span class="ev-bar-pic pi-bar-pic">' + Pi.shipSvg(44) + '</span><div class="ev-bar-mid"><div class="ev-bar-top"><b>' + t('pi_bar') + '</b><small class="pi-tn"></small></div><div class="ev-hp pi-hp"><i></i></div><small class="ev-dmg pi-next num"></small></div><span class="bt-time num"></span>';
      (document.getElementById('stage') || document.getElementById('app')).appendChild(el);
    }
    const sc = Math.floor(g.main.lifetime || 0), k = Pi.tier(sc), T = BZ.PIRATE_TIERS;
    const nx = T[k + 1];
    const lo = T[k].at > 0 ? Math.log10(T[k].at) : 0, hi = nx ? Math.log10(nx.at) : lo;
    const frac = nx ? Math.max(0, Math.min(1, (Math.log10(Math.max(1, sc)) - lo) / (hi - lo))) : 1;
    el.querySelector('.pi-tn').textContent = t('pi_tier', { n: k, m: T.length - 1 });
    el.querySelector('.pi-hp i').style.width = (frac * 100).toFixed(1) + '%';
    el.querySelector('.pi-next').textContent = nx ? t('pi_next', { v: F.num(nx.at) }) + '  ·  ' + F.num(sc) : t('pi_maxed');
    el.querySelector('.bt-time').textContent = F.time(Math.max(0, g.battle.end - now()) / 1000);
  }

  setInterval(() => {
    const g = G();
    if (!g || !g.main) return;
    if (g.battle && g.battle.pirate) {
      if (now() >= g.battle.end) { Pi.leave(); return; }
      bar();
      if (Math.floor(now() / 1000) % 10 === 0) Pi.persist();
    }
  }, 1000);

  document.addEventListener('click', e => {
    const el = e.target.closest('[data-pi]');
    if (!el) return;
    e.stopPropagation();
    BZ.Audio.play('click');
    if (el.dataset.pi === 'board') Pi.start();
  });

  Pi.init = function () {
    if (Pi.ready) return;
    Pi.ready = true;
    Pi.state(G().main);
    Pi.resume();
  };
})(window);
