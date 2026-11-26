(function (root) {
  const BZ = root.BZ;
  const F = BZ.F, UI = BZ.UI, t = BZ.t, ic = BZ.icon;
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  BZ.addStrings({
    fb_btn: 'Bug or idea?', fb_card: 'Found a bug or have an idea?', fb_card_d: 'Tell me in a few words. Every message is read.', fb_title: 'Bug or idea?', fb_d: 'Tell me what went wrong or what you would love to see in Buzzworks.',
    fb_bug: 'Bug', fb_idea: 'Suggestion', fb_ph_bug: 'What happened? What were you doing just before?', fb_ph_idea: 'Describe your idea', fb_send: 'Send', fb_sent: 'Thank you! Your message was sent.',
    fb_wait: 'You can send another message in {t}', fb_short: 'Write at least 10 characters', fb_signin: 'Sign in with Google to send a message.', fb_err: 'The message could not be sent. Try again later.', fb_count: '{n} / {m}'
  }, {
    fb_btn: 'Bug ou idée ?', fb_card: 'Un bug ou une idée ?', fb_card_d: 'Dites-le en quelques mots. Chaque message est lu.', fb_title: 'Bug ou idée ?', fb_d: 'Dites-moi ce qui ne va pas ou ce que vous aimeriez voir dans Buzzworks.',
    fb_bug: 'Bug', fb_idea: 'Suggestion', fb_ph_bug: 'Que s’est-il passé ? Que faisiez-vous juste avant ?', fb_ph_idea: 'Décrivez votre idée', fb_send: 'Envoyer', fb_sent: 'Merci ! Votre message a bien été envoyé.',
    fb_wait: 'Vous pourrez renvoyer un message dans {t}', fb_short: 'Écrivez au moins 10 caractères', fb_signin: 'Connectez-vous avec Google pour envoyer un message.', fb_err: 'Le message n’a pas pu être envoyé. Réessayez plus tard.', fb_count: '{n} / {m}'
  });

  const GAP = 15 * 60000, MAX = 600, MIN = 10, KEY = 'buzzworks.fbLast';
  const Fb = BZ.Feedback = { kind: 'bug', busy: false };
  const C = () => BZ.Cloud;
  Fb.available = () => !!(C() && C().configured());
  Fb.last = function () {
    let a = 0;
    try { a = +localStorage.getItem(KEY) || 0; } catch (e) {}
    const s = BZ.Game && BZ.Game.realMain && BZ.Game.realMain();
    return Math.max(a, (s && s.flags && s.flags.fbLast) || 0);
  };
  Fb.left = () => Math.max(0, Fb.last() + GAP - Date.now());

  function body() {
    if (!C().signedIn()) return '<div class="hero"><div class="pic fb-pic">' + ic('info') + '</div><h4>' + t('fb_title') + '</h4><p>' + t('fb_signin') + '</p></div><div class="row"><button class="btn btn-ghost" data-close>' + t('cancel') + '</button><button class="btn btn-primary" data-fb="signin">' + ic('user') + t('cloud_signin') + '</button></div>';
    const left = Fb.left();
    let h = '<div class="fb"><div class="hero"><div class="pic fb-pic">' + ic(Fb.kind === 'bug' ? 'bug' : 'idea') + '</div><h4>' + t('fb_title') + '</h4><p>' + t('fb_d') + '</p></div>';
    h += '<div class="seg fb-seg"><button data-fb="kind" data-arg="bug" class="' + (Fb.kind === 'bug' ? 'on' : '') + '">' + ic('bug') + t('fb_bug') + '</button><button data-fb="kind" data-arg="idea" class="' + (Fb.kind === 'idea' ? 'on' : '') + '">' + ic('idea') + t('fb_idea') + '</button></div>';
    h += '<textarea id="fbTxt" class="fb-txt" maxlength="' + MAX + '" rows="5" placeholder="' + esc(t(Fb.kind === 'bug' ? 'fb_ph_bug' : 'fb_ph_idea')) + '"></textarea><small class="fb-count" id="fbCount">' + t('fb_count', { n: 0, m: MAX }) + '</small>';
    if (left > 0) h += '<p class="fb-wait">' + ic('clock') + esc(t('fb_wait', { t: F.time(left / 1000) })) + '</p>';
    h += '<div class="row"><button class="btn btn-ghost" data-close>' + t('cancel') + '</button><button class="btn btn-primary' + (left > 0 ? ' off' : '') + '" data-fb="send">' + ic('upload') + t('fb_send') + '</button></div></div>';
    return h;
  }
  Fb.open = function () {
    if (!Fb.available()) return;
    BZ.Audio.play('click');
    UI.modal(body(), true);
    const m = document.querySelector('#modal .modal');
    if (m) m.classList.add('fb-modal');
  };
  function redraw() {
    const m = document.querySelector('#modal .modal.fb-modal');
    if (!m) return;
    const ta = document.getElementById('fbTxt');
    const v = ta ? ta.value : '';
    m.innerHTML = body();
    const nt = document.getElementById('fbTxt');
    if (nt) { nt.value = v; count(); }
    m.querySelectorAll('[data-close]').forEach(b => { b.onclick = () => UI.closeModal(); });
  }
  function count() {
    const ta = document.getElementById('fbTxt'), c = document.getElementById('fbCount');
    if (ta && c) c.textContent = t('fb_count', { n: ta.value.length, m: MAX });
  }
  async function send() {
    if (Fb.busy) return;
    const ta = document.getElementById('fbTxt');
    if (!ta) return;
    if (Fb.left() > 0) return UI.toast('clock', t('fb_wait', { t: F.time(Fb.left() / 1000) }));
    const txt = (BZ.ChatFilter ? BZ.ChatFilter.base(ta.value) : ta.value.trim()).slice(0, MAX);
    if (txt.length < MIN) return UI.toast('info', t('fb_short'));
    const s = BZ.Game.realMain();
    const nm = (BZ.ChatFilter ? BZ.ChatFilter.name(BZ.Online.name(s)) : BZ.Online.name(s)).replace(/[*]+/g, '').trim().slice(0, 18) || 'Player';
    Fb.busy = true;
    try {
      await C().feedback.send({ kind: Fb.kind === 'idea' ? 'idea' : 'bug', txt, n: nm, l: Math.max(1, Math.min(99999, Math.floor(s.level || 1))), v: String(BZ.VERSION).slice(0, 12) });
      const now = Date.now();
      try { localStorage.setItem(KEY, String(now)); } catch (e) {}
      s.flags.fbLast = now;
      BZ.Game.save();
      UI.closeModal();
      BZ.Audio.play('lucky');
      UI.toast('check', t('fb_sent'), { ok: true, long: true });
      if (BZ.Log) BZ.Log.info('feedback sent (' + Fb.kind + ')');
    } catch (e) {
      UI.toast('info', t('fb_err'));
      if (BZ.Log) BZ.Log.error('feedback: ' + (e && e.message));
    } finally { Fb.busy = false; }
  }

  document.addEventListener('click', e => {
    const el = e.target.closest('[data-fb]');
    if (!el) return;
    e.stopPropagation();
    const a = el.dataset.fb;
    if (a === 'open') return Fb.open();
    if (a === 'kind') { Fb.kind = el.dataset.arg; BZ.Audio.play('click'); return redraw(); }
    if (a === 'send') return send();
    if (a === 'signin') { UI.closeModal(); return BZ.Game.cloudSignIn(); }
  });
  document.addEventListener('input', e => { if (e.target && e.target.id === 'fbTxt') count(); });
})(window);
