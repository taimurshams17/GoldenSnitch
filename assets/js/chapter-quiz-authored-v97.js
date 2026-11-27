/* Golden Snitch v97 — a new focused authoring batch for Vector + Qualitative Chemistry.
 * 25 new question drafts. Ten have original static question-support SVGs (question media only).
 * Every item remains draft-unreviewed until a qualified subject specialist reviews it.
 */
(function (w) {
  'use strict';
  var refs = {
    vectors: { title: 'OpenStax University Physics Volume 1 — 2.2 Coordinate Systems and Components of a Vector', url: 'https://openstax.org/books/university-physics-volume-1/pages/2-2-coordinate-systems-and-components-of-a-vector', institution: 'OpenStax', section: '2.2', status: 'source-page-checked-2026-11-21; question-level-review-pending' },
    products: { title: 'OpenStax University Physics Volume 1 — 2.4 Products of Vectors', url: 'https://openstax.org/books/university-physics-volume-1/pages/2-4-products-of-vectors', institution: 'OpenStax', section: '2.4', status: 'source-page-checked-2026-11-21; question-level-review-pending' },
    calculus: { title: 'OpenStax Calculus Volume 3 — 6.5 Divergence and Curl', url: 'https://openstax.org/books/calculus-volume-3/pages/6-5-divergence-and-curl', institution: 'OpenStax', section: '6.5', status: 'source-page-checked-2026-11-21; question-level-review-pending' },
    gradient: { title: 'OpenStax Calculus Volume 3 — 6.1 Vector Fields', url: 'https://openstax.org/books/calculus-volume-3/pages/6-1-vector-fields', institution: 'OpenStax', section: '6.1', status: 'source-page-checked-2026-11-21; question-level-review-pending' },
    ksp: { title: 'OpenStax Chemistry 2e — 15.1 Precipitation and Dissolution', url: 'https://openstax.org/books/chemistry-2e/pages/15-1-precipitation-and-dissolution', institution: 'OpenStax', section: '15.1', status: 'source-page-checked-2026-11-21; question-level-review-pending' },
    analytical: { title: 'Royal Society of Chemistry Education — Analysis: qualitative tests for ions', url: 'https://edu.rsc.org/resources/analysis/1936.article', institution: 'Royal Society of Chemistry', status: 'resource-page-checked-2026-11-21; exact school-lab protocol requires local syllabus/reviewer check' },
    atomicTheory: { title: 'OpenStax Chemistry 2e — 2.2 Evolution of Atomic Theory', url: 'https://openstax.org/books/chemistry-2e/pages/2-2-evolution-of-atomic-theory', institution: 'OpenStax', section: '2.2', status: 'source-page-checked-2026-11-21; question-level-review-pending' },
    bohr: { title: 'OpenStax Chemistry 2e — 6.2 The Bohr Model', url: 'https://openstax.org/books/chemistry-2e/pages/6-2-the-bohr-model', institution: 'OpenStax', section: '6.2', status: 'source-page-checked-2026-11-21; question-level-review-pending' },
    spectroscopy: { title: 'Royal Society of Chemistry Education — Analytical chemistry introductions', url: 'https://edu.rsc.org/resources/collections/analytical-chemistry-introductions', institution: 'Royal Society of Chemistry', status: 'resource-page-checked-2026-11-21; question-level-review-pending' },
    separation: { title: 'Royal Society of Chemistry Education — Separation techniques', url: 'https://edu.rsc.org/cpd/separation-techniques/3009787.article', institution: 'Royal Society of Chemistry', status: 'resource-page-checked-2026-11-21; question-level-review-pending' },
    mri: { title: 'National Institute of Biomedical Imaging and Bioengineering — MRI Fact Sheet', url: 'https://www.nibib.nih.gov/sites/default/files/2022-05/Fact-Sheet-Magnetic-Resonance-Imaging-MRI.pdf', institution: 'NIBIB', status: 'fact-sheet-checked-2026-11-21; question-level-review-pending' }
  };
  var qs = [];
  var svgUid = 0;
  function svg(title, desc, inner, bg) {
    var uid = 'cl-v97-svg-' + (++svgUid);
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 300" role="img" aria-labelledby="' + uid + '-title ' + uid + '-desc"><title id="' + uid + '-title">' + title + '</title><desc id="' + uid + '-desc">' + desc + '</desc><rect x="1" y="1" width="638" height="298" rx="20" fill="' + (bg || '#f7fafc') + '" stroke="#94a3b8" stroke-width="2"/>' + inner + '</svg>';
  }
  function media(id, title, alt, caption, html) {
    return [{ id: id, type: 'diagram', kind: 'inline-svg', title: title, alt: alt, caption: caption, html: html, questionSupport: true, verified: false, rightsStatus: 'original-Golden Snitch-v97', attribution: 'Original Golden Snitch educational diagram', licence: 'Golden Snitch original; specialist review pending' }];
  }
  function add(id, chapterId, topicIndex, tier, type, stem, options, answer, explanation, references, visual) {
    var q = {
      id: id, questionId: id, chapterId: chapterId, topicIndex: topicIndex, q: stem, o: options, a: answer,
      tier: tier, questionType: type, authoredHscConcept: true, syllabusGenerated: false,
      contentOrigin: 'individually-authored-v97', qualityStatus: 'draft-unreviewed',
      qualityApproved: false, editorialReviewed: false, editorialApproved: false,
      learningObjective: explanation.objective, media: visual || [],
      explanation: {
        core: explanation.core, analysis: explanation.analysis, formula: explanation.formula || '',
        misconception: explanation.misconception, realWorld: explanation.realWorld,
        steps: explanation.steps, optionAnalysis: explanation.optionAnalysis,
        references: references.map(function (r) { return Object.assign({}, r); }),
        referenceStatus: 'linked-source-page-checked; exact-question-claim-and-HSC-syllabus-review-pending',
        media: []
      }
    };
    if (q.o.length !== 4 || new Set(q.o).size !== 4 || !Number.isInteger(q.a) || q.a < 0 || q.a > 3) throw new Error('Invalid authored question ' + id);
    qs.push(q);
  }

  // PHYSICS 1st Paper — Chapter 2: Vector (12 distinct questions)
  add('cl-v97-vector-displacement-coordinates-001','phy1-02',2,2,'mathematical',
    'P(1, 2, 3) থেকে Q(4, 0, 5) বিন্দুতে সরণ ভেক্টর কোনটি?',
    ['3î − 2ĵ + 2k̂','5î + 2ĵ + 8k̂','−3î + 2ĵ − 2k̂','4î + 0ĵ + 5k̂'],0,{
      objective:'দুটি বিন্দুর স্থানাঙ্ক থেকে অবস্থান ভেক্টরের পার্থক্য ব্যবহার করে সরণ নির্ণয় করা।',
      core:'সরণ ভেক্টর হলো শেষ অবস্থানের অবস্থান ভেক্টর থেকে প্রাথমিক অবস্থানের অবস্থান ভেক্টর বিয়োগ।',
      analysis:'r_P=(1,2,3), r_Q=(4,0,5)। তাই Δr=r_Q−r_P=(4−1,0−2,5−3)=(3,−2,2)। সরণটি P থেকে Q নির্দেশ করে; Q থেকে P হলে চিহ্ন উল্টো হতো।',
      formula:'Δr = r_Q − r_P', misconception:'দুটি অবস্থান ভেক্টর যোগ করলে সরণ পাওয়া যায় না; শেষ অবস্থান থেকে প্রাথমিক অবস্থান বিয়োগ করতে হয়।',
      realWorld:'GPS বা ত্রিমাত্রিক গতিতে শুরু ও শেষ অবস্থানের পার্থক্যই সরণ।',
      steps:['প্রাথমিক স্থানাঙ্ক P=(1,2,3) লেখো।','শেষ স্থানাঙ্ক Q=(4,0,5) লেখো।','প্রতিটি অক্ষ বরাবর Q−P করো।','ফলকে 3î−2ĵ+2k̂ হিসেবে প্রকাশ করো।'],
      optionAnalysis:['সঠিক: প্রতিটি চূড়ান্ত স্থানাঙ্ক থেকে প্রাথমিক স্থানাঙ্ক বিয়োগ।','স্থানাঙ্কগুলো যোগ করা হয়েছে, পার্থক্য নয়।','দিক উল্টো করে P−Q করা হয়েছে।','স্থানাঙ্ককে সরাসরি ভেক্টরের উপাংশ ধরে শুরু বিন্দু বাদ দেওয়া হয়েছে।']
    },[refs.vectors],media('v97-vector-displacement-grid','P থেকে Q সরণ','P(1,2,3) থেকে Q(4,0,5) পর্যন্ত তিন অক্ষে সরণের উপাংশ দেখানো।','প্রতিটি অক্ষে শেষ স্থানাঙ্ক থেকে শুরুর স্থানাঙ্ক বিয়োগ করতে হবে।',svg('Position vector and displacement','P and Q coordinates with x, y and z component differences','<path d="M100 225 L520 225 M100 225 L100 70 M100 225 L185 270" stroke="#334155" stroke-width="3" fill="none"/><path d="M170 190 L430 105" stroke="#2563eb" stroke-width="6"/><path d="M430 105 l-18 2 10 14" fill="#2563eb"/><circle cx="170" cy="190" r="8" fill="#0f766e"/><circle cx="430" cy="105" r="8" fill="#b45309"/><text x="145" y="177" font-size="20" fill="#0f766e">P (1,2,3)</text><text x="438" y="96" font-size="20" fill="#b45309">Q (4,0,5)</text><text x="250" y="145" font-size="18" fill="#1d4ed8">Δr = Q − P</text><text x="530" y="230" font-size="18" fill="#334155">x</text><text x="92" y="58" font-size="18" fill="#334155">z</text><text x="190" y="280" font-size="18" fill="#334155">y</text>')));

  add('cl-v97-vector-direction-cosines-001','phy1-02',6,3,'mathematical',
    'একটি ভেক্টরের উপাংশ (2, −3, 6)। ধনাত্মক x, y ও z অক্ষের সঙ্গে এর direction cosine যথাক্রমে কত?',
    ['2/7, −3/7, 6/7','2/6, −3/6, 6/6','2/49, −3/49, 6/49','2/7, 3/7, 6/7'],0,{
      objective:'ত্রিমাত্রিক ভেক্টরের মান ব্যবহার করে direction cosine নির্ণয় এবং চিহ্ন ব্যাখ্যা করা।',
      core:'Direction cosine হলো ভেক্টরের একক দিকের x, y, z উপাংশ; প্রতিটি উপাংশকে ভেক্টরের মান দিয়ে ভাগ করতে হয়।',
      analysis:'|A|=√(2²+(−3)²+6²)=√49=7। অতএব cosα=2/7, cosβ=−3/7 এবং cosγ=6/7। ঋণাত্মক y উপাংশের জন্য y-অক্ষের সঙ্গে কোণের cosine ঋণাত্মক।',
      formula:'cosα = A_x/|A|, cosβ = A_y/|A|, cosγ = A_z/|A|',
      misconception:'Direction cosine-এর হর 7, কারণ সেটিই ভেক্টরের মান; উপাংশের বর্গের যোগফল 49 দিয়ে ভাগ করা হয় না।',
      realWorld:'ত্রিমাত্রিক বল বা গতির দিককে অক্ষভিত্তিকভাবে প্রকাশ করতে direction cosine ব্যবহৃত হয়।',
      steps:['ভেক্টরের মান √(4+9+36)=7 বের করো।','x উপাংশ 2-কে 7 দিয়ে ভাগ করো।','y উপাংশ −3-কে 7 দিয়ে ভাগ করো।','z উপাংশ 6-কে 7 দিয়ে ভাগ করো এবং y-এর ঋণাত্মক চিহ্ন রাখো।'],
      optionAnalysis:['সঠিক: প্রতিটি signed component-কে magnitude দিয়ে ভাগ করা হয়েছে।','এখানে 6 ব্যবহার করা হয়েছে, কিন্তু ভেক্টরের মান 7।','ম্যাগনিচুডের বর্গ দিয়ে ভাগ করা হয়েছে।','y উপাংশের ঋণাত্মক চিহ্ন হারিয়েছে।']
    },[refs.vectors],media('v97-vector-direction-cosines','Direction cosine components','ভেক্টর A-এর x, y, z উপাংশ এবং অক্ষের সঙ্গে কোণ আলাদা করে দেখানো।','Direction cosine হলো সংশ্লিষ্ট signed component / vector magnitude।',svg('Direction cosine geometry','A three-dimensional direction vector with labeled x y z components and angles','<path d="M110 230 L520 230 M110 230 L110 45 M110 230 L210 275" stroke="#475569" stroke-width="3" fill="none"/><path d="M110 230 L390 100" stroke="#2563eb" stroke-width="6"/><path d="M390 100 l-18 2 9 14" fill="#2563eb"/><path d="M390 100 L390 230 L110 230" stroke="#0f766e" stroke-width="2" stroke-dasharray="7 6" fill="none"/><path d="M390 100 L390 160 L110 230" stroke="#b45309" stroke-width="2" stroke-dasharray="5 6" fill="none"/><text x="395" y="90" font-size="20" fill="#1d4ed8">A, |A|=7</text><text x="270" y="250" font-size="18" fill="#0f766e">Aₓ=2</text><text x="120" y="145" font-size="18" fill="#b45309">Aᵧ=−3</text><text x="90" y="32" font-size="18" fill="#475569">z</text><text x="530" y="235" font-size="18" fill="#475569">x</text><text x="215" y="285" font-size="18" fill="#475569">y</text>')));

  add('cl-v97-vector-dot-angle-001','phy1-02',7,3,'mathematical',
    'A = î + k̂ এবং B = î + ĵ হলে A ও B-এর মধ্যবর্তী ক্ষুদ্রতর কোণ কত?',
    ['30°','60°','90°','120°'],1,{
      objective:'Dot product থেকে দুই ভেক্টরের মধ্যবর্তী কোণ নির্ণয় করা।',
      core:'দুটি ভেক্টরের dot product তাদের মান এবং মধ্যবর্তী কোণের cosine-এর গুণফল।',
      analysis:'A·B=1। |A|=√2 এবং |B|=√2। তাই cosθ=1/(√2×√2)=1/2; ক্ষুদ্রতর কোণ θ=60°।',
      formula:'A·B = |A||B|cosθ',
      misconception:'Dot product 1 হলেই কোণ 0° নয়; ভেক্টর দুটির মান দিয়ে ভাগ করে cosine বের করতে হয়।',
      realWorld:'কাজ, projection ও দুটি দিকের মধ্যে কৌণিক সম্পর্ক বিশ্লেষণে dot product ব্যবহৃত হয়।',
      steps:['A·B=1×1+0×1+1×0=1।','|A|=√(1+1)=√2 নির্ণয় করো।','|B|=√(1+1)=√2 নির্ণয় করো।','cosθ=1/2 থেকে θ=60°।'],
      optionAnalysis:['cosθ-কে সরাসরি θ ধরা হয়েছে; 1/2-এর inverse cosine 60°।','সঠিক: cosθ=0.5 হলে ক্ষুদ্রতর কোণ 60°।','এটি dot product শূন্য হলে হতো।','এটি cosθ ঋণাত্মক হলে obtuse angle হতে পারত।']
    },[refs.products]);

  add('cl-v97-vector-work-perpendicular-001','phy1-02',7,2,'scenario',
    'একটি বস্তুর উপর F=(3î+4ĵ) N বল প্রয়োগ করা হলো এবং বস্তুটির সরণ s=(−4î+3ĵ) m। বলটির দ্বারা সম্পন্ন কাজ কত?',
    ['0 J','7 J','12 J','25 J'],0,{
      objective:'বল ও সরণের dot product দিয়ে কাজ নির্ণয় করা।',
      core:'ধ্রুব বলের দ্বারা কাজ হলো বল ভেক্টর ও সরণ ভেক্টরের dot product।',
      analysis:'W=F·s=3(−4)+4(3)=−12+12=0 J। দুটি ভেক্টর পরস্পর লম্ব, তাই সরণের দিকে বলের কোনো উপাংশ নেই।',
      formula:'W = F·s = |F||s|cosθ',
      misconception:'বল ও সরণের মান গুণ করলেই কাজ হয় না; তাদের মধ্যবর্তী কোণও গুরুত্বপূর্ণ।',
      realWorld:'বৃত্তীয় গতিতে কেন্দ্রাভিমুখী বল তাৎক্ষণিক সরণের লম্ব হওয়ায় কাজ করে না।',
      steps:['F-এর উপাংশ (3,4) শনাক্ত করো।','s-এর উপাংশ (−4,3) শনাক্ত করো।','Dot product 3×(−4)+4×3 হিসাব করো।','ফল শূন্য জুল লেখো।'],
      optionAnalysis:['সঠিক: দুটি উপাংশের অবদান পরস্পর বাতিল।','কেবল বলের উপাংশ যোগ করা হয়েছে।','একটি cross-term নেওয়া হয়েছে, অন্যটি বাদ।','বলের মান × সরণের মান করা হয়েছে, কোণ উপেক্ষা করে।']
    },[refs.products]);

  add('cl-v97-vector-torque-001','phy1-02',7,3,'mathematical',
    'একটি দরজার কবজা থেকে হাতলের অবস্থান ভেক্টর r=2î m এবং প্রয়োগকৃত বল F=3ĵ N। কবজার সাপেক্ষে torque কত?',
    ['6k̂ N m','−6k̂ N m','6ĵ N m','0 N m'],0,{
      objective:'Torque-কে position vector ও force-এর cross product হিসেবে নির্ণয় করা।',
      core:'Torque-এর দিক r×F দ্বারা নির্ধারিত হয়; এটি force-এর সমান্তরাল নয়, উভয়ের লম্ব অক্ষ বরাবর হয়।',
      analysis:'τ=r×F=(2î)×(3ĵ)=6(î×ĵ)=6k̂ N m। ডান-হাত নিয়মে +k̂ দিক।',
      formula:'τ = r × F',
      misconception:'F×r করলে চিহ্ন উল্টো হতো; torque-এর সংজ্ঞায় r×F ক্রমটি গুরুত্বপূর্ণ।',
      realWorld:'দরজার কবজা, রেঞ্চ এবং ঘূর্ণন অক্ষের সাপেক্ষে বলের ঘূর্ণন প্রভাব torque দিয়ে বোঝানো হয়।',
      steps:['r=2î এবং F=3ĵ লেখো।','মানের গুণফল 2×3=6 নির্ণয় করো।','î×ĵ=+k̂ right-hand cyclic rule প্রয়োগ করো।','দিকসহ 6k̂ N m লেখো।'],
      optionAnalysis:['সঠিক: î×ĵ=+k̂, তাই 6k̂।','এটি F×r করলে পাওয়া বিপরীত দিক।','cross product-এর দিক বাদ দিয়ে বলের দিক নেওয়া হয়েছে।','r ও F লম্ব, তাই torque সর্বাধিক; শূন্য নয়।']
    },[refs.products],media('v97-vector-torque-door','Door torque direction','কবজা থেকে হাতলের অবস্থান ভেক্টর এবং স্পর্শকীয় বল; torque অক্ষ দরজার তলের লম্ব।','Torque-এর দিক r × F, right-hand rule দিয়ে পাওয়া যায়।',svg('Torque at a door','A door pivot, radial position vector along x and applied force along y; torque points along z','<rect x="120" y="65" width="18" height="185" rx="5" fill="#64748b"/><rect x="138" y="70" width="330" height="175" rx="8" fill="#dbeafe" stroke="#2563eb" stroke-width="3"/><circle cx="138" cy="158" r="9" fill="#0f172a"/><circle cx="468" cy="158" r="9" fill="#0f172a"/><path d="M138 158 L458 158" stroke="#2563eb" stroke-width="5"/><path d="M458 158 l-17 -9 v18 z" fill="#2563eb"/><text x="270" y="145" font-size="19" fill="#1d4ed8">r</text><path d="M468 158 L468 55" stroke="#b45309" stroke-width="5"/><path d="M468 55 l-9 18 h18 z" fill="#b45309"/><text x="483" y="60" font-size="18" fill="#92400e">F</text><path d="M468 158 L515 158" stroke="#0f766e" stroke-width="4"/><path d="M515 158 l-14 -8 v16 z" fill="#0f766e"/><text x="520" y="180" font-size="18" fill="#0f766e">τ = r × F</text><text x="92" y="275" font-size="17" fill="#334155">hinge / pivot</text>')));

  add('cl-v97-vector-cross-order-001','phy1-02',7,3,'conceptual',
    'দুটি লম্ব একক ভেক্টরের জন্য î×ĵ এবং ĵ×î-এর সম্পর্ক কোনটি?',
    ['î×ĵ=+k̂ এবং ĵ×î=−k̂','দুটিই +k̂','দুটিই −k̂','î×ĵ=+k̂ এবং ĵ×î=+k̂'],0,{
      objective:'Cross product-এর anticommutative ধর্ম ও cyclic direction rule বোঝা।',
      core:'Cross product-এর ক্রম অদলবদল করলে ফলের মান সমান থাকে কিন্তু দিক বিপরীত হয়।',
      analysis:'Right-handed Cartesian basis-এ î×ĵ=+k̂। Anticommutative ধর্মে ĵ×î=−(î×ĵ)=−k̂।',
      formula:'A×B = −(B×A)', misconception:'Cross product commutative নয়; dot product-এর মতো ক্রম বদলালে একই ফল হয় না।',
      realWorld:'Torque, angular momentum এবং magnetic force-এর দিক নির্ধারণে cyclic order জরুরি।',
      steps:['Right-handed basis-এর cyclic order i→j→k মনে করো।','î×ĵ-তে cyclic order হওয়ায় +k̂।','ক্রম উল্টো করলে anticommutative property প্রয়োগ করো।','অতএব ĵ×î=−k̂।'],
      optionAnalysis:['সঠিক: ক্রম উল্টো হলে cross product-এর দিক উল্টো।','এটি commutative ধরে নেওয়ার ভুল।','দুই গুণফলের দিকই ভুল।','দ্বিতীয় গুণফলে ঋণাত্মক চিহ্ন বাদ।']
    },[refs.products],media('v97-cross-product-right-hand','Right-hand cross-product order','i cross j এবং j cross i-এর বিপরীত k দিক দেখানো।','Cross product-এর ক্রম বদলালে দিক বদলায়।',svg('Cross product order','Right handed axes with i cross j pointing positive z and j cross i pointing negative z','<path d="M95 230 L515 230 M95 230 L95 50 M95 230 L205 280" stroke="#475569" stroke-width="3"/><path d="M95 230 L330 230" stroke="#2563eb" stroke-width="5"/><path d="M330 230 l-16 -9 v18 z" fill="#2563eb"/><path d="M95 230 L95 78" stroke="#0f766e" stroke-width="5"/><path d="M95 78 l-9 16 h18 z" fill="#0f766e"/><path d="M95 230 L95 115" stroke="#b45309" stroke-width="4" stroke-dasharray="8 6"/><text x="340" y="237" font-size="20" fill="#1d4ed8">i</text><text x="75" y="66" font-size="20" fill="#0f766e">j</text><text x="110" y="105" font-size="18" fill="#b45309">+k (i×j)</text><text x="110" y="140" font-size="18" fill="#92400e">−k (j×i)</text><text x="225" y="280" font-size="17" fill="#475569">right-handed basis</text>')));

  add('cl-v97-vector-resultant-components-001','phy1-02',5,2,'mathematical',
    'একটি বস্তুর উপর 5 N পূর্বমুখী এবং 12 N উত্তরমুখী দুটি পরস্পর লম্ব বল কাজ করে। লব্ধি বলের মান কত?',
    ['13 N','7 N','17 N','60 N'],0,{
      objective:'লম্ব উপাংশ থেকে resultant vector-এর মান নির্ণয় করা।',
      core:'দুটি পরস্পর লম্ব ভেক্টরের লব্ধির মান Pythagorean theorem দিয়ে পাওয়া যায়।',
      analysis:'R=√(5²+12²)=√(25+144)=√169=13 N। 5+12 যোগ করা যাবে না কারণ বল দুটি একই সরলরেখায় নয়।',
      formula:'R = √(A_x² + A_y²), for perpendicular components',
      misconception:'লম্ব বলের মান সরাসরি যোগ বা বিয়োগ হয় না; উপাংশের বর্গের যোগফলের বর্গমূল নিতে হয়।',
      realWorld:'একই বস্তুর উপর পরস্পর লম্ব horizontal ও vertical force-এর net effect নির্ণয়।',
      steps:['পূর্বমুখী উপাংশ 5 N শনাক্ত করো।','উত্তরমুখী উপাংশ 12 N শনাক্ত করো।','R²=5²+12²=169 হিসাব করো।','R=13 N লেখো।'],
      optionAnalysis:['সঠিক: 5-12-13 সমকোণী ত্রিভুজ।','উপাংশের scalar difference নেওয়া হয়েছে।','উপাংশ সরাসরি যোগ করা হয়েছে।','দুটি বল গুণ করা হয়েছে; resultant নয়।']
    },[refs.vectors]);

  add('cl-v97-vector-field-divergence-linear-001','phy1-02',12,4,'mathematical',
    'F=(2x î + 3y ĵ + 4z k̂) ক্ষেত্রের divergence কত? (x,y,z)-এর মানের উপর কি ফল নির্ভর করে?',
    ['9; অবস্থান-নিরপেক্ষ ধ্রুবক','2x+3y+4z','9xyz','0; কারণ field-এর তিনটি component আছে'],0,{
      objective:'ত্রিমাত্রিক vector field-এর divergence হিসাব করা।',
      core:'Divergence হলো প্রতিটি vector component-কে তার নিজস্ব স্থানাঙ্ক অনুযায়ী আংশিক অন্তরীকরণ করে যোগফল।',
      analysis:'∇·F=∂(2x)/∂x+∂(3y)/∂y+∂(4z)/∂z=2+3+4=9। derivative নেওয়ার পর x, y, z আর থাকে না, তাই ফল ধ্রুবক।',
      formula:'∇·F = ∂F_x/∂x + ∂F_y/∂y + ∂F_z/∂z',
      misconception:'Field-এর components-কে যোগ করাই divergence নয়; প্রতিটি component-এর নিজস্ব coordinate অনুযায়ী derivative নিতে হয়।',
      realWorld:'কোনো field-এর ক্ষুদ্র অঞ্চলে নিট বহির্মুখী প্রবাহ প্রবণতা ব্যাখ্যা করতে divergence ব্যবহৃত হয়।',
      steps:['F_x=2x থেকে ∂F_x/∂x=2।','F_y=3y থেকে ∂F_y/∂y=3।','F_z=4z থেকে ∂F_z/∂z=4।','তিনটি derivative যোগ করে 9 পাও।'],
      optionAnalysis:['সঠিক: তিনটি partial derivative-এর যোগফল 9।','এটি derivative না নিয়ে component যোগ করেছে।','গুণফল তৈরি করা হয়েছে, divergence নয়।','তিনটি component থাকার কারণে divergence শূন্য হয় না।']
    },[refs.calculus]);

  add('cl-v97-vector-field-curl-linear-001','phy1-02',12,4,'mathematical',
    'F=(−2y î + 2x ĵ) ভেক্টর ক্ষেত্রের curl কত?',
    ['4k̂','−4k̂','2î+2ĵ','0'],0,{
      objective:'একটি সরল দ্বিমাত্রিক vector field-এর curl নির্ণয় করা।',
      core:'দ্বিমাত্রিক ক্ষেত্র (F_x,F_y,0)-এর curl কেবল k̂ উপাংশে থাকে: ∂F_y/∂x−∂F_x/∂y।',
      analysis:'∂F_y/∂x=∂(2x)/∂x=2 এবং ∂F_x/∂y=∂(−2y)/∂y=−2। তাই curl-এর z উপাংশ=2−(−2)=4।',
      formula:'(∇×F)_z = ∂F_y/∂x − ∂F_x/∂y',
      misconception:'দ্বিতীয় derivative-টি ঋণাত্মক; সেটি বিয়োগ করার সময় −(−2)=+2 হয়।',
      realWorld:'ঘূর্ণনধর্মী প্রবাহ বা velocity field-এর স্থানীয় rotational tendency বর্ণনায় curl কাজ করে।',
      steps:['F_x=−2y এবং F_y=2x শনাক্ত করো।','∂F_y/∂x=2 নির্ণয় করো।','∂F_x/∂y=−2 নির্ণয় করো।','2−(−2)=4; তাই curl=4k̂।'],
      optionAnalysis:['সঠিক: z-component 4 এবং direction +k̂।','দ্বিতীয় negative derivative-এর sign ভুল।','curl-কে vector gradient-এর মতো componentwise লেখা হয়েছে।','দুটি cross-partial শূন্য নয়।']
    },[refs.calculus],media('v97-curl-rotation-field','Two-dimensional rotational field','সমতলে counterclockwise ঘূর্ণনধর্মী field lines এবং কেন্দ্রের চারপাশে tangent vectors দেখানো।','Curl-এর z-উপাংশ positive হলে right-handed convention-এ rotation +k̂ দিকে।',svg('Rotational vector field','Circular counterclockwise arrows with local vectors tangent to circles','<circle cx="320" cy="150" r="76" fill="none" stroke="#94a3b8" stroke-width="2" stroke-dasharray="5 5"/><path d="M320 74 A76 76 0 0 1 396 150" stroke="#2563eb" stroke-width="5" fill="none"/><path d="M396 150 l-17 -5 3 18 z" fill="#2563eb"/><path d="M396 150 A76 76 0 0 1 320 226" stroke="#0f766e" stroke-width="5" fill="none"/><path d="M320 226 l5 -17 -18 3 z" fill="#0f766e"/><path d="M320 226 A76 76 0 0 1 244 150" stroke="#b45309" stroke-width="5" fill="none"/><path d="M244 150 l17 5 -3 -18 z" fill="#b45309"/><path d="M244 150 A76 76 0 0 1 320 74" stroke="#7c3aed" stroke-width="5" fill="none"/><path d="M320 74 l-5 17 18 -3 z" fill="#7c3aed"/><circle cx="320" cy="150" r="6" fill="#0f172a"/><text x="340" y="142" font-size="18" fill="#0f172a">+k̂</text><text x="240" y="270" font-size="18" fill="#334155">counterclockwise circulation</text>')));

  add('cl-v97-vector-gradient-linear-001','phy1-02',12,3,'mathematical',
    'φ(x,y,z)=3x−4y+12z একটি scalar field। এর gradient-এর মান কত এবং সর্বাধিক বৃদ্ধির দিক কোন একক ভেক্টর?',
    ['13; (3î−4ĵ+12k̂)/13','19; (3î−4ĵ+12k̂)/19','13; (3î+4ĵ+12k̂)/13','0; কোনো পরিবর্তন নেই'],0,{
      objective:'Linear scalar field-এর gradient এবং তার unit direction নির্ণয় করা।',
      core:'Gradient-এর উপাংশ হলো scalar field-এর coordinate-wise partial derivatives; gradient সর্বাধিক বৃদ্ধির দিক নির্দেশ করে।',
      analysis:'∇φ=3î−4ĵ+12k̂। এর মান √(9+16+144)=√169=13। তাই unit direction হলো gradient/13।',
      formula:'∇φ=(∂φ/∂x, ∂φ/∂y, ∂φ/∂z)',
      misconception:'Gradient-এর y component −4; partial derivative-এ মূল expression-এর চিহ্ন অপরিবর্তিত থাকে।',
      realWorld:'Temperature বা pressure field-এ সবচেয়ে দ্রুত বৃদ্ধির দিক gradient দেখায়।',
      steps:['φ-কে x অনুযায়ী differentiate করে 3 পাও।','y অনুযায়ী differentiate করে −4 পাও।','z অনুযায়ী differentiate করে 12 পাও।','ম্যাগনিচুড 13; unit direction-এ প্রতিটি component-কে 13 দিয়ে ভাগ করো।'],
      optionAnalysis:['সঠিক: gradient (3,−4,12), magnitude 13 এবং তার normalized direction।','19 হলো component-এর absolute value যোগ; Euclidean norm নয়।','y component-এর negative sign হারানো হয়েছে।','Gradient শূন্য নয়, তাই field-এর বৃদ্ধি-দিক আছে।']
    },[refs.gradient],media('v97-gradient-maximum-increase','Gradient direction','একটি 2D scalar-field contour এবং gradient vector দেখানো; তীর contour-এর লম্বভাবে দ্রুত বৃদ্ধির দিকে।','Gradient স্থানীয়ভাবে scalar field-এর সর্বাধিক বৃদ্ধির দিক নির্দেশ করে।',svg('Gradient and contours','Level curves with a gradient arrow perpendicular to contours','<ellipse cx="285" cy="150" rx="185" ry="88" fill="none" stroke="#94a3b8" stroke-width="2"/><ellipse cx="285" cy="150" rx="130" ry="62" fill="none" stroke="#64748b" stroke-width="2"/><ellipse cx="285" cy="150" rx="78" ry="37" fill="none" stroke="#475569" stroke-width="2"/><circle cx="285" cy="150" r="6" fill="#0f172a"/><path d="M285 150 L500 65" stroke="#2563eb" stroke-width="6"/><path d="M500 65 l-19 2 10 14 z" fill="#2563eb"/><text x="405" y="48" font-size="18" fill="#1d4ed8">∇φ (increase)</text><text x="295" y="174" font-size="17" fill="#334155">P</text><text x="90" y="270" font-size="17" fill="#475569">Level curves: φ constant</text>')));

  add('cl-v97-vector-polar-axial-001','phy1-02',3,2,'conceptual',
    'নিচের কোন জোড়ায় প্রথমটি polar vector এবং দ্বিতীয়টি axial vector?',
    ['সরণ; torque','torque; সরণ','কৌণিক ভরবেগ; সরণ','ক্ষেত্রফল; বেগ'],0,{
      objective:'Polar ও axial vector-এর ভৌত উদাহরণ আলাদা করা।',
      core:'Polar vector সাধারণত অবস্থান বা সরণের মতো translation-সম্পর্কিত; axial vector ঘূর্ণন বা cross product-এর সঙ্গে যুক্ত।',
      analysis:'সরণ একটি polar vector। Torque= r×F একটি axial vector; একইভাবে angular momentum axial vector।',
      formula:'τ = r × F (axial vector)',
      misconception:'প্রতিটি vector-ই polar নয়; cross product-জাত ঘূর্ণন সংশ্লিষ্ট রাশি axial vector হতে পারে।',
      realWorld:'Mechanics-এ সরণ, বেগ, বল এবং torque, angular momentum-এর vector character আলাদা করে দেখা হয়।',
      steps:['সরণের উৎস ও সংজ্ঞা মনে করো: অবস্থান পরিবর্তন, polar।','Torque-এর সংজ্ঞা r×F শনাক্ত করো।','Cross product-এর ফল axial character বহন করে।','সঠিক জোড়া নির্বাচন করো।'],
      optionAnalysis:['সঠিক: সরণ polar, torque axial।','ক্রম উল্টো হয়েছে।','প্রথমটি axial, দ্বিতীয়টি polar—চাওয়া ক্রম নয়।','ক্ষেত্রফলও axial হতে পারে ক্ষেত্রভেদে; বেগ polar, কিন্তু জোড়ার প্রথমটি স্পষ্ট নয়।']
    },[refs.products]);

  // CHEMISTRY 1st Paper — Chapter 2: Qualitative Chemistry (12 distinct questions)
  add('cl-v97-qchem-rutherford-alpha-scattering-001','chem1-02',0,2,'conceptual',
    'Rutherford-এর gold-foil পরীক্ষায় অধিকাংশ α-কণা প্রায় সোজা চলে যায়, কিন্তু অল্প কয়েকটি বড় কোণে বেঁকে যায়। কোন সিদ্ধান্তটি দুই পর্যবেক্ষণই ব্যাখ্যা করে?',
    ['পরমাণুর অধিকাংশ স্থান ফাঁকা; ধনাত্মক আধান ও অধিকাংশ ভর ক্ষুদ্র কেন্দ্রে কেন্দ্রীভূত','পরমাণুর সব ভর সমভাবে ছড়িয়ে আছে','ইলেকট্রনই পরমাণুর কেন্দ্রে ঘনভাবে থাকে','α-কণার কোনো ধনাত্মক আধান নেই'],0,{
      objective:'Scattering evidence থেকে Rutherford nuclear model-এর সিদ্ধান্ত গ্রহণ।',
      core:'অধিকাংশ কণার সোজা চলে যাওয়া অধিকাংশ পরমাণু-আয়তন ফাঁকা থাকার সঙ্গে সঙ্গতিপূর্ণ; অল্প কয়েকটির বড় deflection ক্ষুদ্র, ঘন, ধনাত্মক nucleus-এর প্রমাণ।',
      analysis:'ধনাত্মক α-কণা nucleus-এর ধনাত্মক আধানের কাছ দিয়ে গেলে তীব্র electrostatic repulsion-এ বড় কোণে বেঁকে যায়। এমন ঘন অঞ্চল খুব ছোট হওয়ায় অধিকাংশ কণা সেটির কাছাকাছি যায় না।',
      formula:'Qualitative evidence: mostly straight paths + rare large-angle scattering',
      misconception:'বড় কোণে বেঁকে যাওয়া মানে nucleus বড় নয়; বিরল scattering বরং nucleus-এর আকার পরমাণুর তুলনায় ক্ষুদ্র দেখায়।',
      realWorld:'Scattering experiment দিয়ে পদার্থের অভ্যন্তরীণ গঠন অনুমান করার এটি ঐতিহাসিক উদাহরণ।',
      steps:['অধিকাংশ α-কণা সোজা গেছে—এটি ফাঁকা স্থানের প্রমাণ।','কিছু α-কণা তীব্রভাবে বেঁকেছে—কেন্দ্রে শক্তিশালী repulsion আছে।','এটি ক্ষুদ্র ধনাত্মক nucleus-এর সঙ্গে মেলে।','দুই পর্যবেক্ষণ একত্রে nuclear model সমর্থন করে।'],
      optionAnalysis:['সঠিক: উভয় পর্যবেক্ষণকে একই nuclear model ব্যাখ্যা করে।','সমভাবে ছড়ানো আধান হলে বিরল তীব্র deflection ব্যাখ্যা কঠিন।','ইলেকট্রন nucleus-এর কেন্দ্রে থাকে না।','α-কণা helium nucleus; এর ধনাত্মক আধান আছে।']
    },[refs.atomicTheory],media('v97-rutherford-scattering','Rutherford alpha scattering','পাতলা foil দিয়ে অধিকাংশ alpha কণা সোজা যায়; অল্প কিছু nucleus-এর কাছে বেঁকে যায় বা ফিরে আসে।','বড় কোণের বিচ্যুতি বিরল কারণ nucleus খুব ছোট, কিন্তু ঘন ও ধনাত্মক।',svg('Rutherford scattering evidence','Alpha particle paths passing a thin foil with mostly straight trajectories and a few deflected near a small nucleus','<rect x="315" y="40" width="10" height="220" fill="#cbd5e1" stroke="#64748b"/><circle cx="320" cy="150" r="14" fill="#f59e0b" stroke="#92400e" stroke-width="2"/><g stroke="#2563eb" stroke-width="3" fill="none"><path d="M40 85 L315 85 L610 85"/><path d="M40 125 L315 125 L610 125"/><path d="M40 175 L315 175 L610 175"/><path d="M40 205 L315 205 L605 224"/><path d="M40 145 L270 145 Q300 145 285 105 L235 55"/></g><path d="M235 55 l3 17 15 -10 z" fill="#2563eb"/><path d="M40 105 L305 145 Q315 150 305 158 L205 205" stroke="#b45309" stroke-width="4" fill="none"/><text x="335" y="155" font-size="18" fill="#92400e">tiny + nucleus</text><text x="40" y="35" font-size="18" fill="#1d4ed8">α particles</text><text x="365" y="280" font-size="17" fill="#475569">most pass through; a few deflect sharply</text>')));

  add('cl-v97-qchem-bohr-limitation-001','chem1-02',6,3,'conceptual',
    'Bohr-এর energy-level ধারণা হাইড্রোজেনের রেখা বর্ণালি ব্যাখ্যা করে। সাধারণ বহু-ইলেকট্রন পরমাণুর জটিল বর্ণালি ব্যাখ্যায় এই মডেল একা যথেষ্ট নয় কেন?',
    ['বহু-ইলেকট্রন পরমাণুতে electron–electron interaction থাকায় hydrogen-এর মতো একক-electron energy model যথেষ্ট নয়','Bohr model-এ কোনো energy level নেই','Bohr model কেবল নিউক্লিয়াসের আকার ব্যাখ্যা করে','বহু-ইলেকট্রন পরমাণু আলো শোষণ বা নির্গত করে না'],0,{
      objective:'Bohr model-এর explanatory scope ও limitation চিহ্নিত করা।',
      core:'Bohr model সবচেয়ে সফল hydrogen ও hydrogen-like এক-ইলেকট্রন species-এর ক্ষেত্রে; বহু-ইলেকট্রন পরমাণুতে electron–electron repulsion ও shielding গুরুত্বপূর্ণ।',
      analysis:'একাধিক electron থাকলে প্রতিটি electron-এর energy অন্য electron-এর অবস্থান ও interaction-এর উপরও নির্ভর করে। তাই সরল hydrogen-like energy levels দিয়ে তাদের সম্পূর্ণ spectra ব্যাখ্যা হয় না; আধুনিক quantum mechanics প্রয়োজন।',
      formula:'Scope: one-electron systems (H, He⁺, Li²⁺) vs multi-electron systems',
      misconception:'Bohr model একেবারে অকেজো নয়; hydrogen-like species-এর জন্য এটি কার্যকর, কিন্তু universal atomic model নয়।',
      realWorld:'Atomic spectra ব্যাখ্যার ইতিহাসে model-এর সীমা বোঝা scientific model উন্নয়নের উদাহরণ।',
      steps:['Hydrogen atom-এ একটি electron আছে।','Multi-electron atom-এ electron–electron repulsion যোগ হয়।','Shielding ও subshell effects energy বদলায়।','তাই simple Bohr picture একা যথেষ্ট নয়।'],
      optionAnalysis:['সঠিক: বহু-electron interaction simple one-electron model-এ নেই।','Bohr model-এ quantized energy levels-ই মূল ধারণা।','Bohr model কেবল nucleus-এর আকার নিয়ে নয়।','পরমাণু আলো শোষণ ও নির্গত করে; সেটিই line spectrum-এর উৎস।']
    },[refs.bohr]);

  add('cl-v97-qchem-em-spectrum-frequency-001','chem1-02',4,2,'mathematical',
    'একটি সবুজ আলোয়ের wavelength 600 nm। শূন্যস্থানে আলোর বেগ 3.0×10⁸ m s⁻¹ হলে এর frequency কত?',
    ['5.0×10¹⁴ Hz','1.8×10¹⁷ Hz','2.0×10⁻¹⁵ Hz','5.0×10⁻⁷ Hz'],0,{
      objective:'Wavelength-কে SI এককে রূপান্তর করে electromagnetic wave frequency নির্ণয় করা।',
      core:'শূন্যস্থানে electromagnetic radiation-এর জন্য c=λν। Wavelength বাড়লে frequency কমে।',
      analysis:'600 nm=600×10⁻⁹ m=6.0×10⁻⁷ m। ν=c/λ=(3.0×10⁸)/(6.0×10⁻⁷)=0.5×10¹⁵=5.0×10¹⁴ Hz।',
      formula:'c = λν',
      misconception:'nm থেকে m করতে 10⁻⁹ দিয়ে গুণ করতে হয়; 600 nm-কে 600 m ধরা যাবে না।',
      realWorld:'Spectroscopy-তে wavelength ও frequency দিয়ে আলোর শক্তি এবং spectral region নির্ধারণ করা হয়।',
      steps:['Wavelength 600 nm-কে 6.0×10⁻⁷ m করো।','ν=c/λ সূত্র লেখো।','3.0×10⁸-কে 6.0×10⁻⁷ দিয়ে ভাগ করো।','5.0×10¹⁴ Hz-এ scientific notation লেখো।'],
      optionAnalysis:['সঠিক: c/λ হিসাবের ফল 5.0×10¹⁴ Hz।','c×λ করা হয়েছে, division নয়।','একক ও ঘাতের দিক ভুল।','wavelength-কে frequency একক ছাড়া রেখে দেওয়া হয়েছে।']
    },[refs.spectroscopy],media('v97-em-spectrum-wavelength','Visible light wavelength and frequency','দৃশ্যমান আলোর বর্ণালি বরাবর wavelength ও frequency-এর বিপরীত সম্পর্ক দেখানো।','c স্থির হলে wavelength কমলে frequency বাড়ে।',svg('Electromagnetic wavelength and frequency','A visible spectrum strip with wavelength arrow decreasing and frequency arrow increasing','<defs><linearGradient id="vis" x1="0" x2="1"><stop offset="0" stop-color="#7c3aed"/><stop offset="0.2" stop-color="#2563eb"/><stop offset="0.4" stop-color="#06b6d4"/><stop offset="0.55" stop-color="#16a34a"/><stop offset="0.72" stop-color="#eab308"/><stop offset="0.86" stop-color="#f97316"/><stop offset="1" stop-color="#dc2626"/></linearGradient></defs><rect x="80" y="95" width="480" height="65" rx="8" fill="url(#vis)"/><path d="M80 205 L560 205" stroke="#b45309" stroke-width="4"/><path d="M80 205 l18 -8 v16 z" fill="#b45309"/><text x="80" y="235" font-size="18" fill="#92400e">λ increases →</text><path d="M560 65 L80 65" stroke="#2563eb" stroke-width="4"/><path d="M80 65 l18 -8 v16 z" fill="#2563eb"/><text x="340" y="45" font-size="18" fill="#1d4ed8">← frequency increases</text><text x="90" y="185" font-size="17" fill="#334155">shorter λ / higher ν</text><text x="410" y="185" font-size="17" fill="#334155">longer λ / lower ν</text>')));

  add('cl-v97-qchem-uv-fluorescence-security-001','chem1-02',7,3,'scenario',
    'একটি নিরাপত্তা-চিহ্ন সাধারণ আলোতে প্রায় অদৃশ্য, কিন্তু UV lamp-এর নিচে দৃশ্যমান আলো ছড়ায়। কোন প্রক্রিয়াটি এই fluorescence ব্যাখ্যা করে?',
    ['চিহ্ন UV photon শোষণ করে এবং পরে তুলনামূলক কম শক্তির দৃশ্যমান photon নির্গত করে','চিহ্ন UV-কে প্রতিফলিত করে, তাই একই UV আলো দেখা যায়','চিহ্ন দৃশ্যমান আলোকে সম্পূর্ণ শোষণ করে','UV আলো পদার্থকে স্থায়ীভাবে radioactive করে'],0,{
      objective:'UV excitation ও visible fluorescence-এর শক্তি-পরিবর্তন ব্যাখ্যা করা।',
      core:'Fluorescent পদার্থ উচ্চ শক্তির UV photon শোষণ করে excited state-এ যায়, তারপর কিছু শক্তি হারিয়ে নিম্ন শক্তির দৃশ্যমান photon নির্গত করতে পারে।',
      analysis:'নির্গত photon-এর energy শোষিত photon-এর চেয়ে কম হওয়ায় সাধারণত wavelength দীর্ঘ হয়। UV lamp বন্ধ করলে emission প্রায় সঙ্গে সঙ্গে থেমে যায়—এটি phosphorescence-এর দীর্ঘস্থায়ী afterglow থেকে আলাদা।',
      formula:'E = hc/λ; lower emitted photon energy → longer emitted wavelength',
      misconception:'Fluorescence-এ দেখা আলো একই UV photon-এর সরাসরি প্রতিফলন নয়; পদার্থ আলো শোষণ করে নতুন wavelength-এ emission করে।',
      realWorld:'Banknote, identity document এবং security label-এ fluorescent ink/marking নকল শনাক্তে সহায়তা করে।',
      steps:['UV photon দ্বারা পদার্থের electron excited হয়।','Excited state থেকে কিছু শক্তি non-radiative ভাবে হারায়।','পরে নিম্ন শক্তির দৃশ্যমান photon নির্গত হয়।','UV source সরালে তাৎক্ষণিক fluorescence থেমে যায়।'],
      optionAnalysis:['সঠিক: absorption followed by lower-energy visible emission।','সরাসরি reflection হলে আলো UV-ই থাকত, দৃশ্যমান emission নয়।','দৃশ্যমান আলো নির্গত হচ্ছে, শোষিত নয়।','UV fluorescence radioactive activation নয়।']
    },[refs.spectroscopy]);

  add('cl-v97-qchem-ir-vibration-001','chem1-02',8,3,'conceptual',
    'IR spectroscopy-তে একটি অণুর নির্দিষ্ট bond-এর absorption peak দেখা যায় কেন?',
    ['IR photon শোষণে bond-এর vibrational motion-এর শক্তিস্তরের মধ্যে transition হতে পারে','IR photon সবসময় nucleus ভেঙে ফেলে','IR radiation কেবল electron-কে nucleus থেকে বিচ্ছিন্ন করে','সব bond একই frequency-তে কম্পিত হয়'],0,{
      objective:'IR spectroscopy-তে molecular vibration ও bond-specific absorption-এর সম্পর্ক বোঝা।',
      core:'IR radiation-এর energy অনেক molecular vibration transition-এর সঙ্গে মেলে। বিভিন্ন bond-এর strength ও atomic mass আলাদা হওয়ায় vibrational frequency-ও আলাদা হয়।',
      analysis:'সরল harmonic oscillator approximation-এ vibrational frequency bond-এর force constant-এর বর্গমূলের সমানুপাতিক এবং reduced mass-এর বর্গমূলের ব্যস্তানুপাতিক। তাই বিভিন্ন bond ভিন্ন IR frequency-তে absorb করে।',
      formula:'ν ∝ √(k/μ)  (harmonic oscillator model)',
      misconception:'সব কম্পন IR-active নয়; vibration-এর সময় dipole moment পরিবর্তন হওয়া প্রয়োজন।',
      realWorld:'IR spectroscopy functional group শনাক্ত ও অজানা যৌগের গঠন বিশ্লেষণে ব্যবহৃত হয়।',
      steps:['IR photon-এর energy molecular vibration-এর সঙ্গে সামঞ্জস্যপূর্ণ হতে পারে।','Bond stretching বা bending mode বিবেচনা করো।','Bond strength ও reduced mass ভিন্ন হলে frequency ভিন্ন হয়।','Absorption pattern থেকে molecular structure সম্পর্কে ধারণা পাওয়া যায়।'],
      optionAnalysis:['সঠিক: IR absorption molecular vibrational transition-এর কারণে।','IR photon সাধারণত chemical bond vibration excite করে; nucleus ভাঙে না।','এটি ionization ঘটানোর সাধারণ mechanism নয়।','Bond-এর force constant ও mass ভিন্ন, তাই frequency এক নয়।']
    },[refs.spectroscopy]);

  add('cl-v97-qchem-mri-principle-001','chem1-02',9,3,'conceptual',
    'MRI-তে শক্তিশালী magnetic field ও radiofrequency pulse একসঙ্গে কীভাবে signal তৈরিতে ভূমিকা রাখে?',
    ['Hydrogen nuclei-এর spin আংশিকভাবে field-এর সঙ্গে align হয়; RF pulse তাদের excitation ঘটায় এবং relaxation-এর signal receiver-এ ধরা পড়ে','X-ray photon হাড়ের মধ্য দিয়ে গিয়ে MRI image তৈরি করে','Radioactive tracer থেকে gamma ray নির্গত হয়ে image তৈরি করে','চৌম্বক ক্ষেত্র proton-কে স্থায়ীভাবে ionize করে'],0,{
      objective:'MRI-র proton alignment, RF excitation ও relaxation signal-এর মৌলিক ধাপ ব্যাখ্যা করা।',
      core:'শরীরের hydrogen proton-এর magnetic moment শক্তিশালী field-এ আংশিকভাবে align হয়। RF pulse resonance-এ তাদের energy state/orientation বদলায়; pulse বন্ধ হলে relaxation-এর সময় signal তৈরি হয়।',
      analysis:'Receiver coil থেকে পাওয়া signal-এর spatial encoding ও processing দিয়ে image তৈরি হয়। MRI ionizing X-ray নয়; এতে strong magnetic field ও radiofrequency ব্যবহৃত হয়।',
      formula:'Conceptual sequence: B₀ alignment → RF excitation → relaxation signal → spatial reconstruction',
      misconception:'MRI-তে X-ray বা radioactive tracer অপরিহার্য নয়; MRI এবং CT আলাদা imaging technique।',
      realWorld:'মস্তিষ্ক, মেরুদণ্ড, জয়েন্ট ও soft tissue-এর বিস্তারিত image পেতে MRI ব্যবহৃত হয়।',
      steps:['Strong B₀ field hydrogen proton-এর magnetic moment-কে bias করে।','RF pulse resonant frequency-তে energy সরবরাহ করে।','Pulse বন্ধ হলে longitudinal/transverse magnetization relax করে।','Coil signal গ্রহণ করে; spatial encoding থেকে image reconstruct হয়।'],
      optionAnalysis:['সঠিক: alignment, RF excitation ও relaxation signal—MRI-র মূল sequence।','এটি X-ray radiography/CT ধারণার সঙ্গে সম্পর্কিত।','এটি nuclear medicine-এর tracer-based imaging-এর মতো।','Magnetic resonance ionization নয়।']
    },[refs.mri]);

  add('cl-v97-qchem-ksp-precipitation-001','chem1-02',11,4,'mathematical',
    'একটি দ্রবণে BaSO₄-এর জন্য [Ba²⁺]=1.0×10⁻⁵ M এবং [SO₄²⁻]=2.0×10⁻⁵ M। যদি Ksp=1.1×10⁻¹⁰ হয়, মিশ্রণের পর কোন সিদ্ধান্ত সঠিক?',
    ['Qsp=2.0×10⁻¹⁰ > Ksp, তাই BaSO₄ precipitate শুরু হবে','Qsp=2.0×10⁻¹⁰ < Ksp, তাই দ্রবণ unsaturated থাকবে','Qsp=3.0×10⁻⁵, তাই precipitate হবে না','Ksp-এর সঙ্গে concentration তুলনা করা যায় না'],0,{
      objective:'Ionic product Qsp ও solubility product Ksp তুলনা করে precipitation predict করা।',
      core:'BaSO₄-এর জন্য Qsp=[Ba²⁺][SO₄²⁻]। Qsp>Ksp হলে দ্রবণ supersaturated এবং precipitation thermodynamically favoured।',
      analysis:'Qsp=(1.0×10⁻⁵)(2.0×10⁻⁵)=2.0×10⁻¹⁰। এটি 1.1×10⁻¹⁰ থেকে বেশি; তাই BaSO₄ precipitate গঠন শুরু হবে এবং equilibrium-এ Qsp কমে Ksp-এর সঙ্গে সামঞ্জস্যে আসবে।',
      formula:'BaSO₄(s) ⇌ Ba²⁺ + SO₄²⁻; Ksp=[Ba²⁺][SO₄²⁻]',
      misconception:'Qsp হলো বর্তমান concentration থেকে তৈরি reaction quotient; Ksp নির্দিষ্ট তাপমাত্রায় equilibrium constant। Qsp-কে Ksp-এর সঙ্গে তুলনা করতে হয়।',
      realWorld:'পানির hardness, scale formation এবং অজানা ion-এর precipitation analysis-এ Ksp/Qsp তুলনা কাজে লাগে।',
      steps:['BaSO₄ dissolution equation লেখো।','Qsp-তে দুই ion concentration গুণ করো।','2.0×10⁻¹⁰-কে Ksp=1.1×10⁻¹⁰-এর সঙ্গে তুলনা করো।','Qsp>Ksp হওয়ায় precipitation হবে বলো।'],
      optionAnalysis:['সঠিক: ionic product Ksp-কে ছাড়িয়েছে, তাই precipitation শুরু।','এখানে comparison direction উল্টো করা হয়েছে।','Concentration যোগ করা হয়েছে, solubility product-এর product expression নয়।','Qsp-Ksp তুলনাই precipitation prediction-এর মৌলিক পদ্ধতি।']
    },[refs.ksp],media('v97-ksp-qsp-threshold','Qsp versus Ksp','Qsp<Ksp undersaturated, Qsp=Ksp saturated equilibrium, Qsp>Ksp supersaturated precipitation regions.','একই তাপমাত্রায় ionic product Qsp ও Ksp তুলনা করে precipitation নির্ধারণ করা হয়।',svg('Qsp and Ksp comparison','Three zones below, at, and above the solubility product threshold','<path d="M100 230 L550 230" stroke="#475569" stroke-width="3"/><path d="M100 230 L100 55" stroke="#475569" stroke-width="3"/><rect x="102" y="90" width="140" height="140" fill="#d1fae5"/><rect x="242" y="90" width="140" height="140" fill="#dbeafe"/><rect x="382" y="90" width="166" height="140" fill="#fee2e2"/><path d="M382 68 L382 245" stroke="#b91c1c" stroke-width="3" stroke-dasharray="6 5"/><text x="145" y="125" font-size="20" fill="#065f46">Qsp&lt;Ksp</text><text x="270" y="125" font-size="19" fill="#1d4ed8">Qsp=Ksp</text><text x="410" y="125" font-size="20" fill="#991b1b">Qsp&gt;Ksp</text><text x="135" y="170" font-size="16" fill="#065f46">unsaturated</text><text x="270" y="170" font-size="16" fill="#1d4ed8">saturated</text><text x="410" y="170" font-size="16" fill="#991b1b">precipitation</text><text x="386" y="50" font-size="17" fill="#991b1b">Ksp threshold</text><text x="435" y="270" font-size="17" fill="#334155">Qsp →</text>')));

  add('cl-v97-qchem-flame-sodium-interference-001','chem1-02',10,3,'experiment',
    'Flame test-এ potassium-এর pale-lilac শিখা পর্যবেক্ষণ করতে sodium contamination সমস্যা করলে cobalt-blue glass ব্যবহারের উদ্দেশ্য কী?',
    ['তীব্র হলুদ sodium emission অনেকটা শোষণ/আড়াল করে potassium-এর lilac emission পর্যবেক্ষণ সহজ করা','potassium-কে sodium-এ রূপান্তর করা','শিখার তাপমাত্রা কমিয়ে সব emission বন্ধ করা','সব দৃশ্যমান আলোকে UV-তে রূপান্তর করা'],0,{
      objective:'Flame test-এ sodium-এর spectral interference কমানোর কৌশল ব্যাখ্যা করা।',
      core:'Sodium-এর তীব্র হলুদ emission সহজেই অন্য দুর্বল flame colour ঢেকে দিতে পারে। Cobalt-blue glass sodium-এর হলুদ আলো অনেকটা filter করে potassium-এর pale-lilac রং দেখতে সাহায্য করে।',
      analysis:'এটি sample-এর রাসায়নিক রূপান্তর নয়, optical filtering। উপযুক্ত cobalt glass দিয়ে sodium-এর emission attenuate করা হয়, ফলে potassium line/colour তুলনামূলক দৃশ্যমান হয়।',
      formula:'Observation method: spectral interference reduction by optical filter',
      misconception:'Cobalt glass potassium-কে রং দেয় না; এটি sodium-এর তীব্র yellow emission কমিয়ে পর্যবেক্ষণ সহজ করে।',
      realWorld:'Qualitative flame test-এ একই নমুনায় একাধিক metal ion থাকলে spectral interference কমাতে ব্যবহৃত।',
      steps:['Na-এর yellow emission তীব্র হতে পারে তা চিহ্নিত করো।','এটি K-এর pale-lilac emission ঢেকে দিতে পারে।','Cobalt-blue glass দিয়ে হলুদ অংশ attenuate করো।','তারপর potassium-এর lilac colour আরও স্পষ্ট কি না পর্যবেক্ষণ করো।'],
      optionAnalysis:['সঠিক: optical filter দিয়ে sodium interference কমানো হয়।','এটি রাসায়নিক বিক্রিয়া বা transmutation নয়।','শিখার তাপমাত্রা নিয়ন্ত্রণের উপায় নয়।','Glass visible emission-কে UV-তে রূপান্তর করে না।']
    },[refs.analytical]);

  add('cl-v97-qchem-ammonium-identification-001','chem1-02',12,2,'experiment',
    'একটি লবণের দ্রবণকে NaOH দিয়ে গরম করলে নির্গত গ্যাস সিক্ত লাল litmus কাগজকে নীল করল। কোন আয়নের উপস্থিতি সবচেয়ে ভালোভাবে নির্দেশিত?',
    ['NH₄⁺','Cl⁻','SO₄²⁻','NO₃⁻'],0,{
      objective:'Ammonium ion-এর qualitative test ও উৎপন্ন ammonia শনাক্ত করা।',
      core:'Ammonium salt-এ শক্তিশালী base যোগ করে গরম করলে ammonia gas নির্গত হয়; এটি ক্ষারীয় হওয়ায় damp red litmus নীল করে।',
      analysis:'NH₄⁺ + OH⁻ → NH₃(g) + H₂O। গ্যাসটি damp indicator-এ পরীক্ষা করা জরুরি; শুকনো litmus-এ পরিবর্তন ধীর/অস্পষ্ট হতে পারে।',
      formula:'NH₄⁺(aq) + OH⁻(aq) → NH₃(g) + H₂O(l)',
      misconception:'লাল litmus নীল হওয়া ammonia-র basic character দেখায়; chloride বা sulfate নিজেরা এমন গ্যাস তৈরি করে না।',
      realWorld:'অজানা ammonium salt-এর প্রাথমিক qualitative identification।',
      steps:['নমুনায় aqueous NaOH যোগ করো।','সতর্কভাবে গরম করে গ্যাস উৎপন্ন করো।','গ্যাসের মুখে damp red litmus ধরো।','লাল থেকে নীল হলে ammonia, তাই NH₄⁺-এর পক্ষে প্রমাণ।'],
      optionAnalysis:['সঠিক: NH₄⁺ ও OH⁻ থেকে NH₃ তৈরি হয়।','Cl⁻ দিয়ে ammonia উৎপন্ন হয় না।','SO₄²⁻ এই test-এর gas source নয়।','NO₃⁻-এর জন্য ভিন্ন confirmatory test দরকার।']
    },[refs.analytical]);

  add('cl-v97-qchem-zinc-aluminium-amphoteric-001','chem1-02',12,4,'experiment',
    'দুটি সাদা hydroxide precipitate-ই অতিরিক্ত NaOH-এ দ্রবীভূত হলো। এদের মধ্যে Zn²⁺-কে Al³⁺ থেকে আলাদা করতে অতিরিক্ত aqueous NH₃ যোগ করলে কোন পর্যবেক্ষণটি সবচেয়ে সহায়ক?',
    ['Zn(OH)₂ অতিরিক্ত NH₃-এ complex গঠন করে দ্রবীভূত হতে পারে; Al(OH)₃ সাধারণত থাকে','Al(OH)₃ সবসময় deep-blue হয়, Zn(OH)₂ লাল হয়','দুটিই NH₃-এ একইভাবে দ্রবীভূত হয়','NH₃ যোগে দুই hydroxide-ই ধাতুতে পরিণত হয়'],0,{
      objective:'Amphoteric hydroxide-এর NaOH আচরণ ও zinc-ammonia complex দিয়ে cation পৃথক করা।',
      core:'Zn(OH)₂ অতিরিক্ত ammonia-তে tetraamminezinc(II) complex গঠন করে দ্রবীভূত হতে পারে; Al(OH)₃ অতিরিক্ত NH₃-এ সাধারণত অদ্রবীভূত থাকে।',
      analysis:'প্রথমে excess NaOH-এ উভয় hydroxide dissolve হওয়া amphoteric character দেখায়। পরে excess NH₃-তে zinc complex formation Zn²⁺-কে সমর্থন করে; aluminium hydroxide পৃথকভাবে থাকে।',
      formula:'Zn²⁺ + 4NH₃ ⇌ [Zn(NH₃)₄]²⁺',
      misconception:'শুধু excess NaOH-এ দ্রবীভূত হওয়া দিয়ে Zn²⁺ ও Al³⁺ আলাদা করা যায় না; দ্বিতীয় reagent ও observation দরকার।',
      realWorld:'Qualitative cation analysis-এ sequential reagent test দিয়ে অনুরূপ সাদা precipitate আলাদা করা হয়।',
      steps:['NaOH-এ উভয় সাদা precipitate দ্রবীভূত হওয়ার তথ্য নাও।','আলাদা অংশে অতিরিক্ত aqueous NH₃ যোগ করো।','Zn²⁺ থাকলে ammine complex গঠনে precipitate dissolve করতে পারে।','Al(OH)₃ অবশিষ্ট থাকলে Al³⁺-এর সঙ্গে মেলে।'],
      optionAnalysis:['সঠিক: zinc ammine complex গঠন করে; aluminium hydroxide সাধারণত excess ammonia-তে দ্রবীভূত হয় না।','রংগুলো ভুল; উভয়ের hydroxide সাধারণত সাদা।','এটাই পৃথকীকরণের তথ্যকে অস্বীকার করে; আচরণ এক নয়।','এটি aqueous complexation, metal reduction নয়।']
    },[refs.analytical]);

  add('cl-v97-qchem-paper-chromatography-rf-001','chem1-02',17,3,'mathematical',
    'Paper chromatography-তে একটি pigment starting line থেকে 3.2 cm এবং solvent front 8.0 cm অতিক্রম করেছে। pigment-এর Rf কত?',
    ['0.40','2.50','4.80','0.32'],0,{
      objective:'Chromatography-তে solute ও solvent-front distance থেকে Rf নির্ণয় করা।',
      core:'Rf হলো baseline থেকে solute spot-এর দূরত্বকে একই baseline থেকে solvent front-এর দূরত্ব দিয়ে ভাগ করলে পাওয়া dimensionless ratio।',
      analysis:'Rf=3.2/8.0=0.40। একই stationary/mobile phase ও solvent condition-এ Rf তুলনা করা হয়; এটি এককবিহীন এবং সাধারণভাবে 0 থেকে 1-এর মধ্যে।',
      formula:'Rf = distance travelled by solute / distance travelled by solvent front',
      misconception:'Rf-এর numerator solvent front নয়; pigment spot কত দূর গেছে সেটি numerator।',
      realWorld:'Ink, food dye, plant pigment বা mixture-এর component তুলনা ও প্রাথমিক শনাক্তে paper chromatography ব্যবহৃত হয়।',
      steps:['Starting line-কে zero baseline ধরো।','Pigment spot-এর দূরত্ব 3.2 cm লেখো।','Solvent front-এর দূরত্ব 8.0 cm লেখো।','3.2÷8.0=0.40 হিসাব করো।'],
      optionAnalysis:['সঠিক: spot distance / solvent-front distance = 0.40।','অনুপাত উল্টো করা হয়েছে।','দুটি দূরত্ব যোগ করা হয়েছে।','3.2/10 নয়; প্রদত্ত solvent front 8.0 cm।']
    },[refs.separation],media('v97-paper-chromatography-rf','Chromatography Rf measurement','Starting baseline, separated pigment spot at 3.2 cm, solvent front at 8.0 cm.','Rf-তে দুই দূরত্বই একই baseline থেকে মাপা হয়।',svg('Paper chromatography Rf','A chromatography strip with baseline, pigment spot and solvent front clearly labeled','<rect x="240" y="35" width="150" height="225" rx="5" fill="#fff" stroke="#94a3b8" stroke-width="2"/><path d="M240 205 L390 205" stroke="#0f172a" stroke-width="3"/><path d="M240 70 L390 70" stroke="#2563eb" stroke-width="3" stroke-dasharray="7 5"/><ellipse cx="315" cy="110" rx="24" ry="12" fill="#16a34a" opacity=".85"/><path d="M410 205 L410 110" stroke="#16a34a" stroke-width="3"/><path d="M410 110 l-7 12 h14 z" fill="#16a34a"/><path d="M435 205 L435 70" stroke="#2563eb" stroke-width="3"/><path d="M435 70 l-7 12 h14 z" fill="#2563eb"/><text x="85" y="75" font-size="18" fill="#1d4ed8">solvent front = 8.0 cm</text><text x="85" y="120" font-size="18" fill="#15803d">spot = 3.2 cm</text><text x="85" y="212" font-size="18" fill="#0f172a">baseline</text><text x="250" y="285" font-size="18" fill="#334155">Rf = 3.2 / 8.0 = 0.40</text>')));

  add('cl-v97-qchem-fractional-distillation-001','chem1-02',15,3,'scenario',
    'দুটি miscible liquid-এর boiling point কাছাকাছি। তাদের পৃথক করতে simple distillation-এর বদলে fractionating column ব্যবহার করার প্রধান কারণ কী?',
    ['Column-এ repeated vaporisation-condensation ঘটে, ফলে কাছাকাছি boiling point-এর liquid-এর separation উন্নত হয়','Column দুই তরলকে রাসায়নিকভাবে ভেঙে দেয়','Column তরলের boiling point একই করে দেয়','Column শুধু কঠিন অদ্রবণীয় কণা ছেঁকে ফেলে'],0,{
      objective:'Simple এবং fractional distillation-এর মধ্যে পার্থক্য ও fractional column-এর ভূমিকা বোঝা।',
      core:'Fractionating column-এর ভেতরে বারবার condensation ও vaporisation হয়। তুলনামূলক বেশি volatile component vapour phase-এ সমৃদ্ধ হয় এবং better separation পাওয়া যায়।',
      analysis:'কাছাকাছি boiling point হলে একবারের vaporisation যথেষ্ট selective নয়। Column একাধিক equilibrium step তৈরি করে, ফলে distillate-এ বেশি volatile component-এর অনুপাত বাড়ে।',
      formula:'Separation principle: difference in volatility / boiling point + repeated vapour-liquid equilibrium',
      misconception:'Fractionating column ছাঁকনি নয় এবং chemical reaction ঘটায় না; এটি physical separation-এর efficiency বাড়ায়।',
      realWorld:'Crude oil fractionation ও কাছাকাছি boiling point-এর liquid mixture পৃথক করতে fractional distillation ব্যবহৃত হয়।',
      steps:['দুটি তরল miscible এবং boiling point কাছাকাছি কি না চিহ্নিত করো।','Simple distillation-এ একবারের vapour enrichment সীমিত হতে পারে।','Fractionating column repeated condensation/vaporisation ঘটায়।','Distillate বেশি volatile component-এ সমৃদ্ধ হয়।'],
      optionAnalysis:['সঠিক: repeated vapour-liquid equilibria separation উন্নত করে।','Distillation physical process; decomposition নয়।','Column boiling point equal করে না।','Filtration particle size / insolubility-র উপর নির্ভর করে।']
    },[refs.separation]);

  add('cl-v97-qchem-solvent-extraction-001','chem1-02',16,3,'experiment',
    'একটি দ্রবণে থাকা জৈব যৌগকে পানির সঙ্গে immiscible একটি organic solvent-এ স্থানান্তর করে separatory funnel দিয়ে আলাদা করা হচ্ছে। কোন বৈশিষ্ট্যটি extraction-এর ভিত্তি?',
    ['দুটি immiscible solvent-এ solute-এর ভিন্ন দ্রাব্যতা/বণ্টন','দুটি solvent-এর boiling point অবশ্যই সমান','solute উভয় solvent-এ সমানভাবে অদ্রবণীয়','organic solvent সবসময় পানির চেয়ে ঘন'],0,{
      objective:'Solvent extraction-এ immiscibility এবং solute partitioning ব্যাখ্যা করা।',
      core:'Solute দুইটি immiscible liquid phase-এ ভিন্ন মাত্রায় দ্রবীভূত হয়। উপযুক্ত solvent-এ বেশি partition করলে solute সেই layer-এ যায়।',
      analysis:'Separatory funnel-এ layer separation হয় কারণ solvent দুটো মিশে যায় না এবং তাদের density আলাদা হতে পারে। কোন layer ওপরে/নিচে থাকবে তা solvent-এর density থেকে নির্ধারণ করতে হয়; organic solvent সবসময় উপরে নয়।',
      formula:'Distribution concept: K_D = [solute]organic / [solute]aqueous (at equilibrium)',
      misconception:'Organic layer সবসময় top layer নয়; chlorinated solvent-এর মতো কিছু organic solvent পানির চেয়ে ঘন এবং নিচে থাকে।',
      realWorld:'Reaction mixture থেকে organic product isolate বা plant material থেকে natural compound extract করতে ব্যবহৃত হয়।',
      steps:['পানি ও organic solvent immiscible কি না নিশ্চিত করো।','Solute কোন phase-এ বেশি soluble তা বিবেচনা করো।','Separatory funnel-এ phase equilibrium হতে দাও।','Density দেখে layer আলাদা করে সংগ্রহ করো; top/bottom অনুমান করে নিও না।'],
      optionAnalysis:['সঠিক: extraction solute-এর unequal distribution-এর উপর নির্ভর করে।','Boiling point সমান হওয়া শর্ত নয়।','দ্রবণীয়তার পার্থক্য না থাকলে extraction কার্যকর হবে না।','Organic solvent-এর density সর্বদা পানির চেয়ে কম নয়।']
    },[refs.separation]);

  add('cl-v97-qchem-qualitative-vs-quantitative-001','chem1-02',19,2,'conceptual',
    'একটি অজানা নমুনায় chloride ion আছে কি না precipitate test দিয়ে যাচাই করা হলো, কিন্তু concentration মাপা হলো না। এটি কোন ধরনের বিশ্লেষণ?',
    ['গুণগত বিশ্লেষণ (qualitative analysis)','পরিমাণগত বিশ্লেষণ (quantitative analysis)','শুধু physical separation','সরাসরি spectroscopy দ্বারা concentration measurement'],0,{
      objective:'Qualitative ও quantitative chemical analysis-এর লক্ষ্য আলাদা করা।',
      core:'Qualitative analysis নমুনায় কোন ion/compound আছে তা শনাক্ত করে; quantitative analysis তার পরিমাণ বা concentration নির্ধারণ করে।',
      analysis:'AgNO₃ precipitation-এর মতো confirmatory test chloride-এর উপস্থিতির evidence দিতে পারে। কিন্তু precipitate-এর পরিমাণ বা calibrated measurement ছাড়া chloride concentration নির্ভুলভাবে নির্ণয় করা যায় না।',
      formula:'Qualitative = identity/presence; Quantitative = amount/concentration',
      misconception:'রং বা precipitate দেখা মানেই concentration মাপা নয়; quantitative result-এর জন্য পরিমাপ, calibration ও calculation প্রয়োজন।',
      realWorld:'পানি পরীক্ষায় প্রথমে কোন ion আছে তা screen করে পরে প্রয়োজন হলে concentration মাপা হয়।',
      steps:['পরীক্ষাটি কী প্রশ্নের উত্তর দিয়েছে তা দেখো: আছে কি নেই?','কোন ion-এর পরিচয়/উপস্থিতি যাচাই হলে qualitative।','সংখ্যাগত concentration না মাপায় quantitative নয়।','উত্তর qualitative analysis নির্বাচন করো।'],
      optionAnalysis:['সঠিক: পরীক্ষাটি ion-এর উপস্থিতি শনাক্ত করেছে।','কোনো amount বা concentration মাপা হয়নি।','এখানে chemical test হয়েছে, separation technique নয়।','প্রশ্নে spectral measurement নেই।']
    },[refs.analytical]);

  // Integrity checks before exposing to the learner-side quiz builder.
  var ids = new Set();
  qs.forEach(function (q) {
    if (ids.has(q.id)) throw new Error('Duplicate v97 ID: ' + q.id); ids.add(q.id);
    if (q.o.length !== 4 || new Set(q.o).size !== 4 || q.a < 0 || q.a > 3) throw new Error('Invalid MCQ: ' + q.id);
    if (/simulation|interactive model|slider|run the model/i.test(q.q)) throw new Error('Simulation-like prompt is not allowed: ' + q.id);
    if (q.media.length > 1 || q.media.some(function (m) { return !m.questionSupport || !['image','diagram'].includes(m.type) || m.verified !== false; })) throw new Error('Question media policy breach: ' + q.id);
    if (q.qualityApproved || q.editorialReviewed || q.qualityStatus !== 'draft-unreviewed') throw new Error('Draft approval status must remain false: ' + q.id);
  });
  w.CL_AUTHORED_HSC_QUESTIONS_V97 = {
    version: 97, questions: qs, status: 'draft-unreviewed',
    focusChapters: ['phy1-02','chem1-02'],
    note: '24 individually authored supplemental drafts; 8 have original still-diagram question visuals. No question or visual is specialist-approved. Source-page checks do not equal question-level academic approval.'
  };
})(window);
