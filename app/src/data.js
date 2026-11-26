(function (root) {
  const BZ = root.BZ = root.BZ || {};

  BZ.VERSION = '2.8.0';

  BZ.PRODUCERS = [
    { id: 'worker', cost: 15, prod: 0.15, name: { en: 'Worker bee', fr: 'Abeille ouvrière' } },
    { id: 'flower', cost: 120, prod: 1.2, name: { en: 'Flower patch', fr: 'Carré de fleurs' } },
    { id: 'hivebox', cost: 1400, prod: 9, name: { en: 'Hive box', fr: 'Ruchette' } },
    { id: 'meadow', cost: 16000, prod: 60, name: { en: 'Wild meadow', fr: 'Prairie sauvage' } },
    { id: 'apiary', cost: 190000, prod: 380, name: { en: 'Apiary', fr: 'Rucher' } },
    { id: 'press', cost: 2.3e6, prod: 2400, name: { en: 'Honey press', fr: 'Pressoir à miel' } },
    { id: 'brewery', cost: 2.9e7, prod: 15000, name: { en: 'Mead brewery', fr: 'Hydromellerie' } },
    { id: 'candle', cost: 3.8e8, prod: 1e5, name: { en: 'Candle workshop', fr: 'Atelier de bougies' } },
    { id: 'market', cost: 5e9, prod: 6.8e5, name: { en: 'Honey market', fr: 'Marché du miel' } },
    { id: 'greenhouse', cost: 6.8e10, prod: 4.6e6, name: { en: 'Royal greenhouse', fr: 'Serre royale' } },
    { id: 'airship', cost: 9.5e11, prod: 3.2e7, name: { en: 'Pollen airship', fr: 'Dirigeable à pollen' } },
    { id: 'refinery', cost: 1.35e13, prod: 2.3e8, name: { en: 'Nectar refinery', fr: 'Raffinerie de nectar' } },
    { id: 'vault', cost: 2e14, prod: 1.65e9, name: { en: 'Golden vault', fr: 'Coffre doré' } },
    { id: 'celestial', cost: 3e15, prod: 1.2e10, name: { en: 'Celestial hive', fr: 'Ruche céleste' } },
    { id: 'moon', cost: 4.2e16, prod: 7.9e10, name: { en: 'Moon apiary', fr: 'Rucher lunaire' } },
    { id: 'comet', cost: 6e17, prod: 5.2e11, name: { en: 'Comet orchard', fr: 'Verger des comètes' } },
    { id: 'nebula', cost: 8.5e18, prod: 3.4e12, name: { en: 'Nebula nectary', fr: 'Nectarerie nébuleuse' } },
    { id: 'mill', cost: 1.2e20, prod: 2.25e13, name: { en: 'Aurora mill', fr: 'Moulin aurore' } },
    { id: 'galaxy', cost: 1.7e21, prod: 1.5e14, name: { en: 'Galaxy garden', fr: 'Jardin galactique' } },
    { id: 'infinite', cost: 2.4e22, prod: 1e15, name: { en: 'Infinite comb', fr: 'Rayon infini' } }
  ];
  BZ.COST_GROWTH = 1.15;

  BZ.MILESTONES = (function () {
    const m = [25, 50, 100, 150, 200];
    for (let n = 250; n <= 10000; n += 50) m.push(n);
    return m;
  })();
  BZ.COLONY_MILESTONES = [1, 25, 50, 100, 150, 200, 250, 300, 350, 400, 450, 500, 600, 700, 800, 900, 1000];

  const TIER_OWN = [1, 10, 25, 50, 100, 150, 200, 300, 400, 500, 600, 700, 800, 900, 1000];
  const TIER_COST = [10, 60, 600, 6e4, 6e6, 6e8, 6e10, 6e13, 6e16, 6e19, 6e23, 6e27, 6e31, 6e35, 6e39];
  const TIER_NAME = {
    en: ['Sturdy', 'Busy', 'Golden', 'Royal', 'Ancient', 'Sunlit', 'Mythic', 'Starlit', 'Eternal', 'Divine', 'Radiant', 'Cosmic', 'Timeless', 'Legendary', 'Infinite'],
    fr: ['Robuste', 'Affairé', 'Doré', 'Royal', 'Ancien', 'Ensoleillé', 'Mythique', 'Étoilé', 'Éternel', 'Divin', 'Radieux', 'Cosmique', 'Intemporel', 'Légendaire', 'Infini']
  };

  BZ.UPGRADES = [];
  BZ.PRODUCERS.forEach((p, pi) => {
    TIER_OWN.forEach((own, ti) => {
      BZ.UPGRADES.push({
        id: p.id + '_t' + ti,
        kind: 'prod', target: p.id, mult: 2,
        cost: p.cost * TIER_COST[ti],
        req: { own: [p.id, own] },
        tier: ti,
        name: { en: TIER_NAME.en[ti] + ' ' + p.name.en.toLowerCase(), fr: p.name.fr + ' ' + TIER_NAME.fr[ti].toLowerCase() }
      });
    });
    if (pi > 0) {
      const prev = BZ.PRODUCERS[pi - 1];
      BZ.UPGRADES.push({
        id: 'syn_' + p.id,
        kind: 'synergy', target: prev.id, source: p.id, pct: 0.01,
        cost: p.cost * 40,
        req: { own: [p.id, 15] },
        name: { en: p.name.en + ' links', fr: 'Liens ' + p.name.fr.toLowerCase() }
      });
    }
  });

  const TAP_STEPS = [
    { cost: 100, req: 1, flat: 1 },
    { cost: 600, req: 3, mult: 2 },
    { cost: 8000, req: 5, pct: 0.01 },
    { cost: 2e5, req: 8, pct: 0.01 },
    { cost: 5e6, req: 12, mult: 2 },
    { cost: 2e8, req: 16, pct: 0.01 },
    { cost: 1e10, req: 20, pct: 0.01 },
    { cost: 5e11, req: 25, mult: 3 },
    { cost: 5e13, req: 30, pct: 0.01 },
    { cost: 5e15, req: 35, pct: 0.01 },
    { cost: 5e17, req: 40, mult: 3 },
    { cost: 5e20, req: 45, pct: 0.01 },
    { cost: 5e23, req: 50, pct: 0.01 },
    { cost: 5e27, req: 60, mult: 5 }
  ];
  const TAP_NAMES = {
    en: ['Sticky paws', 'Quick paws', 'Honey touch', 'Golden touch', 'Busy paws', 'Nectar touch', 'Amber touch', 'Royal paws', 'Sun touch', 'Comet touch', 'Swift paws', 'Star touch', 'Crown touch', 'Legend paws'],
    fr: ['Pattes collantes', 'Pattes agiles', 'Toucher miel', 'Toucher doré', 'Pattes affairées', 'Toucher nectar', 'Toucher ambre', 'Pattes royales', 'Toucher solaire', 'Toucher comète', 'Pattes rapides', 'Toucher étoile', 'Toucher couronne', 'Pattes légendaires']
  };
  TAP_STEPS.forEach((s, i) => {
    BZ.UPGRADES.push({
      id: 'tap_' + i, kind: 'tap', flat: s.flat || 0, tmult: s.mult || 1, pct: s.pct || 0,
      cost: s.cost, req: { taps: [0, 50, 200, 500, 1000, 1500, 2000, 3000, 4000, 5000, 6000, 8000, 10000, 15000][i], ownAny: s.req },
      name: { en: TAP_NAMES.en[i], fr: TAP_NAMES.fr[i] }
    });
  });

  const LUCKY_STEPS = [
    { cost: 7777, lucky: 1, freq: 1.15 },
    { cost: 7.7e6, lucky: 5, dur: 1.25 },
    { cost: 7.7e9, lucky: 15, freq: 1.15 },
    { cost: 7.7e12, lucky: 30, dur: 1.25 },
    { cost: 7.7e15, lucky: 60, freq: 1.15 },
    { cost: 7.7e18, lucky: 100, dur: 1.25 }
  ];
  const LUCKY_NAMES = {
    en: ['Sweet scent', 'Long dance', 'Golden pollen', 'Endless waltz', 'Sun nectar', 'Lucky crown'],
    fr: ['Doux parfum', 'Longue danse', 'Pollen doré', 'Valse sans fin', 'Nectar solaire', 'Couronne chanceuse']
  };
  LUCKY_STEPS.forEach((s, i) => {
    BZ.UPGRADES.push({
      id: 'lucky_' + i, kind: 'lucky', freq: s.freq || 1, dur: s.dur || 1,
      cost: s.cost, req: { lucky: s.lucky },
      name: { en: LUCKY_NAMES.en[i], fr: LUCKY_NAMES.fr[i] }
    });
  });

  const GLOBAL_STEPS = [1e6, 1e9, 1e12, 1e15, 1e18, 1e21, 1e24, 1e27, 1e30, 1e33, 1e36, 1e40, 1e45, 1e50];
  const GLOBAL_NAMES = {
    en: ['Clover fields', 'Lavender hills', 'Orchard rows', 'Sunflower sea', 'Rose valley', 'Jasmine coast', 'Lotus lakes', 'Cherry skies', 'Moon blossoms', 'Comet gardens', 'Nebula bloom', 'Aurora meadow', 'Galaxy grove', 'Eden of honey'],
    fr: ['Champs de trèfle', 'Collines de lavande', 'Rangs de verger', 'Mer de tournesols', 'Vallée des roses', 'Côte de jasmin', 'Lacs de lotus', 'Ciel de cerisiers', 'Fleurs de lune', 'Jardins de comètes', 'Floraison nébuleuse', 'Prairie aurore', 'Bosquet galactique', 'Éden du miel']
  };
  for (let e = 56, k = 1; e <= 290; e += 6, k++) {
    GLOBAL_STEPS.push(Math.pow(10, e));
    GLOBAL_NAMES.en.push('Star bloom ' + k);
    GLOBAL_NAMES.fr.push('Fleur d\'étoile ' + k);
  }
  GLOBAL_STEPS.forEach((c, i) => {
    BZ.UPGRADES.push({
      id: 'glob_' + i, kind: 'global', mult: 1.5,
      cost: c * 5, req: { total: c },
      name: { en: GLOBAL_NAMES.en[i], fr: GLOBAL_NAMES.fr[i] }
    });
  });

  BZ.UPGRADES.sort((a, b) => a.cost - b.cost);
  BZ.UPGRADE_BY_ID = {};
  BZ.UPGRADES.forEach(u => { BZ.UPGRADE_BY_ID[u.id] = u; });

  BZ.QUEEN = [
    { id: 'decree', base: 1, growth: 1.6, max: 0, name: { en: 'Royal decree', fr: 'Décret royal' }, desc: { en: '+25% honey per level', fr: '+25 % de miel par niveau' } },
    { id: 'touch', base: 1, growth: 1.9, max: 20, name: { en: 'Queen touch', fr: 'Toucher de la reine' }, desc: { en: '+50% tap power per level', fr: '+50 % de récolte par toucher' } },
    { id: 'nap', base: 2, growth: 2.2, max: 10, name: { en: 'Long nap', fr: 'Longue sieste' }, desc: { en: '+1 h away earnings', fr: '+1 h de gains en absence' } },
    { id: 'headstart', base: 3, growth: 3.2, max: 10, name: { en: 'Head start', fr: 'Bon départ' }, desc: { en: 'Start each swarm with more honey', fr: 'Chaque essaim démarre avec plus de miel' } },
    { id: 'charm', base: 3, growth: 2.3, max: 10, name: { en: 'Lucky charm', fr: 'Porte-bonheur' }, desc: { en: 'Lucky bees come 8% more often', fr: 'Abeilles dorées 8 % plus fréquentes' } },
    { id: 'elixir', base: 4, growth: 2.3, max: 10, name: { en: 'Royal elixir', fr: 'Élixir royal' }, desc: { en: 'Lucky effects last 10% longer', fr: 'Effets dorés 10 % plus longs' } },
    { id: 'combo', base: 5, growth: 2.6, max: 6, name: { en: 'Rhythm', fr: 'Rythme' }, desc: { en: '+0.5 max tap combo', fr: '+0,5 au combo maximum' } },
    { id: 'thrift', base: 8, growth: 3, max: 10, name: { en: 'Thrifty builders', fr: 'Bâtisseurs économes' }, desc: { en: 'Producers cost 3% less', fr: 'Producteurs 3 % moins chers' } },
    { id: 'wisdom', base: 10, growth: 2.8, max: 15, name: { en: 'Swarm wisdom', fr: 'Sagesse de l\'essaim' }, desc: { en: '+10% royal jelly from swarms', fr: '+10 % de gelée royale par essaim' } },
    { id: 'mind', base: 2e6, growth: 100, max: 3, need: [20, 100, 500], name: { en: 'Hive mind', fr: 'Esprit de ruche' }, desc: { en: 'Automation: upgrades, then producers, then swarms', fr: 'Automatisation : améliorations, producteurs, puis essaims' } }
  ];
  BZ.CROWN_DIVISOR = 2e4;
  BZ.CROWN_BONUS = 1;
  BZ.CROWN_RJ = 0.2;
  BZ.CROWN_PERKS = [
    { at: 1, id: 'lucky', name: { en: 'Lucky bees 25% more often', fr: 'Abeilles dorées 25 % plus fréquentes' } },
    { at: 2, id: 'start', name: { en: 'Start each swarm with 25 of the first 5 producers', fr: 'Chaque essaim démarre avec 25 des 5 premiers producteurs' } },
    { at: 3, id: 'keep', name: { en: 'Swarms keep tap and lucky upgrades', fr: 'Les essaims gardent les améliorations de toucher et dorées' } },
    { at: 20, id: 'mind', name: { en: 'Unlocks the Hive mind skill (more levels at 100 and 500 crowns)', fr: 'Débloque la compétence Esprit de ruche (niveaux suivants à 100 et 500 couronnes)' } },
    { at: 8, id: 'nap', name: { en: '+4 h away earnings', fr: '+4 h de gains en absence' } },
    { at: 12, id: 'egg', name: { en: 'Each coronation gives 3 royal tickets', fr: 'Chaque couronnement donne 3 tickets royaux' } },
    { at: 20, id: 'decree', name: { en: 'Royal decree twice as strong', fr: 'Décret royal deux fois plus fort' } }
  ];
  BZ.QUEEN_BY_ID = {};
  BZ.QUEEN.forEach(q => { BZ.QUEEN_BY_ID[q.id] = q; });

  BZ.LUCKY_EFFECTS = [
    { id: 'rush', w: 24, mult: 7, dur: 25 },
    { id: 'harvest', w: 42, minutes: 12 },
    { id: 'storm', w: 11, drops: 14, minutes: 1.5, dur: 7 },
    { id: 'frenzy', w: 11, mult: 25, dur: 12 },
    { id: 'ticket', w: 6, egg: 2 },
    { id: 'chest', w: 6 }
  ];

  BZ.BOOSTS = [
    { id: 'x2', mult: 2, dur: 1800, name: { en: 'Double honey', fr: 'Miel double' } },
    { id: 'x2s', mult: 2, dur: 300, name: { en: 'Double honey', fr: 'Miel double' } },
    { id: 'adx2', mult: 2, dur: 1800, name: { en: 'Double honey', fr: 'Miel double' } },
    { id: 'dance', mult: 2, dur: 1200, name: { en: 'Bee dance', fr: 'Danse des abeilles' } },
    { id: 'luckyswarm', dur: 120, name: { en: 'Lucky swarm', fr: 'Essaim doré' } }
  ];
  BZ.BOOST_BY_ID = {};
  BZ.BOOSTS.forEach(b => { BZ.BOOST_BY_ID[b.id] = b; });

  BZ.SKINS = [
    { id: 'meadow', parts: 0, boost: null, name: { en: 'Meadow', fr: 'Prairie' }, sky: ['#FCE7C8', '#F8D2A0'], hill: ['#A9C98B', '#8DB573', '#78A262'], comb: '#F2A03A', night: false },
    { id: 'dusk', parts: 4, boost: { honey: 0.1 }, name: { en: 'Dusk', fr: 'Crépuscule' }, sky: ['#F7B88A', '#C9798B'], hill: ['#8A9C74', '#6F8463', '#5C7055'], comb: '#F28C28', night: false },
    { id: 'sakura', parts: 5, boost: { tap: 0.5 }, name: { en: 'Sakura', fr: 'Sakura' }, sky: ['#FBE4EA', '#F5C6D3'], hill: ['#B7CF9A', '#A2BF86', '#8FAE75'], comb: '#F0A050', petals: true, night: false },
    { id: 'frost', parts: 5, boost: { offlineH: 2 }, name: { en: 'Frost', fr: 'Givre' }, sky: ['#E3EEF4', '#C5DAE6'], hill: ['#F4F7F9', '#DDE7EE', '#C9D8E2'], comb: '#E9A13B', snow: true, night: false },
    { id: 'night', parts: 6, boost: { luckyFreq: 0.15 }, name: { en: 'Starry night', fr: 'Nuit étoilée' }, sky: ['#1E2A3F', '#2E3D5A'], hill: ['#2F4A45', '#284039', '#213530'], comb: '#F2A03A', night: true },
    { id: 'crystal', parts: 6, boost: { cost: 0.05 }, name: { en: 'Crystal cave', fr: 'Grotte de cristal' }, sky: ['#CFEFF7', '#8CC8DA'], hill: ['#9FD3E0', '#7FBCCD', '#62A4B8'], comb: '#F2B045', snow: true, night: false },
    { id: 'royal', parts: 7, boost: { rj: 0.1 }, name: { en: 'Royal court', fr: 'Cour royale' }, sky: ['#3B2E5A', '#7A4E86'], hill: ['#5C4A7A', '#4C3D68', '#3E3156'], comb: '#F5B24A', night: true },
    { id: 'aurora', parts: 8, boost: { luckyDur: 0.2 }, name: { en: 'Aurora', fr: 'Aurore' }, sky: ['#14202E', '#1F3A44'], hill: ['#24433F', '#1E3834', '#182E2B'], comb: '#F5B24A', night: true, aurora: true },
    { id: 'sunflower', parts: 0, pass: true, boost: { honey: 0.2 }, name: { en: 'Sunflower field', fr: 'Champ de tournesols' }, sky: ['#FFE9A8', '#FFC861'], hill: ['#C7B24A', '#A99A3C', '#8E8233'], comb: '#F28C28', night: false },
    { id: 'w_dunes', world: true, name: { en: 'Sun dunes', fr: 'Dunes du soleil' }, sky: ['#FDE2B0', '#F5B979'], hill: ['#E7C27D', '#D9AE63', '#C69A50'], comb: '#E98A2B', night: false },
    { id: 'w_glacier', world: true, name: { en: 'Glacier', fr: 'Glacier' }, sky: ['#DCEAF3', '#AFC9DA'], hill: ['#F2F6F9', '#D5E3EC', '#BCD1DE'], comb: '#E7A23F', snow: true, night: false },
    { id: 'w_moon', world: true, name: { en: 'Moon garden', fr: 'Jardin lunaire' }, sky: ['#141A2E', '#2B2F52'], hill: ['#3B3F63', '#2F3354', '#262A47'], comb: '#F2B24A', night: true },
    { id: 'w_ember', world: true, name: { en: 'Ember peaks', fr: 'Pics de braise' }, sky: ['#3A1C1C', '#7A3324'], hill: ['#4A2A25', '#3B221F', '#2E1B19'], comb: '#F28C28', night: true }
  ];
  BZ.SKIN_BY_ID = {};
  BZ.SKINS.forEach(s => { BZ.SKIN_BY_ID[s.id] = s; });

  BZ.STREAK_REWARDS = [
    { egg: 10 }, { egg: 15 }, { core: 5 }, { egg: 20 }, { part: 2, egg: 10 }, { core: 8 }, { royal: 5, egg: 20 }
  ];

  BZ.LEAGUE_TIERS = [
    { id: 'bronze', color: '#C08457', name: { en: 'Bronze', fr: 'Bronze' } },
    { id: 'silver', color: '#9AA4AE', name: { en: 'Silver', fr: 'Argent' } },
    { id: 'gold', color: '#E0A526', name: { en: 'Gold', fr: 'Or' } },
    { id: 'topaz', color: '#F28C28', name: { en: 'Topaz', fr: 'Topaze' } },
    { id: 'sapphire', color: '#4C7CC4', name: { en: 'Sapphire', fr: 'Saphir' } },
    { id: 'ruby', color: '#C9485B', name: { en: 'Ruby', fr: 'Rubis' } },
    { id: 'emerald', color: '#3E9B6A', name: { en: 'Emerald', fr: 'Émeraude' } },
    { id: 'royal', color: '#8E6AC8', name: { en: 'Royal', fr: 'Royale' } }
  ];

  BZ.LEAGUE_POINTS = {
    lq: 1, lucky: 6, ticket: 4, quick: 10, quest: 30, swarm: 60, scout: 3, milestone: 3, upgrade: 1, achievement: 10, power: 8, minute: 1, rush: 20, streak: 10
  };

  BZ.QUEST_POOL = [
    { id: 'tap', w: 3, amounts: [150, 300, 600] },
    { id: 'lucky', w: 3, amounts: [2, 4, 7] },
    { id: 'buy', w: 3, amounts: [25, 60, 120] },
    { id: 'upgrade', w: 2, amounts: [3, 6, 10] },
    { id: 'earn', w: 3, amounts: [15, 45, 120] },
    { id: 'combo', w: 2, amounts: [40, 70, 100] },
    { id: 'milestone', w: 2, amounts: [2, 5, 9] },
    { id: 'ticketbee', w: 2, amounts: [1, 2, 3] },
    { id: 'swarm', w: 1, amounts: [1, 1, 1], needsSwarm: true }
  ];
  BZ.LEAGUE_QUESTS = [
    { id: 'tap', amount: 4000, pts: 150 },
    { id: 'lucky', amount: 30, pts: 200 },
    { id: 'ticketbee', amount: 15, pts: 200 },
    { id: 'upgrade', amount: 50, pts: 150 },
    { id: 'milestone', amount: 40, pts: 150 },
    { id: 'dquest', amount: 9, pts: 250 },
    { id: 'hatch', amount: 40, pts: 200 },
    { id: 'swarm', amount: 6, pts: 300, needs: 'swarm' },
    { id: 'crown', amount: 2, pts: 400, needs: 'crown' },
    { id: 'ruby', amount: 1, pts: 350 }
  ];
  BZ.LEAGUE_QUEST_COUNT = 4;
  BZ.LEAGUE_QUEST_GROW = 0.2;
  BZ.CHANGELOG = [
    { v: '2.8.0', items: [
      { icon: 'star', en: 'Blessings got a big update: 26 of them, from common to Legendary and the very rare Mythic ones, with mixed bonuses and new effects.', fr: 'Grosse mise à jour des bénédictions : 26 au total, de commune à Légendaire et aux très rares Mythiques, avec des bonus combinés et de nouveaux effets.' },
      { icon: 'globe', en: 'Each world is now harder than the previous one: crowns and royal jelly take more effort, but every crown gives more essence. Check the difficulty on the world map.', fr: 'Chaque monde est maintenant plus dur que le précédent : couronnes et gelée royale demandent plus d’efforts, mais chaque couronne rapporte plus d’essence. La difficulté est indiquée sur la carte.' },
      { icon: 'gem', en: 'Red lucky bees can now show up from the very start, and their wheel has new prizes: double honey, a lucky swarm and an hour of honey. Essence prizes start once the second world is open.', fr: 'Les abeilles dorées rouges peuvent maintenant apparaître dès le début, et leur roue a de nouveaux prix : miel double, essaim doré et une heure de miel. Les prix d\u2019essence arrivent une fois le deuxième monde ouvert.' },
      { icon: 'league', en: 'An orange dot on the League tab when a league quest is ready to claim.', fr: 'Une pastille orange sur l’onglet Ligue quand une quête de ligue est prête.' }
    ] },
    { v: '2.7.0', items: [
      { icon: 'star', en: 'New How to play guide, from your first drop of honey all the way to Prime. Find it in the top bar or in About.', fr: 'Nouveau guide Comment jouer, de la première goutte de miel jusqu’à Prime. Dans la barre du haut ou dans À propos.' },
      { icon: 'tap', en: 'Right click on a producer to buy it too.', fr: 'Un clic droit sur un producteur l’achète aussi.' },
      { icon: 'check', en: 'Fixed buttons that stopped working under the notifications, and Mythic bees now come after Legendary ones.', fr: 'Correction des boutons qui ne répondaient plus sous les notifications, et les abeilles mythiques passent après les légendaires.' }
    ] },
    { v: '2.6.0', items: [
      { icon: 'infinite', en: 'The pass now has an endless last tier. Past tier 50, keep filling it for 3 egg tickets and 5 minutes of double honey, again and again.', fr: 'Le pass a maintenant un dernier palier sans fin. Après le palier 50, continuez à le remplir pour 3 tickets d\u2019œuf et 5 minutes de miel double, encore et encore.' },
      { icon: 'sparkle', en: 'A cleaner What\u2019s new banner that shows up once after each update.', fr: 'Une bannière Nouveautés plus discrète, qui apparaît une fois après chaque mise à jour.' }
    ] },
    { v: '2.5.0', items: [
      { icon: 'star', en: 'League quests now renew: claim one and a new one appears right away, a little harder each time. Farm league points all week!', fr: 'Les quêtes de ligue se renouvellent : récupérez-en une et une nouvelle apparaît aussitôt, un peu plus dure à chaque fois. Des points de ligue toute la semaine !' },
      { icon: 'crown', en: 'Crowns now carry the name of their world (Meadow crowns, Dune crowns...), so you always know which world they open.', fr: 'Les couronnes portent maintenant le nom de leur monde (couronnes des prés, des dunes...), pour savoir quel monde elles ouvrent.' },
    ] },
    { v: '2.4.0', items: [
      { icon: 'league', en: 'Weekly league quests worth 150 to 400 league points each.', fr: 'Quêtes de ligue de la semaine, de 150 à 400 points de ligue chacune.' },
      { icon: 'gem', en: 'Red lucky bees are rarer. The Ruby lure upgrade in the Moon tree makes them come back more often.', fr: 'Les abeilles rouges sont plus rares. L\u2019Appât de rubis de l\u2019arbre lunaire les fait revenir plus souvent.' },
      { icon: 'globe', en: 'Five new costly essence upgrades, one for each world.', fr: 'Cinq nouvelles améliorations d\u2019essence, une par monde, plus chères.' }
    ] },
    { v: '2.3.0', items: [
      { icon: 'gem', en: 'Red lucky bees spin a prize wheel. Hit the jackpot to win a Prime stone!', fr: 'Les abeilles rouges lancent une roue des prix. Visez le jackpot pour gagner une pierre Prime !' },
      { icon: 'prime', en: 'Prime now needs 50,000 of every essence and a Prime stone.', fr: 'Prime demande maintenant 50 000 de chaque essence et une pierre Prime.' }
    ] },
    { v: '2.2.0', items: [
      { icon: 'globe', en: 'Every world has its own essence and its own upgrade tree.', fr: 'Chaque monde a sa propre essence et son propre arbre d\u2019améliorations.' },
      { icon: 'prime', en: 'Prime: finish every tree, restart from scratch with honey x2 forever.', fr: 'Prime : terminez tous les arbres et recommencez avec du miel x2 pour toujours.' },
      { icon: 'star', en: 'Mythic bees and cores, the rarest of all.', fr: 'Abeilles et noyaux mythiques, les plus rares de tous.' },
      { icon: 'devices', en: 'Save online with Google and play on all your devices.', fr: 'Sauvegarde en ligne avec Google, pour jouer sur tous vos appareils.' }
    ] }
  ];
  BZ.QUEST_REWARDS = [{ egg: 3 }, { egg: 5 }, { core: 2 }];
  BZ.QUICK_POOL = [
    { id: 'tap', amounts: [60, 120] },
    { id: 'lucky', amounts: [1, 1] },
    { id: 'buy', amounts: [10, 25] },
    { id: 'upgrade', amounts: [1, 3] },
    { id: 'earn', amounts: [2, 4] },
    { id: 'combo', amounts: [30, 50] }
  ];
  BZ.QUICK_EVERY = 900;

  BZ.RARITIES = [
    { id: 'common', w: 62, color: '#9AA4AE', name: { en: 'Common', fr: 'Commune' } },
    { id: 'rare', w: 27, color: '#4C7CC4', name: { en: 'Rare', fr: 'Rare' } },
    { id: 'epic', w: 9, color: '#8E6AC8', name: { en: 'Epic', fr: 'Épique' } },
    { id: 'legendary', w: 2, color: '#E0A526', name: { en: 'Legendary', fr: 'Légendaire' } },
    { id: 'mythic', w: 0, color: '#F0509E', name: { en: 'Mythic', fr: 'Mythique' } }
  ];
  BZ.BEES = [
    { id: 'meadow', r: 0, kind: 'honey', v: 0.03, c: ['#F2C14E', '#20252B'], name: { en: 'Meadow bee', fr: 'Abeille des prés' } },
    { id: 'clover', r: 0, kind: 'tap', v: 0.08, c: ['#A9C98B', '#2F4A45'], name: { en: 'Clover bee', fr: 'Abeille du trèfle' } },
    { id: 'mason', r: 0, kind: 'honey', v: 0.03, c: ['#7FA8AE', '#20252B'], name: { en: 'Mason bee', fr: 'Osmie maçonne' } },
    { id: 'sweat', r: 0, kind: 'luckyDur', v: 0.03, c: ['#9BD3A8', '#2F4A45'], name: { en: 'Sweat bee', fr: 'Halicte' } },
    { id: 'mining', r: 0, kind: 'cost', v: 0.01, c: ['#C9A27A', '#3A2E25'], name: { en: 'Mining bee', fr: 'Andrène' } },
    { id: 'leafcutter', r: 0, kind: 'luckyFreq', v: 0.02, c: ['#B7CF9A', '#20252B'], name: { en: 'Leafcutter bee', fr: 'Mégachile' } },
    { id: 'carpenter', r: 1, kind: 'honey', v: 0.06, c: ['#4A5568', '#F2C14E'], name: { en: 'Carpenter bee', fr: 'Xylocope' } },
    { id: 'orchard', r: 1, kind: 'tap', v: 0.15, c: ['#4C7CC4', '#1E2A3F'], name: { en: 'Blue orchard bee', fr: 'Osmie bleue' } },
    { id: 'bumble', r: 1, kind: 'offline', v: 0.1, c: ['#F2C14E', '#20252B'], name: { en: 'Bumblebee', fr: 'Bourdon' } },
    { id: 'sunflower', r: 1, kind: 'luckyFreq', v: 0.04, c: ['#F5B24A', '#5C3A1E'], name: { en: 'Sunflower bee', fr: 'Abeille tournesol' } },
    { id: 'night', r: 1, kind: 'rj', v: 0.03, c: ['#2E3D5A', '#F5F3EF'], name: { en: 'Night bee', fr: 'Abeille de nuit' } },
    { id: 'emerald', r: 2, kind: 'honey', v: 0.12, c: ['#3E9B6A', '#16191D'], name: { en: 'Emerald bee', fr: 'Abeille émeraude' } },
    { id: 'cuckoo', r: 2, kind: 'luckyDur', v: 0.08, c: ['#C9485B', '#20252B'], name: { en: 'Cuckoo bee', fr: 'Abeille coucou' } },
    { id: 'frost', r: 2, kind: 'cost', v: 0.03, c: ['#DDE7EE', '#527C82'], name: { en: 'Frost bee', fr: 'Abeille du givre' } },
    { id: 'ruby', r: 2, kind: 'rj', v: 0.06, c: ['#D64545', '#3A1E22'], name: { en: 'Ruby bee', fr: 'Abeille rubis' } },
    { id: 'golden', r: 3, kind: 'honey', v: 0.25, c: ['#FFD45E', '#B8860B'], name: { en: 'Golden bee', fr: 'Abeille d\'or' } },
    { id: 'star', r: 3, kind: 'luckyFreq', v: 0.1, c: ['#8E6AC8', '#FFF4C8'], name: { en: 'Star bee', fr: 'Abeille étoile' } },
    { id: 'guard', r: 3, kind: 'combo', v: 0.25, c: ['#F28C28', '#20252B'], name: { en: 'Queen guard', fr: 'Garde de la reine' } },
    { id: 'celestial', r: 4, kind: 'honey', v: 0.6, c: ['#F0509E', '#2A1238'], name: { en: 'Celestial bee', fr: 'Abeille céleste' } },
    { id: 'eclipse', r: 4, kind: 'rj', v: 0.2, c: ['#2A1238', '#F0509E'], name: { en: 'Eclipse bee', fr: 'Abeille éclipse' } },
    { id: 'prism', r: 4, kind: 'luckyFreq', v: 0.25, c: ['#9EE8F5', '#5B2A8C'], name: { en: 'Prism bee', fr: 'Abeille prisme' } }
  ];
  BZ.BEE_BY_ID = {};
  BZ.BEES.forEach(b => { BZ.BEE_BY_ID[b.id] = b; });
  BZ.BEE_LEVELS = [1, 3, 6, 10, 15, 21, 28, 36, 45, 55];
  BZ.DROP = { lucky: 0.06, part: 0.05, ticketMin: 0.03 };

  const TK = g => g >= 10 ? { royal: 1 } : g >= 5 ? { core: 1 } : g >= 3 ? { egg: 2 } : g >= 1 ? { egg: 1 } : null;
  function buildAchievements() {
    const list = [];
    const add = (id, group, test, value, g, icon) => list.push({ id, group, test, value, reward: TK(g || 0), icon: icon || group });
    for (let e = 3, i = 0; e <= 66; e += 3, i++) add('honey' + e, 'honey', 'lifetime', Math.pow(10, e), i % 3 === 2 ? 10 : 1);
    for (let e = 1, i = 0; e <= 40; e += 3, i++) add('hps' + e, 'hps', 'hps', Math.pow(10, e), i % 3 === 2 ? 5 : 0);
    BZ.PRODUCERS.forEach(p => [1, 50, 100, 200, 300, 400, 500].forEach((n, i) => add('own_' + p.id + '_' + n, 'own', 'own:' + p.id, n, i >= 5 ? 3 : 0, p.id)));
    [100, 1000, 5000, 20000, 50000, 100000].forEach((n, i) => add('taps' + n, 'taps', 'taps', n, i >= 3 ? 5 : 1));
    [1, 10, 50, 150, 400, 1000].forEach((n, i) => add('lucky' + n, 'lucky', 'lucky', n, i >= 2 ? 5 : 1));
    [1, 3, 10, 25, 50, 100].forEach(n => add('swarm' + n, 'swarm', 'swarms', n, 10));
    [10, 100, 1000, 1e4, 1e5, 1e6, 1e8].forEach(n => add('rj' + n, 'rj', 'rj', n, 5));
    [25, 75, 150, 250].forEach(n => add('upg' + n, 'upgrade', 'upgrades', n, 3));
    [25, 60, 100].forEach(n => add('combo' + n, 'combo', 'combo', n, 3));
    [10, 50, 200].forEach(n => add('quest' + n, 'quest', 'quests', n, 10));
    [7, 30].forEach(n => add('streak' + n, 'streak', 'streak', n, 10));
    [1, 5].forEach(n => add('colony' + n, 'colony', 'colony', n, 10));
    [1, 5, 20].forEach(n => add('crown' + n, 'crown', 'crowns', n, 10));
    [10, 25, 50, 100].forEach(n => add('level' + n, 'level', 'level', n, 10));
    [3, 9, 18].forEach(n => add('bees' + n, 'bees', 'bees', n, 10));
    [5, 10].forEach(n => add('beelvl' + n, 'bees', 'beelvl', n, 10));
    [3, 8, 12].forEach(n => add('cores' + n, 'cores', 'cores', n, 5));
    [1, 4, 8].forEach(n => add('skins' + n, 'skins', 'skins', n, 10));
    [2, 3, 5].forEach(n => add('worlds' + n, 'world', 'worlds', n, 10));
    return list;
  }
  BZ.ACHIEVEMENTS = buildAchievements();
  BZ.ACH_BY_ID = {};
  BZ.ACHIEVEMENTS.forEach(a => { BZ.ACH_BY_ID[a.id] = a; });

  BZ.RUN_ACH = (function () {
    const list = [];
    const add = (id, test, value, reward, icon) => list.push({ id, test, value, reward, icon });
    [[6, { egg: 1 }], [9, { egg: 1 }], [12, { royal: 1 }], [15, { egg: 2 }], [18, { royal: 1 }], [21, { core: 1 }], [24, { royal: 1 }], [30, { royal: 1 }], [36, { core: 1 }], [42, { royal: 1 }], [50, { royal: 2 }], [60, { royal: 2 }], [75, { core: 2 }], [90, { royal: 3 }]]
      .forEach(x => add('rh' + x[0], 'runHoney', Math.pow(10, x[0]), x[1], 'drop'));
    [[300, { egg: 1 }], [600, { royal: 1 }], [1000, { core: 1 }], [2000, { royal: 1 }], [4000, { royal: 2 }]].forEach(x => add('ro' + x[0], 'runOwn', x[0], x[1], 'worker'));
    [[10, { egg: 1 }], [30, { egg: 1 }], [60, { royal: 1 }], [100, { core: 1 }], [160, { royal: 1 }]].forEach(x => add('ru' + x[0], 'runUpg', x[0], x[1], 'star'));
    [[3, { egg: 1 }], [10, { royal: 1 }], [25, { core: 1 }]].forEach(x => add('rl' + x[0], 'runLucky', x[0], x[1], 'sparkle'));
    [[1000, { egg: 1 }]].forEach(x => add('rt' + x[0], 'runTaps', x[0], x[1], 'tap'));
    [[1, { royal: 1 }], [3, { core: 1 }]].forEach(x => add('rc' + x[0], 'runColony', x[0], x[1], 'hive'));
    return list;
  })();
  BZ.RUN_ACH_BY_ID = {};
  BZ.RUN_ACH.forEach(a => { BZ.RUN_ACH_BY_ID[a.id] = a; });

  BZ.BANNERS = {
    std: { ticket: 'egg', rates: [70, 24, 5.4, 0.6], hard: 120, soft: 95, epicEvery: 20, mythic: 0.0004 },
    royal: { ticket: 'royal', rates: [0, 78, 19, 3], hard: 80, soft: 60, epicEvery: 12, mythic: 0.002 },
    core: { ticket: 'core', rates: [64, 27, 7.8, 1.2], hard: 100, soft: 80, epicEvery: 15, mythic: 0.001 }
  };

  BZ.CORES = [
    { id: 'c_honey', r: 0, kind: 'honey', v: 0.05, c: '#F2C14E', name: { en: 'Amber core', fr: 'Noyau d\'ambre' } },
    { id: 'c_tap', r: 0, kind: 'tap', v: 0.15, c: '#A9C98B', name: { en: 'Clover core', fr: 'Noyau de trèfle' } },
    { id: 'c_thrift', r: 0, kind: 'cost', v: 0.01, c: '#C9A27A', name: { en: 'Wax core', fr: 'Noyau de cire' } },
    { id: 'c_lucky', r: 1, kind: 'luckyFreq', v: 0.04, c: '#F5B24A', name: { en: 'Sun core', fr: 'Noyau solaire' } },
    { id: 'c_elixir', r: 1, kind: 'luckyDur', v: 0.05, c: '#9BD3A8', name: { en: 'Mint core', fr: 'Noyau de menthe' } },
    { id: 'c_nap', r: 1, kind: 'offlineH', v: 0.5, c: '#7FA8AE', name: { en: 'Moss core', fr: 'Noyau de mousse' } },
    { id: 'c_ticket', r: 1, kind: 'ticketFreq', v: 0.08, c: '#E8A0B4', name: { en: 'Rose core', fr: 'Noyau de rose' } },
    { id: 'c_jelly', r: 2, kind: 'rj', v: 0.04, c: '#D64545', name: { en: 'Ruby core', fr: 'Noyau de rubis' } },
    { id: 'c_combo', r: 2, kind: 'combo', v: 0.15, c: '#4C7CC4', name: { en: 'Sapphire core', fr: 'Noyau de saphir' } },
    { id: 'c_bloom', r: 2, kind: 'honey', v: 0.12, c: '#3E9B6A', name: { en: 'Emerald core', fr: 'Noyau d\'émeraude' } },
    { id: 'c_sun', r: 3, kind: 'honey', v: 0.3, c: '#FFD45E', name: { en: 'Golden heart', fr: 'Cœur doré' } },
    { id: 'c_star', r: 3, kind: 'lucky', v: 0.1, c: '#8E6AC8', name: { en: 'Star heart', fr: 'Cœur étoilé' } },
    { id: 'c_nova', r: 4, kind: 'honey', v: 0.7, c: '#F0509E', name: { en: 'Nova heart', fr: 'Cœur nova' } },
    { id: 'c_void', r: 4, kind: 'rj', v: 0.18, c: '#5B2A8C', name: { en: 'Void heart', fr: 'Cœur du néant' } }
  ];
  BZ.CORE_BY_ID = {};
  BZ.CORES.forEach(c => { BZ.CORE_BY_ID[c.id] = c; });

  BZ.WORLDS = [
    { id: 'meadow', theme: 'meadow', cost: 0, mods: {}, name: { en: 'Flower meadow', fr: 'Prairie fleurie' }, crown: { en: 'Meadow crowns', fr: 'Couronnes des prés' } },
    { id: 'dunes', theme: 'w_dunes', cost: 100, mods: { growth: 1.13, luckyFreq: 0.6 }, name: { en: 'Sun dunes', fr: 'Dunes du soleil' }, crown: { en: 'Dune crowns', fr: 'Couronnes des dunes' }, hard: { rj: 0.5, crown: 4, ess: 2 } },
    { id: 'glacier', theme: 'w_glacier', cost: 150, mods: { honey: 0.5, offline: 3, offlineH: 6, luckyDur: 1.5 }, name: { en: 'Glacier hive', fr: 'Ruche du glacier' }, crown: { en: 'Glacier crowns', fr: 'Couronnes du glacier' }, hard: { rj: 0.1, crown: 40, ess: 3.5 } },
    { id: 'moon', theme: 'w_moon', cost: 200, mods: { luckyFreq: 2.2, tap: 0.3, honey: 0.8 }, name: { en: 'Moon garden', fr: 'Jardin lunaire' }, crown: { en: 'Moon crowns', fr: 'Couronnes lunaires' }, hard: { rj: 0.05, crown: 100, ess: 5 } },
    { id: 'ember', theme: 'w_ember', cost: 250, mods: { rj: 2, growth: 1.165 }, name: { en: 'Ember peaks', fr: 'Pics de braise' }, crown: { en: 'Ember crowns', fr: 'Couronnes de braise' }, hard: { rj: 0.025, crown: 250, ess: 7 } }
  ];
  BZ.ESSENCES = [
    { color: '#E86FA8', icon: 'flower', name: { en: 'Bloom essence', fr: 'Essence florale' } },
    { color: '#F2B233', icon: 'sun', name: { en: 'Sun essence', fr: 'Essence solaire' } },
    { color: '#7FC8E8', icon: 'snow', name: { en: 'Frost essence', fr: 'Essence de givre' } },
    { color: '#9C7BE0', icon: 'moon', name: { en: 'Moon essence', fr: 'Essence lunaire' } },
    { color: '#E8603C', icon: 'fire', name: { en: 'Ember essence', fr: 'Essence de braise' } }
  ];
  BZ.ESSENCE_SHOP = [
    { id: 'honey', w: 0, icon: 'drop', base: 2, growth: 1.42, max: 18, v: 0.25 },
    { id: 'tap', w: 0, icon: 'tap', base: 5, growth: 1.45, max: 12, v: 0.2, req: ['honey', 3] },
    { id: 'start', w: 0, icon: 'worker', base: 6, growth: 2.2, max: 5, v: [10, 25, 50, 100, 200], req: ['honey', 5] },
    { id: 'colony', w: 0, icon: 'hive', base: 40, growth: 2.5, max: 5, v: 0.1, req: ['start', 3] },
    { id: 'nectar', w: 0, icon: 'drop', base: 250, growth: 1.6, max: 8, v: 0.3, req: ['colony', 3] },
    { id: 'jelly', w: 1, icon: 'jelly', base: 3, growth: 1.45, max: 15, v: 0.15 },
    { id: 'wisdom', w: 1, icon: 'star', base: 10, growth: 1.7, max: 10, v: 0.05, req: ['jelly', 3] },
    { id: 'crown', w: 1, icon: 'crown', base: 60, growth: 3, max: 3, v: 1, req: ['jelly', 6] },
    { id: 'blaze', w: 1, icon: 'sun', base: 15, growth: 1.6, max: 10, v: 0.15, req: ['wisdom', 3] },
    { id: 'regal', w: 1, icon: 'crown', base: 250, growth: 1.6, max: 8, v: 0.25, req: ['blaze', 3] },
    { id: 'nap', w: 2, icon: 'clock', base: 5, growth: 2.2, max: 6, v: 2 },
    { id: 'tickets', w: 2, icon: 'ticket', base: 8, growth: 1.8, max: 10, v: 0.1, req: ['nap', 2] },
    { id: 'map', w: 2, icon: 'globe', base: 15, growth: 2.2, max: 5, v: 0.05, req: ['nap', 3] },
    { id: 'slot', w: 2, icon: 'palette', base: 25, growth: 4, max: 2, v: 1, req: ['tickets', 5] },
    { id: 'chill', w: 2, icon: 'snow', base: 250, growth: 1.6, max: 8, v: 0.08, req: ['map', 3] },
    { id: 'lucky', w: 3, icon: 'sparkle', base: 4, growth: 1.7, max: 10, v: 0.05 },
    { id: 'tide', w: 3, icon: 'tap', base: 10, growth: 1.6, max: 10, v: 0.2, req: ['lucky', 3] },
    { id: 'fortune', w: 3, icon: 'fire', base: 20, growth: 1.45, max: 10, v: 0.05, req: ['lucky', 5] },
    { id: 'glow', w: 3, icon: 'moon', base: 15, growth: 1.6, max: 8, v: 0.1, req: ['fortune', 5] },
    { id: 'ruby', w: 3, icon: 'gem', base: 300, growth: 1.6, max: 8, v: 0.005, req: ['glow', 3] },
    { id: 'forge', w: 4, icon: 'fire', base: 10, growth: 1.6, max: 10, v: 0.25 },
    { id: 'ash', w: 4, icon: 'jelly', base: 15, growth: 1.6, max: 10, v: 0.2, req: ['forge', 3] },
    { id: 'heart', w: 4, icon: 'shop', base: 30, growth: 2, max: 5, v: 0.02, req: ['forge', 5] },
    { id: 'kiln', w: 4, icon: 'crown', base: 40, growth: 2.2, max: 5, v: 0.1, req: ['ash', 3] },
    { id: 'phoenix', w: 4, icon: 'fire', base: 250, growth: 1.6, max: 8, v: 0.3, req: ['kiln', 3] }
  ];
  BZ.ESS_BY_ID = {};
  BZ.ESSENCE_SHOP.forEach(x => { BZ.ESS_BY_ID[x.id] = x; });
  BZ.PRIME_COST = 50000;
  BZ.RUBY_CHANCE = 0.02;
  BZ.RUBY = [
    { id: 'stone', w: 3, v: 1, icon: 'gem', color: '#F0509E' },
    { id: 'core', w: 10, v: 2, icon: 'ticket', color: '#8E6AC8' },
    { id: 'royal', w: 12, v: 3, icon: 'crown', color: '#E0A526' },
    { id: 'egg', w: 22, v: 6, icon: 'ticket', color: '#F28C28' },
    { id: 'ess', w: 18, v: 150, icon: 'sparkle', color: '#7FC8E8', worlds: 2 },
    { id: 'part', w: 10, v: 1, icon: 'palette', color: '#527C82' },
    { id: 'x2', w: 12, v: 30, icon: 'bolt', color: '#F2B233', boost: 'x2' },
    { id: 'swarm', w: 7, v: 2, icon: 'sparkle', color: '#FFD45E', boost: 'luckyswarm' },
    { id: 'warp', w: 6, v: 60, icon: 'clock', color: '#6BC496' }
  ];
  BZ.PRIME_GROWTH = 2;
  BZ.SELL_MIN = 5;

  BZ.ACH_BONUS = 0.02;
  BZ.RJ_BONUS = 0.1;
  BZ.RJ_CURVE = 0.6;
  BZ.RJ_DIVISOR = 1e9;
  BZ.RJ_SCALE = 5;
  BZ.RJ_MIN = 1e9;
  BZ.RJ_POWER = 0.25;
  BZ.COLONY_MULT = 1.5;
})(typeof window !== 'undefined' ? window : globalThis);
