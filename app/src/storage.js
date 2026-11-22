(function (root) {
  const BZ = root.BZ = root.BZ || {};
  const KEY = 'buzzworks.';
  const Store = BZ.Store = { server: false };
  const Log = BZ.Log = { lines: [] };
  let logQueue = [];
  let logTimer = null;

  Log.write = function (level, msg) {
    const d = new Date();
    const stamp = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0') + ' ' + d.toTimeString().slice(0, 8);
    const line = stamp + ' [' + level + '] ' + msg;
    Log.lines.push(line);
    if (Log.lines.length > 300) Log.lines.shift();
    if (level === 'error') console.error(line); else console.log(line);
    if (Store.server) {
      logQueue.push(line);
      if (!logTimer) logTimer = setTimeout(flushLogs, 1500);
    }
  };
  Log.info = m => Log.write('info', m);
  Log.error = m => Log.write('error', m);
  function flushLogs() {
    logTimer = null;
    if (!logQueue.length) return;
    const body = logQueue.join('\n');
    logQueue = [];
    fetch('/api/log', { method: 'POST', body }).catch(() => {});
  }

  Store.init = async function () {
    const h = location.hostname;
    if (location.protocol === 'file:' || !(h === 'localhost' || h === '127.0.0.1' || h === '::1' || h === '[::1]')) { Store.server = false; return false; }
    try {
      const r = await fetch('/api/ping', { cache: 'no-store' });
      if (!r.ok || !(r.headers.get('content-type') || '').includes('json')) { Store.server = false; return false; }
      Store.server = r.ok;
    } catch (e) { Store.server = false; }
    return Store.server;
  };

  function readLocal(name) {
    try { const v = localStorage.getItem(KEY + name); return v ? JSON.parse(v) : null; } catch (e) { return null; }
  }
  function writeLocal(name, obj) {
    try { localStorage.setItem(KEY + name, JSON.stringify(obj)); return true; } catch (e) { return false; }
  }

  Store.load = async function (name) {
    const local = readLocal(name);
    if (!Store.server) return local;
    try {
      const r = await fetch('/api/data/' + name, { cache: 'no-store' });
      if (!r.ok) return local;
      const txt = await r.text();
      if (!txt) return local;
      const remote = JSON.parse(txt);
      if (local && remote && (local.lastSave || 0) > (remote.lastSave || 0)) return local;
      return remote || local;
    } catch (e) {
      Log.error('load ' + name + ' failed: ' + e.message);
      return local;
    }
  };

  Store.save = async function (name, obj) {
    const ok = writeLocal(name, obj);
    if (!Store.server) return ok;
    try {
      const r = await fetch('/api/data/' + name, { method: 'POST', body: JSON.stringify(obj) });
      return r.ok || ok;
    } catch (e) { return ok; }
  };
  Store.saveSync = function (name, obj) {
    writeLocal(name, obj);
    if (Store.server && navigator.sendBeacon) {
      try { navigator.sendBeacon('/api/data/' + name, JSON.stringify(obj)); } catch (e) {}
    }
  };

  Store.clear = async function () {
    try { Object.keys(localStorage).filter(k => k.startsWith(KEY)).forEach(k => localStorage.removeItem(k)); } catch (e) {}
    if (Store.server) {
      try { await fetch('/api/data/save', { method: 'POST', body: '' }); } catch (e) {}
    }
  };

  function checksum(str) {
    let h = 2166136261;
    for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
    return (h >>> 0).toString(36);
  }
  Store.checksum = checksum;

  Store.encode = function (obj) {
    const json = JSON.stringify(obj);
    const b = btoa(unescape(encodeURIComponent(json)));
    return 'BZ1.' + checksum(json) + '.' + b;
  };
  Store.decode = function (code) {
    try {
      const parts = code.trim().split('.');
      if (parts.length !== 3 || parts[0] !== 'BZ1') return null;
      const json = decodeURIComponent(escape(atob(parts[2])));
      if (checksum(json) !== parts[1]) return null;
      return JSON.parse(json);
    } catch (e) { return null; }
  };

  Store.serialize = function (s) {
    const out = {};
    for (const k in s) if (k[0] !== '_') out[k] = s[k];
    return out;
  };
})(typeof window !== 'undefined' ? window : globalThis);
