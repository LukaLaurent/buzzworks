(function (root) {
  const BZ = root.BZ;
  const F = BZ.F, M = BZ.Meta, UI = BZ.UI, O = BZ.Online, t = BZ.t, n = BZ.n, ic = BZ.icon;
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  let view = 'league', field = 'honey', loading = '';

  BZ.addStrings({
    lg_title: 'Leagues and rankings', lg_signin_d: 'Sign in with Google to join a weekly league with real players and appear in the rankings. Your save is kept in the cloud too.',
    lg_league: 'League', lg_ranks: 'Rankings', lg_group: '{n} players in your group', lg_loading: 'Loading', lg_err: 'Could not reach the server. Try again later.', lg_retry: 'Retry',
    lg_promo: 'Top {n} move up', lg_demo: 'Bottom {n} move down', lg_how: 'Earn points by catching lucky bees and ticket bees, finishing quests, swarming, reaching milestones, buying upgrades and playing. Every Monday the top quarter of each group moves up a league and the bottom quarter moves down. Rewards: tickets for everyone, royal tickets for the top 3.',
    lg_alone: 'You are the first player in this group. Others join as they play this week.',
    rk_honey: 'Honey made', rk_crowns: 'Crowns', rk_essence: 'Essence', rk_bees: 'Bee species', rk_level: 'Level', rk_trophies: 'Trophies', rk_you: 'Your rank: {n}', rk_empty: 'No players yet', rk_how: 'Rankings count every world. They refresh every minute.',
    league_reward: 'Rewards', set_name_d: 'Shown in leagues and rankings', league_you: 'You',
    cloud_d: 'Sign in with Google to keep your progress on every device and join the leagues.'
  }, {
    lg_title: 'Ligues et classements', lg_signin_d: 'Connectez-vous avec Google pour rejoindre une ligue hebdomadaire avec de vrais joueurs et apparaître dans les classements. Votre sauvegarde est aussi gardée en ligne.',
    lg_league: 'Ligue', lg_ranks: 'Classements', lg_group: '{n} joueurs dans votre groupe', lg_loading: 'Chargement', lg_err: 'Serveur injoignable. Réessayez plus tard.', lg_retry: 'Réessayer',
    lg_promo: 'Les {n} premiers montent', lg_demo: 'Les {n} derniers descendent', lg_how: 'Gagnez des points en attrapant des abeilles dorées et des abeilles à ticket, en finissant des quêtes, en essaimant, en atteignant des paliers, en achetant des améliorations et en jouant. Chaque lundi, le premier quart de chaque groupe monte d\'une ligue et le dernier quart descend. Récompenses : des tickets pour tous, des tickets royaux pour le podium.',
    lg_alone: 'Vous êtes le premier joueur de ce groupe. D\'autres arrivent au fil de la semaine.',
    rk_honey: 'Miel produit', rk_crowns: 'Couronnes', rk_essence: 'Essence', rk_bees: 'Espèces d\'abeilles', rk_level: 'Niveau', rk_trophies: 'Trophées', rk_you: 'Votre rang : {n}', rk_empty: 'Pas encore de joueur', rk_how: 'Les classements comptent tous les mondes. Ils se mettent à jour chaque minute.',
    league_reward: 'Récompenses', set_name_d: 'Affiché dans les ligues et les classements', league_you: 'Vous',
    cloud_d: 'Connectez-vous avec Google pour garder votre progression sur tous vos appareils et rejoindre les ligues.'
  });

  const AV = ['#527C82', '#C08457', '#8E6AC8', '#3E9B6A', '#C9485B', '#4C7CC4'];
  function avatar(name, you) {
    let h = 0;
    for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
    return '<span class="av" style="background:' + (you ? 'var(--orange);color:var(--on-orange)' : AV[h % AV.length]) + '">' + esc((name.trim()[0] || '?').toUpperCase()) + '</span>';
  }
  function fmtField(f, v) { return f === 'honey' ? F.num(v || 0) : F.int(v || 0); }

  function refresh(kind, fn) {
    if (loading === kind) return;
    loading = kind;
    fn().catch(e => { O.error = String(e && e.message || e); }).then(() => { loading = ''; if (UI.page() === 'league') UI.render(); });
  }

  function leagueView(s) {
    const L = s.league;
    const tier = BZ.LEAGUE_TIERS[L.tier || 0];
    if ((!O.group || Date.now() - O.groupAt > 30000) && !loading) refresh('group', () => O.sync(s));
    const list = O.standings(O.group);
    const me = list.find(e => e.you);
    let h = '<div class="card"><div class="league-head"><div class="tier-badge" style="background:' + tier.color + '">' + ic('league') + '</div><div><b>' + t('league') + ' ' + n(tier.name) + '</b><small class="num">' + (me ? t('league_rank', { n: me.rank }) + '  ·  ' : '') + t('league_points', { v: F.int(L.points) }) + '  ·  <span data-t="' + M.weekEnd().getTime() + '" data-tfmt="league_ends"></span></small></div></div>';
    h += '<div class="tiers">' + BZ.LEAGUE_TIERS.map((x, i) => '<i class="' + (i <= (L.tier || 0) ? 'on' : '') + '" style="background:' + x.color + '" title="' + esc(n(x.name)) + '"></i>').join('') + '</div></div>';
    h += '<div class="card" style="padding:var(--sp-3)">';
    if (!list.length) h += '<div class="empty-line">' + (O.error ? t('lg_err') + ' <button class="btn btn-outline btn-sm" data-act="lgretry">' + t('lg_retry') + '</button>' : t('lg_loading')) + '</div>';
    else {
      const z = O.zones(list.length);
      h += '<div class="board-head"><small>' + t('lg_group', { n: list.length }) + '</small></div><div class="board">';
      list.forEach(e => {
        if (e.rank === 1 && (L.tier || 0) < BZ.LEAGUE_TIERS.length - 1) h += '<div class="zone up">' + ic('star') + t('lg_promo', { n: z.up }) + '</div>';
        if (z.down && e.rank === list.length - z.down + 1 && (L.tier || 0) > 0) h += '<div class="zone down">' + ic('info') + t('lg_demo', { n: z.down }) + '</div>';
        h += '<div class="row-l' + (e.you ? ' you' : '') + '"><span class="rk num">' + e.rank + '</span>' + avatar(e.n || '?', e.you) + '<span class="nm">' + esc(e.n || '?') + '<small>' + t('lvl', { n: e.l || 1 }) + '</small></span><span class="pt num">' + F.int(e.you ? Math.max(e.p || 0, L.points) : e.p || 0) + '</span></div>';
      });
      h += '</div>';
      if (list.length === 1) h += '<p class="faint" style="font-size:var(--fs-xs);margin-top:var(--sp-3);padding:0 var(--sp-2)">' + t('lg_alone') + '</p>';
    }
    h += '</div><div class="card"><p class="muted" style="font-size:var(--fs-sm)">' + t('lg_how') + '</p></div>';
    return h;
  }

  function ranksView(s) {
    const b = O.boards[field];
    if ((!b || Date.now() - b.at > 60000) && !loading) refresh('board', () => O.board(s, field));
    let h = '<div class="seg rk-seg">' + O.FIELDS.map(f => '<button data-act="rkfield" data-arg="' + f + '" class="' + (f === field ? 'on' : '') + '">' + t('rk_' + f) + '</button>').join('') + '</div>';
    h += '<div class="card" style="padding:var(--sp-3);margin-top:var(--sp-3)">';
    if (!b) h += '<div class="empty-line">' + (O.error ? t('lg_err') + ' <button class="btn btn-outline btn-sm" data-act="lgretry">' + t('lg_retry') + '</button>' : t('lg_loading')) + '</div>';
    else if (!b.list.length) h += '<div class="empty-line">' + t('rk_empty') + '</div>';
    else {
      const me = BZ.Cloud.uid();
      h += '<div class="board">' + b.list.map((e, i) => '<div class="row-l' + (e.uid === me ? ' you' : '') + '"><span class="rk num">' + (i + 1) + '</span>' + avatar(e.name || '?', e.uid === me) + '<span class="nm">' + esc(e.name || '?') + '<small>' + t('lvl', { n: e.level || 1 }) + '</small></span><span class="pt num">' + fmtField(field, e[field]) + '</span></div>').join('') + '</div>';
      if (b.rank) h += '<div class="rk-me">' + t('rk_you', { n: F.int(b.rank) }) + '  ·  ' + fmtField(field, b.mine) + '</div>';
    }
    h += '</div><p class="faint" style="font-size:var(--fs-xs);margin-top:var(--sp-3)">' + t('rk_how') + '</p>';
    return h;
  }

  UI.ext.league = function () {
    const s = BZ.Game.main;
    let h = '<h2 class="page-title">' + t('lg_title') + '</h2>';
    if (!BZ.Cloud.signedIn()) {
      h += '<div class="card"><div class="hero"><div class="pic">' + ic('league') + '</div><h4>' + t('lg_title') + '</h4><p style="margin-top:var(--sp-2)">' + t('lg_signin_d') + '</p></div><div class="row center"><button class="btn btn-primary g-btn" data-act="cloudin">' + ic('user') + t('cloud_signin') + '</button></div></div>';
      return h;
    }
    h += '<div class="seg lg-seg"><button data-act="lgview" data-arg="league" class="' + (view === 'league' ? 'on' : '') + '">' + t('lg_league') + '</button><button data-act="lgview" data-arg="ranks" class="' + (view === 'ranks' ? 'on' : '') + '">' + t('lg_ranks') + '</button></div><div style="height:var(--sp-4)"></div>';
    h += view === 'league' ? leagueView(s) : ranksView(s);
    return h;
  };

  const prevAct = UI.extAct;
  UI.extAct = function (act, arg, el) {
    if (act === 'lgview') { view = arg; UI.render(); return; }
    if (act === 'rkfield') { field = arg; UI.render(); return; }
    if (act === 'lgretry') { O.error = ''; O.group = null; O.boards = {}; UI.render(); return; }
    prevAct(act, arg, el);
  };

  UI.showLeagueResult = function (p) {
    const tierName = n(BZ.LEAGUE_TIERS[p.tier].name);
    const line = p.move > 0 ? t('league_up', { t: tierName }) : p.move < 0 ? t('league_down', { t: tierName }) : t('league_stay', { t: tierName });
    UI.queueModal(UI.hero('league', t('league_result', { n: p.rank }), '', line + '<br><small class="muted">' + esc(UI.gotText(p.got || [])) + '</small>', '<button class="btn btn-primary" data-close>' + t('ok') + '</button>'));
  };
})(window);
