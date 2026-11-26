(function (root) {
  const BZ = root.BZ;
  const E = BZ.E, F = BZ.F, P = BZ.P, UI = BZ.UI, t = BZ.t, n = BZ.n, ic = BZ.icon;
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  BZ.addStrings({
    tab_stats: 'Stats', pass_season: 'Weekly pass', pass_how: 'The pass is free and starts over every Monday. Every action fills it: buying, lucky bees, ticket bees, quests, swarms and hatching.',
    mind_locked: 'Needs {n} crowns',
    map_title: 'World map', map_hint: 'Tap a world to see it', wd_hps: 'Honey per second', wd_crowns: 'Crowns', wd_life: 'Honey made', wd_rj: 'Royal jelly', wd_closed: 'Not open yet',
    sell_other: 'Sell  ·  +{v}', sell_title_w: 'Sell {w}?',
    ess_title: 'Essence shop', ess_have: '{v} essence', ess_total: '{v} earned in total', ess_how: 'Sell a world with at least {m} crowns to earn essence. Essence upgrades last forever and work in every world.', ess_max: 'Max',
    es_honey: 'Ancient honey', es_honey_d: 'x1.25 honey per level in every world', es_jelly: 'Royal roots', es_jelly_d: 'x1.15 royal jelly per level', es_lucky: 'Lucky aura', es_lucky_d: 'Lucky bees 5% more often per level', es_tickets: 'Ticket nest', es_tickets_d: 'Ticket bees 10% more often per level', es_nap: 'Deep sleep', es_nap_d: '+2 h away earnings per level', es_start: 'Quick colony', es_start_d: 'Each swarm starts with some of the first 10 producers', es_map: 'Cartographer', es_map_d: 'Worlds cost 10% fewer crowns per level', es_slot: 'Core socket', es_slot_d: 'One more core slot per level', es_crown: 'Crown memory', es_crown_d: 'One more crown at every coronation per level',
    es_now: 'Now {a}', es_next: 'Next {a}', sr_prime: 'Prime', st_prime: 'Prime points',
    st_title: 'Stats', st_hpsT: 'Honey per second', st_total: 'Total', st_tap: 'Tap power', st_luckyF: 'Lucky bee frequency', st_luckyD: 'Lucky effect duration', st_luckyI: 'A lucky bee every {a} to {b}', st_rjgain: 'Royal jelly per swarm', st_away: 'Away earnings limit', st_cost: 'Producer prices', st_general: 'General', st_prod_note: 'Producers also get x2 at each milestone and from their own upgrades.',
    sr_upg: 'Upgrades', sr_rj: 'Royal jelly', sr_ach: 'Trophies', sr_decree: 'Royal decree', sr_crowns: 'Crowns', sr_bees: 'Bees', sr_colony: 'Colony level', sr_level: 'Player level', sr_ess: 'Essence shop', sr_world: 'World twist', sr_skins: 'Hive skins', sr_cores: 'Hive cores', sr_bless: 'Blessings', sr_boosts: 'Active boosts', sr_queen: 'Queen skills', sr_perk: 'Crown perks', sr_combo: 'Max combo', sr_base: 'Base',
    help: 'How it works', pull_all: 'Hatch all', workshop_how: 'Core tickets summon hive cores. Equip them in your slots for lasting bonuses; copies level them up. Skin parts drop from treasure chests on lucky bees, level rewards, the streak and the pass. Every skin you own gives +3% honey, and the skin in use adds its own bonus everywhere. Skins show in the Flower meadow, other worlds keep their own look.', rk_help: 'Rankings count every world and refresh every minute. Every Monday you get tickets for your best rank in any ranking, once at least 5 players are ranked.',
    ab_tag: 'A cozy idle honey tycoon', ab_f1: 'Build a hive empire with 20 producers', ab_f2: 'Hatch bees and hive cores', ab_f3: 'Open worlds with their own twist', ab_f4: 'Weekly leagues and rankings', ab_f5: 'Daily streak, quests and a free pass', ab_f6: 'Free, in your browser', ab_made: 'Made by NovaFox', ab_visit: 'Visit NovaFox', ab_source: 'Source code'
  }, {
    tab_stats: 'Stats', pass_season: 'Pass de la semaine', pass_how: 'Le pass est gratuit et recommence chaque lundi. Chaque action le remplit : achats, abeilles dorées, abeilles à ticket, quêtes, essaims et éclosions.',
    mind_locked: 'Il faut {n} couronnes',
    map_title: 'Carte des mondes', map_hint: 'Touchez un monde pour le voir', wd_hps: 'Miel par seconde', wd_crowns: 'Couronnes', wd_life: 'Miel produit', wd_rj: 'Gelée royale', wd_closed: 'Pas encore ouvert',
    sell_other: 'Vendre  ·  +{v}', sell_title_w: 'Vendre {w} ?',
    ess_title: 'Boutique d\'essence', ess_have: '{v} essences', ess_total: '{v} gagnées au total', ess_how: 'Vendez un monde avec au moins {m} couronnes pour gagner de l\'essence. Les améliorations d\'essence sont permanentes et valent dans tous les mondes.', ess_max: 'Max',
    es_honey: 'Miel ancien', es_honey_d: 'Miel x1,25 par niveau dans tous les mondes', es_jelly: 'Racines royales', es_jelly_d: 'Gelée royale x1,15 par niveau', es_lucky: 'Aura dorée', es_lucky_d: 'Abeilles dorées 5 % plus fréquentes par niveau', es_tickets: 'Nid à tickets', es_tickets_d: 'Abeilles à ticket 10 % plus fréquentes par niveau', es_nap: 'Sommeil profond', es_nap_d: '+2 h de gains en absence par niveau', es_start: 'Colonie rapide', es_start_d: 'Chaque essaim démarre avec des 10 premiers producteurs', es_map: 'Cartographe', es_map_d: 'Mondes 10 % moins chers en couronnes par niveau', es_slot: 'Emplacement de noyau', es_slot_d: 'Un emplacement de noyau en plus par niveau', es_crown: 'Mémoire de la couronne', es_crown_d: 'Une couronne de plus à chaque couronnement par niveau',
    es_now: 'Actuel {a}', es_next: 'Suivant {a}', sr_prime: 'Prime', st_prime: 'Points Prime',
    st_title: 'Statistiques', st_hpsT: 'Miel par seconde', st_total: 'Total', st_tap: 'Récolte par toucher', st_luckyF: 'Fréquence des abeilles dorées', st_luckyD: 'Durée des effets dorés', st_luckyI: 'Une abeille dorée toutes les {a} à {b}', st_rjgain: 'Gelée royale par essaim', st_away: 'Limite des gains en absence', st_cost: 'Prix des producteurs', st_general: 'Général', st_prod_note: 'Les producteurs gagnent aussi x2 à chaque palier et grâce à leurs propres améliorations.',
    sr_upg: 'Améliorations', sr_rj: 'Gelée royale', sr_ach: 'Trophées', sr_decree: 'Décret royal', sr_crowns: 'Couronnes', sr_bees: 'Abeilles', sr_colony: 'Niveau de colonie', sr_level: 'Niveau du joueur', sr_ess: 'Boutique d\'essence', sr_world: 'Particularité du monde', sr_skins: 'Décors', sr_cores: 'Noyaux', sr_bless: 'Bénédictions', sr_boosts: 'Bonus actifs', sr_queen: 'Compétences de la reine', sr_perk: 'Avantages de couronne', sr_combo: 'Combo maximum', sr_base: 'Base',
    help: 'Comment ça marche', pull_all: 'Tout éclore', workshop_how: 'Les tickets de noyau invoquent des noyaux de ruche. Équipez-les pour des bonus durables ; les doublons les améliorent. Les pièces de décor tombent des coffres des abeilles dorées, des récompenses de niveau, de la série et du pass. Chaque décor possédé donne +3 % de miel, et le décor utilisé ajoute son propre bonus partout. Les décors s\'affichent dans la Prairie fleurie, les autres mondes gardent leur propre style.', rk_help: 'Les classements comptent tous les mondes et se mettent à jour chaque minute. Chaque lundi, vous recevez des tickets selon votre meilleur rang, dès que 5 joueurs sont classés.',
    ab_tag: 'Un jeu idle de miel tout doux', ab_f1: 'Bâtissez un empire de 20 producteurs', ab_f2: 'Faites éclore abeilles et noyaux', ab_f3: 'Ouvrez des mondes uniques', ab_f4: 'Ligues et classements chaque semaine', ab_f5: 'Série, quêtes et pass gratuit', ab_f6: 'Gratuit, dans votre navigateur', ab_made: 'Fait par NovaFox', ab_visit: 'Visiter NovaFox', ab_source: 'Code source'
  });

  function factorRows(list, unit) {
    let tot = 1;
    let h = '';
    for (const [k, v] of list) {
      if (unit === 'h') { tot = (tot === 1 ? 0 : tot) + v; if (!v) continue; h += '<div class="kv"><span>' + t(k) + '</span><span class="num">+' + F.num(v, { small: true }) + ' h</span></div>'; continue; }
      tot *= v;
      if (Math.abs(v - 1) < 1e-9) continue;
      h += '<div class="kv"><span>' + t(k) + '</span><span class="num' + (v < 1 ? ' neg' : '') + '">x' + F.num(v, { small: true }) + '</span></div>';
    }
    return { h, tot };
  }
  function block(title, icon, list, totalLabel, note) {
    const r = factorRows(list);
    return '<div class="card st-card"><div class="sec-title"><h3>' + ic(icon) + t(title) + '</h3><b class="num st-tot">' + (totalLabel || 'x' + F.num(r.tot, { small: true })) + '</b></div>' + r.h + (note ? '<p class="faint" style="font-size:var(--fs-xs);margin-top:var(--sp-3)">' + note + '</p>' : '') + '</div>';
  }

  UI.ext.stats = function () {
    const s = BZ.Game.main;
    const c = E.cache(s);
    const bb = E.beeBonus(s);
    const cs = P.coreStats(s);
    const w = E.world(s).mods;
    const sk = BZ.SKIN_BY_ID[s.skin];
    const skb = (sk && sk.boost) || {};
    const bl = { honey: 1, tap: 1, luckyFreq: 1, luckyDur: 1, rj: 1, cost: 1 };
    for (const e of s.bless || []) { const b = P.BLESS_BY_ID[e.id]; if (!b) continue; for (const k in bl) if (b[k]) bl[k] *= k === 'cost' ? 1 - b[k] : 1 + b[k]; }
    let upgG = 1, upgTap = 1, upgLF = 1, upgLD = 1;
    for (const id in s.upg) { const u = BZ.UPGRADE_BY_ID[id]; if (!u) continue; if (u.kind === 'global') upgG *= u.mult; if (u.kind === 'tap') upgTap *= u.tmult; if (u.kind === 'lucky') { upgLF *= u.freq; upgLD *= u.dur; } }
    const ess = id => P.essLvl(s, id);
    let h = UI.title(t('st_title'));
    h += block('st_hpsT', 'drop', [
      ['sr_upg', upgG], ['sr_rj', E.rjMult(s)], ['sr_ach', 1 + BZ.ACH_BONUS * E.achCount(s)], ['sr_decree', 1 + 0.25 * E.qlvl(s, 'decree') * (E.perk(s, 'decree') ? 2 : 1)], ['sr_crowns', E.crownMult(s)],
      ['sr_bees', 1 + bb.honey], ['sr_colony', Math.pow(BZ.COLONY_MULT, E.colonyLevel(s))], ['sr_level', 1 + 0.01 * Math.max(0, (s.level || 1) - 1)], ['sr_ess', P.essHoney(s)], ['sr_prime', Math.pow(2, s.prime || 0)],
      ['sr_world', w.honey || 1], ['sr_skins', (1 + 0.03 * P.ownedSkins(s)) * (1 + (skb.honey || 0))], ['sr_cores', 1 + cs.honey], ['sr_bless', bl.honey], ['sr_boosts', E.tempMult(s)]
    ], F.num(E.hps(s)) + '/s', t('st_prod_note'));
    h += block('st_tap', 'tap', [['sr_upg', upgTap], ['sr_bees', 1 + bb.tap], ['sr_queen', 1 + 0.5 * E.qlvl(s, 'touch')], ['sr_ess', Math.pow(1.2, ess('tap')) * Math.pow(1.2, ess('tide'))], ['sr_world', w.tap || 1], ['sr_skins', 1 + (skb.tap || 0)], ['sr_cores', 1 + cs.tap], ['sr_bless', bl.tap], ['sr_combo', E.comboMult(s)], ['sr_boosts', E.tapBuff(s)]], F.num(E.tapValue(s)));
    const lf = c.luckyFreq;
    h += block('st_luckyF', 'sparkle', [['sr_upg', upgLF], ['sr_bees', 1 + bb.luckyFreq], ['sr_queen', 1 + 0.08 * E.qlvl(s, 'charm')], ['sr_perk', E.perk(s, 'lucky') ? 1.25 : 1], ['sr_ess', 1 + 0.05 * ess('lucky')], ['sr_world', w.luckyFreq || 1], ['sr_skins', 1 + (skb.luckyFreq || 0)], ['sr_cores', 1 + cs.luckyFreq + cs.lucky], ['sr_bless', bl.luckyFreq]], 'x' + F.num(lf, { small: true }), t('st_luckyI', { a: F.time(80 / lf), b: F.time(180 / lf) }));
    h += block('st_luckyD', 'clock', [['sr_upg', upgLD], ['sr_bees', 1 + bb.luckyDur], ['sr_queen', 1 + 0.1 * E.qlvl(s, 'elixir')], ['sr_world', w.luckyDur || 1], ['sr_skins', 1 + (skb.luckyDur || 0)], ['sr_cores', 1 + cs.luckyDur + cs.lucky], ['sr_bless', bl.luckyDur]]);
    h += block('st_rjgain', 'jelly', [['sr_queen', 1 + 0.1 * E.qlvl(s, 'wisdom')], ['sr_bees', 1 + bb.rj], ['sr_crowns', E.crownRJ(s)], ['sr_ess', Math.pow(1.15, ess('jelly')) * Math.pow(1.2, ess('ash'))], ['sr_world', w.rj || 1], ['sr_skins', 1 + (skb.rj || 0)], ['sr_cores', 1 + cs.rj], ['sr_bless', bl.rj]], F.num(E.pendingRJ(s), { int: true }));
    h += block('st_cost', 'shop', [['sr_queen', Math.pow(0.97, E.qlvl(s, 'thrift'))], ['sr_bees', 1 - bb.cost], ['sr_skins', 1 - (skb.cost || 0)], ['sr_cores', 1 - Math.min(0.4, cs.cost)], ['sr_ess', 1 - 0.02 * ess('heart')], ['sr_bless', bl.cost]]);
    const away = [['sr_base', 2], ['sr_queen', E.qlvl(s, 'nap')], ['sr_perk', E.perk(s, 'nap') ? 4 : 0], ['sr_world', w.offlineH || 0], ['sr_skins', skb.offlineH || 0], ['sr_cores', cs.offlineH], ['sr_ess', 2 * ess('nap')]];
    h += '<div class="card st-card"><div class="sec-title"><h3>' + ic('clock') + t('st_away') + '</h3><b class="num st-tot">' + F.time(E.offlineCap(s)) + '</b></div>' + away.filter(x => x[1]).map(x => '<div class="kv"><span>' + t(x[0]) + '</span><span class="num">+' + F.num(x[1], { small: true }) + ' h</span></div>').join('') + '</div>';
    const stats = [
      ['st_lifetime', F.num(s.lifetime)], ['st_run', F.num(s.runHoney)], ['st_hps', F.num(s.bestHps)], ['st_taps', F.int(s.taps)], ['st_combo', F.int(s.maxCombo)],
      ['st_lucky', F.int(s.lucky)], ['st_swarms', F.int(s.swarms)], ['st_rj', F.num(s.rjEarned)], ['st_upg', F.int(s.upgCount)], ['st_ms', F.int(s.milestones)],
      ['st_level', F.int(s.level || 1)], ['st_quests', F.int(s.quests || 0)], ['st_crowns', F.int(s.crowns || 0)], ['st_prime', F.int(s.prime || 0) + '  ·  x' + F.int(Math.pow(2, s.prime || 0))], ['st_colony', F.int(E.colonyLevel(s))], ['st_played', F.time(s.played)], ['st_run_time', F.time(s.runTime)]
    ];
    h += '<div class="card st-card"><div class="sec-title"><h3>' + ic('chart') + t('st_general') + '</h3></div>' + stats.map(x => '<div class="kv"><span>' + t(x[0]) + '</span><span class="num">' + x[1] + '</span></div>').join('') + '</div>';
    return h;
  };

  UI.ext.about = function () {
    let h = '<div class="ab-hero"><div class="ab-bees"><i></i><i></i><i></i></div><div class="ab-icon">' + BZ.appIconSvg(96) + '</div><h2><span>Buzz</span>works</h2><p>' + t('ab_tag') + '</p><span class="ab-ver">' + t('about_version', { v: BZ.VERSION }) + '</span></div>';
    const feats = [['hive', 'ab_f1'], ['worker', 'ab_f2'], ['globe', 'ab_f3'], ['league', 'ab_f4'], ['calendar', 'ab_f5'], ['star', 'ab_f6']];
    h += '<div class="ab-feats">' + feats.map(x => '<div class="ab-feat"><span>' + ic(x[0]) + '</span><small>' + t(x[1]) + '</small></div>').join('') + '</div>';
    h += '<div class="card ab-made"><div class="ab-nova">' + UI.fox('happy') + '</div><div class="txt"><b>' + t('ab_made') + '</b><small class="by">Luka LAURENT</small></div></div>';
    const ext = (BZ.CONFIG && BZ.CONFIG.platform) !== 'crazygames';
    h += '<div class="ab-links">' + (ext ? '<a class="btn btn-primary" href="https://novafox.fr" target="_blank" rel="noopener">' + ic('globe') + t('ab_visit') + '</a><a class="btn btn-outline" href="https://github.com/LukaLaurent/buzzworks" target="_blank" rel="noopener">' + ic('copy') + t('ab_source') + '</a>' : '') + '<button class="btn btn-ghost" data-act="logs">' + ic('chart') + t('logs') + '</button></div>';
    return h;
  };

  const prevAct = UI.extAct;
  UI.extAct = function (act, arg, el) {
    if (act === 'help') { UI.modal('<div class="hero"><div class="pic">' + ic('info') + '</div></div><p style="text-align:center;line-height:1.6">' + t(arg) + '</p><div class="row center"><button class="btn btn-primary" data-close>' + t('ok') + '</button></div>', true); BZ.Audio.play('click'); return; }
    prevAct(act, arg, el);
  };
})(window);
