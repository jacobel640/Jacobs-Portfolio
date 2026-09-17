# Jacob Elcharar — Portfolio

Personal portfolio site for Jacob Elcharar, Android Software Engineer & Fullstack Developer.

**Live:** https://jacobelcharar.dev

## Stack

React 18 · TypeScript · Vite 5 · Tailwind CSS 3 · Framer Motion

`npm run build` is a static-site build. After Vite emits the client bundle,
`scripts/prerender.mjs` renders every route to HTML and writes one file per
route — `/projects/taskflow` is `dist/projects/taskflow/index.html` — each with
its own title, description, canonical URL and Open Graph tags. The browser
hydrates that markup rather than replacing it, and anything that does not run
JavaScript — search crawlers, link unfurlers, LLM fetchers — reads the content
directly out of the HTML. `sitemap.xml` and `404.html` are generated in the
same pass.

Every project is a page of its own rather than a modal, because modal content
does not exist until a click: roughly four fifths of the site's writing was
absent from the HTML it shipped.

| Without JavaScript | before | after |
| --- | --- | --- |
| Readable text across the site | 4,592 chars | 26,083 chars |
| Indexable URLs | 1 | 7 |

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
| `verify-prerender.mjs` | all 7 routes ship as HTML with their own head and content |

## Project structure

```
src/
  components/     Navbar, Hero, Skills, Projects, ProjectCaseStudy, Contact
  data/           projects.ts — project case-study content
  router-core.ts  route context and path helpers
  router.tsx      RouterProvider and Link
  routes.ts       the routing table and per-route head metadata
  entry-server.tsx  build-only entry used by the prerender pass
public/
  screenshots/    full-resolution PNGs, with WebP thumbnails in thumbs/
```

Screenshots are served as downscaled WebP thumbnails in the modal grid; the
lightbox loads the original PNG. To regenerate thumbnails after adding a
screenshot, produce a 432px-wide WebP alongside it under `thumbs/`.
