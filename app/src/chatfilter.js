(function (root) {
  const BZ = root.BZ = root.BZ || {};

  const PREFIX = ['fuck', 'fck', 'phuck', 'phuk', 'motherf', 'shit', 'bullshit', 'bitch', 'biatch', 'cunt', 'nigger', 'nigga', 'fagg', 'whore', 'slut', 'dickhead', 'asshole', 'arsehole', 'jackass', 'wank', 'pussy', 'porn', 'rapist', 'retarded', 'pedo', 'paedo', 'hitler',
    'putain', 'salop', 'salaud', 'connard', 'conard', 'connass', 'conass', 'encul', 'anculer', 'enfoir', 'branleu', 'bougnoul', 'negre', 'negro', 'batard', 'nique', 'niker', 'fdp', 'tafiol', 'petass', 'pouffi', 'tarlouz', 'pouffias', 'grognass', 'couilles', 'emmerd', 'merdi', 'pedophil', 'zizi', 'nichon', 'sodomi', 'tchoin', 'chienass'];
  const EXACT = ['fuk', 'fuking', 'fukin', 'ass', 'dick', 'dicks', 'cock', 'cocks', 'cum', 'twat', 'prick', 'fag', 'fags', 'rape', 'raped', 'raping', 'nazi', 'nazis', 'kys', 'retard', 'retards', 'tits', 'boobs', 'anal', 'sex', 'sexy', 'stfu', 'wtf', 'milf',
    'con', 'cons', 'pute', 'putes', 'chatte', 'couille', 'pd', 'pds', 'pede', 'pedes', 'tapette', 'tapettes', 'merde', 'merdes', 'chier', 'gouine', 'gouines', 'ntm', 'tg', 'ptn', 'bz', 'beze', 'baise', 'baiser', 'catin', 'cul', 'nik', 'niks'];
  const CONTAINS = ['fuck', 'nigger', 'nigga', 'cunt', 'bitch', 'whore', 'salope', 'encule', 'connard', 'motherf', 'asshole'];
  const PHRASES = [['ta', 'gueule'], ['ta', 'gueul'], ['ferme', 'ta', 'gueule'], ['ta', 'mere'], ['ta', 'race'], ['fils', 'de', 'pute'], ['va', 'te', 'faire'], ['suck', 'my'], ['son', 'of', 'a', 'bitch'], ['kill', 'yourself'], ['kill', 'urself'], ['go', 'die'], ['va', 'mourir'], ['suicide', 'toi']];
  const LEET = { '0': 'o', '1': 'i', '2': 'z', '3': 'e', '4': 'a', '5': 's', '6': 'g', '7': 't', '8': 'b', '9': 'g', '@': 'a', '$': 's', '|': 'i', '€': 'e', '£': 'l', '+': 't', '!': 'i' };
  const TLD = 'com|net|org|fr|io|gg|xyz|ru|be|co|me|tv|ly|link|app|dev|info|biz|site|online|shop|store|top|club|uk|de|es|it|ch|ca|us|eu|ai|cc|tk|ml|ga|cf|gq|pw|zip|mov|live|stream|vip|win|bet|casino|lol|fun|space|website|tech|pro|cn|jp|br|in|nl|pl|se|xxx';
  const LINK = new RegExp('(\\b(https?|ftp|file|data|javascript|vbscript)\\s*:|www\\s*\\.|\\b[a-z0-9-]{2,}\\s*(\\.|\\(\\s*dot\\s*\\)|\\[\\s*dot\\s*\\]|\\s+dot\\s+|\\s+point\\s+)\\s*(' + TLD + ')\\b|discord(app)?\\s*\\.?\\s*(gg|com|io)|\\bt\\s*\\.\\s*me\\b|bit\\s*\\.\\s*ly|tinyurl|onlyfans|\\bwa\\s*\\.\\s*me\\b)', 'i');
  const EMAIL = /[^\s@]+\s*(@|\(\s*at\s*\)|\[\s*at\s*\])\s*[^\s@]+\s*(\.|\s+dot\s+)\s*[a-z]{2,}/i;
  const CONTACT = /\b(gmail|hotmail|outlook|yahoo|icloud|protonmail|proton\s*mail|live\s*\.\s*fr|orange\s*\.\s*fr|free\s*\.\s*fr|snap\s*chat|snapchat|snap|insta|instagram|tiktok|whatsapp|whats\s*app|telegram|kik|skype|discord|facebook|messenger|twitter|onlyfans|my\s+number|mon\s+num(e|é)ro|mon\s+adresse|my\s+address)\b/i;
  const PHONE = /(\+\d{1,3}|(^|[^\d.,])0)[\s.\-]?\d([\s.\-]?\d){7,}/;
  const INVIS = /[\p{Cc}\p{Default_Ignorable_Code_Point}]/gu;
  const MASK = '*****';

  function base(txt) {
    let s = String(txt == null ? '' : txt);
    try { s = s.normalize('NFKC'); } catch (e) {}
    s = s.replace(INVIS, '').replace(/\p{M}/gu, '');
    s = s.replace(/[<>`\\]/g, '').replace(/\s+/g, ' ').trim();
    s = s.replace(/(\D)\1{3,}/gu, '$1$1$1');
    return s;
  }
  function norm(w) {
    let s = w.toLowerCase();
    try { s = s.normalize('NFD').replace(/\p{M}/gu, ''); } catch (e) {}
    if (/[a-z]/.test(s)) s = s.replace(/[0-9@$|€£+!]/g, c => LEET[c] || c);
    s = s.replace(/[^a-z]/g, '');
    return s.replace(/(.)\1+/g, '$1');
  }
  const PRE = PREFIX.map(norm), EX = new Set(EXACT.map(norm)), CON = CONTAINS.map(norm), PH = PHRASES.map(p => p.map(norm));
  function bad(w) {
    if (!w) return false;
    if (EX.has(w)) return true;
    if (PRE.some(p => w.startsWith(p))) return true;
    if (w.length >= 5 && CON.some(p => w.includes(p))) return true;
    return false;
  }

  function star(raw) {
    if (!raw.includes('*') || !/\p{L}/u.test(raw)) return false;
    let p = raw.toLowerCase();
    try { p = p.normalize('NFD').replace(/\p{M}/gu, ''); } catch (e) {}
    p = p.replace(/[0-9@$|€£+!]/g, c => LEET[c] || c).replace(/[^a-z*]/g, '').replace(/\*+/g, '*').replace(/(.)\1+/g, '$1');
    if (p.replace(/\*/g, '').length < 2 || p.length < 3) return false;
    const body = p.replace(/\*/g, '[a-z]{1,4}');
    const pre = new RegExp('^' + body), full = new RegExp('^' + body + '$');
    return PRE.some(x => pre.test(x) || full.test(x)) || [...EX].some(x => full.test(x));
  }
  function mask(txt) {
    const s = base(txt);
    const toks = [];
    const re = /[\p{L}\p{N}@$|€£+*!]+/gu;
    let m;
    while ((m = re.exec(s))) {
      const lead = m[0].length - m[0].replace(/^!+/, '').length;
      const raw = m[0].replace(/^!+|!+$/g, '');
      if (!raw || /^\*+$/.test(raw)) continue;
      toks.push({ i: m.index + lead, j: m.index + lead + raw.length, w: norm(raw), raw });
    }
    const hit = new Array(toks.length).fill(false);
    toks.forEach((t, k) => { if (bad(t.w) || star(t.raw)) hit[k] = true; });
    for (let k = 0; k < toks.length; k++) {
      for (const ph of PH) {
        if (k + ph.length > toks.length) continue;
        if (ph.every((p, x) => toks[k + x].w === p || (p.length > 3 && toks[k + x].w.startsWith(p)))) for (let x = 0; x < ph.length; x++) hit[k + x] = true;
      }
    }
    for (let k = 0; k < toks.length;) {
      if (toks[k].w.length > 2) { k++; continue; }
      let e = k + 1;
      while (e < toks.length && toks[e].w.length <= 2 && /^[\s._\-,'"]*$/.test(s.slice(toks[e - 1].j, toks[e].i))) e++;
      if (e - k >= 3) {
        let found = false;
        for (let a = k; a < e && !found; a++) for (let b = a + 2; b <= e && !found; b++) { const j = norm(toks.slice(a, b).map(x => x.raw).join('')); if (bad(j) || (j.length >= 4 && CON.some(p => j.includes(p)))) found = true; }
        if (found) for (let x = k; x < e; x++) hit[x] = true;
      }
      k = e;
    }
    let out = '', last = 0;
    for (let k = 0; k < toks.length; k++) {
      if (!hit[k]) continue;
      let e = k;
      while (e + 1 < toks.length && hit[e + 1] && /^[\s._\-*,'"]*$/.test(s.slice(toks[e].j, toks[e + 1].i))) e++;
      out += s.slice(last, toks[k].i) + MASK;
      last = toks[e].j;
      k = e;
    }
    out += s.slice(last);
    return out;
  }

  function linky(s) {
    const flat = s.replace(INVIS, '');
    return LINK.test(flat) || LINK.test(flat.replace(/\s+/g, ''));
  }
  function contact(s) { return EMAIL.test(s) || CONTACT.test(s) || PHONE.test(s); }

  function display(txt) {
    let s = base(txt).slice(0, 220);
    if (linky(s) || EMAIL.test(s) || PHONE.test(s)) return MASK;
    return mask(s);
  }
  function name(txt) {
    const s = base(txt).slice(0, 18);
    if (!s) return '?';
    return linky(s) || contact(s) ? MASK : mask(s);
  }
  function check(txt, max) {
    let s = base(txt).slice(0, max || 200).trim();
    if (!s || !/[\p{L}\p{N}\p{So}\p{Sk}?!]/u.test(s)) return { err: 'cm_short' };
    if (linky(s)) return { err: 'cm_link' };
    if (contact(s)) return { err: 'cm_contact' };
    const letters = s.replace(/[^\p{L}]/gu, '');
    if (letters.length >= 8 && letters.replace(/[^\p{Lu}]/gu, '').length / letters.length > 0.7) s = s.charAt(0) + s.slice(1).toLowerCase();
    s = mask(s);
    if (s.includes(MASK) && !s.replace(/\*+/g, '').replace(/[\s\p{P}]/gu, '')) return { err: 'cm_bad' };
    return { txt: s };
  }

  BZ.ChatFilter = { base, mask, display, name, check, linky, contact, MASK };
})(typeof window !== 'undefined' ? window : globalThis);
