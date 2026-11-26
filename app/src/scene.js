(function (root) {
  const BZ = root.BZ = root.BZ || {};
  const Scene = BZ.Scene = {};

  let cv, cx, W = 0, H = 0, dpr = 1;
  let bg = null, bgKey = '';
  let bees = [], parts = [], texts = [], weather = [], stars = [], clouds = [];
  let comb = { x: 0, y: 0, r: 30, squish: 0, vel: 0, glow: 0 };
  const flyers = { lucky: null, ticket: null };
  let drops = [];
  let time = 0;
  let opts = { reduced: false };
  let handlers = {};
  let cellCount = 1;
  let beeKey = -1;
  const cellBirth = [];
  let skin = null;
  const tapTimes = [];

  Scene.init = function (canvas, h) {
    cv = canvas;
    cx = cv.getContext('2d');
    handlers = h || {};
    cv.addEventListener('pointerdown', onDown);
    cv.addEventListener('contextmenu', e => e.preventDefault());
    new ResizeObserver(resize).observe(cv.parentElement);
    resize();
  };
  Scene.setOptions = o => { Object.assign(opts, o); bgKey = ''; };
  Scene.setSkin = id => { skin = BZ.SKIN_BY_ID[id] || BZ.SKINS[0]; bgKey = ''; makeStars(); weather = []; };

  function resize() {
    const r = cv.parentElement.getBoundingClientRect();
    dpr = Math.min(2, root.devicePixelRatio || 1);
    W = Math.max(1, r.width); H = Math.max(1, r.height);
    cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
    cv.style.width = W + 'px'; cv.style.height = H + 'px';
    bgKey = '';
    makeStars();
    clouds = [];
    for (let i = 0; i < 4; i++) clouds.push({ x: Math.random() * W, y: H * (0.08 + Math.random() * 0.25), s: 0.6 + Math.random() * 0.7, v: 4 + Math.random() * 6 });
  }
  function makeStars() {
    stars = [];
    for (let i = 0; i < 70; i++) stars.push({ x: Math.random(), y: Math.random() * 0.6, r: 0.4 + Math.random() * 1.2, p: Math.random() * 6 });
  }

  function layout() {
    const top = H < 480 ? 116 : 150;
    const region = Math.max(120, H - top - 20);
    comb.x = W / 2;
    comb.y = top + region / 2;
    comb.r = Math.max(10, Math.min(region / 11.5, W / 13, 40));
  }

  function hexPath(c, x, y, r) {
    c.beginPath();
    for (let i = 0; i < 6; i++) {
      const a = Math.PI / 3 * i + Math.PI / 6;
      const px = x + r * Math.cos(a), py = y + r * Math.sin(a);
      if (i === 0) c.moveTo(px, py); else c.lineTo(px, py);
    }
    c.closePath();
  }

  const CELLS = (function () {
    const out = [[0, 0]];
    const dirs = [[1, 0], [1, -1], [0, -1], [-1, 0], [-1, 1], [0, 1]];
    for (let ring = 1; ring <= 3; ring++) {
      let q = -ring, r = ring;
      const ringCells = [];
      for (let d = 0; d < 6; d++) {
        for (let k = 0; k < ring; k++) {
          ringCells.push([q, r]);
          q += dirs[d][0]; r += dirs[d][1];
        }
      }
      const ang = c => { const x = Math.sqrt(3) * (c[0] + c[1] / 2), y = 1.5 * c[1]; return Math.atan2(x, -y); };
      ringCells.sort((a, b) => Math.abs(ang(a)) - Math.abs(ang(b)) || ang(a) - ang(b));
      out.push(...ringCells);
    }
    return out;
  })();
  function axial(q, r, size) {
    return [size * Math.sqrt(3) * (q + r / 2), size * 1.5 * r];
  }

  function shade(hex, f) {
    const n = parseInt(hex.slice(1), 16);
    let r = n >> 16, g = (n >> 8) & 255, b = n & 255;
    if (f > 0) { r += (255 - r) * f; g += (255 - g) * f; b += (255 - b) * f; }
    else { r *= 1 + f; g *= 1 + f; b *= 1 + f; }
    return 'rgb(' + (r | 0) + ',' + (g | 0) + ',' + (b | 0) + ')';
  }

  function buildBg(flowers) {
    const key = W + 'x' + H + ':' + skin.id + ':' + flowers + ':' + opts.reduced;
    if (key === bgKey && bg) return;
    bgKey = key;
    bg = bg || document.createElement('canvas');
    bg.width = cv.width; bg.height = cv.height;
    const c = bg.getContext('2d');
    c.setTransform(dpr, 0, 0, dpr, 0, 0);
    const g = c.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, skin.sky[0]); g.addColorStop(1, skin.sky[1]);
    c.fillStyle = g; c.fillRect(0, 0, W, H);
    if (skin.night) {
      c.fillStyle = 'rgba(255,248,230,0.9)';
      c.beginPath(); c.arc(W * 0.82, H * 0.16, Math.min(W, H) * 0.05, 0, Math.PI * 2); c.fill();
      c.fillStyle = skin.sky[0];
      c.beginPath(); c.arc(W * 0.82 + Math.min(W, H) * 0.02, H * 0.16 - Math.min(W, H) * 0.015, Math.min(W, H) * 0.045, 0, Math.PI * 2); c.fill();
    } else {
      const sr = Math.min(W, H) * 0.07;
      const sg = c.createRadialGradient(W * 0.18, H * 0.18, 0, W * 0.18, H * 0.18, sr * 3);
      sg.addColorStop(0, 'rgba(255,240,200,0.9)'); sg.addColorStop(0.35, 'rgba(255,225,160,0.5)'); sg.addColorStop(1, 'rgba(255,225,160,0)');
      c.fillStyle = sg; c.fillRect(0, 0, W, H);
      c.fillStyle = 'rgba(255,246,222,0.95)';
      c.beginPath(); c.arc(W * 0.18, H * 0.18, sr, 0, Math.PI * 2); c.fill();
    }
    const hills = [[0.7, 0.05, 1.3, 0], [0.78, 0.04, 2.1, 1.7], [0.87, 0.03, 2.9, 3.1]];
    hills.forEach((h, i) => {
      c.fillStyle = skin.hill[i];
      c.beginPath();
      c.moveTo(0, H);
      for (let x = 0; x <= W; x += 8) {
        const y = H * h[0] + Math.sin(x / W * Math.PI * h[2] + h[3]) * H * h[1] + Math.sin(x / W * 11 + i) * H * 0.006;
        c.lineTo(x, y);
      }
      c.lineTo(W, H); c.closePath(); c.fill();
    });
    const rnd = BZ.E.rng(1234);
    const n = Math.min(opts.reduced ? 40 : 90, flowers * 2 + 6);
    const colors = skin.snow ? ['#FFFFFF', '#E8F0F6', '#D6E6F0'] : ['#F28C28', '#F5F3EF', '#E8A0B4', '#B79CD9', '#F2C14E', '#FFFFFF'];
    for (let i = 0; i < n; i++) {
      const x = rnd() * W;
      const y = H * (0.8 + rnd() * 0.18);
      const s = (2 + rnd() * 2.5) * (y / H);
      c.strokeStyle = skin.night ? 'rgba(60,90,80,0.9)' : 'rgba(90,130,80,0.9)';
      c.lineWidth = 1;
      c.beginPath(); c.moveTo(x, y); c.lineTo(x, y + s * 2.5); c.stroke();
      c.fillStyle = colors[Math.floor(rnd() * colors.length)];
      for (let k = 0; k < 5; k++) {
        const a = k / 5 * Math.PI * 2;
        c.beginPath(); c.arc(x + Math.cos(a) * s * 0.7, y + Math.sin(a) * s * 0.7, s * 0.55, 0, Math.PI * 2); c.fill();
      }
      c.fillStyle = '#F2C14E';
      c.beginPath(); c.arc(x, y, s * 0.45, 0, Math.PI * 2); c.fill();
    }
  }

  function drawComb(c, state) {
    const bob = Math.sin(time * 1.3) * comb.r * 0.08;
    const sq = 1 + comb.squish;
    c.save();
    c.translate(comb.x, comb.y + bob);
    c.scale(sq, 2 - sq);
    const size = comb.r;
    const base = skin.comb;
    const glow = comb.glow;
    const ringR = size * 7.2;
    const aura = c.createRadialGradient(0, 0, size, 0, 0, ringR);
    aura.addColorStop(0, 'rgba(255,200,90,' + (0.28 + glow * 0.35) + ')');
    aura.addColorStop(1, 'rgba(255,200,90,0)');
    c.fillStyle = aura;
    c.beginPath(); c.arc(0, 0, ringR, 0, Math.PI * 2); c.fill();
    for (let i = 0; i < CELLS.length; i++) {
      const [q, r] = CELLS[i];
      const [x, y] = axial(q, r, size);
      const filled = i < cellCount;
      const ringEnd = cellCount <= 1 ? 7 : cellCount <= 7 ? 7 : cellCount <= 19 ? 19 : 37;
      if (!filled && i >= ringEnd) break;
      if (!filled) {
        hexPath(c, x, y, size * 0.92);
        c.strokeStyle = skin.night ? 'rgba(255,255,255,0.3)' : 'rgba(32,37,43,0.22)';
        c.lineWidth = 1.5;
        c.setLineDash([3, 4]);
        c.stroke();
        c.setLineDash([]);
        continue;
      }
      const pulse = Math.sin(time * 2 + i * 0.7) * 0.04;
      const age = cellBirth[i] === undefined ? 9 : time - cellBirth[i];
      const k = Math.max(0, Math.min(1, age / 0.55));
      const pop = k >= 1 ? 1 : 1 + 2.2 * Math.pow(k - 1, 3) + 1.2 * Math.pow(k - 1, 2);
      c.save();
      c.translate(x, y);
      c.scale(pop, pop);
      c.translate(-x, -y);
      hexPath(c, x, y + size * 0.08, size * 0.95);
      c.fillStyle = shade(base, -0.35);
      c.fill();
      hexPath(c, x, y, size * 0.95);
      const g = c.createLinearGradient(x, y - size, x, y + size);
      g.addColorStop(0, shade(base, 0.35 + pulse));
      g.addColorStop(1, shade(base, -0.08));
      c.fillStyle = g;
      c.fill();
      hexPath(c, x, y, size * 0.62);
      c.fillStyle = shade(base, 0.12 + pulse);
      c.fill();
      c.fillStyle = 'rgba(255,255,255,0.45)';
      c.beginPath(); c.ellipse(x - size * 0.22, y - size * 0.3, size * 0.2, size * 0.09, -0.5, 0, Math.PI * 2); c.fill();
      c.restore();
    }
    c.restore();
  }

  function newBee(golden) {
    const a = Math.random() * Math.PI * 2;
    const d = comb.r * (3 + Math.random() * 5);
    return {
      x: comb.x + Math.cos(a) * d, y: comb.y + Math.sin(a) * d,
      vx: 0, vy: 0, t: Math.random() * 100,
      ok: 2.5 + Math.random() * 5.5, speed: 0.4 + Math.random() * 0.6, phase: Math.random() * 6.28, dir: Math.random() < 0.5 ? 1 : -1,
      sk: 0.36 + Math.random() * 0.1, size: 8, golden
    };
  }

  function drawBee(c, b, scale) {
    const s = b.size * (scale || 1);
    const face = b.vx >= 0 ? 1 : -1;
    c.save();
    c.translate(b.x, b.y);
    c.scale(face, 1);
    const flap = Math.abs(Math.sin(b.t * 38)) * 0.8 + 0.3;
    c.fillStyle = 'rgba(255,255,255,0.75)';
    c.beginPath(); c.ellipse(-s * 0.2, -s * 0.9, s * 0.55, s * 0.9 * flap, -0.4, 0, Math.PI * 2); c.fill();
    c.beginPath(); c.ellipse(s * 0.25, -s * 0.85, s * 0.45, s * 0.75 * flap, 0.3, 0, Math.PI * 2); c.fill();
    const body = b.red ? '#E8403C' : b.golden ? '#FFD45E' : b.c0 || '#F2C14E';
    const ink = b.c1 || '#20252B';
    c.fillStyle = body;
    c.beginPath(); c.ellipse(0, 0, s * 1.1, s * 0.78, 0, 0, Math.PI * 2); c.fill();
    c.save();
    c.beginPath(); c.ellipse(0, 0, s * 1.1, s * 0.78, 0, 0, Math.PI * 2); c.clip();
    c.fillStyle = ink;
    c.fillRect(-s * 0.45, -s, s * 0.28, s * 2);
    c.fillRect(s * 0.05, -s, s * 0.28, s * 2);
    c.restore();
    c.fillStyle = ink;
    c.beginPath(); c.arc(s * 0.95, -s * 0.05, s * 0.42, 0, Math.PI * 2); c.fill();
    c.fillStyle = '#FFFFFF';
    c.beginPath(); c.arc(s * 1.08, -s * 0.15, s * 0.12, 0, Math.PI * 2); c.fill();
    c.beginPath(); c.moveTo(-s * 1.1, 0); c.lineTo(-s * 1.45, s * 0.08); c.lineTo(-s * 1.08, s * 0.2); c.fillStyle = '#20252B'; c.fill();
    c.restore();
  }

  function updateBees(dt, target) {
    while (bees.length < target) { bees.push(newBee(false)); beeKey = -1; }
    if (bees.length > target) bees.length = target;
    for (const b of bees) {
      b.t += dt;
      b.phase += dt * b.speed * b.dir;
      const wob = Math.sin(b.t * 1.7) * comb.r * 0.8;
      const orbit = b.ok * comb.r;
      b.size = Math.max(6, comb.r * b.sk);
      const tx = comb.x + Math.cos(b.phase) * (orbit + wob);
      const ty = comb.y + Math.sin(b.phase) * (orbit * 0.55 + wob * 0.5) - comb.r * 0.5;
      const ax = (tx - b.x) * 3 - b.vx * 1.6;
      const ay = (ty - b.y) * 3 - b.vy * 1.6;
      b.vx += ax * dt; b.vy += ay * dt;
      b.x += b.vx * dt; b.y += b.vy * dt;
    }
  }

  Scene.spawnLucky = function (life, kind, red) {
    kind = kind || 'lucky';
    const fromLeft = Math.random() < 0.5;
    flyers[kind] = {
      kind, x: fromLeft ? -40 : W + 40, y: H * (0.25 + Math.random() * 0.4),
      vx: 0, vy: 0, t: 0, life, max: life, fromLeft,
      size: Math.max(9, comb.r * (kind === 'ticket' ? 0.36 : 0.42)), golden: kind === 'lucky', red: !!red, trail: [], tx: W * (0.2 + Math.random() * 0.6), ty: H * (0.2 + Math.random() * 0.5), retarget: 0
    };
  };
  Scene.removeLucky = function (caught, kind) {
    const L = flyers[kind || 'lucky'];
    if (caught && L) burst(L.x, L.y, kind === 'ticket' ? 14 : 26, true);
    flyers[kind || 'lucky'] = null;
  };
  Scene.hasLucky = kind => !!flyers[kind || 'lucky'];
  Scene.storm = function (n, dur) {
    for (let i = 0; i < n; i++) {
      drops.push({ x: W * (0.12 + Math.random() * 0.76), y: -20 - Math.random() * H * 0.9, v: H / (dur * 0.9) * (0.7 + Math.random() * 0.5), r: Math.max(12, comb.r * 0.55), wob: Math.random() * 6, life: dur * 1.6 });
    }
  };
  function updateDrops(c, dt) {
    for (let i = drops.length - 1; i >= 0; i--) {
      const d = drops[i];
      d.y += d.v * dt; d.wob += dt * 3; d.life -= dt;
      if (d.y > H + 30 || d.life <= 0) { drops.splice(i, 1); continue; }
      const x = d.x + Math.sin(d.wob) * 6;
      const g = c.createRadialGradient(x, d.y, 0, x, d.y, d.r * 2.2);
      g.addColorStop(0, 'rgba(255,214,110,0.55)'); g.addColorStop(1, 'rgba(255,214,110,0)');
      c.fillStyle = g;
      c.beginPath(); c.arc(x, d.y, d.r * 2.2, 0, Math.PI * 2); c.fill();
      c.fillStyle = '#F2A03A';
      c.beginPath();
      c.moveTo(x, d.y - d.r * 1.3);
      c.bezierCurveTo(x + d.r * 0.9, d.y - d.r * 0.2, x + d.r, d.y + d.r * 0.9, x, d.y + d.r);
      c.bezierCurveTo(x - d.r, d.y + d.r * 0.9, x - d.r * 0.9, d.y - d.r * 0.2, x, d.y - d.r * 1.3);
      c.fill();
      c.fillStyle = 'rgba(255,255,255,0.6)';
      c.beginPath(); c.ellipse(x - d.r * 0.3, d.y + d.r * 0.1, d.r * 0.18, d.r * 0.3, -0.3, 0, Math.PI * 2); c.fill();
      d.sx = x;
    }
  }

  function updateLucky(dt) {
    for (const k in flyers) {
      const L = flyers[k];
      if (!L) continue;
      L.t += dt; L.life -= dt;
      L.retarget -= dt;
      if (L.retarget <= 0) {
        L.retarget = (k === 'ticket' ? 1.8 : 1.4) + Math.random() * 1.2;
        const m = Math.min(W, H) * 0.12;
        if (L.life < 1.6) { L.tx = L.fromLeft ? W + 80 : -80; L.ty = H * 0.2; }
        else { L.tx = m + Math.random() * (W - 2 * m); L.ty = m + Math.random() * (H * 0.7 - m); }
      }
      const k2 = k === 'ticket' ? 1.0 : 1.4;
      const ax = (L.tx - L.x) * k2 - L.vx * 1.1;
      const ay = (L.ty - L.y) * k2 - L.vy * 1.1 + Math.sin(L.t * 5) * 60;
      L.vx += ax * dt; L.vy += ay * dt;
      L.x += L.vx * dt; L.y += L.vy * dt;
      if (k === 'lucky' && !opts.reduced && Math.random() < 0.6) parts.push({ x: L.x + (Math.random() - 0.5) * 10, y: L.y + (Math.random() - 0.5) * 10, vx: 0, vy: 10, life: 0.8, max: 0.8, r: 1.5 + Math.random() * 2, spark: true });
    }
  }

  function drawTicketBee(c, L) {
    const alpha = Math.min(1, L.life / 0.6);
    c.save();
    c.globalAlpha = alpha;
    const rg = c.createRadialGradient(L.x, L.y, 0, L.x, L.y, L.size * 3.4);
    rg.addColorStop(0, 'rgba(232,160,180,0.45)');
    rg.addColorStop(1, 'rgba(232,160,180,0)');
    c.fillStyle = rg;
    c.beginPath(); c.arc(L.x, L.y, L.size * 3.4, 0, Math.PI * 2); c.fill();
    const sw = Math.sin(L.t * 3) * 0.18;
    const tw = L.size * 1.9, th = L.size * 1.15;
    const tx = L.x, ty = L.y + L.size * 1.9;
    c.strokeStyle = 'rgba(32,37,43,0.55)';
    c.lineWidth = 1.5;
    c.beginPath(); c.moveTo(L.x, L.y + L.size * 0.6); c.lineTo(tx, ty - th / 2); c.stroke();
    c.save();
    c.translate(tx, ty);
    c.rotate(sw);
    c.fillStyle = '#F5F3EF';
    c.strokeStyle = '#E86F8E';
    c.lineWidth = 2;
    const r = th * 0.22;
    c.beginPath();
    c.moveTo(-tw / 2 + r, -th / 2); c.lineTo(tw / 2 - r, -th / 2); c.arc(tw / 2, -th / 2, r, Math.PI, Math.PI / 2, true);
    c.lineTo(tw / 2, th / 2 - r); c.arc(tw / 2, th / 2, r, -Math.PI / 2, Math.PI, true);
    c.lineTo(-tw / 2 + r, th / 2); c.arc(-tw / 2, th / 2, r, 0, -Math.PI / 2, true);
    c.lineTo(-tw / 2, -th / 2 + r); c.arc(-tw / 2, -th / 2, r, Math.PI / 2, 0, true);
    c.closePath(); c.fill(); c.stroke();
    c.fillStyle = '#E86F8E';
    c.beginPath(); c.arc(0, 0, th * 0.22, 0, Math.PI * 2); c.fill();
    c.restore();
    drawBee(c, { x: L.x, y: L.y, vx: L.vx, t: L.t, size: L.size, c0: '#F2C14E' }, 1);
    c.restore();
  }

  function drawLucky(c) {
    if (flyers.ticket) drawTicketBee(c, flyers.ticket);
    const L = flyers.lucky;
    if (!L) return;
    const pulse = 1 + Math.sin(L.t * 8) * 0.08;
    const alpha = Math.min(1, L.life / 0.6);
    c.save();
    c.globalAlpha = alpha;
    const rg = c.createRadialGradient(L.x, L.y, 0, L.x, L.y, L.size * 4.2);
    rg.addColorStop(0, L.red ? 'rgba(240,70,90,0.85)' : 'rgba(255,220,110,0.75)');
    rg.addColorStop(1, L.red ? 'rgba(240,70,90,0)' : 'rgba(255,220,110,0)');
    c.fillStyle = rg;
    c.beginPath(); c.arc(L.x, L.y, L.size * 4.2, 0, Math.PI * 2); c.fill();
    c.strokeStyle = 'rgba(255,255,255,0.9)';
    c.lineWidth = 2;
    for (let i = 0; i < 4; i++) {
      const a = L.t * 2 + i * Math.PI / 2;
      const r1 = L.size * 2.1, r2 = L.size * 2.9;
      c.beginPath(); c.moveTo(L.x + Math.cos(a) * r1, L.y + Math.sin(a) * r1); c.lineTo(L.x + Math.cos(a) * r2, L.y + Math.sin(a) * r2); c.stroke();
    }
    drawBee(c, { x: L.x, y: L.y, vx: L.vx, t: L.t, size: L.size, golden: true, red: L.red }, pulse);
    c.fillStyle = L.red ? '#FFD45E' : '#FFF4C8';
    const cr = L.size * 0.55;
    c.beginPath();
    c.moveTo(L.x - cr, L.y - L.size * 1.1);
    c.lineTo(L.x - cr * 0.6, L.y - L.size * 1.6);
    c.lineTo(L.x - cr * 0.1, L.y - L.size * 1.25);
    c.lineTo(L.x + cr * 0.4, L.y - L.size * 1.7);
    c.lineTo(L.x + cr * 0.5, L.y - L.size * 1.15);
    c.closePath(); c.fill();
    c.restore();
  }

  function burst(x, y, n, gold) {
    const max = opts.reduced ? 40 : 160;
    for (let i = 0; i < n && parts.length < max; i++) {
      const a = Math.random() * Math.PI * 2;
      const v = 60 + Math.random() * 170;
      parts.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 80, life: 0.7 + Math.random() * 0.5, max: 1.1, r: 2 + Math.random() * 3.5, gold, grav: true });
    }
  }

  Scene.floatText = function (x, y, txt, big) {
    if (texts.length > (opts.reduced ? 8 : 24)) texts.shift();
    texts.push({ x: x + (Math.random() - 0.5) * 24, y, txt, life: 1.1, max: 1.1, big });
  };
  Scene.centerText = function (txt) {
    Scene.floatText(comb.x, comb.y - comb.r * 2.4, txt, true);
  };

  function onDown(e) {
    e.preventDefault();
    if (handlers.unlock) handlers.unlock();
    const r = cv.getBoundingClientRect();
    const x = e.clientX - r.left, y = e.clientY - r.top;
    for (let i = drops.length - 1; i >= 0; i--) {
      const dr = drops[i];
      if (Math.hypot(x - (dr.sx || dr.x), y - dr.y) < Math.max(30, dr.r * 2)) {
        drops.splice(i, 1);
        burst(x, y, opts.reduced ? 4 : 12, true);
        if (handlers.drop) { const v = handlers.drop(); if (v) Scene.floatText(x, y - 14, v, true); }
        return;
      }
    }
    for (const k of ['lucky', 'ticket']) {
      const L = flyers[k];
      if (!L) continue;
      const cy = k === 'ticket' ? L.y + L.size : L.y;
      const d = Math.hypot(x - L.x, y - cy);
      if (d < Math.max(36, L.size * 3.4)) {
        if (handlers.lucky) handlers.lucky(L.x, L.y, k);
        return;
      }
    }
    const d = Math.hypot(x - comb.x, (y - comb.y) * 1.1);
    if (d < comb.r * 5.8) {
      const now = performance.now();
      while (tapTimes.length && now - tapTimes[0] > 1000) tapTimes.shift();
      if (tapTimes.length >= 25) return;
      tapTimes.push(now);
      comb.vel -= 2.4;
      if (handlers.tap) {
        const v = handlers.tap(x, y);
        if (v !== undefined) Scene.floatText(x, y - 10, v);
      }
      burst(x, y, opts.reduced ? 2 : 6, false);
    }
  }

  function drawWeather(c, dt) {
    if (opts.reduced) return;
    const want = skin.petals ? 26 : skin.snow ? 40 : 0;
    while (weather.length < want) weather.push({ x: Math.random() * W, y: -Math.random() * H, v: 15 + Math.random() * 25, s: 2 + Math.random() * 3, p: Math.random() * 6 });
    for (const w of weather) {
      w.y += w.v * dt; w.p += dt;
      w.x += Math.sin(w.p) * 12 * dt;
      if (w.y > H + 10) { w.y = -10; w.x = Math.random() * W; }
      if (skin.petals) {
        c.fillStyle = 'rgba(244,170,190,0.85)';
        c.beginPath(); c.ellipse(w.x, w.y, w.s * 1.3, w.s * 0.7, w.p, 0, Math.PI * 2); c.fill();
      } else {
        c.fillStyle = 'rgba(255,255,255,0.9)';
        c.beginPath(); c.arc(w.x, w.y, w.s * 0.7, 0, Math.PI * 2); c.fill();
      }
    }
  }

  function drawSkyFx(c, dt) {
    if (skin.night) {
      for (const s of stars) {
        const a = 0.4 + Math.sin(time * 1.5 + s.p) * 0.35;
        c.fillStyle = 'rgba(255,255,240,' + a.toFixed(3) + ')';
        c.beginPath(); c.arc(s.x * W, s.y * H, s.r, 0, Math.PI * 2); c.fill();
      }
      if (skin.aurora && !opts.reduced) {
        for (let k = 0; k < 2; k++) {
          c.beginPath();
          for (let x = 0; x <= W; x += 12) {
            const y = H * (0.18 + k * 0.08) + Math.sin(x / W * 5 + time * 0.4 + k) * H * 0.04;
            if (x === 0) c.moveTo(x, y); else c.lineTo(x, y);
          }
          c.strokeStyle = k ? 'rgba(130,120,220,0.22)' : 'rgba(90,220,170,0.25)';
          c.lineWidth = H * 0.05;
          c.stroke();
        }
      }
    } else if (!opts.reduced) {
      c.fillStyle = 'rgba(255,255,255,0.75)';
      for (const cl of clouds) {
        cl.x += cl.v * dt;
        if (cl.x > W + 120) cl.x = -120;
        const s = cl.s * Math.min(W, H) * 0.06;
        c.beginPath();
        c.arc(cl.x, cl.y, s, 0, Math.PI * 2);
        c.arc(cl.x + s * 1.1, cl.y + s * 0.2, s * 0.8, 0, Math.PI * 2);
        c.arc(cl.x - s * 1.0, cl.y + s * 0.25, s * 0.7, 0, Math.PI * 2);
        c.fill();
      }
    }
  }

  Scene.frame = function (dt, state) {
    if (!cx || !skin) return;
    time += dt;
    layout();
    const flowers = Math.min(40, state.owned.flower || 0);
    buildBg(flowers);
    let total = 0;
    for (const p of BZ.PRODUCERS) total += state.owned[p.id] || 0;
    const types = BZ.PRODUCERS.filter(p => (state.owned[p.id] || 0) > 0).length;
    const nc = Math.min(CELLS.length, 1 + types * 2 + Math.floor(Math.log2(1 + total)));
    if (nc > cellCount && time > 0.5) {
      for (let i = cellCount; i < nc; i++) {
        cellBirth[i] = time + (i - cellCount) * 0.08;
        const [q, r] = CELLS[i];
        const [x, y] = axial(q, r, comb.r);
        burst(comb.x + x, comb.y + y, opts.reduced ? 3 : 10, true);
      }
    }
    cellCount = nc;
    const want = Math.min(opts.reduced ? 10 : 34, Math.round(2 + Math.sqrt(state.owned.worker || 0) * 1.6 + types));
    const rushOn = state.buffs.some(b => b.id === 'rush') || state.boosts.some(b => b.mult);
    const frenzyOn = state.buffs.some(b => b.id === 'frenzy');
    comb.glow += ((rushOn || frenzyOn ? 1 : 0) - comb.glow) * Math.min(1, dt * 3);
    comb.vel += (-comb.squish * 160 - comb.vel * 14) * dt;
    comb.squish += comb.vel * dt;
    comb.squish = Math.max(-0.18, Math.min(0.18, comb.squish));
    updateBees(dt, want);
    const owned = state.bees ? BZ.BEES.filter(x => state.bees[x.id]) : [];
    const key = owned.length;
    if (key !== beeKey) {
      beeKey = key;
      bees.forEach((b, i) => { const sp = i % 3 === 1 && owned.length ? owned[(i * 7) % owned.length] : null; b.c0 = sp ? sp.c[0] : null; b.c1 = sp ? sp.c[1] : null; });
    }
    updateLucky(dt);

    const c = cx;
    c.setTransform(1, 0, 0, 1, 0, 0);
    c.drawImage(bg, 0, 0);
    c.setTransform(dpr, 0, 0, dpr, 0, 0);
    drawSkyFx(c, dt);
    for (const b of bees) if (b.y < comb.y) drawBee(c, b);
    drawComb(c, state);
    if (frenzyOn && !opts.reduced) {
      const rr = comb.r * (5 + Math.sin(time * 10) * 0.3);
      c.strokeStyle = 'rgba(242,140,40,0.55)';
      c.lineWidth = 3;
      c.beginPath(); c.arc(comb.x, comb.y, rr, 0, Math.PI * 2); c.stroke();
    }
    for (const b of bees) if (b.y >= comb.y) drawBee(c, b);
    drawWeather(c, dt);

    for (let i = parts.length - 1; i >= 0; i--) {
      const p = parts[i];
      p.life -= dt;
      if (p.life <= 0) { parts.splice(i, 1); continue; }
      if (p.grav) p.vy += 420 * dt;
      p.x += p.vx * dt; p.y += p.vy * dt;
      const a = Math.max(0, p.life / p.max);
      c.globalAlpha = a;
      c.fillStyle = p.spark ? '#FFF1B8' : p.gold ? '#FFD45E' : '#F2A03A';
      c.beginPath(); c.arc(p.x, p.y, p.r, 0, Math.PI * 2); c.fill();
    }
    c.globalAlpha = 1;
    drawLucky(c);
    updateDrops(c, dt);

    c.textAlign = 'center';
    c.textBaseline = 'middle';
    for (let i = texts.length - 1; i >= 0; i--) {
      const t = texts[i];
      t.life -= dt;
      if (t.life <= 0) { texts.splice(i, 1); continue; }
      t.y -= (t.big ? 26 : 50) * dt;
      const a = Math.min(1, t.life / 0.4);
      c.globalAlpha = a;
      c.font = (t.big ? '700 22px ' : '600 16px ') + 'Poppins, "Segoe UI", sans-serif';
      c.lineWidth = 4;
      c.strokeStyle = 'rgba(32,37,43,0.55)';
      c.strokeText(t.txt, t.x, t.y);
      c.fillStyle = t.big ? '#FFE7A8' : '#FFFFFF';
      c.fillText(t.txt, t.x, t.y);
    }
    c.globalAlpha = 1;
  };

  Scene.combPos = () => ({ x: comb.x, y: comb.y, r: comb.r });
  Scene.pulse = function (n) { comb.vel -= n || 3; burst(comb.x, comb.y, opts.reduced ? 6 : 22, true); };
})(typeof window !== 'undefined' ? window : globalThis);
