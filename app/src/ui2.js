(function (root) {
  const BZ = root.BZ;
  const E = BZ.E, F = BZ.F, M = BZ.Meta, P = BZ.P, UI = BZ.UI, t = BZ.t, n = BZ.n, ic = BZ.icon;
  const $ = id => document.getElementById(id);
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  let G = null;
  let hatchTab = 'std';
  let promoIdx = 0, promoAt = 0, promoKey = '';

  BZ.addStrings({
    tab_pass: 'Pass', tab_workshop: 'Workshop', tab_worlds: 'Worlds',
    ticket_egg: 'Egg tickets', ticket_royal: 'Royal tickets', ticket_core: 'Core tickets', tickets: 'Tickets',
    r_egg: '+{v} egg tickets', r_royal: '+{v} royal tickets', r_core: '+{v} core tickets', r_part: 'Skin part: {s}', r_skin: 'Skin complete: {s}', r_honey: '+{v} honey',
    swarm_text: 'Your honey, producers, upgrades and swarm goals reset. You keep bees, tickets, skills and trophies, and gain {v} royal jelly.',
    coronate_text: 'Royal jelly, queen skills and the current swarm reset. You keep crowns, bees, tickets and trophies, and gain {v} crowns.',
    reset_text: 'Every world, bee, ticket and trophy will be lost. This cannot be undone.',
    bees_how: 'Bees hatch from eggs. Egg tickets come from ticket bees, lucky bees, quests and quick tasks. Royal tickets come from trophies and swarm goals. Bees are never lost.',
    bees_none: 'No bees yet. Catch a ticket bee and hatch your first egg.',
    lucky_ticket: 'Ticket shower', lucky_ticket_d: '+{v} egg tickets', lucky_chest: 'Treasure chest', lucky_chest_d: 'a skin part and an egg ticket',
    tbee: 'Ticket bee', found_ticket: 'You found an egg ticket', q_ticketbee: 'Catch {n} ticket bees',
    lock_queen: 'The Queen appears when your hive gets close to its first swarm', lock_worlds: 'Worlds open after your first crown', locked_tab: '{p} unlocks at level {n}', unlocked_tab: '{p} unlocked',
    lvl: 'Level {n}', lvl_up: 'Level {n}!', lvl_title: 'Player level', lvl_next: '{v} XP to level {n}', lvl_bonus: '+1% honey per level  ·  now +{v}', lvl_rewards: 'Next rewards', lvl_unlock: 'Unlocks {p}',
    pass_title: 'Hive pass', pass_season: 'Season {n}', pass_ends: 'Ends in {t}', pass_tier: 'Tier {n} / {m}', pass_claim_all: 'Claim all', pass_how: 'The pass is free. Every action fills it: buying, lucky bees, ticket bees, quests, swarms and hatching.',
    hatch: 'Hatchery', hb_std: 'Standard egg', hb_royal: 'Royal egg', featured: 'Featured', featured_d: '{b} rate up  ·  ends in {t}', pull1: 'Hatch 1', pull10: 'Hatch 10', rates: 'Rates', pity_left: 'Legendary guaranteed within {n} hatches', guarantee_on: 'Next legendary is the featured bee', fifty: 'A legendary has a 50% chance to be the featured bee. If not, the next one is.', hatch_results: 'Results', new_tag: 'New', need_tickets: 'Not enough tickets', std_d: 'Hatch a random bee with an egg ticket', ad_tickets: '+2 egg tickets',
    bless_title: 'Choose a blessing', bless_sub: 'It lasts until your next swarm', bless_reroll: 'Reroll', bless_now: 'Blessings this swarm', bless_pending: 'Blessing ready', bless_none: 'Blessings appear at the start of each swarm and at big honey milestones.',
    bl_bloom: 'Blooming fields', bl_quick: 'Quick wings', bl_paws: 'Strong paws', bl_thrift: 'Bargain wax', bl_elixir: 'Long dance', bl_focus: 'Focus', bl_jelly: 'Jelly harvest', bl_rhythm: 'Rhythm', bl_nectar: 'Nectar flow', bl_ticket: 'Ticket wind', bl_crown: 'Crown blessing', bl_golden: 'Golden hour', bl_royal: 'Royal favor',
    bd_honey: '+{v} honey', bd_luckyFreq: 'Lucky bees {v} more often', bd_tap: 'Taps x{v}', bd_cost: 'Producers {v} cheaper', bd_luckyDur: 'Lucky effects {v} longer', bd_focus: '{p} x{v}', bd_rj: '+{v} royal jelly', bd_combo: '+{v} max combo', bd_ticketFreq: 'Ticket bees {v} more often',
    ad_title: 'Advertisement', ad_text: 'A short ad plays here.', ad_reward: 'Get reward', ad_skip: 'No ads for you: reward granted', ad_left: '{n} left today', ad_none: 'No more ads today', watch_ad: 'Watch ad',
    ad_boost: 'x2 honey for 30 min', collect_ad: 'Collect x2 (ad)', dance_wait: 'Bee dance ready in {t}',
    promo_featured: 'Featured: {b}', promo_featured_d: 'Royal egg rate up this week', promo_pass: 'Hive pass  ·  tier {n}', promo_pass_d: 'Rewards waiting to be claimed', promo_bless: 'Blessing ready', promo_bless_d: 'Pick one of three bonuses', promo_tickets: '{n} egg tickets', promo_tickets_d: 'Hatch them in the Bees tab', promo_quick: 'Quick task done', promo_quick_d: 'Claim it in the Daily tab', promo_world: 'A new world can open', promo_world_d: 'Spend crowns in the Worlds tab',
    st_level: 'Player level', tg_level: 'Reach player level {v}', got_items: 'You got',
    quick_title: 'Quick tasks', quick_reset: 'New tasks in {t}', quick_honey: '4 min of honey',
    cores_title: 'Hive cores', core_slots: 'Equipped cores', core_empty: 'Empty slot', core_more: 'More slots at level 20 and with 5 essence', core_hatch: 'Core summoning', core_d: 'Summon a hive core with a core ticket', core_full: 'All slots are full. Remove a core first.', core_tap: 'Tap a core to equip or remove it', core_new: 'New core', core_level: 'Core level up', core_copy: 'Another copy', core_none: 'No cores yet. Core tickets come from daily quests, the streak, the pass and trophies.',
    ck_honey: '+{v} honey', ck_tap: '+{v} tap power', ck_cost: 'Producers {v} cheaper', ck_luckyFreq: 'Lucky bees {v} more often', ck_luckyDur: 'Lucky effects {v} longer', ck_offlineH: '+{v} h away earnings', ck_ticketFreq: 'Ticket bees {v} more often', ck_rj: '+{v} royal jelly', ck_combo: '+{v} max combo', ck_lucky: 'Lucky bees {v} more often and longer',
    skins_title: 'Hive skins', skin_parts: '{n} / {m} parts', skin_how: 'Skin parts drop from treasure chests on lucky bees, level rewards, the streak and the pass. Every skin you own gives +3% honey, and the skin in use adds its own bonus everywhere. Skins show in the Flower meadow, other worlds keep their own look.', skin_none: 'No bonus', skin_pass: 'Hive pass reward',
    worlds_title: 'Worlds', world_here: 'You are here', world_go: 'Travel', world_open: 'Open  ·  {v} crowns', world_need: 'Needs {v} crowns in your current world', world_prev: 'Open the previous world first', world_crowns: '{v} crowns',
    wd_meadow: 'The classic hive with no twist.', wd_dunes: 'Prices rise more slowly, but lucky bees are rarer.', wd_glacier: 'Half the honey, but triple away earnings, 6 more hours away and longer lucky effects.', wd_moon: 'Lucky bees more than twice as often, but taps are weak.', wd_ember: 'Double royal jelly, but prices rise faster.',
    worlds_how: 'Each world keeps its own honey, queen and crowns. Bees, cores, skins, tickets and your level are shared everywhere.',
    essence: 'Essence', essence_bonus: '+{h} honey and +{r} royal jelly in every world', sell_title: 'Sell this world?', sell_text: 'This world restarts from zero: honey, producers, royal jelly, queen skills, crowns and its trophies. Bees, cores, skins, tickets and other worlds stay. You gain {v} essence.', sell_btn: 'Sell this world  ·  +{v} essence', sell_need: 'Earn {v} crowns in this world to sell it', sell_done: '+{v} essence', ess_perks: 'Essence perks', ep_slot: '+1 core slot', ep_lucky: 'Lucky bees 20% more often', ep_mind: 'Hive mind without crowns', ep_crown: '+1 crown at every coronation', ep_tickets: 'Ticket bees give double', travel_done: 'Welcome to {w}', world_opened: '{w} is open', ess_at: '{n} essence',
    mind_locked: 'Needs 5 crowns',
    noads_title: 'No ads', noads_d: 'Every ad reward becomes instant, forever.', soon: 'Coming soon', noads_owned: 'Ads removed. Thank you!',
    cloud_title: 'Cloud save', cloud_d: 'Sign in with Google to keep your progress on every device. The save goes to a private app folder in your Google Drive.', cloud_signin: 'Sign in with Google', cloud_signout: 'Sign out', cloud_sync: 'Sync now', cloud_last: 'Last sync {t} ago', cloud_never: 'Not synced yet', cloud_cfg: 'Cloud save is not set up on this site yet.', cloud_loaded: 'Cloud save loaded', cloud_saved: 'Saved to Google Drive', cloud_err: 'Cloud save failed. Your progress is still saved on this device.', cloud_pick: 'Two saves found', cloud_pick_d: 'The save in your Google Drive is newer than this device. Which one do you want to keep?', cloud_use: 'Use the cloud save', cloud_keep: 'Keep this device',
    trophies_bonus: 'Each hall of fame trophy gives +2% honey', run_title: 'Swarm goals', run_d: 'They reset at every swarm and give tickets again', hall_title: 'Hall of fame', ag_world: 'Collection and worlds',
    tg_runHoney: 'Make {v} honey this swarm', tg_runOwn: 'Own {v} producers', tg_runUpg: 'Buy {v} upgrades this swarm', tg_runLucky: 'Catch {v} lucky bees this swarm', tg_runTaps: 'Tap {v} times this swarm', tg_runColony: 'Reach colony level {v}',
    tg_cores: 'Find {v} hive cores', tg_skins: 'Complete {v} hive skins', tg_worlds: 'Open {v} worlds', goal_done: 'Swarm goal: {n}',
    play: 'Play', tip_1: 'Ticket bees carry egg tickets. Tap them before they fly away.', tip_2: 'Swarm goals reset at every swarm and give tickets each time.', tip_3: 'Equip hive cores in the Workshop for lasting bonuses.', tip_4: 'Each skin you complete gives +3% honey.', tip_5: 'Crowns open new worlds with their own twist.'
  }, {
    tab_pass: 'Pass', tab_workshop: 'Atelier', tab_worlds: 'Mondes',
    ticket_egg: 'Tickets d\'œuf', ticket_royal: 'Tickets royaux', ticket_core: 'Tickets de noyau', tickets: 'Tickets',
    r_egg: '+{v} tickets d\'œuf', r_royal: '+{v} tickets royaux', r_core: '+{v} tickets de noyau', r_part: 'Pièce de décor : {s}', r_skin: 'Décor terminé : {s}', r_honey: '+{v} de miel',
    swarm_text: 'Le miel, les producteurs, les améliorations et les objectifs de l\'essaim repartent de zéro. Vous gardez abeilles, tickets, compétences et trophées, et gagnez {v} gelée royale.',
    coronate_text: 'La gelée royale, les compétences de la reine et l\'essaim actuel repartent de zéro. Vous gardez couronnes, abeilles, tickets et trophées, et gagnez {v} couronnes.',
    reset_text: 'Tous les mondes, abeilles, tickets et trophées seront perdus. Impossible d\'annuler.',
    bees_how: 'Les abeilles éclosent des œufs. Les tickets d\'œuf viennent des abeilles à ticket, des abeilles dorées, des quêtes et des tâches rapides. Les tickets royaux viennent des trophées et des objectifs de l\'essaim. Les abeilles ne se perdent jamais.',
    bees_none: 'Pas encore d\'abeille. Attrapez une abeille à ticket et faites éclore votre premier œuf.',
    lucky_ticket: 'Pluie de tickets', lucky_ticket_d: '+{v} tickets d\'œuf', lucky_chest: 'Coffre au trésor', lucky_chest_d: 'une pièce de décor et un ticket d\'œuf',
    tbee: 'Abeille à ticket', found_ticket: 'Vous trouvez un ticket d\'œuf', q_ticketbee: 'Attrapez {n} abeilles à ticket',
    lock_queen: 'La reine arrive quand la ruche approche de son premier essaim', lock_worlds: 'Les mondes s\'ouvrent après votre première couronne', locked_tab: '{p} se débloque au niveau {n}', unlocked_tab: '{p} débloqué',
    lvl: 'Niveau {n}', lvl_up: 'Niveau {n} !', lvl_title: 'Niveau du joueur', lvl_next: '{v} XP pour le niveau {n}', lvl_bonus: '+1 % de miel par niveau  ·  actuellement +{v}', lvl_rewards: 'Prochaines récompenses', lvl_unlock: 'Débloque {p}',
    pass_title: 'Pass de la ruche', pass_season: 'Saison {n}', pass_ends: 'Fin dans {t}', pass_tier: 'Palier {n} / {m}', pass_claim_all: 'Tout récupérer', pass_how: 'Le pass est gratuit. Chaque action le remplit : achats, abeilles dorées, abeilles à ticket, quêtes, essaims et éclosions.',
    hatch: 'Couvoir', hb_std: 'Œuf standard', hb_royal: 'Œuf royal', featured: 'En vedette', featured_d: '{b} en vedette  ·  fin dans {t}', pull1: 'Éclore 1', pull10: 'Éclore 10', rates: 'Taux', pity_left: 'Légendaire garantie d\'ici {n} éclosions', guarantee_on: 'La prochaine légendaire sera l\'abeille en vedette', fifty: 'Une légendaire a 50 % de chances d\'être l\'abeille en vedette. Sinon, la suivante l\'est.', hatch_results: 'Résultats', new_tag: 'Nouveau', need_tickets: 'Pas assez de tickets', std_d: 'Faites éclore une abeille au hasard avec un ticket d\'œuf', ad_tickets: '+2 tickets d\'œuf',
    bless_title: 'Choisissez une bénédiction', bless_sub: 'Elle dure jusqu\'au prochain essaim', bless_reroll: 'Relancer', bless_now: 'Bénédictions de cet essaim', bless_pending: 'Bénédiction prête', bless_none: 'Les bénédictions arrivent au début de chaque essaim et aux grands paliers de miel.',
    bl_bloom: 'Champs en fleurs', bl_quick: 'Ailes rapides', bl_paws: 'Pattes fortes', bl_thrift: 'Cire bon marché', bl_elixir: 'Longue danse', bl_focus: 'Concentration', bl_jelly: 'Récolte de gelée', bl_rhythm: 'Rythme', bl_nectar: 'Flot de nectar', bl_ticket: 'Vent de tickets', bl_crown: 'Bénédiction de la couronne', bl_golden: 'Heure dorée', bl_royal: 'Faveur royale',
    bd_honey: '+{v} de miel', bd_luckyFreq: 'Abeilles dorées {v} plus fréquentes', bd_tap: 'Touchers x{v}', bd_cost: 'Producteurs {v} moins chers', bd_luckyDur: 'Effets dorés {v} plus longs', bd_focus: '{p} x{v}', bd_rj: '+{v} de gelée royale', bd_combo: '+{v} au combo maximum', bd_ticketFreq: 'Abeilles à ticket {v} plus fréquentes',
    ad_title: 'Publicité', ad_text: 'Une courte publicité s\'affiche ici.', ad_reward: 'Récupérer', ad_skip: 'Pas de pub pour vous : récompense donnée', ad_left: 'encore {n} aujourd\'hui', ad_none: 'Plus de pub aujourd\'hui', watch_ad: 'Voir une pub',
    ad_boost: 'Miel x2 pendant 30 min', collect_ad: 'Récupérer x2 (pub)', dance_wait: 'Danse des abeilles prête dans {t}',
    promo_featured: 'En vedette : {b}', promo_featured_d: 'Œuf royal boosté cette semaine', promo_pass: 'Pass de la ruche  ·  palier {n}', promo_pass_d: 'Des récompenses vous attendent', promo_bless: 'Bénédiction prête', promo_bless_d: 'Choisissez un bonus parmi trois', promo_tickets: '{n} tickets d\'œuf', promo_tickets_d: 'Faites-les éclore dans l\'onglet Abeilles', promo_quick: 'Tâche rapide terminée', promo_quick_d: 'Récupérez-la dans l\'onglet Jour', promo_world: 'Un nouveau monde peut s\'ouvrir', promo_world_d: 'Dépensez des couronnes dans l\'onglet Mondes',
    st_level: 'Niveau du joueur', tg_level: 'Atteindre le niveau {v}', got_items: 'Vous recevez',
    quick_title: 'Tâches rapides', quick_reset: 'Nouvelles tâches dans {t}', quick_honey: '4 min de miel',
    cores_title: 'Noyaux de ruche', core_slots: 'Noyaux équipés', core_empty: 'Emplacement vide', core_more: 'Plus d\'emplacements au niveau 20 et avec 5 essences', core_hatch: 'Invocation de noyau', core_d: 'Invoquez un noyau de ruche avec un ticket de noyau', core_full: 'Tous les emplacements sont pris. Retirez d\'abord un noyau.', core_tap: 'Touchez un noyau pour l\'équiper ou le retirer', core_new: 'Nouveau noyau', core_level: 'Noyau amélioré', core_copy: 'Un exemplaire de plus', core_none: 'Pas encore de noyau. Les tickets de noyau viennent des quêtes du jour, de la série, du pass et des trophées.',
    ck_honey: '+{v} de miel', ck_tap: '+{v} de récolte par toucher', ck_cost: 'Producteurs {v} moins chers', ck_luckyFreq: 'Abeilles dorées {v} plus fréquentes', ck_luckyDur: 'Effets dorés {v} plus longs', ck_offlineH: '+{v} h de gains en absence', ck_ticketFreq: 'Abeilles à ticket {v} plus fréquentes', ck_rj: '+{v} de gelée royale', ck_combo: '+{v} au combo maximum', ck_lucky: 'Abeilles dorées {v} plus fréquentes et plus longues',
    skins_title: 'Décors de ruche', skin_parts: '{n} / {m} pièces', skin_how: 'Les pièces de décor tombent des coffres des abeilles dorées, des récompenses de niveau, de la série et du pass. Chaque décor possédé donne +3 % de miel, et le décor utilisé ajoute son propre bonus partout. Les décors s\'affichent dans la Prairie fleurie, les autres mondes gardent leur propre style.', skin_none: 'Sans bonus', skin_pass: 'Récompense du pass',
    worlds_title: 'Mondes', world_here: 'Vous êtes ici', world_go: 'Voyager', world_open: 'Ouvrir  ·  {v} couronnes', world_need: 'Il faut {v} couronnes dans votre monde actuel', world_prev: 'Ouvrez d\'abord le monde précédent', world_crowns: '{v} couronnes',
    wd_meadow: 'La ruche classique, sans particularité.', wd_dunes: 'Les prix montent moins vite, mais les abeilles dorées sont plus rares.', wd_glacier: 'Moitié moins de miel, mais gains en absence triplés, 6 h d\'absence en plus et effets dorés plus longs.', wd_moon: 'Abeilles dorées plus de deux fois plus fréquentes, mais touchers faibles.', wd_ember: 'Gelée royale doublée, mais les prix montent plus vite.',
    worlds_how: 'Chaque monde garde son miel, sa reine et ses couronnes. Abeilles, noyaux, décors, tickets et niveau sont partagés partout.',
    essence: 'Essence', essence_bonus: '+{h} de miel et +{r} de gelée royale dans tous les mondes', sell_title: 'Vendre ce monde ?', sell_text: 'Ce monde repart de zéro : miel, producteurs, gelée royale, compétences de la reine, couronnes et ses trophées. Abeilles, noyaux, décors, tickets et autres mondes restent. Vous gagnez {v} essences.', sell_btn: 'Vendre ce monde  ·  +{v} essences', sell_need: 'Gagnez {v} couronnes dans ce monde pour le vendre', sell_done: '+{v} essences', ess_perks: 'Avantages d\'essence', ep_slot: '+1 emplacement de noyau', ep_lucky: 'Abeilles dorées 20 % plus fréquentes', ep_mind: 'Esprit de ruche sans couronnes', ep_crown: '+1 couronne à chaque couronnement', ep_tickets: 'Abeilles à ticket doublées', travel_done: 'Bienvenue : {w}', world_opened: '{w} est ouvert', ess_at: '{n} essences',
    mind_locked: 'Il faut 5 couronnes',
    noads_title: 'Sans pub', noads_d: 'Toutes les récompenses de pub deviennent immédiates, pour toujours.', soon: 'Bientôt', noads_owned: 'Pubs retirées. Merci !',
    cloud_title: 'Sauvegarde en ligne', cloud_d: 'Connectez-vous avec Google pour garder votre progression sur tous vos appareils. La sauvegarde va dans un dossier privé de votre Google Drive.', cloud_signin: 'Se connecter avec Google', cloud_signout: 'Se déconnecter', cloud_sync: 'Synchroniser', cloud_last: 'Synchronisé il y a {t}', cloud_never: 'Pas encore synchronisé', cloud_cfg: 'La sauvegarde en ligne n\'est pas encore configurée sur ce site.', cloud_loaded: 'Sauvegarde en ligne chargée', cloud_saved: 'Enregistré sur Google Drive', cloud_err: 'Échec de la sauvegarde en ligne. La progression reste enregistrée sur cet appareil.', cloud_pick: 'Deux sauvegardes trouvées', cloud_pick_d: 'La sauvegarde de votre Google Drive est plus récente que celle de cet appareil. Laquelle garder ?', cloud_use: 'Utiliser la sauvegarde en ligne', cloud_keep: 'Garder cet appareil',
    trophies_bonus: 'Chaque trophée du palmarès donne +2 % de miel', run_title: 'Objectifs de l\'essaim', run_d: 'Ils repartent à chaque essaim et redonnent des tickets', hall_title: 'Palmarès', ag_world: 'Collection et mondes',
    tg_runHoney: 'Produire {v} de miel dans cet essaim', tg_runOwn: 'Posséder {v} producteurs', tg_runUpg: 'Acheter {v} améliorations dans cet essaim', tg_runLucky: 'Attraper {v} abeilles dorées dans cet essaim', tg_runTaps: 'Toucher {v} fois dans cet essaim', tg_runColony: 'Atteindre le niveau de colonie {v}',
    tg_cores: 'Trouver {v} noyaux de ruche', tg_skins: 'Terminer {v} décors', tg_worlds: 'Ouvrir {v} mondes', goal_done: 'Objectif d\'essaim : {n}',
    play: 'Jouer', tip_1: 'Les abeilles à ticket portent des tickets d\'œuf. Touchez-les avant qu\'elles s\'envolent.', tip_2: 'Les objectifs de l\'essaim repartent à chaque essaim et redonnent des tickets.', tip_3: 'Équipez des noyaux dans l\'Atelier pour des bonus durables.', tip_4: 'Chaque décor terminé donne +3 % de miel.', tip_5: 'Les couronnes ouvrent de nouveaux mondes, chacun avec sa particularité.'
  });

  const TICKET_COLOR = { egg: 'tk-egg', royal: 'tk-royal', core: 'tk-core' };
  function rewardChip(r) {
    if (r.egg) return '<span class="rw tk-egg">' + ic('ticket') + 'x' + r.egg + '</span>';
    if (r.royal) return '<span class="rw tk-royal">' + ic('ticket') + 'x' + r.royal + '</span>';
    if (r.core) return '<span class="rw tk-core">' + ic('ticket') + 'x' + r.core + '</span>';
    if (r.part) return '<span class="rw part">' + ic('palette') + 'x' + r.part + '</span>';
    if (r.boost) return '<span class="rw bst">' + ic('bolt') + 'x2  30 min</span>';
    if (r.skin) return '<span class="rw skin">' + ic('palette') + n(BZ.SKIN_BY_ID[r.skin].name) + '</span>';
    if (r.bee) return '<span class="rw bee">' + UI.beeSvg(BZ.BEE_BY_ID[r.bee], 22) + n(BZ.BEE_BY_ID[r.bee].name) + '</span>';
    if (r.warp) return '<span class="rw bst">' + ic('drop') + t('quick_honey') + '</span>';
    return '';
  }
  function gotText(got) {
    return got.map(g => {
      if (g.k === 'egg') return t('r_egg', { v: g.v });
      if (g.k === 'royal') return t('r_royal', { v: g.v });
      if (g.k === 'core') return t('r_core', { v: g.v });
      if (g.k === 'part') return t('r_part', { s: n(BZ.SKIN_BY_ID[g.v].name) });
      if (g.k === 'skin') return t('r_skin', { s: n(BZ.SKIN_BY_ID[g.v].name) });
      if (g.k === 'bee') return n(BZ.BEE_BY_ID[g.v].name);
      if (g.k === 'boost') return t('ad_boost');
      if (g.k === 'honey') return t('r_honey', { v: F.num(g.v) });
      return '';
    }).filter(Boolean).join('  ·  ');
  }
  UI.gotText = gotText;
  UI.rewardChip = rewardChip;

  function blessDesc(e) {
    const b = P.BLESS_BY_ID[e.id];
    if (b.honey) return t('bd_honey', { v: F.pct(b.honey) });
    if (b.luckyFreq) return t('bd_luckyFreq', { v: F.pct(b.luckyFreq) });
    if (b.tap) return t('bd_tap', { v: 1 + b.tap });
    if (b.cost) return t('bd_cost', { v: F.pct(b.cost) });
    if (b.luckyDur) return t('bd_luckyDur', { v: F.pct(b.luckyDur) });
    if (b.focus) return t('bd_focus', { p: n(BZ.PRODUCERS.find(p => p.id === e.target).name), v: b.focus });
    if (b.rj) return t('bd_rj', { v: F.pct(b.rj) });
    if (b.combo) return t('bd_combo', { v: F.num(b.combo) });
    if (b.ticketFreq) return t('bd_ticketFreq', { v: F.pct(b.ticketFreq) });
    return '';
  }
  const BLESS_ICON = { bloom: 'flower', quick: 'sparkle', paws: 'tap', thrift: 'drop', elixir: 'clock', focus: 'star', jelly: 'jelly', rhythm: 'music', nectar: 'drop', ticket: 'ticket', crown: 'crown', golden: 'sparkle', royal: 'jelly' };
  UI.blessDesc = blessDesc;

  function coreText(c, lvl) {
    const v = c.v * Math.max(1, lvl);
    return t('ck_' + c.kind, { v: c.kind === 'offlineH' || c.kind === 'combo' ? F.num(v, { small: true }) : F.pct(v) });
  }
  function coreSvg(c, size, locked) {
    const col = locked ? 'var(--border)' : c.c;
    const id = 'cg' + Math.random().toString(36).slice(2, 7);
    return '<svg viewBox="0 0 64 64" width="' + size + '" height="' + size + '" aria-hidden="true"><defs><radialGradient id="' + id + '" cx="40%" cy="35%" r="70%"><stop offset="0" stop-color="#fff" stop-opacity="' + (locked ? 0.1 : 0.75) + '"/><stop offset="1" stop-color="' + col + '" stop-opacity="0"/></radialGradient></defs>' +
      (c.r === 3 && !locked ? '<circle cx="32" cy="32" r="29" fill="' + c.c + '" opacity="0.18"/>' : '') +
      '<path d="M32 6 54 19v26L32 58 10 45V19Z" fill="' + col + '" stroke="' + (locked ? 'var(--text-faint)' : '#20252B') + '" stroke-opacity="0.35" stroke-width="2"/>' +
      '<path d="M32 16 45 23.5v15L32 46 19 38.5v-15Z" fill="#fff" opacity="' + (locked ? 0.15 : 0.28) + '"/>' +
      '<path d="M32 6 54 19v26L32 58 10 45V19Z" fill="url(#' + id + ')"/></svg>';
  }
  UI.coreSvg = coreSvg;
  UI.coreText = coreText;

  function skinBonus(sk) {
    const b = sk.boost;
    if (!b) return t('skin_none');
    const k = Object.keys(b)[0];
    const v = b[k];
    return t('ck_' + k, { v: k === 'offlineH' ? F.num(v) : k === 'tap' ? F.pct(v) : F.pct(v) });
  }
  UI.skinBonus = skinBonus;

  UI.ext = {};

  UI.ext.pass = function () {
    const s = G.main;
    P.passRoll(s);
    const tier = P.passTier(s);
    const inTier = tier >= P.PASS_TIERS ? 1 : (s.pass.xp - tier * P.PASS_XP) / P.PASS_XP;
    let h = '<h2 class="page-title">' + t('pass_title') + '</h2>';
    h += '<div class="card pass-head"><div class="big-stat"><div class="pic">' + ic('ticket') + '</div><div><b class="num">' + t('pass_tier', { n: tier, m: P.PASS_TIERS }) + '</b><small>' + t('pass_season', { n: s.pass.season + 1 }) + '  ·  <span data-t="' + P.seasonEnd() + '" data-tfmt="pass_ends"></span></small></div></div>';
    h += '<div class="progress" style="margin-top:var(--sp-4)"><i style="width:' + (inTier * 100).toFixed(1) + '%"></i></div>';
    h += P.passReady(s) ? '<div class="btn-row"><button class="btn btn-primary" data-act="passall">' + ic('gift') + t('pass_claim_all') + '</button></div>' : '';
    h += '</div><div class="card pass-track free-track">';
    for (let i = 1; i <= P.PASS_TIERS; i++) {
      const reached = i <= tier;
      const done = s.pass.got[i];
      const can = reached && !done;
      h += '<div class="pass-row' + (reached ? ' reached' : '') + '"><span class="tnum">' + i + '</span><div class="pcell' + (done ? ' done' : '') + (can ? ' can' : '') + (i % 10 === 0 ? ' big' : '') + '"' + (can ? ' data-act="passclaim" data-arg="' + i + '"' : '') + '>' + rewardChip(P.passReward(i)) + (done ? ic('check') : '') + '</div></div>';
    }
    h += '</div><div class="card"><p class="muted" style="font-size:var(--fs-sm)">' + t('pass_how') + '</p></div>';
    return h;
  };

  function ticketBar(s, keys) {
    return '<div class="tk-bar">' + keys.map(k => '<span class="tk ' + TICKET_COLOR[k] + '">' + ic('ticket') + '<b class="num">' + F.int(s.tickets[k] || 0) + '</b><small>' + t('ticket_' + k) + '</small></span>').join('') + '</div>';
  }

  function bannerFoot(s, bn) {
    const b = BZ.BANNERS[bn];
    const tot = b.rates.reduce((a, c) => a + c, 0);
    let h = '<div class="hatch-info"><span>' + b.rates.map((r, i) => r ? n(BZ.RARITIES[i].name) + ' ' + F.pct(r / tot) : '').filter(Boolean).join('  ·  ') + '</span>';
    h += '<span class="pity">' + ic('star') + t('pity_left', { n: b.hard - s.pity[bn] }) + '</span>';
    if (bn === 'royal') h += '<span>' + (s.pity.guarantee ? '<b class="gold">' + t('guarantee_on') + '</b>' : t('fifty')) + '</span>';
    return h + '</div>';
  }
  function pullButtons(s, bn) {
    const k = BZ.BANNERS[bn].ticket;
    const have = s.tickets[k] || 0;
    return '<button class="btn btn-outline' + (have < 1 ? ' off' : '') + '" data-act="pull" data-arg="' + bn + ':1">' + t('pull1') + '  ·  ' + ic('ticket') + '1</button>' +
      '<button class="btn btn-primary' + (have < 10 ? ' off' : '') + '" data-act="pull" data-arg="' + bn + ':10">' + t('pull10') + '  ·  ' + ic('ticket') + '10</button>';
  }

  UI.hatcheryHtml = function (s) {
    const bn = hatchTab;
    let h = '<div class="card hatch"><div class="sec-title"><h3>' + t('hatch') + '</h3><div class="seg"><button data-act="hatchtab" data-arg="std" class="' + (bn === 'std' ? 'on' : '') + '">' + t('hb_std') + '</button><button data-act="hatchtab" data-arg="royal" class="' + (bn === 'royal' ? 'on' : '') + '">' + t('hb_royal') + '</button></div></div>';
    h += ticketBar(s, ['egg', 'royal']);
    if (bn === 'royal') {
      const feat = BZ.BEE_BY_ID[P.featured()];
      const featE = BZ.BEE_BY_ID[P.featuredEpic()];
      h += '<div class="banner royal"><div class="bart">' + UI.beeSvg(feat, 92) + '</div><div class="btxt"><span class="badge lim">' + ic('star') + t('featured') + '</span><b>' + n(feat.name) + '</b><small>' + UI.bonusText(feat.kind, feat.v) + '</small><small class="faint">' + t('featured_d', { b: n(featE.name), t: F.time((P.weekEnd() - Date.now()) / 1000) }) + '</small></div></div>';
    } else {
      h += '<div class="banner std"><div class="bart">' + ic('gift') + '</div><div class="btxt"><b>' + t('hb_std') + '</b><small>' + t('std_d') + '</small></div></div>';
    }
    h += '<div class="pull-row">' + pullButtons(s, bn);
    const adL = P.adLeft(s, 'ticket');
    if (bn === 'std' && adL) h += '<button class="btn btn-secondary" data-act="adticket">' + ic('play') + t('ad_tickets') + '</button>';
    h += '</div>' + bannerFoot(s, bn) + '</div>';
    return h;
  };

  UI.ext.workshop = function () {
    const s = G.main;
    const slots = P.coreSlotCount(s);
    let h = '<h2 class="page-title">' + t('tab_workshop') + '</h2>';
    h += '<div class="card hatch"><div class="sec-title"><h3>' + t('core_hatch') + '</h3></div>' + ticketBar(s, ['core']);
    h += '<div class="banner core"><div class="bart">' + coreSvg(BZ.CORE_BY_ID.c_sun, 84) + '</div><div class="btxt"><b>' + t('cores_title') + '</b><small>' + t('core_d') + '</small></div></div>';
    h += '<div class="pull-row">' + pullButtons(s, 'core') + '</div>' + bannerFoot(s, 'core') + '</div>';
    h += '<div class="card"><div class="sec-title"><h3>' + t('core_slots') + '</h3><small class="num">' + Math.min(s.coreSlots.length, slots) + ' / ' + slots + '</small></div><div class="core-slots">';
    for (let i = 0; i < slots; i++) {
      const id = s.coreSlots[i];
      const c = id && BZ.CORE_BY_ID[id];
      if (c) {
        const lvl = E.coreLevel(s, id);
        h += '<button class="core-slot on" data-act="core" data-arg="' + id + '" style="--rc:' + BZ.RARITIES[c.r].color + '">' + coreSvg(c, 44) + '<span><b>' + esc(n(c.name)) + '</b><small>' + esc(coreText(c, lvl)) + '</small></span><em>' + ic('close') + '</em></button>';
      } else h += '<div class="core-slot empty">' + ic('hive') + '<span><small>' + t('core_empty') + '</small></span></div>';
    }
    h += '</div>' + (slots < 4 ? '<p class="faint" style="font-size:var(--fs-xs);margin-top:var(--sp-3)">' + t('core_more') + '</p>' : '') + '</div>';
    const owned = BZ.CORES.filter(c => s.cores[c.id]).length;
    h += '<div class="sec"><div class="sec-title"><h3>' + t('cores_title') + '</h3><small class="num">' + owned + ' / ' + BZ.CORES.length + '</small></div>';
    h += owned ? '<p class="faint" style="font-size:var(--fs-xs);margin-bottom:var(--sp-3)">' + t('core_tap') + '</p>' : '<p class="faint" style="font-size:var(--fs-sm);margin-bottom:var(--sp-3)">' + t('core_none') + '</p>';
    h += '<div class="bees cores">';
    for (const c of BZ.CORES) {
      const cnt = s.cores[c.id] || 0;
      const rar = BZ.RARITIES[c.r];
      if (!cnt) { h += '<div class="bee locked"><div class="art">' + coreSvg(c, 52, true) + '</div><b>?</b><span class="rar" style="color:' + rar.color + '">' + n(rar.name) + '</span></div>'; continue; }
      const lvl = E.coreLevel(s, c.id);
      const nextAt = BZ.BEE_LEVELS[lvl];
      const prevAt = BZ.BEE_LEVELS[lvl - 1] || 0;
      const prog = nextAt ? (cnt - prevAt) / (nextAt - prevAt) : 1;
      const on = s.coreSlots.slice(0, slots).includes(c.id);
      h += '<button class="bee core-card' + (on ? ' equipped' : '') + '" data-act="core" data-arg="' + c.id + '" style="--rc:' + rar.color + '"><div class="art">' + coreSvg(c, 52) + '<span class="lv">' + lvl + '</span>' + (on ? '<span class="eq">' + ic('check') + '</span>' : '') + '</div><b>' + esc(n(c.name)) + '</b><span class="rar" style="color:' + rar.color + '">' + n(rar.name) + '</span><small>' + esc(coreText(c, lvl)) + '</small><div class="progress"><i style="width:' + (prog * 100).toFixed(0) + '%"></i></div><small class="faint">' + (nextAt ? t('bee_next', { n: nextAt - cnt }) : t('maxed')) + '</small></button>';
    }
    h += '</div></div>';
    h += '<div class="sec"><div class="sec-title"><h3>' + t('skins_title') + '</h3><small class="num">' + P.ownedSkins(s) + ' / ' + BZ.SKINS.filter(x => !x.world && x.id !== 'meadow').length + '</small></div><div class="skins">';
    for (const sk of BZ.SKINS) {
      if (sk.world) continue;
      const own = s.skins[sk.id];
      const on = s.skin === sk.id;
      let btn;
      if (on) btn = '<button class="btn btn-outline btn-sm off">' + ic('check') + t('equipped') + '</button>';
      else if (own) btn = '<button class="btn btn-outline btn-sm" data-act="skin" data-arg="' + sk.id + '">' + t('equip') + '</button>';
      else if (sk.pass) btn = '<span class="faint skin-lock">' + ic('ticket') + t('skin_pass') + '</span>';
      else {
        const have = s.parts[sk.id] || 0;
        btn = '<div class="parts"><div class="progress"><i style="width:' + (have / sk.parts * 100).toFixed(0) + '%"></i></div><small class="num">' + t('skin_parts', { n: have, m: sk.parts }) + '</small></div>';
      }
      h += '<div class="skin' + (on ? ' on' : '') + (own ? '' : ' notyet') + '"><div class="sw" style="background:linear-gradient(180deg,' + sk.sky[0] + ' 0%,' + sk.sky[1] + ' 55%,' + sk.hill[1] + ' 56%,' + sk.hill[2] + ' 100%)"><i style="background:' + sk.comb + '"></i>' + (own ? '' : '<span class="lockb">' + ic('lock') + '</span>') + '</div><div class="bottom"><b>' + n(sk.name) + '</b><small class="sb">' + esc(skinBonus(sk)) + '</small>' + btn + '</div></div>';
    }
    h += '</div><div class="card" style="margin-top:var(--sp-3)"><p class="muted" style="font-size:var(--fs-sm)">' + t('skin_how') + '</p></div></div>';
    return h;
  };

  UI.ext.worlds = function () {
    const s = G.main;
    let h = '<h2 class="page-title">' + t('worlds_title') + '</h2>';
    const es = s.essence || 0;
    const sv = P.sellValue(s);
    const earned = (s.crowns || 0) + (s.crownsSpent || 0);
    h += '<div class="card ess-card"><div class="big-stat"><div class="pic ess">' + ic('sparkle') + '</div><div><b class="num">' + F.int(es) + '</b><small>' + t('essence') + '  ·  ' + t('essence_bonus', { h: F.pct(BZ.ESSENCE_BONUS * es), r: F.pct(0.03 * es) }) + '</small></div></div>';
    h += '<div class="swarm-box"><small class="muted">' + (sv > 0 ? '' : t('sell_need', { v: BZ.SELL_MIN }) + '  ·  ' + t('world_crowns', { v: F.int(earned) })) + '</small><button class="btn btn-secondary btn-block' + (sv < 1 ? ' off' : '') + '" data-act="sell">' + ic('sparkle') + (sv > 0 ? t('sell_btn', { v: F.int(sv) }) : t('sell_btn', { v: 0 })) + '</button></div>';
    h += '<div class="perks"><div class="sec-title"><h3>' + t('ess_perks') + '</h3></div>' + BZ.ESSENCE_PERKS.map(p => '<div class="perk' + (es >= p.at ? ' on' : '') + '">' + ic(es >= p.at ? 'check' : 'lock') + '<span>' + t('ep_' + p.id) + '</span><small>' + t('ess_at', { n: p.at }) + '</small></div>').join('') + '</div></div>';
    h += '<div class="worlds">';
    BZ.WORLDS.forEach((w, i) => {
      const open = s.worldsOpen.includes(i);
      const here = s.world === i;
      const sk = BZ.SKIN_BY_ID[w.theme];
      let foot;
      if (here) foot = '<span class="badge b-orange">' + ic('check') + t('world_here') + '</span>';
      else if (open) foot = '<button class="btn btn-primary btn-sm" data-act="travel" data-arg="' + i + '">' + ic('globe') + t('world_go') + '</button>';
      else if (i !== s.worldsOpen.length) foot = '<small class="faint">' + t('world_prev') + '</small>';
      else foot = '<button class="btn btn-outline btn-sm' + (P.canOpenWorld(s, i) ? '' : ' off') + '" data-act="openworld" data-arg="' + i + '">' + ic('crown') + t('world_open', { v: w.cost }) + '</button>' + (P.canOpenWorld(s, i) ? '' : '<small class="faint">' + t('world_need', { v: w.cost }) + '</small>');
      const cr = open ? P.worldCrowns(s, i) : 0;
      h += '<div class="world' + (here ? ' here' : '') + (open ? '' : ' closed') + '"><div class="sw" style="background:linear-gradient(180deg,' + sk.sky[0] + ' 0%,' + sk.sky[1] + ' 55%,' + sk.hill[1] + ' 56%,' + sk.hill[2] + ' 100%)"><i style="background:' + sk.comb + '"></i>' + (open ? '<span class="wcr">' + ic('crown') + F.int(cr) + '</span>' : '<span class="lockb">' + ic('lock') + '</span>') + '</div><div class="bottom"><b>' + n(w.name) + '</b><small>' + t('wd_' + w.id) + '</small><div class="wfoot">' + foot + '</div></div></div>';
    });
    h += '</div><div class="card" style="margin-top:var(--sp-3)"><p class="muted" style="font-size:var(--fs-sm)">' + t('worlds_how') + '</p></div>';
    return h;
  };

  UI.coreModal = function (res) {
    const c = BZ.CORE_BY_ID[res.id];
    const rar = BZ.RARITIES[c.r];
    const title = res.isNew ? t('core_new') : res.levelUp ? t('core_level') : t('core_copy');
    UI.queueModal('<div class="hero"><div class="bee-hero" style="--rc:' + rar.color + '">' + coreSvg(c, 96) + '</div><h4>' + esc(title) + '</h4><b style="font-size:var(--fs-xl)">' + esc(n(c.name)) + '</b><p style="margin-top:var(--sp-3)"><span class="badge" style="background:color-mix(in srgb,' + rar.color + ' 18%,transparent);color:' + rar.color + '">' + n(rar.name) + '</span> <span class="badge b-orange">' + t('level', { n: res.level }) + '</span></p><p style="margin-top:var(--sp-3)">' + esc(coreText(c, res.level)) + '</p></div><div class="row center"><button class="btn btn-primary" data-close>' + t('ok') + '</button></div>');
  };

  UI.showPulls = function (res) {
    if (res.length === 1) { if (res[0].core) UI.coreModal(res[0]); else UI.beeModal(res[0]); return; }
    const best = Math.max(...res.map(r => r.r));
    let h = '<h4 style="text-align:center">' + t('hatch_results') + '</h4><div class="pull-grid">';
    res.forEach((r, i) => {
      const b = r.core ? BZ.CORE_BY_ID[r.id] : BZ.BEE_BY_ID[r.id];
      const rar = BZ.RARITIES[b.r];
      h += '<div class="pr r' + b.r + '" style="--rc:' + rar.color + ';animation-delay:' + (i * 70) + 'ms">' + (r.core ? coreSvg(b, 46) : UI.beeSvg(b, 46)) + '<b>' + esc(n(b.name)) + '</b>' + (r.isNew ? '<span class="nw">' + t('new_tag') + '</span>' : '<small>' + t('level', { n: r.level }) + '</small>') + '</div>';
    });
    h += '</div><div class="row center"><button class="btn btn-primary" data-close>' + t('ok') + '</button></div>';
    UI.queueModal(h);
    BZ.Audio.play(best >= 3 ? 'swarm' : best >= 2 ? 'milestone' : 'achievement');
  };

  UI.showBless = function () {
    const s = G.main;
    if (!s.blessOffer) return;
    const RC = ['#9AA4AE', '#4C7CC4', '#8E6AC8'];
    let h = '<h4 style="text-align:center">' + t('bless_title') + '</h4><p style="text-align:center">' + t('bless_sub') + '</p><div class="bless-grid">';
    s.blessOffer.forEach((e, i) => {
      const b = P.BLESS_BY_ID[e.id];
      h += '<button class="bless r' + b.r + '" style="--rc:' + RC[b.r] + '" data-bless="' + i + '"><span class="bpic">' + ic(BLESS_ICON[b.id]) + '</span><b>' + t('bl_' + b.id) + '</b><small>' + esc(blessDesc(e)) + '</small><span class="rar">' + n(BZ.RARITIES[b.r].name) + '</span></button>';
    });
    const adL = P.adLeft(s, 'reroll');
    h += '</div>' + (adL ? '<div class="row center"><button class="btn btn-outline btn-sm" id="bReAd">' + ic('play') + t('bless_reroll') + '  ·  ' + t('ad_left', { n: adL }) + '</button></div>' : '');
    UI.modal(h, true, { '#bReAd': () => G.blessReroll() });
    document.querySelectorAll('#modal [data-bless]').forEach(el => { el.onclick = () => G.blessPick(+el.dataset.bless); });
  };

  UI.showAd = function (place) {
    return new Promise(resolve => {
      const s = G.main;
      if (P.adLeft(s, place) <= 0) { UI.toast('ad', t('ad_none')); resolve(false); return; }
      if (P.adsFree(s)) { UI.toast('ad', t('ad_skip'), { ok: true }); resolve(true); return; }
      if (root.BZ_ADS && root.BZ_ADS.show) { root.BZ_ADS.show(place).then(r => { if (r === 'none') placeholder(resolve); else resolve(!!r); }).catch(() => placeholder(resolve)); return; }
      placeholder(resolve);
    }).then(ok => { if (ok) P.adUse(G.main, place); return ok; });
  };
  function placeholder(resolve) {
      let tm = 0;
      UI.modal('<div class="hero"><div class="pic">' + ic('ad') + '</div><h4>' + t('ad_title') + '</h4><p>' + t('ad_text') + '</p></div><div class="progress"><i id="adBar" style="width:0%"></i></div><div class="row center"><button class="btn btn-ghost" id="adX">' + t('cancel') + '</button><button class="btn btn-primary off" id="adOk">' + t('ad_reward') + '</button></div>', false, {
        '#adX': () => { clearInterval(tm); UI.closeModal(); resolve(false); },
        '#adOk': (el) => { if (el.classList.contains('off')) return; UI.closeModal(); resolve(true); }
      });
      const start = Date.now();
      tm = setInterval(() => {
        const k = Math.min(1, (Date.now() - start) / 4000);
        const bar = $('adBar');
        if (!bar) { clearInterval(tm); return; }
        bar.style.width = (k * 100).toFixed(0) + '%';
        if (k >= 1) { clearInterval(tm); const ok = $('adOk'); if (ok) ok.classList.remove('off'); }
      }, 100);
  }

  UI.levelModal = function () {
    const s = G.main;
    const need = P.xpFor(s.level);
    let h = '<div class="hero"><div class="lvl-big">' + s.level + '</div><h4>' + t('lvl_title') + '</h4><p>' + t('lvl_next', { v: F.int(need - s.xp), n: s.level + 1 }) + '</p></div><div class="progress"><i style="width:' + (s.xp / need * 100).toFixed(1) + '%"></i></div><p style="margin-top:var(--sp-3)">' + t('lvl_bonus', { v: F.pct(0.01 * (s.level - 1)) }) + '</p>';
    h += '<div class="sec-title" style="margin-top:var(--sp-5)"><h3>' + t('lvl_rewards') + '</h3></div>';
    for (let L = s.level + 1; L <= s.level + 5; L++) {
      const r = P.levelReward(L);
      const unlock = Object.keys(P.UNLOCKS).find(k => P.UNLOCKS[k] === L);
      h += '<div class="kv"><span>' + t('lvl', { n: L }) + (unlock ? '  ·  ' + t('lvl_unlock', { p: t('tab_' + unlock) }) : '') + '</span><span class="rws">' + ['egg', 'core', 'royal', 'part'].filter(k => r[k]).map(k => rewardChip({ [k]: r[k] })).join('') + '</span></div>';
    }
    h += '<div class="row"><button class="btn btn-primary" data-close>' + t('ok') + '</button></div>';
    UI.modal(h, true);
  };

  function promoSlides(s) {
    const out = [];
    if (s.blessOffer) out.push({ id: 'bless', c: 'p-bless', icon: 'sparkle', a: t('promo_bless'), b: t('promo_bless_d'), act: 'bless' });
    if ((s.quick.tasks || []).some(q => !q.claimed && M.questDone(q)) && P.unlocked(s, 'daily')) out.push({ id: 'quick', c: 'p-pass', icon: 'clock', a: t('promo_quick'), b: t('promo_quick_d'), act: 'go:daily' });
    if (P.unlocked(s, 'bees') && s.tickets.egg >= 1) out.push({ id: 'tk', c: 'p-starter', icon: 'ticket', a: t('promo_tickets', { n: s.tickets.egg }), b: t('promo_tickets_d'), act: 'go:bees' });
    if (P.unlocked(s, 'bees') && s.tickets.royal >= 1) { const f = BZ.BEE_BY_ID[P.featured()]; out.push({ id: 'feat', c: 'p-feat', bee: f, a: t('promo_featured', { b: n(f.name) }), b: t('promo_featured_d'), act: 'go:bees' }); }
    if (P.unlocked(s, 'pass') && P.passReady(s)) out.push({ id: 'pass', c: 'p-pass', icon: 'ticket', a: t('promo_pass', { n: P.passTier(s) }), b: t('promo_pass_d'), act: 'go:pass' });
    if (P.unlocked(s, 'worlds') && P.canOpenWorld(s, s.worldsOpen.length)) out.push({ id: 'world', c: 'p-vip', icon: 'globe', a: t('promo_world'), b: t('promo_world_d'), act: 'go:worlds' });
    return out;
  }
  UI.promoHtml = () => '<div class="promo" id="promo"></div>';
  function updatePromo(now) {
    const el = $('promo');
    if (!el) return;
    const slides = promoSlides(G.main);
    if (!slides.length) { el.style.display = 'none'; return; }
    el.style.display = '';
    if (now - promoAt > 5000) { promoAt = now; promoIdx++; }
    const i = promoIdx % slides.length;
    const sl = slides[i];
    const key = slides.map(x => x.id).join(',') + ':' + i + ':' + BZ.lang + ':' + sl.a;
    if (key === promoKey && el.firstChild) return;
    promoKey = key;
    el.innerHTML = '<button class="slide ' + sl.c + '" data-act="promo" data-arg="' + sl.act + '"><span class="spic">' + (sl.bee ? UI.beeSvg(sl.bee, 44) : ic(sl.icon)) + '</span><span class="stxt"><b>' + esc(sl.a) + '</b><small>' + esc(sl.b) + '</small></span><span class="dots">' + slides.map((x, k) => '<i class="' + (k === i ? 'on' : '') + '"></i>').join('') + '</span></button>';
  }

  UI.extFrame = function (now) {
    const s = G.main;
    const need = P.xpFor(s.level);
    const lv = '<span class="ring" style="--p:' + (s.xp / need * 360).toFixed(0) + 'deg"><span>' + s.level + '</span></span>';
    const cl = $('chipLevel');
    if (cl && cl._v !== lv) { cl._v = lv; cl.innerHTML = lv; }
    const tk = ic('ticket') + '<span class="num">' + F.int(s.tickets.egg) + '</span>';
    const ct = $('chipTickets');
    if (ct && ct._v !== tk) { ct._v = tk; ct.innerHTML = tk; }
    const bb = $('blessBtn');
    if (bb) bb.style.display = s.blessOffer ? '' : 'none';
    const ab = $('adBtn');
    if (ab) ab.style.display = P.adLeft(s, 'boost') > 0 ? '' : 'none';
    document.querySelectorAll('[data-tab]').forEach(b => {
      const lock = !P.unlocked(s, b.dataset.tab);
      if (b.classList.contains('locked') !== lock) b.classList.toggle('locked', lock);
    });
    if (UI.page() === 'hive') updatePromo(now);
  };

  UI.extDots = function (flags) {
    const s = G.main;
    flags.pass = P.passReady(s);
    flags.bees = (s.tickets.egg || 0) > 0 || (s.tickets.royal || 0) > 0;
    flags.workshop = (s.tickets.core || 0) > 0;
    flags.worlds = P.canOpenWorld(s, s.worldsOpen.length);
    for (const k in flags) if (!P.unlocked(s, k)) flags[k] = false;
  };

  UI.extAct = function (act, arg) {
    switch (act) {
      case 'passall': G.passAll(); break;
      case 'passclaim': G.passClaim(+arg); break;
      case 'hatchtab': hatchTab = arg; UI.render(); break;
      case 'pull': { const [bn, c] = arg.split(':'); G.pull(bn, +c); break; }
      case 'adticket': G.adTickets(); break;
      case 'core': G.equipCore(arg); break;
      case 'travel': G.travel(+arg); break;
      case 'openworld': G.openWorld(+arg); break;
      case 'sell': G.askSell(); break;
      case 'quick': G.claimQuick(+arg); break;
      case 'noads': G.buyNoAds(); break;
      case 'cloudin': G.cloudSignIn(); break;
      case 'cloudout': G.cloudSignOut(); break;
      case 'cloudsync': G.cloudSync(true); break;
      case 'promo':
        if (arg === 'bless') UI.showBless();
        else if (arg.startsWith('go:')) UI.show(arg.slice(3));
        break;
    }
  };

  UI.initExt = function (game) {
    G = game;
    const cl = $('chipLevel');
    if (cl) cl.onclick = () => UI.levelModal();
    const ct = $('chipTickets');
    if (ct) ct.onclick = () => { if (P.unlocked(G.main, 'bees')) UI.show('bees'); };
  };
})(window);
