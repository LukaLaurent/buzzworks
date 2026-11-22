(function (root) {
  const BZ = root.BZ = root.BZ || {};

  function gear() {
    const pts = [];
    const teeth = 8;
    for (let i = 0; i < teeth * 4; i++) {
      const a = (i / (teeth * 4)) * Math.PI * 2 - Math.PI / 2;
      const r = (i % 4 === 0 || i % 4 === 1) ? 9.5 : 7.2;
      pts.push((12 + Math.cos(a) * r).toFixed(2) + ' ' + (12 + Math.sin(a) * r).toFixed(2));
    }
    return '<path d="M' + pts.join('L') + 'Z"/><circle cx="12" cy="12" r="3"/>';
  }
  function hex(cx, cy, r) {
    const p = [];
    for (let i = 0; i < 6; i++) { const a = Math.PI / 3 * i + Math.PI / 6; p.push((cx + r * Math.cos(a)).toFixed(2) + ' ' + (cy + r * Math.sin(a)).toFixed(2)); }
    return 'M' + p.join('L') + 'Z';
  }

  const I = {
    hive: '<path d="' + hex(12, 12, 8.5) + '"/><path d="' + hex(12, 12, 3.6) + '"/>',
    crown: '<path d="M4 17.5 3 8l5 4 4-6 4 6 5-4-1 9.5Z"/><path d="M5 20.5h14"/>',
    calendar: '<rect x="3.5" y="5" width="17" height="15.5" rx="3"/><path d="M3.5 10h17M8 3v4M16 3v4"/><path d="m9 15 2 2 4-4"/>',
    league: '<path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0Z"/><path d="M7 6H4.5a2.5 2.5 0 0 0 2.5 4.5M17 6h2.5a2.5 2.5 0 0 1-2.5 4.5"/>',
    shop: '<path d="M5 8h14l-1.2 11.2a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8Z"/><path d="M9 10V7a3 3 0 0 1 6 0v3"/>',
    trophy: '<circle cx="12" cy="9" r="5.5"/><path d="m8.5 13.5-1.5 7 5-2.5 5 2.5-1.5-7"/><path d="m12 6.5.8 1.7 1.8.2-1.3 1.2.4 1.8-1.7-.9-1.7.9.4-1.8-1.3-1.2 1.8-.2Z"/>',
    settings: gear(),
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5.5M12 7.6v.2"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    close: '<path d="M6 6l12 12M18 6 6 18"/>',
    gem: '<path d="M7 4h10l4 5-9 11L3 9Z"/><path d="M3 9h18M9.5 4 8 9l4 11 4-11-1.5-5"/>',
    bolt: '<path d="M13 3 5 13.5h6L10 21l8-10.5h-6Z"/>',
    clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
    star: '<path d="m12 3.5 2.6 5.3 5.8.8-4.2 4.1 1 5.8L12 16.8l-5.2 2.7 1-5.8-4.2-4.1 5.8-.8Z"/>',
    check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
    lock: '<rect x="5" y="10.5" width="14" height="10" rx="2.5"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5"/>',
    play: '<path d="M8 5.5v13l10.5-6.5Z"/>',
    copy: '<rect x="8.5" y="8.5" width="12" height="12" rx="2.5"/><path d="M15.5 8.5V6a2.5 2.5 0 0 0-2.5-2.5H6A2.5 2.5 0 0 0 3.5 6v7A2.5 2.5 0 0 0 6 15.5h2.5"/>',
    upload: '<path d="M12 15V4M7.5 8.5 12 4l4.5 4.5M4.5 15v3a2.5 2.5 0 0 0 2.5 2.5h10a2.5 2.5 0 0 0 2.5-2.5v-3"/>',
    download: '<path d="M12 4v11M7.5 10.5 12 15l4.5-4.5M4.5 15v3a2.5 2.5 0 0 0 2.5 2.5h10a2.5 2.5 0 0 0 2.5-2.5v-3"/>',
    swarm: '<path d="M20 12a8 8 0 1 1-2.3-5.7"/><path d="M20 4.5v4h-4"/><circle cx="12" cy="12" r="2.5"/>',
    sparkle: '<path d="M12 3c.6 4.4 2.6 6.4 7 7-4.4.6-6.4 2.6-7 7-.6-4.4-2.6-6.4-7-7 4.4-.6 6.4-2.6 7-7Z"/><path d="M19 15.5c.2 1.6.9 2.3 2.5 2.5-1.6.2-2.3.9-2.5 2.5-.2-1.6-.9-2.3-2.5-2.5 1.6-.2 2.3-.9 2.5-2.5Z"/>',
    medal: '<circle cx="12" cy="14.5" r="5.5"/><path d="M8.5 10 6 3.5h4l2 4 2-4h4L15.5 10"/>',
    drop: '<path d="M12 3.5c3.5 4.4 6 7.8 6 10.8a6 6 0 0 1-12 0c0-3 2.5-6.4 6-10.8Z"/>',
    tap: '<path d="M9.5 11V5.5a1.8 1.8 0 0 1 3.6 0V11"/><path d="M13.1 10v-1a1.8 1.8 0 0 1 3.6 0V11a1.8 1.8 0 0 1 3.3 1v2.5c0 4-2.7 6.5-6.5 6.5-2.6 0-4.3-1.2-5.6-3.3L5.4 13a1.8 1.8 0 0 1 3-1.9l1.1 1.4"/>',
    palette: '<path d="M12 3.5a8.5 8.5 0 1 0 0 17c1.4 0 2-1 1.6-2.1-.5-1.3.4-2.4 1.8-2.4h1.9a3.2 3.2 0 0 0 3.2-3.3c0-5.2-3.8-9.2-8.5-9.2Z"/><circle cx="8" cy="10.5" r="1"/><circle cx="12" cy="7.5" r="1"/><circle cx="16" cy="10" r="1"/>',
    chart: '<path d="M4 20h16M7 16v-4M12 16V7M17 16v-7"/>',
    trash: '<path d="M4.5 7h15M9.5 7V4.5h5V7M6.5 7l.9 12a2 2 0 0 0 2 1.8h5.2a2 2 0 0 0 2-1.8l.9-12"/>',
    user: '<circle cx="12" cy="8.5" r="4"/><path d="M4.5 20.5c.8-3.6 3.8-6 7.5-6s6.7 2.4 7.5 6"/>',
    gift: '<rect x="4" y="9" width="16" height="11.5" rx="2"/><path d="M3 9h18M12 9v11.5M12 9C10 5 6.5 4.5 6.5 7S10 9 12 9Zm0 0c2-4 5.5-4.5 5.5-2S14 9 12 9Z"/>',
    flower: '<circle cx="12" cy="9" r="2.3"/><path d="M12 6.7a2.6 2.6 0 1 1 2.3-1.9M14.2 8.3a2.6 2.6 0 1 1 .4 2.9M13.4 11a2.6 2.6 0 1 1-2.8 0M9.4 11.2a2.6 2.6 0 1 1 .4-2.9M9.7 4.8A2.6 2.6 0 1 1 12 6.7"/><path d="M12 11.3V21M12 17c-2.5 0-4-1.2-4.5-3 2.5 0 4 1 4.5 3Z"/>',
    worker: '<ellipse cx="12" cy="14" rx="5.5" ry="4.5"/><path d="M10 9.7v8.6M14 9.7v8.6"/><path d="M9 10c-3-1.2-4.5-3.5-3.5-5.5S10 4.5 11 8.5M15 10c3-1.2 4.5-3.5 3.5-5.5S14 4.5 13 8.5"/>',
    hivebox: '<rect x="4" y="9" width="16" height="11" rx="2"/><path d="M3 9.5 12 4l9 5.5M4 14.5h16"/><path d="M10.5 17.5h3"/>',
    meadow: '<path d="M3 20.5h18"/><path d="M6 20.5c0-4 1-7 3-9M9 20.5c0-5 .5-9-.5-12M12 20.5c0-4 1.5-8 4-10M16 20.5c0-3 1-5 3-6.5"/><circle cx="9" cy="7" r="1.6"/><circle cx="16.5" cy="9.5" r="1.6"/>',
    apiary: '<rect x="2.5" y="11" width="8" height="9.5" rx="1.5"/><rect x="13.5" y="11" width="8" height="9.5" rx="1.5"/><path d="M2 11.5 6.5 8l4.5 3.5M13 11.5 17.5 8l4.5 3.5M6.5 4.5v1M17.5 4.5v1"/>',
    press: '<path d="M5 20.5h14M7 20.5v-5h10v5M12 15.5V8M8 4h8M12 4v4"/><circle cx="12" cy="8.5" r="1.3"/>',
    brewery: '<ellipse cx="12" cy="5.5" rx="6" ry="2"/><path d="M6 5.5v13c0 1.1 2.7 2 6 2s6-.9 6-2v-13M6 10c0 1.1 2.7 2 6 2s6-.9 6-2M6 14.5c0 1.1 2.7 2 6 2s6-.9 6-2"/>',
    candle: '<rect x="8" y="10" width="8" height="10.5" rx="1.5"/><path d="M12 10V8.2M12 3.5c1.6 1.6 1.8 3 0 4.7-1.8-1.7-1.6-3.1 0-4.7Z"/><path d="M8 13.5c1.5 0 1.5 1.5 3 1.5"/>',
    market: '<path d="M4 9.5 5.5 4h13L20 9.5"/><path d="M4 9.5c0 1.5 1.3 2.5 2.7 2.5s2.6-1 2.6-2.5c0 1.5 1.2 2.5 2.7 2.5s2.7-1 2.7-2.5c0 1.5 1.2 2.5 2.6 2.5S20 11 20 9.5"/><path d="M5.5 12v8.5h13V12M10 20.5v-5h4v5"/>',
    greenhouse: '<path d="M3.5 20.5V11a8.5 7 0 0 1 17 0v9.5Z"/><path d="M12 4v16.5M3.5 13h17M7 5.5v15M17 5.5v15"/>',
    airship: '<ellipse cx="12" cy="9" rx="8.5" ry="4.5"/><path d="M3.5 9h17M9 13.3l1 3h4l1-3"/><rect x="9.5" y="16.3" width="5" height="3" rx="1"/>',
    refinery: '<path d="M9.5 3.5h5M10.5 3.5v5.5L5 18.5a1.5 1.5 0 0 0 1.3 2.2h11.4a1.5 1.5 0 0 0 1.3-2.2L13.5 9V3.5"/><path d="M7.5 14.5h9"/><circle cx="11" cy="17.5" r=".6"/><circle cx="14" cy="16.5" r=".6"/>',
    vault: '<rect x="3.5" y="4" width="17" height="15" rx="2.5"/><circle cx="12" cy="11.5" r="4"/><path d="M12 9.5v4M10 11.5h4M6 19v2M18 19v2"/>',
    celestial: '<path d="' + hex(12, 12.5, 6.5) + '"/><path d="m12 9.2 1 2.1 2.2.3-1.6 1.5.4 2.2-2-1-2 1 .4-2.2-1.6-1.5 2.2-.3Z"/><path d="M19.5 3.5v3M18 5h3M4.5 2.5v2M3.5 3.5h2"/>',
    moon: '<path d="M15.5 3.8A8.5 8.5 0 1 0 20.2 15 7 7 0 0 1 15.5 3.8Z"/><rect x="9" y="12" width="5" height="4.5" rx="1"/><path d="M8.5 12.3 11.5 10l3 2.3"/>',
    comet: '<circle cx="16" cy="8" r="3.5"/><path d="M13.5 10.5 4 20M12.5 8 6 12.5M16 10.8 11.5 17.5"/>',
    nebula: '<path d="M6.5 17.5a4 4 0 0 1 .4-8 5.5 5.5 0 0 1 10.4 1.5 3.3 3.3 0 0 1-.3 6.5Z"/><path d="M10 13.5h.01M14 12h.01M12.5 15.5h.01"/><path d="M19 3.5v3M17.5 5h3"/>',
    mill: '<path d="M12 11 8 21h8l-4-10Z"/><path d="M12 11 6 5M12 11l6-6M12 11 5.5 14M12 11l6.5 3"/><circle cx="12" cy="11" r="1.3"/>',
    galaxy: '<path d="M12 12c0-2 1.6-3.5 3.5-3.2 2.6.4 3.6 3.6 2.2 6-1.8 3.2-6.4 3.8-9.2 1.6C5 13.8 5 8.6 8.4 6 11.6 3.6 17 4.2 19.5 7.5"/><path d="M12 12c0 2-1.6 3.5-3.5 3.2"/><circle cx="12" cy="12" r=".8"/>',
    infinite: '<path d="' + hex(12, 12, 9) + '"/><path d="M8.6 12c0-1.2.9-2 2-2 1.8 0 2.9 4 4.8 4 1.1 0 2-.8 2-2s-.9-2-2-2c-1.9 0-3 4-4.8 4-1.1 0-2-.8-2-2Z" transform="translate(-1.5 0)"/>',
    amber: '<path d="M12 2.8 19.8 7.3v9.4L12 21.2l-7.8-4.5V7.3Z"/><path d="M12 2.8v6.4m0 0 7.8-1.9M12 9.2 4.2 7.3M12 9.2l-4.2 9.6M12 9.2l4.2 9.6"/>',
    ticket: '<path d="M3.5 8a2.5 2.5 0 0 0 0 5v3.5a1.5 1.5 0 0 0 1.5 1.5h14a1.5 1.5 0 0 0 1.5-1.5V13a2.5 2.5 0 0 1 0-5V5.5A1.5 1.5 0 0 0 19 4H5a1.5 1.5 0 0 0-1.5 1.5Z" transform="translate(0 1)"/><path d="M14.5 5v14" stroke-dasharray="2 2.2"/>',
    ad: '<rect x="3" y="5" width="18" height="12.5" rx="2.5"/><path d="m10.5 8.6 4.4 2.65-4.4 2.65Z"/><path d="M8 21h8"/>',
    sound: '<path d="M4 9.5v5h3.5L12 18.5v-13L7.5 9.5Z"/><path d="M15.5 9a4.2 4.2 0 0 1 0 6M18 6.5a7.8 7.8 0 0 1 0 11"/>',
    music: '<path d="M9 18V5.5l10-2V16"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="16.5" cy="16" r="2.5"/>',
    globe: '<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.4 2.5 3.5 5.3 3.5 8.5s-1.1 6-3.5 8.5c-2.4-2.5-3.5-5.3-3.5-8.5s1.1-6 3.5-8.5Z"/>',
    jelly: '<path d="M7 7.5h10l-1 12a1.5 1.5 0 0 1-1.5 1.5h-5A1.5 1.5 0 0 1 8 19.5Z"/><path d="M6 4.5h12v3H6Z"/><path d="M9 13c1 .8 2 .8 3 0s2-.8 3 0"/>',
    fire: '<path d="M12 21c3.6 0 6-2.4 6-5.8 0-3-2-5.2-3.5-7 0 2-1 3.3-2.3 3.6.3-3.3-1-6.3-3.7-8.3.2 3.2-1.4 5-2.9 6.8A7.4 7.4 0 0 0 6 15.2C6 18.6 8.4 21 12 21Z"/>'
  };

  BZ.icon = function (name, cls) {
    const body = I[name] || I.hive;
    return '<svg class="ic' + (cls ? ' ' + cls : '') + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + body + '</svg>';
  };
  BZ.ICONS = I;

  BZ.appIconSvg = function (size) {
    const id = 'bzc' + Math.random().toString(36).slice(2, 6);
    return '<svg viewBox="0 0 512 512" width="' + size + '" height="' + size + '" aria-hidden="true"><rect width="512" height="512" rx="112" fill="#F28C28"/>' +
      '<g transform="translate(14 18)">' +
      '<ellipse cx="215" cy="165" rx="62" ry="96" transform="rotate(-24 215 165)" fill="#F5F3EF" stroke="#20252B" stroke-width="18"/>' +
      '<ellipse cx="292" cy="160" rx="54" ry="86" transform="rotate(22 292 160)" fill="#F5F3EF" stroke="#20252B" stroke-width="18"/>' +
      '<path d="M98 300 52 318l46 18Z" fill="#20252B" stroke="#20252B" stroke-width="10" stroke-linejoin="round"/>' +
      '<clipPath id="' + id + '"><ellipse cx="236" cy="300" rx="146" ry="112"/></clipPath>' +
      '<ellipse cx="236" cy="300" rx="146" ry="112" fill="#F2C14E"/>' +
      '<g clip-path="url(#' + id + ')" fill="#20252B"><rect x="168" y="170" width="42" height="260"/><rect x="250" y="170" width="42" height="260"/></g>' +
      '<ellipse cx="236" cy="300" rx="146" ry="112" fill="none" stroke="#20252B" stroke-width="18"/>' +
      '<circle cx="384" cy="290" r="64" fill="#20252B"/>' +
      '<circle cx="404" cy="270" r="15" fill="#FFFFFF"/>' +
      '<path d="M398 232c8-34 24-58 50-70M370 230c-2-34 6-62 22-82" stroke="#20252B" stroke-width="14" fill="none" stroke-linecap="round"/>' +
      '</g></svg>';
  };

})(typeof window !== 'undefined' ? window : globalThis);
