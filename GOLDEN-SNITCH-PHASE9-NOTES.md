# Golden Snitch — Phase 9 (audit + polish on phase 8.2)

Source model: this project ships as compiled `dist` (overlay CSS/JS). No separate source tree was supplied; edits were made in place. Backup of the untouched phase 8.2 build was kept outside the zip.

## Changes
- Hero: headline "Study that feels like a magical adventure" + Bengali supporting line (defaults.js; app.js migrates only the previous built-in defaults, admin-custom copy is kept).
- "Higher Math" -> "Higher Mathematics" in visible English labels (hub.js legacy storage key left untouched).
- ConceptLab removed from download filenames, logo filename (golden-snitch-emblem.webp), backup label (old backups still restore). Kept: CONCEPTLAB_ADMIN_SETUP_KEY env-var name shown in Admin (backend reads it).
- Palette: all blue/indigo/violet/cyan colours in CSS (site + admin) hue-remapped to antique gold / dark wood at the same lightness; JS-drawn simulation/graph colours untouched. Dark ink on light-gold buttons (contrast).
- New assets/css/gs-final.css: palette tokens, banner titles in supplied font, nested-card double-frame fix, wood bottom nav, arcade tile colours, focus ring, reduced-motion.
- Intro: fail-safe if intro.js fails; `?intro=1` replays the intro.
- Cache keys bumped; service worker cache v11.

## Not done / limits
- Body fonts (EB Garamond, Noto Serif Bengali) are loaded from Google Fonts with fallbacks; no network here to self-host them.
- Supplied font has no Bengali glyphs, so Bengali headings use the Bengali body font.
- No in-UI "replay intro" button (URL only), to avoid inventing buttons.
