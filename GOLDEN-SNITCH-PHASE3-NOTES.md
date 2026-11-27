# Golden Snitch – Phase 3
- gs-theme.css: Harry P on all headings (incl. spans inside), EB Garamond + Noto Serif Bengali body, math/mono kept, gold dark palette, cards/inputs/buttons, parchment quizzes.
- gs-world.js: per-route environments (Astronomy Tower=Physics, Potions=Chemistry, Arithmancy=Higher Mathematics, Library=Hub, Common Room=Study, Game Room, Observatory=Labs/Graphs, Exam, House Cup=Progress/Leaderboard); nav labels renamed visually only (routes unchanged, subject names untouched); optional House Cup (1 point per 10 XP earned, separate from XP, local to device).
- gs-admin.css: admin skin (charcoal, dark wood, gold, parchment); auth/logic untouched.
- Not done: per-page illustrations/textures, Light & Violet theme restyle, hero illustration recolour, admin controls for fonts/backgrounds, server-side House Cup leaderboard, About page restyle.

## Phase 4 additions
- Environment textures (SVG): star charts/orbits (Physics, Labs/Graphs), bubbles+copper shelf (Chemistry), grid/compass/triangle (Higher Mathematics), bookshelf (Hub/Study), chessboard (Arcade).
- Light theme = parchment/gold; Purple theme = emerald night; dark hero art warmed toward gold.
- About/creator cards framed in gold. Mobile: House Cup opens from the menu ("House Cup (optional)").
- Admin already has Theme Studio / Images-Media tabs; no new server-saved controls were added (backend api not in zip).
- Shared House Cup leaderboard needs a backend endpoint; points remain per-device.

## Phase 6 – real Harry Potter-style visuals (all original artwork, no film assets)
- gs-magic.js/css: animated castle-at-night hero (moon, lit windows, owl, bats, mist); per-page illustrated banners (Astronomy Tower, Potions Classroom, Arithmancy, Library, Common Room fireplace, Game Room w/ Snitch, Observatory, Examination Hall, House Cup shields, Great Hall); floating candles on chains; gold dust; Golden Snitch flying across every ~20s; wand-sparkle cursor trail (desktop); themed nav icons (castle, snitch, cauldron, orbit, book, owl, scroll, candle, hourglass, cup, wand, crystal ball); wooden header/nav; leather cards with double gold frame.
- Reduced-motion users: animations off.

## Phase 7 – single theme
Removed header theme button, Settings theme picker, theme-light.css, theme-toggle.js and all Light/Indigo CSS in gs-*.css. Site is forced to dark Hogwarts theme (saved light/purple prefs are overwritten on load).

## Phase 8
- Header brand centred (desktop + mobile grid, symmetric columns). Old science art hidden instantly; CSS castle shows from first paint, animated castle mounts within 100ms.

## Phase 8
First-paint castle hero (CSS background, assets/images/castle-night.svg), old science artwork permanently hidden, mobile title block centred, wood/gold buttons.
