(function (root) {
  const BZ = root.BZ;
  const UI = BZ.UI, t = BZ.t, ic = BZ.icon;

  BZ.addStrings({
    gd_tab: 'How to play', gd_bar_d: 'Your path from a tiny hive to Prime', gd_kicker: 'Your path to the top', gd_title: 'How to play',
    gd_here: 'You are here', gd_step: 'Step {n} of {m}', gd_next: 'Next', gd_back: 'Back', gd_go: 'Let’s buzz!', gd_hide: 'Hide',
    gd_1_t: 'Make honey', gd_1_d: 'Tap the comb, buy producers and grab every upgrade you can. Catch the golden lucky bees flying by for big bonuses.', gd_1_g: 'Goal: grow the hive',
    gd_2_t: 'Swarm', gd_2_d: 'When the hive is big enough, start a new swarm from the Queen tab. Your honey restarts, but you earn royal jelly that boosts all your production. Spend it on queen skills.', gd_2_g: 'Goal: stack royal jelly',
    gd_3_t: 'Get crowned', gd_3_d: 'With enough royal jelly, crown your queen. Jelly and skills reset, but crowns stay forever, unlock perks and open new worlds.', gd_3_g: 'Goal: collect crowns',
    gd_4_t: 'Explore worlds', gd_4_d: 'Every world has its own twist, its own honey and its own crowns. The crowns of one world open the next one on the map.', gd_4_g: 'Goal: open all five worlds',
    gd_5_t: 'Sell for essence', gd_5_d: 'Sell a world with at least 5 of its crowns to restart it for essence. Each world has its own essence and its own tree of permanent upgrades.', gd_5_g: 'Goal: complete the five trees',
    gd_6_t: 'Become Prime', gd_6_d: 'Complete every tree, gather 50,000 of each essence and find a Prime stone on a red lucky bee. Become Prime for honey x2 forever, then climb again, faster.', gd_6_g: 'Goal: Prime, then Prime again',
    gd_7_t: 'Along the way', gd_7_d: 'Hatch bees and hive cores with your tickets, keep your daily streak, fill the free pass and climb the weekly league with other players.', gd_7_g: 'Goal: have fun'
  }, {
    gd_tab: 'Comment jouer', gd_bar_d: 'Votre route, de la petite ruche à Prime', gd_kicker: 'Votre route vers le sommet', gd_title: 'Comment jouer',
    gd_here: 'Vous êtes ici', gd_step: 'Étape {n} sur {m}', gd_next: 'Suivant', gd_back: 'Retour', gd_go: 'C’est parti !', gd_hide: 'Masquer',
    gd_1_t: 'Faites du miel', gd_1_d: 'Touchez le rayon, achetez des producteurs et prenez toutes les améliorations possibles. Attrapez les abeilles dorées qui passent pour de gros bonus.', gd_1_g: 'Objectif : faire grandir la ruche',
    gd_2_t: 'Essaimez', gd_2_d: 'Quand la ruche est assez grande, lancez un nouvel essaim depuis l’onglet Reine. Le miel repart de zéro, mais vous gagnez de la gelée royale qui booste toute la production. Dépensez-la en compétences de la reine.', gd_2_g: 'Objectif : accumuler de la gelée royale',
    gd_3_t: 'Faites-vous couronner', gd_3_d: 'Avec assez de gelée royale, couronnez votre reine. La gelée et les compétences repartent de zéro, mais les couronnes restent pour toujours, débloquent des atouts et ouvrent de nouveaux mondes.', gd_3_g: 'Objectif : réunir des couronnes',
    gd_4_t: 'Explorez les mondes', gd_4_d: 'Chaque monde a sa particularité, son propre miel et ses propres couronnes. Les couronnes d’un monde ouvrent le suivant sur la carte.', gd_4_g: 'Objectif : ouvrir les cinq mondes',
    gd_5_t: 'Vendez pour de l’essence', gd_5_d: 'Vendez un monde avec au moins 5 de ses couronnes pour le recommencer contre de l’essence. Chaque monde a sa propre essence et son propre arbre d’améliorations permanentes.', gd_5_g: 'Objectif : terminer les cinq arbres',
    gd_6_t: 'Devenez Prime', gd_6_d: 'Terminez tous les arbres, réunissez 50 000 de chaque essence et trouvez une pierre Prime sur une abeille dorée rouge. Devenez Prime pour un miel x2 pour toujours, puis remontez, plus vite.', gd_6_g: 'Objectif : Prime, puis encore Prime',
    gd_7_t: 'En chemin', gd_7_d: 'Faites éclore abeilles et noyaux avec vos tickets, gardez votre série du jour, remplissez le pass gratuit et grimpez dans la ligue de la semaine avec d’autres joueurs.', gd_7_g: 'Objectif : s’amuser'
  });

  const STEPS = [
    { icon: 'drop', c: '#F2B233' }, { icon: 'swarm', c: '#F28C28' }, { icon: 'crown', c: '#E0A526' }, { icon: 'globe', c: '#527C82' },
    { icon: 'sparkle', c: '#9C7BE0' }, { icon: 'prime', c: '#F0509E' }, { icon: 'ticket', c: '#6BC496' }
  ];

  function here(s) {
    const P = BZ.P;
    if ((s.prime || 0) > 0 || P.treeDone(s)) return 5;
    if ((s.essenceTotal || 0) > 0) return 4;
    if (s.worldsOpen.length > 1) return 3;
    if ((s.crowns || 0) + (s.crownsSpent || 0) > 0 || (s.coronations || 0) > 0) return 2;
    if ((s.swarms || 0) > 0 || (s.rjLife || 0) > 0) return 1;
    return 0;
  }

  let cur = 0;
  function body(s) {
    const st = STEPS[cur], h0 = here(s), last = cur === STEPS.length - 1;
    let h = '<div class="gd-hero"><small>' + t('gd_kicker') + '</small><h4>' + t('gd_title') + '</h4></div>';
    h += '<div class="gd-path">' + STEPS.map((x, i) => '<button class="gd-dot' + (i === cur ? ' on' : '') + (i < h0 ? ' done' : '') + (i === h0 ? ' here' : '') + '" style="--gc:' + x.c + '" data-gd="go" data-i="' + i + '" title="' + t('gd_' + (i + 1) + '_t') + '">' + ic(x.icon) + '</button>').join('<i class="gd-line' + '"></i>') + '</div>';
    h += '<div class="gd-card" style="--gc:' + st.c + '"><div class="gd-big">' + ic(st.icon) + '</div><div class="gd-meta"><small>' + t('gd_step', { n: cur + 1, m: STEPS.length }) + '</small>' + (cur === h0 ? '<span class="gd-here">' + ic('star') + t('gd_here') + '</span>' : '') + '</div><h5>' + t('gd_' + (cur + 1) + '_t') + '</h5><p>' + t('gd_' + (cur + 1) + '_d') + '</p><span class="gd-goal">' + ic('check') + t('gd_' + (cur + 1) + '_g') + '</span></div>';
    h += '<div class="row gd-nav"><button class="btn btn-ghost' + (cur ? '' : ' off') + '" data-gd="prev">' + t('gd_back') + '</button><button class="btn btn-primary" data-gd="' + (last ? 'done' : 'next') + '">' + (last ? ic('play') + t('gd_go') : t('gd_next')) + '</button></div>';
    return h;
  }
  function draw() {
    const m = document.querySelector('#modal .modal.gd-modal');
    if (m) m.innerHTML = body(BZ.Game.main);
  }
  UI.guide = function () {
    const s = BZ.Game.main;
    cur = here(s);
    if (!s.flags.guideHidden) { s.flags.guideHidden = 1; s._dirty = true; BZ.Game.save(); }
    UI.modal(body(s), true);
    const m = document.querySelector('#modal .modal');
    if (m) m.classList.add('gd-modal');
    BZ.Audio.play('click');
    if (UI.extFrame) UI.extFrame(Date.now());
  };
  UI.guideTabHtml = () => '<span class="wn-tab gd-tab" id="gdTab" style="display:none"><button class="wn-open" data-gd="open" title="' + t('gd_tab') + '">' + ic('star') + '<span class="tl">' + t('gd_tab') + '</span></button><button class="wn-x" data-gd="x" title="' + t('gd_hide') + '">' + ic('close') + '</button></span>';
  UI.guideBarHtml = () => '<div class="wn-bar gd-bar" id="gdBar" style="display:none"><button class="slide wn-slide" data-gd="open"><span class="spic">' + ic('star') + '</span><span class="stxt"><b>' + t('gd_tab') + '</b><small>' + t('gd_bar_d') + '</small></span></button><button class="wn-x" data-gd="x" title="' + t('gd_hide') + '">' + ic('close') + '</button></div>';

  document.addEventListener('click', e => {
    const el = e.target.closest('[data-gd]');
    if (!el) return;
    e.stopPropagation();
    const a = el.dataset.gd;
    if (a === 'open') return UI.guide();
    if (a === 'x') { const s = BZ.Game.main; s.flags.guideHidden = 1; s._dirty = true; BZ.Game.save(); BZ.Audio.play('click'); if (UI.extFrame) UI.extFrame(Date.now()); return; }
    if (a === 'next' && cur < STEPS.length - 1) cur++;
    else if (a === 'prev' && cur > 0) cur--;
    else if (a === 'go') cur = +el.dataset.i;
    else if (a === 'done') { UI.closeModal(); return; }
    BZ.Audio.play('click');
    draw();
  });
})(window);
