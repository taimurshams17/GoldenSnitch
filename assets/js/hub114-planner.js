/* Golden Snitch Student Hub v114 — Weekly Planner with two separate modes.
   · Day by Day  — tasks per weekday (re-uses the existing saved data: clhub_v1.weekPlanner.entries)
   · Whole Week  — one combined task list for the entire week, never tied to a weekday (store clh114_ww)
   Route: #/hub/week (chooser) · #/hub/week?m=day · #/hub/week?m=whole */
(function () {
  'use strict';
  var H = window.CL_H114; if (!H) return;
  var U = H.u, E = H.E, bd = H.bd, CORE = H.core, HP = H.hp;
  var PRIO = { high: ['উচ্চ', '#ff7a8a'], medium: ['মাঝারি', '#f2b45a'], low: ['কম', '#38c9a0'] };
  var WS = H.store('ww', { weeks: {} });
  var offDay = 0, offWhole = 0, editDay = null, editWhole = null, fSub = '';
  var WD_FULL = CORE.WEEKDAYS || ['রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার'];

  function mode() { var m = /[?&]m=(day|whole)/.exec(location.hash); return m ? m[1] : ''; }
  function startDay() { var s = CORE.S(); return s.weekPlanner ? s.weekPlanner.startDay : 6; }
  function dates(off) { return CORE.weekDates(startDay(), off); }
  function keys(off) { return dates(off).map(CORE.dateKey); }
  function range(off) { var d = dates(off); return H.fmtDate(CORE.dateKey(d[0])) + ' – ' + H.fmtDate(CORE.dateKey(d[6])); }
  function weekKey(off) { return keys(off)[0]; }
  function wk(off, create) { var s = WS.get(), k = weekKey(off); if (!s.weeks[k]) { if (!create) return { goal: '', notes: '', tasks: [] }; s.weeks[k] = { goal: '', notes: '', tasks: [] }; } return s.weeks[k]; }
  function wkSave(off, w) { var s = WS.get(); s.weeks[weekKey(off)] = w; WS.set(s); }
  function prioBadge(p) { var x = PRIO[p] || PRIO.medium; return '<span class="h4-chip" style="--c:' + x[1] + '">' + x[0] + '</span>'; }
  function sortP(a, b) { var o = { high: 0, medium: 1, low: 2 }; return (o[a.priority || a.prio] || 1) - (o[b.priority || b.prio] || 1) || (a.createdAt || 0) - (b.createdAt || 0); }
  function id(p) { return p + '-' + U.uid(); }

  /* public summary (dashboard) */
  H.ww = { summary: function () { var w = wk(0, false); return { total: w.tasks.length, done: w.tasks.filter(function (t) { return t.done; }).length, goal: w.goal || '' }; } };

  /* ─────── shell: mode switcher ─────── */
  function switcher(m) {
    return '<div class="h4-row" style="margin:0 0 12px"><div class="h4-seg" role="tablist" aria-label="Planner mode"><button type="button" onclick="location.hash=\'#/hub/week?m=day\'" aria-pressed="' + (m === 'day') + '">📅 Day by Day</button><button type="button" onclick="location.hash=\'#/hub/week?m=whole\'" aria-pressed="' + (m === 'whole') + '">🧺 Whole Week</button></div><span class="h4-sp"></span><a class="h4-btn sm" href="#/hub/week">⇄ মোড বেছে নিন</a></div>';
  }
  function chooser() {
    var s = CORE.S(), ks = keys(0), dayN = (s.weekPlanner.entries || []).filter(function (x) { return ks.indexOf(x.date) >= 0; }), dayD = dayN.filter(function (x) { return x.done; }).length, w = wk(0, false), wd = w.tasks.filter(function (t) { return t.done; }).length;
    return '<div class="h4"><p class="h4-mut" style="margin:0 0 12px">এই সপ্তাহটা কীভাবে সাজাবেন? নিজের পড়ার ধরন অনুযায়ী যেকোনো একটি মোড বেছে নিন — দুটির ডেটা আলাদা, চাইলে যেকোনো সময় বদলাতে পারবেন।</p><div class="h4-modes">' +
      '<a class="h4-mode" href="#/hub/week?m=day" style="--c:#4a7bd6"><span class="ic">📅</span><b>Day by Day</b><p>শনি, রবি, সোম… প্রতিটি দিনের জন্য আলাদা টাস্ক — বিষয়, অধ্যায়, অগ্রাধিকার ও সম্পন্ন-স্ট্যাটাসসহ।</p><div style="margin-top:12px">' + H.bar(H.pct(dayD, dayN.length), '#4a7bd6') + '<div class="h4-mut" style="margin-top:6px">এই সপ্তাহে ' + bd(dayD) + '/' + bd(dayN.length) + ' টাস্ক সম্পন্ন</div></div></a>' +
      '<a class="h4-mode" href="#/hub/week?m=whole" style="--c:#2bb3a3"><span class="ic">🧺</span><b>Whole Week</b><p>পুরো সপ্তাহের একটি সমন্বিত তালিকা — কোনো নির্দিষ্ট দিনে বাঁধা নেই, সপ্তাহ শেষের আগে শেষ করলেই হলো।</p><div style="margin-top:12px">' + H.bar(H.pct(wd, w.tasks.length), '#2bb3a3') + '<div class="h4-mut" style="margin-top:6px">এই সপ্তাহে ' + bd(wd) + '/' + bd(w.tasks.length) + ' টাস্ক সম্পন্ন</div></div></a></div>' +
      '<div class="h4-card"><h3>💡 কোনটি কখন ভালো?</h3><div class="h4-grid h4-g2"><div class="h4-mut"><b>Day by Day</b> — যখন ক্লাস, কোচিং ও পরীক্ষার কারণে প্রতিদিনের সময় নির্দিষ্ট; “সোমবারে রসায়ন, মঙ্গলবারে পদার্থ” ধরনের পরিকল্পনা।</div><div class="h4-mut"><b>Whole Week</b> — যখন লক্ষ্যটাই মুখ্য: “এই সপ্তাহে পদার্থ ২য় অধ্যায় শেষ, ৫০টি MCQ”—কোন দিন করবেন সেটা নমনীয়।</div></div></div></div>';
  }

  /* ─────── Day by Day ─────── */
  function dayView() {
    var s = CORE.S(), ds = dates(offDay), ks = ds.map(CORE.dateKey), today = H.today(), ents = (s.weekPlanner.entries || []).filter(function (x) { return ks.indexOf(x.date) >= 0; });
    var done = ents.filter(function (x) { return x.done; }).length, defDay = ks.indexOf(today) >= 0 ? today : ks[0];
    var h = switcher('day') + '<div class="h4-card" style="--c:#4a7bd6"><div class="h4-row"><div><span class="h4-eyebrow">DAY BY DAY</span><h3 style="margin:2px 0 0">' + range(offDay) + (offDay === 0 ? ' · এই সপ্তাহ' : '') + '</h3></div><span class="h4-sp"></span><button type="button" class="h4-btn sm" data-a="d-nav" data-v="-1" aria-label="আগের সপ্তাহ">◀</button><button type="button" class="h4-btn sm" data-a="d-nav" data-v="0">আজ</button><button type="button" class="h4-btn sm" data-a="d-nav" data-v="1" aria-label="পরের সপ্তাহ">▶</button></div>' +
      '<div class="h4-row" style="margin-top:12px;gap:14px">' + H.ring(H.pct(done, ents.length), '', '#4a7bd6') + '<div><b>' + bd(done) + '/' + bd(ents.length) + ' টাস্ক সম্পন্ন</b><div class="h4-mut">সপ্তাহ শুরু: <select class="h4-in" id="dStart" style="width:auto;min-height:32px;padding:3px 8px">' + H.opts(WD_FULL.map(function (n, i) { return [i, n]; }), startDay()) + '</select></div></div></div></div>';
    h += '<div class="h4-card"><h3>＋ টাস্ক যোগ করুন</h3><div class="h4-form"><label class="h4-f w2">টাস্ক<input class="h4-in" id="dT" maxlength="140" placeholder="যেমন: ভেক্টর অনুশীলনী ১–১০"></label><label class="h4-f">দিন<select class="h4-in" id="dD">' + ds.map(function (d, i) { return '<option value="' + ks[i] + '"' + (ks[i] === defDay ? ' selected' : '') + '>' + WD_FULL[d.getDay()] + ' · ' + H.fmtDate(ks[i]) + '</option>'; }).join('') + '</select></label><label class="h4-f">বিষয়<select class="h4-in" id="dS" data-h4sub="dC">' + H.subjOpts('', 'বিষয় (ঐচ্ছিক)') + '</select></label><label class="h4-f">অধ্যায়<select class="h4-in" id="dC" data-blank="অধ্যায় (ঐচ্ছিক)">' + H.chapOpts('') + '</select></label><label class="h4-f">অগ্রাধিকার<select class="h4-in" id="dP">' + H.opts([['high', 'উচ্চ'], ['medium', 'মাঝারি'], ['low', 'কম']], 'medium') + '</select></label><button type="button" class="h4-btn pri" data-a="d-add">যোগ করুন</button></div></div>';
    h += '<div class="h4-wk-days">' + ds.map(function (d, i) {
      var k = ks[i], list = ents.filter(function (x) { return x.date === k; }).sort(function (a, b) { return (a.done ? 1 : 0) - (b.done ? 1 : 0) || sortP(a, b); }), dn = list.filter(function (x) { return x.done; }).length, past = k < today, open = list.length - dn;
      return '<section class="h4-day' + (k === today ? ' today' : '') + '"><h4><span>' + WD_FULL[d.getDay()] + '</span><small class="h4-mut">' + H.fmtDate(k) + (list.length ? ' · ' + bd(dn) + '/' + bd(list.length) : '') + '</small></h4>' +
        (list.length ? '<div class="h4-list">' + list.map(function (x) { return dayItem(x, ks); }).join('') + '</div>' : '<div class="h4-mut" style="font-size:.78rem">কোনো টাস্ক নেই</div>') +
        (past && open ? '<button type="button" class="h4-btn sm" style="margin-top:8px" data-a="d-carry" data-v="' + k + '">→ অসমাপ্ত ' + bd(open) + 'টি আজকে নিন</button>' : '') + '</section>';
    }).join('') + '</div>';
    h += '<div class="h4-row" style="margin-top:12px"><button type="button" class="h4-btn sm" data-a="d-clear">✓ সম্পন্নগুলো সরান</button><button type="button" class="h4-btn sm" data-a="d-export">⬇ CSV</button><a class="h4-btn sm" href="#/hub/time-blocks">⏰ Time Blocks</a></div>';
    return h;
  }
  function dayItem(x, ks) {
    if (String(editDay) === String(x.id)) {
      return '<div class="h4-item" style="flex-direction:column;align-items:stretch"><input class="h4-in" id="deT" value="' + E(x.t) + '" maxlength="140"><select class="h4-in" id="deS" data-h4sub="deC">' + H.subjOpts(x.subject, 'বিষয়') + '</select><select class="h4-in" id="deC" data-blank="অধ্যায়">' + H.chapOpts(x.subject, x.chapter) + '</select><select class="h4-in" id="deP">' + H.opts([['high', 'উচ্চ'], ['medium', 'মাঝারি'], ['low', 'কম']], x.priority || 'medium') + '</select><input class="h4-in" type="date" id="deD" value="' + E(x.date) + '"><div class="h4-row"><button type="button" class="h4-btn sm pri" data-a="d-save" data-v="' + E(x.id) + '">সেভ</button><button type="button" class="h4-btn sm" data-a="d-cancel">বাতিল</button></div></div>';
    }
    return '<div class="h4-item' + (x.done ? ' done' : '') + '" style="align-items:flex-start"><button type="button" class="h4-chk' + (x.done ? ' on' : '') + '" data-a="d-tog" data-v="' + E(x.id) + '" aria-label="সম্পন্ন চিহ্নিত করুন" aria-pressed="' + !!x.done + '">' + (x.done ? '✓' : '') + '</button><span class="tt">' + E(x.t) + '<small>' + (x.subject ? E(x.subject) : '') + (x.chapter ? ' · ' + E(x.chapter) : '') + '</small><span style="display:inline-flex;gap:4px;margin-top:4px">' + prioBadge(x.priority) + '</span></span><span style="display:flex;flex-direction:column;gap:2px"><button type="button" class="h4-btn sm" data-a="d-edit" data-v="' + E(x.id) + '" aria-label="সম্পাদনা">✎</button><button type="button" class="h4-btn sm dng" data-a="d-del" data-v="' + E(x.id) + '" aria-label="মুছুন">✕</button></span></div>';
  }
  function dayClick(a, v) {
    var s = CORE.S(), L = s.weekPlanner.entries, it;
    function find(i) { return L.filter(function (x) { return String(x.id) === String(i); })[0]; }
    if (a === 'd-nav') { offDay = v === '0' ? 0 : Math.max(-260, Math.min(260, offDay + (+v))); editDay = null; return HP.paint(); }
    if (a === 'd-add') {
      var t = H.val('dT'), d = H.val('dD'); if (!t) { U.toast('টাস্কের নাম লিখুন'); var f = document.getElementById('dT'); f && f.focus(); return; }
      L.push({ id: 'wk-' + U.uid(), date: d, t: t.slice(0, 140), subject: H.val('dS'), chapter: H.val('dC'), priority: H.val('dP') || 'medium', done: 0, createdAt: Date.now() }); CORE.W(s); U.toast('টাস্ক যোগ হয়েছে'); return HP.paint();
    }
    if (a === 'd-tog') { it = find(v); if (it) { it.done = it.done ? 0 : 1; CORE.W(s); if (it.done) CORE.xp(1, 'Weekly plan task done'); HP.paint(); } return; }
    if (a === 'd-edit') { editDay = v; return HP.paint(); }
    if (a === 'd-cancel') { editDay = null; return HP.paint(); }
    if (a === 'd-save') { it = find(v); var nt = H.val('deT'); if (!it || !nt) { U.toast('টাস্কের নাম লিখুন'); return; } it.t = nt.slice(0, 140); it.subject = H.val('deS'); it.chapter = H.val('deC'); it.priority = H.val('deP') || 'medium'; if (/^\d{4}-\d{2}-\d{2}$/.test(H.val('deD'))) it.date = H.val('deD'); CORE.W(s); editDay = null; return HP.paint(); }
    if (a === 'd-del') { if (!confirm('টাস্কটি মুছে ফেলবেন?')) return; s.weekPlanner.entries = L.filter(function (x) { return String(x.id) !== String(v); }); CORE.W(s); return HP.paint(); }
    if (a === 'd-carry') { var today = H.today(), n = 0; L.forEach(function (x) { if (x.date === v && !x.done) { x.date = today; n++; } }); CORE.W(s); U.toast(bd(n) + 'টি টাস্ক আজকে আনা হয়েছে'); return HP.paint(); }
    if (a === 'd-clear') { var ks = keys(offDay), b = L.length; s.weekPlanner.entries = L.filter(function (x) { return !(ks.indexOf(x.date) >= 0 && x.done); }); CORE.W(s); U.toast(bd(b - s.weekPlanner.entries.length) + 'টি সরানো হয়েছে'); return HP.paint(); }
    if (a === 'd-export') {
      var kk = keys(offDay), rows = [['Date', 'Day', 'Task', 'Subject', 'Chapter', 'Priority', 'Done']];
      L.filter(function (x) { return kk.indexOf(x.date) >= 0; }).sort(function (p, q) { return p.date < q.date ? -1 : 1; }).forEach(function (x) { rows.push([x.date, WD_FULL[new Date(x.date + 'T00:00:00').getDay()], x.t, x.subject || '', x.chapter || '', x.priority || '', x.done ? 'Yes' : 'No']); });
      U.download('day-by-day-' + kk[0] + '.csv', '﻿' + rows.map(function (r) { return r.map(csv).join(','); }).join('\n'), 'text/csv;charset=utf-8');
    }
  }
  function csv(v) { v = String(v == null ? '' : v); return /[",\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; }

  /* ─────── Whole Week ─────── */
  var TEMPLATES = ['অধ্যায় সম্পন্ন করা', '৫০টি MCQ অনুশীলন', '৩টি CQ সমাধান', 'একটি অধ্যায় রিভিশন', 'Previous Year Questions অনুশীলন', 'মডেল টেস্ট দেওয়া'];
  function wholeView() {
    var w = wk(offWhole, false), tasks = w.tasks, done = tasks.filter(function (t) { return t.done; }).length, p = H.pct(done, tasks.length);
    var list = tasks.filter(function (t) { return !fSub || t.subject === fSub; });
    var open = list.filter(function (t) { return !t.done; }).sort(sortP), fin = list.filter(function (t) { return t.done; });
    var subs = Object.keys(tasks.reduce(function (o, t) { if (t.subject) o[t.subject] = 1; return o; }, {}));
    var daysLeft = offWhole === 0 ? Math.max(0, H.dayDiff(H.today(), keys(0)[6])) : null;
    var h = switcher('whole') + '<div class="h4-card" style="--c:#2bb3a3"><div class="h4-row"><div><span class="h4-eyebrow">WHOLE WEEK</span><h3 style="margin:2px 0 0">' + range(offWhole) + (offWhole === 0 ? ' · এই সপ্তাহ' : '') + '</h3></div><span class="h4-sp"></span><button type="button" class="h4-btn sm" data-a="w-nav" data-v="-1" aria-label="আগের সপ্তাহ">◀</button><button type="button" class="h4-btn sm" data-a="w-nav" data-v="0">এই সপ্তাহ</button><button type="button" class="h4-btn sm" data-a="w-nav" data-v="1" aria-label="পরের সপ্তাহ">▶</button></div>' +
      '<div class="h4-kpis" style="margin-top:12px">' + H.stat(bd(tasks.length), 'মোট টাস্ক', '#3fa7c4') + H.stat(bd(done), 'সম্পন্ন', '#38c9a0') + H.stat(bd(tasks.length - done), 'বাকি', '#f2b45a') + (daysLeft !== null ? H.stat(bd(daysLeft + 1), 'দিন বাকি (আজসহ)', '#8b7cf6') : '') + '</div><div style="margin-top:12px" aria-label="Weekly progress">' + H.bar(p, '#2bb3a3') + '<div class="h4-mut" style="margin-top:6px">সাপ্তাহিক অগ্রগতি: <b>' + bd(p) + '%</b></div></div></div>';
    h += '<div class="h4-grid h4-g2"><div class="h4-card"><h3>🎯 এই সপ্তাহের লক্ষ্য</h3><textarea class="h4-in" id="wGoal" maxlength="400" placeholder="যেমন: পদার্থের ভেক্টর ও গতিবিদ্যা শেষ করব, ২টি মডেল টেস্ট দেব">' + E(w.goal || '') + '</textarea><small class="h4-mut" id="wSaved"></small></div><div class="h4-card"><h3>📝 সপ্তাহের নোট</h3><textarea class="h4-in" id="wNotes" maxlength="1000" placeholder="কী কাজ করল, কী বাকি থাকল, আগামী সপ্তাহে কী বদলাবেন">' + E(w.notes || '') + '</textarea></div></div>';
    h += '<div class="h4-card"><h3>＋ সাপ্তাহিক টাস্ক যোগ করুন</h3><div class="h4-form"><label class="h4-f w2">টাস্ক<input class="h4-in" id="wT" maxlength="140" placeholder="যেমন: Physics — Chapter 2 সম্পন্ন করা"></label><label class="h4-f">বিষয়<select class="h4-in" id="wS" data-h4sub="wC">' + H.subjOpts('', 'বিষয় (ঐচ্ছিক)') + '</select></label><label class="h4-f">অধ্যায়<select class="h4-in" id="wC" data-blank="অধ্যায় (ঐচ্ছিক)">' + H.chapOpts('') + '</select></label><label class="h4-f">অগ্রাধিকার<select class="h4-in" id="wP">' + H.opts([['high', 'উচ্চ'], ['medium', 'মাঝারি'], ['low', 'কম']], 'medium') + '</select></label><button type="button" class="h4-btn pri" data-a="w-add">যোগ করুন</button></div><div class="h4-row" style="margin-top:10px">' + TEMPLATES.map(function (t, i) { return '<button type="button" class="h4-chip" data-a="w-tpl" data-v="' + i + '">' + E(t) + '</button>'; }).join('') + '</div><p class="h4-mut" style="margin:8px 0 0">এই মোডে কাজ কোনো নির্দিষ্ট বারের সাথে বাঁধা থাকে না — শুধু সপ্তাহ শেষের আগে শেষ করুন।</p></div>';
    h += '<div class="h4-card"><div class="h4-row"><h3 style="margin:0">📋 সাপ্তাহিক তালিকা</h3><span class="h4-sp"></span>' + (subs.length ? '<select class="h4-in" id="wF" style="width:auto;min-height:34px"><option value="">সব বিষয়</option>' + H.opts(subs, fSub) + '</select>' : '') + '</div><div class="h4-list" style="margin-top:10px">' + (open.length || fin.length ? open.concat(fin).map(wItem).join('') : H.empty('🧺', 'এখনো কোনো টাস্ক নেই। ওপরের ফর্ম থেকে এই সপ্তাহের কাজ লিখুন।')) + '</div></div>';
    h += '<div class="h4-row"><button type="button" class="h4-btn" data-a="w-carry"' + (tasks.length - done ? '' : ' disabled') + '>⏭ অসমাপ্ত ' + bd(tasks.length - done) + 'টি পরের সপ্তাহে নিন</button><button type="button" class="h4-btn sm" data-a="w-clear">✓ সম্পন্নগুলো সরান</button><button type="button" class="h4-btn sm" data-a="w-export">⬇ CSV</button></div>';
    return h;
  }
  function wItem(t) {
    if (String(editWhole) === String(t.id)) {
      return '<div class="h4-item" style="flex-direction:column;align-items:stretch"><input class="h4-in" id="weT" value="' + E(t.t) + '" maxlength="140"><select class="h4-in" id="weS" data-h4sub="weC">' + H.subjOpts(t.subject, 'বিষয়') + '</select><select class="h4-in" id="weC" data-blank="অধ্যায়">' + H.chapOpts(t.subject, t.chapter) + '</select><select class="h4-in" id="weP">' + H.opts([['high', 'উচ্চ'], ['medium', 'মাঝারি'], ['low', 'কম']], t.prio || 'medium') + '</select><div class="h4-row"><button type="button" class="h4-btn sm pri" data-a="w-save" data-v="' + E(t.id) + '">সেভ</button><button type="button" class="h4-btn sm" data-a="w-cancel">বাতিল</button></div></div>';
    }
    return '<div class="h4-item' + (t.done ? ' done' : '') + '"><button type="button" class="h4-chk' + (t.done ? ' on' : '') + '" data-a="w-tog" data-v="' + E(t.id) + '" aria-label="সম্পন্ন চিহ্নিত করুন" aria-pressed="' + !!t.done + '">' + (t.done ? '✓' : '') + '</button><span class="tt">' + E(t.t) + '<small>' + (t.subject ? E(t.subject) : '') + (t.chapter ? ' · ' + E(t.chapter) : '') + (t.carried ? ' · ↩ আগের সপ্তাহ থেকে' : '') + '</small></span>' + prioBadge(t.prio) + '<button type="button" class="h4-btn sm" data-a="w-edit" data-v="' + E(t.id) + '" aria-label="সম্পাদনা">✎</button><button type="button" class="h4-btn sm dng" data-a="w-del" data-v="' + E(t.id) + '" aria-label="মুছুন">✕</button></div>';
  }
  function wholeClick(a, v) {
    var w = wk(offWhole, true), it;
    function find(i) { return w.tasks.filter(function (x) { return String(x.id) === String(i); })[0]; }
    if (a === 'w-nav') { offWhole = v === '0' ? 0 : Math.max(-260, Math.min(260, offWhole + (+v))); editWhole = null; return HP.paint(); }
    if (a === 'w-tpl') { var el = document.getElementById('wT'); if (el) { el.value = TEMPLATES[+v]; el.focus(); } return; }
    if (a === 'w-add') { var t = H.val('wT'); if (!t) { U.toast('টাস্কের নাম লিখুন'); var f = document.getElementById('wT'); f && f.focus(); return; } w.tasks.push({ id: id('ww'), t: t.slice(0, 140), subject: H.val('wS'), chapter: H.val('wC'), prio: H.val('wP') || 'medium', done: 0, createdAt: Date.now() }); wkSave(offWhole, w); U.toast('টাস্ক যোগ হয়েছে'); return HP.paint(); }
    if (a === 'w-tog') { it = find(v); if (it) { it.done = it.done ? 0 : 1; it.doneAt = it.done ? Date.now() : 0; wkSave(offWhole, w); if (it.done) CORE.xp(1, 'Whole-week task done'); HP.paint(); } return; }
    if (a === 'w-edit') { editWhole = v; return HP.paint(); }
    if (a === 'w-cancel') { editWhole = null; return HP.paint(); }
    if (a === 'w-save') { it = find(v); var nt = H.val('weT'); if (!it || !nt) { U.toast('টাস্কের নাম লিখুন'); return; } it.t = nt.slice(0, 140); it.subject = H.val('weS'); it.chapter = H.val('weC'); it.prio = H.val('weP') || 'medium'; wkSave(offWhole, w); editWhole = null; return HP.paint(); }
    if (a === 'w-del') { if (!confirm('টাস্কটি মুছে ফেলবেন?')) return; w.tasks = w.tasks.filter(function (x) { return String(x.id) !== String(v); }); wkSave(offWhole, w); return HP.paint(); }
    if (a === 'w-clear') { var b = w.tasks.length; w.tasks = w.tasks.filter(function (x) { return !x.done; }); wkSave(offWhole, w); U.toast(bd(b - w.tasks.length) + 'টি সরানো হয়েছে'); return HP.paint(); }
    if (a === 'w-carry') {
      var rest = w.tasks.filter(function (x) { return !x.done; }); if (!rest.length) return;
      var nx = wk(offWhole + 1, true), n = 0;
      rest.forEach(function (x) { if (!nx.tasks.some(function (y) { return y.from === x.id; })) { nx.tasks.push({ id: id('ww'), t: x.t, subject: x.subject, chapter: x.chapter, prio: x.prio, done: 0, createdAt: Date.now(), carried: 1, from: x.id }); n++; } });
      w.tasks = w.tasks.filter(function (x) { return x.done; }); wkSave(offWhole, w); wkSave(offWhole + 1, nx); U.toast(bd(n) + 'টি টাস্ক পরের সপ্তাহে নেওয়া হয়েছে'); return HP.paint();
    }
    if (a === 'w-export') {
      var rows = [['Week', 'Task', 'Subject', 'Chapter', 'Priority', 'Done']]; w.tasks.forEach(function (x) { rows.push([weekKey(offWhole), x.t, x.subject || '', x.chapter || '', x.prio || '', x.done ? 'Yes' : 'No']); });
      U.download('whole-week-' + weekKey(offWhole) + '.csv', '﻿' + rows.map(function (r) { return r.map(csv).join(','); }).join('\n'), 'text/csv;charset=utf-8');
    }
  }

  var saveT = 0;
  HP.add({
    id: 'week', icon: '🗓', label: 'সাপ্তাহিক প্ল্যানার', group: 'plan', priority: 95, highlight: true, desc: 'Day by Day ও Whole Week — দুই ধরনের সাপ্তাহিক পরিকল্পনা, আলাদা ডেটা',
    render: function () { var m = mode(); return '<div class="h4">' + (m === 'day' ? dayView() : m === 'whole' ? wholeView() : chooser()) + '</div>'; },
    click: function (el) { var a = el.dataset.a || ''; if (a.indexOf('d-') === 0) dayClick(a, el.dataset.v); else if (a.indexOf('w-') === 0) wholeClick(a, el.dataset.v); },
    change: function (el) {
      if (el.id === 'dStart') { var s = CORE.S(); s.weekPlanner.startDay = Math.max(0, Math.min(6, +el.value || 0)); CORE.W(s); offDay = 0; offWhole = 0; HP.paint(); }
      else if (el.id === 'wF') { fSub = el.value; HP.paint(); }
    },
    input: function (el) {
      if (el.id === 'wGoal' || el.id === 'wNotes') {
        clearTimeout(saveT); saveT = setTimeout(function () { var w = wk(offWhole, true); w.goal = H.val('wGoal'); w.notes = H.val('wNotes'); wkSave(offWhole, w); var sv = document.getElementById('wSaved'); if (sv) sv.textContent = 'সেভ হয়েছে ✓'; }, 400);
      }
    },
    key: function (e, el) { if (e.key === 'Enter' && el.id === 'dT') { e.preventDefault(); dayClick('d-add'); } else if (e.key === 'Enter' && el.id === 'wT') { e.preventDefault(); wholeClick('w-add'); } }
  });
  H.reg = H.reg || function () { };
  H.backup.push({ id: 'ww', label: 'Weekly Planner — Whole Week', keys: ['clh114_ww'] });
})();
