(function (root) {
  const BZ = root.BZ = root.BZ || {};
  const V = '10.12.2';
  const CDN = 'https://www.gstatic.com/firebasejs/' + V + '/';
  let fb = null, ready = null, user = null;

  const cfg = () => (BZ.CONFIG && BZ.CONFIG.firebase) || {};
  const configured = () => !!(cfg().apiKey && cfg().projectId && cfg().appId);

  async function load() {
    const [app, auth, fs] = await Promise.all([
      import(CDN + 'firebase-app.js'),
      import(CDN + 'firebase-auth.js'),
      import(CDN + 'firebase-firestore.js')
    ]);
    const c = cfg();
    const a = app.initializeApp({ apiKey: c.apiKey, authDomain: c.authDomain || (c.projectId + '.firebaseapp.com'), projectId: c.projectId, appId: c.appId });
    fb = { auth, fs, A: auth.getAuth(a), D: fs.getFirestore(a) };
    await new Promise(resolve => {
      let first = true;
      auth.onAuthStateChanged(fb.A, u => {
        user = u;
        if (first) { first = false; resolve(); }
        if (Cloud.onChange) Cloud.onChange(u);
      });
    });
    return true;
  }

  const Cloud = BZ.Cloud = {
    onChange: null,
    configured,
    init() {
      if (!configured()) return Promise.resolve(false);
      if (!ready) ready = load().catch(e => { ready = null; throw e; });
      return ready;
    },
    signedIn: () => !!user,
    uid: () => (user && user.uid) || '',
    who: () => (user && (user.email || user.displayName)) || '',
    async signIn() {
      await Cloud.init();
      const p = new fb.auth.GoogleAuthProvider();
      try { await fb.auth.signInWithPopup(fb.A, p); }
      catch (e) {
        if (e && (e.code === 'auth/popup-blocked' || e.code === 'auth/operation-not-supported-in-this-environment')) await fb.auth.signInWithRedirect(fb.A, p);
        else throw e;
      }
      return true;
    },
    async signOut() { if (fb) await fb.auth.signOut(fb.A); user = null; },
    async pull() {
      if (!user) return null;
      const snap = await fb.fs.getDoc(fb.fs.doc(fb.D, 'saves', user.uid));
      if (!snap.exists()) return null;
      try { return JSON.parse(snap.data().data); } catch (e) { return null; }
    },
    async push(data) {
      if (!user) return false;
      await fb.fs.setDoc(fb.fs.doc(fb.D, 'saves', user.uid), { data: JSON.stringify(data), at: Date.now() });
      return true;
    },
    async publish(profile) {
      if (!user) return false;
      await fb.fs.setDoc(fb.fs.doc(fb.D, 'players', user.uid), Object.assign({}, profile, { at: Date.now() }));
      return true;
    },
    async top(field, n) {
      const f = fb.fs;
      const q = f.query(f.collection(fb.D, 'players'), f.orderBy(field, 'desc'), f.limit(n || 50));
      const snap = await f.getDocs(q);
      return snap.docs.map(d => Object.assign({ uid: d.id }, d.data()));
    },
    async rankOf(field, value) {
      const f = fb.fs;
      const q = f.query(f.collection(fb.D, 'players'), f.where(field, '>', value));
      const snap = await f.getCountFromServer(q);
      return snap.data().count + 1;
    },
    async countPlayers() {
      const snap = await fb.fs.getCountFromServer(fb.fs.collection(fb.D, 'players'));
      return snap.data().count;
    },
    async group(gid) {
      const snap = await fb.fs.getDoc(fb.fs.doc(fb.D, 'groups', gid));
      return snap.exists() ? snap.data() : null;
    },
    async joinGroup(week, tier, entry) {
      const f = fb.fs;
      const uid = user.uid;
      for (let n = 0; n < 500; n++) {
        const gid = week + '_' + tier + '_' + n;
        const ref = f.doc(fb.D, 'groups', gid);
        const ok = await f.runTransaction(fb.D, async tx => {
          const snap = await tx.get(ref);
          if (!snap.exists()) { tx.set(ref, { week, tier, scores: { [uid]: entry } }); return true; }
          const sc = snap.data().scores || {};
          if (sc[uid]) return true;
          if (Object.keys(sc).length >= 20) return false;
          tx.update(ref, { ['scores.' + uid]: entry });
          return true;
        });
        if (ok) return gid;
      }
      return '';
    },
    async setScore(gid, entry) {
      if (!user || !gid) return false;
      await fb.fs.updateDoc(fb.fs.doc(fb.D, 'groups', gid), { ['scores.' + user.uid]: entry });
      return true;
    }
  };
})(typeof window !== 'undefined' ? window : globalThis);
