/* Golden Snitch v94 — syllabus-mapped chapter question expansion.
 * This is an editorial draft layer, not a substitute for subject-expert review.
 * Every item is tagged to one exact supplied syllabus topic, uses a different
 * question objective/response set, and carries explicit draft provenance.
 * Question count policy: 80 standard chapters; 110 chapters with >=22 topics.
 */
(function (w) {
  'use strict';
  var syllabus = w.CL_HSC_SYLLABUS_QUIZ_V79 || {};
  var STANDARD_TARGET = 80, LARGE_TARGET = 110, LARGE_THRESHOLD = 22;
  var STEM_VARIANTS = {
    principle: ['“{topic}” বিষয়টির কেন্দ্রীয় ধারণাকে কোন বক্তব্যটি সবচেয়ে নির্ভুলভাবে প্রকাশ করে?', '“{topic}” সম্পর্কে কোন বক্তব্যটি সংজ্ঞা ও মূল নীতির সঙ্গে সামঞ্জস্যপূর্ণ?', 'ধারণাগতভাবে “{topic}” বুঝতে হলে কোন সম্পর্কটি সঠিকভাবে ধরতে হবে?'],
    condition: ['“{topic}” প্রয়োগ করে সিদ্ধান্ত নেওয়ার আগে কোন শর্তটি যাচাই করা সবচেয়ে জরুরি?', '“{topic}”–এর সূত্র বা নীতি ব্যবহার করার বৈধতা কোন শর্তের ওপর নির্ভর করে?', 'কোন পরিস্থিতিতে “{topic}”–এর এই পদ্ধতি গ্রহণযোগ্য হবে?'],
    correction: ['“{topic}” সম্পর্কে একজন শিক্ষার্থী বলল: “{error}”। বক্তব্যটির যথাযথ সংশোধন কোনটি?', '“{topic}”–এর প্রচলিত ভুল ব্যাখ্যাটি হলো “{error}”। কোন বক্তব্যটি ভুলটি সংশোধন করে?', 'একটি উত্তরে লেখা হয়েছে “{error}”। “{topic}”–এর ক্ষেত্রে কোন সংশোধনটি যুক্তিসঙ্গত?'],
    evidence: ['“{topic}” সম্পর্কিত ব্যাখ্যা যাচাই করতে কোন পর্যবেক্ষণটি সবচেয়ে গ্রহণযোগ্য?', 'কোন পরীক্ষণ-ফল “{topic}”–এর নীতিকে সবচেয়ে সরাসরি সমর্থন করে?', '“{topic}” নিয়ে করা দাবির পক্ষে কোন প্রমাণটি সবচেয়ে শক্তিশালী?'],
    method: ['“{topic}” নিয়ে নির্ভরযোগ্য সমাধানে কোন কাজের ক্রমটি অনুসরণ করা উচিত?', '“{topic}”–এর একটি সমস্যা সমাধানের ক্ষেত্রে প্রথম থেকে শেষ পর্যন্ত কোন পদ্ধতিটি সঠিক?', 'কোন সমাধান-কৌশলটি “{topic}”–এর শর্ত অক্ষুণ্ণ রাখে?'],
    application: ['বাস্তব সমস্যা সমাধানে “{topic}”–এর কোন প্রয়োগটি সবচেয়ে সামঞ্জস্যপূর্ণ?', '“{topic}” কোন বাস্তব পরিস্থিতির ব্যাখ্যা বা সমাধানে কাজে লাগে?', 'নিচের কোন প্রয়োগে “{topic}”–এর ধারণাটি যথাযথভাবে ব্যবহৃত হয়েছে?'],
    limitation: ['“{topic}” বিষয়ে কোন সিদ্ধান্তটি প্রযোজ্য সীমা ও অনুমান বিবেচনায় সঠিক?', '“{topic}”–এর কোন সীমাবদ্ধতা উপেক্ষা করলে ভুল ফল পাওয়া যেতে পারে?', 'কোন বক্তব্যটি “{topic}”–এর মডেল বা সূত্রের সীমা যথাযথভাবে চিহ্নিত করে?'],
    representation: ['“{topic}”–এর চিত্র, সারণি বা গ্রাফ বিশ্লেষণে কোন বৈশিষ্ট্যটি শনাক্ত করা উচিত?', '“{topic}”–এর উপস্থাপনায় কোন অক্ষ, চিহ্ন বা সম্পর্কটি সঠিকভাবে পড়তে হবে?', 'কোন ব্যাখ্যাটি “{topic}”–এর চিত্র/গ্রাফ থেকে সঠিকভাবে অনুসৃত হয়?'],
    verification: ['“{topic}” থেকে পাওয়া উত্তরটি যাচাই করতে কোন পরীক্ষা সবচেয়ে কার্যকর?', '“{topic}”–এর সমাধান সঠিক কি না বুঝতে কোন স্বাধীন যাচাইটি করা যায়?', 'কোন পরীক্ষা “{topic}”–এর ফলের অভ্যন্তরীণ সামঞ্জস্য নিশ্চিত করে?'],
    transfer: ['“{topic}”–এর ধারণা নতুন পরিস্থিতিতে প্রয়োগ করলে কোন যুক্তির ভিত্তিতে সিদ্ধান্ত নেওয়া উচিত?', 'পরিস্থিতির শর্ত বদলে গেলে “{topic}”–এর কোন নীতি একইভাবে প্রয়োগযোগ্য থাকবে?', 'নতুন উদাহরণে “{topic}” চিনতে কোন বৈশিষ্ট্যটি কাজে লাগবে?'],
    comparison: ['“{topic}”–এর সঙ্গে কাছাকাছি ধারণা গুলিয়ে না ফেলতে কোন পার্থক্যটি মনে রাখা দরকার?', '“{topic}” ও সংশ্লিষ্ট অন্য ধারণার মধ্যে মূল পার্থক্য কোনটি?', 'কোন তুলনাটি “{topic}”–এর স্বতন্ত্র বৈশিষ্ট্যটি স্পষ্ট করে?'],
    audit: ['“{topic}”–সম্পর্কিত সমাধানে কোন যাচাইটি ভুল সিদ্ধান্ত শনাক্ত করতে সাহায্য করে?', '“{topic}”–এর হিসাব বা যুক্তিতে কোন ধাপটি পুনরায় পরীক্ষা করা সবচেয়ে জরুরি?', 'কোন consistency check “{topic}”–এ ভুল অনুমান বা গণনা ধরতে পারে?']
  };
  var FAMILIES = [
    { key: 'principle', type: 'conceptual', tier: 1, ask: function (t) { return '“' + t + '” বিষয়টির কেন্দ্রীয় ধারণাকে কোন বক্তব্যটি সবচেয়ে নির্ভুলভাবে প্রকাশ করে?'; } },
    { key: 'condition', type: 'analytical', tier: 2, ask: function (t) { return '“' + t + '” প্রয়োগ করে সিদ্ধান্ত নেওয়ার আগে কোন শর্তটি যাচাই করা সবচেয়ে জরুরি?'; } },
    { key: 'correction', type: 'misconception', tier: 2, ask: function (t, p) { return 'একজন শিক্ষার্থী “' + t + '” সম্পর্কে বলল: “' + p.error + '”। তার বক্তব্যের সবচেয়ে যথাযথ সংশোধন কোনটি?'; } },
    { key: 'evidence', type: 'experiment', tier: 3, ask: function (t) { return '“' + t + '” সম্পর্কিত কোনো ব্যাখ্যা যাচাই করতে কোন পর্যবেক্ষণ বা প্রমাণটি সবচেয়ে গ্রহণযোগ্য?'; } },
    { key: 'method', type: 'multiStep', tier: 3, ask: function (t) { return '“' + t + '” নিয়ে দেওয়া একটি সমস্যায় নির্ভরযোগ্য সমাধানে কোন কাজের ক্রমটি সবচেয়ে যুক্তিসঙ্গত?'; } },
    { key: 'application', type: 'realWorld', tier: 2, ask: function (t) { return 'একটি বাস্তব সমস্যা সমাধানে “' + t + '” ব্যবহার করা হচ্ছে। কোন প্রয়োগটি ধারণাটির সঙ্গে সবচেয়ে সামঞ্জস্যপূর্ণ?'; } },
    { key: 'limitation', type: 'assertion', tier: 4, ask: function (t) { return '“' + t + '” বিষয়ে নিচের কোন সিদ্ধান্তটি প্রযোজ্য সীমা ও অনুমান বিবেচনায় সঠিক?'; } },
    { key: 'representation', type: 'graph', tier: 3, ask: function (t) { return '“' + t + '” উপস্থাপনকারী চিত্র, সারণি বা গ্রাফ বিশ্লেষণ করলে কোন বৈশিষ্ট্যটি আগে শনাক্ত করা উচিত?'; } },
    { key: 'verification', type: 'analytical', tier: 4, ask: function (t) { return '“' + t + '” থেকে পাওয়া উত্তরটি যাচাই করতে কোন পরীক্ষা সবচেয়ে কার্যকর?'; } },
    { key: 'transfer', type: 'scenario', tier: 4, ask: function (t) { return '“' + t + '” ধারণাটি নতুন পরিস্থিতিতে প্রয়োগ করলে কোন যুক্তির ভিত্তিতে সিদ্ধান্ত নেওয়া উচিত?'; } },
    { key: 'comparison', type: 'conceptual', tier: 2, ask: function (t) { return '“' + t + '”–এর সঙ্গে কাছাকাছি অন্য ধারণা গুলিয়ে না ফেলতে কোন পার্থক্যটি মনে রাখা দরকার?'; } },
    { key: 'audit', type: 'mathematical', tier: 3, ask: function (t) { return '“' + t + '”–সম্পর্কিত একটি সমাধানে কোন যাচাইটি ভুল সিদ্ধান্ত শনাক্ত করতে সবচেয়ে বেশি সাহায্য করে?'; } }
  ];
  function P(re, principle, condition, error, evidence, method, application, limit, representation, formula, check, compare) {
    return { re: re, principle: principle, condition: condition, error: error, evidence: evidence, method: method, application: application, limitation: limit, representation: representation, formula: formula || '', verification: check, comparison: compare || 'প্রতীক, রাশি, একক ও প্রযোজ্য শর্ত আলাদা করে শনাক্ত করে তারপর তুলনা করতে হবে।' };
  }
  var PROFILES = {
    physics: [
      P(/পদার্থবিজ্ঞান ও অন্যান্য জ্ঞানের জগৎ|পদার্থবিজ্ঞানের পরিসর|পদার্থবিজ্ঞানের অবদান|আন্তঃবিষয়ক|চিকিৎসাবিজ্ঞান|জ্যোতির্বিজ্ঞান/i,
        'পদার্থবিজ্ঞান প্রকৃতি ও প্রযুক্তির পরিমাণগত নিয়ম ব্যাখ্যা করে; গণিত সেই সম্পর্ক প্রকাশ করে, আর রসায়ন, জীববিজ্ঞান, চিকিৎসা, কৃষি ও জ্যোতির্বিজ্ঞানে তা নির্দিষ্ট সমস্যায় প্রয়োগ হয়।',
        'একটি আন্তঃবিষয়ক প্রয়োগ বুঝতে প্রথমে কোন ভৌত নীতি ব্যবহৃত হচ্ছে, পরে সংশ্লিষ্ট বিষয়ের নিজস্ব তথ্য/মডেল কীভাবে যুক্ত হচ্ছে তা আলাদা করতে হবে।',
        'পদার্থবিজ্ঞান অন্য জ্ঞানশাখা থেকে সম্পূর্ণ বিচ্ছিন্ন এবং বাস্তব প্রযুক্তিতে এর কোনো ভূমিকা নেই।',
        'একটি নির্দিষ্ট প্রয়োগে পরিমাপযোগ্য ভৌত রাশি, ব্যবহৃত নীতি এবং পর্যবেক্ষণ/মডেলের পূর্বাভাস পরস্পরের সঙ্গে মেলে কি না পরীক্ষা করা।',
        'সমস্যার ক্ষেত্র শনাক্ত, প্রয়োজনীয় ভৌত রাশি নির্ধারণ, উপযুক্ত নীতি/গাণিতিক মডেল প্রয়োগ এবং ফলকে সংশ্লিষ্ট শাখার প্রেক্ষাপটে ব্যাখ্যা।',
        'চিকিৎসায় ইমেজিং/রেডিয়েশন, কৃষিতে মাটি-জল পর্যবেক্ষণ, জ্যোতির্বিজ্ঞানে আলোর বর্ণালি এবং খেলাধুলায় গতিবিদ্যার বিশ্লেষণ।',
        'একটি ভৌত মডেল বাস্তব ব্যবস্থার সব জটিলতা ধরে না; যন্ত্রের সীমা, জীববৈচিত্র্য, পরিবেশ বা উপাদানের বৈশিষ্ট্যও বিবেচ্য।',
        'ভৌত নীতি → পরিমাপ/মডেল → আন্তঃবিষয়ক প্রয়োগ → পর্যবেক্ষণ/ফল—এমন labelled flow diagram।',
        'প্রয়োগভেদে সম্পর্ক আলাদা; ব্যবহৃত রাশি, একক ও অনুমান নির্দিষ্ট করে লিখতে হবে।', 'পরিমাপের ফল পূর্বাভাসের সঙ্গে তুলনা এবং বিকল্প ব্যাখ্যা পরীক্ষা।', 'ভৌত নীতি সাধারণ হতে পারে, কিন্তু প্রতিটি প্রয়োগে সংশ্লিষ্ট শাখার নিজস্ব শর্তও যুক্ত হয়।'),
      P(/ভৌত জগতের প্রকৃতি|পদার্থবিজ্ঞানের ধারণা|সূত্র, নীতি, স্বীকার্য|পর্যবেক্ষণ ও পরীক্ষণের ক্রমবিকাশ/i,
        'পদার্থবিজ্ঞানে প্রকৃতির ঘটনা পর্যবেক্ষণ, পরিমাপ, পরীক্ষণ ও গাণিতিক মডেলের মাধ্যমে ব্যাখ্যা করা হয়; নতুন প্রমাণ পেলে মডেল সংশোধিত হতে পারে।',
        'পর্যবেক্ষণ, পরীক্ষণ, অনুমান, মডেল ও তত্ত্ব এক জিনিস নয়; পরীক্ষার পুনরাবৃত্তিযোগ্যতা এবং প্রমাণের সীমা বিবেচনা করতে হয়।',
        'একটি বৈজ্ঞানিক তত্ত্ব শুধু অনুমান, অথবা একটি পরীক্ষার ফল সব পরিস্থিতিতে চূড়ান্ত সত্য প্রমাণ করে।',
        'নিয়ন্ত্রিত ও পুনরাবৃত্ত পরীক্ষায় একই শর্তে সামঞ্জস্যপূর্ণ ফল পাওয়া এবং বিকল্প ব্যাখ্যাও পরীক্ষা করা।',
        'প্রশ্ন/সমস্যা নির্ধারণ, পরীক্ষাযোগ্য অনুমান, চলক নিয়ন্ত্রণ, পরিমাপ, ফল বিশ্লেষণ এবং মডেল সংশোধন।',
        'প্রাকৃতিক ঘটনা ব্যাখ্যা, প্রযুক্তি নকশা, ঝুঁকি পূর্বাভাস ও নতুন পরীক্ষার পরিকল্পনা।',
        'পরীক্ষার পরিসর, যন্ত্রের অনিশ্চয়তা ও মডেলের অনুমান ফলের প্রয়োগসীমা নির্ধারণ করে।',
        'পর্যবেক্ষণ → অনুমান → নিয়ন্ত্রিত পরীক্ষা → উপাত্ত → মডেল/ব্যাখ্যা—চক্রাকার বৈজ্ঞানিক পদ্ধতি।',
        'এখানে একক সূত্র নয়; পরীক্ষাযোগ্য মডেল ও প্রমাণের সামঞ্জস্য মুখ্য।', 'পুনরাবৃত্তি, নিয়ন্ত্রণ-চলক ও measurement uncertainty যাচাই।', 'স্বীকার্য/অনুমান একটি ভিত্তি; পরীক্ষণ তার ফল ও সীমা যাচাই করে।'),
      P(/পরিমাপ|একক|মাত্রা|ত্রুটি|লঘিষ্ঠ গণনা|স্ফেরোমিটার|যন্ত্র|তাৎপর্যপূর্ণ অঙ্ক|পর্যবেক্ষণ/i,
        'পরিমাপের ফলকে রাশির সংজ্ঞা, একক, যন্ত্রের resolution ও অনিশ্চয়তার সঙ্গে মিলিয়ে ব্যাখ্যা করতে হয়।',
        'যন্ত্র শূন্য-সংশোধিত ও ক্যালিব্রেটেড কি না, পাঠের একক কী এবং অনিশ্চয়তা কত—তা আগে নির্ধারণ করতে হবে।',
        'বারবার পাঠের গড় নিলেই যন্ত্রের systematic error সম্পূর্ণ দূর হয়ে যায়।',
        'একই মানদণ্ডে পুনরাবৃত্ত পাঠ, শূন্য-পাঠ পরীক্ষা এবং পরিচিত মানের সঙ্গে ক্যালিব্রেশন তুলনা করা।',
        'যন্ত্রের শূন্য-ত্রুটি নির্ণয়, একক/মাত্রা যাচাই, অনিশ্চয়তা হিসাব এবং ফলের significant figure নির্ধারণ।',
        'ল্যাবরেটরিতে দৈর্ঘ্য, ব্যাস, সময় বা ক্ষুদ্র পুরুত্বের নির্ভরযোগ্য পাঠ নেওয়া।',
        'পদ্ধতিগত ত্রুটি থাকলে পুনরাবৃত্তি বা গড় একাই তা দূর করে না।',
        'পাঠ, একক, uncertainty interval এবং যন্ত্রের least count পাশাপাশি দেখানো।',
        'একক ও মাত্রা মিলিয়ে দেখা এবং uncertainty propagation যাচাই করা।', 'random error ও systematic error-এর পার্থক্য।'),
      P(/ভেক্টর|স্কেলার|উপাংশ|লব্ধি|ডট গুণ|ক্রস গুণ|গ্রেডিয়েন্ট|ডাইভারজেন্স|কার্ল/i,
        'ভেক্টর যোগে উপাংশের দিকসহ বীজগাণিতিক যোগ করতে হয়; ডট গুণন স্কেলার এবং ক্রস গুণন ভেক্টর দেয়।',
        'উপাংশ নির্ণয়ের আগে অক্ষের দিক, কোণের reference axis এবং sign convention স্থির করতে হবে।',
        'দুটি ভেক্টরের মান যোগ করলেই সবসময় লব্ধির মান পাওয়া যায়।',
        'প্রতিটি ভেক্টরকে একই coordinate axes-এ ভেঙে উপাংশ যোগ করলে resultant-এর সঙ্গে মেলে।',
        'প্রথমে ভেক্টরকে উপাংশে বিশ্লেষণ, তারপর প্রতিটি অক্ষ বরাবর যোগ এবং শেষে মান-দিক নির্ণয়।',
        'নৌকার বেগ ও স্রোতের বেগ, বলের লব্ধি, ক্ষেত্রের প্রবণতা বা ঘূর্ণন বিশ্লেষণ।',
        'ডট ও ক্রস গুণনের ফল এবং ব্যবহৃত কোণের সংজ্ঞা আলাদা; শুধু মান থেকে orientation জানা যায় না।',
        'একই origin থেকে vector arrow, x/y component এবং resultant-এর সামান্তরিক/ত্রিভুজ চিত্র।',
        'R=A+B; A·B=ABcosθ; |A×B|=ABsinθ।', 'উপাংশের sign ও resultant-এর দিক মূল ভেক্টরগুলোর সঙ্গে সামঞ্জস্যপূর্ণ কি না।', 'স্কেলার রাশিতে দিক লাগে না; ভেক্টরে মান ও দিক দুটিই লাগে।'),
      P(/গতিবিদ্যা|সরণ|দ্রুতি|বেগ|ত্বরণ|প্রক্ষেপ|পড়ন্ত|পতনশীল|বৃত্তাকার গতি|কৌণিক বেগ|গতির সমীকরণ/i,
        'সরণ অবস্থানের পরিবর্তন, বেগ সরণের পরিবর্তনের হার এবং ত্বরণ বেগের পরিবর্তনের হার; গ্রাফের ঢাল/ক্ষেত্রফল নির্দিষ্ট অর্থ বহন করে।',
        'গতির সমীকরণ প্রয়োগে ত্বরণ ধ্রুব কি না, দিকের sign convention এবং প্রাথমিক শর্ত যাচাই করতে হবে।',
        'দ্রুতি ও বেগ সবসময় একই; কোনো বস্তুর বেগের মান বদলালেই শুধু ত্বরণ হয়।',
        'অবস্থান-সময়, বেগ-সময় ও ত্বরণ-সময় গ্রাফের ঢাল/ক্ষেত্রফল একে অন্যের সঙ্গে সঙ্গতিপূর্ণ হয়।',
        'প্রাথমিক ও চূড়ান্ত অবস্থা, সময়, ত্বরণ এবং অক্ষের দিক চিহ্নিত করে প্রাসঙ্গিক সমীকরণ বেছে নেওয়া।',
        'যানবাহনের braking distance, প্রক্ষেপকের পথ, মুক্তপতন এবং গতি-পরিমাপ।',
        'সমত্বরণ সমীকরণ পরিবর্তনশীল ত্বরণে সরাসরি প্রয়োগ করা যায় না; প্রক্ষেপণে অনুভূমিক ও উল্লম্ব উপাংশ পৃথক।',
        'বেগ-সময় গ্রাফের ঢাল ত্বরণ এবং signed area সরণ নির্দেশ করে।',
        'v=u+at; s=ut+½at²; v²=u²+2as (ধ্রুব ত্বরণে)।', 'একক, sign এবং গ্রাফের ঢাল/ক্ষেত্রফল মিলিয়ে দেখা।', 'দূরত্ব পথের মোট দৈর্ঘ্য; সরণ প্রারম্ভিক ও শেষ অবস্থানের ভেক্টর পার্থক্য।'),
      P(/নিউটন|বল|জড়তা|ভরবেগ|ঘর্ষণ|টর্ক|জড়তার ভ্রামক|সংঘর্ষ|কেন্দ্রমুখী|কেন্দ্রবিমুখী|ব্যাংকিং/i,
        'নিউটনের সূত্রে ত্বরণ নির্ধারিত হয় লব্ধি বল দিয়ে; ভরবেগের পরিবর্তন এবং ঘূর্ণনের ক্ষেত্রে টর্ক বিবেচ্য।',
        'মুক্তবস্তু চিত্রে বস্তুর ওপর ক্রিয়াশীল সব বাহ্যিক বল, দিক ও প্রয়োগবিন্দু শনাক্ত করতে হবে।',
        'একটি বলের উপস্থিতি মানেই বস্তুটি সেই বলের দিকেই ত্বরণ পাবে, অন্য বল বিবেচনা না করলেও চলে।',
        'বস্তুর ওপর সব বলের vector sum ও পর্যবেক্ষিত ত্বরণ নিউটনের দ্বিতীয় সূত্রের সঙ্গে মেলে।',
        'মুক্তবস্তু চিত্র আঁকা, অক্ষ নির্বাচন, ΣF=ma লেখা এবং প্রয়োজন হলে ভরবেগ/টর্কের সমীকরণ প্রয়োগ।',
        'নিরাপত্তা বেল্ট, সংঘর্ষ, লিফট, ঘূর্ণনযন্ত্র এবং বাঁকানো সড়কের নকশা।',
        'action-reaction বল দুটি ভিন্ন বস্তুর ওপর কাজ করে; এক বস্তুর সাম্যাবস্থায় সব পৃথক বল শূন্য হওয়া জরুরি নয়।',
        'বস্তুর ওপর বাহ্যিক বলের তীর, normal/friction/weight এবং ঘূর্ণনে lever arm দেখানো।',
        'ΣF=ma; p=mv; J=Δp; τ=r×F।', 'লব্ধি বল, দিক, প্রয়োগবিন্দু ও unit consistency যাচাই।', 'বল ও ভরবেগ আলাদা: বল পরিবর্তনের হার, ভরবেগ গতির পরিমাপ।'),
      P(/কাজ|শক্তি|ক্ষমতা|কর্মদক্ষতা|গতিশক্তি|স্থিতিশক্তি|সংরক্ষণশীল/i,
        'কাজ হলো বলের সরণের দিকে উপাংশের সঙ্গে সরণের গুণফল; শক্তি স্থানান্তর/সঞ্চয়ের পরিমাপ এবং ক্ষমতা কাজের হার।',
        'কাজ নির্ণয়ে বল ও সরণের মধ্যবর্তী কোণ এবং শক্তি সংরক্ষণ প্রয়োগে বাহ্যিক/অসংরক্ষণশীল কাজ বিবেচনা করতে হবে।',
        'বল প্রয়োগ হলেই ধনাত্মক কাজ হয়, সরণের দিক বা কোণের কোনো ভূমিকা নেই।',
        'প্রাথমিক ও চূড়ান্ত যান্ত্রিক শক্তির পার্থক্য বাহ্যিক/অসংরক্ষণশীল কাজের সঙ্গে মেলে।',
        'বল-সরণ কোণ নির্ণয়, কাজের চিহ্ন ঠিক করা এবং শক্তি-হিসাবের প্রাথমিক ও চূড়ান্ত অবস্থা লেখা।',
        'যন্ত্রের efficiency, উত্তোলন, spring storage, braking এবং power rating।',
        'mechanical energy সব ব্যবস্থায় একা সংরক্ষিত নয়; ঘর্ষণ/বাহ্যিক কাজ থাকলে পরিবর্তন হয়।',
        'শক্তি-বার চার্ট বা বল ও সরণের মধ্যবর্তী কোণ-চিত্র।',
        'W=Fs cosθ; K=½mv²; U=mgh; P=W/t।', 'কাজের sign, energy balance ও efficiency 0–100% সীমা যাচাই।', 'শক্তি ও ক্ষমতা গুলিয়ে ফেলা যাবে না; ক্ষমতা শক্তি স্থানান্তরের হার।'),
      P(/মহাকর্ষ|অভিকর্ষ|মুক্তিবেগ|কেপলার|ওজনহীনতা|কক্ষপথ|মহাকর্ষীয়/i,
        'মহাকর্ষ বল ভরদ্বয়ের গুণফলের সমানুপাতিক ও দূরত্বের বর্গের ব্যস্তানুপাতিক; কক্ষপথে মহাকর্ষ কেন্দ্রাভিমুখী বল দেয়।',
        'g বা gravitational potential নির্ণয়ে কেন্দ্র থেকে দূরত্ব (পৃষ্ঠ থেকে উচ্চতা নয়) এবং reference level স্পষ্ট করতে হবে।',
        'উপগ্রহ কক্ষপথে থাকলে তার ওপর মহাকর্ষ বল থাকে না, তাই সেটি ওজনহীন।',
        'কক্ষীয় বেগের জন্য প্রয়োজনীয় কেন্দ্রাভিমুখী বল মহাকর্ষ বলের সমান হয়।',
        'কেন্দ্র থেকে দূরত্ব r নির্ধারণ, মহাকর্ষীয় বল/ক্ষেত্র/বিভব বেছে নেওয়া এবং কক্ষপথের শর্ত প্রয়োগ।',
        'উপগ্রহ কক্ষপথ, গ্রহের আবর্তন, escape velocity এবং জোয়ার-ভাটা বিশ্লেষণ।',
        'পৃষ্ঠ থেকে উচ্চতা h হলে কেন্দ্রীয় দূরত্ব R+h; escape velocity ও orbital velocity এক নয়।',
        'কেন্দ্রীয় ভর, কক্ষীয় ব্যাসার্ধ, tangent velocity এবং inward gravitational force।',
        'F=GMm/r²; g=GM/r²; v_orbit=√(GM/r); v_escape=√(2GM/R)।', 'r-এর সংজ্ঞা, শক্তির sign এবং বেগের মাত্রা যাচাই।', 'কক্ষীয় বেগ হলো কক্ষপথ বজায় রাখার বেগ; মুক্তিবেগ হলো মহাকর্ষীয় ক্ষেত্র থেকে পালানোর ন্যূনতম আদিবেগ।'),
      P(/স্থিতিস্থাপক|ইয়ং|পীড়ন|বিকৃতি|সান্দ্রতা|পৃষ্ঠটান|কৈশিকতা|স্টোকস|প্রান্তিক বেগ|তরল|প্রবাহ|বার্নোলি/i,
        'কঠিনের স্থিতিস্থাপকতা পীড়ন-বিকৃতির সম্পর্ক দিয়ে এবং তরলের প্রবাহ/পৃষ্ঠের আচরণ সান্দ্রতা, পৃষ্ঠটান ও চাপের মাধ্যমে ব্যাখ্যা করা হয়।',
        'Hooke-এর সূত্র প্রযোজ্য করতে elastic limit অতিক্রম করা যাবে না; তরল প্রবাহের মডেলে প্রয়োজনীয় steady/ideal-flow শর্ত যাচাই করতে হবে।',
        'স্থিতিস্থাপক সীমা অতিক্রম করলেও পীড়ন ও বিকৃতির সম্পর্ক সবসময় সরলরৈখিক থাকে।',
        'লোড সরালে নমুনা আগের মাত্রায় ফিরে আসে কি না এবং load–extension গ্রাফের linear region পরীক্ষা।',
        'প্রাসঙ্গিক বল/ক্ষেত্রফল/দৈর্ঘ্য পরিবর্তন নির্ণয় করে stress, strain বা প্রবাহ-শর্ত প্রয়োগ।',
        'নির্মাণসামগ্রীর নির্বাচন, তরল চলাচল, কৈশিক নল এবং সান্দ্র মাধ্যমে কণার পতন।',
        'সান্দ্রতা ও পৃষ্ঠটান ভিন্ন ধর্ম; ideal Bernoulli relation বাস্তব viscous flow-তে সরাসরি নিখুঁত নয়।',
        'stress–strain graph-এ proportional region, elastic limit এবং permanent deformation আলাদা চিহ্নিত।',
        'stress=F/A; strain=ΔL/L; η=stress/strain; প্রাসঙ্গিক তরল-সূত্র।', 'একক এবং কোন অঞ্চলে সূত্রটি প্রযোজ্য তা যাচাই।', 'stress বলের ঘনত্ব; strain মাত্রাহীন আপেক্ষিক বিকৃতি।'),
      P(/পর্যাবৃত্ত|সরল ছন্দিত|দোলন|কম্পাঙ্ক|দশা|স্প্রিং|সরল দোলক|অনুরণন/i,
        'পর্যাবৃত্ত গতিতে অবস্থা নির্দিষ্ট সময় পর পুনরাবৃত্ত হয়; SHM-এ ত্বরণ সরণের সমানুপাতিক এবং বিপরীতমুখী।',
        'SHM-এর সমীকরণ প্রযোজ্য করতে প্রত্যাবর্তী বল/ত্বরণ সাম্যাবস্থার দিকে ও সরণের সমানুপাতিক হতে হবে।',
        'প্রতিটি পর্যাবৃত্ত গতি সরল ছন্দিত গতি।',
        'সাম্যাবস্থার কাছে displacement–acceleration সম্পর্ক সরলরৈখিক এবং slope ঋণাত্মক হয়।',
        'সাম্যাবস্থা, amplitude, period, frequency ও phase আলাদা করে নির্ধারণ করে SHM relation প্রয়োগ।',
        'ঘড়ির দোলক, spring oscillator, কম্পন পরিমাপ ও resonance design।',
        'বড় কৌণিক বিস্তারে simple pendulum-এর T≈2π√(l/g) ক্ষুদ্র-কোণ অনুমানের ওপর নির্ভরশীল।',
        'displacement–time curve, amplitude, period, equilibrium line ও phase interval।',
        'a=−ω²x; T=2π/ω; f=1/T।', 'period ও frequency-এর reciprocal relation যাচাই।', 'সব periodic motion SHM নয়; SHM তার বিশেষ ধরন।'),
      P(/তরঙ্গ|শব্দ|বিট|অনুনাদ|মেলডি|হারমোনিক|ডপলার|স্থির তরঙ্গ/i,
        'তরঙ্গ শক্তি পরিবহন করে; মাধ্যমের কণা সাম্যাবস্থার আশেপাশে দোলে এবং তরঙ্গের বেগ কম্পাঙ্ক ও তরঙ্গদৈর্ঘ্যের গুণফল।',
        'v=fλ প্রয়োগে একই মাধ্যমে তরঙ্গের ধরন, মাধ্যমের বৈশিষ্ট্য এবং স্থির/চল তরঙ্গের শর্ত আলাদা করতে হবে।',
        'তরঙ্গ অগ্রসর হলে মাধ্যমের প্রতিটি কণা একই সঙ্গে উৎস থেকে দূরে সরে যায়।',
        'একটি মাধ্যমের কণা সাম্যাবস্থার আশেপাশে দোলে, অথচ শক্তির প্রভাব দূরবর্তী স্থানে পৌঁছে।',
        'কম্পাঙ্ক, তরঙ্গদৈর্ঘ্য ও বেগ নির্ণয়; boundary condition থেকে node/antinode চিহ্নিত করা।',
        'শব্দ যোগাযোগ, বাদ্যযন্ত্রের harmonic, ultrasound এবং resonance।',
        'তরঙ্গের বেগ মাধ্যমনির্ভর; উৎসের কম্পাঙ্ক বদল ও পর্যবেক্ষকের আপেক্ষিক গতির Doppler effect আলাদা।',
        'একটি wavelength, node/antinode বা compression/rarefaction-এর অবস্থান।',
        'v=fλ; f_beat=|f₁−f₂|; প্রাসঙ্গিক standing-wave relation।', 'একক Hz, m ও m/s এবং boundary condition যাচাই।', 'তরঙ্গের প্রচারদিক ও কণার দোলনের দিক সব তরঙ্গে এক নয়।'),
      P(/গ্যাস|বয়েল|চার্লস|আদর্শ গ্যাস|গতিতত্ত্ব|মূলগড়|মূলগড়|গড় মুক্তপথ|গড় মুক্তপথ|আর্দ্রতা|শিশিরাঙ্ক/i,
        'আদর্শ গ্যাসে অণুর নিজস্ব আয়তন ও আন্তঃআণবিক আকর্ষণ উপেক্ষা করা হয়; চাপ-আয়তন-তাপমাত্রা পরস্পর সম্পর্কিত।',
        'গ্যাস সূত্র প্রয়োগে তাপমাত্রা kelvin-এ, গ্যাসের পরিমাণ স্থির কি না এবং চাপ/আয়তন absolute কি না যাচাই করতে হবে।',
        'গ্যাসের তাপমাত্রা দ্বিগুণ হলে Celsius স্কেলে সব অবস্থায় আয়তন দ্বিগুণ হয়।',
        'কম ঘনত্ব ও উচ্চ তাপমাত্রায় বাস্তব গ্যাস আদর্শ আচরণের কাছাকাছি আসে; deviation বাড়ে শক্তিশালী intermolecular interaction-এ।',
        'প্রদত্ত গ্যাসের state variables লিখে constant parameter নির্ধারণ এবং kelvin scale-এ সমীকরণ প্রয়োগ।',
        'গ্যাস সিলিন্ডার, আবহাওয়া, শ্বাস-প্রশ্বাস, বেলুন ও শিল্প-গ্যাসের সংরক্ষণ।',
        'বাস্তব গ্যাসে intermolecular force ও molecular volume উপেক্ষণীয় না হলে ideal-gas approximation দুর্বল হয়।',
        'particle motion, pressure collision এবং P–V/T state diagram।',
        'PV=nRT; P₁V₁/T₁=P₂V₂/T₂ (নির্দিষ্ট n-এ)।', 'Kelvin conversion ও constant variable যাচাই।', 'Boyle-এর সূত্রে T,n স্থির; Charles-এর সূত্রে P,n স্থির।'),
      P(/তাপগতিবিদ্যা|কার্নো|এন্ট্রপি|এনট্রপি|তাপীয় ইঞ্জিন|তাপীয় ইঞ্জিন|রেফ্রিজারেটর|প্রত্যাবর্তী|অপ্রত্যাবর্তী/i,
        'তাপগতিবিদ্যার প্রথম সূত্র শক্তির হিসাব এবং দ্বিতীয় সূত্র প্রক্রিয়ার দিক/entropy-র সীমা নির্ধারণ করে।',
        'Q ও W-এর sign convention, system boundary এবং কোন প্রক্রিয়ায় কোন reservoir তাপ নেয়/দেয় তা নির্দিষ্ট করতে হবে।',
        'তাপ ইচ্ছামতো সম্পূর্ণরূপে কাজেতে রূপান্তরিত হতে পারে কোনো পারিপার্শ্বিক পরিবর্তন ছাড়াই।',
        'চক্রীয় তাপযন্ত্রে net work ও absorbed/rejected heat-এর শক্তি-ভারসাম্য মেলে, কিন্তু efficiency 100% হয় না।',
        'ব্যবস্থাকে নির্ধারণ, Q/W sign convention লেখা, প্রথম সূত্র প্রয়োগ এবং দ্বিতীয় সূত্রের সীমা পরীক্ষা।',
        'ইঞ্জিন, refrigerator, heat pump এবং শক্তি-রূপান্তর ব্যবস্থার দক্ষতা।',
        'Carnot efficiency reservoir temperature-নির্ভর আদর্শ upper bound; বাস্তব যন্ত্রে irreversibility থাকে।',
        'system–surroundings energy-flow diagram ও T–S/P–V cycle-এর অংশ।',
        'ΔU=Q−W (ব্যবস্থার দ্বারা কাজ ধনাত্মক); η= W_out/Q_in।', 'একই cycle-এর energy balance ও reservoir temperature ordering যাচাই।', 'প্রথম সূত্র শক্তি-ভারসাম্য; দ্বিতীয় সূত্র সম্ভাব্য প্রক্রিয়ার দিক নির্দেশ করে।'),
      P(/কুলম্ব|তড়িৎ ক্ষেত্র|তড়িৎ ক্ষেত্র|তড়িৎ বিভব|তড়িৎ বিভব|ধারক|গাউস|ডাইইলেকট্রিক|দ্বিমেরু|আধান/i,
        'তড়িৎ ক্ষেত্র প্রতি একক ধনাত্মক পরীক্ষণ আধানের বল এবং বিভব প্রতি একক আধানের বিভবশক্তি; ধারক বৈদ্যুতিক শক্তি সঞ্চয় করে।',
        'পরীক্ষণ আধানের sign, field direction, reference potential এবং conductor/dielectric-এর অবস্থান স্পষ্ট করতে হবে।',
        'তড়িৎ ক্ষেত্রের দিক ধনাত্মক পরীক্ষণ আধানের ওপর বলের বিপরীত দিকে।',
        'ক্ষেত্ররেখা ধনাত্মক আধান থেকে বের হয়ে ঋণাত্মক আধানের দিকে যায়; equipotential surface-এ কাজ শূন্য।',
        'আধানের বিন্যাস চিহ্নিত করে superposition প্রয়োগ, তারপর field/potential এবং boundary condition নির্ণয়।',
        'capacitor, touch screen, electrostatic precipitator এবং বৈদ্যুতিক যন্ত্রের insulation।',
        'ক্ষেত্র ও বিভব এক নয়; ক্ষেত্র vector, বিভব scalar এবং reference choice গুরুত্বপূর্ণ।',
        'field-line direction, equipotential surface এবং capacitor plate separation/field।',
        'F=kq₁q₂/r²; E=F/q; V=U/q; C=Q/V।', 'sign, distance dependence এবং field-line crossing prohibition যাচাই।', 'electric field হলো force per charge; potential হলো potential energy per charge।'),
      P(/ওহম|রোধ|জুলের তাপ|কার্শফ|পটেনশিওমিটার|মিটার ব্রিজ|শান্ট|তড়িচ্চালক|তড়িচ্চালক|বিদ্যুৎ প্রবাহ|বর্তনী/i,
        'সরল ohmic resistor-এ নির্দিষ্ট তাপমাত্রায় V/I ধ্রুব; বর্তনীতে charge ও energy conservation মেনে current/voltage বণ্টিত হয়।',
        'ওহমের সূত্রে তাপমাত্রা/ভৌত অবস্থা স্থির এবং Kirchhoff loop-এ sign convention ধারাবাহিক রাখতে হবে।',
        'রোধ দ্বিগুণ করলে একই voltage-এ current-ও দ্বিগুণ হয়।',
        'রোধের দুই প্রান্তের V ও I-এর অনুপাত নির্দিষ্ট শর্তে ধ্রুব এবং series/parallel equivalent resistance-এর সঙ্গে মেলে।',
        'series/parallel topology চিহ্নিত, equivalent resistance নির্ণয়, এরপর I=V/R ও node/loop rule প্রয়োগ।',
        'বৈদ্যুতিক গৃহ-বর্তনী, fuse rating, resistor selection এবং power consumption।',
        'সব উপাদান ohmic নয়; filament lamp বা semiconductor-এর V–I curve অরৈখিক হতে পারে।',
        'battery–resistor loop, current direction, voltage drop এবং ammeter/voltmeter connection।',
        'V=IR; P=VI=I²R=V²/R; H=I²Rt।', 'resistor network reduction এবং circuit power balance যাচাই।', 'series circuit-এ current সমান; parallel branch-এ potential difference সমান।'),
      P(/চৌম্বক|চুম্বক|ওয়েরস্টেড|বায়ো-স্যাভার্ট|অ্যাম্পিয়ার|লরেঞ্জ|ডোমেইন|ফেরো|প্যারা|ডায়া/i,
        'বিদ্যুৎ প্রবাহ/চলমান আধান চৌম্বক ক্ষেত্র সৃষ্টি করে; ক্ষেত্র চলমান আধান বা পরিবাহীর ওপর বল প্রয়োগ করতে পারে।',
        'চৌম্বক বল নির্ণয়ে velocity/current-এর দিক ও B-field-এর দিকের মধ্যবর্তী কোণ এবং right-hand rule মানতে হবে।',
        'স্থির আধানের ওপর চৌম্বক ক্ষেত্র সবসময় চৌম্বক বল প্রয়োগ করে।',
        'চলমান আধানের বেগ B-এর সমান্তরাল হলে magnetic force শূন্য এবং লম্ব হলে মান সর্বাধিক হয়।',
        'আধান/প্রবাহের দিক, field direction, angle এবং right-hand rule দিয়ে বলের দিক নির্ণয়।',
        'electric motor, loudspeaker, mass spectrometer এবং magnetic sensor।',
        'চৌম্বক বল velocity-এর লম্ব; তাই আদর্শভাবে শুধু magnetic force কাজ করে না, kinetic energy পরিবর্তন করে না।',
        'field lines, current direction এবং force direction-এর ত্রিমাত্রিক right-hand-rule diagram।',
        'F=qvBsinθ; F=BILsinθ।', 'θ=0° ও 90° limiting case এবং unit যাচাই।', 'চৌম্বক বল গতির দিক বদলাতে পারে, কিন্তু একা speed বদলায় না।'),
      P(/আবেশ|ফ্যারাডে|লেন্জ|পরিবর্তী প্রবাহ|স্বকীয়|পারস্পরিক|চৌম্বক ফ্লাক্স/i,
        'চৌম্বক ফ্লাক্সের পরিবর্তনে আবিষ্ট emf তৈরি হয়; Lenz-এর সূত্র আবিষ্ট প্রভাবের দিক নির্ধারণ করে।',
        'ফ্লাক্স পরিবর্তন হচ্ছে কি না, coil-turn সংখ্যা, flux orientation এবং সময়ের পরিবর্তন নির্ধারণ করতে হবে।',
        'কুণ্ডলীর মধ্য দিয়ে চৌম্বক ফ্লাক্স থাকলেই আবিষ্ট emf হবে, ফ্লাক্স অপরিবর্তিত হলেও।',
        'চুম্বক ও কুণ্ডলীর আপেক্ষিক গতি বা field strength/orientation বদলালে galvanometer deflection দেখা যায়।',
        'flux Φ=BAcosθ শনাক্ত করে dΦ/dt নির্ণয় এবং Lenz rule দিয়ে induced current-এর দিক স্থির করা।',
        'generator, transformer, induction cooktop এবং wireless charging।',
        'স্থির flux হলে induced emf শূন্য; শুধু বড় flux থাকলেই emf নিশ্চিত নয়।',
        'coil, magnetic field, flux direction এবং induced current-এর প্রতিক্রিয়াশীল দিক।',
        'ε=−N dΦ/dt; Φ=BAcosθ।', 'flux change, coil turns ও time interval-এর sign/units যাচাই।', 'Faraday-এর সূত্র মান নির্ধারণ করে; Lenz-এর সূত্র দিকের বিরোধিতা ব্যাখ্যা করে।'),
      P(/লেন্স|দর্পণ|প্রিজম|প্রতিফলন|প্রতিসরণ|স্নেল|আলোকবিজ্ঞান|ফোকাস|মাইক্রোস্কোপ|টেলিস্কোপ/i,
        'প্রতিফলন/প্রতিসরণে কোণ ও মাধ্যমের refractive index প্রতিবিম্বের দিক/অবস্থান নির্ধারণ করে।',
        'ray diagram-এ principal axis, sign convention, object/image distance এবং real/virtual nature আগে চিহ্নিত করতে হবে।',
        'আলো ঘন মাধ্যমে প্রবেশ করলে সবসময় normal থেকে দূরে বেঁকে যায়।',
        'Snell law অনুযায়ী n₁sin i=n₂sin r; আলো অধিক refractive index-এর মাধ্যমে গেলে normal-এর দিকে বাঁকে।',
        'প্রধান রশ্মি আঁকা, sign convention স্থির, mirror/lens equation প্রয়োগ এবং magnification পরীক্ষা।',
        'চশমা, ক্যামেরা, microscope, telescope ও optical fibre।',
        'চিত্রে দূরত্বের চিহ্ন এবং real/virtual image নির্ধারণে sign convention অপরিহার্য।',
        'normal, incident/refracted ray, focal point এবং object/image location।',
        'n₁sin i=n₂sin r; 1/f=1/v−1/u (চুক্তিভেদে sign convention)।', 'ray trace ও focal length/sign convention মিলিয়ে দেখা।', 'প্রতিফলনে একই মাধ্যমে ফিরে আসে; প্রতিসরণে অন্য মাধ্যমে প্রবেশের সময় দিক/বেগ বদলাতে পারে।'),
      P(/ব্যতিচার|দ্বি-চিড়|অপবর্তন|সমবর্তন|হাইগেনস|তাড়িতচৌম্বকীয় বর্ণালি/i,
        'আলোক তরঙ্গের উপরিপাতে path difference ও phase relation উজ্জ্বল/অন্ধকার fringe নির্ধারণ করে।',
        'coherent source, wavelength, path difference এবং slit/screen geometry নির্দিষ্ট থাকতে হবে।',
        'দুটি আলোক তরঙ্গ একত্র হলেই সবসময় উজ্জ্বল fringe তৈরি হয়।',
        'path difference nλ হলে constructive এবং (n+½)λ হলে destructive interference হয়।',
        'দুটি path-এর দৈর্ঘ্য তুলনা, phase difference নির্ণয় এবং fringe condition প্রয়োগ।',
        'interferometer, thin-film colour, optical measurement এবং diffraction grating।',
        'coherence ও geometry না মানলে আদর্শ fringe formula সরাসরি প্রযোজ্য নয়।',
        'দুটি coherent wave, crest/trough এবং fringe separation।',
        'Δx=nλ (উজ্জ্বল); Δx=(n+½)λ (অন্ধকার)।', 'fringe order ও path-difference integer/half-integer যাচাই।', 'interference হলো দুই coherent wave-এর superposition; diffraction হলো aperture/edge-এ wave spreading।'),
      P(/আপেক্ষিকতা|লরেন্টজ|মাইকেলসন|ফটোতড়িৎ|ফটোইলেকট্রন|প্ল্যাঙ্ক|ডি ব্রগলি|কম্পটন|অনিশ্চয়তা|এক্স-রে|কোয়ান্টাম/i,
        'কোয়ান্টাম/আপেক্ষিকতার ক্ষেত্রে শক্তি, ভরবেগ ও পর্যবেক্ষকের frame-সংক্রান্ত ফল ধ্রুপদি মডেলের সীমার বাইরে যেতে পারে।',
        'ফটোইলেকট্রিক ঘটনায় incident frequency threshold অতিক্রম করছে কি না এবং relativistic সূত্রে speed আলোর বেগের তুলনায় কত তা যাচাই করতে হবে।',
        'ফটোইলেকট্রিক ঘটনায় intensity বাড়ালেই threshold-এর নিচে electron emission শুরু হয়।',
        'threshold frequency অতিক্রমের পর photoelectron-এর maximum kinetic energy frequency-এর সঙ্গে বাড়ে।',
        'প্রদত্ত frequency, work function, photon energy ও frame/velocity শর্ত আলাদা করে সূত্র প্রয়োগ।',
        'photocell, solar cell-এর photon absorption, spectroscopy এবং particle accelerator।',
        'classical approximation কম বেগে কার্যকর; photon energy quantized এবং electron emission threshold-dependent।',
        'photon energy versus frequency graph বা wavelength/momentum relation।',
        'E=hf; Kmax=hf−ϕ; λ=h/p; γ=1/√(1−v²/c²)।', 'threshold, unit conversion এবং limiting behaviour যাচাই।', 'intensity photon number-কে প্রভাবিত করে; frequency photon energy নির্ধারণ করে।'),
      P(/পরমাণু|নিউক্লিয়|রাদারফোর্ড|বোর|তেজস্ক্রিয়|অর্ধজীবন|বন্ধন শক্তি|ফিশন|ফিউশন/i,
        'পরমাণুর শক্তিস্তর quantized; নিউক্লীয় পরিবর্তন ভর-শক্তি ও decay law-এর সঙ্গে সম্পর্কিত।',
        'isotope-এর proton/neutron সংখ্যা, decay mode এবং half-life interval একই unit-এ নিতে হবে।',
        'একটি sample-এর অর্ধজীবন শেষে সব তেজস্ক্রিয় nuclei ক্ষয়প্রাপ্ত হয়।',
        'প্রতি half-life-এ অবশিষ্ট nuclei বা activity পূর্বের অর্ধেক হয়।',
        'প্রাথমিক nuclei, elapsed time ও half-life থেকে অর্ধজীবনের সংখ্যা নির্ণয় করে remaining fraction হিসাব।',
        'nuclear medicine, radiometric dating, reactor design ও radiation safety।',
        'half-life decay probability-এর পরিসংখ্যানিক বৈশিষ্ট্য; একটি নির্দিষ্ট nucleus কখন ক্ষয় হবে তা নির্ধারিত নয়।',
        'proton/neutron composition, energy level বা exponential decay curve।',
        'N=N₀(½)^(t/T½); ΔE=Δmc²।', 'mass number/atomic number এবং remaining fraction যাচাই।', 'chemical reaction electron rearranges; nuclear reaction nucleus বদলায়।'),
      P(/সেমিকন্ডাক্টর|অর্ধপরিবাহী|ডায়োড|ডায়োড|ট্রানজিস্টর|রেক্টিফায়ার|রেক্টিফায়ার|লজিক গেট|বাইনারি/i,
        'অর্ধপরিবাহীর conductivity doping, temperature ও charge-carrier concentration-এর ওপর নির্ভরশীল; diode-এর direction-dependent conduction থাকে।',
        'p/n region, bias polarity, conventional current direction এবং logic gate-এর truth table আলাদা করে দেখতে হবে।',
        'সাধারণ diode উভয় bias-এ সমানভাবে current চালায়।',
        'forward bias-এ diode current উল্লেখযোগ্য হয়, reverse bias-এ ideal diode current প্রায় বন্ধ থাকে।',
        'circuit polarity চিহ্নিত করে diode bias, current path এবং truth table প্রয়োগ।',
        'rectifier, switching, transistor amplification ও digital logic।',
        'বাস্তব diode-এর forward voltage drop ও reverse leakage শূন্য নয়; ideal model একটি approximation।',
        'p-n junction, depletion region, current direction এবং logic symbol/truth table।',
        'binary truth table; diode I–V characteristic।', 'bias polarity, output state ও truth table মিলিয়ে দেখা।', 'diode একমুখী conduction-প্রধান; transistor signal control/amplification করতে পারে।'),
      P(/জ্যোতির্বিজ্ঞান|গ্যালাক্সি|মহাবিশ্ব|হাবল|আলোকবর্ষ|নক্ষত্র|গ্রহ|উপগ্রহ|কসমোলজি/i,
        'জ্যোতির্বৈজ্ঞানিক দূরত্ব, আলোর বেগ ও spectral observation দিয়ে মহাজাগতিক বস্তুর অবস্থান/গতি/বিবর্তন বিশ্লেষণ করা হয়।',
        'দূরত্বের একক (AU, light-year, parsec), redshift sign এবং observation time আলাদা করে বুঝতে হবে।',
        'আলোকবর্ষ সময়ের একক, দূরত্বের একক নয়।',
        'এক light-year হলো আলো এক বছরে যে দূরত্ব অতিক্রম করে; redshift দূরে সরে যাওয়ার ইঙ্গিত দিতে পারে।',
        'পরিমাপকৃত wavelength/shift, distance scale এবং model assumption মিলিয়ে সিদ্ধান্ত নেওয়া।',
        'গ্রহ-নক্ষত্রের দূরত্ব, galaxy recession এবং মহাবিশ্বের প্রসারণ বিশ্লেষণ।',
        'redshift একা সব পরিস্থিতিতে দূরত্বের নিখুঁত মাপকাঠি নয়; cosmological model/context লাগে।',
        'spectrum line-এর rest ও observed wavelength তুলনা বা scale diagram।',
        'v≈H₀d (স্থানীয় Hubble relation); d=ct (light travel distance)।', 'distance unit ও wavelength shift-এর sign যাচাই।', 'আলোকবর্ষ দৈর্ঘ্য; বছর সময়।')
    ],
    chemistry: [
      P(/ল্যাব|নিরাপদ|নিরাপত্তা|যন্ত্র|টাইট্রেশন সেটআপ|পিপেট|বিউরেট|ফিল্টার|পাতন/i,
        'ল্যাবরেটরির নিরাপত্তা PPE, hazard identification, সঠিক handling এবং বর্জ্য নিষ্পত্তির সমন্বিত প্রক্রিয়া।',
        'কাজের আগে chemical label/SDS, hazard pictogram, ventilation এবং waste route নিশ্চিত করতে হবে।',
        'অজানা রাসায়নিকের গন্ধ সরাসরি শুঁকে পরিচয় নিশ্চিত করা নিরাপদ পদ্ধতি।',
        'নির্দিষ্ট PPE, controlled handling ও labelled waste container ব্যবহার করলে exposure ও cross-contamination কমে।',
        'hazard শনাক্ত, উপযুক্ত PPE নির্বাচন, কাজের ধাপ সাজানো এবং spill/emergency response প্রস্তুত রাখা।',
        'শিক্ষা-ল্যাব, শিল্প-ল্যাব ও chemical storage-এ দুর্ঘটনা প্রতিরোধ।',
        'সব রাসায়নিকের জন্য একই waste container বা একই neutralisation method নিরাপদ নয়।',
        'hazard label, PPE, fume hood এবং waste segregation-এর flowchart।',
        'প্রযোজ্য SDS ও institutional safety protocol অনুসরণ; universal single formula নেই।', 'label, concentration, exposure route ও waste compatibility যাচাই।', 'হাতমোজা থাকা মানেই chemical risk সম্পূর্ণ দূর নয়; সঠিক material ও handling দরকার।'),
      P(/গুণগত রসায়ন|শনাক্ত|শিখা পরীক্ষা|ক্যাটায়ন|অ্যানায়ন|অ্যানিয়ন|বিশ্লেষণ|বর্ণালি|অবক্ষেপ|দ্রাব্যতা/i,
        'গুণগত বিশ্লেষণে নির্দিষ্ট reagent/পরীক্ষায় পর্যবেক্ষিত পরিবর্তন থেকে ion বা functional species শনাক্ত করা হয়।',
        'নমুনার পরিমাণ, reagent concentration, pH ও interfering ion বিবেচনায় confirmatory test করতে হবে।',
        'একটি মাত্র অস্পষ্ট রঙ পরিবর্তন সবসময় নির্দিষ্ট ion-এর চূড়ান্ত প্রমাণ।',
        'একই নমুনায় screening test-এর পর আলাদা confirmatory test সামঞ্জস্যপূর্ণ ফল দেয়।',
        'নমুনা প্রস্তুত, reagent নিয়ন্ত্রিত যোগ, observation নথিভুক্ত এবং confirmatory test দিয়ে ফল যাচাই।',
        'পানির আয়ন, ধাতব লবণ, অজানা নমুনা ও forensic screening।',
        'interfering species থাকলে একটি observation ভুল positive দিতে পারে; confirmatory test জরুরি।',
        'reagent → observation → inference → confirmation-এর reaction flow।',
        'প্রতিক্রিয়ার balanced ionic equation ও solubility rule প্রাসঙ্গিক ক্ষেত্রে।', 'ion charge, precipitate solubility এবং control sample মিলিয়ে দেখা।', 'screening test সূত্র দেয়; confirmatory test শনাক্তকরণকে শক্তিশালী করে।'),
      P(/পর্যায়বৃত্ত|পর্যায়বৃত্ত|মৌলের ধর্ম|রাসায়নিক বন্ধন|রাসায়নিক বন্ধন|অরবিটাল|ইলেকট্রন বিন্যাস|আণবিক জ্যামিতি|তড়িৎঋণাত্মকতা|তড়িৎঋণাত্মকতা/i,
        'পর্যায়বৃত্ত প্রবণতা কার্যকর নিউক্লীয় আধান, shielding ও valence-shell configuration-এর সঙ্গে সম্পর্কিত; bonding electron distribution নির্ধারণ করে।',
        'পর্যায় বা group তুলনায় একই ধরনের species, oxidation state এবং electron configuration মিলিয়ে দেখতে হবে।',
        'একই পর্যায়ে atomic radius সাধারণত বাম থেকে ডানে বাড়ে।',
        'একই period-এ effective nuclear charge বাড়ার ফলে atomic radius সাধারণত কমে; group-এ নিচে shell সংখ্যা বাড়ে।',
        'electron configuration, valence electron, effective nuclear charge ও molecular geometry ধাপে বিশ্লেষণ।',
        'reactivity, bond polarity, material property এবং molecule shape অনুমান।',
        'transition element/ion formation-এ trend ব্যতিক্রম থাকতে পারে; isolated atom ও ion একভাবে তুলনীয় নয়।',
        'periodic trend arrow, orbital filling এবং VSEPR geometry sketch।',
        'প্রযোজ্য ক্ষেত্রে formal charge, electronegativity difference ও electron configuration।', 'species charge, shell count ও period/group position যাচাই।', 'ionic bonding electron transfer-প্রধান; covalent bonding shared electron pair-প্রধান।'),
      P(/রাসায়নিক পরিবর্তন|রাসায়নিক পরিবর্তন|বিক্রিয়া|বিক্রিয়া|সাম্য|কাইনেটিক|বিক্রিয়ার হার|বিক্রিয়ার হার|তাপরসায়ন|তাপরসায়ন|এনথালপি|লা-শাতেলিয়ের|লা-শাতেলিয়ে/i,
        'রাসায়নিক বিক্রিয়ায় পরমাণু পুনর্বিন্যস্ত হয়; reaction rate ও equilibrium composition concentration, temperature, pressure ও catalyst-এর প্রভাব অনুযায়ী বদলায়।',
        'সমীকরণ balance, phase, stoichiometric coefficient এবং equilibrium/rate condition ঠিকভাবে শনাক্ত করতে হবে।',
        'catalyst equilibrium constant বদলে দেয় এবং সাম্য উৎপাদের দিকে সরিয়ে দেয়।',
        'catalyst forward ও reverse reaction-এর activation barrier কমিয়ে সাম্যে পৌঁছানোর গতি বাড়ায়, equilibrium composition বদলায় না।',
        'balanced equation লিখে stoichiometry, rate/equilibrium expression এবং পরিবর্তিত condition আলাদা করে বিচার।',
        'ammonia synthesis, industrial yield, acid-base processes ও reaction optimisation।',
        'একই তাপমাত্রায় catalyst K বদলায় না; temperature change equilibrium constant বদলাতে পারে।',
        'reaction energy profile, reversible arrow এবং concentration–time/equilibrium shift diagram।',
        'rate law experiment-নির্ভর; Kc = product concentrations^coefficients / reactant concentrations^coefficients।', 'atom balance, charge balance ও equilibrium expression-এর exponent যাচাই।', 'reaction rate হলো পরিবর্তনের গতি; equilibrium constant হলো সাম্যাবস্থার composition relation।'),
      P(/কর্মমুখী|খাদ্য|সংরক্ষণ|টয়লেট|টয়লেট|ক্লিনার|সাবান|ভিনেগার|প্রসাধন|শিল্প-প্রক্রিয়া|শিল্প প্রক্রিয়া/i,
        'কর্মমুখী রসায়নে পণ্যের প্রস্তুতি, উপাদানের কার্যকারিতা, নিরাপত্তা, গুণমান ও পরিবেশগত প্রভাব একসঙ্গে বিচার করা হয়।',
        'formulation বা preservation-এ concentration, pH, compatibility, contamination control ও safety standard নির্দিষ্ট করতে হবে।',
        'কোনো পণ্য কার্যকর হলেই তার ব্যবহার ও নিষ্কাশন পরিবেশের জন্য নিরাপদ।',
        'মান-পরীক্ষা, stability test, labelled composition ও waste assessment একত্রে গ্রহণযোগ্য product evaluation দেয়।',
        'কাঁচামাল শনাক্ত, formulation-এর অনুপাত মাপা, ছোট batch test এবং quality/safety check করা।',
        'খাদ্য সংরক্ষণ, দৈনন্দিন পরিষ্কারক, প্রসাধন এবং household chemistry।',
        'একটি formulation-এর উপাদান অন্য রাসায়নিকের সঙ্গে অসামঞ্জস্যপূর্ণ হলে ঝুঁকি তৈরি হতে পারে।',
        'ingredient–function–hazard–disposal comparison chart।',
        'নির্দিষ্ট formulation; একক সার্বজনীন অনুপাত নেই।', 'pH, label, concentration, shelf life ও disposal route যাচাই।', 'কার্যকারিতা, consumer safety এবং environmental safety তিনটি আলাদা মানদণ্ড।'),
      P(/পরিবেশ|বায়ুমণ্ডল|বায়ুমণ্ডল|গ্যাসের সূত্র|গ্রাহাম|বয়েল|বয়েল|চার্লস|গে-লুসাক|ডালটন|গতিতত্ত্ব|গ্রিনহাউস|CFC|ওজোন|এসিড বৃষ্টি|অ্যাসিড বৃষ্টি|পানিদূষণ|পানিদূষণ|BOD|COD|আর্সেনিক|ভারী ধাতু|অম্ল-ক্ষার|pH|দ্রবণ/i,
        'পরিবেশ রসায়নে পদার্থের বায়ু/পানি/মাটিতে উপস্থিতি, রাসায়নিক রূপ, concentration এবং ecosystem-এর ওপর প্রভাব বিবেচনা করা হয়।',
        'নমুনার উৎস, sampling time, pH, concentration unit এবং background/control value একইভাবে তুলনা করতে হবে।',
        'দূষকের concentration কম হলেই তার ঝুঁকি সবসময় শূন্য।',
        'একাধিক indicator (যেমন DO, BOD, COD, pH ও TDS) একত্রে বিশ্লেষণ করলে পানির গুণমানের চিত্র নির্ভরযোগ্য হয়।',
        'সঠিক sampling, unit conversion, relevant indicator measurement ও source identification করে mitigation নির্বাচন।',
        'বায়ু/পানির গুণমান পর্যবেক্ষণ, greenhouse-gas mitigation এবং industrial effluent treatment।',
        'একটি indicator একা পুরো পরিবেশগত ঝুঁকি নির্ধারণ করে না; exposure ও species toxicity গুরুত্বপূর্ণ।',
        'pollutant source → transport → concentration → exposure → impact flow।',
        'PV=nRT; ppm≈mg/L (শুধু dilute aqueous solution-এ density≈1 kg/L ধরে); pH=−log[H⁺]।', 'unit, sampling bias এবং indicator-এর অর্থ যাচাই।', 'BOD জৈব পদার্থ ভাঙতে অণুজীবের oxygen demand; COD রাসায়নিক oxidation demand।'),
      P(/জৈব|কার্যকরী মূলক|হাইড্রোকার্বন|অ্যালকেন|অ্যালকিন|অ্যালকাইন|বেনজিন|অ্যারোমেটিক|সমাণু|পলিমার|অ্যালকোহল|ইথার|অ্যালডিহাইড|কিটোন|কার্বক্সিল|অ্যামিন|অ্যামাইড|এস্টার/i,
        'জৈব যৌগের শ্রেণি ও বিক্রিয়াশীলতা carbon skeleton, functional group, bonding এবং molecular structure দ্বারা নির্ধারিত হয়।',
        'নামকরণ/প্রতিক্রিয়া নির্ণয়ে longest chain, functional-group priority, unsaturation ও reaction condition ঠিক করতে হবে।',
        'একই molecular formula মানেই যৌগগুলোর structure ও chemical property একই।',
        'structural isomer-এর molecular formula এক হলেও connectivity/functional group আলাদা হওয়ায় property ও reaction ভিন্ন হতে পারে।',
        'functional group শনাক্ত, parent chain নির্বাচন, numbering/priority প্রয়োগ এবং reaction mechanism-এর ধাপ অনুসরণ।',
        'ঔষধ, polymer, solvent, fuel, food chemistry এবং biomolecule।',
        'reaction outcome reagent, solvent, temperature এবং substrate structure-এর ওপর নির্ভরশীল।',
        'carbon skeleton-এ functional group label ও reaction centre চিহ্নিত।',
        'functional-group-specific reaction; polymerisation-এ addition/condensation pathway প্রাসঙ্গিক।', 'atom count, functional-group identity ও reaction-condition মিলিয়ে দেখা।', 'structural isomer-এ connectivity বদলায়; stereoisomer-এ connectivity একই, spatial arrangement বদলায়।'),
      P(/পরিমাণগত|মোল|মোলার|ঘনমাত্রা|লঘুকরণ|টাইট্রেশন|প্রশমন|জারণ|বিজারণ|বিয়ার|বিয়ার|ল্যাম্বার্ট|স্পেকট্রোস্কোপি|গ্যাসের আয়তন|গ্যাসের আয়তন/i,
        'পরিমাণগত রসায়নে mole, stoichiometric ratio, concentration ও measurement uncertainty ব্যবহার করে অজানা পরিমাণ নির্ণয় করা হয়।',
        'সমীকরণ balance, limiting reagent, unit conversion এবং titration-এর equivalence/end-point আলাদা করে বুঝতে হবে।',
        'দ্রবণের volume বাড়ালেই দ্রবের mole সংখ্যা বাড়ে, dilution-এ solute amount অপরিবর্তিত থাকে না।',
        'একই solute-এর dilution-এ concentration কমে কিন্তু solute amount অপরিবর্তিত থাকে (loss/reaction না হলে)।',
        'balanced equation, mole ratio, concentration unit ও significant figure ধারাবাহিকভাবে প্রয়োগ।',
        'titration, quality control, medicine formulation এবং industrial analysis।',
        'indicator end point equivalence point-এর খুব কাছাকাছি হতে হবে; reagent standardisation প্রয়োজন হতে পারে।',
        'burette/pipette titration curve, mole-ratio table ও calibration curve।',
        'n=m/M; C=n/V; C₁V₁=C₂V₂; Beer–Lambert A=εlc (শর্তসাপেক্ষ)।', 'stoichiometric coefficients, final volume ও unit consistency যাচাই।', 'endpoint হলো indicator-এর observation; equivalence point হলো stoichiometric condition।'),
      P(/তড়িৎ রসায়ন|তড়িৎ রসায়ন|তড়িৎবিশ্লেষ্য|তড়িৎবিশ্লেষ্য|পরিবাহিতা|ফ্যারাডে|ইলেকট্রোলাইট|ইলেকট্রোড|তড়িৎদ্বার|তড়িৎদ্বার|নার্নস্ট|নর্নস্ট|ব্যাটারি|ফুয়েল সেল|ফুয়েল সেল|গ্যালভানিক/i,
        'তড়িৎ রসায়নে redox reaction-এর electron transfer এবং electrochemical cell-এ chemical/electrical energy conversion বিশ্লেষণ করা হয়।',
        'anode/cathode নির্ধারণে oxidation/reduction reaction দেখতে হবে; cell notation, electron direction ও ion flow আলাদা রাখতে হবে।',
        'anode সব কোষে positive এবং cathode সব কোষে negative।',
        'anode-এ oxidation ও cathode-এ reduction হয়; sign galvanic ও electrolytic cell-এ ভিন্ন হতে পারে।',
        'অর্ধ-বিক্রিয়া লিখে electron balance, electrode potential ও cell configuration অনুযায়ী net reaction বের করা।',
        'battery, electroplating, corrosion prevention, electrolysis ও fuel cell।',
        'standard electrode potential থেকে sign convention না বুঝে cell voltage নেওয়া যাবে না; concentration বদলালে Nernst correction লাগে।',
        'anode/cathode, salt bridge, electron path এবং ion migration-এর পৃথক চিত্র।',
        'Ecell=Ecathode−Eanode; Q=It; প্রযোজ্য Nernst/Faraday relation।', 'oxidation/reduction direction, charge balance ও cell polarity যাচাই।', 'galvanic cell স্বতঃস্ফূর্ত redox থেকে বিদ্যুৎ দেয়; electrolytic cell বাহ্যিক বিদ্যুৎ নিয়ে reaction চালায়।'),
      P(/অর্থনৈতিক|প্রাকৃতিক গ্যাস|কয়লা|কয়লা|ইউরিয়া|ইউরিয়া|কাচ|সিরামিক|সিমেন্ট|ট্যানিং|ETP|রিসাইক্লিং|ন্যানো|শিল্প/i,
        'অর্থনৈতিক রসায়নে কাঁচামাল, process chemistry, energy, product quality, waste treatment ও lifecycle impact একসঙ্গে মূল্যায়ন করতে হয়।',
        'শিল্পপ্রক্রিয়ার yield ও efficiency তুলনায় raw-material input, energy demand, by-product ও emission একই boundary-তে হিসাব করতে হবে।',
        'উৎপাদনের পরিমাণ বাড়ালেই process-এর অর্থনৈতিক ও পরিবেশগত দক্ষতা বাড়ে।',
        'একই product output-এ কম raw material/energy ও কম harmful waste হলে process efficiency উন্নত বলা যায়।',
        'process flow, reaction yield, energy balance এবং waste stream শনাক্ত করে control/treatment নির্বাচন।',
        'বাংলাদেশের gas/coal, fertiliser, cement, textile, ETP ও recycling industry বিশ্লেষণ।',
        'কেবল factory-gate cost নয়; pollution control, worker safety ও lifecycle cost-ও গুরুত্বপূর্ণ।',
        'raw material → process → product/by-product → waste treatment flowchart।',
        'yield=(actual/theoretical)×100%; process-specific stoichiometry ও energy balance।', 'mass balance, yield, emission and waste-treatment efficiency যাচাই।', 'recycling resource recovery; reuse product সরাসরি পুনর্ব্যবহার; treatment দূষক কমায়।')
    ],
    math: [
      P(/ম্যাট্রিক্স|নির্ণায়ক|নির্ণায়ক|matrix|determinant/i,
        'ম্যাট্রিক্স সারি-স্তম্ভে রাশি সাজায়; determinant বর্গম্যাট্রিক্সের scalar বৈশিষ্ট্য, invertibility ও area/volume scaling জানায়।',
        'matrix operation-এর আগে order/compatible dimensions এবং inverse-এর আগে determinant শূন্য কি না যাচাই করতে হবে।',
        'দুটি matrix-এর যোগ বা গুণ সব dimension-এর ক্ষেত্রে সংজ্ঞায়িত।',
        'সমান order-এর matrix যোগ করা যায়; AB গুণফল সংজ্ঞায়িত হতে A-এর column সংখ্যা B-এর row সংখ্যার সমান হতে হয়।',
        'matrix order লিখে operation-এর compatibility পরীক্ষা, তারপর row/column rule প্রয়োগ।',
        'linear systems, coordinate transformation, computer graphics ও data modelling।',
        'det(A)=0 হলে square matrix singular; inverse নেই।',
        'matrix entries, row/column labels এবং linear transformation-এর basis vector।',
        '2×2 determinant ad−bc; A⁻¹ বিদ্যমান ⇔ det(A)≠0।', 'order, sign, determinant এবং product dimension যাচাই।', 'matrix product সাধারণত commutative নয়: AB≠BA হতে পারে।'),
      P(/ভেক্টর|ডট গুণ|ক্রস গুণ|scalar product|vector product/i,
        'ভেক্টরকে স্থানাঙ্কে প্রকাশ করে component-wise যোগ করা যায়; dot product scalar এবং cross product vector।',
        'দুটি vector-এর component একই coordinate basis-এ আছে কি না এবং angle-এর range/units কী তা নিশ্চিত করতে হবে।',
        'A·B এবং A×B উভয়ের ফল scalar।',
        'dot product একটি scalar দেয়; cross product-এর মান area-এর সঙ্গে সম্পর্কিত একটি vector দেয়।',
        'component লিখে dot/cross formula প্রয়োগ, sign ও direction right-hand rule দিয়ে যাচাই।',
        'force decomposition, displacement-work, 3D geometry ও torque।',
        'শূন্য dot product অশূন্য vector-এর orthogonality নির্দেশ করে; zero cross product parallel/anti-parallel নির্দেশ করে।',
        'vector components, parallelogram resultant ও cross-product orientation।',
        'A·B=|A||B|cosθ; |A×B|=|A||B|sinθ।', 'component sign ও angle convention যাচাই।', 'dot product-এর ফল scalar; cross product-এর দিক দুই vector-এর plane-এর লম্ব।'),
      P(/সরলরেখা|ঢাল|স্থানাঙ্ক|সমান্তরাল|লম্ব রেখা|intercept/i,
        'সরলরেখার ঢাল y-এর পরিবর্তনকে x-এর পরিবর্তন দিয়ে ভাগ করলে পাওয়া যায়; একই রেখার বিভিন্ন বিন্দুতে ঢাল ধ্রুব।',
        'slope formula-এ x-coordinate-এর পার্থক্য শূন্য কি না এবং vertical line-এর ক্ষেত্রে slope undefined কি না যাচাই করতে হবে।',
        'দুটি রেখার ঢাল সমান হলেই তারা একই রেখা; intercept বিবেচনার দরকার নেই।',
        'সমান্তরাল রেখার slope সমান, কিন্তু intercept আলাদা হতে পারে; একই রেখা হলে intercept-ও একই।',
        'দুটি বিন্দুর coordinate পার্থক্য নির্ণয়, slope হিসাব এবং intercept/point-slope form দিয়ে equation লেখা।',
        'মানচিত্র, রাস্তার ঢাল, linear trend ও intersection problem।',
        'vertical line-এর slope সংজ্ঞায়িত নয়; perpendicular slope product −1 শর্তে non-vertical pair-এ প্রযোজ্য।',
        'coordinate axes, two points, rise/run, slope triangle ও intercept।',
        'm=(y₂−y₁)/(x₂−x₁); y−y₁=m(x−x₁)।', 'line-এর দুই point বসিয়ে equation এবং slope পুনরায় যাচাই।', 'সমান slope parallel হতে পারে; একই রেখা নিশ্চিত করতে একটি common point/intercept দরকার।'),
      P(/বৃত্ত|কেন্দ্র|ব্যাসার্ধ|জ্যা|স্পর্শক|circle/i,
        'বৃত্তের প্রতিটি বিন্দু নির্দিষ্ট কেন্দ্র থেকে সমদূরত্বে থাকে; ব্যাসার্ধ, কেন্দ্র ও tangent-এর সম্পর্ক সমীকরণে প্রকাশিত।',
        'standard equation পড়ার সময় completing square, centre-এর sign এবং radius-এর square root নিতে হবে।',
        'x²+y²+Dx+Ey+F=0-এ কেন্দ্র (D/2,E/2)।',
        'পূর্ণবর্গে রূপান্তর করলে কেন্দ্র (−D/2,−E/2) এবং radius পাওয়া যায়।',
        'x ও y-তে পূর্ণবর্গ, standard form-এ রূপান্তর এবং centre/radius শনাক্ত।',
        'circular track, satellite cross-section, wheel geometry ও tangent construction।',
        'radius² ধনাত্মক হতে হবে বাস্তব non-degenerate circle-এর জন্য; tangent point-এ radius perpendicular।',
        'centre, radius, chord, tangent ও perpendicular radius।',
        '(x−h)²+(y−k)²=r²।', 'centre sign এবং r² থেকে square root ঠিক আছে কি না যাচাই।', 'chord-এর দুই প্রান্ত বৃত্তে; diameter centre দিয়ে যায়; tangent এক বিন্দুতে স্পর্শ করে।'),
      P(/বিন্যাস|সমাবেশ|permutation|combination/i,
        'বিন্যাসে ক্রম গুরুত্বপূর্ণ; সমাবেশে শুধু নির্বাচন গুরুত্বপূর্ণ, তাই একই বাছাইয়ের ভিন্ন ক্রম আলাদা গণনা নয়।',
        'ক্রম গুরুত্বপূর্ণ কি না এবং repetition/identical object allowed কি না নির্ধারণ করতে হবে।',
        'যেকোনো selection problem-এ permutation ব্যবহার করতে হয়।',
        'একই দল/committee নির্বাচন করলে ক্রম বদলালেও ফল এক; পদে আলাদা দায়িত্ব দিলে ক্রম/assignment গুরুত্বপূর্ণ হতে পারে।',
        'প্রথমে object distinct কি না, order matters কি না, repetition allowed কি না স্থির করে formula বেছে নেওয়া।',
        'committee selection, password, seating arrangement ও schedule।',
        'repetition, identical objects বা circular arrangement থাকলে basic nPr/nCr সূত্র সরাসরি যথেষ্ট নাও হতে পারে।',
        'tree diagram বা ordered slots বনাম unordered group comparison।',
        'nPr=n!/(n−r)!; nCr=n!/[r!(n−r)!]।', 'আসন/দল/ক্রমের interpretation দিয়ে answer reasonableness যাচাই।', 'nPr=nCr×r! যখন সব নির্বাচিত বস্তু আলাদা এবং ক্রম বিবেচ্য।'),
      P(/ত্রিকোণমিতি|ত্রিকোণমিতিক অনুপাত|সাইন|কোসাইন|ট্যান|কোণ|সংযুক্ত কোণ|বিপরীত ত্রিকোণমিতি/i,
        'ত্রিকোণমিতিক অনুপাত কোণ ও বাহুর সম্পর্ক প্রকাশ করে; quadrant ও domain sign/branch নির্ধারণ করে।',
        'identity প্রয়োগে denominator শূন্য হচ্ছে কি না, angle degree/radian এবং inverse-function principal range যাচাই করতে হবে।',
        'sin²θ+cos²θ=1 থেকে sinθ ও cosθ উভয়ই সবসময় ধনাত্মক।',
        'পরিচয়টি সব real θ-তে সত্য, কিন্তু sin/cos-এর sign quadrant অনুযায়ী বদলায়।',
        'quadrant চিহ্নিত, reference angle নির্ণয়, identity প্রয়োগ এবং domain/range দিয়ে গ্রহণযোগ্য root বাছাই।',
        'height-distance, periodic signal, navigation ও harmonic analysis।',
        'inverse trig function একটি নির্দিষ্ট principal range ব্যবহার করে; equation-এর সব periodic solution আলাদা বিবেচনা করতে হয়।',
        'unit circle, right triangle এবং quadrant sign chart।',
        'sin²θ+cos²θ=1; 1+tan²θ=sec²θ; প্রয়োজনমতো angle addition।', 'quadrant, periodicity এবং degree/radian conversion যাচাই।', 'trigonometric function periodic; inverse trig function সাধারণত principal branch-এ one-to-one করা হয়।'),
      P(/ফাংশন|লেখচিত্র|domain|range|বিপরীত ফাংশন|inverse function/i,
        'ফাংশন প্রতিটি domain input-কে ঠিক একটি output-এ map করে; graph/domain/range এবং injectivity inverse নির্ধারণে গুরুত্বপূর্ণ।',
        'বর্গমূল, denominator, logarithm এবং inverse function-এর ক্ষেত্রে domain restriction আগে পরীক্ষা করতে হবে।',
        'প্রতিটি relation এবং প্রতিটি function-এর inverse আবার function হয়।',
        'horizontal-line test pass করলে function one-to-one এবং inverse relation-ও function হয়।',
        'domain নির্ণয়, mapping/graph পরীক্ষা, range বের করা এবং প্রয়োজনে inverse relation যাচাই।',
        'modelling, input-output system, encryption mapping এবং data transformation।',
        'একটি function-এর domain বদলালে range/inverse behaviour বদলাতে পারে; inverse-এর domain ও range অদলবদল হয়।',
        'mapping diagram, vertical/horizontal line test এবং y=x reflection।',
        'f(f⁻¹(x))=x; inverse function-এর domain/range interchange।', 'প্রতিটি input-এর এক output এবং inverse-এ uniqueness যাচাই।', 'function test vertical line; inverse-function test horizontal line।'),
      P(/অন্তরীকরণ|অন্তরজ|অন্তরকলন|স্পর্শক|derivative|সর্বোচ্চ|সর্বনিম্ন|ক্রমবর্ধমান|ক্রমহ্রাসমান/i,
        'অন্তরজ কোনো বিন্দুতে তাৎক্ষণিক পরিবর্তনের হার ও স্পর্শকের ঢাল নির্দেশ করে।',
        'দ্বিতীয় derivative/critical point ব্যবহার করার আগে differentiability, domain ও endpoint condition যাচাই করতে হবে।',
        'f′(a)=0 হলেই a-তে অবশ্যই local maximum বা minimum।',
        'critical point-এ derivative sign change বা second-derivative test প্রয়োজন; শুধু f′=0 যথেষ্ট নয়।',
        'প্রথমে derivative, তারপর critical point, interval/sign test এবং শেষে প্রাসঙ্গিক endpoint value পরীক্ষা।',
        'instantaneous velocity, marginal cost, optimisation এবং tangent approximation।',
        'কোণার বিন্দু বা nondifferentiable point-এ derivative শূন্য না হলেও extremum হতে পারে।',
        'curve, tangent line, secant slope ও local zoom interpretation।',
        'd(xⁿ)/dx=nxⁿ⁻¹; tangent slope=f′(a)।', 'প্রাপ্ত derivative original function-এর finite difference trend-এর সঙ্গে মেলে কি না।', 'function value f(a) ও slope f′(a) আলাদা রাশি।'),
      P(/যোগজীকরণ|সমাকলন|integral|ক্ষেত্রফল|রিম্যান|প্রতিস্থাপন|আংশিক ভগ্নাংশ/i,
        'যোগজীকরণ derivative-এর বিপরীত প্রক্রিয়া; definite integral signed accumulation নির্দেশ করে।',
        'integration-এর আগে integrand simplify, substitution relation এবং definite integral-এ limits/area sign ঠিক করতে হবে।',
        'definite integral সবসময় x-axis-এর ওপরের মোট ধনাত্মক ক্ষেত্রফল।',
        'x-axis-এর নিচের অংশ signed integral-এ ঋণাত্মক অবদান রাখে; geometric total area-তে absolute area যোগ করতে হয়।',
        'antiderivative বের, integration constant যোগ, definite হলে upper/lower limit বসানো এবং sign interpretation।',
        'velocity থেকে displacement, variable rate থেকে total amount এবং area/volume problem।',
        'power rule-এর n=−1 ব্যতিক্রমে logarithmic integral লাগে; improper integral convergence পরীক্ষা চায়।',
        'curve ও x-axis-এর মধ্যবর্তী signed region, Riemann rectangles ও antiderivative endpoint।',
        '∫xⁿdx=xⁿ⁺¹/(n+1)+C (n≠−1); ∫ₐᵇf=F(b)−F(a)।', 'differentiate করলে antiderivative ফেরত আসে কি না যাচাই।', 'definite integral signed; geometric area non-negative।'),
      P(/বাস্তব সংখ্যা|অসমতা|পরমমান|সংখ্যারেখা|interval/i,
        'বাস্তব সংখ্যা সংখ্যারেখায় বিন্যস্ত; inequality transformation-এ negative multiplier দিয়ে গুণ/ভাগ করলে order উল্টে যায়।',
        'absolute-value inequality-তে right-hand bound-এর sign এবং interval endpoint open/closed কি না দেখতে হবে।',
        'অসমতার দুই পাশে ঋণাত্মক সংখ্যা দিয়ে গুণ করলেও inequality sign অপরিবর্তিত থাকে।',
        'উদাহরণ 2<5-কে −1 দিয়ে গুণ করলে −2>−5 হয়; order reversal ঘটে।',
        'expression isolate, multiplier-এর sign check, প্রয়োজনমতো cases এবং interval notation প্রয়োগ।',
        'error tolerance, measurement range এবং constraint modelling।',
        'absolute value inequality-এর <, ≤, >, ≥ ক্ষেত্রে solution interval আলাদা হয়।',
        'number line-এ endpoint open/closed circle ও solution interval।',
        '|x−a|<r ⇔ a−r<x<a+r (r>0)।', 'sample point বসিয়ে interval inequality সত্য কি না যাচাই।', 'interval-এর endpoint অন্তর্ভুক্ত হলে bracket; না হলে parenthesis।'),
      P(/জটিল সংখ্যা|আর্গান্ড|অনুবন্ধী|মডুলাস|আর্গুমেন্ট|এককের ঘনমূল|complex/i,
        'জটিল সংখ্যা a+bi আকারে বাস্তব ও কাল্পনিক অংশ নিয়ে গঠিত; Argand plane-এ এটি বিন্দু/ভেক্টর হিসেবে দেখা যায়।',
        'modulus/argument-এ quadrant এবং conjugate ব্যবহারে imaginary part-এর sign বিবেচনা করতে হবে।',
        'conjugate নিলে বাস্তব ও কাল্পনিক উভয় অংশের sign বদলে যায়।',
        'a+bi-এর conjugate a−bi; modulus origin থেকে দূরত্ব √(a²+b²)।',
        'real/imaginary component শনাক্ত, Argand point plot, modulus/argument ও conjugate নির্ণয়।',
        'oscillatory systems, complex roots এবং phasor representation।',
        'argument-এর principal value branch-dependent; একই complex number-এর coterminal arguments অসীম।',
        'Argand plane-এ real axis, imaginary axis, modulus radius ও argument angle।',
        '|a+bi|=√(a²+b²); z z̄=|z|²।', 'quadrant, conjugate product real/non-negative কি না যাচাই।', 'conjugate-এর real part অপরিবর্তিত; imaginary part-এর sign বিপরীত।'),
      P(/বহুপদী|দ্বিঘাত|ত্রিঘাত|মূল ও সহগ|বিচ্ছিন্নক|discriminant/i,
        'বহুপদীর degree সর্বোচ্চ power; polynomial roots ও coefficients-এর সম্পর্ক factorisation/Vieta formula দিয়ে বিশ্লেষণ করা যায়।',
        'quadratic formula/Vieta প্রয়োগে leading coefficient non-zero এবং equation standard form-এ থাকতে হবে।',
        'quadratic discriminant negative হলে দুটি ভিন্ন বাস্তব মূল পাওয়া যায়।',
        'Δ=b²−4ac<0 হলে বাস্তব মূল নেই; complex conjugate root পাওয়া যায়।',
        'standard form, coefficient ও discriminant শনাক্ত করে root type/factorisation নির্ণয়।',
        'trajectory intersection, optimisation, model fitting এবং algebraic equations।',
        'multiple root হলে discriminant zero; factor theorem-এ root বসালে polynomial zero হতে হবে।',
        'parabola x-axis-কে দুইবার ছেদ/স্পর্শ/অছেদনের graph representation।',
        'α+β=−b/a; αβ=c/a; x=[−b±√Δ]/(2a)।', 'root sum/product এবং substitution দিয়ে যাচাই।', 'degree polynomial-এর root count-এর upper bound; repeated root আলাদা multiplicity পায়।'),
      P(/দ্বিপদী|প্যাসকেল|সাধারণ পদ|মধ্যপদ|গাণিতিক আরোহ|binomial/i,
        'দ্বিপদী বিস্তৃতিতে coefficient binomial coefficient দ্বারা নির্ধারিত; general term থেকে নির্দিষ্ট পদ/মধ্যপদ বের হয়।',
        'power n, term index r, exponent decrement এবং sign/variable placement ঠিক রাখতে হবে।',
        'বিস্তৃতিতে r-তম পদে a-এর ঘাত r−1 এবং x-এর ঘাত n−r+1 হয়।',
        'general term-এ a^(n−r+1)x^(r−1) থাকে যখন r=1 থেকে পদ গণনা করা হয়।',
        'general term লিখে required power match, binomial coefficient নির্ণয় এবং index conversion করা।',
        'polynomial coefficient, approximation ও combinatorial counting।',
        'negative/non-integer exponent হলে infinite series/condition আলাদা; finite binomial theorem সরাসরি integer n-এ।',
        'Pascal triangle row ও term index, exponent pattern।',
        '(a+x)^n-এর r-তম পদ = ⁿCᵣ₋₁ a^(n−r+1)x^(r−1)।', 'coefficient sum (2^n at a=x=1) দিয়ে expansion audit।', 'term index ও exponent-এর পার্থক্য এক ধাপ; r=1 প্রথম পদ।'),
      P(/কনিক|পরাবৃত্ত|উপবৃত্ত|অধিবৃত্ত|বৃত্ত|ফোকাস|অসীমতট/i,
        'conic section-এর locus focus/directrix বা quadratic relation দিয়ে নির্ধারিত; eccentricity ও axis structure conic-এর ধরন চিহ্নিত করে।',
        'standard form-এ completing square, focus/directrix location, axis direction এবং sign convention নির্ণয় করতে হবে।',
        'ellipse ও hyperbola উভয়ের eccentricity সবসময় 1-এর কম।',
        'ellipse-এর eccentricity 0≤e<1 এবং hyperbola-র e>1; parabola-র e=1।',
        'equation standard form-এ আনা, centre/vertex/focus ও asymptote (যেখানে প্রযোজ্য) শনাক্ত।',
        'reflector design, satellite orbit approximation, architecture ও trajectory geometry।',
        'একটি equation-এর sign ও denominator pattern conic type নির্ধারণ করে; axes swap হলে orientation বদলায়।',
        'focus, directrix, major/minor axis, asymptote ও eccentricity-র schematic।',
        'ellipse: x²/a²+y²/b²=1; hyperbola: x²/a²−y²/b²=1; parabola: y²=4ax (standard orientation)।', 'focal distance relation ও asymptote slope যাচাই।', 'ellipse closed curve; hyperbola two branches and asymptotes; parabola has one focus/directrix pair।'),
      P(/স্থিতিবিদ্যা|বলজোট|লামি|সমবিন্দুগামী|লব্ধি বল|সাম্যাবস্থা|টর্ক/i,
        'স্থিতিবিদ্যায় সাম্যাবস্থার জন্য লব্ধি বল ও লব্ধি moment/torque শূন্য হতে হয়।',
        'সমতলীয় equilibrium problem-এ ΣFx=0, ΣFy=0 এবং Στ=0; moment নেওয়ার point স্পষ্ট করতে হবে।',
        'কোনো বস্তুর ওপর মোট বল শূন্য হলেই ঘূর্ণন-সাম্য নিশ্চিত।',
        'force equilibrium থাকলেও non-zero net torque হলে angular acceleration হতে পারে।',
        'free-body diagram, axes decomposition, moment arm এবং তিনটি equilibrium equation প্রয়োগ।',
        'beam, bridge, ladder, crane এবং support reaction analysis।',
        'Lami theorem কেবল তিনটি coplanar concurrent force equilibrium-এ প্রযোজ্য।',
        'support reactions, applied forces, perpendicular lever arms ও torque direction।',
        'ΣFx=0; ΣFy=0; Στ=0; Lami relation in its stated conditions।', 'একই point about moment এবং force balance পুনরায় মিলিয়ে দেখা।', 'translation equilibrium ও rotational equilibrium আলাদা শর্ত।'),
      P(/চলমান কণা|কণার গতি|আপেক্ষিক বেগ|উল্লম্ব গতি|প্রক্ষেপিত বস্তুকণা|ত্বরণ/i,
        'কণার অবস্থান সময়ের ফাংশন; velocity/acceleration derivative এবং constant-acceleration equation নির্দিষ্ট শর্তে ব্যবহৃত হয়।',
        'reference frame, positive direction, initial condition ও acceleration constant কি না যাচাই করতে হবে।',
        'উল্লম্বভাবে ঊর্ধ্বে নিক্ষেপে অভিকর্ষজ ত্বরণও ঊর্ধ্বমুখী।',
        'উর্ধ্বমুখী positive নিলে gravitational acceleration ঋণাত্মক; বস্তু উপরে উঠুক বা নিচে নামুক g নিচের দিকেই থাকে।',
        'position/time data থেকে u,a,t শনাক্ত করে sign convention-সহ kinematic equation প্রয়োগ।',
        'elevator, projectile, vehicle motion ও relative-motion problem।',
        'constant acceleration formula পরিবর্তনশীল acceleration-এ সরাসরি প্রযোজ্য নয়; frame বদলালে velocity বদলাতে পারে।',
        'position–time/velocity–time graph, upward positive axis এবং acceleration arrow।',
        'v=u+at; s=ut+½at²; v²=u²+2as।', 'sign, unit এবং initial/final state যাচাই।', 'speed scalar magnitude; velocity signed/directional vector।'),
      P(/যোগাশ্রয়ী|রৈখিক প্রোগ্রাম|উদ্দেশ্য ফাংশন|feasible region|constraint/i,
        'linear programming-এ objective function ও linear constraints-এর intersection feasible region তৈরি করে; optimum সাধারণত corner point-এ পরীক্ষা করা হয়।',
        'inequality direction, non-negativity constraint, feasible region এবং objective function একই coordinate plane-এ সঠিকভাবে বসাতে হবে।',
        'objective function-এর coefficient-ই feasible region নির্ধারণ করে।',
        'feasible region constraints থেকে নির্ধারিত হয়; objective function region-এর মধ্যে সর্বোচ্চ/সর্বনিম্ন মান খোঁজে।',
        'variable define, constraints formulate, feasible region graph এবং corner points-এ objective evaluate।',
        'production planning, resource allocation, transport ও cost/profit optimisation।',
        'unbounded/infeasible region থাকতে পারে; corner-point conclusion feasible and bounded problem-এর প্রেক্ষিতে যাচাই করতে হবে।',
        'half-plane constraints, feasible polygon, vertex labels এবং objective level lines।',
        'Z=ax+by; প্রতিটি linear constraint একটি half-plane দেয়।', 'প্রতিটি vertex সব constraints পূরণ করে কি না যাচাই।', 'feasible region constraints দ্বারা গঠিত; objective function লক্ষ্য মান নির্ধারণ করে।'),
      P(/বিস্তার পরিমাপ|প্রমিত ব্যবধান|ভেদাঙ্ক|সম্ভাবনা|ঘটনা|উপাত্ত|গড়|গড়|গণসংখ্যা/i,
        'পরিসংখ্যানের dispersion data spread নির্দেশ করে; probability sample space ও event-এর সংজ্ঞার ওপর নির্ভরশীল।',
        'standard deviation/variance-এ data type, population/sample formula এবং probability-তে mutually exclusive/independent condition আলাদা করতে হবে।',
        'দুটি ঘটনার probability গুণ করা যায়, তারা সম্পর্কিত কি না তা না দেখেই।',
        'P(A∩B)=P(A)P(B) কেবল independent events-এ; dependent case-এ conditional probability লাগে।',
        'sample space লিখে event relation, data centre/spread এবং যথাযথ formula নির্বাচন।',
        'quality control, survey, risk, medical test এবং experimental uncertainty।',
        'mean একই হলেও spread আলাদা হতে পারে; sample SD-তে n−1 correction প্রাসঙ্গিক হতে পারে।',
        'frequency distribution, box plot, standard deviation spread depiction এবং probability tree।',
        'P(A∪B)=P(A)+P(B)−P(A∩B); independent হলে P(A∩B)=P(A)P(B)।', 'probability 0–1 সীমায় এবং total probability/sample space check।', 'mutually exclusive event একসঙ্গে ঘটে না; independent event-এর occurrence একে অন্যকে প্রভাবিত করে না।')
    ]
  };
  var DEFAULT = {
    physics: P(/.*/, 'ভৌত মডেল ও পরিমাপের ফলকে রাশির অর্থ, দিক, একক এবং প্রযোজ্য শর্তের সঙ্গে মিলিয়ে ব্যাখ্যা করতে হয়।', 'ব্যবহৃত রাশি, reference frame, sign convention এবং মডেলের অনুমান আগে স্পষ্ট করতে হবে।', 'সূত্র মুখস্থ থাকলেই প্রযোজ্য শর্ত না দেখে যেকোনো পরিস্থিতিতে বসানো যায়।', 'নিয়ন্ত্রিত পরীক্ষায় একবারে একটি চলক বদলে পরিমাপ পুনরাবৃত্তি করলে দাবির পক্ষে নির্ভরযোগ্য প্রমাণ পাওয়া যায়।', 'প্রদত্ত তথ্য ও একক শনাক্ত, উপযুক্ত model নির্বাচন, হিসাব/যুক্তি প্রয়োগ এবং limiting case দিয়ে যাচাই।', 'বাস্তব ব্যবস্থার পরিমাপ, নকশা ও আচরণ পূর্বাভাসে ধারণাটি ব্যবহৃত হয়।', 'বাস্তব ব্যবস্থায় friction, measurement uncertainty বা idealisation-এর সীমা থাকতে পারে।', 'রাশি, দিক, একক ও পরিবর্তনশীলতার একটি labelled schematic।', 'প্রযোজ্য সূত্র topic-specific; আগে assumptions যাচাই করতে হবে।', 'মাত্রা, একক, sign এবং limiting case যাচাই।'),
    chemistry: P(/.*/, 'রাসায়নিক প্রজাতির গঠন, পরিমাণ, অবস্থা ও বিক্রিয়ার শর্ত মিলিয়ে রাসায়নিক আচরণ ব্যাখ্যা করতে হয়।', 'species, phase, concentration, temperature/pressure এবং balanced equation যাচাই করতে হবে।', 'নাম বা molecular formula জানলেই সব রাসায়নিক আচরণ একইভাবে নির্ধারিত হয়।', 'control sample ও confirmatory observation-সহ পুনরাবৃত্ত পরীক্ষা ব্যাখ্যাকে শক্তিশালী করে।', 'প্রজাতি/সমীকরণ শনাক্ত, mole/charge balance এবং reaction condition প্রয়োগ।', 'নমুনা বিশ্লেষণ, শিল্পপ্রক্রিয়া, পরিবেশ পর্যবেক্ষণ ও দৈনন্দিন chemistry-তে ধারণাটি লাগে।', 'কেবল একটি observation দিয়ে identity বা process safety নিশ্চিত হয় না।', 'species–condition–observation–inference flow diagram।', 'সমীকরণ ও stoichiometry topic-specific; balanced equation ছাড়া হিসাব নয়।', 'atom/charge balance, unit ও control observation যাচাই।'),
    math: P(/.*/, 'গাণিতিক ফল সংজ্ঞা, domain, অনুমান ও যুক্তির ধারাবাহিক প্রয়োগের ওপর নির্ভর করে।', 'চলক/parameter, domain, sign convention এবং theorem-এর hypothesis আগে পরীক্ষা করতে হবে।', 'একটি পরিচিত সূত্রের নাম মিললেই তার সব hypothesis না দেখেও প্রয়োগ করা যায়।', 'প্রাপ্ত ফলকে original condition-এ বসিয়ে এবং বিকল্প/সীমান্ত অবস্থায় পরীক্ষা করলে বৈধতা বোঝা যায়।', 'সংজ্ঞা লেখা, hypothesis যাচাই, উপযুক্ত theorem/algorithm প্রয়োগ এবং ফল substitute করে পরীক্ষা।', 'জ্যামিতি, modelling, optimisation, data analysis ও পরিমাণগত সিদ্ধান্তে ধারণাটি কাজে লাগে।', 'domain বা boundary condition বদলালে একই expression-এর ফল/বৈধতা বদলাতে পারে।', 'চলক, domain, relation এবং solution set-এর schematic।', 'formula topic-specific; প্রতিটি step-এ domain/assumption বজায় রাখতে হবে।', 'substitution, dimension/degree, endpoint এবং domain যাচাই।')
  };
  function findProfile(subject, topic, chapterTitle) {
    /* Match the exact syllabus subtopic, never the chapter title. A chapter title
       such as 'ভৌত জগৎ ও পরিমাপ' must not force its measurement profile onto every
       other topic in that chapter. */
    var text = String(topic || ''), list = PROFILES[subject] || [];
    for (var i = 0; i < list.length; i++) if (list[i].re.test(text)) return list[i];
    return DEFAULT[subject] || DEFAULT.physics;
  }
  function normal(s) { return String(s || '').toLowerCase().replace(/[০-৯]/g, function (c) { return '০১২৩৪৫৬৭৮৯'.indexOf(c); }).replace(/[^\p{L}\p{N}]+/gu, ' ').trim(); }
  var tokCache = new Map();
  function tokenSet(s) { var k = String(s || ''), c = tokCache.get(k); if (c) return c; c = tokenSetRaw(k); if (tokCache.size > 40000) tokCache.clear(); tokCache.set(k, c); return c; }
  function tokenSetRaw(s) { return Array.from(new Set(normal(s).split(/\s+/).filter(function (x) { return x.length > 1; }))); }
  function similarity(a, b) { var A = tokenSet(a), B = tokenSet(b); if (Math.min(A.length, B.length) < 8) return 0; var set = Object.create(null), n = 0; A.forEach(function (x) { set[x] = 1; }); B.forEach(function (x) { if (set[x]) n++; }); return n / (A.length + B.length - n); }
  function topicIndex(q, topics) {
    var i = Number(q && q.topicIndex);
    if (q && q.topicIndex !== undefined && q.topicIndex !== null && q.topicIndex !== '' && Number.isInteger(i) && i >= 0 && i < topics.length) return i;
    /* Count only exact supplied-TXT tags. Keyword guesses can silently mis-map a
       question to a neighbouring subtopic, so they are not used for coverage. */
    var names = [q && q.syllabusTopic, q && q.subtopic, q && q.topic];
    for (var k = 0; k < names.length; k++) {
      var n = normal(names[k]); if (!n) continue;
      for (var j = 0; j < topics.length; j++) if (normal(topics[j]) === n) return j;
    }
    return -1;
  }
  function answerFor(profile, key) {
    /* Map each editorial angle to its intended correct proposition. */
    if (key === 'correction') return profile.condition || profile.principle;
    if (key === 'audit') return profile.verification || profile.principle;
    if (key === 'transfer') return profile.application || profile.principle;
    return profile[key] || profile.principle;
  }
  function makeOptions(profile, key, serial, subject) {
    var correct = answerFor(profile, key), pool = [profile.error, profile.condition, profile.method, profile.evidence, profile.limitation, profile.comparison, profile.verification, profile.application, profile.representation, profile.principle];
    var used = Object.create(null), wrong = [];
    used[correct] = 1;
    for (var i = 0; i < pool.length && wrong.length < 3; i++) {
      var candidate = pool[(i + serial) % pool.length];
      if (candidate && !used[candidate]) { used[candidate] = 1; wrong.push(candidate); }
    }
    while (wrong.length < 3) wrong.push(subject === 'math' ? 'শর্ত, domain ও সংজ্ঞা না মিলিয়ে শুধু রূপ দেখে সিদ্ধান্ত নেওয়া।' : subject === 'chemistry' ? 'নমুনা, শর্ত ও পর্যবেক্ষণ যাচাই না করে শুধু নাম দেখে সিদ্ধান্ত নেওয়া।' : 'দিক, একক ও প্রযোজ্য শর্ত যাচাই না করে শুধু মান দেখে সিদ্ধান্ত নেওয়া।');
    var options = [correct, wrong[0], wrong[1], wrong[2]], at = (serial * 7 + 3) % 4, tmp = options[0]; options[0] = options[at]; options[at] = tmp;
    return { options: options, answer: at, correct: correct };
  }
  function buildOne(chapter, meta, topicIndexValue, topicSerial, serial) {
    var subject = chapter.subjectKey || meta.subject || 'physics';
    if (subject === 'higher-math' || subject === 'higher-mathematics' || subject === 'mathematics') subject = 'math';
    var topic = meta.topics[topicIndexValue], title = chapter.title || meta.title || chapter.id;
    var p = findProfile(subject, topic, title), family = FAMILIES[topicSerial % FAMILIES.length];
    var variants = STEM_VARIANTS[family.key] || [], template = variants.length ? variants[Math.floor(topicSerial / FAMILIES.length) % variants.length] : '';
    var stem = template ? template.replace(/\{topic\}/g, topic).replace(/\{error\}/g, p.error) : family.ask(topic, p);
    var selected = makeOptions(p, family.key, serial + topicIndexValue * 11, subject), core = p.principle;
    var explanation = {
      core: core,
      analysis: 'প্রশ্নের লক্ষ্য হলো “' + topic + '”–এর ' + family.key + ' দিকটি যাচাই করা। সঠিক বিকল্পটি প্রযোজ্য সংজ্ঞা ও শর্তের সঙ্গে মেলে: ' + selected.correct + '। বাকি বিকল্পগুলোতে পরিচিত ভুল ধারণা, শর্তের অমিল অথবা অপ্রাসঙ্গিক ব্যাখ্যা রয়েছে; তাই সেগুলো গ্রহণযোগ্য নয়।',
      formula: p.formula,
      simple: 'প্রথমে “' + topic + '”–এর সংজ্ঞা ও শর্ত শনাক্ত করো; তারপর নির্বাচিত যুক্তিটি সেগুলোর সঙ্গে মিলিয়ে দেখো।',
      misconception: 'সাধারণ ভুল ধারণা: ' + p.error + ' সঠিকভাবে বিচার করতে হবে: ' + p.condition,
      realWorld: p.application,
      steps: ['প্রশ্নে নির্দিষ্ট উপবিষয় শনাক্ত করো: ' + topic + '।', 'প্রাসঙ্গিক সংজ্ঞা, অনুমান ও প্রযোজ্য শর্ত লিখে নাও।', 'বিকল্পের বক্তব্যকে ধারণা/শর্ত/প্রমাণের সঙ্গে মিলিয়ে যাচাই করো।', 'একক, sign, domain বা conservation/stoichiometry যেখানে প্রযোজ্য, তা পুনরায় পরীক্ষা করো।'],
      optionAnalysis: selected.options.map(function (o, i) { return { option: i, correct: i === selected.answer, explanation: i === selected.answer ? 'এটি প্রশ্নে চাওয়া নীতি ও শর্তের সঙ্গে সামঞ্জস্যপূর্ণ।' : 'এটি সংশ্লিষ্ট ধারণার একটি সাধারণ ভুল প্রয়োগ বা প্রয়োজনীয় শর্ত উপেক্ষা করে।' }; }),
      references: [], referenceStatus: 'question-specific-source-mapping-pending; do-not-publish-as-verified-reference', media: []
    };
    var id = 'cl-v94-draft-' + chapter.id + '-' + String(serial + 1).padStart(4, '0');
    return {
      id: id, questionId: id, chapterId: chapter.id, topicIndex: topicIndexValue, topic: topic, syllabusTopic: topic, subtopic: topic,
      q: stem, o: selected.options, a: selected.answer, tier: family.tier, questionType: family.type,
      learningObjective: topic + ' — ' + family.key + ' বিশ্লেষণ', contentOrigin: 'syllabus-mapped-editorial-blueprint-draft-v94',
      authoredHscConcept: false, syllabusGenerated: false, qualityStatus: 'draft-pending-human-authoring-and-academic-review',
      qualityApproved: false, editorialReviewed: false, verified: false, media: [], explanation: explanation,
      expansionMetadata: { release: 'v94', sourceTopicIndex: topicIndexValue, questionAngle: family.key, draftOnly: true, generatedFromEditorialBlueprint: true }
    };
  }
  function targetFor(chapterId, current) {
    var meta = syllabus[chapterId] || {}, count = Array.isArray(meta.topics) ? meta.topics.length : 0, large = count >= LARGE_THRESHOLD;
    var minimum = large ? LARGE_TARGET : STANDARD_TARGET;
    return { minimum: minimum, target: Math.max(minimum, Math.max(0, Number(current) || 0)), large: large, topics: count };
  }
  var COMBINATORICS_REVIEW_DRAFTS = [
    { topic:0, q:'একটি পাঠাগারে বিজ্ঞান বিভাগের ৪টি এবং গণিত বিভাগের ৩টি আলাদা বই থেকে একটি বই বেছে নেওয়া যাবে। মোট কতভাবে একটি বই বেছে নেওয়া সম্ভব?', o:['৭','১২','২৪','১'], a:0, tier:1, type:'mathematical', formula:'4+3=7', core:'বিকল্প দুটি পরস্পর বিচ্ছিন্ন হলে যোজন বিধিতে উপায়সংখ্যা যোগ হয়।', steps:['প্রথম বিকল্পে ৪টি বই বেছে নেওয়ার উপায়।','দ্বিতীয় বিকল্পে ৩টি বই বেছে নেওয়ার উপায়।','একটি বই নিতে হবে বলে মোট উপায় ৪+৩=৭।'] },
    { topic:0, q:'একটি পোশাকের দোকানে ৪ ধরনের শার্ট ও ৩ ধরনের প্যান্ট আছে। প্রতিটি পোশাকে একটি শার্ট ও একটি প্যান্ট থাকলে কয়টি ভিন্ন পোশাক তৈরি করা যায়?', o:['১২','৭','২৪','৬৪'], a:0, tier:2, type:'scenario', formula:'4×3=12', core:'পরপর দুটি স্বাধীন নির্বাচন হলে গুণন বিধিতে উপায়সংখ্যা গুণ হয়।', steps:['শার্ট বাছাইয়ের ৪টি সম্ভাবনা।','প্রতিটি শার্টের সঙ্গে প্যান্ট বাছাইয়ের ৩টি সম্ভাবনা।','সুতরাং মোট পোশাক ৪×৩=১২টি।'] },
    { topic:1, q:'৫টি ভিন্ন বইয়ের মধ্যে ৩টি বই একটি তাকের পাশাপাশি সাজাতে হবে। ক্রম গুরুত্বপূর্ণ এবং কোনো বই পুনরাবৃত্তি হবে না। কতটি বিন্যাস সম্ভব?', o:['৬০','১০','১৫','১২৫'], a:0, tier:2, type:'mathematical', formula:'{}^{5}P_{3}=5×4×3=60', core:'ক্রম গুরুত্বপূর্ণ এবং পুনরাবৃত্তি নিষিদ্ধ হলে permutation প্রয়োগ করতে হয়।', steps:['প্রথম স্থানে ৫টি বইয়ের যেকোনো একটি।','দ্বিতীয় স্থানে ৪টি এবং তৃতীয় স্থানে ৩টি বই বাকি থাকে।','মোট বিন্যাস ৫×৪×৩=৬০।'] },
    { topic:2, q:'A, B, C, D চারটি ভিন্ন অক্ষর প্রতিটি একবার ব্যবহার করে ৪-অক্ষরের কতটি ভিন্ন বিন্যাস গঠন করা যায়?', o:['২৪','১৬','১২','৮'], a:0, tier:2, type:'mathematical', formula:'4!=4×3×2×1=24', core:'nটি ভিন্ন বস্তুর সবগুলোকে সরলরেখায় সাজানোর সংখ্যা n!।', steps:['প্রথম স্থানের জন্য ৪টি পছন্দ।','পরের স্থানে যথাক্রমে ৩, ২ ও ১টি পছন্দ।','গুণ করলে ৪!=২৪টি বিন্যাস পাওয়া যায়।'] },
    { topic:2, q:'১, ২, ৩, ৪, ৫ অঙ্ক ব্যবহার করে পুনরাবৃত্তি ছাড়া ৩ অঙ্কের কতটি সংখ্যা গঠন করা যায়?', o:['৬০','১৫','১২৫','২০'], a:0, tier:3, type:'multiStep', formula:'{}^{5}P_{3}=5×4×3=60', core:'প্রথম অঙ্কের জন্য ৫টি, দ্বিতীয়টির জন্য ৪টি এবং তৃতীয়টির জন্য ৩টি পছন্দ থাকে।', steps:['প্রথম স্থানে শূন্য নেই; পাঁচটি অঙ্কের যেকোনো একটি নেওয়া যায়।','পুনরাবৃত্তি না থাকায় পরের স্থানে ৪টি, শেষ স্থানে ৩টি পছন্দ।','মোট সংখ্যা ৫×৪×৩=৬০।'] },
    { topic:3, q:'৮ জন শিক্ষার্থীর মধ্য থেকে ৩ জনের একটি দল গঠন করতে হবে। সদস্যদের ক্রম গুরুত্বপূর্ণ নয়। কতটি দল সম্ভব?', o:['৫৬','৩৩৬','২৪','১৬'], a:0, tier:2, type:'mathematical', formula:'{}^{8}C_{3}=8!/(3!5!)=56', core:'দল গঠনে সদস্যদের ক্রম গুরুত্বপূর্ণ নয়, তাই combination ব্যবহার করতে হয়।', steps:['এখানে n=৮ এবং r=৩।','সূত্রে বসালে ৮×৭×৬/(৩×২×১)।','মান ৫৬টি স্বতন্ত্র দল।'] },
    { topic:4, q:'৬টি ভিন্ন ফলের মধ্য থেকে ২টি ফল বেছে নেওয়ার ক্ষেত্রে একই জোড়ার ক্রম আলাদা ধরা হবে না। নির্বাচন কয়ভাবে সম্ভব?', o:['১৫','৩০','১২','৩৬'], a:0, tier:2, type:'mathematical', formula:'{}^{6}C_{2}=6×5/(2×1)=15', core:'নির্বাচনে ক্রম অপ্রাসঙ্গিক হলে বিন্যাস নয়, সমাবেশ গণনা করতে হয়।', steps:['প্রথমে ৬টি থেকে ২টি ক্রমসহ নিলে ৬×৫=৩০।','একই জোড়ার ২! ক্রম এক নির্বাচন হিসেবে গণ্য।','অতএব ৩০/২=১৫।'] },
    { topic:4, q:'৯ জনের একটি কমিটি থেকে সভাপতি, সম্পাদক ও কোষাধ্যক্ষ—তিনটি আলাদা পদে তিনজন নির্বাচন করা হবে। কতভাবে পদগুলো পূরণ করা যায়?', o:['৫০৪','৮৪','৭২','২৭'], a:0, tier:3, type:'multiStep', formula:'{}^{9}P_{3}=9×8×7=504', core:'পদগুলো আলাদা হওয়ায় একই তিনজনের ভিন্ন পদবণ্টন ভিন্ন ফল; তাই permutation।', steps:['সভাপতি পদের জন্য ৯ জন।','সম্পাদকের জন্য ৮ জন এবং কোষাধ্যক্ষের জন্য ৭ জন অবশিষ্ট।','মোট ৯×৮×৭=৫০৪ উপায়।'] },
    { topic:5, q:'৫টি ভিন্ন বইয়ের যেকোনো শূন্য নয় এমন একটি সংগ্রহ তৈরি করা হবে। প্রতিটি বই নেওয়া বা না নেওয়া—দুটি সম্ভাবনা আছে। মোট কতটি সংগ্রহ সম্ভব?', o:['৩১','২৫','৩২','১০'], a:0, tier:3, type:'analytical', formula:'2^5−1=31', core:'প্রতিটি বস্তু স্বাধীনভাবে অন্তর্ভুক্ত বা বাদ দেওয়া যায়; শূন্য সংগ্রহ বাদ দিতে সম্পূরক গণনা করা হয়।', steps:['পাঁচটি বইয়ের প্রতিটির জন্য ২টি সিদ্ধান্ত।','সব সিদ্ধান্তের মোট সমন্বয় ২⁵=৩২।','কোনো বই না নেওয়ার একটি অবস্থা বাদ দিলে ৩১টি সংগ্রহ।'] },
    { topic:5, q:'৭ জনের মধ্য থেকে ৩ জনের কমিটি গঠনে রফিককে অবশ্যই রাখতে হবে। বাকি ৬ জন থেকে আরও ২ জন বেছে নিতে হবে। কয়টি কমিটি সম্ভব?', o:['১৫','২১','৩৫','৬৪'], a:0, tier:3, type:'mathematical', formula:'{}^{6}C_{2}=15', core:'একজন নির্দিষ্ট সদস্য বাধ্যতামূলক হলে তাকে স্থির রেখে অবশিষ্ট স্থান পূরণে combination প্রয়োগ করা যায়।', steps:['রফিককে আগে থেকেই কমিটিতে রাখা হলো।','আরও ২ জন নিতে হবে অবশিষ্ট ৬ জন থেকে।','সুতরাং মোট কমিটি ⁶C₂=১৫।'] },
    { topic:1, q:'১, ২, ৩, ৪, ৫ অঙ্ক দিয়ে পুনরাবৃত্তি ছাড়া ৫ অঙ্কের কতটি জোড় সংখ্যা তৈরি করা যায়?', o:['৪৮','৬০','২৪','১২'], a:0, tier:4, type:'multiStep', formula:'2×4!=48', core:'জোড় সংখ্যার এককের অঙ্ক আগে নির্ধারণ করলে অবশিষ্ট অঙ্কগুলো সাজানোর স্বাধীনতা গণনা করা যায়।', steps:['এককের অঙ্ক জোড় হতে হবে: ২ বা ৪—২টি পছন্দ।','প্রতিটি ক্ষেত্রে বাকি ৪টি অঙ্ক ৪! উপায়ে সাজানো যায়।','মোট ২×২৪=৪৮টি জোড় সংখ্যা।'] },
    { topic:3, q:'একটি ক্লাসে ৫ জন ছেলে ও ৪ জন মেয়ে আছে। ৩ সদস্যের কমিটিতে অন্তত ১ জন মেয়ে থাকতে হবে। কতটি কমিটি সম্ভব?', o:['৭৪','৮৪','৬৪','৪০'], a:0, tier:4, type:'analytical', formula:'{}^{9}C_{3}−{}^{5}C_{3}=84−10=74', core:'অন্তত একটি মেয়ে থাকার সংখ্যা মোট কমিটি থেকে কোনো মেয়ে ছাড়া সব-ছেলে কমিটি বাদ দিয়ে পাওয়া যায়।', steps:['৯ জন থেকে মোট ৩ সদস্যের কমিটি ⁹C₃=৮৪।','৫ জন ছেলে থেকে কমিটি ⁵C₃=১০।','অন্তত একজন মেয়ে থাকা কমিটি ৮৪−১০=৭৪।'] }
  ];
  function makeSpecialDraft(chapter, spec, serial) {
    var meta=syllabus[chapter.id]||{},topic=(meta.topics||[])[spec.topic]||'';
    var id='cl-v94-special-'+chapter.id+'-'+String(serial+1).padStart(3,'0');
    var selected=spec.a;
    return {id:id,questionId:id,chapterId:chapter.id,topicIndex:spec.topic,topic:topic,subtopic:topic,syllabusTopic:topic,q:spec.q,o:spec.o.slice(),a:selected,tier:spec.tier,questionType:spec.type,
      learningObjective:topic+' — নির্দিষ্ট সংখ্যাগত প্রয়োগ',contentOrigin:'syllabus-mapped-specific-mathematical-draft-v94',authoredHscConcept:false,syllabusGenerated:false,
      qualityStatus:'draft-pending-human-authoring-and-academic-review',qualityApproved:false,editorialReviewed:false,verified:false,media:[],
      explanation:{core:spec.core,analysis:spec.core+' প্রদত্ত তথ্য থেকে ধাপে ধাপে গণনা করলে সঠিক ফল পাওয়া যায়।',formula:spec.formula,simple:spec.core,steps:spec.steps.slice(),misconception:'বিন্যাসে ক্রম গুরুত্বপূর্ণ; সমাবেশে ক্রম গুরুত্বপূর্ণ নয়। সমস্যা অনুযায়ী কোনটি প্রযোজ্য তা আগে স্থির করতে হবে.',realWorld:'দল গঠন, আসনবিন্যাস, নম্বর/কোড গঠন ও সম্ভাব্য ফল গণনায় এই নীতি ব্যবহৃত হয়.',references:[],referenceStatus:'question-specific-source-mapping-pending',media:[]},
      expansionMetadata:{release:'v94',sourceTopicIndex:spec.topic,questionAngle:'worked-numerical-application',draftOnly:true,generatedFromEditorialBlueprint:true,specificQuestionSet:'combinatorics-application'} };
  }
  function expandChapter(chapter, rows, metaArg) {
    var chapterId = chapter && chapter.id, meta = syllabus[chapterId] || metaArg || {}, topics = Array.isArray(meta.topics) ? meta.topics : [];
    if (!chapterId || !topics.length) return [];
    var base = Array.isArray(rows) ? rows : [], policy = targetFor(chapterId, base.length);
    var need = Math.max(0, policy.target - base.length);
    var counts = topics.map(function () { return 0; }), known = Object.create(null), tokenRows = [];
    base.forEach(function (q) {
      if (!q || !q.q) return;
      var key = normal(q.q); known[key] = 1; tokenRows.push(key);
      var ti = topicIndex(q, topics); if (ti >= 0) counts[ti]++;
    });
    var out = [], attempts = 0, serial = 0, topicSerial = 0;
    var missingTopicIndexes = counts.map(function(n,i){return n===0?i:-1;}).filter(function(i){return i>=0;});
    /* Even over-target legacy banks must receive an exact syllabus-mapped item for every
       supplied topic. Topic coverage is separate from the question-count target. */
    need = Math.max(need, missingTopicIndexes.length);
    function accept(q) {
      var key = normal(q.q), duplicate = !!known[key];
      if (!duplicate) for (var j = 0; j < tokenRows.length; j++) if (similarity(key, tokenRows[j]) >= 0.97) { duplicate = true; break; }
      if (duplicate) return false;
      known[key] = 1; tokenRows.push(key); out.push(q); counts[Number(q.topicIndex)||0]++; serial++; return true;
    }
    if (chapterId === 'math1-05') {
      COMBINATORICS_REVIEW_DRAFTS.forEach(function(spec) { if (out.length < need) accept(makeSpecialDraft(chapter,spec,serial)); });
    }
    while (out.length < need && attempts < need * 60) {
      /* Cover every missing syllabus topic before adding further questions. */
      var ti;
      if(missingTopicIndexes.length){ti=missingTopicIndexes.shift();}
      else {
        /* Spread any remaining additions over the least represented topics first. */
        var min = Math.min.apply(null, counts), candidates = [];
        for (var i = 0; i < counts.length; i++) if (counts[i] === min) candidates.push(i);
        ti = candidates[(topicSerial * 5 + Math.floor(topicSerial / Math.max(1, topics.length))) % candidates.length];
      }
      var q = buildOne(chapter, meta, ti, topicSerial, serial);
      accept(q);
      topicSerial++; attempts++;
    }
    return out;
  }
  w.CL_HSC_CHAPTER_EXPANSION_V94 = {
    version: 94, standardTarget: STANDARD_TARGET, largeTarget: LARGE_TARGET, largeTopicThreshold: LARGE_THRESHOLD,
    targetFor: targetFor, expandChapter: expandChapter,
    questionPolicy: 'Only static text/image/diagram question items; no embedded simulations, video or animation.',
    provenance: 'Syllabus-mapped editorial-blueprint drafts; pending individual human authoring and subject-specialist academic review.'
  };
})(window);
