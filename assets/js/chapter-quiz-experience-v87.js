/* Golden Snitch v87: question-linked interactive learning aids, verified external
   simulation discovery links, and honest editorial/media audit metrics. */
(function (w, d) {
  'use strict';
  var api = w.CL_QUIZ_ENRICHMENT_V86;
  if (!api) return;

  function esc(v) {
    return String(v == null ? '' : v).replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  function safeNum(v, fallback, min, max) {
    var n = Number(v);
    if (!Number.isFinite(n)) n = fallback;
    return Math.max(min, Math.min(max, n));
  }
  function idFor(q) { return String(q.questionId || q.id || 'question').replace(/[^a-zA-Z0-9_-]/g, '-'); }
  function control(label, key, min, max, step, value, suffix) {
    return '<label class="clq-control"><span>' + esc(label) + ' <b data-clq-value="' + key + '">' + esc(value) + '</b>' + esc(suffix || '') +
      '</span><input type="range" data-clq-control="' + key + '" min="' + min + '" max="' + max + '" step="' + step + '" value="' + value + '"></label>';
  }
  function shell(kind, title, hint, controls, visual, readouts, note) {
    return '<section class="clq-interactive" data-clq-sim="' + kind + '" aria-label="' + esc(title) + '">' +
      '<header><span class="clq-sim-kicker">INTERACTIVE LEARNING AID</span><b>' + esc(title) + '</b><p>' + esc(hint) + '</p></header>' +
      '<div class="clq-sim-grid"><div class="clq-sim-controls">' + controls + '</div><div class="clq-sim-visual">' + visual + '</div></div>' +
      '<div class="clq-sim-readouts">' + readouts + '</div><p class="clq-sim-note">' + esc(note) + '</p></section>';
  }
  function simMarkup(kind, cfg, qid) {
    cfg = cfg || {};
    var v, a, g, t, html, controls, visual, outs, note;
    if (kind === 'projectile') {
      v = safeNum(cfg.v, 20, 5, 40); a = safeNum(cfg.angle, 30, 5, 85); g = safeNum(cfg.g, 10, 9.8, 10);
      controls = control('প্রাথমিক বেগ', 'v', 5, 40, 1, v, ' m/s') + control('নিক্ষেপণ কোণ', 'angle', 5, 85, 1, a, '°');
      visual = '<svg viewBox="0 0 620 230" role="img" aria-label="প্রক্ষেপকের গতিপথের পরিবর্তন"><path d="M28 194H595M28 194V20" stroke="currentColor" opacity=".35"/><path data-clq-plot="trajectory" d="" fill="none" stroke="#38bdf8" stroke-width="4" stroke-linecap="round"/><circle data-clq-plot="projectile-dot" cx="28" cy="194" r="6" fill="#f59e0b"/><text x="600" y="213" text-anchor="end" fill="currentColor" font-size="12">x (m)</text><text x="12" y="16" fill="currentColor" font-size="12">y (m)</text></svg>';
      outs = '<div><small>পাল্লা</small><b data-clq-out="range">—</b><span>m</span></div><div><small>সর্বোচ্চ উচ্চতা</small><b data-clq-out="height">—</b><span>m</span></div><div><small>উড্ডয়নকাল</small><b data-clq-out="time">—</b><span>s</span></div>';
      note = 'সমতল ভূমি, বায়ুর বাধা উপেক্ষা এবং ধ্রুব g ধরে আদর্শ প্রক্ষেপণ মডেল।';
      return shell(kind, 'প্রক্ষেপকের গতি অন্বেষণ', 'বেগ ও কোণ বদলে পাল্লা, সর্বোচ্চ উচ্চতা এবং উড্ডয়নকাল দেখো।', controls, visual, outs, note);
    }
    if (kind === 'vector') {
      var ax = safeNum(cfg.ax, 3, -10, 10), ay = safeNum(cfg.ay, 4, -10, 10);
      controls = control('x-উপাংশ', 'ax', -10, 10, .5, ax, '') + control('y-উপাংশ', 'ay', -10, 10, .5, ay, '');
      visual = '<svg viewBox="0 0 620 230" role="img" aria-label="ভেক্টরের উপাংশ ও লব্ধি"><path d="M40 112H590M310 18V215" stroke="currentColor" opacity=".3"/><path data-clq-plot="vector-x" d="" stroke="#22c55e" stroke-width="4"/><path data-clq-plot="vector-y" d="" stroke="#f59e0b" stroke-width="4" stroke-dasharray="6 5"/><path data-clq-plot="vector-r" d="" stroke="#38bdf8" stroke-width="5"/><circle cx="310" cy="112" r="4" fill="currentColor"/><text x="595" y="130" fill="currentColor" font-size="12">x</text><text x="322" y="18" fill="currentColor" font-size="12">y</text></svg>';
      outs = '<div><small>লব্ধির মান</small><b data-clq-out="magnitude">—</b><span>একক</span></div><div><small>দিক</small><b data-clq-out="direction">—</b><span>°</span></div><div><small>উপাংশ</small><b data-clq-out="components">—</b><span>(x, y)</span></div>';
      note = 'x ও y উপাংশ পরস্পর লম্ব; লব্ধির মান পিথাগোরাসের উপপাদ্য থেকে পাওয়া যায়।';
      return shell(kind, 'ভেক্টর উপাংশ ও লব্ধি', 'দুটি উপাংশ বদলে লব্ধি ভেক্টরের মান ও দিক পর্যবেক্ষণ করো।', controls, visual, outs, note);
    }
    if (kind === 'wave') {
      var amp = safeNum(cfg.amp, 1, .2, 2), freq = safeNum(cfg.freq, 2, .5, 5);
      controls = control('বিস্তার', 'amp', .2, 2, .1, amp, ' একক') + control('কম্পাঙ্ক', 'freq', .5, 5, .1, freq, ' Hz');
      visual = '<svg viewBox="0 0 620 230" role="img" aria-label="সাইন তরঙ্গের বিস্তার ও কম্পাঙ্ক"><path d="M24 112H596" stroke="currentColor" opacity=".3"/><path data-clq-plot="wave" d="" fill="none" stroke="#38bdf8" stroke-width="4"/><path d="M24 35V190M596 35V190" stroke="currentColor" opacity=".12" stroke-dasharray="4 6"/></svg>';
      outs = '<div><small>পর্যায়কাল</small><b data-clq-out="period">—</b><span>s</span></div><div><small>কম্পাঙ্ক</small><b data-clq-out="frequency">—</b><span>Hz</span></div><div><small>বিস্তার</small><b data-clq-out="amplitude">—</b><span>একক</span></div>';
      note = 'এখানে তরঙ্গের আকার y = A sin(2πft) দিয়ে দেখানো; তরঙ্গের বেগ নির্দিষ্ট করা হয়নি।';
      return shell(kind, 'তরঙ্গের বৈশিষ্ট্য', 'বিস্তার ও কম্পাঙ্ক বদলে তরঙ্গের আকৃতি এবং পর্যায়কাল দেখো।', controls, visual, outs, note);
    }
    if (kind === 'pendulum') {
      var length = safeNum(cfg.length, 1, .2, 2), gravity = 9.8;
      controls = control('দোলকের দৈর্ঘ্য', 'length', .2, 2, .1, length, ' m');
      visual = '<svg viewBox="0 0 620 230" role="img" aria-label="সরল দোলকের গঠন"><path d="M230 24H390" stroke="currentColor" stroke-width="5"/><path d="M310 28L310 176" stroke="#38bdf8" stroke-width="4"/><circle cx="310" cy="181" r="19" fill="#f59e0b"/><path d="M310 28L235 180" stroke="currentColor" opacity=".12" stroke-width="2" stroke-dasharray="5 6"/><path d="M310 28L385 180" stroke="currentColor" opacity=".12" stroke-width="2" stroke-dasharray="5 6"/><path d="M310 42V206" stroke="currentColor" opacity=".35" stroke-dasharray="4 5"/><text x="330" y="108" fill="currentColor" font-size="14">L</text></svg>';
      outs = '<div><small>পর্যায়কাল</small><b data-clq-out="period">—</b><span>s</span></div><div><small>কম্পাঙ্ক</small><b data-clq-out="frequency">—</b><span>Hz</span></div><div><small>দৈর্ঘ্য</small><b data-clq-out="length">—</b><span>m</span></div>';
      note = 'ছোট কৌণিক বিচ্যুতির জন্য T = 2π√(L/g), এখানে g = 9.8 m/s² ধরা হয়েছে।';
      return shell(kind, 'সরল দোলকের পর্যায়কাল', 'দৈর্ঘ্য বদলে পর্যায়কাল কীভাবে পরিবর্তিত হয় দেখো।', controls, visual, outs, note);
    }
    if (kind === 'gas') {
      var volume = safeNum(cfg.volume, 10, 2, 12), p1 = 100, v1 = 5;
      controls = control('বর্তমান আয়তন', 'volume', 2, 12, .5, volume, ' L');
      visual = '<svg viewBox="0 0 620 230" role="img" aria-label="গ্যাসের আয়তন ও চাপের বিপরীত সম্পর্ক"><path d="M60 190H580M60 190V25" stroke="currentColor" opacity=".35"/><path data-clq-plot="gas" d="" fill="none" stroke="#38bdf8" stroke-width="4"/><circle data-clq-plot="gas-point" r="7" fill="#f59e0b"/><text x="580" y="214" text-anchor="end" fill="currentColor" font-size="12">আয়তন (L)</text><text x="12" y="18" fill="currentColor" font-size="12">চাপ (kPa)</text></svg>';
      outs = '<div><small>বর্তমান চাপ</small><b data-clq-out="pressure">—</b><span>kPa</span></div><div><small>P × V</small><b data-clq-out="pv">—</b><span>kPa·L</span></div><div><small>প্রাথমিক অবস্থা</small><b>100 × 5</b><span>kPa·L</span></div>';
      note = 'নির্দিষ্ট তাপমাত্রায় নির্দিষ্ট গ্যাসের জন্য আদর্শ Boyle মডেল: P₁V₁ = P₂V₂।';
      return shell(kind, 'বয়েলের সূত্র অন্বেষণ', 'আয়তন পরিবর্তন করে স্থির তাপমাত্রায় চাপের পরিবর্তন দেখো।', controls, visual, outs, note);
    }
    if (kind === 'ph') {
      var ph = safeNum(cfg.ph, 3, 0, 14);
      controls = control('pH মান', 'ph', 0, 14, .1, ph, '');
      visual = '<div class="clq-ph-scale"><div class="clq-ph-gradient"></div><div class="clq-ph-marker" data-clq-plot="ph-marker"></div><div class="clq-ph-ticks"><span>0 · অম্লীয়</span><span>7 · নিরপেক্ষ</span><span>14 · ক্ষারীয়</span></div><strong data-clq-plot="ph-label">pH ' + esc(ph) + '</strong></div>';
      outs = '<div><small>শ্রেণি</small><b data-clq-out="class">—</b><span></span></div><div><small>[H₃O⁺] আনুমানিক</small><b data-clq-out="hydrogen">—</b><span>mol/L</span></div><div><small>pH</small><b data-clq-out="value">—</b><span></span></div>';
      note = '25°C-এ জলীয় দ্রবণের সাধারণ pH স্কেল; H₃O⁺-এর ঘনমাত্রা 10⁻pH mol/L হিসেবে দেখানো।';
      return shell(kind, 'pH স্কেল অন্বেষণ', 'pH বদলে অম্লীয়, নিরপেক্ষ ও ক্ষারীয় অঞ্চলের পার্থক্য দেখো।', controls, visual, outs, note);
    }
    if (kind === 'line') {
      var m = safeNum(cfg.m, 2, -3, 3), c = safeNum(cfg.c, 1, -5, 5), x = safeNum(cfg.x, 3, -5, 5);
      controls = control('ঢাল (m)', 'm', -3, 3, .1, m, '') + control('y-অক্ষছেদ (c)', 'c', -5, 5, .5, c, '') + control('x মান', 'x', -5, 5, .5, x, '');
      visual = '<svg viewBox="0 0 620 230" role="img" aria-label="y সমান mx যোগ c সরলরেখার লেখচিত্র"><path d="M50 112H580M310 20V205" stroke="currentColor" opacity=".35"/><path data-clq-plot="line" d="" stroke="#38bdf8" stroke-width="4"/><circle data-clq-plot="line-point" r="7" fill="#f59e0b"/><text x="585" y="130" fill="currentColor" font-size="12">x</text><text x="322" y="20" fill="currentColor" font-size="12">y</text></svg>';
      outs = '<div><small>y = mx + c</small><b data-clq-out="y">—</b><span></span></div><div><small>ঢাল</small><b data-clq-out="slope">—</b><span></span></div><div><small>বিন্দু</small><b data-clq-out="point">—</b><span>(x, y)</span></div>';
      note = 'কার্তেসীয় সমতলে y = mx + c সরলরেখা; নির্বাচিত x-এর জন্য y নির্ণয় করা হয়।';
      return shell(kind, 'সরলরেখার লেখচিত্র', 'ঢাল, y-অক্ষছেদ ও x-এর মান বদলে রেখা ও সংশ্লিষ্ট বিন্দু দেখো।', controls, visual, outs, note);
    }
    if (kind === 'quadratic') {
      var qa = safeNum(cfg.a, 1, -2, 2), qb = safeNum(cfg.b, 0, -4, 4), qc = safeNum(cfg.c, -4, -5, 5);
      controls = control('a', 'qa', -2, 2, .1, qa, '') + control('b', 'qb', -4, 4, .2, qb, '') + control('c', 'qc', -5, 5, .5, qc, '');
      visual = '<svg viewBox="0 0 620 230" role="img" aria-label="দ্বিঘাত ফাংশনের লেখচিত্র"><path d="M50 112H580M310 20V205" stroke="currentColor" opacity=".35"/><path data-clq-plot="quadratic" d="" stroke="#38bdf8" stroke-width="4" fill="none"/><circle data-clq-plot="vertex" r="6" fill="#f59e0b"/></svg>';
      outs = '<div><small>শীর্ষবিন্দুর x</small><b data-clq-out="vx">—</b><span></span></div><div><small>শীর্ষবিন্দুর y</small><b data-clq-out="vy">—</b><span></span></div><div><small>খোলার দিক</small><b data-clq-out="opening">—</b><span></span></div>';
      note = 'a ≠ 0 হলে y = ax² + bx + c-এর শীর্ষবিন্দুর x-স্থানাঙ্ক −b/(2a)।';
      return shell(kind, 'দ্বিঘাত ফাংশনের গ্রাফ', 'a, b, c পরিবর্তন করে পরাবৃত্তের অবস্থান ও শীর্ষবিন্দু পর্যবেক্ষণ করো।', controls, visual, outs, note);
    }
    return '';
  }
  function resource(subject, topic) {
    var z = String(topic || '').toLowerCase(), title = '', group = '';
    if (subject === 'physics') {
      if (/প্রক্ষেপ|projectile/.test(z)) { title = 'Projectile Motion'; group = 'physics'; }
      else if (/ভেক্টর|vector/.test(z)) { title = 'Vector Addition'; group = 'physics'; }
      else if (/তরঙ্গ|wave|শব্দ/.test(z)) { title = 'Wave on a String'; group = 'physics'; }
      else if (/দোলন|দোলক|pendulum/.test(z)) { title = 'Pendulum Lab'; group = 'physics'; }
      else if (/গ্যাস|boyle|charles/.test(z)) { title = 'Gas Properties'; group = 'physics'; }
      else if (/বর্তনী|তড়িৎ|বিদ্যুৎ|circuit/.test(z)) { title = 'Circuit Construction Kit: DC'; group = 'physics'; }
    } else if (subject === 'chemistry') {
      if (/pH|অম্ল|ক্ষার|acid|base/.test(z)) { title = 'pH Scale'; group = 'chemistry'; }
      else if (/গ্যাস|boyle|charles/.test(z)) { title = 'Gas Properties'; group = 'chemistry'; }
      else if (/অণু|molecule|সমযোজী|bond/.test(z)) { title = 'Molecule Shapes'; group = 'chemistry'; }
      else if (/ঘনমাত্রা|concentration|মোলার/.test(z)) { title = 'Molarity'; group = 'chemistry'; }
      else if (/পরমাণু|electron|ইলেকট্রন/.test(z)) { title = 'Build an Atom'; group = 'chemistry'; }
    } else {
      if (/সরলরেখা|ঢাল|straight line/.test(z)) { title = 'Graphing Lines'; group = 'math'; }
      else if (/দ্বিঘাত|পরাবৃত্ত|quadratic|কনিক/.test(z)) { title = 'Graphing Quadratics'; group = 'math'; }
      else if (/অন্তরীকরণ|অবকলন|derivative|tangent/.test(z)) { title = 'Calculus Grapher'; group = 'math'; }
      else if (/ত্রিকোণমিতি|ত্রিকোণমিতিক|trigonometric/.test(z)) { title = 'Trig Tour'; group = 'math'; }
    }
    return title ? { title: title, institution: 'PhET Interactive Simulations · University of Colorado Boulder', url: 'https://phet.colorado.edu/en/simulations/browse', verifiedCatalog: true } : null;
  }
  function simFor(subject, topic, q) {
    var z = String(topic || q.syllabusTopic || q.subtopic || q.topic || '') + ' ' + String(q.q || ''), id = idFor(q), cfg = q.simConfig || {};
    if (subject === 'physics') {
      if (/প্রক্ষেপ|projectile/.test(z)) return { id: id, kind: 'projectile', title: 'Projectile Motion', config: cfg };
      if (/ভেক্টর|vector/.test(z)) return { id: id, kind: 'vector', title: 'Vector Addition', config: cfg };
      if (/তরঙ্গ|wave|শব্দ|অনুনাদ/.test(z)) return { id: id, kind: 'wave', title: 'Wave on a String', config: cfg };
      if (/দোলক|দোলন|pendulum|সরল ছন্দিত/.test(z)) return { id: id, kind: 'pendulum', title: 'Pendulum Lab', config: cfg };
      if (/গ্যাসের সূত্র|গ্যাসের গতিতত্ত্ব|boyle|charles/.test(z)) return { id: id, kind: 'gas', title: 'Gas Properties', config: cfg };
    }
    if (subject === 'chemistry') {
      if (/pH|অম্ল|ক্ষার|acid|base/.test(z)) return { id: id, kind: 'ph', title: 'pH Scale', config: cfg };
      if (/গ্যাসের সূত্র|গ্যাসের গতিতত্ত্ব|boyle|charles/.test(z)) return { id: id, kind: 'gas', title: 'Gas Properties', config: cfg };
    }
    if (subject === 'math') {
      if (/সরলরেখা|ঢাল|straight line/.test(z)) return { id: id, kind: 'line', title: 'Graphing Lines', config: cfg };
      if (/দ্বিঘাত|পরাবৃত্ত|quadratic|কনিক/.test(z)) return { id: id, kind: 'quadratic', title: 'Graphing Quadratics', config: cfg };
    }
    return null;
  }
  var originalEnrich = api.enrichBank;
  api.enrichBank = function (chapter, bank, source) {
    var rows = originalEnrich(chapter, bank, source), subject = chapter.subjectKey || (chapter.id.indexOf('phy') === 0 ? 'physics' : chapter.id.indexOf('chem') === 0 ? 'chemistry' : 'math');
    rows.forEach(function (q) {
      var sim = simFor(subject, q.subtopic, q);
      if (sim) {
        q.interactiveLearningAid = sim.kind;
        q.media = Array.isArray(q.media) ? q.media : [];
        var isChallenge = q.simulationChallenge === true;
        var existing = q.media.some(function (m) { return m && m.kind === 'cl-interactive-simulation'; });
        if (!existing) q.media.push({ type: 'simulation', kind: 'cl-interactive-simulation', title: sim.title,
          caption: (isChallenge ? 'প্রশ্ন-সংশ্লিষ্ট পরীক্ষা: ' : 'ধারণা অন্বেষণ: ') + sim.title + ' — ' + 'নিয়ন্ত্রণ বদলে ফল পর্যবেক্ষণ করো।',
          html: simMarkup(sim.kind, sim.config, sim.id), questionSupport: isChallenge, simulationKind: sim.kind,
          source: 'Golden Snitch formula-based learning aid' });
      }
      var r = resource(subject, q.subtopic);
      if (r) {
        q.learningResources = Array.isArray(q.learningResources) ? q.learningResources : [];
        if (!q.learningResources.some(function (x) { return x && x.url === r.url && x.title === r.title; })) q.learningResources.push(r);
      }
      q.meta = q.meta || {};
      q.meta.qualityStatus = q.qualityStatus || 'draft-unreviewed';
      q.meta.questionSupportMedia = (q.media || []).some(function (m) { return m && m.questionSupport === true; });
    });
    return rows;
  };

  var originalRender = api.renderMedia;
  api.renderMedia = function (q, surface) {
    var support = surface === 'explanation' ? 'explanationSupport' : 'questionSupport';
    var items = q && Array.isArray(q.media) ? q.media.filter(function (m) {
      return !!(m && m.verified === true && m[support] === true && ['image', 'diagram'].indexOf(String(m.type || '').toLowerCase()) >= 0);
    }) : [];
    return items.length ? originalRender({ media: items }, surface) : '';
  };

  var originalAudit = api.buildAudit;
  api.buildAudit = function (chapters, source) {
    return originalAudit(chapters, source).map(function (row, index) {
      var ch = chapters[index], qs = ch && ch.data && ch.data.q || [], quality = 0, authored = 0, generated = 0,
        aid = 0, validatedQuestionMedia = 0, sources = 0;
      qs.forEach(function (q) {
        if (q.qualityApproved === true && q.editorialReviewed === true) quality++;
        if (q.authoredHscConcept === true || q.contentOrigin === 'authored' || (q.meta && q.meta.contentOrigin === 'authored')) authored++;
        if (q.syllabusGenerated === true || (q.meta && q.meta.contentOrigin === 'syllabus-generated')) generated++;
        var media = Array.isArray(q.media) ? q.media : [];
        if (media.length) aid++;
        if (media.some(function (m) { return m && m.questionSupport === true; })) validatedQuestionMedia++;
        if (Array.isArray(q.learningResources)) sources += q.learningResources.filter(function (r) { return r && r.verifiedCatalog === true; }).length;
      });
      var ratio = qs.length ? Math.round(validatedQuestionMedia / qs.length * 1000) / 10 : 0;
      row.qualityQuestions = quality;
      row.authoredQuestions = authored;
      row.templateGeneratedQuestions = generated;
      row.learningAidSupportedQuestions = aid;
      row.multimediaQuestionCount = validatedQuestionMedia;
      row.multimediaRatio = ratio;
      row.multimediaTargetMet = ratio >= 35;
      row.verifiedExternalCatalogLinks = sources;
      row.editorialStatus = 'not-complete-until-human-review';
      row.automatedFlags = (row.automatedFlags || []).filter(function (f) { return f !== 'multimedia-below-35-percent'; });
      if (!row.multimediaTargetMet) row.automatedFlags.push('verified-question-multimedia-below-35-percent');
      if (generated) row.automatedFlags.push('template-generated-content-present');
      if (quality < qs.length) row.automatedFlags.push('quality-review-not-approved');
      return row;
    });
  };
  api.version = 87;

  function fmt(n, digits) { return Number(n).toFixed(digits == null ? 2 : digits); }
  function setText(root, selector, value) { var el = root.querySelector(selector); if (el) el.textContent = String(value); }
  function setPath(root, selector, dval) { var el = root.querySelector(selector); if (el) el.setAttribute('d', dval); }
  function update(root) {
    if (!root || !root.dataset.clqSim) return;
    var kind = root.dataset.clqSim;
    function val(k) { var el = root.querySelector('[data-clq-control="' + k + '"]'); return el ? Number(el.value) : 0; }
    function out(k, v) { setText(root, '[data-clq-out="' + k + '"]', v); }
    function value(k, v) { setText(root, '[data-clq-value="' + k + '"]', v); }
    if (kind === 'projectile') {
      var speed = val('v'), deg = val('angle'), rad = deg * Math.PI / 180, gg = 10;
      var tf = 2 * speed * Math.sin(rad) / gg, range = speed * speed * Math.sin(2 * rad) / gg, height = speed * speed * Math.sin(rad) * Math.sin(rad) / (2 * gg);
      var maxR = Math.max(1, speed * speed / gg), maxH = Math.max(1, speed * speed / (2 * gg));
      var dpath = []; for (var i = 0; i <= 30; i++) { var t = tf * i / 30, x = speed * Math.cos(rad) * t, y = speed * Math.sin(rad) * t - .5 * gg * t * t; var px = 30 + x / maxR * 560, py = 194 - y / maxH * 160; dpath.push((i ? 'L' : 'M') + px.toFixed(1) + ' ' + py.toFixed(1)); }
      setPath(root, '[data-clq-plot="trajectory"]', dpath.join(' '));
      var dot = root.querySelector('[data-clq-plot="projectile-dot"]'); if (dot) { dot.setAttribute('cx', (30 + range / maxR * 560).toFixed(1)); dot.setAttribute('cy', (194 - height / maxH * 160).toFixed(1)); }
      out('range', fmt(range)); out('height', fmt(height)); out('time', fmt(tf)); value('v', fmt(speed, 0)); value('angle', fmt(deg, 0));
    } else if (kind === 'vector') {
      var x = val('ax'), y = val('ay'), mag = Math.sqrt(x * x + y * y), dir = Math.atan2(y, x) * 180 / Math.PI;
      var ox = 310, oy = 112, ex = ox + x * 22, ey = oy - y * 22;
      setPath(root, '[data-clq-plot="vector-x"]', 'M' + ox + ' ' + oy + ' L' + ex + ' ' + oy);
      setPath(root, '[data-clq-plot="vector-y"]', 'M' + ex + ' ' + oy + ' L' + ex + ' ' + ey);
      setPath(root, '[data-clq-plot="vector-r"]', 'M' + ox + ' ' + oy + ' L' + ex + ' ' + ey);
      out('magnitude', fmt(mag)); out('direction', fmt(dir, 1)); out('components', '(' + fmt(x, 1) + ', ' + fmt(y, 1) + ')'); value('ax', fmt(x, 1)); value('ay', fmt(y, 1));
    } else if (kind === 'wave') {
      var amp = val('amp'), f = val('freq'), pts = []; for (var j = 0; j <= 100; j++) { var px2 = 24 + j * 5.72, py2 = 112 - Math.sin(j / 100 * Math.PI * 4) * amp * 38; pts.push((j ? 'L' : 'M') + px2.toFixed(1) + ' ' + py2.toFixed(1)); }
      setPath(root, '[data-clq-plot="wave"]', pts.join(' ')); out('period', fmt(1 / f, 3)); out('frequency', fmt(f, 1)); out('amplitude', fmt(amp, 1)); value('amp', fmt(amp, 1)); value('freq', fmt(f, 1));
    } else if (kind === 'pendulum') {
      var l = val('length'), period = 2 * Math.PI * Math.sqrt(l / 9.8); out('period', fmt(period, 3)); out('frequency', fmt(1 / period, 3)); out('length', fmt(l, 1)); value('length', fmt(l, 1));
      var pend = root.querySelector('.clq-sim-visual svg path:nth-of-type(2)'); if (pend) pend.setAttribute('d', 'M310 28L' + (310 + Math.sin(.22) * 150) + ' ' + (28 + Math.cos(.22) * 150));
    } else if (kind === 'gas') {
      var volume = val('volume'), pressure = 500 / volume, pts2 = []; for (var k = 0; k <= 60; k++) { var vv = 2 + k / 60 * 10, pp = 500 / vv; pts2.push((k ? 'L' : 'M') + (60 + (vv - 2) / 10 * 520).toFixed(1) + ' ' + (190 - pp / 250 * 150).toFixed(1)); }
      setPath(root, '[data-clq-plot="gas"]', pts2.join(' ')); var gp = root.querySelector('[data-clq-plot="gas-point"]'); if (gp) { gp.setAttribute('cx', (60 + (volume - 2) / 10 * 520).toFixed(1)); gp.setAttribute('cy', (190 - pressure / 250 * 150).toFixed(1)); }
      out('pressure', fmt(pressure, 1)); out('pv', fmt(pressure * volume, 1)); value('volume', fmt(volume, 1));
    } else if (kind === 'ph') {
      var pH = val('ph'), category = pH < 7 ? 'অম্লীয়' : pH > 7 ? 'ক্ষারীয়' : 'নিরপেক্ষ', marker = root.querySelector('[data-clq-plot="ph-marker"]');
      if (marker) marker.style.left = (pH / 14 * 100) + '%';
      setText(root, '[data-clq-plot="ph-label"]', 'pH ' + fmt(pH, 1)); out('class', category); out('hydrogen', (Math.pow(10, -pH)).toExponential(1)); out('value', fmt(pH, 1)); value('ph', fmt(pH, 1));
    } else if (kind === 'line') {
      var m = val('m'), c = val('c'), xv = val('x'), yv = m * xv + c, points = [];
      for (var q = 0; q <= 80; q++) { var xx = -5 + q / 80 * 10, yy = m * xx + c; points.push((q ? 'L' : 'M') + (50 + (xx + 5) / 10 * 530).toFixed(1) + ' ' + (112 - yy * 15).toFixed(1)); }
      setPath(root, '[data-clq-plot="line"]', points.join(' ')); var lp = root.querySelector('[data-clq-plot="line-point"]'); if (lp) { lp.setAttribute('cx', (50 + (xv + 5) / 10 * 530).toFixed(1)); lp.setAttribute('cy', (112 - yv * 15).toFixed(1)); }
      out('y', fmt(yv, 2)); out('slope', fmt(m, 1)); out('point', '(' + fmt(xv, 1) + ', ' + fmt(yv, 1) + ')'); value('m', fmt(m, 1)); value('c', fmt(c, 1)); value('x', fmt(xv, 1));
    } else if (kind === 'quadratic') {
      var aa = val('qa'), bb = val('qb'), cc = val('qc'), vtx = aa ? -bb / (2 * aa) : 0, vty = aa * vtx * vtx + bb * vtx + cc, path = [];
      for (var n = 0; n <= 100; n++) { var xx2 = -5 + n / 100 * 10, yy2 = aa * xx2 * xx2 + bb * xx2 + cc; path.push((n ? 'L' : 'M') + (50 + (xx2 + 5) / 10 * 530).toFixed(1) + ' ' + (112 - yy2 * 8).toFixed(1)); }
      setPath(root, '[data-clq-plot="quadratic"]', path.join(' ')); var vp = root.querySelector('[data-clq-plot="vertex"]'); if (vp) { vp.setAttribute('cx', (50 + (vtx + 5) / 10 * 530).toFixed(1)); vp.setAttribute('cy', (112 - vty * 8).toFixed(1)); }
      out('vx', fmt(vtx)); out('vy', fmt(vty)); out('opening', aa > 0 ? 'ঊর্ধ্বমুখী' : aa < 0 ? 'নিম্নমুখী' : 'রৈখিক'); value('qa', fmt(aa, 1)); value('qb', fmt(bb, 1)); value('qc', fmt(cc, 1));
    }
  }
  d.addEventListener('input', function (ev) {
    if (!ev.target || !ev.target.matches('[data-clq-control]')) return;
    var root = ev.target.closest('[data-clq-sim]'); if (root) update(root);
  });
  d.addEventListener('DOMContentLoaded', function () { Array.prototype.forEach.call(d.querySelectorAll('[data-clq-sim]'), update); });
  if (d.readyState !== 'loading') Array.prototype.forEach.call(d.querySelectorAll('[data-clq-sim]'), update);
  /* Quiz questions are injected after route changes; initialise every newly-added lab. */
  if (w.MutationObserver && d.documentElement) {
    var observer = new MutationObserver(function (records) {
      records.forEach(function (record) {
        Array.prototype.forEach.call(record.addedNodes || [], function (node) {
          if (!node || node.nodeType !== 1) return;
          if (node.matches && node.matches('[data-clq-sim]')) update(node);
          if (node.querySelectorAll) Array.prototype.forEach.call(node.querySelectorAll('[data-clq-sim]'), update);
        });
      });
    });
    observer.observe(d.documentElement, { childList: true, subtree: true });
  }
  api.typeLabels.simulation = 'সিমুলেশন-ভিত্তিক';

  w.CL_QUIZ_EXPERIENCE_V87 = {
    version: 87,
    simulationTypes: ['projectile', 'vector', 'wave', 'pendulum', 'gas', 'ph', 'line', 'quadratic'],
    updateSimulation: update,
    verifiedReferenceInstitution: 'PhET Interactive Simulations · University of Colorado Boulder'
  };
})(window, document);
