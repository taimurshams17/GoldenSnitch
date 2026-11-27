/* Golden Snitch Student Hub v114 — Notes Center · Mistake Notebook (analysis + links) · Doubt Tracker (with images).
   Notes Center merges Quick Notes, Cornell, Feynman and Study Journal in one searchable, folder-based place.
   Legacy data (clhub_v1.notes, clhp_cornell, clhp_feynman, clhp_journal, clhp_mistakes, clpro_d_doubts) is imported / reused, never deleted. */
(function () {
  'use strict';
  var H = window.CL_H114; if (!H || !H.img) return;
  var U = H.u, E = H.E, bd = H.bd, CORE = H.core, HP = H.hp, SUBJ = CORE.SUBJECTS;
  function dropOld(id) { for (var i = HP.tools.length - 1; i >= 0; i--) if (HP.tools[i].id === id) HP.tools.splice(i, 1); }
  function dl(name, text, type) { U.download(name, text, type || 'text/plain;charset=utf-8'); }

  /* ═════════ Notes Center ═════════ */
  var NS = H.store('notes', { items: [], folders: ['সাধারণ'], migrated: 0 }), UI = H.store('notesui', { type: 'all', folder: '', pin: 0 });
  var TYPES = [['quick', '⚡ Quick', '#5a8dee'], ['cornell', '🗒 Cornell', '#3fa7c4'], ['feynman', '🧠 Feynman', '#8b7cf6'], ['journal', '📔 Journal', '#3dbd9b']];
  var TLAB = { quick: ['শিরোনাম', 'নোট', '', ''], cornell: ['শিরোনাম', 'মূল নোট', 'কিওয়ার্ড / প্রশ্ন', 'সারাংশ'], feynman: ['টপিক', 'নিজের ভাষায় ব্যাখ্যা', 'কোথায় আটকে গেলাম?', 'আরও সহজ ব্যাখ্যা'], journal: ['শিরোনাম (ঐচ্ছিক)', 'আজ কী শিখলাম', 'কালকের কাজ', ''] };
  var SYM = ['x²', 'x₂', '√', '∑', '∫', 'π', 'Δ', 'θ', 'α', 'β', 'λ', 'μ', 'ω', 'Ω', '±', '≤', '≥', '≠', '≈', '→', '⇌', '∞', '°', '×', '÷'];
  var selId = null, lastTa = null, saveT = 0, sq = '', nStatus = '';
  function T(t) { return TYPES.filter(function (x) { return x[0] === t; })[0] || TYPES[0]; }
  var CACHE = null;
  function nGet() {
    if (CACHE) return CACHE;
    var s = NS.get(); if (s.migrated) return (CACHE = s);
    var cn = U.load('clhp_cornell', []), fy = U.load('clhp_feynman', []), jr = U.load('clhp_journal', {}), q = (CORE.S().notes || '').trim(), now = Date.now();
    if (q) s.items.push({ id: 'n-q0', type: 'quick', title: 'আগের Quick Note', body: q, folder: 'সাধারণ', pin: 0, created: now, updated: now });
    (Array.isArray(cn) ? cn : []).forEach(function (x) { s.items.push({ id: 'n-c' + x.id, type: 'cornell', title: x.t || '', subject: x.sub || '', cue: x.cue || '', body: x.note || '', sum: x.sum || '', folder: x.sub || 'সাধারণ', pin: 0, created: x.ts || now, updated: x.ts || now }); });
    (Array.isArray(fy) ? fy : []).forEach(function (x) { s.items.push({ id: 'n-f' + x.id, type: 'feynman', title: x.t || '', body: x.e || '', cue: x.g || '', sum: x.s || '', folder: 'সাধারণ', pin: 0, created: x.ts || now, updated: x.ts || now }); });
    Object.keys(jr || {}).forEach(function (k) { var x = jr[k]; if (x && (x.learned || x.next)) s.items.push({ id: 'n-j' + k, type: 'journal', title: '', date: k, mood: x.mood || 3, body: x.learned || '', cue: x.next || '', folder: 'সাধারণ', pin: 0, created: new Date(k + 'T12:00:00').getTime() || now, updated: now }); });
    s.items.forEach(function (x) { if (x.folder && s.folders.indexOf(x.folder) < 0) s.folders.push(x.folder); });
    s.migrated = 1; NS.set(s); return (CACHE = s);
  }
  function item(s, id) { return s.items.filter(function (x) { return x.id === id; })[0]; }
  function label(x) { return x.title || (x.type === 'journal' && x.date ? 'জার্নাল · ' + H.fmtDate(x.date) : (x.body || '').split('\n')[0].slice(0, 50) || 'শিরোনামহীন'); }
  function filtered(s) {
    var u = UI.get(), q = sq.trim().toLowerCase();
    return s.items.filter(function (x) { return (u.type === 'all' || x.type === u.type) && (!u.folder || x.folder === u.folder) && (!u.pin || x.pin) && (!q || [x.title, x.body, x.cue, x.sum, x.subject].join(' ').toLowerCase().indexOf(q) >= 0); })
      .sort(function (a, b) { return (b.pin ? 1 : 0) - (a.pin ? 1 : 0) || (b.updated || 0) - (a.updated || 0); });
  }
  function listHTML(s) {
    var l = filtered(s);
    return l.length ? l.map(function (x) { var t = T(x.type); return '<button type="button" class="h4-item" data-a="n-sel" data-v="' + E(x.id) + '" style="--c:' + t[2] + ';text-align:left;width:100%;cursor:pointer;color:inherit;font:inherit;' + (x.id === selId ? 'border-color:var(--c);box-shadow:0 0 0 1px var(--c)' : '') + '"><span class="tt" data-ntitle="' + E(x.id) + '">' + (x.pin ? '📌 ' : '') + E(label(x)) + '<small>' + t[1] + ' · ' + E(x.folder || '') + ' · ' + H.fmtDate(U.dayKey(new Date(x.updated || x.created || Date.now()))) + '</small></span></button>'; }).join('') : H.empty('🗂', 'কোনো নোট মেলেনি');
  }
  function editor(s) {
    var x = item(s, selId); if (!x) return '<div class="h4-card">' + H.empty('✍️', 'বাঁ দিক থেকে নোট বেছে নিন বা নতুন নোট শুরু করুন।<br><span class="h4-mut" style="font-size:.8rem">সূত্র লিখতে <code>$x^2 + \\frac{a}{b}$</code> ধরনের লেখা ব্যবহার করুন — নিচে প্রিভিউ দেখা যাবে।</span>') + '</div>';
    var L = TLAB[x.type], t = T(x.type);
    var h = '<div class="h4-card" style="--c:' + t[2] + '"><div class="h4-row"><span class="h4-chip">' + t[1] + '</span><span class="h4-sp"></span><small class="h4-mut" id="nSaved">' + E(nStatus) + '</small><button type="button" class="h4-btn sm" data-a="n-pin" aria-pressed="' + !!x.pin + '">' + (x.pin ? '📌 পিন করা' : '📍 পিন') + '</button><button type="button" class="h4-btn sm" data-a="n-dup">⧉</button><button type="button" class="h4-btn sm dng" data-a="n-del">🗑</button></div><div class="h4-form" style="margin-top:10px">';
    if (x.type !== 'journal' || true) h += '<label class="h4-f w2">' + L[0] + '<input class="h4-in" id="nTitle" maxlength="120" value="' + E(x.title || '') + '"></label>';
    h += '<label class="h4-f">ফোল্ডার<select class="h4-in" id="nFolder">' + H.opts(s.folders, x.folder) + '</select></label>';
    if (x.type === 'cornell') h += '<label class="h4-f">বিষয়<select class="h4-in" id="nSub">' + H.subjOpts(x.subject, 'বিষয়') + '</select></label>';
    if (x.type === 'journal') h += '<label class="h4-f">তারিখ<input class="h4-in" type="date" id="nDate" value="' + E(x.date || H.today()) + '"></label><label class="h4-f">মেজাজ<select class="h4-in" id="nMood">' + H.opts([[1, '😞 খারাপ'], [2, '😕 মন্দ নয়'], [3, '😐 সাধারণ'], [4, '🙂 ভালো'], [5, '😄 দারুণ']], x.mood || 3) + '</select></label>';
    h += '</div><div class="h4-row" style="margin:10px 0 6px" aria-label="প্রতীক">' + SYM.map(function (c) { return '<button type="button" class="h4-btn sm" style="min-width:34px;padding:3px 7px" data-a="n-sym" data-v="' + E(c) + '">' + c + '</button>'; }).join('') + '</div>';
    h += '<label class="h4-f">' + L[1] + '<textarea class="h4-in" id="nBody" rows="8" maxlength="12000">' + E(x.body || '') + '</textarea></label>';
    if (L[2]) h += '<label class="h4-f" style="margin-top:8px">' + L[2] + '<textarea class="h4-in" id="nCue" rows="3" maxlength="3000">' + E(x.cue || '') + '</textarea></label>';
    if (L[3]) h += '<label class="h4-f" style="margin-top:8px">' + L[3] + '<textarea class="h4-in" id="nSum" rows="3" maxlength="3000">' + E(x.sum || '') + '</textarea></label>';
    h += '<details class="h4-det" style="margin-top:10px" open><summary>👁 প্রিভিউ (সূত্রসহ)</summary><div id="nPrev">' + prev(x) + '</div></details><div class="h4-row"><button type="button" class="h4-btn sm" data-a="n-exp1">⬇ এই নোট (.md)</button><button type="button" class="h4-btn sm" data-a="n-print">🖨 প্রিন্ট</button></div></div>';
    return h;
  }
  function prev(x) {
    var L = TLAB[x.type], hr = '<hr style="border:0;border-top:1px solid var(--h4-line);margin:10px 0">';
    return '<div style="line-height:1.7">' + (x.title ? '<h4 style="margin:0 0 6px">' + H.fmath(x.title) + '</h4>' : '') + H.fmath(x.body) + (x.cue ? hr + '<b>' + L[2] + ':</b><br>' + H.fmath(x.cue) : '') + (x.sum ? hr + '<b>' + L[3] + ':</b><br>' + H.fmath(x.sum) : '') + '</div>';
  }
  function nView() {
    var s = nGet(), u = UI.get(), cnt = {}; s.items.forEach(function (x) { cnt[x.type] = (cnt[x.type] || 0) + 1; });
    var h = '<div class="h4"><div class="h4-card" style="--c:#3fa7c4"><div class="h4-row"><div><span class="h4-eyebrow">NOTES CENTER</span><h3 style="margin:2px 0 0">' + bd(s.items.length) + 'টি নোট</h3></div><span class="h4-sp"></span>' + TYPES.map(function (t) { return '<button type="button" class="h4-btn sm" data-a="n-new" data-v="' + t[0] + '">＋ ' + t[1] + '</button>'; }).join('') + '</div></div>';
    h += '<div class="h4-nb"><div><div class="h4-card" style="padding:12px"><label class="h4-search" style="margin-bottom:8px"><b aria-hidden="true">⌕</b><input type="search" id="nQ" placeholder="নোটে খুঁজুন…" value="' + E(sq) + '"></label><div class="h4-seg" style="margin-bottom:8px"><button type="button" data-a="n-type" data-v="all" aria-pressed="' + (u.type === 'all') + '">সব</button>' + TYPES.map(function (t) { return '<button type="button" data-a="n-type" data-v="' + t[0] + '" aria-pressed="' + (u.type === t[0]) + '">' + t[1].split(' ')[1] + ' ' + bd(cnt[t[0]] || 0) + '</button>'; }).join('') + '</div><div class="h4-row" style="margin-bottom:10px"><select class="h4-in" id="nFF" style="flex:1;min-height:36px"><option value="">সব ফোল্ডার</option>' + H.opts(s.folders, u.folder) + '</select><button type="button" class="h4-btn sm" data-a="n-fold" title="নতুন ফোল্ডার">＋📁</button><button type="button" class="h4-btn sm" data-a="n-pinf" aria-pressed="' + !!u.pin + '" title="শুধু পিন করা">' + (u.pin ? '📌' : '📍') + '</button></div><div class="h4-list" id="nList" style="max-height:60vh;overflow:auto">' + listHTML(s) + '</div><div class="h4-row" style="margin-top:10px"><button type="button" class="h4-btn sm" data-a="n-expall">⬇ সব নোট (.md)</button><button type="button" class="h4-btn sm" data-a="n-expjson">⬇ JSON</button></div></div></div><div id="nEd">' + editor(s) + '</div></div></div>';
    return h;
  }
  function cur() { var s = nGet(); return { s: s, x: item(s, selId) }; }
  function stamp(x) { x.updated = Date.now(); }
  function md(x) { var L = TLAB[x.type]; return '# ' + label(x) + '\n\n*' + T(x.type)[1] + ' · ' + (x.folder || '') + '*\n\n' + (x.body || '') + (x.cue ? '\n\n**' + L[2] + ':**\n' + x.cue : '') + (x.sum ? '\n\n**' + L[3] + ':**\n' + x.sum : '') + '\n'; }
  function paintEd(s) { var e = document.getElementById('nEd'); if (e) e.innerHTML = editor(s); var l = document.getElementById('nList'); if (l) l.innerHTML = listHTML(s); }
  H.add({
    id: 'notes', cat: 'notes', icon: '📝', label: 'Notes Center', desc: 'Quick, Cornell, Feynman ও Journal — সার্চ, ফোল্ডার, পিন, সূত্র ও এক্সপোর্টসহ', tags: 'notes cornell feynman journal quick formula export search folder', isNew: true, group: 'notes', priority: 88, render: nView,
    click: function (el) {
      var a = el.dataset.a, c = cur(), s = c.s, x = c.x;
      if (a === 'n-new') { var t = el.dataset.v, u = UI.get(), n = { id: 'n-' + U.uid(), type: t, title: '', body: '', cue: '', sum: '', subject: '', folder: u.folder || 'সাধারণ', pin: 0, created: Date.now(), updated: Date.now() }; if (t === 'journal') { n.date = H.today(); n.mood = 3; } s.items.push(n); NS.set(s); selId = n.id; nStatus = ''; HP.paint(); var f = document.getElementById('nTitle'); f && f.focus(); }
      else if (a === 'n-sel') { selId = el.dataset.v; nStatus = ''; paintEd(s); }
      else if (a === 'n-type') { var u2 = UI.get(); u2.type = el.dataset.v; UI.set(u2); HP.paint(); }
      else if (a === 'n-pinf') { var u3 = UI.get(); u3.pin = u3.pin ? 0 : 1; UI.set(u3); HP.paint(); }
      else if (a === 'n-fold') { var nm = prompt('ফোল্ডারের নাম'); if (nm && nm.trim()) { nm = nm.trim().slice(0, 30); if (s.folders.indexOf(nm) < 0) s.folders.push(nm); NS.set(s); if (x) { x.folder = nm; stamp(x); NS.set(s); } HP.paint(); } }
      else if (a === 'n-pin' && x) { x.pin = x.pin ? 0 : 1; NS.set(s); HP.paint(); }
      else if (a === 'n-dup' && x) { var d = JSON.parse(JSON.stringify(x)); d.id = 'n-' + U.uid(); d.title = (d.title || '') + ' (কপি)'; d.created = d.updated = Date.now(); s.items.push(d); NS.set(s); selId = d.id; HP.paint(); }
      else if (a === 'n-del' && x) { if (confirm('নোটটি মুছে ফেলবেন?')) { s.items = s.items.filter(function (i) { return i.id !== x.id; }); NS.set(s); selId = null; HP.paint(); } }
      else if (a === 'n-sym') { var ta = lastTa && document.body.contains(lastTa) ? lastTa : document.getElementById('nBody'); if (ta) { var st = ta.selectionStart || 0, en = ta.selectionEnd || 0, v = el.dataset.v; ta.value = ta.value.slice(0, st) + v + ta.value.slice(en); ta.focus(); ta.selectionStart = ta.selectionEnd = st + v.length; ta.dispatchEvent(new Event('input', { bubbles: true })); } }
      else if (a === 'n-exp1' && x) dl('note-' + (label(x).replace(/[^\wঀ-৿]+/g, '-').slice(0, 30) || 'note') + '.md', md(x), 'text/markdown;charset=utf-8');
      else if (a === 'n-expall') dl('concept-notes-' + H.today() + '.md', filtered(s).map(md).join('\n---\n\n'), 'text/markdown;charset=utf-8');
      else if (a === 'n-expjson') dl('concept-notes-' + H.today() + '.json', JSON.stringify(s, null, 1), 'application/json');
      else if (a === 'n-print' && x) { var w = window.open('', '_blank'); if (w) { w.document.write('<title>' + E(label(x)) + '</title><body style="font:16px/1.7 sans-serif;padding:24px;max-width:760px;margin:auto">' + prev(x) + '</body>'); w.document.close(); w.print(); } else U.toast('পপ-আপ ব্লক করা আছে'); }
    },
    input: function (el) {
      if (el.id === 'nQ') { sq = el.value; var s0 = nGet(); document.getElementById('nList').innerHTML = listHTML(s0); return; }
      var c = cur(), x = c.x; if (!x) return;
      var map = { nTitle: 'title', nBody: 'body', nCue: 'cue', nSum: 'sum' }, k = map[el.id]; if (!k) return;
      x[k] = el.value; nStatus = 'সেভ হচ্ছে…'; var sv = document.getElementById('nSaved'); if (sv) sv.textContent = nStatus;
      var pv = document.getElementById('nPrev'); if (pv) pv.innerHTML = prev(x);
      clearTimeout(saveT); saveT = setTimeout(function () { stamp(x); NS.set(c.s); nStatus = 'সেভ হয়েছে ✓'; var s2 = document.getElementById('nSaved'); if (s2) s2.textContent = nStatus; var tt = document.querySelector('[data-ntitle="' + x.id + '"]'); if (tt) tt.firstChild.textContent = (x.pin ? '📌 ' : '') + label(x); }, 350);
    },
    change: function (el) {
      if (el.id === 'nFF') { var u = UI.get(); u.folder = el.value; UI.set(u); HP.paint(); return; }
      var c = cur(), x = c.x; if (!x) return;
      if (el.id === 'nFolder') x.folder = el.value; else if (el.id === 'nSub') x.subject = el.value; else if (el.id === 'nDate') x.date = el.value; else if (el.id === 'nMood') x.mood = +el.value; else return;
      stamp(x); NS.set(c.s); nStatus = 'সেভ হয়েছে ✓'; var l = document.getElementById('nList'); if (l) l.innerHTML = listHTML(c.s);
    },
    mount: function (root) { CACHE = null; root.addEventListener('focusin', function (e) { if (e.target && e.target.tagName === 'TEXTAREA') lastTa = e.target; }); selId = selId && item(NS.get(), selId) ? selId : null; }
  });
  H.backup.push({ id: 'notes', label: 'Notes Center', keys: ['clh114_notes', 'clh114_notesui'] });

  /* ═════════ Mistake Notebook ═════════ */
  dropOld('mistakes');
  var REASONS = ['ধারণা ভুল', 'হিসাব ভুল', 'প্রশ্ন ভালো করে পড়িনি', 'সূত্র ভুলে গেছি', 'সময় শেষ', 'অসাবধানতা', 'মুখস্থ ছিল না'];
  function mk() { var a = U.load('clhp_mistakes', []); return Array.isArray(a) ? a : []; }
  function mkSave(a) { if (!U.save('clhp_mistakes', a)) H.fail(); }
  var mf = { st: 'open', sub: '', reason: '' }, mrev = null, mshow = false, mimg = '';
  function counts(list, key) { var m = {}; list.forEach(function (x) { var k = x[key] || '—'; m[k] = (m[k] || 0) + 1; }); return Object.keys(m).map(function (k) { return [k, m[k]]; }).sort(function (a, b) { return b[1] - a[1]; }); }
  function bars(rows, c) { var mx = Math.max.apply(null, rows.map(function (r) { return r[1]; }).concat([1])); return rows.slice(0, 6).map(function (r) { return '<div style="margin:0 0 8px"><div class="h4-row" style="justify-content:space-between"><small>' + E(r[0]) + '</small><small class="h4-mut">' + bd(r[1]) + '</small></div>' + H.bar(r[1] / mx * 100, c) + '</div>'; }).join(''); }
  function mkView() {
    var all = mk(), open = all.filter(function (x) { return !x.fixed; }), chap = counts(open.filter(function (x) { return x.chapter; }), 'chapter'), weak = chap[0];
    var list = all.filter(function (x) { return (mf.st === 'all' || (mf.st === 'open' ? !x.fixed : x.fixed)) && (!mf.sub || x.sub === mf.sub) && (!mf.reason || x.reason === mf.reason); }).sort(function (a, b) { return (b.ts || 0) - (a.ts || 0); });
    var h = '<div class="h4"><div class="h4-card" style="--c:#6c7ae0"><span class="h4-eyebrow">MISTAKE NOTEBOOK</span><div class="h4-kpis" style="margin-top:8px">' + H.stat(bd(all.length), 'মোট ভুল', '#5a8dee') + H.stat(bd(open.length), 'এখনো খোলা', '#ff7a8a') + H.stat(bd(all.length - open.length), 'শুধরে নিয়েছি', '#38c9a0') + H.stat(weak ? E(weak[0]).slice(0, 14) : '—', 'সবচেয়ে দুর্বল অধ্যায়', '#f2b45a') + '</div></div>';
    if (all.length) h += '<div class="h4-grid h4-g3"><div class="h4-card"><h3>🔎 ভুলের ধরন</h3>' + bars(counts(all, 'reason'), '#8b7cf6') + '</div><div class="h4-card"><h3>📚 বিষয়ভিত্তিক</h3>' + bars(counts(all, 'sub'), '#5a8dee') + '</div><div class="h4-card"><h3>📖 অধ্যায়ভিত্তিক (খোলা)</h3>' + (chap.length ? chap.slice(0, 5).map(function (c) { return '<div class="h4-item" style="margin-bottom:6px"><span class="tt">' + E(c[0]) + '<small>' + bd(c[1]) + 'টি খোলা ভুল</small></span><button type="button" class="h4-btn sm" data-a="m-rev" data-v="' + E(c[0]) + '" title="Syllabus-এ Need Revision">🔁</button></div>'; }).join('') : '<p class="h4-mut" style="margin:0">ভুল লেখার সময় অধ্যায় বেছে নিলে এখানে হিসাব দেখাবে।</p>') + '</div></div>';
    h += '<div class="h4-grid h4-g2"><div><div class="h4-card"><h3>＋ নতুন ভুল লিখুন</h3><div class="h4-form"><label class="h4-f wf">প্রশ্ন / টপিক<textarea class="h4-in" id="mQ" rows="2" maxlength="600"></textarea></label><label class="h4-f">বিষয়<select class="h4-in" id="mS" data-h4sub="mC">' + H.subjOpts('', 'বিষয়') + '</select></label><label class="h4-f">অধ্যায়<select class="h4-in" id="mC" data-blank="অধ্যায়">' + H.chapOpts('', '', 'অধ্যায়') + '</select></label><label class="h4-f">ভুলের কারণ<select class="h4-in" id="mR">' + H.opts(REASONS, '') + '</select></label><label class="h4-f wf">সঠিক সমাধান / শিক্ষা<textarea class="h4-in" id="mF" rows="2" maxlength="800"></textarea></label><label class="h4-f wf">ছবি (ঐচ্ছিক)<input class="h4-in" id="mI" type="file" accept="image/*"></label><button type="button" class="h4-btn pri wf" data-a="m-add">খাতায় যোগ করুন</button></div></div>';
    h += '<div class="h4-card" style="--c:#8b7cf6"><h3>🎲 র‍্যান্ডম রিভিশন</h3>';
    var rv = mrev && open.filter(function (x) { return x.id === mrev; })[0];
    if (rv) h += '<div class="h4-fl"><div class="in" data-a="m-flip">' + (mshow ? '<div><b>সঠিক উত্তর</b><br>' + H.fmath(rv.fix || '— কিছু লেখা নেই —') + '</div>' : '<div>' + H.fmath(rv.q) + '<br><small class="h4-mut">(ট্যাপ করে উত্তর দেখুন)</small></div>') + '</div></div>' + (mshow ? '<div class="h4-row" style="margin-top:8px"><button type="button" class="h4-btn pri" data-a="m-ok" data-v="' + E(rv.id) + '">✓ পারলাম</button><button type="button" class="h4-btn" data-a="m-no" data-v="' + E(rv.id) + '">✕ পারিনি</button></div>' : '');
    else h += '<p class="h4-mut" style="margin:0 0 8px">খোলা ভুলগুলো থেকে একটি করে প্রশ্ন নিজেকে করুন। দুইবার সঠিক পারলে ভুলটি “শুধরানো” হবে।</p><button type="button" class="h4-btn pri" data-a="m-start"' + (open.length ? '' : ' disabled') + '>শুরু করুন (' + bd(open.length) + ')</button>';
    h += '</div></div><div><div class="h4-card"><div class="h4-row"><div class="h4-seg"><button type="button" data-a="m-st" data-v="open" aria-pressed="' + (mf.st === 'open') + '">খোলা</button><button type="button" data-a="m-st" data-v="fixed" aria-pressed="' + (mf.st === 'fixed') + '">শুধরানো</button><button type="button" data-a="m-st" data-v="all" aria-pressed="' + (mf.st === 'all') + '">সব</button></div><span class="h4-sp"></span><select class="h4-in" id="mFS" style="width:auto;min-height:34px"><option value="">সব বিষয়</option>' + H.opts(counts(all, 'sub').map(function (r) { return r[0]; }), mf.sub) + '</select><select class="h4-in" id="mFR" style="width:auto;min-height:34px"><option value="">সব কারণ</option>' + H.opts(REASONS, mf.reason) + '</select></div><div class="h4-list" style="margin-top:10px">' + (list.length ? list.map(function (x) {
      return '<div class="h4-item' + (x.fixed ? ' done' : '') + '" style="flex-direction:column;align-items:stretch;gap:6px"><div class="tt">' + H.fmath(x.q) + '<small>' + E(x.sub || '') + (x.chapter ? ' · ' + E(x.chapter) : '') + ' · ' + E(x.reason || '') + '</small></div>' + (x.img ? '<img src="' + x.img + '" alt="" style="max-width:100%;max-height:200px;border-radius:10px;object-fit:contain;align-self:flex-start">' : '') + (x.fix ? '<div class="h4-note ok" style="font-size:.84rem">' + H.fmath(x.fix) + '</div>' : '') + '<div class="h4-row"><button type="button" class="h4-btn sm" data-a="m-tog" data-v="' + E(x.id) + '">' + (x.fixed ? '↩ আবার খুলুন' : '✓ শুধরে নিয়েছি') + '</button><button type="button" class="h4-btn sm" data-a="m-card" data-v="' + E(x.id) + '">🃏 ফ্ল্যাশকার্ড</button><button type="button" class="h4-btn sm" data-a="m-plan" data-v="' + E(x.id) + '">＋ প্ল্যান</button><span class="h4-sp"></span><small class="h4-mut">সঠিক ' + bd(x.ok || 0) + ' বার</small><button type="button" class="h4-btn sm dng" data-a="m-del" data-v="' + E(x.id) + '" aria-label="মুছুন">✕</button></div></div>';
    }).join('') : H.empty('📓', 'কিছু নেই')) + '</div></div></div></div></div>';
    return h;
  }
  function sylKey(sub, ch) { return CORE.CURRICULUM[sub] && CORE.CURRICULUM[sub].indexOf(ch) >= 0 ? sub + '|' + ch : ''; }
  H.add({
    id: 'mistakes', cat: 'revise', icon: '📓', label: 'Mistake Notebook (ভুলের খাতা)', desc: 'ভুলের ধরন ও অধ্যায়ভিত্তিক বিশ্লেষণ — ফ্ল্যাশকার্ড ও রিভিশনের সঙ্গে সংযুক্ত', tags: 'mistake error wrong analysis flashcard revision', group: 'revise', priority: 72, render: mkView,
    click: function (el) {
      var a = el.dataset.a, v = el.dataset.v, all = mk(), x = all.filter(function (i) { return i.id === v; })[0];
      if (a === 'm-add') { var q = H.val('mQ'); if (!q) return U.toast('প্রশ্ন বা টপিক লিখুন'); all.push({ id: U.uid(), sub: H.val('mS') || 'অন্যান্য', chapter: H.val('mC'), reason: H.val('mR'), q: q, fix: H.val('mF'), img: mimg, ts: Date.now(), fixed: false, ok: 0 }); mimg = ''; mkSave(all); U.toast('খাতায় যোগ হয়েছে ✓'); HP.paint(); }
      else if (a === 'm-st') { mf.st = v; HP.paint(); }
      else if (a === 'm-tog' && x) { x.fixed = !x.fixed; if (!x.fixed) x.ok = 0; mkSave(all); HP.paint(); }
      else if (a === 'm-del' && x) { if (confirm('এটি মুছে ফেলবেন?')) { mkSave(all.filter(function (i) { return i.id !== v; })); HP.paint(); } }
      else if (a === 'm-card' && x) { var s = CORE.S(); if (s.cards.some(function (c) { return c.src === 'mk:' + x.id; })) return U.toast('ফ্ল্যাশকার্ড আগেই বানানো আছে'); s.cards.push({ id: 'card-' + U.uid(), f: x.q.slice(0, 300), b: (x.fix || 'উত্তর যোগ করুন').slice(0, 500), src: 'mk:' + x.id }); CORE.W(s); U.toast('ফ্ল্যাশকার্ড তৈরি হয়েছে ✓'); }
      else if (a === 'm-plan' && x) H.addPlan('ভুল শুধরানো: ' + x.q.slice(0, 50), x.sub, x.chapter, 'high', 'mk:' + x.id);
      else if (a === 'm-rev') { var done = 0; SUBJ.forEach(function (sub) { var k = sylKey(sub, v); if (k) { H.syl.setStatus(k, 'revise'); done++; } }); U.toast(done ? 'Syllabus-এ “Need Revision” করা হয়েছে ✓' : 'অধ্যায়টি Syllabus তালিকায় মেলেনি'); }
      else if (a === 'm-start') { var open = all.filter(function (i) { return !i.fixed; }); if (open.length) { mrev = open[Math.floor(Math.random() * open.length)].id; mshow = false; HP.paint(); } }
      else if (a === 'm-flip') { mshow = !mshow; HP.paint(); }
      else if ((a === 'm-ok' || a === 'm-no') && x) { if (a === 'm-ok') { x.ok = (x.ok || 0) + 1; if (x.ok >= 2) { x.fixed = true; U.toast('শুধরে গেছে 🎉'); } CORE.xp(1, 'mistake reviewed'); } else x.ok = 0; mkSave(all); var rest = all.filter(function (i) { return !i.fixed && i.id !== v; }); mrev = rest.length ? rest[Math.floor(Math.random() * rest.length)].id : null; mshow = false; HP.paint(); }
    },
    change: function (el) {
      if (el.id === 'mFS') { mf.sub = el.value; HP.paint(); } else if (el.id === 'mFR') { mf.reason = el.value; HP.paint(); }
      else if (el.id === 'mI' && el.files && el.files[0]) H.img(el.files[0], 800, function (d) { mimg = d; U.toast('ছবি যোগ হয়েছে'); });
    }
  });

  /* ═════════ Doubt Tracker (with question images) ═════════ */
  dropOld('doubts');
  var DS = { items: [], filter: 'open' }, DK = 'clpro_d_doubts', dimg = '', dopen = null, dq = { prio: '', sub: '' };
  function dget() { var v = U.load(DK, null); if (!v || typeof v !== 'object' || !Array.isArray(v.items)) return JSON.parse(JSON.stringify(DS)); if (!v.filter) v.filter = 'open'; return v; }
  function dset(v) { if (!U.save(DK, v)) H.fail(); }
  var DST = { open: ['❓ অমীমাংসিত', '#ff7a8a'], asked: ['🙋 জিজ্ঞেস করেছি', '#f2b45a'], solved: ['✅ সমাধান', '#38c9a0'] }, DNEXT = { open: 'asked', asked: 'solved', solved: 'open' }, DP = { h: ['জরুরি', '#ff7a8a', 0], m: ['সাধারণ', '#f2b45a', 1], l: ['পরে হলেও চলবে', '#38c9a0', 2] };
  function dView() {
    var st = dget(), all = st.items, c = { open: 0, asked: 0, solved: 0 }; all.forEach(function (i) { if (c[i.status] !== undefined) c[i.status]++; });
    var list = all.filter(function (i) { return (st.filter === 'all' || i.status === st.filter) && (!dq.prio || i.prio === dq.prio) && (!dq.sub || i.subject === dq.sub); }).sort(function (a, b) { return ((DP[a.prio] || DP.m)[2]) - ((DP[b.prio] || DP.m)[2]) || String(b.created).localeCompare(String(a.created)); });
    var h = '<div class="h4"><div class="h4-card" style="--c:#ff7a8a"><span class="h4-eyebrow">DOUBT TRACKER</span><div class="h4-kpis" style="margin-top:8px">' + H.stat(bd(c.open), 'অমীমাংসিত', '#ff7a8a') + H.stat(bd(c.asked), 'জিজ্ঞেস করেছি', '#f2b45a') + H.stat(bd(c.solved), 'সমাধান', '#38c9a0') + H.stat(bd(H.pct(c.solved, all.length)) + '%', 'সমাধানের হার', '#5a8dee') + '</div></div>';
    h += '<div class="h4-card"><h3>＋ প্রশ্ন সংরক্ষণ করুন</h3><div class="h4-form"><label class="h4-f wf">প্রশ্ন / সন্দেহ<textarea class="h4-in" id="dbQ" rows="2" maxlength="800" placeholder="কী বুঝতে পারছেন না?"></textarea></label><label class="h4-f">বিষয়<select class="h4-in" id="dbS" data-h4sub="dbC">' + H.subjOpts('', 'বিষয়') + '</select></label><label class="h4-f">অধ্যায়<select class="h4-in" id="dbC" data-blank="অধ্যায়">' + H.chapOpts('', '', 'অধ্যায়') + '</select></label><label class="h4-f">অগ্রাধিকার<select class="h4-in" id="dbP"><option value="h">জরুরি</option><option value="m" selected>সাধারণ</option><option value="l">পরে হলেও চলবে</option></select></label><label class="h4-f w2">প্রশ্নের ছবি<input class="h4-in" id="dbI" type="file" accept="image/*" capture="environment"></label><button type="button" class="h4-btn pri" data-a="d-add">সংরক্ষণ</button></div></div>';
    h += '<div class="h4-card"><div class="h4-row"><div class="h4-seg">' + [['open', 'অমীমাংসিত'], ['asked', 'জিজ্ঞেস করেছি'], ['solved', 'সমাধান'], ['all', 'সব']].map(function (f) { return '<button type="button" data-a="d-flt" data-v="' + f[0] + '" aria-pressed="' + (st.filter === f[0]) + '">' + f[1] + '</button>'; }).join('') + '</div><span class="h4-sp"></span><select class="h4-in" id="dqP" style="width:auto;min-height:34px"><option value="">সব অগ্রাধিকার</option>' + H.opts([['h', 'জরুরি'], ['m', 'সাধারণ'], ['l', 'কম জরুরি']], dq.prio) + '</select></div><div class="h4-list" style="margin-top:10px">' + (list.length ? list.map(function (i) {
      var p = DP[i.prio] || DP.m, s2 = DST[i.status] || DST.open;
      return '<div class="h4-item" style="flex-direction:column;align-items:stretch;gap:8px"><div class="h4-row"><span class="h4-chip" style="--c:' + p[1] + '">' + p[0] + '</span><span class="h4-chip" style="--c:' + s2[1] + '">' + s2[0] + '</span><span class="h4-mut" style="font-size:.76rem">' + E(i.subject || '') + (i.chapter ? ' · ' + E(i.chapter) : '') + '</span></div><div class="tt">' + H.fmath(i.q) + '</div>' + (i.img ? '<img src="' + i.img + '" alt="প্রশ্নের ছবি" data-a="d-zoom" data-v="' + E(i.id) + '" style="max-width:' + (dopen === i.id ? '100%' : '180px') + ';max-height:' + (dopen === i.id ? 'none' : '140px') + ';border-radius:10px;object-fit:contain;align-self:flex-start;cursor:zoom-in">' : '') +
        (i.answer ? '<div class="h4-note ok">' + H.fmath(i.answer) + '</div>' : '') + '<div class="h4-row"><button type="button" class="h4-btn sm" data-a="d-cyc" data-v="' + E(i.id) + '">⇄ ' + (DST[DNEXT[i.status]] || DST.open)[0] + '</button><button type="button" class="h4-btn sm" data-a="d-ans" data-v="' + E(i.id) + '">✎ সমাধান লিখুন</button><button type="button" class="h4-btn sm" data-a="d-mk" data-v="' + E(i.id) + '">📓 ভুলের খাতায়</button><span class="h4-sp"></span><button type="button" class="h4-btn sm dng" data-a="d-del" data-v="' + E(i.id) + '" aria-label="মুছুন">✕</button></div></div>';
    }).join('') : H.empty('🙋', 'এই তালিকায় কিছু নেই')) + '</div></div></div>';
    return h;
  }
  H.add({
    id: 'doubts', cat: 'revise', icon: '🙋', label: 'প্রশ্ন তালিকা (Doubt Tracker)', desc: 'ছবিসহ প্রশ্ন, অধ্যায়, অগ্রাধিকার ও সমাধানের অবস্থা', tags: 'doubt question image priority solved', group: 'revise', priority: 68, render: dView,
    click: function (el) {
      var a = el.dataset.a, v = el.dataset.v, st = dget(), it = st.items.filter(function (i) { return i.id === v; })[0];
      if (a === 'd-add') { var q = H.val('dbQ'); if (!q && !dimg) return U.toast('প্রশ্ন লিখুন বা ছবি দিন'); st.items.push({ id: U.uid(), q: q || '(ছবির প্রশ্ন)', subject: H.val('dbS'), chapter: H.val('dbC'), prio: H.val('dbP') || 'm', status: 'open', answer: '', img: dimg, created: H.today() }); dimg = ''; dset(st); U.toast('প্রশ্ন সংরক্ষিত হয়েছে'); HP.paint(); }
      else if (a === 'd-flt') { st.filter = v; dset(st); HP.paint(); }
      else if (a === 'd-cyc' && it) { it.status = DNEXT[it.status] || 'open'; dset(st); HP.paint(); }
      else if (a === 'd-ans' && it) { var t = prompt('সমাধান / উত্তর লিখুন', it.answer || ''); if (t !== null) { it.answer = t.slice(0, 1500); if (it.answer && it.status !== 'solved') it.status = 'solved'; dset(st); HP.paint(); } }
      else if (a === 'd-zoom' && it) { dopen = dopen === v ? null : v; HP.paint(); }
      else if (a === 'd-mk' && it) { var m = mk(); m.push({ id: U.uid(), sub: it.subject || 'অন্যান্য', chapter: it.chapter || '', reason: 'ধারণা ভুল', q: it.q, fix: it.answer || '', img: it.img || '', ts: Date.now(), fixed: false, ok: 0 }); mkSave(m); U.toast('ভুলের খাতায় যোগ হয়েছে ✓'); }
      else if (a === 'd-del' && it) { if (confirm('মুছে ফেলবেন?')) { st.items = st.items.filter(function (i) { return i.id !== v; }); dset(st); HP.paint(); } }
    },
    change: function (el) { if (el.id === 'dqP') { dq.prio = el.value; HP.paint(); } else if (el.id === 'dbI' && el.files && el.files[0]) H.img(el.files[0], 900, function (d) { dimg = d; U.toast('ছবি যোগ হয়েছে'); }); }
  });
  H.backup.push({ id: 'mistakes', label: 'Mistake Notebook', keys: ['clhp_mistakes'] }, { id: 'doubts', label: 'Doubt Tracker', keys: ['clpro_d_doubts'] });
})();
