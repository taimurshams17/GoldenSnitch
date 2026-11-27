/* Golden Snitch Student Hub v114 — upgraded core tools:
   Syllabus Tracker (4 statuses + spaced chapter revision) · Score Tracker (graph, weak-subject analysis, targets)
   GPA Calculator (SSC/HSC, custom subjects, target GPA) · Daily Habits (+auto study statistics)
   Exam Center (countdown + plan builder + pace + marks needed, all connected) · Dashboard page.
   Existing saved data (clhub_v1: syllabus, scores, hab, exams) keeps working and stays in sync. */
(function () {
  'use strict';
  var H = window.CL_H114; if (!H) return;
  var U = H.u, E = H.E, bd = H.bd, CORE = H.core, HP = H.hp;
  var SUBJ = CORE.SUBJECTS, CUR = CORE.CURRICULUM;

  /* shared utilities for later modules */
  H.img = function (file, maxW, cb) {
    if (!file || !/^image\//.test(file.type)) { U.toast('ছবি ফাইল বেছে নিন'); return; }
    var r = new FileReader();
    r.onload = function () {
      var im = new Image();
      im.onload = function () {
        var sc = Math.min(1, (maxW || 800) / Math.max(im.width, im.height)), c = document.createElement('canvas'); c.width = Math.round(im.width * sc); c.height = Math.round(im.height * sc);
        c.getContext('2d').drawImage(im, 0, 0, c.width, c.height); try { cb(c.toDataURL('image/jpeg', .72)); } catch (e) { U.toast('ছবি প্রসেস করা যায়নি'); }
      };
      im.onerror = function () { U.toast('ছবিটি পড়া যায়নি'); }; im.src = r.result;
    };
    r.readAsDataURL(file);
  };
  var GREEK = { alpha: 'α', beta: 'β', gamma: 'γ', delta: 'δ', Delta: 'Δ', theta: 'θ', lambda: 'λ', mu: 'μ', pi: 'π', rho: 'ρ', sigma: 'σ', Sigma: 'Σ', omega: 'ω', Omega: 'Ω', phi: 'φ', epsilon: 'ε', eta: 'η', tau: 'τ', times: '×', cdot: '·', pm: '±', le: '≤', ge: '≥', ne: '≠', approx: '≈', to: '→', infty: '∞', sum: '∑', int: '∫', deg: '°', propto: '∝', rightarrow: '→', leftrightarrow: '⇌' };
  /* tiny formula renderer: text between $…$ is typeset (\frac, \sqrt, ^, _, greek); everything else is escaped text */
  H.fmath = function (src) {
    var parts = String(src == null ? '' : src).split(/(\$[^$\n]{1,300}\$)/g);
    return parts.map(function (p) {
      if (p.length > 2 && p[0] === '$' && p[p.length - 1] === '$') {
        var t = E(p.slice(1, -1)), i;
        for (i = 0; i < 4; i++) t = t.replace(/\\frac\{([^{}]*)\}\{([^{}]*)\}/g, '<span class="h4-fr"><i>$1</i><i>$2</i></span>').replace(/\\sqrt\{([^{}]*)\}/g, '√<span class="h4-sq">$1</span>');
        t = t.replace(/\\([A-Za-z]+)/g, function (m, n) { return GREEK[n] || m; }).replace(/\^\{([^{}]*)\}/g, '<sup>$1</sup>').replace(/\^([A-Za-z0-9+\-])/g, '<sup>$1</sup>').replace(/_\{([^{}]*)\}/g, '<sub>$1</sub>').replace(/_([A-Za-z0-9])/g, '<sub>$1</sub>');
        return '<span class="h4-math">' + t + '</span>';
      }
      return E(p).replace(/\n/g, '<br>');
    }).join('');
  };
  H.csv = function (rows) { return '﻿' + rows.map(function (r) { return r.map(function (v) { v = String(v == null ? '' : v); return /[",\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; }).join(','); }).join('\n'); };
  H.addPlan = function (t, subject, chapter, prio, src) {
    var s = CORE.S(); if (src && s.plan.some(function (x) { return x.src === src; })) { U.toast('আগেই প্ল্যানে যোগ করা আছে'); return false; }
    s.plan.unshift({ t: t, k: 0, subject: subject || '', chapter: chapter || '', priority: prio || 'medium', src: src || '' }); CORE.W(s); U.toast('Study Planner-এ যোগ হয়েছে ✓'); return true;
  };

  /* ═════════ Syllabus Tracker ═════════ */
  var ST = [['ns', 'শুরু হয়নি', '#8a94a8'], ['learning', 'শিখছি', '#5a8dee'], ['revise', 'Need Revision', '#f2b45a'], ['mastered', 'Mastered', '#38c9a0']];
  var STC = {}; ST.forEach(function (x) { STC[x[0]] = x; });
  var SYL = H.store('syl', { m: {} }), sylOpen = {}, sylSub = '';
  var GAP = [1, 3, 7, 14, 30];
  function legacy() { var s = CORE.S(); return s.syllabus && typeof s.syllabus === 'object' && !Array.isArray(s.syllabus) ? s.syllabus : {}; }
  function sget(key, st, lg) { var r = st.m[key]; if (r && STC[r.st]) return r; return { st: lg[key] ? 'mastered' : 'ns', rev: 0, last: '', note: '' }; }
  function nextDue(r) { if (!r.last || r.st === 'ns') return ''; return H.addDays(r.last, GAP[Math.min(r.rev || 0, GAP.length - 1)]); }
  function sylStats() {
    var st = SYL.get(), lg = legacy(), c = { ns: 0, learning: 0, revise: 0, mastered: 0 }, total = 0, due = 0, today = H.today();
    SUBJ.forEach(function (sub) { (CUR[sub] || []).forEach(function (ch) { var r = sget(sub + '|' + ch, st, lg); c[r.st]++; total++; var nd = nextDue(r); if (nd && nd <= today && r.st !== 'ns') due++; }); });
    return { total: total, mastered: c.mastered, learning: c.learning, revise: c.revise, notStarted: c.ns, pct: H.pct(c.mastered, total), due: due };
  }
  H.syl = { stats: sylStats, setStatus: function (key, status) { setStatus(key, status); } };
  function setStatus(key, status) {
    var st = SYL.get(), lg = legacy(), r = sget(key, st, lg), today = H.today();
    r = { st: status, rev: r.rev || 0, last: r.last || '', note: r.note || '' };
    if (status !== 'ns' && !r.last) r.last = today;
    if (status === 'mastered' || status === 'learning') r.last = today;
    st.m[key] = r; SYL.set(st);
    var s = CORE.S(); s.syllabus = legacy(); if (status === 'mastered') s.syllabus[key] = true; else delete s.syllabus[key]; CORE.W(s);
  }
  function sylView() {
    var st = SYL.get(), lg = legacy(), a = sylStats(), today = H.today(), h = '';
    var q = [];
    SUBJ.forEach(function (sub) { (CUR[sub] || []).forEach(function (ch) { var k = sub + '|' + ch, r = sget(k, st, lg), nd = nextDue(r); if (r.st === 'revise' || (nd && nd <= today && r.st !== 'ns')) q.push({ k: k, sub: sub, ch: ch, r: r, nd: nd }); }); });
    h += '<div class="h4"><div class="h4-card" style="--c:#6c7ae0"><div class="h4-row" style="gap:16px">' + H.ring(a.pct, '', '#38c9a0') + '<div><span class="h4-eyebrow">SYLLABUS TRACKER</span><h3 style="margin:2px 0 4px">' + bd(a.mastered) + '/' + bd(a.total) + ' অধ্যায় Mastered</h3><div class="h4-mut">প্রতিটি অধ্যায়ে চারটি ধাপ — শুরু হয়নি → শিখছি → Need Revision → Mastered</div></div></div><div class="h4-kpis" style="margin-top:14px">' + ST.map(function (x) { var n = x[0] === 'ns' ? a.notStarted : a[x[0]]; return H.stat(bd(n), x[1], x[2]); }).join('') + '</div></div>';
    h += '<div class="h4-card" style="--c:#f2b45a"><h3>🔁 আজকের রিভিশন কিউ <small>' + bd(q.length) + 'টি</small></h3>' + (q.length ? '<div class="h4-list">' + q.slice(0, 8).map(function (x) { return '<div class="h4-item"><span class="tt">' + E(x.ch) + '<small>' + E(x.sub) + (x.nd ? ' · নির্ধারিত ' + H.fmtDate(x.nd) : '') + ' · ' + bd(x.r.rev || 0) + ' বার রিভিশন</small></span><button type="button" class="h4-btn sm pri" data-a="s-rev" data-k="' + E(x.k) + '">✓ রিভিশন হলো</button><button type="button" class="h4-btn sm" data-a="s-plan" data-k="' + E(x.k) + '" title="আজকের প্ল্যানে">＋</button></div>'; }).join('') + '</div>' : '<p class="h4-mut" style="margin:0">কোনো রিভিশন বাকি নেই। অধ্যায়কে “শিখছি” বা “Mastered” করলে স্বয়ংক্রিয় সময়সূচি (১→৩→৭→১৪→৩০ দিন) তৈরি হবে।</p>') + '<div class="h4-row" style="margin-top:10px"><a class="h4-btn sm" href="#/hub/cards">ফ্ল্যাশকার্ড</a><a class="h4-btn sm" href="#/hub/review">Smart Review</a><a class="h4-btn sm" href="#/hub/mistakes">ভুলের খাতা</a></div></div>';
    SUBJ.forEach(function (sub, si) {
      var chs = CUR[sub] || [], c = { ns: 0, learning: 0, revise: 0, mastered: 0 };
      chs.forEach(function (ch) { c[sget(sub + '|' + ch, st, lg).st]++; });
      h += '<details class="h4-det" data-sub="' + E(sub) + '"' + (sylOpen[sub] || (sylSub === sub) ? ' open' : '') + '><summary><b>' + E(sub) + '</b><span class="h4-sp"></span><small class="h4-mut">' + bd(c.mastered) + '/' + bd(chs.length) + ' · ' + bd(H.pct(c.mastered, chs.length)) + '%</small></summary><div>' + H.bar(H.pct(c.mastered, chs.length), '#38c9a0') + '<div class="h4-list" style="margin-top:10px">' + chs.map(function (ch) {
        var k = sub + '|' + ch, r = sget(k, st, lg), nd = nextDue(r), late = nd && nd <= today && r.st !== 'ns';
        return '<div class="h4-item" style="flex-wrap:wrap"><span class="tt" style="min-width:150px">' + E(ch) + '<small>' + (r.rev ? bd(r.rev) + ' বার রিভিশন' : 'রিভিশন হয়নি') + (r.last ? ' · সর্বশেষ ' + H.fmtDate(r.last) : '') + (late ? ' · <b style="color:var(--h4-warn)">রিভিশনের সময়</b>' : '') + '</small></span><span class="h4-status">' + ST.map(function (x) { return '<button type="button" class="h4-st" style="--c:' + x[2] + '" data-a="s-set" data-k="' + E(k) + '" data-v="' + x[0] + '" aria-pressed="' + (r.st === x[0]) + '">' + x[1] + '</button>'; }).join('') + '</span><button type="button" class="h4-btn sm" data-a="s-rev" data-k="' + E(k) + '" title="রিভিশন করেছি"' + (r.st === 'ns' ? ' disabled' : '') + '>+১ রিভিশন</button></div>';
      }).join('') + '</div></div></details>';
    });
    return h + '</div>';
  }
  H.add({
    id: 'syllabus', cat: 'revise', icon: '🎯', label: 'সিলেবাস ট্র্যাকার', desc: 'চার ধাপের অগ্রগতি ও অধ্যায়ভিত্তিক রিভিশন', tags: 'syllabus chapter revision mastered', render: sylView, group: 'revise', priority: 90,
    click: function (el) {
      var a = el.dataset.a, k = el.dataset.k;
      if (a === 's-set') { setStatus(k, el.dataset.v); HP.paint(); }
      else if (a === 's-rev') { var st = SYL.get(), r = sget(k, st, legacy()); r.rev = (r.rev || 0) + 1; r.last = H.today(); if (r.st === 'ns' || r.st === 'revise') r.st = r.rev >= 3 ? 'mastered' : 'learning'; st.m[k] = r; SYL.set(st); var s = CORE.S(); s.syllabus = legacy(); if (r.st === 'mastered') s.syllabus[k] = true; CORE.W(s); U.toast('রিভিশন গণনা হয়েছে ✓'); CORE.xp(1, 'chapter revision'); HP.paint(); }
      else if (a === 's-plan') { var p = k.split('|'); H.addPlan(p[1] + ' — রিভিশন', p[0], p[1], 'medium', 'syl:' + k); }
      else if (a === 's-sub') { sylSub = k; HP.paint(); }
    },
    mount: function (root) { root.addEventListener('toggle', function (e) { var d = e.target; if (d && d.matches && d.matches('details[data-sub]')) sylOpen[d.getAttribute('data-sub')] = d.open; }, true); }
  });

  /* ═════════ Score Tracker ═════════ */
  var TG = H.store('targets', { all: 80, sub: {} }), scSub = '';
  function scAll() { return CORE.S().scores.slice().sort(function (a, b) { return String(a.date || '').localeCompare(String(b.date || '')) || (a.createdAt || 0) - (b.createdAt || 0); }); }
  function sp(x) { return Number(x.total) > 0 ? Number(x.score) / Number(x.total) * 100 : 0; }
  function chart(pts, target, color) {
    if (pts.length < 2) return '<p class="h4-mut" style="margin:0">গ্রাফ দেখতে কমপক্ষে ২টি ফলাফল যোগ করুন।</p>';
    var W = 640, Ht = 220, L = 34, R = 10, T = 12, B = 26, n = pts.length, x = function (i) { return L + (W - L - R) * (n === 1 ? .5 : i / (n - 1)); }, y = function (v) { return T + (Ht - T - B) * (1 - v / 100); };
    var s = '<svg class="h4-svg" viewBox="0 0 ' + W + ' ' + Ht + '" role="img" aria-label="Score progress graph" style="--c:' + color + '">';
    [0, 25, 50, 75, 100].forEach(function (v) { s += '<line class="gl" x1="' + L + '" x2="' + (W - R) + '" y1="' + y(v) + '" y2="' + y(v) + '"/><text x="4" y="' + (y(v) + 3) + '">' + v + '</text>'; });
    if (target) s += '<line x1="' + L + '" x2="' + (W - R) + '" y1="' + y(target) + '" y2="' + y(target) + '" stroke="var(--h4-warn)" stroke-dasharray="5 4" stroke-width="1.5"/><text x="' + (W - R - 70) + '" y="' + (y(target) - 4) + '" style="fill:var(--h4-warn)">লক্ষ্য ' + target + '%</text>';
    var d = pts.map(function (p, i) { return (i ? 'L' : 'M') + x(i).toFixed(1) + ' ' + y(p.v).toFixed(1); }).join(' ');
    s += '<path class="ar" d="' + d + ' L' + x(n - 1) + ' ' + y(0) + ' L' + x(0) + ' ' + y(0) + 'Z"/><path class="ln" d="' + d + '"/>';
    pts.forEach(function (p, i) { s += '<circle cx="' + x(i).toFixed(1) + '" cy="' + y(p.v).toFixed(1) + '" r="3.5" fill="var(--c)"><title>' + E(p.t) + ' · ' + Math.round(p.v) + '%</title></circle>'; });
    s += '<text x="' + L + '" y="' + (Ht - 8) + '">' + E(pts[0].d || '') + '</text><text x="' + (W - R - 60) + '" y="' + (Ht - 8) + '">' + E(pts[n - 1].d || '') + '</text></svg>';
    return s;
  }
  function subStats() {
    var all = scAll(), tg = TG.get(), map = {};
    all.forEach(function (x) { var k = x.subject || 'অন্যান্য'; (map[k] = map[k] || []).push(x); });
    return Object.keys(map).map(function (k) {
      var l = map[k], avg = l.reduce(function (n, x) { return n + sp(x); }, 0) / l.length, last = sp(l[l.length - 1]), prev = l.length > 1 ? l.slice(Math.max(0, l.length - 4), l.length - 1).reduce(function (n, x) { return n + sp(x); }, 0) / Math.min(3, l.length - 1) : null;
      return { s: k, n: l.length, avg: avg, last: last, trend: prev === null ? 0 : last - prev, target: tg.sub[k] || tg.all };
    }).sort(function (a, b) { return a.avg - b.avg; });
  }
  H.scoreStats = subStats;
  function scView() {
    var all = scAll(), tg = TG.get(), ss = subStats(), f = all.filter(function (x) { return !scSub || x.subject === scSub; });
    var avg = all.length ? all.reduce(function (n, x) { return n + sp(x); }, 0) / all.length : 0, best = all.reduce(function (n, x) { return Math.max(n, sp(x)); }, 0);
    var last3 = all.slice(-3), p3 = all.slice(-6, -3), tr = last3.length && p3.length ? last3.reduce(function (n, x) { return n + sp(x); }, 0) / last3.length - p3.reduce(function (n, x) { return n + sp(x); }, 0) / p3.length : 0;
    var h = '<div class="h4"><div class="h4-card" style="--c:#3dbd9b"><span class="h4-eyebrow">SCORE TRACKER</span><div class="h4-kpis" style="margin-top:8px">' + H.stat(bd(all.length), 'মোট পরীক্ষা', '#5a8dee') + H.stat(bd(Math.round(avg)) + '%', 'গড় ফল', '#3dbd9b') + H.stat(bd(Math.round(best)) + '%', 'সর্বোচ্চ', '#8b7cf6') + H.stat((tr >= 0 ? '▲ ' : '▼ ') + bd(Math.abs(Math.round(tr))) + '%', 'সাম্প্রতিক প্রবণতা', tr >= 0 ? '#38c9a0' : '#ff7a8a') + '</div>' +
      '<div class="h4-row" style="margin-top:12px"><label class="h4-mut">সামগ্রিক লক্ষ্য %</label><input class="h4-in" id="tgAll" type="number" min="1" max="100" value="' + tg.all + '" style="width:90px"></div></div>';
    h += '<div class="h4-card"><h3>＋ ফলাফল যোগ করুন</h3><div class="h4-form"><label class="h4-f w2">পরীক্ষার নাম<input class="h4-in" id="scT" maxlength="80" placeholder="যেমন: মডেল টেস্ট ৩"></label><label class="h4-f">বিষয়<select class="h4-in" id="scS">' + H.opts(SUBJ.concat(['ইংরেজি', 'বাংলা', 'ICT', 'অন্যান্য']), '') + '</select></label><label class="h4-f">প্রাপ্ত<input class="h4-in" id="scG" type="number" min="0" step="0.5"></label><label class="h4-f">মোট<input class="h4-in" id="scM" type="number" min="1" step="0.5" value="100"></label><label class="h4-f">তারিখ<input class="h4-in" id="scD" type="date" value="' + H.today() + '"></label><button type="button" class="h4-btn pri" data-a="sc-add">সেভ</button></div></div>';
    h += '<div class="h4-card"><div class="h4-row"><h3 style="margin:0">📈 অগ্রগতির গ্রাফ</h3><span class="h4-sp"></span><select class="h4-in" id="scF" style="width:auto;min-height:34px"><option value="">সব বিষয়</option>' + H.opts(ss.map(function (x) { return x.s; }), scSub) + '</select></div><div style="margin-top:10px">' + chart(f.map(function (x) { return { v: sp(x), t: x.t, d: H.fmtDate(x.date) }; }), scSub ? (tg.sub[scSub] || tg.all) : tg.all, '#3dbd9b') + '</div></div>';
    h += '<div class="h4-grid h4-g2"><div class="h4-card"><h3>📚 বিষয়ভিত্তিক পারফরম্যান্স</h3>' + (ss.length ? '<div class="h4-list">' + ss.slice().reverse().map(function (x) { var ok = x.avg >= x.target; return '<div class="h4-item" style="flex-direction:column;align-items:stretch;gap:6px"><div class="h4-row"><b style="font-size:.9rem">' + E(x.s) + '</b><span class="h4-sp"></span><span class="h4-chip ' + (ok ? 'ok' : 'warn') + '">গড় ' + bd(Math.round(x.avg)) + '%</span></div>' + H.bar(x.avg, ok ? '#38c9a0' : '#f2b45a') + '<div class="h4-row"><small class="h4-mut">' + bd(x.n) + 'টি পরীক্ষা · শেষ ' + bd(Math.round(x.last)) + '% ' + (x.trend > 2 ? '▲' : x.trend < -2 ? '▼' : '•') + '</small><span class="h4-sp"></span><small class="h4-mut">লক্ষ্য</small><input class="h4-in" data-tg="' + E(x.s) + '" type="number" min="1" max="100" value="' + x.target + '" style="width:68px;min-height:30px;padding:3px 8px"></div></div>'; }).join('') + '</div>' : H.empty('📊', 'ফলাফল যোগ করলে বিষয়ভিত্তিক বিশ্লেষণ দেখা যাবে')) + '</div>';
    var weak = ss.filter(function (x) { return x.avg < x.target; }).slice(0, 4);
    h += '<div class="h4-card" style="--c:#f2b45a"><h3>⚠️ দুর্বল বিষয় বিশ্লেষণ</h3>' + (ss.length ? (weak.length ? '<div class="h4-list">' + weak.map(function (x) { return '<div class="h4-item"><span class="tt">' + E(x.s) + '<small>গড় ' + bd(Math.round(x.avg)) + '% · লক্ষ্য থেকে ' + bd(Math.round(x.target - x.avg)) + '% পিছনে' + (x.trend < -2 ? ' · নিম্নমুখী ▼' : x.trend > 2 ? ' · উন্নতি হচ্ছে ▲' : '') + '</small></span><button type="button" class="h4-btn sm" data-a="sc-plan" data-v="' + E(x.s) + '">＋ রিভিশন প্ল্যান</button></div>'; }).join('') + '</div><p class="h4-mut" style="margin:10px 0 0">পরামর্থ: দুর্বল বিষয়ে প্রথমে <a href="#/hub/mistakes">ভুলের খাতা</a> দেখে একই ধরনের প্রশ্ন আবার সমাধান করুন।</p>' : '<div class="h4-note ok">সব বিষয়ই লক্ষ্যের ওপরে আছে — চমৎকার! লক্ষ্য একটু বাড়িয়ে নিতে পারেন।</div>') : H.empty('🔎', 'বিশ্লেষণের জন্য কিছু ফলাফল দরকার')) + '</div></div>';
    h += '<div class="h4-card"><div class="h4-row"><h3 style="margin:0">🧾 ইতিহাস</h3><span class="h4-sp"></span><button type="button" class="h4-btn sm" data-a="sc-exp">⬇ CSV</button></div><div class="h4-list" style="margin-top:10px">' + (all.length ? all.slice().reverse().slice(0, 40).map(function (x) { var p = Math.round(sp(x)); return '<div class="h4-item"><span class="tt">' + E(x.t) + '<small>' + E(x.subject) + ' · ' + H.fmtDate(x.date) + ' · ' + bd(x.score) + '/' + bd(x.total) + '</small></span><span class="h4-chip ' + (p >= 80 ? 'ok' : p >= 50 ? 'warn' : 'bad') + '">' + bd(p) + '%</span><button type="button" class="h4-btn sm dng" data-a="sc-del" data-v="' + E(x.id) + '" aria-label="মুছুন">✕</button></div>'; }).join('') : H.empty('🏁', 'এখনো কোনো ফলাফল নেই')) + '</div></div></div>';
    return h;
  }
  H.add({
    id: 'scores', cat: 'progress', icon: '📊', label: 'স্কোর ট্র্যাকার', desc: 'বিষয়ভিত্তিক ফল, প্রগ্রেস গ্রাফ, দুর্বল বিষয় ও টার্গেট স্কোর', tags: 'score marks result graph target weak', render: scView, group: 'progress', priority: 80,
    click: function (el) {
      var a = el.dataset.a, s = CORE.S();
      if (a === 'sc-add') {
        var t = H.val('scT'), g = H.num('scG'), m = H.num('scM'), d = H.val('scD');
        if (!t) return U.toast('পরীক্ষার নাম লিখুন'); if (!isFinite(g) || !isFinite(m) || m <= 0 || g < 0) return U.toast('নম্বর সঠিকভাবে লিখুন'); if (g > m) return U.toast('প্রাপ্ত নম্বর মোট নম্বরের বেশি হতে পারে না'); if (!d) return U.toast('তারিখ দিন');
        s.scores.push({ id: 'score-' + U.uid(), t: t, subject: H.val('scS'), score: g, total: m, date: d, createdAt: Date.now() }); CORE.W(s); CORE.xp(2, 'score saved'); HP.paint();
      } else if (a === 'sc-del') { if (confirm('ফলাফলটি মুছবেন?')) { s.scores = s.scores.filter(function (x) { return String(x.id) !== el.dataset.v; }); CORE.W(s); HP.paint(); } }
      else if (a === 'sc-plan') H.addPlan(el.dataset.v + ' — দুর্বল অংশ রিভিশন', el.dataset.v, '', 'high', 'weak:' + el.dataset.v);
      else if (a === 'sc-exp') U.download('scores-' + H.today() + '.csv', H.csv([['Date', 'Exam', 'Subject', 'Score', 'Total', 'Percent']].concat(scAll().map(function (x) { return [x.date, x.t, x.subject, x.score, x.total, Math.round(sp(x))]; }))), 'text/csv;charset=utf-8');
    },
    change: function (el) {
      if (el.id === 'scF') { scSub = el.value; HP.paint(); }
      else if (el.id === 'tgAll') { var t = TG.get(); t.all = Math.max(1, Math.min(100, +el.value || 80)); TG.set(t); HP.paint(); }
      else if (el.dataset.tg) { var t2 = TG.get(); t2.sub[el.dataset.tg] = Math.max(1, Math.min(100, +el.value || 80)); TG.set(t2); HP.paint(); }
    }
  });

  /* ═════════ GPA Calculator (SSC / HSC) ═════════ */
  var GS = H.store('gpa', { mode: 'hsc', subs: null, target: 5, custom: false });
  var PRESET = {
    hsc: [['বাংলা', 0], ['ইংরেজি', 0], ['ICT', 0], ['পদার্থবিজ্ঞান', 0], ['রসায়ন', 0], ['উচ্চতর গণিত', 0], ['জীববিজ্ঞান', 1]],
    ssc: [['বাংলা', 0], ['ইংরেজি', 0], ['গণিত', 0], ['ধর্ম ও নৈতিক শিক্ষা', 0], ['পদার্থবিজ্ঞান', 0], ['রসায়ন', 0], ['জীববিজ্ঞান', 0], ['আইসিটি', 0], ['বাংলাদেশ ও বিশ্বপরিচয়', 0], ['উচ্চতর গণিত', 1]]
  };
  function gp(m) { if (m === '' || m == null || !isFinite(m)) return null; m = +m; if (m < 0 || m > 100) return null; return m >= 80 ? 5 : m >= 70 ? 4 : m >= 60 ? 3.5 : m >= 50 ? 3 : m >= 40 ? 2 : m >= 33 ? 1 : 0; }
  function letter(p) { return p >= 5 ? 'A+' : p >= 4 ? 'A' : p >= 3.5 ? 'A-' : p >= 3 ? 'B' : p >= 2 ? 'C' : p >= 1 ? 'D' : 'F'; }
  H.gpaCalc = function (rows) {
    var main = rows.filter(function (r) { return !r.fourth; }), fourth = rows.filter(function (r) { return r.fourth; })[0], pend = 0, fail = false, sum = 0, bonus = 0;
    main.forEach(function (r) { var p = gp(r.marks); if (p === null) pend++; else { sum += p; if (p === 0) fail = true; } });
    if (fourth) { var f = gp(fourth.marks); if (f !== null && f > 2) bonus = f - 2; }
    var n = main.length;
    return { n: n, pending: pend, sum: sum, bonus: bonus, fail: fail, gpa: n && !pend ? (fail ? 0 : Math.min(5, (sum + bonus) / n)) : null };
  };
  function gSubs() { var s = GS.get(); if (!s.subs || !s.subs.length) s.subs = PRESET[s.mode].map(function (x, i) { return { id: 'g' + i, n: x[0], marks: '', fourth: !!x[1] }; });
    if (s.subs.some(function (r) { return r.n === 'বিজ্ঞান'; })) { var o = []; s.subs.forEach(function (r) { if (r.n === 'বিজ্ঞান') ['পদার্থবিজ্ঞান', 'রসায়ন', 'জীববিজ্ঞান', 'আইসিটি'].forEach(function (n) { o.push({ id: 'g' + U.uid(), n: n, marks: '', fourth: false }); }); else o.push(r); }); s.subs = o; GS.set(s); }
    return s; }
  function gpaRes(res) {
    return '<div class="h4-row" style="margin-top:14px;gap:18px"><div class="h4-ring" style="--p:' + (res.gpa === null ? 0 : res.gpa / 5 * 100) + ';--c:#3dbd9b;width:96px;height:96px"><b style="font-size:1.2rem">' + (res.gpa === null ? '—' : bd(res.gpa.toFixed(2))) + '</b></div><div><b style="font-size:1.1rem">' + (res.gpa === null ? 'সব বিষয়ের নম্বর দিন' : res.fail ? 'কোনো বিষয়ে F — GPA 0.00' : 'গ্রেড ' + letter(res.gpa) + (res.gpa >= 5 ? ' · GPA-5 🎉' : '')) + '</b><div class="h4-mut">' + (res.pending ? bd(res.pending) + 'টি বিষয়ের নম্বর বাকি' : '') + (res.bonus ? ' · ৪র্থ বিষয় থেকে +' + bd(res.bonus.toFixed(2)) : '') + '</div></div></div>';
  }
  function gpaView() {
    var s = gSubs(), res = H.gpaCalc(s.subs), h = '<div class="h4"><div class="h4-card" style="--c:#3dbd9b"><div class="h4-row"><div><span class="h4-eyebrow">GPA CALCULATOR</span><h3 style="margin:2px 0 0">SSC / HSC গ্রেডিং</h3></div><span class="h4-sp"></span><div class="h4-seg"><button type="button" data-a="g-mode" data-v="ssc" aria-pressed="' + (s.mode === 'ssc') + '">SSC</button><button type="button" data-a="g-mode" data-v="hsc" aria-pressed="' + (s.mode === 'hsc') + '">HSC</button></div></div>';
    h += '<div id="gpaRes">' + gpaRes(res) + '</div></div>';
    h += '<div class="h4-card"><div class="h4-row"><h3 style="margin:0">বিষয় ও নম্বর</h3><span class="h4-sp"></span><button type="button" class="h4-btn sm" data-a="g-add">＋ বিষয়</button><button type="button" class="h4-btn sm" data-a="g-reset">↺ ডিফল্ট</button></div><div class="h4-grows">' + s.subs.map(function (r) {
      var p = gp(r.marks), bad = r.marks !== '' && p === null;
      return '<div class="h4-grow"><input class="h4-in gn" data-gn="' + E(r.id) + '" value="' + E(r.n) + '" maxlength="40" aria-label="বিষয়"><input class="h4-in gm' + (bad ? '" style="border-color:var(--h4-bad)' : '') + '" data-gm="' + E(r.id) + '" type="number" min="0" max="100" value="' + E(r.marks) + '" placeholder="নম্বর" aria-label="নম্বর"><span class="gg">' + (p === null ? '<span class="h4-mut">গ্রেড —</span>' : '<span class="h4-gr g' + Math.floor(p) + '"><b>' + letter(p) + '</b><small>GP ' + bd(p.toFixed(2)) + '</small></span>') + '</span><label class="g4"><input type="radio" name="g4" data-g4="' + E(r.id) + '"' + (r.fourth ? ' checked' : '') + '> ৪র্থ</label><button type="button" class="h4-btn sm dng" data-a="g-del" data-v="' + E(r.id) + '" aria-label="মুছুন">✕</button></div>';
    }).join('') + '</div><p class="h4-mut" style="margin:8px 0 0">৪র্থ বিষয়ে ২-এর বেশি গ্রেড পয়েন্ট থাকলে অতিরিক্ত অংশ যোগ হয়। প্রধান কোনো বিষয়ে F হলে GPA ০।</p></div>';
    /* target */
    var tg = s.target, mainRows = s.subs.filter(function (r) { return !r.fourth; }), done = mainRows.filter(function (r) { return gp(r.marks) !== null; }), pend = mainRows.length - done.length, doneSum = done.reduce(function (n, r) { return n + gp(r.marks); }, 0), f4 = s.subs.filter(function (r) { return r.fourth; })[0], bon = f4 && gp(f4.marks) > 2 ? gp(f4.marks) - 2 : 0;
    h += '<div class="h4-card" style="--c:#6c7ae0"><h3>🎯 Target GPA হিসাব</h3><div class="h4-row"><label class="h4-mut">লক্ষ্য GPA</label><select class="h4-in" id="gT" style="width:auto">' + H.opts([5, 4.9, 4.8, 4.75, 4.5, 4.25, 4, 3.5, 3], tg) + '</select></div><div style="margin-top:12px">';
    if (!mainRows.length) h += '<p class="h4-mut">বিষয় যোগ করুন।</p>';
    else if (!pend) { h += '<div class="h4-note ' + (res.gpa >= tg ? 'ok' : 'bad') + '">' + (res.gpa >= tg ? '✓ লক্ষ্য অর্জিত — আপনার GPA ' + bd(res.gpa.toFixed(2)) : 'সব নম্বর দেওয়া আছে — GPA ' + bd((res.gpa || 0).toFixed(2)) + ', লক্ষ্য ' + bd(tg) + ' থেকে ' + bd((tg - (res.gpa || 0)).toFixed(2)) + ' কম।') + '</div>'; }
    else {
      var need = (tg * mainRows.length - doneSum - bon) / pend, mm = need > 4 ? 80 : need > 3.5 ? 70 : need > 3 ? 60 : need > 2 ? 50 : need > 1 ? 40 : need > 0 ? 33 : 0;
      h += need > 5.0001 ? '<div class="h4-note bad">বাকি ' + bd(pend) + 'টি বিষয়ে সবগুলোতে A+ পেলেও GPA ' + bd(tg) + ' সম্ভব নয়। লক্ষ্য একটু কমিয়ে দেখুন।</div>' : '<div class="h4-note ok">বাকি ' + bd(pend) + 'টি বিষয়ের <b>প্রতিটিতে গড়ে গ্রেড পয়েন্ট ' + bd(Math.max(0, need).toFixed(2)) + '</b> দরকার (' + letter(Math.max(0, Math.ceil(need * 2) / 2)) + ' এর কাছাকাছি) — অর্থাৎ প্রতিটিতে অন্তত <b>' + bd(mm) + '+ নম্বর</b>।</div>';
    }
    return h + '</div></div></div>';
  }
  H.add({
    id: 'gpa', cat: 'progress', icon: '🎓', label: 'GPA ক্যালকুলেটর', desc: 'SSC/HSC মোড, কাস্টম বিষয় ও টার্গেট GPA হিসাব', tags: 'gpa grade ssc hsc target cgpa', render: gpaView, group: 'progress', priority: 70,
    click: function (el) {
      var a = el.dataset.a, s = gSubs();
      if (a === 'g-mode') { s.mode = el.dataset.v; s.subs = null; GS.set(s); HP.paint(); }
      else if (a === 'g-add') { if (s.subs.length >= 14) return U.toast('সর্বোচ্চ ১৪টি বিষয়'); s.subs.push({ id: 'g' + U.uid(), n: 'নতুন বিষয়', marks: '', fourth: false }); GS.set(s); HP.paint(); }
      else if (a === 'g-del') { s.subs = s.subs.filter(function (r) { return r.id !== el.dataset.v; }); GS.set(s); HP.paint(); }
      else if (a === 'g-reset') { if (confirm('ডিফল্ট বিষয়ে ফিরবেন? নম্বরগুলো মুছে যাবে।')) { s.subs = null; GS.set(s); HP.paint(); } }
    },
    input: function (el) { var s = gSubs(), id = el.dataset.gm || el.dataset.gn; if (!id) return; var r = s.subs.filter(function (x) { return x.id === id; })[0]; if (!r) return; if (el.dataset.gm) { r.marks = el.value === '' ? '' : el.value; } else r.n = el.value.slice(0, 40); GS.set(s); var box = document.getElementById('gpaRes'); if (box) box.innerHTML = gpaRes(H.gpaCalc(s.subs)); },
    change: function (el) {
      var s = gSubs();
      if (el.dataset.g4) { s.subs.forEach(function (r) { r.fourth = r.id === el.dataset.g4; }); GS.set(s); HP.paint(); }
      else if (el.id === 'gT') { s.target = +el.value; GS.set(s); HP.paint(); }
      else if (el.dataset.gm) HP.paint();
    }
  });

  /* ═════════ Daily Habits (+ automatic statistics) ═════════ */
  var HS = H.store('hab', { habits: null, log: {}, migrated: 0 });
  var HDEF = ['৬+ ঘণ্টা পড়া', 'পানি ২ লিটার', '৭ ঘণ্টা ঘুম', 'ব্যায়াম/হাঁটা', 'রিভিশন ১ চ্যাপ্টার'];
  function hGet() {
    var s = HS.get(), changed = false;
    if (!s.habits || !s.habits.length) { s.habits = HDEF.map(function (n, i) { return { id: 'h' + i, n: n }; }); changed = true; }
    if (!s.migrated) {
      var lg = CORE.S().hab || {}; Object.keys(lg).forEach(function (k) {
        var m = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(k); if (!m || !Array.isArray(lg[k])) return; var key = m[1] + '-' + ('0' + m[2]).slice(-2) + '-' + ('0' + m[3]).slice(-2);
        var ids = lg[k].map(function (i) { return 'h' + i; }); s.log[key] = Array.from(new Set((s.log[key] || []).concat(ids)));
      }); s.migrated = 1; changed = true;
    }
    if (changed) HS.set(s); return s;
  }
  function hasH(s, k, id) { return (s.log[k] || []).indexOf(id) >= 0; }
  function hStreak(s, id) { var k = H.today(), n = 0; if (!hasH(s, k, id)) k = H.addDays(k, -1); while (hasH(s, k, id)) { n++; k = H.addDays(k, -1); } return n; }
  function habView() {
    var s = hGet(), today = H.today(), days = []; for (var i = 6; i >= 0; i--) days.push(H.addDays(today, -i));
    var done7 = 0, tot7 = s.habits.length * 7, perfect = 0;
    days.forEach(function (d) { var c = s.habits.filter(function (x) { return hasH(s, d, x.id); }).length; done7 += c; if (c === s.habits.length && c) perfect++; });
    var d30 = 0; for (var j = 0; j < 30; j++) { var kk = H.addDays(today, -j); d30 += s.habits.filter(function (x) { return hasH(s, kk, x.id); }).length; }
    var best = s.habits.reduce(function (n, x) { return Math.max(n, hStreak(s, x.id)); }, 0), todayDone = s.habits.filter(function (x) { return hasH(s, today, x.id); }).length;
    var secs = days.map(function (d) { return H.studySecs(d); }), totalS = secs.reduce(function (a, b) { return a + b; }, 0), bestI = secs.indexOf(Math.max.apply(null, secs)), room = U.load('clroom_v1', { sessions: [], subjects: [] }), bySub = {};
    (room.sessions || []).forEach(function (x) { if (x.start && days.indexOf(U.dayKey(new Date(x.start))) >= 0) { var sb = (room.subjects.filter(function (q) { return q.id === x.sid; })[0] || {}).name || 'অন্যান্য'; bySub[sb] = (bySub[sb] || 0) + (+x.secs || 0); } });
    var top = Object.keys(bySub).sort(function (a, b) { return bySub[b] - bySub[a]; }).slice(0, 3);
    var h = '<div class="h4"><div class="h4-card" style="--c:#3dbd9b"><span class="h4-eyebrow">DAILY HABITS</span><div class="h4-kpis" style="margin-top:8px">' + H.stat(bd(todayDone) + '/' + bd(s.habits.length), 'আজ সম্পন্ন', '#3dbd9b') + H.stat(bd(H.pct(done7, tot7)) + '%', '৭ দিনের হার', '#5a8dee') + H.stat(bd(perfect), 'পারফেক্ট দিন (৭ দিনে)', '#8b7cf6') + H.stat('🔥 ' + bd(best), 'সেরা স্ট্রিক', '#f2b45a') + '</div></div>';
    h += '<div class="h4-card"><div class="h4-row"><h3 style="margin:0">অভ্যাসের তালিকা</h3><span class="h4-sp"></span><button type="button" class="h4-btn sm" data-a="h-new">＋ নতুন অভ্যাস</button></div><div class="h4-scroll"><table class="h4-table" style="margin-top:8px"><thead><tr><th>অভ্যাস</th>' + days.map(function (d) { var dd = new Date(d + 'T00:00:00'); return '<th style="text-align:center">' + H.DAYB[dd.getDay()] + '<br><small>' + bd(dd.getDate()) + '</small></th>'; }).join('') + '<th>স্ট্রিক</th><th></th></tr></thead><tbody>' + s.habits.map(function (x) {
      return '<tr><td style="min-width:130px">' + E(x.n) + '</td>' + days.map(function (d) { var on = hasH(s, d, x.id); return '<td style="text-align:center"><button type="button" class="h4-chk' + (on ? ' on' : '') + (d === today ? '" style="border-color:var(--h4-acc)' : '') + '" data-a="h-tog" data-v="' + E(x.id) + '" data-d="' + d + '" aria-pressed="' + on + '" aria-label="' + E(x.n) + ' ' + d + '">' + (on ? '✓' : '') + '</button></td>'; }).join('') + '<td>🔥 ' + bd(hStreak(s, x.id)) + '</td><td><button type="button" class="h4-btn sm" data-a="h-ren" data-v="' + E(x.id) + '" aria-label="নাম বদলান">✎</button><button type="button" class="h4-btn sm dng" data-a="h-del" data-v="' + E(x.id) + '" aria-label="মুছুন">✕</button></td></tr>';
    }).join('') + '</tbody></table></div></div>';
    h += '<div class="h4-card" style="--c:#8b7cf6"><h3>⚙️ স্বয়ংক্রিয় স্টাডি পরিসংখ্যান <small>Study Room থেকে</small></h3><div class="h4-kpis">' + H.stat(U.dur(totalS), 'গত ৭ দিনে পড়া', '#8b7cf6') + H.stat(U.dur(Math.round(totalS / 7)), 'দিনে গড়', '#5a8dee') + H.stat(totalS ? H.fmtDate(days[bestI]) : '—', 'সেরা দিন', '#3dbd9b') + H.stat('🔥 ' + bd(H.streak()), 'পড়ার স্ট্রিক (দিন)', '#f2b45a') + '</div><div class="h4-spark" style="margin-top:12px;--c:#8b7cf6">' + (function () { var mx = Math.max.apply(null, secs.concat([1])); return secs.map(function (v, i) { return '<i class="' + (v ? '' : 'z') + '" title="' + H.fmtDate(days[i]) + ' · ' + U.dur(v) + '" style="height:' + Math.max(6, Math.round(v / mx * 100)) + '%"></i>'; }).join(''); })() + '</div>' + (top.length ? '<p class="h4-mut" style="margin:10px 0 0">সবচেয়ে বেশি সময় দিয়েছেন: ' + top.map(function (t) { return '<b>' + E(t) + '</b> (' + U.dur(bySub[t]) + ')'; }).join(', ') + '</p>' : '<p class="h4-mut" style="margin:10px 0 0">Study Room-এ টাইমার চালালে এখানে স্বয়ংক্রিয়ভাবে হিসাব দেখা যাবে।</p>') + '<div class="h4-row" style="margin-top:10px"><a class="h4-btn sm" href="#/hub/wreview">সাপ্তাহিক রিভিশন (Weekly Review)</a><a class="h4-btn sm" href="#/hub/streak">স্ট্রিক</a></div></div></div>';
    return h;
  }
  H.add({
    id: 'hab', cat: 'progress', icon: '🌱', label: 'ডেইলি হ্যাবিট', desc: 'অভ্যাস ট্র্যাকার, স্ট্রিক ও স্বয়ংক্রিয় স্টাডি পরিসংখ্যান', tags: 'habit streak daily review statistics', render: habView, group: 'progress', priority: 60,
    click: function (el) {
      var a = el.dataset.a, s = hGet();
      if (a === 'h-tog') { var d = el.dataset.d, l = s.log[d] || (s.log[d] = []), i = l.indexOf(el.dataset.v); if (i >= 0) l.splice(i, 1); else l.push(el.dataset.v); HS.set(s); HP.paint(); }
      else if (a === 'h-new') { var n = prompt('নতুন অভ্যাসের নাম'); if (n && n.trim()) { s.habits.push({ id: 'h' + U.uid(), n: n.trim().slice(0, 40) }); HS.set(s); HP.paint(); } }
      else if (a === 'h-ren') { var h0 = s.habits.filter(function (x) { return x.id === el.dataset.v; })[0], n2 = h0 && prompt('অভ্যাসের নাম', h0.n); if (n2 && n2.trim()) { h0.n = n2.trim().slice(0, 40); HS.set(s); HP.paint(); } }
      else if (a === 'h-del') { if (confirm('অভ্যাসটি মুছবেন? (ইতিহাস থেকেও সরবে)')) { s.habits = s.habits.filter(function (x) { return x.id !== el.dataset.v; }); Object.keys(s.log).forEach(function (k) { s.log[k] = s.log[k].filter(function (i) { return i !== el.dataset.v; }); }); HS.set(s); HP.paint(); } }
    }
  });

  /* ═════════ Exam Center ═════════ */
  var EX = H.store('examx', { meta: {}, plan: {} });
  function exKey(x) { return x.n + '|' + x.d; }
  function chaptersLeft(sub, sel) { var st = SYL.get(), lg = legacy(); return (CUR[sub] || []).filter(function (ch) { return (!sel || !sel.length || sel.indexOf(ch) >= 0) && sget(sub + '|' + ch, st, lg).st !== 'mastered'; }); }
  function chipBoxes(sub, sel, attr) { var l = CUR[sub] || []; return l.length ? l.map(function (c) { return '<label class="h4-chip" style="cursor:pointer;gap:6px"><input type="checkbox" ' + attr + ' value="' + E(c) + '"' + (sel && sel.indexOf(c) >= 0 ? ' checked' : '') + '> ' + E(c) + '</label>'; }).join('') : '<span class="h4-mut" style="font-size:.8rem">বিষয় বেছে নিলে অধ্যায় দেখাবে (কিছু না বাছলে সব অধ্যায় ধরা হবে)</span>'; }
  function cdText(x) { var ms = new Date(x.d + 'T' + x.tm + ':00') - new Date(); if (ms <= 0) return 'সময় শেষ'; var d = Math.floor(ms / 864e5), h = Math.floor(ms % 864e5 / 36e5), m = Math.floor(ms % 36e5 / 6e4); return (d ? bd(d) + ' দিন ' : '') + bd(h) + ' ঘণ্টা ' + bd(m) + ' মিনিট বাকি'; }
  function exView() {
    var s = CORE.S(), today = H.today(), ex = (s.exams || []).slice().sort(function (a, b) { return a.d < b.d ? -1 : 1; }), meta = EX.get().meta, ss = subStats();
    var h = '<div class="h4"><div class="h4-card" style="--c:#2bb3a3"><span class="h4-eyebrow">EXAM CENTER</span><h3 style="margin:2px 0 8px">পরীক্ষা যোগ করুন</h3><div class="h4-form"><label class="h4-f w2">পরীক্ষার নাম<input class="h4-in" id="xN" maxlength="60" placeholder="যেমন: অর্ধবার্ষিক / HSC Model Test"></label><label class="h4-f">তারিখ<input class="h4-in" id="xD" type="date" min="' + today + '"></label><label class="h4-f">সময় (ঐচ্ছিক)<input class="h4-in" id="xTm" type="time"></label><label class="h4-f">বিষয় (সংযোগের জন্য)<select class="h4-in" id="xS" data-xsub="new">' + H.subjOpts('', 'নির্দিষ্ট নয়') + '</select></label><div class="h4-f wf">অধ্যায় (যেগুলো পরীক্ষায় আছে)<div class="h4-row" id="xChWrap" style="gap:6px">' + chipBoxes('', [], 'data-xnew') + '</div></div><label class="h4-f">লক্ষ্য %<input class="h4-in" id="xT" type="number" min="1" max="100" value="80"></label><label class="h4-f">পূর্ণমান<input class="h4-in" id="xM" type="number" min="1" value="100"></label><button type="button" class="h4-btn pri" data-a="x-add">যোগ করুন</button></div></div>';
    if (!ex.length) h += '<div class="h4-card">' + H.empty('📅', 'কোনো পরীক্ষা নেই — ওপরে প্রথম পরীক্ষাটি যোগ করুন।') + '</div>';
    ex.forEach(function (x) {
      var left = H.dayDiff(today, x.d), m = meta[exKey(x)] || {}, sub = m.s || '', tgt = m.t || 80, tot = m.m || 100, left_ch = sub ? chaptersLeft(sub, m.c) : [], pace = left > 0 && left_ch.length ? left_ch.length / Math.max(1, left - (left > 3 ? 2 : 0)) : 0;
      var cur = sub ? ss.filter(function (q) { return q.s === sub; })[0] : null, need = Math.round(tot * tgt / 100);
      h += '<div class="h4-card" style="--c:#2bb3a3;opacity:' + (left < 0 ? .6 : 1) + '"><div class="h4-row" style="gap:14px"><div class="h4-ring" style="--p:' + (left < 0 ? 0 : Math.max(4, 100 - Math.min(100, left))) + ';--c:' + (left <= 7 && left >= 0 ? '#f2b45a' : '#2bb3a3') + '"><b>' + (left < 0 ? '✓' : bd(left)) + '</b></div><div style="min-width:0"><b style="font-size:1.05rem">' + E(x.n) + '</b><div class="h4-mut">' + H.fmtDate(x.d) + (x.tm ? ' · ' + bd(x.tm) : '') + ' · ' + (left < 0 ? 'শেষ হয়েছে' : left === 0 && !x.tm ? 'আজই পরীক্ষা!' : x.tm && left >= 0 ? '<span data-cd="' + E(x.d + '|' + x.tm) + '">' + cdText(x) + '</span>' : bd(left) + ' দিন বাকি') + (sub ? ' · ' + E(sub) : '') + '</div></div><span class="h4-sp"></span><button type="button" class="h4-btn sm dng" data-a="x-del" data-d="' + E(x.d) + '" data-n="' + E(x.n) + '" aria-label="মুছুন">✕</button></div>';
      if (left >= 0) {
        h += '<div class="h4-grid h4-g3" style="margin-top:12px"><div class="h4-stat" style="--c:#6c7ae0"><b>' + (sub ? bd(left_ch.length) : '—') + '</b><span>বাকি অধ্যায় ' + (sub ? '(Mastered নয়)' : '— বিষয় বেছে নিন') + '</span></div><div class="h4-stat" style="--c:#f2b45a"><b>' + (pace ? bd(pace.toFixed(1)) : '—') + '</b><span>প্রতিদিন অধ্যায় (Exam Pace)</span></div><div class="h4-stat" style="--c:#3dbd9b"><b>' + bd(need) + '/' + bd(tot) + '</b><span>লক্ষ্য নম্বর (' + bd(tgt) + '%)</span></div></div>';
        h += '<div class="h4-row" style="margin-top:10px">' + (cur ? '<span class="h4-chip ' + (cur.avg >= tgt ? 'ok' : 'warn') + '">বর্তমান গড় ' + bd(Math.round(cur.avg)) + '%' + (cur.avg < tgt ? ' · আরও ' + bd(Math.round(tgt - cur.avg)) + '% দরকার' : ' ✓') + '</span>' : '<span class="h4-mut" style="font-size:.8rem">এই বিষয়ে Score Tracker-এ ফল যোগ করলে গড় তুলনা দেখাবে</span>') + '<span class="h4-sp"></span>' + (sub ? '<button type="button" class="h4-btn sm" data-a="x-sched" data-d="' + E(x.d) + '" data-n="' + E(x.n) + '">🗓 প্ল্যান বানান</button>' : '') + '</div>';
        h += '<details class="h4-det" style="margin-top:10px"><summary>🧮 Marks Needed Calculator</summary><div><div class="h4-form"><label class="h4-f">এখন পর্যন্ত প্রাপ্ত<input class="h4-in" data-mn="got" data-i="' + E(exKey(x)) + '" type="number" min="0" placeholder="যেমন ৭৫"></label><label class="h4-f">তার মোট<input class="h4-in" data-mn="of" data-i="' + E(exKey(x)) + '" type="number" min="1" placeholder="১০০"></label><label class="h4-f">চূড়ান্ত পরীক্ষার পূর্ণমান<input class="h4-in" data-mn="fin" data-i="' + E(exKey(x)) + '" type="number" min="1" value="' + tot + '"></label></div><div class="h4-note" data-mnout="' + E(exKey(x)) + '" style="margin-top:8px">নম্বর দিন — চূড়ান্ত পরীক্ষায় কত পেলে ' + bd(tgt) + '% হবে তা দেখাবে।</div></div></details>';
        h += '<details class="h4-det" style="margin-top:10px"><summary>✏️ বিষয় ও অধ্যায় বদলান</summary><div><div class="h4-form"><label class="h4-f w2">বিষয়<select class="h4-in" data-xsub="' + E(exKey(x)) + '">' + H.subjOpts(sub, 'নির্দিষ্ট নয়') + '</select></label></div><div class="h4-row" style="gap:6px;margin-top:8px" id="xc-' + E(exKey(x)) + '">' + chipBoxes(sub, m.c || [], 'data-xed="' + E(exKey(x)) + '"') + '</div></div></details>';
        h += (sub && left_ch.length ? '<details class="h4-det"><summary>📚 বাকি অধ্যায় (' + bd(left_ch.length) + ')</summary><div><div class="h4-row">' + left_ch.map(function (c) { return '<span class="h4-chip">' + E(c) + '</span>'; }).join('') + '</div></div></details>' : '');
      }
      h += '</div>';
    });
    return h + '</div>';
  }
  function exMeta(key, v) { var e = EX.get(); e.meta[key] = Object.assign(e.meta[key] || {}, v); EX.set(e); }
  H.add({
    id: 'exam-center', cat: 'exam', icon: '🎯', label: 'Exam Center', desc: 'কাউন্টডাউন, প্ল্যান, পেস ও লক্ষ্য নম্বর — সিলেবাস ও স্কোরের সঙ্গে যুক্ত', tags: 'exam countdown plan pace marks needed target', isNew: true, render: exView, group: 'exam', priority: 95,
    click: function (el) {
      var a = el.dataset.a, s = CORE.S();
      if (a === 'x-add') {
        var n = H.val('xN'), d = H.val('xD'); if (!n || !d) return U.toast('নাম ও তারিখ দিন');
        var ex0 = { n: n.slice(0, 60), d: d }; if (H.val('xTm')) ex0.tm = H.val('xTm'); s.exams.push(ex0); CORE.W(s); exMeta(n + '|' + d, { c: H.$$('[data-xnew]:checked').map(function (c) { return c.value; }), s: H.val('xS'), t: Math.max(1, Math.min(100, H.num('xT') || 80)), m: Math.max(1, H.num('xM') || 100) }); HP.paint();
      } else if (a === 'x-del') { if (confirm('পরীক্ষাটি মুছবেন?')) { s.exams = s.exams.filter(function (x) { return !(x.n === el.dataset.n && x.d === el.dataset.d); }); CORE.W(s); HP.paint(); } }
      else if (a === 'x-sched') {
        var m = EX.get().meta[el.dataset.n + '|' + el.dataset.d] || {}, left = H.dayDiff(H.today(), el.dataset.d), chs = chaptersLeft(m.s || ''); if (!chs.length || left < 1) return U.toast('প্ল্যান বানানোর মতো অধ্যায় বা সময় নেই');
        var days = Math.max(1, Math.min(14, left - (left > 3 ? 2 : 0))), per = Math.ceil(chs.length / days), ents = s.weekPlanner.entries, n = 0;
        chs.forEach(function (c, i) { var day = H.addDays(H.today(), Math.min(days - 1, Math.floor(i / per))); if (!ents.some(function (e) { return e.t === c + ' — পড়া/রিভিশন' && e.date === day; })) { ents.push({ id: 'wk-' + U.uid(), date: day, t: c + ' — পড়া/রিভিশন', subject: m.s, chapter: c, priority: 'medium', done: 0, createdAt: Date.now() }); n++; } });
        CORE.W(s); U.toast(bd(n) + 'টি টাস্ক Day by Day প্ল্যানে যোগ হয়েছে'); setTimeout(function () { location.hash = '#/hub/week?m=day'; }, 600);
      }
    },
    change: function (el) {
      if (el.dataset.xsub === 'new') { var w = document.getElementById('xChWrap'); if (w) w.innerHTML = chipBoxes(el.value, [], 'data-xnew'); }
      else if (el.dataset.xsub) { exMeta(el.dataset.xsub, { s: el.value, c: [] }); HP.paint(); }
      else if (el.dataset.xed) { var k = el.dataset.xed, sel = H.$$('[data-xed="' + k + '"]:checked').map(function (c) { return c.value; }); exMeta(k, { c: sel }); HP.paint(); }
    },
    mount: function () { clearInterval(H._xt); H._xt = setInterval(function () { H.$$('[data-cd]').forEach(function (n) { var p = n.getAttribute('data-cd').split('|'); n.textContent = cdText({ d: p[0], tm: p[1] }); }); }, 30000); },
    unmount: function () { clearInterval(H._xt); },
    input: function (el) {
      if (!el.dataset.mn) return; var k = el.dataset.i, root = el.closest('details'), g = +root.querySelector('[data-mn=got]').value, o = +root.querySelector('[data-mn=of]').value, f = +root.querySelector('[data-mn=fin]').value, out = root.querySelector('[data-mnout]'), m = EX.get().meta[k] || {}, tgt = m.t || 80;
      if (!(o > 0) || !(f > 0) || g < 0 || isNaN(g)) { out.className = 'h4-note'; out.textContent = 'সঠিক নম্বর দিন।'; return; } if (g > o) { out.className = 'h4-note bad'; out.textContent = 'প্রাপ্ত নম্বর মোট নম্বরের বেশি হতে পারে না।'; return; }
      var total = o + f, req = Math.ceil(total * tgt / 100 - g); out.className = 'h4-note ' + (req > f ? 'bad' : 'ok');
      out.innerHTML = req <= 0 ? '✓ লক্ষ্য ' + bd(tgt) + '% ইতিমধ্যেই নিশ্চিত!' : req > f ? 'লক্ষ্য ' + bd(tgt) + '% এখন সম্ভব নয় (দরকার ' + bd(req) + ', পূর্ণমান ' + bd(f) + ')।' : 'চূড়ান্ত পরীক্ষায় <b>' + bd(req) + '/' + bd(f) + '</b> (' + bd(Math.round(req / f * 100)) + '%) পেলে মোট ' + bd(tgt) + '% হবে।';
    }
  });

  /* ═════════ Dashboard page ═════════ */
  H.add({ id: 'dashboard', cat: 'dashboard', icon: '🏠', label: 'My Study Dashboard', desc: 'আজকের কাজ, পরীক্ষা, রিভিশন, পড়ার সময় ও অগ্রগতি এক জায়গায়', isNew: true, hide: true, render: function () { return '<div class="h4">' + H.dashboardHTML(true) + '</div>'; } });

  H.backup.push({ id: 'syl', label: 'Syllabus (৪ ধাপ + রিভিশন)', keys: ['clh114_syl'] }, { id: 'targets', label: 'Score লক্ষ্য', keys: ['clh114_targets'] }, { id: 'gpa', label: 'GPA ক্যালকুলেটর', keys: ['clh114_gpa'] }, { id: 'hab', label: 'Daily Habits', keys: ['clh114_hab'] }, { id: 'examx', label: 'Exam Center', keys: ['clh114_examx'] });
})();
