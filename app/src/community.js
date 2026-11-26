(function (root) {
  const BZ = root.BZ;
  const F = BZ.F, UI = BZ.UI, t = BZ.t, ic = BZ.icon;
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  BZ.addStrings({
    cm_title: 'Community chat', cm_d: 'Talk with every Buzzworks player. Be kind: insults, spam and personal details lead to a ban.',
    cm_ph: 'Write a message', cm_send: 'Send', cm_empty: 'No message yet. Say hello!', cm_wait: 'Wait a few seconds before sending again',
    cm_signin: 'Sign in with Google to chat with the other players.', cm_del: 'Delete', cm_err: 'The message could not be sent', cm_you: 'You',
    cm_link: 'Links are not allowed in the chat', cm_contact: 'For your safety, do not share contact details or social accounts', cm_bad: 'This message was blocked by the filter', cm_short: 'Write a real message first', cm_dup: 'You already sent this message', cm_flood: 'Slow down a little, you are sending too many messages'
  }, {
    cm_title: 'Discussion de la communauté', cm_d: 'Discutez avec tous les joueurs de Buzzworks. Restez aimable : insultes, spam et informations personnelles mènent au bannissement.',
    cm_ph: 'Écrire un message', cm_send: 'Envoyer', cm_empty: 'Aucun message pour l’instant. Dites bonjour !', cm_wait: 'Attendez quelques secondes avant de renvoyer un message',
    cm_signin: 'Connectez-vous avec Google pour discuter avec les autres joueurs.', cm_del: 'Supprimer', cm_err: 'Le message n’a pas pu être envoyé', cm_you: 'Vous',
    cm_link: 'Les liens sont interdits dans la discussion', cm_contact: 'Pour votre sécurité, ne partagez pas de coordonnées ni de comptes de réseaux sociaux', cm_bad: 'Ce message a été bloqué par le filtre', cm_short: 'Écrivez d’abord un vrai message', cm_dup: 'Vous avez déjà envoyé ce message', cm_flood: 'Doucement, vous envoyez trop de messages'
  });

  const SEEN = 'buzzworks.chatSeen', GAP = 5000, MAX = 200;
  const CF = BZ.ChatFilter;
  const Cm = BZ.Community = { msgs: [], unsub: null, uid: '', lastSend: 0, admin: false, seen: 0 };
  try { Cm.seen = +localStorage.getItem(SEEN) || 0; } catch (e) {}
  const cloudOk = () => !!(BZ.Cloud && BZ.Cloud.configured() && BZ.Cloud.signedIn());
  const real = () => BZ.Game.realMain();

  function markSeen() {
    const last = Cm.msgs.length ? Cm.msgs[Cm.msgs.length - 1].at : 0;
    if (last > Cm.seen) { Cm.seen = last; try { localStorage.setItem(SEEN, String(last)); } catch (e) {} }
  }
  Cm.dot = () => cloudOk() && Cm.msgs.some(m => m.at > Cm.seen && m.uid !== BZ.Cloud.uid());

  function listen() {
    const s = real();
    const uid = cloudOk() && s && BZ.P.unlocked(s, 'community') ? BZ.Cloud.uid() : '';
    if (uid === Cm.uid) return;
    if (Cm.unsub) { Cm.unsub(); Cm.unsub = null; }
    Cm.uid = uid; Cm.msgs = []; Cm.admin = false;
    if (!uid) return;
    try { Cm.unsub = BZ.Cloud.chat.listen(list => { Cm.msgs = list; draw(); }); } catch (e) { if (BZ.Log) BZ.Log.error('chat listen: ' + e.message); }
    BZ.Cloud.isAdmin().then(v => { Cm.admin = v; draw(); }).catch(() => {});
  }

  function time(ms) {
    const d = new Date(ms), p = x => String(x).padStart(2, '0');
    const today = new Date().toDateString() === d.toDateString();
    return (today ? '' : p(d.getDate()) + '/' + p(d.getMonth() + 1) + ' ') + p(d.getHours()) + ':' + p(d.getMinutes());
  }
  function listHtml() {
    if (!Cm.msgs.length) return '<div class="empty-line ch-empty">' + t('cm_empty') + '</div>';
    const me = BZ.Cloud.uid();
    let prev = '';
    return Cm.msgs.map(m => {
      const mine = m.uid === me;
      const same = prev === m.uid;
      prev = m.uid;
      const lv = Math.max(1, Math.min(99999, Math.floor(+m.l || 1)));
      return '<div class="ch-msg' + (mine ? ' me' : '') + (same ? ' cont' : '') + '">' + (same ? '' : '<div class="ch-head"><b>' + esc(mine ? t('cm_you') : CF.name(m.n)) + '</b><span class="ch-lv">' + t('lvl', { n: lv }) + '</span><small>' + time(+m.at || Date.now()) + '</small></div>') +
        '<div class="ch-bub"><span>' + esc(CF.display(m.txt)) + '</span>' + (Cm.admin || mine ? '<button class="ch-del" data-cm="del" data-id="' + esc(m.id) + '" title="' + t('cm_del') + '">' + ic('trash') + '</button>' : '') + '</div></div>';
    }).join('');
  }
  function draw() {
    if (UI.page() !== 'community') return;
    const box = document.getElementById('chList');
    if (!box) { UI.dirty('community'); return; }
    const near = box.scrollHeight - box.scrollTop - box.clientHeight < 80;
    const html = listHtml();
    if (box._h !== html) { box._h = html; box.innerHTML = html; if (near || !box._init) { box.scrollTop = box.scrollHeight; box._init = 1; } }
    markSeen();
  }

  UI.ext.community = function () {
    let h = UI.title(t('tab_community'), '');
    if (!cloudOk()) return h + '<div class="card lg-cta"><div class="lg-cta-pic">' + ic('chat') + '</div><p>' + t('cm_signin') + '</p><button class="btn btn-primary btn-lg g-btn" data-act="cloudin">' + ic('user') + t('cloud_signin') + '</button></div>';
    if (BZ.Online && BZ.Online.banned) return h + '<div class="card lg-cta"><div class="lg-cta-pic">' + ic('lock') + '</div><p>' + t('lg_banned') + '</p></div>';
    listen();
    setTimeout(draw, 0);
    return h + '<div class="card ch-card"><div class="ch-top"><span class="ch-ic">' + ic('chat') + '</span><div><h3>' + t('cm_title') + '</h3><small>' + t('cm_d') + '</small></div></div><div class="ch-list" id="chList">' + listHtml() + '</div><form class="ch-form" id="chForm" autocomplete="off"><input id="chIn" maxlength="' + MAX + '" placeholder="' + esc(t('cm_ph')) + '"><button class="btn btn-primary" type="submit">' + ic('play') + '<span>' + t('cm_send') + '</span></button></form></div>';
  };

  async function send() {
    const inp = document.getElementById('chIn');
    if (!inp || !cloudOk()) return;
    const raw = inp.value;
    if (!raw.trim()) return;
    const now = Date.now();
    if (now - Cm.lastSend < GAP) return UI.toast('chat', t('cm_wait'));
    Cm.sent = (Cm.sent || []).filter(x => now - x.at < 60000);
    if (Cm.sent.length >= 6) return UI.toast('chat', t('cm_flood'));
    const r = CF.check(raw, MAX);
    if (r.err) return UI.toast('chat', t(r.err));
    const key = r.txt.toLowerCase().replace(/[^\p{L}\p{N}]/gu, '');
    if (Cm.sent.some(x => x.key === key && now - x.at < 60000)) return UI.toast('chat', t('cm_dup'));
    Cm.lastSend = now;
    Cm.sent.push({ key, at: now });
    const s = real();
    const nm = CF.name(BZ.Online.name(s)).replace(/\*+/g, '').trim() || 'Player';
    inp.value = '';
    try { await BZ.Cloud.chat.send(r.txt, nm.slice(0, 18), Math.max(1, Math.min(99999, Math.floor(s.level || 1)))); BZ.Audio.play('click'); }
    catch (e) { inp.value = raw; Cm.lastSend = 0; UI.toast('info', t('cm_err')); if (BZ.Log) BZ.Log.error('chat send: ' + e.message); }
  }

  document.addEventListener('submit', e => { if (e.target && e.target.id === 'chForm') { e.preventDefault(); send(); } });
  document.addEventListener('click', e => {
    const el = e.target.closest('[data-cm]');
    if (!el) return;
    e.stopPropagation();
    if (el.dataset.cm === 'del') BZ.Cloud.chat.remove(el.dataset.id).catch(err => UI.toast('info', err.message));
  });

  Cm.init = function () {
    if (Cm.ready) return;
    Cm.ready = true;
    setInterval(listen, 3000);
  };
})(window);
