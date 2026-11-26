(function (root) {
  const BZ = root.BZ;
  const E = BZ.E, F = BZ.F, M = BZ.Meta, t = BZ.t, n = BZ.n, ic = BZ.icon;
  const UI = BZ.UI = {};
  const $ = id => document.getElementById(id);

  const TABS = [
    { id: 'hive', icon: 'hive' },
    { id: 'queen', icon: 'crown' },
    { id: 'bees', icon: 'worker' },
    { id: 'workshop', icon: 'palette' },
    { id: 'daily', icon: 'calendar' },
    { id: 'pass', icon: 'ticket' },
    { id: 'worlds', icon: 'globe' },
    { id: 'league', icon: 'league' },
    { id: 'event', icon: 'boss' },
    { id: 'trophies', icon: 'trophy' },
    { id: 'stats', icon: 'chart' },
    { id: 'settings', icon: 'settings' },
    { id: 'about', icon: 'info' }
  ];
  const LUCKY_ICON = { rush: 'bolt', harvest: 'drop', frenzy: 'tap', ticket: 'ticket', chest: 'gift' };
  const BOOST_ICON = { x2: 'bolt', luckyswarm: 'sparkle', dance: 'music', adx2: 'ad' };

  let G = null;
  let page = 'hive';
  let buyMode = 1;
  let selUpg = null;
  let selAch = null;
  let hiveKey = '';
  let upgKey = '';
  let rows = {};
  let lastFast = 0, lastSlow = 0;
  let pageDirty = true;
  let lastHoneyTxt = '', lastHpsTxt = '';

  function fox(mood) {
    const eyes = mood === 'oops'
      ? '<circle cx="76" cy="110" r="6" fill="#20252B"/><circle cx="124" cy="110" r="6" fill="#20252B"/><path d="M66 96L84 100M134 96L116 100" stroke="#20252B" stroke-width="4" stroke-linecap="round"/>'
      : mood === 'happy'
        ? '<path d="M67 113Q76 101 85 113M115 113Q124 101 133 113" stroke="#20252B" stroke-width="5" stroke-linecap="round" fill="none"/>'
        : '<ellipse cx="76" cy="110" rx="7" ry="9" fill="#20252B"/><ellipse cx="124" cy="110" rx="7" ry="9" fill="#20252B"/><circle cx="78.5" cy="106" r="2.4" fill="#FFFFFF"/><circle cx="126.5" cy="106" r="2.4" fill="#FFFFFF"/>';
    const id = 'fx' + Math.random().toString(36).slice(2, 7);
    return '<svg class="fox" viewBox="20 14 160 168" aria-hidden="true"><defs><clipPath id="' + id + '"><path d="M100 58C140 58 172 80 170 112C168 136 130 160 100 174C70 160 32 136 30 112C28 80 60 58 100 58Z"/></clipPath></defs>' +
      '<path d="M52 92C44 60 46 34 58 22C72 30 88 50 96 70Z" fill="#F28C28"/><path d="M148 92C156 60 154 34 142 22C128 30 112 50 104 70Z" fill="#F28C28"/>' +
      '<path d="M60 80C56 60 58 44 63 36C72 44 80 56 86 68Z" fill="#20252B"/><path d="M140 80C144 60 142 44 137 36C128 44 120 56 114 68Z" fill="#20252B"/>' +
      '<path d="M100 58C140 58 172 80 170 112C168 136 130 160 100 174C70 160 32 136 30 112C28 80 60 58 100 58Z" fill="#F28C28"/>' +
      '<path clip-path="url(#' + id + ')" d="M100 180C82 168 50 150 36 124C58 128 80 122 100 136C120 122 142 128 164 124C150 150 118 168 100 180Z" fill="#F5F3EF"/>' +
      '<path d="M100 74C101 81 103 83 110 84C103 85 101 87 100 94C99 87 97 85 90 84C97 83 99 81 100 74Z" fill="#F5F3EF"/>' + eyes +
      '<ellipse cx="100" cy="163" rx="9" ry="6.5" fill="#20252B"/></svg>';
  }
  UI.fox = fox;

  function morphNode(from, to) {
    if (from.nodeType !== to.nodeType || from.nodeName !== to.nodeName) { from.replaceWith(to); return; }
    if (from.nodeType !== 1) { if (from.nodeValue !== to.nodeValue) from.nodeValue = to.nodeValue; return; }
    const fa = from.attributes;
    for (let i = fa.length - 1; i >= 0; i--) { const nm = fa[i].name; if (!to.hasAttribute(nm)) from.removeAttribute(nm); }
    const ta = to.attributes;
    for (let i = 0; i < ta.length; i++) { const a = ta[i]; if (from.getAttribute(a.name) !== a.value) from.setAttribute(a.name, a.value); }
    if (from.tagName === 'INPUT') {
      if (from.type === 'checkbox') from.checked = to.hasAttribute('checked');
      else if (document.activeElement !== from) from.value = to.getAttribute('value') || '';
    }
    if (from.tagName === 'TEXTAREA' && document.activeElement === from) return;
    morphKids(from, to);
  }
  function morphKids(from, to) {
    const fc = Array.from(from.childNodes), tc = Array.from(to.childNodes);
    for (let i = 0; i < tc.length; i++) {
      if (i < fc.length) morphNode(fc[i], tc[i]);
      else from.appendChild(tc[i]);
    }
    for (let i = fc.length - 1; i >= tc.length; i--) fc[i].remove();
  }
  function morph(container, html) {
    const tpl = document.createElement('template');
    tpl.innerHTML = html;
    morphKids(container, tpl.content);
    container.querySelectorAll('*').forEach(el => { if (el._v !== undefined) el._v = undefined; });
  }
  UI.morph = morph;

  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const S = () => G.cur();
  const prodName = id => n(BZ.PRODUCERS.find(p => p.id === id).name);

  UI.init = function (game) {
    G = game;
    $('powered').innerHTML = fox('default') + t('powered');
    $('loadLabel').textContent = t('loading');
    const tips = ['tip_1', 'tip_2', 'tip_3', 'tip_4', 'tip_5'];
    $('splashTip').textContent = t(tips[Math.floor(Math.random() * tips.length)]);
    $('menuBtn').innerHTML = ic('menu');
    $('menuBtn').onclick = () => drawer(true);
    $('scrim').onclick = () => drawer(false);
    $('panel').addEventListener('click', onPanelClick);
    $('panel').addEventListener('contextmenu', e => {
      const el = e.target.closest('[data-act="buy"]');
      if (!el) return;
      e.preventDefault();
      BZ.Audio.unlock();
      G.buyProducer(el.dataset.arg, buyMode, el);
    });
    $('panel').addEventListener('change', onPanelChange);
    $('panel').addEventListener('input', onPanelInput);
    $('modal').addEventListener('click', e => { if (e.target.id === 'modal' && UI.modalDismiss) UI.closeModal(); });
    document.addEventListener('keydown', onKey);
    UI.buildChrome();
    addEventListener('resize', UI.fitTabs);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(UI.fitTabs);
  };
  UI.fitTabs = function () {
    const bar = document.querySelector('.topbar'), tabs = $('tabs');
    if (!bar || !tabs) return;
    bar.classList.remove('t-icons', 't-menu');
    if (innerWidth <= 999) return;
    if (tabs.scrollWidth > tabs.clientWidth + 1) bar.classList.add('t-icons');
    if (tabs.scrollWidth > tabs.clientWidth + 1) bar.classList.add('t-menu');
  };

  const visibleTabs = () => TABS.filter(x => !['league', 'event'].includes(x.id) || (BZ.Cloud && BZ.Cloud.configured()));
  UI.buildChrome = function () {
    const TABS = visibleTabs();
    $('brand').innerHTML = BZ.appIconSvg(28) + '<div><span>Buzz</span><b>works</b></div>';
    $('tabs').innerHTML = TABS.map(x => '<button data-tab="' + x.id + '" title="' + t('tab_' + x.id) + '" class="' + (x.id === page ? 'on' : '') + '">' + ic(x.icon) + '<span class="tl">' + t('tab_' + x.id) + '</span></button>').join('') + (UI.wnTabHtml ? UI.wnTabHtml() : '');
    $('tabs').querySelectorAll('button[data-tab]').forEach(b => { b.onclick = () => UI.show(b.dataset.tab); });
    $('drawer').innerHTML = '<div class="who">' + BZ.appIconSvg(36) + '<div><span>Buzz</span><b>works</b></div></div>' +
      TABS.map(x => '<button class="link' + (x.id === page ? ' on' : '') + '" data-tab="' + x.id + '">' + ic(x.icon) + t('tab_' + x.id) + '</button>').join('') +
      '<div class="foot">v' + BZ.VERSION + '</div>';
    $('drawer').querySelectorAll('button.link').forEach(b => { b.onclick = () => { UI.show(b.dataset.tab); drawer(false); }; });
    $('stageBtns').innerHTML = '<button class="fab bless-fab" id="blessBtn" title="' + t('bless_pending') + '" style="display:none">' + ic('sparkle') + '</button><button class="fab ad-fab" id="adBtn" title="' + t('ad_boost') + '">' + ic('ad') + '</button><button class="fab" id="danceBtn" title="' + t('shop_free') + '">' + ic('music') + '</button>';
    $('blessBtn').onclick = () => { if (UI.showBless) UI.showBless(); };
    $('adBtn').onclick = () => G.adBoost();
    $('danceBtn').onclick = () => G.dance();
    document.documentElement.lang = BZ.lang;
    hiveKey = ''; upgKey = '';
    pageDirty = true;
    requestAnimationFrame(UI.fitTabs);
  };

  function drawer(open) {
    $('drawer').classList.toggle('open', open);
    $('scrim').classList.toggle('open', open);
  }

  UI.show = function (p) {
    if (!BZ.P.unlocked(G.main, p)) { BZ.Audio.play('error'); UI.toast('lock', BZ.P.lockText(G.main, p)); return; }
    page = p;
    document.querySelectorAll('[data-tab]').forEach(b => b.classList.toggle('on', b.dataset.tab === p));
    selUpg = null; selAch = null;
    pageDirty = true;
    hiveKey = ''; upgKey = '';
    $('panel').scrollTop = 0;
    BZ.Audio.play('click');
    UI.render();
  };
  UI.page = () => page;
  UI.dirty = function (which) { if (!which || which === page) pageDirty = true; };
  UI.structureChanged = function () { hiveKey = ''; upgKey = ''; pageDirty = true; };

  UI.render = function () {
    pageDirty = false;
    const panel = $('panel');
    if (page === 'hive') { renderHive(); return; }
    const html = ((UI.ext && UI.ext[page]) || ({ queen: pageQueen, bees: pageBees, daily: pageDaily, trophies: pageTrophies, settings: pageSettings })[page])();
    const cur = panel.firstElementChild;
    if (cur && cur.dataset.page === page && panel.children.length === 1) morph(cur, html);
    else panel.innerHTML = '<div class="page on" data-page="' + page + '">' + html + '</div>';
    liveUpdate();
  };

  function upgIcon(u) {
    if (u.kind === 'prod') return ic(u.target) + '<em>' + (u.tier + 1) + '</em>';
    if (u.kind === 'synergy') return ic(u.source) + '<em>+</em>';
    if (u.kind === 'tap') return ic('tap');
    if (u.kind === 'lucky') return ic('sparkle');
    return ic('flower');
  }
  function upgDesc(u) {
    if (u.kind === 'prod') return t('u_prod', { p: prodName(u.target) });
    if (u.kind === 'synergy') return t('u_syn', { t: prodName(u.target), s: prodName(u.source).toLowerCase() });
    if (u.kind === 'tap') return u.flat ? t('u_tap_flat') : u.tmult > 1 ? t('u_tap_mult', { m: 'x' + u.tmult }) : t('u_tap_pct');
    if (u.kind === 'lucky') return u.freq > 1 ? t('u_lucky_freq') : t('u_lucky_dur');
    return t('u_glob');
  }

  function visibleProducers(s) {
    const list = BZ.PRODUCERS;
    const out = [];
    for (let i = 0; i < list.length; i++) {
      const p = list[i];
      if ((s.owned[p.id] || 0) > 0 || i === 0) { out.push(p); continue; }
      const prev = list[i - 1];
      if ((s.owned[prev.id] || 0) > 0 || s.runHoney >= p.cost * 0.3) { out.push(p); continue; }
      out.push(Object.assign({ locked: true }, p));
      break;
    }
    return out;
  }

  function renderHive() {
    const s = S();
    const vis = visibleProducers(s);
    const key = s.world + ':' + BZ.lang + ':' + vis.map(p => p.id + (p.locked ? 'L' : '')).join(',');
    const panel = $('panel');
    if (key !== hiveKey || !panel.querySelector('[data-page="hive"]')) {
      hiveKey = key;
      upgKey = '';
      const modes = [1, 10, 100, 'next', 'max'];
      const hiveHtml =
        (UI.promoHtml ? UI.promoHtml() : '') +
        '<div class="sec-title"><h3>' + t('upgrades') + '</h3><span id="buyAll"></span></div>' +
        '<div class="upg-grid" id="upgGrid"></div><div id="upgDetail"></div>' +
        '<div class="buybar sec"><h3>' + t('producers') + '</h3><div class="seg" id="buySeg">' +
        modes.map(m => '<button data-act="mode" data-arg="' + m + '" class="' + (String(m) === String(buyMode) ? 'on' : '') + '">' + (m === 'next' ? t('next') : m === 'max' ? t('max') : 'x' + m) + '</button>').join('') +
        '</div></div><div class="prod-list" id="prodList">' +
        vis.map(p => p.locked
          ? '<div class="prod locked" data-pid="' + p.id + '"><div class="pic">' + ic('lock') + '</div><div class="info"><b>' + n(p.name) + '</b><small>' + t('unlock_at', { v: F.num(p.cost * 0.3) }) + '</small></div><div class="cost"><b class="num">' + F.num(E.unitCost(s, p.id)) + '</b><small>' + t('locked') + '</small></div></div>'
          : '<div class="prod" data-act="buy" data-arg="' + p.id + '" data-pid="' + p.id + '"><div class="pic">' + ic(p.id) + '<span class="count num">0</span></div><div class="info"><b>' + n(p.name) + '</b><small class="num">-</small><div class="ms-row"><div class="ms"><i></i></div><em class="num">-</em></div></div><div class="cost"><b class="num">-</b><small>-</small></div></div>').join('') +
        '</div>';
      const curHive = panel.firstElementChild;
      if (curHive && curHive.dataset.page === 'hive' && panel.children.length === 1) morph(curHive, hiveHtml);
      else panel.innerHTML = '<div class="page on" data-page="hive">' + hiveHtml + '</div>';
      rows = {};
      panel.querySelectorAll('.prod[data-act]').forEach(el => {
        rows[el.dataset.pid] = { el, count: el.querySelector('.count'), rate: el.querySelector('.info small'), bar: el.querySelector('.ms i'), msl: el.querySelector('.ms-row em'), cost: el.querySelector('.cost b'), sub: el.querySelector('.cost small'), last: {} };
      });
    }
    updateHive();
  }

  function setText(el, v) { if (el && el._v !== v) { el._v = v; el.textContent = v; } }
  function setCls(el, c, on) { if (el && el.classList.contains(c) !== !!on) el.classList.toggle(c, !!on); }

  function updateHive() {
    const s = S();
    const c = E.cache(s);
    const temp = E.tempMult(s);
    const total = Math.max(1e-9, c.baseHps);
    for (const id in rows) {
      const r = rows[id];
      const o = s.owned[id] || 0;
      const amt = E.buyAmount(s, id, buyMode);
      const cost = E.cost(s, id, amt);
      setText(r.count, F.num(o, { int: true, compact: true }));
      const rate = c.rate[id] * temp;
      if (!r.p) r.p = BZ.PRODUCERS.find(p => p.id === id);
      setText(r.rate, o > 0 ? t('per_sec_short', { v: F.num(rate) }) + (c.rate[id] / total >= 0.005 ? '  ·  ' + F.pct(c.rate[id] / total) : '') : '+' + t('per_sec_short', { v: F.num(r.p.prod * c.prodMult[id] * c.global * temp) }));
      const prev = E.prevMilestone(o), next = E.nextMilestone(o);
      r.bar.style.width = Math.min(100, (o - prev) / Math.max(1, next - prev) * 100).toFixed(1) + '%';
      setText(r.cost, F.num(cost));
      setText(r.sub, t('buy_x', { n: F.int(amt) }));
      setText(r.msl, t('next_milestone', { n: next }));
      setCls(r.el, 'can', s.honey >= cost * (1 - 1e-9));
      setCls(r.el, 'tut', UI.tutorialTarget === id);
    }
    const avail = E.availableUpgrades(s);
    const gw = $('panel').clientWidth - 48;
    const cols = Math.max(4, Math.floor((gw + 8) / 56));
    const slots = Math.min(24, cols * 2);
    const shown = avail.slice(0, slots);
    const key = shown.map(u => u.id).join(',') + ':' + BZ.lang + ':' + cols;
    const grid = $('upgGrid');
    if (!grid) return;
    if (key !== upgKey) {
      upgKey = key;
      if (selUpg && !shown.some(u => u.id === selUpg)) selUpg = null;
      grid.style.gridTemplateColumns = 'repeat(' + Math.min(cols, slots) + ', 1fr)';
      morph(grid, shown.map(u => '<button class="upg" data-act="upg" data-arg="' + u.id + '" title="' + esc(n(u.name)) + '">' + upgIcon(u) + '</button>').join('') + '<span class="upg empty"></span>'.repeat(Math.max(0, slots - shown.length)));
      renderUpgDetail();
    }
    let affordable = 0;
    const curSel = selUpg || (shown[0] && shown[0].id);
    grid.querySelectorAll('.upg[data-arg]').forEach(b => {
      const u = BZ.UPGRADE_BY_ID[b.dataset.arg];
      const can = s.honey >= u.cost;
      if (can) affordable++;
      setCls(b, 'can', can);
      setCls(b, 'sel', curSel === u.id);
    });
    const ba = $('buyAll');
    const want = affordable >= 2 ? '<button class="btn btn-outline btn-sm" data-act="upgall">' + t('buy') + ' ' + affordable + '</button>' : '';
    if (ba._v !== want) { ba._v = want; ba.innerHTML = want; }
    const det = $('upgDetail');
    if (det) {
      const btn = det.querySelector('[data-act="upgbuy"]');
      if (btn) { const u = BZ.UPGRADE_BY_ID[btn.dataset.arg]; setCls(btn, 'off', s.honey < u.cost); }
    }
  }

  function renderUpgDetail() {
    const det = $('upgDetail');
    if (!det) return;
    const s = S();
    const avail = E.availableUpgrades(s);
    if (!avail.length) { morph(det, '<div class="empty-line">' + t('no_upgrades') + '</div>'); return; }
    const u = BZ.UPGRADE_BY_ID[selUpg] || avail[0];
    morph(det, '<div class="upg-detail"><div class="txt"><b>' + esc(n(u.name)) + '</b><small>' + esc(upgDesc(u)) + '</small></div><button class="btn btn-primary btn-sm num" data-act="upgbuy" data-arg="' + u.id + '">' + ic('drop') + F.num(u.cost) + '</button></div>');
  }


  function beeSvg(b, size, locked) {
    const c0 = locked ? 'var(--border)' : b.c[0], c1 = locked ? 'var(--text-faint)' : b.c[1];
    const id = 'bc' + b.id + (locked ? 'l' : '') + Math.random().toString(36).slice(2, 6);
    return '<svg viewBox="0 0 64 64" width="' + size + '" height="' + size + '" aria-hidden="true">' +
      (b.r >= 3 && !locked ? '<circle cx="32" cy="34" r="27" fill="' + b.c[0] + '" opacity="0.18"/>' : '') +
      '<ellipse cx="26" cy="20" rx="9" ry="13" transform="rotate(-25 26 20)" fill="#fff" opacity="' + (locked ? 0.35 : 0.85) + '" stroke="' + c1 + '" stroke-opacity="0.25"/>' +
      '<ellipse cx="38" cy="19" rx="8" ry="12" transform="rotate(20 38 19)" fill="#fff" opacity="' + (locked ? 0.35 : 0.85) + '" stroke="' + c1 + '" stroke-opacity="0.25"/>' +
      '<clipPath id="' + id + '"><ellipse cx="30" cy="38" rx="17" ry="13"/></clipPath>' +
      '<ellipse cx="30" cy="38" rx="17" ry="13" fill="' + c0 + '"/>' +
      '<g clip-path="url(#' + id + ')" fill="' + c1 + '"><rect x="20" y="20" width="5" height="36"/><rect x="30" y="20" width="5" height="36"/></g>' +
      '<circle cx="48" cy="35" r="8" fill="' + c1 + '"/>' +
      (locked ? '' : '<circle cx="50.5" cy="32.5" r="2.2" fill="#fff"/>') +
      '<path d="M13 38 7 40l6 3Z" fill="' + c1 + '"/>' +
      '<path d="M51 28c2-5 5-7 8-7M47 27c0-5 2-8 4-10" stroke="' + c1 + '" stroke-width="1.8" fill="none" stroke-linecap="round"/>' +
      (b.r >= 3 && !locked ? '<path d="M40 14l3-6 3 4 3-5 2 7Z" fill="#FFD45E" stroke="#B8860B" stroke-width="1"/>' : '') +
      '</svg>';
  }
  UI.beeSvg = beeSvg;
  function bonusText(kind, v) {
    return t('bk_' + kind, { v: kind === 'combo' ? F.num(v) : F.pct(v) });
  }
  UI.bonusText = bonusText;

  function pageBees() {
    const s = G.main;
    const found = BZ.BEES.filter(b => s.bees && s.bees[b.id]).length;
    const bb = E.beeBonus(s);
    let h = UI.title(t('bees_title'), 'bees_how');
    h += UI.hatcheryHtml(s);
    h += '<div class="card"><div class="big-stat"><div class="pic">' + ic('worker') + '</div><div><b class="num">' + found + ' / ' + BZ.BEES.length + '</b><small>' + t('bees_found', { n: found, t: BZ.BEES.length }) + '</small></div></div>';
    const lines = Object.keys(bb).filter(k => bb[k] > 0).map(k => '<span class="badge b-orange">' + bonusText(k, bb[k]) + '</span>');
    h += lines.length ? '<div class="bee-bonus">' + lines.join('') + '</div>' : '<p class="faint" style="font-size:var(--fs-sm);margin-top:var(--sp-4)">' + t('bees_none') + '</p>';
    h += '</div><div class="sec"><div class="bees">';
    for (const b of BZ.BEES) {
      const cnt = (s.bees && s.bees[b.id]) || 0;
      const lvl = E.beeLevel(s, b.id);
      const rar = BZ.RARITIES[b.r];
      if (!cnt) {
        h += '<div class="bee locked"><div class="art">' + beeSvg(b, 60, true) + '</div><b>?</b><span class="rar" style="color:' + rar.color + '">' + n(rar.name) + '</span></div>';
        continue;
      }
      const nextAt = BZ.BEE_LEVELS[lvl];
      const prevAt = BZ.BEE_LEVELS[lvl - 1] || 0;
      const prog = nextAt ? (cnt - prevAt) / (nextAt - prevAt) : 1;
      h += '<div class="bee" style="--rc:' + rar.color + '"><div class="art">' + beeSvg(b, 60) + '<span class="lv">' + lvl + '</span></div><b>' + n(b.name) + '</b><span class="rar" style="color:' + rar.color + '">' + n(rar.name) + '</span><small>' + bonusText(b.kind, b.v * lvl) + '</small>' +
        '<div class="progress"><i style="width:' + (prog * 100).toFixed(0) + '%"></i></div><small class="faint">' + (nextAt ? t('bee_next', { n: nextAt - cnt }) : t('maxed')) + '</small></div>';
    }
    h += '</div></div>';
    return h;
  }

  UI.title = (txt, help) => '<h2 class="page-title">' + txt + (help ? '<button class="help-btn" data-act="help" data-arg="' + help + '" title="' + t('help') + '">' + ic('info') + '</button>' : '') + '</h2>';

  UI.beeModal = function (res) {
    const b = BZ.BEE_BY_ID[res.id];
    const rar = BZ.RARITIES[b.r];
    const title = res.isNew ? t('bee_new') : res.levelUp ? t('bee_level') : t('bee_copy');
    const html = '<div class="hero"><div class="bee-hero" style="--rc:' + rar.color + '">' + beeSvg(b, 96) + '</div><h4>' + esc(title) + '</h4><b style="font-size:var(--fs-xl)">' + esc(n(b.name)) + '</b><p style="margin-top:var(--sp-3)"><span class="badge" style="background:color-mix(in srgb,' + rar.color + ' 18%,transparent);color:' + rar.color + '">' + n(rar.name) + '</span> <span class="badge b-orange">' + t('level', { n: res.level }) + '</span></p><p style="margin-top:var(--sp-3)">' + esc(bonusText(b.kind, b.v * res.level)) + '</p></div><div class="row center"><button class="btn btn-primary" data-close>' + t('ok') + '</button></div>';
    UI.queueModal(html);
  };

  const modalQueue = [];
  UI.queueModal = function (html) {
    if (UI.modalOpen()) { modalQueue.push(html); return; }
    UI.modal(html, true);
  };
  UI.nextQueued = function () {
    if (modalQueue.length && !UI.modalOpen()) UI.modal(modalQueue.shift(), true);
  };

  let renderedPend = -1;
  function pageQueen() {
    const s = G.main;
    const pend = E.pendingRJ(s);
    renderedPend = pend;
    const w = E.rjWisdom(s);
    const need = k => Math.max(BZ.RJ_MIN, Math.pow(k / (BZ.RJ_SCALE * w), 1 / BZ.RJ_POWER) * BZ.RJ_DIVISOR);
    const needNext = need(pend + 1);
    const needCur = pend > 0 ? need(pend) : 0;
    const prog = (s.runHoney - needCur) / Math.max(1, needNext - needCur);
    const after = (1 + BZ.RJ_BONUS * Math.pow(s.rjEarned + pend, BZ.RJ_CURVE)) / E.rjMult(s);
    let h = '<h2 class="page-title">' + t('tab_queen') + '</h2>';
    h += '<div class="card"><div class="big-stat"><div class="pic">' + ic('jelly') + '</div><div><b class="num" data-live="rj">' + F.num(s.rj) + '</b><small>' + t('queen_title') + '  ·  ' + t('queen_bonus', { v: F.pct(E.rjMult(s) - 1) }) + '</small></div></div>';
    h += '<div class="swarm-box"><div class="progress"><i data-live="rjprog" style="width:' + (Math.min(1, Math.max(0, prog)) * 100).toFixed(1) + '%"></i></div>';
    h += '<small class="muted" data-live="rjnext">' + (pend > 0 ? t('queen_pending', { v: F.num(pend, { int: true }) }) + '  ·  ' + t('queen_gain', { v: F.mult(after) }) + '<br>' + t('queen_next', { v: F.num(needNext) }) : t('queen_none', { v: F.num(needNext) })) + '</small>';
    h += '<button class="btn btn-primary btn-lg btn-block' + (pend < 1 ? ' off' : '') + '" data-act="swarm" data-live="swarmbtn">' + ic('swarm') + t('swarm') + (pend >= 1 ? '  +' + F.num(pend, { int: true }) : '') + '</button></div></div>';
    {
      const bl = s.bless || [];
      h += '<div class="card"><div class="sec-title"><h3>' + t('bless_now') + '</h3>' + (s.blessOffer ? '<button class="btn btn-primary btn-sm" data-act="promo" data-arg="bless">' + ic('sparkle') + t('bless_pending') + '</button>' : '') + '</div>' +
        (bl.length ? '<div class="bless-list">' + bl.map(e => '<span class="badge b-teal">' + t('bl_' + e.id) + '  ·  ' + esc(UI.blessDesc(e)) + '</span>').join('') + '</div>' : '<p class="faint" style="font-size:var(--fs-sm)">' + t('bless_none') + '</p>') + '</div>';
    }
    h += '<div class="sec"><div class="sec-title"><h3>' + t('skills') + '</h3></div><div class="skills">';
    for (const q of BZ.QUEEN) {
      const lvl = E.qlvl(s, q.id);
      const maxed = E.queenMaxed(s, q.id);
      const cost = E.queenCost(s, q.id);
      const qlock = E.queenLocked(s, q.id);
      h += '<div class="skill' + (qlock ? ' qlock' : '') + '"><div class="top"><b>' + n(q.name) + '</b><span class="badge ' + (lvl ? 'b-orange' : 'b-grey') + '">' + (maxed ? t('maxed') : t('level', { n: lvl })) + '</span></div><small>' + n(q.desc) + '</small>' +
        (qlock ? '<button class="btn btn-outline btn-sm off">' + ic('lock') + t('mind_locked', { n: E.queenNeed(s, q.id) }) + '</button>' : maxed ? '' : '<button class="btn btn-outline btn-sm' + (s.rj < cost ? ' off' : '') + '" data-act="queen" data-arg="' + q.id + '" data-rj="' + cost + '">' + ic('jelly') + t('cost_rj', { v: F.num(cost, { int: true }) }) + '</button>') + '</div>';
    }
    h += '</div></div>';
    const pc = E.pendingCrowns(s);
    const showCrown = E.crownsEarned(s) > 0 || pc > 0 || (s.rjLife || 0) + pend >= E.crownDiv(s) * 0.25;
    if (showCrown) {
      h += '<div class="sec card crown-card"><div class="big-stat"><div class="pic crown">' + ic('crown') + '</div><div><b class="num">' + F.int(s.crowns || 0) + '</b><small>' + esc(BZ.P.crownName(s.world, true)) + '  ·  ' + t('crown_bonus', { m: F.num(E.crownMult(s), { small: true }), r: F.pct(E.crownRJ(s) - 1) }) + '</small></div></div>';
      h += '<div class="swarm-box"><small class="muted">' + (pc > 0 ? t('crown_pending', { v: F.int(pc), c: BZ.P.crownName(s.world) }) + '<br>' : '') + t('crown_next', { v: F.num(E.crownNext(s)) }) + '</small>';
      h += '<button class="btn btn-secondary btn-block' + (pc < 1 ? ' off' : '') + '" data-act="coronate">' + ic('crown') + t('coronate') + (pc >= 1 ? '  +' + F.int(pc) : '') + '</button></div>';
      h += '<div class="perks"><div class="sec-title"><h3>' + t('perks') + '</h3></div>' + BZ.CROWN_PERKS.map(p => '<div class="perk' + ((s.crowns || 0) >= p.at ? ' on' : '') + '">' + ic((s.crowns || 0) >= p.at ? 'check' : 'lock') + '<span>' + n(p.name) + '</span><small>' + t('perk_at', { n: p.at }) + '</small></div>').join('') + '</div></div>';
    } else {
      h += '<div class="sec card"><div class="big-stat"><div class="pic crown">' + ic('crown') + '</div><div><b>' + esc(BZ.P.crownName(s.world, true)) + '</b><small>' + t('crown_locked', { v: F.num(E.crownDiv(s) * 0.25) }) + '</small></div></div></div>';
    }
    const mind = E.qlvl(s, 'mind');
    if (mind > 0) {
      h += '<div class="sec card"><div class="sec-title"><h3>' + t('auto') + '</h3></div>';
      h += settingSwitch('auto_upg', '', s.auto.upg, 'auto:upg');
      if (mind >= 2) {
        h += settingSwitch('auto_prod', '', s.auto.prod, 'auto:prod');
        h += '<div class="setting"><div><b>' + t('auto_mode') + '</b><small>' + t('auto_mode_d') + '</small></div><div class="seg seg-wrap">' + ['best', 1, 10, 100, 'next', 'max'].map(v => '<button data-act="prodmode" data-arg="' + v + '" class="' + (String(s.auto.prodMode || 'best') === String(v) ? 'on' : '') + '">' + (v === 'best' ? t('auto_best') : v === 'next' ? t('next') : v === 'max' ? t('max') : 'x' + v) + '</button>').join('') + '</div></div>';
      }
      if (mind >= 3) {
        h += settingSwitch('auto_swarm', t('auto_swarm_at', { v: 'x' + s.auto.swarmAt }), s.auto.swarm, 'auto:swarm');
        h += '<div class="setting"><div><b>' + t('auto_swarm_at', { v: '' }).trim() + '</b></div><div class="seg">' + [1.5, 2, 3, 5].map(v => '<button data-act="swarmat" data-arg="' + v + '" class="' + (s.auto.swarmAt === v ? 'on' : '') + '">x' + F.num(v, { small: true }) + '</button>').join('') + '</div></div>';
      }
      h += '</div>';
    }
    return h;
  }

  function settingSwitch(key, sub, on, act) {
    return '<div class="setting"><div><b>' + t(key) + '</b>' + (sub ? '<small>' + sub + '</small>' : '') + '</div><label class="switch"><input type="checkbox" data-chg="' + act + '"' + (on ? ' checked' : '') + '><span></span></label></div>';
  }

  function questRow(q, i, act, reward) {
    const done = M.questDone(q);
    const val = q.id === 'earn' ? F.num(q.target) : F.int(q.target);
    const chip = UI.rewardChip(reward);
    return '<div class="quest"><div class="txt"><b>' + t('q_' + q.id, { n: val }) + '</b><div class="progress"><i style="width:' + (Math.min(1, q.prog / q.target) * 100).toFixed(1) + '%"></i></div><small class="num">' + (q.id === 'earn' ? F.num(Math.min(q.prog, q.target)) : F.int(Math.min(q.prog, q.target))) + ' / ' + val + '</small></div>' +
      (q.claimed ? '<span class="badge b-success">' + t('claimed') + '</span>' : done ? '<button class="btn btn-primary btn-sm" data-act="' + act + '" data-arg="' + i + '">' + chip + '</button>' : '<span class="reward">' + chip + '</span>') + '</div>';
  }

  function pageDaily() {
    const s = G.main;
    M.questGen(s);
    M.quickGen(s);
    const st = M.streakStatus(s);
    let h = '<h2 class="page-title">' + t('tab_daily') + '</h2>';
    h += '<div class="card"><div class="sec-title"><h3>' + t('daily_streak') + '</h3><span class="badge b-orange">' + ic('fire') + ' ' + (st.canClaim ? Math.max(0, st.streak - 1) : st.streak) + '</span></div><div class="streak">';
    const curIdx = st.index;
    for (let i = 0; i < 7; i++) {
      const r = BZ.STREAK_REWARDS[i];
      const done = st.canClaim ? i < curIdx : i <= curIdx;
      const today = i === curIdx;
      h += '<div class="sday' + (done ? ' done' : '') + (today && st.canClaim ? ' today' : '') + '">' + UI.rewardChip(r) + '<span>' + t('day_n', { n: i + 1 }) + '</span></div>';
    }
    h += '</div>' + (st.canClaim ? '<button class="btn btn-primary btn-block" data-act="streak">' + ic('gift') + t('claim') + '</button>' : '<button class="btn btn-outline btn-block off">' + ic('check') + t('come_back') + '</button>') + '</div>';
    h += '<div class="card"><div class="sec-title"><h3>' + t('quick_title') + '</h3><small data-t="' + M.quickEnd() + '" data-tfmt="quick_reset"></small></div>';
    s.quick.tasks.forEach((q, i) => { h += questRow(q, i, 'quick', M.quickReward(s, q)); });
    h += '</div>';
    h += '<div class="card"><div class="sec-title"><h3>' + t('quests') + '</h3><small data-t="' + M.nextDay().getTime() + '" data-tfmt="quests_reset"></small></div>';
    s.daily.quests.forEach((q, i) => { h += questRow(q, i, 'quest', BZ.QUEST_REWARDS[q.tier] || BZ.QUEST_REWARDS[0]); });
    h += '</div>';
    return h;
  }

  function achText(a) {
    const v = a.value;
    switch (a.test) {
      case 'lifetime': return t('tg_honey', { v: F.num(v) });
      case 'hps': return t('tg_hps', { v: F.num(v) });
      case 'taps': return t('tg_taps', { v: F.int(v) });
      case 'lucky': return t('tg_lucky', { v: F.int(v) });
      case 'swarms': return t('tg_swarm', { v: F.int(v) });
      case 'rj': return t('tg_rj', { v: F.num(v) });
      case 'upgrades': return t('tg_upgrade', { v: v });
      case 'combo': return t('tg_combo', { v: v });
      case 'quests': return t('tg_quest', { v });
      case 'streak': return t('tg_streak', { v });
      case 'colony': return t('tg_colony', { v });
      case 'crowns': return t('tg_crown', { v });
      case 'level': return t('tg_level', { v });
      case 'bees': return t('tg_bees', { v });
      case 'beelvl': return t('tg_beelvl', { v });
      case 'cores': return t('tg_cores', { v });
      case 'skins': return t('tg_skins', { v });
      case 'worlds': return t('tg_worlds', { v });
      case 'runHoney': return t('tg_runHoney', { v: F.num(v) });
      case 'runOwn': case 'runUpg': case 'runLucky': case 'runTaps': case 'runColony': return t('tg_' + a.test, { v: F.int(v) });
    }
    if (a.test.startsWith('own:')) return t('tg_own', { n: v, p: prodName(a.test.slice(4)).toLowerCase() });
    return a.id;
  }
  UI.achText = achText;
  const ACH_GROUPS = [
    { label: 'ag_honey', groups: ['honey', 'hps'] },
    { label: 'ag_own', groups: ['own'] },
    { label: 'ag_play', groups: ['taps', 'lucky', 'combo', 'upgrade', 'level'] },
    { label: 'ag_queen', groups: ['swarm', 'rj', 'crown', 'colony'] },
    { label: 'ag_daily', groups: ['quest', 'streak'] },
    { label: 'ag_world', groups: ['bees', 'cores', 'skins', 'world'] }
  ];
  const ACH_ICON = { honey: 'drop', hps: 'bolt', taps: 'tap', lucky: 'sparkle', swarm: 'swarm', rj: 'jelly', upgrade: 'star', combo: 'fire', quest: 'calendar', streak: 'fire', colony: 'hive', bees: 'worker', crown: 'crown', level: 'star', cores: 'hive', skins: 'palette', world: 'globe' };

  function pageTrophies() {
    const s = G.main;
    const got = E.achCount(s);
    let h = '<h2 class="page-title">' + t('trophies') + '</h2>';
    const runGot = BZ.RUN_ACH.filter(x => s.runAch[x.id]).length;
    h += '<div class="card"><div class="sec-title"><h3>' + t('run_title') + '</h3><small class="num">' + runGot + ' / ' + BZ.RUN_ACH.length + '</small></div><p class="faint" style="font-size:var(--fs-xs);margin-bottom:var(--sp-3)">' + t('run_d') + '</p><div class="goals">';
    const nextGoals = {};
    for (const x of BZ.RUN_ACH) if (!s.runAch[x.id] && !nextGoals[x.test]) nextGoals[x.test] = x;
    for (const test in nextGoals) {
      const x = nextGoals[test];
      const cur = E.runProgress(s, x);
      const pr = x.test === 'runHoney' ? Math.max(0, Math.log10(Math.max(1, cur)) / Math.log10(x.value)) : cur / x.value;
      h += '<div class="goal"><span class="gpic">' + ic(x.icon) + '</span><div class="txt"><b>' + esc(achText(x)) + '</b><div class="progress"><i style="width:' + (Math.min(1, pr) * 100).toFixed(1) + '%"></i></div></div>' + UI.rewardChip(x.reward) + '</div>';
    }
    h += '</div><div class="ach-grid run-grid">' + BZ.RUN_ACH.map(x => '<span class="ach' + (s.runAch[x.id] ? ' got' : '') + '" title="' + esc(achText(x)) + '">' + ic(x.icon) + '</span>').join('') + '</div></div>';
    h += '<div class="sec-title" style="margin-top:var(--sp-6)"><h3>' + t('hall_title') + '</h3></div>';
    h += '<div class="card"><div class="big-stat"><div class="pic">' + ic('trophy') + '</div><div><b class="num">' + got + ' / ' + BZ.ACHIEVEMENTS.length + '</b><small>' + t('trophies_bonus') + '  ·  +' + F.pct(BZ.ACH_BONUS * got) + '</small></div></div></div>';
    const a = BZ.ACH_BY_ID[selAch];
    h += '<div class="ach-detail" id="achDetail">' + (a ? '<div><b style="font-size:var(--fs-sm)">' + esc(achText(a)) + '</b><small>' + (s.ach[a.id] ? t('claimed') : t('locked')) + '</small></div>' + (a.reward ? UI.rewardChip(a.reward) : '') : '<small>' + t('trophies_pick') + '</small>') + '</div>';
    for (const grp of ACH_GROUPS) {
      const list = BZ.ACHIEVEMENTS.filter(x => grp.groups.includes(x.group));
      const got = list.filter(x => s.ach[x.id]).length;
      h += '<div class="sec"><div class="sec-title"><h3>' + t(grp.label) + '</h3><small class="num">' + got + ' / ' + list.length + '</small></div><div class="ach-grid">';
      for (const x of list) {
        const iconName = x.group === 'own' ? x.icon : (ACH_ICON[x.group] || 'star');
        h += '<button class="ach' + (s.ach[x.id] ? ' got' : '') + (selAch === x.id ? ' sel' : '') + '" data-act="ach" data-arg="' + x.id + '" title="' + esc(achText(x)) + '">' + ic(iconName) + '</button>';
      }
      h += '</div></div>';
    }
    return h;
  }

  function seg(act, options, cur) {
    return '<div class="seg">' + options.map(o => '<button data-act="' + act + '" data-arg="' + o[0] + '" class="' + (o[0] === cur ? 'on' : '') + '">' + o[1] + '</button>').join('') + '</div>';
  }

  function pageSettings() {
    const st = G.settings;
    const s = G.main;
    let h = '<h2 class="page-title">' + t('tab_settings') + '</h2><div class="card">';
    h += '<div class="setting"><div><b>' + t('set_lang') + '</b></div>' + seg('lang', [['en', 'English'], ['fr', 'Français']], st.lang) + '</div>';
    h += '<div class="setting"><div><b>' + t('set_theme') + '</b></div>' + seg('theme', [['light', t('light')], ['system', t('system')], ['dark', t('dark')]], st.theme) + '</div>';
    h += '<div class="setting"><div><b>' + t('set_notation') + '</b></div>' + seg('notation', [['short', t('notation_short')], ['sci', t('notation_sci')]], st.notation) + '</div>';
    h += settingSwitch('set_sound', '', st.sound, 'set:sound');
    h += settingSwitch('set_music', '', st.music, 'set:music');
    h += settingSwitch('set_vibrate', '', st.vibrate, 'set:vibrate');
    h += settingSwitch('set_effects', t('set_effects_d'), st.reduced, 'set:reduced');
    if (BZ.Cloud && BZ.Cloud.configured()) h += '<div class="setting"><div><b>' + t('set_name') + '</b><small>' + t('set_name_d') + '</small></div><input class="input" maxlength="18" data-inp="name" value="' + esc(s.playerName || '') + '" placeholder="' + esc(BZ.Online ? BZ.Online.name(s) : '') + '"></div>';
    h += '</div>';
    const C = BZ.Cloud;
    if (C && C.configured()) {
      h += '<div class="card"><div class="setting"><div><b>' + t('cloud_title') + '</b><small>' + (C && C.configured() ? (C.signedIn() ? esc(C.who() || '') + '  ·  ' + (s.cloud.at ? t('cloud_last', { t: F.time((Date.now() - s.cloud.at) / 1000) }) : t('cloud_never')) : t('cloud_d')) : t('cloud_cfg')) + '</small></div>';
      h += C.signedIn() ? '<div class="btns"><button class="btn btn-outline btn-sm" data-act="cloudsync">' + ic('upload') + t('cloud_sync') + '</button><button class="btn btn-ghost btn-sm" data-act="cloudout">' + t('cloud_signout') + '</button></div>' : '<button class="btn btn-primary btn-sm g-btn" data-act="cloudin">' + ic('user') + t('cloud_signin') + '</button>';
      h += '</div></div>';
    }
    if (BZ.Feedback && BZ.Feedback.available()) h += '<div class="card"><div class="setting"><div><b>' + t('fb_card') + '</b><small>' + t('fb_card_d') + '</small></div><button class="btn btn-outline btn-sm" data-fb="open">' + ic('bug') + t('fb_btn') + '</button></div></div>';
    h += '<div class="card"><div class="setting"><div><b>' + t('set_reset') + '</b></div><button class="btn btn-danger btn-sm" data-act="reset">' + ic('trash') + t('reset_ok') + '</button></div></div>';
    return h;
  }

  function onPanelClick(e) {
    const el = e.target.closest('[data-act]');
    if (!el) return;
    const act = el.dataset.act, arg = el.dataset.arg;
    BZ.Audio.unlock();
    switch (act) {
      case 'buy': G.buyProducer(arg, buyMode, el); break;
      case 'mode':
        buyMode = isNaN(+arg) ? arg : +arg;
        $('buySeg').querySelectorAll('button').forEach(b => b.classList.toggle('on', b.dataset.arg === arg));
        BZ.Audio.play('click');
        updateHive();
        break;
      case 'upg':
        if (selUpg === arg) G.buyUpgrade(arg);
        else { selUpg = arg; renderUpgDetail(); updateHive(); BZ.Audio.play('click'); }
        break;
      case 'upgbuy': G.buyUpgrade(arg); break;
      case 'upgall': G.buyAllUpgrades(); break;
      case 'swarm': G.askSwarm(); break;
      case 'coronate': G.askCoronate(); break;
      case 'queen': G.buyQueen(arg); break;
      case 'swarmat': G.main.auto.swarmAt = +arg; UI.render(); break;
      case 'prodmode': G.main.auto.prodMode = isNaN(+arg) ? arg : +arg; BZ.Audio.play('click'); UI.render(); G.save(); break;
      case 'streak': G.claimStreak(); break;
      case 'quest': G.claimQuest(+arg); break;
      case 'dance': G.dance(); break;
      case 'skin': G.skin(arg); break;
      case 'ach': selAch = arg; UI.render(); break;
      case 'lang': case 'theme': case 'notation': G.setSetting(act, arg); break;
      case 'reset': G.askReset(); break;
      default: if (UI.extAct) UI.extAct(act, arg, el); break;
      case 'logs': UI.modal('<h4>' + t('logs') + '</h4><div class="logs">' + esc(BZ.Log.lines.slice(-80).join('\n')) + '</div><div class="row"><button class="btn btn-outline" data-close>' + t('close') + '</button></div>', true); break;
    }
  }
  function onPanelChange(e) {
    const el = e.target;
    const c = el.dataset.chg;
    if (!c) return;
    const [kind, key] = c.split(':');
    if (kind === 'set') G.setSetting(key, el.checked);
    else if (kind === 'auto') { G.main.auto[key] = el.checked; G.save(); }
  }
  function onPanelInput(e) {
    if (e.target.dataset.inp === 'name') { G.main.playerName = e.target.value.slice(0, 18); }
  }
  function onKey(e) {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    if (e.key === 'Escape') { if (!$('modal').classList.contains('hidden') && UI.modalDismiss) UI.closeModal(); else drawer(false); return; }
    if (e.key === ' ' || e.key === 'Enter') {
      if ($('modal').classList.contains('hidden')) { e.preventDefault(); if (!e.repeat) G.tapAt(null); }
      return;
    }
    const idx = '1234567890'.indexOf(e.key);
    const vt = visibleTabs();
    if (idx >= 0 && vt[idx]) UI.show(vt[idx].id);
  }

  function liveUpdate() {
    const now = Date.now();
    document.querySelectorAll('[data-t]').forEach(el => {
      const secs = (+el.dataset.t - now) / 1000;
      const txt = el.dataset.tfmt ? t(el.dataset.tfmt, { t: F.time(secs) }) : F.time(secs);
      setText(el, txt);
      if (secs <= 0 && !el._fired) { el._fired = true; pageDirty = true; }
    });
    const s = G.main;
    document.querySelectorAll('[data-rj]').forEach(el => setCls(el, 'off', s.rj < +el.dataset.rj));
    if (page === 'queen' && E.pendingRJ(s) !== renderedPend) pageDirty = true;
  }

  UI.frame = function (now) {
    const s = S();
    const honeyTxt = F.num(s.honey);
    if (honeyTxt !== lastHoneyTxt) { lastHoneyTxt = honeyTxt; $('honeyAmt').textContent = honeyTxt; }
    const hpsTxt = t('per_sec', { v: F.num(E.hps(s)) });
    if (hpsTxt !== lastHpsTxt) { lastHpsTxt = hpsTxt; $('hpsAmt').textContent = hpsTxt; }
    const combo = $('combo');
    const on = s.combo >= 3;
    setCls(combo, 'on', on);
    if (on) {
      combo.firstChild.style.width = Math.min(100, s.combo) + '%';
      setText(combo.lastChild, t('combo', { v: F.mult(E.comboMult(s)) }));
    }
    if (now - lastFast > 120) {
      lastFast = now;
      if (page === 'hive') { pageDirty = false; renderHive(); }
      updateBuffs(s);
      setCls($('stage'), 'golden', s.buffs.some(b => b.id === 'rush' || b.id === 'frenzy'));
      updateChips();
      if (UI.extFrame) UI.extFrame(now);
    }
    if (now - lastSlow > 1000) {
      lastSlow = now;
      if (page !== 'hive') { if (pageDirty) UI.render(); else liveUpdate(); }
      updateDots();
    }
  };

  function updateBuffs(s) {
    const list = [];
    for (const b of s.buffs) list.push({ id: b.id, icon: LUCKY_ICON[b.id], label: b.mult ? 'x' + b.mult : 'x' + b.tap, t: b.t, max: b.max });
    for (const b of s.boosts) { const d = BZ.BOOST_BY_ID[b.id] || {}; list.push({ id: b.id, icon: BOOST_ICON[b.id] || d.icon || 'bolt', label: b.mult ? 'x' + b.mult : d.v ? 'x' + d.v : '', t: b.t, max: b.max, name: d.name ? n(d.name) : '' }); }
    const box = $('buffs');
    const key = list.map(b => b.id).join(',');
    if (box._key !== key) {
      box._key = key;
      box.innerHTML = list.map(b => '<span class="buff" data-b="' + b.id + '"' + (b.name ? ' title="' + esc(b.name) + '"' : '') + '>' + ic(b.icon) + '<span></span><i></i></span>').join('');
    }
    list.forEach((b, i) => {
      const el = box.children[i];
      if (!el) return;
      setText(el.children[1], (b.label ? b.label + '  ' : '') + F.clock(b.t));
      el.children[2].style.width = (b.t / b.max * 100).toFixed(1) + '%';
    });
  }

  function updateChips() {
    const s = G.main;
    const jj = s.rjEarned > 0 || E.pendingRJ(s) > 0 ? ic('jelly') + '<span class="num">' + F.num(s.rj, { int: true }) + '</span>' : '';
    const cj = $('chipJelly');
    if (cj._v !== jj) { cj._v = jj; cj.innerHTML = jj; cj.style.display = jj ? '' : 'none'; }
    const db = $('danceBtn');
    if (db) setCls(db, 'ready', G.danceReadyIn() <= 0);
  }

  function updateDots() {
    const s = G.main;
    const flags = {
      daily: M.streakStatus(s).canClaim || (s.daily.quests || []).some(q => !q.claimed && M.questDone(q)) || (s.quick.tasks || []).some(q => !q.claimed && M.questDone(q)),
      queen: E.pendingRJ(s) >= Math.max(1, s.rjEarned) && E.pendingRJ(s) >= 1
    };
    if (UI.extDots) UI.extDots(flags);
    document.querySelectorAll('[data-tab]').forEach(b => {
      const want = !!flags[b.dataset.tab];
      const has = !!b.querySelector('.dot');
      if (want && !has) b.insertAdjacentHTML('beforeend', '<span class="dot"></span>');
      else if (!want && has) b.querySelector('.dot').remove();
    });
  }

  UI.hint = function (txt) {
    const h = $('hint');
    if (!txt) { h.classList.add('hidden'); return; }
    h.textContent = txt;
    h.classList.remove('hidden');
  };

  UI.toast = function (icon, text, opts) {
    opts = opts || {};
    const box = $('toasts');
    while (box.children.length >= 4) box.firstChild.remove();
    const el = document.createElement('div');
    el.className = 'toast' + (opts.ok ? ' ok' : '');
    el.innerHTML = (opts.nova ? fox(opts.nova) : ic(icon)) + '<span>' + esc(text) + '</span>';
    box.appendChild(el);
    setTimeout(() => { el.classList.add('out'); setTimeout(() => el.remove(), 300); }, opts.long ? 5000 : 3200);
  };

  UI.modal = function (html, dismiss, binds) {
    const m = $('modal');
    m.innerHTML = '<div class="modal" role="dialog">' + html + '</div>';
    m.classList.remove('hidden');
    UI.modalDismiss = dismiss !== false;
    m.querySelectorAll('[data-close]').forEach(b => { b.onclick = () => UI.closeModal(); });
    if (binds) for (const sel in binds) { const el = m.querySelector(sel); if (el) el.onclick = () => binds[sel](el); }
    const f = m.querySelector('.btn-primary') || m.querySelector('button');
    if (f && !('ontouchstart' in root)) f.focus({ preventScroll: true });
  };
  UI.closeModal = function () {
    const m = $('modal');
    m.classList.add('hidden');
    m.innerHTML = '';
    if (UI.onModalClose) { const fn = UI.onModalClose; UI.onModalClose = null; fn(); }
    setTimeout(UI.nextQueued, 120);
  };
  UI.modalOpen = () => !$('modal').classList.contains('hidden');

  UI.confirm = function (title, text, okLabel, danger, onOk) {
    UI.modal('<h4>' + esc(title) + '</h4><p>' + esc(text) + '</p><div class="row"><button class="btn btn-ghost" data-close>' + t('cancel') + '</button><button class="btn ' + (danger ? 'btn-danger' : 'btn-primary') + '" id="mOk">' + esc(okLabel) + '</button></div>', true, {
      '#mOk': () => { UI.closeModal(); onOk(); }
    });
  };

  UI.hero = function (icon, title, big, text, buttons) {
    let h = '<div class="hero"><div class="pic">' + ic(icon) + '</div><h4>' + esc(title) + '</h4>' + (big ? '<b class="num">' + esc(big) + '</b>' : '') + (text ? '<p style="margin-top:var(--sp-2)">' + text + '</p>' : '') + '</div>';
    h += '<div class="row center">' + buttons + '</div>';
    return h;
  };

  UI.buyFlash = function (el) { if (!el) return; el.classList.remove('pop'); void el.offsetWidth; el.classList.add('pop'); };
  UI.splashDone = function () { const s = $('splash'); if (!s) return; s.classList.add('gone'); setTimeout(() => s.remove(), 500); };
  UI.splashReady = function (onPlay) {
    const lb = $('loadLabel');
    if (lb) lb.style.visibility = 'hidden';
    const btn = $('playBtn');
    btn.innerHTML = ic('play') + t('play');
    btn.classList.remove('hidden');
    btn.focus({ preventScroll: true });
    btn.onclick = () => {
      UI.splashDone();
      onPlay();
    };
  };
  UI.TABS = TABS;
})(window);
