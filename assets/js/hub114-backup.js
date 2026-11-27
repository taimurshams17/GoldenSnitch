/* Golden Snitch Student Hub v114 — Unified Backup & Restore + Data & Settings.
   Selective export, import with preview, merge or replace, automatic safety snapshot. Covers every Hub tool. */
(function () {
  'use strict';
  var H = window.CL_H114; if (!H || !H.img) return;
  var U = H.u, E = H.E, bd = H.bd, HP = H.hp;
  var GROUPS = [
    { id: 'core', label: 'মূল ডেটা (প্ল্যান, পরীক্ষা, ফ্ল্যাশকার্ড, স্কোর, নোট)', keys: ['clhub_v1'] },
    { id: 'room', label: 'Study Room (সেশন ও সেটিংস)', keys: ['clroom_v1'] },
    { id: 'hp', label: 'ভুলের খাতা, টাইম ব্লক, চেকলিস্ট, পুরোনো নোট', match: /^clhp_/ },
    { id: 'pro', label: 'রুটিন, অ্যাসাইনমেন্ট, ডাউট, স্ট্রিক, রিভিউ, প্রিয় টুল', match: /^clpro_/ }
  ];
  var REG = H.backup;
  var sel = {}, pending = null, mode = 'merge', status = '';

  function allKeys() { var o = []; try { for (var i = 0; i < localStorage.length; i++) { var k = localStorage.key(i); if (/^(clhub_v1|clroom_v1|clhp_|clpro_|clh114_)/.test(k)) o.push(k); } } catch (e) { } return o.sort(); }
  function groups() {
    var keys = allKeys(), used = {}, out = [];
    GROUPS.forEach(function (g) { var ks = g.keys ? g.keys.filter(function (k) { return keys.indexOf(k) >= 0; }) : keys.filter(function (k) { return g.match.test(k); }); ks.forEach(function (k) { used[k] = 1; }); out.push({ id: g.id, label: g.label, keys: ks }); });
    REG.forEach(function (r) { var ks = r.keys.filter(function (k) { return keys.indexOf(k) >= 0; }); ks.forEach(function (k) { used[k] = 1; }); out.push({ id: r.id, label: r.label, keys: ks }); });
    var rest = keys.filter(function (k) { return !used[k]; }); if (rest.length) out.push({ id: 'misc', label: 'অন্যান্য Hub ডেটা', keys: rest });
    return out;
  }
  function size(keys) { var n = 0; keys.forEach(function (k) { try { n += (localStorage.getItem(k) || '').length; } catch (e) { } }); return n; }
  function kb(n) { return bd(n < 1024 ? n + ' B' : (n / 1024).toFixed(1) + ' KB'); }
  function isObj(v) { return v && typeof v === 'object' && !Array.isArray(v); }
  function merge(a, b) {
    if (Array.isArray(a) && Array.isArray(b)) { var seen = {}, out = []; a.concat(b).forEach(function (x) { var k = x && typeof x === 'object' && x.id != null ? 'id:' + x.id : JSON.stringify(x); if (!seen[k]) { seen[k] = 1; out.push(x); } }); return out; }
    if (isObj(a) && isObj(b)) { var r = {}; Object.keys(a).concat(Object.keys(b)).forEach(function (k) { r[k] = k in a ? (k in b ? merge(a[k], b[k]) : a[k]) : b[k]; }); return r; }
    if (typeof a === 'string' && typeof b === 'string' && a && b && a !== b && a.length > 20) return a + '\n\n' + b;
    return a === undefined || a === null || a === '' ? b : a;
  }
  function parseFile(text) {
    var j = JSON.parse(text), keys = {};
    if (j && (j.app === 'ConceptLab Student Hub' || j.app === 'Golden Snitch Student Hub') && j.data) { keys.clhub_v1 = JSON.stringify(j.data); }
    else if (j && (j.app === 'ConceptLab Student Hub v114' || j.app === 'Golden Snitch Student Hub v114') && isObj(j.keys)) { Object.keys(j.keys).forEach(function (k) { if (/^(clhub_v1|clroom_v1|clhp_|clpro_|clh114_)/.test(k) && typeof j.keys[k] === 'string') { try { JSON.parse(j.keys[k]); keys[k] = j.keys[k]; } catch (e) { } } }); }
    else throw new Error('এটি Golden Snitch Student Hub-এর ব্যাকআপ ফাইল নয়');
    if (!Object.keys(keys).length) throw new Error('ফাইলে কোনো ব্যবহারযোগ্য ডেটা নেই');
    return { keys: keys, at: j.exportedAt || '' };
  }
  function view() {
    var gs = groups(), total = size(allKeys()), h = '<div class="h4"><div class="h4-card" style="--c:#5a8dee"><div class="h4-row"><div><span class="h4-eyebrow">BACKUP · RESTORE · SETTINGS</span><h3 style="margin:2px 0 0">আপনার সব স্টাডি ডেটা এক জায়গায়</h3><p class="h4-mut" style="margin:4px 0 0">এই ডিভাইসের ব্রাউজারে ' + kb(total) + ' সংরক্ষিত · ' + bd(gs.filter(function (g) { return g.keys.length; }).length) + 'টি অংশ</p></div></div></div>';
    h += '<div class="h4-card"><h3>⬇ ব্যাকআপ নিন (নির্বাচন করুন)</h3><div class="h4-list">' + gs.map(function (g) { var on = sel[g.id] !== false; return '<label class="h4-item" style="cursor:pointer;' + (g.keys.length ? '' : 'opacity:.5') + '"><input type="checkbox" data-bk="' + E(g.id) + '"' + (on && g.keys.length ? ' checked' : '') + (g.keys.length ? '' : ' disabled') + '><span class="tt">' + E(g.label) + '<small>' + (g.keys.length ? bd(g.keys.length) + 'টি কী · ' + kb(size(g.keys)) : 'এখনো ডেটা নেই') + '</small></span></label>'; }).join('') + '</div><div class="h4-row" style="margin-top:10px"><button type="button" class="h4-btn pri" data-a="b-exp">⬇ নির্বাচিতগুলো এক্সপোর্ট (.json)</button><button type="button" class="h4-btn" data-a="b-all">সব নির্বাচন</button><button type="button" class="h4-btn" data-a="b-none">কিছুই না</button></div></div>';
    h += '<div class="h4-card"><h3>⬆ রিস্টোর / ইমপোর্ট</h3>' + (status ? '<div class="h4-note ' + (/ব্যর্থ|নয়|ভুল/.test(status) ? 'bad' : 'ok') + '" style="margin-bottom:10px">' + E(status) + '</div>' : '') + (pending ? '<p class="h4-mut">প্রিভিউ — ফাইলে যা আছে' + (pending.at ? ' (' + E(pending.at.slice(0, 10)) + ')' : '') + ':</p><div class="h4-scroll"><table class="h4-table"><thead><tr><th></th><th>অংশ</th><th>ফাইলে</th><th>এখন আছে</th></tr></thead><tbody>' + pending.rows.map(function (r) { return '<tr><td><input type="checkbox" data-rk="' + E(r.id) + '"' + (r.on ? ' checked' : '') + '></td><td>' + E(r.label) + '</td><td>' + kb(r.fsize) + '</td><td>' + (r.lsize ? kb(r.lsize) : '—') + '</td></tr>'; }).join('') + '</tbody></table></div><div class="h4-seg" style="margin:10px 0"><button type="button" data-a="b-mode" data-v="merge" aria-pressed="' + (mode === 'merge') + '">🔀 মার্জ (আগের ডেটা রেখে যোগ)</button><button type="button" data-a="b-mode" data-v="replace" aria-pressed="' + (mode === 'replace') + '">♻️ রিপ্লেস (প্রতিস্থাপন)</button></div><p class="h4-mut" style="font-size:.8rem">রিস্টোরের আগে বর্তমান ডেটার একটি নিরাপত্তা-স্ন্যাপশট নেওয়া হয়, যা পরে “আগের অবস্থায় ফিরুন” দিয়ে ফেরানো যায়।</p><div class="h4-row"><button type="button" class="h4-btn pri" data-a="b-apply">✓ রিস্টোর করুন</button><button type="button" class="h4-btn" data-a="b-cancel">বাতিল</button></div>' : '<p class="h4-mut">ব্যাকআপ ফাইল বেছে নিন — প্রথমে প্রিভিউ দেখাবে, নিশ্চিত না করা পর্যন্ত কিছু বদলাবে না। পুরোনো Student Hub ব্যাকআপও কাজ করবে।</p><input class="h4-in" id="bFile" type="file" accept="application/json,.json">') + (U.load('clh114_snap', null) ? '<div class="h4-row" style="margin-top:12px"><button type="button" class="h4-btn" data-a="b-undo">↩ আগের অবস্থায় ফিরুন (শেষ রিস্টোরের আগের স্ন্যাপশট)</button></div>' : '') + '</div>';
    var p = H.prefs.get(), perm = ('Notification' in window) ? Notification.permission : 'unsupported';
    h += '<div class="h4-card"><h3>⚙️ সেটিংস</h3><div class="h4-list"><label class="h4-item" style="cursor:pointer"><input type="checkbox" data-pref="deadlineAlert"' + (p.deadlineAlert ? ' checked' : '') + '><span class="tt">ডেডলাইন সতর্কতা<small>কাছাকাছি/মেয়াদোত্তীর্ণ অ্যাসাইনমেন্টের নোটিশ</small></span></label><div class="h4-item"><span class="tt">ব্রাউজার নোটিফিকেশন<small>' + (perm === 'granted' ? 'চালু আছে' : perm === 'denied' ? 'ব্লক করা — ব্রাউজার সেটিংস থেকে অনুমতি দিন' : perm === 'unsupported' ? 'এই ব্রাউজারে সমর্থিত নয়' : 'এখনো অনুমতি দেওয়া হয়নি') + '</small></span>' + (perm === 'default' ? '<button type="button" class="h4-btn sm" data-a="b-notif">অনুমতি দিন</button>' : '') + '</div></div></div>';
    h += '<div class="h4-card" style="border-color:color-mix(in srgb,var(--h4-bad) 35%,transparent)"><h3>🗑 ডেটা মুছুন</h3><p class="h4-mut">শুধু Student Hub-এর ডেটা মুছবে; সাইটের অন্য কিছু নয়। আগে ব্যাকআপ নিন।</p><button type="button" class="h4-btn dng" data-a="b-wipe">সব Hub ডেটা মুছুন…</button></div></div>';
    return h;
  }
  function snapshot() { var o = {}; allKeys().forEach(function (k) { o[k] = localStorage.getItem(k); }); try { U.save('clh114_snap', { at: new Date().toISOString(), keys: o }); } catch (e) { } }
  H.add({
    id: 'backup', cat: 'data', icon: '💾', label: 'Backup, Restore & Settings', desc: 'সব টুলের ডেটা নির্বাচন করে ব্যাকআপ, প্রিভিউসহ রিস্টোর ও মার্জ', tags: 'backup restore export import merge settings data reminder', group: 'data', priority: 90, render: view,
    click: function (el) {
      var a = el.dataset.a, gs = groups();
      if (a === 'b-all' || a === 'b-none') { gs.forEach(function (g) { sel[g.id] = a === 'b-all'; }); HP.paint(); }
      else if (a === 'b-exp') {
        var keys = {}, n = 0; gs.forEach(function (g) { if (sel[g.id] !== false) g.keys.forEach(function (k) { if (k === 'clh114_snap') return; var v = localStorage.getItem(k); if (v != null) { keys[k] = v; n++; } }); });
        if (!n) return U.toast('কিছু নির্বাচন করুন');
        U.download('golden-snitch-hub-backup-' + H.today() + '.json', JSON.stringify({ app: 'Golden Snitch Student Hub v114', schema: 2, exportedAt: new Date().toISOString(), keys: keys }, null, 1), 'application/json'); status = bd(n) + 'টি কী এক্সপোর্ট হয়েছে ✓'; HP.paint();
      }
      else if (a === 'b-mode') { mode = el.dataset.v; HP.paint(); }
      else if (a === 'b-cancel') { pending = null; status = ''; HP.paint(); }
      else if (a === 'b-apply' && pending) {
        var chosen = pending.rows.filter(function (r) { return r.on; }); if (!chosen.length) return U.toast('কিছু নির্বাচন করুন');
        if (mode === 'replace' && !confirm('নির্বাচিত অংশের বর্তমান ডেটা প্রতিস্থাপিত হবে। এগোবেন?')) return;
        snapshot(); var cnt = 0, bad = 0;
        chosen.forEach(function (r) { r.keys.forEach(function (k) { try { var inc = JSON.parse(pending.keys[k]), cur = localStorage.getItem(k), out = inc; if (mode === 'merge' && cur != null) out = merge(JSON.parse(cur), inc); localStorage.setItem(k, JSON.stringify(out)); cnt++; } catch (e) { bad++; } }); });
        pending = null; status = bd(cnt) + 'টি অংশ রিস্টোর হয়েছে ✓' + (bad ? ' (' + bd(bad) + 'টি ব্যর্থ)' : '') + ' — পেজ রিফ্রেশ হচ্ছে…'; HP.paint(); setTimeout(function () { location.reload(); }, 900);
      }
      else if (a === 'b-undo') { var sn = U.load('clh114_snap', null); if (!sn || !confirm('শেষ রিস্টোরের আগের অবস্থায় ফিরবেন?')) return; allKeys().forEach(function (k) { if (k !== 'clh114_snap') localStorage.removeItem(k); }); Object.keys(sn.keys).forEach(function (k) { if (sn.keys[k] != null) localStorage.setItem(k, sn.keys[k]); }); status = 'আগের অবস্থায় ফেরানো হয়েছে ✓'; setTimeout(function () { location.reload(); }, 700); }
      else if (a === 'b-notif') { try { Notification.requestPermission().then(function () { HP.paint(); }); } catch (e) { } }
      else if (a === 'b-wipe') { var t = prompt('নিশ্চিত করতে “মুছুন” লিখুন'); if (t && t.trim() === 'মুছুন') { snapshot(); allKeys().forEach(function (k) { if (k !== 'clh114_snap') localStorage.removeItem(k); }); status = 'ডেটা মুছে ফেলা হয়েছে (স্ন্যাপশট থেকে ফেরানো যাবে)'; setTimeout(function () { location.reload(); }, 700); } }
    },
    change: function (el) {
      if (el.dataset.bk) { sel[el.dataset.bk] = el.checked; }
      else if (el.dataset.rk && pending) { pending.rows.forEach(function (r) { if (r.id === el.dataset.rk) r.on = el.checked; }); }
      else if (el.dataset.pref) { var p = H.prefs.get(); p[el.dataset.pref] = el.checked ? 1 : 0; H.prefs.set(p); if (el.dataset.pref === 'classRemind' && el.checked && 'Notification' in window && Notification.permission === 'default') { try { Notification.requestPermission().then(function () { HP.paint(); }); } catch (e) { } } }
      else if (el.id === 'bFile' && el.files && el.files[0]) {
        var f = el.files[0]; if (f.size > 8 * 1024 * 1024) { status = 'ফাইল ৮ MB-এর বেশি — ব্যর্থ'; return HP.paint(); }
        var fr = new FileReader(); fr.onload = function () { try { var r = parseFile(String(fr.result)), gs = groups(), rows = [], used = {}; var all = gs.concat([]); all.forEach(function (g) { var ks = Object.keys(r.keys).filter(function (k) { return g.keys.indexOf(k) >= 0 || (g.id === 'core' && k === 'clhub_v1') || (g.id === 'room' && k === 'clroom_v1') || (g.id === 'hp' && /^clhp_/.test(k)) || (g.id === 'pro' && /^clpro_/.test(k)) || (REG.some(function (q) { return q.id === g.id && q.keys.indexOf(k) >= 0; })); }).filter(function (k) { return !used[k]; }); ks.forEach(function (k) { used[k] = 1; }); if (ks.length) rows.push({ id: g.id, label: g.label, keys: ks, on: true, fsize: size2(r.keys, ks), lsize: size(ks) }); }); var rest = Object.keys(r.keys).filter(function (k) { return !used[k]; }); if (rest.length) rows.push({ id: 'misc', label: 'অন্যান্য Hub ডেটা', keys: rest, on: true, fsize: size2(r.keys, rest), lsize: size(rest) }); pending = { keys: r.keys, at: r.at, rows: rows }; status = ''; } catch (e) { pending = null; status = 'ফাইল পড়া ব্যর্থ: ' + (e.message || 'ভুল ফরম্যাট'); } HP.paint(); }; fr.onerror = function () { status = 'ফাইল পড়া ব্যর্থ'; HP.paint(); }; fr.readAsText(f);
      }
    }
  });
  function size2(map, ks) { var n = 0; ks.forEach(function (k) { n += (map[k] || '').length; }); return n; }
  H.backupApi = { groups: groups, merge: merge, parseFile: parseFile };
})();
