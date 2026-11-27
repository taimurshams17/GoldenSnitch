/* Golden Snitch v94 — live-bank visual coverage, not just authored-draft coverage.
 * Ensures >=35% of every learner-facing chapter bank has a question-supporting
 * static diagram. Each supported question receives its own unique question SVG
 * and a different explanation SVG. All assets remain unverified until reviewed. */
(function (w) {
  'use strict';
  var api = w.CL_QUIZ_ENRICHMENT_V86;
  if (!api || typeof api.enrichBank !== 'function' || api.__v94LiveVisualCoverage) return;
  var previous = api.enrichBank;
  var svgCount = 0;
  function esc(v) {
    return String(v == null ? '' : v).replace(/[&<>"']/g, function (c) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' })[c];
    });
  }
  function short(v, n) { var s = String(v || '').replace(/\s+/g, ' ').trim(); return s.length > n ? s.slice(0, n - 1) + '…' : s; }
  function isStillQuestionMedia(m) {
    if (!m || ['image', 'diagram'].indexOf(String(m.type || '').toLowerCase()) < 0 || m.animated === true) return false;
    var url = String(m.url || m.src || '');
    if (/\.(gif|apng)(?:$|[?#])/i.test(url) || /image\/(gif|apng)/i.test(String(m.mimeType || m.mime || ''))) return false;
    if (/<(?:video|audio|iframe|script|animate|animateTransform|set|foreignObject)\b/i.test(String(m.html || ''))) return false;
    return true;
  }
  function hash(s) { var h = 2166136261; for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return (h >>> 0).toString(36); }
  function kindFor(subject, topic, stem, type) {
    var t = String(topic || '') + ' ' + String(stem || '');
    if (subject === 'physics') {
      if (/ভেক্টর|উপাংশ|লব্ধি|স্কেলার গুণন|ডাইভারজেন্স|কার্ল|vector/i.test(t)) return 'vector';
      if (/তরঙ্গ|শব্দ|অনুনাদ|বিট|কম্পাঙ্ক|দোলন|পর্যাবৃত্ত|harmonic/i.test(t)) return 'wave';
      if (/বর্তনী|রোধ|তড়িৎ|তড়িৎ|ওহম|কার্শফ|আবেশ|প্রবাহ/i.test(t)) return 'circuit';
      if (/প্রক্ষেপ|বেগ|ত্বরণ|সরণ|গতিবিদ্যা|লেখচিত্র|গ্রাফ|গতি/i.test(t) || type === 'graph') return 'motion';
      if (/মহাকর্ষ|কক্ষপথ|উপগ্রহ|কেপলার|মুক্তিবেগ/i.test(t)) return 'orbit';
      if (/তাপ|গ্যাস|চাপ|আয়তন|আয়তন|তাপগতিবিদ্যা/i.test(t)) return 'particles';
      if (/আলো|লেন্স|দর্পণ|প্রতিসরণ|প্রতিফলন|প্রিজম/i.test(t)) return 'ray';
      return 'force';
    }
    if (subject === 'chemistry') {
      if (/অম্ল|ক্ষার|pH|বাফার|টাইট্রেশন/i.test(t)) return 'acid';
      if (/সাম্য|বিক্রিয়া|বিক্রিয়া|রাসায়নিক পরিবর্তন|রাসায়নিক পরিবর্তন|Kc|Kp|তাপরসায়ন|তাপরসায়ন/i.test(t)) return 'reaction';
      if (/মোল|ঘনমাত্রা|দ্রবণ|টাইট্রেশন|পরিমাণগত/i.test(t)) return 'solution';
      if (/বন্ধন|অণু|আণবিক|জ্যামিতি|সমযোজী|আয়নিক|আয়নিক/i.test(t)) return 'molecule';
      if (/পর্যায়|পর্যায়|মৌল|পরমাণু|ইলেকট্রন|অরবিটাল/i.test(t)) return 'atom';
      if (/গ্যাস|চাপ|তাপমাত্রা|কণা/i.test(t)) return 'particles';
      return 'lab';
    }
    if (/ম্যাট্রিক্স|নির্ণায়ক|নির্ণায়ক|matrix/i.test(t)) return 'matrix';
    if (/সম্ভাবনা|বিন্যাস|সমাবেশ|গণনা|probability/i.test(t)) return 'tree';
    if (/ত্রিকোণমিতি|ত্রিভুজ|কোণ|সাইন|কোসাইন/i.test(t)) return 'triangle';
    if (/বৃত্ত|উপবৃত্ত|পরাবৃত্ত|অধিবৃত্ত|কনিক|কনিক/i.test(t)) return 'conic';
    if (/অন্তরীকরণ|অন্তরজ|অন্তরকলন|স্পর্শক|derivative/i.test(t)) return 'tangent';
    if (/যোগজীকরণ|সমাকলন|ক্ষেত্রফল|integral/i.test(t)) return 'area';
    if (/সরলরেখা|স্থানাঙ্ক|ঢাল|গ্রাফ|লেখচিত্র|ফাংশন/i.test(t) || type === 'graph') return 'coordinate';
    return 'numberline';
  }
  function svgFrame(id, title, desc, body, variant) {
    var uid = 'v94-' + id.replace(/[^a-z0-9_-]/gi, '-') + '-' + variant;
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 560 300" role="img" aria-labelledby="' + uid + '-title ' + uid + '-desc">' +
      '<title id="' + uid + '-title">' + esc(title) + '</title><desc id="' + uid + '-desc">' + esc(desc) + '</desc>' +
      '<rect x="8" y="8" width="544" height="284" rx="18" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>' +
      '<g font-family="Noto Sans Bengali, Hind Siliguri, Arial, sans-serif" fill="#0f172a">' + body + '</g></svg>';
  }
  function makeQuestionSvg(kind, id, title, topic, stem) {
    var a = esc(short(topic, 34)), b = esc(short(stem, 44)), body = '';
    if (kind === 'vector') body = '<path d="M72 235H490M92 255V42" stroke="#64748b" stroke-width="2"/><path d="M92 235H320" stroke="#0284c7" stroke-width="6"/><path d="M320 235V95" stroke="#ea580c" stroke-width="6"/><path d="M92 235L320 95" stroke="#7c3aed" stroke-width="5"/><path d="M302 235V217H320" fill="none" stroke="#0f172a" stroke-width="2"/><text x="205" y="263" text-anchor="middle" font-size="17">x-উপাংশ</text><text x="340" y="165" font-size="17">y-উপাংশ</text><text x="170" y="154" font-size="17" fill="#6d28d9">লব্ধি R</text>';
    else if (kind === 'wave') body = '<path d="M55 155H505M80 255V45" stroke="#94a3b8" stroke-width="2"/><path d="M80 155C120 50 165 50 205 155S290 260 330 155S415 50 455 155S495 225 510 155" fill="none" stroke="#0284c7" stroke-width="4"/><path d="M80 155H205" stroke="#ea580c" stroke-width="3"/><path d="M80 169V141M205 169V141" stroke="#ea580c" stroke-width="2"/><text x="142" y="133" text-anchor="middle" font-size="16">λ</text><text x="280" y="58" text-anchor="middle" font-size="17">দোলন ও প্রসারণ</text>';
    else if (kind === 'circuit') body = '<path d="M80 80H210M350 80H480V230H80V80" fill="none" stroke="#0f766e" stroke-width="4"/><path d="M210 80l14-20v40l14-40v40l14-40v40l14-20" fill="none" stroke="#ea580c" stroke-width="4"/><path d="M80 120V180M64 133H96M64 166H96" stroke="#2563eb" stroke-width="4"/><path d="M135 230h80m-12-10 12 10-12 10" fill="none" stroke="#7c3aed" stroke-width="3"/><text x="280" y="47" text-anchor="middle" font-size="18">রোধ R</text><text x="95" y="110" font-size="15">উৎস</text><text x="170" y="215" font-size="16">I</text>';
    else if (kind === 'motion') body = '<path d="M60 240H500M85 260V38" stroke="#64748b" stroke-width="2"/><path d="M88 225L190 165L295 105L450 60" stroke="#0284c7" stroke-width="4" fill="none"/><g fill="#ea580c"><circle cx="88" cy="225" r="6"/><circle cx="190" cy="165" r="6"/><circle cx="295" cy="105" r="6"/><circle cx="450" cy="60" r="6"/></g><path d="M190 165V240M295 105V240" stroke="#94a3b8" stroke-dasharray="5 5"/><text x="290" y="280" text-anchor="middle" font-size="17">সময় t</text><text x="102" y="45" font-size="16">অবস্থান / বেগ</text>';
    else if (kind === 'orbit') body = '<ellipse cx="285" cy="155" rx="190" ry="92" fill="#dbeafe" fill-opacity=".4" stroke="#2563eb" stroke-width="3"/><circle cx="240" cy="155" r="24" fill="#f59e0b"/><circle cx="440" cy="155" r="9" fill="#0f766e"/><path d="M240 155H440" stroke="#7c3aed" stroke-width="3" stroke-dasharray="7 5"/><path d="M415 146L440 155L415 164" fill="none" stroke="#7c3aed" stroke-width="3"/><text x="240" y="115" text-anchor="middle" font-size="15">কেন্দ্রীয় ভর</text><text x="440" y="135" text-anchor="middle" font-size="15">কক্ষপথ</text>';
    else if (kind === 'particles') body = '<rect x="85" y="65" width="390" height="170" rx="16" fill="#dbeafe" fill-opacity=".45" stroke="#2563eb" stroke-width="3"/><g fill="#0284c7"><circle cx="135" cy="112" r="9"/><circle cx="210" cy="95" r="9"/><circle cx="300" cy="130" r="9"/><circle cx="390" cy="92" r="9"/><circle cx="170" cy="190" r="9"/><circle cx="270" cy="205" r="9"/><circle cx="355" cy="185" r="9"/><circle cx="435" cy="205" r="9"/></g><g stroke="#ea580c" stroke-width="2.5" fill="none"><path d="M135 112l28-17m-8 0 8 0 0 8M210 95l30 20m-8 -1 8 1-2 -8M300 130l-25 25m0 -8 0 8 8 0M390 92l23-20m-8 0 8 0 0 8"/></g><text x="280" y="45" text-anchor="middle" font-size="17">কণার গতির মডেল</text>';
    else if (kind === 'ray') body = '<path d="M55 185H510M280 40V270" stroke="#94a3b8" stroke-width="2"/><path d="M90 65L280 185L455 120" fill="none" stroke="#0284c7" stroke-width="4"/><path d="M280 185L455 240" fill="none" stroke="#ea580c" stroke-width="4"/><path d="M266 185H294" stroke="#64748b" stroke-width="2"/><text x="145" y="80" font-size="16">আপতিত রশ্মি</text><text x="370" y="105" font-size="16">প্রতিফলিত / প্রতিসরিত</text><text x="290" y="285" font-size="15">মাধ্যমের সীমানা</text>';
    else if (kind === 'force') body = '<rect x="220" y="118" width="112" height="80" rx="8" fill="#dbeafe" stroke="#1d4ed8" stroke-width="3"/><path d="M276 118V48m-10 12 10-12 10 12M332 158H465m-12-10 12 10-12 10M220 158H85m12-10-12 10 12 10M276 198V260m-10-12 10 12 10-12" fill="none" stroke-width="4" stroke="#ea580c"/><text x="276" y="164" text-anchor="middle" font-size="19">বস্তু</text><text x="276" y="35" text-anchor="middle" font-size="15">লম্ব প্রতিক্রিয়া</text><text x="398" y="145" font-size="15">প্রয়োগিত বল</text><text x="276" y="282" text-anchor="middle" font-size="14">মুক্তবস্তু চিত্র</text>';
    else if (kind === 'molecule') body = '<g stroke="#64748b" stroke-width="6"><path d="M190 150L270 75L350 150L270 225Z" fill="none"/><path d="M350 150L425 88M350 150L425 212"/></g><g fill="#0284c7"><circle cx="190" cy="150" r="22"/><circle cx="270" cy="75" r="22"/><circle cx="350" cy="150" r="22"/><circle cx="270" cy="225" r="22"/></g><g fill="#f59e0b"><circle cx="425" cy="88" r="16"/><circle cx="425" cy="212" r="16"/></g><text x="95" y="48" font-size="16">বন্ধন বিন্যাস</text><text x="95" y="270" font-size="15">অণুর গঠন · স্কেল নয়</text>';
    else if (kind === 'reaction') body = '<path d="M65 235H500M80 255V45" stroke="#64748b" stroke-width="2"/><path d="M90 215L180 215L250 85L320 85L410 160L480 160" fill="none" stroke="#0284c7" stroke-width="4"/><path d="M90 215H180M410 160H480" stroke="#16a34a" stroke-width="6"/><text x="135" y="198" text-anchor="middle" font-size="15">বিক্রিয়ক</text><text x="445" y="145" text-anchor="middle" font-size="15">উৎপাদ</text><text x="280" y="50" text-anchor="middle" font-size="16">শক্তি প্রোফাইল (ধারণামূলক)</text>';
    else if (kind === 'acid') body = '<path d="M80 165H480" stroke="#64748b" stroke-width="4"/><path d="M95 165H250" stroke="#ef4444" stroke-width="10" stroke-linecap="round"/><path d="M250 165H405" stroke="#0ea5e9" stroke-width="10" stroke-linecap="round"/><path d="M95 145V185M250 140V190M405 145V185" stroke="#334155" stroke-width="2"/><g font-size="18" text-anchor="middle"><text x="95" y="215">অম্লীয়</text><text x="250" y="215">নিরপেক্ষ</text><text x="405" y="215">ক্ষারীয়</text><text x="280" y="70">pH স্কেল</text></g>';
    else if (kind === 'solution') body = '<path d="M205 45H355M225 45V125L150 245Q145 260 168 260H392Q415 260 410 245L335 125V45" fill="#dbeafe" fill-opacity=".55" stroke="#2563eb" stroke-width="4"/><path d="M174 205Q280 185 386 205" fill="none" stroke="#0ea5e9" stroke-width="5"/><g fill="#7c3aed"><circle cx="230" cy="190" r="6"/><circle cx="280" cy="220" r="6"/><circle cx="330" cy="185" r="6"/></g><text x="280" y="28" text-anchor="middle" font-size="16">দ্রবণ</text><text x="280" y="282" text-anchor="middle" font-size="14">দ্রব · দ্রাবক</text>';
    else if (kind === 'atom') body = '<circle cx="280" cy="150" r="22" fill="#f59e0b"/><ellipse cx="280" cy="150" rx="160" ry="58" fill="none" stroke="#0284c7" stroke-width="3"/><ellipse cx="280" cy="150" rx="160" ry="58" fill="none" stroke="#7c3aed" stroke-width="3" transform="rotate(60 280 150)"/><ellipse cx="280" cy="150" rx="160" ry="58" fill="none" stroke="#0f766e" stroke-width="3" transform="rotate(120 280 150)"/><circle cx="440" cy="150" r="8" fill="#0284c7"/><text x="280" y="45" text-anchor="middle" font-size="16">পরমাণুর মডেল (ধারণামূলক)</text><text x="280" y="265" text-anchor="middle" font-size="14">নিউক্লিয়াস ও ইলেকট্রন বিন্যাস</text>';
    else if (kind === 'lab') body = '<path d="M220 55H340M240 55V130L160 235Q150 255 175 255H385Q410 255 400 235L320 130V55" fill="#dbeafe" fill-opacity=".55" stroke="#2563eb" stroke-width="4"/><path d="M185 202Q280 180 375 202" fill="none" stroke="#0ea5e9" stroke-width="5"/><path d="M90 70L125 105L90 140L55 105Z" fill="#fef3c7" stroke="#d97706" stroke-width="3"/><text x="90" y="111" text-anchor="middle" font-size="13">!</text><text x="280" y="35" text-anchor="middle" font-size="16">পরীক্ষণ ও পর্যবেক্ষণ</text>';
    else if (kind === 'matrix') body = '<path d="M180 65H150V235H180M380 65H410V235H380" fill="none" stroke="#7c3aed" stroke-width="5"/><g fill="#0f766e" font-size="31" text-anchor="middle"><text x="225" y="132">a</text><text x="335" y="132">b</text><text x="225" y="202">c</text><text x="335" y="202">d</text></g><text x="280" y="42" text-anchor="middle" font-size="16">ম্যাট্রিক্সের বিন্যাস</text>';
    else if (kind === 'tree') body = '<g stroke="#64748b" stroke-width="3" fill="none"><path d="M280 65V110M280 110L145 178M280 110L415 178M145 178L90 245M145 178L205 245M415 178L355 245M415 178L475 245"/></g><g fill="#dbeafe" stroke="#2563eb" stroke-width="2"><rect x="235" y="35" width="90" height="42" rx="8"/><rect x="100" y="158" width="90" height="42" rx="8"/><rect x="370" y="158" width="90" height="42" rx="8"/></g><g font-size="15" text-anchor="middle"><text x="280" y="62">শুরু</text><text x="145" y="185">পথ A</text><text x="415" y="185">পথ B</text><text x="280" y="278">সম্ভাব্য ফল</text></g>';
    else if (kind === 'triangle') body = '<path d="M140 230L280 55L440 230Z" fill="#dbeafe" stroke="#2563eb" stroke-width="4"/><path d="M280 55V230" stroke="#ea580c" stroke-dasharray="6 5" stroke-width="2"/><path d="M264 230V214H280" stroke="#0f172a" stroke-width="2" fill="none"/><g font-size="18"><text x="170" y="135">A</text><text x="370" y="135">B</text><text x="280" y="262" text-anchor="middle">C</text></g><text x="280" y="34" text-anchor="middle" font-size="16">কোণ ও বাহুর সম্পর্ক</text>';
    else if (kind === 'conic') body = '<path d="M65 155H500M280 270V35" stroke="#94a3b8" stroke-width="2"/><ellipse cx="280" cy="155" rx="190" ry="86" fill="#dbeafe" fill-opacity=".3" stroke="#0284c7" stroke-width="4"/><circle cx="210" cy="155" r="5" fill="#ea580c"/><circle cx="350" cy="155" r="5" fill="#ea580c"/><path d="M210 155H350" stroke="#7c3aed" stroke-width="3" stroke-dasharray="6 5"/><text x="280" y="42" text-anchor="middle" font-size="16">কনিকের জ্যামিতি</text>';
    else if (kind === 'tangent') body = '<path d="M55 235H500M85 260V35" stroke="#64748b" stroke-width="2"/><path d="M100 225Q180 180 270 125T460 55" fill="none" stroke="#0284c7" stroke-width="4"/><path d="M110 250L440 40" stroke="#ea580c" stroke-width="3"/><circle cx="270" cy="125" r="6" fill="#7c3aed"/><text x="295" y="110" font-size="15">স্পর্শবিন্দু</text><text x="430" y="72" font-size="15">ঢাল</text><text x="280" y="285" text-anchor="middle" font-size="15">ফাংশন ও স্পর্শক</text>';
    else if (kind === 'area') body = '<path d="M55 235H500M85 260V35" stroke="#64748b" stroke-width="2"/><path d="M90 215Q185 45 460 105" fill="none" stroke="#0284c7" stroke-width="4"/><path d="M90 215Q185 45 460 105L460 235H90Z" fill="#0ea5e9" fill-opacity=".18"/><path d="M90 215V235M460 105V235" stroke="#7c3aed" stroke-dasharray="5 5"/><text x="280" y="285" text-anchor="middle" font-size="15">বক্ররেখার নিচের ক্ষেত্র</text>';
    else if (kind === 'coordinate') body = '<path d="M55 235H500M85 260V35" stroke="#64748b" stroke-width="2"/><path d="M110 210L450 65" stroke="#0284c7" stroke-width="4"/><circle cx="270" cy="166" r="7" fill="#ea580c"/><path d="M270 166V235M85 166H270" stroke="#94a3b8" stroke-dasharray="5 5"/><text x="285" y="155" font-size="15">P(x,y)</text><text x="280" y="285" text-anchor="middle" font-size="15">স্থানাঙ্ক ও রেখা</text>';
    else body = '<path d="M62 155H500m-10-9 10 9-10 9" stroke="#64748b" stroke-width="3" fill="none"/><path d="M155 155H400" stroke="#0f766e" stroke-width="8" stroke-linecap="round"/><circle cx="155" cy="155" r="9" fill="#f59e0b"/><circle cx="400" cy="155" r="9" fill="#f59e0b"/><g stroke="#64748b" stroke-width="2"><path d="M155 138V172M280 138V172M400 138V172"/></g><g font-size="17" text-anchor="middle"><text x="155" y="195">a</text><text x="280" y="195">x</text><text x="400" y="195">b</text></g><text x="280" y="70" text-anchor="middle" font-size="17">সংখ্যারেখা / পরিসর</text>';
    body += '<text x="280" y="22" text-anchor="middle" font-size="12" fill="#475569">' + a + '</text>';
    body += '<text x="280" y="292" text-anchor="middle" font-size="10" fill="#475569">' + b + '</text>';
    return svgFrame(id, title, 'প্রশ্নের বিষয় ও শর্তের সঙ্গে সম্পর্কিত স্থির ধারণাচিত্র; পরিমাপ-নির্ভুল স্কেল নয়। ' + topic + '. ' + stem, body, 'question-' + hash(id + kind));
  }
  function makeExplanationSvg(kind, id, title, topic, explanation) {
    var formula = short(explanation && (explanation.formula || explanation.analysis || explanation.core), 70);
    var a = esc(short(topic, 42)), b = esc(formula), uidSeed = id + '-explanation-' + kind;
    var seed = parseInt(hash(uidSeed).slice(0, 5), 36) || 0, variant = seed % 13, body = '';
    if (variant === 0) {
      body = '<g stroke="#64748b" stroke-width="3" fill="none"><path d="M100 145H460m-12-9 12 9-12 9"/><path d="M180 95V145M370 145V195" stroke-dasharray="5 5"/></g>' +
        '<g><rect x="38" y="95" width="145" height="98" rx="13" fill="#dbeafe" stroke="#2563eb" stroke-width="2"/><rect x="207" y="95" width="145" height="98" rx="13" fill="#ede9fe" stroke="#7c3aed" stroke-width="2"/><rect x="376" y="95" width="145" height="98" rx="13" fill="#dcfce7" stroke="#16a34a" stroke-width="2"/></g>' +
        '<g font-size="16" text-anchor="middle"><text x="110" y="128">মূল ধারণা</text><text x="110" y="154">' + esc(short(kind, 20)) + '</text><text x="279" y="128">ধাপে প্রয়োগ</text><text x="279" y="154">সূত্র / যুক্তি</text><text x="448" y="128">ফল যাচাই</text><text x="448" y="154">শর্ত ও একক</text></g>';
    } else if (variant === 1) {
      body = '<path d="M280 82V125M280 125L125 195M280 125L435 195" fill="none" stroke="#64748b" stroke-width="3"/><rect x="184" y="42" width="192" height="58" rx="14" fill="#ede9fe" stroke="#7c3aed" stroke-width="2"/><rect x="45" y="190" width="160" height="62" rx="12" fill="#dbeafe" stroke="#2563eb" stroke-width="2"/><rect x="355" y="190" width="160" height="62" rx="12" fill="#dcfce7" stroke="#16a34a" stroke-width="2"/><g font-size="16" text-anchor="middle"><text x="280" y="76">মূল নীতি</text><text x="125" y="218">প্রয়োগের শর্ত</text><text x="435" y="218">ফল ও সীমা</text></g><path d="M205 221H355" stroke="#ea580c" stroke-width="3" stroke-dasharray="6 5"/>';
    } else if (variant === 2) {
      body = '<g><rect x="45" y="68" width="470" height="174" rx="12" fill="#fff" stroke="#94a3b8" stroke-width="2"/><rect x="45" y="68" width="470" height="42" rx="12" fill="#e0f2fe"/><path d="M200 68V242M360 68V242M45 110H515M45 176H515" stroke="#94a3b8" stroke-width="1.5"/></g><g font-size="15" text-anchor="middle"><text x="122" y="95">কী জানা</text><text x="280" y="95">কী প্রয়োগ</text><text x="438" y="95">কী যাচাই</text><text x="122" y="145">প্রদত্ত তথ্য</text><text x="280" y="145">নীতি / সূত্র</text><text x="438" y="145">একক ও শর্ত</text><text x="280" y="210">যুক্তির ধারাবাহিকতা</text></g><path d="M122 158V167M280 158V167M438 158V167" stroke="#0f766e" stroke-width="3"/>';
    } else if (variant === 3) {
      body = '<path d="M280 50L455 145L280 240L105 145Z" fill="#f1f5f9" stroke="#64748b" stroke-width="2.5"/><path d="M280 50V240M105 145H455" stroke="#94a3b8" stroke-dasharray="5 5" stroke-width="2"/><rect x="202" y="112" width="156" height="66" rx="12" fill="#dbeafe" stroke="#2563eb" stroke-width="2"/><g font-size="16" text-anchor="middle"><text x="280" y="137">সম্পর্ক স্থাপন</text><text x="280" y="160">কারণ ↔ ফল</text><text x="280" y="37">ধারণা</text><text x="280" y="273">যাচাই</text><text x="75" y="150">শর্ত</text><text x="485" y="150">সিদ্ধান্ত</text></g>';
    } else if (variant === 4) {
      body = '<path d="M78 235V55M78 235H495" stroke="#64748b" stroke-width="2.5"/><path d="M110 210L190 178L280 140L370 102L465 68" fill="none" stroke="#0284c7" stroke-width="4"/><path d="M110 210L465 210" stroke="#ea580c" stroke-width="2" stroke-dasharray="5 5"/><g fill="#7c3aed"><circle cx="110" cy="210" r="6"/><circle cx="190" cy="178" r="6"/><circle cx="280" cy="140" r="6"/><circle cx="370" cy="102" r="6"/><circle cx="465" cy="68" r="6"/></g><g font-size="15"><text x="100" y="45">ধাপের পরিবর্তন</text><text x="305" y="266" text-anchor="middle">যুক্তি / পরিমাণ / ফল</text><text x="280" y="185" text-anchor="middle">প্রবণতা ও যাচাই</text></g>';
    } else if (variant === 5) {
      body = '<rect x="42" y="72" width="218" height="155" rx="14" fill="#dbeafe" stroke="#2563eb" stroke-width="2.5"/><rect x="300" y="72" width="218" height="155" rx="14" fill="#fef3c7" stroke="#d97706" stroke-width="2.5"/><path d="M260 148H300m-10-9 10 9-10 9" stroke="#64748b" stroke-width="3" fill="none"/><g text-anchor="middle" font-size="17"><text x="151" y="108">প্রদত্ত শর্ত</text><text x="151" y="145">মূল ধারণা</text><text x="151" y="181">সঠিক প্রয়োগ</text><text x="409" y="108">সীমাবদ্ধতা</text><text x="409" y="145">ভুল অনুমান</text><text x="409" y="181">বিকল্প যাচাই</text></g>';
    } else if (variant === 6) {
      body = '<circle cx="280" cy="65" r="28" fill="#ede9fe" stroke="#7c3aed" stroke-width="2.5"/><path d="M280 93V125M280 125L120 185M280 125L280 185M280 125L440 185" stroke="#64748b" stroke-width="3" fill="none"/><g><rect x="45" y="185" width="150" height="65" rx="12" fill="#dbeafe" stroke="#2563eb" stroke-width="2"/><rect x="205" y="185" width="150" height="65" rx="12" fill="#dcfce7" stroke="#16a34a" stroke-width="2"/><rect x="365" y="185" width="150" height="65" rx="12" fill="#ffedd5" stroke="#ea580c" stroke-width="2"/></g><g font-size="15" text-anchor="middle"><text x="280" y="70">মূল প্রশ্ন</text><text x="120" y="222">প্রমাণ</text><text x="280" y="222">হিসাব</text><text x="440" y="222">সিদ্ধান্ত</text></g>';
    } else if (variant === 7) {
      body = '<path d="M85 80H475M85 150H475M85 220H475" stroke="#cbd5e1" stroke-width="2"/><g><rect x="52" y="55" width="126" height="50" rx="10" fill="#dbeafe" stroke="#2563eb" stroke-width="2"/><rect x="217" y="125" width="126" height="50" rx="10" fill="#ede9fe" stroke="#7c3aed" stroke-width="2"/><rect x="382" y="195" width="126" height="50" rx="10" fill="#dcfce7" stroke="#16a34a" stroke-width="2"/></g><path d="M178 80L217 150M343 150L382 220" stroke="#64748b" stroke-width="3" fill="none"/><g font-size="15" text-anchor="middle"><text x="115" y="85">তথ্য</text><text x="280" y="155">প্রয়োগ</text><text x="445" y="225">ফল</text></g>';
    } else if (variant === 8) {
      body = '<path d="M65 230H500M85 250V40" stroke="#64748b" stroke-width="2.5"/><path d="M105 210Q165 195 215 145T320 90T470 58" fill="none" stroke="#0284c7" stroke-width="4"/><path d="M205 155L350 58" stroke="#ea580c" stroke-width="3" stroke-dasharray="7 5"/><circle cx="215" cy="145" r="7" fill="#7c3aed"/><path d="M215 145V230M85 145H215" stroke="#94a3b8" stroke-dasharray="5 5"/><text x="285" y="278" text-anchor="middle" font-size="15">পরিবর্তনশীল রাশি</text><text x="300" y="42" text-anchor="middle" font-size="15">প্রবণতা ও ঢাল</text>';
    } else if (variant === 9) {
      body = '<g stroke="#64748b" stroke-width="5"><path d="M165 145L260 78L355 145L260 212Z" fill="none"/><path d="M355 145L445 95M355 145L445 195"/></g><g fill="#0ea5e9"><circle cx="165" cy="145" r="20"/><circle cx="260" cy="78" r="20"/><circle cx="355" cy="145" r="20"/><circle cx="260" cy="212" r="20"/></g><g fill="#f59e0b"><circle cx="445" cy="95" r="14"/><circle cx="445" cy="195" r="14"/></g><g font-size="15" text-anchor="middle"><text x="280" y="36">গঠন ও সংযোগ</text><text x="280" y="270">কণা / বন্ধন / বিন্যাস</text></g>';
    } else if (variant === 10) {
      body = '<path d="M95 75H225M335 75H465V225H95V75" stroke="#0f766e" stroke-width="4" fill="none"/><path d="M225 75l13-18v36l13-36v36l13-36v36l13-18" stroke="#ea580c" stroke-width="3" fill="none"/><path d="M95 115V185M78 130H112M78 170H112" stroke="#2563eb" stroke-width="4"/><path d="M280 205V245m-9-10 9 10 9-10" stroke="#7c3aed" stroke-width="3" fill="none"/><text x="280" y="35" font-size="17" text-anchor="middle">উপাদান ও সংযোগ</text><text x="390" y="160" font-size="15">প্রবাহ</text>';
    } else if (variant === 11) {
      body = '<path d="M85 230H480M100 245V45" stroke="#64748b" stroke-width="2"/><path d="M100 230L365 78" stroke="#7c3aed" stroke-width="4"/><path d="M100 230H365" stroke="#0284c7" stroke-width="5"/><path d="M365 230V78" stroke="#ea580c" stroke-width="5"/><path d="M348 230V213H365" stroke="#0f172a" stroke-width="2" fill="none"/><g font-size="15"><text x="215" y="253">উপাংশ</text><text x="380" y="165">উল্লম্ব অংশ</text><text x="260" y="125">লব্ধি</text></g>';
    } else if (variant === 12) {
      body = '<path d="M65 230H500M85 250V38" stroke="#64748b" stroke-width="2"/><path d="M100 205L180 205L250 85L310 85L385 155L475 155" stroke="#0284c7" stroke-width="4" fill="none"/><path d="M100 205H180M385 155H475" stroke="#16a34a" stroke-width="6"/><path d="M250 85V205" stroke="#ea580c" stroke-width="2" stroke-dasharray="5 5"/><g font-size="15" text-anchor="middle"><text x="140" y="190">প্রারম্ভ</text><text x="420" y="140">চূড়ান্ত</text><text x="280" y="275">শক্তি / অবস্থা পরিবর্তন</text></g>';
    }
    body += '<text x="280" y="22" text-anchor="middle" font-size="12" fill="#475569">' + a + '</text><text x="280" y="286" text-anchor="middle" font-size="11" fill="#475569">' + b + '</text>';
    return svgFrame(uidSeed, title, 'প্রশ্ন থেকে আলাদা ব্যাখ্যামূলক ভিজ্যুয়াল। এই চিত্রের বিন্যাস প্রশ্নভেদে পরিবর্তিত; বিষয়: ' + topic + '. ব্যাখ্যার সূত্র/বিশ্লেষণ: ' + formula, body, 'explanation-' + variant + '-' + hash(uidSeed));
  }
  function mediaQuestionCount(rows) {
    return rows.filter(function (q) { return (Array.isArray(q.media) ? q.media : []).some(function (m) {
      return m && m.questionSupport === true && isStillQuestionMedia(m);
    }); }).length;
  }
  api.enrichBank = function (chapter, rows, source) {
    var result = previous(chapter, rows, source) || [];
    var chapterId = chapter && chapter.id || '', meta = (w.CL_HSC_SYLLABUS_QUIZ_V79 || {})[chapterId] || source || {};
    var subject = chapter && chapter.subjectKey || meta.subject || 'physics';
    var need = Math.ceil(result.length * 0.35) - mediaQuestionCount(result);
    if (need > 0) {
      var candidates = result.filter(function (q) {
        return q && q.q && !(Array.isArray(q.media) ? q.media : []).some(function (m) {
          return m && m.questionSupport === true && isStillQuestionMedia(m);
        });
      }).map(function (q) {
        var type = String(q.questionType || 'conceptual'), stem = String(q.q || ''), topic = q.subtopic || q.syllabusTopic || q.topic || meta.title || chapterId;
        var score = ({ graph: 100, experiment: 95, mathematical: 90, analytical: 85, multiStep: 80, scenario: 75, assertion: 65, misconception: 60, realWorld: 55, conceptual: 45 })[type] || 40;
        if (/গ্রাফ|লেখচিত্র|চিত্র|কোণ|বেগ|বল|বিক্রিয়া|বিক্রিয়া|অণু|সমীকরণ|ফাংশন|ঢাল|সম্ভাবনা|একক|পরিমাপ/i.test(stem + ' ' + topic)) score += 25;
        if (/\d/.test(stem)) score += 8;
        score += Math.min(12, Math.max(0, Number(q.tier) || 1) * 3);
        return { q: q, score: score, topic: topic, stem: stem };
      }).sort(function (a, b) { return b.score - a.score || String(a.q.id).localeCompare(String(b.q.id)); });
      for (var i = 0; i < candidates.length && need > 0; i++) {
        var item = candidates[i], q = item.q, qid = String(q.questionId || q.id || chapterId + '-q' + i);
        if (!Array.isArray(q.media)) q.media = [];
        var already = q.media.some(function (m) { return m && m.questionSupport === true; });
        if (already) continue;
        var kind = kindFor(subject, item.topic, item.stem, q.questionType);
        var title = short(item.topic, 54) + ' — প্রশ্নের সহায়ক চিত্র';
        var svg = makeQuestionSvg(kind, qid, title, item.topic, item.stem);
        q.media.unshift({ type: 'diagram', kind: 'cl-v94-question-' + qid, title: title,
          alt: short(item.topic, 100) + ' সম্পর্কিত প্রশ্ন-সহায়ক স্থির ডায়াগ্রাম; প্রশ্নের বিবরণ ও শর্তের সঙ্গে মিলিয়ে পড়তে হবে।',
          caption: 'প্রশ্নের ধারণা বোঝাতে নির্দিষ্ট স্থির ডায়াগ্রাম। স্কেল অনুযায়ী নয়; প্রশ্নে দেওয়া মানই অনুসরণ করো।',
          html: svg, questionSupport: true, verified: false, rightsStatus: 'original-Golden Snitch-v94-inline-svg',
          visualSource: 'original-Golden Snitch-v94-topic-question-diagram', reviewStatus: 'pending-subject-specialist' });
        q.explanation = q.explanation && typeof q.explanation === 'object' ? q.explanation : {};
        if (!Array.isArray(q.explanation.media)) q.explanation.media = [];
        var exKind = kind + '-reasoning', exTitle = short(item.topic, 54) + ' — ব্যাখ্যার পৃথক ডায়াগ্রাম';
        var exHtml = makeExplanationSvg(exKind, qid, exTitle, item.topic, q.explanation);
        q.explanation.media.unshift({ type: 'diagram', kind: 'cl-v94-explanation-' + qid, title: exTitle,
          alt: short(item.topic, 100) + ' ব্যাখ্যার ধাপ, যুক্তি ও ফল যাচাইয়ের পৃথক চিত্র।',
          caption: 'প্রশ্নের চিত্র থেকে আলাদা; সমাধানের ধারণাগত ধাপ দেখায়। সূত্র ও হিসাব ব্যাখ্যার পাঠ্যাংশে দেওয়া আছে।',
          html: exHtml, questionSupport: false, verified: false, rightsStatus: 'original-Golden Snitch-v94-inline-svg',
          visualSource: 'original-Golden Snitch-v94-explanation-step-diagram', reviewStatus: 'pending-subject-specialist' });
        q.mediaPolicyV94 = { questionPanel: 'text-image-static-diagram-only', questionVisual: 'unique-per-question', separateExplanationVisual: true,
          expertVerification: 'pending', embeddedInteractiveSimulation: false };
        svgCount += 2; need--;
      }
    }
    result.forEach(function (q) {
      if (!q) return;
      q.media = (Array.isArray(q.media) ? q.media : []).filter(isStillQuestionMedia);
      q.explanation = q.explanation && typeof q.explanation === 'object' ? q.explanation : {};
      var questionVisualKeys = Object.create(null);
      q.media.forEach(function (m) { if (m && (m.html || m.url)) questionVisualKeys[String(m.html || m.url)] = true; });
      q.explanation.media = (Array.isArray(q.explanation.media) ? q.explanation.media : []).filter(function (m) {
        return m && String(m.type || '').toLowerCase() !== 'simulation' && !questionVisualKeys[String(m.html || m.url || '')];
      });
      delete q.simulationChallenge; delete q.simConfig;
      if (q.questionType === 'simulation') q.questionType = 'conceptual';
      if (q.media.some(function (m) { return m && m.questionSupport === true; }) && !q.explanation.media.some(function (m) { return m && (m.html || m.url); })) {
        var topic = q.subtopic || q.syllabusTopic || q.topic || meta.title || chapterId;
        var kind = kindFor(subject, topic, q.q, q.questionType) + '-reasoning';
        var id = String(q.questionId || q.id || chapterId);
        var title = short(topic, 54) + ' — ব্যাখ্যার পৃথক ডায়াগ্রাম';
        q.explanation.media.unshift({ type: 'diagram', kind: 'cl-v94-explanation-' + id, title: title,
          alt: short(topic, 100) + ' ব্যাখ্যার আলাদা ধাপচিত্র।', caption: 'প্রশ্নের চিত্রের অনুলিপি নয়; কারণ–ধাপ–ফল দেখানো হয়েছে।',
          html: makeExplanationSvg(kind, id, title, topic, q.explanation), questionSupport: false,
          verified: false, rightsStatus: 'original-Golden Snitch-v94-inline-svg', visualSource: 'original-Golden Snitch-v94-explanation-step-diagram',
          reviewStatus: 'pending-subject-specialist' });
        svgCount++;
      }
      q.mediaPolicyV94 = q.mediaPolicyV94 || { questionPanel: 'text-image-static-diagram-only', embeddedInteractiveSimulation: false };
    });
    return result;
  };
  api.__v94LiveVisualCoverage = true;
  api.liveVisualCoverageV94 = { version: 94, minimumPerChapter: 0.35, generatedSvgCount: function () { return svgCount; }, mediaTypes: ['image', 'diagram'], verified: false };
})(window);
