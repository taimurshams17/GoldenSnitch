/* Golden Snitch v100 — explanation-first visuals and editorial quality pass.
 * A useful explanation visual is generated independently of question media.
 * Broad automatic v94/v86 sketches are removed from question panels unless they
 * have explicit authored/curated provenance. All generated assets remain unverified.
 */
(function (w) {
  'use strict';
  var api = { version: 100 };
  function esc(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (c) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' })[c];
    });
  }
  function clean(value) { return String(value || '').replace(/\s+/g, ' ').trim(); }
  function short(value, limit) {
    var s = clean(value);
    return s.length > limit ? s.slice(0, Math.max(1, limit - 1)) + '…' : s;
  }
  function lines(value, maxChars, maxLines) {
    var words = clean(value).split(' '), out = [], line = '';
    words.forEach(function (word) {
      var candidate = line ? line + ' ' + word : word;
      if (candidate.length > maxChars && line) { out.push(line); line = word; }
      else line = candidate;
    });
    if (line) out.push(line);
    if (!out.length) out.push('ধারণাটি ব্যাখ্যার সঙ্গে মিলিয়ে দেখো');
    if (out.length > maxLines) {
      out = out.slice(0, maxLines);
      out[maxLines - 1] = short(out[maxLines - 1], maxChars - 1) + '…';
    }
    return out;
  }
  function textLines(value, x, y, width, maxChars, color) {
    return '<text x="' + x + '" y="' + y + '" text-anchor="middle" font-size="17" fill="' + color + '">' +
      lines(value, maxChars, 3).map(function (line, i) {
        return '<tspan x="' + x + '" dy="' + (i ? 24 : 0) + '">' + esc(line) + '</tspan>';
      }).join('') + '</text>';
  }
  function explanationMap(q, chapter) {
    var ex = q.explanation || {}, topic = short(q.subtopic || q.syllabusTopic || q.topic || chapter || 'মূল ধারণা', 52);
    var core = ex.core || q.e || q.q || 'প্রশ্নের মূল ধারণা';
    var analysis = ex.analysis || (Array.isArray(ex.steps) ? ex.steps.join(' ') : '') || 'প্রদত্ত শর্তের সঙ্গে মূল নীতিটি মিলিয়ে দেখো।';
    var result = ex.formula || (Array.isArray(ex.steps) ? ex.steps[ex.steps.length - 1] : '') || ex.simple || 'শর্ত, একক ও ফল যাচাই করো।';
    var id = String(q.questionId || q.id || 'question').replace(/[^a-zA-Z0-9_-]/g, '-');
    var titleId = 'v100-concept-title-' + id, descId = 'v100-concept-desc-' + id;
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 330" role="img" aria-labelledby="' + titleId + ' ' + descId + '">' +
      '<title id="' + titleId + '">ব্যাখ্যার মূল ধারণা ও প্রয়োগ</title>' +
      '<desc id="' + descId + '">' + esc(topic + '। ' + short(core, 130) + '। ' + short(analysis, 130) + '। ' + short(result, 100)) + '</desc>' +
      '<rect x="2" y="2" width="716" height="326" rx="20" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>' +
      '<text x="360" y="34" text-anchor="middle" font-size="20" font-weight="700" fill="#0f172a">' + esc(topic) + ' · ধারণার সংযোগ</text>' +
      '<rect x="22" y="66" width="202" height="205" rx="15" fill="#dbeafe" stroke="#2563eb" stroke-width="2"/>' +
      '<rect x="259" y="66" width="202" height="205" rx="15" fill="#ede9fe" stroke="#7c3aed" stroke-width="2"/>' +
      '<rect x="496" y="66" width="202" height="205" rx="15" fill="#dcfce7" stroke="#15803d" stroke-width="2"/>' +
      '<path d="M226 167H254m-9-8 9 8-9 8M463 167H491m-9-8 9 8-9 8" stroke="#475569" stroke-width="3" fill="none"/>' +
      '<text x="123" y="96" text-anchor="middle" font-size="17" font-weight="700" fill="#1e3a8a">১ · মূল নীতি</text>' +
      '<text x="360" y="96" text-anchor="middle" font-size="17" font-weight="700" fill="#5b21b6">২ · কারণ ও প্রয়োগ</text>' +
      '<text x="597" y="96" text-anchor="middle" font-size="17" font-weight="700" fill="#166534">৩ · ফল ও যাচাই</text>' +
      textLines(core, 123, 133, 164, 22, '#172554') +
      textLines(analysis, 360, 133, 164, 22, '#3b0764') +
      textLines(result, 597, 133, 164, 22, '#14532d') +
      '<text x="360" y="302" text-anchor="middle" font-size="13" fill="#475569">ব্যাখ্যার পাঠ্য, সূত্র ও ধাপের সারাংশ · চিত্রটি পরিমাপের স্কেল নয়</text></svg>';
    return {
      id: 'v100-explanation-map-' + id, type: 'diagram', kind: 'cl-v100-explanation-concept-map',
      title: topic + ' — ব্যাখ্যার ধারণা-মানচিত্র',
      alt: topic + ' বিষয়ে মূল নীতি, কারণ/প্রয়োগ এবং ফল/যাচাইয়ের সম্পর্ক দেখানো ব্যাখ্যাচিত্র।',
      caption: 'প্রশ্নে ছবি থাকুক বা না থাকুক, এই মানচিত্রটি ব্যাখ্যার মূল ধারণা ও যুক্তির ধাপ দৃশ্যমান করে।',
      html: svg, questionSupport: false, explanationSupport: true, verified: false,
      rightsStatus: 'original-Golden Snitch-v100-explanation-map', visualSource: 'original-Golden Snitch-v100-explanation-concept-map',
      reviewStatus: 'pending-subject-specialist', reviewNote: 'Concept map uses the question explanation text; validate scientific relationships and Bengali line wrapping before specialist approval.'
    };
  }
  function curated(m, surface) {
    if (!m) return false;
    if (m.verified === true) return true;
    var kind = String(m.kind || ''), rights = String(m.rightsStatus || ''), source = String(m.visualSource || '');
    if (kind.indexOf('cl-v93-' + surface + '-') === 0) return true;
    if (/^cl-v92-/.test(kind)) return true;
    if (/^original-Golden Snitch-v(97|98|99)/.test(rights)) return true;
    if (/original-Golden Snitch-v(97|98|99)/.test(source)) return true;
    return false;
  }
  function upgradeBlueprint(q) {
    if (!q || !q.expansionMetadata || q.expansionMetadata.generatedFromEditorialBlueprint !== true) return q;
    var ex = q.explanation || {}, opts = Array.isArray(q.o) ? q.o : [], answer = opts[Number(q.a)] || 'সঠিক বিকল্প';
    var wrong = opts.filter(function (x, i) { return i !== Number(q.a); });
    var topic = q.syllabusTopic || q.subtopic || q.topic || 'এই উপবিষয়';
    var principle = ex.core || 'বিষয়টির মূল নীতি';
    var condition = ex.misconception || ex.simple || 'প্রযোজ্য শর্ত ও অনুমান যাচাই করতে হবে।';
    var analysis = 'প্রথমে “' + topic + '”–এর মূল নীতি শনাক্ত করতে হবে। নির্বাচিত বক্তব্যটি এই নীতির সঙ্গে মেলে, কারণ: ' + answer + '। এরপর প্রশ্নে উল্লেখিত শর্ত, রাশির অর্থ এবং প্রয়োগের সীমা মিলিয়ে সিদ্ধান্ত যাচাই করতে হবে। ' + (ex.realWorld || 'এই ধারণা বাস্তব পরিস্থিতি বা পরীক্ষণ বিশ্লেষণে প্রয়োগ করা যায়।');
    var steps = [
      'প্রশ্নটি “' + topic + '”–এর কোন দিক যাচাই করছে—সংজ্ঞা, শর্ত, প্রমাণ, প্রয়োগ নাকি সীমাবদ্ধতা—তা শনাক্ত করো।',
      'মূল নীতি: ' + principle,
      'সঠিক বিকল্পের বক্তব্যকে প্রয়োজনীয় শর্তের সঙ্গে মিলিয়ে দেখো: ' + answer,
      'অন্য বিকল্পগুলোতে কোন শর্ত বাদ পড়েছে বা কোন সম্পর্কটি গুলিয়ে গেছে তা চিহ্নিত করো; শেষে সূত্র, একক, sign বা যুক্তির সামঞ্জস্য যাচাই করো।'
    ];
    var oa = opts.map(function (opt, i) {
      if (i === Number(q.a)) return { option: i, correct: true, explanation: 'সঠিক। “' + topic + '”–এর মূল নীতি ও প্রশ্নে দেওয়া শর্তের সঙ্গে এই বক্তব্যটি সামঞ্জস্যপূর্ণ: ' + answer };
      return { option: i, correct: false, explanation: 'এটি একটি সম্পর্কিত ধারণা বা সম্ভাব্য ভুল প্রয়োগ: “' + short(opt, 125) + '”। কিন্তু প্রশ্নে চাওয়া সিদ্ধান্তের ক্ষেত্রে এটি মূল নীতি/শর্তকে সম্পূর্ণভাবে ব্যাখ্যা করে না; তাই সঠিক উত্তর নয়।' };
    });
    q.explanation = Object.assign({}, ex, {
      core: principle, analysis: analysis, simple: 'মূল নীতি → প্রযোজ্য শর্ত → বিকল্প যাচাই → সিদ্ধান্ত।',
      misconception: 'যে ভুলটি এড়াতে হবে: কাছাকাছি ধারণা, শর্ত বা সীমাবদ্ধতা এক করে ফেলা। ' + condition,
      realWorld: ex.realWorld || '', steps: steps, optionAnalysis: oa,
      references: [], referenceStatus: 'reference-verification-pending; no unverified external source is claimed',
      media: Array.isArray(ex.media) ? ex.media.slice() : []
    });
    q.e = principle + ' ' + analysis;
    q.contentOrigin = 'syllabus-mapped-editorial-draft-v100';
    q.qualityStatus = 'draft-unreviewed'; q.qualityApproved = false; q.editorialReviewed = false;
    q.editorialApproved = false; q.mediaVerified = false; q.learnerVisible = true;
    q.blueprintDraft = true;
    return q;
  }
  function inferConcept(q, topic, core) {
    var stem = clean(q.q || q.questionText || q.question || ''), blob = stem + ' ' + topic + ' ' + core;
    var formula = '', extra = '';
    if (/E\s*=\s*hf|ফোটন|প্ল্যাঙ্ক/i.test(blob)) {
      formula = 'E = hf = hc/λ';
      extra = 'ফোটনের শক্তি কম্পাঙ্ক f-এর সমানুপাতিক এবং তরঙ্গদৈর্ঘ্য λ-এর ব্যস্তানুপাতিক। এখানে h হলো প্ল্যাঙ্ক ধ্রুবক, c আলোর বেগ; তাই একই মাধ্যমে/শূন্যস্থানে কম তরঙ্গদৈর্ঘ্যের ফোটনের শক্তি বেশি।';
    } else if (/বেগ.?সময়|বেগ-সময়|velocity.?time|v.?t.?graph|ঢাল.*ত্বরণ/i.test(blob)) {
      formula = 'a = Δv/Δt = বেগ–সময় গ্রাফের ঢাল';
      extra = 'বেগ–সময় গ্রাফের ঢাল বেগ কত দ্রুত বদলাচ্ছে তা জানায়, তাই সেটি ত্বরণ। গ্রাফের নিচের signed area সরণ নির্দেশ করে; ঢাল ও ক্ষেত্রফলকে এক অর্থে ব্যবহার করা যাবে না।';
    } else if (/মোল|অ্যাভোগাড্রো|কণার সংখ্যা|molar mass/i.test(blob)) {
      formula = 'n = m/M;  N = nNₐ';
      extra = 'প্রথমে নমুনার ভর m-কে মোলার ভর M দিয়ে ভাগ করে মোল n নির্ণয় করা হয়। এরপর কণার সংখ্যা N পেতে n-কে অ্যাভোগাড্রো ধ্রুবক Nₐ দিয়ে গুণ করা হয়; একক ও কোন ধরনের কণা (পরমাণু, অণু বা আয়ন) গণনা হচ্ছে তা স্পষ্ট রাখতে হবে।';
    } else if (/সমীকরণ.*সাম্য|সমতাকরণ|balanced equation|H₂\s*\+\s*O₂/i.test(blob)) {
      formula = 'বিক্রিয়ার উভয় পাশে প্রতিটি মৌলের পরমাণু সংখ্যা সমান';
      extra = 'রাসায়নিক সমীকরণ সাম্য করার সময় সংকেতের নিচের সংখ্যা (subscript) বদলানো যায় না; কেবল পদার্থের আগে সহগ বসানো হয়। এতে বিক্রিয়ার উভয় পাশে প্রতিটি মৌলের পরমাণু সংখ্যা সমান থাকে এবং ভর সংরক্ষণের নীতি বজায় থাকে।';
    } else if (/অম্ল.?বৃষ্টি|এসিড বৃষ্টি|acid rain|SO₂|NOₓ/i.test(blob)) {
      formula = 'SO₂ / NOₓ → বায়ুমণ্ডলে অক্সিডেশন ও জলীয় বাষ্পের সঙ্গে বিক্রিয়া → অম্লীয় উপাদান';
      extra = 'সালফার ডাই-অক্সাইড ও নাইট্রোজেন অক্সাইড বায়ুমণ্ডলে রূপান্তরিত হয়ে জলীয় বাষ্পের সঙ্গে মিশে অম্লীয় উপাদান তৈরি করতে পারে। তাই উৎস নির্ণয়ে নির্গমন, বায়ুমণ্ডলীয় রূপান্তর ও বৃষ্টির রাসায়নিক বৈশিষ্ট্য—তিনটি ধাপ আলাদা করে দেখা দরকার।';
    } else if (/ভেক্টর|উপাংশ|লব্ধি|dot product|cross product/i.test(blob)) {
      formula = 'Aₓ = A cosθ; Aᵧ = A sinθ (θ ধনাত্মক x-অক্ষ থেকে মাপলে)';
      extra = 'ভেক্টরের মানের পাশাপাশি দিকও গুরুত্বপূর্ণ। নির্দিষ্ট অক্ষের তুলনায় কোণ মেপে উপাংশ বের হয়; অক্ষের দিক ও চিহ্ন আগে স্থির না করলে যোগ, বিয়োগ বা লব্ধির দিক ভুল হতে পারে।';
    } else if (/domain|range|ডোমেইন|রেঞ্জ|ফাংশন/i.test(blob)) {
      formula = 'Domain: অনুমোদিত input; Range: সংশ্লিষ্ট output-এর সমষ্টি';
      extra = 'ফাংশনের domain নির্ধারণে হর শূন্য হওয়া, বর্গমূলের ভেতর ঋণাত্মক হওয়া বা logarithm-এর argument শূন্য/ঋণাত্মক হওয়ার মতো নিষেধ পরীক্ষা করতে হয়। Range পেতে সেই অনুমোদিত input থেকে কী output সম্ভব তা নির্ণয় করতে হয়।';
    } else if (/সমাকলন|অন্তরকলন|derivative|differentiation|integration/i.test(blob)) {
      formula = 'অন্তরকলন: পরিবর্তনের হার; সমাকলন: সঞ্চিত পরিবর্তন/ক্ষেত্রফল (শর্তসাপেক্ষে)';
      extra = 'অন্তরকলন কোনো রাশির অন্য রাশির সাপেক্ষে তাৎক্ষণিক পরিবর্তনের হার প্রকাশ করে। নির্দিষ্ট সমাকলন একটি interval-এ signed accumulation দেয়; জ্যামিতিক ক্ষেত্রফল পেতে প্রয়োজন হলে অক্ষের নিচের অংশের চিহ্নও বিবেচনা করতে হয়।';
    }
    return { formula: formula, detail: extra };
  }
  function upgradeThinExplanation(q, chapter) {
    if (!q || (q.expansionMetadata && q.expansionMetadata.generatedFromEditorialBlueprint === true)) return q;
    var ex = q.explanation && typeof q.explanation === 'object' ? Object.assign({}, q.explanation) : {};
    var opts = Array.isArray(q.o) ? q.o : [], answerIndex = Number(q.a), valid = Number.isInteger(answerIndex) && answerIndex >= 0 && answerIndex < opts.length;
    var correct = valid ? clean(opts[answerIndex]) : '', topic = clean(q.syllabusTopic || q.subtopic || q.topic || chapter || 'মূল ধারণা');
    var stem = clean(q.q || q.questionText || q.question || ''), originalCore = clean(ex.core || q.e || q.explanationCore || '');
    var subject = String((q.meta && q.meta.subjectKey) || q.subjectKey || '').toLowerCase();
    if (!subject) subject = /রসায়ন|রসায়ন|chem/i.test(String(q.subject || '')) ? 'chemistry' : /গণিত|math/i.test(String(q.subject || '')) ? 'math' : 'physics';
    var inferred = inferConcept(q, topic, originalCore);
    var baseCore = originalCore || (correct ? 'প্রশ্নের সঠিক নির্বাচিত বক্তব্য হলো: ' + correct : 'প্রশ্নে দেওয়া শর্ত ও ধারণার সম্পর্ক বিশ্লেষণ করতে হবে।');
    if (inferred.detail && (baseCore.length < 90 || /প্ল্যাঙ্ক সম্পর্ক|সূত্র|ধারণা/i.test(baseCore))) baseCore += ' ' + inferred.detail;
    else if (baseCore.length < 70) {
      if (subject === 'chemistry') baseCore += ' রাসায়নিক ব্যাখ্যায় সংশ্লিষ্ট প্রজাতি, তাদের অবস্থা/পরিমাণ, বিক্রিয়ার শর্ত এবং পর্যবেক্ষণ একসঙ্গে বিবেচনা করতে হয়।';
      else if (subject === 'math' || /উচ্চতর গণিত/i.test(String(q.subject || ''))) baseCore += ' গাণিতিকভাবে সংজ্ঞা, চলকের শর্ত, domain এবং প্রতিটি ধাপের যৌক্তিক বৈধতা বজায় রাখতে হয়।';
      else baseCore += ' পদার্থবিজ্ঞানে রাশির অর্থ, একক, দিক, reference condition এবং ব্যবহৃত মডেলের অনুমান মিলিয়ে সিদ্ধান্ত যাচাই করতে হয়।';
    }
    var oldAnalysis = clean(ex.analysis || q.analysis || '');
    var analysis = oldAnalysis;
    if (analysis.length < 125) {
      analysis = 'প্রশ্নটি “' + topic + '” বিষয়ে এই বিষয়টি যাচাই করছে: ' + (stem || 'প্রদত্ত তথ্য থেকে সঠিক ধারণা নির্বাচন') + '। ' + baseCore + (correct ? ' প্রদত্ত বিকল্পগুলোর মধ্যে “' + correct + '”–ই প্রশ্নে চাওয়া শর্ত/ধারণার সঙ্গে সামঞ্জস্যপূর্ণ।' : ' প্রদত্ত তথ্য থেকে সংজ্ঞা ও শর্ত মিলিয়ে সিদ্ধান্ত নিতে হবে।');
      if (inferred.detail && analysis.indexOf(inferred.detail) < 0) analysis += ' ' + inferred.detail;
      analysis += ' অন্য বিকল্প যাচাইয়ের সময় দেখো সেগুলো প্রশ্নের নির্দিষ্ট শর্ত পূরণ করে কি না; কাছাকাছি শব্দ বা পরিচিত সূত্র দেখেই উত্তর নির্বাচন করো না।';
    }
    var formula = clean(ex.formula || ex.equation || q.formula || inferred.formula || '');
    var steps = Array.isArray(ex.steps) ? ex.steps.filter(Boolean).map(clean) : [];
    if (steps.length < 2) {
      steps = [
        'প্রশ্নে দেওয়া তথ্য ও ঠিক কী নির্ণয়/ব্যাখ্যা করতে বলা হয়েছে তা আলাদা করে চিহ্নিত করো।',
        '“' + topic + '”–এর মূল ধারণা: ' + baseCore,
        (formula ? 'প্রাসঙ্গিক সম্পর্ক/সূত্র: ' + formula + '।' : 'বিকল্পের বক্তব্যকে সংশ্লিষ্ট সংজ্ঞা, শর্ত ও প্রমাণের সঙ্গে তুলনা করো।') + (correct ? ' সঠিক বক্তব্য: ' + correct : ''),
        'শেষে ব্যবহৃত একক, চিহ্ন, শর্ত, domain বা রাসায়নিক সমতা—প্রশ্নের ক্ষেত্রে যা প্রযোজ্য—পুনরায় যাচাই করো।'
      ];
    }
    var misconception = clean(ex.misconception || q.misconception || '');
    if (misconception.length < 45) {
      misconception = subject === 'chemistry'
        ? 'সম্ভাব্য ভুল: কেবল পদার্থের নাম/রঙ দেখে সিদ্ধান্ত নেওয়া, বিক্রিয়ার শর্ত বা সমীকরণে atom/charge balance ভুলে যাওয়া। পর্যবেক্ষণ, প্রজাতি ও শর্ত একসঙ্গে যাচাই করো।'
        : subject === 'math' || /উচ্চতর গণিত/i.test(String(q.subject || ''))
          ? 'সম্ভাব্য ভুল: সংজ্ঞা, domain, শর্ত বা theorem-এর hypothesis যাচাই না করে পরিচিত সূত্র প্রয়োগ করা। প্রতিটি ধাপে অনুমোদিত মান বজায় আছে কি না পরীক্ষা করো।'
          : 'সম্ভাব্য ভুল: রাশির মান, দিক, একক বা reference condition গুলিয়ে ফেলা এবং সূত্রের প্রয়োগসীমা না দেখা। আগে সংজ্ঞা ও শর্ত স্থির করো।';
    }
    var realWorld = clean(ex.realWorld || q.realWorld || '');
    if (!realWorld) realWorld = subject === 'chemistry'
      ? 'পরীক্ষাগারে নমুনা বিশ্লেষণ, বিক্রিয়ার ফল ব্যাখ্যা এবং পদার্থের গুণ শনাক্ত করতে এই ধারণার প্রয়োগ দেখা যায়।'
      : subject === 'math' || /উচ্চতর গণিত/i.test(String(q.subject || ''))
        ? 'পরিমাণগত মডেল, গ্রাফ, জ্যামিতিক সম্পর্ক এবং বাস্তব সমস্যার সমাধানে এই গাণিতিক ধারণা কাজে লাগে।'
        : 'পরিমাপ, যন্ত্রের আচরণ, গতি বা প্রাকৃতিক ব্যবস্থার ফল ব্যাখ্যা করতে এই ভৌত ধারণা ব্যবহার করা যায়।';
    var oldOA = Array.isArray(ex.optionAnalysis) ? ex.optionAnalysis : [];
    var optionAnalysis = oldOA.length === opts.length && oldOA.every(function (x) { return x && clean(x.explanation).length >= 30; }) ? oldOA : opts.map(function (option, index) {
      return { option: index, correct: index === answerIndex, explanation: index === answerIndex
        ? 'সঠিক। “' + topic + '”–এর মূল ধারণা ও প্রশ্নে দেওয়া শর্তের সঙ্গে এই বক্তব্যটি সামঞ্জস্যপূর্ণ: ' + clean(option) + '।'
        : 'এই বিকল্পটি যাচাই করতে এর বক্তব্যকে প্রশ্নের নির্দিষ্ট শর্ত ও সঠিক ধারণার সঙ্গে তুলনা করো। “' + clean(option).slice(0, 120) + '” প্রশ্নে চাওয়া সিদ্ধান্তকে সম্পূর্ণভাবে প্রতিষ্ঠা করে না, তাই এটি সঠিক নয়।' };
    });
    var needsUpgrade = oldAnalysis.length < 125 || (Array.isArray(ex.steps) ? ex.steps.length : 0) < 2 || originalCore.length < 70;
    if (needsUpgrade) {
      ex.core = baseCore; ex.analysis = analysis; ex.formula = formula; ex.simple = clean(ex.simple) || 'প্রশ্নের শর্ত → মূল ধারণা → প্রযোজ্য সম্পর্ক → ফল যাচাই।';
      ex.steps = steps; ex.misconception = misconception; ex.realWorld = realWorld; ex.optionAnalysis = optionAnalysis;
      ex.explanationQualityV100 = 'expanded-legacy-explanation; automated draft, exact content and syllabus review pending';
      q.explanationUpgradeStatusV100 = 'expanded-thin-legacy-explanation-pending-human-review';
      q.explanation = ex;
      q.e = ex.core + ' ' + ex.analysis;
    } else {
      if (!ex.optionAnalysis || ex.optionAnalysis.length !== opts.length) ex.optionAnalysis = optionAnalysis;
      if (!ex.media) ex.media = [];
      q.explanation = ex;
    }
    return q;
  }
  function applyBank(bank, chapter) {
    return (Array.isArray(bank) ? bank : []).map(function (original) {
      if (!original) return original;
      var q = upgradeBlueprint(Object.assign({}, original));
      q = upgradeThinExplanation(q, chapter);
      q.media = (Array.isArray(q.media) ? q.media : []).filter(function (m) { return curated(m, 'question'); });
      q.explanation = q.explanation && typeof q.explanation === 'object' ? q.explanation : {};
      var retained = (Array.isArray(q.explanation.media) ? q.explanation.media : []).filter(function (m) { return curated(m, 'explanation'); });
      // Always supply an explanation-only concept map, including text-only questions.
      var id = String(q.questionId || q.id || 'question'), mapId = 'v100-explanation-map-' + id.replace(/[^a-zA-Z0-9_-]/g, '-');
      if (!retained.some(function (m) { return String(m.id || '') === mapId || m.kind === 'cl-v100-explanation-concept-map'; })) retained.unshift(explanationMap(q, chapter));
      q.explanation.media = retained;
      q.mediaPolicyV100 = {
        irrelevantAutoGeneratedQuestionVisualsRemoved: true,
        explanationVisualIndependentOfQuestionMedia: true,
        questionVisualSourcePolicy: 'preserve verified, curated-v93, v92 and explicitly authored v97-v99 assets only',
        explanationVisual: 'question-specific concept map generated from core/analysis/formula; pending specialist verification'
      };
      return q;
    });
  }
  api.upgradeBlueprint = upgradeBlueprint;
  api.upgradeThinExplanation = upgradeThinExplanation;
  api.applyBank = applyBank;
  api.isCuratedMedia = curated;
  w.CL_QUIZ_MEDIA_QUALITY_V100 = api;
})(window);
