/* Golden Snitch Student Hub v114 — core layer.
   Adds: shared helpers (CL_H114), tool catalogue with 9 sections, premium home (dashboard · search · pins),
   simplified tool-page navigation, redirects for merged tools, class-routine / assignment integration and reminders.
   Loads after the original Hub files and wraps (never replaces) their entry points. */
(function () {
  'use strict';
  var HP = window.CL_HUBPLUS, CORE = window.CL_HUBCORE, HUB = window.CL_HUB;
  if (!HP || !CORE || !HUB) return;
  var U = HP.u, E = U.E, bd = U.bd;
  var H = window.CL_H114 = { u: U, E: E, bd: bd, core: CORE, hp: HP, mods: {}, backup: [] };
  var TOOL_LABELS = {
    plan: 'Study Planner', week: 'Weekly Planner', monthly: 'Monthly Planner', syllabus: 'Syllabus Tracker', board: 'Assignment Board',
    focus: 'Focus Timer', exam: 'Exam Countdown', revision: 'Revision Planner', review: 'Smart Revision',
    goals: 'Study Goals', scores: 'Score Tracker', cards: 'Flashcards', notes: 'Notes Center', hab: 'Habit Tracker',
    form: 'Formula Library', gpa: 'GPA Calculator', backup: 'Backup & Restore', tools: 'Unit Converter',
    calculator: 'Scientific Calculator', geometry: 'Geometry Board', 'study-room': 'Study Room',
    mistakes: 'Mistake Notebook', matrix: 'Matrix Calculator', eisenhower: 'Eisenhower Matrix',
    'exam-plan': 'Exam Plan Builder', 'marks-needed': 'Marks Needed Calculator', 'time-blocks': 'Time Blocking Planner',
    'next-up': 'Study Recommendation', feynman: 'Feynman Learning Notes', cornell: 'Cornell Notes',
    checklists: 'Study Checklists', sleep: 'Sleep Planner', 'eye-rest': 'Eye Rest Reminder', journal: 'Study Journal',
    vocab: 'Vocabulary Bank', academic: 'Academic Labs', 'exam-center': 'Exam Center', doubts: 'Doubt Tracker',
    molar: 'Molar Mass Calculator', vector: 'Vector Calculator', stats: 'Statistics Calculator', quad: 'Quadratic Solver',
    base: 'Number Base Converter', percent: 'Percentage & Ratio Calculator', balancer: 'Equation Balancer',
    elements: 'Periodic Table Explorer', solution: 'Solution Calculator', circuit: 'Circuit Lab',
    complex: 'Complex Number Calculator', counting: 'Counting Calculator', series: 'Sequences & Series',
    pace: 'Exam Pace Tracker', streak: 'Study Streak Tracker', wreview: 'Weekly Review', reading: 'Reading List',
    '#/shortcuts': 'MCQ Shortcuts', '#/solver': 'Formula Solver', '#/reference': 'Reference Guide', '#/share-card': 'Progress Card'
  };
  function labelFor(id, fallback) { return TOOL_LABELS[id] || fallback; }
  /* Apply the English names to tools registered before this layer loads. */
  (HP.tools || []).forEach(function (t) {
    if (t.id === 'matrix' && /Eisenhower/i.test(t.label || '')) t.id = 'eisenhower';
    if (TOOL_LABELS[t.id]) t.label = TOOL_LABELS[t.id];
  });
  (window.CL_STUDIO && window.CL_STUDIO.tiles || []).forEach(function (t) {
    var id = String(t.href || '').replace(/^#\/hub\//, '');
    if (id === 'matrix' && /Eisenhower/i.test(t.label || '')) { id = 'eisenhower'; t.href = '#/hub/eisenhower'; }
    if (TOOL_LABELS[id]) t.label = TOOL_LABELS[id];
  });
  CORE.TABS.forEach(function (t) {
    if (TOOL_LABELS[t[0]]) { var ic = String(t[1] || '').split(/\s+/)[0] || '•'; t[1] = ic + ' ' + TOOL_LABELS[t[0]]; }
  });

  /* ───────── helpers ───────── */
  function clone(v) { return JSON.parse(JSON.stringify(v)); }
  H.clone = clone;
  H.$ = function (s, r) { return (r || document).querySelector(s); };
  H.$$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  H.val = function (id) { var e = document.getElementById(id); return e ? String(e.value).trim() : ''; };
  H.num = function (id) { var v = H.val(id).replace(/,/g, '.'); if (v === '') return NaN; return Number(v); };
  H.today = function () { return U.dayKey(new Date()); };
  H.addDays = function (k, n) { var d = new Date(k + 'T00:00:00'); d.setDate(d.getDate() + n); return U.dayKey(d); };
  H.dayDiff = function (a, b) { return Math.round((new Date(b + 'T00:00:00') - new Date(a + 'T00:00:00')) / 864e5); };
  H.MON = ['জানু', 'ফেব্রু', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'];
  H.DAYB = ['রবি', 'সোম', 'মঙ্গল', 'বুধ', 'বৃহঃ', 'শুক্র', 'শনি'];
  H.fmtDate = function (k) { var d = new Date(k + 'T00:00:00'); return isNaN(d) ? '' : bd(d.getDate()) + ' ' + H.MON[d.getMonth()]; };
  H.pct = function (a, b) { return b > 0 ? Math.round(a / b * 100) : 0; };
  H.opts = function (list, cur) { return list.map(function (x) { var v = Array.isArray(x) ? x[0] : x, l = Array.isArray(x) ? x[1] : x; return '<option value="' + E(v) + '"' + (String(v) === String(cur) ? ' selected' : '') + '>' + E(l) + '</option>'; }).join(''); };
  H.empty = function (icon, msg) { return '<div class="h4-empty"><b>' + icon + '</b>' + msg + '</div>'; };
  H.bar = function (p, c) { return '<div class="h4-bar"' + (c ? ' style="--c:' + c + '"' : '') + '><i style="width:' + Math.max(0, Math.min(100, p)) + '%"></i></div>'; };
  H.ring = function (p, label, c) { p = Math.max(0, Math.min(100, Math.round(p))); return '<div class="h4-ring" style="--p:' + p + ';--c:' + (c || 'var(--h4-acc)') + '"><b>' + bd(p) + '%</b></div>'; };
  H.stat = function (n, label, c) { return '<div class="h4-stat"' + (c ? ' style="--c:' + c + '"' : '') + '><b>' + n + '</b><span>' + label + '</span></div>'; };
  H.fail = function () { U.toast('সেভ করা যায়নি — ব্রাউজারের স্টোরেজ ভরে গেছে হতে পারে'); };
  H.SUBJECTS = CORE.SUBJECTS;
  H.chapters = function (sub) { return (CORE.CURRICULUM[sub] || []).slice(); };
  H.subjOpts = function (cur, blank) { return (blank ? '<option value="">' + blank + '</option>' : '') + H.opts(CORE.SUBJECTS, cur); };
  H.chapOpts = function (sub, cur, blank) { return '<option value="">' + (blank || 'অধ্যায় (ঐচ্ছিক)') + '</option>' + H.opts(H.chapters(sub), cur); };
  /* generic: <select data-h4sub="idOfChapterSelect"> keeps the chapter list in sync */
  document.addEventListener('change', function (e) {
    var t = e.target; if (!t || !t.getAttribute) return;
    var target = t.getAttribute('data-h4sub'); if (!target) return;
    var c = document.getElementById(target); if (c) c.innerHTML = H.chapOpts(t.value, '', c.getAttribute('data-blank') || null);
  });

  /* persistent stores (localStorage "clh114_<name>") */
  H.store = function (name, def) {
    var key = 'clh114_' + name;
    return {
      key: key,
      get: function () {
        var v = U.load(key, null);
        if (v == null || (Array.isArray(def) !== Array.isArray(v)) || typeof v !== typeof def) return clone(def);
        if (!Array.isArray(def) && typeof def === 'object') for (var k in def) if (!(k in v)) v[k] = clone(def[k]);
        return v;
      },
      set: function (v) { var ok = U.save(key, v); if (!ok) H.fail(); return ok; }
    };
  };
  var PREFS = H.store('prefs', { classRemind: 0, deadlineAlert: 1, lastAlert: '', cat: 'all' });
  H.prefs = PREFS;

  /* tool registration with catalogue metadata */
  var META = {};
  H.add = function (def) {
    if (TOOL_LABELS[def.id]) def.label = TOOL_LABELS[def.id];
    META[def.id] = { cat: def.cat, tags: def.tags || '', isNew: !!def.isNew, hide: !!def.hide, priority: def.priority || 0 };
    if (!REMOVED[def.id]) HP.add(def);
  };
  H.setMeta = function (id, m) { META[id] = Object.assign(META[id] || {}, m); };
  H.repaint = function () { HP.paint(); };

  /* ───────── sections (9) ───────── */
  var CATS = [
    { id: 'focus', icon: '⏱️', title: 'Focus & Study Room', bn: 'টাইমার, স্টপওয়াচ, কাউন্টডাউন ও পড়ার ইতিহাস', c: '#8b7cf6' },
    { id: 'planner', icon: '🗓️', title: 'Study Planner', bn: 'দৈনিক, সাপ্তাহিক ও মাসিক পরিকল্পনা · ক্লাস · অ্যাসাইনমেন্ট', c: '#4a7bd6' },
    { id: 'exam', icon: '🎯', title: 'Exam Center', bn: 'কাউন্টডাউন, পরিকল্পনা, লক্ষ্য নম্বর ও বোর্ড প্রশ্ন', c: '#2bb3a3' },
    { id: 'revise', icon: '📖', title: 'Revision & Practice', bn: 'সিলেবাস, ফ্ল্যাশকার্ড, স্মার্ট রিভিশন ও ভুলের খাতা', c: '#6c7ae0' },
    { id: 'progress', icon: '📈', title: 'Progress & Wellbeing', bn: 'ফলাফল, অভ্যাস, রিভিউ, GPA ও সুস্থতা', c: '#3dbd9b' },
    { id: 'notes', icon: '📝', title: 'Notes & Learning', bn: 'নোট, সূত্র, শব্দভান্ডার ও শেখার উপকরণ', c: '#3fa7c4' },
    { id: 'academic', icon: '⚛️', title: 'Academic Calculators & Labs', bn: 'ধাপে ধাপে সমাধান, ক্যালকুলেটর ও বিজ্ঞান-গণিত ল্যাব', c: '#5aa9e6' },
    { id: 'data', icon: '⚙️', title: 'Data & Settings', bn: 'ব্যাকআপ, রিস্টোর ও সেটিংস', c: '#8a94a8' },
    { id: 'dashboard', icon: '🏠', title: 'My Study Dashboard', bn: 'আজকের অবস্থা এক নজরে', c: '#5a8dee' }
  ];
  H.CATS = CATS;
  var CATMAP = {
    dashboard: 'dashboard',
    plan: 'planner', week: 'planner', monthly: 'planner', 'time-blocks': 'planner', board: 'planner', routine: 'planner', eisenhower: 'planner', checklists: 'planner', attendance: 'planner',
    'study-room': 'focus', focus: 'focus', 'next-up': 'focus', sound: 'focus',
    'exam-center': 'exam', exam: 'exam', 'exam-plan': 'exam', pace: 'exam', 'marks-needed': 'exam', papers: 'exam',
    syllabus: 'revise', cards: 'revise', review: 'revise', mistakes: 'revise', doubts: 'revise', revision: 'revise', '#/shortcuts': 'revise',
    notes: 'notes', form: 'notes', vocab: 'notes', mindmap: 'notes', labbook: 'notes', reading: 'notes', cornell: 'notes', feynman: 'notes', journal: 'notes', '#/reference': 'notes',
    academic: 'academic', calculator: 'academic', geometry: 'academic', tools: 'academic', '#/solver': 'academic', molar: 'academic', vector: 'academic', matrix: 'academic', stats: 'academic', quad: 'academic', base: 'academic', percent: 'academic', balancer: 'academic', elements: 'academic', solution: 'academic', circuit: 'academic', complex: 'academic', counting: 'academic', series: 'academic',
    scores: 'progress', goals: 'progress', hab: 'progress', streak: 'progress', wreview: 'progress', gpa: 'progress', sleep: 'progress', 'eye-rest': 'progress', '#/share-card': 'progress',
    backup: 'data'
  };
  /* tools that live inside another page (shown as sub-navigation there, not as separate tiles) */
  var MERGED = { cornell: 'notes', feynman: 'notes', journal: 'notes', revision: 'syllabus', 'time-blocks': 'week', 'exam-plan': 'exam-center', pace: 'exam-center', 'marks-needed': 'exam-center', focus: 'study-room', 'next-up': 'study-room', streak: 'hab', wreview: 'hab' };
    var EXTRA = [
    { href: '#/shortcuts', icon: '⚡', label: 'MCQ Shortcuts', desc: 'পদার্থ, রসায়ন ও উচ্চতর গণিতের শর্টকাট ও পরীক্ষার কৌশল' },
    { href: '#/solver', icon: '🧮', label: 'সূত্র সমাধান', desc: 'ধাপে ধাপে সূত্র সমাধান' },
    { href: '#/reference', icon: '📚', label: 'রেফারেন্স গাইড', desc: 'ধ্রুবক, আয়ন ও পরিচিতি' },
    { href: '#/share-card', icon: '🏅', label: 'অগ্রগতির কার্ড', desc: 'XP ও লেভেলের কার্ড' }
  ];
  var CORE_DESC = {
    plan: 'বিষয়, অধ্যায় ও অগ্রাধিকারসহ দৈনিক টাস্ক', week: 'Day by Day ও Whole Week — দুই ধরনের সাপ্তাহিক পরিকল্পনা', monthly: 'মাসজুড়ে বিষয়, বই ও ব্যক্তিগত টাস্ক',
    exam: 'পরীক্ষা পর্যন্ত দিন গণনা ও প্রস্তুতি', gpa: 'SSC/HSC GPA ও টার্গেট GPA হিসাব', goals: 'লক্ষ্য, মাইলস্টোন ও অগ্রগতি', scores: 'বিষয়ভিত্তিক ফলাফল, গ্রাফ ও দুর্বলতা বিশ্লেষণ',
    cards: 'প্রশ্ন-উত্তর ফ্ল্যাশকার্ড', review: 'Spaced repetition — সময়মতো পুনরাবৃত্তি', notes: 'Quick, Cornell, Feynman ও Journal এক জায়গায়', revision: 'কোন অধ্যায় আবার পড়বেন তা চিহ্নিত করুন',
    syllabus: 'চার ধাপের অগ্রগতি ও অধ্যায়ভিত্তিক রিভিশন', form: 'অধ্যায়ভিত্তিক সূত্র, প্রতীক, SI একক ও উদাহরণ', hab: 'অভ্যাস ট্র্যাকার ও স্বয়ংক্রিয় পরিসংখ্যান', backup: 'সব টুলের ডেটা — এক্সপোর্ট, ইমপোর্ট, মার্জ ও রিস্টোর',
    tools: 'Unit Converter — convert common academic and SI units', calculator: 'Scientific ও বিশেষ মোডের ক্যালকুলেটর', geometry: 'কোণ, কম্পাস, রেখা ও বৃত্ত আঁকার বোর্ড', focus: 'Pomodoro — এখন Study Room-এর ভেতরে'
  };
  var NEWIDS = { attendance: 1, academic: 1 };
  var REMOVED = { routine: 1, sound: 1, review: 1, papers: 1, labbook: 1, mindmap: 1, attendance: 1 };

  var hiddenTiles = {};
  function parseTab(t) { var p = t[1].split(' '), icon = p.shift(); return { id: t[0], icon: icon, label: p.join(' ') }; }
  function catalogue() {
    var out = [], seen = {};
    function push(o) {
      if (!o.id || seen[o.id] || REMOVED[o.id]) return; seen[o.id] = 1;
      var m = META[o.id] || {};
      o.label = labelFor(o.id, o.label);
      o.cat = m.cat || CATMAP[o.id] || 'academic'; o.tags = m.tags || ''; o.isNew = !!(m.isNew || NEWIDS[o.id]);
      o.priority = m.priority || o.priority || 0;
      if (o.id === 'study-room') o.priority = 100;
      o.hidden = !!(MERGED[o.id] || m.hide || hiddenTiles[o.id]);
      o.href = o.href || '#/hub/' + o.id; out.push(o);
    }
    CORE.TABS.forEach(function (t) { var p = parseTab(t); push({ id: p.id, icon: p.icon, label: p.label, desc: CORE_DESC[p.id] || 'পড়াশোনার টুল' }); });
    var tiles = (window.CL_STUDIO && window.CL_STUDIO.tiles) || [];
    tiles.forEach(function (t) { var id = String(t.href || '').replace(/^#\/hub\//, ''); push({ id: id, icon: t.icon, label: t.label, desc: CORE_DESC[id] || t.desc }); });
    EXTRA.forEach(function (t) { push({ id: t.href, href: t.href, icon: t.icon, label: t.label, desc: t.desc }); });
    return out;
  }
  H.catalogue = catalogue;
  H.visibleCount = function () { return catalogue().filter(function (t) { return !t.hidden; }).length; };
  window.CL_HUB_TOOL_COUNT = H.visibleCount;
  function toolInfo(id) { return catalogue().filter(function (t) { return t.id === id; })[0]; }
  function catOf(id) { var t = toolInfo(id); var cid = t ? t.cat : (CATMAP[id] || 'academic'); return CATS.filter(function (c) { return c.id === cid; })[0] || CATS[6]; }
  H.catOf = catOf;

  /* fix: Eisenhower Matrix shared the id "matrix" with the Matrix Calculator → give it its own id */
  (function fixMatrixId() {
    var t = HP.tools.filter(function (x) { return x.id === 'matrix'; })[0];
    if (t && /Eisenhower/i.test(t.label)) {
      t.id = 'eisenhower';
      var tiles = (window.CL_STUDIO && window.CL_STUDIO.tiles) || [];
      tiles.forEach(function (x) { if (x.href === '#/hub/matrix' && /Eisenhower/i.test(x.label)) x.href = '#/hub/eisenhower'; });
      var fav = U.load('clpro_fav', []); if (Array.isArray(fav)) { /* old pin pointed at the ambiguous id: keep as is */ }
    }
  })();
  /* tiles for the two tools whose data lives in other files get friendlier labels */
  (function relabel() {
    var tiles = (window.CL_STUDIO && window.CL_STUDIO.tiles) || [];
    tiles.forEach(function (x) {
      if (x.href === '#/hub/matrix') x.label = 'Matrix Calculator';
      if (x.href === '#/hub/eisenhower') x.label = 'Eisenhower Matrix';
      if (x.href === '#/hub/mistakes') x.label = 'Mistake Notebook';
    });
  })();

  /* ───────── data snapshot (dashboard) ───────── */
  function roomData() { var D = U.load('clroom_v1', null); return D && Array.isArray(D.sessions) ? D : { sessions: [], subjects: [], settings: { daily: 180 } }; }
  function sessionsOn(dayKey) { var D = roomData(), n = 0; D.sessions.forEach(function (s) { if (s && s.start && U.dayKey(new Date(s.start)) === dayKey) n += +s.secs || 0; }); return n; }
  H.studySecs = sessionsOn;
  H.streak = function () {
    var D = roomData(), days = {}, k = H.today(), n = 0;
    D.sessions.forEach(function (s) { if (s && s.start && (+s.secs || 0) >= 60) days[U.dayKey(new Date(s.start))] = 1; });
    if (!days[k]) k = H.addDays(k, -1);
    while (days[k]) { n++; k = H.addDays(k, -1); }
    return n;
  };
  function weekRange() { var s = CORE.S(), sd = s.weekPlanner ? s.weekPlanner.startDay : 6, d = CORE.weekDates ? CORE.weekDates(sd, 0) : null; return d ? d.map(CORE.dateKey) : []; }
  H.weekKeys = weekRange;
  H.studyWeekSecs = function () { var t = 0; weekRange().forEach(function (k) { t += sessionsOn(k); }); return t; };
  H.last7 = function () { var out = [], k = H.today(); for (var i = 6; i >= 0; i--) { var d = H.addDays(k, -i); out.push({ k: d, secs: sessionsOn(d) }); } return out; };

  var ROUT = { days: [0, 1, 2, 3, 4], periods: [], cells: {} };
  function mins(t) { var p = String(t).split(':'); return (+p[0]) * 60 + (+p[1] || 0); }
  H.nextClass = function () {
    return null; /* class routine tool removed */
    var R = U.load('clpro_d_routine', null); if (!R || !R.periods) return null;
    var now = new Date(), nm = now.getHours() * 60 + now.getMinutes(), best = null;
    for (var off = 0; off < 8; off++) {
      var d = (now.getDay() + off) % 7; if ((R.days || ROUT.days).indexOf(d) < 0) continue;
      R.periods.forEach(function (p) {
        var c = R.cells[d + '_' + p.id]; if (!c || !c.s) return;
        var st = mins(p.s), diff = off * 1440 + st - nm, en = mins(p.e);
        if (off === 0 && nm >= st && nm < en) { if (!best || best.now !== true) best = { subject: c.s, teacher: c.t || '', start: p.s, end: p.e, diff: 0, now: true, left: en - nm }; return; }
        if (diff > 0 && (!best || (!best.now && diff < best.diff))) best = { subject: c.s, teacher: c.t || '', start: p.s, end: p.e, diff: diff, now: false, day: d };
      });
      if (best && !best.now) break;
    }
    return best;
  };
  function ftime(m) { m = Math.max(0, Math.round(m)); var d = Math.floor(m / 1440), h = Math.floor(m % 1440 / 60), mm = m % 60; return (d ? bd(d) + ' দিন ' : '') + (h ? bd(h) + ' ঘ ' : '') + (!d ? bd(mm) + ' মি' : ''); }
  H.ftime = ftime;
  H.boardItems = function () { var B = U.load('clpro_d_board', null); return B && Array.isArray(B.items) ? B.items : []; };

  H.snap = function () {
    var s = CORE.S(), today = H.today(), now = Date.now(), out = {};
    var planOpen = s.plan.filter(function (x) { return x && !x.k; });
    var wk = (s.weekPlanner && s.weekPlanner.entries || []).filter(function (x) { return x.date === today; });
    var board = H.boardItems().filter(function (i) { return i.status !== 'done' && i.due && i.due <= today; });
    out.tasks = [];
    wk.forEach(function (x) { out.tasks.push({ t: x.t, sub: x.subject || '', done: !!x.done, src: 'দিনভিত্তিক', href: '#/hub/week?m=day' }); });
    planOpen.slice(0, 8).forEach(function (x) { out.tasks.push({ t: x.t, sub: x.subject || '', done: false, src: 'পরিকল্পনা', href: '#/hub/plan' }); });
    board.forEach(function (i) { out.tasks.push({ t: i.title, sub: i.subject || '', done: false, src: i.due < today ? 'দেরি!' : 'আজ ডেডলাইন', late: i.due < today, href: '#/hub/board' }); });
    out.tasksOpen = out.tasks.filter(function (x) { return !x.done; }).length;
    out.tasksDone = out.tasks.filter(function (x) { return x.done; }).length;
    out.exams = (s.exams || []).map(function (x) { return { n: x.n, d: x.d, left: H.dayDiff(today, x.d) }; }).filter(function (x) { return x.left >= 0; }).sort(function (a, b) { return a.left - b.left; });
    var cardsDue = (s.cards || []).filter(function (c) { var r = (s.reviewSchedule || {})[c.id]; return !r || (Number(r.dueAt) || 0) <= now; }).length;
    var syl = H.syl ? H.syl.stats() : { revise: 0, pct: 0, mastered: 0, total: 0, learning: 0, notStarted: 0 };
    out.cardsDue = cardsDue; out.sylRevise = syl.revise; out.syl = syl;
    out.mistakesOpen = (U.load('clhp_mistakes', []) || []).filter(function (m) { return !m.mastered && !m.fixed; }).length;
    out.todaySecs = sessionsOn(today); out.weekSecs = H.studyWeekSecs(); out.streak = H.streak();
    var room = roomData(); out.goalSecs = ((room.settings && room.settings.daily) || 180) * 60;
    out.ww = H.ww ? H.ww.summary() : { total: 0, done: 0, goal: '' };
    out.late = H.boardItems().filter(function (i) { return i.status !== 'done' && i.due && i.due < today; }).length;
    out.soon = H.boardItems().filter(function (i) { return i.status !== 'done' && i.due && i.due >= today && H.dayDiff(today, i.due) <= 2; }).length;
    out.next = H.nextClass();
    return out;
  };

  function dashboardHTML(full) {
    var d = H.snap(), h = '';
    var goalPct = H.pct(d.todaySecs, d.goalSecs), ex = d.exams[0];
    var tasks = d.tasks.filter(function (x) { return !x.done; }).slice(0, full ? 8 : 4);
    h += '<div class="h4-dash">';
    /* Today's tasks (v115f: richer premium card) */
    var tTotal = d.tasksDone + d.tasksOpen, tPct = tTotal ? Math.round(d.tasksDone / tTotal * 100) : 0;
    h += '<section class="h4-card h4-pro h4-d-tasks" style="--c:#4a7bd6"><div class="h4-pro-h"><span class="h4-pro-ic" aria-hidden="true">✅</span><div class="h4-pro-t"><h3>আজকের কাজ</h3><small>' + H.fmtDate(H.today()) + ' · ' + bd(tTotal) + 'টি টাস্ক</small></div><span class="h4-pro-badge">' + bd(tPct) + '%</span></div>';
    h += '<div class="h4-bar h4-pro-bar"><i style="width:' + tPct + '%"></i></div>';
    h += '<div class="h4-pro-kpis"><div class="h4-pk" style="--k:#4a7bd6"><b>' + bd(d.tasksOpen) + '</b><span>বাকি</span></div><div class="h4-pk" style="--k:#3dbd9b"><b>' + bd(d.tasksDone) + '</b><span>শেষ</span></div><div class="h4-pk" style="--k:#f2b45a"><b>' + bd(d.soon) + '</b><span>২ দিনে ডেডলাইন</span></div><div class="h4-pk" style="--k:' + (d.late ? '#ff7a8a' : '#8b7cf6') + '"><b>' + bd(d.late) + '</b><span>দেরি হয়েছে</span></div></div>';
    h += tasks.length ? '<div class="h4-list">' + tasks.map(function (x) { return '<a class="h4-item" href="' + x.href + '" style="text-decoration:none;color:inherit"><span class="tt">' + E(x.t) + (x.sub ? '<small>' + E(x.sub) + '</small>' : '') + '</span><span class="h4-chip ' + (x.late ? 'bad' : '') + '">' + E(x.src) + '</span></a>'; }).join('') + '</div>' : H.empty('🗓️', 'আজকের জন্য কোনো কাজ নেই।') + '<div class="h4-dash-cta"><a class="h4-btn pri" href="#/hub/week?m=day">＋ Add Today’s Task</a></div>';
    h += '</section>';
    /* Study time + goal (v115f) */
    var l7 = H.last7(), wsum = l7.reduce(function (t, x) { return t + x.secs; }, 0), wbest = Math.max.apply(null, l7.map(function (x) { return x.secs; }).concat([0])), wmx = Math.max(wbest, 1), left = Math.max(0, d.goalSecs - d.todaySecs), DN = ['রবি', 'সোম', 'মঙ্গল', 'বুধ', 'বৃহস্পতি', 'শুক্র', 'শনি'];
    h += '<section class="h4-card h4-pro h4-d-study" style="--c:#8b7cf6"><div class="h4-pro-h"><span class="h4-pro-ic" aria-hidden="true">⏱</span><div class="h4-pro-t"><h3>পড়ার সময়</h3><small>আজকের লক্ষ্য ' + U.dur(d.goalSecs) + '</small></div><span class="h4-pro-badge h4-flame">🔥 ' + bd(d.streak) + ' দিন</span></div>';
    h += '<div class="h4-pro-row"><div class="h4-ring2" style="--pv:' + Math.min(100, goalPct) + '"><b>' + bd(Math.min(100, goalPct)) + '%</b></div><div><b class="h4-pro-big">' + U.dur(d.todaySecs) + '</b><div class="h4-mut">আজ পড়েছেন</div><div class="h4-mut">' + (left ? 'লক্ষ্যে পৌঁছাতে আরও ' + U.dur(left) : 'আজকের লক্ষ্য পূর্ণ 🎉') + '</div></div></div>';
    h += '<div class="h4-pro-kpis k3"><div class="h4-pk" style="--k:#8b7cf6"><b>' + U.dur(d.weekSecs) + '</b><span>এই সপ্তাহে</span></div><div class="h4-pk" style="--k:#3fa7c4"><b>' + U.dur(Math.round(wsum / 7)) + '</b><span>দৈনিক গড়</span></div><div class="h4-pk" style="--k:#f2b45a"><b>' + U.dur(wbest) + '</b><span>সেরা দিন</span></div></div>';
    h += '<div class="h4-spark h4-spark2" style="--c:#8b7cf6">' + l7.map(function (x, i) { var dt = new Date(x.k + 'T00:00:00'); return '<div class="h4-sp"><i class="' + (x.secs ? '' : 'z') + '" title="' + H.fmtDate(x.k) + ' · ' + U.dur(x.secs) + '" style="height:' + Math.max(8, Math.round(x.secs / wmx * 100)) + '%;animation-delay:' + (i * 60) + 'ms"></i><em>' + (isNaN(dt) ? '' : DN[dt.getDay()]) + '</em></div>'; }).join('') + '</div>';
    h += '<div class="h4-row h4-pro-cta"><a class="h4-btn sm pri" href="#/hub/study-room">▶ Study Room</a></div></section>';
    if (full) {
    /* Upcoming exams */
    h += '<section class="h4-card h4-d-third" style="--c:#2bb3a3"><h3>🎯 আসন্ন পরীক্ষা</h3>';
    h += ex ? '<div class="h4-row" style="gap:12px"><div class="h4-ring" style="--p:' + Math.max(4, 100 - Math.min(100, ex.left)) + ';--c:#2bb3a3"><b>' + bd(ex.left) + '</b></div><div><b>' + E(ex.n) + '</b><div class="h4-mut">' + (ex.left === 0 ? 'আজই পরীক্ষা!' : bd(ex.left) + ' দিন বাকি') + ' · ' + H.fmtDate(ex.d) + '</div></div></div>' + (d.exams.length > 1 ? '<div class="h4-mut" style="margin-top:7px">পরের: ' + d.exams.slice(1, 3).map(function (x) { return E(x.n) + ' (' + bd(x.left) + ' দিন)'; }).join(', ') + '</div>' : '') : H.empty('📅', 'কোনো পরীক্ষা যোগ করা নেই');
    h += '<div class="h4-row" style="margin-top:8px"><a class="h4-btn sm" href="#/hub/exam-center">Exam Center</a></div></section>';
    /* Revision summary card removed from the dashboard by request. */
    /* Weekly goal */
    h += '<section class="h4-card h4-d-third" style="--c:#3fa7c4"><h3>🗓 সাপ্তাহিক লক্ষ্য</h3>' + (d.ww.total ? '<div class="h4-row" style="gap:12px">' + H.ring(H.pct(d.ww.done, d.ww.total), '', '#3fa7c4') + '<div><b>' + bd(d.ww.done) + '/' + bd(d.ww.total) + ' টাস্ক</b><div class="h4-mut">' + (d.ww.goal ? E(d.ww.goal) : 'Whole Week মোড') + '</div></div></div>' : H.empty('🎯', 'এই সপ্তাহের লক্ষ্য ঠিক করুন')) + '<div class="h4-row" style="margin-top:8px"><a class="h4-btn sm" href="#/hub/week">Weekly Planner</a></div></section>';
    /* Overall progress */
    h += '<section class="h4-card h4-d-third" style="--c:#3dbd9b"><h3>📈 সামগ্রিক অগ্রগতি</h3><div class="h4-row" style="gap:12px">' + H.ring(d.syl.pct, '', '#3dbd9b') + '<div><b>' + bd(d.syl.mastered) + '/' + bd(d.syl.total) + '</b><div class="h4-mut">অধ্যায় Mastered</div><div class="h4-mut">শিখছি ' + bd(d.syl.learning) + ' · শুরু হয়নি ' + bd(d.syl.notStarted) + '</div></div></div><div class="h4-row" style="margin-top:8px"><a class="h4-btn sm" href="#/hub/syllabus">Syllabus Tracker</a></div></section>';
    }
    h += '</div>';
    return h;
  }
  H.dashboardHTML = dashboardHTML;

  /* ───────── home ───────── */
  var FAV = 'clpro_fav';
  function favs() { var a = U.load(FAV, []); return Array.isArray(a) ? a : []; }
  function isFav(k) { return favs().indexOf(k) >= 0; }
  function toggleFav(k) { var a = favs(), i = a.indexOf(k); if (i >= 0) a.splice(i, 1); else a.unshift(k); U.save(FAV, a.slice(0, 24)); return i < 0; }

  function tileHTML(t) {
    var c = catOf(t.id), pinned = isFav(t.href);
    return '<a class="h4-tile" href="' + E(t.href) + '" style="--c:' + c.c + '" data-q="' + E((t.label + ' ' + t.desc + ' ' + t.tags + ' ' + c.title).toLowerCase()) + '" data-cat="' + c.id + '"><span class="h4-ti" aria-hidden="true">' + E(t.icon) + '</span><span class="h4-tt"><b>' + E(t.label) + '</b><span>' + E(t.desc || '') + '</span></span>' +
      '<button type="button" class="h4-pin" data-pin="' + E(t.href) + '" aria-pressed="' + pinned + '" aria-label="পিন করুন">' + (pinned ? '★' : '☆') + '</button></a>';
  }
  function homePage() {
    var cat = PREFS.get(); cat.cat = 'all'; PREFS.set(cat);
    var list = catalogue().filter(function (t) { return !t.hidden; });
    var hr = new Date().getHours(), greet = hr < 5 ? 'শুভ রাত্রি' : hr < 12 ? 'শুভ সকাল' : hr < 17 ? 'শুভ অপরাহ্ন' : hr < 20 ? 'শুভ সন্ধ্যা' : 'শুভ রাত্রি';
    var h = '<section class="w pgw hub h4 h4-home"><div class="h4-hero"><span class="h4-eyebrow"><i></i>YOUR PERSONAL STUDY SYSTEM</span><h1>Student Hub</h1><p class="h4-mut"><span class="h4-greet">' + greet + '!</span> পরিকল্পনা, মনোযোগ, রিভিশন, পরীক্ষা ও অগ্রগতি — একজন শিক্ষার্থীর যা যা দরকার, সব এক জায়গায়। <b>' + bd(list.length) + 'টি টুল</b>।</p></div>';
    h += '<div class="h4-find"><label class="h4-search"><b aria-hidden="true">⌕</b><input type="search" id="h4Q" placeholder="Search tools — e.g. GPA, Formula, Flashcards…" autocomplete="off" aria-label="Search tools"></label><div class="h4-chips" id="h4Chips"><button type="button" data-cat="all" aria-pressed="true">সব (' + bd(list.length) + ')</button>' + CATS.filter(function (c) { return c.id !== 'dashboard'; }).map(function (c) { var n = list.filter(function (t) { return t.cat === c.id; }).length; return '<button type="button" data-cat="' + c.id + '" aria-pressed="false" style="--c:' + c.c + '">' + c.icon + ' ' + E(c.title) + ' · ' + bd(n) + '</button>'; }).join('') + '</div></div>';
    h += '<div id="h4Dash">' + dashboardHTML(false) + '</div>';
    var pins = favs().map(function (k) { return list.filter(function (t) { return t.href === k; })[0] || catalogue().filter(function (t) { return t.href === k; })[0]; }).filter(Boolean);
    h += '<div class="h4-sec" id="h4PinBox" style="--c:#f2b45a"' + (pins.length ? '' : ' hidden') + '><div class="h4-sec-h"><span class="h4-sec-ic">★</span><div><h2>পিন করা টুল</h2><small>টাইলের ☆ চাপলে এখানে জমা হবে</small></div></div><div class="h4-pinned" id="h4Pins">' + pins.map(function (t) { return '<a href="' + E(t.href) + '"><span>' + E(t.icon) + '</span>' + E(t.label) + '</a>'; }).join('') + '</div></div>';
    CATS.forEach(function (c) {
      if (c.id === 'dashboard') return;
      var items = list.filter(function (t) { return t.cat === c.id; }).sort(function (a, b) { return (b.priority || 0) - (a.priority || 0); });
      if (!items.length) return;
      h += '<section class="h4-sec" data-sec="' + c.id + '" style="--c:' + c.c + '"><div class="h4-sec-h"><span class="h4-sec-ic" aria-hidden="true">' + c.icon + '</span><div><h2>' + E(c.title) + '</h2><small>' + E(c.bn) + '</small></div><span class="n">' + bd(items.length) + 'টি</span></div><div class="h4-tiles">' + items.map(tileHTML).join('') + '</div></section>';
    });
    h += '<div class="h4-empty" id="h4None" hidden><b>🔍</b>কোনো টুল মেলেনি — অন্য শব্দ দিয়ে চেষ্টা করুন।</div></section>';
    return h;
  }
  function mountHome(app) {
    var root = app.querySelector('.h4-home'); if (!root || root._b) return; root._b = 1;
    var q = root.querySelector('#h4Q'), timer = 0;
    var bt = H._backTool; H._backTool = null;
    if (bt) { var jump = function () { var t = root.querySelector('.h4-tile[href="#/hub/' + bt + '"]'); var y = 0; if (t && !t.hidden) y = Math.max(0, t.getBoundingClientRect().top + window.pageYOffset - window.innerHeight / 3); window.scrollTo({ top: y, behavior: 'instant' }); }; jump(); setTimeout(jump, 60); setTimeout(jump, 260); }
    function apply() {
      var term = q.value.trim().toLowerCase(), cat = PREFS.get().cat, shown = 0;
      H.$$('.h4-sec[data-sec]', root).forEach(function (sec) {
        var vis = 0, okc = cat === 'all' || sec.getAttribute('data-sec') === cat;
        H.$$('.h4-tile', sec).forEach(function (t) { var hit = okc && (!term || t.getAttribute('data-q').indexOf(term) >= 0); t.hidden = !hit; if (hit) vis++; });
        sec.hidden = vis === 0; shown += vis;
      });
      var none = root.querySelector('#h4None'); if (none) none.hidden = shown > 0;
      var pb = root.querySelector('#h4PinBox'); if (pb) pb.hidden = !favs().length || !!term || cat !== 'all';
    }
    q.addEventListener('input', function () { clearTimeout(timer); timer = setTimeout(apply, 90); });
    root.addEventListener('click', function (e) {
      var pin = e.target.closest('[data-pin]');
      if (pin) { e.preventDefault(); e.stopPropagation(); var on = toggleFav(pin.getAttribute('data-pin')); pin.setAttribute('aria-pressed', on); pin.textContent = on ? '★' : '☆'; var all = catalogue(), box = root.querySelector('#h4Pins'); box.innerHTML = favs().map(function (k) { return all.filter(function (t) { return t.href === k; })[0]; }).filter(Boolean).map(function (t) { return '<a href="' + E(t.href) + '"><span>' + E(t.icon) + '</span>' + E(t.label) + '</a>'; }).join(''); apply(); return; }
      var chip = e.target.closest('#h4Chips [data-cat]');
      if (chip) { var p = PREFS.get(); p.cat = chip.getAttribute('data-cat'); PREFS.set(p); H.$$('#h4Chips button', root).forEach(function (b) { b.setAttribute('aria-pressed', b === chip); }); apply(); if (p.cat !== 'all') { var f = root.querySelector('.h4-find'); f && f.scrollIntoView({ block: 'start', behavior: 'smooth' }); } }
    });
    apply();
    /* gentle refresh of the live dashboard (class countdown) while the home is open */
    clearInterval(H._homeT); H._homeT = setInterval(function () { var d = document.getElementById('h4Dash'); if (!d || document.hidden) { if (!d) clearInterval(H._homeT); return; } d.classList.add('h4-noanim'); d.innerHTML = dashboardHTML(false); }, 60000);
  }

  /* ───────── tool pages: simple back navigation ───────── */
  function routeId() { return (location.hash.replace(/^#\/?/, '').split('/')[1] || '').split('?')[0]; }
  function navHTML(id) {
    var c = catOf(id);
    return '<div class="h4-crumb" style="--c:' + c.c + '"><a href="#/hub" data-h4cat="' + c.id + '">← Student Hub</a></div>';
  }
  function decorate(html, id) {
    if (!html || html.indexOf('hub-tool-page') < 0) return html;
    html = html.replace('class="w pgw hub hub-tool-page', 'class="w pgw hub h4 hub-tool-page');
    return html.replace(/<div class="hub-tool-page-nav">[\s\S]*?<\/div>/, navHTML(id));
  }
  document.addEventListener('click', function (e) { var a = e.target.closest && e.target.closest('[data-h4cat]'); if (a) { H._backTool = routeId(); var p = PREFS.get(); p.cat = a.getAttribute('data-h4cat'); PREFS.set(p); } });

  /* ───────── redirects for merged tools ───────── */
  var REDIR = {
    cornell: function () { var s = H.store('notesui', { type: 'all' }); var v = s.get(); v.type = 'cornell'; s.set(v); return '#/hub/notes'; },
    feynman: function () { var s = H.store('notesui', { type: 'all' }); var v = s.get(); v.type = 'feynman'; s.set(v); return '#/hub/notes'; },
    journal: function () { var s = H.store('notesui', { type: 'all' }); var v = s.get(); v.type = 'journal'; s.set(v); return '#/hub/notes'; }
  };
  Object.keys(REMOVED).forEach(function (k) { REDIR[k] = function () { return '#/hub'; }; });
  H.redirects = REDIR;

  var prevPage = HUB.pages.hub, prevMount = HUB.mount;
  HUB.pages.hub = function () {
    var id = routeId();
    if (!id) return homePage();
    if (REDIR[id]) { var to = REDIR[id](); setTimeout(function () { location.replace(to); }, 0); return '<section class="w pgw hub h4"></section>'; }
    var html = prevPage ? prevPage.apply(this, arguments) : '';
    return decorate(html, id);
  };
  HUB.mount = function (pg, app) {
    clearInterval(H._homeT);
    if (prevMount) prevMount(pg, app);
    if (pg !== 'hub') return;
    var id = routeId();
    if (!id) { mountHome(app); return; }
    if (id === 'geometry') bindGeometry();
    if (id === 'week' && /[?&]m=day(?:&|$)/.test(location.hash)) {
      setTimeout(function () { var input = document.getElementById('dT'); if (input) { input.focus({ preventScroll: true }); input.scrollIntoView({ block: 'center', behavior: 'smooth' }); } }, 80);
    }
    if (H.onMount && H.onMount[id]) { try { H.onMount[id](app); } catch (e) { } }
    deadlineNudge();
  };
  H.onMount = {};

  /* The original geometry board was never wired to its canvas — bind it once on the document. */
  var geoBound = false;
  function bindGeometry() {
    if (geoBound) return; geoBound = true;
    document.addEventListener('pointerdown', function (e) { if (e.target.closest && e.target.closest('#geomCanvas')) CORE.geoDown(e); });
    document.addEventListener('pointermove', function (e) { if (e.target.closest && e.target.closest('#geomCanvas')) CORE.geoMove(e); });
    document.addEventListener('pointerup', function (e) { if (e.target.closest && e.target.closest('#geomCanvas')) CORE.geoUp(e); });
    document.addEventListener('pointercancel', function (e) { if (e.target.closest && e.target.closest('#geomCanvas')) CORE.geoUp(e); });
  }

  /* ───────── deadline + class reminders (light: one interval, 30 s) ───────── */
  function deadlineNudge() {
    var p = PREFS.get(), t = H.today(); if (!p.deadlineAlert || p.lastAlert === t) return;
    var late = H.boardItems().filter(function (i) { return i.status !== 'done' && i.due && i.due < t; }).length, due = H.boardItems().filter(function (i) { return i.status !== 'done' && i.due === t; }).length;
    if (late || due) { p.lastAlert = t; PREFS.set(p); U.toast((late ? '⚠️ ' + bd(late) + 'টি অ্যাসাইনমেন্ট দেরি হয়েছে' : '') + (late && due ? ' · ' : '') + (due ? '⏳ ' + bd(due) + 'টির ডেডলাইন আজ' : '')); }
  }
  var lastRemind = '';
  function classTick() {
    var p = PREFS.get(); if (!p.classRemind) return;
    var n = H.nextClass(); if (!n || n.now || n.diff > p.classRemind || n.diff < 1) return;
    var key = H.today() + n.start + n.subject; if (lastRemind === key) return; lastRemind = key;
    var msg = '🔔 ' + n.subject + ' ক্লাস ' + bd(Math.round(n.diff)) + ' মিনিট পরে (' + n.start + ')';
    U.toast(msg); U.beep([[740, 0, .15], [988, .2, .25]]);
    try { if ('Notification' in window && Notification.permission === 'granted') new Notification('Golden Snitch · ক্লাস রিমাইন্ডার', { body: msg }); } catch (e) { }
  }
  setInterval(classTick, 30000);

  /* ───────── wrap existing tools: Class Routine · Assignment Board ───────── */
  function wrapTool(id, fn) { var t = HP.byId(id); if (t) fn(t); }
  wrapTool('routine', function (t) {
    var r0 = t.render, c0 = t.click, m0 = t.mount, un0 = t.unmount, tm = 0;
    function panel() {
      var n = H.nextClass(), p = PREFS.get(), perm = ('Notification' in window) ? Notification.permission : 'unsupported';
      return '<div class="h4 h4-card" id="h4Next" style="--c:#4a7bd6"><h3>⏭ পরের ক্লাস</h3>' + (n ? '<div class="h4-row" style="gap:16px"><div><div style="font-size:1.2rem;font-weight:700">' + E(n.subject) + '</div><div class="h4-mut">' + E(n.teacher || '') + ' ' + n.start + ' – ' + n.end + '</div></div><div class="h4-sp"></div><div style="text-align:right"><div class="h4-eyebrow">' + (n.now ? 'চলছে' : 'কাউন্টডাউন') + '</div><b style="font-size:1.4rem" id="h4NextT">' + (n.now ? bd(n.left) + ' মি বাকি' : ftime(n.diff)) + '</b></div></div>' : '<p class="h4-mut">রুটিনে ক্লাস যোগ করলে পরের ক্লাসের কাউন্টডাউন এখানে দেখাবে।</p>') +
        '<div class="h4-row" style="margin-top:10px"><span class="h4-mut">ক্লাস রিমাইন্ডার:</span><select class="h4-in" id="h4Rem" style="width:auto;min-height:36px">' + H.opts([[0, 'বন্ধ'], [5, '৫ মিনিট আগে'], [10, '১০ মিনিট আগে'], [15, '১৫ মিনিট আগে'], [30, '৩০ মিনিট আগে']], p.classRemind) + '</select>' + (perm === 'default' ? '<button type="button" class="h4-btn sm" data-a="h4-notif">🔔 ব্রাউজার নোটিফিকেশন চালু করুন</button>' : '') + '</div><p class="h4-mut" style="margin:6px 0 0">রিমাইন্ডার সাইট খোলা থাকলে টোস্ট ও শব্দে জানায়।</p></div>';
    }
    t.render = function () { return panel() + r0.call(t); };
    t.click = function (el, e) { if (el.dataset.a === 'h4-notif') { try { Notification.requestPermission().then(function () { HP.paint(); }); } catch (x) { } return; } return c0 && c0.call(t, el, e); };
    t.change = (function (old) { return function (el, e) { if (el.id === 'h4Rem') { var p = PREFS.get(); p.classRemind = +el.value || 0; PREFS.set(p); U.toast(p.classRemind ? 'রিমাইন্ডার চালু' : 'রিমাইন্ডার বন্ধ'); return; } if (old) return old.call(t, el, e); }; })(t.change);
    t.mount = function (root) { if (m0) m0.call(t, root); clearInterval(tm); tm = setInterval(function () { var el = document.getElementById('h4NextT'); if (!el) { clearInterval(tm); return; } var n = H.nextClass(); if (n) el.textContent = n.now ? bd(n.left) + ' মি বাকি' : ftime(n.diff); }, 20000); };
    t.unmount = function () { clearInterval(tm); if (un0) un0.call(t); };
  });
  wrapTool('board', function (t) {
    var r0 = t.render, c0 = t.click;
    function radar() {
      var today = H.today(), items = H.boardItems().filter(function (i) { return i.status !== 'done' && i.due; }).sort(function (a, b) { return a.due < b.due ? -1 : 1; });
      var late = items.filter(function (i) { return i.due < today; }), soon = items.filter(function (i) { return i.due >= today && H.dayDiff(today, i.due) <= 3; });
      if (!late.length && !soon.length) return '<div class="h4 h4-card" style="--c:#2bb3a3"><h3>⏰ ডেডলাইন রাডার</h3><p class="h4-mut" style="margin:0">কোনো জরুরি ডেডলাইন নেই — চমৎকার! ✓</p></div>';
      function row(i, bad) { var d = H.dayDiff(today, i.due); return '<div class="h4-item"><span class="tt">' + E(i.title) + '<small>' + E(i.subject || '') + ' · ' + (bad ? bd(-d) + ' দিন দেরি' : d === 0 ? 'আজই শেষ' : bd(d) + ' দিন বাকি') + '</small></span><button type="button" class="h4-btn sm" data-a="h4-toplan" data-id="' + E(i.id) + '">＋ আজকের প্ল্যানে</button></div>'; }
      return '<div class="h4 h4-card" style="--c:' + (late.length ? '#ff7a8a' : '#f2b45a') + '"><h3>⏰ ডেডলাইন রাডার <small>' + (late.length ? '⚠️ ' + bd(late.length) + 'টি দেরি · ' : '') + bd(soon.length) + 'টি আসন্ন</small></h3><div class="h4-list">' + late.map(function (i) { return row(i, true); }).join('') + soon.map(function (i) { return row(i, false); }).join('') + '</div></div>';
    }
    t.render = function () { return radar() + r0.call(t); };
    t.click = function (el, e) {
      if (el.dataset.a === 'h4-toplan') {
        var it = H.boardItems().filter(function (i) { return i.id === el.dataset.id; })[0]; if (!it) return;
        var s = CORE.S(); if (s.plan.some(function (x) { return x.src === 'board:' + it.id; })) { U.toast('আগেই প্ল্যানে যোগ করা আছে'); return; }
        s.plan.unshift({ t: it.title, k: 0, subject: it.subject || 'অন্যান্য বিষয়', chapter: '', priority: it.prio === 'h' ? 'high' : it.prio === 'l' ? 'low' : 'medium', src: 'board:' + it.id });
        CORE.W(s); U.toast('Study Planner-এ যোগ হয়েছে ✓'); return;
      }
      return c0.call(t, el, e);
    };
  });

  /* settings for reminders live on the Data page; expose helpers */
  H.api = { catOf: catOf, toolInfo: toolInfo };
  /* keep the original tile count honest for site-level counters */
})();
