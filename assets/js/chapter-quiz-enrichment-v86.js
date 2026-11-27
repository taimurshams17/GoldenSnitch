/* Golden Snitch HSC quiz schema + visual learning layer, v86.
   Adds structured metadata without replacing legacy question fields. Inline SVGs are
   lightweight, explanatory and generated only for matching syllabus concepts. */
(function (w) {
  'use strict';

  var SUBJECT_NAMES = { physics: 'পদার্থবিজ্ঞান', chemistry: 'রসায়ন', math: 'উচ্চতর গণিত' };
  var DIFFICULTY = { 1: 'easy', 2: 'medium', 3: 'deep-conceptual', 4: 'hard-advanced' };
  var TYPE_LABELS = {
    trueFalse: 'সত্য / মিথ্যা যাচাই',
    conceptual: 'ধারণাভিত্তিক', scenario: 'পরিস্থিতিভিত্তিক', analytical: 'বিশ্লেষণধর্মী',
    mathematical: 'গাণিতিক', experiment: 'পরীক্ষণভিত্তিক', assertion: 'অভিকথন–কারণ',
    graph: 'গ্রাফ/চিত্র/উপাত্ত', misconception: 'ভুল ধারণা শনাক্তকরণ',
    realWorld: 'বাস্তব প্রয়োগ', multiStep: 'বহুধাপের সমস্যা'
  };

  function norm(s) {
    return String(s || '').toLowerCase().replace(/[\u200c\u200d]/g, '').replace(/[\s\u09e6-\u09ef]+/g, ' ').replace(/[.,;:!?(){}\[\]"'’“”–—\-_/\\]/g, ' ').trim();
  }
  function hash(s) {
    var h = 2166136261, t = String(s || '');
    for (var i = 0; i < t.length; i++) { h ^= t.charCodeAt(i); h = Math.imul(h, 16777619); }
    return (h >>> 0).toString(36);
  }
  function esc(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function svgFrame(title, body, desc) {
    return '<svg viewBox="0 0 640 220" role="img" aria-label="' + esc(desc || title) + '" xmlns="http://www.w3.org/2000/svg">' +
      '<defs><marker id="clq-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0 0L6 3L0 6" fill="context-stroke"/></marker><linearGradient id="clq-line" x1="0" x2="1"><stop stop-color="#38bdf8"/><stop offset="1" stop-color="#818cf8"/></linearGradient></defs>' +
      '<rect x="1" y="1" width="638" height="218" rx="16" fill="currentColor" opacity=".035"/>' +
      '<g fill="none" stroke="currentColor" stroke-opacity=".16" stroke-width="1"><path d="M24 55H616M24 110H616M24 165H616" stroke-dasharray="3 8"/></g>' +
      '<text x="28" y="28" fill="currentColor" font-size="15" font-weight="700">' + esc(title) + '</text>' + body + '</svg>';
  }

  function vectorDiagram(kind) {
    var common = '<g stroke-linecap="round" stroke-linejoin="round" fill="none" stroke-width="4">';
    if (kind === 'components') return svgFrame('ভেক্টরের উপাংশ', common +
      '<path d="M110 174H545M160 195V48" stroke="currentColor" stroke-opacity=".35" stroke-width="2"/><path d="M160 174L440 68" stroke="#38bdf8" marker-end="url(#clq-arrow)"/><path d="M160 174H440" stroke="#22c55e" marker-end="url(#clq-arrow)"/><path d="M440 174V68" stroke="#f59e0b" marker-end="url(#clq-arrow)" stroke-dasharray="6 6"/><path d="M440 68L440 174" stroke="#f59e0b" stroke-opacity=".8" stroke-dasharray="5 6"/><path d="M160 174L440 174L440 68" stroke="currentColor" stroke-opacity=".45" stroke-width="2" stroke-dasharray="4 5"/>' +
      '</g><g fill="currentColor" font-size="15"><text x="465" y="73">A</text><text x="454" y="194">Aₓ</text><text x="455" y="120">Aᵧ</text><text x="550" y="194">x</text><text x="145" y="49">y</text><text x="143" y="198">O</text></g>', 'একটি ভেক্টরকে x ও y অক্ষ বরাবর উপাংশে বিশ্লেষণ');
    if (kind === 'dot') return svgFrame('ডট গুণফল ও মধ্যবর্তী কোণ', common +
      '<path d="M150 174H550M150 174L430 174" stroke="currentColor" stroke-opacity=".28" stroke-width="2"/><path d="M150 174L470 70" stroke="#38bdf8" marker-end="url(#clq-arrow)"/><path d="M150 174L455 174" stroke="#22c55e" marker-end="url(#clq-arrow)"/><path d="M235 174A85 85 0 0 0 230 146" stroke="#f59e0b" stroke-width="3"/>' +
      '</g><g fill="currentColor" font-size="16"><text x="480" y="70">A</text><text x="465" y="198">B</text><text x="245" y="154">θ</text><text x="150" y="198">O</text><text x="28" y="205" font-size="13" opacity=".7">A · B = |A||B| cos θ</text></g>', 'দুটি ভেক্টরের মধ্যবর্তী কোণ এবং ডট গুণফলের জ্যামিতিক অর্থ');
    if (kind === 'cross') return svgFrame('ক্রস গুণফল: দিকের ধারণা', common +
      '<path d="M160 174H540M160 174V48" stroke="currentColor" stroke-opacity=".28" stroke-width="2"/><path d="M160 174L410 174" stroke="#38bdf8" marker-end="url(#clq-arrow)"/><path d="M160 174L160 66" stroke="#22c55e" marker-end="url(#clq-arrow)"/><path d="M410 174L410 72" stroke="#f59e0b" stroke-dasharray="5 6"/><circle cx="410" cy="72" r="9" fill="#f59e0b" stroke="none"/><path d="M398 72H422M410 60V84" stroke="#f59e0b" stroke-width="2"/>' +
      '</g><g fill="currentColor" font-size="15"><text x="428" y="178">A</text><text x="174" y="63">B</text><text x="430" y="65">A × B</text><text x="28" y="205" font-size="13" opacity=".7">দিক: ডান-হাত নিয়ম</text></g>', 'দুটি ভেক্টরের ক্রস গুণফলের লম্ব দিক এবং ডান-হাত নিয়ম');
    if (kind === 'field') return svgFrame('ভেক্টর ক্ষেত্র ও পরিবর্তন',
      '<g stroke="#38bdf8" stroke-width="2.5" marker-end="url(#clq-arrow)" opacity=".9"><path d="M120 65L160 45M220 65L260 45M320 65L360 45M420 65L460 45M120 130L160 110M220 130L260 110M320 130L360 110M420 130L460 110M120 190L160 170M220 190L260 170M320 190L360 170M420 190L460 170"/></g><g fill="currentColor" font-size="15"><text x="30" y="202">ক্ষেত্রের মান ও দিক স্থানভেদে বদলায়</text><text x="480" y="50">F(r)</text></g>', 'স্থানভেদে ভেক্টর ক্ষেত্রের দিক ও মানের পরিবর্তন');
    if (kind === 'displacement') return svgFrame('অবস্থান, পথ ও সরণ', common +
      '<path d="M95 165C155 48 255 202 335 104S475 46 520 72" stroke="#f59e0b" stroke-width="4" stroke-dasharray="8 6"/><path d="M95 165L520 72" stroke="#38bdf8" marker-end="url(#clq-arrow)"/><circle cx="95" cy="165" r="7" fill="#22c55e" stroke="none"/><circle cx="520" cy="72" r="7" fill="#f59e0b" stroke="none"/>' +
      '</g><g fill="currentColor" font-size="15"><text x="72" y="190">প্রারম্ভ</text><text x="525" y="63">শেষ</text><text x="245" y="65">পথ</text><text x="310" y="150">সরণ</text></g>', 'বক্র পথে চলার মোট দূরত্ব ও প্রারম্ভিক-শেষ অবস্থানের সরণ');
    if (kind === 'equilibrium') return svgFrame('ভেক্টরের সাম্য', common +
      '<path d="M320 112L320 45" stroke="#38bdf8" marker-end="url(#clq-arrow)"/><path d="M320 112L320 184" stroke="#f59e0b" marker-end="url(#clq-arrow)"/><path d="M320 112L180 112" stroke="#22c55e" marker-end="url(#clq-arrow)"/><path d="M320 112L460 112" stroke="#a78bfa" marker-end="url(#clq-arrow)"/><circle cx="320" cy="112" r="6" fill="currentColor" stroke="none"/>' +
      '</g><g fill="currentColor" font-size="15"><text x="334" y="48">F₁</text><text x="334" y="190">F₂</text><text x="145" y="102">F₃</text><text x="470" y="102">F₄</text><text x="28" y="205" font-size="13" opacity=".7">ΣF = 0 হলে লব্ধি শূন্য</text></g>', 'সাম্যাবস্থায় বলগুলোর ভেক্টর যোগফল শূন্য');
    if (kind === 'velocity') return svgFrame('আপেক্ষিক বেগের ভেক্টর যোগ', common +
      '<path d="M150 172H520M150 172V45" stroke="currentColor" stroke-opacity=".25" stroke-width="2"/><path d="M150 172V65" stroke="#22c55e" marker-end="url(#clq-arrow)"/><path d="M150 65L430 65" stroke="#f59e0b" marker-end="url(#clq-arrow)"/><path d="M150 172L430 65" stroke="#38bdf8" marker-end="url(#clq-arrow)"/>' +
      '</g><g fill="currentColor" font-size="15"><text x="170" y="85">v₁</text><text x="285" y="52">v₂</text><text x="440" y="100">লব্ধি</text><text x="28" y="205" font-size="13" opacity=".7">বেগ ভেক্টর যোগে পর্যবেক্ষকের সাপেক্ষে গতি</text></g>', 'দুটি বেগের ভেক্টর যোগে পর্যবেক্ষকের সাপেক্ষে লব্ধি বেগ');
    return svgFrame('ভেক্টরের মান ও দিক', common +
      '<path d="M110 174H535M150 195V48" stroke="currentColor" stroke-opacity=".27" stroke-width="2"/><path d="M150 174L435 77" stroke="url(#clq-line)" marker-end="url(#clq-arrow)"/><path d="M150 174L435 174" stroke="#22c55e" stroke-opacity=".7" stroke-dasharray="6 6"/><path d="M435 174V77" stroke="#f59e0b" stroke-opacity=".7" stroke-dasharray="6 6"/>' +
      '</g><g fill="currentColor" font-size="15"><text x="450" y="80">A</text><text x="270" y="160">মান</text><text x="28" y="205" font-size="13" opacity=".7">ভেক্টর নির্ধারণে মান ও দিক দুটোই প্রয়োজন</text></g>', 'ভেক্টরের মান এবং দিকের একটি জ্যামিতিক চিত্র');
  }

  function generalDiagram(subject, topic, text) {
    var z = norm((topic || '') + ' ' + (text || ''));
    if (subject === 'physics') {
      if (/ভেক্টর|vector|সরণ|লব্ধি|উপাংশ|ডট গুণ|ক্রস গুণ|বেগ.*দিক/.test(z)) {
        var kind = /ডট গুণ|dot product|cosθ|cos theta|স্কেলার গুণ|মধ্যবর্তী কোণ/.test(z) ? 'dot' :
          /ক্রস গুণ|cross product|টর্ক|torque|অক্ষীয়|axial/.test(z) ? 'cross' :
          /উপাংশ|components|একক ভেক্টর|ত্রিমাত্রিক|xyz|স্থানাঙ্ক/.test(z) ? 'components' :
          /গ্রেডিয়েন্ট|gradient|ডাইভারজেন্স|divergence|কার্ল|curl|ভেক্টর ক্ষেত্র/.test(z) ? 'field' :
          /সরণ|দূরত্ব|অবস্থান|পথ/.test(z) ? 'displacement' :
          /সাম্য|লব্ধি শূন্য|বল.*বিপরীত|সমান.*বিপরীত/.test(z) ? 'equilibrium' :
          /নৌকা|স্রোত|আপেক্ষিক বেগ|relative velocity|পর্যবেক্ষক/.test(z) ? 'velocity' :
          /যোগফল|ভেক্টর যোগ|লব্ধি|বল.*কোণে/.test(z) ? 'equilibrium' : 'general';
        return vectorDiagram(kind);
      }
      if (/তরঙ্গ|wave|কম্পাঙ্ক|তরঙ্গদৈর্ঘ্য|উপরিপাতন|অনুনাদ|বিট/.test(z)) return svgFrame('তরঙ্গের বিস্তার ও উপরিপাতন', '<path d="M35 118C70 25 105 25 140 118S210 211 245 118S315 25 350 118S420 211 455 118S525 25 560 118S595 155 615 118" fill="none" stroke="#38bdf8" stroke-width="4"/><path d="M35 118H610" stroke="currentColor" stroke-opacity=".25" stroke-dasharray="4 7"/><path d="M140 118V44M350 118V44" stroke="#f59e0b" stroke-dasharray="5 5"/><text x="260" y="38" fill="currentColor" font-size="15">λ = এক পূর্ণ তরঙ্গদৈর্ঘ্য</text><text x="145" y="145" fill="currentColor" font-size="13">শীর্ষ</text><text x="245" y="197" fill="currentColor" font-size="13">খাদ</text>', 'তরঙ্গের শীর্ষ, খাদ, তরঙ্গদৈর্ঘ্য ও বিস্তারের ধারণাচিত্র');
      if (/বৃত্তীয় গতি|কৌণিক|পর্যাবৃত্ত|দোলন|pendulum|দোলক|সরল ছন্দিত/.test(z)) return svgFrame('পর্যাবৃত্ত গতি ও দোলন', '<path d="M320 45L220 160M320 45L420 160" stroke="currentColor" stroke-opacity=".35" stroke-width="3"/><path d="M220 160A145 145 0 0 0 420 160" fill="none" stroke="#38bdf8" stroke-width="3" stroke-dasharray="7 6"/><circle cx="220" cy="160" r="11" fill="#22c55e"/><circle cx="420" cy="160" r="11" fill="#f59e0b"/><circle cx="320" cy="45" r="5" fill="currentColor"/><path d="M90 190C130 80 170 80 210 190S290 300 330 190S410 80 450 190" fill="none" stroke="#a78bfa" stroke-width="2.5" opacity=".85"/><text x="275" y="198" fill="currentColor" font-size="15">একটি পূর্ণ দোলন</text>', 'দোলকের প্রান্তীয় অবস্থান এবং সরল ছন্দিত গতির ধারণাচিত্র');
      if (/বৈদ্যুতিক বর্তনী|current|রোধ|ওহম|সার্কিট|বিদ্যুৎ প্রবাহ|মিটার ব্রিজ|পটেনশিওমিটার/.test(z)) return svgFrame('সরল বৈদ্যুতিক বর্তনী', '<g fill="none" stroke-width="3" stroke-linejoin="round"><path d="M120 80H255M330 80H520V170H120V80" stroke="currentColor"/><path d="M255 63V97M270 55V105" stroke="#f59e0b"/><path d="M330 80l-8 -10 16 -10 -16 -10 16 -10 -8 -10" stroke="#38bdf8"/></g><text x="280" y="128" fill="currentColor" font-size="14">R</text><text x="270" y="45" fill="currentColor" font-size="13">উৎস</text><text x="420" y="155" fill="currentColor" font-size="14">I</text>', 'উৎস, রোধ ও বন্ধ পথে প্রবাহের একটি সার্কিট চিত্র');
      if (/স্থিতিস্থাপক|পীড়ন|পীড়ন|বিকৃতি|হুকের সূত্র|ইয়ং.*গুণাঙ্ক|ইয়ং.*গুণাঙ্ক|সান্দ্রতা|পৃষ্ঠটান|কৈশিক/.test(z)) return svgFrame('পীড়ন–বিকৃতি ও স্থিতিস্থাপকতা', '<path d="M100 178H550M100 178V45" stroke="currentColor" stroke-opacity=".45" stroke-width="2"/><path d="M100 178L175 105L250 78L360 78C420 78 475 92 520 137" fill="none" stroke="#38bdf8" stroke-width="4"/><path d="M175 105L175 178M100 105H175" stroke="#f59e0b" stroke-dasharray="5 5"/><text x="430" y="198" fill="currentColor" font-size="14">বিকৃতি</text><text x="30" y="48" fill="currentColor" font-size="14">পীড়ন</text><text x="190" y="93" fill="currentColor" font-size="13">স্থিতিস্থাপক অঞ্চল</text>', 'পীড়ন ও বিকৃতির সম্পর্কের একটি ধারণামূলক লেখচিত্র; নির্দিষ্ট উপাদানের ডেটা নয়');
      if (/তাপগতিবিদ্যা|তাপমাত্রা|তাপীয়|তাপীয়|অভ্যন্তরীণ শক্তি|কার্নো|এন্ট্রপি|এনট্রপি|ইঞ্জিন|রেফ্রিজারেটর/.test(z)) return svgFrame('তাপগতীয় প্রক্রিয়া', '<path d="M100 175H540M100 175V42" stroke="currentColor" stroke-opacity=".45" stroke-width="2"/><path d="M150 145C190 75 285 55 370 80S465 140 500 148" fill="none" stroke="#38bdf8" stroke-width="4"/><path d="M150 145L500 148" stroke="#f59e0b" stroke-dasharray="5 6"/><text x="548" y="180" fill="currentColor" font-size="14">V</text><text x="82" y="40" fill="currentColor" font-size="14">P</text><text x="275" y="196" fill="currentColor" font-size="13">P–V চিত্রের ধারণা</text>', 'চাপ–আয়তন চিত্রে তাপগতীয় অবস্থার পরিবর্তন বোঝানোর ধারণাচিত্র');
      if (/তড়িৎ ক্ষেত্র|তড়িৎ ক্ষেত্র|তড়িৎ বিভব|তড়িৎ বিভব|কুলম্ব|চার্জ|ধারকত্ব|ধারক|গাউস|দ্বিমেরু|ডাইইলেকট্রিক/.test(z)) return svgFrame('তড়িৎ ক্ষেত্ররেখা ও ধারক', '<circle cx="175" cy="112" r="17" fill="#f59e0b"/><circle cx="465" cy="112" r="17" fill="#38bdf8"/><g fill="none" stroke="#22c55e" stroke-width="2.5" marker-end="url(#clq-arrow)"><path d="M195 112H440M190 92C260 40 380 40 450 92M190 132C260 184 380 184 450 132"/></g><text x="160" y="78" fill="currentColor" font-size="13">+q</text><text x="452" y="78" fill="currentColor" font-size="13">−q</text><rect x="260" y="75" width="120" height="74" rx="8" fill="none" stroke="currentColor" stroke-opacity=".5" stroke-dasharray="5 5"/><text x="320" y="168" text-anchor="middle" fill="currentColor" font-size="13">ক্ষেত্রের দিক</text>', 'বিপরীতধর্মী চার্জের মধ্যে তড়িৎ ক্ষেত্রের দিক বোঝানোর সরল চিত্র');
      if (/চৌম্বক|ম্যাগনেট|অ্যাম্পিয়ার|বায়ো.?স্যাভার্ট|ওয়েরস্টেড|ডোমেইন|ফেরো|প্যারা|ডায়া/.test(z)) return svgFrame('চৌম্বক ক্ষেত্র', '<circle cx="320" cy="112" r="42" fill="none" stroke="#38bdf8" stroke-width="3"/><path d="M320 33C420 33 485 75 485 112S420 191 320 191S155 150 155 112S220 33 320 33Z" fill="none" stroke="#22c55e" stroke-width="2.5"/><path d="M320 50C388 50 438 78 438 112" fill="none" stroke="#f59e0b" stroke-width="2.5" marker-end="url(#clq-arrow)"/><path d="M320 174C252 174 202 146 202 112" fill="none" stroke="#f59e0b" stroke-width="2.5" marker-end="url(#clq-arrow)"/><text x="330" y="117" fill="currentColor" font-size="14">উৎস</text>', 'চৌম্বক ক্ষেত্ররেখার বদ্ধ প্রকৃতি বোঝানোর ধারণাচিত্র');
      if (/আবেশ|আবিষ্ট|লেন্জ|ফ্যারাডে|পরিবর্তী প্রবাহ|এসি|alternating|জেনারেটর|স্বকীয়|পারস্পরিক/.test(z)) return svgFrame('তড়িৎচৌম্বকীয় আবেশ', '<path d="M90 112H235" stroke="#38bdf8" stroke-width="4"/><path d="M90 92H235" stroke="#38bdf8" stroke-width="4"/><path d="M235 72C265 72 265 152 295 152S325 72 355 72S385 152 415 152S445 72 475 72" fill="none" stroke="#22c55e" stroke-width="4"/><path d="M235 112H500" stroke="currentColor" stroke-opacity=".25" stroke-dasharray="5 6"/><text x="115" y="64" fill="currentColor" font-size="13">চুম্বক/ফ্লাক্স</text><text x="335" y="190" fill="currentColor" font-size="13">আবিষ্ট emf</text>', 'চৌম্বক ফ্লাক্স পরিবর্তনে আবিষ্ট তড়িচ্চালক বল ও পরিবর্তী সংকেতের ধারণা');
      if (/আলোক|প্রতিফলন|প্রতিসরণ|লেন্স|দর্পণ|বিচ্ছুরণ|ব্যতিচার|অপবর্তন|মেরুকরণ|ফার্মাট/.test(z)) return svgFrame('আলোর রশ্মির পথ', '<path d="M80 160L300 95L520 160" fill="none" stroke="#38bdf8" stroke-width="3.5"/><path d="M300 95V190" stroke="currentColor" stroke-opacity=".45" stroke-dasharray="5 6"/><path d="M300 95L300 30" stroke="#f59e0b" stroke-width="2.5"/><path d="M300 95L400 35" stroke="#22c55e" stroke-width="3" marker-end="url(#clq-arrow)"/><text x="70" y="180" fill="currentColor" font-size="13">আপতিত রশ্মি</text><text x="410" y="30" fill="currentColor" font-size="13">প্রতিফলিত/প্রতিসরিত</text>', 'আপতন বিন্দুতে আলোর রশ্মির দিক পরিবর্তনের ধারণাচিত্র');
      if (/নিউক্লিয়|নিউক্লিয়|পরমাণুর মডেল|তেজস্ক্রিয়|তেজস্ক্রিয়া|radioactiv|ফোটন|আলোক তড়িৎ|আলোক তড়িৎ|কোয়ান্টাম|কোয়ান্টাম/.test(z)) return svgFrame('পরমাণু ও নিউক্লিয়াস', '<circle cx="320" cy="112" r="22" fill="#f59e0b"/><ellipse cx="320" cy="112" rx="145" ry="48" fill="none" stroke="#38bdf8" stroke-width="3"/><ellipse cx="320" cy="112" rx="145" ry="48" fill="none" stroke="#22c55e" stroke-width="3" transform="rotate(60 320 112)"/><circle cx="465" cy="112" r="6" fill="#38bdf8"/><path d="M340 112L470 112" stroke="#f59e0b" stroke-dasharray="4 5"/><text x="345" y="151" fill="currentColor" font-size="13">নিউক্লিয়াস</text>', 'পরমাণুর কেন্দ্রীয় নিউক্লিয়াস ও ইলেকট্রন বিন্যাসের সরল মডেল; কক্ষপথ স্কেল অনুযায়ী নয়');
      if (/সেমিকন্ডাক্টর|অর্ধপরিবাহী|ডায়োড|ডায়োড|ট্রানজিস্টর|লজিক গেট|ইলেকট্রনিক/.test(z)) return svgFrame('সেমিকন্ডাক্টর জাংশন', '<rect x="145" y="65" width="155" height="95" rx="10" fill="#38bdf8" opacity=".16" stroke="#38bdf8" stroke-width="2"/><rect x="300" y="65" width="155" height="95" rx="10" fill="#f59e0b" opacity=".16" stroke="#f59e0b" stroke-width="2"/><path d="M300 65V160" stroke="currentColor" stroke-width="2" stroke-dasharray="4 5"/><path d="M110 112H145M455 112H520" stroke="#22c55e" stroke-width="3" marker-end="url(#clq-arrow)"/><text x="220" y="120" text-anchor="middle" fill="currentColor" font-size="19">P</text><text x="375" y="120" text-anchor="middle" fill="currentColor" font-size="19">N</text><text x="320" y="190" text-anchor="middle" fill="currentColor" font-size="13">P–N জাংশন</text>', 'P ও N ধরনের অর্ধপরিবাহীর সংযোগস্থলের ধারণাচিত্র');
      if (/মহাকর্ষ|অভিকর্ষ|কেপলার|গ্রহের গতি|মুক্তিবেগ|উপগ্রহ|কক্ষপথ|জ্যোতির্বিজ্ঞান/.test(z)) return svgFrame('মহাকর্ষীয় কক্ষপথ', '<circle cx="320" cy="112" r="25" fill="#f59e0b"/><ellipse cx="320" cy="112" rx="190" ry="68" fill="none" stroke="#38bdf8" stroke-width="3"/><circle cx="493" cy="92" r="9" fill="#22c55e"/><path d="M493 92L455 78" stroke="#22c55e" stroke-width="2.5" marker-end="url(#clq-arrow)"/><text x="320" y="156" text-anchor="middle" fill="currentColor" font-size="13">কেন্দ্রীয় ভর</text>', 'কেন্দ্রীয় বস্তুকে ঘিরে উপবৃত্তাকার কক্ষপথের ধারণাচিত্র');
      if (/প্রক্ষেপ|প্রাস|নিক্ষিপ্ত|projectile/.test(z)) return svgFrame('প্রক্ষেপকের গতিপথ', '<path d="M80 175H555" stroke="currentColor" stroke-opacity=".35" stroke-width="2"/><path d="M95 174Q310 -8 520 174" fill="none" stroke="#38bdf8" stroke-width="4"/><path d="M95 174L180 105" stroke="#22c55e" stroke-width="3" marker-end="url(#clq-arrow)"/><path d="M180 105V174M95 174H180" stroke="#f59e0b" stroke-width="2" stroke-dasharray="5 5"/><text x="195" y="99" fill="currentColor" font-size="13">প্রাথমিক বেগ</text><text x="535" y="195" fill="currentColor" font-size="13">x</text>', 'প্রক্ষেপকের পরাবৃত্তাকার গতিপথ ও বেগের উপাংশের ধারণাচিত্র');
      if (/গ্যাস|আণবিক গতিতত্ত্ব|বয়েল|বয়েল|চাপ|আর্দ্রতা|শিশিরাঙ্ক/.test(z)) return svgFrame('গ্যাস অণুর গতিশীল মডেল', '<rect x="105" y="50" width="430" height="130" rx="15" fill="none" stroke="currentColor" stroke-opacity=".4" stroke-width="2"/><g fill="#38bdf8"><circle cx="160" cy="85" r="7"/><circle cx="255" cy="145" r="7"/><circle cx="390" cy="92" r="7"/><circle cx="480" cy="150" r="7"/></g><g stroke="#22c55e" stroke-width="2.5" marker-end="url(#clq-arrow)"><path d="M170 85L220 65M255 145L300 115M390 92L435 70M480 150L510 110"/></g><text x="320" y="202" text-anchor="middle" fill="currentColor" font-size="13">এলোমেলো গতির কারণে দেয়ালে সংঘর্ষ ও চাপ</text>', 'গ্যাস অণুর এলোমেলো গতি ও পাত্রের দেয়ালে সংঘর্ষের ধারণাচিত্র');
      if (/গতি|বেগ|ত্বরণ|গতিবিদ্যা|নিউটনের|বল|ভরবেগ|সংঘর্ষ|কাজ|শক্তি|ক্ষমতা|ঘর্ষণ/.test(z)) return svgFrame('গতি ও বলের বিশ্লেষণ', '<path d="M80 175H555M115 175V45" stroke="currentColor" stroke-opacity=".35" stroke-width="2"/><rect x="270" y="118" width="72" height="48" rx="7" fill="#38bdf8" opacity=".35" stroke="#38bdf8" stroke-width="2"/><path d="M306 118V65M342 142H440M270 142H190" stroke="#22c55e" stroke-width="3" marker-end="url(#clq-arrow)"/><text x="350" y="130" fill="currentColor" font-size="13">F</text><text x="125" y="55" fill="currentColor" font-size="13">y</text><text x="560" y="180" fill="currentColor" font-size="13">x</text>', 'বস্তুর ওপর বলের দিক ও গতির পরিবর্তনের একটি সরল মডেল');
    }
    if (subject === 'chemistry') {
      if (/পরমাণু|ইলেকট্রন|নিউক্লিয়াস|নিউক্লিয়াস|electron|atomic|orbital|আইসোটোপ/.test(z)) return svgFrame('পরমাণুর গঠন (ধারণামূলক)', '<circle cx="320" cy="117" r="20" fill="#f59e0b"/><ellipse cx="320" cy="117" rx="140" ry="48" fill="none" stroke="#38bdf8" stroke-width="3"/><ellipse cx="320" cy="117" rx="140" ry="48" fill="none" stroke="#22c55e" stroke-width="3" transform="rotate(60 320 117)"/><ellipse cx="320" cy="117" rx="140" ry="48" fill="none" stroke="#a78bfa" stroke-width="3" transform="rotate(-60 320 117)"/><circle cx="180" cy="117" r="6" fill="#38bdf8"/><text x="348" y="147" fill="currentColor" font-size="14">নিউক্লিয়াস</text>', 'নিউক্লিয়াস ও ইলেকট্রন বিন্যাস বোঝাতে ধারণামূলক চিত্র; কক্ষপথ বাস্তব পথ নয়');
      if (/রাসায়নিক বন্ধন|রাসায়নিক বন্ধন|অণুর আকৃতি|molecule|covalent|ionic bond|বন্ধন|পলিমার|গ্লাইকোসাইড|পেপটাইড/.test(z)) return svgFrame('অণুতে পরমাণুর সংযোগ', '<g stroke="#38bdf8" stroke-width="5"><path d="M220 117H320M320 117H420"/></g><circle cx="220" cy="117" r="28" fill="#22c55e"/><circle cx="320" cy="117" r="33" fill="#38bdf8"/><circle cx="420" cy="117" r="28" fill="#f59e0b"/><g fill="#07111f" font-size="16" font-weight="700" text-anchor="middle"><text x="220" y="123">A</text><text x="320" y="123">B</text><text x="420" y="123">C</text></g><text x="250" y="180" fill="currentColor" font-size="14">বন্ধন দ্বারা যুক্ত পরমাণু</text>', 'অণুর মধ্যে পরমাণু ও রাসায়নিক বন্ধনের একটি সরল মডেল');
      if (/তড়িৎ রসায়ন|তড়িৎ রসায়ন|electrochemical|গ্যালভানিক|কোষ বিভব|অ্যানোড|ক্যাথোড|ব্যাটারি|ফুয়েল সেল|ফুয়েল সেল/.test(z)) return svgFrame('তড়িৎ-রাসায়নিক কোষ', '<rect x="145" y="65" width="130" height="100" rx="12" fill="#38bdf8" opacity=".12" stroke="#38bdf8" stroke-width="2"/><rect x="365" y="65" width="130" height="100" rx="12" fill="#f59e0b" opacity=".12" stroke="#f59e0b" stroke-width="2"/><path d="M210 65V42H430V65" fill="none" stroke="#22c55e" stroke-width="3"/><path d="M275 115H365" stroke="currentColor" stroke-width="3" stroke-dasharray="5 5"/><text x="210" y="112" text-anchor="middle" fill="currentColor" font-size="15">অ্যানোড</text><text x="430" y="112" text-anchor="middle" fill="currentColor" font-size="15">ক্যাথোড</text><text x="320" y="32" text-anchor="middle" fill="currentColor" font-size="14">ইলেকট্রন প্রবাহ</text>', 'অ্যানোড, ক্যাথোড ও ইলেকট্রনের প্রবাহের ধারণামূলক চিত্র');
      if (/অম্ল|ক্ষার|ph\b|টাইট্রেশন|প্রশমন|indicator|নির্দেশক/.test(z)) return svgFrame('অম্ল–ক্ষার ধারণা', '<rect x="90" y="88" width="460" height="28" rx="14" fill="url(#clq-line)"/><g fill="currentColor" font-size="14"><text x="90" y="68">অম্লীয়</text><text x="285" y="68">নিরপেক্ষ</text><text x="500" y="68">ক্ষারীয়</text><text x="90" y="147">কম pH</text><text x="298" y="147">মধ্যবর্তী</text><text x="500" y="147">বেশি pH</text></g><path d="M320 80V125" stroke="#f59e0b" stroke-width="3"/>', 'অম্লীয়, নিরপেক্ষ ও ক্ষারীয় দ্রবণের pH ধারণা');
      if (/পর্যায়বৃত্ত|পর্যায়বৃত্ত|পর্যায় সারণি|পর্যায় সারণি|পরমাণু ব্যাসার্ধ|আয়নীকরণ|আয়নন|তড়িৎঋণাত্মক|তড়িৎঋণাত্মক|electron configuration/.test(z)) return svgFrame('পর্যায় সারণির প্রবণতা', '<rect x="115" y="58" width="410" height="112" rx="8" fill="none" stroke="currentColor" stroke-opacity=".35" stroke-width="2"/><g fill="#38bdf8" opacity=".65"><rect x="130" y="75" width="42" height="28" rx="4"/><rect x="178" y="75" width="42" height="28" rx="4"/><rect x="226" y="75" width="42" height="28" rx="4"/><rect x="274" y="75" width="42" height="28" rx="4"/><rect x="322" y="75" width="42" height="28" rx="4"/><rect x="370" y="75" width="42" height="28" rx="4"/><rect x="418" y="75" width="42" height="28" rx="4"/></g><path d="M145 145H490M475 133L490 145L475 157" stroke="#f59e0b" stroke-width="3" fill="none"/><text x="135" y="196" fill="currentColor" font-size="13">পর্যায় জুড়ে প্রবণতা (ধারণামূলক)</text>', 'পর্যায় সারণিতে পর্যায় বরাবর ধর্মের পরিবর্তনের ধারণাচিত্র');
      if (/ল্যাব|পরীক্ষাগার|পরীক্ষাগারের|নিরাপদ ব্যবহার|সুরক্ষা|যন্ত্রপাতি|পরিমাপের যন্ত্র/.test(z)) return svgFrame('পরীক্ষাগারের নিরাপত্তা', '<rect x="100" y="58" width="115" height="112" rx="10" fill="#38bdf8" opacity=".13" stroke="#38bdf8" stroke-width="2"/><path d="M130 75H185M145 75V120L160 145L175 120V75" fill="none" stroke="#22c55e" stroke-width="3"/><path d="M280 75H355L342 155H293Z" fill="#f59e0b" opacity=".2" stroke="#f59e0b" stroke-width="2"/><path d="M430 75L480 155M480 75L430 155" stroke="#a78bfa" stroke-width="5"/><text x="320" y="195" text-anchor="middle" fill="currentColor" font-size="13">চোখের সুরক্ষা · রাসায়নিক পাত্র · সতর্কতা</text>', 'ল্যাবরেটরিতে সুরক্ষা সরঞ্জাম ও সতর্কতার প্রতীকী চিত্র');
      if (/রাসায়নিক পরিবর্তন|রাসায়নিক পরিবর্তন|বিক্রিয়ার গতি|বিক্রিয়ার গতি|সাম্যাবস্থা|রাসায়নিক সাম্য|রাসায়নিক সাম্য|তাপগ্রাহী|তাপোৎপাদী|এনথালপি|এনথালপি|প্রভাবক|reaction|বিক্রিয়া/.test(z)) return svgFrame('বিক্রিয়ার শক্তি পরিবর্তন', '<path d="M80 170H555M80 170V45" stroke="currentColor" stroke-opacity=".45" stroke-width="2"/><path d="M110 145L230 145L310 65L390 65L505 115" stroke="#38bdf8" stroke-width="4" fill="none"/><path d="M230 145V170M390 65V170" stroke="#f59e0b" stroke-width="2" stroke-dasharray="5 5"/><text x="110" y="195" fill="currentColor" font-size="13">বিক্রিয়ক</text><text x="470" y="138" fill="currentColor" font-size="13">উৎপাদ</text><text x="90" y="40" fill="currentColor" font-size="13">শক্তি</text>', 'বিক্রিয়ার অগ্রগতির সঙ্গে শক্তির পরিবর্তনের ধারণামূলক রেখাচিত্র');
      if (/জৈব|বেনজিন|অ্যালকেন|অ্যালকিন|অ্যালকাইন|কার্যকরী মূলক|সমাণু|পলিমার/.test(z)) return svgFrame('জৈব যৌগের গাঠনিক একক', '<g stroke="#38bdf8" stroke-width="5"><path d="M170 112L245 68L320 112L395 68L470 112"/></g><g fill="#22c55e"><circle cx="170" cy="112" r="19"/><circle cx="245" cy="68" r="19"/><circle cx="320" cy="112" r="19"/><circle cx="395" cy="68" r="19"/><circle cx="470" cy="112" r="19"/></g><g fill="#07111f" font-size="13" text-anchor="middle"><text x="170" y="117">C</text><text x="245" y="73">C</text><text x="320" y="117">C</text><text x="395" y="73">C</text><text x="470" y="117">C</text></g><text x="320" y="174" text-anchor="middle" fill="currentColor" font-size="13">কার্বন শৃঙ্খলের সরল মডেল</text>', 'জৈব যৌগে কার্বন শৃঙ্খল ও গাঠনিক সংযোগের ধারণাচিত্র');
      if (/পরিবেশ|দূষণ|এসিড বৃষ্টি|অ্যাসিড বৃষ্টি|ওজোন|গ্রীনহাউস|গ্রিনহাউস|বায়ু|বায়ু|পানি দূষণ|আর্সেনিক/.test(z)) return svgFrame('পরিবেশে দূষকের চলাচল', '<path d="M85 75H555" stroke="#38bdf8" stroke-width="3"/><path d="M115 75V130H270V75M360 75V130H515V75" fill="#38bdf8" opacity=".12" stroke="#38bdf8" stroke-width="2"/><path d="M285 95H340" stroke="#22c55e" stroke-width="3" marker-end="url(#clq-arrow)"/><circle cx="165" cy="102" r="6" fill="#f59e0b"/><circle cx="215" cy="114" r="6" fill="#f59e0b"/><circle cx="420" cy="100" r="6" fill="#f59e0b"/><text x="190" y="158" text-anchor="middle" fill="currentColor" font-size="13">উৎস</text><text x="440" y="158" text-anchor="middle" fill="currentColor" font-size="13">পরিবেশ</text>', 'দূষকের উৎস থেকে পরিবেশে ছড়িয়ে পড়ার একটি সরল মডেল');
      if (/শিল্প|উৎপাদন|ইউরিয়া|ইউরিয়া|সিমেন্ট|ট্যানিং|রিসাইক্লিং|ন্যানো/.test(z)) return svgFrame('শিল্পপ্রক্রিয়ার ধাপ', '<g fill="#38bdf8" opacity=".15" stroke="#38bdf8" stroke-width="2"><rect x="80" y="75" width="125" height="70" rx="10"/><rect x="258" y="75" width="125" height="70" rx="10"/><rect x="436" y="75" width="125" height="70" rx="10"/></g><g fill="currentColor" font-size="14" text-anchor="middle"><text x="142" y="115">কাঁচামাল</text><text x="320" y="115">প্রক্রিয়াকরণ</text><text x="498" y="115">উৎপাদ</text></g><path d="M205 110H258M383 110H436" stroke="#22c55e" stroke-width="3" marker-end="url(#clq-arrow)"/><text x="320" y="184" text-anchor="middle" fill="currentColor" font-size="13">বর্জ্য নিয়ন্ত্রণ ও পুনর্ব্যবহার গুরুত্বপূর্ণ</text>', 'শিল্প উৎপাদন ও প্রক্রিয়াকরণের ধাপের ধারণাচিত্র');
      if (/মোল|ঘনমাত্রা|দ্রবণ|টাইট্রেশন|বিয়ার|বিয়ার-ল্যাম্বার্ট|স্পেকট্রোস্কোপ|ক্রোমাটোগ্রাফ|পরিমাণগত/.test(z)) return svgFrame('দ্রবণ বিশ্লেষণ ও টাইট্রেশন', '<path d="M275 58H365L350 85V145Q320 165 290 145V85Z" fill="#38bdf8" opacity=".14" stroke="#38bdf8" stroke-width="2"/><path d="M290 118H350" stroke="#22c55e" stroke-width="4"/><path d="M320 40V90" stroke="#f59e0b" stroke-width="3"/><path d="M320 40C305 50 335 50 320 60" fill="none" stroke="#f59e0b" stroke-width="2"/><text x="320" y="190" text-anchor="middle" fill="currentColor" font-size="13">আয়তন ও ঘনমাত্রা নিয়ন্ত্রণ</text>', 'টাইট্রেশনে দ্রবণের আয়তন ও ঘনমাত্রা নির্ণয়ের ধারণামূলক সেটআপ');
    }
    if (subject === 'math') {
      if (/ভেক্টর|vector/.test(z)) return vectorDiagram(/ডট|স্কেলার/.test(z) ? 'dot' : /ক্রস|লম্ব/.test(z) ? 'cross' : 'components');
      if (/সরলরেখা|বৃত্ত|কনিক|পরাবৃত্ত|উপবৃত্ত|অধিবৃত্ত|স্থানাঙ্ক|coordinate|লেখচিত্র|গ্রাফ|function|ফাংশন/.test(z)) return svgFrame('স্থানাঙ্ক সমতলে লেখচিত্র', '<path d="M110 175H540M320 195V42" stroke="currentColor" stroke-opacity=".55" stroke-width="2"/><path d="M155 175C230 175 245 55 320 55S420 175 490 175" fill="none" stroke="#38bdf8" stroke-width="4"/><path d="M320 55V175M155 175H490" stroke="currentColor" stroke-opacity=".18" stroke-dasharray="5 6"/><text x="548" y="180" fill="currentColor" font-size="14">x</text><text x="330" y="43" fill="currentColor" font-size="14">y</text>', 'x-y স্থানাঙ্ক সমতলে একটি ধারণামূলক লেখচিত্র');
      if (/ত্রিকোণমিতি|sine|cosine|unit circle|একক বৃত্ত/.test(z)) return svgFrame('একক বৃত্তে কোণ', '<circle cx="320" cy="120" r="82" fill="none" stroke="currentColor" stroke-opacity=".35" stroke-width="2"/><path d="M210 120H525M320 200V35" stroke="currentColor" stroke-opacity=".35" stroke-width="2"/><path d="M320 120L390 76" stroke="#38bdf8" stroke-width="4"/><path d="M390 76V120" stroke="#f59e0b" stroke-width="3" stroke-dasharray="5 5"/><path d="M365 120A45 45 0 0 0 359 96" fill="none" stroke="#22c55e" stroke-width="3"/><text x="405" y="72" fill="currentColor" font-size="14">(cos θ, sin θ)</text><text x="369" y="111" fill="currentColor" font-size="14">θ</text>', 'একক বৃত্তে কোণ, cos ও sin-এর স্থানাঙ্ক');
      if (/ম্যাট্রিক্স|নির্ণায়ক|determinant|matrix/.test(z)) return svgFrame('ম্যাট্রিক্সের বিন্যাস', '<g fill="none" stroke="#38bdf8" stroke-width="3"><path d="M235 65H215V170H235M405 65H425V170H405"/></g><g fill="currentColor" font-size="24" text-anchor="middle"><text x="270" y="100">a</text><text x="370" y="100">b</text><text x="270" y="148">c</text><text x="370" y="148">d</text></g><text x="320" y="195" text-anchor="middle" fill="currentColor" font-size="14">২ × ২ বিন্যাসের ধারণা</text>', 'দুই সারি ও দুই স্তম্ভে ম্যাট্রিক্সের বিন্যাস');
      if (/অন্তরীকরণ|অবকলন|derivative|ঢাল|tangent/.test(z)) return svgFrame('স্পর্শকের ঢাল ও অন্তরীকরণ', '<path d="M100 175C180 170 225 60 320 90S455 180 540 145" fill="none" stroke="#38bdf8" stroke-width="4"/><path d="M230 160L430 60" stroke="#f59e0b" stroke-width="3"/><circle cx="330" cy="95" r="7" fill="#22c55e"/><text x="438" y="55" fill="currentColor" font-size="14">স্পর্শক</text><text x="345" y="118" fill="currentColor" font-size="14">ঢাল = dy/dx</text>', 'বক্ররেখায় একটি বিন্দুতে স্পর্শক ও ঢালের ধারণা');
      if (/যোগজ|যোগজীকরণ|সমাকলন|integral|ক্ষেত্রফল/.test(z)) return svgFrame('বক্ররেখার নিচের ক্ষেত্রফল', '<path d="M100 170H540M130 170C200 155 230 110 300 88S430 60 510 40" fill="none" stroke="#38bdf8" stroke-width="4"/><path d="M130 170C200 155 230 110 300 88S430 60 510 40V170Z" fill="#22c55e" opacity=".2"/><path d="M130 170V170M510 170V40" stroke="currentColor" stroke-opacity=".5" stroke-dasharray="4 5"/><text x="300" y="150" fill="currentColor" font-size="14">নির্দিষ্ট সমাকলন = ক্ষেত্রফল</text>', 'একটি বক্ররেখা ও x-অক্ষের মধ্যবর্তী ক্ষেত্রফলের ধারণা');
      if (/বিন্যাস|সমাবেশ|permutation|combination/.test(z)) return svgFrame('বিন্যাস ও সমাবেশ', '<g fill="#38bdf8" opacity=".2" stroke="#38bdf8" stroke-width="2"><rect x="80" y="82" width="60" height="54" rx="9"/><rect x="290" y="36" width="60" height="54" rx="9"/><rect x="500" y="82" width="60" height="54" rx="9"/></g><g fill="currentColor" font-size="16" text-anchor="middle"><text x="110" y="116">A</text><text x="320" y="70">B</text><text x="530" y="116">C</text></g><path d="M140 100L290 60M350 60L500 100M140 118L290 155M350 155L500 118" stroke="#22c55e" stroke-width="2.5" fill="none"/><text x="320" y="195" text-anchor="middle" fill="currentColor" font-size="13">ক্রম গুরুত্বপূর্ণ হলে বিন্যাস; নয়তো সমাবেশ</text>', 'তিনটি ভিন্ন উপাদান সাজানো ও নির্বাচন করার পার্থক্যের ধারণাচিত্র');
      if (/বাস্তব সংখ্যা|অসমতা|পরমমান|সংখ্যারেখা|interval|ব্যবধান/.test(z)) return svgFrame('সংখ্যারেখায় অসমতা', '<path d="M85 118H555" stroke="currentColor" stroke-width="2.5"/><path d="M170 118H440" stroke="#38bdf8" stroke-width="7" stroke-linecap="round"/><circle cx="170" cy="118" r="9" fill="#0f172a" stroke="#f59e0b" stroke-width="3"/><circle cx="440" cy="118" r="9" fill="#22c55e"/><g fill="currentColor" font-size="14" text-anchor="middle"><text x="170" y="151">a</text><text x="440" y="151">b</text><text x="85" y="151">−∞</text><text x="555" y="151">+∞</text></g><text x="320" y="70" text-anchor="middle" fill="currentColor" font-size="14">a ≤ x &lt; b</text>', 'সংখ্যারেখায় একটি ব্যবধান ও অসমতার ধারণামূলক চিত্র');
      if (/জটিল সংখ্যা|argand|আর্গান্ড|আর্গুমেন্ট|অনুবন্ধী/.test(z)) return svgFrame('আর্গান্ড সমতলে জটিল সংখ্যা', '<path d="M100 120H540M320 195V40" stroke="currentColor" stroke-opacity=".5" stroke-width="2"/><path d="M320 120L440 58" stroke="#38bdf8" stroke-width="4" marker-end="url(#clq-arrow)"/><path d="M440 58V120M320 120H440" stroke="#f59e0b" stroke-width="2" stroke-dasharray="5 5"/><circle cx="440" cy="58" r="6" fill="#22c55e"/><text x="452" y="55" fill="currentColor" font-size="14">z = a + bi</text><text x="445" y="138" fill="currentColor" font-size="13">a</text><text x="300" y="50" fill="currentColor" font-size="13">Im</text><text x="545" y="138" fill="currentColor" font-size="13">Re</text>', 'আর্গান্ড সমতলে বাস্তব ও কাল্পনিক অংশের অবস্থান');
      if (/বহুপদী|দ্বিঘাত|ত্রিঘাত|মূল ও সহগ|polynomial/.test(z)) return svgFrame('বহুপদীর লেখচিত্র ও মূল', '<path d="M95 170H545M320 195V35" stroke="currentColor" stroke-opacity=".5" stroke-width="2"/><path d="M150 45Q320 285 490 45" fill="none" stroke="#38bdf8" stroke-width="4"/><path d="M205 170V158M435 170V158" stroke="#f59e0b" stroke-width="3"/><circle cx="205" cy="170" r="6" fill="#22c55e"/><circle cx="435" cy="170" r="6" fill="#22c55e"/><text x="205" y="192" text-anchor="middle" fill="currentColor" font-size="13">মূল</text><text x="435" y="192" text-anchor="middle" fill="currentColor" font-size="13">মূল</text>', 'দ্বিঘাত বহুপদীর সম্ভাব্য মূলের সঙ্গে লেখচিত্রের ছেদ');
      if (/দ্বিপদী|প্যাসকেল|binomial|আরোহ/.test(z)) return svgFrame('দ্বিপদী বিস্তৃতি ও প্যাসকেলের ত্রিভুজ', '<g fill="#38bdf8" opacity=".22" stroke="#38bdf8" stroke-width="1.5"><path d="M320 48L270 90H370Z"/><path d="M270 90L220 132H320Z M370 90L320 132H420Z"/><path d="M220 132L170 174H270Z M320 132L270 174H370Z M420 132L370 174H470Z"/></g><g fill="currentColor" font-size="16" text-anchor="middle"><text x="320" y="78">1</text><text x="270" y="119">1</text><text x="370" y="119">1</text><text x="220" y="162">1</text><text x="320" y="162">2</text><text x="420" y="162">1</text></g>', 'প্যাসকেলের ত্রিভুজে সহগের বিন্যাসের ধারণাচিত্র');
      if (/সম্ভাবনা|উপাত্ত|বিস্তার পরিমাপ|প্রমিত ব্যবধান|ভেদাঙ্ক|probability|statistics/.test(z)) return svgFrame('সম্ভাবনা ও উপাত্ত', '<path d="M85 175H555M105 175V42" stroke="currentColor" stroke-opacity=".45" stroke-width="2"/><g fill="#38bdf8" opacity=".72"><rect x="135" y="118" width="42" height="57" rx="4"/><rect x="195" y="82" width="42" height="93" rx="4"/><rect x="255" y="56" width="42" height="119" rx="4"/><rect x="315" y="90" width="42" height="85" rx="4"/><rect x="375" y="130" width="42" height="45" rx="4"/></g><text x="320" y="202" text-anchor="middle" fill="currentColor" font-size="13">বণ্টন ও বিস্তারের একটি উদাহরণ</text>', 'উপাত্তের বণ্টন ও বিস্তার দেখানোর একটি উদাহরণধর্মী বার চার্ট');
      if (/স্থিতিবিদ্যা|বলজোট|লামির|সাম্যাবস্থা|বল.*উপাংশ|লব্ধি/.test(z)) return vectorDiagram('equilibrium');
      if (/যোগাশ্রয়ী|রৈখিক প্রোগ্রাম|linear programming|feasible/.test(z)) return svgFrame('যোগাশ্রয়ী প্রোগ্রামের feasible region', '<path d="M95 178H550M95 178V38" stroke="currentColor" stroke-opacity=".5" stroke-width="2"/><path d="M150 165L220 62L475 120L150 165Z" fill="#38bdf8" opacity=".18" stroke="#38bdf8" stroke-width="3"/><path d="M220 62L220 178M150 165H475" stroke="#f59e0b" stroke-width="2" stroke-dasharray="5 5"/><text x="300" y="130" fill="currentColor" font-size="13">সম্ভব সমাধান অঞ্চল</text><text x="555" y="190" fill="currentColor" font-size="13">x</text><text x="80" y="38" fill="currentColor" font-size="13">y</text>', 'শর্তরেখার মধ্যে সম্ভাব্য সমাধান অঞ্চলের ধারণাচিত্র');
      if (/বেগ|ত্বরণ|প্রক্ষেপ|কণার গতি|গতির সমীকরণ/.test(z)) return svgFrame('গতির লেখচিত্র', '<path d="M95 178H550M95 178V38" stroke="currentColor" stroke-opacity=".5" stroke-width="2"/><path d="M120 160L480 65" stroke="#38bdf8" stroke-width="4"/><path d="M120 160V178M480 65V178" stroke="#f59e0b" stroke-width="2" stroke-dasharray="5 5"/><text x="560" y="185" fill="currentColor" font-size="13">t</text><text x="76" y="40" fill="currentColor" font-size="13">v</text><text x="315" y="198" text-anchor="middle" fill="currentColor" font-size="13">সময় অনুযায়ী বেগের পরিবর্তন</text>', 'সময়ের সঙ্গে বেগ পরিবর্তনের একটি ধারণামূলক লেখচিত্র');
    }
    return null;
  }

  function classifyType(q) {
    /* Classify from the question stem only. Generic explanations mention testing,
       analysis and formulas even when the question itself is not of that type. */
    var z = norm(q.q || '');
    if (/অভিকথন|কারণ\s*[:：]|\bassertion\b|\breason\b/.test(z)) return 'assertion';
    if (/গ্রাফ|লেখচিত্র|চিত্র|সারণি|উপাত্ত|\bdata\b|\bgraph\b|\bdiagram\b/.test(z)) return 'graph';
    if (/ভুল ধারণা|ভ্রান্ত|ভুল বক্তব্য|কোন বক্তব্যটি ভুল|কোন সিদ্ধান্তটি ভুল|কেন ভুল/.test(z)) return 'misconception';
    if (/বাস্তব জীবনে|দৈনন্দিন|বাস্তব প্রয়োগ|বাস্তবে|শিল্পে|প্রকৃতিতে/.test(z)) return 'realWorld';
    if (/ধাপে ধাপে|পরপর|একাধিক ধাপ|প্রথমে.*তারপর|মোট কত|নির্ণয় কর|নির্ণয় কর/.test(z)) return 'multiStep';
    if (/সমাধান|হিসাব|গণনা|সমীকরণ|সূত্র|মান কত|কত\s*[০-৯0-9]|[=+−×÷√^]/.test(z)) return 'mathematical';
    if (/ব্যবহারিক|ল্যাবরেটরি|পরীক্ষাগারে|পরীক্ষণ পদ্ধতি|টাইট্রেশন|নমুনা সংগ্রহ|যন্ত্রের পাঠ|পরিমাপের ফল/.test(z)) return 'experiment';
    if (/ধারণাগত চ্যালেঞ্জ|বিশ্লেষণ|তুলনা|যৌক্তিক সিদ্ধান্ত|কারণ ও ফল|কোন শর্তে/.test(z)) return 'analytical';
    if (/ধরা যাক|একটি .* হলে|একজন|একটি গাড়ি|একটি গাড়ি|একজন শিক্ষার্থী|কোনো .* করলে|বাস্তব সমস্যা|লক্ষ্য করল|পরিস্থিতি হলো/.test(z)) return 'scenario';
    return 'conceptual';
  }

  function selectTopic(q, topics) {
    var declared = String(q.syllabusTopic || '').trim(), raw = String(q.topic || q.subtopic || '').trim();
    var ndeclared = norm(declared), nraw = norm(raw);
    /* Generated supplements retain the exact source-TXT topic, avoiding ambiguous
       short labels such as "ভেক্টর" or "বিন্যাস" being assigned to the first match. */
    if (ndeclared) {
      for (var d = 0; d < topics.length; d++) if (norm(topics[d]) === ndeclared) return topics[d];
      var declaredMatches = topics.filter(function (topic) { var nt = norm(topic); return nt.length > 7 && ndeclared.indexOf(nt) >= 0; });
      if (declaredMatches.length === 1) return declaredMatches[0];
    }
    if (nraw) {
      for (var i = 0; i < topics.length; i++) if (norm(topics[i]) === nraw) return topics[i];
      var candidates = topics.filter(function (topic) {
        var nt = norm(topic);
        return nt.indexOf(nraw) >= 0 || nraw.indexOf(nt) >= 0;
      });
      if (candidates.length === 1) return candidates[0];
      /* Prefer the longest precise overlap only when it is clearly stronger. */
      if (candidates.length > 1) {
        candidates.sort(function (a, b) { return norm(b).length - norm(a).length; });
        var aScore = norm(candidates[0]).length, bScore = norm(candidates[1]).length;
        if (aScore >= bScore * 1.35 && nraw.length > 8) return candidates[0];
      }
    }
    var content = norm((q.q || '') + ' ' + (q.longExplain || q.e || ''));
    var best = '', bestScore = 0, secondScore = 0;
    topics.forEach(function (topic) {
      var words = norm(topic).split(' ').filter(function (w) { return w.length > 2; }), score = 0;
      words.forEach(function (word) { if (content.indexOf(word) >= 0) score += Math.min(4, word.length); });
      if (score > bestScore) { secondScore = bestScore; bestScore = score; best = topic; }
      else if (score > secondScore) secondScore = score;
    });
    /* An ambiguous heuristic is not allowed to invent an exact syllabus tag. */
    return best && bestScore >= 6 && bestScore >= secondScore * 1.2 ? best : raw || 'সিলেবাসভিত্তিক ধারণা';
  }

  function makeMedia(subject, topic, q) {
    if (Array.isArray(q.media) && q.media.length) return q.media;
    var svg = generalDiagram(subject, topic, (q.q || '') + ' ' + (q.e || '') + ' ' + (q.formulaExplain || ''));
    if (!svg) return [];
    var topicText = String(topic || '');
    var alt = subject === 'physics' ? 'পদার্থবিজ্ঞানের ধারণা বোঝাতে সহায়ক চিত্র' : subject === 'chemistry' ? 'রসায়নের ধারণা বোঝাতে সহায়ক চিত্র' : 'গাণিতিক ধারণা বোঝাতে সহায়ক চিত্র';
    return [{ type: 'diagram', kind: 'inline-svg', title: topicText || 'ধারণাচিত্র', alt: alt + ' — ' + topicText, caption: 'ধারণাটি দৃশ্যমানভাবে বোঝার জন্য; চিত্রটি স্কেল অনুযায়ী অঙ্কিত নয়।', html: svg }];
  }

  function enrichBank(chapter, bank, source) {
    var topics = source && Array.isArray(source.topics) ? source.topics : [], chapterId = chapter.id;
    var subject = chapter.subjectKey || (chapterId.indexOf('phy') === 0 ? 'physics' : chapterId.indexOf('chem') === 0 ? 'chemistry' : 'math');
    var chapterTitle = chapter.title || (source && source.title) || chapterId;
    return (bank || []).map(function (q) {
      if (!q || !q.q) return q;
      var tier = Math.max(1, Math.min(4, Number(q.tier) || 2));
      var subtopic = selectTopic(q, topics), qid = q.questionId || q.id || ('cq-' + chapterId + '-' + hash(norm(q.q)));
      var type = q.questionType || classifyType(q);
      var media = makeMedia(subject, subtopic, q);
      var explanation = q.explanation && typeof q.explanation === 'object' ? q.explanation : {};
      var core = explanation.core || q.longExplain || q.e || '';
      q.id = q.id || qid;
      q.questionId = qid;
      q.subject = SUBJECT_NAMES[subject] || subject;
      q.paper = chapter.paper || (source && source.paper) || '';
      q.chapterId = chapterId;
      q.chapterTitle = chapterTitle;
      q.subtopic = subtopic;
      q.questionType = type;
      q.difficulty = DIFFICULTY[tier];
      q.learningObjective = q.learningObjective || subtopic;
      q.media = media;
      q.e = q.e || core;
      q.explanation = {
        core: core,
        analysis: explanation.analysis || q.analysis || '',
        formula: explanation.formula || q.formulaExplain || '',
        simple: explanation.simple || q.simpleExplain || '',
        misconception: explanation.misconception || q.misconception || '',
        realWorld: explanation.realWorld || q.realWorld || '',
        steps: Array.isArray(explanation.steps) ? explanation.steps.slice(0, 12) : (Array.isArray(q.solutionSteps) ? q.solutionSteps.slice(0, 12) : []),
        optionAnalysis: Array.isArray(explanation.optionAnalysis) ? explanation.optionAnalysis.slice(0, 4) : (Array.isArray(q.optionAnalysis) ? q.optionAnalysis.slice(0, 4) : []),
        references: Array.isArray(explanation.references) ? explanation.references : (Array.isArray(q.references) ? q.references : []),
        referenceStatus: explanation.referenceStatus || q.referenceStatus || 'pending-source-and-syllabus-verification',
        media: Array.isArray(explanation.media) ? explanation.media : media
      };
      q.meta = {
        id: qid, subject: q.subject, subjectKey: subject, paper: q.paper,
        chapterId: chapterId, chapterTitle: chapterTitle, subtopic: subtopic,
        questionType: type, questionTypeLabel: TYPE_LABELS[type] || TYPE_LABELS.conceptual,
        difficulty: q.difficulty, tier: tier, learningObjective: q.learningObjective,
        contentOrigin: q.authoredHscConcept ? 'authored' : q.syllabusGenerated ? 'syllabus-generated' : 'existing-bank'
      };
      return q;
    });
  }

  function buildAudit(chapters, source) {
    return (chapters || []).map(function (ch) {
      var chapterId = ch.chapterId || String(ch.id || '').replace(/^chapter-quiz-/, ''),
        src = source && source[chapterId] || {}, qs = ch.data && ch.data.q || [], subtopics = src.topics || [];
      var tiers = { easy: 0, medium: 0, 'deep-conceptual': 0, 'hard-advanced': 0 }, types = {}, covered = {},
        media = 0, imageDiagram = 0, animation = 0, simulation = 0, explanationCount = 0,
        explanationsWithMedia = 0, references = 0, seen = Object.create(null), duplicateCount = 0;
      qs.forEach(function (q) {
        if (tiers.hasOwnProperty(q.difficulty)) tiers[q.difficulty]++;
        types[q.questionType] = (types[q.questionType] || 0) + 1;
        if (q.subtopic && subtopics.indexOf(q.subtopic) >= 0) covered[q.subtopic] = true;
        var assets = Array.isArray(q.media) ? q.media : [], supportAssets = assets.filter(function (m) { return m && m.questionSupport === true && m.verified === true; });
        if (supportAssets.length) media++;
        assets.forEach(function (m) {
          if (!m) return;
          if (m.type === 'diagram' || m.kind === 'inline-svg' || m.kind === 'image') imageDiagram++;
          if (m.type === 'animation' || m.kind === 'animation') animation++;
          if (m.type === 'simulation' || m.kind === 'simulation') simulation++;
        });
        if (q.explanation && q.explanation.core) explanationCount++;
        if (q.explanation && Array.isArray(q.explanation.media) && q.explanation.media.length) explanationsWithMedia++;
        if (q.explanation && q.explanation.references && q.explanation.references.length) references++;
        var stem = norm(q.q || '');
        if (stem) { if (seen[stem]) duplicateCount++; else seen[stem] = true; }
      });
      var coveredNames = Object.keys(covered), missing = subtopics.filter(function (t) { return !covered[t]; }),
        ratio = qs.length ? Math.round(media / qs.length * 1000) / 10 : 0,
        allTiersPresent = tiers.easy > 0 && tiers.medium > 0 && tiers['deep-conceptual'] > 0 && tiers['hard-advanced'] > 0,
        flags = [];
      if (qs.length < 100) flags.push('question-count-below-100');
      if (ratio < 35) flags.push('verified-question-support-media-below-35-percent');
      if (!allTiersPresent) flags.push('difficulty-tier-missing');
      if (missing.length) flags.push('syllabus-subtopic-missing');
      if (duplicateCount) flags.push('duplicate-stems-found');
      if (explanationCount < qs.length) flags.push('explanation-coverage-incomplete');
      if (explanationsWithMedia < qs.length) flags.push('explanation-media-needs-review');
      flags.push('manual-content-accuracy-review-required');
      return {
        chapterId: chapterId, chapter: ch.t || ch.title || src.title || chapterId,
        subject: SUBJECT_NAMES[src.subject || ch.subjectKey] || src.subject || ch.subjectKey,
        paper: src.paper || ch.paper || '', questionCount: qs.length, qualityQuestions: null,
        difficulty: tiers, allDifficultyTiersPresent: allTiersPresent, questionTypes: types,
        multimediaQuestionCount: media, multimediaRatio: ratio,
        imageDiagramCount: imageDiagram, animationQuestionCount: animation, simulationQuestionCount: simulation,
        explanationCount: explanationCount, explanationsWithMedia: explanationsWithMedia,
        questionReferenceCount: references,
        individuallyAuthoredDraftCount: qs.filter(function (q) { return q.authoredHscConcept === true && q.qualityStatus === 'draft-unreviewed'; }).length,
        individuallyAuthoredApprovedCount: qs.filter(function (q) { return q.authoredHscConcept === true && q.qualityApproved === true && q.editorialReviewed === true; }).length,
        verifiedQuestionSupportMediaCount: qs.reduce(function (n, q) { return n + ((q.media || []).filter(function (m) { return m && m.questionSupport === true && m.verified === true; }).length ? 1 : 0); }, 0),
        totalSyllabusSubtopics: subtopics.length,
        coveredSubtopics: coveredNames.length, coveredSubtopicNames: coveredNames,
        missingSubtopics: missing, duplicateCount: duplicateCount,
        automatedFlags: flags, automatedStatus: flags.length === 1 ? 'structure-check-passed-editorial-review-required' : 'attention-required-editorial-review-required',
        qualityStatus: 'manual-editorial-review-required', referenceStatus: references ? 'existing-references-present-verification-required' : 'no-verified-question-reference-attached',
        reviewStatus: 'not-manually-reviewed'
      };
    });
  }

  function renderMedia(q, surface) {
    var support = surface === 'explanation' ? 'explanationSupport' : 'questionSupport';
    var items = q && Array.isArray(q.media) ? q.media.filter(function (m) {
      return !!(m && m.verified === true && m[support] === true && ['image', 'diagram'].indexOf(String(m.type || '').toLowerCase()) >= 0 && m.html);
    }) : [];
    if (!items.length) return '';
    return '<figure class="cq-question-media">' + items.map(function (m) {
      return '<div class="cq-media-visual">' + m.html + '</div><figcaption>' + esc(m.caption || m.alt || m.title || '') + '</figcaption>';
    }).join('') + '</figure>';
  }

  w.CL_QUIZ_ENRICHMENT_V86 = {
    version: 86,
    enrichBank: enrichBank,
    buildAudit: buildAudit,
    renderMedia: renderMedia,
    typeLabels: TYPE_LABELS
  };
})(window);
