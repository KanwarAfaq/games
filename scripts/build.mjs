// Generates the static HTML pages for Kanwar Arcade.
// Run from the repo root:  node scripts/build.mjs
// The generated .html files are committed, so Vercel can serve them as-is
// (no build step needed).

import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

const SITE = {
  name: 'Kanwar Arcade',
  author: 'Kanwar Afaq',
  repo: 'https://github.com/KanwarAfaq/games',
  year: 2026,
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

function shell({ file, title, description, active, current, body, scripts = [] }) {
  const depth = file.split('/').length - 1;
  const base = '../'.repeat(depth);
  const h = (path) => base + path;
  const pageTitle = title === SITE.name ? `${SITE.name}: free browser games` : `${title} | ${SITE.name}`;

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
  <title>${pageTitle}</title>
  <meta name="description" content="${description}">
  <meta name="theme-color" content="#0E0B2E">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="${SITE.name}">
  <meta property="og:title" content="${pageTitle}">
  <meta property="og:description" content="${description}">
  <meta name="twitter:card" content="summary">
  <link rel="icon" href="${h('assets/img/favicon.svg')}" type="image/svg+xml">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600..800&family=Instrument+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="${h('assets/css/site.css')}">
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
        <p>Small, fast arcade games that run in your browser. No downloads and no sign-up.</p>
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
        </ul>
      </div>
    </div>
    <div class="footer__base">
      <span>© ${SITE.year} ${SITE.name}. Built by ${SITE.author}.</span>
      <span>Your scores never leave this device.</span>
    </div>
  </footer>

  <script src="${h('assets/js/site.js')}" defer></script>
${scripts.map((s) => `  <script src="${h(s)}" defer></script>`).join('\n')}
</body>
</html>
`;
}

// ---------------------------------------------------------------------------
// Pages
// ---------------------------------------------------------------------------

function homePage() {
  const cards = GAMES.map(
    (g) => `        <article class="game-card" style="--accent: ${g.accent}">
          <a class="game-card__media" href="${g.page}" tabindex="-1" aria-hidden="true">
            <img src="${g.thumb}" alt="" width="640" height="400" loading="lazy">
          </a>
          <div class="game-card__body">
            <h3><a href="${g.page}">${g.name}</a></h3>
            <p>${g.tagline}</p>
            <p class="game-card__controls">${g.controls}</p>
            <div class="game-card__foot">
              <a class="btn" href="${g.page}">Play ${g.name}</a>
              <span class="best" data-best="${g.id}" data-prefix="Your best: ">No score yet</span>
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
            <p class="hero__lede">Starfall and Brick Rally run right in your browser. No downloads, no sign-up, and your best scores stay on this device.</p>
            <div class="hero__actions">
              <a class="btn" href="games/starfall.html">Play Starfall</a>
              <a class="btn btn--ghost" href="games/brick-rally.html">Play Brick Rally</a>
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
              <p>Keyboard, mouse or touch. Each game scales to fit your screen, from phone to desktop.</p>
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
      </section>`;

  return shell({
    file: 'index.html',
    title: SITE.name,
    description: 'Play Starfall and Brick Rally, two free arcade games that run in your browser. No downloads, no sign-up.',
    active: 'home',
    body,
    scripts: ['assets/js/hero.js'],
  });
}

function gamePage(game, next) {
  const hudItems = [
    `<div class="hud__item"><span class="hud__label">Score</span><span class="hud__value" id="hud-score">0</span></div>`,
    `<div class="hud__item"><span class="hud__label">Best</span><span class="hud__value" id="hud-best">0</span></div>`,
    ...game.hud.map(
      (i) => `<div class="hud__item"><span class="hud__label">${i.label}</span><span class="hud__value" id="${i.id}">${i.value}</span></div>`
    ),
    `<div class="hud__item"><span class="hud__label">Lives</span><span class="pips" id="hud-lives" role="img" aria-label="3 lives left"></span></div>`,
  ].join('\n          ');

  const keys = game.keys.map(([dt, dd]) => `<div><dt>${dt}</dt><dd>${dd}</dd></div>`).join('\n            ');
  const tips = game.tips.map((t) => `<li>${t}</li>`).join('\n            ');

  const body = `      <div class="page-head page-head--game">
        <div class="page-head__inner">
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
              ${game.extraTool}
            </div>
          </div>

          <aside class="howto" aria-labelledby="howto-title">
            <h2 id="howto-title">How to play</h2>
            <dl class="keys">
            ${keys}
            </dl>
            <p style="margin-top:1rem;color:var(--muted)">${game.pointerNote}</p>
            <h3>Tips</h3>
            <ul>
            ${tips}
            </ul>
          </aside>
        </div>

        <div class="next-game">
          <h2>Try another game</h2>
          <div class="game-grid">
            <article class="game-card" style="--accent: ${next.accent}">
              <a class="game-card__media" href="../${next.page}" tabindex="-1" aria-hidden="true">
                <img src="../${next.thumb}" alt="" width="640" height="400" loading="lazy">
              </a>
              <div class="game-card__body">
                <h3><a href="../${next.page}">${next.name}</a></h3>
                <p>${next.tagline}</p>
                <div class="game-card__foot">
                  <a class="btn" href="../${next.page}">Play ${next.name}</a>
                  <span class="best" data-best="${next.id}" data-prefix="Your best: ">No score yet</span>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>`;

  return shell({
    file: game.page,
    title: game.name,
    description: game.description,
    active: 'games',
    current: game.id,
    body,
    scripts: ['assets/js/common.js', game.script],
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
  });
}

// ---------------------------------------------------------------------------
// Write files
// ---------------------------------------------------------------------------

const pages = {
  'index.html': homePage(),
  'contact.html': contactPage(),
};
GAMES.forEach((g, i) => {
  pages[g.page] = gamePage(g, GAMES[(i + 1) % GAMES.length]);
});

for (const [file, html] of Object.entries(pages)) {
  const out = join(ROOT, file);
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, html);
  console.log('wrote', file);
}
