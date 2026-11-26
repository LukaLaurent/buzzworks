(function (root) {
  const BZ = root.BZ;
  const E = BZ.E, F = BZ.F, P = BZ.P, UI = BZ.UI, t = BZ.t, n = BZ.n, ic = BZ.icon;
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  BZ.addStrings({
    tab_event: 'Event', tab_community: 'Community',
    ev_title: 'Boss fight', ev_d: 'Fight the boss with your honey! You get 10 minutes in a brand new hive, the same for every player: bees, cores, skins, levels and essence give no bonus. Every drop of honey you make hits the boss. A new boss comes every 4 hours, you get one try against each, and the best hives win legendary and mystic eggs when it leaves.',
    ev_fight: 'Fight the boss', ev_done: 'Already fought this boss', ev_in: 'Fight in progress', ev_resume: 'Back to the fight',
    ev_lvl: 'Level {n}', ev_dmg: 'Damage', ev_rank: 'Rank', ev_board: 'Ranking for this boss', ev_board_empty: 'Nobody fought this boss yet. Be the first!', ev_you: 'You',
    ev_rewards: 'Rewards when the boss leaves', ev_r1: 'Rank 1', ev_r2: 'Rank 2', ev_r3: 'Rank 3', ev_r4: 'Ranks 4 to 10', ev_r5: 'Top half', ev_r6: 'Everyone who fights',
    ev_signin: 'Sign in with Google to fight the boss and join the ranking.', ev_leave: 'Leave', ev_leave_t: 'Leave the fight?', ev_leave_d: 'Your damage is kept, but you cannot fight this boss again.',
    ev_go_t: '{b} appears!', ev_go_d: 'A fresh hive for 10 minutes. Make as much honey as you can: every drop hits the boss.', ev_over_t: 'The fight is over!', ev_over_d: 'You dealt {v} damage and reached level {l}. Your ranking reward arrives when the boss leaves.',
    ev_res_t: 'Last boss: rank {r}', ev_res_d: 'You finished {r} out of {n} hives against {b}.', ev_blocked: 'Not available during the boss fight', ev_hp: '{v} HP left',
    ev_mine: 'Your best against this boss', ev_instant: 'Fight reward', ev_ends: 'Next boss in {t}',
    hb_mystic: 'Mystic', ticket_mystic: 'Mystic eggs', r_mystic: '+{v} mystic eggs', mystic_t: 'Mystic egg', mystic_d: 'Always hatches a mythic bee. Won against the boss or, very rarely, from a red lucky bee.',
    hb_legend: 'Legendary', ticket_legend: 'Legendary eggs', r_legend: '+{v} legendary eggs', legend_t: 'Legendary egg', legend_d: 'Always hatches a legendary bee. Won against the boss or from a red lucky bee.',
    rr_luck: 'Lucky hatch {v} min', rr_xp2: 'Double XP {v} min', rr_lg2: 'League rush {v} min', rr_legend: 'Legendary egg', rr_mystic: 'Mystic egg'
  }, {
    tab_event: 'Événement', tab_community: 'Communauté',
    ev_title: 'Combat de boss', ev_d: 'Affrontez le boss avec votre miel ! Vous avez 10 minutes dans une ruche toute neuve, la même pour tous les joueurs : abeilles, noyaux, décors, niveaux et essence ne donnent aucun bonus. Chaque goutte de miel frappe le boss. Un nouveau boss arrive toutes les 4 heures, vous avez un essai contre chacun, et les meilleures ruches gagnent des œufs légendaires et mystiques à son départ.',
    ev_fight: 'Affronter le boss', ev_done: 'Déjà combattu contre ce boss', ev_in: 'Combat en cours', ev_resume: 'Retour au combat',
    ev_lvl: 'Niveau {n}', ev_dmg: 'Dégâts', ev_rank: 'Rang', ev_board: 'Classement contre ce boss', ev_board_empty: 'Personne n’a encore affronté ce boss. Soyez le premier !', ev_you: 'Vous',
    ev_rewards: 'Récompenses au départ du boss', ev_r1: 'Rang 1', ev_r2: 'Rang 2', ev_r3: 'Rang 3', ev_r4: 'Rangs 4 à 10', ev_r5: 'Première moitié', ev_r6: 'Tous les combattants',
    ev_signin: 'Connectez-vous avec Google pour affronter le boss et entrer dans le classement.', ev_leave: 'Quitter', ev_leave_t: 'Quitter le combat ?', ev_leave_d: 'Vos dégâts sont gardés, mais vous ne pourrez plus affronter ce boss.',
    ev_go_t: '{b} apparaît !', ev_go_d: 'Une ruche neuve pendant 10 minutes. Produisez un maximum de miel : chaque goutte frappe le boss.', ev_over_t: 'Le combat est terminé !', ev_over_d: 'Vous avez infligé {v} dégâts et atteint le niveau {l}. Votre récompense de classement arrive au départ du boss.',
    ev_res_t: 'Dernier boss : rang {r}', ev_res_d: 'Vous finissez {r} sur {n} ruches contre {b}.', ev_blocked: 'Indisponible pendant le combat de boss', ev_hp: 'Encore {v} PV',
    ev_mine: 'Votre meilleur score contre ce boss', ev_instant: 'Récompense de combat', ev_ends: 'Prochain boss dans {t}',
    hb_mystic: 'Mystique', ticket_mystic: 'Œufs mystiques', r_mystic: '+{v} œufs mystiques', mystic_t: 'Œuf mystique', mystic_d: 'Donne toujours une abeille mythique. À gagner contre le boss ou, très rarement, avec une abeille dorée rouge.',
    hb_legend: 'Légendaire', ticket_legend: 'Œufs légendaires', r_legend: '+{v} œufs légendaires', legend_t: 'Œuf légendaire', legend_d: 'Donne toujours une abeille légendaire. À gagner contre le boss ou avec une abeille dorée rouge.',
    rr_luck: 'Éclosion chanceuse {v} min', rr_xp2: 'XP double {v} min', rr_lg2: 'Ruée de ligue {v} min', rr_legend: 'Œuf légendaire', rr_mystic: 'Œuf mystique'
  });

  BZ.BOSSES = [
    { id: 'hornet', c: ['#E0A526', '#3A2A12'], name: { en: 'Giant hornet', fr: 'Frelon géant' } },
    { id: 'wasp', c: ['#C9485B', '#2A1218'], name: { en: 'Wasp queen', fr: 'Reine des guêpes' } },
    { id: 'moth', c: ['#8E6AC8', '#241A38'], name: { en: 'Wax moth', fr: 'Fausse teigne' } },
    { id: 'frost', c: ['#7FB8F0', '#1A2A40'], name: { en: 'Frost spirit', fr: 'Esprit du givre' } },
    { id: 'beetle', c: ['#3E9B6A', '#12261C'], name: { en: 'Hive beetle', fr: 'Scarabée des ruches' } },
    { id: 'ember', c: ['#F2643C', '#3A160E'], name: { en: 'Ember drake', fr: 'Dragon de braise' } }
  ];
  BZ.BOSS_REWARDS = [
    { max: 1, r: { mystic: 1, legend: 3 }, k: 'ev_r1' },
    { max: 2, r: { legend: 3 }, k: 'ev_r2' },
    { max: 3, r: { legend: 2 }, k: 'ev_r3' },
    { max: 10, r: { legend: 1, royal: 3 }, k: 'ev_r4' },
    { half: true, r: { royal: 2, egg: 10 }, k: 'ev_r5' },
    { r: { egg: 10, core: 2 }, k: 'ev_r6' }
  ];

  const KEY = 'buzzworks.event', PUSH_MS = 15000;
  const Ev = BZ.Event = { lastPush: 0, board: null, boardAt: 0, boardDay: '', rank: null, claiming: false };
  const G = () => BZ.Game;
  const real = () => G().realMain();
  const now = () => Date.now();
  const dur = () => BZ.EVENT_MIN * 60000;
  const cloudOk = () => !!(BZ.Cloud && BZ.Cloud.configured() && BZ.Cloud.signedIn());

  const SLOT = 4 * 3600000, GRACE = 12 * 60000;
  Ev.slotStart = ts => Math.floor((ts || now()) / SLOT) * SLOT;
  Ev.day = ts => { const d = new Date(Ev.slotStart(ts)); return d.toISOString().slice(0, 10) + '-' + String(d.getUTCHours()).padStart(2, '0'); };
  Ev.keyStart = k => { const m = /^(\d{4})-(\d{2})-(\d{2})-(\d{2})$/.exec(k || ''); return m ? Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4]) : 0; };
  Ev.dayEnd = () => Ev.slotStart() + SLOT;
  Ev.due = k => now() >= Ev.keyStart(k) + SLOT + GRACE;
  Ev.claimable = e => !!e.day && e.day !== Ev.day() && e.claimed !== e.day && Ev.due(e.day);
  Ev.owedDue = e => (e.owed || []).filter(x => Ev.due(x.day));
  Ev.boss = day => { let h = 0; for (const ch of day || Ev.day()) h = (h * 31 + ch.charCodeAt(0)) >>> 0; return BZ.BOSSES[h % BZ.BOSSES.length]; };
  Ev.state = s => { s.event = Object.assign({ day: '', done: 0, best: 0, lvl: 0, claimed: '' }, s.event || {}); return s.event; };
  Ev.canPlay = s => { const e = Ev.state(s); return e.day !== Ev.day() || !e.done; };
  Ev.level = d => Math.max(0, Math.floor(Math.log10(Math.max(1, d)) - 5));
  Ev.hpFrac = d => { const l = Ev.level(d), lo = l === 0 ? 0 : Math.pow(10, l + 5), hi = Math.pow(10, l + 6); return Math.max(0, Math.min(1, 1 - (d - lo) / (hi - lo))); };
  Ev.hpLeft = d => Math.max(0, Math.pow(10, Ev.level(d) + 6) - d);
  Ev.score = s => Math.floor(s.lifetime || 0);
  Ev.dot = function () {
    const s = real();
    if (!s || !cloudOk() || G().battle) return false;
    const e = Ev.state(s);
    return Ev.canPlay(s) || (e.best > 0 && Ev.claimable(e)) || Ev.owedDue(e).length > 0;
  };

  Ev.bossSvg = function (b, size) {
    const [c, d] = b.c;
    return '<svg class="ev-boss" viewBox="0 0 120 120" width="' + size + '" height="' + size + '" aria-hidden="true">' +
      '<ellipse cx="60" cy="108" rx="34" ry="6" fill="rgba(0,0,0,0.18)"/>' +
      '<path d="M30 38 18 12 42 30M90 38l12-26-24 18" fill="' + d + '"/>' +
      '<ellipse cx="22" cy="58" rx="18" ry="11" fill="rgba(255,255,255,0.55)" transform="rotate(-25 22 58)"/><ellipse cx="98" cy="58" rx="18" ry="11" fill="rgba(255,255,255,0.55)" transform="rotate(25 98 58)"/>' +
      '<ellipse cx="60" cy="66" rx="36" ry="38" fill="' + c + '"/>' +
      '<path d="M26 70h68M28 84h64" stroke="' + d + '" stroke-width="8" stroke-linecap="round" opacity="0.85"/>' +
      '<path d="M40 52l14 6M80 52l-14 6" stroke="' + d + '" stroke-width="5" stroke-linecap="round"/>' +
      '<circle cx="46" cy="62" r="6" fill="#FFF4C8"/><circle cx="74" cy="62" r="6" fill="#FFF4C8"/><circle cx="47" cy="63" r="3" fill="' + d + '"/><circle cx="73" cy="63" r="3" fill="' + d + '"/>' +
      '<path d="M50 96l4 6 6-6 6 6 4-6" stroke="#FFF4C8" stroke-width="3" fill="none" stroke-linejoin="round"/></svg>';
  };

  function refund(s) {
    const es = s.battleEsc || {};
    for (const id in es) {
      const x = es[id], st = x.stake || {};
      if (x.entered && x.final) continue;
      if (st.type === 'stone') s.primeStones = (s.primeStones || 0) + st.n;
      else if (st.type === 'royal' || st.type === 'core') s.tickets[st.type] = (s.tickets[st.type] || 0) + st.n;
      else if (st.type === 'ess') s.ess[st.w] = (s.ess[st.w] || 0) + st.n;
      else if (st.type === 'crowns') { const w = P.worldState(s, st.w); if (w) w.crowns = (w.crowns || 0) + st.n; }
      else if (st.type === 'skin' && x.skin) s.skins[x.skin] = 1;
    }
    delete s.battleEsc; delete s.battleHist;
    try { localStorage.removeItem('buzzworks.battle'); } catch (e) {}
  }

  Ev.makeState = function (base, day) {
    const st = E.newState(0);
    for (const k of P.SHARED) if (base[k] !== undefined) st[k] = JSON.parse(JSON.stringify(base[k]));
    st.world = 0; st.worldsOpen = [0]; st.otherWorlds = {}; st.essShop = {};
    st.bless = []; st.blessDone = []; st.blessOffer = null; st.boosts = []; st.buffs = [];
    st.auto = { upg: true, prod: true, swarm: false, swarmAt: 2, prodMode: 'best' };
    const ns = G().migrateState(st);
    ns.battle = 1; ns.eventDay = day; ns.flags.queen = 1;
    ns._dirty = true;
    return ns;
  };

  Ev.start = function () {
    const g = G(), s = real();
    if (g.battle || !cloudOk()) return;
    if (!Ev.canPlay(s)) return UI.toast('boss', t('ev_done'));
    const day = Ev.day(), e = Ev.state(s);
    if (e.day !== day) { if (e.day && e.best > 0 && e.claimed !== e.day) e.owed = (e.owed || []).filter(x => x.day !== e.day).concat([{ day: e.day, best: e.best }]).slice(-6); e.day = day; e.best = 0; e.lvl = 0; }
    e.done = 1;
    const boss = Ev.boss(day);
    BZ.Audio.play('luckySpawn');
    UI.modal('<div class="hero ev-pop"><div class="ev-pop-boss">' + Ev.bossSvg(boss, 120) + '</div><h4>' + esc(t('ev_go_t', { b: n(boss.name) })) + '</h4><p>' + t('ev_go_d') + '</p></div><div class="row center"><button class="btn btn-primary" data-close>' + ic('boss') + t('ev_fight') + '</button></div>', false);
    UI.onModalClose = () => Ev.enter({ day, end: now() + dur() });
  };

  Ev.enter = function (info, stored) {
    const g = G();
    if (g.battle) return;
    const base = g.main;
    const bs = stored || Ev.makeState(base, info.day);
    g.battle = Object.assign({ real: base, event: 1 }, info);
    g.main = bs;
    if (BZ.Scene) { BZ.Scene.removeLucky(false); BZ.Scene.removeLucky(false, 'ticket'); }
    E.recalc(bs);
    g.refreshScene();
    UI.structureChanged();
    UI.show('hive');
    bar();
    Ev.persist();
    g.save();
    if (BZ.Log) BZ.Log.info('boss enter ' + info.day);
  };
  Ev.persist = function () {
    const g = G();
    if (!g.battle) return;
    try { localStorage.setItem(KEY, JSON.stringify({ info: { day: g.battle.day, end: g.battle.end }, state: BZ.Store.serialize(g.main) })); } catch (e) {}
  };
  function record(s, day, sc) {
    const e = Ev.state(s);
    if (e.day !== day) return;
    if (sc > e.best) { e.best = sc; e.lvl = Ev.level(sc); }
  }
  function push(day, sc, s) {
    if (!cloudOk()) return;
    BZ.Cloud.boss.setScore(day, { n: (BZ.ChatFilter.name(BZ.Online.name(s)).replace(/[*]+/g, '').trim() || 'Player').slice(0, 18), p: Math.min(9e29, Math.max(0, Math.floor(sc))), l: Math.max(1, Math.min(99999, Math.floor(s.level || 1))) }).catch(e => { if (BZ.Log) BZ.Log.error('boss score: ' + e.message); });
    Ev.boardAt = 0;
  }
  Ev.leave = function () {
    const g = G();
    const b = g.battle;
    if (!b) return;
    const sc = Ev.score(g.main);
    g.main = b.real;
    g.battle = null;
    try { localStorage.removeItem(KEY); } catch (e) {}
    record(g.main, b.day, sc);
    push(b.day, Ev.state(g.main).best, g.main);
    const got = P.grant(g.main, { egg: Math.min(10, 3 + Ev.level(sc)) });
    if (BZ.Scene) { BZ.Scene.removeLucky(false); BZ.Scene.removeLucky(false, 'ticket'); }
    E.recalc(g.main);
    g.refreshScene();
    UI.structureChanged();
    bar();
    g.save();
    BZ.Audio.play('swarm');
    const boss = Ev.boss(b.day);
    UI.queueModal('<div class="hero ev-pop"><div class="ev-pop-boss">' + Ev.bossSvg(boss, 110) + '</div><h4>' + t('ev_over_t') + '</h4><p>' + t('ev_over_d', { v: F.num(sc), l: Ev.level(sc) }) + '</p><p class="ev-got">' + ic('gift') + esc(t('ev_instant') + ' : ' + UI.gotText(got)) + '</p></div><div class="row center"><button class="btn btn-primary" data-close>' + t('ok') + '</button></div>');
    if (BZ.Log) BZ.Log.info('boss leave ' + b.day + ' dmg ' + sc);
    if (BZ.Welcome) setTimeout(BZ.Welcome.check, 1500);
  };
  Ev.resume = function () {
    let raw = null;
    try { raw = JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) {}
    if (!raw || !raw.info || !raw.state) return;
    const g = G();
    if (now() < raw.info.end) {
      const st = g.migrateState(raw.state);
      st.battle = 1; st.eventDay = raw.info.day;
      Ev.enter(raw.info, st);
    } else {
      const sc = Ev.score(raw.state);
      record(g.main, raw.info.day, sc);
      Ev.pending = raw.info.day;
      try { localStorage.removeItem(KEY); } catch (e) {}
    }
  };

  function bar() {
    let el = document.getElementById('evBar');
    const g = G();
    if (!g.battle) { if (el) el.remove(); return; }
    if (!el) { el = document.createElement('div'); el.id = 'evBar'; el.className = 'bt-bar ev-bar'; (document.getElementById('stage') || document.getElementById('app')).appendChild(el); }
    const boss = Ev.boss(g.battle.day);
    const sc = Ev.score(g.main), lv = Ev.level(sc);
    const left = Math.max(0, g.battle.end - now());
    const hp = (Ev.hpFrac(sc) * 100).toFixed(1);
    const key = [boss.id, lv, hp, Math.floor(left / 1000), F.num(sc), BZ.lang].join('|');
    if (el._k === key) return;
    el._k = key;
    if (!el.firstChild) el.innerHTML = '<span class="ev-bar-pic"></span><div class="ev-bar-mid"><div class="ev-bar-top"><b class="ev-bn"></b><small class="ev-bl"></small></div><div class="ev-hp"><i></i></div><small class="ev-dmg num"></small></div><span class="bt-time num"></span><button class="ev-quit" data-ev="quit"></button>';
    el.querySelector('.ev-bar-pic').innerHTML = Ev.bossSvg(boss, 40);
    el.querySelector('.ev-bn').textContent = n(boss.name);
    el.querySelector('.ev-bl').textContent = t('ev_lvl', { n: lv });
    el.querySelector('.ev-hp i').style.width = hp + '%';
    el.querySelector('.ev-dmg').textContent = t('ev_dmg') + ' ' + F.num(sc) + '  ·  ' + t('ev_hp', { v: F.num(Ev.hpLeft(sc)) });
    el.querySelector('.bt-time').textContent = F.time(left / 1000);
    el.querySelector('.ev-quit').textContent = t('ev_leave');
  }

  function reward(rank, total) {
    for (const x of BZ.BOSS_REWARDS) {
      if (x.max && rank <= x.max) return x.r;
      if (x.half && rank <= Math.ceil(total / 2)) return x.r;
      if (!x.max && !x.half) return x.r;
    }
    return {};
  }
  Ev.claim = async function () {
    const s = real();
    if (!s || Ev.claiming || !cloudOk() || G().battle) return;
    const e = Ev.state(s);
    if (Ev.claimable(e) && !(e.best > 0)) e.claimed = e.day;
    const item = Ev.owedDue(e)[0] || (Ev.claimable(e) ? { day: e.day, best: e.best, cur: true } : null);
    if (!item) return;
    Ev.claiming = true;
    try {
      const day = item.day;
      const r = await BZ.Cloud.boss.rank(day, item.best);
      if (item.cur) { if (e.claimed === day) return; e.claimed = day; }
      else { if (!(e.owed || []).some(x => x.day === day)) return; e.owed = e.owed.filter(x => x.day !== day); }
      const got = P.grant(s, reward(r.rank, r.total));
      e.last = { day, rank: r.rank, total: r.total };
      G().save();
      UI.structureChanged();
      BZ.Audio.play('swarm');
      const boss = Ev.boss(day);
      UI.queueModal('<div class="hero ev-pop"><div class="ev-pop-boss">' + Ev.bossSvg(boss, 110) + '</div><h4>' + esc(t('ev_res_t', { r: F.int(r.rank) })) + '</h4><p>' + esc(t('ev_res_d', { r: F.int(r.rank), n: F.int(r.total), b: n(boss.name) })) + '</p><div class="ev-chips">' + UI.rewardChips(reward(r.rank, r.total)) + '</div></div><div class="row center"><button class="btn btn-primary" data-close>' + t('ok') + '</button></div>');
      if (BZ.Log) BZ.Log.info('boss reward ' + day + ' rank ' + r.rank + ' ' + UI.gotText(got));
    } catch (err) {
      if (BZ.Log) BZ.Log.error('boss claim: ' + (err && err.message));
    } finally { Ev.claiming = false; }
  };

  function loadBoard(force) {
    const day = Ev.day();
    if (!cloudOk() || (!force && Ev.boardDay === day && now() - Ev.boardAt < 30000) || Ev.loading) return;
    Ev.loading = true;
    BZ.Cloud.boss.top(day, 20).then(list => {
      Ev.board = list; Ev.boardDay = day; Ev.boardAt = now();
      const best = Ev.state(real()).day === day ? Ev.state(real()).best : 0;
      return best > 0 ? BZ.Cloud.boss.rank(day, best).then(r => { Ev.rank = r; }) : (Ev.rank = null);
    }).catch(e => { if (BZ.Log) BZ.Log.error('boss board: ' + e.message); Ev.boardAt = now(); })
      .finally(() => { Ev.loading = false; UI.dirty('event'); });
  }

  setInterval(() => {
    const g = G();
    if (!g || !g.main) return;
    if (g.battle) {
      if (now() >= g.battle.end) { Ev.leave(); return; }
      if (now() - Ev.lastPush > PUSH_MS) { Ev.lastPush = now(); const sc = Ev.score(g.main); record(g.battle.real, g.battle.day, sc); push(g.battle.day, Ev.state(g.battle.real).best, g.battle.real); }
      bar();
      return;
    }
    if (cloudOk()) {
      if (Ev.pending) { const d = Ev.pending; Ev.pending = null; const s = real(); if (Ev.state(s).day === d) push(d, Ev.state(s).best, s); }
      if (Math.floor(now() / 1000) % 10 === 0) Ev.claim();
    }
    if (UI.page() === 'event' && Math.floor(now() / 1000) % 30 === 0) loadBoard();
  }, 1000);

  UI.ext.event = function () {
    const s = real();
    let h = UI.title(t('tab_event'), '');
    if (!cloudOk()) {
      return h + '<div class="card lg-cta"><div class="lg-cta-pic">' + ic('boss') + '</div><p>' + t('ev_signin') + '</p><button class="btn btn-primary btn-lg g-btn" data-act="cloudin">' + ic('user') + t('cloud_signin') + '</button></div>';
    }
    if (BZ.Online && BZ.Online.banned) return h + '<div class="card lg-cta"><div class="lg-cta-pic">' + ic('lock') + '</div><p>' + t('lg_banned') + '</p></div>';
    loadBoard();
    const day = Ev.day(), boss = Ev.boss(day), e = Ev.state(s), g = G();
    const best = e.day === day ? e.best : 0;
    h += '<div class="card ev-hero" style="--bc:' + boss.c[0] + ';--bd:' + boss.c[1] + '"><div class="ev-hero-pic">' + Ev.bossSvg(boss, 132) + '</div><div class="ev-hero-t"><span class="badge lim">' + ic('boss') + t('ev_title') + '</span><h3>' + esc(n(boss.name)) + '</h3><p>' + t('ev_d') + '</p><small class="num ev-ends" data-t="' + Ev.dayEnd() + '" data-tfmt="ev_ends"></small>';
    if (g.battle) h += '<button class="btn btn-primary" data-ev="hive">' + ic('boss') + t('ev_resume') + '</button>';
    else if (Ev.canPlay(s)) h += '<button class="btn btn-primary btn-lg ev-go" data-ev="start">' + ic('boss') + t('ev_fight') + '</button>';
    else h += '<button class="btn btn-outline off">' + ic('check') + t('ev_done') + '</button>';
    h += '</div></div>';
    if (best > 0) {
      h += '<div class="card ev-mine"><div class="ev-stat"><small>' + t('ev_mine') + '</small><b class="num">' + F.num(best) + '</b></div><div class="ev-stat"><small>' + t('ev_lvl', { n: '' }).trim() + '</small><b class="num">' + Ev.level(best) + '</b></div><div class="ev-stat"><small>' + t('ev_rank') + '</small><b class="num">' + (Ev.rank ? F.int(Ev.rank.rank) + ' / ' + F.int(Ev.rank.total) : '...') + '</b></div></div>';
    }
    const me = BZ.Cloud.uid();
    h += '<div class="card"><div class="sec-title"><h3>' + t('ev_board') + '</h3></div>';
    const list = Ev.boardDay === day ? (Ev.board || []) : [];
    if (!list.length) h += '<div class="empty-line">' + (Ev.board ? t('ev_board_empty') : t('loading')) + '</div>';
    else h += '<div class="ev-board">' + list.map((x, i) => '<div class="ev-row' + (x.uid === me ? ' me' : '') + (i < 3 ? ' top' + (i + 1) : '') + '"><span class="ev-pos num">' + (i + 1) + '</span><b>' + esc(x.uid === me ? t('ev_you') : BZ.ChatFilter.name(x.n)) + '</b><small>' + t('lvl', { n: x.l || 1 }) + '</small><span class="ev-sc num">' + F.num(x.p || 0) + '</span></div>').join('') + '</div>';
    h += '</div>';
    h += '<div class="card"><div class="sec-title"><h3>' + t('ev_rewards') + '</h3></div><div class="ev-rw">' + BZ.BOSS_REWARDS.map(x => '<div class="ev-rw-row"><b>' + t(x.k) + '</b><span>' + UI.rewardChips(x.r) + '</span></div>').join('') + '</div></div>';
    return h;
  };

  document.addEventListener('click', e => {
    const el = e.target.closest('[data-ev]');
    if (!el) return;
    e.stopPropagation();
    const a = el.dataset.ev;
    BZ.Audio.play('click');
    if (a === 'start') return Ev.start();
    if (a === 'hive') return UI.show('hive');
    if (a === 'quit') return UI.confirm(t('ev_leave_t'), t('ev_leave_d'), t('ev_leave'), true, () => Ev.leave());
  });

  const blockTabs = ['bees', 'workshop', 'daily', 'pass', 'worlds', 'trophies'];
  const origShow = UI.show;
  UI.show = function (p) {
    if (G() && G().battle && blockTabs.includes(p)) { UI.toast('boss', t('ev_blocked')); return; }
    return origShow.apply(this, arguments);
  };
  const wrap = (obj, key) => { const fn = obj[key]; if (!fn) return; obj[key] = function () { if (G().battle) { UI.toast('boss', t('ev_blocked')); return; } return fn.apply(this, arguments); }; };
  Ev.init = function () {
    if (Ev.ready) return;
    Ev.ready = true;
    const g = G();
    refund(g.main);
    Ev.state(g.main);
    ['travel', 'askSell', 'askPrime', 'buyEss', 'pull', 'openWorld', 'cloudSync'].forEach(k => wrap(g, k));
    wrap(UI, 'openMap');
    if (BZ.Dev) wrap(BZ.Dev, 'open');
    Ev.resume();
  };
})(window);
