(function (root) {
  const BZ = root.BZ = root.BZ || {};
  const A = BZ.Audio = { sound: true, music: false };
  let ctx = null, master = null, sfx = null, mus = null, musicTimer = null, lastTap = 0;

  function ensure() {
    if (ctx) return ctx;
    const C = root.AudioContext || root.webkitAudioContext;
    if (!C) return null;
    ctx = new C();
    master = ctx.createGain(); master.gain.value = 0.8; master.connect(ctx.destination);
    const comp = ctx.createDynamicsCompressor(); comp.connect(master);
    sfx = ctx.createGain(); sfx.gain.value = 0.5; sfx.connect(comp);
    mus = ctx.createGain(); mus.gain.value = 0.0; mus.connect(comp);
    return ctx;
  }
  A.unlock = function () {
    const c = ensure();
    if (c && c.state === 'suspended') c.resume();
    if (A.music) startMusic();
  };

  function tone(freq, start, dur, opts) {
    opts = opts || {};
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = opts.type || 'sine';
    o.frequency.setValueAtTime(freq, start);
    if (opts.slide) o.frequency.exponentialRampToValueAtTime(freq * opts.slide, start + dur);
    const vol = opts.vol || 0.3;
    g.gain.setValueAtTime(0.0001, start);
    g.gain.exponentialRampToValueAtTime(vol, start + (opts.attack || 0.005));
    g.gain.exponentialRampToValueAtTime(0.0001, start + dur);
    o.connect(g); g.connect(opts.out || sfx);
    o.start(start); o.stop(start + dur + 0.05);
  }

  const PENTA = [0, 2, 4, 7, 9, 12, 14, 16, 19, 21, 24];
  const note = (base, step) => base * Math.pow(2, step / 12);

  A.play = function (name, arg) {
    if (!A.sound || !ensure() || ctx.state !== 'running') return;
    const t = ctx.currentTime;
    switch (name) {
      case 'tap': {
        if (t - lastTap < 0.035) return;
        lastTap = t;
        const c = Math.min(arg || 0, 100);
        const f = note(392, PENTA[Math.floor(c / 10)] || 0) * (1 + Math.random() * 0.01);
        tone(f, t, 0.12, { type: 'triangle', vol: 0.16, slide: 1.02 });
        tone(f * 2, t, 0.05, { type: 'sine', vol: 0.05 });
        break;
      }
      case 'buy':
        tone(660, t, 0.08, { type: 'triangle', vol: 0.14 });
        tone(990, t + 0.05, 0.12, { type: 'triangle', vol: 0.12 });
        break;
      case 'upgrade':
        [0, 4, 7, 12].forEach((s, i) => tone(note(523, s), t + i * 0.05, 0.2, { type: 'triangle', vol: 0.12 }));
        break;
      case 'milestone':
        [0, 4, 7, 12, 16].forEach((s, i) => tone(note(587, s), t + i * 0.07, 0.3, { type: 'sine', vol: 0.16 }));
        break;
      case 'luckySpawn':
        [24, 19, 28].forEach((s, i) => tone(note(523, s), t + i * 0.06, 0.25, { type: 'sine', vol: 0.06 }));
        break;
      case 'lucky':
        [0, 7, 12, 16, 19, 24].forEach((s, i) => tone(note(659, s), t + i * 0.04, 0.35, { type: 'sine', vol: 0.12 }));
        break;
      case 'achievement':
        tone(note(880, 0), t, 0.6, { type: 'sine', vol: 0.12 });
        tone(note(880, 7), t + 0.1, 0.6, { type: 'sine', vol: 0.1 });
        tone(note(880, 12), t + 0.2, 0.8, { type: 'sine', vol: 0.08 });
        break;
      case 'swarm':
        tone(220, t, 0.9, { type: 'sawtooth', vol: 0.05, slide: 4, attack: 0.3 });
        [0, 4, 7, 12, 16, 19].forEach((s, i) => tone(note(392, s), t + 0.4 + i * 0.06, 0.6, { type: 'triangle', vol: 0.12 }));
        break;
      case 'error':
        tone(180, t, 0.15, { type: 'square', vol: 0.05, slide: 0.8 });
        break;
      case 'click':
        tone(1200, t, 0.03, { type: 'sine', vol: 0.05 });
        break;
      case 'tick':
        tone(1500, t, 0.04, { type: 'sine', vol: 0.06 });
        break;
      case 'end':
        [12, 7, 4, 0].forEach((s, i) => tone(note(523, s), t + i * 0.09, 0.3, { type: 'triangle', vol: 0.12 }));
        break;
    }
  };

  function startMusic() {
    if (!ensure() || musicTimer) return;
    mus.gain.setTargetAtTime(0.35, ctx.currentTime, 1.5);
    const chords = [[0, 4, 7], [-3, 0, 4], [5, 9, 12], [2, 7, 11]];
    let bar = 0;
    const play = () => {
      if (!A.music || ctx.state !== 'running') return;
      const t = ctx.currentTime + 0.05;
      const ch = chords[bar % chords.length];
      ch.forEach(s => tone(note(196, s), t, 3.8, { type: 'sine', vol: 0.05, attack: 0.8, out: mus }));
      for (let i = 0; i < 4; i++) {
        if (Math.random() < 0.65) {
          const s = ch[Math.floor(Math.random() * 3)] + 12 + (Math.random() < 0.4 ? 12 : 0);
          tone(note(196, s), t + i * 0.95 + Math.random() * 0.1, 0.9, { type: 'triangle', vol: 0.04, out: mus });
        }
      }
      bar++;
    };
    play();
    musicTimer = setInterval(play, 3800);
  }
  function stopMusic() {
    if (musicTimer) { clearInterval(musicTimer); musicTimer = null; }
    if (mus) mus.gain.setTargetAtTime(0, ctx.currentTime, 0.5);
  }
  A.setMusic = function (on) {
    A.music = on;
    if (on) { if (ctx && ctx.state === 'running') startMusic(); }
    else stopMusic();
  };
  A.suspend = function () { if (ctx && ctx.state === 'running') ctx.suspend(); };
  A.resume = function () { if (ctx && ctx.state === 'suspended') ctx.resume(); };
})(typeof window !== 'undefined' ? window : globalThis);
