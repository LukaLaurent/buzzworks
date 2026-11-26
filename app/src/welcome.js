(function (root) {
  const BZ = root.BZ;
  const UI = BZ.UI, P = BZ.P, M = BZ.Meta, t = BZ.t, n = BZ.n, ic = BZ.icon;
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  BZ.addStrings({
    wl_title: 'Daily gift', wl_d: 'Welcome back! Day {n} in a row. Pick one of the boxes.', wl_d1: 'Welcome back! Pick one of the boxes.',
    wl_base: 'Bonus for coming back', wl_pick: 'Pick a box', wl_got: 'Your gift', wl_miss: 'In the other boxes', wl_ok: 'Collect', wl_streak: 'Come back tomorrow for a bigger bonus!'
  }, {
    wl_title: 'Cadeau du jour', wl_d: 'Bon retour ! Jour {n} d’affilée. Choisissez une des boîtes.', wl_d1: 'Bon retour ! Choisissez une des boîtes.',
    wl_base: 'Bonus de retour', wl_pick: 'Choisissez une boîte', wl_got: 'Votre cadeau', wl_miss: 'Dans les autres boîtes', wl_ok: 'Récupérer', wl_streak: 'Revenez demain pour un bonus plus grand !'
  });

  const W = BZ.Welcome = {};
  W.POOL = [
    { r: { boost: 'x4' }, w: 16 }, { r: { boost: 'xp2' }, w: 14 }, { r: { boost: 'luck' }, w: 12 }, { r: { boost: 'lg2' }, w: 10 }, { r: { boost: 'stone' }, w: 8 },
    { r: { royal: 2 }, w: 10 }, { r: { core: 3 }, w: 12 }, { r: { egg: 15 }, w: 14 }, { r: { mystic: 1 }, w: 2 }
  ];
  const COLORS = ['#F28C28', '#527C82', '#8E6AC8'];

  function pick3(rnd) {
    const out = [], pool = W.POOL.slice();
    while (out.length < 3 && pool.length) {
      const tot = pool.reduce((a, x) => a + x.w, 0);
      let v = rnd() * tot, i = 0;
      for (; i < pool.length - 1; i++) { v -= pool[i].w; if (v <= 0) break; }
      out.push(pool.splice(i, 1)[0].r);
    }
    if (!out.some(r => r.boost)) out[2] = { boost: 'x4' };
    return out;
  }
  W.base = streak => ({ egg: 3 + Math.min(7, streak) });

  W.check = function () {
    const g = BZ.Game;
    if (!g || !g.main || g.battle) return;
    const s = g.realMain();
    const day = M.dayKey();
    const f = s.flags;
    if (f.loginDay === day || (s.level || 1) < 2) return;
    if (UI.modalOpen()) { setTimeout(W.check, 4000); return; }
    if (!f.loginOffer || f.loginOffer.day !== day) {
      const y = new Date(); y.setDate(y.getDate() - 1);
      const streak = f.loginDay === M.dayKey(y) ? (f.loginStreak || 1) + 1 : 1;
      f.loginOffer = { day, streak, opts: pick3(Math.random) };
      g.save();
    }
    show(s, f.loginOffer);
  };

  function boxHtml(i) {
    return '<button class="wl-box" data-wl="' + i + '" style="--wc:' + COLORS[i] + ';animation-delay:' + (i * 120) + 'ms"><span class="wl-lid"></span><span class="wl-body">' + ic('gift') + '</span><span class="wl-rib"></span></button>';
  }
  function show(s, off) {
    const base = W.base(off.streak);
    let h = '<div class="wl"><div class="wl-rays"></div><div class="hero"><h4>' + t('wl_title') + '</h4><p>' + esc(off.streak > 1 ? t('wl_d', { n: off.streak }) : t('wl_d1')) + '</p></div>';
    h += '<div class="wl-base"><small>' + t('wl_base') + '</small>' + UI.rewardChips(base) + '</div>';
    h += '<div class="wl-boxes">' + [0, 1, 2].map(boxHtml).join('') + '</div>';
    h += '<p class="wl-hint">' + t('wl_pick') + '</p><div class="row center"><button class="btn btn-primary off" id="wlOk">' + t('wl_ok') + '</button></div></div>';
    let done = false;
    UI.modal(h, false, { '#wlOk': () => { if (done) UI.closeModal(); } });
    BZ.Audio.play('luckySpawn');
    const m = document.querySelector('.wl');
    m.querySelectorAll('[data-wl]').forEach(b => {
      b.onclick = () => {
        if (done) return;
        done = true;
        const k = +b.dataset.wl;
        const f = s.flags;
        if (f.loginDay === off.day) return;
        f.loginDay = off.day;
        f.loginStreak = off.streak;
        const r = off.opts[k];
        P.grant(s, base);
        P.grant(s, r);
        delete f.loginOffer;
        BZ.Game.save();
        UI.structureChanged();
        m.classList.add('picked');
        m.querySelectorAll('[data-wl]').forEach((x, i) => {
          x.classList.add(i === k ? 'win' : 'miss');
          x.innerHTML += '<span class="wl-prize">' + UI.rewardChips(off.opts[i]) + '</span>';
        });
        m.querySelector('.wl-hint').textContent = t('wl_streak');
        m.querySelector('#wlOk').classList.remove('off');
        BZ.Audio.play(r.mystic ? 'swarm' : 'lucky');
      };
    });
  }
})(window);
