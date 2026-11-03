// Generates the static HTML pages for Kanwar Arcade.
// Run from the repo root:  node scripts/build.mjs
// The generated .html files are committed, so Vercel can serve them as-is
// (no build step needed).

import { mkdirSync, writeFileSync, readFileSync, existsSync, readdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

const SITE = {
  name: 'Kanwar Arcade',
  author: 'Kanwar Afaq',
  repo: 'https://github.com/KanwarAfaq/games',
  year: 2026,
  // Canonical origin. Override: SITE_URL=https://your-domain.com node scripts/build.mjs
  url: (process.env.SITE_URL || 'https://games-psi-ashy.vercel.app').replace(/\/$/, ''),
  indexNowKey: 'a7c3e9d15b2f4086b1d9e3c7f5a20486',
};

// Fingerprint a local asset so browsers refetch it when it changes.
const ver = (path) => {
  try { return createHash('md5').update(readFileSync(join(ROOT, path))).digest('hex').slice(0, 8); }
  catch { return '1'; }
};

// ---------------------------------------------------------------------------
// Games. Add an entry here and rerun the script to add a game to the site.
// ---------------------------------------------------------------------------

const GAMES = [
  {
    id: 'starfall',
    name: 'Starfall',
    page: 'games/starfall.html',
    thumb: 'assets/img/thumb-starfall.svg',
    og: 'assets/img/og-starfall.png',
    genre: 'Space shooter',
    faq: [
      ['How do you play Starfall?', 'Steer your ship with the arrow keys, the mouse or your finger and fire with Space or a tap. Shoot falling ships, collect power-ups and beat the boss every fourth wave.'],
      ['Is Starfall free to play?', 'Yes. It runs in your browser with no download, no account and no ads.'],
    ],
    script: 'assets/js/starfall.js',
    accent: 'var(--pink)',
    aspect: '0.667',
    width: 480,
    height: 720,
    tagline: 'Hold the line against waves of falling ships.',
    description: 'Starfall is a free space shooter you can play in your browser. Dodge, shoot, grab power-ups and beat the boss.',
    controls: 'Steer with arrow keys, the mouse or your finger. Fire with Space, a click or a tap.',
    hud: [
      { label: 'Wave', id: 'hud-wave', value: '0' },
      { label: 'Multiplier', id: 'hud-mult', value: 'x1' },
    ],
    pipClass: '',
    extraTool: '<button class="btn btn--tool" id="btn-auto" type="button" aria-pressed="false">Auto-fire off</button>',
    keys: [
      ['<kbd>←</kbd><kbd>→</kbd><kbd>↑</kbd><kbd>↓</kbd>', 'Move'],
      ['<kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd>', 'Move'],
      ['<kbd>Space</kbd>', 'Fire (hold)'],
      ['<kbd>F</kbd>', 'Auto-fire on or off'],
      ['<kbd>P</kbd>', 'Pause'],
      ['<kbd>M</kbd>', 'Mute'],
    ],
    pointerNote: 'Mouse or touch: drag to steer. Press and hold to fire, or turn on auto-fire.',
    tips: [
      'Power-ups drop from ships: R is rapid fire, T is triple shot, S is a shield and + is an extra life.',
      'Destroy ships in quick succession to raise your multiplier to x5. A hit or a missed ship resets it.',
      'A boss arrives every fourth wave. Keep moving and keep firing.',
    ],
  },
  {
    id: 'brick-rally',
    name: 'Brick Rally',
    page: 'games/brick-rally.html',
    thumb: 'assets/img/thumb-brick-rally.svg',
    og: 'assets/img/og-brick-rally.png',
    genre: 'Brick breaker',
    faq: [
      ['How do you play Brick Rally?', 'Slide the paddle with the mouse, your finger or the arrow keys and launch the ball with Space or a tap. Break every brick to clear the level.'],
      ['How many levels does Brick Rally have?', 'Five levels, with power-ups such as a wide paddle, multi-ball and slow ball.'],
    ],
    script: 'assets/js/brick-rally.js',
    accent: 'var(--cobalt)',
    aspect: '0.889',
    width: 640,
    height: 720,
    tagline: 'Keep the ball in play and break every brick.',
    description: 'Brick Rally is a free brick-breaker you can play in your browser. Five levels, power-ups and a streak multiplier.',
    controls: 'Move the paddle with the mouse, your finger or arrow keys. Launch with Space or a tap.',
    hud: [
      { label: 'Level', id: 'hud-level', value: '1' },
      { label: 'Multiplier', id: 'hud-mult', value: 'x1' },
    ],
    pipClass: 'pip--ball',
    extraTool: '',
    keys: [
      ['<kbd>←</kbd><kbd>→</kbd>', 'Move paddle'],
      ['<kbd>A</kbd><kbd>D</kbd>', 'Move paddle'],
      ['<kbd>Space</kbd>', 'Launch the ball'],
      ['<kbd>P</kbd>', 'Pause'],
      ['<kbd>M</kbd>', 'Mute'],
    ],
    pointerNote: 'Mouse or touch: slide to move the paddle. Click or tap to launch.',
    tips: [
      'Hit the ball with the edge of the paddle to send it off at a sharper angle.',
      'Grey bricks never break. Clear every other brick to finish the level.',
      'Power-ups drop from bricks: W is a wide paddle, M is multi-ball, S slows the ball and + is an extra life.',
      'Break bricks without touching the paddle to build a multiplier of up to x4.',
    ],
  },
  {
    id: 'serpentine',
    name: 'Serpentine',
    page: 'games/serpentine.html',
    thumb: 'assets/img/thumb-serpentine.svg',
    og: 'assets/img/og-serpentine.png',
    script: 'assets/js/serpentine.js',
    accent: 'var(--mint)',
    aspect: '1',
    width: 630,
    height: 630,
    genre: 'Snake game',
    tagline: 'Grow longer, chain fruit and dodge your own tail.',
    description: 'Serpentine is a free snake game for your browser with smooth glowing graphics, combo fruit and rocks to dodge. Play with arrow keys or swipe.',
    controls: 'Steer with the arrow keys or swipe on the board.',
    lives: false,
    hud: [
      { label: 'Length', id: 'hud-length', value: '3' },
      { label: 'Combo', id: 'hud-mult', value: 'x1' },
    ],
    pipClass: '',
    extraTool: '',
    keys: [
      ['<kbd>←</kbd><kbd>→</kbd><kbd>↑</kbd><kbd>↓</kbd>', 'Steer'],
      ['<kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd>', 'Steer'],
      ['<kbd>Space</kbd>', 'Start or resume'],
      ['<kbd>P</kbd>', 'Pause'],
      ['<kbd>M</kbd>', 'Mute'],
      ['<kbd>N</kbd>', 'Music on or off'],
    ],
    pointerNote: 'Touch or mouse: swipe or drag on the board to turn.',
    tips: [
      'Eat fruit quickly one after another to build a combo multiplier.',
      'Walls, rocks and your own tail all end the run, so leave yourself room to turn.',
      'Plan your route a few cells ahead. The snake speeds up as it grows.',
    ],
    faq: [
      ['How do you play Serpentine?', 'Steer the snake with the arrow keys, WASD or a swipe. Eat fruit to grow and score, and avoid walls, rocks and your own tail.'],
      ['Does Serpentine work on a phone?', 'Yes. Swipe on the board to turn. The game scales to fit any screen.'],
    ],
  },
  {
    id: 'skyhop',
    name: 'Skyhop',
    page: 'games/skyhop.html',
    thumb: 'assets/img/thumb-skyhop.svg',
    og: 'assets/img/og-skyhop.png',
    script: 'assets/js/skyhop.js',
    accent: 'var(--butter)',
    aspect: '0.656',
    width: 420,
    height: 640,
    genre: 'One-tap flyer',
    tagline: 'Tap to flap through a sky that runs from dawn to night.',
    description: 'Skyhop is a free one-tap flying game for your browser. Flap through gaps, collect stars and fly from sunrise into the night.',
    controls: 'Tap, click or press Space to flap.',
    lives: false,
    hud: [
      { label: 'Stars', id: 'hud-stars', value: '0' },
      { label: 'Zone', id: 'hud-zone', value: 'Dawn' },
    ],
    pipClass: '',
    extraTool: '',
    keys: [
      ['<kbd>Space</kbd>', 'Flap'],
      ['<kbd>↑</kbd> or <kbd>W</kbd>', 'Flap'],
      ['<kbd>P</kbd>', 'Pause'],
      ['<kbd>M</kbd>', 'Mute'],
      ['<kbd>N</kbd>', 'Music on or off'],
    ],
    pointerNote: 'Touch or mouse: tap or click anywhere to flap.',
    tips: [
      'Short, steady taps keep you level better than frantic ones.',
      'Stars are worth grabbing, but a clean line through the gap matters more.',
      'The sky changes from dawn to night as you go. Keep going to see every zone.',
    ],
    faq: [
      ['How do you play Skyhop?', 'Tap, click or press Space to flap. Fly through the gaps, collect stars and avoid the obstacles.'],
      ['Is Skyhop free?', 'Yes. It is free, runs in your browser and needs no download or sign-up.'],
    ],
  },
  {
    id: 'lumenfall',
    kind: 'external',
    name: 'Lumenfall',
    page: 'games/lumenfall.html',
    play: 'play/lumenfall/',
    thumb: 'assets/img/thumb-lumenfall.jpg',
    poster: 'assets/img/poster-lumenfall.jpg',
    og: 'assets/img/og-lumenfall.jpg',
    accent: 'var(--mint)',
    genre: '3D adventure',
    tagline: 'Explore a lost realm in 3D and gather nine crystals.',
    description: 'Lumenfall is a free 3D adventure that runs in your browser. Explore Crystal Valley, fight enemies, find nine energy crystals and reach the final portal.',
    controls: 'Move with WASD, look with the mouse, jump with Space and attack with a click.',
    keys: [
      ['<kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd>', 'Move'],
      ['Mouse', 'Look around'],
      ['<kbd>Shift</kbd>', 'Run'],
      ['<kbd>Space</kbd>', 'Jump'],
      ['Click', 'Attack'],
      ['<kbd>Esc</kbd>', 'Pause'],
    ],
    pointerNote: 'Lumenfall needs a keyboard and mouse, so it is built for desktop and laptop browsers.',
    tips: [
      'Collect all nine glowing crystals to open the final portal.',
      'Watch your health bar. Enemies hit harder as you go deeper into the realm.',
      'Check the mini-map in the corner to find crystals you have missed.',
    ],
    faq: [
      ['Can I play Lumenfall on my phone?', 'Lumenfall uses a keyboard and mouse with pointer lock, so it works best on a desktop or laptop in a current browser.'],
      ['What do I need to run Lumenfall?', 'A recent browser with WebGL 2. The first load downloads a few megabytes of game code and the character model.'],
    ],
  },
];

// ---------------------------------------------------------------------------
// Shared markup
// ---------------------------------------------------------------------------

const SHIP_PATHS = `<path d="M-6 18 L0 30 L6 18 Z" fill="#FF9F55"/>
<path d="M-8 -2 L-23 17 L-23 23 L-7 17 Z" fill="#FF6FC4"/>
<path d="M8 -2 L23 17 L23 23 L7 17 Z" fill="#FF6FC4"/>
<path d="M0 -25 L10 8 L8 21 L-8 21 L-10 8 Z" fill="#FFD23F"/>
<ellipse cx="0" cy="-1" rx="3.8" ry="7.5" fill="#0E0B2E"/>
<ellipse cx="-1" cy="-3" rx="1.3" ry="3" fill="#52F0B8"/>`;

const LOGO = `<svg viewBox="0 0 64 64" aria-hidden="true" focusable="false"><rect width="64" height="64" rx="16" fill="#2B2DDB"/><g transform="translate(32 33) scale(1.05)">${SHIP_PATHS}</g></svg>`;

const NAV = [
  { key: 'home', label: 'Home', href: 'index.html' },
  { key: 'games', label: 'Games', href: 'index.html#games' },
  { key: 'contact', label: 'Contact', href: 'contact.html' },
];

const abs = (path) => `${SITE.url}/${path.replace(/^\//, '')}`;
const esc = (t) => String(t).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const ld = (graph) => `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replace(/</g, '\\u003c')}</script>`;
const pageUrl = (file) => (file === 'index.html' ? `${SITE.url}/` : abs(file));

const ORG = {
  '@type': 'Organization',
  '@id': `${SITE.url}/#org`,
  name: SITE.name,
  url: `${SITE.url}/`,
  logo: abs('assets/img/icon-512.png'),
  founder: { '@type': 'Person', name: SITE.author },
  sameAs: [SITE.repo],
};
const WEBSITE = {
  '@type': 'WebSite',
  '@id': `${SITE.url}/#website`,
  url: `${SITE.url}/`,
  name: SITE.name,
  description: 'Free browser games: Starfall, Brick Rally, Serpentine, Skyhop and Lumenfall.',
  inLanguage: 'en',
  publisher: { '@id': `${SITE.url}/#org` },
};

const crumbs = (items) => ({
  '@type': 'BreadcrumbList',
  itemListElement: items.map(([name, url], i) => ({ '@type': 'ListItem', position: i + 1, name, item: url })),
});
const faqLd = (faq) => ({
  '@type': 'FAQPage',
  mainEntity: faq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
});
const gameLd = (g) => ({
  '@type': 'VideoGame',
  '@id': `${abs(g.page)}#game`,
  name: g.name,
  url: abs(g.page),
  description: g.description,
  image: abs(g.og),
  genre: g.genre,
  gamePlatform: 'Web browser',
  applicationCategory: 'Game',
  operatingSystem: 'Any',
  inLanguage: 'en',
  playMode: 'SinglePlayer',
  isAccessibleForFree: true,
  author: { '@type': 'Person', name: SITE.author },
  publisher: { '@id': `${SITE.url}/#org` },
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD', availability: 'https://schema.org/InStock' },
});

function shell({ file, title, description, active, current, body, scripts = [], image, graph = [], robots }) {
  const depth = file.split('/').length - 1;
  const base = '../'.repeat(depth);
  const h = (path) => base + path;
  const asset = (path) => `${h(path)}?v=${ver(path)}`;
  const pageTitle = title === SITE.name ? `${SITE.name}: free browser games, no download` : `${title} | ${SITE.name}`;
  const url = pageUrl(file);
  const img = abs(image || 'assets/img/og-home.png');
  const imgIsJpg = img.endsWith('.jpg');
  const desc = esc(description);

  const navLink = (item) =>
    `<a href="${h(item.href)}"${item.key === active ? ' aria-current="page"' : ''}>${item.label}</a>`;

  const library = GAMES.map(
    (g) => `<li>
          <a class="lib-item" href="${h(g.page)}"${g.id === current ? ' aria-current="page"' : ''}>
            <img class="lib-item__thumb" src="${h(g.thumb)}" alt="" width="64" height="40">
            <span class="lib-item__text">
              <span class="lib-item__name">${g.name}</span>
              <span class="lib-item__best" data-best="${g.id}">No score yet</span>
            </span>
          </a>
        </li>`
  ).join('\n        ');

  const footerGames = GAMES.map((g) => `<li><a href="${h(g.page)}">${g.name}</a></li>`).join('\n            ');

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(pageTitle)}</title>
  <meta name="description" content="${desc}">
  <meta name="robots" content="${robots || 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'}">
  <meta name="author" content="${SITE.author}">
  <meta name="theme-color" content="#0E0B2E">
  <link rel="canonical" href="${url}">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="${SITE.name}">
  <meta property="og:locale" content="en_US">
  <meta property="og:url" content="${url}">
  <meta property="og:title" content="${esc(pageTitle)}">
  <meta property="og:description" content="${desc}">
  <meta property="og:image" content="${img}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:type" content="${imgIsJpg ? 'image/jpeg' : 'image/png'}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(pageTitle)}">
  <meta name="twitter:description" content="${desc}">
  <meta name="twitter:image" content="${img}">
  <link rel="icon" href="${h('assets/img/favicon.svg')}" type="image/svg+xml">
  <link rel="icon" href="${h('assets/img/favicon-48.png')}" type="image/png" sizes="48x48">
  <link rel="apple-touch-icon" href="${h('assets/img/apple-touch-icon.png')}">
  <link rel="manifest" href="${h('manifest.webmanifest')}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600..800&family=Instrument+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="${asset('assets/css/site.css')}">
  ${ld([ORG, WEBSITE, ...graph])}
</head>
<body>
  <a class="skip-link" href="#main">Skip to content</a>

  <header class="site-header">
    <button class="menu-toggle" type="button" aria-controls="sidebar" aria-expanded="false" aria-label="Open game library">
      <span class="menu-toggle__bars"></span>
    </button>
    <a class="brand" href="${h('index.html')}">${LOGO}<span>${SITE.name}</span></a>
    <nav class="menu" aria-label="Main">
      ${NAV.map(navLink).join('\n      ')}
    </nav>
  </header>

  <div class="shell">
    <aside class="sidebar" id="sidebar" aria-label="Game library">
      <nav class="sidebar__site" aria-label="Site">
        ${NAV.map(navLink).join('\n        ')}
      </nav>
      <p class="sidebar__title">Game library</p>
      <ul class="library">
        ${library}
      </ul>
      <div class="sidebar__foot">
        <p>Best scores are saved in this browser only.</p>
        <a href="${h('contact.html')}">Suggest a game</a>
      </div>
    </aside>
    <div class="scrim" hidden></div>

    <main class="main" id="main">
${body}
    </main>
  </div>

  <footer class="site-footer">
    <div class="footer__grid">
      <div class="footer__brand">
        <a class="brand" href="${h('index.html')}">${LOGO}<span>${SITE.name}</span></a>
        <p>Small, fast games that run in your browser. No downloads and no sign-up.</p>
      </div>
      <div class="footer__col">
        <h2>Explore</h2>
        <ul class="footer__list">
          ${NAV.map((n) => `<li><a href="${h(n.href)}">${n.label}</a></li>`).join('\n          ')}
        </ul>
      </div>
      <div class="footer__col">
        <h2>Games</h2>
        <ul class="footer__list">
            ${footerGames}
        </ul>
      </div>
      <div class="footer__col">
        <h2>Elsewhere</h2>
        <ul class="footer__list">
          <li><a href="${SITE.repo}">Source on GitHub</a></li>
          <li><a href="${SITE.repo}/issues">Report a bug</a></li>
          <li><a href="${h('llms.txt')}">For AI assistants</a></li>
        </ul>
      </div>
    </div>
    <div class="footer__base">
      <span>© ${SITE.year} ${SITE.name}. Built by ${SITE.author}.</span>
      <span>Your scores never leave this device.</span>
    </div>
  </footer>

  <script src="${asset('assets/js/site.js')}" defer></script>
${scripts.map((s) => `  <script src="${asset(s)}" defer></script>`).join('\n')}
</body>
</html>
`;
}

// ---------------------------------------------------------------------------
// Pages
// ---------------------------------------------------------------------------

const faqHtml = (faq, title = 'Frequently asked questions') =>
  `<section class="faq" aria-labelledby="faq-title">
          <h2 id="faq-title">${title}</h2>
          ${faq.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('\n          ')}
        </section>`;

const HOME_FAQ = [
  ['What is Kanwar Arcade?', 'Kanwar Arcade is a free collection of five browser games: Starfall, Brick Rally, Serpentine, Skyhop and Lumenfall. They run on any modern device with no download, no account and no ads.'],
  ['Are the games really free?', 'Yes. Every game is free, there are no in-app purchases and nothing to install.'],
  ['Do the games work on a phone?', 'Starfall, Brick Rally, Serpentine and Skyhop work with touch as well as keyboard and mouse. Lumenfall is a 3D game that needs a keyboard and mouse, so it is best on a desktop or laptop.'],
  ['Where are my high scores saved?', 'Best scores are saved in your own browser with local storage. They never leave your device and there is no account to make.'],
  ['Which game should I try first?', 'Try Starfall for fast action, Skyhop for a one-tap challenge, Serpentine for a classic with a twist, and Lumenfall for a 3D adventure.'],
];

function homePage() {
  const cards = GAMES.map(
    (g) => `        <article class="game-card" style="--accent: ${g.accent}">
          <a class="game-card__media" href="${g.page}" tabindex="-1" aria-hidden="true">
            <img src="${g.thumb}" alt="" width="640" height="400" loading="lazy">
          </a>
          <div class="game-card__body">
            <span class="tag">${g.genre}</span>
            <h3><a href="${g.page}">${g.name}</a></h3>
            <p>${g.tagline}</p>
            <p class="game-card__controls">${g.controls}</p>
            <div class="game-card__foot">
              <a class="btn" href="${g.page}">Play ${g.name}</a>
              <span class="best" data-best="${g.id}" data-prefix="Your best: ">${g.kind === 'external' ? 'Collect nine crystals' : 'No score yet'}</span>
            </div>
          </div>
        </article>`
  ).join('\n');

  const body = `      <section class="hero" aria-labelledby="hero-title">
        <div class="hero__inner">
          <div class="hero__copy">
            <h1 id="hero-title">
              <span class="hero__line"><span>Pick a game.</span></span>
              <span class="hero__line"><span>Beat your best.</span></span>
            </h1>
            <p class="hero__lede">Five free games that run right in your browser: a space shooter, a brick breaker, a snake game, a one-tap flyer and a 3D adventure. No downloads, no sign-up, and your best scores stay on this device.</p>
            <div class="hero__actions">
              <a class="btn" href="games/starfall.html">Play Starfall</a>
              <a class="btn btn--ghost" href="games/lumenfall.html">Explore Lumenfall in 3D</a>
            </div>
          </div>
          <div class="hero__visual" aria-hidden="true">
            <div class="screen"><canvas id="hero-canvas" width="560" height="420"></canvas></div>
            <svg class="hero__sticker" viewBox="-30 -30 60 66" focusable="false">${SHIP_PATHS}</svg>
          </div>
        </div>
      </section>

      <section class="section" id="games" aria-labelledby="games-title">
        <div class="container">
          <h2 class="section__title" id="games-title">Choose your game</h2>
          <div class="game-grid">
${cards}
          </div>
        </div>
      </section>

      <section class="band section" aria-labelledby="band-title">
        <div class="container">
          <h2 class="section__title" id="band-title">Built for quick rounds</h2>
          <ul class="band__list">
            <li>
              <h3>Plays anywhere</h3>
              <p>Keyboard, mouse or touch. Each 2D game scales to fit your screen, from phone to desktop.</p>
            </li>
            <li>
              <h3>Scores stay with you</h3>
              <p>Your best score is saved in this browser. There is no account to make.</p>
            </li>
            <li>
              <h3>Nothing to install</h3>
              <p>Pages load once and run on your device, so a new round starts the moment you want it.</p>
            </li>
          </ul>
        </div>
      </section>

      <section class="section" aria-labelledby="about-title">
        <div class="container">
          <div class="answer">
            <h2 id="about-title">What is Kanwar Arcade?</h2>
            <p>Kanwar Arcade is a free set of browser games made by ${SITE.author}. It has ${GAMES.length} games: ${GAMES.map((g) => `${g.name} (${g.genre.toLowerCase()})`).join(', ')}. Every game runs in a web page with no download, account or ads.</p>
          </div>
          ${faqHtml(HOME_FAQ)}
        </div>
      </section>`;

  return shell({
    file: 'index.html',
    title: SITE.name,
    description: 'Play five free browser games: Starfall, Brick Rally, Serpentine, Skyhop and the 3D adventure Lumenfall. No downloads, no sign-up.',
    active: 'home',
    body,
    scripts: ['assets/js/hero.js'],
    graph: [
      {
        '@type': 'CollectionPage',
        '@id': `${SITE.url}/#page`,
        url: `${SITE.url}/`,
        name: `${SITE.name}: free browser games`,
        isPartOf: { '@id': `${SITE.url}/#website` },
        primaryImageOfPage: abs('assets/img/og-home.png'),
        speakable: { '@type': 'SpeakableSpecification', cssSelector: ['#hero-title', '.hero__lede', '#about-title + p'] },
      },
      {
        '@type': 'ItemList',
        name: 'Games',
        itemListElement: GAMES.map((g, i) => ({ '@type': 'ListItem', position: i + 1, url: abs(g.page), name: g.name })),
      },
      faqLd(HOME_FAQ),
    ],
  });
}

function nextCard(next) {
  return `<div class="next-game">
          <h2>Try another game</h2>
          <div class="game-grid">
            <article class="game-card" style="--accent: ${next.accent}">
              <a class="game-card__media" href="../${next.page}" tabindex="-1" aria-hidden="true">
                <img src="../${next.thumb}" alt="" width="640" height="400" loading="lazy">
              </a>
              <div class="game-card__body">
                <span class="tag">${next.genre}</span>
                <h3><a href="../${next.page}">${next.name}</a></h3>
                <p>${next.tagline}</p>
                <div class="game-card__foot">
                  <a class="btn" href="../${next.page}">Play ${next.name}</a>
                </div>
              </div>
            </article>
          </div>
        </div>`;
}

function howTo(game) {
  const keys = game.keys.map(([dt, dd]) => `<div><dt>${dt}</dt><dd>${dd}</dd></div>`).join('\n            ');
  const tips = game.tips.map((t) => `<li>${t}</li>`).join('\n            ');
  return `<aside class="howto" aria-labelledby="howto-title">
            <h2 id="howto-title">How to play</h2>
            <dl class="keys">
            ${keys}
            </dl>
            <p style="margin-top:1rem;color:var(--muted)">${game.pointerNote}</p>
            <h3>Tips</h3>
            <ul>
            ${tips}
            </ul>
          </aside>`;
}

const gameGraph = (game) => [
  gameLd(game),
  faqLd(game.faq),
  crumbs([['Home', `${SITE.url}/`], ['Games', `${SITE.url}/#games`], [game.name, abs(game.page)]]),
];

function gamePage(game, next) {
  const hudItems = [
    `<div class="hud__item"><span class="hud__label">Score</span><span class="hud__value" id="hud-score">0</span></div>`,
    `<div class="hud__item"><span class="hud__label">Best</span><span class="hud__value" id="hud-best">0</span></div>`,
    ...game.hud.map(
      (i) => `<div class="hud__item"><span class="hud__label">${i.label}</span><span class="hud__value" id="${i.id}">${i.value}</span></div>`
    ),
    game.lives === false
      ? ''
      : `<div class="hud__item"><span class="hud__label">Lives</span><span class="pips" id="hud-lives" role="img" aria-label="3 lives left"></span></div>`,
  ].filter(Boolean).join('\n          ');

  const body = `      <div class="page-head page-head--game">
        <div class="page-head__inner">
          <span class="tag">${game.genre}</span>
          <h1>${game.name}</h1>
          <p>${game.tagline}</p>
        </div>
      </div>

      <section class="section section--game" aria-label="Play ${game.name}">
        <div class="stage">
          <div class="cabinet" style="--ar: ${game.aspect}; --accent: ${game.accent}">
            <div class="hud">
          ${hudItems}
            </div>
            <div class="cabinet__screen">
              <canvas id="game" width="${game.width}" height="${game.height}" role="img" aria-label="${game.name} game screen"></canvas>
              <div class="overlay" id="overlay" role="dialog" aria-labelledby="overlay-title" aria-describedby="overlay-text">
                <h2 id="overlay-title">${game.name}</h2>
                <p id="overlay-text">${game.controls}</p>
                <button class="btn" id="overlay-btn" type="button">Start game</button>
              </div>
              <noscript><p style="padding:1rem">${game.name} needs JavaScript. Turn it on in your browser to play.</p></noscript>
            </div>
            <div class="toolbar">
              <button class="btn btn--tool" id="btn-pause" type="button">Pause</button>
              <button class="btn btn--tool" id="btn-sound" type="button" aria-pressed="true">Sound on</button>
              <button class="btn btn--tool" id="btn-music" type="button" aria-pressed="true">Music on</button>
              <button class="btn btn--tool" id="btn-full" type="button">Fullscreen</button>
              ${game.extraTool}
            </div>
          </div>

          ${howTo(game)}
        </div>

        <div class="answer">
          <h2>About ${game.name}</h2>
          <p>${game.description} ${game.controls}</p>
        </div>
        ${faqHtml(game.faq)}

        ${nextCard(next)}
      </section>`;

  return shell({
    file: game.page,
    title: game.name,
    description: game.description,
    active: 'games',
    current: game.id,
    body,
    scripts: ['assets/js/common.js', game.script],
    image: game.og,
    graph: gameGraph(game),
  });
}

function externalGamePage(game, next) {
  const body = `      <div class="page-head page-head--game">
        <div class="page-head__inner">
          <span class="tag">${game.genre}</span>
          <h1>${game.name}</h1>
          <p>${game.tagline}</p>
        </div>
      </div>

      <section class="section section--game" aria-label="Play ${game.name}">
        <p class="notice">${game.name} is a 3D game for desktop and laptop browsers. You need a keyboard and mouse. The first load downloads a few megabytes.</p>
        <div class="poster" style="--accent: ${game.accent}">
          <img src="../${game.poster}" alt="${game.name}: a hero with a glowing sword in Crystal Valley, with floating energy crystals" width="1280" height="720">
          <div class="poster__cta">
            <h2>${game.name}: The Lost Realm</h2>
            <p>${game.controls}</p>
            <a class="btn" href="../${game.play}">Play ${game.name} now</a>
          </div>
        </div>
        <div class="stage">
          <div class="answer" style="margin:0">
            <h2>About ${game.name}</h2>
            <p>${game.description} It is built with Three.js, React and a physics engine, and everything you see is generated in your browser.</p>
          </div>
          ${howTo(game)}
        </div>
        ${faqHtml(game.faq)}

        ${nextCard(next)}
      </section>`;

  return shell({
    file: game.page,
    title: game.name,
    description: game.description,
    active: 'games',
    current: game.id,
    body,
    image: game.og,
    graph: gameGraph(game),
  });
}

function contactPage() {
  const body = `      <div class="page-head">
        <div class="page-head__inner">
          <h1>Contact</h1>
          <p>Found a bug, have an idea for a new game, or just want to say hi? Send a note below.</p>
        </div>
      </div>

      <section class="section" aria-label="Contact form">
        <div class="contact">
          <form class="form" id="contact-form" novalidate>
            <div class="field">
              <label for="c-name">Your name</label>
              <input id="c-name" name="name" type="text" autocomplete="name" aria-describedby="c-name-error" required>
              <span class="field__error" id="c-name-error"></span>
            </div>
            <div class="field" id="field-email" hidden>
              <label for="c-email">Email address</label>
              <input id="c-email" name="email" type="email" autocomplete="email" aria-describedby="c-email-error">
              <span class="field__error" id="c-email-error"></span>
            </div>
            <div class="field">
              <label for="c-topic">What is this about?</label>
              <select id="c-topic" name="topic">
                <option>Feedback</option>
                <option>Bug report</option>
                <option>Game idea</option>
                <option>Something else</option>
              </select>
            </div>
            <div class="field">
              <label for="c-message">Message</label>
              <textarea id="c-message" name="message" aria-describedby="c-message-error" required></textarea>
              <span class="field__error" id="c-message-error"></span>
            </div>
            <p class="form__notice" id="contact-notice">This form opens a public GitHub issue with your message already filled in. Your name and message will be visible to everyone, so leave out private details.</p>
            <div>
              <button class="btn" type="submit">Send message</button>
            </div>
            <p class="form__status" id="contact-status" role="status" aria-live="polite"></p>
            <noscript><p>The form needs JavaScript. You can also <a href="${SITE.repo}/issues/new">open an issue on GitHub</a>.</p></noscript>
          </form>

          <aside class="contact__side">
            <h2>Other ways to reach me</h2>
            <ul>
              <li><a href="${SITE.repo}/issues">Open an issue on GitHub</a> for bugs and feature ideas.</li>
              <li><a href="${SITE.repo}">Read the source code</a> to see how the games are built.</li>
              <li>Tell me which game you want next, and what makes it fun to you.</li>
            </ul>
          </aside>
        </div>
      </section>`;

  return shell({
    file: 'contact.html',
    title: 'Contact',
    description: 'Send feedback, report a bug or suggest a game for Kanwar Arcade.',
    active: 'contact',
    body,
    scripts: ['assets/js/contact.js'],
    graph: [
      { '@type': 'ContactPage', url: abs('contact.html'), name: 'Contact', isPartOf: { '@id': `${SITE.url}/#website` } },
      crumbs([['Home', `${SITE.url}/`], ['Contact', abs('contact.html')]]),
    ],
  });
}

function notFoundPage() {
  // Root-absolute paths so the page works at any URL depth.
  const html = shell({
    file: 'index.html',
    title: 'Page not found',
    description: 'That page does not exist. Pick a game from the Kanwar Arcade library.',
    active: '',
    robots: 'noindex, follow',
    body: `      <div class="page-head">
        <div class="page-head__inner">
          <h1>That page is missing</h1>
          <p>The link may be old or mistyped. Pick a game below or head back to the home page.</p>
          <p><a class="btn" href="/">Back to home</a></p>
        </div>
      </div>`,
  });
  return html
    .replace(/(href|src)="(?!https?:|#|\/)([^"]+)"/g, '$1="/$2"')
    .replace(/<link rel="canonical"[^>]*>\n\s*/, '')
    .replace(/<meta property="og:url"[^>]*>\n\s*/, '');
}

// ---------------------------------------------------------------------------
// Site files for search engines, AI assistants and installs
// ---------------------------------------------------------------------------

const today = new Date().toISOString().slice(0, 10);

function sitemap() {
  const urls = [
    { loc: `${SITE.url}/`, pri: '1.0', img: 'assets/img/og-home.png' },
    ...GAMES.map((g) => ({ loc: abs(g.page), pri: '0.9', img: g.og, title: g.name })),
    { loc: abs('contact.html'), pri: '0.3' },
  ];
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls.map((u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${today}</lastmod>
    <priority>${u.pri}</priority>${u.img ? `\n    <image:image><image:loc>${abs(u.img)}</image:loc>${u.title ? `<image:title>${esc(u.title)}</image:title>` : ''}</image:image>` : ''}
  </url>`).join('\n')}
</urlset>
`;
}

const robots = () => `# ${SITE.name}: everyone, including AI search crawlers, is welcome.
User-agent: *
Allow: /

User-agent: GPTBot
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Claude-SearchBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: Applebot-Extended
Allow: /

Sitemap: ${SITE.url}/sitemap.xml
`;

const llms = () => `# ${SITE.name}

> Free browser games by ${SITE.author}. ${GAMES.length} games, no downloads, no accounts, no ads. Scores are saved only in the player's own browser.

## Games
${GAMES.map((g) => `- [${g.name}](${abs(g.page)}): ${g.description}`).join('\n')}

## Site
- [Home](${SITE.url}/): all games in one place
- [Contact](${abs('contact.html')}): feedback and bug reports (opens a public GitHub issue)
- [Source code](${SITE.repo}): MIT-style open project on GitHub
- [Full text for AI assistants](${abs('llms-full.txt')})
`;

const llmsFull = () => `# ${SITE.name}: full guide

${SITE.name} is a free collection of browser games made by ${SITE.author}. Games run in any modern browser with no download, account or advertising. Best scores are stored in the browser's local storage and never sent anywhere.

${GAMES.map((g) => `## ${g.name} (${g.genre})
URL: ${abs(g.page)}
${g.description}
Controls: ${g.controls}
${g.pointerNote}
${g.keys.map(([k, v]) => `- ${k.replace(/<[^>]+>/g, '')}: ${v}`).join('\n')}
Tips:
${g.tips.map((t) => `- ${t.replace(/<[^>]+>/g, '')}`).join('\n')}
FAQ:
${g.faq.map(([q, a]) => `Q: ${q}\nA: ${a}`).join('\n')}
`).join('\n')}
## General FAQ
${HOME_FAQ.map(([q, a]) => `Q: ${q}\nA: ${a}`).join('\n')}
`;

const manifest = () => JSON.stringify({
  name: SITE.name,
  short_name: 'Arcade',
  description: 'Free browser games: Starfall, Brick Rally, Serpentine, Skyhop and Lumenfall.',
  start_url: '/?source=pwa',
  scope: '/',
  display: 'standalone',
  orientation: 'any',
  background_color: '#0E0B2E',
  theme_color: '#0E0B2E',
  categories: ['games', 'entertainment'],
  icons: [
    { src: '/assets/img/icon-192.png', sizes: '192x192', type: 'image/png' },
    { src: '/assets/img/icon-512.png', sizes: '512x512', type: 'image/png' },
    { src: '/assets/img/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
  ],
  shortcuts: GAMES.map((g) => ({ name: g.name, url: `/${g.page}` })),
}, null, 2);

// Offline cache for the small 2D games. The large 3D game is left to the network.
const serviceWorker = () => {
  const core = ['/', '/index.html', '/contact.html', '/404.html', ...GAMES.map((g) => `/${g.page}`)];
  const files = readdirSync(join(ROOT, 'assets'), { recursive: true })
    .filter((f) => /\.(css|js|svg|png)$/.test(f) && !/(^|\/)(og-|poster-)/.test(f))
    .map((f) => `/assets/${f}`);
  const stamp = createHash('md5').update(files.map((f) => ver(f.slice(1))).join('')).digest('hex').slice(0, 8);
  return `/* Generated by scripts/build.mjs. Do not edit. */
const CACHE = 'kanwar-arcade-${stamp}';
const PRECACHE = ${JSON.stringify([...core, ...files])};

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(PRECACHE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  const req = e.request;
  const url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== location.origin || url.pathname.startsWith('/play/')) return;
  if (req.mode === 'navigate') {
    e.respondWith(fetch(req).then((r) => { const c = r.clone(); caches.open(CACHE).then((x) => x.put(req, c)); return r; })
      .catch(() => caches.match(req).then((r) => r || caches.match('/index.html'))));
    return;
  }
  e.respondWith(caches.match(req, { ignoreSearch: true }).then((hit) => hit || fetch(req).then((r) => {
    if (r.ok) { const c = r.clone(); caches.open(CACHE).then((x) => x.put(req, c)); }
    return r;
  })));
});
`;
};

const SECURITY = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=()' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'wasm-unsafe-eval'",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com data:",
      "img-src 'self' data: blob:",
      "media-src 'self' blob: data:",
      "connect-src 'self' data: blob:",
      "worker-src 'self' blob:",
      "manifest-src 'self'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'self'",
    ].join('; '),
  },
];

const vercelJson = () => JSON.stringify({
  $schema: 'https://openapi.vercel.sh/vercel.json',
  trailingSlash: false,
  headers: [
    { source: '/(.*)', headers: SECURITY },
    { source: '/assets/(css|js)/(.*)', headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }] },
    { source: '/assets/img/(.*)', headers: [{ key: 'Cache-Control', value: 'public, max-age=86400, stale-while-revalidate=604800' }] },
    { source: '/play/lumenfall/assets/(.*)', headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }] },
    { source: '/play/lumenfall/models/(.*)', headers: [{ key: 'Cache-Control', value: 'public, max-age=86400' }] },
    { source: '/sw.js', headers: [{ key: 'Cache-Control', value: 'no-cache' }, { key: 'Service-Worker-Allowed', value: '/' }] },
    { source: '/(sitemap.xml|robots.txt|llms.txt|llms-full.txt)', headers: [{ key: 'Cache-Control', value: 'public, max-age=3600' }] },
    { source: '/manifest.webmanifest', headers: [{ key: 'Content-Type', value: 'application/manifest+json' }] },
  ],
}, null, 2);

// ---------------------------------------------------------------------------
// Write files
// ---------------------------------------------------------------------------

const pages = {
  'index.html': homePage(),
  'contact.html': contactPage(),
  '404.html': notFoundPage(),
  'sitemap.xml': sitemap(),
  'robots.txt': robots(),
  'llms.txt': llms(),
  'llms-full.txt': llmsFull(),
  'manifest.webmanifest': manifest(),
  'sw.js': serviceWorker(),
  'vercel.json': vercelJson() + '\n',
  [`${SITE.indexNowKey}.txt`]: SITE.indexNowKey + '\n',
};
GAMES.forEach((g, i) => {
  const next = GAMES[(i + 1) % GAMES.length];
  pages[g.page] = g.kind === 'external' ? externalGamePage(g, next) : gamePage(g, next);
});

for (const [file, content] of Object.entries(pages)) {
  const out = join(ROOT, file);
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, content);
  console.log('wrote', file);
}
