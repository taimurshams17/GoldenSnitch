/* Golden Snitch v98 — second focused Qualitative Chemistry editorial batch.
 * 12 individually written higher-order HSC drafts. Seven have unique static SVG question aids.
 * All records remain unreviewed drafts; nothing is expert-approved by automation.
 */
(function (w) {
  'use strict';
  var refs = {
    quantum: { title: 'OpenStax Chemistry 2e — 6.4 Electronic Structure of Atoms (Electron Configurations)', url: 'https://openstax.org/books/chemistry-2e/pages/6-4-electronic-structure-of-atoms-electron-configurations', institution: 'OpenStax', section: '6.4', status: 'source-page-checked-2026-11-21; question-level-review-pending' },
    solubility: { title: 'OpenStax Chemistry 2e — 15.1 Precipitation and Dissolution', url: 'https://openstax.org/books/chemistry-2e/pages/15-1-precipitation-and-dissolution', institution: 'OpenStax', section: '15.1', status: 'source-page-checked-2026-11-21; question-level-review-pending' },
    separation: { title: 'Royal Society of Chemistry Education — Separation techniques', url: 'https://edu.rsc.org/cpd/separation-techniques/3009787.article', institution: 'Royal Society of Chemistry', status: 'resource-page-checked-2026-11-21; exact HSC method alignment pending' },
    chromatography: { title: 'Royal Society of Chemistry Education — Analytical chemistry introductions', url: 'https://edu.rsc.org/resources/collections/analytical-chemistry-introductions', institution: 'Royal Society of Chemistry', status: 'resource-page-checked-2026-11-21; question-specific review pending' }
  };
  var questions = [];
  var svgSequence = 0;
  function svg(title, description, body) {
    var id = 'cl-v98-diagram-' + (++svgSequence);
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 300" role="img" aria-labelledby="' + id + '-title ' + id + '-desc"><title id="' + id + '-title">' + title + '</title><desc id="' + id + '-desc">' + description + '</desc><rect x="1" y="1" width="638" height="298" rx="18" fill="#f8fafc" stroke="#94a3b8" stroke-width="2"/>' + body + '</svg>';
  }
  function visual(id, title, alt, caption, markup) {
    return [{ id: id, type: 'diagram', kind: 'inline-svg', title: title, alt: alt, caption: caption, html: markup, questionSupport: true, verified: false, rightsStatus: 'original-Golden Snitch-v98', attribution: 'Original Golden Snitch educational diagram', licence: 'Golden Snitch original; specialist review pending' }];
  }
  function add(id, topicIndex, tier, type, stem, options, answer, exp, referenceList, media) {
    var row = {
      id: id, questionId: id, chapterId: 'chem1-02', topicIndex: topicIndex,
      q: stem, o: options, a: answer, tier: tier, questionType: type,
      authoredHscConcept: true, syllabusGenerated: false, contentOrigin: 'individually-authored-v98',
      qualityStatus: 'draft-unreviewed', qualityApproved: false, editorialReviewed: false, editorialApproved: false,
      learningObjective: exp.objective, media: media || [],
      explanation: {
        core: exp.core, analysis: exp.analysis, formula: exp.formula || '',
        misconception: exp.misconception, realWorld: exp.realWorld,
        steps: exp.steps, optionAnalysis: exp.optionAnalysis,
        references: referenceList.map(function (x) { return Object.assign({}, x); }),
        referenceStatus: 'linked-source-page-checked; claim-and-HSC-review-pending', media: []
      }
    };
    if (row.o.length !== 4 || new Set(row.o).size !== 4 || !Number.isInteger(row.a) || row.a < 0 || row.a > 3 || row.explanation.optionAnalysis.length !== 4 || row.explanation.steps.length < 3) throw new Error('Invalid v98 authored record: ' + id);
    questions.push(row);
  }

  add('cl-v98-qchem-quantum-number-validity-001', 1, 3, 'analytical',
    'একটি ইলেকট্রনের জন্য n=3, l=2, mₗ=−3 এবং mₛ=+½ প্রস্তাব করা হলো। সেটটি কেন গ্রহণযোগ্য নয়?',
    ['l=2 হলে mₗ কেবল −2 থেকে +2 হতে পারে; −3 অনুমোদিত নয়','n=3 হলে l অবশ্যই 3 হতে হবে','mₛ-এর মান কেবল 0 হতে পারে','একই ইলেকট্রনের n ও l সমান হওয়া বাধ্যতামূলক'], 0, {
      objective: 'চারটি quantum number-এর allowed range প্রয়োগ করে অসম্ভব quantum state শনাক্ত করা।',
      core: 'Principal quantum number n=3 হলে azimuthal quantum number l-এর পূর্ণসংখ্যা মান 0, 1 বা 2 হতে পারে। l=2 হলে magnetic quantum number mₗ-এর মান −2, −1, 0, +1 বা +2; তাই −3 অনুমোদিত নয়।',
      analysis: 'Spin quantum number mₛ=+½ গ্রহণযোগ্য। n=3 এবং l=2-ও গ্রহণযোগ্য; ত্রুটিটি কেবল mₗ-এ। একটি d-subshell-এ পাঁচটি orbital orientation থাকায় mₗ-এর পাঁচটি মান হয়।',
      formula: 'l = 0,1,…,n−1;  mₗ = −l,…,0,…,+l;  mₛ = ±½',
      misconception: 'একটি সেটে একাধিক quantum number সঠিক হলেই পুরো সেট বৈধ হয় না; প্রতিটি quantum number-এর সীমা আলাদাভাবে পরীক্ষা করতে হয়।',
      realWorld: 'Quantum-number constraints electron configuration ও orbital occupancy নির্ধারণে ব্যবহৃত হয়।',
      steps: ['n=3 থেকে l-এর অনুমোদিত মান 0, 1, 2 যাচাই করো।', 'l=2 হলে mₗ-এর সীমা −2 থেকে +2 লেখো।', 'প্রদত্ত mₗ=−3 এই সীমার বাইরে শনাক্ত করো।', 'mₛ=+½ বৈধ হলেও পুরো সেট অবৈধ সিদ্ধান্ত নাও।'],
      optionAnalysis: ['সঠিক: d-subshell-এর mₗ-এর পাঁচটি মান −2 থেকে +2।', 'l কখনো n-এর সমান হয় না; সর্বোচ্চ n−1।', 'Electron spin-এর দুটি মান ±½।', 'n ও l ভিন্ন ধরনের quantum number; সমান হওয়া বাধ্যতামূলক নয়।']
    }, [refs.quantum]);

  add('cl-v98-qchem-fe2-electron-configuration-001', 3, 3, 'analytical',
    'নিরপেক্ষ Fe পরমাণুর বিন্যাস [Ar] 4s²3d⁶। Fe²⁺ আয়ন তৈরির সময় কোন বিন্যাসটি পাওয়া যায়?',
    ['[Ar] 3d⁶','[Ar] 4s²3d⁴','[Ar] 4s¹3d⁵','[Ar] 4s²3d⁶'], 0, {
      objective: 'Transition-metal cation গঠনে electron অপসারণের সঠিক ক্রম প্রয়োগ করা।',
      core: 'Transition metal-এর cation তৈরির সময় 4s orbital-এ থাকা electron সাধারণত 3d-এর আগে অপসারিত হয়, যদিও neutral atom-এর filling order-এ 4s আগে পূরণ হয়েছিল।',
      analysis: 'Fe-এর neutral configuration [Ar]4s²3d⁶। Fe²⁺ হতে দুটি electron সরাতে হবে। প্রথমে 4s-এর দুটি electron অপসারণ করলে [Ar]3d⁶ থাকে। 3d থেকে আগে সরালে ভুল ion configuration হবে।',
      formula: 'Fe: [Ar]4s²3d⁶  →  Fe²⁺: [Ar]3d⁶',
      misconception: 'Orbital filling order এবং transition-metal cation থেকে electron removal order এক জিনিস নয়।',
      realWorld: 'Transition-metal ion-এর electron configuration তাদের oxidation state, colour ও magnetic behaviour বুঝতে প্রয়োজন।',
      steps: ['Fe-এর atomic number 26 থেকে neutral configuration শনাক্ত করো।', 'Fe²⁺ মানে মোট দুটি electron বাদ দিতে হবে।', 'প্রথমে 4s-এর দুটি electron সরাও।', 'ফল [Ar]3d⁶ যাচাই করো।'],
      optionAnalysis: ['সঠিক: 4s-এর দুই electron অপসারণের পর d⁶ থাকে।', '3d থেকে electron সরানো হয়েছে, 4s পূর্ণ রেখে দেওয়া হয়েছে।', 'একটি 4s ও একটি 3d electron সরানো হয়েছে; সাধারণ ion formation-এ এটি সঠিক ক্রম নয়।', 'এটি neutral Fe-এর configuration, Fe²⁺ নয়।']
    }, [refs.quantum]);

  add('cl-v98-qchem-oxygen-unpaired-electrons-001', 3, 3, 'analytical',
    'অক্সিজেনের ground-state configuration 1s²2s²2p⁴। Hund-এর নীতি অনুযায়ী 2p উপস্তরে কয়টি unpaired electron থাকে?',
    ['২টি','১টি','৩টি','৪টি'], 0, {
      objective: 'সমশক্তির p-orbital-এ Hund-এর নীতি ব্যবহার করে unpaired electron গণনা করা।',
      core: 'p-subshell-এ তিনটি সমশক্তির orbital থাকে। চারটি electron বসানোর সময় প্রথম তিনটি orbital-এ সমান্তরাল spin-এ একটি করে বসে; চতুর্থটি একটি orbital-এ জোড়া গঠন করে। ফলে দুটি unpaired electron থাকে।',
      analysis: '2p⁴ orbital diagram: [↑↓] [↑] [↑]। প্রথমে তিনটি orbital আলাদাভাবে একক electron পায়; এরপর চতুর্থ electron একটি orbital-এ বিপরীত spin নিয়ে জোড়া বাঁধে।',
      formula: '2p⁴ :  [↑↓] [↑] [↑]  →  2 unpaired electrons',
      misconception: '2p⁴-তে চারটি electron আছে বলে চারটি unpaired নয়; Pauli ও Hund-এর নিয়ম মেনে একটি pair তৈরি হয়।',
      realWorld: 'Unpaired electron-এর সংখ্যা paramagnetism-এর প্রাথমিক ধারণা দিতে সাহায্য করে।',
      steps: ['p-subshell-এ তিনটি orbital চিহ্নিত করো।', 'প্রথম তিনটি electron আলাদা orbital-এ সমান্তরাল spin-এ বসাও।', 'চতুর্থ electron একটি orbital-এ বিপরীত spin-এ জোড়া করো।', 'দুটি একক তীর অবশিষ্ট আছে বলে গণনা করো।'],
      optionAnalysis: ['সঠিক: একটি pair এবং দুটি unpaired electron থাকে।', 'একটি orbital-এ pair গঠনের ফলে দুটি একক electron থাকে।', 'তিনটি unpaired থাকলে সেটি 2p³-এর মতো বিন্যাস।', 'প্রতিটি electron আলাদা orbital-এ থাকলে চারটি লাগত, কিন্তু p-তে orbital তিনটি।']
    }, [refs.quantum], visual('v98-oxygen-orbital-boxes','2p⁴ orbital filling','তিনটি p orbital box-এ একটি box-এ ↑↓ এবং অন্য দুইটিতে একটি করে ↑ arrow।','Hund-এর নীতি অনুযায়ী আগে তিনটি degenerate orbital-এ একক electron বসে, পরে pairing হয়।', svg('Oxygen 2p orbital filling','Three p orbital boxes with one paired orbital and two singly occupied orbitals','<g transform="translate(125 80)" fill="none" stroke="#334155" stroke-width="3"><rect x="0" y="0" width="90" height="110" rx="5"/><rect x="105" y="0" width="90" height="110" rx="5"/><rect x="210" y="0" width="90" height="110" rx="5"/></g><g stroke="#2563eb" stroke-width="5" fill="none"><path d="M155 165V105m-9 12 9-12 9 12M180 105V165m-9-12 9 12 9-12M260 165V105m-9 12 9-12 9 12M365 165V105m-9 12 9-12 9 12"/></g><g font-size="18" fill="#334155" text-anchor="middle"><text x="170" y="220">2p⁴</text><text x="300" y="220">দুটি unpaired electron</text></g>')));

  add('cl-v98-qchem-photon-energy-ratio-001', 4, 2, 'mathematical',
    'একটি UV photon-এর wavelength 200 nm এবং একটি violet visible photon-এর wavelength 400 nm। প্রথম photon-এর শক্তি দ্বিতীয়টির তুলনায় কত গুণ?',
    ['২ গুণ','½ গুণ','৪ গুণ','সমান'], 0, {
      objective: 'একই মাধ্যমে photon energy ও wavelength-এর ব্যস্তানুপাত প্রয়োগ করা।',
      core: 'একটি photon-এর শক্তি E=hc/λ, যেখানে h হলো Planck ধ্রুবক, c হলো শূন্যস্থানে আলোর বেগ এবং λ হলো wavelength। h ও c অপরিবর্তিত থাকলে wavelength যত কমে, photon energy তত বাড়ে; অর্থাৎ শক্তি wavelength-এর ব্যস্তানুপাতিক।',
      analysis: 'দুই photon-এর শক্তির অনুপাত E₍₂₀₀₎/E₍₄₀₀₎ = λ₍₄₀₀₎/λ₍₂₀₀₎ = 400/200 = 2। 200 nm হলো 400 nm-এর অর্ধেক wavelength, তাই 200 nm photon-এর শক্তি দ্বিগুণ। এটি প্রতি photon-এর শক্তির তুলনা; সমান সংখ্যক photon না হলে মোট beam energy সম্পর্কে আলাদা করে সিদ্ধান্ত নেওয়া যায় না।',
      formula: 'E = hc/λ  ⇒  E₁/E₂ = λ₂/λ₁',
      misconception: 'Wavelength দ্বিগুণ হলে photon energy অর্ধেক হয়; শক্তি wavelength-এর সঙ্গে সরাসরি বাড়ে না।',
      realWorld: 'UV radiation-এর photon energy visible violet light-এর চেয়ে বেশি হওয়ায় কিছু পদার্থে ভিন্ন electronic transition ঘটাতে পারে।',
      steps: ['দুটি wavelength একই এককে আছে কি না যাচাই করো।', 'E=hc/λ সম্পর্ক লেখো।', 'শক্তির অনুপাত উল্টো wavelength ratio হিসেবে লেখো।', '400/200=2 নির্ণয় করো।'],
      optionAnalysis: ['সঠিক: wavelength অর্ধেক হলে photon energy দ্বিগুণ।', 'অনুপাত উল্টো করা হয়েছে।', 'wavelength ratio-এর বর্গ ব্যবহার করা ভুল।', 'দুটি wavelength আলাদা, তাই photon energy সমান নয়।']
    }, [refs.quantum], visual('v98-photon-energy-ratio','Wavelength and photon energy','২০০ nm-এর ছোট wavelength ও ৪০০ nm-এর দ্বিগুণ wavelength তুলনা; ছোট wavelength-এ বেশি photon energy।','E=hc/λ অনুযায়ী ২০০ nm photon-এর শক্তি ৪০০ nm photon-এর দ্বিগুণ।', svg('Photon energy versus wavelength','Two wavelength bars; the shorter 200 nm bar is associated with double energy of 400 nm','<g font-size="20" fill="#334155"><text x="80" y="72">200 nm · UV</text><text x="80" y="205">400 nm · violet</text></g><path d="M90 105H230M90 238H370" stroke="#7c3aed" stroke-width="7" stroke-linecap="round"/><g fill="#0f766e"><rect x="420" y="83" width="70" height="45" rx="8"/><rect x="420" y="216" width="35" height="45" rx="8"/></g><g font-size="18" fill="#0f766e"><text x="510" y="112">2E</text><text x="470" y="245">E</text></g><text x="320" y="165" font-size="19" fill="#334155">λ অর্ধেক → E দ্বিগুণ</text>')));

  add('cl-v98-qchem-common-ion-solubility-001', 11, 4, 'mathematical',
    '25°C-এ AgCl-এর Ksp=1.8×10⁻¹⁰। 0.10 M NaCl দ্রবণে AgCl-এর দ্রাব্যতা আনুমানিক কত? ধরে নাও AgCl থেকে আসা অতিরিক্ত Cl⁻, 0.10 M-এর তুলনায় নগণ্য।',
    ['1.8×10⁻⁹ M','1.8×10⁻¹⁰ M','1.8×10⁻⁵ M','1.0×10⁻¹ M'], 0, {
      objective: 'Common-ion effect ব্যবহার করে উপস্থিত common ion-সহ sparingly soluble salt-এর দ্রাব্যতা নির্ণয় করা।',
      core: 'AgCl(s) ⇌ Ag⁺ + Cl⁻। NaCl থেকে আগে থেকেই 0.10 M Cl⁻ থাকায় Ksp expression-এ [Cl⁻] প্রায় 0.10 M ধরা যায়।',
      analysis: 'Ksp=[Ag⁺][Cl⁻]=s(0.10)। তাই s=1.8×10⁻¹⁰/0.10=1.8×10⁻⁹ M। বিশুদ্ধ পানিতে সমদ্রবণীয়তার সঙ্গে এটি এক নয়; common ion দ্রাব্যতা কমিয়েছে।',
      formula: 'Ksp = s(0.10);  s = 1.8×10⁻¹⁰ / 0.10 = 1.8×10⁻⁹ M',
      misconception: 'AgCl-এর জন্য Ksp=[Ag⁺][Cl⁻]; common ion থাকলে [Cl⁻]=s ধরে নেওয়া যায় না।',
      realWorld: 'Common-ion effect selective precipitation এবং qualitative separation scheme-এ কাজে লাগে।',
      steps: ['AgCl-এর dissolution equation লেখো।', 'দ্রবীভবন থেকে [Ag⁺]=s ধরো।', 'NaCl থেকে পাওয়া [Cl⁻]≈0.10 M বসাও।', 'Ksp expression rearrange করে s=1.8×10⁻⁹ M বের করো।'],
      optionAnalysis: ['সঠিক: 1.8×10⁻¹⁰-কে 0.10 দিয়ে ভাগ করলে 1.8×10⁻⁹।', 'এটি Ksp-কে সরাসরি molar solubility ধরা; Cl⁻ factor বাদ।', 'ঘাতের হিসাব ও দশমিক স্থান ভুল।', 'এটি NaCl-এর concentration, AgCl-এর solubility নয়।']
    }, [refs.solubility], visual('v98-agcl-common-ion','Common-ion suppression of AgCl solubility','একটি বীকারে AgCl-এর equilibrium; বাইরে থেকে যোগ করা Cl⁻ dissolution equilibrium-কে বামে সরায়।','NaCl থেকে Cl⁻ যোগ হলে AgCl-এর molar solubility কমে।', svg('Common ion effect on AgCl','AgCl solid and Ag+ Cl- ions in equilibrium; added chloride shifts equilibrium toward solid','<rect x="80" y="70" width="210" height="155" rx="14" fill="#e0f2fe" stroke="#0284c7" stroke-width="2"/><rect x="350" y="70" width="210" height="155" rx="14" fill="#fef3c7" stroke="#d97706" stroke-width="2"/><g font-size="17" fill="#334155" text-anchor="middle"><text x="185" y="48">বিশুদ্ধ জল</text><text x="455" y="48">NaCl যোগের পর</text><text x="185" y="205">AgCl ⇌ Ag⁺ + Cl⁻</text><text x="455" y="205">Cl⁻ বৃদ্ধি → equilibrium বামে</text></g><g fill="#64748b"><circle cx="135" cy="120" r="8"/><circle cx="165" cy="120" r="8"/><circle cx="195" cy="120" r="8"/><circle cx="225" cy="120" r="8"/></g><g fill="#0f766e"><circle cx="410" cy="120" r="8"/><circle cx="440" cy="120" r="8"/><circle cx="470" cy="120" r="8"/><circle cx="500" cy="120" r="8"/><circle cx="530" cy="120" r="8"/></g><text x="320" y="150" text-anchor="middle" font-size="30" fill="#7c3aed">→</text>')));

  add('cl-v98-qchem-agcl-precipitation-threshold-001', 11, 4, 'mathematical',
    'একটি মিশ্রণে [Ag⁺]=2.0×10⁻⁵ M এবং [Cl⁻]=1.0×10⁻⁵ M। AgCl-এর Ksp=1.8×10⁻¹⁰ হলে মিশ্রণটি সম্পর্কে কোন সিদ্ধান্ত সঠিক?',
    ['Qsp=2.0×10⁻¹⁰, তাই AgCl precipitation শুরু হবে','Qsp=2.0×10⁻¹⁰, তাই দ্রবণ অসম্পৃক্ত থাকবে','Qsp=1.8×10⁻¹⁰, তাই saturated','Qsp=2.0×10⁻⁵, তাই Ksp-এর সঙ্গে তুলনা করা যায় না'], 0, {
      objective: 'Ion product Qsp-কে Ksp-এর সঙ্গে তুলনা করে precipitation শুরু হবে কি না নির্ণয় করা।',
      core: 'AgCl-এর জন্য Qsp=[Ag⁺][Cl⁻]। Qsp>Ksp হলে দ্রবণ supersaturated এবং precipitation thermodynamically favourable; Qsp<Ksp হলে precipitation শুরু হয় না।',
      analysis: 'Qsp=(2.0×10⁻⁵)(1.0×10⁻⁵)=2.0×10⁻¹⁰। এটি Ksp=1.8×10⁻¹⁰-এর চেয়ে সামান্য বেশি। তাই প্রদত্ত আদর্শ equilibrium model অনুযায়ী AgCl precipitation শুরু হবে।',
      formula: 'Qsp = [Ag⁺][Cl⁻] = 2.0×10⁻¹⁰;  Qsp > Ksp',
      misconception: 'Qsp ও Ksp-এর সংখ্যামান একই unitless concentration convention-এ তুলনা করতে হয়; শুধু একটি ion concentration দিয়ে সিদ্ধান্ত হয় না।',
      realWorld: 'Selective precipitation-এ দ্রবণে কোন আয়ন আগে অবক্ষেপ হবে তা অনুমান করতে Qsp/Ksp তুলনা গুরুত্বপূর্ণ।',
      steps: ['AgCl-এর Ksp expression লেখো।', 'দুটি ion concentration গুণ করে Qsp বের করো।', 'Qsp-কে Ksp-এর সঙ্গে তুলনা করো।', '2.0×10⁻¹⁰ > 1.8×10⁻¹⁰ বলে precipitation হবে সিদ্ধান্ত নাও।'],
      optionAnalysis: ['সঠিক: Qsp সামান্য হলেও Ksp অতিক্রম করেছে।', 'Qsp>Ksp হলে অসম্পৃক্ত নয়; supersaturated।', 'Qsp-এর মানকে Ksp-এর সমান ধরে নেওয়া হয়েছে।', 'Qsp-এর exponent যোগ করে concentration গুণফল না করার ভুল।']
    }, [refs.solubility]);

  add('cl-v98-qchem-selective-precipitation-agbr-001', 12, 4, 'analytical',
    'একই দ্রবণে সমান ঘনমাত্রার Cl⁻ ও Br⁻ আছে। ধীরে AgNO₃ যোগ করা হলে AgCl-এর Ksp=1.8×10⁻¹⁰ এবং AgBr-এর Ksp=5.0×10⁻¹³। কোন অবক্ষেপটি আগে তৈরি হওয়ার কথা?',
    ['AgBr, কারণ একই halide concentration-এ তার Ksp কম','AgCl, কারণ তার Ksp বেশি','দুটিই অবশ্যই একই মুহূর্তে তৈরি হবে','কোনোটিই তৈরি হবে না, কারণ AgNO₃ সম্পূর্ণ দ্রবণীয়'], 0, {
      objective: 'ভিন্ন Ksp-যুক্ত লবণের selective precipitation sequence যুক্তি দিয়ে নির্ণয় করা।',
      core: 'দুটি salt-এর anion concentration সমান হলে যে salt-এর Ksp কম, তার precipitation শুরু করতে আরও কম [Ag⁺] প্রয়োজন।',
      analysis: 'AgX-এর জন্য precipitation threshold-এ [Ag⁺]crit=Ksp/[X⁻]। সমান [Cl⁻] ও [Br⁻]-এ AgBr-এর Ksp অনেক কম, তাই AgBr-এর threshold [Ag⁺] আগে পূরণ হবে। বাস্তব separation-এ concentration, complex formation ও ionic strength-ও বিবেচ্য।',
      formula: '[Ag⁺]crit = Ksp / [X⁻]',
      misconception: 'Ksp বেশি মানে কম দ্রাব্যতা নয়; একই stoichiometry-র ক্ষেত্রে কম Ksp সাধারণত বেশি অল্প দ্রবণীয়তার নির্দেশক।',
      realWorld: 'Group analysis-এ controlled reagent addition দিয়ে আয়নগুলো পর্যায়ক্রমে precipitate করা যায়।',
      steps: ['AgCl ও AgBr-এর Ksp expression লিখো।', 'Threshold [Ag⁺]=Ksp/[halide] লেখো।', 'Halide concentration সমান বলে Ksp তুলনা করো।', 'AgBr-এর Ksp ছোট, তাই সেটি আগে precipitate হবে।'],
      optionAnalysis: ['সঠিক: সমান halide concentration-এ কম Ksp-র AgBr আগে precipitate করে।', 'বেশি Ksp-র salt-কে আগে precipitate করার দাবি উল্টো।', 'Ksp ভিন্ন হওয়ায় threshold-ও ভিন্ন।', 'AgNO₃ দ্রবণীয় হলেও Ag⁺ অল্পদ্রাব্য halide salt তৈরি করতে পারে।']
    }, [refs.solubility]);

  add('cl-v98-qchem-crystallization-purification-001', 14, 3, 'scenario',
    'একটি impure ionic solid গরম পানিতে বেশি দ্রবণীয়, কিন্তু ঠান্ডা পানিতে কম দ্রবণীয়। দ্রবণে থাকা অধিকাংশ impurity গরম ও ঠান্ডা—দুই অবস্থাতেই দ্রবণীয়। বিশুদ্ধ crystal পেতে কোন পদ্ধতিটি সবচেয়ে উপযুক্ত?',
    ['গরম saturated solution তৈরি, hot filtration, ধীরে ঠান্ডা করে crystal আলাদা ও অল্প ঠান্ডা solvent দিয়ে ধোয়া','ঠান্ডা পানিতে সম্পূর্ণ অদ্রবণীয় করা ও সব solid একসঙ্গে শুকানো','দ্রবণ ফুটিয়ে সব solute-কে গ্যাসে রূপান্তর করা','দ্রবণের সব solvent সরিয়ে না ধুয়েই কঠিন অবশিষ্ট সংগ্রহ করা'], 0, {
      objective: 'দ্রাব্যতার তাপমাত্রা-নির্ভরতা ব্যবহার করে crystallization-এর purification sequence নির্বাচন।',
      core: 'Recrystallization-এ পদার্থকে গরম solvent-এ দ্রবীভূত করে hot filtration-এ অদ্রবণীয় impurity সরানো হয়। ধীরে ঠান্ডা করলে লক্ষ্য compound crystal হয়; বেশি দ্রবণীয় impurity mother liquor-এ থাকে।',
      analysis: 'Crystal গঠনের পর filtration করে আলাদা করতে হয় এবং অল্প বরফ-ঠান্ডা solvent দিয়ে ধুতে হয়, যাতে crystal-এর কিছু অংশ গলে না যায়। দ্রুত cooling বা বেশি wash solvent yield কমাতে পারে।',
      formula: 'Purification: hot dissolve → hot filter → controlled cooling → filter crystals → cold wash → dry',
      misconception: 'Crystallization-এ সব impurity অদৃশ্য হয় না; যে impurity একইভাবে crystal lattice-এ ঢোকে বা সহ-স্ফটিকায়িত হয়, তার জন্য অতিরিক্ত purification প্রয়োজন হতে পারে।',
      realWorld: 'ল্যাবরেটরিতে কঠিন জৈব ও অজৈব যৌগ বিশুদ্ধ করতে recrystallization ব্যবহৃত হয়।',
      steps: ['যথাসম্ভব কম গরম solvent-এ crude solid দ্রবীভূত করো।', 'গরম অবস্থায় filter করে insoluble impurity সরাও।', 'দ্রবণ ধীরে ঠান্ডা করে crystal গঠন করো।', 'Crystal filter, অল্প ঠান্ডা solvent দিয়ে wash এবং dry করো।'],
      optionAnalysis: ['সঠিক: এতে insoluble impurity hot filtration-এ এবং soluble impurity mother liquor-এ থেকে যায়।', 'ঠান্ডা solvent-এ লক্ষ্য compound কম দ্রবণীয়, তাই purification-এর প্রথম ধাপ হিসেবে উপযুক্ত নয়।', 'সাধারণ ionic solid ফুটিয়ে gas করা যায় না।', 'দ্রবণ সম্পূর্ণ শুকালে soluble impurity-ও crystal-এর সঙ্গে থেকে যেতে পারে।']
    }, [refs.separation], visual('v98-recrystallization-flow','Recrystallization purification flow','গরমে দ্রবীভবন, hot filtration, ধীরে ঠান্ডা, crystal filtration এবং cold washing-এর ধাপ।','Soluble impurity mother liquor-এ রেখে crystal আলাদা করা হয়।', svg('Recrystallization workflow','Five sequential process boxes: dissolve hot, hot filter, cool slowly, collect crystals, wash cold','<g fill="#e0f2fe" stroke="#0284c7" stroke-width="2"><rect x="25" y="95" width="105" height="90" rx="10"/><rect x="150" y="95" width="105" height="90" rx="10"/><rect x="275" y="95" width="105" height="90" rx="10"/><rect x="400" y="95" width="105" height="90" rx="10"/><rect x="525" y="95" width="90" height="90" rx="10"/></g><g fill="#334155" font-size="15" text-anchor="middle"><text x="77" y="130">Hot</text><text x="77" y="151">dissolve</text><text x="202" y="130">Hot</text><text x="202" y="151">filter</text><text x="327" y="130">Slow</text><text x="327" y="151">cool</text><text x="452" y="130">Collect</text><text x="452" y="151">crystals</text><text x="570" y="130">Cold</text><text x="570" y="151">wash</text></g><g stroke="#7c3aed" stroke-width="3" fill="none"><path d="M130 140H147m-7 -7 7 7 -7 7M255 140H272m-7 -7 7 7 -7 7M380 140H397m-7 -7 7 7 -7 7M505 140H522m-7 -7 7 7 -7 7"/></g>')));

  add('cl-v98-qchem-steam-distillation-essential-oil-001', 15, 3, 'scenario',
    'একটি উদ্ভিদ থেকে তাপ-সংবেদনশীল essential oil আলাদা করতে হবে। যৌগটি পানিতে অমিশ্রণীয় এবং নিজস্ব স্ফুটনাঙ্কে পৌঁছানোর আগে ভেঙে যায়। কোন পদ্ধতির যুক্তি সবচেয়ে উপযুক্ত?',
    ['বাষ্প পাতন; পানির সঙ্গে সহ-পাতনের ফলে মিশ্র তরল কম তাপমাত্রায় ফুটতে পারে','সাধারণ পাতন; নমুনাকে তার decomposition temperature-এর উপরে নিতে হবে','কেলাসন; তেলকে অবশ্যই আয়নিক crystal হতে হবে','কাগজ ক্রোমাটোগ্রাফি; এতে বড় পরিমাণ তেল সংগ্রহ করা যায়'], 0, {
      objective: 'তাপ-সংবেদনশীল, পানিতে অমিশ্রণীয় volatile compound-এর জন্য steam distillation নির্বাচন।',
      core: 'দুটি অমিশ্রণীয় তরল একসঙ্গে থাকলে মোট vapour pressure তাদের আংশিক vapour pressure-এর যোগফল। তাই মোট চাপ বায়ুমণ্ডলীয় চাপে পৌঁছাতে প্রতিটি বিশুদ্ধ তরলের নিজস্ব boiling point-এর চেয়ে কম তাপমাত্রা লাগতে পারে।',
      analysis: 'Steam distillation-এ পানির বাষ্প volatile essential-oil compound-কে বহন করে। ফলে যৌগটি নিজের উচ্চ boiling point বা decomposition temperature-এর আগে distil হতে পারে। Condensate পরে স্তরভেদে আলাদা করা যায়।',
      formula: 'Ptotal = P°water + P°organic; boiling when Ptotal ≈ Patm',
      misconception: 'Steam distillation-এ যৌগটির boiling point নিজে কমে যায়—এমন নয়; অমিশ্রণীয় তরলের মোট vapour pressure-এর কারণে মিশ্র ব্যবস্থা কম তাপমাত্রায় ফুটে।',
      realWorld: 'কিছু essential oil, fragrance compound এবং তাপ-সংবেদনশীল উদ্ভিজ্জ উপাদান আলাদা করতে steam distillation ব্যবহৃত হয়।',
      steps: ['যৌগটি পানিতে অমিশ্রণীয় ও volatile কি না যাচাই করো।', 'তাপ দিলে decomposition হওয়ার ঝুঁকি শনাক্ত করো।', 'পানি ও organic liquid-এর আংশিক vapour pressure যোগ হবে বুঝো।', 'কম তাপমাত্রায় সহ-পাতন এবং condensation-এর পর স্তর পৃথক করো।'],
      optionAnalysis: ['সঠিক: steam distillation decomposition-এর আগে volatile component বহন করতে পারে।', 'নিজস্ব decomposition temperature অতিক্রমের ঝুঁকি বাড়ে।', 'Essential oil সাধারণত volatile molecular mixture; crystallization এখানে প্রাথমিক পদ্ধতি নয়।', 'Paper chromatography বিশ্লেষণী separation; bulk extraction-এর উপযুক্ত পদ্ধতি নয়।']
    }, [refs.separation]);

  add('cl-v98-qchem-solvent-extraction-two-stage-001', 16, 4, 'mathematical',
    '100 mL জলীয় দ্রবণ থেকে একটি দ্রব পদার্থ D=Cor/ Caq=4 partition coefficient-যুক্ত organic solvent দিয়ে দুইবার 50 mL করে নিষ্কাশন করা হলো। প্রতিবার equilibrium সম্পূর্ণ হলে শুরুতে থাকা দ্রব পদার্থের কত অংশ জলীয় স্তরে অবশিষ্ট থাকবে?',
    ['1/9 (প্রায় 11.1%)','1/5 (20%)','1/3 (প্রায় 33.3%)','4/9 (প্রায় 44.4%)'], 0, {
      objective: 'Partition coefficient ও phase volume ব্যবহার করে repeated solvent extraction-এর অবশিষ্ট অংশ গণনা।',
      core: 'D=Cor/Caq। জলীয় স্তর ও organic স্তরের মধ্যে সাম্যাবস্থায় aqueous phase-এ অবশিষ্ট fraction = Vaq/(Vaq + D Vorg)। একই আয়তনের fresh solvent দিয়ে বারবার নিষ্কাশন করলে প্রতিবার নতুন equilibrium তৈরি হয়।',
      analysis: 'প্রতি 50 mL extraction-এ fraction =100/(100+4×50)=100/300=1/3। দুইবার fresh solvent ব্যবহার করলে অবশিষ্ট fraction=(1/3)²=1/9≈0.111, অর্থাৎ 11.1%。',
      formula: 'Fraction remaining per extraction = Vaq/(Vaq + D Vorg); after n extractions = [Vaq/(Vaq + D Vorg)]ⁿ',
      misconception: 'দুই ধাপে 50 mL করে fresh solvent ব্যবহার করলে fraction দুবার গুণ করতে হয়; একবারে মোট solvent volume বসিয়ে একই ফল পাওয়া যায় না।',
      realWorld: 'Pharmaceutical preparation, environmental sample preparation এবং organic synthesis-এ liquid–liquid extraction ব্যবহৃত হয়।',
      steps: ['Vaq=100 mL, Vorg=50 mL ও D=4 বসাও।', 'প্রতি ধাপে aqueous fraction 100/(100+200)=1/3 বের করো।', 'দ্বিতীয় fresh extraction-এ আবার 1/3 অবশিষ্ট থাকে।', '(1/3)×(1/3)=1/9 বা 11.1% বের করো।'],
      optionAnalysis: ['সঠিক: দুইটি পৃথক extraction-এর অবশিষ্ট fraction গুণ করলে 1/9।', 'এটি 100 mL solvent দিয়ে একবার extraction করলে পাওয়া fraction, দুই ধাপ নয়।', 'এটি কেবল প্রথম extraction-এর পর অবশিষ্ট fraction।', 'Partition coefficient-কে volume-এর সঙ্গে ভুলভাবে সরাসরি গুণ/ভাগ করা হয়েছে।']
    }, [refs.separation], visual('v98-solvent-extraction-two-stage','Two-stage liquid–liquid extraction','একটি aqueous layer থেকে organic solvent দিয়ে প্রথম extraction; এরপর fresh solvent দিয়ে দ্বিতীয় extraction।','দুইবার fresh 50 mL extraction-এ প্রতিবার 1/3 অবশিষ্ট থাকে; মোট 1/9।', svg('Repeated solvent extraction','Two separating funnels in sequence; aqueous phase enters next funnel and fresh organic solvent is added','<g stroke="#64748b" stroke-width="2"><path d="M95 65H245L220 135L195 165H145L120 135Z" fill="#dbeafe"/><path d="M395 65H545L520 135L495 165H445L420 135Z" fill="#dbeafe"/></g><path d="M100 112H240L220 135H120Z" fill="#0ea5e9" fill-opacity=".55"/><path d="M400 112H540L520 135H420Z" fill="#0ea5e9" fill-opacity=".55"/><g stroke="#16a34a" stroke-width="4" fill="none"><path d="M245 205H395m-10 -8 10 8 -10 8"/></g><g font-size="16" fill="#334155" text-anchor="middle"><text x="170" y="45">প্রথম extraction</text><text x="470" y="45">দ্বিতীয় fresh solvent</text><text x="320" y="235">প্রতি ধাপে aqueous fraction = 1/3</text></g>')));

  add('cl-v98-qchem-chromatography-partition-001', 17, 3, 'analytical',
    'একই paper chromatogram-এ solvent front 10.0 cm এগিয়েছে। পদার্থ A 3.0 cm এবং B 8.0 cm এগিয়েছে। কোন সিদ্ধান্তটি সঠিক?',
    ['Rf(A)=0.30, Rf(B)=0.80; এই ব্যবস্থায় B-এর তুলনায় A stationary phase-এ বেশি retained','Rf(A)=3.0, Rf(B)=8.0; তাই A বেশি retained','Rf(A)=0.80, Rf(B)=0.30; তাই B বেশি retained','দূরত্বের অনুপাত থেকে Rf নির্ণয় করা যায় না'], 0, {
      objective: 'Chromatography-তে Rf নির্ণয় ও relative retention ব্যাখ্যা।',
      core: 'Rf হলো origin থেকে compound spot-এর দূরত্বকে solvent front-এর দূরত্ব দিয়ে ভাগ করলে পাওয়া অনুপাত। একই stationary/mobile phase-এ কম Rf সাধারণত stationary phase-এ বেশি retention নির্দেশ করে।',
      analysis: 'Rf(A)=3.0/10.0=0.30 এবং Rf(B)=8.0/10.0=0.80। A কম দূরত্ব অতিক্রম করেছে; এই solvent system-এ A stationary phase-এর সঙ্গে তুলনামূলক বেশি interaction করে বা mobile phase-এ কম অনুকূল।',
      formula: 'Rf = distance travelled by solute / distance travelled by solvent front',
      misconception: 'Rf একটি অনুপাত, এককবিহীন এবং সাধারণত 0 থেকে 1-এর মধ্যে; spot-এর দূরত্বকে solvent front-এর দূরত্ব দিয়ে ভাগ করতে হয়।',
      realWorld: 'Ink, pigment ও reaction mixture-এর উপাদান পৃথক/তুলনা করতে chromatography ব্যবহৃত হয়।',
      steps: ['Origin থেকে spot A-এর 3.0 cm মাপো।', 'Solvent front-এর 10.0 cm ব্যবহার করে 3.0/10.0 করো।', 'Spot B-এর জন্য 8.0/10.0 করো।', 'কম Rf-র A stationary phase-এ বেশি retained বলে ব্যাখ্যা করো।'],
      optionAnalysis: ['সঠিক: Rf অনুপাত যথাক্রমে 0.30 ও 0.80; কম Rf-তে বেশি retention।', 'Rf-তে solvent-front দূরত্ব দিয়ে ভাগ করা হয়নি।', 'A ও B-এর দূরত্ব অদলবদল হয়েছে।', 'দুটি measured distance থেকেই dimensionless Rf পাওয়া যায়।']
    }, [refs.chromatography], visual('v98-chromatography-rf-compare','Compare Rf values on a chromatogram','Origin line থেকে A 3 cm, B 8 cm এবং solvent front 10 cm এগিয়েছে।','Rf(A)=0.30 এবং Rf(B)=0.80; একই system-এ A বেশি retained।', svg('Paper chromatography Rf comparison','A chromatogram strip with baseline and solvent front; spots A at 3 cm and B at 8 cm, front at 10 cm','<rect x="250" y="40" width="140" height="220" rx="6" fill="#fff" stroke="#94a3b8" stroke-width="2"/><path d="M250 225H390" stroke="#334155" stroke-width="3"/><path d="M250 45H390" stroke="#0f766e" stroke-width="3" stroke-dasharray="6 5"/><circle cx="320" cy="159" r="9" fill="#2563eb"/><circle cx="320" cy="88" r="9" fill="#ea580c"/><g font-size="16" fill="#334155"><text x="405" y="229">Origin</text><text x="405" y="50">Solvent front 10 cm</text><text x="405" y="165">A: 3 cm</text><text x="405" y="94">B: 8 cm</text><text x="65" y="115">Rf(A)=0.30</text><text x="65" y="145">Rf(B)=0.80</text></g>')));

  add('cl-v98-qchem-chromatography-baseline-001', 18, 3, 'experiment',
    'Paper chromatography-তে sample spot দেওয়ার পর paper chamber-এ রাখা হলো। solvent-এর স্তর যদি origin/baseline-এর ওপরে থাকে, সবচেয়ে সম্ভাব্য সমস্যা কী?',
    ['Sample শুরুতেই solvent reservoir-এ দ্রবীভূত হয়ে যেতে পারে; paper বরাবর স্বাভাবিকভাবে আলাদা হবে না','Solvent front স্থির হয়ে যাবে এবং সব পদার্থ একই Rf পাবে','Stationary phase সঙ্গে সঙ্গে gas-এ পরিণত হবে','সব sample spot রাসায়নিকভাবে একই যৌগে রূপান্তরিত হবে'], 0, {
      objective: 'Paper chromatography-র sample application ও solvent-front setup-এর সঠিক ব্যবহারিক শর্ত ব্যাখ্যা।',
      core: 'Sample-এর origin line solvent level-এর ওপরে থাকতে হয়। Solvent level baseline ঢেকে দিলে sample সরাসরি reservoir-এর solvent-এ গলে যেতে পারে এবং paper বরাবর পৃথক হওয়ার আগেই sample হারিয়ে যায়।',
      analysis: 'একটি pencil baseline-এ ছোট concentrated spot দেওয়া হয়, শুকানো হয়, তারপর solvent level-এর ওপরে রেখে chamber ঢেকে দেওয়া হয়। Solvent capillary action-এ ওপরে ওঠে এবং mixture-এর components আলাদা গতিতে চলে।',
      formula: 'Correct setup: solvent level < origin line < sample spot; solvent front > origin',
      misconception: 'Sample-কে mobile phase-এর সংস্পর্শে আনতে হয় ঠিকই, কিন্তু starting spot-কে solvent reservoir-এর ভেতরে ডুবিয়ে নয়।',
      realWorld: 'ল্যাবরেটরি chromatography-তে ভুল baseline/solvent height পুরো ফল invalid করতে পারে।',
      steps: ['Paper-এ pencil দিয়ে baseline আঁকো।', 'Baseline-এ sample spot দিয়ে শুকাও।', 'Chamber-এ solvent এমন পরিমাণে দাও যাতে baseline-এর নিচে থাকে।', 'Paper বসিয়ে solvent front উঠতে দাও এবং front mark করো।'],
      optionAnalysis: ['সঠিক: baseline ডুবে গেলে sample solvent pool-এ মিশে যেতে পারে।', 'Solvent front capillary action-এ চলবে; baseline height শুধু migration-কে প্রভাবিত করে।', 'Stationary phase কাগজ; এই পরিস্থিতিতে gas হয় না।', 'Physical setup-এর কারণে mixture এক compound-এ রূপান্তরিত হয় না।']
    }, [refs.chromatography], visual('v98-chromatography-baseline-setup','Correct chromatography baseline setup','Paper strip-এর baseline ও sample spot solvent reservoir-এর liquid level-এর ওপরে; solvent front উপরে উঠছে।','Starting spot-কে solvent level-এর ওপরে রাখতে হয়।', svg('Correct paper chromatography setup','A developing chamber with solvent level below the pencil baseline and sample spot; solvent front above','<rect x="210" y="25" width="230" height="250" rx="14" fill="#e0f2fe" fill-opacity=".25" stroke="#64748b" stroke-width="3"/><rect x="218" y="220" width="214" height="48" fill="#38bdf8" fill-opacity=".35"/><rect x="285" y="45" width="80" height="205" fill="#fff" stroke="#94a3b8" stroke-width="2"/><path d="M285 175H365" stroke="#334155" stroke-width="2" stroke-dasharray="6 4"/><circle cx="325" cy="175" r="6" fill="#ea580c"/><path d="M285 75H365" stroke="#0f766e" stroke-width="3" stroke-dasharray="5 4"/><g font-size="16" fill="#334155"><text x="385" y="80">Solvent front</text><text x="385" y="180">Origin + spot</text><text x="385" y="245">Solvent pool</text></g>')));

  w.CL_AUTHORED_HSC_QUESTIONS_V98 = {
    version: 98,
    focusChapters: ['chem1-02'],
    questions: questions,
    qualityPolicy: 'All questions remain draft-unreviewed pending subject-specialist and reference review; static question diagrams only.'
  };
})(window);
