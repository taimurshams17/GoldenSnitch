# Student Hub v114 — আপডেট নোট
নতুন ফাইল: assets/css/hub114.css; assets/js/hub114-{core,planner,tools,notes,extra,academic,backup}.js (index.html-এ যুক্ত)। hub.js-এ শুধু ক্যালকুলেটর/জ্যামিতি/ইউনিট কনভার্টার চালু ও CL_HUBCORE এক্সপোজ। sw.js ক্যাশ ভার্সন বাড়ানো। সাইটের অন্য ট্যাব অপরিবর্তিত।
- ৯টি সেকশনে হোম (ড্যাশবোর্ড, সার্চ, ফিল্টার, পিন)
- সাপ্তাহিক প্ল্যানার: Day by Day / Whole Week (আলাদা ডেটা clh114_ww)
- নতুন: Past Paper Center, Attendance, Lab Notebook, Mind Map, Vocabulary, Academic Labs, উন্নত Formula Library
- উন্নত: Syllabus, Scores, GPA, Habits, Exam Center, Notes Center (Quick/Cornell/Feynman/Journal একত্রে), Mistakes, Doubts
- Backup/Restore: নির্বাচনমূলক, প্রিভিউ, মার্জ/রিপ্লেস, স্ন্যাপশট থেকে ফেরা
- Eisenhower ID `matrix` → `eisenhower` (Matrix Calculator ঠিক রইল)
- পুরোনো ডেটা মুছে ফেলা হয়নি; আগের ব্যাকআপ ফাইলও ইমপোর্ট হয়।
- Past Paper-এ আসল বোর্ড প্রশ্ন বান্ডল করা নেই; শুধু নমুনা প্রশ্ন, বাকি আপনি যোগ/ইমপোর্ট করবেন।

## v114b সংশোধন
- সার্চ বার আর স্ক্রিনে আটকে থাকে না; সাব-নেভ site-এর `nav` মোবাইল CSS-এর কারণে ফিক্সড হয়ে যেত (ঝলকানির কারণ) — এখন ঠিক
- টুল ঢোকার এন্ট্রান্স অ্যানিমেশন বন্ধ; ব্যাক চাপলে সেই টুলের জায়গায় ফেরে
- সরানো: ক্লাস রুটিন, মনোযোগের সাউন্ড, স্মার্ট রিভিশন, Past Paper Center, Lab Notebook, Mind Map, "আলাদা টুল" কার্ড, English vocabulary
- Exam Center: অধ্যায় নির্বাচন + সময়; Exam Countdown-এ সময়; Syllabus-এর "সব বিষয়" বক্স বাদ; GPA SSC বিষয় ও বড় গ্রেড ব্যাজ; "MCQ Shortcuts"


## v114c — Student Hub UI refinement
- Student Hub sections reordered: Focus & Study Room, Study Planner, Exam Center, Revision & Practice, Progress & Wellbeing, Notes & Learning, Academic Calculators & Labs, Data & Settings.
- Study Room pinned to the first position in Focus & Study Room.
- Tool and section names standardized in English; tool labels use a refined italic serif style.
- Replaced generic Student Hub beaker icon with a relevant atom icon; chemistry-specific beaker icons remain where they identify Chemistry.
- Compact dashboard cards, improved inner spacing and responsive text wrapping.
- Removed the attendance/deadline dashboard block and Attendance Tracker from the visible catalogue.
- Search panel repositioned below the hero; All (সব) is selected by default on every Student Hub home entry.
- Removed visible NEW tags. Added an Add Today’s Task CTA that opens Day by Day mode and focuses the task field.


## v114d — Student Hub refinement
- Stopwatch removed from the former Stopwatch & Unit Converter page; the remaining tool is now named Unit Converter. The separate Geometry Board stopwatch remains available.
- Removed the Additional Learning Tools panel from the Unit Converter page.
- Removed category and tool shortcut button rows from all tool pages; the Student Hub back button remains.
- Improved mobile padding and text wrapping in the six Student Hub dashboard cards.
- Removed the three quick-action buttons from the Student Hub hero header.
- Bumped the service-worker cache version and added the updated Student Hub assets to its offline shell.


## v114e — Student Hub mobile spacing
- Removed the “সব ডেটা আপনার ব্রাউজারেই।” sentence from the Student Hub hero description.
- Increased mobile dashboard card side padding and refined the KPI grid gaps and inner padding so labels, icons, and controls stay clear of card borders.
- Bumped the Student Hub asset query versions and service-worker cache version.


## v114f — Dashboard inset and revision summary removal
- Removed the full “রিভিশন বাকি” dashboard card, including the Flashcards / Mistakes quick links and the three KPI tiles.
- Increased the mobile dashboard card horizontal inset to 28px and normalized card headings, rows, empty states, lists, and buttons so their content remains inside the safe inner area.
- Updated the Student Hub CSS/JS asset versions and service-worker cache key to ensure the updated layout is fetched.


## v115 — Graph Tab premium UI
- Graph cards: gradient surface, soft border/shadow, subject accent line; Physics = sky blue, Chemistry = emerald, Higher Math = orange/amber (graph axes, grid, curves, chips) in Dark, Indigo and Light themes.
- Card previews are now drawn on scroll-in (axes → curve, ~1.1s), replay on re-entry, respect prefers-reduced-motion. Interactive graph page untouched.
- Typography: Lora / Noto Serif Bengali titles, STIX Two Text formulas. Mobile keeps 2 cards per row.
- Files: assets/css/graph-premium-v115.css, assets/js/graph-premium-v115.js, graphs.js (thumb + card markup), index.html, sw.js.
- v115b: previews start drawing immediately (≈0.6s, begins 300px before entering view); grid + X/Y axes always visible, only the curve is drawn. Colourful animated subject filter buttons and search bar.

## v122 — Premium intro redesign
- New silent ~2.4s intro, no skip button, per-theme scenes: Dark = Physics (orbits, field lines, waves), Indigo = Chemistry (benzene ring, molecules), Light = Higher Math (blueprint graphs, drawn curves).
- Files: assets/css/intro-v122.css, assets/js/intro.js, index.html (#clIntro). Old intro CSS in bundles is now unused.
- Removed intro music (audio file, Settings toggle/preview in sfx.js, service-worker entry).
- Mobile hero typed words (<=640px) ~2x faster; desktop unchanged.

## v123
- Intro (dark / indigo / light): every scene slowed ~2.05x, total ≈ 4.5s (was ≈ 2.5s). Timing lives in `assets/js/intro.js` (PLAY/PLAY_MAX) + the inline rate script right after `#clIntro` in index.html (`R=0.487`).
- Desktop hero (>=900px): illustration widened to the left and taller; new `assets/css/hero-v123.css` (bigger gradient headline, lead card, buttons, chips, animated background behind the copy).
