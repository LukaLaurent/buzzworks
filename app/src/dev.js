(function (root) {
  const BZ = root.BZ;
  const F = BZ.F, P = BZ.P, E = BZ.E, UI = BZ.UI, ic = BZ.icon;
  const HASH = '4f9e19aa94d5481a877fe81887b9a489eec1b348ed6f330fe47cdb0d398b7b21';
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  BZ.addStrings({
    dev_gift: 'A gift from the developer',
    lg_banned: 'Online features are turned off for this account. Your progress is safe and you can keep playing.'
  }, {
    dev_gift: 'Un cadeau du développeur',
    lg_banned: 'Les fonctions en ligne sont désactivées pour ce compte. Votre progression est conservée et vous pouvez continuer à jouer.'
  });

  const D = BZ.Dev = { op: 'closeWorld', pop: 'closeWorld', ok: false, email: null, admin: null, tab: 'me', players: null, banned: null, sel: null, selSave: null, selGroups: null, msg: '', busy: false };

  async function sha(text) {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
    return [...new Uint8Array(buf)].map(x => x.toString(16).padStart(2, '0')).join('');
  }
  D.check = async function () {
    const C = BZ.Cloud;
    const em = C && C.configured() && C.signedIn() ? String(C.email() || '').trim().toLowerCase() : '';
    if (em === D.email) return D.ok;
    D.email = em;
    const was = D.ok;
    D.ok = false; D.admin = null;
    if (em && root.crypto && crypto.subtle) { try { D.ok = (await sha(em)) === HASH; } catch (e) {} }
    if (D.ok) D.admin = await C.isAdmin().catch(() => false);
    if (D.ok !== was) { UI.dirty('about'); UI.render(); }
    return D.ok;
  };

  const RES = [
    ['egg', 'Egg tickets'], ['royal', 'Royal tickets'], ['core', 'Core tickets'], ['legend', 'Legendary eggs'], ['mystic', 'Mystic eggs'], ['primeStones', 'Prime stones'],
    ['ess0', 'Bloom essence'], ['ess1', 'Sun essence'], ['ess2', 'Frost essence'], ['ess3', 'Moon essence'], ['ess4', 'Ember essence'],
    ['honey', 'Honey (current world)'], ['rj', 'Royal jelly (current world)'], ['crowns', 'Crowns (current world)'],
    ['levels', 'Player levels'], ['passXp', 'Pass XP'], ['league', 'League points'], ['parts', 'Skin parts (give only)']
  ];
  const resSelect = id => '<select id="' + id + '" class="dev-in">' + RES.map(r => '<option value="' + r[0] + '">' + r[1] + '</option>').join('') + '</select>';
  function parseAmt(v) {
    const m = String(v || '').trim().toLowerCase().replace(/[\s,]/g, '').match(/^(\d*\.?\d+(?:e\d+)?)([kmbt]?)$/);
    if (!m) return 0;
    return parseFloat(m[1]) * ({ '': 1, k: 1e3, m: 1e6, b: 1e9, t: 1e12 }[m[2]]);
  }
  function toGift(key, amt) {
    if (key.startsWith('ess')) { const a = [0, 0, 0, 0, 0]; a[+key.slice(3)] = amt; return { ess: a }; }
    return { [key]: amt };
  }
  const OPS = [
    ['openWorld', 'Open a world'], ['closeWorld', 'Close a world'], ['resetWorld', 'Reset a world (stays open)'], ['setCrowns', 'Set crowns of a world'],
    ['addBee', 'Give a bee'], ['removeBee', 'Remove a bee'], ['addCore', 'Give a hive core'], ['removeCore', 'Remove a hive core'],
    ['addSkin', 'Give a skin'], ['removeSkin', 'Remove a skin'], ['setPrime', 'Set Prime points'], ['setLevel', 'Set player level'],
    ['resetPity', 'Reset hatch pity'], ['resetPass', 'Reset pass progress'], ['newQuests', 'New daily quests'], ['newLq', 'New league quests'],
    ['clearBoosts', 'Remove active boosts'], ['maxTrees', 'Max every essence tree'], ['resetTrees', 'Reset every essence tree']
  ];
  function targets(kind) {
    const k = kind.split('+')[0];
    if (k === 'world') return BZ.WORLDS.map((w, i) => [i, BZ.n(w.name)]);
    if (k === 'bee') return BZ.BEES.map(b => [b.id, BZ.n(b.name) + '  ·  ' + BZ.n(BZ.RARITIES[b.r].name)]);
    if (k === 'core') return BZ.CORES.map(c => [c.id, BZ.n(c.name) + '  ·  ' + BZ.n(BZ.RARITIES[c.r].name)]);
    if (k === 'skin') return BZ.SKINS.filter(x => !x.world && x.id !== 'meadow').map(x => [x.id, BZ.n(x.name)]);
    return [];
  }
  function opForm(pre, cur, btn) {
    const kind = P.DEV_OPS[cur] || '';
    const tg = targets(kind);
    let h = '<div class="dev-row"><select id="' + pre + 'Op" class="dev-in" data-devop="' + pre + '">' + OPS.map(o => '<option value="' + o[0] + '"' + (o[0] === cur ? ' selected' : '') + '>' + o[1] + '</option>').join('') + '</select>';
    if (tg.length) h += '<select id="' + pre + 'Tgt" class="dev-in">' + tg.map(x => '<option value="' + esc(x[0]) + '">' + esc(x[1]) + '</option>').join('') + '</select>';
    if (kind.includes('amt')) h += '<input id="' + pre + 'OAmt" class="dev-in" placeholder="Amount" value="1">';
    return h + '<button class="btn btn-primary btn-sm" data-dev="' + btn + '">Apply</button></div>';
  }
  const val = id => { const el = document.getElementById(id); return el ? el.value : ''; };

  function meTab(s) {
    let h = '<div class="dev-card"><h5>' + ic('gift') + 'Give or take (this save)</h5><div class="dev-row">' + resSelect('devRes') + '<input id="devAmt" class="dev-in" placeholder="Amount: 10, 5k, 2m, 1e15" value="10"><button class="btn btn-primary btn-sm" data-dev="give">Give</button><button class="btn btn-outline btn-sm" data-dev="take">Take</button></div></div>';
    h += '<div class="dev-card"><h5>' + ic('globe') + 'Worlds and collection</h5>' + opForm('devM', D.op, 'op') + '<small class="dev-hint">Closing the world you are in sends you back to the first world. The first world cannot be closed.</small></div>';
    const quick = [
      ['lucky', 'sparkle', 'Spawn lucky bee'], ['red', 'gem', 'Spawn red lucky bee'], ['ticketbee', 'ticket', 'Spawn ticket bee'],
      ['bless', 'star', 'Blessing offer'], ['boost', 'bolt', 'x2 honey 30 min'], ['boosts', 'bolt', 'Every new boost'], ['gift', 'gift', 'Show daily gift again'], ['boss', 'boss', 'Allow another boss fight'], ['skip', 'clock', 'Skip 1 hour'],
      ['trees', 'globe', 'Max essence trees'], ['notrees', 'trash', 'Reset essence trees'], ['worlds', 'globe', 'Open every world'],
      ['bees', 'worker', 'One of every bee'], ['cores', 'hive', 'One of every core'], ['wheel', 'gem', 'Test red wheel (visual)'],
      ['jackpot', 'prime', 'Test jackpot (visual)'], ['wn', 'sparkle', 'Show What’s new'], ['wnreset', 'sparkle', 'Show What’s new banner again']
    ];
    h += '<div class="dev-card"><h5>' + ic('bolt') + 'Quick actions</h5><div class="dev-grid">' + quick.map(q => '<button class="btn btn-outline btn-sm" data-dev="q" data-arg="' + q[0] + '">' + ic(q[1]) + q[2] + '</button>').join('') + '</div></div>';
    const st = [['World', BZ.n(BZ.WORLDS[s.world].name)], ['Level', F.int(s.level || 1)], ['Prime', F.int(s.prime || 0) + '  ·  stones ' + F.int(s.primeStones || 0)], ['Essence', (s.ess || []).map(F.int).join(' / ')], ['Tickets', F.int(s.tickets.egg) + ' egg  ·  ' + F.int(s.tickets.royal) + ' royal  ·  ' + F.int(s.tickets.core) + ' core'], ['Red bees caught', F.int(s.rubies || 0)], ['League', F.int(s.league.points || 0) + ' pts  ·  ' + (s.league.gid || 'no group')]];
    h += '<div class="dev-card"><h5>' + ic('chart') + 'This save</h5>' + st.map(x => '<div class="kv"><span>' + x[0] + '</span><span class="num">' + esc(x[1]) + '</span></div>').join('') + '</div>';
    return h;
  }

  function setupCard() {
    const uid = BZ.Cloud.uid();
    return '<div class="dev-card dev-warn"><h5>' + ic('lock') + 'Firebase admin rights are not set yet</h5><p>Managing players needs two steps in the Firebase console (once):</p><ol><li>Firestore Database, Rules: paste the content of <code>app/firebase/firestore.rules</code> and Publish.</li><li>Firestore Database, Data: start a collection named <code>admins</code>, with a document whose ID is your UID below (no fields needed, add any field like ok = true).</li></ol><div class="dev-row"><code class="dev-uid">' + esc(uid) + '</code><button class="btn btn-outline btn-sm" data-dev="copy" data-arg="' + esc(uid) + '">' + ic('copy') + 'Copy UID</button><button class="btn btn-primary btn-sm" data-dev="recheck">Check again</button></div></div>';
  }

  function playerDetail() {
    const p = D.sel;
    let h = '<div class="dev-card dev-sel"><div class="dev-selh"><div><b>' + esc(p.name || '?') + '</b><small>' + esc(p.uid) + '</small></div><button class="wm-x dev-x" data-dev="unpick">' + ic('close') + '</button></div>';
    h += '<div class="dev-stats">' + [['Level', F.int(p.level || 1)], ['Honey', F.num(p.honey || 0)], ['Crowns', F.int(p.crowns || 0)], ['Essence', F.int(p.essence || 0)], ['Bees', F.int(p.bees || 0)], ['League tier', BZ.n((BZ.LEAGUE_TIERS[p.tier || 0] || BZ.LEAGUE_TIERS[0]).name)], ['Last seen', p.at ? new Date(p.at).toLocaleString() : '?']].map(x => '<span><small>' + x[0] + '</small><b>' + esc(x[1]) + '</b></span>').join('') + '</div>';
    h += '<h6>Give or take</h6><div class="dev-row">' + resSelect('devGRes') + '<input id="devGAmt" class="dev-in" placeholder="Amount" value="10"></div><div class="dev-row"><input id="devGNote" class="dev-in dev-wide" maxlength="80" placeholder="Message shown to the player (optional)"><button class="btn btn-primary btn-sm" data-dev="pgive">Give</button><button class="btn btn-outline btn-sm" data-dev="ptake">Take</button></div><small class="dev-hint">Delivered the next time the player syncs online (every 3 minutes while playing).</small>';
    h += '<h6>Worlds and collection</h6>' + opForm('devP', D.pop, 'pop');
    const banned = (D.banned || []).some(b => b.uid === p.uid);
    h += '<h6>Moderation</h6><div class="dev-grid">' +
      '<button class="btn btn-outline btn-sm" data-dev="psave">' + ic('chart') + 'View save</button>' +
      '<button class="btn btn-outline btn-sm" data-dev="prename">' + ic('user') + 'Reset name</button>' +
      '<button class="btn btn-outline btn-sm" data-dev="ppoints">' + ic('league') + 'Reset league points</button>' +
      '<button class="btn btn-outline btn-sm" data-dev="pkick">' + ic('close') + 'Remove from league group</button>' +
      '<button class="btn btn-outline btn-sm" data-dev="pdrop">' + ic('trash') + 'Remove from rankings</button>' +
      (banned ? '<button class="btn btn-primary btn-sm" data-dev="punban">' + ic('check') + 'Unban</button>' : '<button class="btn btn-danger btn-sm" data-dev="pban">' + ic('lock') + 'Ban from online</button>') + '</div>';
    if (D.selGroups) h += '<small class="dev-hint">League groups: ' + (D.selGroups.length ? D.selGroups.map(g => esc(g.gid) + ' (' + F.int((g.scores[p.uid] || {}).p || 0) + ' pts)').join(', ') : 'none') + '</small>';
    if (D.selSave) {
      const v = D.selSave;
      const rows = [['Level', v.level], ['World', v.world], ['Worlds open', (v.worldsOpen || []).join(', ')], ['Prime', v.prime || 0], ['Prime stones', v.primeStones || 0], ['Essence', (v.ess || []).map(x => F.int(x)).join(' / ')], ['Tickets', v.tickets ? v.tickets.egg + ' egg, ' + v.tickets.royal + ' royal, ' + v.tickets.core + ' core' : '?'], ['Bees', Object.keys(v.bees || {}).length], ['Swarms', v.swarms || 0], ['Red bees', v.rubies || 0], ['Saved', v.lastSave ? new Date(v.lastSave).toLocaleString() : '?']];
      h += '<h6>Cloud save</h6>' + rows.map(x => '<div class="kv"><span>' + x[0] + '</span><span class="num">' + esc(x[1]) + '</span></div>').join('');
    } else if (D.selSave === false) h += '<small class="dev-hint">No cloud save for this player.</small>';
    return h + '</div>';
  }

  function peopleTab() {
    if (!D.admin) return setupCard();
    let h = '';
    if (D.sel) h += playerDetail();
    h += '<div class="dev-card"><h5>' + ic('user') + 'Players</h5><div class="dev-row"><input id="devSearch" class="dev-in dev-wide" placeholder="Filter by name or UID"><button class="btn btn-primary btn-sm" data-dev="load">' + (D.players ? 'Reload' : 'Load players') + '</button></div>';
    if (D.players) h += '<div class="dev-list">' + D.players.map(p => '<button class="dev-p' + (D.sel && D.sel.uid === p.uid ? ' on' : '') + '" data-dev="pick" data-arg="' + esc(p.uid) + '" data-q="' + esc(((p.name || '') + ' ' + p.uid).toLowerCase()) + '"><b>' + esc(p.name || '?') + '</b><small>lvl ' + F.int(p.level || 1) + '  ·  ' + F.num(p.honey || 0) + ' honey  ·  ' + F.int(p.crowns || 0) + ' crowns</small></button>').join('') + '</div><small class="dev-hint">' + D.players.length + ' players, sorted by honey made.</small>';
    h += '</div>';
    if (D.banned && D.banned.length) h += '<div class="dev-card"><h5>' + ic('lock') + 'Banned</h5>' + D.banned.map(b => '<div class="kv"><span>' + esc(b.name || b.uid) + ' <small class="dev-hint">' + esc(b.uid) + '</small></span><button class="btn btn-outline btn-sm" data-dev="unbanid" data-arg="' + esc(b.uid) + '">Unban</button></div>').join('') + '</div>';
    return h;
  }

  function toolsTab() {
    const C = BZ.Cloud;
    let h = '<div class="dev-card"><h5>' + ic('settings') + 'Tools</h5><div class="dev-grid">' +
      '<button class="btn btn-outline btn-sm" data-dev="t" data-arg="logs">' + ic('chart') + 'Logs</button>' +
      '<button class="btn btn-outline btn-sm" data-dev="t" data-arg="copysave">' + ic('copy') + 'Copy save JSON</button>' +
      '<button class="btn btn-outline btn-sm" data-dev="t" data-arg="sync">' + ic('upload') + 'Sync online now</button>' +
      '<button class="btn btn-outline btn-sm" data-dev="t" data-arg="update">' + ic('download') + 'Check for update</button>' +
      '<button class="btn btn-outline btn-sm" data-dev="copy" data-arg="' + esc(C.uid()) + '">' + ic('user') + 'Copy my UID</button>' +
      '<button class="btn btn-outline btn-sm" data-dev="t" data-arg="selfgift">' + ic('gift') + 'Send myself a test gift</button>' +
      '</div></div>';
    h += '<div class="dev-card"><h5>' + ic('info') + 'Status</h5>' + [['Version', BZ.VERSION], ['Signed in as', C.email()], ['UID', C.uid()], ['Firebase admin rights', D.admin ? 'yes' : 'no'], ['Online error', (BZ.Online && BZ.Online.error) || 'none']].map(x => '<div class="kv"><span>' + x[0] + '</span><span class="num dev-break">' + esc(x[1]) + '</span></div>').join('') + '</div>';
    return h;
  }

  function html() {
    const s = BZ.Game.main;
    const tabs = [['me', 'My save'], ['people', 'Players'], ['tools', 'Tools']];
    let h = '<div class="dev"><div class="dev-head"><h4>' + ic('settings') + 'Developer options</h4><button class="wm-x dev-x" data-dev="close">' + ic('close') + '</button></div>';
    h += '<div class="seg dev-seg">' + tabs.map(x => '<button data-dev="tab" data-arg="' + x[0] + '" class="' + (D.tab === x[0] ? 'on' : '') + '">' + x[1] + '</button>').join('') + '</div>';
    if (D.msg) h += '<div class="dev-msg">' + esc(D.msg) + '</div>';
    h += D.tab === 'me' ? meTab(s) : D.tab === 'people' ? peopleTab() : toolsTab();
    return h + '</div>';
  }

  function keep() {
    const out = {};
    document.querySelectorAll('.dev [id]').forEach(el => { if ('value' in el) out[el.id] = el.value; });
    return out;
  }
  D.render = function () {
    const m = document.querySelector('#modal .modal.dev-modal');
    if (!m) return;
    const k = keep(), top = m.scrollTop;
    m.innerHTML = html();
    for (const id in k) { const el = document.getElementById(id); if (el) el.value = k[id]; }
    filter();
    m.scrollTop = top;
  };
  D.open = function () {
    if (!D.ok) return;
    D.msg = '';
    UI.modal(html(), true);
    const m = document.querySelector('#modal .modal');
    if (m) m.classList.add('dev-modal');
  };
  function filter() {
    const q = val('devSearch').trim().toLowerCase();
    document.querySelectorAll('.dev-p').forEach(b => { b.style.display = !q || b.dataset.q.includes(q) ? '' : 'none'; });
  }
  function say(msg) { D.msg = msg; D.render(); if (BZ.Log) BZ.Log.info('dev: ' + msg); }
  function done(msg) {
    const s = BZ.Game.main;
    E.recalc(s);
    UI.structureChanged();
    UI.render();
    BZ.Game.save();
    say(msg);
  }
  async function run(label, fn) {
    if (D.busy) return;
    D.busy = true;
    D.msg = label + '...';
    D.render();
    try { const r = await fn(); say(r || label + ': done'); }
    catch (e) { say(label + ' failed: ' + (e && e.message || e)); }
    finally { D.busy = false; }
  }

  function quick(a) {
    const s = BZ.Game.main;
    switch (a) {
      case 'lucky': s.luckyOn = null; s.luckyT = 0.01; return done('Lucky bee on its way');
      case 'red': s.luckyOn = { t: 12, max: 12, red: true }; E.emit(s, 'luckySpawn', s.luckyOn); return done('Red lucky bee spawned');
      case 'ticketbee': s.ticketOn = null; s.ticketT = 0.01; return done('Ticket bee on its way');
      case 'bless': P.blessOffer(s); UI.closeModal(); UI.showBless(); return;
      case 'boost': E.addBoost(s, 'x2'); return done('x2 honey for 30 minutes');
      case 'boosts': ['x4', 'xp2', 'luck', 'lg2', 'stone'].forEach(id => E.addBoost(s, id)); return done('Every new boost added');
      case 'gift': delete s.flags.loginDay; delete s.flags.loginOffer; UI.closeModal(); setTimeout(() => BZ.Welcome && BZ.Welcome.check(), 300); return;
      case 'boss': if (s.event) s.event.done = 0; return done('You can fight the boss again today');
      case 'skip': E.offline(s, 3600); s.lastSave = Date.now(); return done('Skipped 1 hour');
      case 'trees': BZ.ESSENCE_SHOP.forEach(x => { s.essShop[x.id] = x.max; }); return done('Every essence tree maxed');
      case 'notrees': s.essShop = {}; return done('Essence trees reset');
      case 'worlds': BZ.WORLDS.forEach((w, i) => { if (!s.worldsOpen.includes(i)) s.worldsOpen.push(i); }); s.flags.worlds = 1; return done('Every world open');
      case 'bees': BZ.BEES.forEach(b => { s.bees[b.id] = (s.bees[b.id] || 0) + 1; }); return done('One of every bee added');
      case 'cores': (BZ.CORES || []).forEach(c => { s.cores[c.id] = (s.cores[c.id] || 0) + 1; }); return done('One of every core added');
      case 'wheel': UI.closeModal(); UI.rubyRoll({ x: BZ.RUBY[1 + Math.floor(Math.random() * (BZ.RUBY.length - 1))], got: [], world: s.world }); return;
      case 'jackpot': UI.closeModal(); UI.rubyRoll({ x: BZ.RUBY[0], got: [], world: s.world }); return;
      case 'wn': UI.closeModal(); UI.whatsNew(); return;
      case 'wnreset': s.flags.seenVersion = ''; return done('What’s new banner will show again');
    }
  }

  async function tool(a) {
    const s = BZ.Game.main, C = BZ.Cloud;
    if (a === 'logs') { UI.modal('<h4>Logs</h4><div class="logs">' + esc(BZ.Log.lines.slice(-120).join('\n')) + '</div><div class="row"><button class="btn btn-primary" data-close>OK</button></div>', true); return; }
    if (a === 'copysave') return run('Copy save', async () => { await navigator.clipboard.writeText(JSON.stringify(BZ.Store.serialize(s))); return 'Save copied to the clipboard'; });
    if (a === 'sync') return run('Sync', async () => { const ok = await BZ.Online.sync(s); return ok ? 'Synced online' : 'Sync did not finish: ' + (BZ.Online.error || (BZ.Online.banned ? 'banned' : 'busy')); });
    if (a === 'update') { BZ.Game.checkVersion(); return say('Checked. A refresh banner appears only if a newer version is online.'); }
    if (a === 'selfgift') return run('Test gift', async () => { await C.admin.gift(C.uid(), { egg: 1, note: 'Test gift' }); await BZ.Online.applyGifts(s); return BZ.Online.giftCount ? 'Test gift sent and received (+1 egg ticket)' : 'Gift sent, but could not be read back. Check the rules.'; });
  }

  async function act(a, arg) {
    const s = BZ.Game.main, C = BZ.Cloud, A = C.admin;
    const p = D.sel;
    switch (a) {
      case 'open': return D.open();
      case 'close': return UI.closeModal();
      case 'tab': D.tab = arg; D.msg = ''; return D.render();
      case 'give': case 'take': {
        const amt = parseAmt(val('devAmt')), key = val('devRes');
        if (!amt) return say('Enter an amount');
        if (a === 'take' && key === 'parts') return say('Skin parts can only be given');
        P.applyGift(s, toGift(key, a === 'give' ? amt : -amt));
        return done((a === 'give' ? 'Gave ' : 'Took ') + F.num(amt) + ' ' + RES.find(r => r[0] === key)[1].toLowerCase());
      }
      case 'q': return quick(arg);
      case 'op': {
        const op = val('devMOp'), kind = P.DEV_OPS[op] || '';
        if (kind.includes('amt') && val('devMOAmt') === '') return say('Enter an amount');
        if (op === 'resetWorld' || op === 'closeWorld') { if (!confirm(OPS.find(o => o[0] === op)[1] + ': ' + BZ.n(BZ.WORLDS[+val('devMTgt')].name) + '?')) return; }
        const ns = P.applyOp(s, op, val('devMTgt'), parseAmt(val('devMOAmt')));
        if (ns !== s) { BZ.Game.main = ns; BZ.Game.refreshScene(); }
        return done(OPS.find(o => o[0] === op)[1] + ': done');
      }
      case 't': return tool(arg);
      case 'copy': try { await navigator.clipboard.writeText(arg); say('Copied'); } catch (e) { say('Could not copy: ' + arg); } return;
      case 'recheck': return run('Check rights', async () => { D.admin = await C.isAdmin().catch(() => false); return D.admin ? 'Admin rights found' : 'Still no admin rights'; });
      case 'load': return run('Load players', async () => { D.players = await C.top('honey', 200); D.banned = await A.bannedList().catch(() => []); return D.players.length + ' players loaded'; });
      case 'pick': D.sel = (D.players || []).find(x => x.uid === arg) || null; D.selSave = null; D.selGroups = null; D.msg = ''; D.render(); if (D.sel) A.groupsOf(D.sel.uid).then(g => { D.selGroups = g; D.render(); }).catch(() => {}); return;
      case 'unpick': D.sel = null; return D.render();
    }
    if (!p && a[0] === 'p') return;
    switch (a) {
      case 'pgive': case 'ptake': {
        const amt = parseAmt(val('devGAmt')), key = val('devGRes'), note = val('devGNote').trim();
        if (!amt) return say('Enter an amount');
        if (a === 'ptake' && key === 'parts') return say('Skin parts can only be given');
        const g = toGift(key, a === 'pgive' ? amt : -amt);
        if (note) g.note = note;
        return run((a === 'pgive' ? 'Give to ' : 'Take from ') + p.name, async () => { await A.gift(p.uid, g); return (a === 'pgive' ? 'Gift sent to ' : 'Removal sent to ') + p.name; });
      }
      case 'pop': {
        const op = val('devPOp'), kind = P.DEV_OPS[op] || '';
        const g = { op, target: val('devPTgt'), amt: parseAmt(val('devPOAmt')) };
        const note = val('devGNote').trim();
        if (note) g.note = note;
        if (kind.includes('amt') && val('devPOAmt') === '') return say('Enter an amount');
        return run(OPS.find(o => o[0] === op)[1] + ' for ' + p.name, async () => { await A.gift(p.uid, g); return OPS.find(o => o[0] === op)[1] + ': sent to ' + p.name; });
      }
      case 'psave': return run('Load save', async () => { D.selSave = (await A.save(p.uid)) || false; return 'Save loaded'; });
      case 'prename': return run('Reset name', async () => { const nm = 'Bee ' + (1000 + Math.floor(Math.random() * 9000)); await A.rename(p.uid, nm).catch(() => {}); await A.gift(p.uid, { rename: 1 }); p.name = nm; return 'Name reset to ' + nm; });
      case 'ppoints': return run('Reset points', async () => { const gs = D.selGroups || await A.groupsOf(p.uid); for (const g of gs) await A.setPoints(g.gid, p.uid, 0); await A.gift(p.uid, { lgReset: 1 }); D.selGroups = await A.groupsOf(p.uid); return 'League points reset for ' + p.name; });
      case 'pkick': return run('Remove from group', async () => { const gs = D.selGroups || await A.groupsOf(p.uid); for (const g of gs) await A.kick(g.gid, p.uid); await A.gift(p.uid, { lgKick: 1 }); D.selGroups = []; return p.name + ' removed from league groups'; });
      case 'pdrop': return run('Remove from rankings', async () => { await A.dropPlayer(p.uid); D.players = D.players.filter(x => x.uid !== p.uid); return p.name + ' removed from rankings (they come back on their next sync unless banned)'; });
      case 'pban':
        if (!confirm('Ban ' + p.name + ' from online features (league, rankings)?')) return;
        return run('Ban', async () => {
          await A.ban(p.uid, p.name);
          const gs = await A.groupsOf(p.uid).catch(() => []);
          for (const g of gs) await A.kick(g.gid, p.uid).catch(() => {});
          await A.dropPlayer(p.uid).catch(() => {});
          D.banned = await A.bannedList().catch(() => D.banned);
          return p.name + ' banned';
        });
      case 'punban': return run('Unban', async () => { await A.unban(p.uid); D.banned = await A.bannedList().catch(() => D.banned); return p.name + ' unbanned'; });
    }
    if (a === 'unbanid') return run('Unban', async () => { await A.unban(arg); D.banned = await A.bannedList().catch(() => D.banned); return 'Unbanned'; });
  }

  document.addEventListener('click', e => {
    const el = e.target.closest('[data-dev]');
    if (!el || !D.ok) return;
    e.preventDefault();
    e.stopPropagation();
    act(el.dataset.dev, el.dataset.arg);
  }, true);
  document.addEventListener('input', e => { if (e.target && e.target.id === 'devSearch') filter(); });
  document.addEventListener('change', e => {
    const el = e.target;
    if (!el || !el.dataset || !el.dataset.devop) return;
    if (el.dataset.devop === 'devM') D.op = el.value; else D.pop = el.value;
    const k = el.dataset.devop;
    D.render();
    const t = document.getElementById(k + 'Tgt');
    if (t) t.selectedIndex = 0;
  });
})(window);
