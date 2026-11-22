(function (root) {
  const BZ = root.BZ = root.BZ || {};
  const cfg = (BZ.CONFIG && BZ.CONFIG.adsense) || {};
  if (!cfg.client || root.BZ_ADS) return;

  const el = document.createElement('script');
  el.async = true;
  el.crossOrigin = 'anonymous';
  el.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=' + encodeURIComponent(cfg.client);
  el.setAttribute('data-ad-client', cfg.client);
  if (cfg.test) el.setAttribute('data-adbreak-test', 'on');
  document.head.appendChild(el);

  root.adsbygoogle = root.adsbygoogle || [];
  const push = o => root.adsbygoogle.push(o);
  push({ preloadAdBreaks: 'on', sound: 'on' });

  root.BZ_ADS = {
    show(place) {
      return new Promise(resolve => {
        let rewarded = false, done = false, started = false;
        const finish = ok => { if (done) return; done = true; resolve(ok); };
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
            else finish('none');
          }
        });
        setTimeout(() => { if (!started) finish('none'); }, 5000);
        setTimeout(() => finish(rewarded ? true : 'none'), 120000);
      });
    }
  };
})(typeof window !== 'undefined' ? window : globalThis);
