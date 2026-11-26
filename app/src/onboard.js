(function (root) {
  const BZ = root.BZ;
  const E = BZ.E, F = BZ.F, UI = BZ.UI, t = BZ.t, ic = BZ.icon;

  BZ.addStrings({
    ob_skip: 'Skip tutorial', ob_ok: 'Got it', ob_step: '{n} / {m}',
    ob_tap: 'Tap the honeycomb to make your first honey!',
    ob_buy: 'You have enough honey. Buy a Worker bee: it makes honey on its own, even while you are away.',
    ob_more: 'Nice! Keep buying producers. Every 25 of the same one doubles its honey.',
    ob_upg: 'An upgrade is ready. Upgrades make your producers much stronger: pick it.',
    ob_upgbuy: 'Now buy it!',
    ob_lucky: 'A golden lucky bee is flying around! Tap it quickly for a big bonus.',
    ob_queen: 'The Queen woke up! Open her tab to learn about swarms.',
    ob_jelly: 'Swarming restarts your hive, but gives royal jelly. Each jelly makes all your honey stronger forever, so you grow back much faster. Swarm when the gain looks good!',
    ob_crowns: 'Later, many swarms let you get crowned. Crowns give a huge bonus, unlock automation and open new worlds. Have fun!'
  }, {
    ob_skip: 'Passer le tutoriel', ob_ok: 'Compris', ob_step: '{n} / {m}',
    ob_tap: 'Touchez le rayon pour faire votre premier miel !',
    ob_buy: 'Vous avez assez de miel. Achetez une abeille ouvrière : elle fait du miel toute seule, même quand vous êtes absent.',
    ob_more: 'Bravo ! Continuez à acheter des producteurs. Tous les 25 du même, son miel double.',
    ob_upg: 'Une amélioration est prête. Les améliorations rendent vos producteurs bien plus forts : choisissez-la.',
    ob_upgbuy: 'Achetez-la maintenant !',
    ob_lucky: 'Une abeille dorée vole par ici ! Touchez-la vite pour un gros bonus.',
    ob_queen: 'La Reine s’est réveillée ! Ouvrez son onglet pour découvrir les essaims.',
    ob_jelly: 'Essaimer relance votre ruche, mais donne de la gelée royale. Chaque gelée rend tout votre miel plus fort pour toujours, vous repartez donc bien plus vite. Essaimez quand le gain vous plaît !',
    ob_crowns: 'Plus tard, de nombreux essaims vous permettront d’être couronné. Les couronnes donnent un énorme bonus, débloquent l’automatisation et ouvrent de nouveaux mondes. Amusez-vous bien !'
  });

  const G = () => BZ.Game;
  const owned = s => Object.values(s.owned || {}).reduce((a, b) => a + b, 0);
  const vis = el => !!el && el.offsetParent !== null && el.getBoundingClientRect().width > 0;
  const q = sel => { const list = document.querySelectorAll(sel); for (const el of list) if (vis(el)) return el; return null; };
  const tabTarget = id => q('#tabs [data-tab="' + id + '"]') || q('#drawer.open [data-tab="' + id + '"]') || q('#menuBtn');

  const seen = {};
  const STEPS = [
    { id: 'tap', target: () => q('#scene'), stage: true, done: s => (s.taps || 0) >= 8 },
    { id: 'buy', ready: s => s.honey >= E.unitCost(s, 'worker') || (s.owned.worker || 0) > 0, target: () => UI.page() === 'hive' ? q('#prodList .prod[data-pid="worker"]') : tabTarget('hive'), done: s => (s.owned.worker || 0) >= 1 },
    { id: 'more', target: () => UI.page() === 'hive' ? q('#prodList') : null, done: s => owned(s) >= 5, ok: true },
    { id: 'upg', ready: s => E.availableUpgrades(s).some(u => u.cost <= s.honey) || (s.upgCount || 0) > 0, target: () => UI.page() !== 'hive' ? tabTarget('hive') : (q('#upgDetail [data-act="upgbuy"]') || q('#upgGrid .upg:not(.empty)')), text: () => q('#upgDetail [data-act="upgbuy"]') ? 'ob_upgbuy' : 'ob_upg', done: s => (s.upgCount || 0) >= 1 },
    { id: 'lucky', ready: s => { if (s.luckyOn) seen.lucky = 1; return !!s.luckyOn; }, target: () => q('#scene'), stage: true, done: s => (s.lucky || 0) >= 1 || (!!seen.lucky && !s.luckyOn) },
    { id: 'queen', ready: s => !!s.flags.queen, target: () => tabTarget('queen'), done: () => UI.page() === 'queen' },
    { id: 'jelly', target: () => UI.page() === 'queen' ? q('#panel [data-act="swarm"]') || q('#panel .page') : tabTarget('queen'), ok: true, done: s => (s.swarms || 0) >= 1 },
    { id: 'crowns', ready: s => (s.swarms || 0) >= 1, target: () => null, ok: true, done: () => false }
  ];

  const O = BZ.Onboard = { STEPS };
  let spot = null, tip = null, lastKey = '';

  O.active = function () {
    const g = G();
    if (!g || !g.main || g.battle) return false;
    const f = g.realMain().flags;
    return typeof f.ob === 'number' && f.ob < STEPS.length;
  };
  O.start = function (s) { s.flags.ob = 0; };
  O.finish = function () { const f = G().realMain().flags; f.ob = STEPS.length; hide(); G().save(); };
  O.next = function () { const f = G().realMain().flags; f.ob = (f.ob || 0) + 1; lastKey = ''; BZ.Audio.play('click'); G().save(); };

  function ensure() {
    if (spot) return;
    spot = document.createElement('div'); spot.id = 'obSpot'; spot.className = 'ob-spot';
    tip = document.createElement('div'); tip.id = 'obTip'; tip.className = 'ob-tip';
    document.body.appendChild(spot); document.body.appendChild(tip);
    tip.addEventListener('click', e => {
      const b = e.target.closest('[data-ob]');
      if (!b) return;
      e.stopPropagation();
      if (b.dataset.ob === 'skip') O.finish();
      if (b.dataset.ob === 'ok') { const st = STEPS[G().realMain().flags.ob]; if (st && st.id === 'crowns') O.finish(); else O.next(); }
    });
  }
  function hide() { if (spot) spot.classList.remove('on'); if (tip) tip.classList.remove('on'); }

  function place(r, stage) {
    const pad = stage ? -Math.min(r.width, r.height) * 0.18 : 6;
    const x = r.left - pad, y = r.top - pad, w = r.width + pad * 2, h = r.height + pad * 2;
    spot.style.left = x + 'px'; spot.style.top = y + 'px'; spot.style.width = w + 'px'; spot.style.height = h + 'px';
    spot.style.borderRadius = stage ? '50%' : '14px';
    spot.classList.add('on');
    const tw = Math.min(320, innerWidth - 24);
    tip.style.width = tw + 'px';
    const th = tip.offsetHeight || 120;
    let tx = Math.max(12, Math.min(innerWidth - tw - 12, x + w / 2 - tw / 2));
    let ty, below = y + h + 14 + th < innerHeight - 8;
    if (stage) { ty = Math.max(70, y + h * 0.62); below = true; }
    else ty = below ? y + h + 14 : Math.max(8, y - th - 14);
    tip.style.left = tx + 'px'; tip.style.top = ty + 'px';
    tip.classList.toggle('up', !below);
    const ax = Math.max(18, Math.min(tw - 18, x + w / 2 - tx));
    tip.style.setProperty('--ax', ax + 'px');
  }

  function tick() {
    const g = G();
    if (!O.active() || UI.modalOpen() || (UI.mapOpen && UI.mapOpen())) { hide(); return; }
    const s = g.realMain();
    let k = s.flags.ob;
    let st = STEPS[k];
    while (st && st.done(s) && !st.ok) { s.flags.ob = ++k; st = STEPS[k]; lastKey = ''; }
    if (st && st.ok && st.id === 'more' && st.done(s)) { s.flags.ob = ++k; st = STEPS[k]; }
    if (st && st.id === 'jelly' && st.done(s)) { s.flags.ob = ++k; st = STEPS[k]; }
    if (!st) { O.finish(); return; }
    if (st.ready && !st.ready(s)) { hide(); return; }
    ensure();
    const txt = st.text ? st.text() : 'ob_' + st.id;
    const key = st.id + '|' + txt + '|' + BZ.lang;
    if (key !== lastKey) {
      lastKey = key;
      tip.innerHTML = '<div class="ob-head"><span class="ob-ic">' + BZ.appIconSvg(22) + '</span><small>' + t('ob_step', { n: k + 1, m: STEPS.length }) + '</small><button class="ob-skip" data-ob="skip">' + t('ob_skip') + '</button></div><p>' + t(txt) + '</p>' + (st.ok ? '<div class="ob-row"><button class="btn btn-primary btn-sm" data-ob="ok">' + t('ob_ok') + '</button></div>' : '') + '<i class="ob-arrow"></i>';
      tip.classList.add('on');
    }
    const el = st.target();
    if (el) {
      const r = el.getBoundingClientRect();
      if (!st.stage && (r.bottom < 0 || r.top > innerHeight) && el.closest('#panel')) el.scrollIntoView({ block: 'center', behavior: 'smooth' });
      place(r, st.stage);
    } else {
      spot.classList.remove('on');
      const tw = Math.min(340, innerWidth - 24);
      tip.style.width = tw + 'px';
      tip.style.left = (innerWidth - tw) / 2 + 'px';
      tip.style.top = Math.max(80, innerHeight * 0.35) + 'px';
      tip.classList.remove('up');
      tip.style.setProperty('--ax', '-100px');
    }
    tip.classList.add('on');
  }
  setInterval(tick, 250);
  addEventListener('resize', () => { lastKey = ''; });
})(window);
