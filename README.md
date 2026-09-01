# Jacob Elcharar — Portfolio

Personal portfolio site for Jacob Elcharar, Android Software Engineer & Fullstack Developer.

**Live:** https://jacobs-glassmorphism-portfolio.netlify.app

## Stack

React 18 · TypeScript · Vite 5 · Tailwind CSS 3 · Framer Motion

## Development

```bash
npm install
npm run dev       # dev server
npm run build     # typecheck + production build to dist/
npm run preview   # serve the production build
npm run lint      # eslint, zero warnings allowed
```

## Verification

```bash
node scripts/verify-all.mjs      # runs the full suite
```

| Script | Checks |
| --- | --- |
| `verify-build.mjs` | production build completes and emits assets |
| `verify-bundle.mjs` | vendor chunks are split as configured |
| `verify-screenshots.mjs` | all 22 project screenshots present and valid |
| `verify-fallback.mjs` | modal renders the empty-state text correctly |

## Project structure

```
src/
  components/     Navbar, Hero, Skills, Projects, Contact, GlassSkeleton
  data/           projects.ts — project case-study content
public/
  screenshots/    full-resolution PNGs, with WebP thumbnails in thumbs/
```

Screenshots are served as downscaled WebP thumbnails in the modal grid; the
lightbox loads the original PNG. To regenerate thumbnails after adding a
screenshot, produce a 432px-wide WebP alongside it under `thumbs/`.
