/* Golden Snitch v92 — three original text-first HSC question drafts.
   No interactive model is embedded in the question stem. All records remain unreviewed. */
(function (w) {
  'use strict';
  var bank = w.CL_AUTHORED_HSC_QUESTIONS_V89;
  if (!bank || !Array.isArray(bank.questions)) return;

  var refs = {
    circuit: {
      title: 'OpenStax College Physics 2e — 20.2 Ohm’s Law: Resistance and Simple Circuits',
      url: 'https://openstax.org/books/college-physics-2e/pages/20-2-ohms-law-resistance-and-simple-circuits',
      institution: 'OpenStax', section: '20.2', referenceStatus: 'source-page-title-and-section-checked-2026-11-20'
    },
    power: {
      title: 'OpenStax College Physics 2e — 20.4 Electric Power and Energy',
      url: 'https://openstax.org/books/college-physics-2e/pages/20-4-electric-power-and-energy',
      institution: 'OpenStax', section: '20.4', referenceStatus: 'source-page-title-and-section-checked-2026-11-20'
    },
    equilibrium: {
      title: 'OpenStax Chemistry 2e — 13.2 Equilibrium Constants',
      url: 'https://openstax.org/books/chemistry-2e/pages/13-2-equilibrium-constants',
      institution: 'OpenStax', section: '13.2', referenceStatus: 'source-page-title-and-section-checked-2026-11-20'
    },
    derivative: {
      title: 'OpenStax Calculus Volume 1 — 3.1 Defining the Derivative',
      url: 'https://openstax.org/books/calculus-volume-1/pages/3-1-defining-the-derivative',
      institution: 'OpenStax', section: '3.1', referenceStatus: 'source-page-title-and-section-checked-2026-11-20'
    },
    ohmsVideo: {
      title: 'Ohm’s law | Physics | Khan Academy', url: 'https://www.youtube.com/watch?v=FuIn1L3qeqI',
      institution: 'Khan Academy', referenceStatus: 'video-title-channel-and-description-checked-2026-11-20'
    },
    equilibriumVideo: {
      title: 'Chemical Equilibrium Constant K - Ice Tables - Kp and Kc', url: 'https://www.youtube.com/watch?v=J4WJCYpTYj8',
      institution: 'The Organic Chemistry Tutor', referenceStatus: 'video-title-channel-and-description-checked-2026-11-20'
    },
    derivativeVideo: {
      title: 'Calculus: Derivatives 1 | Taking derivatives | Differential Calculus | Khan Academy', url: 'https://www.youtube.com/watch?v=rAof9Ld5sOg',
      institution: 'Khan Academy', referenceStatus: 'video-title-channel-and-description-checked-2026-11-20'
    }
  };
  function item(id, chapterId, topicIndex, tier, q, o, a, core, analysis, formula, misconception, realWorld, steps, references) {
    return {
      id: id, questionId: id, chapterId: chapterId, topicIndex: topicIndex,
      q: q, o: o, a: a, tier: tier, questionType: 'mathematical',
      authoredHscConcept: true, syllabusGenerated: false,
      contentOrigin: 'authored', qualityStatus: 'draft-unreviewed',
      qualityApproved: false, editorialReviewed: false,
      learningObjective: 'পরিবর্তনশীল পরামিতি নিয়ন্ত্রণ করে সূত্র, শর্ত ও ফলাফলের সম্পর্ক বিশ্লেষণ',
      media: [],
      explanation: {
        core: core, analysis: analysis, formula: formula,
        simple: 'একটি করে পরামিতি বদলাও; অন্য শর্ত স্থির রেখে ফলের পরিবর্তন তুলনা করো।',
        misconception: misconception, realWorld: realWorld,
        steps: steps,
        references: references.map(function (r) { return Object.assign({}, r); }),
        referenceStatus: 'source-page-title-and-section-checked; academic-question-review-pending',
        media: []
      }
    };
  }

  var additions = [
    item(
      'cl-v91-text-phy2-03-ohms-law-power-001', 'phy2-03', 5, 2,
      'একটি আদর্শ সরল বর্তনীতে ১২ V উৎসের সঙ্গে ৪ Ω রোধ যুক্ত। V=12 V ও R=4 Ω হলে রোধের মধ্য দিয়ে তড়িৎ প্রবাহ এবং রোধে ক্ষয়িত ক্ষমতা কত হবে?',
      ['১.৫ A এবং ১৮ W', '৩.০ A এবং ৩৬ W', '৪.০ A এবং ৪৮ W', '৮.০ A এবং ৯৬ W'], 1,
      'ওহমের সূত্রে রোধের মধ্য দিয়ে প্রবাহ I=V/R। রোধে বৈদ্যুতিক ক্ষমতা P=VI=V²/R।',
      'I=12/4=3 A। এরপর P=VI=12×3=36 W। একই ফল P=V²/R=144/4=36 W থেকেও পাওয়া যায়। এই ফল আদর্শ স্থির রোধের সরল DC বর্তনীর জন্য।',
      'I=V/R; P=VI=V²/R; 1 Ω = 1 V/A',
      'রোধ বাড়ালে একই ভোল্টেজে প্রবাহ বাড়ে—এ ধারণা উল্টো; I=V/R অনুযায়ী রোধ বাড়লে প্রবাহ কমে। P=V²/R ব্যবহার করতে হলে রোধে ভোল্টেজ স্থির আছে ধরে নিতে হবে।',
      'নির্দিষ্ট সরবরাহ ভোল্টেজে কোনো রোধক/লোডের প্রবাহ ও তাপীয় শক্তি অপচয় অনুমান করতে এই সম্পর্ক লাগে।',
      ['প্রদত্ত উৎস বিভব V=12 V এবং রোধ R=4 Ω শনাক্ত করো।', 'ওহমের সূত্রে I=V/R=12/4=3 A নির্ণয় করো।', 'P=VI=12×3=36 W হিসাব করো।', 'একই মান P=V²/R দিয়ে মিলিয়ে দেখো।'], [refs.circuit, refs.power, refs.ohmsVideo]
    ),
    item(
      'cl-v91-text-chem1-04-equilibrium-kc-001', 'chem1-04', 12, 3,
      'N₂O₄(g) ⇌ 2NO₂(g) বিক্রিয়ায় একটি নির্দিষ্ট তাপমাত্রায় সাম্যাবস্থায় [NO₂]=0.20 mol L⁻¹ এবং [N₂O₄]=0.10 mol L⁻¹। এই সাম্যঘনমাত্রাগুলো থেকে Kc কত হবে?',
      ['০.২০', '০.৪০', '২.০', '৪.০'], 1,
      'সাম্যধ্রুবক Kc-এর রাশিমালায় উৎপাদকের সাম্যঘনমাত্রা তাদের stoichiometric সহগের ঘাতে থাকে এবং বিক্রিয়কের রাশি হরে থাকে।',
      'Kc=[NO₂]²/[N₂O₄]=(0.20)²/0.10=0.040/0.10=0.40। এখানে Kc-এর সংখ্যামান চাওয়া হয়েছে; standard-state-ভিত্তিক equilibrium constant dimensionless, তাই বিকল্পে একক দেখানো হয়নি। কঠিন ও বিশুদ্ধ তরল থাকলে সেগুলো Kc-এর রাশিমালায় অন্তর্ভুক্ত হয় না।',
      'Kc = [NO₂]²/[N₂O₄]',
      'NO₂-এর সহগ 2 বলে ঘনমাত্রাটিকে বর্গ করতে হয়; কেবল [NO₂]/[N₂O₄] নিলে stoichiometric ঘাত বাদ পড়ে। Kc-এর মান বিক্রিয়ার গতি নির্দেশ করে না এবং নির্দিষ্ট তাপমাত্রায় নির্ধারিত হয়।',
      'NO₂/N₂O₄-এর তাপমাত্রানির্ভর সাম্য এবং বাদামি NO₂ গ্যাসের পরিমাণগত বিশ্লেষণ বুঝতে এই equilibrium expression কাজে লাগে।',
      ['সমীকরণে প্রতিটি প্রজাতির stoichiometric সহগ চিহ্নিত করো।', 'Kc-তে NO₂-এর ঘনমাত্রা বর্গ করে বসাও।', '(0.20)²=0.040 এবং 0.040/0.10=0.40 হিসাব করো।', 'Kc নির্দিষ্ট তাপমাত্রায় ধ্রুব—এই শর্ত মনে রাখো।'], [refs.equilibrium, refs.equilibriumVideo]
    ),
    item(
      'cl-v91-text-math1-09-tangent-derivative-001', 'math1-09', 4, 3,
      'f(x)=3x²−2x ফাংশনের x=2 বিন্দুতে স্পর্শকের ঢাল কত?',
      ['৬', '৮', '১০', '১২'], 2,
      'কোনো বিন্দুতে অন্তরজ f′(a) হলো ঐ বিন্দুতে বক্ররেখার স্পর্শকের ঢাল, যদি অন্তরজটি বিদ্যমান থাকে।',
      'f(x)=3x²−2x হলে f′(x)=6x−2। x=2 বসালে f′(2)=12−2=10। তাই স্পর্শকের ঢাল 10। এখানে অন্তরজের সূত্র প্রয়োগ করলেই স্পর্শকের ঢাল নির্ণয় করা যায়।',
      'd/dx(3x²−2x)=6x−2; f′(2)=10',
      'স্পর্শকের ঢালকে f(2)-এর মানের সঙ্গে গুলিয়ে ফেলা যাবে না। ফাংশনের মান হলো বিন্দুর y-স্থানাঙ্ক; অন্তরজ হলো ঐ বিন্দুতে পরিবর্তনের হার/স্পর্শকের ঢাল।',
      'ক্ষণিক বেগ, প্রান্তিক পরিবর্তন এবং বক্ররেখার স্থানীয় আচরণ বিশ্লেষণে derivative-এর এই জ্যামিতিক অর্থ ব্যবহৃত হয়।',
      ['প্রতিটি পদ আলাদাভাবে অন্তরীকরণ করো: d(3x²)/dx=6x এবং d(−2x)/dx=−2।', 'f′(x)=6x−2 লেখো।', 'x=2 বসিয়ে 6×2−2=10 নির্ণয় করো।', 'ফাংশনের মান 8 এবং ঢাল 10—দুটি আলাদা রাশি তা যাচাই করো।'], [refs.derivative, refs.derivativeVideo]
    )
  ];

  var videoMedia = {
    'cl-v91-text-phy2-03-ohms-law-power-001': { type: 'video', title: refs.ohmsVideo.title, url: refs.ohmsVideo.url, provider: 'Khan Academy', caption: 'পরীক্ষণ থেকে I=V/R সম্পর্ক এবং ohmic ও non-ohmic উপাদানের পার্থক্য ব্যাখ্যা করে।', source: 'YouTube video metadata checked 2026-11-20', rightsStatus: 'link-only', questionSupport: false, verified: false },
    'cl-v91-text-chem1-04-equilibrium-kc-001': { type: 'video', title: refs.equilibriumVideo.title, url: refs.equilibriumVideo.url, provider: 'The Organic Chemistry Tutor', caption: 'সাম্যঘনমাত্রা থেকে Kc নির্ণয় এবং ICE table-এর ধারণা অনুশীলন করে।', source: 'YouTube video metadata checked 2026-11-20', rightsStatus: 'link-only', questionSupport: false, verified: false },
    'cl-v91-text-math1-09-tangent-derivative-001': { type: 'video', title: refs.derivativeVideo.title, url: refs.derivativeVideo.url, provider: 'Khan Academy', caption: 'অন্তরজকে বক্ররেখার স্পর্শকের ঢাল হিসেবে ব্যাখ্যা করে।', source: 'YouTube video metadata checked 2026-11-20', rightsStatus: 'link-only', questionSupport: false, verified: false }
  };
  additions.forEach(function (q) { q.explanation.media.push(Object.assign({}, videoMedia[q.id])); });

  var ids = Object.create(null);
  bank.questions.forEach(function (q) { ids[q.id] = true; });
  additions.forEach(function (q) {
    if (ids[q.id]) throw new Error('Duplicate v91 authored question ID: ' + q.id);
    ids[q.id] = true;
    bank.questions.push(q);
  });
  bank.version = 92;
  bank.description = 'Original individually written editorial drafts mapped to all 51 supplied HSC chapters; source and topic alignment checks are not academic approval. v92 adds one static vector-diagram question; every record remains unreviewed until qualified subject-specialist sign-off.';
  bank.curation = Object.assign({}, bank.curation || {}, {
    version: 91, newSimulationLedDrafts: additions.length,
    totalIndividuallyAuthoredDrafts: bank.questions.length,
    expertReviewedCount: 0, status: 'editorial-drafts-only'
  });
  w.CL_AUTHORED_HSC_QUESTIONS_V92 = { version: 92, questions: additions, status: 'draft-unreviewed' };
})(window);
