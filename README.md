# Kanwar Arcade

Two free arcade games that run in the browser, wrapped in a small static website.

- **Starfall**: a vertical space shooter with waves, power-ups and a boss every fourth wave.
- **Brick Rally**: a brick-breaker with five levels, power-ups and a streak multiplier.

No framework, no build step and no dependencies. Vercel serves the repo root as-is.

## Run locally

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

## Project layout

```
index.html            Landing page
contact.html          Contact page
games/                One page per game
assets/css/site.css   Design system and layout
assets/js/            Shared helpers (common.js) and one file per game
assets/img/           SVG thumbnails and favicon
scripts/build.mjs     Generates the HTML pages (header, sidebar and footer stay identical)
```

## Add a game

1. Write `assets/js/<game>.js` using the helpers in `assets/js/common.js`, and add a thumbnail to `assets/img/`.
2. Add an entry to the `GAMES` list in `scripts/build.mjs`.
3. Run `node scripts/build.mjs` and commit the regenerated HTML.

## Contact form

With no server, the form opens a prefilled GitHub issue. To send email instead, set `CONTACT_EMAIL` at the top of `assets/js/contact.js`.
