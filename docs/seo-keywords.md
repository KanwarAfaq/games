# Kanwar Arcade — keyword and article SEO plan

Search intent comes first. These are **descriptive candidate phrases**, not verified search-volume or ranking claims. Validate priorities with Google Search Console when its domain property is connected; do not stuff keywords into the obsolete `meta keywords` tag (Google ignores it).

| Game | Main descriptive search phrase | Supporting reader intent |
|---|---|---|
| Starfall | free space shooter browser game | shoot-em-up game online, space arcade game no download |
| Brick Rally | free brick breaker game online | classic breakout-style game, paddle brick game |
| Serpentine | free snake game online | snake game with keyboard and swipe, no download |
| Skyhop | one-tap flying game online | flappy arcade game, free mobile browser game |
| Lightmerge | free 2048 puzzle game online | sliding number tiles, 2048 browser puzzle |
| Driftrock | free asteroids shooter online | space rocks arcade game, retro space shooter |
| Lumenfall | free 3D fantasy browser adventure | webgl fantasy adventure, keyboard and mouse exploration |
| Neon Velocity | free 3D car racing browser game | neon arcade racing, nitro drift game |
| Starfall Protocol | free 3D top down shooter game | sci-fi survival shooter, browser shooting game |
| Aether Run | free neon hover racing game | futuristic racing browser game, boost and steer |
| Moonlit Grove | free fantasy survival browser game | magical arena survival, waves of enemies |
| Park Dash | free kids running race browser game | jump hurdles running game, mobile kids runner |
| Serpent Studio | free customizable snake game | classic snake modes, maze and sprint snake |

## Editorial / Google Search guidelines

- Write unique titles, concise natural meta descriptions, one visible H1, and genuinely useful game instructions; mention difficulty, controls, device requirements, restart/pause, and accessibility where applicable.
- Avoid generating repetitive doorway pages for variants with no difference in gameplay; create one canonical URL for each distinct game.
- Add original instructions, screenshots with helpful alt text, and troubleshooting guidance when they exist. Do not invent level counts, features or compatibility.
- Use WebSite/CollectionPage on the game collection and VideoGame/BreadcrumbList on specific games only when the marked-up data matches visible page content.
- Serve HTTP 200 on actual pages, keep individual games discoverable through plain HTML links and include canonical URLs in XML sitemap. Google indexing is not guaranteed by submitting a sitemap.
- Keep all heavy Three.js/WebGL game assets on the separate games origin and load them only after user action. This prevents 3D game bundles from increasing AnyTool's main page JavaScript.
- Avoid misleading publication/update dates; include dateModified only for meaningful actual changes.
- Add accessibility descriptions and keyboard/mobile guidance based on tested implementation; don't claim every 3D game runs well on phones.
- Review Google Search Central documentation on [helpful content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content), [spam policies](https://developers.google.com/search/docs/essentials/spam-policies) and [title links](https://developers.google.com/search/docs/appearance/title-link).

## Integration

Primary public game directory: https://games-psi-ashy.vercel.app/

AnyTool collection: https://anytool.online/games

AnyTool's own indexable pages link to the original game pages, but game code remains remote. The original game website retains its own canonical URLs; avoid claiming that those canonical pages are the same content as the AnyTool introduction/launcher pages.

## Measurement

Track GSC query impressions, clicks and CTR per game and impressions for the collection. Check Google-selected canonical for any excluded page; no mass indexing submission or artificial backlinks. Monitor LCP/INP for AnyTool homepage separately from each heavy 3D game.
