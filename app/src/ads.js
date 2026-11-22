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
        let rewarded = false, done = false;
        const finish = ok => { if (done) return; done = true; resolve(ok); };
        push({
          type: 'reward',
          name: 'bz_' + place,
          beforeAd: () => { if (BZ.Audio) BZ.Audio.suspend(); },
          afterAd: () => { if (BZ.Audio) BZ.Audio.resume(); },
          beforeReward: showAdFn => showAdFn(),
          adDismissed: () => finish(false),
          adViewed: () => { rewarded = true; finish(true); },
          adBreakDone: info => {
            if (!rewarded && info && info.breakStatus !== 'viewed' && info.breakStatus !== 'dismissed' && BZ.UI) BZ.UI.toast('ad', BZ.t('ad_unavailable'));
            finish(rewarded);
          }
        });
        setTimeout(() => finish(rewarded), 120000);
      });
    }
  };
})(typeof window !== 'undefined' ? window : globalThis);
