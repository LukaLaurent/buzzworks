(function (root) {
  const BZ = root.BZ;
  const E = BZ.E, F = BZ.F, M = BZ.Meta, P = BZ.P, UI = BZ.UI, Scene = BZ.Scene, A = BZ.Audio, Log = BZ.Log, t = BZ.t, n = BZ.n;

  const DEFAULT_SETTINGS = { lang: '', theme: 'system', notation: 'short', sound: true, music: false, vibrate: true, reduced: false };
  const DANCE_EVERY = 4 * 3600;

  const G = BZ.Game = {
    main: null, settings: Object.assign({}, DEFAULT_SETTINGS),
    cur() { return this.main; }
  };
  let lastFrame = 0;
  let saveTimer = 0, achAcc = 0, minuteAcc = 0, cloudAcc = 0;
  let lastLifetime = 0;
  let tutorialStep = 0;

  function xp(kind, count) {
    if (!G.main) return;
    const ups = P.addXp(G.main, kind, count);
    if (ups.length) onLevelUp(ups);
  }
  G.xp = xp;
  function onLevelUp(ups) {
    const s = G.main;
    for (const L of ups) {
      const got = P.grant(s, P.levelReward(L));
      UI.toast('star', t('lvl_up', { n: L }) + '  ' + UI.gotText(got), { ok: true, long: true });
      const unlock = Object.keys(P.UNLOCKS).find(k => P.UNLOCKS[k] === L);
      if (unlock) setTimeout(() => UI.toast('info', t('unlocked_tab', { p: t('tab_' + unlock) }), { ok: true, long: true }), 400);
      Log.info('level ' + L);
    }
    A.play('milestone');
    Scene.pulse(3);
    UI.dirty();
  }

  function visualSkin(s) {
    if ((s.world || 0) > 0) return E.world(s).theme;
    return s.skin || 'meadow';
  }
  G.refreshScene = () => Scene.setSkin(visualSkin(G.main));

  function afterGot(got, icon) {
    if (!got || !got.length) return;
    A.play('achievement');
    UI.toast(icon || 'gift', UI.gotText(got), { ok: true });
    const bee = got.find(g => g.k === 'bee');
    if (bee) UI.beeModal({ id: bee.v, isNew: G.main.bees[bee.v] === 1, levelUp: false, level: E.beeLevel(G.main, bee.v) });
    if (got.some(g => g.k === 'skin')) Scene.pulse(4);
    UI.render();
    G.save();
  }
  G.passClaim = tier => afterGot(P.passClaim(G.main, tier));
  G.passAll = () => afterGot(P.passClaimAll(G.main));

  G.pull = function (bn, count) {
    const s = G.main;
    const res = P.pull(s, bn, count);
    if (!res) { A.play('error'); UI.toast('ticket', t('need_tickets')); return; }
    xp('hatch', count);
    UI.showPulls(res);
    UI.render();
    G.save();
    Log.info('hatch ' + bn + ' x' + count + ': ' + res.map(r => r.id).join(','));
  };
  G.adTickets = function () {
    UI.showAd('ticket').then(ok => { if (ok) afterGot(P.grant(G.main, { egg: 2 }), 'ticket'); });
  };
  G.adBoost = function () {
    UI.showAd('boost').then(ok => {
      if (!ok) return;
      E.addBoost(G.main, 'adx2');
      A.play('lucky');
      UI.toast('bolt', t('ad_boost'), { ok: true });
      UI.render();
      G.save();
    });
  };
  G.equipCore = function (id) {
    const r = P.equipCore(G.main, id);
    if (r === 'full') { A.play('error'); UI.toast('hive', t('core_full')); return; }
    if (!r) return;
    A.play(r === 'on' ? 'upgrade' : 'click');
    UI.render();
    G.save();
  };
  G.blessPick = function (i) {
    const e = P.blessPick(G.main, i);
    if (!e) return;
    UI.closeModal();
    A.play('upgrade');
    Scene.pulse(3);
    UI.toast('sparkle', t('bl_' + e.id) + '  ' + UI.blessDesc(e), { ok: true });
    xp('bless');
    UI.structureChanged();
    G.save();
  };
  G.blessReroll = function () {
    UI.closeModal();
    UI.showAd('reroll').then(ok => { if (ok) { P.blessOffer(G.main); G.save(); } UI.showBless(); });
  };
  G.travel = function (idx) {
    const ns = P.travel(G.main, idx);
    if (!ns) return;
    const away = (Date.now() - (ns.lastSave || Date.now())) / 1000;
    G.main = ns;
    Scene.removeLucky(false);
    Scene.removeLucky(false, 'ticket');
    E.recalc(ns);
    if (away > 60) E.offline(ns, away);
    ns.lastSave = Date.now();
    lastLifetime = ns.lifetime;
    G.refreshScene();
    A.play('swarm');
    Scene.pulse(5);
    UI.toast('globe', t('travel_done', { w: n(E.world(ns).name) }), { ok: true });
    Log.info('travel to world ' + idx);
    UI.structureChanged();
    UI.show('hive');
    G.save();
  };
  G.openWorld = function (idx) {
    const s = G.main;
    if (!P.canOpenWorld(s, idx)) { A.play('error'); return; }
    const w = BZ.WORLDS[idx];
    UI.confirm(n(w.name), t('wd_' + w.id), t('world_open', { v: w.cost }), false, () => {
      if (!P.openWorld(s, idx)) return;
      A.play('swarm');
      UI.toast('globe', t('world_opened', { w: n(w.name) }), { ok: true });
      Log.info('world opened ' + idx);
      E.checkAchievements(s);
      UI.render();
      G.save();
    });
  };
  G.askSell = function () {
    const s = G.main;
    const v = P.sellValue(s);
    if (v < 1) { A.play('error'); return; }
    UI.confirm(t('sell_title'), t('sell_text', { v: F.int(v) }), t('sell_done', { v: F.int(v) }), true, () => {
      const r = P.sellWorld(G.main);
      if (!r) return;
      G.main = r.state;
      Scene.removeLucky(false);
      Scene.removeLucky(false, 'ticket');
      lastLifetime = 0;
      G.refreshScene();
      A.play('swarm');
      Scene.pulse(6);
      UI.toast('sparkle', t('sell_done', { v: F.int(r.gain) }), { ok: true, long: true });
      Log.info('world sold for ' + r.gain + ' essence');
      UI.structureChanged();
      UI.show('hive');
      G.save();
    });
  };

  function vibrate(ms) { if (G.settings.vibrate && navigator.vibrate) try { navigator.vibrate(ms); } catch (e) {} }

  function applyTheme() {
    const th = G.settings.theme;
    const dark = th === 'dark' || (th === 'system' && root.matchMedia && root.matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
  }
  function applySettings() {
    const st = G.settings;
    BZ.lang = st.lang;
    F.lang = st.lang;
    F.notation = st.notation;
    A.sound = st.sound;
    A.setMusic(st.music);
    Scene.setOptions({ reduced: st.reduced });
    applyTheme();
  }

  G.saveSettings = function () { BZ.Store.save('settings', G.settings); };
  G.setSetting = function (key, val) {
    G.settings[key] = val;
    applySettings();
    if (key === 'lang') UI.buildChrome();
    UI.render();
    G.saveSettings();
    Log.info('setting ' + key + ' = ' + val);
  };

  G.save = function (sync) {
    if (!G.main) return;
    G.main.lastSave = Date.now();
    const data = BZ.Store.serialize(G.main);
    if (sync) BZ.Store.saveSync('save', data);
    else BZ.Store.save('save', data).then(ok => { if (!ok) UI.toast('info', t('error_save'), { nova: 'oops' }); });
  };

  function migrate(s) {
    const fresh = E.newState(s.world || 0);
    for (const k in fresh) if (s[k] === undefined) s[k] = fresh[k];
    for (const p of BZ.PRODUCERS) if (s.owned[p.id] === undefined) s.owned[p.id] = 0;
    s.auto = Object.assign({}, fresh.auto, s.auto || {});
    s.luckyOn = null;
    s.ticketOn = null;
    s.v = 2;
    s._dirty = true;
    M.ensure(s);
    P.ensure(s);
    return s;
  }
  G.migrate = migrate;

  G.loadState = function (data) {
    G.main = migrate(data);
    Scene.removeLucky(false);
    Scene.removeLucky(false, 'ticket');
    lastLifetime = G.main.lifetime;
    G.refreshScene();
    UI.structureChanged();
    UI.render();
  };

  G.tapAt = function (x) {
    if (UI.modalOpen()) return;
    const s = G.main;
    const v = E.tap(s);
    if (x === null) { Scene.pulse(1.5); Scene.centerText('+' + F.num(v)); }
    A.play('tap', s.combo);
    if (s.combo % 25 === 0) vibrate(8);
    if (tutorialStep === 1) nextTutorial();
    return '+' + F.num(v);
  };

  G.buyProducer = function (pid, mode, el) {
    const s = G.main;
    let amt = E.buyAmount(s, pid, mode);
    if (mode === 'max' && E.maxAffordable(s, pid) === 0) amt = 1;
    if (E.buy(s, pid, amt)) {
      A.play('buy');
      vibrate(6);
      UI.buyFlash(el);
      if (tutorialStep === 2) nextTutorial();
    } else A.play('error');
  };
  G.buyUpgrade = function (id) {
    if (E.buyUpgrade(G.main, id)) { A.play('upgrade'); vibrate(10); UI.structureChanged(); }
    else A.play('error');
  };
  G.buyAllUpgrades = function () {
    const s = G.main;
    let c = 0;
    for (const u of E.availableUpgrades(s)) if (u.cost <= s.honey && E.buyUpgrade(s, u.id)) c++;
    if (c) { A.play('upgrade'); UI.structureChanged(); }
  };

  G.askSwarm = function () {
    const s = G.main;
    const gain = E.pendingRJ(s);
    if (gain < 1) { A.play('error'); return; }
    UI.confirm(t('swarm_title'), t('swarm_text', { v: F.num(gain, { int: true }) }), t('swarm') + ' +' + F.num(gain, { int: true }), false, () => {
      const g = E.swarm(s);
      if (g > 0) {
        A.play('swarm');
        vibrate([20, 40, 20]);
        Scene.pulse(5);
        UI.toast('jelly', t('swarm_done', { v: F.num(g, { int: true }) }), { ok: true });
        if (s.blessOffer) setTimeout(() => UI.showBless(), 500);
        Log.info('swarm +' + g + ' royal jelly (total ' + s.rjEarned + ')');
        UI.structureChanged();
        UI.render();
        G.save();
      }
    });
  };
  G.askCoronate = function () {
    const s = G.main;
    const gain = E.pendingCrowns(s);
    if (gain < 1) { A.play('error'); return; }
    UI.confirm(t('coronate_title'), t('coronate_text', { v: F.int(gain) }), t('coronate') + ' +' + F.int(gain), false, () => {
      const g = E.coronate(s);
      if (g > 0) {
        A.play('swarm');
        vibrate([30, 50, 30]);
        Scene.pulse(6);
        UI.toast('crown', t('coronate_done', { v: F.int(g) }), { ok: true });
        xp('coronation');
        if (s.blessOffer) setTimeout(() => UI.showBless(), 500);
        Log.info('coronation +' + g + ' crowns (total ' + s.crowns + ')');
        UI.structureChanged();
        UI.render();
        G.save();
      }
    });
  };
  G.buyQueen = function (id) {
    if (E.buyQueen(G.main, id)) { A.play('upgrade'); UI.render(); G.save(); }
    else A.play('error');
  };

  G.skin = function (id) {
    const s = G.main;
    if (!s.skins[id]) return;
    s.skin = id;
    s._dirty = true;
    G.refreshScene();
    A.play('click');
    UI.render();
    G.save();
  };

  function giveBee(minRarity) {
    const res = M.dropBee(G.main, minRarity);
    A.play('achievement');
    UI.beeModal(res);
    UI.dirty('bees');
    Log.info('bee ' + res.id + (res.isNew ? ' new' : '') + ' level ' + res.level);
    return res;
  }
  G.giveBee = giveBee;

  G.danceReadyIn = function () {
    const s = G.main;
    return Math.max(0, ((s.danceReady || 0) - Date.now()) / 1000);
  };
  G.dance = function () {
    const wait = G.danceReadyIn();
    if (wait > 0) { UI.toast('music', t('dance_wait', { t: F.time(wait) })); return; }
    const s = G.main;
    s.danceReady = Date.now() + DANCE_EVERY * 1000;
    s.boosts = s.boosts.filter(b => b.id !== 'dance');
    E.addBoost(s, 'dance');
    A.play('lucky');
    Scene.pulse(4);
    UI.toast('music', t('boost_on', { n: t('shop_free') }), { ok: true });
    UI.render();
    G.save();
  };

  G.claimStreak = function () {
    const got = M.claimStreak(G.main);
    if (!got) return;
    if (G.main.daily.streak % 7 === 0) giveBee(2);
    afterGot(got);
  };
  G.claimQuest = function (i) {
    const got = M.claimQuest(G.main, i);
    if (!got) return;
    xp('quest');
    if (Math.random() < 0.2) giveBee(0);
    afterGot(got, 'calendar');
  };
  G.claimQuick = function (i) {
    const got = M.claimQuick(G.main, i);
    if (!got) return;
    xp('quick');
    M.addPoints(G.main, 'quick');
    afterGot(got, 'clock');
  };

  G.askReset = function () {
    UI.confirm(t('reset_title'), t('reset_text'), t('reset_ok'), true, async () => {
      await BZ.Store.clear();
      G.main = migrate(E.newState(0));
      G.refreshScene();
      tutorialStep = 1;
      UI.hint(t('tutorial_1'));
      UI.structureChanged();
      UI.show('hive');
      G.save();
      Log.info('progress reset');
    });
  };

  function nextTutorial() {
    tutorialStep++;
    if (tutorialStep === 2) {
      if (G.main.honey >= 15 || G.main.owned.worker > 0) { UI.hint(t('tutorial_2')); UI.tutorialTarget = 'worker'; }
      else { tutorialStep = 1; return; }
      if (G.main.owned.worker > 0) nextTutorial();
    } else if (tutorialStep === 3) {
      UI.hint(null);
      UI.tutorialTarget = null;
      setTimeout(() => { if (tutorialStep === 3) UI.toast('sparkle', t('tutorial_3')); }, 30000);
    }
  }

  function luckyText(res) {
    const eff = BZ.LUCKY_EFFECTS.find(e => e.id === res.id);
    const c = E.cache(G.main);
    if (res.id === 'rush') return t('lucky_rush') + ': ' + t('lucky_rush_d', { m: eff.mult, s: Math.round(eff.dur * c.luckyDur) });
    if (res.id === 'frenzy') return t('lucky_frenzy') + ': ' + t('lucky_frenzy_d', { m: eff.mult, s: Math.round(eff.dur * c.luckyDur) });
    if (res.id === 'harvest') return t('lucky_harvest') + ': ' + t('lucky_harvest_d', { v: F.num(res.amount) });
    if (res.id === 'storm') return t('lucky_storm') + ': ' + t('lucky_storm_d');
    if (res.id === 'ticket') return t('lucky_ticket') + ': ' + t('lucky_ticket_d', { v: res.amount });
    return t('lucky_chest') + ': ' + t('lucky_chest_d');
  }

  function onEvent(s, type, d) {
    if (s !== G.main) return;
    switch (type) {
      case 'buy': M.questProgress(s, 'buy', d.n); xp('buy', Math.min(10, d.n)); break;
      case 'upgrade': M.questProgress(s, 'upgrade', 1); M.addPoints(s, 'upgrade'); xp('upgrade'); break;
      case 'milestone':
        msQueue.push(d);
        if (msQueue.length === 1) setTimeout(flushMs, 60);
        M.questProgress(s, 'milestone', d.count);
        M.addPoints(s, 'milestone', d.count);
        xp('milestone', d.count);
        break;
      case 'colony': A.play('milestone'); UI.toast('hive', t('colony_toast', { n: d.level }), { ok: true }); break;
      case 'power': M.addPoints(s, 'power', Math.min(5, d.count)); xp('power', Math.min(5, d.count)); break;
      case 'tap': M.questProgress(s, 'tap', 1); M.questProgress(s, 'combo', d.combo, true); break;
      case 'lucky': M.questProgress(s, 'lucky', 1); M.addPoints(s, 'lucky'); xp('lucky'); break;
      case 'ticketBee': M.questProgress(s, 'ticketbee', 1); M.addPoints(s, 'ticket'); xp('ticket'); break;
      case 'swarm': M.questProgress(s, 'swarm', 1); M.addPoints(s, 'swarm'); xp('swarm'); break;
      case 'achievement':
        M.addPoints(s, 'achievement');
        xp('achievement');
        UI.dirty('trophies');
        achQueue.push(d);
        if (achQueue.length === 1) setTimeout(flushAch, 60);
        break;
      case 'runAchievement':
        UI.dirty('trophies');
        achQueue.push(Object.assign({ run: true }, d));
        if (achQueue.length === 1) setTimeout(flushAch, 60);
        break;
      case 'luckySpawn': Scene.spawnLucky(d.t); A.play('luckySpawn'); break;
      case 'luckyGone': Scene.removeLucky(false); break;
      case 'ticketSpawn': Scene.spawnLucky(d.t, 'ticket'); break;
      case 'ticketGone': Scene.removeLucky(false, 'ticket'); break;
      case 'buffEnd':
        if (d.id !== 'rush' && d.id !== 'frenzy') UI.toast('clock', t('boost_end', { n: d.id === 'dance' ? t('shop_free') : t('ad_boost') }));
        break;
    }
  }

  const msQueue = [];
  function flushMs() {
    const list = msQueue.splice(0);
    if (!list.length) return;
    A.play('milestone');
    if (list.length === 1) UI.toast('star', t('milestone_toast', { p: n(BZ.PRODUCERS.find(p => p.id === list[0].pid).name), n: list[0].at }), { ok: true });
    else UI.toast('star', t('milestones_n', { n: list.reduce((a, x) => a + x.count, 0) }), { ok: true });
  }
  const achQueue = [];
  function flushAch() {
    const list = achQueue.splice(0);
    if (!list.length) return;
    A.play('achievement');
    const sum = { egg: 0, royal: 0, core: 0 };
    list.forEach(a => { if (a.reward) for (const k in a.reward) sum[k] += a.reward[k]; });
    const got = Object.keys(sum).filter(k => sum[k]).map(k => ({ k, v: sum[k] }));
    const first = list[0];
    const txt = list.length === 1 ? (first.run ? t('goal_done', { n: UI.achText(first) }) : t('achievement_toast', { n: UI.achText(first) })) : t('trophies_n', { n: list.length });
    UI.toast('trophy', txt + (got.length ? '  ' + UI.gotText(got) : ''), { ok: true });
  }

  function onLucky(x, y, kind) {
    const s = G.main;
    if (kind === 'ticket') {
      if (!s.ticketOn) return;
      const r = E.catchTicket(s);
      Scene.removeLucky(true, 'ticket');
      A.play('lucky');
      vibrate([10, 20]);
      const got = Object.keys(r).map(k => ({ k, v: r[k] }));
      Scene.centerText(t('tbee'));
      UI.toast('ticket', t('tbee') + '  ' + UI.gotText(got), { ok: true });
      UI.dirty('bees');
      return;
    }
    if (!s.luckyOn) return;
    const res = E.catchLucky(s, null);
    Scene.removeLucky(true);
    A.play('lucky');
    vibrate([10, 30, 10]);
    Scene.centerText(t('lucky_' + res.id));
    if (res.id === 'storm') Scene.storm(res.drops, res.dur);
    UI.toast(({ rush: 'bolt', harvest: 'drop', frenzy: 'tap', ticket: 'ticket', storm: 'drop', chest: 'gift' })[res.id], luckyText(res), { ok: true });
    if (res.id === 'chest') setTimeout(() => afterGot(P.grant(s, { part: 1, egg: 1 })), 500);
    else if (Math.random() < BZ.DROP.part) setTimeout(() => afterGot(P.grant(s, { part: 1 })), 600);
    if (Math.random() < BZ.DROP.lucky) setTimeout(() => giveBee(0), 700);
  }

  function showOffline(res) {
    if (res.earned < 1 || res.secs < 60) return;
    const s = G.main;
    const html = UI.hero('drop', t('welcome'), '+' + F.num(res.earned), t('away', { t: F.time(res.secs) }) + '<br>' + t('away_earned') + (res.capped ? '<br><small class="faint">' + t('away_capped', { t: F.time(E.offlineCap(s)) }) + '</small>' : ''),
      (UI.adsOn('offline') ? '<button class="btn btn-secondary" id="mAd">' + BZ.icon('play') + t('collect_ad') + '</button>' : '') + '<button class="btn btn-primary" data-close>' + t('collect') + '</button>');
    UI.modal(html, true, {
      '#mAd': () => {
        UI.closeModal();
        UI.showAd('offline').then(ok => { if (ok) { E.gainHoney(s, res.earned); A.play('lucky'); UI.toast('drop', '+' + F.num(res.earned), { ok: true }); G.save(); } });
      }
    });
    if (res.secs >= 3600) {
      const found = Math.min(4, Math.floor(res.secs / 7200));
      if (found > 0) { E.addTickets(s, { egg: found }); setTimeout(() => UI.toast('ticket', t('r_egg', { v: found }), { ok: true }), 900); }
    }
  }

  G.cloudSignIn = function () { if (BZ.Cloud) BZ.Cloud.signIn().then(() => { bootLastSave = 0; G.cloudSync(true, true); UI.render(); }).catch(e => { Log.error('cloud sign in: ' + (e && e.message || e)); UI.toast('info', t('cloud_err'), { nova: 'oops' }); UI.render(); }); };
  G.cloudSignOut = function () { if (BZ.Cloud) BZ.Cloud.signOut().then(() => UI.render()); };
  G.online = function () { if (BZ.Online && BZ.Cloud.signedIn()) BZ.Online.sync(G.main).then(ok => { if (ok) { UI.dirty('league'); G.save(); } }); };
  let bootLastSave = 0;
  G.cloudSync = function (manual, firstPull) {
    const C = BZ.Cloud;
    if (!C || !C.signedIn()) return;
    const push = () => {
      G.main.lastSave = Date.now();
      G.main.cloud.at = Date.now();
      C.push(BZ.Store.serialize(G.main)).then(() => { if (manual) UI.toast('upload', t('cloud_saved'), { ok: true }); UI.dirty('settings'); G.online(); })
        .catch(e => { Log.error('cloud push: ' + (e && e.message || e)); if (manual) UI.toast('info', t('cloud_err'), { nova: 'oops' }); });
    };
    if (!firstPull) { push(); return; }
    const localAt = bootLastSave || G.main.lastSave || 0;
    C.pull().then(remote => {
      const s = G.main;
      const differs = remote && remote.owned && ((remote.lastSave || 0) > localAt + 1000 || (remote.lifetime || 0) > s.lifetime * 1.01 || (remote.level || 1) > s.level);
      if (!differs) { push(); return; }
      UI.modal('<h4>' + t('cloud_pick') + '</h4><p>' + t('cloud_pick_d') + '</p><div class="kv"><span>Google Drive</span><span>' + t('lvl', { n: remote.level || 1 }) + '  ·  ' + F.num(remote.lifetime || 0) + '</span></div><div class="kv"><span>' + t('cloud_keep') + '</span><span>' + t('lvl', { n: s.level }) + '  ·  ' + F.num(s.lifetime) + '</span></div><div class="row"><button class="btn btn-ghost" id="cKeep">' + t('cloud_keep') + '</button><button class="btn btn-primary" id="cUse">' + t('cloud_use') + '</button></div>', false, {
        '#cKeep': () => { UI.closeModal(); push(); },
        '#cUse': () => { UI.closeModal(); remote.cloud = Object.assign({}, remote.cloud, { at: Date.now() }); G.loadState(remote); G.save(); UI.toast('upload', t('cloud_loaded'), { ok: true }); }
      });
    }).catch(e => { Log.error('cloud pull: ' + (e && e.message || e)); if (manual) UI.toast('info', t('cloud_err'), { nova: 'oops' }); });
  };

  function loop(now) {
    requestAnimationFrame(loop);
    let dt = (now - lastFrame) / 1000;
    lastFrame = now;
    if (!(dt > 0)) return;
    if (dt > 1) dt = 1;
    step(dt, now);
  }
  G.debugStep = function (secs, fps) {
    const d = 1 / (fps || 30);
    for (let x = 0; x < secs; x += d) step(d, performance.now() + x * 1000);
  };

  function step(dt, now) {
    const s = G.main;
    E.tick(s, dt);
    Scene.frame(dt, s);
    UI.frame(now);
    achAcc += dt;
    if (achAcc >= 1) {
      achAcc = 0;
      E.checkAchievements(s);
      const life = s.lifetime;
      if (lastLifetime) M.questProgress(s, 'earn', Math.max(0, life - lastLifetime));
      lastLifetime = life;
      if (M.questGen(s)) UI.dirty('daily');
      if (M.quickGen(s)) UI.dirty('daily');
      const fl = P.flagCheck(s);
      if (fl) { A.play('milestone'); UI.toast('info', t('unlocked_tab', { p: t('tab_' + fl) }), { ok: true, long: true }); UI.buildChrome(); }
      if (s.league.rkPending && !UI.modalOpen()) { const p = s.league.rkPending; s.league.rkPending = null; A.play('achievement'); UI.showRankResult(p); G.save(); }
      if (s.league.pending && !UI.modalOpen()) { const p = s.league.pending; s.league.pending = null; A.play(p.move > 0 ? 'milestone' : 'achievement'); UI.showLeagueResult(p); G.save(); }
      if (P.blessCheck(s)) { A.play('luckySpawn'); if (!UI.modalOpen()) UI.showBless(); else UI.toast('sparkle', t('bless_pending'), { ok: true }); }
    }
    minuteAcc += dt;
    if (minuteAcc >= 60) {
      minuteAcc = 0;
      M.addPoints(s, 'minute');
      if (Math.random() < BZ.DROP.ticketMin) { E.addTickets(s, { egg: 1 }); UI.toast('ticket', t('found_ticket'), { ok: true }); }
    }
    saveTimer += dt;
    if (saveTimer >= 15) { saveTimer = 0; G.save(); }
    cloudAcc += dt;
    if (cloudAcc >= 180) { cloudAcc = 0; G.cloudSync(false); }
  }

  function setLoad(p, label) {
    const bar = document.querySelector('#splash .bar i');
    if (bar) bar.style.width = Math.round(p * 100) + '%';
    const lb = document.getElementById('loadLabel');
    if (lb && label) lb.textContent = label;
  }

  async function boot() {
    try {
      setLoad(0.15);
      await BZ.Store.init();
      const st = await BZ.Store.load('settings');
      if (st) Object.assign(G.settings, st);
      if (!G.settings.lang) G.settings.lang = (navigator.language || 'en').toLowerCase().startsWith('fr') ? 'fr' : 'en';
      applySettings();
      setLoad(0.35, t('loading'));
      UI.init(G);
      UI.initExt(G);
      Scene.init(document.getElementById('scene'), {
        tap: (x, y) => G.tapAt(x, y),
        lucky: onLucky,
        drop: () => { const v = E.stormDrop(G.main); A.play('tap', 100); vibrate(5); return '+' + F.num(v); },
        unlock: () => A.unlock()
      });
      E.on(onEvent);
      setLoad(0.55);
      const saved = await BZ.Store.load('save');
      let offline = null;
      if (saved && saved.owned) {
        bootLastSave = saved.lastSave || 0;
        G.main = migrate(saved);
        const away = (Date.now() - (saved.lastSave || Date.now())) / 1000;
        if (away > 30) offline = E.offline(G.main, away);
        Log.info('save loaded, away ' + Math.round(away) + ' s');
      } else {
        G.main = migrate(E.newState(0));
        tutorialStep = 1;
        Log.info('new game');
      }
      lastLifetime = G.main.lifetime;
      G.refreshScene();
      M.questGen(G.main);
      M.quickGen(G.main);
      E.checkAchievements(G.main);
      setLoad(0.8);
      UI.render();
      if (tutorialStep === 1) UI.hint(t('tutorial_1'));
      if (root.matchMedia) root.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', applyTheme);
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) { G.save(true); A.suspend(); }
        else {
          A.resume();
          const away = (Date.now() - (G.main.lastSave || Date.now())) / 1000;
          if (away > 30) { const r = E.offline(G.main, away); G.main.lastSave = Date.now(); showOffline(r); }
        }
      });
      root.addEventListener('pagehide', () => G.save(true));
      if (BZ.Store.server) setInterval(() => { fetch('/api/ping').catch(() => {}); }, 60000);
      document.addEventListener('pointerdown', () => A.unlock(), { once: true });
      if (BZ.Cloud && BZ.Cloud.configured()) {
        BZ.Cloud.onChange = () => { UI.dirty('settings'); UI.dirty('league'); };
        BZ.Cloud.init().then(ok => { if (ok && BZ.Cloud.signedIn()) G.cloudSync(false, true); UI.dirty('settings'); UI.dirty('league'); }).catch(e => Log.error('cloud init: ' + (e && e.message || e)));
      }
      await (document.fonts && document.fonts.ready ? Promise.race([document.fonts.ready, new Promise(r => setTimeout(r, 2500))]) : Promise.resolve());
      setLoad(1);
      lastFrame = performance.now();
      requestAnimationFrame(loop);
      G.save();
      UI.splashReady(() => {
        A.unlock();
        if (offline) showOffline(offline);
      });
    } catch (e) {
      Log.error('boot failed: ' + (e && e.stack || e));
      document.getElementById('powered').innerHTML = UI.fox ? UI.fox('oops') + 'Something went wrong. Check the logs.' : 'Error';
    }
  }

  root.addEventListener('error', e => Log.error((e.message || 'error') + ' at ' + (e.filename || '') + ':' + (e.lineno || '')));
  root.addEventListener('unhandledrejection', e => Log.error('promise: ' + (e.reason && e.reason.message || e.reason)));
  boot();
})(window);
