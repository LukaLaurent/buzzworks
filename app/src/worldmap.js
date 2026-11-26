(function (root) {
  const BZ = root.BZ;
  const E = BZ.E, F = BZ.F, P = BZ.P, UI = BZ.UI, t = BZ.t, n = BZ.n, ic = BZ.icon;
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  BZ.addStrings({
    wm_back: 'Back to hive', wm_hint: 'Tap a world to see it, or travel there', wm_travel: 'Travel here', wm_here: 'You are here', wm_crowns: '{v} crowns', wm_toopen: '{v} crowns to open', wm_openwith: 'Open it with {v} crowns from {w}.', wm_needprev: 'Open {w} first.', wm_open: 'Open  ·  {v} crowns', wm_welcome: 'Welcome to', wm_how: 'Each world keeps its own honey, queen and crowns. Crowns earned in a world open the next one. Bees, cores, skins, tickets and your level are shared everywhere. Sell a world with at least {m} crowns to restart it for essence, then spend essence in the essence tree.',
    br_honey: 'Honey', br_royal: 'Royal', br_fortune: 'Fortune', tree_req: 'Needs {n} level {l}', tree_inf: 'No limit',
    es_tap: 'Sweet paws', es_tap_d: 'x1.2 tap power per level', es_colony: 'Thriving colony', es_colony_d: 'Colony bonus +0.1 per level (x1.5 up to x2)', es_wisdom: 'Queen wisdom', es_wisdom_d: 'Queen skills 5% cheaper per level', es_fortune: 'Fortune', es_fortune_d: 'Lucky effects 5% longer per level', es_map_d: 'Worlds cost 5% fewer crowns per level',
    tree_title: 'Essence trees', tree_d: 'One tree per world, paid with the essence of that world. Sell a world to earn its essence. Upgrades last forever and work in every world.', tree_locked: 'Open {w} and sell it to earn this essence', tree_prog: '{a} / {b} complete',
    es_blaze: 'Sunlit comb', es_blaze_d: 'x1.15 honey per level', es_glow: 'Moonglow', es_glow_d: 'x1.1 honey per level', es_forge: 'Ember forge', es_forge_d: 'x1.25 honey per level', es_ash: 'Ashen jelly', es_ash_d: 'x1.2 royal jelly per level', es_tide: 'Night tide', es_tide_d: 'x1.2 tap power per level', es_heart: 'Molten heart', es_heart_d: 'Producers 2% cheaper per level', es_kiln: 'Crown kiln', es_kiln_d: '+10% crowns at every coronation per level',
    pr_head: 'Prime', pr_d: 'Complete all five trees, then spend {v} of every essence. You get one Prime point: honey x2 forever, and it stacks. Everything restarts from a single fresh world. Bees, cores, skins, tickets, level and pass stay.', pr_have: 'Prime points: {n}  ·  honey x{x}', pr_need: 'Complete every tree first ({a} / {b})', pr_btn: 'Become Prime',
    pr_title: 'Become Prime?', pr_text: 'Worlds, crowns, essence and every essence tree restart from zero. Bees, cores, skins, tickets, level and pass stay. You reach Prime {n}: honey x{x} forever.', pr_go: 'Become Prime', pr_done: 'Prime reached: honey x{x}'
  }, {
    wm_back: 'Retour à la ruche', wm_hint: 'Touchez un monde pour le voir, ou y voyager', wm_travel: 'Voyager ici', wm_here: 'Vous êtes ici', wm_crowns: '{v} couronnes', wm_toopen: '{v} couronnes pour ouvrir', wm_openwith: 'Ouvrez-le avec {v} couronnes de {w}.', wm_needprev: 'Ouvrez d\'abord {w}.', wm_open: 'Ouvrir  ·  {v} couronnes', wm_welcome: 'Bienvenue :', wm_how: 'Chaque monde garde son miel, sa reine et ses couronnes. Les couronnes gagnées dans un monde ouvrent le suivant. Abeilles, noyaux, décors, tickets et niveau sont partagés partout. Vendez un monde avec au moins {m} couronnes pour le recommencer contre de l\'essence, puis dépensez-la dans l\'arbre d\'essence.',
    br_honey: 'Miel', br_royal: 'Royal', br_fortune: 'Fortune', tree_req: 'Il faut {n} niveau {l}', tree_inf: 'Sans limite',
    es_tap: 'Pattes sucrées', es_tap_d: 'Récolte x1,2 par niveau', es_colony: 'Colonie prospère', es_colony_d: 'Bonus de colonie +0,1 par niveau (x1,5 jusqu\'à x2)', es_wisdom: 'Sagesse de la reine', es_wisdom_d: 'Compétences de la reine 5 % moins chères par niveau', es_fortune: 'Fortune', es_fortune_d: 'Effets dorés 5 % plus longs par niveau', es_map_d: 'Mondes 5 % moins chers en couronnes par niveau',
    tree_title: 'Arbres d’essence', tree_d: 'Un arbre par monde, payé avec l’essence de ce monde. Vendez un monde pour gagner son essence. Les améliorations sont permanentes et valent dans tous les mondes.', tree_locked: 'Ouvrez {w} et vendez-le pour gagner cette essence', tree_prog: '{a} / {b} terminés',
    es_blaze: 'Rayons dorés', es_blaze_d: 'Miel x1,15 par niveau', es_glow: 'Lueur lunaire', es_glow_d: 'Miel x1,1 par niveau', es_forge: 'Forge de braise', es_forge_d: 'Miel x1,25 par niveau', es_ash: 'Gelée de cendre', es_ash_d: 'Gelée royale x1,2 par niveau', es_tide: 'Marée nocturne', es_tide_d: 'Récolte x1,2 par niveau', es_heart: 'Cœur de lave', es_heart_d: 'Producteurs 2 % moins chers par niveau', es_kiln: 'Four à couronnes', es_kiln_d: '+10 % de couronnes à chaque couronnement par niveau',
    pr_head: 'Prime', pr_d: 'Terminez les cinq arbres, puis dépensez {v} de chaque essence. Vous gagnez un point Prime : miel x2 pour toujours, cumulable. Tout recommence depuis un seul monde neuf. Abeilles, noyaux, décors, tickets, niveau et passe restent.', pr_have: 'Points Prime : {n}  ·  miel x{x}', pr_need: 'Terminez d’abord chaque arbre ({a} / {b})', pr_btn: 'Devenir Prime',
    pr_title: 'Devenir Prime ?', pr_text: 'Mondes, couronnes, essences et arbres d’essence repartent de zéro. Abeilles, noyaux, décors, tickets, niveau et passe restent. Vous atteignez Prime {n} : miel x{x} pour toujours.', pr_go: 'Devenir Prime', pr_done: 'Prime atteint : miel x{x}'
  });

  const POS = { meadow: [330, 560, 290, 1190], dunes: [650, 300, 620, 940], glacier: [900, 610, 280, 700], moon: [1170, 290, 620, 460], ember: [1330, 640, 320, 240] };
  let ov = null, svg = null, sel = null, busy = false, tall = false, key = '', timer = 0;
  const X = w => POS[w.id][tall ? 2 : 0];
  const Y = w => POS[w.id][tall ? 3 : 1];

  function blob(rx, ry, seed) {
    const pts = [], N = 10;
    for (let i = 0; i < N; i++) { const a = i / N * Math.PI * 2, k = 0.82 + 0.18 * Math.abs(Math.sin(seed * 3.1 + i * 1.7)); pts.push([Math.cos(a) * rx * k, Math.sin(a) * ry * k]); }
    let d = '';
    for (let j = 0; j < N; j++) {
      const p0 = pts[(j - 1 + N) % N], p1 = pts[j], p2 = pts[(j + 1) % N], p3 = pts[(j + 2) % N];
      if (!j) d += 'M' + p1[0].toFixed(1) + ',' + p1[1].toFixed(1);
      d += 'C' + (p1[0] + (p2[0] - p0[0]) / 6).toFixed(1) + ',' + (p1[1] + (p2[1] - p0[1]) / 6).toFixed(1) + ' ' + (p2[0] - (p3[0] - p1[0]) / 6).toFixed(1) + ',' + (p2[1] - (p3[1] - p1[1]) / 6).toFixed(1) + ' ' + p2[0].toFixed(1) + ',' + p2[1].toFixed(1);
    }
    return d + 'Z';
  }
  function hex(r) { const p = []; for (let i = 0; i < 6; i++) { const a = Math.PI / 3 * i + Math.PI / 6; p.push((Math.cos(a) * r).toFixed(1) + ',' + (Math.sin(a) * r).toFixed(1)); } return 'M' + p.join('L') + 'Z'; }
  function deco(id) {
    let d = '';
    if (id === 'meadow') {
      [[-90, -30], [-50, 40], [70, -40], [100, 30], [-10, -70], [20, 70]].forEach((p, k) => { d += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="' + (14 + k % 3 * 4) + '" fill="#5E8E4C"/><circle cx="' + (p[0] - 4) + '" cy="' + (p[1] - 5) + '" r="' + (7 + k % 2 * 3) + '" fill="#86B66A"/>'; });
      for (let f = 0; f < 22; f++) d += '<circle cx="' + (Math.cos(f * 2.4) * (40 + f * 4)).toFixed(0) + '" cy="' + (Math.sin(f * 2.4) * (24 + f * 2.5)).toFixed(0) + '" r="3.5" fill="' + ['#F28C28', '#F5F3EF', '#E8A0B4', '#B79CD9'][f % 4] + '"/>';
    } else if (id === 'dunes') {
      d += '<path d="M-120,20 Q-60,-20 0,15 T120,5" fill="none" stroke="#D2A95E" stroke-width="8" stroke-linecap="round"/><path d="M-90,55 Q-30,25 40,52 T120,40" fill="none" stroke="#D2A95E" stroke-width="6" stroke-linecap="round"/>';
      [[-70, -40], [80, -30], [10, 60]].forEach(c => { d += '<path d="M' + c[0] + ',' + c[1] + 'v-34M' + c[0] + ',' + (c[1] - 18) + 'h-10v-10M' + c[0] + ',' + (c[1] - 24) + 'h10v-12" stroke="#5E8E4C" stroke-width="8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>'; });
    } else if (id === 'glacier') {
      [[-80, -10, 48], [-30, -40, 64], [30, -20, 52], [80, 10, 40], [0, 40, 36]].forEach(q => { d += '<path d="M' + (q[0] - q[2] / 2.4) + ',' + (q[1] + q[2] / 2) + 'L' + q[0] + ',' + (q[1] - q[2] / 1.4) + 'L' + (q[0] + q[2] / 2.4) + ',' + (q[1] + q[2] / 2) + 'Z" fill="#E6F1F7" stroke="#9DBCD0" stroke-width="3"/><path d="M' + q[0] + ',' + (q[1] - q[2] / 1.4) + 'L' + (q[0] + q[2] / 2.4) + ',' + (q[1] + q[2] / 2) + 'L' + (q[0] + 4) + ',' + (q[1] + q[2] / 2) + 'Z" fill="#BCD3E2"/>'; });
    } else if (id === 'moon') {
      [[-70, -20, 26], [40, -40, 18], [70, 30, 22], [-20, 45, 14]].forEach(c => { d += '<circle cx="' + c[0] + '" cy="' + c[1] + '" r="' + c[2] + '" fill="#2B2F4A" stroke="#4A4F7A" stroke-width="3"/>'; });
      [[-100, -70], [110, -60], [0, -90], [120, 60], [-120, 50]].forEach(q => { d += '<circle class="wm-tw" cx="' + q[0] + '" cy="' + q[1] + '" r="4"/>'; });
      [[-30, -5], [10, 20], [-60, 30]].forEach(m => { d += '<circle cx="' + m[0] + '" cy="' + m[1] + '" r="9" fill="#B48AE8" opacity="0.85"/><circle cx="' + m[0] + '" cy="' + m[1] + '" r="16" fill="#B48AE8" opacity="0.2"/>'; });
    } else {
      d += '<path d="M-70,50 L-10,-60 L10,-60 L70,50 Z" fill="#3B2622" stroke="#1E1210" stroke-width="3"/><path class="wm-lava" d="M-14,-60 L14,-60 L30,-20 L0,10 L-24,-24 Z" fill="#F28C28"/><ellipse class="wm-lava" cx="0" cy="-60" rx="16" ry="6" fill="#FFB347"/>';
      d += '<circle class="wm-smoke" cx="0" cy="-70" r="16"/><circle class="wm-smoke b" cx="4" cy="-70" r="14"/><circle class="wm-smoke c" cx="-4" cy="-70" r="18"/>';
      [[-100, 30], [100, 20]].forEach(r => { d += '<path d="M' + r[0] + ',' + r[1] + 'l20,-30l20,30z" fill="#4A2E28"/>'; });
    }
    return d;
  }

  function stateKey(s) { return [s.world, s.worldsOpen.join(','), BZ.WORLDS.map((w, i) => P.worldCrowns(s, i)).join(','), BZ.lang, innerHeight > innerWidth * 1.1].join('|'); }

  function build() {
    const s = BZ.Game.main;
    tall = innerHeight > innerWidth * 1.1;
    const VW = tall ? 900 : 1600, VH = tall ? 1600 : 900;
    svg.setAttribute('viewBox', tall ? '-20 -40 940 1760' : '-30 -40 1660 1060');
    let h = '<defs>';
    BZ.WORLDS.forEach((w, i) => { const sk = BZ.SKIN_BY_ID[w.theme]; h += '<linearGradient id="wml' + i + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + sk.hill[0] + '"/><stop offset="1" stop-color="' + sk.hill[2] + '"/></linearGradient>'; });
    h += '<radialGradient id="wmsea" cx="50%" cy="45%" r="75%"><stop offset="0" stop-color="#1F5A66"/><stop offset="1" stop-color="#0B2229"/></radialGradient><radialGradient id="wmglow"><stop offset="0" stop-color="#F28C28" stop-opacity="0.55"/><stop offset="1" stop-color="#F28C28" stop-opacity="0"/></radialGradient></defs>';
    h += '<rect x="-3000" y="-3000" width="' + (VW + 6000) + '" height="' + (VH + 6000) + '" fill="#0B2229"/><rect x="-600" y="-600" width="' + (VW + 1200) + '" height="' + (VH + 1200) + '" fill="url(#wmsea)"/><g class="wm-cam" id="wmCam">';
    for (let r = -6; r < VH / 100 + 6; r++) for (let c = -4; c < VW / 280 + 4; c++) h += '<path class="wm-wave" style="animation-delay:-' + ((r * 6 + c) % 7) + 's" d="M' + (60 + c * 280 + (r % 2) * 140) + ',' + (60 + r * 100) + 'q20,-12 40,0t40,0"/>';
    h += '<path class="wm-route" d="M' + BZ.WORLDS.map(w => X(w) + ',' + Y(w)).join(' L') + '"/>';
    const opened = BZ.WORLDS.filter((w, i) => s.worldsOpen.includes(i));
    if (opened.length > 1) h += '<path class="wm-route done" d="M' + opened.map(w => X(w) + ',' + Y(w)).join(' L') + '"/>';
    BZ.WORLDS.forEach((w, i) => {
      const open = s.worldsOpen.includes(i);
      const sk = BZ.SKIN_BY_ID[w.theme];
      h += '<g class="wm-isle' + (open ? '' : ' locked') + (sel === i ? ' sel' : '') + (sel !== null && sel !== i ? ' dim' : '') + '" data-i="' + i + '" transform="translate(' + X(w) + ' ' + Y(w) + ')' + (tall ? ' scale(0.95)' : '') + '">';
      h += '<circle class="wm-glow" r="230" fill="url(#wmglow)"/>';
      if (i === s.world) h += '<circle class="wm-here" r="175"/>';
      h += '<g class="wm-body"><path d="' + blob(175, 125, i + 1) + '" fill="#F5E6C8" opacity="0.9" transform="scale(1.07)"/><path d="' + blob(175, 125, i + 1) + '" fill="#EBD3A5" transform="scale(1.03)"/><g class="wm-land"><path d="' + blob(175, 125, i + 1) + '" fill="url(#wml' + i + ')"/>' + deco(w.id) + '</g>';
      if (open) h += '<path d="' + hex(26) + '" fill="' + sk.comb + '" stroke="#20252B" stroke-opacity="0.4" stroke-width="3"/><path d="' + hex(10) + '" fill="#fff" opacity="0.55"/>';
      else h += '<g transform="translate(-22 -22) scale(1.8)" fill="none" stroke="#F5F3EF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + BZ.ICONS.lock + '</g>';
      h += '</g>';
      const label = n(w.name);
      const sub = open ? (i === s.world ? t('wm_here') + '  ·  ' : '') + t('wm_crowns', { v: F.int(P.worldCrowns(s, i)) }) : t('wm_toopen', { v: F.int(P.worldCost(s, i)) });
      const lw = Math.max(label.length * 13, sub.length * 9) + 44;
      h += '<g class="wm-flag" transform="translate(0 150)' + (tall ? ' scale(1.35)' : '') + '"><rect x="' + (-lw / 2) + '" y="0" width="' + lw + '" height="64" rx="18"/><text text-anchor="middle" y="28">' + esc(label) + '</text><text class="sub" text-anchor="middle" y="50">' + esc(sub) + '</text></g></g>';
    });
    h += '<g id="wmBee" style="display:none"><ellipse cx="-6" cy="-12" rx="9" ry="13" fill="#F5F3EF" opacity="0.9"/><ellipse cx="6" cy="-12" rx="8" ry="12" fill="#F5F3EF" opacity="0.9"/><ellipse cx="0" cy="0" rx="20" ry="14" fill="#F2C14E"/><rect x="-8" y="-14" width="5" height="28" fill="#20252B"/><rect x="3" y="-14" width="5" height="28" fill="#20252B"/><circle cx="20" cy="-2" r="9" fill="#20252B"/></g>';
    for (let k = 0; k < 5; k++) h += '<ellipse class="wm-cloud" style="animation-delay:-' + (k * 12) + 's;animation-duration:' + (50 + k * 8) + 's" cx="0" cy="' + (90 + k * (VH / 5.3)) + '" rx="' + (160 + k * 20) + '" ry="40"/>';
    h += '</g>';
    svg.innerHTML = h;
    svg.querySelectorAll('.wm-isle').forEach(g => g.addEventListener('click', e => { e.stopPropagation(); select(+g.dataset.i); }));
    key = stateKey(s);
    camTo(sel, sel === null ? 1 : 1.45, true);
    chip();
  }

  function camTo(i, z, instant) {
    const cam = ov && ov.querySelector('#wmCam');
    if (!cam) return;
    if (instant) { cam.style.transition = 'none'; requestAnimationFrame(() => { cam.style.transition = ''; }); }
    if (i === null) { cam.style.transform = ''; return; }
    const w = BZ.WORLDS[i];
    const cx = tall ? 450 : 800, cy = tall ? 700 : 430;
    cam.style.transform = 'translate(' + (cx - X(w) * z) + 'px,' + (cy - Y(w) * z) + 'px) scale(' + z + ')';
  }

  function cardHtml(i) {
    const s = BZ.Game.main;
    const w = BZ.WORLDS[i];
    const sk = BZ.SKIN_BY_ID[w.theme];
    const open = s.worldsOpen.includes(i);
    let h = '<div class="wm-hd"><span class="wm-sw" style="background:linear-gradient(180deg,' + sk.sky[0] + ',' + sk.sky[1] + ' 55%,' + sk.hill[0] + ' 56%,' + sk.hill[2] + ')"><i style="background:' + sk.comb + '"></i></span><div><h3>' + esc(n(w.name)) + '</h3><div class="wm-tw2">' + t('wd_' + w.id) + '</div></div><button class="wm-x" data-wm="close">' + ic('close') + '</button></div>';
    if (open) {
      const info = P.worldInfo(s, i);
      h += '<div class="wm-stats"><div><small>' + t('wd_hps') + '</small><b>' + F.num(info.hps) + '/s</b></div><div><small>' + t('wd_crowns') + '</small><b>' + F.int(info.crowns) + '</b></div><div><small>' + t('wd_life') + '</small><b>' + F.num(info.lifetime) + '</b></div><div><small>' + t('wd_rj') + '</small><b>' + F.num(info.rj, { int: true }) + '</b></div></div>';
      const sv = P.sellValue(s, i);
      h += '<div class="wm-acts">' + (i === s.world ? '<button class="btn btn-primary off">' + ic('check') + t('wm_here') + '</button>' : '<button class="btn btn-primary" data-wm="go">' + ic('globe') + t('wm_travel') + '</button>') + '<button class="btn btn-outline' + (sv < 1 ? ' off' : '') + '" data-wm="sell">' + ic(BZ.ESSENCES[i].icon) + t('sell_other', { v: F.int(sv) + ' ' + P.essName(i) }) + '</button></div>';
      if (sv < 1) h += '<p class="wm-line">' + t('sell_need', { v: BZ.SELL_MIN }) + '</p>';
    } else {
      const next = i === s.worldsOpen.length;
      const prev = BZ.WORLDS[i - 1];
      const cost = P.worldCost(s, i);
      h += '<p class="wm-line">' + ic('lock') + (next ? t('wm_openwith', { v: F.int(cost), w: n(prev.name) }) : t('wm_needprev', { w: n(prev.name) })) + '</p>';
      h += '<div class="wm-acts"><button class="btn btn-primary' + (next && P.canOpenWorld(s, i) ? '' : ' off') + '" data-wm="open">' + ic('crown') + t('wm_open', { v: F.int(cost) }) + '</button></div>';
    }
    return h;
  }

  function select(i) {
    if (busy) return;
    sel = i;
    ov.querySelectorAll('.wm-isle').forEach(g => { const k = +g.dataset.i; g.classList.toggle('sel', k === i); g.classList.toggle('dim', i !== null && k !== i); });
    ov.querySelector('.wm-hint').style.opacity = i === null ? 1 : 0;
    camTo(i, i === null ? 1 : 1.45);
    const card = ov.querySelector('.wm-card');
    if (i === null) { card.classList.remove('on'); return; }
    card.innerHTML = cardHtml(i);
    card.classList.add('on');
    BZ.Audio.play('click');
  }

  let tw = 0;
  function treeHtml() {
    const s = BZ.Game.main;
    const e = BZ.ESSENCES[tw], have = s.ess[tw] || 0;
    let h = '<div class="wm-th"><div><h2>' + t('tree_title') + '</h2><small>' + t('tree_d') + '</small></div><button class="wm-x" data-wm="treeclose">' + ic('close') + '</button></div>';
    h += '<div class="wm-etabs">' + BZ.ESSENCES.map((x, i) => '<button class="wm-etab' + (i === tw ? ' on' : '') + (s.worldsOpen.includes(i) ? '' : ' lk') + (P.treeDoneCount(s, i) === P.treeCount(s, i) ? ' done' : '') + '" data-wm="tw" data-i="' + i + '" style="--ec:' + x.color + '" title="' + esc(n(x.name)) + '">' + ic(x.icon) + '<b>' + F.int(s.ess[i] || 0) + '</b><small>' + P.treeDoneCount(s, i) + ' / ' + P.treeCount(s, i) + '</small></button>').join('') + '</div>';
    h += '<div class="wm-ess-big" style="--ec:' + e.color + '">' + ic(e.icon) + '<b>' + F.int(have) + '</b><span>' + esc(n(e.name)) + '</span><small>' + t('tree_prog', { a: P.treeDoneCount(s, tw), b: P.treeCount(s, tw) }) + '</small></div>';
    if (!s.worldsOpen.includes(tw) && !have) h += '<p class="wm-line">' + ic('lock') + t('tree_locked', { w: n(BZ.WORLDS[tw].name) }) + '</p>';
    h += '<div class="wm-tree" style="--ec:' + e.color + '">';
    BZ.ESSENCE_SHOP.filter(x => x.w === tw).forEach(x => {
      const lvl = P.essLvl(s, x.id);
      const ok = P.essReqMet(s, x.id);
      const max = P.essMaxed(s, x.id);
      const cost = P.essCost(s, x.id);
      const can = ok && !max && have >= cost;
      h += '<div class="wm-node' + (ok ? '' : ' locked') + (lvl ? ' has' : '') + (max ? ' max' : '') + '"><div class="top"><span class="nic">' + ic(ok ? x.icon : 'lock') + '</span><div><b>' + t('es_' + x.id) + '</b><small>' + t('level', { n: lvl }) + ' / ' + x.max + '</small></div></div><p>' + t('es_' + x.id + '_d') + '</p>';
      if (!ok) h += '<small class="req">' + t('tree_req', { n: t('es_' + x.req[0]), l: x.req[1] }) + '</small>';
      else h += '<small class="eff">' + t('es_now', { a: effect(x.id, lvl) }) + (max ? '' : '  ·  ' + t('es_next', { a: effect(x.id, lvl + 1) })) + '</small>' + (max ? '<button class="btn btn-outline btn-sm off">' + ic('check') + t('ess_max') + '</button>' : '<button class="btn btn-sm ' + (can ? 'btn-primary' : 'btn-outline off') + '" data-wm="buy" data-id="' + x.id + '">' + ic(e.icon) + F.int(cost) + '</button>');
      h += '</div>';
    });
    h += '</div>';
    const pc = P.primeCost(s), can = P.canPrime(s), pr = s.prime || 0;
    h += '<div class="wm-prime' + (can ? ' ready' : '') + '"><div class="top"><span class="nic">' + ic('prime') + '</span><div><b>' + t('pr_head') + '</b><small>' + t('pr_have', { n: pr, x: F.int(Math.pow(2, pr)) }) + '</small></div></div><p>' + t('pr_d', { v: F.int(pc) }) + '</p>';
    h += '<div class="wm-pcost">' + BZ.ESSENCES.map((x, i) => '<span class="' + ((s.ess[i] || 0) >= pc ? 'ok' : '') + '" style="--ec:' + x.color + '" title="' + esc(n(x.name)) + '">' + ic(x.icon) + F.int(s.ess[i] || 0) + ' / ' + F.int(pc) + '</span>').join('') + '</div>';
    if (!P.treeDone(s)) h += '<small class="req">' + t('pr_need', { a: P.treeDoneCount(s), b: P.treeCount(s) }) + '</small>';
    h += '<button class="btn ' + (can ? 'btn-primary' : 'btn-outline off') + '" data-wm="prime">' + ic('prime') + t('pr_btn') + '</button></div>';
    return h;
  }
  function chip() {
    const s = BZ.Game.main, e = BZ.ESSENCES[s.world] || BZ.ESSENCES[0], c = ov.querySelector('.wm-chip');
    c.style.setProperty('--ec', e.color);
    c.title = n(e.name);
    c.innerHTML = ic(e.icon) + '<span id="wmEss">' + F.int(s.ess[s.world] || 0) + '</span>';
  }
  function effect(id, lvl) {
    const x = BZ.ESS_BY_ID[id];
    switch (id) {
      case 'honey': case 'jelly': case 'tap': case 'blaze': case 'glow': case 'forge': case 'ash': case 'tide': return 'x' + F.num(Math.pow(1 + x.v, lvl), { small: true });
      case 'lucky': case 'tickets': case 'fortune': return '+' + F.pct(x.v * lvl);
      case 'kiln': return '+' + F.pct(x.v * lvl);
      case 'wisdom': case 'map': case 'heart': return '-' + F.pct(x.v * lvl);
      case 'nap': return '+' + (x.v * lvl) + ' h';
      case 'start': return F.int(lvl ? x.v[lvl - 1] : 0);
      case 'colony': return 'x' + F.num(BZ.COLONY_MULT + x.v * lvl, { small: true });
      default: return '+' + (x.v * lvl);
    }
  }
  function renderTree() { const el = ov.querySelector('.wm-treep'); el.innerHTML = treeHtml(); }

  function travel(i) {
    const s = BZ.Game.main;
    busy = true;
    ov.querySelector('.wm-card').classList.remove('on');
    ov.querySelectorAll('.wm-isle').forEach(g => g.classList.remove('dim', 'sel'));
    camTo(null);
    const a = BZ.WORLDS[s.world], b = BZ.WORLDS[i], bee = ov.querySelector('#wmBee');
    bee.style.display = '';
    BZ.Audio.play('luckySpawn');
    const t0 = performance.now(), dur = 1600;
    const step = now => {
      const k = Math.min(1, (now - t0) / dur), e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
      const x = X(a) + (X(b) - X(a)) * e, y = Y(a) + (Y(b) - Y(a)) * e - Math.sin(e * Math.PI) * 120;
      bee.setAttribute('transform', 'translate(' + x + ' ' + y + ') scale(' + (X(b) < X(a) ? -1.6 : 1.6) + ' 1.6)');
      if (k < 1) requestAnimationFrame(step);
      else arrive(i);
    };
    requestAnimationFrame(step);
  }
  function arrive(i) {
    camTo(i, 2.6);
    setTimeout(() => {
      const fl = ov.querySelector('.wm-flash');
      fl.querySelector('b').textContent = n(BZ.WORLDS[i].name);
      fl.classList.add('on');
      setTimeout(() => {
        sel = null;
        UI.closeMap(true);
        BZ.Game.travel(i);
        busy = false;
        setTimeout(() => fl.classList.remove('on'), 250);
      }, 700);
    }, 900);
  }

  function onClick(e) {
    const el = e.target.closest('[data-wm]');
    if (!el) return;
    e.stopPropagation();
    const a = el.dataset.wm;
    const G = BZ.Game;
    if (a === 'close') select(null);
    else if (a === 'back') UI.closeMap();
    else if (a === 'go' && sel !== null) travel(sel);
    else if (a === 'sell' && sel !== null) G.askSell(sel);
    else if (a === 'open' && sel !== null) G.openWorld(sel);
    else if (a === 'tw') { tw = +el.dataset.i; renderTree(); BZ.Audio.play('click'); }
    else if (a === 'prime') G.askPrime();
    else if (a === 'tree') { tw = G.main.world || 0; renderTree(); ov.querySelector('.wm-treep').classList.add('on'); BZ.Audio.play('click'); }
    else if (a === 'treeclose') ov.querySelector('.wm-treep').classList.remove('on');
    else if (a === 'buy') { G.buyEss(el.dataset.id); renderTree(); chip(); }
    else if (a === 'help') UI.modal('<div class="hero"><div class="pic">' + ic('globe') + '</div></div><p style="text-align:center;line-height:1.6">' + t('wm_how', { m: BZ.SELL_MIN }) + '</p><div class="row center"><button class="btn btn-primary" data-close>' + t('ok') + '</button></div>', true);
  }

  function ensure() {
    if (ov) return;
    ov = document.createElement('div');
    ov.className = 'wm-ov';
    ov.innerHTML = '<svg class="wm-world" preserveAspectRatio="xMidYMid meet"></svg><div class="wm-top"><button class="wm-back" data-wm="back"><span class="arr"></span><span class="lbl"></span></button><h1></h1><button class="help-btn wm-help" data-wm="help">' + ic('info') + '</button><span class="sp"></span><span class="wm-chip">' + ic('sparkle') + '<span id="wmEss">0</span></span><button class="wm-treeb" data-wm="tree">' + ic('star') + '<span class="lbl"></span></button></div><div class="wm-hint"></div><div class="wm-card"></div><div class="wm-treep"></div><div class="wm-flash"><div><small></small><b></b></div></div>';
    document.getElementById('app').appendChild(ov);
    svg = ov.querySelector('.wm-world');
    ov.addEventListener('click', onClick);
    svg.addEventListener('click', () => { if (!busy) select(null); });
    addEventListener('resize', () => { if (ov.classList.contains('on') && !busy) build(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && ov.classList.contains('on') && !UI.modalOpen()) UI.closeMap(); });
  }
  function texts() {
    ov.querySelector('.wm-back .lbl').textContent = t('wm_back');
    ov.querySelector('.wm-back .arr').innerHTML = '<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 6l-6 6 6 6"/></svg>';
    ov.querySelector('.wm-top h1').textContent = t('map_title');
    ov.querySelector('.wm-treeb .lbl').textContent = t('tree_title');
    ov.querySelector('.wm-hint').textContent = t('wm_hint');
    ov.querySelector('.wm-flash small').textContent = t('wm_welcome');
  }

  UI.mapOpen = () => !!(ov && ov.classList.contains('on'));
  UI.openMap = function () {
    ensure();
    texts();
    sel = null;
    build();
    ov.querySelector('.wm-card').classList.remove('on');
    ov.querySelector('.wm-treep').classList.remove('on');
    ov.querySelector('.wm-hint').style.opacity = 1;
    document.getElementById('app').classList.add('map-away');
    void ov.offsetWidth;
    ov.classList.add('on');
    BZ.Audio.play('click');
    clearInterval(timer);
    timer = setInterval(() => {
      if (!UI.mapOpen() || busy) return;
      const s = BZ.Game.main;
      if (stateKey(s) !== key) { build(); if (sel !== null) ov.querySelector('.wm-card').innerHTML = cardHtml(sel); }
      else if (sel !== null && !UI.modalOpen()) ov.querySelector('.wm-card').innerHTML = cardHtml(sel);
      chip();
    }, 1000);
  };
  UI.closeMap = function () {
    if (!ov) return;
    ov.classList.remove('on');
    document.getElementById('app').classList.remove('map-away');
    clearInterval(timer);
  };

  const origShow = UI.show;
  UI.show = function (p) {
    if (p === 'worlds' && P.unlocked(BZ.Game.main, 'worlds')) { UI.openMap(); return; }
    if (UI.mapOpen()) UI.closeMap();
    origShow(p);
  };
})(window);
