/* Golden Snitch v112 — Quiz chapter cards with a reusable, chapter-specific animation system.
   Engine: a tiny keyframe generator (kf/M) turns any f(t) -> {x,y,r,sx,sy,s,o} into a CSS @keyframes
   rule once; scenes compose a few SVG primitives and bind them to these generated motions.
   Pure CSS transform/opacity animation, paused off-screen, frozen for prefers-reduced-motion.
   Exposes window.CL_QUIZ_ANIM = { card, scene, observe, ids }.                                   */
(function () {
  'use strict';
  var sin = Math.sin, cos = Math.cos, PI = Math.PI, TAU = PI * 2, abs = Math.abs, sqrt = Math.sqrt,
      atan2 = Math.atan2, exp = Math.exp, tan = Math.tan, max = Math.max, min = Math.min;

  /* ---------- tiny helpers ---------- */
  function esc(x) { return String(x == null ? '' : x).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function n1(x) { return Math.round(x * 10) / 10; }
  function n2(x) { return Math.round(x * 100) / 100; }
  function frac(x) { return x - Math.floor(x); }
  function tri(x) { return 1 - abs(2 * frac(x) - 1); }
  function sm(u) { u = u < 0 ? 0 : u > 1 ? 1 : u; return u * u * (3 - 2 * u); }
  function lerp(a, b, u) { return a + (b - a) * u; }
  function hc(t) { return 0.5 - 0.5 * cos(TAU * t); }
  function deg(r) { return r * 180 / PI; }
  function bump(t, c, w) { var d = abs(t - c); d = min(d, 1 - d); return d >= w ? 0 : 0.5 + 0.5 * cos(PI * d / w); }
  function fade(t, a, b) { return t < a ? t / a : t > b ? max(0, (1 - t) / (1 - b)) : 1; }

  /* ---------- keyframe engine ---------- */
  var styleEl = null, KF = {}, CUR = 'x';
  function addCss(s) {
    if (!styleEl) { styleEl = document.createElement('style'); styleEl.id = 'qa-kf'; document.head.appendChild(styleEl); }
    styleEl.appendChild(document.createTextNode(s));
  }
  function tf(v) {
    var s = '';
    if (v.x != null || v.y != null) s += 'translate(' + n1(v.x || 0) + 'px,' + n1(v.y || 0) + 'px)';
    if (v.r != null) s += ' rotate(' + n1(v.r) + 'deg)';
    if (v.sx != null || v.sy != null || v.s != null) {
      var sx = v.sx != null ? v.sx : (v.s != null ? v.s : 1), sy = v.sy != null ? v.sy : (v.s != null ? v.s : 1);
      s += ' scale(' + n2(sx) + ',' + n2(sy) + ')';
    }
    return s || 'none';
  }
  function kf(name, fn, n) {
    if (KF[name]) return name;
    n = n || 32;
    var s = '@keyframes ' + name + '{';
    for (var i = 0; i <= n; i++) {
      var v = fn(i / n);
      s += (i * 100 / n).toFixed(2) + '%{transform:' + tf(v) + (v.o != null ? ';opacity:' + (+v.o).toFixed(2) : '') + '}';
    }
    addCss(s + '}'); KF[name] = 1; return name;
  }
  /* M(key, seconds, fn, {delay: phase 0..1, n: samples, ease}) -> inline animation style */
  function M(key, dur, fn, o) {
    o = o || {};
    var nm = 'qk-' + CUR + '-' + key;
    kf(nm, fn, o.n);
    return 'animation:' + nm + ' ' + dur + 's ' + (o.ease || 'linear') + ' infinite' + (o.delay ? ';animation-delay:-' + (frac(o.delay) * dur).toFixed(2) + 's' : '');
  }

  /* ---------- svg primitives ---------- */
  function at(x, y, inner, st) { return '<g transform="translate(' + n1(x) + ' ' + n1(y) + ')"><g' + (st ? ' style="' + st + '"' : '') + '>' + inner + '</g></g>'; }
  function rot(a, inner, st) { return '<g transform="rotate(' + n1(a) + ')"><g' + (st ? ' style="' + st + '"' : '') + '>' + inner + '</g></g>'; }
  function C(cx, cy, r, cls, st) { return '<circle cx="' + n1(cx) + '" cy="' + n1(cy) + '" r="' + r + '"' + (cls ? ' class="' + cls + '"' : '') + (st ? ' style="' + st + '"' : '') + '/>'; }
  function L(x1, y1, x2, y2, cls, st) { return '<line x1="' + n1(x1) + '" y1="' + n1(y1) + '" x2="' + n1(x2) + '" y2="' + n1(y2) + '"' + (cls ? ' class="' + cls + '"' : '') + (st ? ' style="' + st + '"' : '') + '/>'; }
  function R(x, y, w, h, cls, st, rx) { return '<rect x="' + n1(x) + '" y="' + n1(y) + '" width="' + n1(w) + '" height="' + n1(h) + '"' + (rx ? ' rx="' + rx + '"' : '') + (cls ? ' class="' + cls + '"' : '') + (st ? ' style="' + st + '"' : '') + '/>'; }
  function P(d, cls, st, extra) { return '<path d="' + d + '"' + (extra ? ' ' + extra : '') + (cls ? ' class="' + cls + '"' : '') + (st ? ' style="' + st + '"' : '') + '/>'; }
  function T(x, y, s, cls, st) { return '<text x="' + n1(x) + '" y="' + n1(y) + '"' + (cls ? ' class="' + cls + '"' : ' class="qt"') + (st ? ' style="' + st + '"' : '') + '>' + s + '</text>'; }
  function arrow(len, c, st) { return L(0, 0, len - 5, 0, 's' + c, st) + P('M' + len + ',0L' + (len - 9) + ',-4.5L' + (len - 9) + ',4.5Z', 'f' + c); }
  function poly(pts, close) { var d = ''; for (var i = 0; i < pts.length; i++) d += (i ? 'L' : 'M') + n1(pts[i][0]) + ',' + n1(pts[i][1]); return d + (close ? 'Z' : ''); }
  function sinePath(x0, x1, y0, amp, wl, ph, st) {
    var d = ''; st = st || 3;
    for (var x = x0; x <= x1 + 0.01; x += st) d += (d ? 'L' : 'M') + n1(x) + ',' + n1(y0 - amp * sin(TAU * x / wl + (ph || 0)));
    return d;
  }
  function clipDef(id, inner) { return '<defs><clipPath id="' + id + '">' + inner + '</clipPath></defs>'; }
  var uid = 0;
  function cid(k) { return 'qc-' + CUR + '-' + k; }
  function quad(p0, p1, p2, u) { var a = (1 - u) * (1 - u), b = 2 * (1 - u) * u, c = u * u; return [a * p0[0] + b * p1[0] + c * p2[0], a * p0[1] + b * p1[1] + c * p2[1]]; }

  /* ---------- scenes (viewBox of each scene: 240 x 120) ---------- */
  var SC = {};

  /* ===== Physics · Paper 1 ===== */
  SC['phy1-01'] = function () { /* vernier caliper measuring a block */
    var s = R(-40, 86, 320, 22, 'fw', 'opacity:.08') + L(-40, 86, 280, 86, 'sw', 'opacity:.5;stroke-width:1.4');
    for (var i = -40; i <= 280; i += 6) s += L(i, 86, i, ((i + 40) / 6) % 5 === 0 ? 101 : 94, 'sw', 'opacity:.5;stroke-width:1.1');
    s += R(55, 52, 40, 34, 'fb', 'opacity:.3', 4) + R(55, 52, 40, 34, 'sb nf', 'stroke-width:1.4;stroke-dasharray:3 3', 4);
    s += R(48, 32, 7, 54, 'fa', '', 2) + R(48, 28, 36, 6, 'fa', '', 2);
    var jaw = function (t) { return { x: 55 * hc(t) }; };
    s += at(0, 0, R(95, 32, 7, 54, 'fc', '', 2) + R(66, 28, 36, 6, 'fc', '', 2) + P('M98.5,88L93.5,78H103.5Z', 'fw'), M('jaw', 6, jaw));
    s += at(55, 22, L(0, 0, 1, 0, 'sw ns', 'stroke-width:1.4'), M('dim', 6, function (t) { return { sx: 40 + 55 * hc(t), sy: 1 }; }));
    s += L(55, 17, 55, 27, 'sw', 'stroke-width:1.4') + at(95, 22, L(0, -5, 0, 5, 'sw', 'stroke-width:1.4'), M('tk', 6, jaw));
    return s;
  };

  SC['phy1-02'] = function () { /* head-to-tail vector addition */
    var O = [70, 92], a1 = -22, l1 = 78, a2 = -58, l2 = 56;
    var e1 = [O[0] + l1 * cos(a1 * PI / 180), O[1] + l1 * sin(a1 * PI / 180)];
    var e2 = [e1[0] + l2 * cos(a2 * PI / 180), e1[1] + l2 * sin(a2 * PI / 180)];
    var lr = sqrt((e2[0] - O[0]) * (e2[0] - O[0]) + (e2[1] - O[1]) * (e2[1] - O[1])), ar = deg(atan2(e2[1] - O[1], e2[0] - O[0]));
    var s = L(O[0], O[1], O[0] + l2 * cos(a2 * PI / 180), O[1] + l2 * sin(a2 * PI / 180), 'sw', 'opacity:.25;stroke-dasharray:3 4;stroke-width:1.2') +
            L(O[0] + l2 * cos(a2 * PI / 180), O[1] + l2 * sin(a2 * PI / 180), e2[0], e2[1], 'sw', 'opacity:.25;stroke-dasharray:3 4;stroke-width:1.2');
    function vec(k, o, ang, len, c, t0, t1, w) {
      return at(o[0], o[1], arrow(len, c, w), M(k, 6, function (t) { var u = sm((t - t0) / (t1 - t0)); return { r: ang, sx: max(u, 0.001), sy: 1, o: u > 0 ? fade(t, 0.01, 0.9) : 0 }; }));
    }
    s += vec('a', O, a1, l1, 'a', 0.05, 0.25, 'stroke-width:3') + vec('b', e1, a2, l2, 'b', 0.3, 0.5, 'stroke-width:3') + vec('r', O, ar, lr, 'c', 0.56, 0.74, 'stroke-width:3.4');
    s += C(O[0], O[1], 4, 'fw') + at(e2[0], e2[1], C(0, 0, 5, 'fc') + C(0, 0, 5, 'sc ns', 'opacity:.8'), M('pt', 6, function (t) { return { s: 1 + 0.6 * bump(t, 0.76, 0.12), o: t > 0.7 ? fade(t, 0.01, 0.9) : 0 }; }));
    return s;
  };

  SC['phy1-03'] = function () { /* projectile motion */
    var s = L(-40, 100, 280, 100, 'sw', 'opacity:.4;stroke-width:1.4') + P('M30,100 Q120,-32 210,100', 'sa nf', 'stroke-dasharray:4 5;opacity:.6;stroke-width:1.6');
    s += P('M210,100 V74 L226,80 L210,86', 'sc nf', 'stroke-width:1.6') + R(14, 92, 18, 8, 'fb', '', 2);
    var fn = function (t) { return { x: 30 + 180 * t, y: 100 - 264 * t * (1 - t), o: fade(t, 0.05, 0.93) }; };
    [0.94, 0.88, 0.82].forEach(function (d, i) { s += at(0, 0, C(0, 0, 3.2 + i * 0, 'fa', 'opacity:' + (0.55 - i * 0.14)), M('b', 3.4, fn, { delay: d, n: 40 })); });
    s += at(0, 0, C(0, 0, 6, 'fc') + C(0, 0, 9.5, 'sc nf ns', 'opacity:.4'), M('b', 3.4, fn, { n: 40 }));
    s += at(0, 0, L(0, 0, 26, 0, 'sw', 'stroke-width:1.5;opacity:.7'), M('v', 3.4, function (t) { return { x: 30 + 180 * t, y: 100 - 264 * t * (1 - t), r: deg(atan2(-(264 * (1 - 2 * t)), 180)), o: fade(t, 0.05, 0.93) * 0.8 }; }, { n: 40 }));
    return s;
  };

  SC['phy1-04'] = function () { /* Newton's cradle */
    var s = R(70, 18, 100, 5, 'fw', 'opacity:.55', 2) + L(76, 23, 70, 108, 'sw', 'opacity:.3') + L(164, 23, 170, 108, 'sw', 'opacity:.3');
    var left = function (t) { var a = t < 0.25 ? -38 * cos(PI / 2 * t / 0.25) : t < 0.75 ? 0 : -38 * sin(PI / 2 * (t - 0.75) / 0.25); return { r: a }; };
    var right = function (t) { var a = t < 0.25 ? 0 : t < 0.5 ? 38 * sin(PI / 2 * (t - 0.25) / 0.25) : t < 0.75 ? 38 * cos(PI / 2 * (t - 0.5) / 0.25) : 0; return { r: a }; };
    for (var i = 0; i < 5; i++) {
      var x = 88 + i * 16, body = L(0, 0, 0, 60, 'sw', 'stroke-width:1.2;opacity:.7') + C(0, 60, 8, i === 0 || i === 4 ? 'fc' : 'fa') + C(-2.5, 57, 2.4, 'fw', 'opacity:.5');
      s += at(x, 23, body, i === 0 ? M('l', 2.6, left, { n: 48 }) : i === 4 ? M('r', 2.6, right, { n: 48 }) : '');
    }
    s += at(120, 83, C(0, 0, 4, 'fc') + C(0, 0, 4, 'sc nf ns'), M('hit', 2.6, function (t) { return { s: 1 + 2.4 * (bump(t, 0.25, 0.09) + bump(t, 0.75, 0.09)), o: 0.15 + 0.85 * (bump(t, 0.25, 0.09) + bump(t, 0.75, 0.09)) }; }));
    return s;
  };

  SC['phy1-05'] = function () { /* work-energy: roller cart + PE/KE bars */
    var yt = function (x) { return 40 + 52 * (1 - Math.pow((x - 120) / 90, 2)); }, pts = [];
    for (var x = 30; x <= 210; x += 5) pts.push([x, yt(x)]);
    var s = P(poly(pts), 'sw nf', 'stroke-width:3;opacity:.75') + P(poly(pts) + 'V104H30Z', 'fa', 'opacity:.12');
    var ball = function (t) { var bx = 120 - 84 * cos(TAU * t); return { x: bx, y: yt(bx) - 7 }; };
    s += at(0, 0, C(0, 0, 7, 'fc') + C(-2, -2, 2.4, 'fw', 'opacity:.6'), M('ball', 4.4, ball, { n: 44 }));
    var pe = function (t) { var d = (120 - 84 * cos(TAU * t) - 120) / 90; return { sy: max(0.04, d * d) }; };
    var ke = function (t) { var d = (84 * cos(TAU * t)) / 90; return { sy: max(0.04, 1 - d * d) }; };
    s += R(92, 12, 46, 26, 'sw nf', 'opacity:.18;stroke-width:1', 3) +
         at(98, 34, R(0, -20, 8, 20, 'fa', '', 1.5), M('pe', 4.4, pe, { n: 44 })) + at(126, 34, R(0, -20, 8, 20, 'fb', '', 1.5), M('ke', 4.4, ke, { n: 44 }));
    s += T(102, 47, 'PE', 'qt qs', 'fill:var(--a)') + T(130, 47, 'KE', 'qt qs', 'fill:var(--b)');
    return s;
  };

  SC['phy1-06'] = function () { /* Kepler orbit with gravity rings */
    var a = 64, b = 42, e = sqrt(1 - b * b / (a * a)), c = a * e, F = [88, 60];
    var kep = function (t) { var Mn = TAU * t, E = Mn; for (var i = 0; i < 8; i++) E = E - (E - e * sin(E) - Mn) / (1 - e * cos(E)); return { x: a * (cos(E) - e), y: -b * sin(E) }; };
    var s = '<ellipse cx="' + n1(F[0] + c) + '" cy="60" rx="' + a + '" ry="' + b + '" class="sw nf" style="stroke-dasharray:3 5;opacity:.45;stroke-width:1.4"/>';
    for (var i = 0; i < 3; i++) s += at(F[0], F[1], C(0, 0, 14, 'sa nf ns', 'stroke-width:1.4'), M('ring', 3.6, function (t) { return { s: 1 + 1.8 * t, o: 0.7 * (1 - t) }; }, { delay: i / 3 }));
    s += at(F[0], F[1], C(0, 0, 14, 'fb') + C(-4, -4, 5, 'fw', 'opacity:.35') + P('M-14,2Q-2,-4 14,4', 'sw nf', 'opacity:.3;stroke-width:1.4'), M('pl', 7, function (t) { return { r: 360 * t }; }));
    [0.96, 0.92].forEach(function (d, i) { s += at(F[0], F[1], C(0, 0, 2.6, 'fc', 'opacity:' + (0.5 - i * 0.2)), M('sat', 6.4, kep, { delay: d, n: 64 })); });
    s += at(F[0], F[1], C(0, 0, 4.6, 'fc') + C(0, 0, 8, 'sc nf ns', 'opacity:.4'), M('sat', 6.4, kep, { n: 64 }));
    return s;
  };

  SC['phy1-07'] = function () { /* elasticity: spring + stress-strain */
    var u = function (t) { return hc(t); }, sc = function (t) { return 0.82 + 0.55 * u(t); };
    var s = R(36, 8, 52, 6, 'fw', 'opacity:.5', 2), zz = 'M0,0V6', N = 8, L0 = 60;
    for (var i = 0; i < N; i++) zz += 'L' + (i % 2 ? -11 : 11) + ',' + n1(6 + (i + 0.5) * (L0 - 12) / N);
    zz += 'L0,' + (L0 - 6) + 'V' + L0;
    s += at(62, 14, P(zz, 'sa nf ns', 'stroke-width:2.4'), M('sp', 5, function (t) { return { sy: sc(t) }; })) +
         at(62, 14 + L0, R(-15, 0, 30, 20, 'fb', '', 4) + R(-15, 0, 30, 20, 'sw nf', 'stroke-width:1.2;opacity:.5', 4) + T(0, 14, 'm', 'qt qs'), M('ms', 5, function (t) { return { y: L0 * (sc(t) - 1) }; }));
    s += L(132, 100, 132, 20, 'sw', 'stroke-width:1.4;opacity:.7') + L(132, 100, 232, 100, 'sw', 'stroke-width:1.4;opacity:.7') + T(232, 112, 'ε', 'qt qs') + T(124, 24, 'σ', 'qt qs');
    var p0 = [132, 100], p1 = [180, 54], q0 = [180, 54], q1 = [196, 38], q2 = [220, 36];
    s += P('M132,100L180,54Q196,38 220,36', 'sc nf', 'stroke-width:2.2');
    var pt = function (t) { var uu = u(t), q = uu < 0.6 ? [lerp(p0[0], p1[0], uu / 0.6), lerp(p0[1], p1[1], uu / 0.6)] : quad(q0, q1, q2, (uu - 0.6) / 0.4); return { x: q[0], y: q[1] }; };
    s += at(0, 0, C(0, 0, 4.6, 'fc') + C(0, 0, 8, 'sc nf ns', 'opacity:.4'), M('pt', 5, pt, { n: 48 }));
    return s;
  };

  SC['phy1-08'] = function () { /* simple harmonic motion: reference circle -> sine trace */
    var cx = 58, cy = 62, r = 30, hx = 112, WL = 80, id = cid('c');
    var th = function (t) { return TAU * t; };
    var d = ''; for (var x = hx - WL; x <= 260; x += 2.5) d += (d ? 'L' : 'M') + n1(x) + ',' + n1(62 - 30 * sin(TAU * (hx - x) / WL));
    var s = clipDef(id, '<rect x="' + hx + '" y="0" width="140" height="124"/>') + C(cx, cy, r, 'sw nf qfl', 'opacity:.5;stroke-width:1.4') + L(cx - r - 8, cy, cx + r + 8, cy, 'sw', 'opacity:.2;stroke-width:1') + L(cx, cy - r - 8, cx, cy + r + 8, 'sw', 'opacity:.2;stroke-width:1');
    s += L(hx, 14, hx, 110, 'sw', 'opacity:.2;stroke-width:1');
    s += '<g clip-path="url(#' + id + ')">' + at(0, 0, P(d, 'sa nf', 'stroke-width:2.6'), M('tr', 4, function (t) { return { x: WL * t }; }, { n: 8 })) + '</g>';
    s += at(cx, cy, L(0, 0, r, 0, 'sw', 'stroke-width:1.4;opacity:.7'), M('rad', 4, function (t) { return { r: -360 * t }; }, { n: 24 }));
    s += at(0, 0, C(0, 0, 5, 'fc'), M('p', 4, function (t) { return { x: cx + r * cos(th(t)), y: cy - r * sin(th(t)) }; }, { n: 48 }));
    s += at(0, 0, L(0, 0, 1, 0, 'sc ns', 'stroke-dasharray:3 3;stroke-width:1.4'), M('g', 4, function (t) { var px = cx + r * cos(th(t)); return { x: hx, y: cy - r * sin(th(t)), sx: px - hx, sy: 1 }; }, { n: 48 }));
    s += at(0, 0, C(0, 0, 4.4, 'fa') + C(0, 0, 8, 'sa nf ns', 'opacity:.4'), M('h', 4, function (t) { return { x: hx, y: cy - r * sin(th(t)) }; }, { n: 48 }));
    return s;
  };

  SC['phy1-09'] = function () { /* travelling wave + floating corks */
    var WL = 60, d = sinePath(-100, 330, 0, 22, WL, 0, 3), fill = d + 'L330,70L-100,70Z';
    var s = at(0, 62, P(fill, 'fa', 'opacity:.16') + P(d, 'sa nf', 'stroke-width:2.6'), M('w1', 3.2, function (t) { return { x: WL * t }; }, { n: 8 }));
    var d2 = sinePath(-100, 330, 0, 9, 30, 1, 3);
    s += at(0, 78, P(d2, 'sb nf', 'stroke-width:1.8;opacity:.75'), M('w2', 2.4, function (t) { return { x: -30 * t }; }, { n: 8 }));
    [40, 105, 170].forEach(function (xc) {
      s += at(xc, 62, '<g transform="translate(0 -5)">' + C(0, 0, 5.4, 'fc') + C(0, 0, 5.4, 'sw nf', 'stroke-width:1;opacity:.5') + '</g>', M('k' + xc, 3.2, function (t) { return { y: -22 * sin(TAU * (xc / WL - t)) }; }, { n: 40 }));
    });
    s += L(0, 62, 240, 62, 'sw', 'opacity:.15;stroke-dasharray:2 4;stroke-width:1');
    return s;
  };

  SC['phy1-10'] = function () { /* kinetic theory: particles + moving piston */
    var s = P('M50,26V100H190V26', 'sw nf', 'stroke-width:2.2;opacity:.85') + L(50, 100, 190, 100, 'sw', 'stroke-width:2.2;opacity:.85');
    s += at(0, 0, R(50, 26, 140, 6, 'fa', '', 2) + L(120, 8, 120, 26, 'sw', 'stroke-width:2.4') + R(108, 4, 24, 5, 'fw', 'opacity:.7', 2), M('pis', 6, function (t) { return { y: 12 * hc(t) }; }));
    var fx = [2, 3, 4, 3, 2, 5, 4, 3, 2], fy = [3, 2, 3, 5, 4, 2, 3, 4, 5], cl = ['fc', 'fa', 'fb'];
    for (var i = 0; i < 9; i++) {
      (function (i) {
        s += at(0, 0, C(0, 0, 4.2, cl[i % 3]) + C(-1.2, -1.2, 1.2, 'fw', 'opacity:.6'), M('g' + i, 8, function (t) {
          return { x: 58 + 124 * tri(fx[i] * t + i * 0.13), y: 52 + 40 * tri(fy[i] * t + i * 0.29) };
        }, { n: 80 }));
      })(i);
    }
    [96, 120, 144].forEach(function (x, i) {
      s += at(x, 114, P('M0,0C-8,-6 -6,-16 0,-24C6,-16 8,-6 0,0Z', 'fc', 'opacity:.9'), M('f' + i, 1.1 + i * 0.2, function (t) { return { sy: 0.7 + 0.45 * hc(t), sx: 0.9 + 0.2 * hc(t + 0.3) }; }, { delay: i * 0.3 }));
    });
    return s;
  };

  /* ===== Physics · Paper 2 ===== */
  SC['phy2-01'] = function () { /* heat engine: P-V cycle + cylinder */
    var s = L(34, 100, 34, 18, 'sw', 'stroke-width:1.6;opacity:.7') + L(34, 100, 140, 100, 'sw', 'stroke-width:1.6;opacity:.7') + T(140, 113, 'V', 'qt qs') + T(26, 22, 'P', 'qt qs');
    s += P('M62,80V38H122V80Z', 'sa nf qfb', 'stroke-width:2.2;opacity:.9');
    var lens = [42, 60, 42, 60], tot = 204;
    var pos = function (t) { var d = frac(t) * tot, x, y; if (d < 42) { x = 62; y = 80 - d; } else if (d < 102) { x = 62 + (d - 42); y = 38; } else if (d < 144) { x = 122; y = 38 + (d - 102); } else { x = 122 - (d - 144); y = 80; } return { x: x, y: y }; };
    s += at(0, 0, C(0, 0, 5, 'fc') + C(0, 0, 9, 'sc nf ns', 'opacity:.4'), M('dot', 5, pos, { n: 68 }));
    var py = function (t) { var p = pos(t); return 76 - (p.x - 62) / 60 * 38; };
    s += P('M168,34V102H212V34', 'sw nf', 'stroke-width:2.2;opacity:.85') + L(168, 102, 212, 102, 'sw', 'stroke-width:2.2;opacity:.85');
    s += at(170, 0, R(0, 0, 40, 68, 'fb', 'opacity:.25'), M('gas', 5, function (t) { var y = py(t) + 6; return { y: y, sy: (101 - y) / 68 }; }, { n: 68 }));
    s += at(0, 0, R(168, 0, 44, 6, 'fa', '', 2) + L(190, -14, 190, 0, 'sw', 'stroke-width:2.4'), M('pst', 5, function (t) { return { y: py(t) }; }, { n: 68 }));
    s += at(190, 116, P('M0,0C-9,-6 -7,-18 0,-26C7,-18 9,-6 0,0Z', 'fc'), M('hot', 5, function (t) { return { sy: 0.8 + 0.3 * hc(t * 5), o: 0.5 + 0.5 * sin(TAU * t) }; }, { n: 60 }));
    s += at(190, 108, L(-8, 0, 8, 0, 'sb') + L(0, -8, 0, 8, 'sb') + L(-5.6, -5.6, 5.6, 5.6, 'sb') + L(-5.6, 5.6, 5.6, -5.6, 'sb'), M('cold', 5, function (t) { return { r: 60 * t, o: 0.5 - 0.5 * sin(TAU * t) }; }, { n: 40 }));
    return s;
  };

  SC['phy2-02'] = function () { /* electrostatics: field lines between + and − */
    var s = '';
    [[52, 30], [34, 52], [16, 72]].forEach(function (k) {
      var ph = k[0], cy = 60, ax = 80 + 12 * cos(k[1] * PI / 180), ay = cy - 12 * sin(k[1] * PI / 180), bx = 160 - 12 * cos(k[1] * PI / 180);
      s += P('M' + n1(ax) + ',' + n1(ay) + 'Q120,' + (cy - ph * 2 + 10) + ' ' + n1(bx) + ',' + n1(ay), 'sa nf qfl', 'opacity:.9;stroke-width:2');
      s += P('M' + n1(ax) + ',' + n1(cy + (cy - ay)) + 'Q120,' + (cy + ph * 2 - 10) + ' ' + n1(bx) + ',' + n1(cy + (cy - ay)), 'sa nf qfl', 'opacity:.9;stroke-width:2');
    });
    s += L(92, 60, 148, 60, 'sa qfl', 'stroke-width:2;opacity:.9');
    s += at(80, 60, C(0, 0, 17, 'fc', 'opacity:.2') + C(0, 0, 11, 'fc') + T(0, 4.5, '+', 'qt qb', 'fill:#1b1300'), M('pp', 2.4, function (t) { return { s: 1 + 0.12 * hc(t) }; }));
    s += at(160, 60, C(0, 0, 17, 'fb', 'opacity:.2') + C(0, 0, 11, 'fb') + T(0, 4.5, '−', 'qt qb', 'fill:#06121f'), M('pn', 2.4, function (t) { return { s: 1 + 0.12 * hc(t + 0.5) }; }));
    s += at(0, 60, C(0, 0, 4, 'fw') + C(0, 0, 7, 'sw nf ns', 'opacity:.5'), M('t', 3.2, function (t) { return { x: 100 + 40 * hc(t) }; }));
    return s;
  };

  SC['phy2-03'] = function () { /* DC circuit: flowing charge, battery, resistor, bulb */
    var s = P('M50,36H190V90H50Z', 'sa nf qfl', 'stroke-width:3;opacity:.95');
    s += R(41, 52, 18, 26, 'fd') + L(43, 56, 57, 56, 'sw', 'stroke-width:2.6') + L(48, 66, 52, 66, 'sc', 'stroke-width:3.6') + L(43, 74, 57, 74, 'sw', 'stroke-width:2.6') + T(36, 62, '+', 'qt qs') ;
    s += R(100, 26, 44, 20, 'fd') + P('M96,36H104L108,28L116,44L124,28L132,44L136,36H144', 'sb nf', 'stroke-width:2.4');
    s += at(190, 63, C(0, 0, 25, 'fc', 'opacity:.18'), M('gl', 2.2, function (t) { return { s: 0.85 + 0.35 * hc(t), o: 0.5 + 0.5 * hc(t) }; }));
    s += R(176, 48, 28, 30, 'fd') + C(190, 63, 13, 'sw nf', 'stroke-width:2') + at(190, 63, P('M-6,10L-4,2Q0,-6 4,2L6,10', 'sc nf', 'stroke-width:2.2'), M('fl', 2.2, function (t) { return { o: 0.55 + 0.45 * hc(t) }; }));
    s += at(190, 63, '<g>' + [0, 1, 2, 3, 4, 5].map(function (i) { return rot(i * 60, L(0, -18, 0, -23, 'sc', 'stroke-width:1.6')); }).join('') + '</g>', M('ry', 2.2, function (t) { return { o: 0.2 + 0.8 * hc(t) }; }));
    return s;
  };

  SC['phy2-04'] = function () { /* bar magnet field lines + compass */
    var s = '';
    [[22, 4], [36, 10], [50, 16]].forEach(function (k) {
      var y = k[0], w = 34 + k[1] * 2;
      s += P('M152,56C' + (152 + w) + ',56 ' + (152 + w * 0.7) + ',' + (y - 10) + ' 120,' + y + 'C' + (88 - w * 0.7) + ',' + (y - 10) + ' ' + (88 - w) + ',56 88,56', 'sa nf qfl', 'opacity:.85;stroke-width:1.8');
      s += P('M152,64C' + (152 + w) + ',64 ' + (152 + w * 0.7) + ',' + (130 - y + 10) + ' 120,' + (120 - y) + 'C' + (88 - w * 0.7) + ',' + (130 - y + 10) + ' ' + (88 - w) + ',64 88,64', 'sa nf qfl', 'opacity:.85;stroke-width:1.8');
    });
    s += R(90, 50, 30, 20, 'fb', '', 3) + R(120, 50, 30, 20, 'fc', '', 3) + T(105, 65, 'S', 'qt qb', 'fill:#06121f') + T(135, 65, 'N', 'qt qb', 'fill:#1b1300');
    s += C(212, 90, 15, 'fd') + C(212, 90, 15, 'sw nf', 'stroke-width:1.6;opacity:.7');
    s += at(212, 90, P('M0,-12L4,0H-4Z', 'fc') + P('M0,12L4,0H-4Z', 'fw', 'opacity:.8') + C(0, 0, 1.8, 'fd'), M('nd', 3.4, function (t) { return { r: 55 * sin(TAU * t) + 20 * sin(TAU * 3 * t) }; }, { n: 48 }));
    return s;
  };

  SC['phy2-05'] = function () { /* generator: rotating coil + AC sine trace */
    var hx = 142, WL = 90, id = cid('c');
    var s = clipDef(id, '<rect x="' + hx + '" y="0" width="120" height="124"/>');
    s += R(6, 36, 16, 50, 'fb', '', 3) + R(118, 36, 16, 50, 'fc', '', 3) + T(14, 66, 'N', 'qt qb', 'fill:#06121f') + T(126, 66, 'S', 'qt qb', 'fill:#1b1300');
    s += at(70, 62, [18, 24, 30].map(function (r, i) { return C(0, 0, r, 'sa nf', 'stroke-width:' + (2.4 - i * 0.3) + ';opacity:' + (1 - i * 0.18)); }).join(''), M('coil', 4, function (t) { return { sx: max(0.06, abs(cos(TAU * t))), sy: 1 }; }, { n: 64 }));
    s += L(70, 28, 70, 96, 'sw', 'stroke-width:1.4;opacity:.45');
    s += C(70, 106, 7, 'fd') + at(70, 106, C(0, 0, 11, 'fc', 'opacity:.3') + C(0, 0, 5, 'fc'), M('bu', 4, function (t) { return { o: 0.2 + 0.8 * abs(sin(TAU * t)) }; }, { n: 64 }));
    s += L(hx - 4, 62, 236, 62, 'sw', 'stroke-width:1.2;opacity:.35') + L(hx, 28, hx, 98, 'sw', 'stroke-width:1.2;opacity:.25');
    var d = ''; for (var x = hx - WL; x <= 260; x += 2.5) d += (d ? 'L' : 'M') + n1(x) + ',' + n1(62 - 24 * sin(TAU * (hx - x) / WL));
    s += '<g clip-path="url(#' + id + ')">' + at(0, 0, P(d, 'sc nf', 'stroke-width:2.6'), M('tr', 4, function (t) { return { x: WL * t }; }, { n: 8 })) + '</g>';
    s += at(0, 0, C(0, 0, 4.4, 'fc') + C(0, 0, 8, 'sc nf ns', 'opacity:.4'), M('h', 4, function (t) { return { x: hx, y: 62 - 24 * sin(TAU * t) }; }, { n: 48 }));
    return s;
  };

  SC['phy2-06'] = function () { /* convex lens: refraction + image */
    var O = [42, 30], I = [186, 86], X = 120, ys = [30, 60, 44];
    var s = L(-40, 60, 280, 60, 'sw', 'opacity:.3;stroke-width:1.2;stroke-dasharray:6 4') + C(85, 60, 2.2, 'fw', 'opacity:.7') + C(155, 60, 2.2, 'fw', 'opacity:.7');
    ys.forEach(function (y, i) { s += P('M' + O[0] + ',' + O[1] + 'L' + X + ',' + y + 'L' + I[0] + ',' + I[1], (i === 1 ? 'sb' : i === 0 ? 'sc' : 'sa') + ' nf qfl', 'stroke-width:1.9;opacity:.95'); });
    s += P('M120,14Q144,60 120,106Q96,60 120,14Z', 'fb', 'opacity:.22') + P('M120,14Q144,60 120,106Q96,60 120,14Z', 'sb nf', 'stroke-width:1.8') +
         at(120, 60, R(-1, -46, 2, 92, 'fw', 'opacity:.5'), M('sh', 2.6, function (t) { return { sx: 1 + 2 * hc(t), o: 0.2 + 0.4 * hc(t) }; }));
    s += at(42, 60, rot(-90, arrow(30, 'c', 'stroke-width:2.6'))) + at(I[0], 60, rot(90, arrow(26, 'a', 'stroke-width:2.6')));
    s += at(I[0], 86, C(0, 0, 4, 'fa') + C(0, 0, 4, 'sa nf ns'), M('im', 2.6, function (t) { return { s: 1 + 1.6 * hc(t), o: 1 - 0.6 * hc(t) }; }));
    s += at(O[0], O[1], C(0, 0, 4, 'fc') + C(0, 0, 4, 'sc nf ns'), M('ob', 2.6, function (t) { return { s: 1 + 1.4 * hc(t + 0.5), o: 1 - 0.6 * hc(t + 0.5) }; }));
    return s;
  };

  SC['phy2-07'] = function () { /* double-slit interference */
    var id1 = cid('a'), id2 = cid('b');
    var s = clipDef(id1, '<rect x="-60" y="0" width="118" height="124"/>') + clipDef(id2, '<rect x="66" y="0" width="134" height="124"/>');
    s += '<g clip-path="url(#' + id1 + ')">' + [8, 26, 44].map(function (x, i) { return at(x, 0, L(0, 6, 0, 114, 'sa', 'stroke-width:2'), M('pw', 2, function (t) { return { x: 18 * t }; })); }).join('') + at(-10, 0, L(0, 6, 0, 114, 'sa', 'stroke-width:2'), M('pw', 2, function (t) { return { x: 18 * t }; })) + '</g>';
    s += R(60, 4, 6, 44, 'fw', 'opacity:.8', 1.5) + R(60, 54, 6, 14, 'fw', 'opacity:.8', 1.5) + R(60, 76, 6, 40, 'fw', 'opacity:.8', 1.5);
    s += '<g clip-path="url(#' + id2 + ')">';
    [51, 73].forEach(function (y, k) { for (var i = 0; i < 3; i++) s += at(63, y, C(0, 0, 6, k ? 'sb nf ns' : 'sa nf ns', 'stroke-width:1.6'), M('rp', 3.6, function (t) { return { s: 1 + 21 * t, o: 0.85 * (1 - t) }; }, { delay: i / 3 + k * 0.17 })); });
    s += '</g>';
    for (var i = 0; i < 9; i++) {
      var Iv = Math.pow(cos(((i - 4) * 0.78)), 2), w = 5 + 24 * Iv;
      s += at(206, 14 + i * 11, R(0, -3, w, 6, i % 2 ? 'fc' : 'fa', '', 1.5), M('fr' + i, 2.6, function (t) { return { sx: 0.7 + 0.3 * sin(TAU * t + i * 0.7), sy: 1 }; }, { n: 24 }));
    }
    s += L(204, 6, 204, 116, 'sw', 'opacity:.4;stroke-width:1.2');
    return s;
  };

  SC['phy2-08'] = function () { /* photoelectric effect */
    var ang = 12.8, dx = 140, dy = 31.8, s = R(180, 14, 14, 92, 'fw', 'opacity:.2', 2) + R(180, 14, 14, 92, 'sw nf', 'stroke-width:1.6;opacity:.8', 2);
    s += T(110, 108, 'hν', 'qt', 'fill:var(--c);font-size:15px');
    [26, 52, 78].forEach(function (y0, i) {
      var ph = i / 3;
      s += at(30, y0 - 12, P('M0,0q4,-6 8,0t8,0t8,0t8,0t8,0t8,0t8,0', 'sc nf', 'stroke-width:2.2'), M('ph', 3, function (t) { var u = min(1, t / 0.55); return { x: dx * u, y: dy * u, r: ang, o: t < 0.55 ? fade(t, 0.04, 0.5) : 0 }; }, { delay: ph, n: 36 }));
      var iy = y0 - 12 + dy;
      s += at(184, iy, C(0, 0, 4, 'fc') + C(0, 0, 4, 'sc nf ns'), M('fl', 3, function (t) { var u = (t - 0.55) / 0.45; return { s: 1 + 3 * max(0, u), o: u > 0 && u < 0.8 ? 0.8 * (1 - u) : 0 }; }, { delay: ph, n: 36 }));
      s += at(194, iy, C(0, 0, 3.4, 'fb') + T(0, 2.4, '−', 'qt qs', 'fill:#06121f;font-size:7px'), M('el', 3, function (t) { var u = max(0, (t - 0.55) / 0.45); return { x: 44 * u, y: -16 * u + 18 * u * u, o: t > 0.55 ? 1 - sm((u - 0.7) / 0.3) : 0 }; }, { delay: ph, n: 36 }));
    });
    return s;
  };

  SC['phy2-09'] = function () { /* atom + alpha decay */
    var N = [80, 60], s = '';
    [[-22, 40, 17], [34, 36, 13]].forEach(function (o, k) {
      s += '<g transform="translate(' + N[0] + ' ' + N[1] + ') rotate(' + o[0] + ')"><ellipse rx="' + o[1] + '" ry="' + o[2] + '" class="sw nf" style="stroke-dasharray:2 4;opacity:.4;stroke-width:1.3"/>' + at(0, 0, C(0, 0, 3.4, k ? 'fa' : 'fb'), M('e' + k, 3 + k * 1.2, function (t) { return { x: o[1] * cos(TAU * t), y: o[2] * sin(TAU * t) }; }, { n: 40, delay: k * 0.4 })) + '</g>';
    });
    var pos = [[0, 0]]; for (var i = 0; i < 8; i++) pos.push([9 * cos(i * PI / 4), 9 * sin(i * PI / 4)]);
    s += at(N[0], N[1], pos.map(function (p, i) { return at(p[0], p[1], C(0, 0, 5.4, i % 2 ? 'fc' : 'fa'), M('nu' + i, 1.1 + (i % 3) * 0.2, function (t) { return { x: 1.2 * sin(TAU * t), y: 1.2 * cos(TAU * t * 1) }; }, { delay: i / 9 })); }).join(''), M('nuc', 2.2, function (t) { return { s: 1 + 0.06 * hc(t) }; }));
    s += at(N[0], N[1], C(0, 0, 10, 'sc nf ns', 'stroke-width:1.6'), M('ex', 4, function (t) { return { s: 1 + 4 * sm(t / 0.5), o: t < 0.5 ? 0.8 * (1 - t / 0.5) : 0 }; }, { n: 36 }));
    s += at(0, 0, [[-3.2, -3.2, 'fc'], [3.2, -3.2, 'fa'], [-3.2, 3.2, 'fa'], [3.2, 3.2, 'fc']].map(function (q) { return C(q[0], q[1], 3.4, q[2]); }).join(''), M('al', 4, function (t) { var u = sm((t - 0.1) / 0.8); return { x: lerp(N[0], 224, u), y: lerp(N[1], 22, u), s: 0.6 + 0.5 * u, o: t < 0.1 ? 0 : fade(t, 0.12, 0.88) }; }, { n: 40 }));
    s += P('M80,60L224,22', 'sc nf qfl', 'opacity:.3;stroke-width:1.4');
    return s;
  };

  SC['phy2-10'] = function () { /* p-n junction */
    var s = R(20, 32, 98, 60, 'fb', 'opacity:.14', 6) + R(118, 32, 98, 60, 'fc', 'opacity:.14', 6);
    s += at(118, 32, R(-14, 0, 28, 60, 'fw', 'opacity:.1') + L(-14, 0, -14, 60, 'sw', 'stroke-dasharray:3 3;opacity:.6;stroke-width:1.2') + L(14, 0, 14, 60, 'sw', 'stroke-dasharray:3 3;opacity:.6;stroke-width:1.2'), M('dep', 3, function (t) { return { sx: 0.8 + 0.4 * hc(t), sy: 1 }; }));
    s += T(38, 28, 'P', 'qt', 'fill:var(--b);font-size:14px') + T(198, 28, 'N', 'qt', 'fill:var(--c);font-size:14px');
    [40, 54, 68, 82].forEach(function (y, i) {
      s += at(26, y, C(0, 0, 4.2, 'sb nf', 'stroke-width:1.8'), M('h' + i, 3.6, function (t) { return { x: 150 * t, o: sin(PI * t) > 0.02 ? Math.pow(sin(PI * t), 0.5) : 0 }; }, { delay: i * 0.25 + 0.05 }));
      s += at(210, y + 7, C(0, 0, 3.2, 'fc') + T(0, 2.2, '−', 'qt qs', 'fill:#1b1300;font-size:6px'), M('e' + i, 3.6, function (t) { return { x: -150 * t, o: Math.pow(max(0, sin(PI * t)), 0.5) }; }, { delay: i * 0.25 + 0.17 }));
    });
    s += at(118, 62, C(0, 0, 12, 'fc', 'opacity:.35') + C(0, 0, 5, 'fw'), M('fl', 1.8, function (t) { return { s: 0.7 + 0.9 * bump(t, 0.5, 0.5), o: 0.2 + 0.8 * bump(t, 0.5, 0.5) }; }));
    s += L(118, 92, 118, 108, 'sw', 'opacity:.4') + P('M110,100H126M114,106H122', 'sw nf', 'opacity:.4');
    return s;
  };

  SC['phy2-11'] = function () { /* spiral galaxy, twinkling stars, shooting star */
    var s = '', stars = [[14, 14], [40, 100], [200, 20], [224, 84], [70, 22], [170, 104], [30, 60], [212, 52], [140, 14], [100, 108], [190, 70], [56, 84]];
    stars.forEach(function (p, i) { s += at(p[0], p[1], C(0, 0, i % 3 ? 1.5 : 2.1, i % 4 ? 'fw' : 'fc'), M('tw', 2.4 + (i % 4) * 0.5, function (t) { return { o: 0.2 + 0.8 * hc(t), s: 0.7 + 0.6 * hc(t) }; }, { delay: i * 0.17 })); });
    var dots = '';
    for (var arm = 0; arm < 2; arm++) for (var k = 0; k < 24; k++) {
      var r = 6 + k * 2.1, th = arm * PI + k * 0.26;
      dots += C(r * cos(th), r * sin(th), 3.4 - k * 0.1, k % 3 === 0 ? 'fc' : k % 3 === 1 ? 'fa' : 'fb', 'opacity:' + n2(1 - k * 0.025));
    }
    s += '<g transform="translate(120 62) scale(1 .5)">' + C(0, 0, 38, 'fa', 'opacity:.1') + '<g style="' + M('gal', 26, function (t) { return { r: 360 * t }; }, { n: 12 }) + '">' + dots + '</g></g>';
    s += at(120, 62, C(0, 0, 14, 'fc', 'opacity:.3') + C(0, 0, 6, 'fc'), M('core', 3, function (t) { return { s: 0.9 + 0.2 * hc(t) }; }));
    s += at(0, 0, L(0, 0, -34, -10, 'sc', 'stroke-width:2.4') + C(0, 0, 2.4, 'fw'), M('sh', 5, function (t) { var u = (t - 0.55) / 0.2; return { x: lerp(232, 150, sm(u)), y: lerp(8, 34, sm(u)), o: u > 0 && u < 1 ? sin(PI * u) : 0 }; }, { n: 40 }));
    return s;
  };

  /* ===== Chemistry · Paper 1 ===== */
  SC['chem1-01'] = function () { /* lab safety: flask, fumes, hazard sign */
    var id = cid('f'), flask = 'M82,16H98V44L124,92Q127,100 118,100H62Q53,100 56,92L82,44Z';
    var s = clipDef(id, '<path d="' + flask + '"/>');
    s += '<g clip-path="url(#' + id + ')">' + at(0, 0, P(sinePath(-40, 220, 0, 3.2, 40, 0, 3) + 'L220,60L-40,60Z', 'fb', 'opacity:.75') .replace('<path', '<path transform="translate(0 64)"'), M('wv', 2.4, function (t) { return { x: 40 * t }; }, { n: 8 })) +
         at(0, 0, P(sinePath(-40, 220, 0, 2.6, 30, 1.3, 3) + 'L220,60L-40,60Z', 'fa', 'opacity:.45').replace('<path', '<path transform="translate(0 70)"'), M('wv2', 3, function (t) { return { x: -30 * t }; }, { n: 8 })) + '</g>';
    s += P(flask, 'sw nf', 'stroke-width:2.4') + R(78, 12, 24, 5, 'fw', 'opacity:.7', 2);
    [[80, 0.1], [92, 0.4], [100, 0.7], [88, 0.25]].forEach(function (b, i) { s += at(b[0], 92, C(0, 0, 2 + (i % 2), 'fw', 'opacity:.8'), M('bb' + i, 2.4 + i * 0.2, function (t) { return { x: 3 * sin(TAU * t * 2), y: -26 * t, o: sin(PI * t) }; }, { delay: b[1] })); });
    [0, 0.5].forEach(function (d, i) { s += at(90 + (i ? 3 : -3), 10, P('M0,0q-6,-7 0,-13t0,-13', 'sw nf', 'stroke-width:2;opacity:.8'), M('fu' + i, 2.8, function (t) { return { y: -18 * t, s: 0.8 + 0.8 * t, o: 0.7 * sin(PI * t) }; }, { delay: d })); });
    s += at(184, 58, C(0, 0, 26, 'fc', 'opacity:.18'), M('hz', 1.6, function (t) { return { s: 0.8 + 0.4 * hc(t), o: 0.3 + 0.7 * hc(t) }; }));
    s += at(184, 58, '<rect x="-17" y="-17" width="34" height="34" rx="4" class="sc nf" style="stroke-width:3" transform="rotate(45)"/>' + T(0, 8, '!', 'qt', 'fill:var(--c);font-size:24px;font-weight:900'), M('hzs', 1.6, function (t) { return { s: 1 + 0.06 * hc(t) }; }));
    return s;
  };

  SC['chem1-02'] = function () { /* qualitative analysis: colour changes + precipitate */
    var id = cid('t'), tube = 'M-9.5,0V50a9.5,9.5 0 0 0 19,0V0Z', s = clipDef(id, '<path d="' + tube + '"/>');
    var sets = [['fa', 'fc'], ['fb', 'fk'], ['fc', 'fa']];
    [66, 120, 174].forEach(function (x, i) {
      var inner = '<g clip-path="url(#' + id + ')">' + R(-12, 22, 24, 40, sets[i][0], 'opacity:.7') +
        at(0, 0, R(-12, 22, 24, 40, sets[i][1], 'opacity:.9'), M('ov' + i, 6, function (t) { return { o: sm((t - 0.25) / 0.2) * (1 - sm((t - 0.82) / 0.15)) }; }, { delay: i * 0.22 })) +
        [-4, 2, 6].map(function (px, j) { return at(px, 24, C(0, 0, 1.8, 'fw'), M('pr' + i + j, 3, function (t) { return { y: 36 * t, o: sin(PI * t) }; }, { delay: j * 0.33 + i * 0.1 })); }).join('') +
        at(0, 60, R(-10, -7, 20, 7, 'fw', 'opacity:.55'), M('sd' + i, 6, function (t) { return { sy: 0.3 + 0.7 * sm((t - 0.3) / 0.4) * (1 - sm((t - 0.85) / 0.12)) }; }, { delay: i * 0.22 })) + '</g>';
      s += at(x, 30, inner + P(tube, 'sw nf', 'stroke-width:2.2') + R(-12, -2, 24, 4, 'fw', 'opacity:.8', 2));
    });
    s += R(40, 56, 160, 6, 'fa', 'opacity:.3', 3) + R(40, 56, 160, 6, 'sw nf', 'stroke-width:1.2;opacity:.5', 3);
    return s;
  };

  SC['chem1-03'] = function () { /* periodic table wave */
    var rows = [[0, 11], [0, 1, 6, 7, 8, 9, 10, 11], [0, 1, 6, 7, 8, 9, 10, 11], [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]], s = '';
    var cls = function (c) { return c === 0 ? 'fa' : c === 1 ? 'fc' : c < 6 ? 'fb' : c < 10 ? 'fa' : 'fc'; };
    for (var c = 0; c < 12; c++) {
      var col = '';
      rows.forEach(function (rw, r) { if (rw.indexOf(c) >= 0) col += R(0, 18 + r * 16, 14, 13, cls(c), '', 2.5); });
      s += at(18 + c * 17, 0, col, M('col', 3.6, function (t) { var ph = t; return { o: 0.28 + 0.72 * (ph < 0.3 ? sin(PI * ph / 0.3) : 0), y: -1.6 * (ph < 0.3 ? sin(PI * ph / 0.3) : 0) }; }, { delay: 1 - c * 0.07 }));
    }
    s += L(18, 96, 218, 96, 'sw', 'stroke-width:1.6;opacity:.5') + P('M218,96l-7,-4v8z', 'fw', 'opacity:.6') + T(218, 110, 'EN', 'qt qs');
    s += at(0, 96, C(0, 0, 4, 'fc') + C(0, 0, 8, 'sc nf ns', 'opacity:.4'), M('dot', 3.6, function (t) { return { x: 18 + 190 * t, o: fade(t, 0.06, 0.92) }; }));
    return s;
  };

  SC['chem1-04'] = function () { /* A + B -> AB */
    var cx = 120, cy = 58;
    var A = function (t) { return { x: -72 + 63 * sm(t / 0.35), o: t < 0.03 ? t / 0.03 : t < 0.36 ? 1 : 0 }; };
    var B = function (t) { return { x: 72 - 63 * sm(t / 0.35), o: t < 0.03 ? t / 0.03 : t < 0.36 ? 1 : 0 }; };
    var s = at(cx, cy, C(0, 0, 11, 'fb') + C(-3, -3, 3.4, 'fw', 'opacity:.5'), M('A', 4.4, A, { n: 44 })) + at(cx, cy, C(0, 0, 8.5, 'fc') + C(-2.5, -2.5, 2.6, 'fw', 'opacity:.5'), M('B', 4.4, B, { n: 44 }));
    s += at(cx, cy, C(-8, 0, 11, 'fb') + C(10, 0, 8.5, 'fc') + C(-11, -3, 3, 'fw', 'opacity:.5'), M('AB', 4.4, function (t) { var u = (t - 0.36) / 0.5; return { x: t < 0.36 ? 0 : lerp(0, 84, sm((u - 0.15) / 0.85)), s: t < 0.36 ? 0.01 : 1 + 0.35 * (1 - sm((t - 0.36) / 0.1)), o: t < 0.36 ? 0 : t < 0.8 ? 1 : max(0, 1 - (t - 0.8) / 0.12) }; }, { n: 44 }));
    s += at(cx, cy, C(0, 0, 5, 'sw nf ns', 'stroke-width:2'), M('rg', 4.4, function (t) { var u = (t - 0.35) / 0.22; return { s: 1 + 9 * max(0, u), o: u > 0 && u < 1 ? 0.9 * (1 - u) : 0 }; }, { n: 44 }));
    for (var i = 0; i < 8; i++) s += at(cx, cy, rot(i * 45, L(8, 0, 15, 0, 'sc', 'stroke-width:2.2'), M('sp', 4.4, function (t) { var u = (t - 0.35) / 0.2; return { x: 14 * max(0, u), o: u > 0 && u < 1 ? 1 - u : 0 }; }, { n: 44 })));
    s += T(120, 106, 'A + B  →  AB', 'qt', 'opacity:.55;font-size:11px');
    return s;
  };

  function gearPath(n, ro, ri) {
    var d = '', st = TAU / n, a, p = [];
    for (var i = 0; i < n; i++) { a = i * st; [[-0.3, ri], [-0.16, ro], [0.16, ro], [0.3, ri]].forEach(function (q) { var an = a + q[0] * st; p.push([q[1] * cos(an), q[1] * sin(an)]); }); }
    return poly(p, true);
  }
  SC['chem1-05'] = function () { /* applied chemistry: gears + dosing */
    var g1 = [72, 56], g2 = [72 + 38, 56 + 14], s = '';
    s += at(g1[0], g1[1], P(gearPath(10, 26, 20), 'fa', 'opacity:.85') + C(0, 0, 8, 'fd') + C(0, 0, 3, 'fw'), M('g1', 10, function (t) { return { r: 360 * t }; }, { n: 12 }));
    s += at(g2[0], g2[1], P(gearPath(8, 20, 15), 'fb', 'opacity:.85') + C(0, 0, 6, 'fd') + C(0, 0, 2.4, 'fw'), M('g2', 10, function (t) { return { r: -450 * t + 8 }; }, { n: 12 }));
    s += P('M172,56V98Q172,104 178,104H208Q214,104 214,98V56', 'sw nf', 'stroke-width:2.2') + R(173, 82, 40, 21, 'fc', 'opacity:.28') + L(171, 56, 215, 56, 'sw', 'opacity:.4;stroke-width:1.2');
    s += R(188, 10, 10, 26, 'fw', 'opacity:.7', 3) + P('M190,36H196L194,44H192Z', 'fw', 'opacity:.7');
    [0, 0.5].forEach(function (d) { s += at(193, 46, P('M0,-4Q3.2,0 0,3Q-3.2,0 0,-4Z', 'fc'), M('dr', 1.8, function (t) { return { y: 36 * t * t, s: 0.5 + 0.7 * min(1, t * 2), o: t < 0.95 ? 1 : 0 }; }, { delay: d, n: 24 })); });
    s += at(193, 82, C(0, 0, 4, 'sw nf ns', 'stroke-width:1.6'), M('rp', 1.8, function (t) { return { sx: 1 + 6 * t, sy: 0.35 * (1 + 6 * t), o: 0.8 * (1 - t) }; }, { delay: 0.0 }));
    s += at(193, 82, C(0, 0, 4, 'sw nf ns', 'stroke-width:1.6'), M('rp', 1.8, function (t) { return { sx: 1 + 6 * t, sy: 0.35 * (1 + 6 * t), o: 0.8 * (1 - t) }; }, { delay: 0.5 }));
    return s;
  };

  /* ===== Chemistry · Paper 2 ===== */
  SC['chem2-01'] = function () { /* greenhouse: CO2 rising and bouncing back */
    var s = '';
    s += at(104, 16, C(0, 0, 8, 'fc') + [0, 1, 2, 3, 4, 5, 6, 7].map(function (i) { return rot(i * 45, L(0, -11, 0, -15, 'sc', 'stroke-width:2')); }).join(''), M('sun', 14, function (t) { return { r: 360 * t }; }, { n: 12 }));
    s += P('M110,26L132,66', 'sc nf qfl', 'opacity:.7;stroke-width:1.6') + P('M100,26L96,70', 'sc nf qfl', 'opacity:.5;stroke-width:1.4');
    s += '<circle cx="120" cy="176" r="96" class="fb" style="opacity:.55"/><circle cx="120" cy="176" r="96" class="sw nf" style="stroke-width:1.6;opacity:.6"/>';
    s += '<ellipse cx="86" cy="96" rx="22" ry="7" class="fa" style="opacity:.7"/><ellipse cx="154" cy="98" rx="26" ry="8" class="fa" style="opacity:.7"/><ellipse cx="120" cy="108" rx="18" ry="5" class="fa" style="opacity:.55"/>';
    s += '<circle cx="120" cy="176" r="112" class="sc nf qfb" style="stroke-width:2.6;opacity:.8"/>';
    s += at(120, 64, R(-60, -2, 120, 4, 'fc', 'opacity:.18', 2), M('lay', 2.4, function (t) { return { o: 0.3 + 0.7 * hc(t) }; }));
    [[70, 74], [120, 62], [172, 74]].forEach(function (p, i) {
      var top = p[1] + 4, mol = C(0, 0, 4.2, 'fw') + C(-8, 0, 3.4, 'fb') + C(8, 0, 3.4, 'fb') + L(-4, 0, -6, 0, 'sw') + L(4, 0, 6, 0, 'sw');
      s += at(p[0], 0, mol, M('co' + i, 3.4, function (t) { return { x: 5 * sin(TAU * t), y: 90 - (90 - top) * sin(PI * t), o: 1 }; }, { delay: i * 0.33, n: 40 }));
    });
    return s;
  };

  SC['chem2-02'] = function () { /* organic: benzene ring + carbon chain */
    var c = [78, 60], R0 = 26, v = [], s = '';
    for (var i = 0; i < 6; i++) v.push([c[0] + R0 * cos(i * PI / 3), c[1] + R0 * sin(i * PI / 3)]);
    s += P(poly(v, true), 'sw nf', 'stroke-width:3');
    for (i = 0; i < 6; i++) { var h = [c[0] + 37 * cos(i * PI / 3), c[1] + 37 * sin(i * PI / 3)]; s += L(v[i][0], v[i][1], c[0] + 32 * cos(i * PI / 3), c[1] + 32 * sin(i * PI / 3), 'sw', 'stroke-width:1.6;opacity:.7') + at(h[0], h[1], C(0, 0, 3.8, 'fw', 'opacity:.85'), M('hh', 2.6, function (t) { return { s: 1 + 0.12 * hc(t) }; }, { delay: i / 6 })); }
    s += at(c[0], c[1], C(0, 0, 15, 'sa nf qfl', 'stroke-width:2.6') + C(0, 0, 8, 'fa', 'opacity:.18'), M('ring', 6, function (t) { return { r: 360 * t }; }, { n: 12 }));
    for (i = 0; i < 6; i++) s += at(v[i][0], v[i][1], C(0, 0, 3.6, 'fc'), M('cv', 2.6, function (t) { return { s: 0.8 + 0.5 * bump(t, 0.5, 0.35) }; }, { delay: i / 6 }));
    var ch = [[v[0][0], v[0][1]], [138, 48], [158, 62], [178, 48], [198, 62]];
    s += P(poly(ch), 'sb nf', 'stroke-width:2.6');
    for (i = 1; i < ch.length; i++) s += C(ch[i][0], ch[i][1], 3.8, 'fa');
    s += at(212, 62, C(0, 0, 9, 'fc', 'opacity:.3') + C(0, 0, 5.6, 'fc'), M('oh', 2, function (t) { return { s: 0.85 + 0.3 * hc(t) }; }));
    s += T(222, 66, 'OH', 'qt qs', 'font-size:8px;fill:var(--c)').replace('x="222"', 'x="226"');
    var pts = ch, tot = 0, segs = [];
    for (i = 1; i < pts.length; i++) { var l = sqrt(Math.pow(pts[i][0] - pts[i - 1][0], 2) + Math.pow(pts[i][1] - pts[i - 1][1], 2)); segs.push(l); tot += l; }
    s += at(0, 0, C(0, 0, 3.4, 'fw') + C(0, 0, 7, 'sw nf ns', 'opacity:.4'), M('sig', 3.2, function (t) { var d = t * tot, k = 0; while (k < segs.length - 1 && d > segs[k]) { d -= segs[k]; k++; } var u = d / segs[k]; return { x: lerp(pts[k][0], pts[k + 1][0], u), y: lerp(pts[k][1], pts[k + 1][1], u), o: fade(t, 0.04, 0.94) }; }, { n: 40 }));
    return s;
  };

  SC['chem2-03'] = function () { /* titration: burette, drops, colour change, pH curve */
    var id = cid('f'), flask = 'M107,86H125V98L141,114Q142,118 137,118H95Q90,118 91,114L107,98Z';
    var s = clipDef(id, '<path d="' + flask + '"/>');
    s += R(110, 4, 12, 54, 'fb', 'opacity:.2', 3) + R(111.5, 20, 9, 38, 'fb', 'opacity:.7') + R(110, 4, 12, 54, 'sw nf', 'stroke-width:1.8', 3) + L(116, 58, 116, 66, 'sw', 'stroke-width:2.4') + R(108, 60, 16, 3, 'fc', '', 1.5);
    for (var i = 0; i < 6; i++) s += L(110, 14 + i * 7, 114, 14 + i * 7, 'sw', 'stroke-width:1;opacity:.5');
    [0, 0.5].forEach(function (d) { s += at(116, 68, P('M0,-4Q3.2,0 0,3Q-3.2,0 0,-4Z', 'fa'), M('dr', 1.5, function (t) { return { y: 18 * t * t, s: 0.5 + 0.6 * min(1, t * 2.4), o: t < 0.97 ? 1 : 0 }; }, { delay: d, n: 24 })); });
    s += '<g clip-path="url(#' + id + ')">' + R(88, 100, 60, 20, 'fw', 'opacity:.3') + at(0, 0, R(88, 96, 60, 24, 'fk', ''), M('pk', 8, function (t) { return { o: t < 0.45 ? 0 : t < 0.56 ? 0.9 * sm((t - 0.45) / 0.11) : t < 0.92 ? 0.9 : 0.9 * (1 - sm((t - 0.92) / 0.08)) }; }, { n: 40 })) + '</g>' + P(flask, 'sw nf', 'stroke-width:2.2');
    s += L(168, 100, 168, 20, 'sw', 'stroke-width:1.4;opacity:.7') + L(168, 100, 236, 100, 'sw', 'stroke-width:1.4;opacity:.7') + T(168, 14, 'pH', 'qt qs') + T(236, 112, 'V', 'qt qs');
    var cy = function (x) { return 94 - 52 / (1 + exp(-(x - 202) / 5)); }, d = '';
    for (var x = 170; x <= 232; x += 2) d += (d ? 'L' : 'M') + x + ',' + n1(cy(x));
    s += P(d, 'sc nf', 'stroke-width:2.4');
    s += at(0, 0, C(0, 0, 4.4, 'fa') + C(0, 0, 8, 'sa nf ns', 'opacity:.5'), M('dt', 8, function (t) { var x = 170 + 62 * min(1, t / 0.9); return { x: x, y: cy(x), o: t > 0.9 ? 1 - (t - 0.9) / 0.1 : 1 }; }, { n: 56 }));
    s += at(202, cy(202), C(0, 0, 5, 'sc nf ns', 'stroke-width:2'), M('eq', 8, function (t) { var u = (t - 0.47) / 0.2; return { s: 1 + 3 * max(0, u), o: u > 0 && u < 1 ? 1 - u : 0 }; }, { n: 56 }));
    return s;
  };

  SC['chem2-04'] = function () { /* galvanic cell */
    var s = P('M22,52V100Q22,106 28,106H92Q98,106 98,100V52', 'sw nf', 'stroke-width:2.2') + P('M142,52V100Q142,106 148,106H212Q218,106 218,100V52', 'sw nf', 'stroke-width:2.2');
    s += R(23, 66, 74, 39, 'fa', 'opacity:.2') + R(143, 66, 74, 39, 'fc', 'opacity:.2');
    s += at(59, 96, R(-5, -66, 10, 66, 'fw', 'opacity:.6', 2), M('zn', 6, function (t) { return { sy: 0.9 + 0.1 * hc(t + 0.5) }; })) + at(179, 96, R(-5, -66, 10, 66, 'fc', '', 2), M('cu', 6, function (t) { return { sy: 0.85 + 0.15 * hc(t) }; }));
    s += P('M59,30V14H179V30', 'sc nf qfl', 'stroke-width:2.6');
    s += C(119, 14, 11, 'fd') + at(119, 14, C(0, 0, 18, 'fc', 'opacity:.25'), M('gl', 2, function (t) { return { s: 0.8 + 0.4 * hc(t), o: 0.5 + 0.5 * hc(t) }; })) + C(119, 14, 8, 'sw nf', 'stroke-width:1.8') + P('M114,18Q119,8 124,18', 'sc nf', 'stroke-width:1.8');
    s += P('M82,70Q119,34 156,70', 'sw nf', 'stroke-width:8;opacity:.22') + P('M82,70Q119,34 156,70', 'sb nf qfl', 'stroke-width:3;opacity:.95');
    [[34, 78], [78, 86], [44, 94]].forEach(function (p, i) { s += at(p[0], p[1], C(0, 0, 3.2, 'fa') + T(0, 1.8, '+', 'qt qs', 'font-size:5px;fill:#06121f'), M('zi' + i, 3, function (t) { return { x: 4 * sin(TAU * t), y: -7 * hc(t), o: 0.5 + 0.5 * hc(t) }; }, { delay: i * 0.3 })); });
    [[196, 82], [152, 90], [204, 96]].forEach(function (p, i) { s += at(p[0], p[1], C(0, 0, 3.2, 'fc') + T(0, 1.8, '+', 'qt qs', 'font-size:5px;fill:#1b1300'), M('ci' + i, 3, function (t) { return { x: -4 * sin(TAU * t), y: 7 * hc(t), o: 0.9 - 0.5 * hc(t) }; }, { delay: i * 0.3 })); });
    return s;
  };

  SC['chem2-05'] = function () { /* industrial chemistry: factory, smoke, coin, conveyor */
    var s = R(36, 62, 116, 38, 'fa', 'opacity:.3') + R(36, 62, 116, 38, 'sa nf', 'stroke-width:1.8') + P('M36,62V46L58,60V46L80,60V46L102,60V46L124,60V46L146,60V62', 'sa nf', 'stroke-width:1.8') + P('M36,62V46L58,60V46L80,60V46L102,60V46L124,60V46L146,60V62Z', 'fa', 'opacity:.25');
    s += R(160, 30, 13, 70, 'fb', 'opacity:.75') + R(180, 46, 10, 54, 'fb', 'opacity:.55') + R(157, 27, 19, 5, 'fw', 'opacity:.7', 1.5) + R(177, 43, 16, 5, 'fw', 'opacity:.7', 1.5);
    [[48, 0.0], [72, 0.3], [96, 0.6], [120, 0.15]].forEach(function (w, i) { s += at(w[0], 72, R(0, 0, 12, 10, 'fc', '', 2), M('wn', 2.4, function (t) { return { o: 0.3 + 0.7 * hc(t) }; }, { delay: w[1] })); });
    [[166, 28], [185, 42]].forEach(function (p, k) { for (var i = 0; i < 3; i++) s += at(p[0], p[1], C(0, 0, 4, 'fw', 'opacity:.7'), M('sm' + k, 3.2, function (t) { return { x: 14 * t + 4 * sin(TAU * t), y: -34 * t, s: 0.6 + 1.5 * t, o: 0.65 * sin(PI * t) }; }, { delay: i / 3 + k * 0.13 })); });
    s += L(24, 100, 170, 100, 'sw', 'stroke-width:2;opacity:.6');
    [0, 0.5].forEach(function (d) { s += at(0, 100, R(0, -9, 10, 9, 'fc', '', 2), M('cv', 3.6, function (t) { return { x: 24 + 134 * t, o: fade(t, 0.08, 0.9) }; }, { delay: d })); });
    s += at(214, 64, C(0, 0, 15, 'fc', 'opacity:.25') + C(0, 0, 13, 'fc') + C(0, 0, 9.5, 'sw nf', 'stroke-width:1;opacity:.6') + T(0, 5, '৳', 'qt qb', 'fill:#1b1300;font-size:14px'), M('coin', 2.6, function (t) { return { sx: max(0.08, abs(cos(TAU * t))), sy: 1 }; }, { n: 40 }));
    return s;
  };

  /* ===== Higher Math · Paper 1 ===== */
  SC['math1-01'] = function () { /* matrix scan */
    var m = [[2, 1, 0], [1, 3, 1], [0, 1, 2]], cxs = [92, 120, 148], rys = [40, 60, 80], s = '';
    s += P('M80,24H72V96H80', 'sw nf', 'stroke-width:2.4') + P('M160,24H168V96H160', 'sw nf', 'stroke-width:2.4') + T(46, 66, 'A =', 'qt', 'font-size:14px;opacity:.8');
    var step = function (t, off) { var w = frac(t + (off || 0)) * 3, i = Math.floor(w), u = frac(w); return i + sm((u - 0.7) / 0.3); };
    s += at(0, 0, R(76, 0, 88, 19, 'fa', 'opacity:.28', 4), M('row', 6, function (t) { return { y: 31 + 20 * step(t) }; }, { n: 60 }));
    s += at(0, 0, R(0, 26, 26, 68, 'fb', 'opacity:.22', 4), M('col', 6, function (t) { return { x: 79 + 28 * step(t, 0.17) }; }, { n: 60 }));
    [0, 1, 2].forEach(function (k) { s += at(cxs[k], rys[k] - 5, C(0, 0, 11, 'fc', 'opacity:.4'), M('dg', 3, function (t) { return { s: 0.6 + 0.6 * bump(t, 0.5, 0.4), o: 0.15 + 0.85 * bump(t, 0.5, 0.4) }; }, { delay: k / 3 })); });
    for (var r = 0; r < 3; r++) for (var c = 0; c < 3; c++) s += T(cxs[c], rys[r], m[r][c], 'qt', 'font-size:16px');
    s += at(206, 62, T(0, 5, '|A|', 'qt', 'font-size:18px;fill:var(--c)'), M('det', 2.4, function (t) { return { s: 1 + 0.14 * hc(t) }; }));
    return s;
  };

  SC['math1-02'] = function () { /* 3D vector with component box */
    var O = [96, 82], X = [0.87 * 54, 0.5 * 54], Y = [-0.87 * 54, 0.5 * 54], Z = [0, -54], a = 0.9, b = 0.8, c = 0.85;
    function pt(i, j, k) { return [i * a * X[0] + j * b * Y[0] + k * c * Z[0], i * a * X[1] + j * b * Y[1] + k * c * Z[1]]; }
    var s = L(O[0], O[1], O[0] + X[0] * 1.15, O[1] + X[1] * 1.15, 'sw', 'stroke-width:1.6;opacity:.6') + L(O[0], O[1], O[0] + Y[0] * 1.15, O[1] + Y[1] * 1.15, 'sw', 'stroke-width:1.6;opacity:.6') + L(O[0], O[1], O[0], O[1] + Z[1] * 1.15, 'sw', 'stroke-width:1.6;opacity:.6');
    s += T(O[0] + X[0] * 1.15 + 6, O[1] + X[1] * 1.15 + 8, 'x', 'qt qs') + T(O[0] + Y[0] * 1.15 - 6, O[1] + Y[1] * 1.15 + 8, 'y', 'qt qs') + T(O[0] - 8, O[1] + Z[1] * 1.15 + 2, 'z', 'qt qs');
    var e = [[[0, 0, 0], [1, 0, 0]], [[0, 0, 0], [0, 1, 0]], [[1, 0, 0], [1, 1, 0]], [[0, 1, 0], [1, 1, 0]], [[0, 0, 1], [1, 0, 1]], [[0, 0, 1], [0, 1, 1]], [[1, 0, 1], [1, 1, 1]], [[0, 1, 1], [1, 1, 1]], [[1, 0, 0], [1, 0, 1]], [[0, 1, 0], [0, 1, 1]], [[1, 1, 0], [1, 1, 1]]], bx = '';
    e.forEach(function (q) { var p = pt.apply(null, q[0]), r = pt.apply(null, q[1]); if (!(q[0][2] === 0 && q[1][2] === 0 && false)) bx += L(p[0], p[1], r[0], r[1], 'sa', 'stroke-width:1.2;stroke-dasharray:3 3;opacity:.7'); });
    var P1 = pt(1, 1, 1);
    s += at(O[0], O[1], bx + L(0, 0, P1[0], P1[1], 'sc', 'stroke-width:3') + C(P1[0], P1[1], 4.6, 'fc') + C(P1[0], P1[1], 8, 'sc nf ns', 'opacity:.45'), M('v', 4.4, function (t) { return { s: 0.5 + 0.5 * hc(t) }; }));
    s += T(200, 38, 'v = (a, b, c)', 'qt', 'font-size:11px;opacity:.7');
    return s;
  };

  SC['math1-03'] = function () { /* straight line, rotating slope */
    var O = [50, 70], run = 70, th = function (t) { return 12 + 26 * hc(t); };
    var s = L(18, 70, 232, 70, 'sw', 'stroke-width:1.4;opacity:.5') + L(50, 10, 50, 112, 'sw', 'stroke-width:1.4;opacity:.5') + T(232, 82, 'x', 'qt qs') + T(40, 14, 'y', 'qt qs');
    for (var i = 1; i < 9; i++) s += L(50 + i * 22, 67, 50 + i * 22, 73, 'sw', 'opacity:.35');
    s += at(O[0], O[1], L(-14, 0, 110, 0, 'sa', 'stroke-width:3'), M('ln', 4.8, function (t) { return { r: -th(t) }; }, { n: 40 }));
    s += L(50, 70, 50 + run, 70, 'sw', 'stroke-dasharray:3 3;opacity:.6;stroke-width:1.3');
    s += at(50 + run, 70, L(0, 0, 0, -1, 'sc ns', 'stroke-width:2.6'), M('ri', 4.8, function (t) { return { sx: 1, sy: run * tan(th(t) * PI / 180) }; }, { n: 40 }));
    s += at(50 + run, 70, C(0, 0, 4.6, 'fc') + C(0, 0, 8, 'sc nf ns', 'opacity:.4'), M('dt', 4.8, function (t) { return { y: -run * tan(th(t) * PI / 180) }; }, { n: 40 }));
    s += C(50, 70, 4, 'fw') + T(196, 30, 'y = mx + c', 'qt', 'font-size:11px;opacity:.75');
    return s;
  };

  SC['math1-04'] = function () { /* circle: radius, tangent, chord */
    var cx = 120, cy = 62, r = 38, a = 0.7, b = 2.3;
    var s = C(cx, cy, r, 'sw nf', 'stroke-width:2.2;opacity:.85') + C(cx, cy, r + 8, 'sa nf qfl', 'stroke-width:1.4;opacity:.45') + C(cx, cy, 2.4, 'fw');
    s += at(cx, cy, rot(0, L(0, 0, r, 0, 'sa', 'stroke-width:2.2') + L(r, -34, r, 34, 'sc', 'stroke-width:2.6') + C(r, 0, 4.6, 'fc') + P('M' + (r - 8) + ',0V-8H' + r, 'sw nf', 'stroke-width:1;opacity:.6')), M('rd', 8, function (t) { return { r: 360 * t }; }, { n: 16 }));
    s += at(cx, cy, L(r * cos(a), r * sin(a), r * cos(b), r * sin(b), 'sb', 'stroke-width:2.2') + L(0, 0, r * cos((a + b) / 2), r * sin((a + b) / 2), 'sw', 'stroke-width:1.2;stroke-dasharray:2 3;opacity:.7') + C(r * cos(a), r * sin(a), 3.4, 'fb') + C(r * cos(b), r * sin(b), 3.4, 'fb'), M('ch', 14, function (t) { return { r: -360 * t }; }, { n: 16 }));
    return s;
  };

  SC['math1-05'] = function () { /* permutations: three balls cycle through all 6 orders */
    var seq = [[0, 1, 2], [1, 0, 2], [1, 2, 0], [2, 1, 0], [2, 0, 1], [0, 2, 1]], cl = ['fa', 'fc', 'fb'], xs = [-44, 0, 44], s = '';
    for (var b = 0; b < 3; b++) (function (b) {
      s += at(120, 54, C(0, 0, 13, cl[b]) + C(-4, -4, 4, 'fw', 'opacity:.5') + T(0, 5, 'ABC'.charAt(b), 'qt qb', 'fill:#07121f;font-size:13px'), M('b' + b, 7.2, function (t) {
        var w = t * 6, i = Math.floor(w) % 6, u = sm((frac(w) - 0.25) / 0.6), from = seq[i][b], to = seq[(i + 1) % 6][b], d = to - from;
        return { x: lerp(xs[from], xs[to], u), y: -d * 14 * sin(PI * u) };
      }, { n: 72 }));
    })(b);
    for (var i = 0; i < 6; i++) s += at(48 + i * 29, 100, C(0, 0, 4, 'fc'), M('d', 7.2, function (t) { return { s: 0.7 + 0.6 * bump(t, 0.5, 0.17), o: 0.2 + 0.8 * bump(t, 0.5, 0.17) }; }, { delay: 1 - (i + 0.5) / 6 + 0.5 }));
    s += T(120, 28, '3! = 6', 'qt', 'font-size:13px;opacity:.75');
    return s;
  };

  SC['math1-06'] = function () { /* trig ratios: right triangle in the unit circle */
    var O = [64, 96], r = 62, th = function (t) { return (45 + 25 * sin(TAU * t)) * PI / 180; };
    var s = L(14, 96, 140, 96, 'sw', 'stroke-width:1.4;opacity:.5') + L(64, 100, 64, 16, 'sw', 'stroke-width:1.4;opacity:.35') + P('M126,96A62,62 0 0 0 64,34', 'sw nf', 'stroke-width:1.4;opacity:.45;stroke-dasharray:3 3');
    s += at(O[0], O[1], L(0, 0, r, 0, 'sw', 'stroke-width:2.6'), M('hy', 5, function (t) { return { r: -deg(th(t)) }; }, { n: 48 }));
    s += at(O[0], O[1], L(0, 0, 1, 0, 'sb ns', 'stroke-width:3'), M('co', 5, function (t) { return { sx: r * cos(th(t)), sy: 1 }; }, { n: 48 }));
    s += at(0, 0, L(0, 0, 0, -1, 'sc ns', 'stroke-width:3'), M('si', 5, function (t) { return { x: O[0] + r * cos(th(t)), y: O[1], sx: 1, sy: r * sin(th(t)) }; }, { n: 48 }));
    s += at(0, 0, C(0, 0, 4.6, 'fa') + C(0, 0, 8, 'sa nf ns', 'opacity:.45'), M('pt', 5, function (t) { return { x: O[0] + r * cos(th(t)), y: O[1] - r * sin(th(t)) }; }, { n: 48 }));
    var rows = [['sin', 'sc', function (q) { return sin(q); }], ['cos', 'sb', function (q) { return cos(q); }], ['tan', 'sa', function (q) { return min(1, tan(q) / 2.4); }]];
    rows.forEach(function (rw, i) { var y = 34 + i * 20, fc = 'f' + rw[1].charAt(1); s += T(160, y + 4, rw[0], 'qt qs', 'text-anchor:start') + R(184, y - 3, 48, 7, 'fw', 'opacity:.1', 3.5) + at(184, y - 3, R(0, 0, 48, 7, fc, '', 3.5), M('br' + i, 5, function (t) { return { sx: max(0.03, rw[2](th(t))), sy: 1 }; }, { n: 48 })); });
    s += T(96, 90, 'θ', 'qt qs', 'font-size:11px');
    return s;
  };

  SC['math1-07'] = function () { /* compound angles: quadrant symmetry rectangle */
    var cx = 120, cy = 62, r = 42, th = function (t) { return (35 + 25 * sin(TAU * t)) * PI / 180; };
    var s = L(60, 62, 180, 62, 'sw', 'stroke-width:1.4;opacity:.5') + L(120, 10, 120, 114, 'sw', 'stroke-width:1.4;opacity:.5') + C(cx, cy, r, 'sw nf', 'stroke-width:1.2;opacity:.4;stroke-dasharray:3 4');
    s += T(160, 28, 'S', 'qt', 'opacity:.5;font-size:12px').replace('x="160"', 'x="82"') + T(160, 28, 'A', 'qt', 'opacity:.5;font-size:12px').replace('x="160"', 'x="158"') + T(82, 108, 'T', 'qt', 'opacity:.5;font-size:12px') + T(158, 108, 'C', 'qt', 'opacity:.5;font-size:12px');
    s += at(cx, cy, R(-1, -1, 2, 2, 'sc ns', 'stroke-width:2.2;fill:rgba(255,255,255,.04)'), M('rc', 5, function (t) { return { sx: r * cos(th(t)) * 2 / 2, sy: r * sin(th(t)) * 2 / 2 }; }, { n: 48 }));
    s += at(cx, cy, L(0, 0, r, 0, 'sa', 'stroke-width:2.2'), M('rd', 5, function (t) { return { r: -deg(th(t)) }; }, { n: 48 }));
    [[1, -1, 'fc'], [-1, -1, 'fa'], [-1, 1, 'fb'], [1, 1, 'fa']].forEach(function (q, i) { s += at(cx, cy, C(0, 0, 4.6, q[2]) + C(0, 0, 8, 'sw nf ns', 'opacity:.3'), M('q' + i, 5, function (t) { return { x: q[0] * r * cos(th(t)), y: q[1] * r * sin(th(t)) }; }, { n: 48 })); });
    return s;
  };

  SC['math1-08'] = function () { /* function graph: y = f(x) drawn, point with guides */
    var ox = 120, oy = 82, d = '';
    for (var x = -56; x <= 56; x += 2) d += (d ? 'L' : 'M') + n1(ox + x) + ',' + n1(oy - x * x / 50);
    var s = L(30, oy, 214, oy, 'sw', 'stroke-width:1.4;opacity:.5') + L(ox, 12, ox, 108, 'sw', 'stroke-width:1.4;opacity:.5') + T(214, oy + 13, 'x', 'qt qs') + T(ox + 8, 14, 'y', 'qt qs');
    for (var i = -4; i <= 4; i++) if (i) s += L(ox + i * 20, oy - 3, ox + i * 20, oy + 3, 'sw', 'opacity:.35');
    s += '<path d="' + d + '" pathLength="1" class="sa nf qdraw" style="stroke-width:3"/>';
    var xt = function (t) { return -56 + 112 * sm(t / 0.6); };
    s += at(0, 0, L(0, 0, 0, -1, 'sw ns', 'stroke-dasharray:3 3;stroke-width:1.4;opacity:.8'), M('vg', 6, function (t) { var x = xt(t); return { x: ox + x, y: oy, sx: 1, sy: x * x / 50, o: fade(t, 0.02, 0.88) }; }, { n: 48 }));
    s += at(0, 0, L(0, 0, 1, 0, 'sw ns', 'stroke-dasharray:3 3;stroke-width:1.4;opacity:.8'), M('hg', 6, function (t) { var x = xt(t); return { x: ox, y: oy - x * x / 50, sx: x, sy: 1, o: fade(t, 0.02, 0.88) }; }, { n: 48 }));
    s += at(0, 0, C(0, 0, 4.8, 'fc') + C(0, 0, 8.5, 'sc nf ns', 'opacity:.4'), M('pt', 6, function (t) { var x = xt(t); return { x: ox + x, y: oy - x * x / 50, o: fade(t, 0.02, 0.88) }; }, { n: 48 }));
    s += T(196, 108, 'y = f(x)', 'qt', 'font-size:11px;opacity:.75');
    return s;
  };

  SC['math1-09'] = function () { /* differentiation: tangent sliding along a curve */
    var y = function (x) { return 64 - 26 * sin(TAU * (x - 20) / 110); }, dy = function (x) { return -26 * cos(TAU * (x - 20) / 110) * TAU / 110; }, d = '';
    for (var x = 16; x <= 224; x += 2) d += (d ? 'L' : 'M') + x + ',' + n1(y(x));
    var s = L(16, 100, 224, 100, 'sw', 'stroke-width:1.3;opacity:.35') + P(d, 'sa nf', 'stroke-width:3');
    var xt = function (t) { return 34 + 172 * hc(t); };
    s += at(0, 0, L(-38, 0, 38, 0, 'sc', 'stroke-width:2.6') + C(0, 0, 5, 'fc') + C(0, 0, 9, 'sc nf ns', 'opacity:.4'), M('tg', 7, function (t) { var xx = xt(t); return { x: xx, y: y(xx), r: deg(atan2(dy(xx), 1)) }; }, { n: 64 }));
    s += at(0, 0, L(0, 0, 0, 1, 'sw ns', 'stroke-dasharray:3 3;stroke-width:1.2;opacity:.6'), M('dr', 7, function (t) { var xx = xt(t); return { x: xx, y: y(xx), sx: 1, sy: 100 - y(xx) }; }, { n: 64 }));
    s += T(40, 20, "f′(x)", 'qt', 'font-size:12px;opacity:.75');
    return s;
  };

  SC['math1-10'] = function () { /* integration: Riemann bars rising under a curve */
    var n = 12, x0 = 36, w = 13.4, base = 94, f = function (u) { return 16 + 46 * sin(PI * u); }, s = L(30, base, 210, base, 'sw', 'stroke-width:1.4;opacity:.55') + L(30, base, 30, 18, 'sw', 'stroke-width:1.4;opacity:.45');
    for (var i = 0; i < n; i++) { var h = f((i + 0.5) / n); s += at(x0 + i * w, base, R(0, -h, w - 1.6, h, i % 2 ? 'fa' : 'fb', 'opacity:.75', 1.5), M('b', 7, function (t) { return { sy: max(0.001, sm((t - 0.04) / 0.4)), o: fade(t, 0.02, 0.86) }; }, { delay: 1 - i * 0.045 })); }
    var d = ''; for (var k = 0; k <= 60; k++) { var u = k / 60; d += (k ? 'L' : 'M') + n1(x0 + u * n * w) + ',' + n1(base - f(u)); }
    s += P(d, 'sc nf', 'stroke-width:2.8') + T(214, 52, '∫', 'qt', 'font-size:38px;fill:var(--c);font-weight:300');
    s += at(0, 0, C(0, 0, 4.4, 'fc'), M('pt', 7, function (t) { var u = sm(t / 0.6), x = x0 + u * n * w; return { x: x, y: base - f(u), o: fade(t, 0.02, 0.9) }; }, { n: 48 }));
    return s;
  };

  /* ===== Higher Math · Paper 2 ===== */
  SC['math2-01'] = function () { /* real numbers & inequalities */
    var y = 66, a = function (t) { return 76 + 22 * sin(TAU * t); }, b = function (t) { return 158 + 22 * sin(TAU * t + 1.4); };
    var s = L(10, y, 230, y, 'sw', 'stroke-width:2;opacity:.7') + P('M230,66l-8,-4v8z', 'fw', 'opacity:.7') + P('M10,66l8,-4v8z', 'fw', 'opacity:.7');
    for (var i = 0; i <= 6; i++) { s += L(30 + i * 30, y - 5, 30 + i * 30, y + 5, 'sw', 'opacity:.6'); s += T(30 + i * 30, y + 20, i - 3, 'qt qs'); }
    s += at(0, y, R(0, -6, 1, 12, 'fa', 'opacity:.3') + L(0, 0, 1, 0, 'sa ns', 'stroke-width:5'), M('sg', 5, function (t) { return { x: a(t), sx: b(t) - a(t), sy: 1 }; }, { n: 48 }));
    s += at(0, y, C(0, 0, 6.5, 'fd') + C(0, 0, 6.5, 'sa nf', 'stroke-width:2.6'), M('ca', 5, function (t) { return { x: a(t) }; }, { n: 48 }));
    s += at(0, y, C(0, 0, 6.5, 'fc'), M('cb', 5, function (t) { return { x: b(t) }; }, { n: 48 }));
    s += at(0, y, P('M0,-8L7,0L0,8L-7,0Z', 'fw') , M('xm', 5, function (t) { var u = 0.5 + 0.42 * sin(TAU * t * 2 + 0.6); return { x: lerp(a(t), b(t), u), y: -18 }; }, { n: 64 }));
    s += T(120, 28, 'a < x ≤ b', 'qt', 'font-size:14px;fill:var(--c)');
    return s;
  };

  SC['math2-02'] = function () { /* complex plane: z and conjugate */
    var cx = 120, cy = 62, r = 40;
    var s = L(52, cy, 190, cy, 'sw', 'stroke-width:1.4;opacity:.5') + L(cx, 12, cx, 112, 'sw', 'stroke-width:1.4;opacity:.5') + T(196, cy + 14, 'Re', 'qt qs') + T(cx + 12, 14, 'Im', 'qt qs');
    s += C(cx, cy, r, 'sa nf qfl', 'stroke-width:1.6;opacity:.55');
    s += at(cx, cy, L(0, 0, r, 0, 'sc', 'stroke-width:2.4'), M('z', 8, function (t) { return { r: -360 * t }; }, { n: 16 })) + at(cx, cy, L(0, 0, r, 0, 'sb', 'stroke-width:2.4'), M('zc', 8, function (t) { return { r: 360 * t }; }, { n: 16 }));
    s += at(cx, cy, L(0, -0.5, 0, 0.5, 'sw ns', 'stroke-dasharray:3 3;stroke-width:1.3;opacity:.7'), M('v', 8, function (t) { return { x: r * cos(TAU * t), sx: 1, sy: 2 * r * sin(TAU * t) }; }, { n: 64 }));
    s += at(cx, cy, C(0, 0, 4.8, 'fc') + C(0, 0, 8.5, 'sc nf ns', 'opacity:.4'), M('pz', 8, function (t) { return { x: r * cos(TAU * t), y: -r * sin(TAU * t) }; }, { n: 64 }));
    s += at(cx, cy, C(0, 0, 4.8, 'fb') + C(0, 0, 8.5, 'sb nf ns', 'opacity:.4'), M('pc', 8, function (t) { return { x: r * cos(TAU * t), y: r * sin(TAU * t) }; }, { n: 64 }));
    s += T(66, 24, 'z = a + bi', 'qt', 'font-size:11px;opacity:.75').replace('x="66"', 'x="64"');
    return s;
  };

  SC['math2-03'] = function () { /* polynomial: roots fixed while the curve morphs */
    var ox = 120, oy = 62, d = '';
    for (var x = -78; x <= 78; x += 2) d += (d ? 'L' : 'M') + (ox + x) + ',' + n1(-(x * (x * x - 2500)) / 1500);
    var s = L(24, oy, 216, oy, 'sw', 'stroke-width:1.4;opacity:.55');
    s += at(0, oy, P(d.replace(/M(\d+)/, 'M$1'), 'sa nf', 'stroke-width:3'), M('cv', 5, function (t) { return { sx: 1, sy: cos(TAU * t) }; }, { n: 48 }));
    [-50, 0, 50].forEach(function (rx, i) { s += at(ox + rx, oy, C(0, 0, 4.6, 'fc') + C(0, 0, 4.6, 'sc nf ns', 'stroke-width:1.6'), M('rt', 2.4, function (t) { return { s: 1 + 0.2 * hc(t), o: 1 }; }, { delay: i / 3 })) + at(ox + rx, oy, C(0, 0, 4.6, 'sc nf ns', 'stroke-width:1.6'), M('rp', 2.4, function (t) { return { s: 1 + 3 * t, o: 0.8 * (1 - t) }; }, { delay: i / 3 })); });
    s += T(206, 108, 'p(x) = 0', 'qt', 'font-size:11px;opacity:.75');
    return s;
  };

  SC['math2-04'] = function () { /* Pascal's triangle with a falling ball */
    var rows = [[1], [1, 1], [1, 2, 1], [1, 3, 3, 1], [1, 4, 6, 4, 1], [1, 5, 10, 10, 5, 1]], s = '', cx = 120, y0 = 20, dy = 16, dx = 26;
    rows.forEach(function (rw, r) {
      s += at(0, 0, rw.map(function (v, i) { return T(cx + (i - (rw.length - 1) / 2) * dx, y0 + r * dy + 5, v, 'qt', 'font-size:13px'); }).join(''), M('rw', 4.8, function (t) { var ph = t; return { o: 0.35 + 0.65 * (ph < 0.2 ? sin(PI * ph / 0.2) : 0) }; }, { delay: 1 - r * 0.1 }));
    });
    var path = [[cx, y0 + 2]], x = cx, ch = [-1, 1, 1, -1, 1];
    for (var r = 1; r < 6; r++) { x += ch[r - 1] * dx / 2; path.push([x, y0 + r * dy + 2]); }
    s += at(0, 0, C(0, 0, 5, 'fc', 'opacity:.9') + C(0, 0, 9, 'sc nf ns', 'opacity:.4'), M('ball', 4.8, function (t) { var w = min(1, t / 0.8) * 5, i = Math.min(4, Math.floor(w)), u = sm(w - i); if (t > 0.8) { i = 4; u = 1; } return { x: lerp(path[i][0], path[i + 1][0], u), y: lerp(path[i][1], path[i + 1][1], u) - 4 * sin(PI * u), o: fade(t, 0.03, 0.9) }; }, { n: 60 }));
    s += T(32, 62, '(a+b)ⁿ', 'qt', 'font-size:11px;opacity:.7');
    return s;
  };

  SC['math2-05'] = function () { /* conics: ellipse, foci and the constant string */
    var cx = 120, cy = 62, rx = 74, ry = 40, c = sqrt(rx * rx - ry * ry);
    var s = '<ellipse cx="' + cx + '" cy="' + cy + '" rx="' + rx + '" ry="' + ry + '" class="sw nf qfl" style="stroke-width:2.4;opacity:.9"/>' + L(cx - rx - 8, cy, cx + rx + 8, cy, 'sw', 'stroke-width:1;opacity:.25') + L(cx, cy - ry - 8, cx, cy + ry + 8, 'sw', 'stroke-width:1;opacity:.25');
    var pos = function (t) { return [rx * cos(TAU * t), ry * sin(TAU * t)]; };
    [-c, c].forEach(function (fx, k) {
      s += at(cx + fx, cy, L(0, 0, 1, 0, k ? 'sa ns' : 'sb ns', 'stroke-width:2.2;opacity:.9'), M('ln' + k, 8, function (t) { var p = pos(t), dx = p[0] - fx, dyy = p[1]; return { r: deg(atan2(dyy, dx)), sx: sqrt(dx * dx + dyy * dyy), sy: 1 }; }, { n: 64 }));
      s += at(cx + fx, cy, C(0, 0, 4.2, 'fc') + C(0, 0, 4.2, 'sc nf ns'), M('fo' + k, 2.4, function (t) { return { s: 1 + 0.3 * hc(t) }; }, { delay: k * 0.5 }));
    });
    s += at(cx, cy, C(0, 0, 5, 'fw') + C(0, 0, 9, 'sw nf ns', 'opacity:.4'), M('p', 8, function (t) { var p = pos(t); return { x: p[0], y: p[1] }; }, { n: 64 }));
    return s;
  };

  SC['math2-06'] = function () { /* inverse trig: sin and arcsin mirror across y = x */
    var ox = 120, oy = 62, k = 30, d1 = '', d2 = '';
    for (var u = -PI / 2; u <= PI / 2 + 0.001; u += 0.1) { d1 += (d1 ? 'L' : 'M') + n1(ox + k * u) + ',' + n1(oy - k * sin(u)); d2 += (d2 ? 'L' : 'M') + n1(ox + k * sin(u)) + ',' + n1(oy - k * u); }
    var s = L(60, oy, 180, oy, 'sw', 'stroke-width:1.3;opacity:.4') + L(ox, 8, ox, 116, 'sw', 'stroke-width:1.3;opacity:.4') + L(ox - 52, oy + 52, ox + 52, oy - 52, 'sw', 'stroke-width:1.4;stroke-dasharray:4 4;opacity:.65');
    s += P(d1, 'sa nf', 'stroke-width:2.8') + P(d2, 'sc nf', 'stroke-width:2.8');
    var q = function (t) { return -1.45 + 2.9 * hc(t); };
    s += at(ox, oy, L(0, 0, 1, 0, 'sw ns', 'stroke-dasharray:3 3;stroke-width:1.4;opacity:.85'), M('cn', 6, function (t) { var u2 = q(t), p1 = [k * u2, -k * sin(u2)], p2 = [k * sin(u2), -k * u2]; return { x: p1[0], y: p1[1], r: deg(atan2(p2[1] - p1[1], p2[0] - p1[0])), sx: sqrt(Math.pow(p2[0] - p1[0], 2) + Math.pow(p2[1] - p1[1], 2)), sy: 1 }; }, { n: 64 }));
    s += at(ox, oy, C(0, 0, 4.6, 'fa') + C(0, 0, 8, 'sa nf ns', 'opacity:.4'), M('p1', 6, function (t) { var u2 = q(t); return { x: k * u2, y: -k * sin(u2) }; }, { n: 64 }));
    s += at(ox, oy, C(0, 0, 4.6, 'fc') + C(0, 0, 8, 'sc nf ns', 'opacity:.4'), M('p2', 6, function (t) { var u2 = q(t); return { x: k * sin(u2), y: -k * u2 }; }, { n: 64 }));
    s += T(184, 28, 'sin⁻¹x', 'qt', 'font-size:11px;fill:var(--c)') + T(60, 98, 'sin x', 'qt', 'font-size:11px;fill:var(--a)');
    return s;
  };

  SC['math2-07'] = function () { /* statics: ladder in equilibrium with force arrows */
    var wallX = 186, base = [132, 104], top = [wallX, 18], len = sqrt(Math.pow(top[0] - base[0], 2) + Math.pow(top[1] - base[1], 2)), ang = deg(atan2(top[1] - base[1], top[0] - base[0]));
    var s = L(30, 104, 236, 104, 'sw', 'stroke-width:2;opacity:.6') + R(wallX, 8, 8, 100, 'fw', 'opacity:.22', 2) + L(wallX, 8, wallX, 104, 'sw', 'stroke-width:2;opacity:.7');
    var ladder = L(0, -4, len, -4, 'sw', 'stroke-width:2.4') + L(0, 4, len, 4, 'sw', 'stroke-width:2.4');
    for (var i = 1; i < 9; i++) ladder += L(i * len / 9, -4, i * len / 9, 4, 'sw', 'stroke-width:1.6;opacity:.8');
    s += at(base[0], base[1], rot(ang, ladder));
    var pulse = function (k) { return function (t) { return { s: 0.82 + 0.3 * bump(t, k, 0.3), o: 0.5 + 0.5 * bump(t, k, 0.3) }; }; };
    var mid = [base[0] + (top[0] - base[0]) / 2, base[1] + (top[1] - base[1]) / 2];
    s += at(mid[0], mid[1], rot(90, arrow(26, 'c', 'stroke-width:2.6')), M('w', 3, pulse(0.1))) +
         at(base[0], base[1], rot(-90, arrow(26, 'a', 'stroke-width:2.6')), M('n', 3, pulse(0.4))) +
         at(base[0], base[1], rot(180, arrow(24, 'b', 'stroke-width:2.6')), M('f', 3, pulse(0.7))) +
         at(top[0], top[1], rot(180, arrow(24, 'b', 'stroke-width:2.6')), M('r', 3, pulse(0.7)));
    s += at(base[0], base[1], rot(ang, at(0, -10, C(0, 0, 5.2, 'fc') + C(0, 0, 9, 'sc nf ns', 'opacity:.4'), M('cl', 6, function (t) { return { x: len * (0.12 + 0.7 * hc(t)) }; }, { n: 40 }))));
    return s;
  };

  SC['math2-08'] = function () { /* particle motion: velocity arrow + v-t graph */
    var x0 = 34, x1 = 206, ty = 96, gx = 56, gw = 128, gy = 28;
    var pos = function (t) { return x0 + (x1 - x0) * hc(t); }, vel = function (t) { return sin(TAU * t); };
    var s = L(24, ty, 216, ty, 'sw', 'stroke-width:2;opacity:.6');
    for (var i = 0; i <= 8; i++) s += L(x0 + i * (x1 - x0) / 8, ty - 4, x0 + i * (x1 - x0) / 8, ty + 4, 'sw', 'opacity:.5');
    s += L(gx, gy - 20, gx, gy + 20, 'sw', 'stroke-width:1.2;opacity:.4') + L(gx - 4, gy, gx + gw + 4, gy, 'sw', 'stroke-width:1.2;opacity:.4') + T(gx + gw + 10, gy + 4, 't', 'qt qs') + T(gx - 6, gy - 14, 'v', 'qt qs');
    var dd = ''; for (var k = 0; k <= 64; k++) { var tt = k / 64; dd += (k ? 'L' : 'M') + n1(gx + gw * tt) + ',' + n1(gy - 16 * sin(TAU * tt)); }
    s += P(dd, 'sa nf', 'stroke-width:2.4;opacity:.85');
    s += at(0, 0, L(0, -16, 0, 16, 'sw', 'stroke-width:1;stroke-dasharray:2 3;opacity:.5'), M('cur', 6, function (t) { return { x: gx + gw * t, y: gy }; }, { n: 48 }));
    s += at(0, 0, C(0, 0, 4.4, 'fc') + C(0, 0, 8, 'sc nf ns', 'opacity:.4'), M('cd', 6, function (t) { return { x: gx + gw * t, y: gy - 16 * sin(TAU * t) }; }, { n: 64 }));
    s += at(0, 0, R(-9, -9, 18, 14, 'fb', '', 4) + C(-5, 7, 3, 'fw') + C(5, 7, 3, 'fw'), M('car', 6, function (t) { return { x: pos(t), y: ty - 7 }; }, { n: 48 }));
    s += at(0, 0, arrow(36, 'c', 'stroke-width:2.8'), M('va', 6, function (t) { var v = vel(t); return { x: pos(t) , y: ty - 28, sx: max(0.02, abs(v)) * (v < 0 ? -1 : 1), sy: 1 }; }, { n: 64 }));
    return s;
  };

  SC['math2-09'] = function () { /* linear programming: iso-profit line sweeping to the optimum */
    var V = [[40, 100], [40, 58], [80, 30], [150, 38], [180, 70], [170, 100]], id = cid('p'), nrm = [1, 0.8], n2v = nrm[0] * nrm[0] + nrm[1] * nrm[1];
    var s = clipDef(id, '<path d="' + poly(V, true) + '"/>');
    s += L(34, 100, 34, 14, 'sw', 'stroke-width:1.5;opacity:.6') + L(34, 100, 224, 100, 'sw', 'stroke-width:1.5;opacity:.6') + T(226, 112, 'x', 'qt qs') + T(26, 18, 'y', 'qt qs');
    s += at(0, 0, P(poly(V, true), 'fa', 'opacity:.2'), M('fz', 3, function (t) { return { o: 0.55 + 0.45 * hc(t) }; })) + P(poly(V, true), 'sa nf', 'stroke-width:2.4');
    var ang = deg(atan2(-1, -0.8)), kmax = 204, pos = function (k) { var px = k * nrm[0] / n2v, py = k * nrm[1] / n2v; return { x: 40 + px, y: 100 - py }; };
    s += '<g clip-path="url(#' + id + ')">' + at(0, 0, rot(ang, L(-140, 0, 140, 0, 'sc', 'stroke-width:3')), M('iso', 6, function (t) { var u = sm(t / 0.7), p = pos(lerp(30, kmax, u)); return { x: p.x, y: p.y, o: fade(t, 0.02, 0.92) }; }, { n: 48 })) + '</g>';
    s += at(180, 70, C(0, 0, 5.2, 'fc') + C(0, 0, 5.2, 'sc nf ns', 'stroke-width:2'), M('opt', 6, function (t) { return { s: 1 + 1.6 * bump(t, 0.72, 0.12), o: 0.6 + 0.4 * bump(t, 0.72, 0.2) }; }, { n: 48 }));
    V.forEach(function (p, i) { if (i !== 4) s += C(p[0], p[1], 2.6, 'fw', 'opacity:.7'); });
    s += T(206, 40, 'max z', 'qt', 'font-size:11px;fill:var(--c)');
    return s;
  };

  SC['math2-10'] = function () { /* statistics: bell histogram + falling samples */
    var n = 9, w = 18, x0 = 39, base = 98, s = L(30, base, 212, base, 'sw', 'stroke-width:1.5;opacity:.6');
    var h = function (i) { return 58 * exp(-Math.pow((i - 4) / 2.1, 2) / 2) + 6; };
    for (var i = 0; i < n; i++) s += at(x0 + i * w, base, R(0, -h(i), w - 2.5, h(i), i % 2 ? 'fa' : 'fb', 'opacity:.72', 2), M('bar', 3.2, function (t) { return { sx: 1, sy: 0.84 + 0.2 * hc(t) }; }, { delay: i * 0.09 }));
    var d = ''; for (var k = 0; k <= 60; k++) { var u = k / 60 * (n - 1) , xx = x0 + u * w + (w - 2.5) / 2; d += (k ? 'L' : 'M') + n1(xx) + ',' + n1(base - h(u) - 2); }
    s += P(d, 'sc nf', 'stroke-width:2.8') + L(x0 + 4 * w + (w - 2.5) / 2, 20, x0 + 4 * w + (w - 2.5) / 2, base, 'sw', 'stroke-dasharray:3 3;opacity:.6;stroke-width:1.2');
    [[2, 0], [5, 0.33], [4, 0.66]].forEach(function (b, i) { var bx = x0 + b[0] * w + (w - 2.5) / 2; s += at(0, 0, C(0, 0, 3.6, 'fc'), M('d' + i, 2.8, function (t) { return { x: lerp(120, bx, sm(t * 1.1)) + 5 * sin(TAU * t * 3) * (1 - t), y: lerp(10, base - h(b[0]) - 8, t * t), o: fade(t, 0.05, 0.9) }; }, { delay: b[1], n: 36 })); });
    s += T(206, 30, 'μ ± σ', 'qt', 'font-size:12px;fill:var(--c)');
    return s;
  };

  /* ---------- chapter table, hues, cards ---------- */
  var FALLBACK_KEYS = Object.keys(SC);
  function chapterList() { var A = window.CL_GAME_ACADEMY; return A && Array.isArray(A.chapters) ? A.chapters : []; }
  function hueFor(ch) {
    var list = chapterList().filter(function (c) { return c.subjectKey === ch.subjectKey; }), i = Math.max(0, list.indexOf(ch)), n = Math.max(1, list.length - 1), p = i / n;
    if (ch.subjectKey === 'physics') return Math.round(184 + p * 110);
    if (ch.subjectKey === 'chemistry') return Math.round(86 + p * 112);
    if (ch.subjectKey === 'math') return Math.round((322 + p * 104) % 360);
    return 250;
  }
  var CACHE = {};
  function scene(id) {
    if (CACHE[id]) return CACHE[id];
    var fn = SC[id], out;
    CUR = String(id).replace(/[^a-z0-9]/gi, '');
    try { out = (fn || SC[FALLBACK_KEYS[0]])(); } catch (e) { out = ''; }
    return (CACHE[id] = '<svg class="qs-svg" viewBox="0 0 320 128" preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false"><g transform="translate(40 4)">' + out + '</g></svg>');
  }

  var SUBJ = { physics: 'পদার্থ', chemistry: 'রসায়ন', math: 'উচ্চতর গণিত', mixed: 'মিশ্র' };
  function card(o) {
    var ch = chapterList().filter(function (c) { return c.id === o.chapterId; })[0] || {};
    var sk = o.subjectKey || ch.subjectKey || 'mixed', h = ch.id ? hueFor(ch) : 250;
    var no = (String(o.chapterId || '').match(/(\d+)$/) || [])[1] || '';
    var title = esc(o.title), href = '#/play/' + esc(o.id);
    return '<article class="qcard" data-subject="' + esc(sk) + '" data-chapter="' + esc(o.chapterId) + '" style="--h:' + h + '">' +
      '<div class="qcard-stage"><span class="qc-aur"></span><span class="qc-ring"></span>' + (SC[o.chapterId] ? scene(o.chapterId) : scene(FALLBACK_KEYS[0])) +
      '<i class="qc-q q1">?</i><i class="qc-q q2">?</i><i class="qc-q q3">?</i>' +
      '<span class="qcard-badge"><b>Q</b>' + (+o.count || 0) + 'টি প্রশ্ন</span><span class="qcard-xp">+' + (+o.xp || 0) + ' XP</span></div>' +
      '<div class="qcard-body"><div class="qcard-tags"><span class="qcard-subj">' + esc(SUBJ[sk] || 'মিশ্র') + '</span>' + (o.paper ? '<span class="qcard-paper">' + esc(o.paper) + '</span>' : '') + (no ? '<span class="qcard-no">অধ্যায় ' + esc(no) + '</span>' : '') + '</div>' +
      '<h3>' + title + '</h3>' +
      '<a class="qcard-go" data-ga-launch href="' + href + '" aria-label="কুইজ শুরু করুন: ' + title + '"><span>কুইজ শুরু করুন</span><svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2 .8v10.4L11 6z"/></svg></a></div></article>';
  }

  /* Animate what is on screen plus a head-start margin, so cards below are already moving when they arrive.
     If the device can't keep ~30fps, drop to "lite": smaller margin and no decorative layers. */
  var io = null, lite = false, mon = 0;
  function mkIO(margin) {
    return new IntersectionObserver(function (es) { es.forEach(function (e) { e.target.classList.toggle('is-live', e.isIntersecting); }); }, { rootMargin: margin + 'px 0px', threshold: 0 });
  }
  function goLite() {
    if (lite) return; lite = true;
    document.documentElement.classList.add('qa-lite');
    if (io) { io.disconnect(); io = mkIO(60); Array.prototype.forEach.call(document.querySelectorAll('.qcard[data-qa-seen]'), function (c) { io.observe(c); }); }
  }
  function monitor() {
    if (mon || !window.requestAnimationFrame) return; mon = 1;
    var n = 0, sum = 0, last = 0, rounds = 0;
    function f(t) {
      if (lite || rounds > 6) return;
      if (document.hidden) { last = 0; return requestAnimationFrame(f); }
      if (last) { var d = t - last; if (d < 250) { sum += d; n++; } }
      last = t;
      if (n >= 60) { if (sum / n > 30) { goLite(); return; } rounds++; n = 0; sum = 0; }
      requestAnimationFrame(f);
    }
    requestAnimationFrame(f);
  }
  function observe(root) {
    if (!root) return;
    var cards = root.querySelectorAll('.qcard:not([data-qa-seen])');
    if (!cards.length) return;
    if (!('IntersectionObserver' in window)) { Array.prototype.forEach.call(cards, function (c) { c.classList.add('is-live'); c.setAttribute('data-qa-seen', '1'); }); return; }
    if (!io) io = mkIO(lite ? 60 : 380);
    Array.prototype.forEach.call(cards, function (c) { c.setAttribute('data-qa-seen', '1'); io.observe(c); });
    monitor();
  }

  window.CL_QUIZ_ANIM = { card: card, scene: scene, observe: observe, ids: Object.keys(SC), hue: hueFor };
})();
