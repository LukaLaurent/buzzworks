(function (root) {
  const BZ = root.BZ = root.BZ || {};
  const cfg = (BZ.CONFIG && BZ.CONFIG.adsense) || {};
  if (!cfg.client || root.BZ_ADS) return;

  let ready = false, blocked = false, coolUntil = 0;
  const changed = () => { if (BZ.UI && BZ.UI.dirty) BZ.UI.dirty(); };

  const el = document.createElement('script');
  el.async = true;
  el.crossOrigin = 'anonymous';
  el.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=' + encodeURIComponent(cfg.client);
  el.setAttribute('data-ad-client', cfg.client);
  if (cfg.test) el.setAttribute('data-adbreak-test', 'on');
  el.onerror = () => { blocked = true; changed(); };
  document.head.appendChild(el);

  root.adsbygoogle = root.adsbygoogle || [];
  const push = o => root.adsbygoogle.push(o);
  push({ preloadAdBreaks: 'on', sound: 'on', onReady: () => { ready = true; changed(); } });

  root.BZ_ADS = {
    available: () => ready && !blocked && Date.now() >= coolUntil,
    show(place) {
      return new Promise(resolve => {
        if (!root.BZ_ADS.available()) { resolve(false); return; }
        let rewarded = false, done = false, started = false;
        const finish = ok => { if (done) return; done = true; resolve(ok); };
        const fail = () => { coolUntil = Date.now() + 120000; changed(); finish(false); };
        push({
          type: 'reward',
          name: 'bz_' + place,
          beforeAd: () => { started = true; if (BZ.Audio) BZ.Audio.suspend(); },
          afterAd: () => { if (BZ.Audio) BZ.Audio.resume(); },
          beforeReward: showAdFn => { started = true; showAdFn(); },
          adDismissed: () => finish(false),
          adViewed: () => { rewarded = true; finish(true); },
          adBreakDone: info => {
            const st = info && info.breakStatus;
            if (rewarded) finish(true);
            else if (st === 'dismissed') finish(false);
            else fail();
          }
        });
        setTimeout(() => { if (!started) fail(); }, 5000);
      });
    }
  };
})(typeof window !== 'undefined' ? window : globalThis);
