# Project: Jacobs Portfolio Ultra-Modern Glassmorphic Redesign & Optimization

## Architecture
- **Framework & Core**: React 18 with TypeScript and Vite 5.
- **Styling & UI**: Tailwind CSS 3 with custom glassmorphism utilities (`backdrop-blur`, semi-transparent frosted glass layers, border glows, glowing radial gradients).
- **Animations**: Framer Motion 11 for staggered hero entrance, smooth scroll transitions, hover micro-interactions, modal overlays, and gallery views.
- **Asset Pipeline**: Static screenshots hosted in `public/screenshots/<project-id>/` and referenced via absolute URLs (`/screenshots/...`).
- **Performance Layer**:
  - Code splitting via `React.lazy` and `Suspense` for below-the-fold components (`Skills`, `Projects`, `Contact`).
  - Rollup manual chunking in `vite.config.ts` separating `vendor-react`, `vendor-framer-motion`, `vendor-lucide`, `vendor-utils`.
- **Verification Layer**: Modular Node.js test scripts under `scripts/` verifying build, bundle chunking, screenshot copies, and modal fallback text.

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | Local Screenshot Discovery & Copy | Search `C:\Users\jacob\Files\Programming\AndroidStudio` & `IntelliJ` for "screenshots"/"images" and copy 22 PNGs to `public/screenshots/` | M1 | ORIGINAL_REQUEST §R2 |
| 2 | Projects Data & Modal Screenshot Integration | Update project data model with screenshot paths and render rich gallery/modal view | M1 | ORIGINAL_REQUEST §R2 |
| 3 | Modal Fallback Text | Render exact string `"No screenshots available to display"` when project has 0 screenshots | M1 | ORIGINAL_REQUEST §R2 |
| 4 | Dark Canvas & Glassmorphism Design System | Deep dark background (`#030712`/`#0a0d14`), glowing radial gradients, frosted glass cards | M2 | ORIGINAL_REQUEST §R1 |
| 5 | Floating Glassmorphic Navbar | Modern sticky/floating navigation with blur, active section highlighting, mobile drawer | M2 | ORIGINAL_REQUEST §R1 |
| 6 | Hero Section Polish | Staggered entrance, gradient typography, glowing badges, animated CTA buttons | M2 | ORIGINAL_REQUEST §R1 |
| 7 | Skills Section Redesign | Glass cards, categorized tech stacks, animated skill tags, interactive hover effects | M2 | ORIGINAL_REQUEST §R1 |
| 8 | Projects Grid & Modal Redesign | Glassmorphic cards, tech pills, live demo/github links, polished modal with gallery & zoom | M2 | ORIGINAL_REQUEST §R1 |
| 9 | Contact & Footer Polish | High-end glass contact card, social icon glowing links, responsive footer | M2 | ORIGINAL_REQUEST §R1 |
| 10 | Vite Chunk Splitting | Function-based `manualChunks` in `vite.config.ts` isolating React, Motion, Lucide, utils | M3 | ORIGINAL_REQUEST §R3 |
| 11 | Component Lazy Loading | `React.lazy` + `Suspense` in `App.tsx` with glassmorphic skeleton fallbacks | M3 | ORIGINAL_REQUEST §R3 |
| 12 | Asset & Build Performance | CSS code splitting, efficient image loading, sub-150KB initial JS chunk | M3 | ORIGINAL_REQUEST §R3 |
| 13 | Build Verification Script | Script `scripts/verify-build.mjs` running `npm run build` asserting 0 TS/Vite errors | M4 | ORIGINAL_REQUEST §Acceptance |
| 14 | Bundle Optimization Verification Script | Script `scripts/verify-bundle.mjs` asserting chunk splitting count >= 4 and size limits | M4 | ORIGINAL_REQUEST §Acceptance |
| 15 | Screenshot Asset Verification Script | Script `scripts/verify-screenshots.mjs` asserting presence of copied images in `public/screenshots` | M4 | ORIGINAL_REQUEST §Acceptance |
| 16 | Modal Fallback Text Verification Script | Script `scripts/verify-fallback.mjs` asserting exact fallback text handling | M4 | ORIGINAL_REQUEST §Acceptance |
| 17 | Unified E2E Test Suite Runner | Script `scripts/verify-all.mjs` running full test suite with exit code 0 | M4 | ORIGINAL_REQUEST §Acceptance |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 1 | Screenshot Discovery & Modal Integration | Copy 22 discovered screenshots to `public/screenshots/`, update `Projects.tsx` data & modal image display, enforce fallback text | none | DONE |
| 2 | UI/UX Dark Theme Glassmorphism Redesign | Implement dark canvas, floating glass navbar, redesign Hero, Skills, Projects, Contact with Tailwind + Framer Motion | M1 | DONE |
| 3 | Performance Optimization & Chunk Splitting | Implement `manualChunks` in `vite.config.ts`, lazy load components in `App.tsx` with skeletons | M2 | DONE |
| 4 | E2E Verification & Test Suite | Implement verification scripts in `scripts/`, run full test suite, verify zero build errors, audit integrity | M3 | DONE |

## Interface Contracts
### Screenshot Data ↔ Modal Component (`src/components/Projects.tsx`)
- Data Model:
  ```typescript
  export interface ProjectDetails {
    id: string;
    title: string;
    description: string;
    fullDescription?: string;
    tags: string[];
    role?: string;
    timeline?: string;
    metrics?: string[];
    architecture?: string[];
    githubUrl?: string;
    demoUrl?: string;
    screenshots?: string[]; // Relative public URLs e.g. ['/screenshots/taskflow/AddEditTaskScreen.png']
  }
  ```
- Fallback requirement:
  When `!project.screenshots || project.screenshots.length === 0`, the modal MUST render:
  `No screenshots available to display`

### App Component ↔ Lazy Loaded Sections (`src/App.tsx`)
- Lazy Boundaries:
  - `Hero` is loaded eagerly (immediate render for LCP).
  - `Skills`, `Projects`, `Contact` are loaded via `React.lazy(() => import(...))` wrapped in `<Suspense fallback={<SectionSkeleton />}>`.

### Vite Rollup Options (`vite.config.ts`)
- Chunk separation:
  - `vendor-react`: `react`, `react-dom`
  - `vendor-framer-motion`: `framer-motion`
  - `vendor-lucide`: `lucide-react`
  - `vendor-utils`: `clsx`, `tailwind-merge`

## Code Layout
```
Jacobs-protofilio/
├── public/
│   └── screenshots/
│       ├── taskflow/              # 9 PNG screenshots
│       └── files-migration/       # 13 PNG screenshots
├── src/
│   ├── components/
│   │   ├── Navbar.tsx             # Floating glassmorphic navigation
│   │   ├── Hero.tsx               # Redesigned hero with glowing effects
│   │   ├── Skills.tsx             # Redesigned glassmorphic skill cards
│   │   ├── Projects.tsx           # Redesigned project cards, modal gallery & fallback
│   │   ├── Contact.tsx            # Redesigned contact card & social links
│   │   └── GlassSkeleton.tsx      # Glassmorphic loading skeletons for Suspense
│   ├── App.tsx                    # Main app with lazy loading and suspense boundaries
│   ├── index.css                  # Tailwind styles + custom glassmorphism utilities
│   └── main.tsx                   # React entry point
├── scripts/
│   ├── copy-screenshots.mjs       # Script to discover & copy screenshots
│   ├── verify-build.mjs           # Verifies build succeeds with 0 errors
│   ├── verify-bundle.mjs          # Verifies chunk splitting & bundle sizes
│   ├── verify-screenshots.mjs     # Verifies copied screenshots exist
│   ├── verify-fallback.mjs        # Verifies Projects.tsx modal fallback text
│   └── verify-all.mjs             # Unified acceptance test runner
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```
