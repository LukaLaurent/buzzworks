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
    return '<svg class="pi-ship-svg" viewBox="-160 -205 310 255" width="' + size + '" height="' + Math.round(size * 255 / 310) + '" aria-hidden="true">' + Pi.shipBody() + '</svg>';
  };
  Pi.shipBody = function () {
    const sail = (x, top, bot, w, c) => '<path d="M' + (x - w) + ',' + top + ' Q' + x + ',' + (top - 10) + ' ' + (x + w) + ',' + top + ' L' + (x + w - 2) + ',' + bot + ' L' + (x + w - 12) + ',' + (bot - 8) + ' L' + (x + w - 22) + ',' + (bot + 4) + ' L' + x + ',' + (bot - 10) + ' L' + (x - w + 22) + ',' + (bot + 4) + ' L' + (x - w + 12) + ',' + (bot - 8) + ' L' + (x - w + 2) + ',' + bot + ' Z" fill="' + c + '" stroke="#1E2226" stroke-width="2"/>';
    let d = '<g class="pi-rock">';
    d += '<path d="M-60,-24 L-60,-170 M12,-24 L12,-192 M80,-24 L80,-150" stroke="#2A1A10" stroke-width="6" stroke-linecap="round"/>';
    d += '<path d="M-150,-40 L12,-190 M12,-190 L132,-42 M-60,-168 L-140,-34 M80,-148 L134,-44 M-60,-150 L12,-170 L80,-132" stroke="#6A5A4A" stroke-width="1.2" fill="none" opacity="0.8"/>';
    d += '<path d="M-62,-120 h4 M-62,-100 h4 M10,-150 h4 M10,-128 h4 M78,-110 h4" stroke="#6A5A4A" stroke-width="2"/>';
    d += sail(-60, -158, -98, 34, '#4E545C') + sail(-60, -90, -48, 30, '#454A52') + sail(12, -180, -114, 38, '#5A5F66') + sail(12, -106, -54, 34, '#4E545C') + sail(80, -140, -86, 28, '#4E545C');
    d += '<path d="M-18,-150 L4,-160 L30,-148" stroke="#3E434A" stroke-width="1.5" fill="none" opacity="0.7"/><path d="M-80,-136 L-60,-142 L-40,-134" stroke="#3E434A" stroke-width="1.5" fill="none" opacity="0.7"/>';
    d += '<ellipse cx="0" cy="-148" rx="5" ry="7" fill="#15191C"/><ellipse cx="-70" cy="-128" rx="4" ry="5" fill="#15191C"/><ellipse cx="88" cy="-110" rx="4" ry="6" fill="#15191C"/><ellipse cx="26" cy="-82" rx="3" ry="4" fill="#15191C"/>';
    d += '<g transform="translate(12 -128)" opacity="0.85"><circle r="10" fill="#C9CED3"/><circle cx="-3.5" cy="-1.5" r="2.6" fill="#2A2E33"/><circle cx="3.5" cy="-1.5" r="2.6" fill="#2A2E33"/><path d="M-12,9 L12,19 M12,9 L-12,19" stroke="#C9CED3" stroke-width="3.5" stroke-linecap="round"/></g>';
    d += '<path d="M0,-182 h24 v8 h-24 z" fill="#2A1A10"/><path d="M-2,-182 h28" stroke="#6A5A4A" stroke-width="2"/>';
    d += '<path class="pi-flag" d="M12,-194 L46,-186 L40,-182 L46,-178 L12,-178 Z" fill="#0E1114"/><circle cx="26" cy="-186" r="2.6" fill="#E8EAEC"/>';
    d += '<path d="M-134,-20 L-122,-52 L-70,-52 L-66,-24 L110,-24 L134,-40 L124,-2 Q100,34 0,40 Q-100,34 -124,-2 Z" fill="#3A2416" stroke="#140A04" stroke-width="3" stroke-linejoin="round"/>';
    d += '<path d="M-126,-32 H-68 M-120,-8 H118 M-112,18 Q0,30 108,18" stroke="#8A6A2A" stroke-width="3" fill="none"/>';
    d += '<path d="M-116,4 Q0,14 116,4 M-96,26 Q0,34 96,26" stroke="#24150C" stroke-width="1.5" fill="none" opacity="0.8"/>';
    d += '<path d="M-124,-52 L-128,-60 L-66,-60 L-66,-52 Z" fill="#2A1A10"/><path d="M-120,-60 v-6 M-100,-60 v-6 M-80,-60 v-6" stroke="#2A1A10" stroke-width="2"/>';
    [-116, -100, -84].forEach(x => { d += '<rect class="pi-lt" x="' + x + '" y="-47" width="11" height="10" rx="2" fill="#FFD45E"/>'; });
    for (let x = -90; x <= 90; x += 30) d += '<circle cx="' + x + '" cy="7" r="4.6" fill="#0B0B0B" stroke="#C9A04A" stroke-width="1.6"/>';
    d += '<path d="M118,-30 Q138,-44 150,-36 Q140,-30 132,-20" fill="#C9A04A" stroke="#6A4A10" stroke-width="2"/>';
    d += '<circle class="pi-lt" cx="130" cy="-50" r="5" fill="#FFD45E"/><path d="M130,-56 v-8" stroke="#2A1A10" stroke-width="2"/>';
    d += '</g><path class="pi-wave" d="M-160,40 q22,-10 44,0 t44,0 t44,0 t44,0 t44,0 t44,0 t44,0 t44,0" stroke="#8FB8C4" stroke-width="4" fill="none" stroke-linecap="round" opacity="0.65"/>';
    return d;
  };
  Pi.SPOTS = { wide: [[190, 280], [300, 950], [520, 960], [1740, 770], [1800, 950]], tall: [[150, -130], [150, -60], [735, 1370], [735, 1470]] };
  Pi.spot = function (sl, tall) {
    const list = Pi.SPOTS[tall ? 'tall' : 'wide'];
    return list[hash('spot:' + sl.w + ':' + (real() ? real().seed : 0)) % list.length];
  };
  Pi.mapHtml = function (tall) {
    const sl = Pi.active();
    if (!sl) return '';
    const sp = Pi.spot(sl, tall), sc = tall ? 0.78 : 0.74, flip = hash('dir:' + sl.w) % 2 ? -1 : 1;
    let fog = '';
    for (let k = 0; k < 4; k++) fog += '<ellipse class="pi-fog" style="animation-delay:-' + (k * 2.2) + 's" cx="' + (-130 + k * 85) + '" cy="' + (20 - (k % 2) * 30) + '" rx="' + (90 + k * 10) + '" ry="30"/>';
    return '<g class="wm-pirate" transform="translate(' + sp[0] + ' ' + sp[1] + ') scale(' + (sc * flip) + ' ' + sc + ')"><g class="pi-sailing"><ellipse cx="0" cy="42" rx="150" ry="16" fill="#061418" opacity="0.55"/>' + Pi.shipBody() + '</g>' + fog + '</g>';
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
