(function (root) {
  const BZ = root.BZ = root.BZ || {};
  const F = BZ.F = {};

  const SHORT = ['', 'K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'No', 'Dc', 'Ud', 'Dd', 'Td', 'Qad', 'Qid', 'Sxd', 'Spd', 'Ocd', 'Nod', 'Vg', 'Uvg', 'Dvg', 'Tvg', 'Qavg', 'Qivg', 'Sxvg', 'Spvg', 'Ocvg', 'Novg', 'Tg'];
  const SHORT_FR = ['', 'k', 'M', 'Md', 'Bn', 'Bd', 'Tn', 'Td', 'Qn', 'Qd', 'Qin', 'Qid', 'Sxn', 'Sxd', 'Spn', 'Spd', 'Ocn', 'Ocd', 'Non', 'Nod', 'Dcn', 'Dcd', 'Udn', 'Udd', 'Ddn', 'Ddd', 'Tdn', 'Tdd', 'Qadn', 'Qadd', 'Qidn', 'Qidd'];

  F.lang = 'en';
  F.notation = 'short';

  function dec(str) { return F.lang === 'fr' ? str.replace('.', ',') : str; }
  function group(n) {
    const s = Math.floor(n).toString();
    const sep = F.lang === 'fr' ? ' ' : ',';
    return s.replace(/\B(?=(\d{3})+(?!\d))/g, sep);
  }
  function trim(n, digits) {
    let s = n.toFixed(digits);
    if (s.indexOf('.') >= 0) s = s.replace(/0+$/, '').replace(/\.$/, '');
    return s;
  }

  F.num = function (n, opts) {
    opts = opts || {};
    if (!isFinite(n)) return n > 0 ? '∞' : '0';
    if (n < 0) return '-' + F.num(-n, opts);
    if (n < 1000) {
      if (opts.int || n >= 100) return group(n);
      if (n < 10) return dec(trim(n, 2));
      return dec(trim(n, n < 10 ? 1 : 0));
    }
    if (n < 1e6 && !opts.compact) return group(n);
    const e = Math.floor(Math.log10(n) + 1e-9);
    if (F.notation === 'sci' || (e / 3 | 0) >= SHORT.length) {
      const m = n / Math.pow(10, e);
      return dec(m.toFixed(2)) + 'e' + e;
    }
    const tier = Math.floor(e / 3);
    const m = n / Math.pow(10, tier * 3);
    const digits = m >= 100 ? 1 : 2;
    const suf = (F.lang === 'fr' ? SHORT_FR : SHORT)[tier];
    return dec(trim(m, digits)) + (F.lang === 'fr' ? ' ' : ' ') + suf;
  };

  F.int = n => group(n);

  F.pct = function (x) {
    const v = x * 100;
    return dec(trim(v, v < 10 ? 1 : 0)) + (F.lang === 'fr' ? ' %' : '%');
  };

  F.mult = function (x) {
    if (x >= 1e6) return 'x' + F.num(x);
    return 'x' + dec(trim(x, x < 10 ? 2 : x < 100 ? 1 : 0));
  };

  F.time = function (secs) {
    secs = Math.max(0, Math.round(secs));
    const d = Math.floor(secs / 86400);
    const h = Math.floor(secs % 86400 / 3600);
    const m = Math.floor(secs % 3600 / 60);
    const s = secs % 60;
    if (d > 0) return d + (F.lang === 'fr' ? ' j ' : 'd ') + h + ' h';
    if (h > 0) return h + ' h ' + String(m).padStart(2, '0');
    if (m > 0) return m + ' min ' + String(s).padStart(2, '0');
    return s + ' s';
  };

  F.clock = function (secs) {
    secs = Math.max(0, Math.ceil(secs));
    const h = Math.floor(secs / 3600), m = Math.floor(secs % 3600 / 60), s = secs % 60;
    const mm = String(m).padStart(h ? 2 : 1, '0'), ss = String(s).padStart(2, '0');
    return h ? h + ':' + mm + ':' + ss : mm + ':' + ss;
  };

  F.date = function (d) {
    d = d instanceof Date ? d : new Date(d);
    if (F.lang === 'fr') return String(d.getDate()).padStart(2, '0') + '/' + String(d.getMonth() + 1).padStart(2, '0') + '/' + d.getFullYear();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear();
  };
})(typeof window !== 'undefined' ? window : globalThis);
