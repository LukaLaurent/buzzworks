(function (root) {
  const BZ = root.BZ = root.BZ || {};
  const cfg = BZ.CONFIG || {};
  if (cfg.platform !== 'crazygames') return;

  let SDK = null, on = false, adsOff = !cfg.cgAds, adblock = false, muted = false, playing = false;
  const log = m => { if (BZ.Log) BZ.Log.info('crazygames: ' + m); };
  const call = (fn) => { if (!on) return; try { fn(); } catch (e) { log(String(e && e.message || e)); } };

  function applyMute() {
    const A = BZ.Audio;
    if (!A) return;
    const G = BZ.Game;
    if (muted) A.setMusic(false);
    else if (G && G.settings) A.setMusic(!!G.settings.music);
  }

  BZ.Platform = {
    name: 'crazygames',
    locale: '',
    async init() {
      SDK = root.CrazyGames && root.CrazyGames.SDK;
      if (!SDK) { log('sdk missing'); return; }
      try { await SDK.init(); } catch (e) { log('init failed ' + (e && e.message || e)); return; }
      if (SDK.environment === 'disabled') { log('disabled environment'); return; }
      on = true;
      call(() => SDK.game.loadingStart());
      try { BZ.Platform.locale = (SDK.user && SDK.user.systemInfo && SDK.user.systemInfo.locale) || ''; } catch (e) {}
      try {
        const data = SDK.data;
        const keys = ['buzzworks.save', 'buzzworks.settings'];
        keys.forEach(k => {
          if (data.getItem(k) === null) {
            let v = null;
            try { v = localStorage.getItem(k); } catch (e) {}
            if (v) data.setItem(k, v);
          }
        });
        BZ.Store.kv = data;
      } catch (e) { log('data module unavailable'); }
      try { muted = !!(SDK.game.settings && SDK.game.settings.muteAudio); } catch (e) {}
      call(() => SDK.game.addSettingsChangeListener(st => { muted = !!st.muteAudio; applyMute(); }));
      if (!adsOff) {
        try { adblock = await SDK.ad.hasAdblock(); } catch (e) {}
      }
      const A = BZ.Audio;
      if (A) {
        const play = A.play;
        A.play = function () { if (muted) return; return play.apply(A, arguments); };
        const setMusic = A.setMusic;
        A.setMusic = function (v) { return setMusic.call(A, muted ? false : v); };
      }
      if (BZ.E) BZ.E.on((s, type) => {
        if (s !== (BZ.Game && BZ.Game.main)) return;
        if (type === 'coronation') call(() => SDK.game.happytime());
      });
    },
    loaded() { call(() => SDK.game.loadingStop()); },
    play() { applyMute(); BZ.Platform.gameplay(true); },
    gameplay(v) {
      if (!on || v === playing) return;
      playing = v;
      call(() => v ? SDK.game.gameplayStart() : SDK.game.gameplayStop());
    }
  };

  root.BZ_ADS = {
    available: () => on && !adsOff && !adblock,
    show() {
      return new Promise(resolve => {
        if (!root.BZ_ADS.available()) { resolve(false); return; }
        let done = false;
        const finish = ok => {
          if (done) return;
          done = true;
          if (BZ.Audio) BZ.Audio.resume();
          if (BZ.UI) BZ.UI.closeModal();
          BZ.Platform.gameplay(true);
          resolve(ok);
        };
        if (BZ.UI) BZ.UI.modal('<div class="hero"><div class="pic">' + BZ.icon('ad') + '</div><h4>' + BZ.t('ad_title_cg') + '</h4></div>', false);
        try {
          SDK.ad.requestAd('rewarded', {
            adStarted: () => { BZ.Platform.gameplay(false); if (BZ.Audio) BZ.Audio.suspend(); },
            adFinished: () => finish(true),
            adError: err => {
              const code = err && err.code;
              if (code === 'adsDisabled') adsOff = true;
              if (code === 'adblock') adblock = true;
              log('ad error ' + code);
              finish(false);
            }
          });
        } catch (e) { finish(false); }
      });
    }
  };

  if (BZ.addStrings) BZ.addStrings({ ad_title_cg: 'Loading ad' }, { ad_title_cg: 'Chargement de la pub' });
})(typeof window !== 'undefined' ? window : globalThis);
