(function (root) {
  const BZ = root.BZ;
  const E = BZ.E, F = BZ.F, P = BZ.P, UI = BZ.UI, t = BZ.t, n = BZ.n, ic = BZ.icon;
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  BZ.addStrings({
    bt_seg: 'Battles', bt_title: 'Hive battles', bt_d: 'Challenge a player to a 15 minute duel in a fresh arena. Both of you bet the same stake, and whoever earns the most crowns takes everything. Bees, cores, skins, levels and essence give no bonus in the arena: only your skill counts.',
    bt_new: 'Challenge a player', bt_pick: 'Opponent', bt_search: 'Search a player by name', bt_group: 'From your league group', bt_none: 'No players found', bt_stake: 'Stake', bt_amount: 'Amount', bt_world: 'World', bt_type: 'Essence', bt_skin: 'Your skin',
    bt_send: 'Send the challenge', bt_have: 'You have {v}', bt_lack: 'You do not have enough for this stake', bt_needpick: 'Choose an opponent first',
    st_stone: 'Prime stones', st_royal: 'Royal tickets', st_core: 'Core tickets', st_ess: 'Essence', st_crowns: 'Crowns', st_skin: 'A skin each',
    bt_in: 'Challenges for you', bt_out: 'Your challenges', bt_live: 'Battle', bt_hist: 'Last battles', bt_empty: 'No battle yet. Send a challenge!',
    bt_vs: '{a} vs {b}', bt_wait: 'Waiting for {p} to accept', bt_expires: 'Expires in {t}', bt_cancel: 'Cancel', bt_accept: 'Accept', bt_decline: 'Decline',
    bt_starts: 'Starts in {t}', bt_left: '{t} left', bt_enter: 'Enter the arena', bt_you: 'You', bt_result_wait: 'Waiting for the final scores...',
    bt_won: 'Victory', bt_lost: 'Defeat', bt_tie: 'Tie', bt_won_d: 'You won {s}!', bt_lost_d: 'You lost {s}.', bt_tie_d: 'Same score: your stake comes back.',
    bt_pop_t: '{p} challenges you!', bt_pop_d: 'A 15 minute crown race. Stake for each player: {s}.', bt_see: 'See the challenge', bt_later: 'Later',
    bt_go_t: 'Battle against {p}', bt_go_d: 'The arena opens in a few seconds. Get as many crowns as you can in 15 minutes!', bt_over_t: 'Time is up!', bt_over_d: 'You earned {c} battle crowns. The result arrives in a minute.',
    bt_blocked: 'Not available during a battle', bt_declined: '{p} declined your challenge', bt_sent: 'Challenge sent to {p}', bt_skin_pick: 'Choose the skin you bet',
    bt_bar: 'vs {p}', bt_crowns: '{v} crowns'
  }, {
    bt_seg: 'Combats', bt_title: 'Combats de ruches', bt_d: 'Défiez un joueur en duel de 15 minutes dans une arène neuve. Vous misez tous les deux la même chose, et celui qui gagne le plus de couronnes remporte tout. Abeilles, noyaux, décors, niveaux et essence ne donnent aucun bonus dans l’arène : seul votre talent compte.',
    bt_new: 'Défier un joueur', bt_pick: 'Adversaire', bt_search: 'Chercher un joueur par son nom', bt_group: 'Dans votre groupe de ligue', bt_none: 'Aucun joueur trouvé', bt_stake: 'Mise', bt_amount: 'Quantité', bt_world: 'Monde', bt_type: 'Essence', bt_skin: 'Votre décor',
    bt_send: 'Envoyer le défi', bt_have: 'Vous avez {v}', bt_lack: 'Vous n’avez pas assez pour cette mise', bt_needpick: 'Choisissez d’abord un adversaire',
    st_stone: 'Pierres Prime', st_royal: 'Tickets royaux', st_core: 'Tickets de noyau', st_ess: 'Essence', st_crowns: 'Couronnes', st_skin: 'Un décor chacun',
    bt_in: 'Défis pour vous', bt_out: 'Vos défis', bt_live: 'Combat', bt_hist: 'Derniers combats', bt_empty: 'Aucun combat pour l’instant. Lancez un défi !',
    bt_vs: '{a} contre {b}', bt_wait: 'En attente de {p}', bt_expires: 'Expire dans {t}', bt_cancel: 'Annuler', bt_accept: 'Accepter', bt_decline: 'Refuser',
    bt_starts: 'Début dans {t}', bt_left: 'Encore {t}', bt_enter: 'Entrer dans l’arène', bt_you: 'Vous', bt_result_wait: 'En attente des scores finaux...',
    bt_won: 'Victoire', bt_lost: 'Défaite', bt_tie: 'Égalité', bt_won_d: 'Vous gagnez {s} !', bt_lost_d: 'Vous perdez {s}.', bt_tie_d: 'Même score : votre mise vous est rendue.',
    bt_pop_t: '{p} vous défie !', bt_pop_d: 'Une course aux couronnes de 15 minutes. Mise pour chaque joueur : {s}.', bt_see: 'Voir le défi', bt_later: 'Plus tard',
    bt_go_t: 'Combat contre {p}', bt_go_d: 'L’arène ouvre dans quelques secondes. Gagnez un maximum de couronnes en 15 minutes !', bt_over_t: 'Temps écoulé !', bt_over_d: 'Vous avez gagné {c} couronnes de combat. Le résultat arrive dans une minute.',
    bt_blocked: 'Indisponible pendant un combat', bt_declined: '{p} a refusé votre défi', bt_sent: 'Défi envoyé à {p}', bt_skin_pick: 'Choisissez le décor que vous misez',
    bt_bar: 'contre {p}', bt_crowns: '{v} couronnes'
  });

  const INVITE_MS = 3 * 60000, DELAY_MS = 30000, GRACE_MS = 60000, KEY = 'buzzworks.battle';
  const B = BZ.Battle = { docs: {}, unsub: null, uid: '', seen: {}, entering: null, lastPush: 0, form: { type: 'stone', n: 1, w: 0, skin: '', opp: null }, players: null };
  const G = () => BZ.Game;
  const real = () => G().realMain();
  const now = () => Date.now();
  const dur = () => BZ.BATTLE_MIN * 60000;

  B.TYPES = ['stone', 'royal', 'core', 'ess', 'crowns', 'skin'];
  B.skins = s => BZ.SKINS.filter(x => !x.world && x.id !== 'meadow' && s.skins && s.skins[x.id]);
  B.stakeText = function (st, skin) {
    if (st.type === 'stone') return F.int(st.n) + ' ' + t('st_stone').toLowerCase();
    if (st.type === 'royal' || st.type === 'core') return F.int(st.n) + ' ' + t('st_' + st.type).toLowerCase();
    if (st.type === 'ess') return F.int(st.n) + ' ' + P.essName(st.w);
    if (st.type === 'crowns') return F.int(st.n) + ' ' + P.crownName(st.w);
    if (st.type === 'skin') return skin && BZ.SKIN_BY_ID[skin] ? n(BZ.SKIN_BY_ID[skin].name) : t('st_skin').toLowerCase();
    return '';
  };
  B.have = function (s, st, skin) {
    if (st.type === 'stone') return s.primeStones || 0;
    if (st.type === 'royal' || st.type === 'core') return s.tickets[st.type] || 0;
    if (st.type === 'ess') return (s.ess || [])[st.w] || 0;
    if (st.type === 'crowns') { if (!s.worldsOpen.includes(st.w)) return 0; const w = P.worldState(s, st.w); return (w && w.crowns) || 0; }
    if (st.type === 'skin') return skin && s.skins[skin] && skin !== 'meadow' ? 1 : 0;
    return 0;
  };
  B.enough = (s, st, skin) => B.have(s, st, skin) >= (st.type === 'skin' ? 1 : st.n);
  function move(s, st, skin, sign) {
    if (st.type === 'stone') s.primeStones = Math.max(0, (s.primeStones || 0) + sign * st.n);
    else if (st.type === 'royal' || st.type === 'core') s.tickets[st.type] = Math.max(0, (s.tickets[st.type] || 0) + sign * st.n);
    else if (st.type === 'ess') s.ess[st.w] = Math.max(0, (s.ess[st.w] || 0) + sign * st.n);
    else if (st.type === 'crowns') {
      let w = P.worldState(s, st.w);
      if (!w && sign > 0 && s.worldsOpen.includes(st.w)) { s.otherWorlds[st.w] = P.strip(E.newState(st.w)); s.otherWorlds[st.w].world = st.w; w = s.otherWorlds[st.w]; }
      if (w) w.crowns = Math.max(0, (w.crowns || 0) + sign * st.n);
    } else if (st.type === 'skin' && skin) {
      if (sign < 0) { delete s.skins[skin]; if (s.skin === skin) s.skin = 'meadow'; }
      else if (s.skins[skin]) P.grant(s, { part: 3 });
      else s.skins[skin] = 1;
    }
    s._dirty = true;
  }
  function esc0(s) { s.battleEsc = s.battleEsc || {}; s.battleHist = s.battleHist || []; return s.battleEsc; }

  B.me = () => (BZ.Cloud && BZ.Cloud.uid()) || '';
  B.side = d => (d.a === B.me() ? 'a' : 'b');
  B.oppName = d => (B.side(d) === 'a' ? d.bn : d.an) || '?';
  B.myScore = d => d['s' + B.side(d)] || { c: 0, h: 0 };
  B.oppScore = d => d['s' + (B.side(d) === 'a' ? 'b' : 'a')] || { c: 0, h: 0 };
  B.list = () => Object.values(B.docs).sort((x, y) => (y.at || 0) - (x.at || 0));
  B.pendingInvites = () => B.list().filter(d => d.b === B.me() && d.status === 'invite' && now() < (d.at || 0) + INVITE_MS);

  B.listen = function () {
    const C = BZ.Cloud;
    const uid = C && C.signedIn() ? C.uid() : '';
    if (uid === B.uid) return;
    if (B.unsub) { B.unsub(); B.unsub = null; }
    B.uid = uid; B.docs = {};
    if (!uid || !C.battles) return;
    try { B.unsub = C.battles.listen(docs => { B.docs = docs; B.process(); }); } catch (e) { if (BZ.Log) BZ.Log.error('battle listen: ' + e.message); }
  };

  B.process = function () {
    const s = real();
    if (!s || !B.me()) return;
    const es = esc0(s);
    for (const d of B.list()) {
      const mine = es[d.id];
      const side = B.side(d);
      if (d.status === 'invite') {
        if (side === 'a' && now() > d.at + INVITE_MS) { BZ.Cloud.battles.update(d.id, { status: 'cancelled' }).catch(() => {}); continue; }
        if (side === 'b' && now() < d.at + INVITE_MS && !B.seen[d.id]) { B.seen[d.id] = 1; popInvite(d); }
        continue;
      }
      if ((d.status === 'cancelled' || d.status === 'declined') && mine) {
        move(s, mine.stake, mine.skin, 1);
        delete es[d.id];
        if (d.status === 'declined' && side === 'a') UI.toast('league', t('bt_declined', { p: d.bn || '?' }));
        BZ.Game.save();
        continue;
      }
      if (d.status === 'live' && mine) {
        if (now() >= d.end + GRACE_MS || (now() >= d.end && B.myScore(d).f && B.oppScore(d).f)) { resolve(s, d, mine); continue; }
        if (now() < d.end && !G().battle && !B.entering) {
          if (now() < d.start) { B.entering = d.id; popStart(d); setTimeout(() => { B.entering = null; B.enter(d.id); }, Math.max(0, d.start - now())); }
          else if (!mine.left) B.enter(d.id);
        }
      }
    }
    UI.dirty('league');
  };

  function resolve(s, d, mine) {
    const my = Math.max(B.myScore(d).c || 0, mine.final ? mine.final.c : 0);
    const myH = Math.max(B.myScore(d).h || 0, mine.final ? mine.final.h : 0);
    const op = B.oppScore(d);
    const res = my > (op.c || 0) || (my === (op.c || 0) && myH > (op.h || 0)) ? 'won' : my === (op.c || 0) && myH === (op.h || 0) ? 'tie' : 'lost';
    const oppSkin = B.side(d) === 'a' ? d.bskin : d.askin;
    if (res === 'won') { move(s, mine.stake, mine.skin, 1); move(s, mine.stake, oppSkin, 1); }
    else if (res === 'tie') move(s, mine.stake, mine.skin, 1);
    delete s.battleEsc[d.id];
    s.battleHist.unshift({ id: d.id, opp: B.oppName(d), res, my, op: op.c || 0, stake: mine.stake, skin: mine.skin, oskin: oppSkin, at: d.end });
    s.battleHist = s.battleHist.slice(0, 15);
    s._dirty = true;
    BZ.Game.save();
    UI.structureChanged();
    const stk = res === 'won' ? B.stakeText(mine.stake, oppSkin) + (mine.stake.type === 'skin' ? '' : ' x2') : B.stakeText(mine.stake, mine.skin);
    BZ.Audio.play(res === 'won' ? 'swarm' : 'click');
    UI.queueModal ? UI.queueModal(resultHtml(res, d, my, op.c || 0, stk)) : UI.modal(resultHtml(res, d, my, op.c || 0, stk), true);
  }
  function resultHtml(res, d, my, op, stk) {
    return '<div class="bt-res ' + res + '"><div class="bt-res-ic">' + ic(res === 'won' ? 'trophy' : res === 'tie' ? 'league' : 'close') + '</div><h4>' + t('bt_' + res) + '</h4><div class="bt-score"><span><small>' + t('bt_you') + '</small><b>' + F.int(my) + '</b></span><i>' + ic('battle') + '</i><span><small>' + esc(B.oppName(d)) + '</small><b>' + F.int(op) + '</b></span></div><p>' + (res === 'tie' ? t('bt_tie_d') : t('bt_' + res + '_d', { s: esc(stk) })) + '</p><div class="row center"><button class="btn btn-primary" data-close>' + t('ok') + '</button></div></div>';
  }

  function popInvite(d) {
    if (G().battle || UI.modalOpen()) { UI.toast('battle', t('bt_pop_t', { p: d.an })); return; }
    BZ.Audio.play('luckySpawn');
    UI.modal('<div class="hero"><div class="pic bt-pic">' + ic('battle') + '</div><h4>' + esc(t('bt_pop_t', { p: d.an })) + '</h4><p>' + esc(t('bt_pop_d', { s: B.stakeText(d.stake, d.askin) })) + '</p></div><div class="row"><button class="btn btn-ghost" data-close>' + t('bt_later') + '</button><button class="btn btn-primary" data-bt="see">' + ic('battle') + t('bt_see') + '</button></div>', true);
  }
  function popStart(d) {
    BZ.Audio.play('luckySpawn');
    UI.modal('<div class="hero"><div class="pic bt-pic">' + ic('battle') + '</div><h4>' + esc(t('bt_go_t', { p: B.oppName(d) })) + '</h4><p>' + t('bt_go_d') + '</p><b class="num bt-count" data-t="' + d.start + '" data-tfmt="bt_starts"></b></div>', false);
  }

  B.makeState = function (base, id) {
    const st = E.newState(0);
    for (const k of P.SHARED) if (base[k] !== undefined) st[k] = JSON.parse(JSON.stringify(base[k]));
    st.world = 0; st.worldsOpen = [0]; st.otherWorlds = {}; st.essShop = {};
    st.bless = []; st.blessDone = []; st.blessOffer = null; st.boosts = []; st.buffs = [];
    st.auto = { upg: true, prod: true, swarm: false, swarmAt: 2, prodMode: 'best' };
    const ns = BZ.Game.migrateState(st);
    ns.battle = 1; ns.battleId = id; ns.flags.queen = 1;
    ns._dirty = true;
    return ns;
  };
  B.score = s => ({ c: (s.crowns || 0) + (s.crownsSpent || 0), h: Math.floor(s.lifetime || 0) });

  B.enter = function (id, stored) {
    const d = B.docs[id];
    const g = G();
    if (g.battle || (!d && !stored)) return;
    const base = g.main;
    const bs = stored || B.makeState(base, id);
    const info = d ? { id, end: d.end, side: B.side(d), opp: B.oppName(d) } : stored._info;
    const es = esc0(base)[id];
    if (es) es.entered = 1;
    g.battle = Object.assign({ real: base }, info);
    g.main = bs;
    if (BZ.Scene) { BZ.Scene.removeLucky(false); BZ.Scene.removeLucky(false, 'ticket'); }
    E.recalc(bs);
    g.refreshScene();
    if (UI.modalOpen()) UI.closeModal();
    UI.structureChanged();
    UI.show('hive');
    UI.render();
    bar();
    B.persist();
    g.save();
    if (BZ.Log) BZ.Log.info('battle enter ' + id);
  };
  B.persist = function () {
    const g = G();
    if (!g.battle) return;
    try { localStorage.setItem(KEY, JSON.stringify({ info: { id: g.battle.id, end: g.battle.end, side: g.battle.side, opp: g.battle.opp }, state: BZ.Store.serialize(g.main) })); } catch (e) {}
  };
  B.leave = function () {
    const g = G();
    const b = g.battle;
    if (!b) return;
    const sc = B.score(g.main);
    g.main = b.real;
    g.battle = null;
    try { localStorage.removeItem(KEY); } catch (e) {}
    const es = esc0(g.main)[b.id];
    if (es) { es.final = sc; es.left = 1; }
    pushScore(b.id, b.side, Object.assign({ f: true }, sc));
    if (BZ.Scene) { BZ.Scene.removeLucky(false); BZ.Scene.removeLucky(false, 'ticket'); }
    E.recalc(g.main);
    g.refreshScene();
    UI.structureChanged();
    bar();
    g.save();
    UI.modal('<div class="hero"><div class="pic bt-pic">' + ic('battle') + '</div><h4>' + t('bt_over_t') + '</h4><p>' + t('bt_over_d', { c: F.int(sc.c) }) + '</p></div><div class="row center"><button class="btn btn-primary" data-close>' + t('ok') + '</button></div>', true);
    if (BZ.Log) BZ.Log.info('battle leave ' + b.id + ' crowns ' + sc.c);
  };
  function pushScore(id, side, sc) {
    if (!BZ.Cloud || !BZ.Cloud.signedIn() || !BZ.Cloud.battles) return;
    BZ.Cloud.battles.update(id, { ['s' + side]: { c: sc.c, h: sc.h, f: !!sc.f } }).catch(e => { if (BZ.Log) BZ.Log.error('battle score: ' + e.message); });
  }
  B.resume = function () {
    let raw = null;
    try { raw = JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) {}
    if (!raw || !raw.info || !raw.state) return;
    const g = G();
    if (now() < raw.info.end) {
      const st = g.migrateState(raw.state);
      st.battle = 1; st.battleId = raw.info.id; st._info = raw.info;
      B.enter(raw.info.id, st);
    } else {
      const es = esc0(g.main)[raw.info.id];
      const fake = Object.assign({}, raw.state);
      if (es) { es.final = B.score(fake); es.left = 1; }
      B.pendingFinal = { id: raw.info.id, side: raw.info.side, sc: Object.assign({ f: true }, B.score(fake)) };
      try { localStorage.removeItem(KEY); } catch (e) {}
    }
  };

  function bar() {
    let el = document.getElementById('btBar');
    const g = G();
    if (!g.battle) { if (el) el.remove(); return; }
    if (!el) { el = document.createElement('div'); el.id = 'btBar'; el.className = 'bt-bar'; document.getElementById('app').appendChild(el); }
    const d = B.docs[g.battle.id];
    const mine = B.score(g.main).c;
    const opp = d ? (B.oppScore(d).c || 0) : 0;
    const left = Math.max(0, g.battle.end - now());
    const html = '<span class="bt-ic">' + ic('battle') + '</span><b>' + esc(t('bt_bar', { p: g.battle.opp })) + '</b><span class="bt-time num">' + F.time(left / 1000) + '</span><span class="bt-sc ' + (mine >= opp ? 'lead' : '') + '"><small>' + t('bt_you') + '</small><b class="num">' + F.int(mine) + '</b></span><span class="bt-sc"><small>' + esc(g.battle.opp) + '</small><b class="num">' + F.int(opp) + '</b></span>';
    if (el._h !== html) { el._h = html; el.innerHTML = html; }
  }

  setInterval(() => {
    const g = G();
    if (!g || !g.main) return;
    B.listen();
    if (B.pendingFinal && BZ.Cloud && BZ.Cloud.signedIn()) { const pf = B.pendingFinal; B.pendingFinal = null; pushScore(pf.id, pf.side, pf.sc); }
    if (g.battle) {
      if (now() >= g.battle.end) { B.leave(); return; }
      if (now() - B.lastPush > 10000) { B.lastPush = now(); pushScore(g.battle.id, g.battle.side, B.score(g.main)); }
      bar();
    }
    if (Math.floor(now() / 1000) % 5 === 0) B.process();
  }, 1000);

  B.view = function (s) {
    const C = BZ.Cloud;
    B.listen();
    let h = '<div class="card bt-hero"><div class="bt-hero-ic">' + ic('battle') + '</div><div><h3>' + t('bt_title') + '</h3><p>' + t('bt_d') + '</p></div></div>';
    h += '<button class="btn btn-primary btn-block bt-newbtn" data-bt="new">' + ic('battle') + t('bt_new') + '</button>';
    const list = B.list(), me = C.uid(), es = esc0(s);
    const live = list.filter(d => d.status === 'live' && (es[d.id] || now() < d.end));
    for (const d of live) {
      const sideScore = B.myScore(d).c || 0, opp = B.oppScore(d).c || 0;
      h += '<div class="card bt-card live"><div class="sec-title"><h3>' + ic('battle') + t('bt_live') + '</h3><small class="num" data-t="' + (now() < d.start ? d.start : d.end) + '" data-tfmt="' + (now() < d.start ? 'bt_starts' : 'bt_left') + '"></small></div><div class="bt-score"><span><small>' + t('bt_you') + '</small><b>' + F.int(sideScore) + '</b></span><i>' + ic('battle') + '</i><span><small>' + esc(B.oppName(d)) + '</small><b>' + F.int(opp) + '</b></span></div><p class="muted bt-stk">' + t('bt_stake') + ' : ' + esc(B.stakeText(d.stake, B.side(d) === 'a' ? d.askin : d.bskin)) + '</p>' + (now() >= d.start && now() < d.end && !G().battle && es[d.id] && !es[d.id].left ? '<button class="btn btn-primary btn-block" data-bt="enter" data-id="' + d.id + '">' + t('bt_enter') + '</button>' : now() >= d.end ? '<p class="muted">' + t('bt_result_wait') + '</p>' : '') + '</div>';
    }
    const inc = list.filter(d => d.b === me && d.status === 'invite' && now() < d.at + INVITE_MS);
    if (inc.length) {
      h += '<div class="card bt-card"><div class="sec-title"><h3>' + t('bt_in') + '</h3></div>';
      for (const d of inc) {
        const ok = B.enough(s, d.stake, d.stake.type === 'skin' ? (B.skins(s)[0] || {}).id : null);
        h += '<div class="bt-row"><div class="bt-row-t"><b>' + esc(d.an) + '</b><small>' + esc(B.stakeText(d.stake, d.askin)) + '  ·  <span data-t="' + (d.at + INVITE_MS) + '" data-tfmt="bt_expires"></span></small>' + (ok ? '' : '<small class="bt-warn">' + t('bt_lack') + '</small>') + '</div><button class="btn btn-ghost btn-sm" data-bt="decline" data-id="' + d.id + '">' + t('bt_decline') + '</button><button class="btn btn-primary btn-sm' + (ok ? '' : ' off') + '" data-bt="accept" data-id="' + d.id + '">' + t('bt_accept') + '</button></div>';
      }
      h += '</div>';
    }
    const out = list.filter(d => d.a === me && d.status === 'invite' && now() < d.at + INVITE_MS);
    if (out.length) {
      h += '<div class="card bt-card"><div class="sec-title"><h3>' + t('bt_out') + '</h3></div>';
      for (const d of out) h += '<div class="bt-row"><div class="bt-row-t"><b>' + esc(t('bt_wait', { p: d.bn })) + '</b><small>' + esc(B.stakeText(d.stake, d.askin)) + '  ·  <span data-t="' + (d.at + INVITE_MS) + '" data-tfmt="bt_expires"></span></small></div><button class="btn btn-ghost btn-sm" data-bt="cancel" data-id="' + d.id + '">' + t('bt_cancel') + '</button></div>';
      h += '</div>';
    }
    const hist = s.battleHist || [];
    h += '<div class="card bt-card"><div class="sec-title"><h3>' + t('bt_hist') + '</h3></div>';
    if (!hist.length) h += '<div class="empty-line">' + t('bt_empty') + '</div>';
    for (const x of hist) h += '<div class="bt-row bt-h ' + x.res + '"><span class="bt-badge">' + t('bt_' + x.res) + '</span><div class="bt-row-t"><b>' + esc(t('bt_vs', { a: t('bt_you'), b: x.opp })) + '  ·  ' + F.int(x.my) + ' : ' + F.int(x.op) + '</b><small>' + esc(B.stakeText(x.stake, x.skin)) + '</small></div></div>';
    h += '</div>';
    return h;
  };

  function formHtml() {
    const s = real(), f = B.form;
    const O = BZ.Online;
    const me = B.me();
    const group = (O && O.group ? O.standings(O.group) : []).filter(e => e.uid !== me);
    const pick = f.opp;
    let h = '<div class="bt-form"><h4>' + ic('battle') + t('bt_new') + '</h4>';
    h += '<label class="bt-lbl">' + t('bt_pick') + '</label>';
    if (pick) h += '<div class="bt-picked"><span>' + esc(pick.name) + '</span><button class="btn btn-ghost btn-sm" data-bt="unpick">' + ic('close') + '</button></div>';
    else {
      h += '<input id="btSearch" class="bt-in" placeholder="' + esc(t('bt_search')) + '" autocomplete="off"><div class="bt-plist" id="btPlist">';
      const rows = [];
      group.forEach(e => rows.push({ uid: e.uid, name: e.n || '?', sub: t('bt_group') }));
      (B.players || []).filter(p => p.uid !== me && !rows.some(r => r.uid === p.uid)).forEach(p => rows.push({ uid: p.uid, name: p.name || '?', sub: t('lvl', { n: p.level || 1 }) }));
      h += rows.length ? rows.map(r => '<button class="bt-p" data-bt="pick" data-uid="' + esc(r.uid) + '" data-name="' + esc(r.name) + '" data-q="' + esc(r.name.toLowerCase()) + '"><b>' + esc(r.name) + '</b><small>' + esc(r.sub) + '</small></button>').join('') : '<div class="empty-line">' + t('bt_none') + '</div>';
      h += '</div>';
    }
    h += '<label class="bt-lbl">' + t('bt_stake') + '</label><div class="seg seg-wrap bt-types">' + B.TYPES.map(x => '<button data-bt="type" data-arg="' + x + '" class="' + (f.type === x ? 'on' : '') + '">' + t('st_' + x) + '</button>').join('') + '</div>';
    if (f.type === 'ess') h += '<div class="seg seg-wrap">' + BZ.ESSENCES.map((e, i) => '<button data-bt="w" data-arg="' + i + '" class="' + (f.w === i ? 'on' : '') + '" style="--ec:' + e.color + '">' + ic(e.icon) + F.int(s.ess[i] || 0) + '</button>').join('') + '</div>';
    if (f.type === 'crowns') h += '<div class="seg seg-wrap">' + s.worldsOpen.map(i => '<button data-bt="w" data-arg="' + i + '" class="' + (f.w === i ? 'on' : '') + '">' + esc(n(BZ.WORLDS[i].name)) + '</button>').join('') + '</div>';
    if (f.type === 'skin') {
      const sk = B.skins(s);
      h += '<label class="bt-lbl">' + t('bt_skin_pick') + '</label><div class="seg seg-wrap">' + (sk.length ? sk.map(x => '<button data-bt="skin" data-arg="' + x.id + '" class="' + (f.skin === x.id ? 'on' : '') + '">' + esc(n(x.name)) + '</button>').join('') : '<span class="muted">' + t('bt_none') + '</span>') + '</div>';
    } else h += '<label class="bt-lbl">' + t('bt_amount') + '</label><input id="btAmt" class="bt-in" type="number" min="1" step="1" value="' + f.n + '">';
    const st = { type: f.type, n: f.n, w: f.w };
    h += '<small class="bt-have">' + t('bt_have', { v: F.int(B.have(s, st, f.skin)) }) + '</small>';
    h += '<div class="row"><button class="btn btn-ghost" data-close>' + t('cancel') + '</button><button class="btn btn-primary" data-bt="send">' + ic('battle') + t('bt_send') + '</button></div></div>';
    return h;
  }
  function drawForm() {
    const m = document.querySelector('#modal .modal.bt-modal');
    if (!m) return;
    const q = document.getElementById('btSearch');
    const qv = q ? q.value : '';
    m.innerHTML = formHtml();
    const q2 = document.getElementById('btSearch');
    if (q2) { q2.value = qv; filter(); }
  }
  function filter() {
    const q = (document.getElementById('btSearch') || {}).value || '';
    document.querySelectorAll('.bt-p').forEach(b => { b.style.display = !q || b.dataset.q.includes(q.trim().toLowerCase()) ? '' : 'none'; });
  }
  B.openForm = function () {
    if (G().battle) return UI.toast('battle', t('bt_blocked'));
    B.form.opp = null;
    const s = real();
    if (B.form.type === 'skin' && !B.form.skin) B.form.skin = (B.skins(s)[0] || {}).id || '';
    UI.modal(formHtml(), true);
    const m = document.querySelector('#modal .modal');
    if (m) m.classList.add('bt-modal');
    if (!B.players && BZ.Cloud.signedIn()) BZ.Cloud.top('level', 200).then(list => { B.players = list; drawForm(); }).catch(() => {});
  };

  async function send() {
    const s = real(), f = B.form, C = BZ.Cloud;
    const amtEl = document.getElementById('btAmt');
    if (amtEl) f.n = Math.max(1, Math.floor(+amtEl.value || 1));
    if (!f.opp) return UI.toast('battle', t('bt_needpick'));
    const stake = f.type === 'skin' ? { type: 'skin', n: 1, w: 0 } : { type: f.type, n: f.n, w: f.w || 0 };
    const skin = f.type === 'skin' ? f.skin : null;
    if (!B.enough(s, stake, skin)) return UI.toast('battle', t('bt_lack'));
    const doc = { a: C.uid(), an: BZ.Online.name(s), b: f.opp.uid, bn: f.opp.name, stake, status: 'invite', at: now() };
    if (skin) doc.askin = skin;
    try {
      const id = await C.battles.create(doc);
      move(s, stake, skin, -1);
      esc0(s)[id] = { stake, skin, side: 'a' };
      BZ.Game.save();
      UI.closeModal();
      UI.toast('battle', t('bt_sent', { p: f.opp.name }), { ok: true });
      UI.dirty('league'); UI.render();
    } catch (e) { UI.toast('info', e.message || String(e)); }
  }
  async function accept(id, skin) {
    const s = real(), d = B.docs[id], C = BZ.Cloud;
    if (!d || d.status !== 'invite') return;
    if (d.stake.type === 'skin' && !skin) {
      const sk = B.skins(s);
      if (!sk.length) return UI.toast('battle', t('bt_lack'));
      UI.modal('<h4>' + t('bt_skin_pick') + '</h4><div class="seg seg-wrap">' + sk.map(x => '<button data-bt="acceptskin" data-id="' + id + '" data-arg="' + x.id + '">' + esc(n(x.name)) + '</button>').join('') + '</div><div class="row"><button class="btn btn-ghost" data-close>' + t('cancel') + '</button></div>', true);
      return;
    }
    if (!B.enough(s, d.stake, skin)) return UI.toast('battle', t('bt_lack'));
    const start = now() + DELAY_MS;
    const upd = { status: 'live', start, end: start + dur() };
    if (skin) upd.bskin = skin;
    try {
      await C.battles.update(id, upd);
      move(s, d.stake, skin, -1);
      esc0(s)[id] = { stake: d.stake, skin, side: 'b' };
      BZ.Game.save();
      if (UI.modalOpen()) UI.closeModal();
      B.docs[id] = Object.assign({}, d, upd);
      B.process();
    } catch (e) { UI.toast('info', e.message || String(e)); }
  }

  document.addEventListener('click', e => {
    const el = e.target.closest('[data-bt]');
    if (!el) return;
    e.stopPropagation();
    const a = el.dataset.bt, f = B.form;
    BZ.Audio.play('click');
    if (a === 'new') return B.openForm();
    if (a === 'see') { UI.closeModal(); UI.show('league'); if (UI.leagueView) UI.leagueView('battle'); return; }
    if (a === 'pick') { f.opp = { uid: el.dataset.uid, name: el.dataset.name }; return drawForm(); }
    if (a === 'unpick') { f.opp = null; return drawForm(); }
    if (a === 'type') { const amt = document.getElementById('btAmt'); if (amt) f.n = Math.max(1, Math.floor(+amt.value || 1)); f.type = el.dataset.arg; f.w = f.type === 'ess' || f.type === 'crowns' ? (real().world || 0) : 0; if (f.type === 'skin' && !f.skin) f.skin = (B.skins(real())[0] || {}).id || ''; return drawForm(); }
    if (a === 'w') { const amt = document.getElementById('btAmt'); if (amt) f.n = Math.max(1, Math.floor(+amt.value || 1)); f.w = +el.dataset.arg; return drawForm(); }
    if (a === 'skin') { f.skin = el.dataset.arg; return drawForm(); }
    if (a === 'send') return send();
    if (a === 'accept') return accept(el.dataset.id);
    if (a === 'acceptskin') return accept(el.dataset.id, el.dataset.arg);
    if (a === 'decline') return BZ.Cloud.battles.update(el.dataset.id, { status: 'declined' }).catch(err => UI.toast('info', err.message));
    if (a === 'cancel') return BZ.Cloud.battles.update(el.dataset.id, { status: 'cancelled' }).catch(err => UI.toast('info', err.message));
    if (a === 'enter') return B.enter(el.dataset.id);
  });
  document.addEventListener('input', e => { if (e.target && e.target.id === 'btSearch') filter(); });

  const blockTabs = ['bees', 'workshop', 'daily', 'pass', 'worlds', 'trophies'];
  const origShow = UI.show;
  UI.show = function (p) {
    if (G() && G().battle && blockTabs.includes(p)) { UI.toast('battle', t('bt_blocked')); return; }
    return origShow.apply(this, arguments);
  };
  const wrap = (obj, key) => { const fn = obj[key]; if (!fn) return; obj[key] = function () { if (G().battle) { UI.toast('battle', t('bt_blocked')); return; } return fn.apply(this, arguments); }; };
  B.init = function () {
    if (B.ready) return;
    B.ready = true;
    const g = G();
    ['travel', 'askSell', 'askPrime', 'buyEss', 'pull', 'openWorld', 'cloudSync'].forEach(k => wrap(g, k));
    wrap(UI, 'openMap');
    if (BZ.Dev) wrap(BZ.Dev, 'open');
    B.resume();
  };
})(window);
