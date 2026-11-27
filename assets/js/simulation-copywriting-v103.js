/* Golden Snitch v103 — complete simulation copybook for the merged Physics, Chemistry and Higher Math catalogue.
   Every entry is derived from the model metadata and its real controls; no imaginary features are described. */
(function () {
  'use strict';
  var academy = window.CL_GAME_ACADEMY;
  var games = academy && typeof academy.merge === 'function' ? academy.merge([]) : [];
  var specs = Object.create(null);
  games.forEach(function (g) { if (g && g.type === 'simExplorer') specs[g.id] = g; });

  var TITLES = {
    'sim-velocity-time-lab':'বেগ–সময় গ্রাফের পরীক্ষণ','sim-projectile-range-studio':'প্রক্ষেপণের পাল্লা ও সর্বোচ্চ উচ্চতা','sim-projectile-angle-lab':'নিক্ষেপ কোণ ও গতিপথ',
    'sim-newton-force-bench':'বল ও ভরের প্রভাবে ত্বরণ','sim-friction-workshop':'ঘর্ষণ বলের পরীক্ষা','sim-momentum-collision':'সংঘর্ষে ভরবেগ সংরক্ষণ',
    'sim-work-energy-lab':'গতিশক্তি ও বিভবশক্তির সম্পর্ক','sim-spring-energy-bench':'স্প্রিংয়ের বল ও স্থিতিস্থাপক শক্তি','sim-orbit-speed-explorer':'কক্ষীয় বেগ ও পর্যায়কাল',
    'sim-gravity-altitude':'উচ্চতার সঙ্গে অভিকর্ষজ ত্বরণ','sim-pendulum-lab':'সরল দোলকের দোলনকাল','sim-spring-oscillator':'স্প্রিংয়ের দোলনকাল',
    'sim-wave-machine':'তরঙ্গের বেগ ও বৈশিষ্ট্য','sim-sound-pitch-lab':'কম্পাঙ্ক ও শব্দের তরঙ্গদৈর্ঘ্য','sim-doppler-observer':'ডপলার প্রভাব ও আপেক্ষিক বেগ',
    'sim-ideal-gas-piston':'আদর্শ গ্যাসের চাপ','sim-liquid-pressure-tank':'তরলের গভীরতা ও চাপ','sim-buoyancy-dock':'প্লবতা ও ভাসা-ডোবার শর্ত',
    'sim-bernoulli-pipe':'নলের প্রবাহ ও ধারাবাহিকতা','sim-thermal-expansion':'তাপীয় প্রসারণ','sim-calorimetry-mixer':'তাপের পরিমাণ নির্ণয়',
    'sim-torque-wrench':'টর্ক বা বলের মুহূর্ত','sim-coulomb-interaction':'কুলম্বের সূত্রে তড়িৎ বল','sim-electric-field-probe':'তড়িৎ ক্ষেত্রের প্রাবল্য',
    'sim-capacitor-charging':'ধারকের আধান ও সঞ্চিত শক্তি','sim-ohm-law-bench':'ওহমের সূত্রে তড়িৎ প্রবাহ','sim-resistor-network':'সমান্তরাল রোধের তুল্য মান',
    'sim-magnetic-force-track':'চৌম্বক ক্ষেত্রে চলন্ত আধানের বল','sim-faraday-induction':'তড়িৎচুম্বকীয় আবেশ','sim-ac-waveform':'পরিবর্তী প্রবাহের তরঙ্গরূপ',
    'sim-lens-ray-table':'লেন্সে প্রতিবিম্ব গঠন','sim-double-slit-studio':'ইয়ংয়ের দ্বি-চির পরীক্ষণ','sim-periodic-trend-map':'পর্যায় সারণিতে মৌলের ধর্ম',
    'sim-atomic-radius-explorer':'পারমাণবিক ব্যাসার্ধের প্রবণতা','sim-ionization-energy-climb':'আয়নীকরণ শক্তির প্রবণতা','sim-electronegativity-map':'তড়িৎঋণাত্মকতার পরিবর্তন',
    'sim-bond-polarity-studio':'রাসায়নিক বন্ধনের মেরুতা','sim-molecular-shape-builder':'অণুর আকৃতি ও VSEPR মডেল','sim-gas-reaction-volume':'গ্যাসের অবস্থা ও চাপ',
    'sim-reaction-rate-control':'বিক্রিয়ার হার','sim-equilibrium-shift':'রাসায়নিক সাম্যাবস্থা','sim-ph-concentration':'pH ও হাইড্রোজেন আয়নের ঘনমাত্রা',
    'sim-acid-base-titration':'অম্ল–ক্ষার টাইট্রেশন','sim-solubility-temperature':'তাপমাত্রার সঙ্গে দ্রাব্যতা','sim-dilution-workbench':'দ্রবণ লঘুকরণ ও ঘনমাত্রা',
    'sim-limiting-reagent':'সীমাবদ্ধ বিকারক নির্ণয়','sim-enthalpy-profile':'বিক্রিয়ার এনথালপি পরিবর্তন','sim-galvanic-cell':'গ্যালভানিক কোষ ও কোষ বিভব',
    'sim-electrolysis-faraday':'ফ্যারাডের সূত্রে তড়িৎ বিশ্লেষণ','sim-alkane-formula-builder':'অ্যালকেনের আণবিক সংকেত','sim-molarity-prep':'মোলারিটি নির্ণয়',
    'sim-photon-spectrum':'ফোটন শক্তি ও বর্ণালি','sim-redox-electron-transfer':'জারণ–বিজারণে ইলেকট্রন স্থানান্তর','sim-solution-concentration':'দ্রবণের ঘনমাত্রা',
    'sim-polynomial-root-explorer':'বহুপদী সমীকরণের মূল','sim-unit-circle-explorer':'একক বৃত্তে ত্রিকোণমিতিক মান','sim-vector-component-lab':'ভেক্টরের উপাংশ',
    'sim-dot-cross-experiment':'ডট ও ক্রস গুণফল','sim-matrix-transform-studio':'ম্যাট্রিক্সে স্থানান্তর ও ঘূর্ণন','sim-determinant-visualizer':'নির্ণায়কের মান ও ক্ষেত্রফল',
    'sim-circle-equation-explorer':'বৃত্তের সমীকরণ','sim-ellipse-explorer':'উপবৃত্তের বৈশিষ্ট্য','sim-derivative-tangent':'অন্তরক ও স্পর্শকের ঢাল',
    'sim-probability-dice-lab':'দ্বিপদী সম্ভাবনার মডেল','sim-permutation-combination':'বিন্যাস ও সমাবেশ','sim-arithmetic-sequence':'সমান্তর ধারা',
    'sim-complex-plane':'জটিল সংখ্যার আর্গান্ড সমতল','sim-linear-programming-region':'রৈখিক প্রোগ্রামিংয়ে লক্ষ্যমান','sim-limit-approach':'সীমার মানের দিকে অগ্রসর হওয়া',

    'wave':'তরঙ্গের গতি ও বৈশিষ্ট্য','projectile':'প্রক্ষেপণ গতির পরীক্ষণ','pendulum':'সরল দোলকের দোলন','flame':'শিখা পরীক্ষায় মৌল শনাক্তকরণ','hsc-phy-wave':'তরঙ্গ সমীকরণ ও বৈশিষ্ট্য','hsc-phy-magnetic':'তড়িৎ প্রবাহের চৌম্বক ক্ষেত্র',
    'measurement-uncertainty':'পরিমাপের অনিশ্চয়তা ও ত্রুটি','dimensional-analysis':'মাত্রিক বিশ্লেষণে সূত্র যাচাই','unit-conversion-lab':'একক রূপান্তর অনুশীলন',
    'vector-components-lab':'ভেক্টরের উপাংশ নির্ণয়','vector-equilibrium-lab':'ভেক্টরের সাম্যাবস্থা','free-fall-lab':'মুক্তপতন ও উল্লম্ব নিক্ষেপ',
    'free-body-builder':'মুক্তবস্তু বলচিত্র','pulley-system-lab':'সংযুক্ত বস্তু ও পুলি ব্যবস্থা','elevator-weight-lab':'লিফটে আপাত ওজন',
    'collision-momentum-lab':'সংঘর্ষ ও ভরবেগ সংরক্ষণ','vertical-circle-lab':'উল্লম্ব বৃত্তীয় গতি','spring-energy-lab':'স্প্রিংয়ের স্থিতিস্থাপক শক্তি',
    'gravity-profile-lab':'পৃথিবীর ভেতরে ও বাইরে অভিকর্ষজ ত্বরণ','gravitational-potential-lab':'মহাকর্ষীয় বিভব ও বিভবশক্তি',
    'satellite-orbit-lab':'উপগ্রহের কক্ষপথ ও কক্ষীয় বেগ','escape-velocity-lab':'কক্ষীয় বেগ ও মুক্তিবেগ','elasticity-hooke-lab':'স্থিতিস্থাপকতা ও হুকের সূত্র',
    'hydraulic-press-lab':'জলবাহী প্রেস ও প্যাসকেলের সূত্র','torricelli-outflow-lab':'তরলের নির্গমন ও টরিচেলির সূত্র',
    'phase-difference-studio':'দোলনের দশা পার্থক্য','wave-superposition-lab':'তরঙ্গের উপরিপাতন','beats-frequency-lab':'বিট ও শব্দের কম্পাঙ্ক',
    'molecular-speed-distribution-lab':'গ্যাস অণুর বেগের বণ্টন','kinetic-pressure-lab':'গতিতত্ত্বে গ্যাসের চাপ','thermodynamic-process-lab':'তাপগতীয় প্রক্রিয়া',
    'pv-cycle-lab':'চাপ–আয়তন চক্র ও কাজ','gas-internal-energy-lab':'স্বাধীনতার মাত্রা ও অভ্যন্তরীণ শক্তি',
    'hsc-phy-falling-object':'পড়ন্ত বস্তু: মুক্তপতন','hsc-phy-drop-vs-projectile':'পড়ন্ত ও নিক্ষিপ্ত বস্তুর তুলনা',
    'hsc-phy-gun-bullet-recoil':'বন্দুক ও গুলিতে ভরবেগ সংরক্ষণ','moment-inertia-explorer':'জড়তার ভ্রামক: ১৪টি মডেল'
  };

  var PARAMS = {
    motion:{acceleration:'ত্বরণ',time:'সময়'}, projectile:{speed:'আদিবেগ',angle:'নিক্ষেপ কোণ',gravity:'অভিকর্ষজ ত্বরণ'},
    newton:{force:'প্রয়োগকৃত বল',mass:'ভর'}, friction:{mass:'ভর',mu:'ঘর্ষণ সহগ',pull:'টান বল'},
    momentum:{m1:'প্রথম বস্তুর ভর',u1:'প্রথম বস্তুর বেগ',m2:'দ্বিতীয় বস্তুর ভর',u2:'দ্বিতীয় বস্তুর বেগ'},
    energy:{mass:'ভর',speed:'বেগ',height:'উচ্চতা'}, spring:{k:'স্প্রিং ধ্রুবক',stretch:'প্রসারণ'}, orbit:{radius:'কক্ষীয় ব্যাসার্ধ'},
    gravity:{altitude:'উচ্চতা'}, pendulum:{length:'দোলকের দৈর্ঘ্য',gravity:'অভিকর্ষজ ত্বরণ'}, oscillator:{mass:'ভর',k:'স্প্রিং ধ্রুবক'},
    wave:{frequency:'কম্পাঙ্ক',wavelength:'তরঙ্গদৈর্ঘ্য'}, sound:{frequency:'কম্পাঙ্ক',temperature:'বায়ুর তাপমাত্রা'},
    doppler:{frequency:'উৎসের কম্পাঙ্ক',sourceSpeed:'উৎসের বেগ',observerSpeed:'পর্যবেক্ষকের বেগ'},
    gas:{temperature:'পরম তাপমাত্রা',volume:'আয়তন',moles:'গ্যাসের মোল সংখ্যা'}, pressure:{density:'তরলের ঘনত্ব',depth:'গভীরতা'},
    buoyancy:{volume:'বস্তুর আয়তন',fluidDensity:'তরলের ঘনত্ব',objectDensity:'বস্তুর ঘনত্ব'},
    fluid:{radius1:'প্রথম অংশের ব্যাসার্ধ',radius2:'দ্বিতীয় অংশের ব্যাসার্ধ',velocity1:'প্রাথমিক প্রবাহবেগ'},
    thermal:{length:'প্রাথমিক দৈর্ঘ্য',alpha:'প্রসারণ গুণাঙ্ক',deltaT:'তাপমাত্রার পরিবর্তন'},
    calorimetry:{mass:'ভর',specificHeat:'সুনির্দিষ্ট তাপ',deltaT:'তাপমাত্রার পরিবর্তন'},
    torque:{force:'বল',arm:'লম্ব বাহু',angle:'বল ও বাহুর কোণ'},
    coulomb:{q1:'প্রথম আধান',q2:'দ্বিতীয় আধান',distance:'আধানের দূরত্ব'}, electricField:{charge:'আধান',distance:'দূরত্ব'},
    capacitor:{area:'পাতের ক্ষেত্রফল',gap:'পাতের ব্যবধান',voltage:'বিভব পার্থক্য'},
    ohm:{voltage:'বিভব পার্থক্য',resistance:'রোধ'}, parallel:{voltage:'বিভব পার্থক্য',r1:'প্রথম রোধ',r2:'দ্বিতীয় রোধ'},
    magneticForce:{charge:'আধান',speed:'বেগ',field:'চৌম্বক ক্ষেত্র',angle:'কোণ'},
    induction:{turns:'কুণ্ডলীর পাকসংখ্যা',deltaB:'চৌম্বক ক্ষেত্রের পরিবর্তন',area:'কুণ্ডলীর ক্ষেত্রফল',time:'সময়'},
    ac:{peakVoltage:'সর্বোচ্চ বিভব',frequency:'কম্পাঙ্ক',time:'সময়'}, lens:{focalLength:'ফোকাল দৈর্ঘ্য',objectDistance:'বস্তুর দূরত্ব'},
    interference:{wavelength:'আলোর তরঙ্গদৈর্ঘ্য',screenDistance:'পর্দার দূরত্ব',slitGap:'চিরের ব্যবধান'},
    periodicTrend:{period:'পর্যায়',group:'গ্রুপ'}, atomicRadius:{period:'পর্যায়',group:'গ্রুপ'}, ionization:{period:'পর্যায়',group:'গ্রুপ'}, electronegativity:{period:'পর্যায়',group:'গ্রুপ'},
    polarity:{en1:'প্রথম পরমাণুর তড়িৎঋণাত্মকতা',en2:'দ্বিতীয় পরমাণুর তড়িৎঋণাত্মকতা'}, molecule:{bonds:'বন্ধন অঞ্চল',lonePairs:'নিঃসঙ্গ ইলেকট্রন জোড়'},
    kinetics:{concentration:'প্রাথমিক ঘনমাত্রা',rateConstant:'হার ধ্রুবক'}, equilibrium:{K:'সাম্য ধ্রুবক K',Q:'বিক্রিয়া ভাগফল Q'}, ph:{concentration:'হাইড্রোজেন আয়নের ঘনমাত্রা'},
    titration:{acidConc:'অম্লের ঘনমাত্রা',baseConc:'ক্ষারের ঘনমাত্রা',acidVolume:'অম্লের আয়তন',baseVolume:'ক্ষারের আয়তন'},
    solubility:{temperature:'তাপমাত্রা'}, dilution:{stockConc:'স্টক দ্রবণের ঘনমাত্রা',stockVolume:'স্টক দ্রবণের আয়তন',finalVolume:'চূড়ান্ত আয়তন'},
    stoich:{molesA:'A-এর মোল',molesB:'B-এর মোল',ratioB:'বিক্রিয়ার মোল অনুপাত'},
    thermo:{deltaH:'এনথালপি পরিবর্তন',progress:'বিক্রিয়ার অগ্রগতি'}, electrochem:{cathodePotential:'ক্যাথোড বিভব',anodePotential:'অ্যানোড বিভব'},
    electrolysis:{current:'তড়িৎ প্রবাহ',seconds:'সময়',molarMass:'মোলার ভর',electrons:'ইলেকট্রনের সংখ্যা'}, alkane:{carbons:'কার্বন পরমাণুর সংখ্যা'},
    molarity:{mass:'দ্রবের ভর',molarMass:'মোলার ভর',volume:'দ্রবণের আয়তন'}, spectrum:{energyEV:'ফোটনের শক্তি'},
    redox:{electrons:'ইলেকট্রন সংখ্যা',donor:'ইলেকট্রন দাতার অনুপাত',acceptor:'ইলেকট্রন গ্রহীতার অনুপাত'},
    polynomial:{a:'x²-এর সহগ',b:'x-এর সহগ',c:'ধ্রুবক পদ'}, unitCircle:{angle:'কোণ'}, vector:{ax:'x-উপাংশ',ay:'y-উপাংশ'},
    dotCross:{ax:'A-এর x-উপাংশ',ay:'A-এর y-উপাংশ',bx:'B-এর x-উপাংশ',by:'B-এর y-উপাংশ'},
    matrix:{rotation:'ঘূর্ণন কোণ',scaleX:'x-দিকের স্কেল',scaleY:'y-দিকের স্কেল',x:'প্রাথমিক x-স্থানাঙ্ক',y:'প্রাথমিক y-স্থানাঙ্ক'},
    determinant:{a:'ম্যাট্রিক্সের a',b:'ম্যাট্রিক্সের b',c:'ম্যাট্রিক্সের c',d:'ম্যাট্রিক্সের d'},
    circle:{h:'কেন্দ্রের x-স্থানাঙ্ক',k:'কেন্দ্রের y-স্থানাঙ্ক',radius:'ব্যাসার্ধ'}, ellipse:{a:'প্রথম অর্ধ-অক্ষ',b:'দ্বিতীয় অর্ধ-অক্ষ'},
    derivative:{a:'x²-এর সহগ',b:'x-এর সহগ',c:'ধ্রুবক পদ',x:'যে বিন্দুতে ঢাল নির্ণয় হবে'},
    probability:{n:'পরীক্ষার সংখ্যা n',p:'প্রতি পরীক্ষায় সাফল্যের সম্ভাবনা p',x:'লক্ষ্য সাফল্যের সংখ্যা'},
    combinatorics:{n:'মোট বস্তু n',r:'নির্বাচিত বস্তু r'}, sequence:{a:'প্রথম পদ',d:'সাধারণ অন্তর',n:'পদের সংখ্যা'},
    complex:{real:'বাস্তব অংশ',imag:'কাল্পনিক অংশ'}, linprog:{c1:'x-এর সহগ',c2:'y-এর সহগ',x:'x-এর মান',y:'y-এর মান'}, limit:{a:'যে বিন্দুর দিকে x এগোয়'}
  };
  var OUTPUTS = {
    motion:'অবস্থান, বেগ ও ত্বরণের গ্রাফ', projectile:'প্রক্ষেপণের পাল্লা ও সর্বোচ্চ উচ্চতা', newton:'ত্বরণ ও নিট বল', friction:'ঘর্ষণ বল ও গতির অবস্থা', momentum:'সংঘর্ষের পর যৌথ বেগ', energy:'গতিশক্তি ও মহাকর্ষীয় বিভবশক্তি', spring:'স্প্রিং বল ও স্থিতিস্থাপক বিভবশক্তি',
    orbit:'কক্ষীয় বেগ ও পর্যায়কাল', gravity:'অভিকর্ষজ ত্বরণ', pendulum:'দোলনকাল ও কম্পাঙ্ক', oscillator:'স্প্রিংয়ের দোলনকাল', wave:'তরঙ্গের বেগ', sound:'শব্দের বেগ ও তরঙ্গদৈর্ঘ্য', doppler:'পর্যবেক্ষকের শোনা কম্পাঙ্ক', gas:'আদর্শ গ্যাসের চাপ', pressure:'তরলচাপ', buoyancy:'প্লব বল ও ভাসা-ডোবার শর্ত', fluid:'প্রবাহের বেগের তুলনা', thermal:'দৈর্ঘ্যের পরিবর্তন', calorimetry:'তাপের পরিমাণ', torque:'টর্ক', coulomb:'তড়িৎ বল', electricField:'তড়িৎ ক্ষেত্রের প্রাবল্য', capacitor:'ধারকত্ব ও সঞ্চিত শক্তি', ohm:'তড়িৎ প্রবাহ ও ক্ষমতা', parallel:'তুল্য রোধ ও প্রবাহ', magneticForce:'চৌম্বক বল', induction:'আবিষ্ট তড়িচ্চালক শক্তি', ac:'পরিবর্তী বিভবের তাৎক্ষণিক মান', lens:'প্রতিবিম্বের অবস্থান', interference:'ব্যতিচার ডোরার ব্যবধান',
    periodicTrend:'পর্যায় সারণির নির্বাচিত ধর্ম', atomicRadius:'পারমাণবিক ব্যাসার্ধের প্রবণতা', ionization:'আয়নীকরণ শক্তির প্রবণতা', electronegativity:'তড়িৎঋণাত্মকতার প্রবণতা', polarity:'বন্ধনের মেরুতা', molecule:'অণুর সম্ভাব্য জ্যামিতিক আকৃতি', kinetics:'বিক্রিয়ার হার', equilibrium:'সাম্যাবস্থার দিক', ph:'pH', titration:'টাইট্রেশনের pH পরিবর্তন', solubility:'দ্রাব্যতার পরিবর্তন', dilution:'চূড়ান্ত ঘনমাত্রা', stoich:'সীমাবদ্ধ বিকারক ও উৎপাদের পরিমাণ', thermo:'এনথালপি পরিবর্তন ও বিক্রিয়ার ধরন', electrochem:'কোষ বিভব', electrolysis:'তাত্ত্বিক জমা ভর', alkane:'অ্যালকেনের আণবিক সংকেত', molarity:'মোলারিটি', spectrum:'ফোটনের তরঙ্গদৈর্ঘ্য ও বর্ণালির অঞ্চল', redox:'ইলেকট্রন স্থানান্তরের হিসাব',
    polynomial:'নির্ণায়ক ও বাস্তব মূলের সংখ্যা', unitCircle:'sine, cosine ও tangent', vector:'ভেক্টরের মান ও দিক', dotCross:'ডট ও ক্রস গুণফল', matrix:'রূপান্তরিত বিন্দুর স্থানাঙ্ক ও determinant', determinant:'নির্ণায়ক ও ক্ষেত্রফলের স্কেল', circle:'বৃত্তের সমীকরণ, ক্ষেত্রফল ও পরিধি', ellipse:'উপবৃত্তের ক্ষেত্রফল ও উৎকেন্দ্রিকতা', derivative:'ফাংশনের মান ও স্পর্শকের ঢাল', probability:'প্রত্যাশিত সাফল্য ও বিচরণ', combinatorics:'বিন্যাস ও সমাবেশের সংখ্যা', sequence:'n-তম পদ ও প্রথম n পদের যোগফল', complex:'মডুলাস ও আর্গুমেন্ট', linprog:'উদ্দেশ্য ফাংশনের মান', limit:'প্রদত্ত রাশির দুই পাশের সীমামান'
  };
  var CONCEPT = {
    physics:{motion:'গতির সমীকরণ ও গ্রাফের ঢাল',projectile:'প্রক্ষেপণ গতির অনুভূমিক ও উল্লম্ব উপাংশ',newton:'নিউটনের দ্বিতীয় সূত্র',friction:'স্থিতি ও গতীয় ঘর্ষণ',momentum:'সংঘর্ষে ভরবেগ সংরক্ষণ',energy:'গতিশক্তি ও বিভবশক্তির পারস্পরিক সম্পর্ক',spring:'হুকের সূত্র ও স্থিতিস্থাপক শক্তি',orbit:'বৃত্তাকার কক্ষপথের সম্পর্ক',gravity:'উচ্চতার সঙ্গে g-এর পরিবর্তন',pendulum:'সরল দোলকের পর্যায়কাল',wave:'তরঙ্গের বেগ, কম্পাঙ্ক ও তরঙ্গদৈর্ঘ্য',sound:'শব্দের বেগ ও কম্পাঙ্ক',doppler:'ডপলার প্রভাব',gas:'আদর্শ গ্যাসের সমীকরণ',pressure:'তরলচাপের গভীরতা-নির্ভরতা',buoyancy:'আর্কিমিডিসের নীতি',fluid:'প্রবাহের ধারাবাহিকতা',thermal:'রৈখিক তাপীয় প্রসারণ',calorimetry:'Q = mcΔT',torque:'বলের মুহূর্ত',coulomb:'কুলম্বের বিপরীত-বর্গ সূত্র',electricField:'বিন্দু আধানের তড়িৎ ক্ষেত্র',lens:'লেন্সের সূত্র ও বিবর্ধন',interference:'আলোর ব্যতিচার'},
    chemistry:{periodicTrend:'পর্যায় সারণিতে ধর্মের পর্যায়বৃত্ত পরিবর্তন',atomicRadius:'পারমাণবিক আকারের প্রবণতা',ionization:'আয়নীকরণ শক্তি',electronegativity:'তড়িৎঋণাত্মকতা',polarity:'বন্ধন মেরুতা',molecule:'VSEPR অনুযায়ী অণুর আকৃতি',gas:'গ্যাসের সূত্র',kinetics:'বিক্রিয়ার গতিবিদ্যা',equilibrium:'রাসায়নিক সাম্যাবস্থা',ph:'pH ও [H⁺]-এর সম্পর্ক',titration:'অম্ল-ক্ষার প্রশমন',solubility:'দ্রাব্যতার তাপমাত্রা-নির্ভরতা',dilution:'C₁V₁ = C₂V₂',stoich:'বিক্রিয়ার মোল অনুপাত',thermo:'বিক্রিয়ার এনথালপি',electrochem:'গ্যালভানিক কোষের বিভব',electrolysis:'ফ্যারাডের সূত্র',alkane:'অ্যালকেনের সাধারণ সূত্র',molarity:'মোলার ঘনমাত্রা',spectrum:'ফোটনের শক্তি ও তরঙ্গদৈর্ঘ্য',redox:'জারণ ও বিজারণে ইলেকট্রন স্থানান্তর'},
    math:{polynomial:'দ্বিঘাত/বহুপদী সমীকরণের মূল',unitCircle:'একক বৃত্ত ও ত্রিকোণমিতিক অনুপাত',vector:'ভেক্টরের উপাংশ ও মান',dotCross:'ডট ও ক্রস গুণফলের অর্থ',matrix:'ম্যাট্রিক্সের রৈখিক রূপান্তর',determinant:'নির্ণায়কের জ্যামিতিক অর্থ',circle:'বৃত্তের কেন্দ্র ও ব্যাসার্ধ',ellipse:'উপবৃত্তের জ্যামিতিক বৈশিষ্ট্য',derivative:'অন্তরক ও তাৎক্ষণিক পরিবর্তনের হার',probability:'দ্বিপদী সম্ভাবনা মডেল',combinatorics:'বিন্যাস ও সমাবেশ',sequence:'সমান্তর ধারার সাধারণ পদ ও যোগফল',complex:'জটিল সংখ্যার জ্যামিতিক রূপ',linprog:'উদ্দেশ্য ফাংশনের মান',limit:'সীমার ধারণা'}
  };

  function safe(s) { return String(s == null ? '' : s).trim(); }
  function subjectKey(l) { var s = String(l.sub || l.subjectKey || '').toLowerCase(); if (/chem|রসায়ন|রসায়ন/.test(s)) return 'chemistry'; if (/math|গণিত/.test(s)) return 'math'; return 'physics'; }
  function titleFor(l, spec) {
    var bn = window.CL_SIM_TITLES_BN || {}, old = window.CL_SIM_COPYBOOK_V102 || {};
    return safe(TITLES[l.id] || (old[l.id] && old[l.id][0]) || bn[l.id] || l.t || l.title || 'ইন্টারঅ্যাকটিভ সিমুলেশন');
  }
  function makeCopy(l) {
    if (!l || !l.id) return null;
    var old = (window.CL_SIM_COPYBOOK_V102 || {})[l.id];
    if (old && old.length === 5) return old.slice();
    var cfg = window.CL_PHYSICS_CATALOG && window.CL_PHYSICS_CATALOG.configs && window.CL_PHYSICS_CATALOG.configs[l.id];
    var spec = specs[l.id], subject = subjectKey(l), kind = spec && spec.data && spec.data.sim && spec.data.sim.kind;
    var controls = [], outputs = '', concept = '';
    if (cfg && Array.isArray(cfg.controls)) {
      controls = cfg.controls.map(function (x) { return safe(x[1]); }).filter(Boolean);
      outputs = cfg.curve ? 'চিত্র, গ্রাফ ও গণনাকৃত ফল' : 'গণনাকৃত ফল';
      concept = safe(cfg.concept || l.concept || l.chapter || l.physicsChapter || 'সংশ্লিষ্ট পদার্থবিজ্ঞানের ধারণা');
    } else if (spec) {
      var params = PARAMS[kind] || {};
      controls = Object.keys(spec.data.sim.values || {}).map(function (key) { return params[key] || key; });
      outputs = OUTPUTS[kind] || 'মডেলের প্রদর্শিত ফলাফল';
      concept = (CONCEPT[subject] && CONCEPT[subject][kind]) || safe(l.chapter || l.concept || spec.t);
    } else {
      controls = [];
      concept = safe(l.chapter || l.concept || l.sub || 'সংশ্লিষ্ট ধারণা');
      outputs = 'সিমুলেশনের প্রদর্শিত ফলাফল';
    }
    var raw = safe((cfg && cfg.desc) || l.d || (spec && spec.d));
    var formula = safe((cfg && cfg.formula) || (spec && spec.data && spec.data.sim && spec.data.sim.formula) || l.tip);
    var mission = safe((spec && spec.data && spec.data.sim && spec.data.sim.mission) || 'একটি করে নিয়ামক বদলে প্রদর্শিত ফল তুলনা করুন।');
    var title = titleFor(l, spec), subtitle = safe(l.chapter || l.physicsChapter || concept);
    var cList = controls.length ? controls.join('、') : 'উপলভ্য নিয়ন্ত্রণ';
    var desc = raw || (title + ' মডেলে ' + concept + ' পর্যবেক্ষণ করুন।');
    if (spec) {
      desc += ' ' + cList + ' পরিবর্তন করলে ' + outputs + ' কীভাবে বদলায় তা দেখা যায়। এতে ' + concept + ' সম্পর্কে ধারণা তৈরি হবে।';
      if (formula && desc.indexOf(formula) < 0) desc += ' মডেলে ব্যবহৃত সম্পর্ক: ' + formula + '।';
    } else if (cfg) {
      desc += ' ' + cList + ' বদলে ' + outputs + ' তুলনা করুন; এতে ' + concept + ' স্পষ্ট হবে।';
      if (formula && desc.indexOf(formula) < 0) desc += ' প্রযোজ্য সম্পর্ক: ' + formula + '।';
    } else {
      desc += ' প্রদর্শিত ফলের সঙ্গে ' + concept + ' মিলিয়ে দেখুন।';
      if (formula && desc.indexOf(formula) < 0) desc += ' সূত্র/সম্পর্ক: ' + formula + '।';
    }
    var instruction, help;
    if (spec) {
      instruction = 'প্রথমে শুরুর মানে মডেলটি দেখুন। এরপর ' + cList + ' একবারে একটি করে বদলান এবং ' + outputs + ' তুলনা করুন। শেষে “' + mission + '” পরীক্ষা করুন। চাইলে তিনটি আলাদা পর্যবেক্ষণ নথিভুক্ত করে মিশন সম্পন্ন করুন।';
      help = 'প্রতিটি চলক স্লাইডার অথবা পাশের সংখ্যার ঘরে বদলানো যায়। “কম মান”, “শুরুর মান” ও “বেশি মান” প্রিসেট এবং শুরুতে ফেরার বোতাম রয়েছে। তিনটি ভিন্ন সেটিংয়ের পর্যবেক্ষণ সংরক্ষণ করে তুলনা করা যায়।';
    } else if (cfg) {
      instruction = 'প্রথমে দেওয়া শুরুর মানে চিত্র ও ফল দেখুন। এরপর ' + cList + ' থেকে একটি করে মান বদলান; প্রতিবার ' + outputs + ' কীভাবে পরিবর্তিত হচ্ছে তুলনা করুন।';
      help = controls.length ? 'এই মডেলে ' + cList + ' নিয়ন্ত্রণের স্লাইডার রয়েছে। প্রতিটি মান আলাদাভাবে বদলালে সংশ্লিষ্ট ফল ও চিত্র হালনাগাদ হয়।' : 'মডেলের উপলভ্য নিয়ন্ত্রণ ব্যবহার করে একবারে একটি মান পরিবর্তন করুন।';
    } else {
      var legacy = window.CL_SIM_ENGINE_HELP_V102 || {};
      instruction = safe(l.tip) ? 'প্রথমে মডেলের বর্তমান অবস্থা দেখুন। প্রদর্শিত ফলের সঙ্গে এই সম্পর্কটি মিলিয়ে নিন: ' + safe(l.tip) : 'মডেলের দৃশ্য, প্রদর্শিত মান ও ফলাফল পর্যবেক্ষণ করুন। কোনো নিয়ন্ত্রণ থাকলে একটি করে পরিবর্তন এনে ফলের পার্থক্য লক্ষ্য করুন।';
      help = safe(legacy[l.sim]) || 'মডেলে যে নিয়ন্ত্রণগুলো বাস্তবে দেখা যাচ্ছে, সেগুলোই ব্যবহার করুন। আলাদা স্লাইডার বা বোতাম না থাকলে দৃশ্য ও ফলাফল পর্যবেক্ষণ করাই যথেষ্ট।';
    }
    return [title, subtitle, desc, instruction, help];
  }

  var book = Object.assign({}, window.CL_SIM_COPYBOOK_V102 || {});
  var catalog = (window.CL_DEF && Array.isArray(window.CL_DEF.labs) ? window.CL_DEF.labs : []).slice();
  Object.keys(specs).forEach(function (id) {
    var g = specs[id], cfg = g.data && g.data.sim || {};
    if (!catalog.some(function (l) { return l && l.id === id; })) {
      catalog.push({ id:id, sim:'arcade:'+id, arcadeImported:true, t:g.t, d:g.d, tip:cfg.formula || cfg.mission, sub:g.subjectKey === 'chemistry' ? 'Chemistry' : g.subjectKey === 'math' ? 'Higher Mathematics' : 'Physics', subjectKey:g.subjectKey });
    }
  });
  catalog.forEach(function (l) { if (l && l.id && !book[l.id]) book[l.id] = makeCopy(l); });
  window.CL_SIM_COPYBOOK_V103 = book;
  window.CL_SIM_COPY_FACTORY_V103 = makeCopy;
  window.CL_SIM_COPY_AUDIT_V103 = { baseLabs:catalog.length, authoredEntries:Object.keys(book).length, arcadeSpecs:Object.keys(specs).length };
})();
