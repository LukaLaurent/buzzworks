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
    email: () => (user && user.emailVerified !== false && user.email) || '',
    async isAdmin() {
      if (!user) return false;
      const snap = await fb.fs.getDoc(fb.fs.doc(fb.D, 'admins', user.uid));
      return snap.exists();
    },
    async banned() {
      if (!user) return false;
      const snap = await fb.fs.getDoc(fb.fs.doc(fb.D, 'banned', user.uid));
      return snap.exists();
    },
    async gifts() {
      if (!user) return [];
      const f = fb.fs;
      const snap = await f.getDocs(f.collection(fb.D, 'gifts', user.uid, 'items'));
      return snap.docs.map(d => Object.assign({}, d.data(), { id: d.id }));
    },
    async takeGift(id) {
      await fb.fs.deleteDoc(fb.fs.doc(fb.D, 'gifts', user.uid, 'items', id));
    },
    feedback: {
      send(d) {
        const f = fb.fs, b = f.writeBatch(fb.D), ts = f.serverTimestamp();
        b.set(f.doc(f.collection(fb.D, 'feedback')), Object.assign({ uid: user.uid }, d, { at: ts }));
        b.set(f.doc(fb.D, 'feedmeta', user.uid), { last: ts });
        return b.commit();
      }
    },
    boss: {
      setScore: (day, e) => fb.fs.setDoc(fb.fs.doc(fb.D, 'boss', day, 'scores', user.uid), Object.assign({}, e, { at: Date.now() })),
      async mine(day) {
        const snap = await fb.fs.getDoc(fb.fs.doc(fb.D, 'boss', day, 'scores', user.uid));
        return snap.exists() ? snap.data() : null;
      },
      claim: day => fb.fs.setDoc(fb.fs.doc(fb.D, 'boss', day, 'claims', user.uid), { at: fb.fs.serverTimestamp() }),
      async top(day, k) {
        const f = fb.fs;
        const snap = await f.getDocs(f.query(f.collection(fb.D, 'boss', day, 'scores'), f.orderBy('p', 'desc'), f.limit(k || 50)));
        return snap.docs.map(d => Object.assign({ uid: d.id }, d.data()));
      },
      async rank(day, p) {
        const f = fb.fs;
        const a = await f.getCountFromServer(f.query(f.collection(fb.D, 'boss', day, 'scores'), f.where('p', '>', p)));
        const b = await f.getCountFromServer(f.collection(fb.D, 'boss', day, 'scores'));
        return { rank: a.data().count + 1, total: b.data().count };
      }
    },
    admin: {
      gift: (uid, d) => fb.fs.addDoc(fb.fs.collection(fb.D, 'gifts', uid, 'items'), Object.assign({}, d, { at: Date.now(), by: user.uid })),
      ban: (uid, name) => fb.fs.setDoc(fb.fs.doc(fb.D, 'banned', uid), { name: name || '', at: Date.now() }),
      unban: uid => fb.fs.deleteDoc(fb.fs.doc(fb.D, 'banned', uid)),
      async bannedList() { const snap = await fb.fs.getDocs(fb.fs.collection(fb.D, 'banned')); return snap.docs.map(d => Object.assign({ uid: d.id }, d.data())); },
      dropPlayer: uid => fb.fs.deleteDoc(fb.fs.doc(fb.D, 'players', uid)),
      rename: (uid, name) => fb.fs.updateDoc(fb.fs.doc(fb.D, 'players', uid), { name }),
      async save(uid) {
        const snap = await fb.fs.getDoc(fb.fs.doc(fb.D, 'saves', uid));
        if (!snap.exists()) return null;
        try { return JSON.parse(snap.data().data); } catch (e) { return null; }
      },
      async groupsOf(uid) {
        const f = fb.fs;
        const snap = await f.getDocs(f.query(f.collection(fb.D, 'groups'), f.where('scores.' + uid + '.p', '>=', 0)));
        return snap.docs.map(d => Object.assign({ gid: d.id }, d.data()));
      },
      setPoints: (gid, uid, p) => fb.fs.updateDoc(fb.fs.doc(fb.D, 'groups', gid), { ['scores.' + uid + '.p']: p }),
      async feedback() {
        const f = fb.fs;
        const snap = await f.getDocs(f.query(f.collection(fb.D, 'feedback'), f.orderBy('at', 'desc'), f.limit(200)));
        return snap.docs.map(d => { const x = d.data(); return { id: d.id, uid: x.uid, n: x.n, l: x.l, kind: x.kind, txt: x.txt, v: x.v, at: x.at && x.at.toMillis ? x.at.toMillis() : 0 }; });
      },
      delFeedback: id => fb.fs.deleteDoc(fb.fs.doc(fb.D, 'feedback', id)),
      kick: (gid, uid) => fb.fs.updateDoc(fb.fs.doc(fb.D, 'groups', gid), { ['scores.' + uid]: fb.fs.deleteField() })
    },
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
