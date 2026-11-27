/* Golden Snitch v95 — new, individually authored HSC question drafts.
 * These 22 additions focus on Vector and Qualitative Chemistry gaps found in the v94 audit.
 * They remain draft-unreviewed; reference checks do not equal subject-specialist approval.
 */
(function (w) {
  'use strict';
  var vectorRef = {
    title: 'OpenStax University Physics Volume 1 — 2.4 Products of Vectors',
    url: 'https://openstax.org/books/university-physics-volume-1/pages/2-4-products-of-vectors',
    institution: 'OpenStax', section: '2.4', status: 'source-page-checked-2026-11-21'
  };
  var quantumRef = {
    title: 'OpenStax Chemistry 2e — 6.3 Development of Quantum Theory',
    url: 'https://openstax.org/books/chemistry-2e/pages/6-3-development-of-quantum-theory',
    institution: 'OpenStax', section: '6.3', status: 'source-page-checked-2026-11-21'
  };
  var electronRef = {
    title: 'OpenStax Chemistry 2e — 6.4 Electronic Structure of Atoms (Electron Configurations)',
    url: 'https://openstax.org/books/chemistry-2e/pages/6-4-electronic-structure-of-atoms-electron-configurations',
    institution: 'OpenStax', section: '6.4', status: 'source-page-checked-2026-11-21'
  };
  var ionRef = {
    title: 'Royal Society of Chemistry Education — Analysis: qualitative tests for ions',
    url: 'https://edu.rsc.org/resources/analysis/1936.article',
    institution: 'Royal Society of Chemistry', status: 'resource-page-and-listed-ion-tests-checked-2026-11-21'
  };
  var questions = [];
  function add(id, chapterId, topicIndex, tier, questionType, stem, options, answer, fields, refs) {
    var ex = {
      core: fields.core,
      analysis: fields.analysis,
      formula: fields.formula || '',
      misconception: fields.misconception,
      realWorld: fields.realWorld,
      steps: fields.steps || [],
      optionAnalysis: fields.optionAnalysis || [],
      references: (refs || []).map(function (r) { return Object.assign({}, r); }),
      referenceStatus: refs && refs.length ? 'linked-reference-source-checked; question-level-review-pending' : 'reference-mapping-pending',
      media: []
    };
    questions.push({
      id: id, questionId: id, chapterId: chapterId, topicIndex: topicIndex,
      q: stem, o: options, a: answer, tier: tier, questionType: questionType,
      authoredHscConcept: true, syllabusGenerated: false,
      contentOrigin: 'individually-authored-v95', qualityStatus: 'draft-unreviewed',
      qualityApproved: false, editorialReviewed: false, editorialApproved: false,
      learningObjective: fields.learningObjective || 'প্রদত্ত শর্ত থেকে প্রযোজ্য ধারণা ও গাণিতিক সম্পর্ক প্রয়োগ করে সিদ্ধান্তে পৌঁছানো',
      media: [], explanation: ex
    });
  }

  /* PHYSICS — VECTOR: new projection, triple-product, area and vector-calculus applications. */
  add('cl-v95-vector-projection-001', 'phy1-02', 7, 3, 'mathematical',
    'A = 1î + 2ĵ + 2k̂ এবং B = 3ĵ + 4k̂। B-এর দিক বরাবর A-এর স্কেলার প্রক্ষেপ কত?',
    ['১৪ একক', '১৪/৫ একক', '৫/১৪ একক', '৫ একক'], 1, {
      core: 'B-এর দিক বরাবর A-এর স্কেলার প্রক্ষেপ হলো A·B/|B|। এটি ভেক্টর প্রক্ষেপের মান নয়; এটি একটি signed scalar component।',
      analysis: 'A·B = 1×0 + 2×3 + 2×4 = 14 এবং |B| = √(0²+3²+4²)=5। তাই প্রক্ষেপ = 14/5 = 2.8 একক।',
      formula: 'comp_B A = (A·B)/|B|',
      misconception: 'A·B-কে সরাসরি প্রক্ষেপ বলা যাবে না; ডট গুণফলকে B-এর মান দিয়ে ভাগ করতে হয়। |B|=5, 1 নয়।',
      realWorld: 'একটি নির্দিষ্ট দিক বরাবর বল, বেগ বা সরণের কার্যকর উপাংশ নির্ণয়ে scalar projection ব্যবহৃত হয়।',
      steps: ['দুটি ভেক্টরের সংশ্লিষ্ট উপাংশ লিখো।', 'A·B = 0+6+8=14 নির্ণয় করো।', '|B|=√(9+16)=5 নির্ণয় করো।', '14/5 = 2.8 একক লিখো।'],
      optionAnalysis: ['এটি A·B-এর মান; প্রক্ষেপ নয়।', 'সঠিক: 14/5 = 2.8 একক।', 'এটি |B|/(A·B), যা প্রক্ষেপের সূত্র নয়।', 'এটি B-এর মান; প্রক্ষেপের মান নয়।']
    }, [vectorRef]);

  add('cl-v95-vector-triple-product-coplanar-001', 'phy1-02', 7, 4, 'mathematical',
    'A = î + ĵ, B = ĵ + k̂ এবং C = î + 2ĵ + k̂। তিনটি ভেক্টর একই সমতলে অবস্থিত কি না, scalar triple product দিয়ে কী সিদ্ধান্ত পাওয়া যায়?',
    ['A·(B×C)=0; তাই ভেক্টরগুলো সমতলীয়', 'A·(B×C)=1; তাই ভেক্টরগুলো সমতলীয় নয়', 'A·(B×C)=2; তাই ভেক্টরগুলো সমতলীয়', 'A·(B×C)=−1; তাই ভেক্টরগুলো সমতলীয় নয়'], 0, {
      core: 'তিনটি ভেক্টরের scalar triple product শূন্য হলে (এবং ভেক্টরগুলো একই origin থেকে বিবেচিত হলে) তাদের দ্বারা গঠিত parallelepiped-এর আয়তন শূন্য; ফলে তারা coplanar।',
      analysis: 'এখানে C=A+B। তাই A, B ও C একই A-B সমতলে থাকে। সরাসরি B×C = (−1,1,−1), এবং A·(B×C)=−1+1+0=0।',
      formula: 'A·(B×C)=0 ⇔ zero parallelepiped volume ⇔ coplanar (for these vectors)',
      misconception: 'শুধু দুটি ভেক্টর দিয়ে তিন-ভেক্টরের coplanarity নির্ণয় হয় না; scalar triple product তিনটি ভেক্টরের পারস্পরিক বিন্যাস পরীক্ষা করে।',
      realWorld: 'ত্রিমাত্রিক জ্যামিতি, ক্ষেত্রফল-আয়তন এবং ভেক্টর ক্যালকুলাসে একই সমতলে থাকা যাচাইয়ে ব্যবহৃত হয়।',
      steps: ['C=A+B সম্পর্কটি লক্ষ্য করো।', 'অথবা B×C নির্ণয় করো: (−1,1,−1)।', 'A·(B×C)= (1,1,0)·(−1,1,−1)=0।', 'শূন্য triple product থেকে coplanarity সিদ্ধান্ত দাও।'],
      optionAnalysis: ['সঠিক: scalar triple product শূন্য।', 'cross product-এর একটি উপাংশকে ভুলভাবে ফল ধরা হয়েছে।', 'উপাংশ গুণফলের যোগে চিহ্নের ভুল হয়েছে।', 'x-উপাংশের চিহ্ন ঠিক রেখে y-উপাংশের অবদান বাদ পড়েছে।']
    }, [vectorRef]);

  add('cl-v95-vector-triangle-area-001', 'phy1-02', 7, 3, 'mathematical',
    'একটি ত্রিভুজের একই শীর্ষ থেকে নির্গত দুই বাহুর ভেক্টর A = 2î m এবং B = 3ĵ m। ত্রিভুজটির ক্ষেত্রফল কত?',
    ['৬ m²', '৩ m²', '১.৫ m²', '৫ m²'], 1, {
      core: 'দুটি বাহুর ভেক্টর গুণফলের মান সামান্তরিকের ক্ষেত্রফল দেয়। একই দুই বাহু দিয়ে গঠিত ত্রিভুজের ক্ষেত্রফল তার অর্ধেক।',
      analysis: '|A×B| = |A||B|sin90° = 2×3×1 = 6 m²। অতএব ত্রিভুজের ক্ষেত্রফল = 6/2 = 3 m²।',
      formula: 'A_triangle = ½|A×B| = ½|A||B|sinθ',
      misconception: '৬ m² সামান্তরিকের ক্ষেত্রফল; ত্রিভুজের ক্ষেত্রফল পেতে ২ দিয়ে ভাগ করতে হয়।',
      realWorld: 'স্থানাঙ্ক জ্যামিতিতে শীর্ষবিন্দুর অবস্থান থেকে ত্রিভুজ বা তলের ক্ষেত্রফল নির্ণয়ে vector product কাজে লাগে।',
      steps: ['A ও B পরস্পর লম্ব—তাই θ=90°।', '|A×B|=2×3×1=6 m²।', 'ত্রিভুজের ক্ষেত্রফল = 6/2=3 m²।'],
      optionAnalysis: ['এটি সামান্তরিকের ক্ষেত্রফল; অর্ধেক করতে হবে।', 'সঠিক: সামান্তরিকের ক্ষেত্রফলের অর্ধেক।', 'অতিরিক্ত ২ দিয়ে ভাগ করা হয়েছে।', 'ভেক্টরগুলোর মান যোগ করা হয়েছে; ক্ষেত্রফলের সূত্র নয়।']
    }, [vectorRef]);

  add('cl-v95-vector-gradient-nonlinear-001', 'phy1-02', 12, 3, 'mathematical',
    'স্কেলার ক্ষেত্র φ(x,y,z)=x²y+3z। (1,2,0) বিন্দুতে ∇φ কত?',
    ['4î + ĵ + 3k̂', '2î + 2ĵ + 3k̂', '4î + 2ĵ + 3k̂', '4î + ĵ'], 0, {
      core: 'কোনো scalar field-এর gradient হলো স্থানাঙ্কগুলোর সাপেক্ষে আংশিক অন্তরকের ভেক্টর।',
      analysis: '∂φ/∂x=2xy, ∂φ/∂y=x² এবং ∂φ/∂z=3। (1,2,0) বসালে উপাংশগুলো 4, 1, 3; সুতরাং ∇φ=4î+ĵ+3k̂।',
      formula: '∇φ = (∂φ/∂x)î + (∂φ/∂y)ĵ + (∂φ/∂z)k̂',
      misconception: 'x²y পদে y ধ্রুব ধরে x অনুযায়ী অন্তরক 2xy; y অনুযায়ী অন্তরক x²। দুইটি আংশিক অন্তরক গুলিয়ে ফেললে ভুল হবে।',
      realWorld: 'তাপমাত্রা বা বিভবের মতো scalar field কোন দিকে দ্রুততম বাড়ে তা gradient নির্দেশ করে।',
      steps: ['x অনুযায়ী আংশিক অন্তরক: 2xy।', 'y অনুযায়ী আংশিক অন্তরক: x²।', 'z অনুযায়ী আংশিক অন্তরক: 3।', '(1,2,0) বসিয়ে 4î+ĵ+3k̂ লেখো।'],
      optionAnalysis: ['সঠিক: তিনটি আংশিক অন্তরকই সঠিকভাবে বসানো।', 'x ও y-এর partial derivative-এ স্থানাঙ্ক বসানোর ভুল।', 'y-উপাংশে x²=1 হওয়ার কথা; 2 লেখা ভুল।', 'z-উপাংশ 3 বাদ পড়েছে।']
    }, []);

  add('cl-v95-vector-gradient-direction-001', 'phy1-02', 12, 2, 'conceptual',
    'φ(x,y,z)=2x−2y+z স্কেলার ক্ষেত্রের কোনো বিন্দুতে ক্ষেত্রটি সবচেয়ে দ্রুত যে দিকে বাড়ে, সেই একক দিক-ভেক্টর কোনটি?',
    ['(2î−2ĵ+k̂)/3', '(2î−2ĵ+k̂)', '(î−ĵ+k̂)/3', '(2î+2ĵ+k̂)/3'], 0, {
      core: 'Gradient field-এর সর্বাধিক বৃদ্ধির দিক নির্দেশ করে; unit direction পেতে gradient-কে তার মান দিয়ে ভাগ করতে হয়।',
      analysis: '∇φ=2î−2ĵ+k̂। এর মান √(4+4+1)=3। তাই unit direction = (2î−2ĵ+k̂)/3।',
      formula: 'u_max = ∇φ/|∇φ|',
      misconception: 'Gradient-এর মান 3; একক দিক-ভেক্টরের মান 1 হতে হবে। gradient নিজে unit vector নয়।',
      realWorld: 'তাপমাত্রা বা বৈদ্যুতিক বিভবের ক্ষেত্র থেকে সর্বাধিক পরিবর্তনের দিক বোঝাতে gradient ব্যবহৃত হয়।',
      steps: ['প্রথমে gradient-এর তিনটি ধ্রুবক উপাংশ লিখো।', 'এর মান √(2²+(−2)²+1²)=3 নির্ণয় করো।', 'gradient-কে 3 দিয়ে ভাগ করো।'],
      optionAnalysis: ['সঠিক: gradient-এর normalized রূপ।', 'gradient-এর মান 3, তাই এটি unit vector নয়।', 'উপাংশগুলোর মান ভুলভাবে 1,−1,1 করা হয়েছে; normalization নয়।', 'y-উপাংশের চিহ্ন ভুল।']
    }, []);

  add('cl-v95-vector-divergence-nonlinear-001', 'phy1-02', 12, 4, 'mathematical',
    'ভেক্টর ক্ষেত্র F = x²y î + y²z ĵ + z²x k̂। (1,2,1) বিন্দুতে divergence কত?',
    ['১০', '৮', '৬', '১২'], 0, {
      core: 'Divergence হলো ভেক্টর ক্ষেত্রের প্রতিটি উপাংশের নিজ নিজ স্থানাঙ্ক অনুযায়ী আংশিক অন্তরকের সমষ্টি।',
      analysis: '∇·F = ∂(x²y)/∂x + ∂(y²z)/∂y + ∂(z²x)/∂z = 2xy+2yz+2zx। (1,2,1) বসালে 4+4+2=10।',
      formula: '∇·F = ∂F_x/∂x + ∂F_y/∂y + ∂F_z/∂z',
      misconception: 'প্রতিটি উপাংশকে একই চলকের সাপেক্ষে অন্তরীকরণ করা যায় না; F_x-কে x, F_y-কে y, F_z-কে z অনুযায়ী নিতে হবে।',
      realWorld: 'প্রবাহক্ষেত্রে কোনো ক্ষুদ্র অঞ্চলে নিট বহির্মুখী প্রবাহের ঘনত্ব বোঝাতে divergence ব্যবহৃত হয়।',
      steps: ['F_x=x²y থেকে ∂F_x/∂x=2xy।', 'F_y=y²z থেকে ∂F_y/∂y=2yz।', 'F_z=z²x থেকে ∂F_z/∂z=2zx।', '(1,2,1) বসিয়ে 4+4+2=10।'],
      optionAnalysis: ['সঠিক: তিনটি partial derivative যোগ করে 10।', 'শেষ পদের 2zx=2 বাদ পড়েছে।', 'y-সংক্রান্ত অংশে 2yz=4-এর বদলে 0 ধরা হয়েছে।', 'প্রথম পদ 2xy-কে ভুল করে 6 ধরা হয়েছে।']
    }, []);

  add('cl-v95-vector-curl-nonlinear-001', 'phy1-02', 12, 4, 'mathematical',
    'F = y²î + z²ĵ + x²k̂ ভেক্টর ক্ষেত্রের (1,2,3) বিন্দুতে curl কত?',
    ['−6î−2ĵ−4k̂', '6î+2ĵ+4k̂', '−2î−4ĵ−6k̂', 'শূন্য ভেক্টর'], 0, {
      core: 'Curl একটি vector field-এর স্থানীয় ঘূর্ণনপ্রবণতার দিক ও পরিমাণ প্রকাশ করে।',
      analysis: '∇×F = (∂F_z/∂y−∂F_y/∂z)î +(∂F_x/∂z−∂F_z/∂x)ĵ +(∂F_y/∂x−∂F_x/∂y)k̂। তাই উপাংশগুলো যথাক্রমে −2z, −2x, −2y। (1,2,3) বসালে (−6,−2,−4)।',
      formula: '∇×F = (∂F_z/∂y−∂F_y/∂z)î +(∂F_x/∂z−∂F_z/∂x)ĵ +(∂F_y/∂x−∂F_x/∂y)k̂',
      misconception: 'Curl-এর cyclic derivative-এর ক্রমে চিহ্ন গুরুত্বপূর্ণ; প্রতিটি পার্থক্য উল্টো করলে পুরো ফলের চিহ্ন পাল্টে যাবে।',
      realWorld: 'তরল প্রবাহের ঘূর্ণি বা চৌম্বক ও অন্যান্য vector field-এর local rotational behaviour বিশ্লেষণে curl লাগে।',
      steps: ['F_x=y², F_y=z², F_z=x² শনাক্ত করো।', 'î-উপাংশ: 0−2z=−2z।', 'ĵ-উপাংশ: 0−2x=−2x।', 'k̂-উপাংশ: 0−2y=−2y; বিন্দুতে মান বসাও।'],
      optionAnalysis: ['সঠিক: determinant expansion-এর চিহ্নসহ ফল।', 'সব উপাংশের চিহ্ন উল্টো।', 'উপাংশগুলো স্থানাঙ্কের সঙ্গে ভুলভাবে মেলানো হয়েছে।', 'ক্ষেত্রের curl শূন্য নয়; তিনটি উপাংশই অশূন্য।']
    }, []);

  add('cl-v95-vector-conservative-gradient-001', 'phy1-02', 12, 3, 'conceptual',
    'F = 2xy î + x² ĵ + 2z k̂ ক্ষেত্রটির জন্য φ(x,y,z)=x²y+z² একটি scalar potential। কোন যাচাইটি F=∇φ সম্পর্কটি সরাসরি নিশ্চিত করে?',
    ['φ-এর x, y, z অনুযায়ী আংশিক অন্তরক যথাক্রমে F-এর তিনটি উপাংশের সমান', 'φ-এর মানের সঙ্গে F-এর মান সমান', 'φ-এর Laplacian সবসময় F-এর মান দেয়', 'F-এর প্রতিটি উপাংশকে যোগ করলে φ পাওয়া যায়'], 0, {
      core: 'Scalar potential-এর gradient নিলে সংশ্লিষ্ট conservative vector field পাওয়া যায়।',
      analysis: '∂φ/∂x=2xy, ∂φ/∂y=x² এবং ∂φ/∂z=2z। এগুলো যথাক্রমে F-এর x, y, z উপাংশের সঙ্গে মিলে যায়।',
      formula: '∇(x²y+z²)=2xy î+x² ĵ+2z k̂',
      misconception: 'Gradient মানে scalar function-এর স্থানাঙ্কভিত্তিক partial derivatives-কে vector হিসেবে লেখা; scalar field-এর মান ও vector field-এর মান এক জিনিস নয়।',
      realWorld: 'Conservative force field-এ potential function থেকে force-এর উপাংশ নির্ণয় করা যায়।',
      steps: ['φ-কে x অনুযায়ী অন্তরীকরণ করো।', 'φ-কে y অনুযায়ী অন্তরীকরণ করো।', 'φ-কে z অনুযায়ী অন্তরীকরণ করো।', 'তিনটি ফলকে F-এর সংশ্লিষ্ট উপাংশের সঙ্গে তুলনা করো।'],
      optionAnalysis: ['সঠিক: gradient-এর সংজ্ঞাই এই শর্ত।', 'scalar ও vector field-কে একই রাশি ধরা হয়েছে।', 'Laplacian হলো divergence of gradient; এটি এখানে প্রয়োজনীয় যাচাই নয়।', 'উপাংশ যোগ করা gradient-এর সংজ্ঞা নয়।']
    }, []);

  add('cl-v95-vector-divergence-vs-curl-001', 'phy1-02', 12, 3, 'conceptual',
    'F = −y î + x ĵ + 4z k̂ ক্ষেত্রটির divergence এবং curl-এর z-উপাংশ যথাক্রমে কত?',
    ['৪ এবং ২', '২ এবং ৪', '০ এবং ২', '৪ এবং ০'], 0, {
      core: 'Divergence ও curl আলাদা differential operation: প্রথমটি উপাংশগুলোর নিজস্ব-স্থানাঙ্কের derivative যোগ করে, দ্বিতীয়টি cross-partial derivative-এর সমন্বয়।',
      analysis: '∇·F = ∂(−y)/∂x + ∂x/∂y + ∂(4z)/∂z = 0+0+4=4। Curl-এর z-উপাংশ = ∂F_y/∂x−∂F_x/∂y =1−(−1)=2।',
      formula: '∇·F=∂F_x/∂x+∂F_y/∂y+∂F_z/∂z; (∇×F)_z=∂F_y/∂x−∂F_x/∂y',
      misconception: 'x বা y-নির্ভরতা দেখে divergence ও curl একই বলে ধরে নেওয়া যাবে না; তাদের derivative-এর বিন্যাস আলাদা।',
      realWorld: 'ঘূর্ণন ও উৎস/নিঃসরণ প্রবণতা আলাদা করে চিহ্নিত করতে fluid ও field analysis-এ দুটি পরিমাপই লাগে।',
      steps: ['তিনটি field component আলাদা করো।', 'নিজ নিজ coordinate অনুযায়ী derivative যোগ করে divergence=4 পাও।', 'curl-এর z component-এর জন্য ∂F_y/∂x−∂F_x/∂y হিসাব করো।', 'ফল 1−(−1)=2 লেখো।'],
      optionAnalysis: ['সঠিক: divergence 4, curl-এর z component 2।', 'দুটি ফলের অবস্থান অদলবদল।', 'F_z-এর derivative 4 বাদ পড়েছে।', 'curl-এর z component ভুল করে শূন্য ধরা হয়েছে।']
    }, []);

  add('cl-v95-vector-directional-derivative-001', 'phy1-02', 12, 4, 'mathematical',
    'φ=x²+y²+z² এবং P(1,2,2)। P বিন্দুতে u=(î+2ĵ+2k̂)/3 দিক বরাবর directional derivative কত?',
    ['৬', '২', '১০', '১৮'], 0, {
      core: 'একক ভেক্টর u বরাবর scalar field-এর directional derivative হলো gradient-এর সঙ্গে u-এর dot product।',
      analysis: '∇φ=2xî+2yĵ+2zk̂। P-তে gradient=(2,4,4)। dot product =2/3+8/3+8/3=18/3=6। u-এর মান √(1+4+4)/3=1, তাই এটি unit direction।',
      formula: 'D_uφ = ∇φ·u',
      misconception: 'Directional derivative পেতে শুধু gradient-এর মান নেওয়া যায় না; নির্দিষ্ট দিক u-এর সঙ্গে dot product করতে হয়।',
      realWorld: 'কোনো field নির্দিষ্ট পথ বা দিকে এগোলে কত দ্রুত পরিবর্তিত হচ্ছে তা পরিমাপে কাজে লাগে।',
      steps: ['∇φ=(2x,2y,2z) নির্ণয় করো।', 'P-তে ∇φ=(2,4,4)।', 'u=(1/3,2/3,2/3) এর সঙ্গে dot product করো।', '2/3+8/3+8/3=6।'],
      optionAnalysis: ['সঠিক: gradient ও unit direction-এর dot product।', 'শুধু x-উপাংশের অবদান নেওয়া হয়েছে; y ও z-এর অবদান বাদ পড়েছে।', 'component product-এ অতিরিক্ত 2 গুণ করা হয়েছে।', 'u-এর denominator 3 ব্যবহার করা হয়নি।']
    }, []);

  /* CHEMISTRY — QUALITATIVE CHEMISTRY: atomic structure and reliable wet tests. */
  add('cl-v95-qchem-4d-orbitals-001', 'chem1-02', 1, 2, 'conceptual',
    'n=4 ও l=2 হলে উপস্তরটি 4d। এই উপস্তরে সর্বোচ্চ কতটি orbital এবং কতটি electron থাকতে পারে?',
    ['৫টি orbital ও ১০টি electron', '৩টি orbital ও ৬টি electron', '৭টি orbital ও ১৪টি electron', '২টি orbital ও ৪টি electron'], 0, {
      core: 'একটি subshell-এ orbital-এর সংখ্যা 2l+1। প্রতিটি orbital-এ Pauli exclusion principle অনুযায়ী বিপরীত spin-এর সর্বোচ্চ দুইটি electron থাকতে পারে।',
      analysis: 'l=2 হলে m_l-এর মান −2,−1,0,+1,+2—মোট 5টি। তাই সর্বোচ্চ electron=5×2=10।',
      formula: 'N_orbitals = 2l+1; N_e,max = 2(2l+1)',
      misconception: 'l=2 মানে দুইটি orbital নয়। m_l-এর সম্ভাব্য মান পাঁচটি, তাই d-subshell-এ পাঁচটি orbital থাকে।',
      realWorld: 'Transition element-এর electron configuration ও magnetic behaviour বুঝতে d-subshell capacity প্রয়োজন।',
      steps: ['l=2 বসিয়ে m_l=−2 থেকে +2 তালিকা করো।', 'পাঁচটি m_l মান থেকে পাঁচটি orbital পাও।', 'প্রতিটি orbital-এ সর্বোচ্চ 2 electron, তাই 10।'],
      optionAnalysis: ['সঠিক: পাঁচটি orientation, প্রতি orbital-এ দুই electron।', 'এটি p-subshell-এর সংখ্যা ও capacity।', 'এটি f-subshell-এর capacity।', 'orbital ও electron সংখ্যা উভয়ই কম গণনা।']
    }, [quantumRef]);

  add('cl-v95-qchem-radial-nodes-001', 'chem1-02', 2, 3, 'mathematical',
    'একটি 4p orbital-এর radial node-এর সংখ্যা কত?',
    ['২', '৩', '১', '৪'], 0, {
      core: 'Radial node-এর সংখ্যা principal quantum number n এবং azimuthal quantum number l থেকে নির্ণয় করা যায়। p-subshell-এর জন্য l=1।',
      analysis: '4p-এর n=4, l=1। তাই radial nodes=n−l−1=4−1−1=2।',
      formula: 'N_radial nodes = n−l−1',
      misconception: 'Total nodes (n−1) এবং radial nodes (n−l−1) এক নয়। Angular nodes হলো l।',
      realWorld: 'Atomic orbital-এর radial probability distribution ও orbital structure বিশ্লেষণে node-এর সংখ্যা ব্যবহৃত হয়।',
      steps: ['4p থেকে n=4 শনাক্ত করো।', 'p-এর জন্য l=1।', 'n−l−1=4−1−1=2।'],
      optionAnalysis: ['সঠিক: radial nodes 2।', 'এটি মোট node-এর মান n−1।', 'l=1 বাদ দিয়ে ভুল হিসাব।', 'n-কে সরাসরি node সংখ্যা ধরা হয়েছে।']
    }, [quantumRef]);

  add('cl-v95-qchem-aufbau-4s-3d-001', 'chem1-02', 3, 3, 'conceptual',
    'Aufbau নীতি অনুযায়ী নিরপেক্ষ পরমাণুর ground-state electron configuration লেখার সময় সাধারণত 3d-এর আগে 4s উপস্তর পূরণ হয় কেন?',
    ['Aufbau-এর প্রচলিত (n+l) ক্রমে 4s-এর n+l=4, 3d-এর n+l=5', '4s-এ orbital বেশি বলে', '3d-তে electron থাকতে পারে না', '4s-এর principal quantum number সবসময় ছোট'], 0, {
      core: 'Aufbau principle অনুযায়ী electron সাধারণত উপলব্ধ নিম্ন-শক্তির orbital আগে পূরণ করে। n+l নিয়মে সমান হলে কম n আগে; এখানে 4s-এর n+l=4, 3d-এর n+l=5।',
      analysis: '4s: n=4,l=0 → n+l=4। 3d: n=3,l=2 → n+l=5। তাই সাধারণ filling order-এ 4s আগে পূরণ হয়। Transition-metal cation গঠনের সময় electron অপসারণের ক্রম আলাদা হতে পারে; প্রশ্নটি neutral atom-এর filling order নিয়ে।',
      formula: '4s: n+l=4; 3d: n+l=5',
      misconception: '4s-এর principal quantum number 3d-এর চেয়ে বেশি, কিন্তু Aufbau order নির্ণয়ে শুধু n নয়; n+l নিয়মও বিবেচ্য। Filling order ও ionisation-এর removal order এক নয়।',
      realWorld: 'পর্যায় সারণির প্রথম সারির transition elements-এর electron configuration ও আয়ন গঠন বোঝাতে এই পার্থক্য জরুরি।',
      steps: ['4s-এর জন্য n=4,l=0 লেখো।', '3d-এর জন্য n=3,l=2 লেখো।', 'দুটি n+l মান তুলনা করো: 4<5।', 'সাধারণ filling order-এ 4s আগে আসে—এই সীমা মনে রাখো।'],
      optionAnalysis: ['সঠিক: n+l তুলনা 4s-কে আগে রাখে।', '4s ও 3d-র orbital count দিয়ে filling order নির্ধারিত হয় না।', '3d-তে electron থাকতে পারে; সেটি d-subshell।', '4s-এর n=4, যা 3d-এর n=3-এর চেয়ে বড়।']
    }, [electronRef]);

  add('cl-v95-qchem-photon-energy-001', 'chem1-02', 4, 3, 'mathematical',
    'একটি তড়িৎচুম্বকীয় বিকিরণের কম্পাঙ্ক 6.0×10¹⁴ Hz। Planck ধ্রুবক h=6.63×10⁻³⁴ J s হলে একটি photon-এর শক্তি প্রায় কত?',
    ['3.98×10⁻¹⁹ J', '1.11×10⁻¹⁹ J', '6.63×10⁻³⁴ J', '9.00×10⁴⁷ J'], 0, {
      core: 'তড়িৎচুম্বকীয় বিকিরণের একটি photon-এর শক্তি কম্পাঙ্কের সমানুপাতিক; Planck relation দিয়ে নির্ণয় করা হয়।',
      analysis: 'E=hf=(6.63×10⁻³⁴)(6.0×10¹⁴)=39.78×10⁻²⁰ J=3.978×10⁻¹⁹ J। তিন significant figure-এ 3.98×10⁻¹⁹ J।',
      formula: 'E=hf',
      misconception: 'h হলো Planck ধ্রুবক, photon-এর শক্তি নয়। ঘাত যোগে −34+14=−20; 39.78×10⁻²⁰ কে 3.978×10⁻¹⁹ লিখতে হয়।',
      realWorld: 'UV, visible ও IR spectroscopy-তে photon energy এবং বিকিরণের কম্পাঙ্কের সম্পর্ক কাজে লাগে।',
      steps: ['E=hf সূত্র লেখো।', 'h ও f-এর মান বসাও।', '6.63×6.0=39.78 এবং 10⁻³⁴×10¹⁴=10⁻²⁰।', 'Scientific notation-এ 3.978×10⁻¹⁹ J লেখো।'],
      optionAnalysis: ['সঠিক: h ও f গুণ করে পাওয়া শক্তি।', 'গুণের বদলে একাধিক ধাপে ভাগ/রূপান্তরের ভুল।', 'শুধু Planck ধ্রুবক লেখা হয়েছে; f গুণ করা হয়নি।', 'ঘাতের চিহ্ন উল্টো ও exponent ভুল।']
    }, [quantumRef]);

  add('cl-v95-qchem-spectrum-fingerprint-001', 'chem1-02', 5, 3, 'conceptual',
    'একটি উত্তেজিত নমুনার নির্গমন বর্ণালিতে 410 nm, 434 nm, 486 nm ও 656 nm-এর কাছাকাছি চারটি রেখা পাওয়া গেল। পরিচিত রেখাসমষ্টির সঙ্গে মিলিয়ে কোন সিদ্ধান্তটি সবচেয়ে যথার্থ?',
    ['এটি হাইড্রোজেনের Balmer series-এর সঙ্গে মেলে', 'এটি অবিচ্ছিন্ন বর্ণালি, তাই মৌল শনাক্ত করা যায় না', 'এটি সব মৌলের জন্য একই সাধারণ রেখা', 'এটি কেবল অণুর IR vibration নির্দেশ করে'], 0, {
      core: 'একটি মৌলের অনুমোদিত energy-level transition থেকে নির্দিষ্ট photon wavelength তৈরি হয়। রেখাগুলোর বিন্যাস একটি spectral fingerprint হিসেবে ব্যবহৃত হয়।',
      analysis: 'প্রদত্ত 410, 434, 486 ও 656 nm রেখাগুলো hydrogen-এর দৃশ্যমান Balmer series-এর পরিচিত রেখাগুলোর সঙ্গে মেলে। বাস্তব নমুনায় একাধিক রেখা, calibration ও সম্ভাব্য মিশ্রণ বিবেচনা করে শনাক্তকরণ নিশ্চিত করতে হয়।',
      formula: 'ΔE = hc/λ',
      misconception: 'একটি একক রেখা দেখে নিশ্চিত পরিচয় দেওয়া ঝুঁকিপূর্ণ; একাধিক characteristic line-এর pattern তুলনা অধিক নির্ভরযোগ্য।',
      realWorld: 'জ্যোতির্বিজ্ঞানে নক্ষত্রের আলো এবং ল্যাবরেটরিতে মৌলের উপস্থিতি শনাক্ত করতে emission spectroscopy ব্যবহৃত হয়।',
      steps: ['প্রাপ্ত রেখার wavelength তালিকাভুক্ত করো।', 'পরিচিত reference spectrum-এর সঙ্গে একাধিক line মিলাও।', 'চারটি মান Balmer visible lines-এর সঙ্গে তুলনা করো।', 'মিশ্র নমুনা/যন্ত্রের calibration থাকলে তা আলাদাভাবে যাচাই করো।'],
      optionAnalysis: ['সঠিক: চারটি line hydrogen Balmer pattern-এর সঙ্গে মেলে।', 'Discrete emission spectrum অবিচ্ছিন্ন নয়; নির্দিষ্ট রেখা তৈরি করে।', 'প্রতিটি মৌলের energy levels আলাদা, তাই pattern-ও বৈশিষ্ট্যপূর্ণ।', 'প্রদত্ত wavelength দৃশ্যমান; IR molecular vibration-এর ব্যাখ্যা নয়।']
    }, [quantumRef]);

  add('cl-v95-qchem-flame-calcium-copper-001', 'chem1-02', 10, 2, 'conceptual',
    'শিখা পরীক্ষায় অজানা নমুনা ইট-লাল (brick-red) শিখা দেয়। প্রদত্ত আয়নগুলোর মধ্যে কোনটি এই রঙের সঙ্গে সবচেয়ে বেশি সামঞ্জস্যপূর্ণ?',
    ['Ca²⁺', 'Na⁺', 'K⁺', 'Cu²⁺'], 0, {
      core: 'শিখা পরীক্ষায় তাপের কারণে electron উচ্চ শক্তিস্তরে উত্তেজিত হয়; নিম্ন শক্তিস্তরে ফেরার সময় নির্দিষ্ট wavelength-এর আলো নির্গত হয়।',
      analysis: 'Ca²⁺ সাধারণত brick-red/orange-red শিখা দেয়। Na⁺ উজ্জ্বল হলুদ, K⁺ lilac এবং Cu²⁺ blue-green শিখার জন্য পরিচিত।',
      formula: 'ΔE = hν = hc/λ',
      misconception: 'শিখার রং শুধু আয়নের চার্জ থেকে অনুমান করা যায় না; নির্দিষ্ট electronic transition ও সম্ভাব্য sodium contamination বিবেচ্য।',
      realWorld: 'অজানা ধাতব আয়নের প্রাথমিক qualitative screening-এ flame test সহায়ক, তবে এককভাবে চূড়ান্ত শনাক্তকরণ নয়।',
      steps: ['পর্যবেক্ষিত রং brick-red হিসেবে নথিভুক্ত করো।', 'পরিচিত flame colour-এর সঙ্গে তুলনা করো।', 'Ca²⁺-এর brick-red রঙের সঙ্গে মিলাও।', 'confirmatory test ছাড়া একে একমাত্র চূড়ান্ত প্রমাণ বলো না।'],
      optionAnalysis: ['সঠিক: calcium salt-এর brick-red flame।', 'সোডিয়াম সাধারণত তীব্র হলুদ রং দেয়।', 'পটাশিয়াম lilac/violet রং দেয়।', 'কপার সাধারণত blue-green রং দেয়।']
    }, [ionRef]);

  add('cl-v95-qchem-ammonium-test-001', 'chem1-02', 12, 3, 'conceptual',
    'কোনো দ্রবণে NH₄⁺ আছে কি না পরীক্ষা করতে NaOH যোগ করে মৃদু গরম করা হলো। উৎপন্ন গ্যাসের কাছে আর্দ্র লাল লিটমাস নীল হলো। কোন ব্যাখ্যাটি সঠিক?',
    ['NH₃ গ্যাস উৎপন্ন হয়েছে; NH₄⁺ উপস্থিতির পক্ষে এটি পরীক্ষা', 'CO₂ গ্যাস উৎপন্ন হয়েছে; NH₄⁺ অনুপস্থিত', 'H₂ গ্যাস উৎপন্ন হয়েছে; Na⁺ উপস্থিত', 'Cl₂ গ্যাস উৎপন্ন হয়েছে; chloride উপস্থিত'], 0, {
      core: 'ক্ষারীয় পরিবেশে ammonium ion থেকে ammonia গ্যাস মুক্ত হয়। Ammonia জলীয় আর্দ্রতায় ক্ষারীয় দ্রবণ তৈরি করে লাল লিটমাস নীল করে।',
      analysis: 'Net ionic equation: NH₄⁺ + OH⁻ → NH₃(g) + H₂O(l)। তাই উষ্ণ NaOH-এর পর আর্দ্র লাল লিটমাস নীল হওয়া NH₄⁺-এর পক্ষে প্রমাণ।',
      formula: 'NH₄⁺(aq) + OH⁻(aq) → NH₃(g) + H₂O(l)',
      misconception: 'শুকনো litmus দিয়ে একইভাবে পরীক্ষা করা যায় না; ammonia-র ক্ষারীয় প্রভাব দেখাতে আর্দ্র indicator প্রয়োজন। গ্যাস সরাসরি শোঁকা নিরাপদ নয়।',
      realWorld: 'লবণ বা সার নমুনায় ammonium ion-এর প্রাথমিক গুণগত শনাক্তকরণে ব্যবহৃত হয়।',
      steps: ['নমুনায় aqueous NaOH যোগ করো।', 'নিরাপদে মৃদু গরম করো।', 'মুখের কাছে আর্দ্র লাল লিটমাস ধরো, গ্যাস সরাসরি শুঁকবে না।', 'নীল হলে ammonia উৎপন্ন হওয়ার ইঙ্গিত; NH₄⁺ শনাক্তে সহায়ক।'],
      optionAnalysis: ['সঠিক: ammonia ক্ষারীয় এবং wet red litmus নীল করে।', 'CO₂ লাল লিটমাস নীল করে না; NH₄⁺ test-এর net reaction নয়।', 'এখানে hydrogen উৎপন্ন হওয়ার কারণ নেই।', 'chloride আয়ন থেকে NaOH দিয়ে chlorine গ্যাস তৈরি হয় না।']
    }, [ionRef]);

  add('cl-v95-qchem-carbonate-test-001', 'chem1-02', 12, 2, 'conceptual',
    'একটি কঠিন লবণে dilute acid যোগ করলে বুদবুদ তৈরি হলো। উৎপন্ন গ্যাস limewater-কে দুধের মতো সাদা করল। কোন আয়নের উপস্থিতি সবচেয়ে জোরালোভাবে নির্দেশিত?',
    ['CO₃²⁻', 'SO₄²⁻', 'Cl⁻', 'NO₃⁻'], 0, {
      core: 'Carbonate আয়ন dilute acid-এর সঙ্গে বিক্রিয়া করে carbon dioxide গ্যাস ছাড়ে; CO₂ limewater-এর Ca(OH)₂-এর সঙ্গে অদ্রবণীয় CaCO₃ তৈরি করে।',
      analysis: 'CO₃²⁻ + 2H⁺ → CO₂ + H₂O; CO₂ + Ca(OH)₂ → CaCO₃(s) + H₂O। CaCO₃-এর সাদা অবক্ষেপে limewater milky দেখায়।',
      formula: 'CO₃²⁻ + 2H⁺ → CO₂↑ + H₂O; CO₂ + Ca(OH)₂ → CaCO₃↓ + H₂O',
      misconception: 'শুধু effervescence যথেষ্ট নয়; গ্যাসকে limewater-এ bubble করে CO₂-এর confirmatory observation পাওয়া হয়। অতিরিক্ত CO₂ দিলে CaCO₃ দ্রবীভূত হয়ে milkiness কমতে পারে।',
      realWorld: 'খনিজ, চুনাপাথর, carbonate salts ও অজানা আয়নিক নমুনার qualitative analysis-এ ব্যবহৃত হয়।',
      steps: ['Dilute acid যোগের পর gas evolution লক্ষ্য করো।', 'গ্যাসকে limewater-এর মধ্য দিয়ে প্রবাহিত করো।', 'দুধের মতো সাদা CaCO₃ অবক্ষেপ দেখা হলে CO₂ শনাক্ত করো।', 'উৎপন্ন CO₂ carbonate বা hydrogencarbonate থেকে আসতে পারে—নমুনার প্রেক্ষাপটও বিবেচনা করো।'],
      optionAnalysis: ['সঠিক: carbonate acid-এর সঙ্গে CO₂ ছাড়ে।', 'সালফেট এই পরীক্ষায় CO₂ ছাড়ে না।', 'chloride থেকে এই acid reaction-এ CO₂ আসে না।', 'nitrate আয়ন থেকে carbonate-এর মতো CO₂ উৎপন্ন হয় না।']
    }, [ionRef]);

  add('cl-v95-qchem-sulfate-test-001', 'chem1-02', 12, 3, 'conceptual',
    'একটি অজানা দ্রবণ dilute HCl দিয়ে acidify করার পর BaCl₂ যোগ করলে সাদা অবক্ষেপ তৈরি হলো, যা dilute acid-এ অদ্রবণীয় রইল। কোন আয়নের উপস্থিতি নির্দেশিত?',
    ['SO₄²⁻', 'CO₃²⁻', 'Cl⁻', 'NH₄⁺'], 0, {
      core: 'Sulfate ion, Ba²⁺-এর সঙ্গে অদ্রবণীয় সাদা BaSO₄ precipitate তৈরি করে। Acidification carbonate-এর মতো interfering ion-এর প্রভাব কমাতে সহায়তা করে।',
      analysis: 'Ba²⁺(aq)+SO₄²⁻(aq)→BaSO₄(s)। BaSO₄ dilute HCl-এ অদ্রবণীয় থাকে; carbonate হলে acidification-এ CO₂ বেরিয়ে যেতে পারে এবং BaCO₃ acid-এ দ্রবীভূত হয়।',
      formula: 'Ba²⁺(aq) + SO₄²⁻(aq) → BaSO₄(s)',
      misconception: 'যেকোনো সাদা precipitate-কে sulfate বলা যায় না; acidify করার ধাপ ও acid-এ অবক্ষেপের স্থায়িত্ব দুটোই গুরুত্বপূর্ণ।',
      realWorld: 'পানি, সার, খনিজ ও অজানা লবণের নমুনায় sulfate শনাক্তকরণের qualitative test।',
      steps: ['দ্রবণকে dilute HCl দিয়ে acidify করো।', 'BaCl₂ দ্রবণ যোগ করো।', 'সাদা অবক্ষেপ তৈরি হয় কি না দেখো।', 'অবক্ষেপ dilute acid-এ অদ্রবণীয় থাকলে sulfate-এর পক্ষে ফল।'],
      optionAnalysis: ['সঠিক: BaSO₄-এর সাদা, dilute acid-এ অদ্রবণীয় precipitate।', 'BaCO₃ acid-এ CO₂ দিয়ে দ্রবীভূত হয়; acidification-এ বাধা কমে।', 'chloride-এর জন্য BaCl₂ যোগে এই অদ্রবণীয় precipitate হয় না।', 'ammonium ion-এর এই precipitation reaction নেই।']
    }, [ionRef]);

  add('cl-v95-qchem-chloride-test-001', 'chem1-02', 12, 3, 'conceptual',
    'অজানা দ্রবণ dilute HNO₃ দিয়ে acidify করে AgNO₃ যোগ করলে সাদা curdy precipitate হলো; dilute NH₃ যোগ করলে তা দ্রবীভূত হলো। কোন আয়নটি সবচেয়ে সম্ভাব্য?',
    ['Cl⁻', 'SO₄²⁻', 'CO₃²⁻', 'NO₃⁻'], 0, {
      core: 'Silver ion chloride-এর সঙ্গে সাদা AgCl precipitate তৈরি করে। AgCl ammonia-র সঙ্গে complex ion গঠন করে দ্রবীভূত হয়।',
      analysis: 'Ag⁺ + Cl⁻ → AgCl(s)। এরপর AgCl + 2NH₃ ⇌ [Ag(NH₃)₂]⁺ + Cl⁻; complex formation-এর ফলে precipitate দ্রবীভূত হয়। Dilute HNO₃ দিয়ে acidification carbonate-এর interference কমায়।',
      formula: 'Ag⁺ + Cl⁻ → AgCl(s); AgCl + 2NH₃ ⇌ [Ag(NH₃)₂]⁺ + Cl⁻',
      misconception: 'AgNO₃-এর আগে HNO₃ ব্যবহার করা হয়; HCl দিয়ে acidify করলে পরীক্ষায় chloride নিজেই যোগ হয়ে false positive দিতে পারে।',
      realWorld: 'পানি ও অজানা inorganic salt-এ chloride শনাক্তকরণের সাধারণ qualitative test।',
      steps: ['Dilute HNO₃ দিয়ে নমুনা acidify করো।', 'AgNO₃ যোগ করে সাদা precipitate পর্যবেক্ষণ করো।', 'Dilute NH₃ যোগ করে precipitate দ্রবীভূত হয় কি না দেখো।', 'সাদা precipitate দ্রবীভূত হলে AgCl-এর সঙ্গে সামঞ্জস্যপূর্ণ ফল।'],
      optionAnalysis: ['সঠিক: AgCl সাদা এবং dilute ammonia-তে দ্রবীভূত হয়।', 'Sulfate-এর জন্য barium salt-এর test বেশি নির্দিষ্ট।', 'Carbonate AgNO₃-এর সঙ্গে আচরণ করতে পারে, কিন্তু acidification-এর ফলে carbonate ভেঙে যায়; ammonia dissolution test AgCl-কে সমর্থন করে।', 'Nitrate সাধারণত AgNO₃-এর সঙ্গে এমন insoluble precipitate দেয় না।']
    }, [ionRef]);

  add('cl-v95-qchem-iron-cation-tests-001', 'chem1-02', 12, 4, 'conceptual',
    'একটি তাজা নমুনায় NaOH যোগ করে সঙ্গে সঙ্গে pale-green precipitate দেখা গেল; কিছুক্ষণ বাতাসে রাখলে তা বাদামি হলো। কোন আয়নটির সঙ্গে পর্যবেক্ষণটি মেলে?',
    ['Fe²⁺', 'Fe³⁺', 'Al³⁺', 'Cu²⁺'], 0, {
      core: 'Fe²⁺ আয়ন NaOH-এর সঙ্গে সবুজাভ Fe(OH)₂ precipitate তৈরি করে; বাতাসের অক্সিজেনে তা ধীরে ধীরে Fe(III) যৌগে জারিত হয়ে বাদামি হয়।',
      analysis: 'Fe²⁺ + 2OH⁻ → Fe(OH)₂(s) (pale green)। বাতাসে oxidation হলে Fe(III) hydroxide/oxyhydroxide-জাতীয় বাদামি পদার্থ দেখা যায়। Fe³⁺ সাধারণত শুরু থেকেই reddish-brown Fe(OH)₃ দেয়।',
      formula: 'Fe²⁺ + 2OH⁻ → Fe(OH)₂(s); oxidation by air → brown Fe(III) product',
      misconception: 'প্রাথমিক precipitate-এর রং ও কিছুক্ষণ পরের রং আলাদা করে পর্যবেক্ষণ করতে হয়; পরে বাদামি হওয়াকে শুরু থেকেই Fe³⁺ ছিল বলে ধরে নেওয়া ভুল।',
      realWorld: 'লোহা-যুক্ত পানি, ধাতব লবণ ও qualitative cation analysis-এ oxidation state পার্থক্য করতে কাজে লাগে।',
      steps: ['NaOH যোগের পরপরই precipitate-এর রং নথিভুক্ত করো।', 'Pale-green হলে Fe(OH)₂ হওয়ার সম্ভাবনা বিবেচনা করো।', 'বাতাসে রেখে রঙের পরিবর্তন দেখো।', 'শুরুতে Fe³⁺ হলে সাধারণত reddish-brown precipitate প্রত্যাশিত—তাই initial observation গুরুত্বপূর্ণ।'],
      optionAnalysis: ['সঠিক: Fe²⁺ প্রথমে pale green precipitate দেয়, যা বাতাসে বাদামি হয়।', 'Fe³⁺ সাধারণত শুরু থেকেই reddish-brown precipitate দেয়।', 'Al³⁺ সাদা gelatinous hydroxide দেয়।', 'Cu²⁺ সাধারণত pale-blue hydroxide precipitate দেয়।']
    }, [ionRef]);

  add('cl-v95-qchem-crystal-washing-001', 'chem1-02', 13, 3, 'conceptual',
    'কোনো দ্রবণ থেকে বিশুদ্ধ স্ফটিক আলাদা করার পর স্ফটিকগুলো অল্প পরিমাণ বরফ-ঠান্ডা উপযুক্ত দ্রাবক দিয়ে ধোয়া হয় কেন?',
    ['পৃষ্ঠে লেগে থাকা mother liquor ও দ্রবণীয় অমিশ্রণ সরাতে, অথচ স্ফটিকের ক্ষয় কমাতে', 'স্ফটিককে সম্পূর্ণ গলিয়ে আবার দ্রবণ বানাতে', 'স্ফটিকের গলনাঙ্ক বাড়াতে', 'স্ফটিকের রাসায়নিক সংকেত পরিবর্তন করতে'], 0, {
      core: 'Crystallization-এর পর crystal surface-এ mother liquor ও soluble impurity লেগে থাকতে পারে। অল্প ঠান্ডা solvent এই অমিশ্রণ সরায়, আর কম তাপমাত্রায় product-এর solubility সাধারণত কম হওয়ায় product loss কমে।',
      analysis: 'ধোয়ার জন্য দ্রাবক অল্প নেওয়া এবং ঠান্ডা রাখা হয়, যাতে surface impurity সরে কিন্তু মূল স্ফটিক বেশি দ্রবীভূত না হয়। দ্রাবকটি এমন হতে হবে যাতে target compound-এর ঠান্ডা অবস্থায় দ্রাব্যতা কম।',
      formula: 'Purification principle: impurity removal with minimum product dissolution',
      misconception: 'যেকোনো ঠান্ডা তরল উপযুক্ত নয়; solvent অবশ্যই target crystal-এর সঙ্গে রাসায়নিক বিক্রিয়া করবে না এবং প্রয়োজনীয় দ্রাব্যতা-নির্বাচন থাকতে হবে।',
      realWorld: 'ল্যাবরেটরিতে পুনঃস্ফটিকায়নের পর বিশুদ্ধ কঠিন পদার্থ সংগ্রহে ব্যবহৃত হয়।',
      steps: ['ফিল্টার করে crystal ও mother liquor আলাদা করো।', 'নমুনার জন্য উপযুক্ত cold solvent বেছে নাও।', 'অল্প solvent দিয়ে crystal surface rinse করো।', 'দ্রুত শুকিয়ে product loss ও residual solvent কমাও।'],
      optionAnalysis: ['সঠিক: surface impurity সরানো এবং crystal dissolution কমানো—দুই উদ্দেশ্য।', 'গলিয়ে ফেলা purification ধাপের উদ্দেশ্যের বিপরীত।', 'ধোয়া গলনাঙ্ক বাড়ানোর রাসায়নিক প্রক্রিয়া নয়।', 'এতে target compound-এর পরিচয় বদলানোর কথা নয়।']
    }, [ionRef]);

  var ids = Object.create(null);
  questions.forEach(function (q) {
    if (ids[q.id]) throw new Error('Duplicate v95 authored question ID: ' + q.id);
    ids[q.id] = true;
    if (q.o.length !== 4 || new Set(q.o).size !== 4 || q.a < 0 || q.a > 3) throw new Error('Invalid answer/options for ' + q.id);
  });
  w.CL_AUTHORED_HSC_QUESTIONS_V95 = {
    version: 95, questions: questions, status: 'draft-unreviewed',
    focusChapters: ['phy1-02', 'chem1-02'],
    note: 'Twenty new individually authored question drafts. No item is expert-approved; attached references are source-page checked, not proof of question approval.'
  };
})(window);
