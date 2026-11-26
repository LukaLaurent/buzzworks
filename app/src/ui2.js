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
    coronate_text: 'Royal jelly, queen skills and the current swarm reset. You keep crowns, bees, tickets and trophies, and gain {v} {c}.',
    reset_text: 'Every world, bee, ticket and trophy will be lost. This cannot be undone.',
    bees_how: 'Bees hatch from eggs. Egg tickets come from ticket bees, lucky bees, quests and quick tasks. Royal tickets come from trophies and swarm goals. Bees are never lost.',
    bees_none: 'No bees yet. Catch a ticket bee and hatch your first egg.',
    lucky_ticket: 'Ticket shower', lucky_ticket_d: '+{v} egg tickets', lucky_chest: 'Treasure chest', lucky_chest_d: 'a skin part and an egg ticket',
    tbee: 'Ticket bee', found_ticket: 'You found an egg ticket', q_ticketbee: 'Catch {n} ticket bees',
    lock_queen: 'The Queen appears when your hive gets close to its first swarm', lock_worlds: 'Worlds open after your first crown', locked_tab: '{p} unlocks at level {n}', unlocked_tab: '{p} unlocked',
    lvl: 'Level {n}', lvl_up: 'Level {n}!', lvl_title: 'Player level', lvl_next: '{v} XP to level {n}', lvl_bonus: '+1% honey per level  ·  now +{v}', lvl_rewards: 'Next rewards', lvl_unlock: 'Unlocks {p}',
    pass_title: 'Hive pass', pass_season: 'Season {n}', pass_ends: 'Ends in {t}', pass_tier: 'Tier {n} / {m}', pass_claim_all: 'Claim all', pass_inf_ready: 'x{n} ready', pass_inf_d: 'Endless tier, claimed {n} times this week', pass_inf_locked: 'Endless tier, opens after tier {n}', wn_tab: 'What\u2019s new', wn_bar_d: 'See what changed in this update', wn_hide: 'Hide', pass_how: 'The pass is free. Every action fills it: buying, lucky bees, ticket bees, quests, swarms and hatching.',
    hatch: 'Hatchery', hb_std: 'Standard egg', hb_royal: 'Royal egg', featured: 'Featured', featured_d: '{b} rate up  ·  ends in {t}', pull1: 'Hatch 1', pull10: 'Hatch 10', rates: 'Rates', pity_left: 'Legendary guaranteed within {n} hatches', guarantee_on: 'Next legendary is the featured bee', fifty: 'A legendary has a 50% chance to be the featured bee. If not, the next one is.', hatch_results: 'Results', new_tag: 'New', need_tickets: 'Not enough tickets', std_d: 'Hatch a random bee with an egg ticket', ad_tickets: '+2 egg tickets',
    bless_title: 'Choose a blessing', bless_sub: 'It lasts until your next swarm', bless_reroll: 'Reroll', bless_now: 'Blessings this swarm', bless_pending: 'Blessing ready', bless_none: 'Blessings appear at the start of each swarm and at big honey milestones.',
    bl_bloom: 'Blooming fields', bl_quick: 'Quick wings', bl_paws: 'Strong paws', bl_thrift: 'Bargain wax', bl_elixir: 'Long dance', bl_focus: 'Focus', bl_jelly: 'Jelly harvest', bl_rhythm: 'Rhythm', bl_nectar: 'Nectar flow', bl_ticket: 'Ticket wind', bl_crown: 'Crown blessing', bl_golden: 'Golden hour', bl_royal: 'Royal favor',
    bd_honey: '+{v} honey', bd_luckyFreq: 'Lucky bees {v} more often', bd_tap: 'Taps x{v}', bd_cost: 'Producers {v} cheaper', bd_luckyDur: 'Lucky effects {v} longer', bd_focus: '{p} x{v}', bd_rj: '+{v} royal jelly', bd_combo: '+{v} max combo', bd_ticketFreq: 'Ticket bees {v} more often', bd_offlineH: '+{v} h away earnings', bl_dew: 'Morning dew', bl_spark: 'Spark', bl_breeze: 'Lucky breeze', bl_workers: 'Busy workers', bl_beam: 'Sunbeam', bl_harvest: 'Great harvest', bl_nap: 'Sweet dreams', bl_sunburst: 'Sunburst', bl_grace: 'Queen\u2019s grace', bl_storm: 'Fortune storm', bl_bargain: 'Royal bargain', bl_celestial: 'Celestial hive', bl_goldenage: 'Golden age',
    ad_skip: 'No ads for you: reward granted', ad_left: '{n} left today', ad_none: 'No more ads today', watch_ad: 'Watch ad',
    ad_boost: 'x2 honey for 30 min', collect_ad: 'Collect x2 (ad)', dance_wait: 'Bee dance ready in {t}',
    promo_featured: 'Featured: {b}', promo_featured_d: 'Royal egg rate up this week', promo_pass: 'Hive pass  ·  tier {n}', promo_pass_d: 'Rewards waiting to be claimed', promo_bless: 'Blessing ready', promo_bless_d: 'Pick one of three bonuses', promo_tickets: '{n} egg tickets', promo_tickets_d: 'Hatch them in the Bees tab', promo_quick: 'Quick task done', promo_quick_d: 'Claim it in the Daily tab', promo_world: 'A new world can open', promo_world_d: 'Spend crowns in the Worlds tab',
    st_level: 'Player level', tg_level: 'Reach player level {v}', got_items: 'You got',
    quick_title: 'Quick tasks', quick_reset: 'New tasks in {t}', quick_honey: '4 min of honey',
    cores_title: 'Hive cores', core_slots: 'Equipped cores', core_empty: 'Empty slot', core_more: 'More slots at level 20 and with Frost essence', core_hatch: 'Core summoning', core_d: 'Summon a hive core with a core ticket', core_full: 'All slots are full. Remove a core first.', core_tap: 'Tap a core to equip or remove it', core_new: 'New core', core_level: 'Core level up', core_copy: 'Another copy', core_none: 'No cores yet. Core tickets come from daily quests, the streak, the pass and trophies.',
    ck_honey: '+{v} honey', ck_tap: '+{v} tap power', ck_cost: 'Producers {v} cheaper', ck_luckyFreq: 'Lucky bees {v} more often', ck_luckyDur: 'Lucky effects {v} longer', ck_offlineH: '+{v} h away earnings', ck_ticketFreq: 'Ticket bees {v} more often', ck_rj: '+{v} royal jelly', ck_combo: '+{v} max combo', ck_lucky: 'Lucky bees {v} more often and longer',
    skins_title: 'Hive skins', skin_parts: '{n} / {m} parts', skin_how: 'Skin parts drop from treasure chests on lucky bees, level rewards, the streak and the pass. Every skin you own gives +3% honey, and the skin in use adds its own bonus everywhere. Skins show in the Flower meadow, other worlds keep their own look.', skin_none: 'No bonus', skin_pass: 'Hive pass reward',
    worlds_title: 'Worlds', world_here: 'You are here', world_go: 'Travel', world_open: 'Open  ·  {v} {c}', world_need: 'Needs {v} crowns in your current world', world_prev: 'Open the previous world first', world_crowns: '{v} crowns',
    wd_meadow: 'The classic hive with no twist.', wd_dunes: 'Prices rise more slowly, but lucky bees are rarer.', wd_glacier: 'Half the honey, but triple away earnings, 6 more hours away and longer lucky effects.', wd_moon: 'Lucky bees more than twice as often, but taps are weak.', wd_ember: 'Double royal jelly, but prices rise faster.',
    worlds_how: 'Each world keeps its own honey, queen and crowns. Bees, cores, skins, tickets and your level are shared everywhere.',
    essence: 'Essence', essence_bonus: '+{h} honey and +{r} royal jelly in every world', sell_title: 'Sell this world?', sell_text: 'This world restarts from zero: honey, producers, royal jelly, queen skills, crowns and its trophies. Bees, cores, skins, tickets and other worlds stay. You gain {v} {e}.', sell_btn: 'Sell this world  ·  +{v} essence', sell_need: 'Earn {v} {c} to sell this world', sell_done: '+{v} {e}', ess_perks: 'Essence perks', ep_slot: '+1 core slot', ep_lucky: 'Lucky bees 20% more often', ep_mind: 'Hive mind without crowns', ep_crown: '+1 crown at every coronation', ep_tickets: 'Ticket bees give double', travel_done: 'Welcome to {w}', world_opened: '{w} is open', ess_at: '{n} essence',
    mind_locked: 'Needs 5 crowns',
    cloud_title: 'Cloud save', cloud_d: 'Sign in with Google to keep your progress on every device and join the weekly league.', cloud_cta: 'Save online', auto_mode: 'How to buy producers', auto_mode_d: 'Best value buys one of the most worth it producer at a time. The others buy in that amount, like the buttons above the producers.', auto_best: 'Best value', new_btn: 'What\u2019s new?', new_kicker: 'Fresh update', new_title: 'What\u2019s new in {v}', new_before: 'Earlier updates', new_ver: 'Version {v}', new_go: 'Let\u2019s play', cloud_why_t: 'Keep your hive safe', cloud_why_d: 'Sign in with your Google account, it takes a few seconds.', cloud_why_1: 'Play the same hive on your phone and your computer', cloud_why_2: 'Join the weekly league and the rankings', cloud_why_3: 'Never lose your progress, even if the browser is cleared', cloud_later: 'Later', cloud_signin: 'Sign in with Google', cloud_signout: 'Sign out', cloud_sync: 'Sync now', cloud_last: 'Last sync {t} ago', cloud_never: 'Not synced yet', cloud_cfg: 'Cloud save is not set up on this site yet.', cloud_loaded: 'Cloud save loaded', cloud_saved: 'Saved online', cloud_err: 'Cloud save failed. Your progress is still saved on this device.', cloud_pick: 'Two saves found', cloud_pick_d: 'The save in your Google Drive is newer than this device. Which one do you want to keep?', cloud_use: 'Use the cloud save', cloud_keep: 'Keep this device',
    trophies_bonus: 'Each hall of fame trophy gives +2% honey', run_title: 'Swarm goals', run_d: 'They reset at every swarm and give tickets again', hall_title: 'Hall of fame', ag_world: 'Collection and worlds',
    tg_runHoney: 'Make {v} honey this swarm', tg_runOwn: 'Own {v} producers', tg_runUpg: 'Buy {v} upgrades this swarm', tg_runLucky: 'Catch {v} lucky bees this swarm', tg_runTaps: 'Tap {v} times this swarm', tg_runColony: 'Reach colony level {v}',
    tg_cores: 'Find {v} hive cores', tg_skins: 'Complete {v} hive skins', tg_worlds: 'Open {v} worlds', goal_done: 'Swarm goal: {n}',
    play: 'Play', tip_title: 'Tip', tip_1: 'Ticket bees carry egg tickets. Tap them before they fly away.', tip_2: 'Swarm goals reset at every swarm and give tickets each time.', tip_3: 'Equip hive cores in the Workshop for lasting bonuses.', tip_4: 'Each skin you complete gives +3% honey.', tip_5: 'Crowns open new worlds with their own twist.'
  }, {
    tab_pass: 'Pass', tab_workshop: 'Atelier', tab_worlds: 'Mondes',
    ticket_egg: 'Tickets d\'œuf', ticket_royal: 'Tickets royaux', ticket_core: 'Tickets de noyau', tickets: 'Tickets',
    r_egg: '+{v} tickets d\'œuf', r_royal: '+{v} tickets royaux', r_core: '+{v} tickets de noyau', r_part: 'Pièce de décor : {s}', r_skin: 'Décor terminé : {s}', r_honey: '+{v} de miel',
    swarm_text: 'Le miel, les producteurs, les améliorations et les objectifs de l\'essaim repartent de zéro. Vous gardez abeilles, tickets, compétences et trophées, et gagnez {v} gelée royale.',
    coronate_text: 'La gelée royale, les compétences de la reine et l\'essaim actuel repartent de zéro. Vous gardez couronnes, abeilles, tickets et trophées, et gagnez {v} {c}.',
    reset_text: 'Tous les mondes, abeilles, tickets et trophées seront perdus. Impossible d\'annuler.',
    bees_how: 'Les abeilles éclosent des œufs. Les tickets d\'œuf viennent des abeilles à ticket, des abeilles dorées, des quêtes et des tâches rapides. Les tickets royaux viennent des trophées et des objectifs de l\'essaim. Les abeilles ne se perdent jamais.',
    bees_none: 'Pas encore d\'abeille. Attrapez une abeille à ticket et faites éclore votre premier œuf.',
    lucky_ticket: 'Pluie de tickets', lucky_ticket_d: '+{v} tickets d\'œuf', lucky_chest: 'Coffre au trésor', lucky_chest_d: 'une pièce de décor et un ticket d\'œuf',
    tbee: 'Abeille à ticket', found_ticket: 'Vous trouvez un ticket d\'œuf', q_ticketbee: 'Attrapez {n} abeilles à ticket',
    lock_queen: 'La reine arrive quand la ruche approche de son premier essaim', lock_worlds: 'Les mondes s\'ouvrent après votre première couronne', locked_tab: '{p} se débloque au niveau {n}', unlocked_tab: '{p} débloqué',
    lvl: 'Niveau {n}', lvl_up: 'Niveau {n} !', lvl_title: 'Niveau du joueur', lvl_next: '{v} XP pour le niveau {n}', lvl_bonus: '+1 % de miel par niveau  ·  actuellement +{v}', lvl_rewards: 'Prochaines récompenses', lvl_unlock: 'Débloque {p}',
    pass_title: 'Pass de la ruche', pass_season: 'Saison {n}', pass_ends: 'Fin dans {t}', pass_tier: 'Palier {n} / {m}', pass_claim_all: 'Tout récupérer', pass_inf_ready: 'x{n} prêt', pass_inf_d: 'Palier sans fin, récupéré {n} fois cette semaine', pass_inf_locked: 'Palier sans fin, ouvert après le palier {n}', wn_tab: 'Nouveautés', wn_bar_d: 'Découvrez ce qui a changé', wn_hide: 'Masquer', pass_how: 'Le pass est gratuit. Chaque action le remplit : achats, abeilles dorées, abeilles à ticket, quêtes, essaims et éclosions.',
    hatch: 'Couvoir', hb_std: 'Œuf standard', hb_royal: 'Œuf royal', featured: 'En vedette', featured_d: '{b} en vedette  ·  fin dans {t}', pull1: 'Éclore 1', pull10: 'Éclore 10', rates: 'Taux', pity_left: 'Légendaire garantie d\'ici {n} éclosions', guarantee_on: 'La prochaine légendaire sera l\'abeille en vedette', fifty: 'Une légendaire a 50 % de chances d\'être l\'abeille en vedette. Sinon, la suivante l\'est.', hatch_results: 'Résultats', new_tag: 'Nouveau', need_tickets: 'Pas assez de tickets', std_d: 'Faites éclore une abeille au hasard avec un ticket d\'œuf', ad_tickets: '+2 tickets d\'œuf',
    bless_title: 'Choisissez une bénédiction', bless_sub: 'Elle dure jusqu\'au prochain essaim', bless_reroll: 'Relancer', bless_now: 'Bénédictions de cet essaim', bless_pending: 'Bénédiction prête', bless_none: 'Les bénédictions arrivent au début de chaque essaim et aux grands paliers de miel.',
    bl_bloom: 'Champs en fleurs', bl_quick: 'Ailes rapides', bl_paws: 'Pattes fortes', bl_thrift: 'Cire bon marché', bl_elixir: 'Longue danse', bl_focus: 'Concentration', bl_jelly: 'Récolte de gelée', bl_rhythm: 'Rythme', bl_nectar: 'Flot de nectar', bl_ticket: 'Vent de tickets', bl_crown: 'Bénédiction de la couronne', bl_golden: 'Heure dorée', bl_royal: 'Faveur royale',
    bd_honey: '+{v} de miel', bd_luckyFreq: 'Abeilles dorées {v} plus fréquentes', bd_tap: 'Touchers x{v}', bd_cost: 'Producteurs {v} moins chers', bd_luckyDur: 'Effets dorés {v} plus longs', bd_focus: '{p} x{v}', bd_rj: '+{v} de gelée royale', bd_combo: '+{v} au combo maximum', bd_ticketFreq: 'Abeilles à ticket {v} plus fréquentes', bd_offlineH: '+{v} h de gains en absence', bl_dew: 'Rosée du matin', bl_spark: 'Étincelle', bl_breeze: 'Brise dorée', bl_workers: 'Ouvrières zélées', bl_beam: 'Rayon de soleil', bl_harvest: 'Grande récolte', bl_nap: 'Doux rêves', bl_sunburst: 'Éclat solaire', bl_grace: 'Grâce de la reine', bl_storm: 'Tempête de fortune', bl_bargain: 'Marché royal', bl_celestial: 'Ruche céleste', bl_goldenage: 'Âge d\u2019or',
    ad_skip: 'Pas de pub pour vous : récompense donnée', ad_left: 'encore {n} aujourd\'hui', ad_none: 'Plus de pub aujourd\'hui', watch_ad: 'Voir une pub',
    ad_boost: 'Miel x2 pendant 30 min', collect_ad: 'Récupérer x2 (pub)', dance_wait: 'Danse des abeilles prête dans {t}',
    promo_featured: 'En vedette : {b}', promo_featured_d: 'Œuf royal boosté cette semaine', promo_pass: 'Pass de la ruche  ·  palier {n}', promo_pass_d: 'Des récompenses vous attendent', promo_bless: 'Bénédiction prête', promo_bless_d: 'Choisissez un bonus parmi trois', promo_tickets: '{n} tickets d\'œuf', promo_tickets_d: 'Faites-les éclore dans l\'onglet Abeilles', promo_quick: 'Tâche rapide terminée', promo_quick_d: 'Récupérez-la dans l\'onglet Jour', promo_world: 'Un nouveau monde peut s\'ouvrir', promo_world_d: 'Dépensez des couronnes dans l\'onglet Mondes',
    st_level: 'Niveau du joueur', tg_level: 'Atteindre le niveau {v}', got_items: 'Vous recevez',
    quick_title: 'Tâches rapides', quick_reset: 'Nouvelles tâches dans {t}', quick_honey: '4 min de miel',
    cores_title: 'Noyaux de ruche', core_slots: 'Noyaux équipés', core_empty: 'Emplacement vide', core_more: 'Plus d\'emplacements au niveau 20 et avec l\'essence de givre', core_hatch: 'Invocation de noyau', core_d: 'Invoquez un noyau de ruche avec un ticket de noyau', core_full: 'Tous les emplacements sont pris. Retirez d\'abord un noyau.', core_tap: 'Touchez un noyau pour l\'équiper ou le retirer', core_new: 'Nouveau noyau', core_level: 'Noyau amélioré', core_copy: 'Un exemplaire de plus', core_none: 'Pas encore de noyau. Les tickets de noyau viennent des quêtes du jour, de la série, du pass et des trophées.',
    ck_honey: '+{v} de miel', ck_tap: '+{v} de récolte par toucher', ck_cost: 'Producteurs {v} moins chers', ck_luckyFreq: 'Abeilles dorées {v} plus fréquentes', ck_luckyDur: 'Effets dorés {v} plus longs', ck_offlineH: '+{v} h de gains en absence', ck_ticketFreq: 'Abeilles à ticket {v} plus fréquentes', ck_rj: '+{v} de gelée royale', ck_combo: '+{v} au combo maximum', ck_lucky: 'Abeilles dorées {v} plus fréquentes et plus longues',
    skins_title: 'Décors de ruche', skin_parts: '{n} / {m} pièces', skin_how: 'Les pièces de décor tombent des coffres des abeilles dorées, des récompenses de niveau, de la série et du pass. Chaque décor possédé donne +3 % de miel, et le décor utilisé ajoute son propre bonus partout. Les décors s\'affichent dans la Prairie fleurie, les autres mondes gardent leur propre style.', skin_none: 'Sans bonus', skin_pass: 'Récompense du pass',
    worlds_title: 'Mondes', world_here: 'Vous êtes ici', world_go: 'Voyager', world_open: 'Ouvrir  ·  {v} {c}', world_need: 'Il faut {v} couronnes dans votre monde actuel', world_prev: 'Ouvrez d\'abord le monde précédent', world_crowns: '{v} couronnes',
    wd_meadow: 'La ruche classique, sans particularité.', wd_dunes: 'Les prix montent moins vite, mais les abeilles dorées sont plus rares.', wd_glacier: 'Moitié moins de miel, mais gains en absence triplés, 6 h d\'absence en plus et effets dorés plus longs.', wd_moon: 'Abeilles dorées plus de deux fois plus fréquentes, mais touchers faibles.', wd_ember: 'Gelée royale doublée, mais les prix montent plus vite.',
    worlds_how: 'Chaque monde garde son miel, sa reine et ses couronnes. Abeilles, noyaux, décors, tickets et niveau sont partagés partout.',
    essence: 'Essence', essence_bonus: '+{h} de miel et +{r} de gelée royale dans tous les mondes', sell_title: 'Vendre ce monde ?', sell_text: 'Ce monde repart de zéro : miel, producteurs, gelée royale, compétences de la reine, couronnes et ses trophées. Abeilles, noyaux, décors, tickets et autres mondes restent. Vous gagnez {v} {e}.', sell_btn: 'Vendre ce monde  ·  +{v} essences', sell_need: 'Gagnez {v} {c} pour vendre ce monde', sell_done: '+{v} {e}', ess_perks: 'Avantages d\'essence', ep_slot: '+1 emplacement de noyau', ep_lucky: 'Abeilles dorées 20 % plus fréquentes', ep_mind: 'Esprit de ruche sans couronnes', ep_crown: '+1 couronne à chaque couronnement', ep_tickets: 'Abeilles à ticket doublées', travel_done: 'Bienvenue : {w}', world_opened: '{w} est ouvert', ess_at: '{n} essences',
    mind_locked: 'Il faut 5 couronnes',
    cloud_title: 'Sauvegarde en ligne', cloud_d: 'Connectez-vous avec Google pour garder votre progression sur tous vos appareils et rejoindre la ligue de la semaine.', cloud_cta: 'Sauvegarde en ligne', auto_mode: 'Façon d’acheter les producteurs', auto_mode_d: 'Meilleur rapport achète un exemplaire du producteur le plus rentable à la fois. Les autres achètent par cette quantité, comme les boutons au-dessus des producteurs.', auto_best: 'Meilleur rapport', new_btn: 'Nouveautés', new_kicker: 'Mise à jour', new_title: 'Nouveautés de la {v}', new_before: 'Mises à jour précédentes', new_ver: 'Version {v}', new_go: 'C\u2019est parti', cloud_why_t: 'Gardez votre ruche à l’abri', cloud_why_d: 'Connectez-vous avec votre compte Google, cela prend quelques secondes.', cloud_why_1: 'Jouez la même ruche sur téléphone et ordinateur', cloud_why_2: 'Rejoignez la ligue de la semaine et les classements', cloud_why_3: 'Ne perdez jamais votre progression, même si le navigateur est vidé', cloud_later: 'Plus tard', cloud_signin: 'Se connecter avec Google', cloud_signout: 'Se déconnecter', cloud_sync: 'Synchroniser', cloud_last: 'Synchronisé il y a {t}', cloud_never: 'Pas encore synchronisé', cloud_cfg: 'La sauvegarde en ligne n\'est pas encore configurée sur ce site.', cloud_loaded: 'Sauvegarde en ligne chargée', cloud_saved: 'Enregistré en ligne', cloud_err: 'Échec de la sauvegarde en ligne. La progression reste enregistrée sur cet appareil.', cloud_pick: 'Deux sauvegardes trouvées', cloud_pick_d: 'La sauvegarde de votre Google Drive est plus récente que celle de cet appareil. Laquelle garder ?', cloud_use: 'Utiliser la sauvegarde en ligne', cloud_keep: 'Garder cet appareil',
    trophies_bonus: 'Chaque trophée du palmarès donne +2 % de miel', run_title: 'Objectifs de l\'essaim', run_d: 'Ils repartent à chaque essaim et redonnent des tickets', hall_title: 'Palmarès', ag_world: 'Collection et mondes',
    tg_runHoney: 'Produire {v} de miel dans cet essaim', tg_runOwn: 'Posséder {v} producteurs', tg_runUpg: 'Acheter {v} améliorations dans cet essaim', tg_runLucky: 'Attraper {v} abeilles dorées dans cet essaim', tg_runTaps: 'Toucher {v} fois dans cet essaim', tg_runColony: 'Atteindre le niveau de colonie {v}',
    tg_cores: 'Trouver {v} noyaux de ruche', tg_skins: 'Terminer {v} décors', tg_worlds: 'Ouvrir {v} mondes', goal_done: 'Objectif d\'essaim : {n}',
    play: 'Jouer', tip_title: 'Astuce', tip_1: 'Les abeilles à ticket portent des tickets d\'œuf. Touchez-les avant qu\'elles s\'envolent.', tip_2: 'Les objectifs de l\'essaim repartent à chaque essaim et redonnent des tickets.', tip_3: 'Équipez des noyaux dans l\'Atelier pour des bonus durables.', tip_4: 'Chaque décor terminé donne +3 % de miel.', tip_5: 'Les couronnes ouvrent de nouveaux mondes, chacun avec sa particularité.'
  });

  const TICKET_COLOR = { egg: 'tk-egg', royal: 'tk-royal', core: 'tk-core', legend: 'tk-legend', mystic: 'tk-mystic' };
  function rewardChip(r) {
    if (r.egg) return '<span class="rw tk-egg">' + ic('ticket') + 'x' + r.egg + '</span>';
    if (r.royal) return '<span class="rw tk-royal">' + ic('ticket') + 'x' + r.royal + '</span>';
    if (r.core) return '<span class="rw tk-core">' + ic('ticket') + 'x' + r.core + '</span>';
    if (r.mystic) return '<span class="rw tk-mystic" title="' + esc(t('ticket_mystic')) + '">' + BZ.eggSvg('mystic', 18) + 'x' + r.mystic + '</span>';
    if (r.legend) return '<span class="rw tk-legend" title="' + esc(t('ticket_legend')) + '">' + BZ.eggSvg('legend', 18) + 'x' + r.legend + '</span>';
    if (r.part) return '<span class="rw part">' + ic('palette') + 'x' + r.part + '</span>';
    if (r.boost) { const bb = BZ.BOOST_BY_ID[r.boost] || { mult: 2, dur: 1800 }; return '<span class="rw bst">' + ic(bb.icon || 'bolt') + (bb.mult ? 'x' + bb.mult : esc(n(bb.name))) + '  ' + Math.round(bb.dur / 60) + ' min</span>'; }
    if (r.skin) return '<span class="rw rwskin">' + ic('palette') + n(BZ.SKIN_BY_ID[r.skin].name) + '</span>';
    if (r.bee) return '<span class="rw rwbee">' + UI.beeSvg(BZ.BEE_BY_ID[r.bee], 22) + n(BZ.BEE_BY_ID[r.bee].name) + '</span>';
    if (r.warp) return '<span class="rw bst">' + ic('drop') + t('quick_honey') + '</span>';
    return '';
  }
  function gotText(got) {
    return got.map(g => {
      if (g.k === 'egg') return t('r_egg', { v: g.v });
      if (g.k === 'royal') return t('r_royal', { v: g.v });
      if (g.k === 'core') return t('r_core', { v: g.v });
      if (g.k === 'mystic') return t('r_mystic', { v: g.v });
      if (g.k === 'legend') return t('r_legend', { v: g.v });
      if (g.k === 'part') return t('r_part', { s: n(BZ.SKIN_BY_ID[g.v].name) });
      if (g.k === 'skin') return t('r_skin', { s: n(BZ.SKIN_BY_ID[g.v].name) });
      if (g.k === 'bee') return n(BZ.BEE_BY_ID[g.v].name);
      if (g.k === 'boost') return BZ.BOOST_BY_ID[g.v] && BZ.BOOST_BY_ID[g.v].name ? n(BZ.BOOST_BY_ID[g.v].name) : t('ad_boost');
      if (g.k === 'honey') return t('r_honey', { v: F.num(g.v) });
      return '';
    }).filter(Boolean).join('  ·  ');
  }
  UI.gotText = gotText;
  UI.rewardChip = rewardChip;
  UI.rewardChips = r => ['bee', 'skin', 'mystic', 'legend', 'royal', 'core', 'part', 'egg', 'boost', 'warp'].filter(k => r[k]).map(k => rewardChip({ [k]: r[k] })).join('');

  function blessDesc(e) {
    const b = P.BLESS_BY_ID[e.id];
    const out = [];
    if (b.honey) out.push(t('bd_honey', { v: F.pct(b.honey) }));
    if (b.focus) out.push(t('bd_focus', { p: n(BZ.PRODUCERS.find(p => p.id === e.target).name), v: b.focus }));
    if (b.rj) out.push(t('bd_rj', { v: F.pct(b.rj) }));
    if (b.tap) out.push(t('bd_tap', { v: F.num(1 + b.tap, { small: true }) }));
    if (b.luckyFreq) out.push(t('bd_luckyFreq', { v: F.pct(b.luckyFreq) }));
    if (b.luckyDur) out.push(t('bd_luckyDur', { v: F.pct(b.luckyDur) }));
    if (b.ticketFreq) out.push(t('bd_ticketFreq', { v: F.pct(b.ticketFreq) }));
    if (b.cost) out.push(t('bd_cost', { v: F.pct(b.cost) }));
    if (b.combo) out.push(t('bd_combo', { v: F.num(b.combo, { small: true }) }));
    if (b.offlineH) out.push(t('bd_offlineH', { v: b.offlineH }));
    return out.join('  ·  ');
  }
  const BLESS_ICON = { bloom: 'flower', quick: 'sparkle', paws: 'tap', thrift: 'drop', elixir: 'clock', dew: 'drop', spark: 'music', focus: 'star', jelly: 'jelly', rhythm: 'music', nectar: 'drop', ticket: 'ticket', breeze: 'sparkle', workers: 'worker', crown: 'crown', golden: 'sparkle', royal: 'jelly', beam: 'star', harvest: 'jelly', nap: 'clock', sunburst: 'sun', grace: 'crown', storm: 'bolt', bargain: 'shop', celestial: 'celestial', goldenage: 'gem' };
  UI.blessDesc = blessDesc;

  function coreText(c, lvl) {
    const v = c.v * Math.max(1, lvl);
    return t('ck_' + c.kind, { v: c.kind === 'offlineH' || c.kind === 'combo' ? F.num(v, { small: true }) : F.pct(v) });
  }
  function coreSvg(c, size, locked) {
    const col = locked ? 'var(--border)' : c.c;
    const id = 'cg' + Math.random().toString(36).slice(2, 7);
    return '<svg viewBox="0 0 64 64" width="' + size + '" height="' + size + '" aria-hidden="true"><defs><radialGradient id="' + id + '" cx="40%" cy="35%" r="70%"><stop offset="0" stop-color="#fff" stop-opacity="' + (locked ? 0.1 : 0.75) + '"/><stop offset="1" stop-color="' + col + '" stop-opacity="0"/></radialGradient></defs>' +
      (c.r >= 3 && !locked ? '<circle cx="32" cy="32" r="29" fill="' + c.c + '" opacity="' + (c.r === 4 ? 0.32 : 0.18) + '"/>' : '') +
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
    const inTier = P.passInTier(s);
    let h = UI.title(t('pass_title'), 'pass_how');
    h += '<div class="card pass-head"><div class="big-stat"><div class="pic">' + ic('ticket') + '</div><div><b class="num">' + t('pass_tier', { n: tier, m: P.PASS_TIERS }) + '</b><small>' + t('pass_season', { n: s.pass.season + 1 }) + '  ·  <span data-t="' + P.seasonEnd() + '" data-tfmt="pass_ends"></span></small></div></div>';
    h += '<div class="progress" style="margin-top:var(--sp-4)"><i style="width:' + (inTier * 100).toFixed(1) + '%"></i></div>';
    h += P.passReady(s) ? '<div class="btn-row"><button class="btn btn-primary" data-act="passall">' + ic('gift') + t('pass_claim_all') + '</button></div>' : '';
    h += '</div><div class="card pass-track free-track">';
    for (let i = 1; i <= P.PASS_TIERS; i++) {
      const reached = i <= tier;
      const done = s.pass.got[i];
      const can = reached && !done;
      h += '<div class="pass-row' + (reached ? ' reached' : '') + '"><span class="tnum">' + i + '</span><div class="pcell' + (done ? ' done' : '') + (can ? ' can' : '') + (i % 10 === 0 ? ' big' : '') + '"' + (can ? ' data-act="passclaim" data-arg="' + i + '"' : '') + '>' + UI.rewardChips(P.passReward(i)) + (done ? ic('check') : '') + '</div></div>';
    }
    const infR = P.passInfReady(s), infOn = tier >= P.PASS_TIERS;
    h += '<div class="pass-row pass-inf' + (infOn ? ' reached' : '') + '"><span class="tnum">' + ic('infinite') + '</span><div class="pcell big' + (infR ? ' can' : '') + '"' + (infR ? ' data-act="passinf"' : '') + '><div class="inf-top">' + UI.rewardChips(P.PASS_INF_REWARD) + (infR ? '<b class="inf-n">' + t('pass_inf_ready', { n: infR }) + '</b>' : '') + '</div><small class="inf-d">' + (infOn ? t('pass_inf_d', { n: F.int(s.pass.inf || 0) }) : t('pass_inf_locked', { n: P.PASS_TIERS })) + '</small>' + (infOn ? '<div class="progress"><i style="width:' + (P.passInfIn(s) * 100).toFixed(1) + '%"></i></div>' : '') + '</div></div>';
    h += '</div>';
    return h;
  };

  function ticketBar(s, keys) {
    return '<div class="tk-bar">' + keys.map(k => '<span class="tk ' + TICKET_COLOR[k] + '">' + (k === 'legend' || k === 'mystic' ? BZ.eggSvg(k, 24) : ic('ticket')) + '<b class="num">' + F.int(s.tickets[k] || 0) + '</b><small>' + t('ticket_' + k) + '</small></span>').join('') + '</div>';
  }

  function bannerFoot(s, bn) {
    const b = BZ.BANNERS[bn];
    if (bn === 'mystic') return '<div class="hatch-info"><span><b style="color:' + BZ.RARITIES[4].color + '">' + n(BZ.RARITIES[4].name) + ' ' + F.pct(1) + '</b></span></div>';
    if (bn === 'legend') return '<div class="hatch-info"><span><b style="color:' + BZ.RARITIES[3].color + '">' + n(BZ.RARITIES[3].name) + ' ' + F.pct(1) + '</b></span></div>';
    const tot = b.rates.reduce((a, c) => a + c, 0);
    let h = '<div class="hatch-info"><span>' + b.rates.map((r, i) => r ? n(BZ.RARITIES[i].name) + ' ' + F.pct(r / tot) : '').filter(Boolean).concat(b.mythic ? ['<b style="color:' + BZ.RARITIES[4].color + '">' + n(BZ.RARITIES[4].name) + ' ' + F.pct(b.mythic) + '</b>'] : []).join('  ·  ') + '</span>';
    h += '<span class="pity">' + ic('star') + t('pity_left', { n: b.hard - s.pity[bn] }) + '</span>';
    if (bn === 'royal') h += '<span>' + (s.pity.guarantee ? '<b class="gold">' + t('guarantee_on') + '</b>' : t('fifty')) + '</span>';
    return h + '</div>';
  }
  function pullButtons(s, bn) {
    const k = BZ.BANNERS[bn].ticket;
    const have = s.tickets[k] || 0;
    return '<button class="btn btn-outline' + (have < 1 ? ' off' : '') + '" data-act="pull" data-arg="' + bn + ':1">' + t('pull1') + '  ·  ' + ic('ticket') + '1</button>' +
      '<button class="btn btn-primary' + (have < 10 ? ' off' : '') + '" data-act="pull" data-arg="' + bn + ':10">' + t('pull10') + '  ·  ' + ic('ticket') + '10</button>' +
      (have > 10 ? '<button class="btn btn-secondary" data-act="pull" data-arg="' + bn + ':all">' + t('pull_all') + '  ·  ' + ic('ticket') + F.int(Math.min(have, P.PULL_MAX)) + '</button>' : '');
  }

  UI.hatcheryHtml = function (s) {
    const has = k => (s.tickets[k] || 0) > 0 || !!s.flags[k];
    const extra = ['legend', 'mystic'].filter(has);
    if (BZ.BANNERS[hatchTab] && ['legend', 'mystic'].includes(hatchTab) && !extra.includes(hatchTab)) hatchTab = 'std';
    const bn = hatchTab;
    let h = '<div class="card hatch"><div class="sec-title"><h3>' + t('hatch') + '</h3><div class="seg"><button data-act="hatchtab" data-arg="std" class="' + (bn === 'std' ? 'on' : '') + '">' + t('hb_std') + '</button><button data-act="hatchtab" data-arg="royal" class="' + (bn === 'royal' ? 'on' : '') + '">' + t('hb_royal') + '</button>' + extra.map(k => '<button data-act="hatchtab" data-arg="' + k + '" class="' + (bn === k ? 'on' : '') + '">' + t('hb_' + k) + '</button>').join('') + '</div></div>';
    h += ticketBar(s, ['egg', 'royal'].concat(extra));
    if (bn === 'mystic' || bn === 'legend') {
      h += '<div class="banner ' + bn + '"><div class="bart">' + BZ.eggSvg(bn, 72) + '</div><div class="btxt"><span class="badge lim">' + ic('sparkle') + t('hb_' + bn) + '</span><b>' + t(bn + '_t') + '</b><small>' + t(bn + '_d') + '</small></div></div>';
    } else if (bn === 'royal') {
      const feat = BZ.BEE_BY_ID[P.featured()];
      const featE = BZ.BEE_BY_ID[P.featuredEpic()];
      h += '<div class="banner royal"><div class="bart">' + UI.beeSvg(feat, 92) + '</div><div class="btxt"><span class="badge lim">' + ic('star') + t('featured') + '</span><b>' + n(feat.name) + '</b><small>' + UI.bonusText(feat.kind, feat.v) + '</small><small class="faint">' + t('featured_d', { b: n(featE.name), t: F.time((P.weekEnd() - Date.now()) / 1000) }) + '</small></div></div>';
    } else {
      h += '<div class="banner std"><div class="bart">' + ic('gift') + '</div><div class="btxt"><b>' + t('hb_std') + '</b><small>' + t('std_d') + '</small></div></div>';
    }
    h += '<div class="pull-row">' + pullButtons(s, bn);
    const adL = UI.adsOn('ticket');
    if (bn === 'std' && adL) h += '<button class="btn btn-secondary" data-act="adticket">' + ic('play') + t('ad_tickets') + '</button>';
    h += '</div>' + bannerFoot(s, bn) + '</div>';
    return h;
  };

  UI.ext.workshop = function () {
    const s = G.main;
    const slots = P.coreSlotCount(s);
    let h = UI.title(t('tab_workshop'), 'workshop_how');
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
    h += '</div></div>';
    return h;
  };

  UI.showPulls = function (res, bn) {
    const best = Math.max(...res.map(r => r.r));
    const pic = (r, b, sz) => r.core ? coreSvg(b, sz) : UI.beeSvg(b, sz);
    let h = '<h4 style="text-align:center">' + t('hatch_results') + (res.length > 1 ? '  ·  ' + F.int(res.length) : '') + '</h4>';
    if (res.length === 1) {
      const r = res[0], b = r.core ? BZ.CORE_BY_ID[r.id] : BZ.BEE_BY_ID[r.id], rar = BZ.RARITIES[b.r];
      h += '<div class="hero"><div class="bee-hero" style="--rc:' + rar.color + '">' + pic(r, b, 96) + '</div><b style="font-size:var(--fs-xl)">' + esc(n(b.name)) + '</b><p style="margin-top:var(--sp-3)"><span class="badge" style="background:color-mix(in srgb,' + rar.color + ' 18%,transparent);color:' + rar.color + '">' + n(rar.name) + '</span> ' + (r.isNew ? '<span class="badge b-orange">' + t('new_tag') + '</span>' : '<span class="badge b-orange">' + t('level', { n: r.level }) + '</span>') + '</p><p style="margin-top:var(--sp-3)">' + esc(r.core ? coreText(b, r.level) : UI.bonusText(b.kind, b.v * r.level)) + '</p></div>';
    } else if (res.length <= 10) {
      h += '<div class="pull-grid">';
      res.forEach((r, i) => {
        const b = r.core ? BZ.CORE_BY_ID[r.id] : BZ.BEE_BY_ID[r.id];
        const rar = BZ.RARITIES[b.r];
        h += '<div class="pr r' + b.r + '" style="--rc:' + rar.color + ';animation-delay:' + (i * 70) + 'ms">' + pic(r, b, 46) + '<b>' + esc(n(b.name)) + '</b>' + (r.isNew ? '<span class="nw">' + t('new_tag') + '</span>' : '<small>' + t('level', { n: r.level }) + '</small>') + '</div>';
      });
      h += '</div>';
    } else {
      const agg = {};
      res.forEach(r => { const a = agg[r.id] || (agg[r.id] = { r, n: 0, isNew: false, level: 0 }); a.n++; a.isNew = a.isNew || r.isNew; a.level = Math.max(a.level, r.level); });
      const list = Object.values(agg).sort((a, b2) => b2.r.r - a.r.r || b2.n - a.n);
      const counts = BZ.RARITIES.map(() => 0);
      res.forEach(r => { counts[r.r]++; });
      h += '<p class="pull-sum">' + counts.map((c, i) => c ? '<span style="color:' + BZ.RARITIES[i].color + '">' + n(BZ.RARITIES[i].name) + ' ' + c + '</span>' : '').filter(Boolean).join('  ·  ') + '</p><div class="pull-grid">';
      list.forEach((a, i) => {
        const b = a.r.core ? BZ.CORE_BY_ID[a.r.id] : BZ.BEE_BY_ID[a.r.id];
        const rar = BZ.RARITIES[b.r];
        h += '<div class="pr r' + b.r + '" style="--rc:' + rar.color + ';animation-delay:' + Math.min(i * 50, 800) + 'ms"><span class="cnt">x' + a.n + '</span>' + pic(a.r, b, 46) + '<b>' + esc(n(b.name)) + '</b>' + (a.isNew ? '<span class="nw">' + t('new_tag') + '</span>' : '<small>' + t('level', { n: a.level }) + '</small>') + '</div>';
      });
      h += '</div>';
    }
    const have = bn ? (G.main.tickets[BZ.BANNERS[bn].ticket] || 0) : 0;
    let btns = '';
    if (bn && have >= 1) btns += '<button class="btn btn-outline" id="pAgain1">' + t('pull1') + '</button>';
    if (bn && have >= 10) btns += '<button class="btn btn-outline" id="pAgain10">' + t('pull10') + '</button>';
    if (bn && have > 10) btns += '<button class="btn btn-secondary" id="pAgainAll">' + t('pull_all') + '  ·  ' + F.int(Math.min(have, P.PULL_MAX)) + '</button>';
    h += '<div class="row center pull-again">' + btns + '<button class="btn btn-primary" data-close>' + t('ok') + '</button></div>';
    const again = c => () => { UI.closeModal(); setTimeout(() => G.pull(bn, c), 60); };
    if (UI.modalOpen()) UI.closeModal();
    setTimeout(() => {
      UI.modal(h, true, { '#pAgain1': again(1), '#pAgain10': again(10), '#pAgainAll': again('all') });
    }, UI.modalOpen() ? 140 : 0);
    BZ.Audio.play(best >= 3 ? 'swarm' : best >= 2 ? 'milestone' : 'achievement');
  };

  UI.showBless = function () {
    const s = G.main;
    if (!s.blessOffer) return;
    const RC = ['#9AA4AE', '#4C7CC4', '#8E6AC8', '#E0A526', '#F0509E'];
    let h = '<h4 style="text-align:center">' + t('bless_title') + '</h4><p style="text-align:center">' + t('bless_sub') + '</p><div class="bless-grid">';
    s.blessOffer.forEach((e, i) => {
      const b = P.BLESS_BY_ID[e.id];
      h += '<button class="bless r' + b.r + '" style="--rc:' + RC[b.r] + '" data-bless="' + i + '"><span class="bpic">' + ic(BLESS_ICON[b.id]) + '</span><b>' + t('bl_' + b.id) + '</b><small>' + esc(blessDesc(e)) + '</small><span class="rar">' + n(BZ.RARITIES[b.r].name) + '</span></button>';
    });
    const adL = UI.adsOn('reroll') ? P.adLeft(s, 'reroll') : 0;
    h += '</div>' + (adL ? '<div class="row center"><button class="btn btn-outline btn-sm" id="bReAd">' + ic('play') + t('bless_reroll') + '  ·  ' + t('ad_left', { n: adL }) + '</button></div>' : '');
    UI.modal(h, true, { '#bReAd': () => G.blessReroll() });
    document.querySelectorAll('#modal [data-bless]').forEach(el => { el.onclick = () => G.blessPick(+el.dataset.bless); });
  };

  UI.adsOn = place => !!(root.BZ_ADS && root.BZ_ADS.available && root.BZ_ADS.available()) && P.adLeft(G.main, place) > 0;
  UI.showAd = function (place) {
    const s = G.main;
    if (P.adLeft(s, place) <= 0) { UI.toast('ad', t('ad_none')); return Promise.resolve(false); }
    if (!UI.adsOn(place)) { UI.toast('ad', t('ad_unavailable')); return Promise.resolve(false); }
    return root.BZ_ADS.show(place).then(ok => {
      if (ok) P.adUse(s, place);
      else if (!root.BZ_ADS.available()) UI.toast('ad', t('ad_unavailable'));
      UI.dirty();
      return !!ok;
    }).catch(() => false);
  };

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
    if (s.battle) return out;
    if (s.blessOffer) out.push({ id: 'bless', c: 'p-bless', icon: 'sparkle', a: t('promo_bless'), b: t('promo_bless_d'), act: 'bless' });
    if ((s.quick.tasks || []).some(q => !q.claimed && M.questDone(q)) && P.unlocked(s, 'daily')) out.push({ id: 'quick', c: 'p-pass', icon: 'clock', a: t('promo_quick'), b: t('promo_quick_d'), act: 'go:daily' });
    if (P.unlocked(s, 'bees') && s.tickets.egg >= 1) out.push({ id: 'tk', c: 'p-starter', icon: 'ticket', a: t('promo_tickets', { n: s.tickets.egg }), b: t('promo_tickets_d'), act: 'go:bees' });
    if (P.unlocked(s, 'bees') && s.tickets.royal >= 1) { const f = BZ.BEE_BY_ID[P.featured()]; out.push({ id: 'feat', c: 'p-feat', bee: f, a: t('promo_featured', { b: n(f.name) }), b: t('promo_featured_d'), act: 'go:bees' }); }
    if (P.unlocked(s, 'pass') && P.passReady(s)) out.push({ id: 'pass', c: 'p-pass', icon: 'ticket', a: t('promo_pass', { n: P.passTier(s) }), b: t('promo_pass_d'), act: 'go:pass' });
    if (P.unlocked(s, 'worlds') && P.canOpenWorld(s, P.nextWorld(s))) out.push({ id: 'world', c: 'p-vip', icon: 'globe', a: t('promo_world'), b: t('promo_world_d'), act: 'go:worlds' });
    return out;
  }
  UI.promoHtml = () => UI.wnBarHtml() + '<div class="promo" id="promo"></div>';
  function updatePromo(now) {
    const el = $('promo');
    if (!el) return;
    const slides = promoSlides(G.main);
    if (!slides.length) { const k = 1 + Math.floor(now / 15000) % 5; slides.push({ id: 'tip' + k, c: 'p-bless', icon: 'info', a: t('tip_title'), b: t('tip_' + k), act: 'none' }); }
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
    const cc = $('chipCloud');
    if (cc) {
      const want = !!(BZ.Cloud && BZ.Cloud.configured() && !BZ.Cloud.signedIn());
      if ((cc.style.display !== 'none') !== want) { cc.style.display = want ? '' : 'none'; UI.fitTabs(); }
    }
    const unseen = s.flags.seenVersion !== BZ.VERSION;
    const wt = $('wnTab'), wb = $('wnBar'), bar = document.querySelector('.topbar');
    const desk = innerWidth > 999;
    if (wt) { const want = unseen && desk; if ((wt.style.display !== 'none') !== want) { wt.style.display = want ? '' : 'none'; UI.fitTabs(); } }
    if (wb) { const want = unseen && (!desk || (bar && bar.classList.contains('t-menu'))); if ((wb.style.display !== 'none') !== want) wb.style.display = want ? '' : 'none'; }
    const gOn = !s.flags.guideHidden;
    const gt = $('gdTab'), gb = $('gdBar');
    if (gt) { const want = gOn && desk; if ((gt.style.display !== 'none') !== want) { gt.style.display = want ? '' : 'none'; UI.fitTabs(); } }
    if (gb) { const want = gOn && (!desk || (bar && bar.classList.contains('t-menu'))); if ((gb.style.display !== 'none') !== want) gb.style.display = want ? '' : 'none'; }
    const bb = $('blessBtn');
    if (bb) bb.style.display = s.blessOffer ? '' : 'none';
    const ab = $('adBtn');
    if (ab) ab.style.display = UI.adsOn('boost') ? '' : 'none';
    document.querySelectorAll('[data-tab]').forEach(b => {
      const lock = !P.unlocked(s, b.dataset.tab);
      if (b.classList.contains('locked') !== lock) b.classList.toggle('locked', lock);
    });
    if (UI.page() === 'hive') updatePromo(now);
  };

  UI.extDots = function (flags) {
    const s = G.main;
    flags.pass = P.passReady(s);
    flags.bees = (s.tickets.egg || 0) > 0 || (s.tickets.royal || 0) > 0 || (s.tickets.mystic || 0) > 0 || (s.tickets.legend || 0) > 0;
    flags.workshop = (s.tickets.core || 0) > 0;
    flags.worlds = P.canOpenWorld(s, P.nextWorld(s));
    flags.league = !!(BZ.Cloud && BZ.Cloud.signedIn()) && BZ.Meta.lqList(G.realMain()).some(q => !q.claimed && BZ.Meta.questDone(q));
    flags.event = !!(BZ.Event && BZ.Event.dot());
    for (const k in flags) if (!P.unlocked(s, k)) flags[k] = false;
  };

  UI.extAct = function (act, arg) {
    switch (act) {
      case 'passall': G.passAll(); break;
      case 'passclaim': G.passClaim(+arg); break;
      case 'passinf': G.passInf(); break;
      case 'hatchtab': hatchTab = arg; UI.render(); break;
      case 'pull': { const [bn, c] = arg.split(':'); G.pull(bn, c === 'all' ? 'all' : +c); break; }
      case 'adticket': G.adTickets(); break;
      case 'core': G.equipCore(arg); break;
      case 'travel': G.travel(+arg); break;
      case 'openworld': G.openWorld(+arg); break;
      case 'sell': G.askSell(); break;
      case 'quick': G.claimQuick(+arg); break;
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
    const cc = $('chipCloud');
    if (!UI._wnBound) {
      UI._wnBound = true;
      document.addEventListener('click', e => {
        const el = e.target.closest('[data-wn]');
        if (!el) return;
        e.stopPropagation();
        if (el.dataset.wn === 'open') UI.whatsNew();
        else { const s = G.main; s.flags.seenVersion = BZ.VERSION; s._dirty = true; G.save(); BZ.Audio.play('click'); UI.extFrame(Date.now()); }
      });
    }
    if (cc) { cc.innerHTML = UI.gLogo + '<span class="gl">' + t('cloud_cta') + '</span><i class="gdot"></i>'; cc.title = t('cloud_signin'); cc.onclick = () => UI.cloudInvite(); }
  };
  UI.gLogo = '<svg class="glogo" viewBox="0 0 48 48" aria-hidden="true"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z"/></svg>';
  UI.wnTabHtml = () => (UI.guideTabHtml ? UI.guideTabHtml() : '') + '<span class="wn-tab" id="wnTab" style="display:none"><button class="wn-open" data-wn="open" title="' + t('wn_tab') + '">' + ic('sparkle') + '<span class="tl">' + t('wn_tab') + '</span><small>' + BZ.VERSION + '</small></button><button class="wn-x" data-wn="x" title="' + t('wn_hide') + '">' + ic('close') + '</button></span>';
  UI.wnBarHtml = () => (UI.guideBarHtml ? UI.guideBarHtml() : '') + '<div class="wn-bar" id="wnBar" style="display:none"><button class="slide wn-slide" data-wn="open"><span class="spic">' + ic('sparkle') + '</span><span class="stxt"><b>' + t('new_title', { v: BZ.VERSION }) + '</b><small>' + t('wn_bar_d') + '</small></span></button><button class="wn-x" data-wn="x" title="' + t('wn_hide') + '">' + ic('close') + '</button></div>';
  UI.whatsNew = function () {
    const s = G.main;
    const L = BZ.F.lang === 'fr' ? 'fr' : 'en';
    const cur = BZ.CHANGELOG[0];
    let h = '<div class="wn"><div class="wn-hero"><div class="wn-burst">' + ic('sparkle') + '</div><small>' + t('new_kicker') + '</small><h4>' + t('new_title', { v: cur.v }) + '</h4></div>';
    h += '<div class="wn-list">' + cur.items.map(x => '<div class="wn-item"><span>' + ic(x.icon) + '</span><p>' + x[L] + '</p></div>').join('') + '</div>';
    const old = BZ.CHANGELOG.slice(1);
    if (old.length) h += '<details class="wn-old"><summary>' + t('new_before') + '</summary>' + old.map(c => '<div class="wn-ver"><b>' + t('new_ver', { v: c.v }) + '</b>' + c.items.map(x => '<div class="wn-mini">' + ic(x.icon) + '<span>' + x[L] + '</span></div>').join('') + '</div>').join('') + '</details>';
    h += '<div class="row center"><button class="btn btn-primary btn-lg" data-close>' + ic('play') + t('new_go') + '</button></div></div>';
    if (s.flags.seenVersion !== BZ.VERSION) { s.flags.seenVersion = BZ.VERSION; s._dirty = true; G.save(); }
    UI.modal(h, true);
    BZ.Audio.play('luckySpawn');
    UI.extFrame && UI.extFrame(Date.now());
  };
  UI.cloudInvite = function (nudge) {
    if (!BZ.Cloud || !BZ.Cloud.configured() || BZ.Cloud.signedIn()) return;
    const why = [['devices', 'cloud_why_1'], ['league', 'cloud_why_2'], ['shield', 'cloud_why_3']];
    UI.modal('<div class="hero"><div class="pic gpic">' + UI.gLogo + '</div><h4>' + t('cloud_why_t') + '</h4><p>' + t('cloud_why_d') + '</p></div><div class="gwhy">' + why.map(x => '<span>' + ic(x[0]) + t(x[1]) + '</span>').join('') + '</div><div class="row"><button class="btn btn-ghost" data-close>' + t(nudge ? 'cloud_later' : 'close') + '</button><button class="btn btn-primary g-btn" id="gGo">' + UI.gLogo + t('cloud_signin') + '</button></div>', true, { '#gGo': () => { UI.closeModal(); G.cloudSignIn(); } });
  };
})(window);
