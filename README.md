# Kanwar Arcade

Five free games that run in the browser, wrapped in a small static website.

- **Starfall**: a vertical space shooter with waves, power-ups and a boss every fourth wave.
- **Brick Rally**: a brick-breaker with five levels, power-ups and a streak multiplier.
- **Serpentine**: a glowing snake game with combo fruit and rocks.
- **Skyhop**: a one-tap flyer through a sky that changes from dawn to night.
- **Lumenfall**: a 3D adventure (React, Three.js, Rapier). Source in `lumenfall/`, built output in `play/lumenfall/`.
- **Neon Velocity**: a 3D arcade racer. Source in `neon-velocity/`, built output in `play/neon-velocity/`.
- **Starfall Protocol**: a 3D top-down shooter. Source in `starfall-protocol/`, built output in `play/starfall-protocol/`.
- **Lightmerge** (2048-style puzzle) and **Driftrock** (asteroids shooter) are 2D games on the shared `Arcade` engine in `assets/js/`.

The 2D games and pages have no framework, no build step and no dependencies. Vercel serves the repo root as-is.

## Run locally

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

## Project layout

```
index.html            Landing page
contact.html, 404.html
games/                One page per game
assets/               CSS, JS (common.js + one file per 2D game), images
lumenfall/            Lumenfall source (Vite + React + Three.js)
play/<game>/          Production builds of the 3D games, committed so Vercel needs no build step
scripts/build.mjs     Generates pages, sitemap, robots, llms.txt, manifest, sw.js and vercel.json
scripts/make-og.py    Generates the social share images
```

## Add a game

1. Write `assets/js/<game>.js` using the helpers in `assets/js/common.js`, and add a thumbnail to `assets/img/`.
2. Add an entry to the `GAMES` list in `scripts/build.mjs`.
3. Run `node scripts/build.mjs` and commit the regenerated HTML.

## Contact form

With no server, the form opens a prefilled GitHub issue. To send email instead, set `CONTACT_EMAIL` at the top of `assets/js/contact.js`.

## Update Lumenfall

```bash
cd lumenfall && npm ci
npx vite build --base=/play/lumenfall/ --outDir ../play/lumenfall --emptyOutDir
```

Commit the refreshed `play/lumenfall/` folder.

Neon Velocity and Starfall Protocol rebuild the same way: `cd neon-velocity && npm ci && npx vite build --base=/play/neon-velocity/ --outDir ../play/neon-velocity --emptyOutDir` (and likewise for `starfall-protocol`).

## SEO, answer engines and AI search

`node scripts/build.mjs` writes canonical URLs, Open Graph and Twitter cards, JSON-LD (WebSite, Organization, VideoGame, FAQPage, BreadcrumbList, ItemList), `sitemap.xml`, `robots.txt` (AI crawlers allowed), `llms.txt` and `llms-full.txt`. Set your real domain before going live:

```bash
SITE_URL=https://your-domain.com node scripts/build.mjs
```

After deploying, submit `sitemap.xml` in Google Search Console and Bing Webmaster Tools. The IndexNow key file is `<key>.txt` in the repo root.
