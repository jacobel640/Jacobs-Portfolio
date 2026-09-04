# Jacob Elcharar — Portfolio

Personal portfolio site for Jacob Elcharar, Android Software Engineer & Fullstack Developer.

**Live:** https://jacobelcharar.dev

## Stack

React 18 · TypeScript · Vite 5 · Tailwind CSS 3 · Framer Motion

`npm run build` is a static-site build: after Vite emits the client bundle,
`scripts/prerender.mjs` renders the same component tree to HTML and writes it
into `#root` in `dist/index.html`. The browser hydrates that markup rather than
replacing it, and anything that does not run JavaScript — search crawlers, link
unfurlers, LLM fetchers — reads the page content directly out of the HTML.

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
| `verify-prerender.mjs` | `dist/index.html` carries the full page as static HTML |

## Adding the résumé and profile photo

Both are opt-in through `src/config/site.ts`, so the UI that links to them only
renders once the file is actually deployed — a portfolio that links a recruiter
to a 404 is worse than one that does not offer the link at all.

| Asset | Drop the file at | Then set |
| --- | --- | --- |
| Résumé PDF | `public/resume.pdf` | `RESUME_URL = '/resume.pdf'` |
| Profile photo | `public/profile.jpg` | `PROFILE_IMAGE = '/profile.jpg'` |

With `RESUME_URL` set, a `Resume` link appears in the navbar (desktop and
mobile menu) and a `View Resume` action joins the hero CTAs, all opening the
PDF in a new tab rather than forcing a download. With `PROFILE_IMAGE` set, the
About portrait frame shows the photograph instead of the initials monogram; a
square headshot of at least 800×800 is what the frame is built for.

## Project structure

```
src/
  components/     Navbar, Hero, About, Skills, Projects, Contact, GlassSkeleton
  config/         site.ts — résumé and profile-photo switches
  data/           projects.ts — project case-study content
  entry-server.tsx  build-only entry used by the prerender pass
public/
  screenshots/    full-resolution PNGs, with WebP thumbnails in thumbs/
```

Screenshots are served as downscaled WebP thumbnails in the modal grid; the
lightbox loads the original PNG. To regenerate thumbnails after adding a
screenshot, produce a 432px-wide WebP alongside it under `thumbs/`.
