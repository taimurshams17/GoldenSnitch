/* Golden Snitch Arcade v109 — animated, game-specific previews for the Games cards.
   Pure CSS animations (transform/opacity) generated from each game's own data.
   Exposes window.CL_ARCADE_PREVIEW = { kind, meta, stage, observe }.            */
(function () {
  'use strict';

  function esc(x) {
    return String(x == null ? '' : x).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function arr(x) { return Array.isArray(x) ? x : []; }
  function first(g) { return arr((g.data || {}).rounds)[0] || []; }
  function clamp(n, a, b) { return Math.max(a, Math.min(b, n)); }

  /* ---------- kind detection + labels ---------- */
  var META = {
    memory:    { label: 'মেমোরি ম্যাচ',     ico: '🃏', how: 'কার্ড উল্টে সূত্র ও তার জুটি মেলাও' },
    periodic:  { label: 'পর্যায় সারণি',      ico: '🧩', how: 'মৌলের কার্ড সঠিক ঘরে বসাও' },
    atlas:     { label: 'মৌল অনুসন্ধান',    ico: '🔭', how: 'সারণিতে মৌল খুঁজে তার ভর পড়ো' },
    logic:     { label: 'লজিক সার্কিট',     ico: '💡', how: 'সুইচ বদলে আউটপুট লক্ষ্যে মেলাও' },
    slope:     { label: 'ঢাল শিকার',        ico: '🎯', how: 'রেখা ঘুরিয়ে বিন্দুগুলো ছুঁয়ে যাও' },
    ion:       { label: 'আয়ন গোয়েন্দা',    ico: '🧪', how: 'পরীক্ষার ফল দেখে আয়ন শনাক্ত করো' },
    banking:   { label: 'বেগ টিউনার',       ico: '🏎️', how: 'বেগ ঠিক করে গাড়িকে নিরাপদে ঘোরাও' },
    force:     { label: 'বল টিউনার',        ico: '🛷', how: 'বল বদলে লক্ষ্য ত্বরণে পৌঁছাও' },
    lift:      { label: 'লিফট স্কেল',       ico: '🛗', how: 'ত্বরণ বদলে ওজন-কাঁটা লক্ষ্যে আনো' },
    momentum:  { label: 'সংঘর্ষ ডিজাইনার', ico: '🎱', how: 'প্রথম গাড়ির বেগ ঠিক করে সংঘর্ষ ঘটাও' },
    pendulum:  { label: 'দোলক ঘড়ি',        ico: '🕰️', how: 'সুতা ছোট-বড় করে দোলনকাল মেলাও' },
    wave:      { label: 'তরঙ্গ টিউনার',     ico: '🎚️', how: 'বিস্তার, কম্পাঙ্ক ও দশা মিলিয়ে তরঙ্গ ধরো' },
    equation:  { label: 'পরমাণু গোনা',      ico: '⚖️', how: 'সহগ বদলে দুই পাশের পরমাণু সমান করো' },
    vector:    { label: 'ভেক্টর শিকার',     ico: '🧭', how: 'ভেক্টর জুড়ে লক্ষ্য লব্ধি খুঁজে নাও' },
    resistor:  { label: 'সার্কিট আর্কিটেক্ট', ico: '🔌', how: 'রোধ সাজিয়ে লক্ষ্য রোধ তৈরি করো' },
    sort:      { label: 'বাছাই মিশন',        ico: '🗂️', how: 'দেখে সঠিক বিভাগটি বেছে নাও' },
    sequence:  { label: 'ক্রম সাজাও',        ico: '🔢', how: 'ধাপগুলো সঠিক ক্রমে ট্যাপ করো' },
    build:     { label: 'ফর্মুলা ফোর্জ',     ico: '🧱', how: 'অংশ জুড়ে সঠিক সূত্র বা গঠন গড়ো' },
    target:    { label: 'প্রিসিশন ডায়াল',   ico: '🎚️', how: 'স্লাইডার টেনে সঠিক মানে থামো' },
    path:      { label: 'পথ বাছাই',          ico: '🛣️', how: 'ধারণা মিলিয়ে সঠিক পথে এগোও' },
    spot:      { label: 'ভুল ধরো',           ico: '🔍', how: 'প্যাটার্নে ভুল বা ক্লু খুঁজে বের করো' },
    connect:   { label: 'জুটি জোড়া',        ico: '🔗', how: 'বামের শব্দের সঙ্গে ডানের জুটি মেলাও' },
    balance:   { label: 'ভারসাম্য',          ico: '⚖️', how: 'ওজন বেছে মোট মান লক্ষ্যে মেলাও' }
  };

  function kind(g) {
    var t = g && g.type, d = (g && g.data) || {};
    if (t === 'arcadeQuest') return META[d.mode] ? d.mode : 'sort';
    if (t === 'tunerLab') return META[d.model] ? d.model : (d.model === 'line' ? 'slope' : 'force');
    if (t === 'massAtlas') return 'atlas';
    if (t === 'logicCircuit') return 'logic';
    if (t === 'ionDetective') return 'ion';
    if (t === 'periodic') return 'periodic';
    if (t === 'slope') return 'slope';
    if (t === 'memory') return 'memory';
    return 'sort';
  }
  var TAGS = {"memory": "PAIRS \u00b7 PUZZLE", "periodic": "TABLE \u00b7 PLACE", "atlas": "TABLE \u00b7 EXPLORE", "logic": "LOGIC \u00b7 CIRCUIT", "slope": "GRAPH \u00b7 AIM", "ion": "LAB \u00b7 DETECTIVE", "banking": "PHYSICS \u00b7 TUNE", "force": "PHYSICS \u00b7 TUNE", "lift": "PHYSICS \u00b7 TUNE", "momentum": "PHYSICS \u00b7 COLLIDE", "pendulum": "PHYSICS \u00b7 TUNE", "wave": "WAVE \u00b7 MATCH", "equation": "ATOMS \u00b7 BALANCE", "vector": "VECTOR \u00b7 HUNT", "resistor": "CIRCUIT \u00b7 BUILD", "sort": "SORT \u00b7 DISCOVER", "sequence": "ORDER \u00b7 STEPS", "build": "BUILD \u00b7 FORGE", "target": "DIAL \u00b7 PRECISION", "path": "ROUTE \u00b7 CHOOSE", "spot": "SPOT \u00b7 GLITCH", "connect": "LINK \u00b7 PAIRS", "balance": "WEIGHTS \u00b7 BALANCE"};
  function meta(g) { var k = kind(g), m = META[k] || META.sort; return { label: m.label, ico: m.ico, how: m.how, tag: TAGS[k] || 'GAME' }; }

  var GROUPS = [
    { id: 'match',     label: 'জুটি ও মেমোরি',  ico: '🃏', kinds: ['memory', 'connect', 'atlas', 'periodic'] },
    { id: 'build',     label: 'সাজাও ও গড়ো',   ico: '🧱', kinds: ['sort', 'sequence', 'build', 'balance', 'equation'] },
    { id: 'lab',       label: 'টিউন ও ল্যাব',    ico: '🎚️', kinds: ['target', 'banking', 'force', 'lift', 'momentum', 'pendulum', 'wave', 'vector', 'resistor', 'slope', 'logic'] },
    { id: 'detective', label: 'গোয়েন্দা ও পথ', ico: '🔍', kinds: ['spot', 'path', 'ion'] }
  ];
  function group(g) {
    var k = kind(g), i;
    for (i = 0; i < GROUPS.length; i++) if (GROUPS[i].kinds.indexOf(k) >= 0) return GROUPS[i].id;
    return 'build';
  }

  /* ---------- scene builders ---------- */
  var S = {};

  function tile(face, back, cls, style) {
    return '<span class="pv-t ' + cls + '"' + (style ? ' style="' + style + '"' : '') + '><i class="pv-tf">' + back + '</i><b class="pv-tb">' + esc(face) + '</b></span>';
  }

  S.memory = function (g) {
    var p = arr((g.data || {}).pairs).slice(0, 3);
    while (p.length < 3) p.push({ a: '?', b: '?' });
    var a = function (i) { return p[i].a || p[i].l || '?'; }, b = function (i) { return p[i].b || p[i].r || '?'; };
    return '<div class="pv-mem">' +
      tile(a(0), '?', 'pv-tA') + tile(a(1), '?', 'pv-tB') + tile(b(2), '?', 'pv-tC') +
      tile(a(2), '?', 'pv-tC') + tile(b(0), '?', 'pv-tA') + tile(b(1), '?', 'pv-tB') + '</div>';
  };

  S.periodic = function () {
    var cells = '', i;
    for (i = 0; i < 24; i++) cells += '<i class="pv-pc' + (i === 9 ? ' is-slot' : '') + '"></i>';
    return '<div class="pv-ptable">' + cells + '<span class="pv-el pv-elfall">Na</span><span class="pv-el pv-elset">Na</span></div>';
  };

  S.atlas = function () {
    var cells = '', i;
    for (i = 0; i < 24; i++) cells += '<i class="pv-pc"></i>';
    return '<div class="pv-ptable">' + cells + '<span class="pv-scan"></span><span class="pv-tip"><b>Na</b> 22.99</span></div>';
  };

  S.logic = function () {
    return '<svg class="pv-svg" viewBox="0 0 300 150" aria-hidden="true">' +
      '<path class="pv-wire" d="M54 52h58M54 98h58M188 75h58"/>' +
      '<path class="pv-wire pv-wire-on" d="M54 52h58"/>' +
      '<path class="pv-wire pv-wire-on2" d="M54 98h58M188 75h58"/>' +
      '<path class="pv-gate" d="M112 36h34c28 0 42 17 42 39s-14 39-42 39h-34z"/>' +
      '<text x="140" y="80" class="pv-gt">AND</text>' +
      '<circle class="pv-sw pv-swA" cx="42" cy="52" r="12"/><text x="42" y="56" class="pv-st">A</text>' +
      '<circle class="pv-sw pv-swB" cx="42" cy="98" r="12"/><text x="42" y="102" class="pv-st">B</text>' +
      '<circle class="pv-lamp" cx="262" cy="75" r="14"/><text x="262" y="80" class="pv-st pv-lt">1</text></svg>';
  };

  S.slope = function () {
    return '<svg class="pv-svg" viewBox="0 0 300 150" aria-hidden="true">' +
      '<path class="pv-grid" d="M0 75h300M150 0v150M50 0v150M100 0v150M200 0v150M250 0v150M0 25h300M0 125h300"/>' +
      '<g class="pv-line"><path d="M-40 75h380"/></g>' +
      '<circle class="pv-dot pv-d1" cx="70" cy="108" r="6"/><circle class="pv-dot pv-d2" cx="150" cy="75" r="6"/><circle class="pv-dot pv-d3" cx="230" cy="42" r="6"/>' +
      '<text x="12" y="20" class="pv-gt pv-small pv-left">y = mx + c</text></svg>';
  };

  S.ion = function () {
    return '<svg class="pv-svg" viewBox="0 0 300 150" aria-hidden="true">' +
      '<g class="pv-tube"><path class="pv-glass" d="M128 14v92a22 22 0 0 0 44 0V14z"/><path class="pv-liquid" d="M129 60v46a21 21 0 0 0 42 0V60z"/>' +
      '<circle class="pv-bub pv-b1" cx="142" cy="104" r="3"/><circle class="pv-bub pv-b2" cx="157" cy="108" r="2.5"/><circle class="pv-bub pv-b3" cx="150" cy="100" r="2"/></g>' +
      '<g class="pv-drop"><path d="M150 4c6 8 8 11 8 15a8 8 0 0 1-16 0c0-4 2-7 8-15z"/></g>' +
      '<text x="48" y="54" class="pv-gt">Cl⁻ ?</text><text x="204" y="54" class="pv-gt">Fe³⁺ ?</text><text x="206" y="100" class="pv-gt">Cu²⁺ ?</text></svg>';
  };

  S.banking = function () {
    return '<svg class="pv-svg" viewBox="0 0 300 150" aria-hidden="true">' +
      '<g class="pv-road"><rect x="-20" y="98" width="340" height="16" rx="4"/><path class="pv-dash" d="M0 106h300"/></g>' +
      '<g class="pv-car"><rect x="0" y="-12" width="34" height="12" rx="4"/><circle cx="8" cy="0" r="5"/><circle cx="27" cy="0" r="5"/></g>' +
      '<g class="pv-gauge" transform="translate(246 46)"><path class="pv-arc" d="M-30 0a30 30 0 0 1 60 0"/><path class="pv-arc pv-arc-ok" d="M4 -29a30 30 0 0 1 24 29"/><path class="pv-needle" d="M0 0L-22 0"/></g></svg>';
  };

  S.force = function () {
    return '<svg class="pv-svg" viewBox="0 0 300 150" aria-hidden="true">' +
      '<path class="pv-floor" d="M10 112h280"/>' +
      '<g class="pv-block"><rect x="74" y="76" width="46" height="36" rx="6"/><text x="97" y="99" class="pv-st">m</text>' +
      '<g class="pv-arrow"><path d="M16 94h46M62 94l-9 -6M62 94l-9 6"/></g></g>' +
      '<text x="14" y="26" class="pv-gt pv-small pv-left">F = ma + μmg</text></svg>';
  };

  S.lift = function () {
    return '<svg class="pv-svg" viewBox="0 0 300 150" aria-hidden="true">' +
      '<path class="pv-floor" d="M92 6v138M208 6v138"/>' +
      '<g class="pv-cab"><rect x="100" y="52" width="100" height="70" rx="8"/><circle cx="150" cy="78" r="9"/><path d="M150 87v18M140 94h20"/>' +
      '<text x="150" y="42" class="pv-gt">↑ a</text></g>' +
      '<g class="pv-scale" transform="translate(244 60)"><rect x="-26" y="0" width="52" height="42" rx="8"/><text x="0" y="27" class="pv-st pv-n1">720 N</text><text x="0" y="27" class="pv-st pv-n2">490 N</text></g></svg>';
  };

  S.momentum = function () {
    return '<svg class="pv-svg" viewBox="0 0 300 150" aria-hidden="true">' +
      '<path class="pv-floor" d="M10 112h280"/>' +
      '<g class="pv-c1"><rect x="20" y="78" width="56" height="34" rx="6"/><circle cx="34" cy="116" r="6"/><circle cx="62" cy="116" r="6"/><text x="48" y="100" class="pv-st">m₁</text></g>' +
      '<g class="pv-c2"><rect x="150" y="86" width="38" height="26" rx="6"/><circle cx="160" cy="116" r="5"/><circle cx="178" cy="116" r="5"/><text x="169" y="104" class="pv-st">m₂</text></g>' +
      '<text x="150" y="30" class="pv-gt pv-spark">v₂ = ?</text></svg>';
  };

  S.pendulum = function () {
    return '<svg class="pv-svg" viewBox="0 0 300 150" aria-hidden="true">' +
      '<path class="pv-floor" d="M110 10h80"/>' +
      '<g class="pv-pend"><path d="M150 10v92"/><circle cx="150" cy="112" r="14"/></g>' +
      '<text x="24" y="40" class="pv-gt pv-small pv-left">T = 2π√(L/g)</text><path class="pv-arcmark" d="M96 104a60 60 0 0 0 108 0"/></svg>';
  };

  S.wave = function () {
    var d = 'M-300 75', i;
    for (i = 0; i < 8; i++) d += ' q37.5 -60 75 0 t75 0';
    var d2 = 'M0 75';
    for (i = 0; i < 4; i++) d2 += ' q37.5 -44 75 0 t75 0';
    return '<svg class="pv-svg" viewBox="0 0 300 150" aria-hidden="true">' +
      '<path class="pv-grid" d="M0 75h300M75 0v150M150 0v150M225 0v150"/>' +
      '<path class="pv-target" d="' + d2 + '"/><g class="pv-wv"><path d="' + d + '"/></g></svg>';
  };

  S.equation = function () {
    return '<svg class="pv-svg" viewBox="0 0 300 150" aria-hidden="true">' +
      '<path class="pv-floor" d="M150 78v52M120 132h60"/>' +
      '<g class="pv-beam"><path d="M54 78h192"/>' +
      '<g class="pv-pan"><path d="M54 78v16h50v-16"/><circle cx="68" cy="84" r="7"/><circle cx="84" cy="84" r="7"/><text x="79" y="70" class="pv-gt pv-small">H₂ O₂</text></g>' +
      '<g class="pv-pan"><path d="M196 78v16h50v-16"/><circle cx="212" cy="84" r="7"/><circle cx="228" cy="84" r="7"/><text x="221" y="70" class="pv-gt pv-small">H₂O</text></g></g>' +
      '<circle class="pv-pivot" cx="150" cy="78" r="7"/></svg>';
  };

  S.vector = function () {
    return '<svg class="pv-svg" viewBox="0 0 300 150" aria-hidden="true">' +
      '<defs><marker id="pvA" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10z" fill="currentColor"/></marker></defs>' +
      '<path class="pv-grid" d="M0 75h300M60 0v150M120 0v150M180 0v150M240 0v150"/>' +
      '<path class="pv-vec pv-v1" d="M50 118L140 118" marker-end="url(#pvA)"/>' +
      '<path class="pv-vec pv-v2" d="M140 118L196 50" marker-end="url(#pvA)"/>' +
      '<path class="pv-vec pv-vr" d="M50 118L196 50" marker-end="url(#pvA)"/>' +
      '<text x="84" y="138" class="pv-gt pv-small">A</text><text x="178" y="92" class="pv-gt pv-small">B</text><text x="108" y="70" class="pv-gt pv-small pv-rt">R</text></svg>';
  };

  S.resistor = function () {
    return '<svg class="pv-svg" viewBox="0 0 300 150" aria-hidden="true">' +
      '<path class="pv-wire" d="M30 75V30h60M120 30h60M210 30h60V75M270 75v45H30V75"/>' +
      '<path class="pv-flow" d="M30 75V30h60M120 30h60M210 30h60V75M270 75v45H30V75"/>' +
      '<path class="pv-zig" d="M90 30l6-12 8 24 8-24 8 24 6-12"/><path class="pv-zig" d="M180 30l6-12 8 24 8-24 8 24 6-12"/>' +
      '<rect class="pv-cell" x="22" y="68" width="16" height="14" rx="3"/>' +
      '<text x="150" y="88" class="pv-gt">R = ?</text></svg>';
  };

  /* --- arcadeQuest modes, driven by the game's own first round --- */
  S.sort = function (g) {
    var r = first(g), opts = arr(r[2]).slice(0, 3), c = clamp(+r[3] || 0, 0, 2);
    while (opts.length < 3) opts.push('…');
    return '<div class="pv-sort" style="--c:' + c + '"><div class="pv-fallrow"><span class="pv-fall"><b>' + esc(r[1] || '?') + '</b></span></div>' +
      '<div class="pv-bins">' + opts.map(function (o, i) { return '<span class="pv-bin' + (i === c ? ' is-ok' : '') + '"><em>' + esc(o) + '</em></span>'; }).join('') + '</div></div>';
  };

  S.sequence = function (g) {
    var r = first(g), steps = arr(r[1]).slice(0, 4), scr = [2, 0, 3, 1];
    while (steps.length < 4) steps.push('…');
    return '<ol class="pv-seq">' + steps.map(function (s, i) {
      return '<li style="--k:' + (scr[i] - i) + ';--d:' + (i * 0.22) + 's"><u>' + (i + 1) + '</u><span>' + esc(s) + '</span></li>';
    }).join('') + '</ol>';
  };

  S.build = function (g) {
    var r = first(g), parts = arr(r[1]), order = arr(r[2]);
    if (!order.length) order = parts.map(function (_, i) { return i; });
    order = order.slice(0, 5);
    var bar = order.map(function (idx, i) { return '<span class="pv-tok" style="--d:' + (i * 0.55) + 's">' + esc(parts[idx]) + '</span>'; }).join('');
    var tray = order.slice().reverse().map(function (idx, i) { return '<span class="pv-tray" style="--d:' + (((order.length - 1 - i) * 0.55)) + 's">' + esc(parts[idx]) + '</span>'; }).join('');
    return '<div class="pv-build"><div class="pv-bar">' + bar + '<i class="pv-caret"></i></div><div class="pv-trays">' + tray + '</div></div>';
  };

  S.target = function (g) {
    var r = first(g), min = +r[1], max = +r[2], t = +r[3], unit = r[4] || '';
    var pct = (isFinite(min) && isFinite(max) && max > min) ? clamp((t - min) / (max - min), 0.08, 0.92) * 100 : 60;
    var shown = isFinite(t) ? String(+t.toFixed(2)) : '?';
    return '<div class="pv-dial" style="--kx:' + pct.toFixed(1) + '%"><div class="pv-read"><b class="pv-r1">…</b><b class="pv-r2">' + esc(shown) + ' <small>' + esc(unit) + '</small></b></div>' +
      '<div class="pv-track"><i class="pv-zone"></i><i class="pv-knob"></i></div>' +
      '<div class="pv-ends"><span>' + esc(isFinite(min) ? min : '') + '</span><span>' + esc(isFinite(max) ? max : '') + '</span></div></div>';
  };

  S.path = function (g) {
    var r = first(g), opts = arr(r[1]).slice(0, 3), c = clamp(+r[2] || 0, 0, 2), ys = [20, 50, 80];
    while (opts.length < 3) opts.push('…');
    var svg = '<svg class="pv-routes" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">' + ys.map(function (y, i) {
      return '<path class="pv-route' + (i === c ? ' is-ok' : '') + '" d="M12 50L50 ' + y + '" vector-effect="non-scaling-stroke"/>';
    }).join('') + '</svg>';
    var nodes = ys.map(function (y, i) { return '<span class="pv-node' + (i === c ? ' is-ok' : '') + '" style="top:' + y + '%"><em>' + esc(opts[i]) + '</em></span>'; }).join('');
    return '<div class="pv-path" style="--ty:' + ys[c] + '%">' + svg + '<span class="pv-start">▶</span>' + nodes + '<span class="pv-runner"></span></div>';
  };

  S.spot = function (g) {
    var r = first(g), opts = arr(r[1]).slice(0, 6), c = clamp(+r[2] || 0, 0, Math.max(0, opts.length - 1));
    while (opts.length < 6) opts.push('…');
    var pos = function (i) { return 'left:' + ((i % 3) * 33.33 + 16.66) + '%;top:' + ((i < 3 ? 0 : 1) * 50 + 25) + '%'; };
    var alt = [(c + 2) % 6, (c + 4) % 6, (c + 3) % 6];
    var cells = opts.map(function (o, i) { return '<span class="pv-cell2' + (i === c ? ' is-glitch' : '') + '"><em>' + esc(o) + '</em></span>'; }).join('');
    function xy(i, k) { return '--x' + k + ':' + ((i % 3) * 33.33 + 16.66) + '%;--y' + k + ':' + ((i < 3 ? 0 : 1) * 50 + 25) + '%;'; }
    return '<div class="pv-spot" style="' + xy(alt[0], 1) + xy(alt[1], 2) + xy(alt[2], 3) + xy(c, 4) + '">' + cells + '<i class="pv-lens"></i></div>';
  };

  S.connect = function (g) {
    var r = first(g), pairs = arr(r[1]).slice(0, 3), n = pairs.length || 3, perm = [1, 2, 0];
    while (pairs.length < 3) pairs.push(['?', '?']);
    var L = pairs.map(function (p, i) { return '<span class="pv-ci" style="--d:' + (i * 1.1) + 's">' + esc(p[0]) + '</span>'; }).join('');
    var R = perm.map(function (pi, j) { return '<span class="pv-ci pv-cr" style="--d:' + (pi * 1.1) + 's">' + esc(pairs[pi][1]) + '</span>'; }).join('');
    var lines = pairs.map(function (_, i) {
      var j = perm.indexOf(i), y1 = (i + .5) / 3 * 100, y2 = (j + .5) / 3 * 100;
      return '<path class="pv-cl" pathLength="1" style="--d:' + (i * 1.1) + 's" d="M0 ' + y1.toFixed(1) + 'C50 ' + y1.toFixed(1) + ' 50 ' + y2.toFixed(1) + ' 100 ' + y2.toFixed(1) + '" vector-effect="non-scaling-stroke"/>';
    }).join('');
    return '<div class="pv-conn"><div class="pv-ccol">' + L + '</div><svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">' + lines + '</svg><div class="pv-ccol">' + R + '</div></div>';
  };

  S.balance = function (g) {
    var r = first(g), vals = arr(r[1]).slice(0, 3), target = r[2], unit = r[3] || '';
    while (vals.length < 3) vals.push('·');
    var w = vals.map(function (v, i) { return '<b class="pv-w" style="--d:' + (i * 0.7) + 's">' + esc(v) + '</b>'; }).join('');
    return '<div class="pv-bal"><div class="pv-beam2"><div class="pv-panl">' + w + '</div><div class="pv-panr"><b class="pv-goal">' + esc(target == null ? '?' : target) + ' <small>' + esc(unit) + '</small></b></div></div><i class="pv-post"></i></div>';
  };

  function stage(g) {
    var k = kind(g), fn = S[k] || S.sort, html;
    try { html = fn(g); } catch (e) { html = '<div class="pv-fallback">' + esc(meta(g).ico) + '</div>'; }
    return '<div class="pv pv-k-' + k + '" aria-hidden="true">' + html + '</div>';
  }

  /* Only animate previews that are on screen — keeps scrolling smooth on phones. */
  var io = null;
  function observe(root) {
    if (!root) return;
    var cards = root.querySelectorAll('.pcard:not([data-pv-seen])');
    if (!cards.length) return;
    if (!('IntersectionObserver' in window)) {
      Array.prototype.forEach.call(cards, function (c) { c.classList.add('is-live'); c.setAttribute('data-pv-seen', '1'); });
      return;
    }
    if (!io) {
      var phone = false; try { phone = matchMedia('(max-width:760px),(pointer:coarse)').matches; } catch (x) { }
      io = new IntersectionObserver(function (es) {
        es.forEach(function (e) { e.target.classList.toggle('is-live', e.isIntersecting); });
      }, phone ? { rootMargin: '380px 0px', threshold: 0 } : { rootMargin: '80px 0px', threshold: 0.05 });
    }
    Array.prototype.forEach.call(cards, function (c) { c.setAttribute('data-pv-seen', '1'); io.observe(c); });
  }


  /* Desktop pointer tilt + spotlight (mouse only; skipped for reduced motion). */
  (function () {
    var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    var cur = null, ev = null, raf = 0;
    function clear(c) { ['--rx', '--ry', '--mx', '--my'].forEach(function (p) { c.style.removeProperty(p); }); }
    document.addEventListener('pointermove', function (e) {
      if (e.pointerType !== 'mouse') return;
      var c = e.target.closest && e.target.closest('.pcard');
      if (cur && cur !== c) { clear(cur); cur = null; }
      if (!c) return;
      cur = c; ev = e;
      if (!raf) raf = requestAnimationFrame(function () {
        raf = 0; if (!cur || !ev) return;
        var r = cur.getBoundingClientRect(), x = (ev.clientX - r.left) / r.width, y = (ev.clientY - r.top) / r.height;
        cur.style.setProperty('--ry', ((x - .5) * 8).toFixed(2) + 'deg');
        cur.style.setProperty('--rx', ((.5 - y) * 6).toFixed(2) + 'deg');
        cur.style.setProperty('--mx', (x * 100).toFixed(1) + '%');
        cur.style.setProperty('--my', (y * 100).toFixed(1) + '%');
      });
    }, { passive: true });
  })();

  window.CL_ARCADE_PREVIEW = { kind: kind, meta: meta, group: group, groups: GROUPS, stage: stage, observe: observe, kinds: META };
})();
