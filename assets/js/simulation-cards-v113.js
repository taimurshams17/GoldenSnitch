/* Golden Snitch v113 — Simulation cards: premium "live lab" cards with a scene per simulation.
   Reusable engine: mv() turns any f(t) -> {x,y,r,s,sx,sy,m,o} into a deduplicated CSS @keyframes rule; scenes
   compose a few SVG primitives bound to those motions. Pure CSS transform/opacity animation.
   Desktop: every preview runs on its own CSS timeline. Phones/touch (v113c): previews are drawn but frozen until the card is near the viewport.
   Exposes window.CL_SIM_ANIM = { card, scene, ids, hue }.                                                  */
(function () {
  'use strict';
  var sin = Math.sin, cos = Math.cos, PI = Math.PI, TAU = PI * 2, abs = Math.abs, sqrt = Math.sqrt, atan2 = Math.atan2,
      exp = Math.exp, max = Math.max, min = Math.min, pow = Math.pow, floor = Math.floor;

  /* ---------- tiny helpers ---------- */
  function esc(x) { return String(x == null ? '' : x).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function r1(x) { return Math.round(x * 10) / 10; }
  function r2(x) { return Math.round(x * 100) / 100; }
  function frac(x) { return x - floor(x); }
  function tri(t) { return 1 - abs(2 * frac(t) - 1); }          /* 0..1..0 */
  function hc(t) { return 0.5 - 0.5 * cos(TAU * t); }            /* 0..1..0 smooth */
  function sm(u) { u = u < 0 ? 0 : u > 1 ? 1 : u; return u * u * (3 - 2 * u); }
  function ramp(t, a, b) { return sm((t - a) / (b - a)); }       /* 0 -> 1 between a and b */
  function lerp(a, b, u) { return a + (b - a) * u; }
  function deg(r) { return r * 180 / PI; }
  function bump(t, c, w) { var d = abs(t - c); d = min(d, 1 - d); return d >= w ? 0 : 0.5 + 0.5 * cos(PI * d / w); }
  function hash(s) { var h = 5381; for (var i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0; return (h >>> 0); }

  /* ---------- keyframe engine (deduplicated by content) ---------- */
  var sheet = null, KFS = {}, KS = null;
  /* Scenes live in Shadow DOM when supported: the app's very large global stylesheet then never has to be matched
     against (and re-resolved for) every animated SVG node on every frame. Falls back to plain light-DOM SVG. */
  var SHADOW = !!(window.customElements && Element.prototype.attachShadow && 'adoptedStyleSheets' in document && window.CSSStyleSheet && CSSStyleSheet.prototype.replaceSync);
  var BASE = ':host{display:block;position:absolute;inset:0;z-index:1;pointer-events:none;contain:strict}' +
    'svg{position:absolute;left:0;top:14px;width:100%;height:calc(100% - 14px);overflow:hidden;display:block}' +
    '.fa{fill:var(--a)}.fb{fill:var(--b)}.fc{fill:var(--c)}.fw{fill:#fff}.fd{fill:var(--bg,#0a1020)}.fk{fill:#f472b6}.fg{fill:rgba(255,255,255,.1)}' +
    '.sa,.sb,.sc,.sw,.sd,.sk{stroke-width:2;stroke-linecap:round;stroke-linejoin:round}' +
    '.sa{stroke:var(--a)}.sb{stroke:var(--b)}.sc{stroke:var(--c)}.sw{stroke:#fff}.sd{stroke:var(--bg,#0a1020)}.sk{stroke:#f472b6}' +
    'line.sa,line.sb,line.sc,line.sw,path.sa,path.sb,path.sc,path.sw,path.sk,path.sd{fill:none}.nf{fill:none}' +
    '*{shape-rendering:optimizeSpeed}text,.tx{fill:#fff;font:700 11px/1 system-ui,-apple-system,"Segoe UI","Noto Sans Bengali",sans-serif;text-anchor:middle}.sm{font-size:9.5px;opacity:.9}.big{font-size:16px}' +
    '@keyframes sxFlow{to{stroke-dashoffset:-9}}@keyframes sxBlink{0%,100%{opacity:.3}50%{opacity:1}}' +
    '@keyframes sxDraw{0%{stroke-dashoffset:1;opacity:1}60%,88%{stroke-dashoffset:0;opacity:1}100%{stroke-dashoffset:0;opacity:0}}@keyframes sxDrawLoop{0%{stroke-dashoffset:1}100%{stroke-dashoffset:0}}' +
    ':host([data-idle]) *{animation-play-state:paused!important}' +
    '@media (prefers-reduced-motion:reduce){*{animation-play-state:paused!important}}';
  function css(s) {
    if (SHADOW) { if (!KS) { KS = new CSSStyleSheet(); KS.replaceSync(BASE); } try { KS.insertRule(s, KS.cssRules.length); } catch (e) { } return; }
    if (!sheet) { sheet = document.createElement('style'); sheet.id = 'sx-kf'; document.head.appendChild(sheet); }
    sheet.appendChild(document.createTextNode(s));
  }
  function sharedSheet() { if (!KS) { KS = new CSSStyleSheet(); KS.replaceSync(BASE); } return KS; }
  function tf(v) {
    var s = '';
    if (v.m) s += 'matrix(' + v.m.map(r2).join(',') + ',0,0)';
    if (v.x != null || v.y != null) s += (s ? ' ' : '') + 'translate(' + r1(v.x || 0) + 'px,' + r1(v.y || 0) + 'px)';
    if (v.r != null) s += ' rotate(' + r1(v.r) + 'deg)';
    if (v.s != null || v.sx != null || v.sy != null) {
      var a = v.sx != null ? v.sx : (v.s != null ? v.s : 1), b = v.sy != null ? v.sy : (v.s != null ? v.s : 1);
      s += ' scale(' + r2(a) + ',' + r2(b) + ')';
    }
    return s || 'none';
  }
  function kf(fn, n) {
    n = n || 20;
    var body = '';
    for (var i = 0; i <= n; i++) {
      var v = fn(i / n);
      body += (i * 100 / n).toFixed(1) + '%{transform:' + tf(v) + (v.o != null ? ';opacity:' + r2(v.o) : '') + '}';
    }
    var key = hash(body).toString(36);
    if (!KFS[key]) { KFS[key] = 'sx' + key; css('@keyframes sx' + key + '{' + body + '}'); }
    return KFS[key];
  }
  /* mv(seconds, fn, {d: phase 0..1, n: samples, e: easing}) -> inline animation style */
  /* motion score = how much the node visibly moves; used to keep only the most meaningful animations per scene */
  function score(fn) {
    var m = 0;
    for (var i = 0; i < 8; i++) { var v = fn(i / 8) || {}; m = Math.max(m, Math.abs(v.x || 0) + Math.abs(v.y || 0) + Math.abs(v.r || 0) * 0.6 + (v.s != null ? Math.abs(v.s - 1) * 40 : 0) + (v.sx != null ? Math.abs(v.sx - 1) * 40 : 0) + (v.sy != null ? Math.abs(v.sy - 1) * 40 : 0) + (v.m ? 30 : 0) + (v.o != null ? 12 : 0)); }
    return Math.round(m * 10) / 10;
  }
  function mv(dur, fn, o) {
    o = o || {};
    var d = frac(o.d || 0);
    return 'animation:' + kf(fn, o.n) + ' ' + dur + 's ' + (o.e || 'linear') + ' infinite' + (d ? ';animation-delay:-' + (d * dur).toFixed(2) + 's' : '') + ';--sxs:' + score(fn);
  }
  /* common motions */
  function osc(dur, a, ax, ph, n) { return mv(dur, function (t) { var v = a * sin(TAU * t); return ax === 'y' ? { y: v } : ax === 'r' ? { r: v } : ax === 's' ? { s: 1 + v } : { x: v }; }, { d: ph, n: n || 16 }); }
  function spin(dur, ph, dir) { return mv(dur, function (t) { return { r: (dir || 1) * 360 * t }; }, { d: ph, n: 4 }); }
  function pulse(dur, s0, s1, ph) { return mv(dur, function (t) { return { s: lerp(s0, s1, hc(t)) }; }, { d: ph, n: 12 }); }
  function blink(dur, ph, lo, hi) { return mv(dur, function (t) { return { o: lerp(lo == null ? 0.15 : lo, hi == null ? 1 : hi, hc(t)) }; }, { d: ph, n: 12 }); }
  /* show only during window [a,b) of the cycle, with soft edges */
  function show(dur, a, b, ph, extra) {
    return mv(dur, function (t) { var o = min(1, min((t - a) / 0.04, (b - t) / 0.04)); o = max(0, o); var v = extra ? extra(t) : {}; v.o = o; return v; }, { d: ph, n: 28 });
  }
  /* travel from (x0,y0) to (x1,y1) over the cycle, fading in/out at the ends */
  function trav(dur, x0, y0, x1, y1, ph, fade) {
    return mv(dur, function (t) { return { x: lerp(x0, x1, t), y: lerp(y0, y1, t), o: fade === false ? 1 : min(1, min(t / 0.08, (1 - t) / 0.08)) }; }, { d: ph, n: 8 });
  }
  /* sample a parametric path P(t)->[x,y] */
  function along(dur, P, ph, o) {
    o = o || {};
    return mv(dur, function (t) { var p = P(t); var v = { x: p[0], y: p[1] }; if (o.fade) v.o = min(1, min(t / 0.06, (1 - t) / 0.06)); if (o.rot) v.r = o.rot(t); return v; }, { d: ph, n: o.n || 32 });
  }

  /* ---------- svg primitives ---------- */
  function G(x, y, inner, st) { return '<g transform="translate(' + r1(x) + ' ' + r1(y) + ')"><g' + (st ? ' style="' + st + '"' : '') + '>' + inner + '</g></g>'; }
  function C(cx, cy, r, c, st) { return '<circle cx="' + r1(cx) + '" cy="' + r1(cy) + '" r="' + r + '"' + (c ? ' class="' + c + '"' : '') + (st ? ' style="' + st + '"' : '') + '/>'; }
  function E(cx, cy, rx, ry, c, st) { return '<ellipse cx="' + r1(cx) + '" cy="' + r1(cy) + '" rx="' + rx + '" ry="' + ry + '"' + (c ? ' class="' + c + '"' : '') + (st ? ' style="' + st + '"' : '') + '/>'; }
  function L(x1, y1, x2, y2, c, st) { return '<line x1="' + r1(x1) + '" y1="' + r1(y1) + '" x2="' + r1(x2) + '" y2="' + r1(y2) + '"' + (c ? ' class="' + c + '"' : '') + (st ? ' style="' + st + '"' : '') + '/>'; }
  function R(x, y, w, h, c, st, rx) { return '<rect x="' + r1(x) + '" y="' + r1(y) + '" width="' + r1(w) + '" height="' + r1(h) + '"' + (rx ? ' rx="' + rx + '"' : '') + (c ? ' class="' + c + '"' : '') + (st ? ' style="' + st + '"' : '') + '/>'; }
  function P(d, c, st) { return '<path d="' + d + '"' + (c ? ' class="' + c + '"' : '') + (st ? ' style="' + st + '"' : '') + '/>'; }
  function T(x, y, s, c, st) { return '<text x="' + r1(x) + '" y="' + r1(y) + '"' + (c ? ' class="' + c + '"' : '') + (st ? ' style="' + st + '"' : '') + '>' + s + '</text>'; }
  function poly(pts, close) { var d = ''; for (var i = 0; i < pts.length; i++) d += (i ? 'L' : 'M') + r1(pts[i][0]) + ',' + r1(pts[i][1]); return d + (close ? 'Z' : ''); }
  function curve(fn, t0, t1, n) { var d = ''; for (var i = 0; i <= n; i++) { var p = fn(t0 + (t1 - t0) * i / n); d += (i ? 'L' : 'M') + r1(p[0]) + ',' + r1(p[1]); } return d; }
  function arrowHead(x, y, ang, s, c) { return G(x, y, P('M0,0L' + (-8 * s) + ',' + (-4 * s) + 'L' + (-8 * s) + ',' + (4 * s) + 'Z', c || 'fc'), 'transform:rotate(' + r1(ang) + 'deg)'); }
  /* arrow drawn from (0,0) along +x, length len (use inside G + rotate/scale animations) */
  function arrow(len, c, st) { return L(0, 0, len - 5, 0, 's' + c, st) + P('M' + len + ',0L' + (len - 9) + ',-4.5L' + (len - 9) + ',4.5Z', 'f' + c); }
  function rotG(a, inner) { return '<g transform="rotate(' + r1(a) + ')">' + inner + '</g>'; }
  function axes(x0, y0, w, h, lx, ly) {
    return L(x0, y0, x0 + w, y0, 'sw', 'stroke-width:1.4;opacity:.5') + L(x0, y0, x0, y0 - h, 'sw', 'stroke-width:1.4;opacity:.5') +
      (lx ? T(x0 + w + 2, y0 + 10, lx, 'tx sm') : '') + (ly ? T(x0 - 4, y0 - h - 4, ly, 'tx sm') : '');
  }
  function ground(y, x0, x1) {
    var s = L(x0 == null ? 6 : x0, y, x1 == null ? 234 : x1, y, 'sw', 'stroke-width:1.6;opacity:.55');
    for (var i = (x0 == null ? 6 : x0); i < (x1 == null ? 234 : x1); i += 8) s += L(i, y, i - 4, y + 5, 'sw', 'stroke-width:1;opacity:.22');
    return s;
  }
  /* soft sine path, wl in px, drawn from x0..x1 */
  function sine(x0, x1, y0, amp, wl, ph, st) { var d = ''; st = st || 3; for (var x = x0; x <= x1 + .01; x += st) d += (d ? 'L' : 'M') + r1(x) + ',' + r1(y0 - amp * sin(TAU * (x - x0) / wl + (ph || 0))); return d; }
  var cidN = 0;
  function clip(id, inner) { return '<defs><clipPath id="' + id + '">' + inner + '</clipPath></defs>'; }
  function uid(k) { return 'sxc' + (++cidN) + k; }
  function bead(x, y, r, c, st) { return C(x, y, r, c, st); }
  /* spring along +x from 0..len with n coils (use inside G + scaleX anim) */
  function spring(len, n, amp, c) { var d = 'M0,0'; var seg = len / (n * 2 + 2); d += 'L' + r1(seg) + ',0'; for (var i = 0; i < n * 2; i++) d += 'L' + r1(seg * (i + 1.5)) + ',' + (i % 2 ? amp : -amp); d += 'L' + r1(len - seg) + ',0L' + len + ',0'; return P(d, (c || 'sa') + ' nf', 'stroke-width:1.8'); }

  var SC = {};      /* scenes by simulation id */
  var HUE_TXT = '';
  /* =====================================================================================
     PHYSICS
     ===================================================================================== */

  /* ---- ch1 · measurement ---- */
  SC['lab-slide-calipers'] = function () {
    var s = R(10, 80, 220, 12, 'fg', '', 2) + L(10, 80, 230, 80, 'sw', 'opacity:.5;stroke-width:1.4');
    for (var i = 0; i <= 44; i++) s += L(14 + i * 5, 80, 14 + i * 5, i % 5 ? 85 : 90, 'sw', 'opacity:.5;stroke-width:1');
    s += R(86, 48, 34, 32, 'fb', 'opacity:.35', 4) + R(86, 48, 34, 32, 'sb nf', 'stroke-dasharray:3 3;stroke-width:1.3', 4);
    s += R(40, 26, 7, 54, 'fa', '', 2) + R(40, 22, 40, 6, 'fa', '', 2);                                   /* fixed jaw */
    s += G(0, 0, R(120, 36, 7, 44, 'fa', '', 2) + R(120, 30, 70, 14, 'fa', 'opacity:.9', 3) + L(124, 44, 124, 52, 'sw', 'opacity:.8') + T(160, 41, '12.4', 'tx sm', 'fill:#0a1020'), osc(4, 5, 'x'));
    return s;
  };
  SC['lab-screw-gauge'] = function () {
    var s = R(30, 54, 76, 14, 'fg', '', 2) + P('M150,86 L150,36 Q150,22 126,22 L52,22 L52,34', 'sa nf', 'stroke-width:5');
    s += R(46, 34, 12, 38, 'fa', '', 3);                                                                 /* anvil */
    s += C(88, 61, 9, 'fc') + C(85, 58, 3, 'fw', 'opacity:.7');
    s += G(0, 0, R(100, 54, 36, 14, 'fb', '', 2) + R(136, 46, 54, 30, 'fa', '', 6), osc(3.6, 4, 'x'));
    for (var i = 0; i < 6; i++) s += G(168, 61, L(0, -15, 0, -9, 'sw', 'opacity:.7'), mv(2.4, function (t) { return { r: 60 * i * 0 }; }) + '');
    s += G(170, 61, L(-4, -13, 4, -13, 'sw', 'stroke-width:2.2;opacity:.8') + L(-4, 13, 4, 13, 'sw', 'stroke-width:2.2;opacity:.8') + C(0, 0, 2.5, 'fw'), spin(2.4));
    s += P('M200,50 a14,14 0 1,1 -2,22', 'sc nf', 'stroke-width:2;stroke-dasharray:3 3;opacity:.7') + arrowHead(197, 72, 118, .8, 'fc');
    return s;
  };
  SC['measurement-uncertainty'] = function () {
    var s = L(20, 92, 220, 92, 'sw', 'opacity:.55;stroke-width:1.5'), tv = 118;
    for (var i = 0; i <= 10; i++) s += L(20 + i * 20, 92, 20 + i * 20, i % 5 ? 97 : 101, 'sw', 'opacity:.5');
    s += L(tv, 20, tv, 92, 'sc', 'stroke-dasharray:3 4;stroke-width:1.4;opacity:.8') + T(tv, 14, 'true', 'tx sm', 'fill:var(--c)');
    var xs = [92, 108, 124, 136, 114, 128, 100];
    xs.forEach(function (x, k) { s += G(x, 0, C(0, 80 - (k % 3) * 11 - 6, 5, k % 2 ? 'fa' : 'fb'), mv(3.2, function (t) { var u = ramp(t, k * 0.07, k * 0.07 + 0.2); return { y: -50 * (1 - u), o: u }; }, { n: 24 })); });
    s += G(tv, 66, L(-30, 0, 30, 0, 'sc', 'stroke-width:2.6') + L(-30, -5, -30, 5, 'sc') + L(30, -5, 30, 5, 'sc'), mv(3.2, function (t) { return { sx: 0.5 + 0.5 * hc(t * 2), o: 0.5 + 0.5 * bump(t, 0.7, 0.4) }; }, { n: 24 }));
    s += T(204, 34, '±Δx', 'tx', 'fill:var(--c)');
    return s;
  };
  SC['dimensional-analysis'] = function () {
    var s = T(120, 26, '[F] = ?', 'tx big', 'fill:#fff;opacity:.9');
    var tiles = [['M', 34, 'fa'], ['L', 0, 'fb'], ['T⁻²', -34, 'fc']];
    s += R(120 - 86, 58, 172, 36, 'sw nf', 'stroke-dasharray:4 4;stroke-width:1.3;opacity:.4', 8);
    tiles.forEach(function (tl, i) {
      var tx = 120 - 56 + i * 56;
      s += G(tx, 76, R(-18, -15, 36, 30, tl[2], 'opacity:.95', 8) + T(0, 6, tl[0], 'tx', 'fill:#0a1020;font-size:15px'),
        mv(4, function (t) { var u = ramp(t, 0.05 + i * 0.1, 0.4 + i * 0.1), o = 1 - ramp(t, 0.9, 0.99); var a = (1 - u) * (1 + i * 0.5); return { x: (i - 1) * -50 * a, y: -42 * (1 - u) + 4 * sin(TAU * t * 2 + i), r: 30 * (1 - u) * (i - 1), o: max(0.0, o) * min(1, 0.2 + u) }; }, { n: 32 }));
    });
    s += G(120, 40, P('M-9,0 l6,7 l12,-14', 'sc nf', 'stroke-width:3.2'), mv(4, function (t) { return { s: ramp(t, 0.5, 0.62) * (1 + 0.25 * bump(t, 0.62, 0.08)), o: ramp(t, 0.5, 0.6) * (1 - ramp(t, 0.9, 0.99)) }; }, { n: 28 }));
    return s;
  };
  SC['unit-conversion-lab'] = function () {
    var s = '';
    s += R(26, 30, 188, 16, 'fa', 'opacity:.85', 4) + T(120, 42, '1 km', 'tx', 'fill:#0a1020');
    for (var i = 0; i < 20; i++) s += R(26 + i * 9.4, 66, 8.2, 16, i % 2 ? 'fb' : 'fc', 'opacity:.85', 2);
    s += T(120, 96, '1000 m', 'tx sm', 'opacity:.8') + T(120, 22, 'km → m', 'tx sm', 'fill:var(--c)');
    s += G(120, 56, P('M-10,-6 l0,12 M-10,6 l-4,-5 m4,5 l4,-5 M10,6 l0,-12 M10,-6 l-4,5 m4,-5 l4,5', 'sw nf', 'stroke-width:2'), mv(3, function (t) { return { r: 180 * ramp(t, 0.1, 0.5) + 180 * ramp(t, 0.6, 1) }; }, { n: 24 }));
    s += G(0, 0, R(26, 62, 188, 24, 'sc nf', 'stroke-width:1.4;opacity:.7', 5), blink(3, 0, 0.1, 0.9));
    return s;
  };

  /* ---- ch2 · vectors ---- */
  SC['river-boat'] = function () {
    var s = R(0, 22, 240, 78, 'fa', 'opacity:.12') + L(0, 22, 240, 22, 'sw', 'opacity:.4') + L(0, 100, 240, 100, 'sw', 'opacity:.4');
    for (var i = 0; i < 5; i++) s += G(0, 34 + i * 14, L(0, 0, 18, 0, 'sa', 'stroke-width:1.6;opacity:.55') + L(120, 3, 138, 3, 'sa', 'stroke-width:1.4;opacity:.4'), mv(2.4 + i * 0.3, function (t) { return { x: 240 * t - 20 }; }, { d: i * 0.21, n: 4 }));
    s += G(0, 0, '<g transform="translate(60 92)"><g>' + P('M-12,0 L-8,-8 L12,-8 L16,0 Z', 'fc') + R(-2, -16, 2, 8, 'sw') + '</g></g>', mv(5, function (t) { return { x: 100 * t, y: -60 * t, o: min(1, min(t / 0.1, (1 - t) / 0.1)) }; }, { n: 12 }));
    s += G(60, 92, L(0, 0, 0, -50, 'sb', 'stroke-width:2.2;opacity:.8') + P('M0,-56 l-4,9 h8z', 'fb'), blink(5, 0, .5, 1));
    s += G(60, 92, arrow(48, 'a', 'stroke-width:2.4;opacity:.85'), pulse(5, .9, 1.06));
    s += G(60, 92, P('M0,0 L100,-60', 'sc nf', 'stroke-dasharray:4 4;stroke-width:1.8;opacity:.8'), blink(5, 0, .5, 1));
    return s;
  };
  SC['hsc-math-vectors'] = function () {
    var s = axes(24, 100, 190, 84, '', '');
    s += G(40, 100, arrow(70, 'a', 'stroke-width:3') , '');
    s += G(0, 0, G(110, 100, rotG(-52, arrow(64, 'b', 'stroke-width:3')), ''), mv(4, function (t) { var u = ramp(t, 0.1, 0.45); return { x: -70 * (1 - u), y: 0, o: 0.5 + 0.5 * u }; }, { n: 24 }));
    s += G(40, 100, L(0, 0, 0 + 0, 0, 'sc'), '');
    s += G(0, 0, '<path d="M40,100 L110,100 L150,49" class="sc nf" style="stroke-width:3.2;stroke-dasharray:4 4"/>' + L(40, 100, 150, 49, 'sc', 'stroke-width:3.6') + P('M152,48 l-10,2 l4,8z', 'fc'), mv(4, function (t) { return { o: ramp(t, 0.45, 0.58) * (1 - ramp(t, 0.9, 0.99)) }; }, { n: 28 }));
    s += T(76, 92, 'A', 'tx', 'fill:var(--a)') + T(148, 82, 'B', 'tx', 'fill:var(--b)') + T(88, 66, 'R', 'tx', 'fill:var(--c)');
    return s;
  };
  SC['hsc-math-vector-products'] = function () {
    var ox = 54, oy = 92;
    var s = G(ox, oy, arrow(110, 'a', 'stroke-width:3'), '');
    s += G(ox, oy, '<g>' + P('M0,0 L70,0 L70,0 Z', '') + '</g>', '');
    s += G(ox, oy, arrow(78, 'b', 'stroke-width:3'), mv(5, function (t) { var a = -(20 + 56 * hc(t)); return { r: a }; }, { n: 32 }));
    /* projection (dot) shadow */
    s += G(ox, oy + 8, R(0, -2, 60, 4, 'fc', 'opacity:.9', 2), mv(5, function (t) { var a = (20 + 56 * hc(t)) * PI / 180; return { sx: max(0.05, cos(a)) * 1.0 + 0.02, sy: 1 }; }, { n: 32 }));
    s += T(100, 112, 'a·b', 'tx sm', 'fill:var(--c)');
    /* parallelogram (cross) */
    s += G(ox, oy, P('M0,0 L110,0 L110,0 L0,0Z', '') , '');
    s += G(176, 86, P('M0,0 L34,0 L52,-30 L18,-30Z', 'fb', 'opacity:.45') + P('M0,0 L34,0 L52,-30 L18,-30Z', 'sb nf', 'stroke-width:2'), mv(5, function (t) { return { sy: 0.25 + 0.75 * hc(t), sx: 1 }; }, { n: 24 }));
    s += T(198, 106, 'a×b', 'tx sm', 'fill:var(--b)');
    return s;
  };
  SC['vector-components-lab'] = function () {
    var ox = 60, oy = 92, len = 70;
    var s = axes(ox - 24, oy, 190, 80, 'x', 'y');
    s += G(ox, oy, arrow(len, 'a', 'stroke-width:3.2'), mv(6, function (t) { return { r: -(15 + 60 * hc(t)) }; }, { n: 32 }));
    s += G(ox, oy, L(0, 0, len, 0, 'sc', 'stroke-width:3;opacity:.95'), mv(6, function (t) { return { sx: cos((15 + 60 * hc(t)) * PI / 180), sy: 1 }; }, { n: 32 }));
    s += G(ox, oy, L(0, 0, 0, -len, 'sb', 'stroke-width:3;opacity:.95'), mv(6, function (t) { return { sx: 1, sy: sin((15 + 60 * hc(t)) * PI / 180) }; }, { n: 32 }));
    s += G(ox, oy, L(0, 0, 0, -len, 'sw', 'stroke-width:1.2;stroke-dasharray:3 3;opacity:.5'), mv(6, function (t) { var a = (15 + 60 * hc(t)) * PI / 180; return { x: len * cos(a), sy: sin(a), sx: 1 }; }, { n: 32 }));
    s += G(ox, oy, L(0, 0, len, 0, 'sw', 'stroke-width:1.2;stroke-dasharray:3 3;opacity:.5'), mv(6, function (t) { var a = (15 + 60 * hc(t)) * PI / 180; return { y: -len * sin(a), sx: cos(a), sy: 1 }; }, { n: 32 }));
    s += T(ox + len + 12, oy - 8, 'Vₓ', 'tx sm', 'fill:var(--c)') + T(ox - 10, oy - len - 4, 'V_y', 'tx sm', 'fill:var(--b)');
    return s;
  };
  SC['vector-equilibrium-lab'] = function () {
    var cx = 120, cy = 62, s = '';
    s += P('M' + (cx + 50) + ',' + cy + ' L' + (cx - 25) + ',' + (cy - 43) + ' L' + (cx - 25) + ',' + (cy + 43) + 'Z', 'sw nf', 'stroke-width:1.3;stroke-dasharray:4 4;opacity:.35');
    s += G(cx, cy, [0, 120, 240].map(function (a, i) { return rotG(a + 0, arrow(52, ['a', 'b', 'c'][i], 'stroke-width:3')); }).join(''), osc(7, 14, 'r'));
    s += G(cx, cy, C(0, 0, 9, 'fw') + C(0, 0, 14, 'sw nf', 'opacity:.4;stroke-width:1.5'), pulse(2.4, 0.9, 1.2));
    s += G(cx, cy, T(0, 4, 'ΣF=0', 'tx sm', 'fill:#0a1020;font-size:7px'), '');
    return s;
  };

  /* ---- ch3 · kinematics ---- */
  SC['tiger-deer'] = function () {
    var s = ground(98) + L(0, 96, 240, 96, 'sw', 'opacity:0');
    var deer = function () { return E(0, -16, 15, 8, 'fb') + L(11, -20, 18, -30, 'sb', 'stroke-width:2.4') + C(19, -31, 4.4, 'fb') + P('M20,-35 l-3,-9 m3,9 l4,-8 m-4,0', 'sc nf', 'stroke-width:1.6') + L(-8, -9, -9, 0, 'sb', 'stroke-width:2.4') + L(8, -9, 10, 0, 'sb', 'stroke-width:2.4'); };
    var tiger = function () { return E(0, -15, 19, 9, 'fc') + P('M-8,-22 v13 M0,-24 v15 M8,-22 v13', 'sd nf', 'stroke-width:2.2') + C(23, -21, 6, 'fc') + P('M19,-26 l2,-5 l3,4', 'fc') + L(-14, -9, -16, 0, 'sc', 'stroke-width:3') + L(12, -9, 15, 0, 'sc', 'stroke-width:3') + P('M-19,-16 q-8,-6 -12,2', 'sc nf', 'stroke-width:2.4'); };
    s += G(0, 98, deer(), mv(4, function (t) { return { x: 96 + 105 * t, y: -2 * abs(sin(TAU * t * 7)), o: min(1, min(t / .06, (1 - t) / .06)) }; }, { n: 40 }));
    s += G(0, 98, tiger(), mv(4, function (t) { return { x: 20 + 170 * sm(t * 1.0 + .0) , y: -3 * abs(sin(TAU * t * 7 + 1)), o: min(1, min(t / .06, (1 - t) / .06)) }; }, { n: 40 }));
    s += G(0, 0, L(0, 26, 0, 26, 'sw') , '');
    s += G(120, 24, T(0, 0, 'v₂ > v₁', 'tx sm', 'fill:var(--c)'), blink(2, 0, .5, 1));
    return s;
  };
  SC['bus-train-motion'] = function () {
    var s = L(0, 48, 240, 48, 'sw', 'opacity:.5;stroke-width:1.5') + L(0, 100, 240, 100, 'sw', 'opacity:.5;stroke-width:1.5');
    for (var i = 0; i < 24; i++) s += L(i * 11, 48, i * 11, 51, 'sw', 'opacity:.3');
    var train = R(0, -24, 84, 22, 'fb', '', 5) + [0, 1, 2, 3].map(function (k) { return R(8 + k * 19, -19, 12, 8, 'fd', 'opacity:.55', 2); }).join('') + C(14, 0, 4, 'fw') + C(68, 0, 4, 'fw');
    s += G(0, 46, train + G(84, -12, arrow(26, 'c', 'stroke-width:2.2'), ''), mv(3.6, function (t) { return { x: -90 + 340 * t }; }, { n: 4 }));
    var bus = R(0, -22, 46, 20, 'fa', '', 5) + R(5, -18, 9, 8, 'fd', 'opacity:.55', 2) + R(18, -18, 9, 8, 'fd', 'opacity:.55', 2) + R(31, -18, 9, 8, 'fd', 'opacity:.55', 2) + C(10, 0, 4, 'fw') + C(36, 0, 4, 'fw');
    s += G(0, 98, bus + G(46, -11, arrow(16, 'c', 'stroke-width:2.2'), ''), mv(3.6, function (t) { return { x: -50 + 300 * t * 0.65 + 0 }; }, { n: 4, d: .0 }));
    s += G(120, 74, T(0, 0, 'v_rel', 'tx sm', 'fill:var(--c)') + P('M-18,6 h36 m-6,-4 l6,4 l-6,4', 'sc nf', 'stroke-width:1.6'), blink(2.4, 0, .4, 1));
    return s;
  };
  SC['free-fall-lab'] = function () {
    var s = L(70, 8, 70, 108, 'sw', 'opacity:.3;stroke-width:1.2');
    for (var i = 0; i <= 10; i++) s += L(70, 10 + i * 9.5, i % 5 ? 77 : 84, 10 + i * 9.5, 'sw', 'opacity:.5');
    [0, .25, .5, .75, 1].forEach(function (u) { s += C(104, 14 + 86 * u * u, 6, 'fb', 'opacity:.18'); });
    s += G(104, 0, C(0, 0, 8, 'fa') + C(-2.5, -3, 2.6, 'fw', 'opacity:.7'), mv(3, function (t) { var u = min(1, t / .8); return { y: 14 + 86 * u * u, o: 1 - ramp(t, 0.92, 1) }; }, { n: 28 }));
    s += G(104 + 16, 0, arrow(26, 'c', 'stroke-width:2.4'), mv(3, function (t) { var u = min(1, t / .8); return { y: 14 + 86 * u * u, r: 90, o: 1 - ramp(t, 0.92, 1) }; }, { n: 28 }));
    s += L(150, 104, 220, 104, 'sw', 'opacity:.4') + T(186, 94, 'g = 9.8', 'tx sm', 'fill:var(--c)');
    s += G(0, 0, curve(function (t) { return [150 + 68 * t, 104 - 62 * t * t / 1]; }, 0, 1, 20).replace(/^/, '<path d="').replace(/$/, '" class="sc nf" style="stroke-width:2.2;stroke-dasharray:1;stroke-dashoffset:1"/>'), '');
    return s;
  };
  SC['hsc-phy-falling-object'] = function () {
    var s = L(14, 106, 226, 106, 'sw', 'opacity:.5;stroke-width:1.5');
    s += G(70, 0, C(0, 0, 11, 'fa') + C(-3, -4, 3, 'fw', 'opacity:.7'), mv(3.2, function (t) { var u = min(1, t / .78); return { y: 14 + 80 * u * u, o: 1 - ramp(t, 0.9, 1) }; }, { n: 28 }));
    s += G(112, 0, C(0, 0, 5.5, 'fb'), mv(3.2, function (t) { var u = min(1, t / .78); return { y: 14 + 86 * u * u, o: 1 - ramp(t, 0.9, 1) }; }, { n: 28 }));
    s += G(0, 0, '', '') + axes(150, 100, 74, 74, 't', 'v');
    s += '<path d="M150,100 L220,34" class="sc nf" pathLength="1" style="stroke-width:2.6;stroke-dasharray:1"/>';
    s += G(0, 0, C(0, 0, 4, 'fc'), mv(3.2, function (t) { var u = min(1, t / .78); return { x: 150 + 70 * u, y: 100 - 66 * u, o: 1 - ramp(t, .9, 1) }; }, { n: 12 }));
    s += T(70, 118, 'm = 5', 'tx sm', 'opacity:.7') + T(112, 118, 'm = 1', 'tx sm', 'opacity:.7');
    return s;
  };

  /* ---- ch4 · projectile ---- */
  function proj(o) {
    o = o || {};
    var x0 = o.x0 == null ? 24 : o.x0, gy = o.gy || 98, W = o.W || 150, H = o.H || 60, s = ground(gy);
    var path = function (t) { return [x0 + W * t, gy - 4 * H * t * (1 - t)]; };
    s += P(curve(path, 0, 1, 28), 'sw nf', 'stroke-width:1.4;stroke-dasharray:3 4;opacity:.45');
    return { s: s, path: path, x0: x0, gy: gy, W: W, H: H };
  }
  SC['hsc-phy-projectile'] = function () {
    var p = proj({ W: 160, H: 62 }), s = p.s, T0 = 4;
    s += G(0, 0, C(0, 0, 5.5, 'fa') + G(0, 0, arrow(26, 'c', 'stroke-width:2.4'), ''), along(T0, p.path, 0, { n: 36 }));
    s += G(0, 0, G(0, 0, arrow(30, 'b', 'stroke-width:2.4'), mv(T0, function (t) { return { r: 0 }; }, { n: 2 })), along(T0, p.path, 0, { n: 36 }));
    s += G(0, 0, G(0, 0, L(0, 0, 0, 1, 'sc') , ''), '');
    s += G(0, 0, G(0, 0, '<g style="transform:rotate(90deg)">' + arrow(28, 'c', 'stroke-width:2.4;opacity:.9') + '</g>', mv(T0, function (t) { return { sy: 0, sx: 1 }; }, { n: 2 }) ), '');
    /* vy arrow with changing length / direction */
    s += G(0, 0, '<g style="animation:none">' + '</g>', '');
    s += G(0, 0, G(0, 0, arrow(1, 'c', ''), ''), '');
    s += G(0, 0, '', '');
    s += G(0, 0, G(0, 0, '<g style="transform:rotate(90deg)">' + arrow(30, 'c', 'stroke-width:2.6') + '</g>', mv(T0, function (t) { var vy = 1 - 2 * t; return { sx: 1, sy: vy }; }, { n: 24 })), along(T0, p.path, 0, { n: 36 }));
    s += T(p.x0 + 30, 22, 'vₓ = const', 'tx sm', 'fill:var(--b)');
    return s;
  };
  SC['hsc-phy-drop-vs-projectile'] = function () {
    var s = '', gy = 106, T0 = 3.4;
    s += ground(gy) + L(92, 20, 92, gy, 'sw', 'opacity:.2;stroke-dasharray:2 4');
    [.25, .5, .75].forEach(function (u) { s += L(24, 20 + (gy - 28) * u * u, 224, 20 + (gy - 28) * u * u, 'sw', 'opacity:.18;stroke-dasharray:2 5'); });
    var fall = function (t) { var u = min(1, t / .85); return 20 + (gy - 26 - 20) * u * u; };
    s += G(0, 0, C(0, 0, 6.5, 'fb') + C(-2, -2, 2, 'fw', 'opacity:.7'), mv(T0, function (t) { return { x: 92, y: fall(t), o: 1 - ramp(t, .93, 1) }; }, { n: 32 }));
    s += G(0, 0, C(0, 0, 6.5, 'fa') + C(-2, -2, 2, 'fw', 'opacity:.7'), mv(T0, function (t) { var u = min(1, t / .85); return { x: 28 + 170 * u, y: fall(t), o: 1 - ramp(t, .93, 1) }; }, { n: 32 }));
    s += G(0, 0, L(0, 0, 0, 0, 'sw'), '') + T(60, 14, 'same time', 'tx sm', 'fill:var(--c)');
    s += G(28, 20, R(-8, -6, 16, 12, 'fk', '', 3) + L(8, 0, 16, 0, 'sw', 'opacity:.7;stroke-width:3'), '');
    return s;
  };
  SC['sim-projectile-range-studio'] = function () {
    var p = proj({ W: 150, H: 56, x0: 28 }), s = p.s, T0 = 4;
    s += L(p.x0 + p.W / 2, p.gy - p.H, p.x0 + p.W / 2, p.gy, 'sc', 'stroke-dasharray:3 3;stroke-width:1.3;opacity:.7') + T(p.x0 + p.W / 2 + 14, p.gy - p.H / 2 + 3, 'H', 'tx sm', 'fill:var(--c)');
    s += L(p.x0, p.gy + 8, p.x0 + p.W, p.gy + 8, 'sc', 'stroke-width:1.6;opacity:.85') + L(p.x0, p.gy + 4, p.x0, p.gy + 12, 'sc') + L(p.x0 + p.W, p.gy + 4, p.x0 + p.W, p.gy + 12, 'sc') + T(p.x0 + p.W / 2, p.gy + 20, 'R', 'tx sm', 'fill:var(--c)');
    s += G(p.x0, p.gy, R(-9, -5, 18, 10, 'fk', '', 3) + R(2, -4, 16, 5, 'fa', '', 2), '') ;
    s += G(0, 0, C(0, 0, 5.5, 'fa') + C(0, 0, 9, 'sa nf', 'opacity:.3'), along(T0, p.path, 0, { n: 36 }));
    s += G(p.x0 + p.W, p.gy, C(0, 0, 4, 'fc') + C(0, 0, 4, 'sc nf', 'stroke-width:2'), mv(T0, function (t) { return { s: 1 + 2.6 * bump(t, .95, .08), o: .4 + .6 * bump(t, .96, .2) }; }, { n: 28 }));
    s += G(p.x0 + p.W / 2, p.gy - p.H, C(0, 0, 3.4, 'fc'), mv(T0, function (t) { return { s: 1 + 2 * bump(t, .5, .08), o: .4 + .6 * bump(t, .5, .2) }; }, { n: 28 }));
    return s;
  };
  SC['sim-projectile-angle-lab'] = function () {
    var gy = 100, x0 = 26, s = ground(gy), T0 = 5;
    var angs = [[30, 'fa', 0], [45, 'fc', 0.33], [60, 'fb', 0.66]];
    angs.forEach(function (a) {
      var th = a[0] * PI / 180, Rg = 190 * sin(2 * th), Hm = 190 * sin(th) * sin(th) / 2;
      var pth = function (t) { return [x0 + Rg * t, gy - 4 * Hm * t * (1 - t)]; };
      s += P(curve(pth, 0, 1, 22), 'sw nf', 'stroke-width:1.3;stroke-dasharray:3 4;opacity:.4');
      s += G(0, 0, C(0, 0, 4.6, a[1]) + C(0, 0, 8, 'sw nf', 'opacity:.18'), mv(T0, function (t) { var u = ramp(t, 0, .6) ; var q = min(1, (t) / .6); var p2 = pth(q); return { x: p2[0], y: p2[1], o: q >= 1 ? 1 - ramp(t, .8, .95) : 1 }; }, { n: 30, d: a[2] }));
    });
    s += G(x0, gy, '<g>' + R(-9, -5, 16, 10, 'fk', '', 3) + '</g>' + G(0, -2, R(0, -2.5, 20, 5, 'fw', 'opacity:.9', 2), osc(5, 10, 'r')), '');
    s += T(190, 40, '45° → max R', 'tx sm', 'fill:var(--c);text-anchor:end');
    return s;
  };

  /* ---- ch5 · Newtonian mechanics ---- */
  SC['inclined-plane-friction'] = function () {
    var a = 28 * PI / 180, bx = 30, by = 100, Lh = 170, ex = bx + Lh * cos(a), ey = by - Lh * sin(a);
    var s = P('M' + bx + ',' + by + ' L' + (bx + Lh * cos(a)) + ',' + by + ' L' + bx + ',' + by + 'Z', '') + P('M' + bx + ',' + by + ' L' + ex + ',' + ey + ' L' + ex + ',' + by + 'Z', 'fa', 'opacity:.22') + P('M' + bx + ',' + by + ' L' + ex + ',' + ey, 'sa nf', 'stroke-width:3');
    s += P('M' + (bx + 34) + ',' + by + ' a34,34 0 0,0 ' + (-0) + ',0', '');
    /* block sliding down-slope along the incline direction, with friction + weight arrows */
    var blk = R(-13, -22, 26, 22, 'fc', '', 3) + G(0, -11, arrow(32, 'b', 'stroke-width:2.2'), 'transform:rotate(' + (180 + deg(a)) + 'deg)') + G(0, -11, '<g style="transform:rotate(90deg)">' + arrow(26, 'k', 'stroke-width:2.2') + '</g>', '');
    s += G(ex, ey, '<g transform="rotate(' + r1(deg(a)) + ')">' + '<g>' + R(-16, -22, 26, 22, 'fc', '', 3) + G(-3, -11, '<g transform="rotate(180)">' + arrow(30, 'b', 'stroke-width:2.4') + '</g>', '') + '</g></g>',
      mv(4, function (t) { var u = ramp(t, .08, .9); return { x: (bx - ex) * u * u * 0.9 + 0, y: (by - ey) * u * u * 0.9, o: min(1, t / .06) * (1 - ramp(t, .93, 1)) }; }, { n: 28 }));
    s += T(188, 112, 'f = μN', 'tx sm', 'fill:var(--b)');
    return s;
  };
  function bank(o) {
    var s = '', th = (o.th || 20) * PI / 180;
    var x0 = 30, x1 = 210, y0 = 100, rise = (x1 - x0) * Math.tan(th);
    s += P('M' + x0 + ',' + y0 + ' L' + x1 + ',' + (y0 - rise) + ' L' + x1 + ',' + y0 + 'Z', 'fa', 'opacity:.2') + L(x0, y0, x1, y0 - rise, 'sa', 'stroke-width:3');
    return { s: s, th: th, x0: x0, x1: x1, y0: y0, rise: rise };
  }
  SC['road-banking'] = function () {
    var b = bank({ th: 18 }), s = b.s;
    var cx = 120, cy = b.y0 - (120 - b.x0) * Math.tan(b.th);
    var car = '<g transform="rotate(' + r1(-18) + ')">' + R(-18, -20, 36, 14, 'fc', '', 4) + R(-10, -27, 20, 9, 'fb', '', 3) + C(-10, -4, 5, 'fw') + C(10, -4, 5, 'fw') + '</g>';
    s += G(cx, cy, car, osc(2.2, 1.6, 'y'));
    s += G(cx, cy - 12, '<g transform="rotate(-108)">' + arrow(34, 'a', 'stroke-width:2.4') + '</g>', pulse(2.2, .92, 1.1));
    s += G(cx, cy - 12, '<g transform="rotate(90)">' + arrow(32, 'k', 'stroke-width:2.4') + '</g>', '');
    s += G(cx, cy - 12, '<g transform="rotate(180)">' + arrow(30, 'c', 'stroke-width:2.2') + '</g>', blink(2.2, 0, .45, 1));
    s += G(0, 0, P('M214,96 a22,22 0 0,0 -22,-22', 'sc nf', 'stroke-width:1.6;stroke-dasharray:3 3;opacity:.8'), '');
    s += T(206, 104, 'θ', 'tx', 'fill:var(--c)');
    return s;
  };
  SC['cycle-banking'] = function () {
    var cx = 100, cy = 64, s = E(cx, cy, 70, 34, 'sw nf', 'stroke-width:1.4;stroke-dasharray:4 5;opacity:.4') + E(cx, cy, 52, 24, 'sa nf', 'stroke-width:1;opacity:.25');
    s += G(cx, cy, G(70, 0, R(-3, -14, 6, 24, 'fc', '', 3) + C(0, -16, 4.2, 'fb') + L(0, 10, 0, 16, 'sw'), mv(5, function (t) { return { r: -24 }; }, { n: 2 })), mv(5, function (t) { var a = TAU * t; return { x: 0, y: 0, r: 0 }; }, { n: 2 }));
    var pos = function (t) { var a = TAU * t; return [cx + 70 * cos(a), cy + 34 * sin(a)]; };
    s += G(0, 0, '<g transform="rotate(-18)">' + R(-3, -16, 6, 24, 'fc', '', 3) + C(0, -19, 4.4, 'fb') + L(-9, 8, 9, 8, 'sw', 'opacity:.8;stroke-width:2.4') + '</g>', mv(5, function (t) { var p = pos(t); return { x: p[0], y: p[1] }; }, { n: 40 }));
    s += G(200, 60, T(0, 0, 'lean θ', 'tx sm', 'fill:var(--c)') + P('M-8,10 l0,-22 M-8,10 l14,-10', 'sc nf', 'stroke-width:1.6'), pulse(2.5, .94, 1.08));
    s += G(cx, cy, C(0, 0, 3, 'fw', 'opacity:.8') + L(0, 0, 0, 0, 'sw'), '');
    return s;
  };
  SC['motorcycle-banking'] = function () {
    var s = ground(104, 16, 224);
    var bike = '<g transform="translate(0 0)">' + E(0, -22, 5, 22, 'fg', 'opacity:1') + E(0, -22, 5, 22, 'sw nf', 'stroke-width:2.4') + R(-9, -52, 18, 26, 'fa', '', 6) + C(0, -64, 7, 'fb') + L(-14, -50, 14, -50, 'sw', 'stroke-width:3') + '</g>';
    s += G(120, 104, bike, mv(4, function (t) { return { r: -26 * sin(TAU * t) }; }, { n: 24 }));
    s += G(120, 104, C(0, 0, 4, 'fc') + C(0, 0, 11, 'sc nf', 'stroke-width:1.6'), mv(4, function (t) { return { s: 0.7 + 0.8 * abs(sin(TAU * t)), o: .25 + .75 * abs(sin(TAU * t)) }; }, { n: 24 }));
    s += R(186, 30, 10, 54, 'fg', '', 3) + G(191, 84, R(-5, -54, 10, 54, 'fc', 'transform-origin:0 0', 3), mv(4, function (t) { return { sy: 0.1 + 0.9 * abs(sin(TAU * t)) }; }, { n: 24 }));
    s += T(191, 100, 'grip', 'tx sm', 'fill:var(--c)');
    return s;
  };
  SC['newtonian-mechanics-lab'] = function () {
    var s = '';
    s += G(120, 60, P('M-9,16 L0,-14 L9,16 L0,8Z', 'fw', '') + P('M-9,16 L0,26 L9,16', 'fc', 'opacity:.9') + R(-4, -4, 8, 12, 'fa', '', 2), mv(3, function (t) { return { y: -46 * ramp(t, .1, .55) * (1 - ramp(t, .75, .75)) - 4 * ramp(t, .55, 1) }; }, { n: 30 }));
    s += G(120, 98, '', '');
    for (var i = 0; i < 6; i++) s += G(120 + (i % 2 ? 6 : -6), 90, C(0, 0, 3 + (i % 3), i % 2 ? 'fc' : 'fb'), mv(1.2, function (t) { return { y: 24 * t, x: (i % 2 ? 1 : -1) * 8 * t, o: 1 - t }; }, { d: i * .17, n: 6 }));
    s += G(120, 36, '<g transform="rotate(-90)">' + arrow(0.1, 'a', '') + '</g>', '');
    s += T(54, 40, 'Action', 'tx sm', 'fill:var(--b)') + T(186, 92, 'Reaction', 'tx sm', 'fill:var(--c)');
    s += G(60, 100, '<g transform="rotate(90)">' + arrow(34, 'b', 'stroke-width:2.6') + '</g>', blink(3, 0, .35, 1)) + G(180, 20, '<g transform="rotate(-90)">' + arrow(34, 'c', 'stroke-width:2.6') + '</g>', blink(3, .5, .35, 1));
    s += L(160, 100, 206, 100, 'sw', 'opacity:.4');
    return s;
  };
  SC['hsc-phy-newton'] = function () {
    var s = L(10, 52, 230, 52, 'sw', 'opacity:.4') + L(10, 100, 230, 100, 'sw', 'opacity:.4'), T0 = 3.6;
    var row = function (y, m, c, k) {
      var w = 14 + m * 8;
      return G(0, y, R(0, -w * .7, w, w * .7, c, '', 3) + G(w, -w * .35, arrow(30, 'w', 'stroke-width:2.4;opacity:.9'), ''), mv(T0, function (t) { var u = ramp(t, .06, .9); return { x: 12 + (190 - w) * u * u * k, o: 1 - ramp(t, .93, 1) }; }, { n: 24 }));
    };
    s += row(50, 1, 'fa', 1) + row(98, 3, 'fb', 0.45);
    s += T(30, 18, 'm', 'tx sm', 'fill:var(--a)') + T(30, 66, '3m', 'tx sm', 'fill:var(--b)') + T(160, 18, 'a = F/m', 'tx', 'fill:var(--c)');
    return s;
  };
  SC['hsc-phy-circular-motion'] = function () {
    var cx = 120, cy = 62, R0 = 40, s = C(cx, cy, R0, 'sw nf', 'stroke-width:1.3;stroke-dasharray:4 5;opacity:.4');
    s += C(cx, cy, 4, 'fw');
    s += G(cx, cy, L(0, 0, R0 - 6, 0, 'sw', 'opacity:.55;stroke-width:1.4') + G(R0, 0, C(0, 0, 8, 'fa') + '<g transform="rotate(180)">' + arrow(26, 'c', 'stroke-width:2.6') + '</g>' + '<g transform="rotate(-90)">' + arrow(30, 'b', 'stroke-width:2.6') + '</g>', ''), spin(3.2));
    s += T(cx, cy + 4, 'F_c', 'tx sm', 'fill:var(--c)');
    s += T(200, 28, 'v', 'tx', 'fill:var(--b)');
    return s;
  };
  SC['free-body-builder'] = function () {
    var cx = 120, cy = 62, T0 = 6, s = '';
    s += R(cx - 20, cy - 14, 40, 28, 'fa', 'opacity:.95', 5) + T(cx, cy + 5, 'm', 'tx', 'fill:#0a1020');
    var f = function (ang, len, c, k) { return G(cx, cy, '<g transform="rotate(' + ang + ')">' + L(22, 0, 22, 0, 'sw') + G(22, 0, arrow(len, c, 'stroke-width:2.8'), '') + '</g>', show(T0, k * .12 + .03, .86, 0)); };
    s += f(-90, 34, 'b', 1) + f(90, 34, 'c', 0) + f(0, 38, 'w', 2) + f(180, 26, 'k', 3);
    s += G(cx, cy, P('M0,0 L40,0', 'sc nf', 'stroke-width:4;stroke-dasharray:5 3'), mv(T0, function (t) { return { o: ramp(t, .6, .72) * (1 - ramp(t, .9, .98)), sx: 0.8 + .4 * bump(t, .72, .1) }; }, { n: 28 }));
    s += T(cx + 66, cy - 22, 'ΣF', 'tx', 'fill:var(--c)');
    return s;
  };
  SC['pulley-system-lab'] = function () {
    var px = 120, py = 24, s = '';
    s += R(px - 3, 0, 6, 14, 'fg', '') + G(px, py, C(0, 0, 14, 'fg') + C(0, 0, 14, 'sw nf', 'stroke-width:2.2') + L(-11, 0, 11, 0, 'sw', 'opacity:.7') + L(0, -11, 0, 11, 'sw', 'opacity:.7') + C(0, 0, 3, 'fw'), osc(4, 40, 'r'));
    var fnA = function (t) { return 22 * sin(TAU * t); };
    s += G(px - 14, py, R(-1, 0, 2, 54, 'fw', 'opacity:.8;transform-origin:0 0'), mv(4, function (t) { return { sy: (54 + fnA(t)) / 54 }; }, { n: 24 }));
    s += G(px + 14, py, R(-1, 0, 2, 54, 'fw', 'opacity:.8'), mv(4, function (t) { return { sy: (54 - fnA(t)) / 54 }; }, { n: 24 }));
    s += G(px - 14, py + 54, R(-14, 0, 28, 24, 'fa', '', 4) + T(0, 17, '2m', 'tx sm', 'fill:#0a1020'), mv(4, function (t) { return { y: fnA(t) }; }, { n: 24 }));
    s += G(px + 14, py + 54, R(-10, 0, 20, 18, 'fc', '', 4) + T(0, 13, 'm', 'tx sm', 'fill:#0a1020'), mv(4, function (t) { return { y: -fnA(t) }; }, { n: 24 }));
    return s;
  };
  SC['elevator-weight-lab'] = function () {
    var s = R(78, 8, 84, 104, 'sw nf', 'stroke-width:1.3;stroke-dasharray:4 4;opacity:.3', 6), T0 = 5;
    var fn = function (t) { return 26 * sin(TAU * t); };
    s += G(120, 60, R(-30, -34, 60, 68, 'fb', 'opacity:.18', 5) + R(-30, -34, 60, 68, 'sb nf', 'stroke-width:2.2', 5) + G(0, 34, C(0, -21, 5, 'fc') + R(-4, -17, 8, 14, 'fc', '', 3) + L(-3, -3, -3, 6, 'sc', 'stroke-width:2.4') + L(3, -3, 3, 6, 'sc', 'stroke-width:2.4'), ''), mv(T0, function (t) { return { y: fn(t) * .55 }; }, { n: 30 }));
    s += G(204, 70, '<path d="M-24,0 a24,24 0 0,1 48,0" class="sw nf" style="stroke-width:2.4;opacity:.6"/>' + G(0, 0, L(0, 0, 0, -20, 'sc', 'stroke-width:2.8') + C(0, 0, 3, 'fw'), mv(T0, function (t) { return { r: -60 * cos(TAU * t) * -1 * -1 * 0.9 }; }, { n: 30 })), '');
    s += G(36, 60, '<g transform="rotate(-90)">' + arrow(30, 'c', 'stroke-width:2.6') + '</g>', mv(T0, function (t) { return { sy: 1 + 0.5 * cos(TAU * t) }; }, { n: 30 }));
    s += T(36, 100, 'a', 'tx sm', 'fill:var(--c)') + T(204, 90, 'N', 'tx sm', 'fill:var(--c)');
    return s;
  };
  SC['collision-momentum-lab'] = function () {
    var px = [70, 95, 120, 145, 170], s = L(54, 18, 186, 18, 'sw', 'stroke-width:3;opacity:.6'), T0 = 2.6;
    px.forEach(function (x, i) {
      var inner = L(0, 0, 0, 62, 'sw', 'opacity:.55;stroke-width:1.2') + C(0, 62, 11, i === 0 || i === 4 ? 'fa' : 'fb') + C(-3, 58, 3, 'fw', 'opacity:.6');
      var st = '';
      if (i === 0) st = mv(T0, function (t) { return { r: 36 * max(0, sin(TAU * t)) * 0 + (t < .5 ? -38 * sin(PI * t * 2) : 0) }; }, { n: 28 });
      if (i === 4) st = mv(T0, function (t) { return { r: t >= .5 ? 38 * sin(PI * (t - .5) * 2) : 0 }; }, { n: 28 });
      s += G(x, 18, inner, st);
    });
    s += T(120, 112, 'p = mv', 'tx sm', 'fill:var(--c)');
    return s;
  };
  SC['vertical-circle-lab'] = function () {
    var cx = 120, cy = 62, R0 = 38, T0 = 4, s = C(cx, cy, R0, 'sw nf', 'stroke-width:1.4;stroke-dasharray:4 5;opacity:.4') + C(cx, cy, 3, 'fw');
    var pos = function (t) { var a = TAU * t + PI / 2; return [R0 * cos(a), R0 * sin(a)]; }; /* t=0 at bottom */
    s += G(cx, cy, L(0, 0, 0, 0, 'sw'), '');
    s += G(cx, cy, C(0, 0, 8, 'fa'), along(T0, pos, 0, { n: 40 }));
    s += G(cx, cy, '<g>' + L(0, 0, 0, 0, 'sw') + '</g>', '');
    /* string + tension arrow pointing to centre; its length is largest at the bottom */
    s += G(cx, cy, L(0, 0, R0, 0, 'sw', 'opacity:.55;stroke-width:1.4') + G(R0, 0, '<g transform="rotate(180)">' + arrow(30, 'c', 'stroke-width:2.6') + '</g>', mv(T0, function (t) { return { sx: 0.35 + 0.65 * (0.5 + 0.5 * cos(TAU * t)) }; }, { n: 32 })), mv(T0, function (t) { return { r: deg(TAU * t + PI / 2) }; }, { n: 40 }));
    s += T(cx, cy + 4, 'T', 'tx sm', 'fill:var(--c)') + T(cx, cy + R0 + 18, 'v max', 'tx sm', 'opacity:.7');
    return s;
  };
  SC['hsc-phy-gun-bullet-recoil'] = function () {
    var s = ground(98, 10, 230), T0 = 3;
    s += G(120, 98, R(-30, -22, 52, 14, 'fa', '', 4) + R(22, -18, 30, 6, 'fb', '', 2) + P('M-18,-8 l-6,22 h12 l2,-14', 'fa', 'opacity:.9'), mv(T0, function (t) { var u = ramp(t, .22, .42); return { x: -16 * u * (1 - ramp(t, .85, .95)) , o: 1 }; }, { n: 28 }));
    s += G(0, 0, C(0, 0, 3.6, 'fc'), mv(T0, function (t) { var u = ramp(t, .22, .9); return { x: 168 + 66 * u, y: 80, o: t < .22 ? 0 : (1 - ramp(t, .9, 1)) }; }, { n: 28 }));
    s += G(170, 80, P('M0,0 L14,-8 L10,0 L14,8Z', 'fc'), mv(T0, function (t) { return { s: 2.2 * bump(t, .22, .08), o: bump(t, .22, .08) }; }, { n: 28 }));
    s += G(120, 24, R(-40, 0, 40, 8, 'fb', 'transform-origin:0 0', 3), mv(T0, function (t) { return { sx: ramp(t, .22, .3) * (1 - ramp(t, .9, .98)) }; }, { n: 28 })) + G(120, 24, R(0, 0, 40, 8, 'fc', '', 3), mv(T0, function (t) { return { sx: ramp(t, .22, .3) * (1 - ramp(t, .9, .98)) }; }, { n: 28 }));
    s += T(86, 20, 'M·V', 'tx sm', 'fill:var(--b);text-anchor:end') + T(160, 20, 'm·v', 'tx sm', 'fill:var(--c);text-anchor:start');
    return s;
  };
  SC['moment-inertia-explorer'] = function () {
    var s = '';
    var disc = C(0, 0, 22, 'fa', 'opacity:.9') + L(0, 0, 22, 0, 'sw', 'stroke-width:2.4') + C(0, 0, 3, 'fd');
    var ring = C(0, 0, 22, 'sb nf', 'stroke-width:5') + L(-22, 0, 22, 0, 'sb', 'stroke-width:2') + L(0, -22, 0, 22, 'sb', 'stroke-width:2');
    var rod = R(-28, -3, 56, 6, 'fc', '', 3) + C(0, 0, 3, 'fd');
    s += G(44, 56, disc, spin(2.2)) + G(120, 56, ring, spin(3.6)) + G(196, 56, rod, spin(5.4));
    s += T(44, 100, 'I = ½MR²', 'tx sm', 'fill:var(--a)') + T(120, 100, 'I = MR²', 'tx sm', 'fill:var(--b)') + T(196, 100, 'I = ML²/12', 'tx sm', 'fill:var(--c)');
    return s;
  };
  SC['sim-newton-force-bench'] = function () {
    var s = L(10, 76, 230, 76, 'sw', 'opacity:.5;stroke-width:1.5'), T0 = 4.2;
    var xs = [0, 1, 2, 3, 4, 5, 6].map(function (k) { return 30 + k * k * 4.6; });
    xs.forEach(function (x, k) { s += G(x, 94, C(0, 0, 3, 'fc'), show(T0, k * .1 + .04, .96, 0)); });
    s += L(24, 94, 226, 94, 'sw', 'opacity:.15;stroke-dasharray:2 4');
    s += G(0, 76, R(0, -22, 34, 22, 'fa', '', 3) + C(8, 0, 4, 'fw') + C(26, 0, 4, 'fw') + R(8, -30, 18, 8, 'fb', '', 2) + G(34, -11, arrow(24, 'c', 'stroke-width:2.4'), ''), mv(T0, function (t) { var u = t * t; return { x: 24 + 140 * u, o: 1 - ramp(t, .93, 1) }; }, { n: 30 }));
    s += T(150, 24, 'a ∝ F/m', 'tx', 'fill:var(--c)');
    return s;
  };
  SC['sim-friction-workshop'] = function () {
    var s = L(10, 82, 230, 82, 'sw', 'opacity:.5;stroke-width:1.6'), T0 = 5;
    for (var i = 0; i < 26; i++) s += P('M' + (10 + i * 8.6) + ',82 l2,4 l2,-4', 'sw nf', 'opacity:.35;stroke-width:1.2');
    var step = function (t) { var u = ramp(t, .35, .55); return u; };
    s += G(0, 82, R(0, -26, 36, 26, 'fa', '', 4) + G(36, -13, arrow(1, 'c', ''), '') , mv(T0, function (t) { var u = ramp(t, .4, .95); return { x: 40 + 100 * u * u, y: 0, o: 1 - ramp(t, .96, 1) }; }, { n: 32 }));
    s += G(0, 82, G(0, -13, '<g transform="rotate(180)">' + arrow(30, 'b', 'stroke-width:2.6') + '</g>', ''), mv(T0, function (t) { var u = ramp(t, .4, .95); return { x: 40 + 100 * u * u, o: 1 - ramp(t, .96, 1) }; }, { n: 32 }));
    s += G(0, 82, G(0, -13, arrow(1, 'c', ''), ''), '');
    s += G(0, 82, G(0, -13, arrow(46, 'c', 'stroke-width:2.8'), mv(T0, function (t) { return { sx: 0.05 + 0.95 * ramp(t, 0, .4) }; }, { n: 24 })), mv(T0, function (t) { var u = ramp(t, .4, .95); return { x: 76 + 100 * u * u, o: 1 - ramp(t, .96, 1) }; }, { n: 32 }));
    s += R(30, 14, 70, 8, 'fg', '', 4) + G(30, 14, R(0, 0, 70, 8, 'fk', 'transform-origin:0 0', 4), mv(T0, function (t) { return { sx: ramp(t, 0, .4) }; }, { n: 24 }));
    s += T(150, 44, 'f_s → f_k', 'tx sm', 'fill:var(--c)');
    return s;
  };
  SC['sim-momentum-collision'] = function () {
    var s = L(10, 82, 230, 82, 'sw', 'opacity:.5;stroke-width:1.5'), T0 = 4;
    var hit = .42;
    var cartA = R(-15, -22, 30, 22, 'fa', '', 4) + C(-8, 0, 4, 'fw') + C(8, 0, 4, 'fw') + G(15, -11, arrow(1, 'c', ''), '');
    s += G(0, 82, cartA + G(0, -11, arrow(30, 'c', 'stroke-width:2.4'), mv(T0, function (t) { return { sx: t < hit ? 1 : 0.5, o: 1 }; }, { n: 2 })), mv(T0, function (t) { var x = t < hit ? 30 + 66 * (t / hit) : 96 + 40 * ((t - hit) / (1 - hit)); return { x: x, o: 1 - ramp(t, .95, 1) }; }, { n: 40 }));
    s += G(0, 82, R(-15, -22, 30, 22, 'fb', '', 4) + C(-8, 0, 4, 'fw') + C(8, 0, 4, 'fw') + G(15, -11, arrow(24, 'c', 'stroke-width:2.4'), blink(T0, 0, 1, 1)), mv(T0, function (t) { var x = t < hit ? 126 : 126 + 78 * ((t - hit) / (1 - hit)); return { x: x, o: 1 - ramp(t, .95, 1) }; }, { n: 40 }));
    s += G(111, 70, P('M0,-12 L3,-3 L12,0 L3,3 L0,12 L-3,3 L-12,0 L-3,-3Z', 'fc'), mv(T0, function (t) { return { s: 1.6 * bump(t, hit, .06), o: bump(t, hit, .06) }; }, { n: 30 }));
    s += T(120, 22, 'p₁ = p₂', 'tx', 'fill:var(--c)');
    return s;
  };
  SC['sim-torque-wrench'] = function () {
    var cx = 90, cy = 60, s = '';
    s += P(poly([[0, -12], [10, -6], [10, 6], [0, 12], [-10, 6], [-10, -6]], true), 'fg', 'transform:translate(' + cx + 'px,' + cy + 'px)');
    s += G(cx, cy, P(poly([[0, -12], [10, -6], [10, 6], [0, 12], [-10, 6], [-10, -6]], true), 'fb', 'opacity:.9') + C(0, 0, 3, 'fd'), spin(5));
    s += G(cx, cy, '<g>' + R(0, -4, 112, 8, 'fa', '', 4) + C(0, 0, 11, 'fa') + C(0, 0, 6, 'fd', 'opacity:.6') + '</g>', osc(3, 18, 'r'));
    s += G(cx, cy, '<g>' + G(104, 0, '<g transform="rotate(-90)">' + arrow(34, 'c', 'stroke-width:2.8') + '</g>', '') + L(0, 18, 104, 18, 'sw', 'opacity:.6;stroke-dasharray:3 3') + T(52, 32, 'r', 'tx sm', 'fill:var(--c)') + '</g>', osc(3, 18, 'r'));
    s += P('M' + (cx + 22) + ',' + cy + ' a22,22 0 0,1 0,0', '') + T(200, 100, 'τ = r × F', 'tx', 'fill:var(--c);text-anchor:end');
    return s;
  };

  /* ---- ch6 · work, energy & power ---- */
  SC['spring-energy-lab'] = function () {
    var s = R(14, 28, 6, 62, 'fw', 'opacity:.55', 2) + ground(92, 14, 226), T0 = 3;
    var fn = function (t) { return 24 * sin(TAU * t); };
    s += G(20, 60, spring(80, 7, 9, 'sa'), mv(T0, function (t) { return { sx: (80 + fn(t)) / 80 }; }, { n: 28 }));
    s += G(100, 92, R(0, -34, 36, 34, 'fc', '', 5) + C(8, 0, 0.1, 'fw'), mv(T0, function (t) { return { x: fn(t) }; }, { n: 28 }));
    s += R(150, 26, 66, 12, 'fg', '', 6) + G(150, 26, R(0, 0, 66, 12, 'fb', 'transform-origin:0 0', 6), mv(T0, function (t) { return { sx: 0.1 + 0.9 * pow(abs(sin(TAU * t)), 2) }; }, { n: 28 }));
    s += T(183, 54, 'U = ½kx²', 'tx sm', 'fill:var(--b)');
    return s;
  };
  SC['sim-work-energy-lab'] = function () {
    var T0 = 5, hill = function (x) { return 90 - 56 * (0.5 + 0.5 * cos(PI * (x - 20) / 100)) * (x < 120 ? 1 : 0) - (x >= 120 ? 56 * (0.5 - 0.5 * cos(PI * (x - 120) / 100)) * 0 : 0); };
    var track = function (t) { var x = 20 + 120 * t; var y = 90 - 58 * (0.5 + 0.5 * cos(TAU * t)); return [x, y]; };
    var s = P(curve(track, 0, 1, 40), 'sa nf', 'stroke-width:3;opacity:.8');
    s += G(0, 0, C(0, -7, 7, 'fc') + C(-2, -9, 2, 'fw', 'opacity:.7'), along(T0, track, 0, { n: 40 }));
    var bars = [['PE', 'fb', 170, function (t) { return 0.5 + 0.5 * cos(TAU * t); }], ['KE', 'fc', 200, function (t) { return 0.5 - 0.5 * cos(TAU * t); }]];
    bars.forEach(function (b) { s += R(b[2] - 9, 30, 18, 64, 'fg', '', 4) + G(b[2], 94, R(-9, -64, 18, 64, b[1], 'transform-origin:0 0;opacity:.95', 4), mv(T0, function (t) { return { sy: 0.06 + 0.94 * b[3](t) }; }, { n: 32 })) + T(b[2], 108, b[0], 'tx sm', 'opacity:.85'); });
    return s;
  };
  SC['sim-spring-energy-bench'] = function () {
    var s = axes(30, 98, 120, 80, 'x', 'F'), T0 = 4;
    s += L(30, 98, 140, 24, 'sa', 'stroke-width:2.6');
    s += G(30, 98, P('M0,0 L110,0 L110,-74Z', 'fb', 'opacity:.4 ;transform-origin:0 0'), mv(T0, function (t) { var u = 0.1 + 0.9 * hc(t); return { sx: u, sy: u }; }, { n: 28 }));
    s += G(30, 98, C(0, 0, 5, 'fc'), mv(T0, function (t) { var u = 0.1 + 0.9 * hc(t); return { x: 110 * u, y: -74 * u }; }, { n: 28 }));
    s += G(168, 40, spring(60, 6, 7, 'sc'), mv(T0, function (t) { return { sx: 0.4 + 0.6 * (0.1 + 0.9 * hc(t)) }; }, { n: 28 }));
    s += T(196, 84, 'W = ½kx²', 'tx sm', 'fill:var(--c)');
    return s;
  };

  /* ---- ch7 · gravitation ---- */
  SC['gravity-profile-lab'] = function () {
    var cx = 62, cy = 62, Rr = 34, T0 = 6;
    var s = C(cx, cy, Rr, 'fa', 'opacity:.25') + C(cx, cy, Rr, 'sa nf', 'stroke-width:2.2') + C(cx, cy, Rr * 0.4, 'fb', 'opacity:.3');
    s += G(cx, cy, C(0, 0, 4.5, 'fc') + C(0, 0, 9, 'sc nf', 'opacity:.4'), mv(T0, function (t) { var r = (0.5 + 0.5 * -cos(TAU * t)) * 2.2 - 0.2; r = max(0, r); return { y: -(r * Rr) , x: 0 }; }, { n: 36 }));
    s += axes(120, 100, 108, 76, 'r', 'g');
    var g = function (r) { return r < 1 ? r : 1 / (r * r); };
    s += P(curve(function (u) { var r = u * 3; return [120 + 108 * u, 100 - 64 * g(r)]; }, 0, 1, 40), 'sb nf', 'stroke-width:2.4');
    s += L(120 + 108 / 3, 100, 120 + 108 / 3, 36, 'sw', 'opacity:.3;stroke-dasharray:3 3') + T(120 + 108 / 3, 112, 'R', 'tx sm');
    s += G(120, 100, C(0, 0, 4, 'fc'), mv(T0, function (t) { var r = max(0, (0.5 + 0.5 * -cos(TAU * t)) * 2.2 - 0.2) ; var u = min(1, r / 3 * 1.0 + 0) ; var rr = r; return { x: 108 * (rr / 3), y: -64 * g(rr) }; }, { n: 36 }));
    return s;
  };
  SC['gravitational-potential-lab'] = function () {
    var T0 = 5, s = '';
    var Vf = function (x) { var r = max(0.18, abs(x - 60) / 120 * 3.4 + 0.18); return -1 / r; };
    var path = function (u) { var x = 20 + 200 * u; var yv = 20 + 70 * (1 - (-Vf(x) ) / 5.5 * 1); return [x, 100 - 70 * (-Vf(x) < 5.5 ? (1 - (-Vf(x)) / 5.6) : 0)]; };
    var pf = function (u) { var x = 20 + 200 * u, r = max(0.2, abs(x - 120) / 40); var v = -1 / r; return [x, 28 - 18 * v - 0 ]; };
    var d = curve(function (u) { var p = pf(u); return [p[0], min(106, p[1])]; }, 0, 1, 60);
    s += P(d, 'sb nf', 'stroke-width:2.6') + P(d + ' L220,112 L20,112Z', 'fb', 'opacity:.12');
    s += G(120, 78, C(0, 0, 10, 'fa') + C(0, 0, 16, 'sa nf', 'opacity:.3'), pulse(2.5, .9, 1.1));
    s += G(0, 0, C(0, 0, 5, 'fc'), mv(T0, function (t) { var u = 0.5 + 0.36 * sin(TAU * t) ; var p = pf(u); return { x: p[0], y: min(104, p[1]) - 6 }; }, { n: 40 }));
    s += T(32, 22, 'U = −GMm/r', 'tx sm', 'fill:var(--c);text-anchor:start');
    return s;
  };
  SC['satellite-orbit-lab'] = function () {
    var cx = 120, cy = 62, s = C(cx, cy, 15, 'fb') + C(cx, cy, 15, 'sw nf', 'opacity:.3') + C(cx - 5, cy - 5, 4, 'fw', 'opacity:.35');
    s += E(cx, cy, 52, 52, 'sw nf', 'stroke-dasharray:3 5;stroke-width:1.2;opacity:.4') + E(cx, cy, 32, 32, 'sw nf', 'stroke-dasharray:3 5;stroke-width:1.2;opacity:.4');
    s += G(cx, cy, G(52, 0, R(-5, -3, 10, 6, 'fa', '', 1) + R(-12, -1.5, 7, 3, 'fc') + R(5, -1.5, 7, 3, 'fc') + G(0, 0, '<g transform="rotate(-90)">' + arrow(20, 'c', 'stroke-width:2') + '</g>', ''), ''), spin(6));
    s += G(cx, cy, G(32, 0, C(0, 0, 4, 'fk'), ''), spin(3, .3));
    s += T(204, 108, 'v = √(GM/r)', 'tx sm', 'fill:var(--c);text-anchor:end');
    return s;
  };
  SC['escape-velocity-lab'] = function () {
    var cx = 38, cy = 100, s = '<path d="M-8,100 a46,46 0 0,1 92,0" class="fb" style="opacity:.35"/>' + P('M-8,100 a46,46 0 0,1 92,0', 'sb nf', 'stroke-width:2.4'), T0 = 5;
    var back = function (t) { var u = min(1, t / .8); return [cx + 6 + 28 * u, cy - 52 - 0 - (60 * 4 * u * (1 - u)) + 52]; };
    s += P(curve(function (u) { return [cx + 6 + 28 * u, 56 - 62 * 4 * u * (1 - u) + 52 - 52 + 12]; }, 0, 1, 20), 'sw nf', 'stroke-dasharray:3 4;opacity:.3;stroke-width:1.2');
    s += E(120, 56, 70, 42, 'sw nf', 'stroke-dasharray:3 4;opacity:.3;stroke-width:1.2');
    s += G(0, 0, C(0, 0, 4.2, 'fa'), mv(T0, function (t) { var u = min(1, t / .9); return { x: cx + 6 + 28 * u, y: 56 - 62 * 4 * u * (1 - u) + 12, o: 1 - ramp(t, .93, 1) }; }, { n: 32 }));
    s += G(120, 56, G(0, 0, C(0, 0, 0, 'fw'), ''), '') + G(120, 56, G(70, 0, C(0, 0, 4.2, 'fc'), ''), spin(5, .1));
    s += G(0, 0, C(0, 0, 4.2, 'fk') + G(0, 0, '<g transform="rotate(0)">' + L(-12, 0, -4, 0, 'sw', 'opacity:.6') + '</g>', ''), mv(T0, function (t) { var x = cx + 10 + 190 * t * t, y = 90 - 74 * t; return { x: x, y: y, o: min(1, t / .1) * (1 - ramp(t, .85, 1)) }; }, { n: 30 }));
    s += T(204, 108, 'v_e = √(2GM/R)', 'tx sm', 'fill:var(--c);text-anchor:end');
    return s;
  };
  SC['sim-gravity-altitude'] = function () {
    var s = '<path d="M-30,126 Q120,94 270,126 Z" class="fb" style="opacity:.55"/>' + P('M-30,126 Q120,94 270,126', 'sb nf', 'stroke-width:2.4'), T0 = 5;
    for (var i = 1; i <= 4; i++) s += L(30, 100 - i * 20, 38, 100 - i * 20, 'sw', 'opacity:.45');
    s += G(88, 0, R(-5, -20, 10, 26, 'fw', '', 5) + P('M-5,-20 L0,-32 L5,-20Z', 'fk') + P('M-5,2 L-10,10 L-5,6Z M5,2 L10,10 L5,6Z', 'fa'), mv(T0, function (t) { var u = t < .5 ? t / .5 : (1 - t) / .5; return { y: 94 - 70 * sm(u) }; }, { n: 32 }));
    s += G(88, 0, P('M-3,8 q3,14 6,0z', 'fc'), mv(T0, function (t) { var u = t < .5 ? t / .5 : (1 - t) / .5; return { y: 94 - 70 * sm(u), s: 0.7 + 0.5 * abs(sin(TAU * t * 8)), sx: 1 }; }, { n: 40 }));
    s += R(168, 20, 18, 80, 'fg', '', 5) + G(177, 100, R(-9, -80, 18, 80, 'fc', 'transform-origin:0 0', 5), mv(T0, function (t) { var u = t < .5 ? t / .5 : (1 - t) / .5; return { sy: 1 - 0.8 * sm(u) }; }, { n: 32 }));
    s += T(177, 114, 'g', 'tx sm', 'fill:var(--c)') + T(208, 60, 'h ↑', 'tx sm', 'opacity:.7');
    return s;
  };

  /* ---- ch8 · properties of matter ---- */
  SC['elasticity-hooke-lab'] = function () {
    var T0 = 5, fn = function (t) { return 0.5 - 0.5 * cos(TAU * t); };
    var s = R(24, 14, 44, 6, 'fg', '', 3) + G(46, 20, R(-1.5, 0, 3, 50, 'sw', 'transform-origin:0 0;opacity:.85'), mv(T0, function (t) { return { sy: 1 + 0.5 * fn(t) }; }, { n: 28 }));
    s += G(46, 70, R(-11, 0, 22, 16, 'fc', '', 3) + T(0, 12, 'W', 'tx sm', 'fill:#0a1020'), mv(T0, function (t) { return { y: 25 * fn(t) }; }, { n: 28 }));
    s += axes(106, 100, 118, 82, 'ε', 'σ');
    var d = 'M106,100 L158,52 Q176,38 196,42 L216,50';
    s += P(d, 'sb nf', 'stroke-width:2.6;stroke-dasharray:1;stroke-dashoffset:0" pathLength="1');
    s += G(106, 100, C(0, 0, 4.6, 'fc') + C(0, 0, 9, 'sc nf', 'opacity:.4'), mv(T0, function (t) { var u = ramp(t, 0, .62), p = u < .6 ? [52 * u / .6, -48 * u / .6] : [52 + 58 * (u - .6) / .4, -48 - 6 * sin(PI * (u - .6) / .4) + 0]; if (u >= .6) { var q = (u - .6) / .4; p = [52 + 58 * q, -48 - 12 * sin(PI * q * .9) + 4 * q]; } return { x: p[0], y: p[1], o: 1 - ramp(t, .95, 1) }; }, { n: 36 }));
    s += T(158, 112, 'Hooke', 'tx sm', 'fill:var(--c)');
    return s;
  };
  SC['hydraulic-press-lab'] = function () {
    var T0 = 4, fn = function (t) { return sin(TAU * t); };
    var s = P('M44,60 L44,98 L196,98 L196,50', 'sw nf', 'stroke-width:2.6;opacity:.6') + R(46, 74, 148, 22, 'fa', 'opacity:.4');
    s += G(60, 0, R(-9, 0, 18, 3, 'fa', '') + R(-2, -26, 4, 26, 'sw', 'opacity:.8'), mv(T0, function (t) { return { y: 58 + 14 * fn(t) }; }, { n: 28 }));
    s += G(60, 0, '<g transform="rotate(90)">' + arrow(26, 'c', 'stroke-width:2.6') + '</g>', mv(T0, function (t) { return { y: 18 + 14 * fn(t) }; }, { n: 28 }));
    s += G(168, 0, R(-26, 0, 52, 5, 'fb', '') + R(-4, -30, 8, 30, 'sw', 'opacity:.8') + R(-20, -48, 40, 18, 'fc', '', 3), mv(T0, function (t) { return { y: 62 - 5.4 * fn(t) }; }, { n: 28 }));
    s += T(60, 114, 'F₁/A₁', 'tx sm', 'fill:var(--a)') + T(168, 114, 'F₂/A₂', 'tx sm', 'fill:var(--b)');
    return s;
  };
  SC['torricelli-outflow-lab'] = function () {
    var T0 = 5, s = P('M52,20 L52,102 L128,102 L128,20', 'sw nf', 'stroke-width:2.6;opacity:.7');
    s += G(52, 102, R(0, -76, 76, 76, 'fb', 'transform-origin:0 0;opacity:.45'), mv(T0, function (t) { return { sy: 0.45 + 0.55 * (1 - t) }; }, { n: 12 }));
    s += R(124, 86, 8, 8, 'fd', '', 2);
    var jet = function (u) { return [130 + 80 * u, 90 + 20 * u * u * 4.4 - 0]; };
    s += P(curve(function (u) { return [130 + 82 * u, 90 + 34 * u * u]; }, 0, 1, 14), 'sb nf', 'stroke-width:3;opacity:.4');
    s += P(curve(function (u) { return [130 + 82 * u, 90 + 34 * u * u]; }, 0, 1, 14), 'sa nf', 'stroke-width:2.4;stroke-dasharray:3 6');
    s += G(0, 0, '', '') + T(90, 14, 'v = √(2gh)', 'tx sm', 'fill:var(--c)');
    s += G(78, 0, '', '');
    return s;
  };
  SC['sim-liquid-pressure-tank'] = function () {
    var T0 = 5, s = P('M60,16 L60,104 L170,104 L170,16', 'sw nf', 'stroke-width:2.6;opacity:.7') + R(61, 30, 108, 73, 'fb', 'opacity:.3');
    s += P('M171,32 L171,104 L214,104Z', 'fa', 'opacity:.2') ;
    [0, 1, 2, 3].forEach(function (i) { var y = 40 + i * 18; s += G(172, y, '<g>' + arrow(14 + i * 10, 'a', 'stroke-width:2.2') + '</g>', pulse(1.8, .88, 1.08, i * .15)); });
    s += G(115, 0, L(0, 0, 0, 0, 'sw') + C(0, 0, 6, 'fc') + C(0, 0, 10, 'sc nf', 'opacity:.4') + L(0, -4, 0, -60, 'sw', 'opacity:.5;stroke-width:1.2'), mv(T0, function (t) { return { y: 40 + 50 * hc(t) }; }, { n: 24 }));
    s += T(115, 24, 'P = ρgh', 'tx sm', 'fill:var(--c)');
    s += G(115, 28, P('M-50,0 q12,-4 25,0 t25,0 t25,0 t25,0', 'sc nf', 'stroke-width:2'), osc(2, 6, 'x'));
    return s;
  };
  SC['sim-buoyancy-dock'] = function () {
    var T0 = 3.6, wy = 50;
    var s = R(0, wy, 240, 70, 'fb', 'opacity:.3') + G(0, wy, P('M-20,0 q10,-5 20,0 t20,0 t20,0 t20,0 t20,0 t20,0 t20,0 t20,0 t20,0 t20,0 t20,0 t20,0 t20,0', 'sa nf', 'stroke-width:2.4;opacity:.9'), mv(2.6, function (t) { return { x: -40 * t }; }, { n: 4 }));
    s += G(50, wy, R(-16, -14, 32, 26, 'fc', '', 4) + T(0, 5, 'wood', 'tx sm', 'fill:#0a1020;font-size:7px'), mv(T0, function (t) { return { y: 3 * sin(TAU * t), r: 4 * sin(TAU * t + 1) }; }, { n: 20 }));
    s += G(120, wy, R(-14, -4, 28, 26, 'fw', 'opacity:.9', 4) + T(0, 15, 'oil', 'tx sm', 'fill:#0a1020;font-size:7px'), mv(T0, function (t) { return { y: 6 + 3 * sin(TAU * t + 2) }; }, { n: 20 }));
    s += G(190, wy, C(0, 0, 13, 'fk') + T(0, 4, 'Fe', 'tx sm', 'fill:#0a1020;font-size:8px'), mv(T0, function (t) { return { y: 24 + 18 * hc(t) }; }, { n: 20 }));
    s += G(50, wy + 30, '<g transform="rotate(-90)">' + arrow(24, 'b', 'stroke-width:2.4') + '</g>', pulse(1.8, .8, 1.1)) + G(190, wy + 70, '<g transform="rotate(-90)">' + arrow(14, 'b', 'stroke-width:2.4') + '</g>', '');
    s += T(120, 20, 'F_b = ρ V g', 'tx sm', 'fill:var(--c)');
    return s;
  };
  SC['sim-bernoulli-pipe'] = function () {
    var T0 = 4, s = P('M10,30 L80,30 Q100,30 110,46 L130,46 Q140,30 160,30 L230,30', 'sw nf', 'stroke-width:2.6;opacity:.7');
    s += P('M10,94 L80,94 Q100,94 110,78 L130,78 Q140,94 160,94 L230,94', 'sw nf', 'stroke-width:2.6;opacity:.7') + R(11, 31, 218, 62, 'fb', 'opacity:.1');
    var xp = function (t) { return t < .33 ? 10 + 100 * (t / .33) * 0.9 * 0 + 10 + (t / .33) * 70 : t < .66 ? 80 + ((t - .33) / .33) * 80 : 160 + ((t - .66) / .34) * 70; };
    var speed = function (t) { var x = t < .5 ? t * 2 : (1 - t) * 2; return x; };
    for (var i = 0; i < 4; i++) { var y = 40 + i * 14; s += G(0, 0, C(0, 0, 3.2, i % 2 ? 'fa' : 'fc'), mv(T0, function (t) { var x = 14 + 212 * (0.5 - 0.5 * cos(PI * t)) * 0 + 212 * (t < .35 ? (t / .35) * .34 : t < .65 ? .34 + ((t - .35) / .3) * .42 : .76 + ((t - .65) / .35) * .24); var yy = (x > 100 && x < 140) ? 52 + (i - 1.5) * 8 : y + (i - 1.5) * 0; return { x: x, y: (x > 90 && x < 150) ? 62 + (i - 1.5) * 7 : y + 8 - 8 + (i * 0) + 6, o: min(1, min(t / .05, (1 - t) / .05)) }; }, { n: 40, d: i * .24 })); }
    s += G(46, 0, R(-4, 0, 8, 30, 'fg', '', 2), '') ;
    s += G(46, 30, R(-4, -30, 8, 30, 'fb', 'transform-origin:0 0;opacity:.9', 2), mv(T0, function (t) { return { sy: 1 }; }, { n: 2 }));
    s += G(120, 30, R(-4, -14, 8, 14, 'fb', 'opacity:.9', 2), '');
    s += T(46, 14, 'P high', 'tx sm', 'fill:var(--b)') + T(120, 14, 'P low', 'tx sm', 'fill:var(--c)') + T(120, 112, 'A₁v₁ = A₂v₂', 'tx sm', 'fill:var(--a)');
    return s;
  };
  SC['sim-thermal-expansion'] = function () {
    var T0 = 5, ex = function (t) { return hc(t); };
    var s = R(20, 40, 8, 40, 'fw', 'opacity:.5', 2) + R(200, 40, 8, 40, 'fw', 'opacity:.5', 2);
    s += G(28, 0, R(0, 52, 150, 16, 'fa', 'transform-origin:0 0'), mv(T0, function (t) { return { sx: 1 + 0.12 * ex(t) }; }, { n: 24 }));
    s += G(28, 0, R(0, 52, 150, 16, 'fk', 'transform-origin:0 0'), mv(T0, function (t) { return { sx: 1 + 0.12 * ex(t), o: 0.75 * ex(t) }; }, { n: 24 }));
    s += G(0, 0, R(178, 48, 8, 24, 'fc', '', 2), mv(T0, function (t) { return { x: 18 * ex(t) }; }, { n: 24 }));
    [0, 1, 2].forEach(function (i) { s += G(70 + i * 40, 98, P('M0,0 q-6,-14 0,-22 q3,6 8,-2 q6,10 -1,24Z', 'fc', 'opacity:.9'), mv(.7 + i * .13, function (t) { return { s: 0.85 + 0.3 * sin(TAU * t + i), sx: 0.9 + 0.2 * cos(TAU * t * 2) }; }, { n: 12 })); });
    s += T(120, 24, 'ΔL = αLΔT', 'tx sm', 'fill:var(--c)');
    return s;
  };

  /* ---- ch9 · periodic motion ---- */
  SC['hsc-phy-periodic'] = function () {
    var px = 120, py = 14, Lp = 78, T0 = 3.2, a0 = 34, s = R(70, 8, 100, 6, 'fg', '', 3);
    s += P('M' + (px + Lp * sin(-a0 * PI / 180)) + ',' + (py + Lp * cos(a0 * PI / 180)) + ' A' + Lp + ',' + Lp + ' 0 0,0 ' + (px + Lp * sin(a0 * PI / 180)) + ',' + (py + Lp * cos(a0 * PI / 180)), 'sw nf', 'stroke-dasharray:3 4;stroke-width:1.3;opacity:.4');
    s += L(px, py, px, py + Lp + 8, 'sw', 'opacity:.2;stroke-dasharray:2 4');
    s += G(px, py, L(0, 0, 0, Lp, 'sw', 'opacity:.8;stroke-width:1.5') + C(0, Lp, 9, 'fa') + C(-3, Lp - 3, 2.6, 'fw', 'opacity:.7'), mv(T0, function (t) { return { r: a0 * sin(TAU * t) }; }, { n: 32 }));
    s += T(200, 104, 'T = 2π√(L/g)', 'tx sm', 'fill:var(--c);text-anchor:end');
    return s;
  };
  SC['hsc-phy-spring'] = function () {
    var T0 = 3, fn = function (t) { return 18 * sin(TAU * t); };
    var s = R(30, 10, 50, 6, 'fg', '', 3) + G(55, 16, G(0, 0, '<g transform="rotate(90)">' + spring(44, 6, 8, 'sa') + '</g>', ''), mv(T0, function (t) { return { sy: (44 + fn(t)) / 44 }; }, { n: 28 }));
    s += G(55, 0, R(-14, 0, 28, 20, 'fc', '', 4), mv(T0, function (t) { return { y: 64 + fn(t) }; }, { n: 28 }));
    s += axes(110, 62, 116, 44, 't', 'y');
    s += '<g clip-path="url(#' + (function () { var i = uid('c'); s += clip(i, R(110, 16, 112, 92)); return i; })() + ')">' + G(110, 62, P(sine(0, 232, 0, 18, 58, 0, 3), 'sb nf', 'stroke-width:2.6'), mv(T0 * 2, function (t) { return { x: -58 * 2 * t }; }, { n: 4 })) + '</g>';
    s += G(110, 0, C(0, 0, 4, 'fc'), mv(T0, function (t) { return { x: 0, y: 62 - fn(t) * 1 }; }, { n: 28 }));
    return s;
  };
  SC['phase-difference-studio'] = function () {
    var T0 = 3, s = '', ci = uid('c');
    s += clip(ci, R(14, 10, 212, 100)) + '<g clip-path="url(#' + ci + ')">';
    s += G(14, 40, P(sine(0, 300, 0, 16, 70, 0, 3), 'sa nf', 'stroke-width:2.6'), mv(T0, function (t) { return { x: -70 * t }; }, { n: 4 }));
    s += G(14, 86, P(sine(0, 300, 0, 16, 70, -PI / 2, 3), 'sb nf', 'stroke-width:2.6'), mv(T0, function (t) { return { x: -70 * t }; }, { n: 4 })) + '</g>';
    s += L(120, 10, 120, 110, 'sw', 'stroke-dasharray:3 4;opacity:.4;stroke-width:1.2');
    s += G(120, 40, C(0, 0, 4.5, 'fa'), mv(T0, function (t) { return { y: -16 * sin(TAU * t) }; }, { n: 24 })) + G(120, 86, C(0, 0, 4.5, 'fb'), mv(T0, function (t) { return { y: -16 * sin(TAU * t - PI / 2) }; }, { n: 24 }));
    s += T(204, 66, 'Δφ', 'tx', 'fill:var(--c)') + G(190, 66, P('M0,-18 v36 m-4,-6 l4,6 l4,-6', 'sc nf', 'stroke-width:1.6'), pulse(2, .9, 1.1));
    return s;
  };
  SC['sim-pendulum-lab'] = function () {
    var s = R(16, 8, 208, 6, 'fg', '', 3);
    [[52, 40, 'fa', 2.0], [100, 60, 'fb', 2.45], [152, 82, 'fc', 2.85], [200, 100, 'fk', 3.2]].forEach(function (p, i) {
      s += G(p[0], 14, L(0, 0, 0, p[1], 'sw', 'opacity:.75;stroke-width:1.4') + C(0, p[1], 7, p[2]) + C(-2, p[1] - 2, 2, 'fw', 'opacity:.7'), mv(p[3], function (t) { return { r: 28 * sin(TAU * t) }; }, { n: 28 }));
    });
    s += T(120, 118, 'T ∝ √L', 'tx sm', 'fill:var(--c)');
    return s;
  };

  /* ---- ch10 · waves ---- */
  SC['wave'] = function () {
    var T0 = 2.6, ci = uid('c'), wl = 60, s = clip(ci, R(10, 14, 220, 92));
    s += L(10, 60, 230, 60, 'sw', 'opacity:.3;stroke-width:1');
    s += '<g clip-path="url(#' + ci + ')">' + G(10, 60, P(sine(0, 340, 0, 26, wl, 0, 3), 'sa nf', 'stroke-width:3'), mv(T0, function (t) { return { x: wl * t }; }, { n: 4 })) + '</g>';
    s += G(70, 60, C(0, 0, 5, 'fc'), mv(T0, function (t) { return { y: -26 * sin(TAU * (-t) + TAU * (70 - 10) / wl * -1 + TAU * 60 / wl * 0) }; }, { n: 24 }));
    s += L(100, 18, 100, 28, 'sc', 'stroke-width:1.4') + L(160, 18, 160, 28, 'sc', 'stroke-width:1.4') + L(100, 23, 160, 23, 'sc', 'stroke-width:1.4') + T(130, 14, 'λ', 'tx sm', 'fill:var(--c)');
    s += L(214, 34, 214, 60, 'sb', 'stroke-width:1.4') + T(214, 78, 'A', 'tx sm', 'fill:var(--b)');
    return s;
  };
  SC['wave-superposition-lab'] = function () {
    var T0 = 3, wl = 80, s = '', c1 = uid('c');
    s += clip(c1, R(14, 6, 212, 108)) + '<g clip-path="url(#' + c1 + ')">';
    s += G(14, 24, P(sine(0, 360, 0, 12, wl, 0, 4), 'sa nf', 'stroke-width:2.4'), mv(T0, function (t) { return { x: wl * t }; }, { n: 4 }));
    s += G(14, 54, P(sine(0, 360, 0, 12, wl, 0, 4), 'sb nf', 'stroke-width:2.4'), mv(T0, function (t) { return { x: -wl * t }; }, { n: 4 }));
    s += G(14, 94, P(sine(0, 360, 0, 24, wl, 0, 3), 'sc nf', 'stroke-width:3'), mv(T0, function (t) { return { sy: cos(TAU * t), x: 0 }; }, { n: 24 })) + '</g>';
    s += T(224, 28, '→', 'tx sm', 'fill:var(--a)') + T(224, 58, '←', 'tx sm', 'fill:var(--b)') + T(224, 98, 'Σ', 'tx sm', 'fill:var(--c)');
    s += [14, 54, 94, 134, 174, 214].map(function (x) { return C(x, 94, 2.4, 'fw', 'opacity:.7'); }).join('');
    return s;
  };
  SC['beats-frequency-lab'] = function () {
    var T0 = 3.6, ci = uid('c'), s = clip(ci, R(12, 10, 216, 100));
    var f = function (x) { return 20 * 0.5 * (sin(TAU * 12 * x / 240) + sin(TAU * 14 * x / 240)); };
    var d = curve(function (x) { return [x, 60 - f(x) * 1.0]; }, 0, 480, 240);
    s += '<g clip-path="url(#' + ci + ')">' + G(12, 0, P(d, 'sa nf', 'stroke-width:2'), mv(T0, function (t) { return { x: -120 * t }; }, { n: 4 })) + '</g>';
    var env = curve(function (x) { return [x, 60 - 20 * abs(cos(TAU * x / 240))]; }, 0, 216, 90);
    s += P(env.replace(/M/, 'M'), 'sc nf', 'stroke-dasharray:3 4;stroke-width:1.4;opacity:.7;transform:translate(12px,0)');
    s += P(curve(function (x) { return [x, 60 + 20 * abs(cos(TAU * x / 240))]; }, 0, 216, 90), 'sc nf', 'stroke-dasharray:3 4;stroke-width:1.4;opacity:.7;transform:translate(12px,0)');
    s += G(30, 100, C(0, 0, 4, 'fb') + C(0, 0, 4, 'sb nf', 'stroke-width:2'), mv(1.2, function (t) { return { s: 1 + 2.4 * t, o: 1 - t }; }, { n: 8 })) ;
    s += T(204, 108, 'f₁ − f₂', 'tx sm', 'fill:var(--c);text-anchor:end');
    return s;
  };
  SC['sim-wave-machine'] = function () {
    var T0 = 3, s = L(10, 60, 230, 60, 'sw', 'opacity:.2;stroke-dasharray:2 4');
    for (var i = 0; i < 7; i++) { var x = 26 + i * 31; s += L(x, 30, x, 90, 'sw', 'opacity:.18;stroke-width:1'); s += G(x, 60, C(0, 0, 6.2, i % 2 ? 'fa' : 'fb'), mv(T0, function (t) { return { y: -26 * sin(TAU * t - i * 0.95) }; }, { n: 16 })); }
    return s + T(120, 112, 'v = fλ', 'tx sm', 'fill:var(--c)');
  };
  SC['sim-doppler-observer'] = function () {
    var T0 = 5, s = '', N = 7, sx = function (t) { return 26 + 96 * t; };
    for (var k = 0; k < N; k++) { var tk = k / N; s += G(sx(tk), 56, C(0, 0, 46, 'sa nf', 'stroke-width:1.8'), mv(T0, function (t) { return { s: 0.04 + 0.96 * t, o: (1 - t) * min(1, t / .04) }; }, { n: 12, d: 1 - tk })); }
    s += G(0, 56, C(0, 0, 6, 'fc') + C(0, 0, 11, 'sc nf', 'opacity:.4'), mv(T0, function (t) { return { x: sx(t) }; }, { n: 8 }));
    s += G(206, 56, C(0, -9, 4.4, 'fb') + R(-4, -4, 8, 14, 'fb', '', 3) + L(-3, 10, -3, 18, 'sb', 'stroke-width:2.4') + L(3, 10, 3, 18, 'sb', 'stroke-width:2.4'), '');
    s += T(206, 28, 'f′', 'tx', 'fill:var(--b)') + T(60, 112, 'f′ = f(v ± v₀)/(v ∓ vₛ)', 'tx sm', 'fill:var(--c);text-anchor:start');
    return s;
  };

  /* ---- ch11 · ideal gas & kinetic theory ---- */
  function molecules(x0, y0, w, h, n, seed, rr) {
    var s = '', a = rr || 4; n = Math.min(n, 8);
    for (var i = 0; i < n; i++) {
      var fx = 2 + ((i * 3 + seed) % 4), fy = 3 + ((i * 5 + seed * 2) % 4), ph = ((i * .37 + seed * .13) % 1), T0 = 6 + (i % 3);
      s += G(x0 + a, y0 + a, C(0, 0, a, ['fa', 'fb', 'fc', 'fk'][i % 4]), mv(T0, function (t) { return { x: (w - 2 * a) * tri(t * fx + ph), y: (h - 2 * a) * tri(t * fy + ph * 2) }; }, { n: 40 }));
    }
    return s;
  }
  SC['hsc-phy-gas'] = function () {
    var s = R(50, 16, 140, 88, 'sw nf', 'stroke-width:2.4;opacity:.6', 6) + R(50, 16, 140, 88, 'fb', 'opacity:.07', 6);
    s += molecules(52, 18, 136, 84, 8, 3, 4);
    s += T(120, 116, 'PV = nRT', 'tx sm', 'fill:var(--c)');
    return s;
  };
  SC['molecular-speed-distribution-lab'] = function () {
    var T0 = 4, s = axes(24, 98, 150, 78, 'v', 'N');
    var mx = function (v, a) { return 70 * (v * v) * exp(-v * v / a) * (a === 1 ? 1 : 1); };
    var c1 = curve(function (u) { var v = u * 3; return [24 + 150 * u, 98 - 72 * 1.9 * v * v * exp(-v * v / 0.55)]; }, 0, 1, 50);
    var c2 = curve(function (u) { var v = u * 3; return [24 + 150 * u, 98 - 46 * 1.0 * v * v * exp(-v * v / 1.2) * 1.1]; }, 0, 1, 50);
    s += P(c1, 'sa nf', 'stroke-width:2.6') + P(c2, 'sk nf', 'stroke-width:2.6;stroke:#f472b6');
    s += G(0, 0, P(c1 + ' L174,98 L24,98Z', 'fa', 'opacity:.2'), blink(T0, 0, .1, .6)) + G(0, 0, P(c2 + ' L174,98 L24,98Z', 'fk', 'opacity:.2'), blink(T0, .5, .1, .6));
    s += T(70, 28, 'T₁', 'tx sm', 'fill:var(--a)') + T(120, 52, 'T₂', 'tx sm', 'fill:#f472b6');
    s += molecules(184, 24, 44, 70, 6, 5, 3.4);
    s += R(184, 24, 44, 70, 'sw nf', 'stroke-width:1.6;opacity:.5', 5);
    return s;
  };
  SC['kinetic-pressure-lab'] = function () {
    var s = R(30, 20, 150, 80, 'sw nf', 'stroke-width:2.2;opacity:.45', 4) + R(180, 20, 8, 80, 'fc', '', 3);
    s += molecules(32, 22, 146, 76, 6, 8, 4);
    s += G(188, 60, P('M0,-18 L10,0 L0,18', 'sc nf', 'stroke-width:2.2'), blink(.9, 0, .1, 1));
    s += G(188, 60, C(0, 0, 14, 'sc nf', 'stroke-width:2'), mv(.9, function (t) { return { s: .4 + 1.2 * t, o: 1 - t }; }, { n: 8 }));
    s += '<path d="M204,86 a22,22 0 0,1 44,0" class="sw nf" style="stroke-width:2.2;opacity:.6;transform:translate(-14px,10px)"/>' + G(212, 96, L(0, 0, 0, -18, 'sc', 'stroke-width:2.8') + C(0, 0, 3, 'fw'), mv(.9, function (t) { return { r: -40 + 18 * sin(TAU * t) }; }, { n: 12 }));
    s += T(100, 114, 'P = ⅓ρ⟨v²⟩', 'tx sm', 'fill:var(--c)');
    return s;
  };
  SC['thermodynamic-process-lab'] = function () {
    var T0 = 6, s = axes(24, 100, 130, 84, 'V', 'P');
    var iso = function (u) { return [44 + 100 * u, 100 - 70 / (0.4 + 1.6 * u) * 0.8 + 6]; }, adi = function (u) { return [44 + 100 * u, 100 - 70 / pow(0.4 + 1.6 * u, 1.4) * 0.8 - 2]; };
    s += P(curve(iso, 0, 1, 24), 'sa nf', 'stroke-width:2.4') + P(curve(adi, 0, 1, 24), 'sb nf', 'stroke-width:2.4');
    s += G(0, 0, C(0, 0, 4.6, 'fc'), mv(T0, function (t) { var u = t < .5 ? t * 2 * .9 : 0.9 - (t - .5) * 2 * .9; var p = t < .5 ? iso(u + .05) : adi(u + .05); return { x: p[0], y: p[1] }; }, { n: 40 }));
    s += T(52, 34, 'isothermal', 'tx sm', 'fill:var(--a);text-anchor:start') + T(124, 84, 'adiabatic', 'tx sm', 'fill:var(--b)');
    s += G(190, 70, R(-20, -34, 40, 54, 'sw nf', 'stroke-width:2;opacity:.6', 3) + G(0, 0, R(-19, 0, 38, 6, 'fc', ''), mv(T0, function (t) { return { y: -24 + 26 * tri(t * 2) }; }, { n: 24 })), '');
    return s;
  };
  SC['pv-cycle-lab'] = function () {
    var T0 = 5, s = axes(26, 100, 150, 86, 'V', 'P');
    var pts = [[56, 78], [56, 36], [142, 36], [142, 78]];
    s += P(poly(pts, true), 'fa', 'opacity:.18') + G(0, 0, P(poly(pts, true), 'fb', ''), blink(T0, 0, .08, .4)) + P(poly(pts, true), 'sa nf', 'stroke-width:2.6');
    s += G(0, 0, C(0, 0, 5, 'fc') + C(0, 0, 9, 'sc nf', 'opacity:.4'), mv(T0, function (t) { var u = t * 4, k = floor(u) % 4, f = u - floor(u), a = pts[k], b = pts[(k + 1) % 4]; return { x: lerp(a[0], b[0], f), y: lerp(a[1], b[1], f) }; }, { n: 40 }));
    s += T(99, 62, 'W', 'tx', 'fill:#fff');
    s += G(196, 60, '<path d="M0,-30 a30,30 0 1,1 -4,0" class="sc nf" style="stroke-width:2;stroke-dasharray:3 3"/>', spin(T0));
    return s;
  };
  SC['gas-internal-energy-lab'] = function () {
    var T0 = 3, s = '';
    var mol = function () { return C(-9, 0, 6, 'fa') + C(9, 0, 6, 'fb') + L(-9, 0, 9, 0, 'sw', 'stroke-width:2'); };
    s += G(0, 0, G(0, 0, mol(), mv(1.4, function (t) { return { r: 360 * t }; }, { n: 4 })), mv(T0, function (t) { return { x: 40 + 40 * tri(t), y: 40 }; }, { n: 2 }));
    s += G(60, 82, C(-9, 0, 6, 'fa') + C(9, 0, 6, 'fb') + L(-9, 0, 9, 0, 'sw', 'stroke-width:2'), spin(2));
    s += G(160, 82, G(0, 0, C(-9, 0, 6, 'fa') + C(9, 0, 6, 'fb') + L(-9, 0, 9, 0, 'sw', 'stroke-width:2'), ''), mv(.7, function (t) { return { sx: 0.75 + 0.5 * hc(t) }; }, { n: 12 }));
    s += G(160, 40, G(0, 0, mol(), ''), mv(2.4, function (t) { return { x: 20 * sin(TAU * t), y: 0 }; }, { n: 16 }));
    s += T(60, 112, 'rotation', 'tx sm', 'opacity:.8') + T(160, 112, 'vibration', 'tx sm', 'opacity:.8') + T(60, 18, 'translation', 'tx sm', 'opacity:.8') + T(160, 18, '½kT / dof', 'tx sm', 'fill:var(--c)');
    return s;
  };
  SC['sim-ideal-gas-piston'] = function () {
    var T0 = 4, s = R(70, 14, 100, 94, 'sw nf', 'stroke-width:2.4;opacity:.55', 5);
    s += G(120, 108, G(0, 0, molecules(-48, -86, 96, 86, 6, 2, 3.6), ''), mv(T0, function (t) { return { sx: 1, sy: 0.56 + 0.4 * hc(t) }; }, { n: 24 }));
    s += G(120, 0, R(-48, 0, 96, 6, 'fc', '', 3) + R(-3, -26, 6, 26, 'sw', 'opacity:.8') + R(-12, -34, 24, 8, 'fa', '', 3), mv(T0, function (t) { return { y: 28 + 54 * (1 - hc(t)) * 1 - 0 + 0 }; }, { n: 24 }));
    s += G(204, 70, '<path d="M-22,0 a22,22 0 0,1 44,0" class="sw nf" style="stroke-width:2.2;opacity:.6"/>' + L(0, 0, 0, -18, 'sc', 'stroke-width:2.8') + C(0, 0, 3, 'fw'), '');
    s += G(204, 70, L(0, 0, 0, -18, 'sc', 'stroke-width:2.8'), mv(T0, function (t) { return { r: -50 + 100 * hc(t) }; }, { n: 24 }));
    s += T(204, 92, 'P', 'tx sm', 'fill:var(--c)');
    return s;
  };

  /* ---- electrostatics & optics ---- */
  SC['sim-coulomb-interaction'] = function () {
    var T0 = 4, s = L(14, 84, 226, 84, 'sw', 'opacity:.2;stroke-dasharray:2 4');
    s += G(60, 62, C(0, 0, 15, 'fa') + T(0, 6, '+', 'tx big', 'fill:#0a1020') + C(0, 0, 21, 'sa nf', 'opacity:.3'), pulse(2, .92, 1.1));
    var q2 = function (t) { return 150 + 34 * sin(TAU * t); };
    s += G(0, 62, C(0, 0, 15, 'fk') + T(0, 6, '−', 'tx big', 'fill:#0a1020'), mv(T0, function (t) { return { x: q2(t) }; }, { n: 28 }));
    s += G(0, 62, '<g transform="rotate(180)">' + arrow(30, 'c', 'stroke-width:2.6') + '</g>', mv(T0, function (t) { var d = q2(t) - 60; return { x: q2(t) - 17, sx: min(1.3, 2600 / (d * d)) }; }, { n: 28 }));
    s += G(0, 62, arrow(30, 'c', 'stroke-width:2.6'), mv(T0, function (t) { var d = q2(t) - 60; return { x: 77, sx: min(1.3, 2600 / (d * d)) }; }, { n: 28 }));
    s += T(120, 112, 'F = kq₁q₂/r²', 'tx sm', 'fill:var(--c)');
    return s;
  };
  SC['sim-electric-field-probe'] = function () {
    var cx = 120, cy = 60, lines = '';
    for (var i = 0; i < 10; i++) lines += '<g transform="rotate(' + i * 36 + ')">' + L(16, 0, 62, 0, 'sa', 'stroke-width:1.6;stroke-dasharray:3 7;opacity:.85') + '</g>';
    var s = G(cx, cy, lines, '');
    s += G(cx, cy, C(0, 0, 13, 'fa') + T(0, 5, '+', 'tx big', 'fill:#0a1020'), pulse(2, .94, 1.08));
    s += G(cx, cy, G(48, 0, C(0, 0, 6, 'fc') + G(6, 0, arrow(22, 'c', 'stroke-width:2.4'), ''), ''), spin(6));
    return s + T(204, 108, 'E = F/q₀', 'tx sm', 'fill:var(--c);text-anchor:end');
  };
  SC['sim-lens-ray-table'] = function () {
    var lx = 120, s = L(14, 60, 226, 60, 'sw', 'opacity:.35;stroke-width:1.2');
    s += P('M120,14 Q134,60 120,106 Q106,60 120,14Z', 'fa', 'opacity:.35') + P('M120,14 Q134,60 120,106 Q106,60 120,14Z', 'sa nf', 'stroke-width:2.2');
    s += C(80, 60, 2.4, 'fw') + C(160, 60, 2.4, 'fw') + T(80, 74, 'F', 'tx sm') + T(160, 74, 'F', 'tx sm');
    var ob = [52, 60], im = [200, 60];
    s += L(52, 60, 52, 34, 'sc', 'stroke-width:3.2') + P('M52,30 l-4,8 h8z', 'fc') + L(200, 60, 200, 86, 'sb', 'stroke-width:3.2') + P('M200,90 l-4,-8 h8z', 'fb');
    var rays = [[[52, 34], [120, 34], [200, 86]], [[52, 34], [120, 60 - 0], [200, 86]], [[52, 34], [120, 46], [200, 86]]];
    [[52, 34, 120, 34, 200, 86], [52, 34, 120, 60 + 0, 200, 86], [52, 34, 120, 47, 200, 86]].forEach(function (r, i) {
      s += P('M' + r[0] + ',' + r[1] + ' L' + r[2] + ',' + (r[3]) + ' L' + r[4] + ',' + r[5], 'sw nf', 'stroke-width:1.2;opacity:.25');
      s += G(0, 0, C(0, 0, 3.2, 'fc'), mv(2.6, function (t) { var k = t < .5 ? t / .5 : (t - .5) / .5; var p = t < .5 ? [lerp(r[0], r[2], k), lerp(r[1], r[3], k)] : [lerp(r[2], r[4], k), lerp(r[3], r[5], k)]; return { x: p[0], y: p[1], o: min(1, min(t / .05, (1 - t) / .05)) }; }, { n: 24, d: i * .22 }));
    });
    return s;
  };
  SC['sim-double-slit-studio'] = function () {
    var T0 = 3, s = R(70, 6, 6, 40, 'fw', 'opacity:.8', 2) + R(70, 54, 6, 12, 'fw', 'opacity:.8', 2) + R(70, 74, 6, 40, 'fw', 'opacity:.8', 2);
    var ci = uid('c');
    s += clip(ci, R(76, 0, 100, 120)) + '<g clip-path="url(#' + ci + ')">';
    [50, 70].forEach(function (y, k) { for (var i = 0; i < 3; i++) s += G(73, y, C(0, 0, 44, 'sa nf', 'stroke-width:1.6'), mv(T0, function (t) { return { s: 0.05 + 0.95 * t, o: (1 - t) * .9 }; }, { n: 8, d: i / 3 + k * .12 })); });
    s += '</g>';
    s += L(20, 60, 70, 60, 'sc', 'stroke-width:2;stroke-dasharray:3 4;opacity:.7');
    var ints = [.15, .5, 1, .5, .15, .55, 1, .55, .15];
    s += R(190, 6, 6, 108, 'fg', '', 2);
    var fr = ''; for (var j = 0; j < 9; j++) { var bi = Math.abs(cos(PI * (j - 4) / 1.25)); fr += R(200, 11 + j * 11.5, 20 * (0.15 + bi * 0.85), 6.8, 'fc', 'opacity:.9', 3); }
    s += G(0, 0, fr, blink(T0, 0, .5, 1));
    s += T(210, 118, 'fringes', 'tx sm', 'opacity:.7');
    return s;
  };

  /* =====================================================================================
     CHEMISTRY
     ===================================================================================== */
  function tube(x, y, w, h, liquidCls, lv) {
    return R(x, y, w, h, 'sw nf', 'stroke-width:2;opacity:.7', w / 2) + R(x + 1.5, y + h * (1 - lv), w - 3, h * lv - 1.5, liquidCls || 'fb', 'opacity:.55', w / 2 - 1);
  }
  function beaker(x, y, w, h, cls, lv, extra) {
    return P('M' + x + ',' + y + ' L' + (x + 3) + ',' + (y + h) + ' L' + (x + w - 3) + ',' + (y + h) + ' L' + (x + w) + ',' + y, 'sw nf', 'stroke-width:2.2;opacity:.75') + R(x + 3, y + h * (1 - lv), w - 6, h * lv - 1, cls || 'fb', 'opacity:.5' + (extra || ''), 2);
  }
  function flask(cx, y, w, h, cls) { /* conical flask outline centred at cx */
    var nw = w * .22;
    return P('M' + (cx - nw) + ',' + y + ' L' + (cx - nw) + ',' + (y + h * .32) + ' L' + (cx - w / 2) + ',' + (y + h) + ' L' + (cx + w / 2) + ',' + (y + h) + ' L' + (cx + nw) + ',' + (y + h * .32) + ' L' + (cx + nw) + ',' + y, 'sw nf', 'stroke-width:2.2;opacity:.75');
  }
  function drop(c) { return P('M0,-6 C4,0 5,3 0,5 C-5,3 -4,0 0,-6Z', c || 'fa'); }
  function atom(r, c, lab) { return C(0, 0, r, c) + C(-r * .3, -r * .3, r * .26, 'fw', 'opacity:.5') + (lab ? T(0, r * .35, lab, 'tx sm', 'fill:#0a1020;font-size:' + r * .9 + 'px') : ''); }
  function bubbles(x0, x1, y0, y1, n, T0, c) { var s = ''; for (var i = 0; i < n; i++) { var bx = x0 + (x1 - x0) * ((i * 37 % 10) / 10); s += G(bx, 0, C(0, 0, 1.8 + (i % 3) * .8, c || 'fw', 'opacity:.8'), mv(T0 + (i % 3) * .4, function (t) { return { x: 3 * sin(TAU * t * 2 + i), y: lerp(y0, y1, t), o: min(1, min(t / .1, (1 - t) / .2)) }; }, { n: 12, d: (i * .23) % 1 })); } return s; }

  /* ---- qualitative chemistry ---- */
  SC['ion-identification'] = function () {
    var T0 = 4.5, s = '', cols = ['fa', 'fk', 'fc'];
    [50, 120, 190].forEach(function (x, i) {
      s += tube(x - 12, 40, 24, 62, 'fb', 0.45) ;
      s += G(x, 0, R(-10.5, 0, 21, 28, cols[i], 'opacity:.8', 8), mv(T0, function (t) { return { y: 72, o: ramp(t, i * .12 + .26, i * .12 + .42) * (1 - ramp(t, .9, .98)) }; }, { n: 24 }));
      s += G(x, 0, drop(cols[i]), mv(T0, function (t) { var u = ramp(t, i * .12 + .04, i * .12 + .26); return { y: lerp(14, 70, u * u), o: u > 0 && u < 1 ? 1 : 0 }; }, { n: 24 }));
      s += G(x, 24, L(0, -16, 0, 4, 'sw', 'stroke-width:2.2;opacity:.6') + P('M-5,4 h10 l-3,8 h-4z', 'fw', 'opacity:.8'), '');
    });
    s += T(50, 116, 'Cu²⁺', 'tx sm', 'fill:var(--a)') + T(120, 116, 'Fe³⁺', 'tx sm', 'fill:#f472b6') + T(190, 116, 'Ag⁺', 'tx sm', 'fill:var(--c)');
    return s;
  };
  SC['wet-test'] = function () {
    var T0 = 5, s = beaker(74, 30, 92, 74, 'fb', .72) + L(60, 106, 180, 106, 'sw', 'opacity:.4');
    for (var i = 0; i < 5; i++) s += G(80 + (i * 37 % 80), 0, R(-2.5, -2, 5, 4, i % 2 ? 'fc' : 'fw', 'opacity:.85', 1), mv(T0, function (t) { var u = ramp(t, .15 + (i % 4) * .05, .85); return { x: 4 * sin(TAU * t * 2 + i), y: lerp(46, 98, u), r: 360 * t, o: min(1, t / .1) * (1 - ramp(t, .92, 1)) * (t > .15 ? 1 : 0) }; }, { n: 24, d: (i * .13) % 1 }));
    s += bubbles(84, 156, 98, 40, 4, 2.8, 'fw');
    s += G(120, 0, drop('fa'), mv(2.5, function (t) { return { y: lerp(8, 44, t * t), o: t < .96 ? 1 : 0 }; }, { n: 12 }));
    s += T(204, 36, 'ppt ↓', 'tx sm', 'fill:var(--c)') + T(36, 36, '↑ gas', 'tx sm', 'fill:var(--b)');
    return s;
  };
  SC['hsc-chem-flame'] = function () {
    var T0 = 6, s = R(112, 92, 16, 22, 'fg', '', 3) + R(116, 76, 8, 18, 'sw nf', 'stroke-width:2;opacity:.7', 2) + L(100, 114, 140, 114, 'sw', 'opacity:.5');
    [['fc', 0], ['fk', .25], ['fa', .5], ['fb', .75]].forEach(function (c, i) {
      var f = P('M120,76 C100,58 108,36 120,14 C132,36 140,58 120,76Z', c[0], 'opacity:.95') + P('M120,76 C110,64 114,50 120,38 C126,50 130,64 120,76Z', 'fw', 'opacity:.6');
      s += G(0, 0, G(120, 76, '<g transform="translate(-120 -76)">' + f + '</g>', mv(.6, function (t) { return { sy: .92 + .12 * sin(TAU * t * 2 + i), sx: .96 + .06 * cos(TAU * t) }; }, { n: 8 })), show(T0, c[1] + .02, c[1] + .26, 0));
    });
    s += T(40, 40, 'Na⁺', 'tx sm', 'fill:var(--c)') + T(200, 40, 'Li⁺ · Cu²⁺ · K⁺', 'tx sm', 'opacity:.7');
    return s;
  };
  SC['hsc-chem-kinetics'] = function () {
    var s = R(14, 22, 100, 78, 'sw nf', 'stroke-width:2;opacity:.5', 6) + R(126, 22, 100, 78, 'sw nf', 'stroke-width:2;opacity:.5', 6) + R(126, 22, 100, 78, 'fk', 'opacity:.08', 6) + R(14, 22, 100, 78, 'fb', 'opacity:.08', 6);
    var cold = '', hot = '';
    for (var i = 0; i < 4; i++) {
      cold += G(16, 24, C(0, 0, 3.6, 'fb'), mv(7 + i, function (t) { return { x: 90 * tri(t * (2 + i % 2) + i * .2), y: 68 * tri(t * (3 + i % 3) + i * .31) }; }, { n: 36 }));
      hot += G(128, 24, C(0, 0, 3.6, 'fk'), mv(2.2 + i * .4, function (t) { return { x: 90 * tri(t * (3 + i % 2) + i * .2), y: 68 * tri(t * (4 + i % 3) + i * .31) }; }, { n: 36 }));
    }
    s += cold + hot + T(64, 116, 'cold', 'tx sm', 'fill:var(--a)') + T(176, 116, 'hot', 'tx sm', 'fill:#f472b6');
    s += G(120, 14, P('M-4,0 l4,-8 l4,8 M0,-8 v-4', 'sc nf', 'stroke-width:2'), blink(1.4, 0, .3, 1));
    return s;
  };
  SC['hsc-chem-organic-mechanism'] = function () {
    var T0 = 5, s = '';
    var cx = 124, cy = 62;
    s += G(cx, cy, atom(11, 'fa', 'C') , '');
    s += G(cx, cy, G(0, 0, C(0, -22, 5, 'fw') + L(0, -11, 0, -17, 'sw', 'stroke-width:2') + C(-19, 12, 5, 'fw') + L(-9, 6, -15, 10, 'sw', 'stroke-width:2') + C(19, 12, 5, 'fw') + L(9, 6, 15, 10, 'sw', 'stroke-width:2'), mv(T0, function (t) { return { sy: 1 - 2 * ramp(t, .4, .6) * 0 + 0, sx: 1, y: 0 }; }, { n: 2 })), mv(T0, function (t) { return { sy: 1 - 2 * ramp(t, .35, .65) }; }, { n: 28 }));
    s += G(0, cy, G(0, 0, C(0, 0, 8, 'fc') + T(0, 3, 'Nu⁻', 'tx sm', 'fill:#0a1020;font-size:7px'), ''), mv(T0, function (t) { return { x: lerp(24, 100, ramp(t, .05, .4)) - 0 * t + 0, o: 1 }; }, { n: 24 }));
    s += G(0, cy, G(0, 0, C(0, 0, 8, 'fk') + T(0, 3, 'X', 'tx sm', 'fill:#0a1020;font-size:8px'), ''), mv(T0, function (t) { return { x: lerp(150, 214, ramp(t, .45, .85)) , o: 1 - 0 }; }, { n: 24 }));
    s += G(0, cy, L(0, 0, 0, 0, 'sw'), '');
    s += P('M40,38 Q80,10 108,40', 'sc nf', 'stroke-width:2;stroke-dasharray:1;stroke-dashoffset:0" pathLength="1');
    s += T(120, 112, 'S_N2', 'tx sm', 'fill:var(--c)');
    return s;
  };

  /* ---- atomic structure, periodicity, bonding ---- */
  SC['hsc-chem-rutherford'] = function () {
    var T0 = 4, s = '', nx = 130, ny = 60;
    s += G(nx, ny, C(0, 0, 7, 'fc') + C(0, 0, 14, 'sc nf', 'opacity:.35;stroke-width:1.5'), pulse(2, .9, 1.15));
    s += R(124, 8, 12, 104, 'fg', 'opacity:.5', 4);
    [[-26, 'straight', 0], [-4, 'slight', .32], [8, 'back', .64]].forEach(function (a, i) {
      var y0 = ny + a[0] * 1.0 + (a[1] === 'straight' ? -30 : 0);
      var pth = function (t) { var x = 14 + 220 * t; if (a[1] === 'straight') return [x, 30]; if (a[1] === 'slight') { var u = ramp(t, .35, .7); return [x, 54 - 22 * u + (t > .5 ? (t - .5) * -30 : 0)]; } var q = t < .48 ? [14 + 108 * (t / .48), 60 + 0] : [122 - 108 * ((t - .48) / .52), 60 + 26 * ((t - .48) / .52) * 1.0 - 0]; return q; };
      s += G(0, 0, C(0, 0, 3.6, i === 2 ? 'fk' : 'fa') + C(0, 0, 6.5, 'sw nf', 'opacity:.2'), mv(T0, function (t) { var p = pth(t); return { x: p[0], y: p[1], o: min(1, min(t / .06, (1 - t) / .08)) }; }, { n: 36, d: a[2] }));
    });
    s += T(40, 112, 'α →', 'tx sm', 'fill:var(--a)') + T(190, 112, 'Au nucleus', 'tx sm', 'fill:var(--c)');
    return s;
  };
  SC['hsc-chem-bohr'] = function () {
    var cx = 110, cy = 62, T0 = 6, s = C(cx, cy, 20, 'sw nf', 'stroke-dasharray:2 4;opacity:.4') + C(cx, cy, 36, 'sw nf', 'stroke-dasharray:2 4;opacity:.4') + C(cx, cy, 52, 'sw nf', 'stroke-dasharray:2 4;opacity:.4');
    s += G(cx, cy, C(0, 0, 8, 'fc') + C(0, 0, 12, 'sc nf', 'opacity:.4'), pulse(2, .9, 1.1));
    s += G(cx, cy, C(0, 0, 4.6, 'fa'), mv(T0, function (t) { var rr = 20 + 32 * (ramp(t, .3, .38) - ramp(t, .7, .78)); var a = TAU * t * 5; return { x: rr * cos(a), y: rr * sin(a) }; }, { n: 90 }));
    s += G(cx, cy, G(52, 0, P('M0,0 q4,-5 8,0 t8,0 t8,0 t8,0', 'sk nf', 'stroke-width:2;stroke:#f472b6'), ''), mv(T0, function (t) { return { x: 0, y: 0, o: bump(t, .74, .06) }; }, { n: 40 }));
    s += G(0, 0, P('M170,62 q4,-6 8,0 t8,0 t8,0', 'sk nf', 'stroke-width:2.4;stroke:#f472b6'), mv(T0, function (t) { return { x: 14 * (t > .7 ? (t - .7) / .3 : 0), o: bump(t, .76, .08) }; }, { n: 40 }));
    s += T(212, 108, 'E = hν', 'tx sm', 'fill:var(--c);text-anchor:end') + T(30, 20, 'n = 1,2,3', 'tx sm', 'opacity:.7;text-anchor:start');
    return s;
  };
  SC['hsc-chem-periodic'] = function () {
    var T0 = 5, s = '';
    for (var c = 0; c < 8; c++) {
      var col = '';
      for (var r = 0; r < 4; r++) col += R(25 + c * 24, 21 + r * 22, 18, 18, (r + c) % 2 ? 'fa' : 'fb', 'opacity:.9', 4);
      s += G(0, 0, col, mv(T0, function (t) { return { o: .22 + .78 * bump(t, c / 10, .22) }; }, { n: 20 }));
    }
    return s + T(120, 118, 'trend →', 'tx sm', 'fill:var(--c)');
  };
  SC['hsc-chem-bond'] = function () {
    var T0 = 5, s = '';
    s += G(70, 60, atom(18, 'fa', 'Na'), '') + G(170, 60, atom(22, 'fb', 'Cl'), '');
    s += G(0, 60, C(0, 0, 3.6, 'fc'), mv(T0, function (t) { var u = ramp(t, .15, .55); return { x: lerp(92, 142, u), y: -10 * sin(PI * u) }; }, { n: 28 }));
    s += G(70, 36, T(0, 0, '+', 'tx big', 'fill:var(--a)'), mv(T0, function (t) { return { o: ramp(t, .5, .6) * (1 - ramp(t, .92, .98)) , s: 1 }; }, { n: 24 })) + G(170, 34, T(0, 0, '−', 'tx big', 'fill:var(--b)'), mv(T0, function (t) { return { o: ramp(t, .5, .6) * (1 - ramp(t, .92, .98)) }; }, { n: 24 }));
    s += G(120, 60, L(-20, 0, 20, 0, 'sc', 'stroke-width:3;stroke-dasharray:3 4'), mv(T0, function (t) { return { o: ramp(t, .55, .65) * (1 - ramp(t, .92, .98)), sx: 1 }; }, { n: 24 }));
    s += T(120, 108, 'ΔEN > 1.7 → ionic', 'tx sm', 'fill:var(--c)');
    return s;
  };
  SC['hsc-chem-titration'] = function () {
    var T0 = 5, s = R(112, 8, 16, 52, 'sw nf', 'stroke-width:2;opacity:.7', 4) + G(120, 58, R(-6.5, -50, 13, 50, 'fb', 'transform-origin:0 0;opacity:.6', 3), mv(T0, function (t) { return { sy: 1 - .45 * t }; }, { n: 8 })) + P('M114,60 l6,8 l6,-8', 'sw nf', 'stroke-width:2;opacity:.7');
    s += flask(120, 78, 66, 38, '') + G(120, 114, P('M-26,0 L-12,-24 L12,-24 L26,0Z', 'fa', 'opacity:.35'), '');
    s += G(120, 114, P('M-26,0 L-12,-24 L12,-24 L26,0Z', 'fk', 'opacity:.8'), mv(T0, function (t) { return { o: ramp(t, .62, .8) * (1 - ramp(t, .94, 1)) }; }, { n: 24 }));
    s += G(120, 0, drop('fb'), mv(.9, function (t) { return { y: lerp(66, 98, t * t), o: t < .94 ? 1 : 0 }; }, { n: 10 }));
    s += T(48, 40, 'NaOH', 'tx sm', 'fill:var(--b)') + T(192, 98, 'HCl + ind.', 'tx sm', 'fill:var(--c)');
    return s;
  };
  SC['hsc-chem-molecular-polarity'] = function () {
    var T0 = 5, s = R(20, 16, 6, 88, 'fb', '', 2) + R(214, 16, 6, 88, 'fa', '', 2) + T(23, 12, '−', 'tx sm') + T(217, 12, '+', 'tx sm');
    var w = G(0, 0, C(0, 0, 14, 'fk') + T(0, 4, 'O', 'tx sm', 'fill:#0a1020') + G(-18, 16, C(0, 0, 8, 'fw') + T(0, 3, 'H', 'tx sm', 'fill:#0a1020;font-size:8px'), '') + G(18, 16, C(0, 0, 8, 'fw') + T(0, 3, 'H', 'tx sm', 'fill:#0a1020;font-size:8px'), '') + L(-6, 8, -14, 12, 'sw', 'stroke-width:2.4;opacity:.6') + L(6, 8, 14, 12, 'sw', 'stroke-width:2.4;opacity:.6') + G(0, 20, '<g transform="rotate(-90)">' + arrow(26, 'c', 'stroke-width:2.6') + '</g>', '') + T(0, -20, 'δ−', 'tx sm', 'fill:var(--b)') + T(0, 46, 'δ+', 'tx sm', 'fill:var(--a)'), '');
    s += G(120, 52, w, mv(T0, function (t) { return { r: 70 * sin(TAU * t) * (1 - 0.7 * ramp(t, .2, .5)) * (t < .5 ? 1 : .4 + .6 * (1 - ramp(t, .5, 1))) }; }, { n: 40 }));
    return s;
  };
  SC['hsc-chem-intermolecular'] = function () {
    var T0 = 3, s = '';
    var h2o = function (x, y, a) { return G(x, y, G(0, 0, C(0, 0, 9, 'fk') + C(-11, 9, 5, 'fw') + C(11, 9, 5, 'fw'), ''), osc(2 + a, 2, 'y', a * .2)); };
    var pos = [[60, 40, 0], [130, 36, .3], [190, 62, .6], [100, 90, .9], [168, 98, 1.2]];
    pos.forEach(function (p) { s += h2o(p[0], p[1], p[2]); });
    var bonds = ''; [[0, 1], [1, 2], [0, 3], [3, 4], [2, 4]].forEach(function (e) { var a = pos[e[0]], b = pos[e[1]]; bonds += P('M' + (a[0] + 11) + ',' + (a[1] + 9) + ' L' + (b[0] - 4) + ',' + (b[1] - 2), 'sc nf', 'stroke-width:2;stroke-dasharray:3 3'); }); s += G(0, 0, bonds, blink(2.4, 0, .25, 1));
    s += T(120, 114, 'H-bond ···', 'tx sm', 'fill:var(--c)');
    return s;
  };
  SC['sim-periodic-trend-map'] = function () {
    var T0 = 5, s = '';
    for (var c = 0; c < 9; c++) {
      var col = '';
      for (var r = 0; r < 5; r++) col += R(21 + c * 22, 15 + r * 18, 18, 14, 'fa', '', 3);
      s += G(0, 0, col, mv(T0, function (t) { return { o: .12 + .88 * bump(t, c / 12, .26) }; }, { n: 20 }));
    }
    return s + P('M24,112 H216 M208,108 l8,4 l-8,4', 'sc nf', 'stroke-width:2');
  };
  SC['sim-atomic-radius-explorer'] = function () {
    var T0 = 4, s = '';
    [[48, 13, 2, 'Li', 'fa'], [120, 20, 3, 'Na', 'fb'], [192, 28, 4, 'K', 'fc']].forEach(function (a, i) {
      s += G(a[0], 56, C(0, 0, a[1], a[4], 'opacity:.3') + C(0, 0, 3, 'fw'), pulse(2.4, .95, 1.06, i * .2));
      for (var k = 1; k <= a[2]; k++) s += C(a[0], 56, 5 + (a[1] - 5) * k / a[2] + 2, 'sw nf', 'opacity:.4;stroke-width:1.2');
      s += G(a[0], 56, G(a[1] - 4, 0, C(0, 0, 3, a[4]), ''), spin(2 + i * .8));
      s += T(a[0], 104, a[3], 'tx sm', 'opacity:.9');
    });
    s += G(120, 112, P('M-80,0 H80', 'sc nf', 'stroke-width:1.6;stroke-dasharray:3 3'), '') + T(120, 20, 'r ↑ down the group', 'tx sm', 'fill:var(--c)');
    return s;
  };
  SC['sim-ionization-energy-climb'] = function () {
    var T0 = 5, pts = [[24, 96], [48, 60], [72, 86], [96, 70], [120, 52], [144, 62], [168, 34], [192, 20], [216, 78]], s = axes(14, 104, 214, 90, 'Z', 'IE');
    s += P(poly(pts, false), 'sa nf', 'stroke-width:2.6;stroke-linejoin:round');
    pts.forEach(function (p) { s += C(p[0], p[1], 2.4, 'fw', 'opacity:.8'); });
    s += G(0, 0, C(0, 0, 5, 'fc') + C(0, 0, 9, 'sc nf', 'opacity:.4'), mv(T0, function (t) { var u = t * 8, k = min(7, floor(u)), f = u - k, a = pts[k], b = pts[k + 1]; return { x: lerp(a[0], b[0], sm(f)), y: lerp(a[1], b[1], sm(f)) - 8 * sin(PI * f) }; }, { n: 48 }));
    s += T(192, 14, 'Ne', 'tx sm', 'fill:var(--c)');
    return s;
  };
  SC['sim-electronegativity-map'] = function () {
    var T0 = 4, s = '';
    s += G(50, 60, atom(18, 'fa', 'A'), '') + G(190, 60, atom(26, 'fb', 'F'), '');
    s += L(68, 60, 164, 60, 'sw', 'stroke-width:2;opacity:.4;stroke-dasharray:3 4');
    s += G(0, 60, C(-5, 0, 4, 'fc') + C(5, 0, 4, 'fc'), mv(T0, function (t) { return { x: 120 + 30 * (0.5 + 0.5 * sin(TAU * t - 1)) * 0 + 24 * sin(TAU * t), y: 0 }; }, { n: 28 }));
    s += G(40, 24, arrow(24, 'a', 'stroke-width:2.4'), pulse(1.6, .7, 1.1)) + G(220, 24, '<g transform="rotate(180)">' + arrow(40, 'b', 'stroke-width:3') + '</g>', pulse(1.6, .8, 1.2));
    s += T(120, 112, 'electron pair → higher EN', 'tx sm', 'fill:var(--c)');
    return s;
  };
  SC['sim-bond-polarity-studio'] = function () {
    var T0 = 6, s = '';
    s += G(70, 60, atom(16, 'fa', 'H'), '') + G(170, 60, atom(22, 'fb', 'F'), '');
    s += G(0, 60, E(0, 0, 46, 22, 'fc', 'opacity:.25') + E(0, 0, 46, 22, 'sc nf', 'stroke-dasharray:3 3;opacity:.7'), mv(T0, function (t) { var k = hc(t); return { x: lerp(120, 138, k), sx: lerp(.9, 1.05, k), sy: 1 }; }, { n: 28 }));
    s += G(0, 28, arrow(60, 'c', 'stroke-width:3'), mv(T0, function (t) { return { x: 90, sx: lerp(.15, 1, hc(t)) }; }, { n: 28 }));
    s += T(70, 94, 'δ+', 'tx sm', 'fill:var(--a)') + T(170, 98, 'δ−', 'tx sm', 'fill:var(--b)') + T(120, 114, 'H–H  →  H–F', 'tx sm', 'fill:var(--c)');
    return s;
  };
  SC['sim-molecular-shape-builder'] = function () {
    var T0 = 6, s = '';
    var arms = [[0, -40, 'fb'], [-34, 22, 'fb'], [34, 22, 'fb'], [0, 6, 'fk']];
    var lone = G(0, 0, E(0, -14, 8, 14, 'fc', 'opacity:.35'), '');
    s += G(120, 60, G(0, 0, arms.map(function (a, i) { return L(0, 0, a[0], a[1], 'sw', 'stroke-width:3;opacity:.85') + C(a[0], a[1], 8, a[2]); }).join('') + atom(12, 'fa', 'C'), ''), mv(T0, function (t) { return { sx: abs(cos(TAU * t)) * .9 + .1, sy: 1 }; }, { n: 32 }));
    s += T(120, 114, 'VSEPR · 109.5°', 'tx sm', 'fill:var(--c)');
    s += P('M150,38 a28,28 0 0,1 0,44', 'sc nf', 'stroke-width:1.6;stroke-dasharray:3 3;opacity:.7');
    return s;
  };
  SC['sim-photon-spectrum'] = function () {
    var s = P('M82,40 L110,92 L54,92Z', 'fw', 'opacity:.15') + P('M82,40 L110,92 L54,92Z', 'sw nf', 'stroke-width:2;opacity:.8');
    s += P('M10,70 H70', 'sw nf', 'stroke-width:2.4;opacity:.9') + G(0, 0, C(0, 0, 3.2, 'fw'), mv(1.4, function (t) { return { x: lerp(8, 72, t), y: 70, o: min(1, (1 - t) / .1) }; }, { n: 8 }));
    var cols = ['#f87171', '#fb923c', '#fde047', '#4ade80', '#38bdf8', '#a78bfa'], rays = '';
    cols.forEach(function (c, i) { rays += P('M96,76 L220,' + (56 + i * 7), 'nf', 'stroke:' + c + ';stroke-width:2.4;opacity:.9;stroke-linecap:round'); });
    s += G(0, 0, rays, blink(2.2, 0, .45, 1));
    s += G(0, 0, C(0, 0, 2.6, 'fw'), mv(1.6, function (t) { return { x: lerp(96, 220, t), y: lerp(76, 77, t), o: min(1, min(t / .1, (1 - t) / .1)) }; }, { n: 8 }));
    return s + T(206, 108, 'E = hc/λ', 'tx sm', 'fill:var(--c);text-anchor:end');
  };

  /* ---- chemical change ---- */
  SC['hsc-chem-equilibrium'] = function () {
    var T0 = 4, s = R(18, 28, 84, 70, 'sw nf', 'stroke-width:2;opacity:.55', 6) + R(138, 28, 84, 70, 'sw nf', 'stroke-width:2;opacity:.55', 6);
    s += T(60, 22, 'A', 'tx sm', 'fill:var(--a)') + T(180, 22, 'B', 'tx sm', 'fill:var(--b)');
    for (var i = 0; i < 3; i++) { s += G(0, 0, C(0, 0, 4, i % 2 ? 'fa' : 'fc'), mv(T0, function (t) { var u = ramp(t, 0, .4); return { x: lerp(100, 140, u), y: 52 + (i - 1) * 7 - 14 * sin(PI * u), o: u > 0 && u < 1 ? 1 : 0 }; }, { n: 20, d: i / 3 })); }
    for (var j = 0; j < 2; j++) { s += G(0, 0, C(0, 0, 4, 'fb'), mv(T0, function (t) { var u = ramp(t, 0, .4); return { x: lerp(140, 100, u), y: 74 + (j - .5) * 8 + 12 * sin(PI * u), o: u > 0 && u < 1 ? 1 : 0 }; }, { n: 20, d: j / 2 + .1 })); }
    var dA = '', dB = ''; for (var q = 0; q < 6; q++) { dA += C(40 + (q * 9) % 40, 50 + (q * 13) % 36, 3.4, 'fa'); dB += C(160 + (q * 11) % 40, 50 + (q * 7) % 36, 3.4, 'fb'); }
    s += G(0, 0, dA, osc(2.4, 3, 'y')) + G(0, 0, dB, osc(3, 3, 'y', .3));
    s += T(120, 114, 'A ⇌ B', 'tx', 'fill:var(--c)');
    return s;
  };
  SC['hsc-chem-ph'] = function () {
    var T0 = 6, s = '<defs><linearGradient id="phg"><stop offset="0" stop-color="#ef4444"/><stop offset=".25" stop-color="#f59e0b"/><stop offset=".5" stop-color="#22c55e"/><stop offset=".75" stop-color="#3b82f6"/><stop offset="1" stop-color="#7c3aed"/></linearGradient></defs>' + R(20, 28, 200, 14, '', 'fill:url(#phg)', 7);
    s += G(0, 0, P('M0,0 l-6,-10 h12z', 'fw') + L(0, 0, 0, 20, 'sw', 'opacity:.7'), mv(T0, function (t) { return { x: 20 + 200 * hc(t), y: 24 }; }, { n: 28 }));
    s += beaker(90, 58, 60, 46, 'fb', .7);
    var hp = '', oh = '';
    for (var i = 0; i < 7; i++) { hp += C(96 + i * 8, 76 + 20 * ((i * 17 % 10) / 10), 2.6, 'fk'); oh += C(98 + i * 8, 80 + 16 * ((i * 13 % 10) / 10), 2.6, 'fb'); }
    s += G(0, 0, hp, mv(T0, function (t) { return { o: .15 + .85 * (1 - hc(t)) }; }, { n: 16 })) + G(0, 0, oh, mv(T0, function (t) { return { o: .15 + .85 * hc(t) }; }, { n: 16 }));
    return s + T(20, 20, '0', 'tx sm') + T(220, 20, '14', 'tx sm') + T(120, 118, 'pH = −log[H⁺]', 'tx sm', 'fill:var(--c)');
  };
  SC['hsc-chem-electrochem'] = function () {
    var T0 = 4, s = beaker(20, 52, 70, 50, 'fa', .75) + beaker(150, 52, 70, 50, 'fb', .75, ';opacity:.3');
    s += R(44, 30, 8, 60, 'fw', 'opacity:.7', 2) + R(188, 30, 8, 60, 'fc', '', 2);
    s += P('M48,30 V14 H192 V30', 'sw nf', 'stroke-width:2;opacity:.6') + P('M82,52 V40 Q120,26 158,40 V52', 'sc nf', 'stroke-width:5;opacity:.3');
    s += G(0, 0, C(0, 0, 2.8, 'fc'), mv(2.4, function (t) { return { x: lerp(52, 188, t), y: 14, o: min(1, min(t / .05, (1 - t) / .05)) }; }, { n: 8 })) + G(0, 0, C(0, 0, 2.8, 'fc'), mv(2.4, function (t) { return { x: lerp(52, 188, t), y: 14, o: min(1, min(t / .05, (1 - t) / .05)) }; }, { n: 8, d: .5 }));
    s += molecules(24, 70, 62, 28, 4, 4, 2.4) + molecules(154, 78, 62, 20, 2, 6, 2.4);
    s += G(120, 62, '<path d="M-14,0 a14,14 0 0,1 28,0" class="sw nf" style="stroke-width:2"/>' + G(0, 0, L(0, 0, 0, -12, 'sc', 'stroke-width:2.4'), osc(3, 40, 'r')), '');
    s += T(120, 114, 'E = E° − (RT/nF) ln Q', 'tx sm', 'fill:var(--c)');
    return s;
  };
  SC['hsc-chem-stoich'] = function () {
    var T0 = 5, s = '';
    for (var i = 0; i < 5; i++) s += G(30, 22 + i * 17, C(0, 0, 5, 'fa'), mv(T0, function (t) { var u = i < 4 ? ramp(t, .1 + i * .06, .5 + i * .04) : 0; return { x: 90 * u, y: 0, o: 1 - (i < 4 ? ramp(t, .5 + i * .04, .56 + i * .04) : 0) * 1 }; }, { n: 28 }));
    for (var j = 0; j < 3; j++) s += G(210, 32 + j * 22, C(0, 0, 5, 'fb'), mv(T0, function (t) { var u = ramp(t, .1 + j * .06, .5 + j * .04); return { x: -90 * u, y: 0, o: 1 - ramp(t, .5 + j * .04, .56 + j * .04) }; }, { n: 28 }));
    for (var k = 0; k < 3; k++) s += G(120, 34 + k * 22, C(-4, 0, 4, 'fa') + C(4, 0, 4, 'fb'), mv(T0, function (t) { return { o: ramp(t, .56 + k * .04, .62 + k * .04) * (1 - ramp(t, .93, 1)), s: 1 }; }, { n: 24 }));
    s += G(30, 0, C(0, 106, 0.1, ''), '') + T(30, 118, 'excess', 'tx sm', 'fill:var(--a)') + T(210, 118, 'limiting', 'tx sm', 'fill:var(--b)');
    return s;
  };
  SC['hsc-chem-reaction-energy'] = function () {
    var T0 = 5, s = axes(20, 102, 200, 88, 'RC', 'E');
    var p = function (u) { return [30 + 180 * u, 84 - 62 * exp(-pow((u - .45) / .17, 2)) - 18 * ramp(u, .6, .9) * -1 * 0 + 0]; };
    var d = curve(function (u) { var x = 30 + 180 * u; var y = 78 - 56 * exp(-pow((u - .45) / .16, 2)) + 22 * sm((u - .55) / .35); return [x, y]; }, 0, 1, 60);
    var dc = curve(function (u) { var x = 30 + 180 * u; var y = 78 - 34 * exp(-pow((u - .45) / .16, 2)) + 22 * sm((u - .55) / .35); return [x, y]; }, 0, 1, 60);
    s += P(d, 'sa nf', 'stroke-width:2.8') + P(dc, 'sc nf', 'stroke-width:2;stroke-dasharray:4 4;opacity:.8');
    s += G(0, 0, C(0, 0, 5, 'fc') + C(0, 0, 9, 'sc nf', 'opacity:.4'), mv(T0, function (t) { var u = ramp(t, .05, .95); var x = 30 + 180 * u; var y = 78 - 56 * exp(-pow((u - .45) / .16, 2)) + 22 * sm((u - .55) / .35); return { x: x, y: y - 6 }; }, { n: 60 }));
    s += T(100, 18, 'Ea', 'tx sm', 'fill:var(--c)') + L(120, 20, 120, 78, 'sc', 'stroke-dasharray:3 3;opacity:.6;stroke-width:1.2') + T(206, 76, 'catalyst', 'tx sm', 'fill:var(--c);text-anchor:end');
    return s;
  };
  SC['hsc-chem-electrolysis'] = function () {
    var T0 = 3, s = beaker(40, 50, 160, 54, 'fb', .8);
    s += P('M80,104 V36 M160,104 V36', 'sw nf', 'stroke-width:7;opacity:.55') + R(76, 56, 8, 36, 'fw', 'opacity:.8', 2) + R(156, 56, 8, 36, 'fw', 'opacity:.8', 2);
    s += P('M76,48 V20 H84 V48', 'sw nf', 'stroke-width:2;opacity:.7') + P('M156,48 V20 H164 V48', 'sw nf', 'stroke-width:2;opacity:.7');
    s += G(80, 48, R(-4, -28, 8, 28, 'fb', 'transform-origin:0 0;opacity:.7'), mv(T0 * 2, function (t) { return { sy: 0.1 + 0.9 * t * 0 + 0.0 }; }, { n: 2 })) ;
    for (var i = 0; i < 4; i++) s += G(80 + (i % 2 ? 2 : -2), 0, C(0, 0, 2.4, 'fw'), mv(1.6, function (t) { return { y: lerp(88, 24, t), o: min(1, min(t / .1, (1 - t) / .1)) }; }, { n: 8, d: i / 6 }));
    for (var j = 0; j < 2; j++) s += G(160 + (j % 2 ? 2 : -2), 0, C(0, 0, 2.8, 'fc'), mv(2, function (t) { return { y: lerp(88, 24, t), o: min(1, min(t / .1, (1 - t) / .1)) }; }, { n: 8, d: j / 3 }));
    s += T(80, 114, 'H₂', 'tx sm', 'fill:var(--a)') + T(160, 114, 'O₂', 'tx sm', 'fill:var(--c)') + T(120, 22, '2 : 1', 'tx', 'fill:var(--c)');
    return s;
  };
  SC['sim-equilibrium-shift'] = function () {
    var T0 = 5, s = P('M104,106 L120,84 L136,106Z', 'fg', '') ;
    s += G(120, 84, R(-76, -3, 152, 6, 'fa', '', 3) + G(-62, 0, R(-14, -26, 28, 26, 'fb', '', 4) + T(0, -9, 'A', 'tx sm', 'fill:#0a1020'), mv(T0, function (t) { return { r: 0 }; }, { n: 2 })) + G(62, 0, R(-14, -26, 28, 26, 'fc', '', 4) + T(0, -9, 'B', 'tx sm', 'fill:#0a1020'), ''), mv(T0, function (t) { return { r: 10 * sin(TAU * t) * (0.5 + 0.5 * sin(TAU * t * .5)) }; }, { n: 32 }));
    s += G(120, 30, P('M-26,0 h52 m-8,-5 l8,5 l-8,5 M26,12 h-52 m8,-5 l-8,5 l8,5', 'sc nf', 'stroke-width:2'), pulse(2.5, .9, 1.1));
    s += T(120, 118, 'Le Chatelier', 'tx sm', 'fill:var(--c)');
    return s;
  };
  SC['sim-solubility-temperature'] = function () {
    var T0 = 5, s = axes(20, 100, 120, 80, 'T', 'S');
    var f = function (u) { return [20 + 120 * u, 96 - 70 * pow(u, 1.5) - 4]; };
    s += P(curve(f, 0, 1, 24), 'sb nf', 'stroke-width:2.8') + P(curve(f, 0, 1, 24) + ' L140,96 L20,96Z', 'fb', 'opacity:.14');
    s += G(0, 0, C(0, 0, 5, 'fc') + C(0, 0, 9, 'sc nf', 'opacity:.4'), mv(T0, function (t) { var p = f(hc(t)); return { x: p[0], y: p[1] }; }, { n: 28 }));
    s += beaker(160, 54, 56, 48, 'fb', .75);
    for (var i = 0; i < 6; i++) s += G(168 + i * 7, 94 - (i % 2) * 3, R(-3, -3, 6, 6, 'fw', 'opacity:.9', 1), mv(T0, function (t) { return { o: 1 - ramp(t, .1 + i * .06, .3 + i * .08) * (1 - ramp(t, .8, .95)) , s: 1 - .5 * ramp(t, .1 + i * .06, .3 + i * .08) }; }, { n: 24 }));
    s += T(188, 46, '↑T → ↑S', 'tx sm', 'fill:var(--c)');
    return s;
  };
  SC['sim-enthalpy-profile'] = function () {
    var T0 = 4, s = L(24, 36, 100, 36, 'sa', 'stroke-width:3') + L(140, 78, 216, 78, 'sb', 'stroke-width:3') + T(62, 28, 'reactants', 'tx sm', 'fill:var(--a)') + T(178, 96, 'products', 'tx sm', 'fill:var(--b)');
    s += P('M100,36 Q120,36 120,56 Q120,78 140,78', 'sw nf', 'stroke-width:1.4;stroke-dasharray:3 3;opacity:.5');
    s += G(120, 36, '<g transform="rotate(90)">' + arrow(40, 'c', 'stroke-width:3') + '</g>', mv(T0, function (t) { return { sy: lerp(.1, 1, ramp(t, .4, .7)) }; }, { n: 24 }));
    s += T(138, 56, 'ΔH < 0', 'tx sm', 'fill:var(--c);text-anchor:start');
    s += G(0, 0, C(0, 0, 5, 'fc'), mv(T0, function (t) { var u = ramp(t, .15, .75); return { x: lerp(60, 178, u), y: lerp(30, 72, sm(ramp(u, .4, .7))), o: min(1, t / .06) * (1 - ramp(t, .92, 1)) }; }, { n: 36 }));
    for (var i = 0; i < 3; i++) s += G(178, 66, P('M0,0 q-4,-6 0,-10 q4,-5 0,-10', 'sk nf', 'stroke:#f87171;stroke-width:2'), mv(1.4, function (t) { return { y: -16 * t, o: (1 - t) * ramp(0.5 + 0 * t, 0, 1) }; }, { n: 8, d: i / 3 + .3 }));
    return s;
  };
  SC['sim-redox-electron-transfer'] = function () {
    var T0 = 4, s = '';
    s += G(56, 60, atom(18, 'fa', 'Zn'), '') + G(184, 60, atom(18, 'fb', 'Cu'), '');
    s += G(0, 60, C(0, 0, 3.8, 'fc') + T(0, -6, 'e⁻', 'tx sm', 'fill:var(--c);font-size:8px'), mv(T0, function (t) { var u = ramp(t, .2, .6); return { x: lerp(78, 162, u), y: -22 * sin(PI * u), o: u > 0 && u < 1 ? 1 : 0 }; }, { n: 28 }));
    s += G(56, 30, T(0, 0, 'Zn²⁺', 'tx sm', 'fill:var(--a)'), mv(T0, function (t) { return { o: ramp(t, .55, .65) * (1 - ramp(t, .92, 1)) }; }, { n: 24 })) + G(184, 30, T(0, 0, 'Cu²⁺', 'tx sm', 'fill:var(--b)'), mv(T0, function (t) { return { o: 1 - ramp(t, .2, .3) + ramp(t, .85, .95) }; }, { n: 24 }));
    s += T(56, 104, 'oxidation', 'tx sm', 'fill:var(--a)') + T(184, 104, 'reduction', 'tx sm', 'fill:var(--b)') + T(120, 112, 'OIL RIG', 'tx sm', 'fill:var(--c)');
    return s;
  };

  /* ---- applied / organic / quantitative ---- */
  SC['hsc-chem-functional-groups'] = function () {
    var T0 = 6, s = P('M22,70 L48,52 L74,70 L100,52 L126,70', 'sw nf', 'stroke-width:3;opacity:.7');
    [[22, 70], [48, 52], [74, 70], [100, 52], [126, 70]].forEach(function (p) { s += C(p[0], p[1], 5, 'fw', 'opacity:.85'); });
    [[154, 54, 'OH', 'fa', 0], [190, 82, 'COOH', 'fb', .25], [168, 24, 'NH₂', 'fc', .5], [210, 44, 'C=O', 'fk', .75]].forEach(function (g) {
      s += L(126, 70, g[0], g[1], 'sw', 'stroke-width:1.4;opacity:.3;stroke-dasharray:3 3');
      s += G(g[0], g[1], C(0, 0, 14, g[3], 'opacity:.9') + T(0, 3.5, g[2], 'tx sm', 'fill:#0a1020;font-size:' + (g[2].length > 3 ? 8 : 9) + 'px'), mv(T0, function (t) { return { s: 1 + .28 * bump(t, g[4] + .1, .14), o: .5 + .5 * bump(t, g[4] + .1, .3) }; }, { n: 36 }));
    });
    s += T(74, 108, 'R –', 'tx sm', 'opacity:.7');
    return s;
  };
  SC['hsc-chem-isomers'] = function () {
    var T0 = 5, s = '';
    var chain = P('M40,70 L70,52 L100,70 L130,52', 'sw nf', 'stroke-width:3.4') + [[40, 70], [70, 52], [100, 70], [130, 52]].map(function (p) { return C(p[0], p[1], 7, 'fa'); }).join('');
    var branch = P('M54,76 L84,58 L114,76 M84,58 L84,26', 'sw nf', 'stroke-width:3.4') + [[54, 76], [84, 58], [114, 76], [84, 26]].map(function (p) { return C(p[0], p[1], 7, 'fb'); }).join('');
    s += G(0, 0, chain, mv(T0, function (t) { return { o: 1 - ramp(t, .4, .5) + ramp(t, .9, 1), y: 6 * ramp(t, .4, .5) }; }, { n: 28 }));
    s += G(0, 0, branch, mv(T0, function (t) { return { o: ramp(t, .45, .55) * (1 - ramp(t, .9, 1)), y: 6 * (1 - ramp(t, .45, .55)) }; }, { n: 28 }));
    s += G(190, 60, P('M-14,-6 h28 m-6,-5 l6,5 l-6,5 M14,6 h-28 m6,-5 l-6,5 l6,5', 'sc nf', 'stroke-width:2'), spin(5));
    s += T(70, 108, 'C₄H₁₀', 'tx sm', 'fill:var(--c)') + T(190, 108, 'same formula', 'tx sm', 'opacity:.7');
    return s;
  };
  SC['hsc-chem-solution-prep'] = function () {
    var T0 = 5, s = P('M104,18 L104,50 Q80,60 80,86 Q80,106 100,106 L140,106 Q160,106 160,86 Q160,60 136,50 L136,18', 'sw nf', 'stroke-width:2.4;opacity:.75');
    s += L(100, 30, 140, 30, 'sc', 'stroke-width:1.6;opacity:.8;stroke-dasharray:4 3') + T(176, 33, 'mark', 'tx sm', 'fill:var(--c)');
    s += G(120, 106, P('M-38,0 Q-40,-18 -22,-34 L-16,-50 L16,-50 L22,-34 Q40,-18 38,0Z', 'fb', 'transform-origin:0 0;opacity:.45'), mv(T0, function (t) { return { sy: 0.28 + 0.72 * ramp(t, .1, .8) }; }, { n: 24 }));
    for (var i = 0; i < 5; i++) s += G(108 + i * 6, 0, R(-2.5, -2.5, 5, 5, 'fw', 'opacity:.9', 1), mv(T0, function (t) { var u = ramp(t, i * .04, .3 + i * .04); return { y: lerp(8, 90, u), o: (1 - ramp(t, .35 + i * .04, .5)) * (t > i * .04 ? 1 : 0) }; }, { n: 24 }));
    s += G(120, 0, drop('fb'), mv(1.3, function (t) { return { y: lerp(8, 30, t * t), o: ramp(.5, 0, 1) }; }, { n: 8 }));
    s += T(40, 70, 'n = m/M', 'tx sm', 'fill:var(--c)');
    return s;
  };
  SC['hsc-chem-solubility'] = function () {
    var T0 = 5, s = beaker(80, 44, 80, 62, 'fb', .72);
    s += G(120, 0, L(0, 14, 0, 0, 'sw', 'stroke-width:2.4;opacity:.7'), osc(2, 22, 'x'));
    for (var i = 0; i < 4; i++) s += G(92 + (i * 17) % 56, 98 - (i % 3) * 3, R(-3.4, -3.4, 6.8, 6.8, 'fw', 'opacity:.95', 1.5), mv(T0, function (t) { var u = ramp(t, .12 + i * .05, .5 + i * .05); return { s: 1 - u, o: 1 - u * (1 - ramp(t, .9, .98)) }; }, { n: 24 }));
    var dd = ''; for (var j = 0; j < 8; j++) dd += C(92 + (j * 9) % 60, 62 + (j * 7) % 34, 2, 'fc'); s += G(0, 0, dd, mv(T0, function (t) { return { o: ramp(t, .3, .6) * (1 - ramp(t, .9, .98)) }; }, { n: 16 }));
    s += R(184, 26, 8, 62, 'sw nf', 'stroke-width:1.6;opacity:.6', 4) + G(188, 88, R(-3, -60, 6, 60, 'fk', 'transform-origin:0 0', 3), mv(T0, function (t) { return { sy: 0.2 + 0.8 * ramp(t, .1, .7) * (1 - ramp(t, .9, 1)) }; }, { n: 24 })) + C(188, 94, 8, 'fk');
    return s + T(50, 40, 'dissolve', 'tx sm', 'fill:var(--c)');
  };
  SC['sim-solution-concentration'] = function () {
    var s = '';
    [[46, 4, 'dilute'], [120, 8, '1 M'], [194, 14, 'conc.']].forEach(function (b, i) {
      s += beaker(b[0] - 26, 34, 52, 62, 'fb', .8, ';opacity:' + (.25 + .3 * i));
      var dots = '';
      for (var k = 0; k < b[1]; k++) dots += C(b[0] - 18 + (k * 7) % 36, 52 + (k * 11) % 36, 2.4, k % 2 ? 'fc' : 'fa');
      s += G(0, 0, dots, mv(2.6 + i * .5, function (t) { return { x: 3 * sin(TAU * t), y: 3 * cos(TAU * t * 2) }; }, { n: 12 }));
      s += T(b[0], 112, b[2], 'tx sm', 'fill:var(--c)');
    });
    return s + T(120, 22, 'M = n / V', 'tx sm', 'opacity:.8');
  };
  SC['sim-gas-reaction-volume'] = function () {
    var T0 = 5, s = flask(70, 66, 56, 40, '') + R(56, 56, 28, 12, 'sw nf', 'stroke-width:2;opacity:.6', 2);
    s += G(70, 56, E(0, -16, 22, 18, 'fa', 'opacity:.5') + E(0, -16, 22, 18, 'sa nf', 'stroke-width:2.2') + P('M-5,-1 h10', 'sw nf', 'stroke-width:2'), mv(T0, function (t) { return { sx: .78 + .3 * hc(t), sy: .78 + .3 * hc(t) }; }, { n: 24 }));
    s += G(70, 80, molecules(-16, -12, 32, 28, 6, 1, 2.4), '');
    s += G(70, 112, P('M-6,0 q-4,-12 0,-18 q3,5 7,-2 q5,8 -1,20Z', 'fc', ''), mv(.6, function (t) { return { sy: .8 + .35 * sin(TAU * t * 2), o: .5 + .5 * hc(T0 * 0 + t) }; }, { n: 8 }));
    s += axes(130, 100, 90, 70, 'T', 'V') + L(132, 96, 218, 34, 'sb', 'stroke-width:2.6') + G(132, 96, C(0, 0, 4.6, 'fc'), mv(T0, function (t) { return { x: 84 * hc(t), y: -62 * hc(t) }; }, { n: 24 }));
    s += T(176, 112, 'V ∝ T', 'tx sm', 'fill:var(--c)');
    return s;
  };
  SC['sim-reaction-rate-control'] = function () {
    var T0 = 5, s = axes(20, 100, 130, 80, 't', 'c');
    var A = curve(function (u) { return [20 + 130 * u, 100 - 66 * exp(-3 * u)]; }, 0, 1, 30), B = curve(function (u) { return [20 + 130 * u, 100 - 66 * (1 - exp(-3 * u))]; }, 0, 1, 30);
    s += '<path d="' + A + '" class="sa nf" pathLength="1" style="stroke-width:2.8;stroke-dasharray:1"/>';
    s += '<path d="' + B + '" class="sc nf" pathLength="1" style="stroke-width:2.8;stroke-dasharray:1"/>';
    s += T(40, 42, '[A]', 'tx sm', 'fill:var(--a)') + T(130, 42, '[P]', 'tx sm', 'fill:var(--c)');
    s += R(162, 24, 62, 70, 'sw nf', 'stroke-width:2;opacity:.5', 5) + molecules(164, 26, 58, 66, 5, 2, 3.2);
    s += G(190, 60, P('M0,-8 L2.4,-2.4 L8,0 L2.4,2.4 L0,8 L-2.4,2.4 L-8,0 L-2.4,-2.4Z', 'fc', ''), mv(1.4, function (t) { return { s: 2 * bump(t, .5, .1), o: bump(t, .5, .1) }; }, { n: 16 }));
    return s;
  };
  SC['sim-acid-base-titration'] = function () {
    var T0 = 5, s = axes(20, 100, 130, 82, 'V', 'pH');
    var d = curve(function (u) { return [20 + 130 * u, 96 - (14 + 60 / (1 + exp(-(u - .5) * 22)))]; }, 0, 1, 50);
    s += '<path d="' + d + '" class="sb nf" pathLength="1" style="stroke-width:3;stroke-dasharray:1"/>';
    s += L(85, 100, 85, 22, 'sc', 'stroke-dasharray:3 3;stroke-width:1.2;opacity:.6') + G(85, 58, C(0, 0, 4, 'fc') + C(0, 0, 8, 'sc nf', 'stroke-width:2'), mv(T0, function (t) { return { s: 1 + 1.6 * bump(t, .6, .1), o: .35 + .65 * bump(t, .6, .22) }; }, { n: 28 }));
    s += T(85, 14, 'equivalence', 'tx sm', 'fill:var(--c)');
    s += R(180, 10, 12, 46, 'sw nf', 'stroke-width:2;opacity:.7', 3) + G(186, 56, R(-4.5, -44, 9, 44, 'fb', 'transform-origin:0 0;opacity:.7', 2), mv(T0, function (t) { return { sy: 1 - .6 * t }; }, { n: 8 })) + G(186, 0, drop('fb'), mv(.9, function (t) { return { y: lerp(60, 78, t), o: t < .92 ? 1 : 0 }; }, { n: 8 }));
    s += flask(186, 84, 40, 28, '') + G(186, 112, P('M-17,0 L-8,-18 L8,-18 L17,0Z', 'fk', 'opacity:.8'), mv(T0, function (t) { return { o: ramp(t, .5, .65) }; }, { n: 24 }));
    return s;
  };
  SC['sim-dilution-workbench'] = function () {
    var T0 = 5, s = flask(120, 40, 76, 66, '') + G(120, 106, P('M-38,0 L-24,-32 L-8,-42 L8,-42 L24,-32 L38,0Z', 'fk', 'transform-origin:0 0;opacity:.85'), mv(T0, function (t) { return { sy: .45 + .45 * ramp(t, .1, .8), o: 1 - .65 * ramp(t, .1, .85) }; }, { n: 24 }));
    s += G(120, 106, P('M-38,0 L-24,-32 L-8,-42 L8,-42 L24,-32 L38,0Z', 'fb', 'transform-origin:0 0;opacity:.0'), mv(T0, function (t) { return { sy: .45 + .45 * ramp(t, .1, .8), o: .45 * ramp(t, .1, .85) }; }, { n: 24 }));
    s += G(40, 24, P('M0,0 L0,40 L-4,50 L4,50 L0,40', 'sw nf', 'stroke-width:2;opacity:.75') + P('M-4,0 h8 v30 h-8z', 'fk', 'opacity:.8') , mv(T0, function (t) { return { x: lerp(0, 80, ramp(t, .0, .3)) * (1 - ramp(t, .3, .45)) , y: 0 }; }, { n: 24 }));
    s += G(120, 0, drop('fb'), mv(.9, function (t) { return { y: lerp(10, 54, t * t), o: ramp(.5, 0, 1) }; }, { n: 8 }));
    s += T(194, 56, 'C₁V₁ = C₂V₂', 'tx sm', 'fill:var(--c);text-anchor:middle');
    return s;
  };
  SC['sim-limiting-reagent'] = function () {
    var T0 = 5, s = '';
    [[50, 'fa', 'A', 1, .0], [100, 'fb', 'B', .62, .0]].forEach(function (b) {
      s += R(b[0] - 14, 24, 28, 70, 'fg', '', 6) + G(b[0], 94, R(-14, -70, 28, 70, b[1], 'transform-origin:0 0;opacity:.95', 6), mv(T0, function (t) { var u = ramp(t, .1, .75) ; return { sy: 1 - b[3] * u * (b[2] === 'B' ? 1.6 : 1) * (b[2] === 'B' ? 1 : .62) }; }, { n: 24 })) + T(b[0], 110, b[2], 'tx sm');
    });
    s += R(176, 24, 28, 70, 'fg', '', 6) + G(190, 94, R(-14, -70, 28, 70, 'fc', 'transform-origin:0 0', 6), mv(T0, function (t) { return { sy: .02 + .6 * ramp(t, .1, .75) }; }, { n: 24 })) + T(190, 110, 'C', 'tx sm');
    s += P('M122,60 h30 m-6,-5 l6,5 l-6,5', 'sc nf', 'stroke-width:2');
    return s + T(80, 16, 'A + B → C', 'tx sm', 'fill:var(--c)');
  };
  SC['sim-molarity-prep'] = function () {
    var T0 = 5, s = '';
    s += R(40, 92, 90, 8, 'fg', '', 3) + R(60, 100, 50, 8, 'fa', 'opacity:.6', 3) + G(85, 92, P('M-26,0 a26,26 0 0,1 52,0', 'sw nf', 'stroke-width:2.2;opacity:.6') + G(0, 0, L(0, 0, 0, -20, 'sc', 'stroke-width:2.6') + C(0, 0, 3, 'fw'), mv(T0, function (t) { return { r: -70 + 120 * ramp(t, .1, .6) }; }, { n: 24 })), '');
    for (var i = 0; i < 7; i++) s += G(85 + (i * 7 % 20) - 10, 0, R(-2.3, -2.3, 4.6, 4.6, 'fw', 'opacity:.9', 1), mv(1.4, function (t) { return { y: lerp(34, 88, t * t), o: min(1, t / .1) * (1 - ramp(t, .92, 1)) * ramp(T0 * 0 + .6, 0, 1) }; }, { n: 10, d: i / 7 }));
    s += P('M180,26 L180,52 Q160,60 160,80 Q160,102 180,102 L200,102 Q220,102 220,80 Q220,60 200,52 L200,26', 'sw nf', 'stroke-width:2.2;opacity:.75').replace('M180', 'M170').replace('L180,52', 'L170,52');
    s += G(190, 102, P('M-28,0 Q-30,-16 -16,-30 L-10,-42 L10,-42 L16,-30 Q30,-16 28,0Z', 'fb', 'transform-origin:0 0;opacity:.5'), mv(T0, function (t) { return { sy: .2 + .8 * ramp(t, .15, .85) }; }, { n: 24 }));
    return s + T(120, 20, 'M = n / V', 'tx sm', 'fill:var(--c)');
  };
  SC['sim-ph-concentration'] = function () {
    var T0 = 5, s = '';
    for (var i = 0; i < 7; i++) { var h = 70 * pow(0.5, i * 0.9); s += R(24 + i * 20, 96 - 70, 14, 70, 'fg', '', 3) + G(31 + i * 20, 96, R(-7, -h, 14, h, i % 2 ? 'fa' : 'fb', 'transform-origin:0 0;opacity:.9', 3), pulse(T0, 1, 1, 0).replace(/animation:[^;]+;?/, '') + '') + T(31 + i * 20, 108, String(i + 1), 'tx sm', 'opacity:.7'); }
    s += G(0, 0, P('M0,0 l-6,-9 h12z', 'fc') + L(0, 0, 0, 62, 'sc', 'stroke-width:1.2;stroke-dasharray:2 3;opacity:.6'), mv(T0, function (t) { return { x: 31 + 120 * hc(t), y: 20 }; }, { n: 28 }));
    return s + T(170, 40, '[H⁺] = 10⁻ᵖᴴ', 'tx sm', 'fill:var(--c)');
  };
  SC['sim-galvanic-cell'] = function () {
    var T0 = 4, s = beaker(20, 54, 78, 50, 'fa', .75, ';opacity:.35') + beaker(142, 54, 78, 50, 'fb', .75, ';opacity:.35');
    s += G(58, 104, R(-5, -56, 10, 56, 'fw', 'transform-origin:0 0;opacity:.85', 2), mv(T0, function (t) { return { sy: 1 - .35 * t }; }, { n: 8 })) + G(182, 104, R(-5, -56, 10, 56, 'fc', 'transform-origin:0 0', 2), mv(T0, function (t) { return { sy: .7 + .3 * t }; }, { n: 8 }));
    s += P('M58,48 V16 H182 V48', 'sw nf', 'stroke-width:2;opacity:.6') + P('M92,54 V40 Q120,24 148,40 V54', 'sc nf', 'stroke-width:6;opacity:.3');
    for (var i = 0; i < 3; i++) s += G(0, 16, C(0, 0, 2.8, 'fc'), mv(T0 * .6, function (t) { return { x: lerp(58, 182, t), o: min(1, min(t / .05, (1 - t) / .05)) }; }, { n: 8, d: i / 3 }));
    s += G(120, 24, '<path d="M-12,0 a12,12 0 0,1 24,0" class="sw nf" style="stroke-width:2"/>' + G(0, 0, L(0, 0, 0, -10, 'sc', 'stroke-width:2.4'), osc(3, 36, 'r')), '');
    s += T(58, 116, 'Zn', 'tx sm', 'fill:var(--a)') + T(182, 116, 'Cu', 'tx sm', 'fill:var(--c)') + T(120, 74, 'salt bridge', 'tx sm', 'opacity:.6;font-size:7px');
    return s;
  };
  SC['sim-electrolysis-faraday'] = function () {
    var T0 = 5, s = beaker(24, 54, 80, 50, 'fb', .75, ';opacity:.4');
    s += G(64, 104, R(-6, -56, 12, 56, 'fw', 'opacity:.7', 2), '') + G(64, 76, R(-8, -24, 16, 24, 'fc', 'transform-origin:0 0', 3), mv(T0, function (t) { return { sy: .15 + .85 * t, sx: 1 }; }, { n: 8 }));
    s += G(160, 28, C(0, 0, 16, 'fg') + C(0, 0, 16, 'sw nf', 'stroke-width:2.2') + G(0, 0, L(0, 0, 0, -12, 'sc', 'stroke-width:2.4') + C(0, 0, 2, 'fw'), spin(T0)), '') + T(160, 56, 't', 'tx sm', 'opacity:.8');
    s += axes(130, 108, 90, 44, 'Q', 'm') + L(132, 106, 214, 76, 'sb', 'stroke-width:2.6') + G(132, 106, C(0, 0, 4, 'fc'), mv(T0, function (t) { return { x: 82 * t, y: -30 * t, o: 1 - ramp(t, .95, 1) }; }, { n: 12 }));
    s += T(180, 118, 'm = ZIt', 'tx sm', 'fill:var(--c)');
    return s;
  };
  SC['sim-alkane-formula-builder'] = function () {
    var T0 = 6, s = '';
    for (var i = 0; i < 5; i++) {
      var x = 34 + i * 40, y = i % 2 ? 70 : 52, dy = i % 2 ? 20 : -20;
      var bond = i ? L(34 + (i - 1) * 40 - x, ((i - 1) % 2 ? 70 : 52) - y, 0, 0, 'sw', 'stroke-width:3;opacity:.8') : '';
      s += G(x, y, bond + L(0, 0, 0, dy, 'sw', 'stroke-width:2;opacity:.7') + C(0, dy * 1.2, 4.4, 'fw') + C(0, 0, 9, 'fa') + T(0, 3.5, 'C', 'tx sm', 'fill:#0a1020'),
        mv(T0, function (t) { var u = ramp(t, i * .12 + .04, i * .12 + .14); return { s: u * (1 + .25 * bump(t, i * .12 + .12, .04)), o: u * (1 - ramp(t, .92, .99)) }; }, { n: 32 }));
    }
    return s + T(120, 112, 'CₙH₂ₙ₊₂', 'tx', 'fill:var(--c)');
  };

  /* =====================================================================================
     HIGHER MATH
     ===================================================================================== */
  function grid(x0, y0, x1, y1, step, op) { var s = ''; for (var x = x0; x <= x1; x += step) s += L(x, y0, x, y1, 'sw', 'stroke-width:.8;opacity:' + (op || .12)); for (var y = y0; y <= y1; y += step) s += L(x0, y, x1, y, 'sw', 'stroke-width:.8;opacity:' + (op || .12)); return s; }
  function cartes(cx, cy, hw, hh) { return grid(cx - hw, cy - hh, cx + hw, cy + hh, 20) + L(cx - hw, cy, cx + hw, cy, 'sw', 'stroke-width:1.4;opacity:.5') + L(cx, cy - hh, cx, cy + hh, 'sw', 'stroke-width:1.4;opacity:.5'); }

  SC['hsc-math-matrix'] = function () {
    var T0 = 6, s = cartes(120, 62, 100, 52);
    s += G(120, 62, R(0, -40, 40, 40, 'fa', 'opacity:.4;transform-box:view-box') + R(0, -40, 40, 40, 'sa nf', 'stroke-width:2.2'), mv(T0, function (t) { var u = t * 3, k = floor(u), f = sm(u - k), M = [[1, 0, 0, 1], [1.6, 0, 0, .8], [1, 0, .8, 1], [1, 0, 0, 1]]; var a = M[k % 3], b = M[(k + 1) % 3 === 0 && k === 2 ? 0 : k + 1]; if (k >= 2) b = M[0]; return { m: [lerp(a[0], b[0], f), -lerp(a[1], b[1], f), -lerp(a[2], b[2], f), lerp(a[3], b[3], f)] }; }, { n: 36 }));
    s += G(120, 62, arrow(40, 'c', 'stroke-width:2.6'), mv(T0, function (t) { var a = t * 3, k = floor(a), f = sm(a - k), v = [1, 1.6, 1, 1]; return { sx: lerp(v[k % 3], v[(k + 1) % 3 + (k >= 2 ? -((k + 1) % 3) : 0)], f) }; }, { n: 36 }));
    s += T(204, 108, '[a b; c d]', 'tx sm', 'fill:var(--c);text-anchor:end');
    return s;
  };
  SC['sim-matrix-transform-studio'] = function () {
    var T0 = 6, s = cartes(120, 62, 100, 52);
    var F = P('M0,0 h6 v-30 h22 v6 h-16 v8 h12 v6 h-12 v10 z', 'fb', 'opacity:.9');
    s += G(120, 62, F + P('M0,0 h6 v-30 h22 v6 h-16 v8 h12 v6 h-12 v10 z', 'sb nf', 'stroke-width:1.4'), mv(T0, function (t) { var a = TAU * ramp(t, .1, .55), sc = lerp(1, 1.35, bump(t, .75, .2)); return { x: 30 * ramp(t, .6, .9) - 30 * ramp(t, .9, 1) * 0 + 0, r: deg(a), s: sc }; }, { n: 40 }));
    s += G(120, 62, F, mv(T0, function (t) { return { o: .18 }; }, { n: 2 }));
    s += T(204, 108, 'R(θ) · T', 'tx sm', 'fill:var(--c);text-anchor:end');
    return s;
  };
  SC['sim-determinant-visualizer'] = function () {
    var T0 = 5, s = cartes(110, 62, 100, 52);
    var sh = function (t) { return cos(TAU * t); };
    s += G(86, 78, R(0, -44, 44, 44, 'fa', 'opacity:.45') + R(0, -44, 44, 44, 'sa nf', 'stroke-width:2.2') + L(0, 0, 44, 0, 'sc', 'stroke-width:3'), mv(T0, function (t) { var d = cos(TAU * t); return { m: [1 + .0, 0, .5 * sin(TAU * t), d] }; }, { n: 36 }));
    s += G(190, 64, T(0, 0, 'det', 'tx sm', 'fill:var(--c)') + R(-22, 8, 44, 8, 'fg', '', 4), '') + G(190, 72, R(0, 0, 22, 8, 'fb', 'transform-origin:0 0', 4) + R(-22, 0, 22, 8, 'fk', 'transform-origin:100% 0', 4), mv(T0, function (t) { return { x: 0 }; }, { n: 2 })) ;
    s += G(190, 80, R(-1, -5, 2, 10, 'fw', ''), mv(T0, function (t) { return { x: 22 * cos(TAU * t) }; }, { n: 28 }));
    return s;
  };
  SC['sim-vector-component-lab'] = function () {
    var T0 = 6, ox = 70, oy = 90, len = 64, s = axes(ox - 30, oy, 150, 76, 'i', 'j');
    var a = function (t) { return (20 + 52 * hc(t)) * PI / 180; };
    s += G(ox, oy, arrow(len, 'a', 'stroke-width:3.2'), mv(T0, function (t) { return { r: -deg(a(t)) }; }, { n: 30 }));
    s += R(176, 20, 12, 66, 'fg', '', 4) + R(198, 20, 12, 66, 'fg', '', 4);
    s += G(182, 86, R(-6, -66, 12, 66, 'fc', 'transform-origin:0 0', 4), mv(T0, function (t) { return { sy: cos(a(t)) }; }, { n: 30 })) + G(204, 86, R(-6, -66, 12, 66, 'fb', 'transform-origin:0 0', 4), mv(T0, function (t) { return { sy: sin(a(t)) }; }, { n: 30 }));
    s += T(182, 100, 'x', 'tx sm', 'fill:var(--c)') + T(204, 100, 'y', 'tx sm', 'fill:var(--b)') + T(120, 112, '|v| = √(x²+y²)', 'tx sm', 'opacity:.8');
    return s;
  };
  SC['sim-dot-cross-experiment'] = function () {
    var T0 = 5, s = '';
    var a = function (t) { return TAU * t; };
    s += C(60, 62, 34, 'sw nf', 'stroke-width:1.2;stroke-dasharray:3 4;opacity:.4') + G(60, 62, arrow(34, 'a', 'stroke-width:3'), '') + G(60, 62, arrow(34, 'b', 'stroke-width:3'), spin(T0, 0, -1));
    s += R(120, 24, 14, 76, 'fg', '', 5) + R(146, 24, 14, 76, 'fg', '', 5);
    s += G(127, 62, R(-7, -38, 14, 38, 'fc', 'transform-origin:0 0', 5), mv(T0, function (t) { return { sy: cos(a(t)) }; }, { n: 32 })) + G(153, 62, R(-7, -38, 14, 38, 'fk', 'transform-origin:0 0', 5), mv(T0, function (t) { return { sy: sin(a(t)) }; }, { n: 32 }));
    s += T(127, 112, 'cos θ', 'tx sm', 'fill:var(--c)') + T(153, 112, 'sin θ', 'tx sm', 'fill:#f472b6');
    s += G(200, 62, C(0, 0, 14, 'sw nf', 'stroke-width:2;opacity:.8') + G(0, 0, C(0, 0, 3.4, 'fw') , mv(T0, function (t) { return { s: abs(sin(a(t))) < .2 ? .3 : 1, o: 1 }; }, { n: 32 })) + L(-9, -9, 9, 9, 'sw', 'opacity:0'), '') + T(200, 92, 'a × b', 'tx sm', 'opacity:.8') + T(200, 36, '⊙', 'tx big', 'fill:var(--b)');
    return s;
  };
  SC['hsc-math-line'] = function () {
    var T0 = 6, s = cartes(110, 62, 100, 52);
    s += G(110, 62, L(-100, 0, 100, 0, 'sa', 'stroke-width:3.4'), mv(T0, function (t) { return { y: -16 * sin(TAU * t) * 0 - 10, r: -(10 + 50 * hc(t)) }; }, { n: 32 }));
    s += G(110, 52, C(0, 0, 4.6, 'fc'), '');
    s += G(110, 62, G(0, -10, C(0, 0, 4.6, 'fc') + C(0, 0, 9, 'sc nf', 'opacity:.4'), mv(T0, function (t) { var a = (10 + 50 * hc(t)) * PI / 180; return { x: 70 * cos(a) * 0 , y: 0 }; }, { n: 2 })), '');
    s += G(0, 0, '', '') + T(214, 22, 'y = mx + c', 'tx sm', 'fill:var(--c);text-anchor:end');
    s += G(110, 62, G(0, 0, P('M0,-10 L40,-10 L40,-10', 'sc nf', 'stroke-width:1.6;stroke-dasharray:3 3;opacity:.8'), ''), '');
    return s;
  };
  SC['hsc-math-circle'] = function () {
    var T0 = 6, s = cartes(120, 62, 100, 52);
    s += G(0, 0, C(0, 0, 30, 'fa', 'opacity:.18') + C(0, 0, 30, 'sa nf', 'stroke-width:2.8') + C(0, 0, 3.4, 'fc') + G(0, 0, L(0, 0, 30, 0, 'sc', 'stroke-width:2'), spin(3)), mv(T0, function (t) { var r = 1 + .3 * sin(TAU * t * 2); return { x: 120 + 48 * cos(TAU * t), y: 62 + 20 * sin(TAU * t), s: r }; }, { n: 40 }));
    s += T(214, 112, '(x−h)²+(y−k)²=r²', 'tx sm', 'fill:var(--c);text-anchor:end');
    return s;
  };
  SC['hsc-math-trig'] = function () {
    var T0 = 6, cx = 56, cy = 62, r = 34, s = C(cx, cy, r, 'sw nf', 'stroke-width:1.6;opacity:.5') + L(cx - r - 8, cy, 226, cy, 'sw', 'opacity:.35');
    var ci = uid('c'); s += clip(ci, R(100, 14, 124, 96));
    s += '<path d="' + curve(function (u) { return [100 + 120 * u, cy - r * sin(TAU * u)]; }, 0, 1, 48) + '" class="sa nf" pathLength="1" style="stroke-width:2.8;stroke-dasharray:1"/>';
    s += G(cx, cy, G(0, 0, L(0, 0, r, 0, 'sc', 'stroke-width:2.4') + C(r, 0, 4.4, 'fc'), ''), mv(T0, function (t) { return { r: -360 * t }; }, { n: 12 }));
    s += G(0, 0, L(0, 0, 0, 0, 'sw'), '') + G(cx, cy, L(0, 0, 0, 0, 'sw'), '');
    s += G(0, 0, C(0, 0, 4, 'fc'), mv(T0, function (t) { return { x: 100 + 120 * t, y: cy - r * sin(TAU * t) }; }, { n: 48 }));
    s += G(cx, 0, L(0, 0, 0, 0, 'sw'), '') + G(0, 0, L(0, 0, 0, 0, 'sw'), '');
    return s + T(204, 108, 'y = sin θ', 'tx sm', 'fill:var(--c);text-anchor:end');
  };
  SC['hsc-math-conics'] = function () {
    var T0 = 6, s = P('M40,20 L70,70 L10,70Z', 'fa', 'opacity:.25') + E(40, 72, 30, 8, 'sa nf', 'stroke-width:1.6') + P('M40,20 L70,70 L10,70Z', 'sa nf', 'stroke-width:2') + P('M40,20 L70,-30 L10,-30Z', 'fa', 'opacity:.0');
    s += G(40, 52, L(-30, 0, 30, 0, 'sc', 'stroke-width:3'), mv(T0, function (t) { return { r: -50 * sin(TAU * t) * .8 }; }, { n: 32 }));
    var shapes = [E(0, 0, 26, 26, 'sb nf', 'stroke-width:3'), E(0, 0, 36, 20, 'sb nf', 'stroke-width:3'), P('M-30,26 Q0,-40 30,26', 'sb nf', 'stroke-width:3'), P('M-34,-26 Q-8,0 -34,26 M34,-26 Q8,0 34,26', 'sb nf', 'stroke-width:3')];
    shapes.forEach(function (sh, i) { s += G(158, 62, sh, mv(T0, function (t) { return { o: bump(t, i / 4 + .125, .125) * 1.2 > 1 ? 1 : bump(t, i / 4 + .125, .125) * 1.2 }; }, { n: 32 })); });
    s += T(158, 108, 'circle · ellipse · parabola · hyperbola', 'tx sm', 'fill:var(--c);font-size:6.5px');
    return s;
  };
  SC['sim-circle-equation-explorer'] = function () {
    var T0 = 6, cx = 120, cy = 62, r = 38, s = cartes(cx, cy, 100, 52) + C(cx, cy, r, 'fa', 'opacity:.14') + C(cx, cy, r, 'sa nf', 'stroke-width:2.8');
    s += G(cx, cy, G(r, 0, L(0, -30, 0, 30, 'sc', 'stroke-width:2.8') + C(0, 0, 4.4, 'fc') + P('M-7,0 v-7 h7', 'sw nf', 'stroke-width:1.4'), ''), mv(T0, function (t) { return { r: -360 * t }; }, { n: 12 }));
    s += G(cx, cy, L(0, 0, r, 0, 'sw', 'stroke-width:1.4;opacity:.6'), mv(T0, function (t) { return { r: -360 * t }; }, { n: 12 }));
    return s + T(214, 112, 'tangent ⟂ radius', 'tx sm', 'fill:var(--c);text-anchor:end');
  };
  SC['hsc-math-probability'] = function () {
    var T0 = 4, s = '';
    s += G(56, 50, E(0, 0, 22, 22, 'fc') + T(0, 6, 'H', 'tx big', 'fill:#0a1020'), mv(T0, function (t) { return { y: -26 * sin(PI * ramp(t, 0, .45)) * 0, sy: abs(cos(TAU * t * 3 * (1 - ramp(t, .6, 1) * .0))) * (1 - .0) + .06 }; }, { n: 40 }));
    s += G(56, 50, '', '');
    var base = 100, hs = [26, 40, 54, 66, 54, 40, 26];
    for (var i = 0; i < 5; i++) { var h = [20, 46, 62, 46, 20][i]; s += R(110 + i * 22, 100 - 66, 16, 66, 'fg', '', 3) + G(118 + i * 22, 100, R(-8, -66, 16, 66, i % 2 ? 'fa' : 'fb', 'transform-origin:0 0', 3), mv(T0, function (t) { return { sy: h / 66 * ramp(t, 0, .9) * (1 + .06 * sin(TAU * t * 4 + i)) }; }, { n: 28 })); }
    return s + T(56, 100, 'P(H) = ½', 'tx sm', 'fill:var(--c)') + T(160, 114, 'n → ∞', 'tx sm', 'opacity:.8');
  };
  SC['hsc-math-combinatorics'] = function () {
    var T0 = 6, cols = ['fa', 'fb', 'fc'], perms = [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]], s = '';
    [0, 1, 2].forEach(function (b) {
      s += G(0, 60, C(0, 0, 14, cols[b]) + T(0, 5, 'ABC'[b], 'tx', 'fill:#0a1020'), mv(T0, function (t) { var u = t * 6, k = floor(u) % 6, f = sm(ramp(u - floor(u), .55, 1)), p = perms[k], q = perms[(k + 1) % 6]; return { x: lerp(60 + p.indexOf(b) * 60, 60 + q.indexOf(b) * 60, f), y: -14 * sin(PI * f) * (b - 1) }; }, { n: 72 }));
    });
    return s + L(30, 90, 210, 90, 'sw', 'opacity:.3') + T(120, 108, '3! = 6 arrangements', 'tx sm', 'fill:var(--c)');
  };
  SC['sim-permutation-combination'] = function () {
    var T0 = 6, pts = [[70, 30], [170, 30], [170, 92], [70, 92]], s = '', pairs = [[0, 1], [1, 2], [2, 3], [3, 0], [0, 2], [1, 3]];
    pairs.forEach(function (p, i) { s += L(pts[p[0]][0], pts[p[0]][1], pts[p[1]][0], pts[p[1]][1], 'sw', 'stroke-width:1.2;opacity:.2'); s += G(0, 0, L(pts[p[0]][0], pts[p[0]][1], pts[p[1]][0], pts[p[1]][1], 'sc', 'stroke-width:3.4'), show(T0, i / 6 + .01, (i + 1) / 6 - .01, 0)); });
    pts.forEach(function (p, i) { s += G(p[0], p[1], C(0, 0, 11, ['fa', 'fb', 'fc', 'fk'][i]) + T(0, 4, 'ABCD'[i], 'tx sm', 'fill:#0a1020'), ''); });
    return s + T(120, 66, '⁴C₂=6', 'tx', 'fill:var(--c)');
  };
  SC['hsc-math-diff'] = function () {
    var T0 = 6, f = function (x) { return 62 - 30 * sin((x - 20) / 200 * TAU * .9); }, s = cartes(120, 62, 100, 52);
    s += P(curve(function (x) { return [20 + 200 * x, f(20 + 200 * x)]; }, 0, 1, 50), 'sa nf', 'stroke-width:2.8');
    var pos = function (t) { var u = .1 + .8 * t, x = 20 + 200 * u; return [x, f(x)]; };
    s += G(0, 0, L(-34, 0, 34, 0, 'sc', 'stroke-width:3') + C(0, 0, 4.4, 'fc'), mv(T0, function (t) { var u = .1 + .8 * tri(t), x = 20 + 200 * u, y = f(x), dx = 1, dy = (f(x + 1) - f(x - 1)) / 2; return { x: x, y: y, r: deg(atan2(dy, dx)) }; }, { n: 60 }));
    return s + T(214, 112, "f′(x) = slope", 'tx sm', 'fill:var(--c);text-anchor:end');
  };
  SC['sim-unit-circle-explorer'] = function () {
    var T0 = 6, cx = 100, cy = 62, r = 44, s = C(cx, cy, r, 'sw nf', 'stroke-width:1.6;opacity:.6') + L(cx - r - 10, cy, cx + r + 10, cy, 'sw', 'opacity:.35') + L(cx, cy - r - 8, cx, cy + r + 8, 'sw', 'opacity:.35');
    var a = function (t) { return TAU * t; };
    s += G(cx, cy, L(0, 0, r, 0, 'sa', 'stroke-width:2.6') + C(r, 0, 4.4, 'fc'), mv(T0, function (t) { return { r: -360 * t }; }, { n: 12 }));
    s += G(cx, cy, L(0, 0, r, 0, 'sc', 'stroke-width:3'), mv(T0, function (t) { return { sx: cos(a(t)) }; }, { n: 40 }));
    s += G(cx, cy, L(0, 0, 0, -r, 'sb', 'stroke-width:3'), mv(T0, function (t) { return { x: r * cos(a(t)), sy: sin(a(t)) }; }, { n: 40 }));
    s += R(184, 20, 10, 80, 'fg', '', 4) + G(189, 60, R(-5, -40, 10, 40, 'fc', 'transform-origin:0 0', 4), mv(T0, function (t) { return { sy: sin(a(t)) }; }, { n: 40 })) + R(206, 20, 10, 80, 'fg', '', 4) + G(211, 60, R(-5, -40, 10, 40, 'fb', 'transform-origin:0 0', 4), mv(T0, function (t) { return { sy: cos(a(t)) }; }, { n: 40 }));
    return s + T(189, 112, 'sin', 'tx sm', 'fill:var(--c)') + T(211, 112, 'cos', 'tx sm', 'fill:var(--b)');
  };
  SC['hsc-math-complex'] = function () {
    var T0 = 6, cx = 100, cy = 62, s = cartes(cx, cy, 90, 52) + T(cx + 86, cy + 12, 'Re', 'tx sm') + T(cx + 8, cy - 48, 'Im', 'tx sm');
    s += G(cx, cy, arrow(46, 'a', 'stroke-width:3'), mv(T0, function (t) { var k = floor(t * 4), f = sm(ramp(t * 4 - k, .35, 1)); return { r: -(30 + 90 * (k + f)), s: 1 }; }, { n: 64 }));
    s += G(cx, cy, '<path d="M24,0 A24,24 0 0,0 0,-24" class="sc nf" style="stroke-width:1.8;stroke-dasharray:3 3"/>', mv(T0, function (t) { return { o: .4 + .6 * hc(t * 4) }; }, { n: 32 }));
    return s + T(204, 28, '×i = ↺ 90°', 'tx sm', 'fill:var(--c);text-anchor:end') + T(204, 108, 'z = r e^{iθ}', 'tx sm', 'opacity:.8;text-anchor:end');
  };
  SC['sim-polynomial-root-explorer'] = function () {
    var T0 = 6, s = L(20, 62, 220, 62, 'sw', 'stroke-width:1.4;opacity:.5'), g = function (x, c) { return x * x * x - 3 * x + c; };
    var cOf = function (t) { return 2.4 * sin(TAU * t); };
    var sx = function (x) { return 120 + 36 * x; }, sy = function (y, c) { return 62 - 11 * y; };
    s += G(0, 0, P(curve(function (u) { var x = -2.4 + 4.8 * u; return [sx(x), sy(g(x, 0))]; }, 0, 1, 50), 'sa nf', 'stroke-width:2.8'), mv(T0, function (t) { return { y: -11 * cOf(t) }; }, { n: 40 }));
    var roots = function (c) { var r = [], prev = g(-2.4, c); for (var x = -2.4; x < 2.4; x += .02) { var cur = g(x + .02, c); if (prev * cur < 0) r.push(x + .01); prev = cur; } return r; };
    for (var k = 0; k < 3; k++) (function (k) {
      s += G(0, 62, C(0, 0, 4.6, 'fc') + C(0, 0, 8, 'sc nf', 'opacity:.4'), mv(T0, function (t) { var r = roots(cOf(t)), n = r.length; var idx = n === 3 ? k : (n === 1 ? (k === 0 ? 0 : -1) : (k < n ? k : -1)); if (idx < 0 || !r[idx] && r[idx] !== 0) return { x: 120, o: 0 }; return { x: sx(r[idx]) , o: 1 }; }, { n: 90 }));
    })(k);
    return s + T(212, 108, 'f(x)=0', 'tx sm', 'fill:var(--c);text-anchor:end');
  };
  SC['sim-arithmetic-sequence'] = function () {
    var T0 = 6, s = L(20, 100, 220, 100, 'sw', 'opacity:.5');
    for (var i = 0; i < 7; i++) { var h = 14 + i * 10; s += G(36 + i * 26, 100, R(-9, -h, 18, h, i % 2 ? 'fa' : 'fb', 'transform-origin:0 0;opacity:.95', 3) + (i ? L(-13, -h + 10, -13, -h, 'sc', 'stroke-width:2.4') : ''), mv(T0, function (t) { var u = ramp(t, i * .1, i * .1 + .1); return { sy: u, o: 1 - ramp(t, .93, 1) }; }, { n: 32 })); }
    return s + T(60, 22, 'aₙ = a + (n−1)d', 'tx sm', 'fill:var(--c);text-anchor:start');
  };
  SC['hsc-math-limit'] = function () {
    var T0 = 5, s = cartes(120, 62, 100, 52);
    s += L(40, 96, 200, 28, 'sa', 'stroke-width:2.8') + G(120, 62, C(0, 0, 4.4, 'fd', '') + C(0, 0, 4.4, 'sc nf', 'stroke-width:2'), '');
    s += G(0, 0, C(0, 0, 4.4, 'fc'), mv(T0, function (t) { var u = ramp(t, .05, .9); return { x: lerp(46, 116, u), y: lerp(94, 64, u), o: 1 - ramp(t, .93, 1) }; }, { n: 28 })) + G(0, 0, C(0, 0, 4.4, 'fb'), mv(T0, function (t) { var u = ramp(t, .05, .9); return { x: lerp(194, 124, u), y: lerp(30, 60, u), o: 1 - ramp(t, .93, 1) }; }, { n: 28 }));
    return s + L(20, 62, 120, 62, 'sc', 'stroke-dasharray:3 3;opacity:.6') + T(214, 112, 'lim f(x) = L', 'tx sm', 'fill:var(--c);text-anchor:end');
  };
  SC['sim-derivative-tangent'] = function () {
    var T0 = 5, f = function (x) { return 100 - 70 * pow((x - 20) / 200, 2) * 2.2 + 0; }, s = cartes(120, 62, 100, 52);
    var fx = function (u) { var x = -1.4 + 2.8 * u; return [120 + 70 * x, 96 - 40 * (x * x * .0 + (x + 1.4) * (x + 1.4) * .0) - 0]; };
    var par = function (x) { return [120 + 70 * x, 90 - 30 * x * x - 8 + 0]; };
    s += P(curve(function (u) { return par(-1.5 + 3 * u); }, 0, 1, 40), 'sa nf', 'stroke-width:2.8');
    var x0 = -.5, p0 = par(x0);
    s += G(0, 0, C(0, 0, 4.6, 'fc'), mv(1, function () { return { x: p0[0], y: p0[1] }; }, { n: 2 })) + G(p0[0], p0[1], L(-90, 0, 90, 0, 'sc', 'stroke-width:2.6;opacity:.95'), mv(T0, function (t) { var h = lerp(1.6, .001, ramp(t, .1, .8)), q = par(x0 + h), sl = atan2(q[1] - p0[1], q[0] - p0[0]); return { r: deg(sl) }; }, { n: 40 }));
    s += G(0, 0, C(0, 0, 4.2, 'fb'), mv(T0, function (t) { var h = lerp(1.6, .001, ramp(t, .1, .8)), q = par(x0 + h); return { x: q[0], y: q[1] }; }, { n: 40 }));
    return s + T(214, 112, 'h → 0', 'tx sm', 'fill:var(--c);text-anchor:end');
  };
  SC['sim-limit-approach'] = function () {
    var T0 = 5, s = L(30, 100, 220, 100, 'sw', 'opacity:.5') + L(30, 100, 30, 20, 'sw', 'opacity:.5') + L(30, 56, 220, 56, 'sc', 'stroke-dasharray:4 4;opacity:.7') + T(224, 59, 'L', 'tx sm', 'fill:var(--c)');
    s += G(30, 56, R(0, -22, 190, 44, 'fa', 'transform-origin:0 0;opacity:.18'), mv(T0, function (t) { return { sx: 1, sy: lerp(1, .08, ramp(t, .1, .9)) }; }, { n: 24 }));
    s += G(30, 56, R(0, -22, 190, 44, 'sa nf', 'transform-origin:0 0;stroke-width:1.6;stroke-dasharray:4 3'), mv(T0, function (t) { return { sx: 1, sy: lerp(1, .08, ramp(t, .1, .9)) }; }, { n: 24 }));
    s += G(0, 0, C(0, 0, 4.6, 'fc'), mv(T0, function (t) { var u = ramp(t, .05, .92); return { x: lerp(46, 180, 1 - pow(1 - u, 2)), y: 56 - 38 * (1 - u) * cos(TAU * u * 3) * (1 - u), o: 1 - ramp(t, .96, 1) }; }, { n: 48 }));
    return s + T(130, 116, 'ε – δ', 'tx sm', 'fill:var(--c)');
  };
  SC['hsc-math-integration'] = function () {
    var T0 = 6, f = function (x) { return 94 - 56 * sin(PI * (x - 30) / 170) - 6; }, s = axes(24, 98, 200, 86, 'x', 'y');
    s += P(curve(function (u) { return [30 + 170 * u, f(30 + 170 * u)]; }, 0, 1, 40), 'sa nf', 'stroke-width:2.8');
    [4, 8, 16].forEach(function (n, k) {
      var r = ''; for (var i = 0; i < n; i++) { var x = 30 + 170 * i / n, w = 170 / n, h = 98 - f(x + w / 2); r += R(x + .5, 98 - h, w - 1, h, 'fb', 'opacity:.55'); }
      s += G(0, 0, r, mv(T0, function (t) { var a = k / 3 + .02, b = (k + 1) / 3 - .02, o = min(1, min((t - a) / .04, (b - t) / .04)); return { o: max(0, o) }; }, { n: 36 }));
    });
    return s + T(204, 20, '∫ f(x) dx', 'tx sm', 'fill:var(--c);text-anchor:end');
  };
  SC['sim-ellipse-explorer'] = function () {
    var T0 = 6, cx = 120, cy = 62, a = 76, b = 40, c = sqrt(a * a - b * b), s = cartes(cx, cy, 100, 52) + E(cx, cy, a, b, 'fa', 'opacity:.12') + E(cx, cy, a, b, 'sa nf', 'stroke-width:2.8');
    s += C(cx - c, cy, 3.4, 'fc') + C(cx + c, cy, 3.4, 'fc') + T(cx - c, cy + 14, 'F₁', 'tx sm') + T(cx + c, cy + 14, 'F₂', 'tx sm');
    var pt = function (t) { var th = TAU * t; return [cx + a * cos(th), cy + b * sin(th)]; };
    [-1, 1].forEach(function (sg) { s += P('M' + (cx + sg * c) + ',' + cy + ' L' + cx + ',' + cy, 'sc nf', 'stroke-width:1.8;opacity:0'); });
    s += G(0, 0, L(0, 0, 0, 0, 'sw'), '');
    s += G(cx - c, cy, L(0, 0, 1, 0, 'sc', 'stroke-width:2;opacity:.9'), mv(T0, function (t) { var p = pt(t), dx = p[0] - (cx - c), dy = p[1] - cy; return { r: deg(atan2(dy, dx)), sx: sqrt(dx * dx + dy * dy) }; }, { n: 60 }));
    s += G(cx + c, cy, L(0, 0, 1, 0, 'sb', 'stroke-width:2;opacity:.9'), mv(T0, function (t) { var p = pt(t), dx = p[0] - (cx + c), dy = p[1] - cy; return { r: deg(atan2(dy, dx)), sx: sqrt(dx * dx + dy * dy) }; }, { n: 60 }));
    s += G(0, 0, C(0, 0, 5, 'fk') + C(0, 0, 9, 'sw nf', 'opacity:.3'), along(T0, pt, 0, { n: 60 }));
    return s + T(214, 112, 'PF₁ + PF₂ = 2a', 'tx sm', 'fill:var(--c);text-anchor:end');
  };
  SC['sim-probability-dice-lab'] = function () {
    var T0 = 5, s = '', rows = 5, bx = 120;
    for (var r = 0; r < rows; r++) for (var c = 0; c <= r; c++) s += C(bx + (c - r / 2) * 18, 20 + r * 12, 1.8, 'fw', 'opacity:.55');
    for (var k = 0; k < 6; k++) { var h = [8, 22, 40, 40, 22, 8][k]; s += G(bx + (k - 2.5) * 18, 110, R(-7, -h, 14, h, k % 2 ? 'fa' : 'fb', 'transform-origin:0 0;opacity:.85', 2), mv(T0, function (t) { return { sy: .4 + .6 * hc(t + k * .08) }; }, { n: 20 })); }
    for (var i = 0; i < 4; i++) s += G(0, 0, C(0, 0, 3.4, 'fc'), mv(T0, function (t) { var x = bx, y = 12 + 84 * t, row = floor(t * rows), steps = (i * 3 + 1) % 2; var xx = bx; for (var rr = 0; rr < min(row, rows); rr++) xx += ((rr * 7 + i * 5) % 3 < 1.5 ? -9 : 9) * ramp(t * rows, rr + .2, rr + 1); return { x: xx, y: y, o: min(1, t / .08) * (1 - ramp(t, .93, 1)) }; }, { n: 40, d: i / 4 }));
    return s + T(206, 28, 'B(n, p)', 'tx sm', 'fill:var(--c)');
  };
  SC['sim-complex-plane'] = function () {
    var T0 = 6, cx = 100, cy = 62, s = cartes(cx, cy, 90, 52);
    var z = function (t) { var a = (.5 + .5 * sin(TAU * t)) * .9 + .3; return [46 * cos(a), 46 * sin(a)]; };
    s += G(cx, cy, arrow(1, 'a', ''), '');
    s += G(cx, cy, arrow(46, 'a', 'stroke-width:3'), mv(T0, function (t) { var p = z(t); return { r: -deg(atan2(p[1], p[0])) }; }, { n: 40 }));
    s += G(cx, cy, arrow(46, 'b', 'stroke-width:3'), mv(T0, function (t) { var p = z(t); return { r: deg(atan2(p[1], p[0])) }; }, { n: 40 }));
    s += G(cx, cy, L(0, 0, 0, 0, 'sw'), '') + P('M' + cx + ',' + (cy - 46) + ' V' + (cy + 46), 'sw nf', 'opacity:0');
    s += T(204, 28, 'z', 'tx', 'fill:var(--a)') + T(204, 104, 'z̄', 'tx', 'fill:var(--b)') + T(204, 66, '|z|', 'tx sm', 'fill:var(--c)');
    return s;
  };
  SC['sim-linear-programming-region'] = function () {
    var V = [[40, 100], [40, 58], [80, 30], [150, 38], [180, 70], [170, 100]], id = uid('lp'), s = clip(id, P(poly(V, true))), T0 = 6;
    s += L(34, 100, 34, 14, 'sw', 'stroke-width:1.5;opacity:.6') + L(34, 100, 224, 100, 'sw', 'stroke-width:1.5;opacity:.6');
    s += G(0, 0, P(poly(V, true), 'fa', 'opacity:.2'), blink(3, 0, .6, 1)) + P(poly(V, true), 'sa nf', 'stroke-width:2.4');
    var ang = deg(atan2(-1, -0.8)), n2 = 1.64, pos = function (k) { return [40 + k * 1 / n2, 100 - k * .8 / n2]; };
    s += '<g clip-path="url(#' + id + ')">' + G(0, 0, rotG(ang, L(-140, 0, 140, 0, 'sc', 'stroke-width:3')), mv(T0, function (t) { var u = sm(t / .7), p = pos(lerp(30, 204, u)); return { x: p[0], y: p[1], o: min(1, min(t / .04, (1 - t) / .08)) }; }, { n: 48 })) + '</g>';
    s += G(180, 70, C(0, 0, 5, 'fc') + C(0, 0, 5, 'sc nf', 'stroke-width:2'), mv(T0, function (t) { return { s: 1 + 1.6 * bump(t, .72, .12), o: .5 + .5 * bump(t, .72, .2) }; }, { n: 48 }));
    return s + T(208, 40, 'max z', 'tx sm', 'fill:var(--c)');
  };

  /* ---------- fallbacks (any simulation added later still gets a subject-appropriate live preview) ---------- */
  var FB = {
    phy: function () { return L(10, 60, 230, 60, 'sw', 'opacity:.3') + G(10, 60, P(sine(0, 340, 0, 24, 60, 0, 3), 'sa nf', 'stroke-width:3'), mv(2.6, function (t) { return { x: 60 * t }; }, { n: 4 })) + G(120, 60, C(0, 0, 6, 'fc'), osc(2.6, 24, 'y')); },
    chem: function () { return G(120, 60, atom(14, 'fa', 'C') + G(30, 0, C(0, 0, 5, 'fc'), ''), spin(4)) + C(120, 60, 30, 'sw nf', 'stroke-dasharray:3 4;opacity:.4'); },
    math: function () { return cartes(120, 62, 100, 52) + P(curve(function (u) { return [20 + 200 * u, 62 - 30 * sin(TAU * u)]; }, 0, 1, 40), 'sa nf', 'stroke-width:2.8') + G(0, 0, C(0, 0, 5, 'fc'), mv(5, function (t) { return { x: 20 + 200 * t, y: 62 - 30 * sin(TAU * t) }; }, { n: 40 })); }
  };
  var CACHE = {};
  /* Each animated node becomes its own GPU layer. Too many layers is what makes a page stutter on phones, so every
     scene keeps animating only its most visible motions (by motion score) and the rest stay at rest. */
  var CAP = 3, CAPS = { 'sim-wave-machine': 7, 'hsc-phy-gas': 5, 'kinetic-pressure-lab': 5, 'sim-ideal-gas-piston': 5, 'hsc-chem-kinetics': 6, 'hsc-chem-equilibrium': 5,
    'hsc-chem-electrochem': 5, 'sim-doppler-observer': 6, 'sim-reaction-rate-control': 5, 'sim-periodic-trend-map': 5, 'hsc-chem-periodic': 5, 'hsc-chem-stoich': 6,
    'sim-newton-force-bench': 5, 'sim-arithmetic-sequence': 5, 'sim-double-slit-studio': 5, 'sim-pendulum-lab': 4, 'hsc-chem-flame': 4, 'sim-solution-concentration': 4, 'sim-probability-dice-lab': 4, 'lab-screw-gauge': 4, 'measurement-uncertainty': 4, 'river-boat': 4 };
  function capAnim(svg, cap) {
    var re = /style="([^"]*?--sxs:([0-9.]+)[^"]*)"/g, scores = [], m;
    while ((m = re.exec(svg))) scores.push(+m[2]);
    if (scores.length <= cap) return svg;
    var sorted = scores.slice().sort(function (a, b) { return b - a; }), thr = sorted[cap - 1], ties = 0;
    sorted.forEach(function (v) { if (v === thr) ties++; });
    var keepTies = cap - sorted.filter(function (v) { return v > thr; }).length, seen = 0;
    return svg.replace(re, function (all, st, sc) {
      sc = +sc;
      if (sc > thr || (sc === thr && ++seen <= keepTies)) return all;
      return 'style="' + st.replace(/animation(-delay)?:[^;"]*;?/g, '').replace(/--sxs:[^;"]*;?/g, '') + '"';
    });
  }
  function svgFor(id, sk) {
    var key = id + '|' + sk;
    if (CACHE[key]) return CACHE[key];
    var out = '';
    try { out = (SC[id] || FB[sk] || FB.phy)(); } catch (e) { out = ''; if (window.console) console.warn('sim scene failed', id, e); }
    out = capAnim(out, CAPS[id] || CAP);
    return (CACHE[key] = '<svg class="sx-svg" viewBox="0 0 240 120" preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false">' + out + '</svg>');
  }

  /* ---------- v113c · proximity gate (phones / touch only; desktop is untouched) ----------
     Every preview is always drawn, but on a phone it stays frozen (paused at its own phase frame) until the card is
     within ~one screen of the viewport. It starts moving before it arrives, and freezes again when far away. */
  var GATE = null; try { GATE = window.matchMedia('(max-width:760px),(pointer:coarse)'); } catch (e) { }
  function gated() { return !!(GATE && GATE.matches); }
  var gio = null;
  function setIdle(stage, idle) {
    var card = stage.closest && stage.closest('.sx-card'); if (!card) return;
    if (idle && !gated()) idle = false;
    card.classList.toggle('sx-idle', idle);
    var h = card.querySelector('sx-scene');
    if (h) { if (idle) h.setAttribute('data-idle', ''); else h.removeAttribute('data-idle'); }
  }
  function getIO() {
    if (gio || !('IntersectionObserver' in window)) return gio;
    gio = new IntersectionObserver(function (es) { es.forEach(function (e) { setIdle(e.target, !e.isIntersecting); }); },
      { rootMargin: '380px 0px 380px 0px', threshold: 0 });
    return gio;
  }
  function reg(stage) {
    if (!stage || stage._sxo || !gated()) return;
    var io = getIO(); if (!io) return;
    stage._sxo = 1; setIdle(stage, true); io.observe(stage);
  }
  function regAll() { Array.prototype.forEach.call(document.querySelectorAll('.sx-card .sx-stage'), reg); }
  if (GATE) {
    var onGate = function () {
      if (gated()) regAll();
      else Array.prototype.forEach.call(document.querySelectorAll('.sx-card.sx-idle'), function (c) { setIdle(c.querySelector('.sx-stage') || c, false); });
    };
    if (GATE.addEventListener) GATE.addEventListener('change', onGate); else if (GATE.addListener) GATE.addListener(onGate);
  }
  if (!SHADOW && 'MutationObserver' in window) {
    var mp = 0;
    var mo = new MutationObserver(function () { if (mp) return; mp = 1; requestAnimationFrame(function () { mp = 0; regAll(); }); });
    var startMO = function () { var a = document.getElementById('app') || document.body; if (a) mo.observe(a, { childList: true, subtree: true }); };
    if (document.body) startMO(); else document.addEventListener('DOMContentLoaded', startMO);
  }

  function scene(id, sk) {
    if (!SHADOW) return svgFor(id, sk);
    return '<sx-scene class="sx-svg" data-id="' + esc(id) + '" data-sk="' + esc(sk) + '"></sx-scene>';
  }
  if (SHADOW && !customElements.get('sx-scene')) {
    customElements.define('sx-scene', class extends HTMLElement {
      connectedCallback() {
        if (this._sx) return; this._sx = 1;
        var r = this.attachShadow({ mode: 'open' });
        var markup = svgFor(this.getAttribute('data-id'), this.getAttribute('data-sk'));   /* builds keyframes into the shared sheet */
        r.adoptedStyleSheets = [sharedSheet()];
        r.innerHTML = markup;
        if (gated()) this.setAttribute('data-idle', '');       /* start frozen, never blank */
        var st = this.parentNode; if (st && st.classList && st.classList.contains('sx-stage')) reg(st);
      }
      disconnectedCallback() { var st = this.parentNode; if (gio && st && st._sxo) { gio.unobserve(st); st._sxo = 0; } }
    });
  }

  /* ---------- card ---------- */
  var RANGE = { phy: [184, 262], chem: [84, 176], math: [278, 346] };
  var SUBJ = { phy: ['⚛', 'পদার্থ'], chem: ['⚗', 'রসায়ন'], math: ['∑', 'উচ্চতর গণিত'] };
  function hue(id, sk) { var r = RANGE[sk] || RANGE.phy; return Math.round(r[0] + (hash(String(id)) % 1000) / 1000 * (r[1] - r[0])); }
  function card(o) {
    var sk = RANGE[o.sk] ? o.sk : 'phy', h = hue(o.id, sk), sb = SUBJ[sk], title = esc(o.title);
    return '<a class="sx-card" data-sk="' + sk + '" data-sim="' + esc(o.id) + '" style="--h:' + h + '" href="#/lab/' + esc(o.id) + '" aria-label="' + title + '">' +
      '<div class="sx-stage" aria-hidden="true"><span class="sx-grid"></span><span class="sx-aur"></span>' + scene(o.id, sk) +
      '<span class="sx-sub"><b>' + sb[0] + '</b>' + esc(o.subject || sb[1]) + '</span>' +
      '<span class="sx-live"><i></i>LIVE</span>' + (o.done ? '<span class="sx-done">✓</span>' : '') +
      '<span class="sx-rail"><i></i><i></i><i></i></span></div>' +
      '<div class="sx-body"><div class="sx-head"><span class="sx-ico">' + esc(o.icon || '🔬') + '</span><h3>' + title + '</h3></div>' +
      '<p>' + esc(o.desc) + '</p>' +
      '<span class="sx-go"><span>সিমুলেশন খুলুন</span><svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2 .8v10.4L11 6z"/></svg></span></div></a>';
  }

  window.CL_SIM_ANIM = { card: card, scene: svgFor, ids: function () { return Object.keys(SC); }, hue: hue };
})();
