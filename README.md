# YOCIM NEXUS

A cyberpunk-style personal hub that brings together my projects and tools. Built with Vue 3 and Vite.

## Features

- Animated particle background, custom cursor, and an optional boot animation
- Cards for all live sub-sites (order and content are defined in `src/data/sites.js`)
- Sidebar with instant search, GitHub link, and email shortcut
- Responsive layout for desktop and mobile
- Basic SEO files: `robots.txt` and `sitemap.xml`

## Sites

- [YOCIM AGENT](https://agent.yocim.top) — local-first desktop AI coding assistant
- [XIYUE-AI](https://xiyue.yocim.top) — AI chat assistant
- [Audio-Cutter](https://audio.yocim.top) — online audio editor
- [Workbench](https://workbench.yocim.top) — developer utilities
- [System](https://system.yocim.top) — cyberpunk desktop simulation
- [Links](https://links.yocim.top) — curated resource navigation
- [Zombie-2](https://zombie.yocim.top) — turn-based survival game

## Development

```bash
npm install
npm run dev      # start the local dev server
npm run build    # build for production
npm run lint     # check code style
```

## Deployment

Pushes to the `main` branch trigger a GitHub Actions workflow that builds the site and deploys it to GitHub Pages at [yocim.top](https://yocim.top).
