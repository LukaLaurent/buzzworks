(function (root) {
  const BZ = root.BZ = root.BZ || {};
  BZ.CONFIG = {
    firebase: {
      apiKey: '',
      authDomain: '',
      projectId: '',
      appId: ''
    }
  };
})(typeof window !== 'undefined' ? window : globalThis);
