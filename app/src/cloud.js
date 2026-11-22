(function (root) {
  const BZ = root.BZ = root.BZ || {};
  const SCOPE = 'https://www.googleapis.com/auth/drive.appdata';
  const FILE = 'buzzworks-save.json';
  const KEY = 'buzzworks.cloud';
  const API = 'https://www.googleapis.com/drive/v3';
  const UP = 'https://www.googleapis.com/upload/drive/v3';
  let client = null, token = '', exp = 0, fileId = '', email = '';
  let pending = null, ready = null;

  const cfg = () => (BZ.CONFIG && BZ.CONFIG.googleClientId) || '';
  function remembered() { try { return JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) { return null; } }
  function remember(v) { try { if (v) localStorage.setItem(KEY, JSON.stringify(v)); else localStorage.removeItem(KEY); } catch (e) {} }

  function loadScript() {
    if (root.google && root.google.accounts && root.google.accounts.oauth2) return Promise.resolve();
    return new Promise((resolve, reject) => {
      const el = document.createElement('script');
      el.src = 'https://accounts.google.com/gsi/client';
      el.async = true;
      el.onload = () => resolve();
      el.onerror = () => reject(new Error('Google script failed to load'));
      document.head.appendChild(el);
    });
  }

  async function api(url, opt) {
    const r = await fetch(url, Object.assign({}, opt, { headers: Object.assign({ Authorization: 'Bearer ' + token }, (opt && opt.headers) || {}) }));
    if (r.status === 401) { token = ''; exp = 0; throw new Error('expired'); }
    if (!r.ok) throw new Error('drive ' + r.status);
    return r;
  }

  const Cloud = BZ.Cloud = {
    configured: () => !!cfg(),
    signedIn: () => !!token && Date.now() < exp,
    wanted: () => !!(remembered() && remembered().on),
    who: () => email || ((remembered() || {}).email || ''),
    init() {
      if (!cfg()) return Promise.resolve(false);
      if (ready) return ready;
      ready = loadScript().then(() => {
        client = root.google.accounts.oauth2.initTokenClient({
          client_id: cfg(),
          scope: SCOPE,
          callback: resp => {
            const p = pending; pending = null;
            if (!resp || resp.error || !resp.access_token) { if (p) p.reject(new Error((resp && resp.error) || 'no token')); return; }
            token = resp.access_token;
            exp = Date.now() + Math.max(60, (+resp.expires_in || 3600) - 60) * 1000;
            Cloud.profile().catch(() => {}).then(() => { remember({ on: 1, email }); if (p) p.resolve(true); });
          },
          error_callback: err => { const p = pending; pending = null; if (p) p.reject(new Error((err && err.type) || 'popup')); }
        });
        return true;
      });
      return ready;
    },
    request(prompt) {
      return Cloud.init().then(ok => {
        if (!ok) throw new Error('not configured');
        return new Promise((resolve, reject) => {
          pending = { resolve, reject };
          const hint = Cloud.who();
          client.requestAccessToken(Object.assign({ prompt }, hint ? { login_hint: hint } : {}));
        });
      });
    },
    signIn() { return Cloud.request(Cloud.wanted() ? '' : 'consent'); },
    resume() {
      if (!Cloud.configured() || !Cloud.wanted() || Cloud.signedIn()) return Promise.resolve(false);
      return Cloud.request('');
    },
    signOut() {
      try { if (token && root.google) root.google.accounts.oauth2.revoke(token, () => {}); } catch (e) {}
      token = ''; exp = 0; fileId = ''; email = '';
      remember(null);
    },
    async profile() {
      const r = await api(API + '/about?fields=user(emailAddress,displayName)');
      const j = await r.json();
      email = (j.user && (j.user.emailAddress || j.user.displayName)) || '';
    },
    async find() {
      if (fileId) return fileId;
      const q = encodeURIComponent("name='" + FILE + "'");
      const r = await api(API + '/files?spaces=appDataFolder&q=' + q + '&fields=files(id,modifiedTime)&pageSize=5');
      const j = await r.json();
      fileId = (j.files && j.files[0] && j.files[0].id) || '';
      return fileId;
    },
    async pull() {
      if (!Cloud.signedIn()) return null;
      const id = await Cloud.find();
      if (!id) return null;
      const r = await api(API + '/files/' + id + '?alt=media');
      const txt = await r.text();
      try { return JSON.parse(txt); } catch (e) { return null; }
    },
    async push(data) {
      if (!Cloud.signedIn()) return false;
      const body = JSON.stringify(data);
      const id = await Cloud.find();
      if (id) {
        await api(UP + '/files/' + id + '?uploadType=media', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body });
        return true;
      }
      const meta = { name: FILE, parents: ['appDataFolder'], mimeType: 'application/json' };
      const b = 'bz' + Math.random().toString(36).slice(2);
      const multipart = '--' + b + '\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n' + JSON.stringify(meta) + '\r\n--' + b + '\r\nContent-Type: application/json\r\n\r\n' + body + '\r\n--' + b + '--';
      const r = await api(UP + '/files?uploadType=multipart&fields=id', { method: 'POST', headers: { 'Content-Type': 'multipart/related; boundary=' + b }, body: multipart });
      const j = await r.json();
      fileId = j.id || '';
      return true;
    }
  };
})(typeof window !== 'undefined' ? window : globalThis);
