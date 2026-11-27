/* Golden Snitch v88 — per-question visual diversity and explanation learning aids.
   No external/stock image is copied. Each SVG is generated from the question's
   subject, syllabus topic and question ID. Exact media fingerprints are capped
   at three question uses across all chapter banks in this page session. */
(function (w) {
  'use strict';
  var api = w.CL_QUIZ_ENRICHMENT_V86;
  if (!api || api.__mediaDiversityV88) return;

  var fingerprintUse = Object.create(null), generatedCount = 0, replacedCount = 0;
  function esc(v) {
    return String(v == null ? '' : v).replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  function hash(s) {
    var h = 2166136261, t = String(s || '');
    for (var i = 0; i < t.length; i++) { h ^= t.charCodeAt(i); h = Math.imul(h, 16777619); }
    return (h >>> 0).toString(36);
  }
  function norm(s) { return String(s || '').toLowerCase().replace(/[\s\u09e6-\u09ef]+/g, ' ').trim(); }
  function fingerprint(m) {
    if (!m) return 'empty';
    if (m.url || m.src) {
      var rawUrl = String(m.url || m.src);
      if (String(m.type || '').toLowerCase() === 'video') {
        var videoMatch = rawUrl.match(/[?&]v=([^&#]+)/i) || rawUrl.match(/youtu\.be\/([^?&#/]+)/i) || rawUrl.match(/\/(?:embed|shorts|live)\/([^?&#/]+)/i);
        if (videoMatch && videoMatch[1]) return 'video:' + videoMatch[1];
      }
      return 'url:' + rawUrl.split('?')[0].split('#')[0];
    }
    if (m.html) return 'html:' + hash(String(m.html).replace(/\s+/g, ' ').trim());
    if (m.assetId) return 'asset:' + m.assetId;
    return 'meta:' + hash([m.type, m.kind, m.title, m.alt].join('|'));
  }
  function titleCaseSubject(subject) {
    return subject === 'physics' ? 'পদার্থবিজ্ঞান' : subject === 'chemistry' ? 'রসায়ন' : 'উচ্চতর গণিত';
  }
  function svg(title, desc, body, id) {
    var uid = 'clv88-' + String(id).replace(/[^a-z0-9_-]/gi, '').slice(-18);
    return '<svg viewBox="0 0 640 250" role="img" aria-labelledby="' + uid + '-t ' + uid + '-d" xmlns="http://www.w3.org/2000/svg">' +
      '<title id="' + uid + '-t">' + esc(title) + '</title><desc id="' + uid + '-d">' + esc(desc) + '</desc>' +
      '<defs><linearGradient id="' + uid + '-g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#38bdf8"/><stop offset="1" stop-color="#a78bfa"/></linearGradient><marker id="' + uid + '-a" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0 0L6 3L0 6" fill="#38bdf8"/></marker></defs>' +
      '<rect x="1" y="1" width="638" height="248" rx="18" fill="currentColor" opacity=".025" stroke="currentColor" stroke-opacity=".12"/>' +
      '<text x="28" y="31" fill="currentColor" font-size="16" font-weight="700">' + esc(title.slice(0, 58)) + '</text>' + body +
      '<text x="612" y="230" text-anchor="end" fill="currentColor" opacity=".48" font-size="10">GOLDEN SNITCH · ' + esc(String(id).slice(-8)) + '</text></svg>';
  }
  function diagramFor(q, subject, topic, mode) {
    var id = String(q.questionId || q.id || 'q') + (mode === 'explanation' ? '-explain' : '-question'), seed = parseInt(hash(id), 36) || 17;
    var z = norm(topic + ' ' + q.q + ' ' + (q.formulaExplain || '')), t = String(topic || 'মূল ধারণা');
    var body = '', title = '', desc = '';
    if (subject === 'physics' && /তরঙ্গ|কম্পন|শব্দ|অনুনাদ|wave/.test(z)) {
      var amp = 24 + seed % 24, phase = seed % 7, points = [];
      for (var i = 0; i <= 80; i++) { var x = 34 + i * 7.1, y = 132 - Math.sin((i + phase) / 80 * Math.PI * 4) * amp; points.push((i ? 'L' : 'M') + x.toFixed(1) + ' ' + y.toFixed(1)); }
      title = 'তরঙ্গের গঠন · ' + t; desc = 'ধারণাগত তরঙ্গরেখা; প্রশ্নে নির্দিষ্ট উপাত্ত থাকলে সেটিই ব্যবহার করতে হবে.';
      body = '<path d="M30 132H610" stroke="currentColor" opacity=".25"/><path d="' + points.join(' ') + '" fill="none" stroke="url(#clv88-' + id.replace(/[^a-z0-9_-]/gi, '').slice(-18) + '-g)" stroke-width="4" stroke-linecap="round"/><path d="M' + (100 + phase * 5) + ' 75V188" stroke="#f59e0b" stroke-dasharray="4 5"/><text x="34" y="210" fill="currentColor" font-size="12">বিস্তার ও পর্যাবৃত্ত পরিবর্তনের ধারণা</text>';
    } else if (subject === 'physics' && /ভেক্টর|বল|সরণ|বেগ|ত্বরণ|টর্ক|ক্ষেত্র/.test(z)) {
      var x2 = 260 + seed % 120, y2 = 72 + seed % 65;
      title = 'ভেক্টর ও দিক · ' + t; desc = 'উপাংশ ও লব্ধির ধারণাগত স্কেচ; স্কেল অনুযায়ী নয়.';
      body = '<path d="M110 190H565M160 215V58" stroke="currentColor" opacity=".3"/><path d="M160 190L' + x2 + ' ' + y2 + '" stroke="#38bdf8" stroke-width="5" marker-end="url(#clv88-' + id.replace(/[^a-z0-9_-]/gi, '').slice(-18) + '-a)"/><path d="M160 190H' + x2 + 'V' + y2 + '" fill="none" stroke="#f59e0b" stroke-width="3" stroke-dasharray="6 5"/><text x="' + (x2 + 10) + '" y="' + (y2 - 8) + '" fill="currentColor" font-size="14">লব্ধি</text><text x="175" y="211" fill="currentColor" font-size="12">উপাংশ</text>';
    } else if (subject === 'physics' && /তড়িৎ|বিদ্যুৎ|বর্তনী|চৌম্বক|আবেশ|রোধ|ধারক/.test(z)) {
      var r = 32 + seed % 22;
      title = 'বর্তনী ও শক্তি প্রবাহ · ' + t; desc = 'উপাদানগুলোর পারস্পরিক সংযোগের ধারণাগত চিত্র.';
      body = '<path d="M120 90H500V180H120Z" fill="none" stroke="#38bdf8" stroke-width="4"/><rect x="270" y="70" width="80" height="40" rx="8" fill="#38bdf8" fill-opacity=".16" stroke="#38bdf8" stroke-width="2"/><path d="M310 110V180" stroke="#38bdf8" stroke-width="3"/><path d="M500 130h35" stroke="#f59e0b" stroke-width="4"/><circle cx="' + (180 + seed % 260) + '" cy="90" r="' + r + '" fill="#a78bfa" fill-opacity=".15" stroke="#a78bfa" stroke-width="2"/><text x="310" y="95" text-anchor="middle" fill="currentColor" font-size="13">উৎস</text><text x="' + (180 + seed % 260) + '" y="95" text-anchor="middle" fill="currentColor" font-size="12">উপাদান</text><text x="520" y="205" fill="currentColor" font-size="12">প্রবাহের পথ</text>';
    } else if (subject === 'chemistry' && /বন্ধন|অণু|মৌল|পরমাণু|ইলেকট্রন|molecule|bond/.test(z)) {
      var cx = 280 + seed % 55, cy = 125 + seed % 25;
      title = 'কণা ও বন্ধন · ' + t; desc = 'অণুর কণাগুলোর সংযোগ বোঝানোর সরল মডেল; প্রকৃত জ্যামিতি নয়.';
      body = '<path d="M' + cx + ' ' + cy + 'L170 82M' + cx + ' ' + cy + 'L470 78M' + cx + ' ' + cy + 'L' + (180 + seed % 60) + ' 190M' + cx + ' ' + cy + 'L' + (450 - seed % 45) + ' 190" stroke="#38bdf8" stroke-width="5"/><circle cx="' + cx + '" cy="' + cy + '" r="36" fill="#a78bfa" fill-opacity=".24" stroke="#a78bfa" stroke-width="3"/><circle cx="170" cy="82" r="25" fill="#38bdf8" fill-opacity=".2" stroke="#38bdf8" stroke-width="2"/><circle cx="470" cy="78" r="25" fill="#22c55e" fill-opacity=".2" stroke="#22c55e" stroke-width="2"/><circle cx="' + (180 + seed % 60) + '" cy="190" r="22" fill="#f59e0b" fill-opacity=".2" stroke="#f59e0b" stroke-width="2"/><circle cx="' + (450 - seed % 45) + '" cy="190" r="22" fill="#38bdf8" fill-opacity=".2" stroke="#38bdf8" stroke-width="2"/><text x="' + cx + '" y="' + (cy + 5) + '" text-anchor="middle" fill="currentColor" font-size="12">কেন্দ্র</text><text x="28" y="225" fill="currentColor" font-size="11">সংযোগের স্কেচ — বন্ধনের ধরন প্রশ্নের তথ্য অনুযায়ী নির্ধারণ করো</text>';
    } else if (subject === 'chemistry' && /বিক্রিয়া|সাম্য|তাপ|গতিবিদ্যা|প্রতিক্রিয়া|reaction/.test(z)) {
      var peak = 68 + seed % 28;
      title = 'বিক্রিয়ার শক্তি-প্রোফাইল · ' + t; desc = 'প্রতিক্রিয়ার শক্তি পরিবর্তনের ধারণাগত প্রোফাইল; পরিমাণগত স্কেল নয়.';
      body = '<path d="M70 194H590M70 194V55" stroke="currentColor" opacity=".35"/><path d="M90 160C160 160 170 ' + peak + ' 300 ' + peak + 'S440 170 560 170" fill="none" stroke="#38bdf8" stroke-width="4"/><path d="M300 ' + peak + 'V160" stroke="#f59e0b" stroke-width="2" stroke-dasharray="5 5"/><text x="95" y="150" fill="currentColor" font-size="13">বিক্রিয়ক</text><text x="510" y="160" fill="currentColor" font-size="13">উৎপাদ</text><text x="312" y="' + (peak - 9) + '" fill="currentColor" font-size="12">সক্রিয়ণ বাধা</text><text x="590" y="214" text-anchor="end" fill="currentColor" font-size="11">প্রতিক্রিয়ার অগ্রগতি →</text>';
    } else if (subject === 'chemistry') {
      title = 'দ্রবণ ও কণার বিন্যাস · ' + t; desc = 'দ্রবণের কণাবিন্যাসের সরল ধারণাগত মডেল; কণার সংখ্যা বাস্তব ঘনমাত্রা নয়.';
      var dots = ''; for (var j = 0; j < 22; j++) { var px = 115 + ((j * 47 + seed) % 390), py = 82 + ((j * 31 + seed * 3) % 105); dots += '<circle cx="' + px + '" cy="' + py + '" r="' + (4 + (j + seed) % 5) + '" fill="' + (j % 3 ? '#38bdf8' : '#f59e0b') + '" opacity=".8"/>'; }
      body = '<rect x="90" y="58" width="460" height="150" rx="14" fill="#38bdf8" fill-opacity=".04" stroke="#38bdf8" stroke-width="2"/>' + dots + '<text x="320" y="228" text-anchor="middle" fill="currentColor" font-size="11">কণার মডেল — বাস্তব কণার আকার/সংখ্যার স্কেল নয়</text>';
    } else if (subject === 'math' && /ম্যাট্রিক্স|নির্ণায়ক|matrix/.test(z)) {
      title = 'ম্যাট্রিক্সের বিন্যাস · ' + t; desc = 'সারি ও স্তম্ভের বিন্যাস বোঝানোর স্কেচ.';
      var cells = '', rows = 2 + seed % 3, cols = 2 + (seed >> 3) % 3;
      for (var rr = 0; rr < rows; rr++) for (var cc = 0; cc < cols; cc++) cells += '<rect x="' + (215 + cc * 48) + '" y="' + (76 + rr * 42) + '" width="38" height="32" rx="5" fill="' + ((rr + cc + seed) % 2 ? '#38bdf8' : '#a78bfa') + '" fill-opacity=".18" stroke="currentColor" stroke-opacity=".4"/><text x="' + (234 + cc * 48) + '" y="' + (97 + rr * 42) + '" text-anchor="middle" fill="currentColor" font-size="11">a' + (rr + 1) + (cc + 1) + '</text>';
      body = '<path d="M198 65h-10v130h10M' + (235 + cols * 48) + ' 65h10v130h-10" fill="none" stroke="#f59e0b" stroke-width="3"/>' + cells + '<text x="320" y="220" text-anchor="middle" fill="currentColor" font-size="12">সারি × স্তম্ভ</text>';
    } else if (subject === 'math' && /সম্ভাবনা|বিন্যাস|সমাবেশ|probability/.test(z)) {
      title = 'সম্ভাব্য ফলের শাখা · ' + t; desc = 'সম্ভাব্য ফলগুলোকে শাখায় ভাগ করার ধারণাগত tree diagram.';
      var branch = seed % 2 ? 'A' : 'B';
      body = '<g fill="none" stroke="#38bdf8" stroke-width="3"><path d="M100 130L280 78M100 130L280 184M280 78L500 55M280 78L500 105M280 184L500 160M280 184L500 210"/></g><g fill="#a78bfa" fill-opacity=".22" stroke="#a78bfa" stroke-width="2"><circle cx="100" cy="130" r="20"/><circle cx="280" cy="78" r="18"/><circle cx="280" cy="184" r="18"/><circle cx="500" cy="55" r="15"/><circle cx="500" cy="105" r="15"/><circle cx="500" cy="160" r="15"/><circle cx="500" cy="210" r="15"/></g><g fill="currentColor" font-size="12"><text x="100" y="135" text-anchor="middle">শুরু</text><text x="280" y="83" text-anchor="middle">' + branch + '</text><text x="280" y="189" text-anchor="middle">অন্য</text><text x="500" y="59" text-anchor="middle">১</text><text x="500" y="109" text-anchor="middle">২</text><text x="500" y="164" text-anchor="middle">৩</text><text x="500" y="214" text-anchor="middle">৪</text></g>';
    } else if (subject === 'math' && /অন্তরীকরণ|যোগজীকরণ|ডেরিভেটিভ|ইন্টিগ্রাল|calculus/.test(z)) {
      title = 'স্পর্শক ও ক্ষেত্রফলের ধারণা · ' + t; desc = 'ক্যালকুলাসের জ্যামিতিক ব্যাখ্যার একটি ধারণাগত স্কেচ.';
      var slope = 0.5 + (seed % 8) / 10;
      body = '<path d="M70 190H590M90 210V55" stroke="currentColor" opacity=".3"/><path d="M100 180Q220 35 340 110T560 75" fill="none" stroke="#38bdf8" stroke-width="4"/><path d="M260 103L420 ' + (103 - 160 * slope * .28) + '" stroke="#f59e0b" stroke-width="3"/><circle cx="260" cy="103" r="6" fill="#f59e0b"/><path d="M260 103V190H420V' + (103 - 160 * slope * .28) + 'Z" fill="#a78bfa" fill-opacity=".12" stroke="#a78bfa" stroke-dasharray="5 5"/><text x="590" y="215" text-anchor="end" fill="currentColor" font-size="11">x</text>';
    } else {
      title = titleCaseSubject(subject) + ' · ' + t; desc = 'প্রশ্নের ধারণা, শর্ত এবং সিদ্ধান্তকে আলাদা করে দেখানো শেখার মানচিত্র.';
      var labels = ['ধারণা', 'শর্ত', 'বিশ্লেষণ', 'সিদ্ধান্ত'];
      body = '<g stroke="#38bdf8" stroke-width="3" fill="none"><path d="M105 126H535" marker-end="url(#clv88-' + id.replace(/[^a-z0-9_-]/gi, '').slice(-18) + '-a)"/></g>' + labels.map(function (lab, i) { var x = 105 + i * 143; return '<rect x="' + (x - 46) + '" y="91" width="92" height="68" rx="12" fill="' + (i % 2 ? '#a78bfa' : '#38bdf8') + '" fill-opacity=".13" stroke="currentColor" stroke-opacity=".35"/><text x="' + x + '" y="130" text-anchor="middle" fill="currentColor" font-size="13">' + lab + '</text>'; }).join('');
    }
    generatedCount++;
    return { type: 'diagram', kind: 'inline-svg', title: title, alt: desc, caption: desc + ' · এটি ধারণাগত সহায়ক, প্রশ্নে দেওয়া সংখ্যাগত উপাত্তের বিকল্প নয়।', html: svg(title, desc, body, id), questionSupport: false, generatedForQuestion: id, visualSource: 'Golden Snitch generated SVG' };
  }
  function keepOrReplace(items, q, subject, topic, explanationMode) {
    var kept = [], seenThisQuestion = Object.create(null),
      list = Array.isArray(items) ? items : [],
      questionKeys = Object.create(null);
    if (explanationMode && Array.isArray(q.media)) q.media.forEach(function (m) { questionKeys[fingerprint(m)] = true; });
    list.forEach(function (m) {
      if (!m || kept.length >= 2) return;
      var key = fingerprint(m);
      if (seenThisQuestion[key] || (explanationMode && questionKeys[key])) return;
      seenThisQuestion[key] = true;
      var used = fingerprintUse[key] || 0;
      if (used < 3) { fingerprintUse[key] = used + 1; kept.push(m); }
      else { replacedCount++; }
    });
    /* Every explanation receives its own question-specific learning aid.  Authored
       explanation media are retained only when they differ from the question visual. */
    if (!kept.length && !explanationMode) {
      var generatedQuestion = diagramFor(q, subject, topic, 'question');
      var questionKey = fingerprint(generatedQuestion);
      fingerprintUse[questionKey] = (fingerprintUse[questionKey] || 0) + 1;
      kept.push(generatedQuestion);
    }
    if (explanationMode) {
      var generated = diagramFor(q, subject, topic, 'explanation');
      var gkey = fingerprint(generated);
      fingerprintUse[gkey] = (fingerprintUse[gkey] || 0) + 1;
      kept.push(generated);
    }
    return kept;
  }
  var originalEnrich = api.enrichBank;
  api.enrichBank = function (chapter, bank, source) {
    var rows = originalEnrich(chapter, bank, source) || [];
    var chapterId = String(chapter && chapter.id || ''), subject = chapter.subjectKey || (chapterId.indexOf('phy') === 0 ? 'physics' : chapterId.indexOf('chem') === 0 ? 'chemistry' : 'math');
    rows.forEach(function (q) {
      if (!q || !q.q) return;
      var topic = q.subtopic || q.syllabusTopic || q.topic || 'মূল ধারণা';
      q.media = keepOrReplace(q.media, q, subject, topic, false);
      q.explanation = q.explanation && typeof q.explanation === 'object' ? q.explanation : {};
      var expMedia = Array.isArray(q.explanation.media) ? q.explanation.media : [];
      q.explanation.media = keepOrReplace(expMedia, q, subject, topic, true);
      q.mediaDiversity = { version: 89, questionVisualCount: q.media.length, explanationVisualCount: q.explanation.media.length, uniqueQuestionAsset: q.media.every(function (m) { return m.generatedForQuestion === q.questionId || fingerprintUse[fingerprint(m)] <= 3; }) };
    });
    return rows;
  };
  var originalRender = api.renderMedia;
  function youtubeId(url) {
    try {
      var u = new URL(url), host = u.hostname.toLowerCase();
      if (host === 'youtu.be') return u.pathname.split('/').filter(Boolean)[0] || '';
      if (host === 'youtube.com' || host === 'www.youtube.com' || host === 'm.youtube.com' || host === 'youtube-nocookie.com' || host === 'www.youtube-nocookie.com') {
        if (u.pathname === '/watch') return u.searchParams.get('v') || '';
        var match = u.pathname.match(/\/(?:embed|shorts|live)\/([A-Za-z0-9_-]{6,20})/);
        return match ? match[1] : '';
      }
    } catch (e) {}
    return '';
  }
  api.renderMedia = function (q, surface) {
    var support = surface === 'explanation' ? 'explanationSupport' : 'questionSupport';
    var items = q && Array.isArray(q.media) ? q.media.filter(function (m) {
      return !!(m && m.verified === true && m[support] === true && ['image', 'diagram'].indexOf(String(m.type || '').toLowerCase()) >= 0);
    }) : [];
    if (!items.length) return '';
    var rendered = items.map(function (m) {
      var caption = esc(m.caption || m.title || m.alt || '');
      if (!m.html) return '';
      return '<figure class="cq-media-item"><div class="cq-media-visual">' + m.html + '</div><figcaption>' + caption + '</figcaption></figure>';
    }).filter(Boolean).join('');
    return rendered ? '<div class="cq-question-media cq-question-media-v88">' + rendered + '</div>' : '';
  };
  api.mediaDiversityV88 = { version: 89, maxReusePerQuestionBank: 3, stats: function () { return { uniqueFingerprintCount: Object.keys(fingerprintUse).length, generatedVisualCount: generatedCount, replacedRepeatedAssetCount: replacedCount }; } };
  api.__mediaDiversityV88 = true;
})(window);
