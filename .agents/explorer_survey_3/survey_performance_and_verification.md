# Survey Report: Build, Performance, Chunk Splitting & Verification Architecture

**Author**: Explorer Subagent 3 (`explorer_survey_3`)  
**Target Project**: `Jacobs-protofilio`  
**Date**: 2026-08-31  
**Working Directory**: `C:\Users\jacob\Files\Programming\Antigravity\Jacobs-protofilio\.agents\explorer_survey_3`  

---

## 1. Executive Summary

This survey provides a comprehensive technical investigation into the build pipeline, performance optimization strategies (component lazy loading, Rollup chunk splitting, asset optimization), and automated verification architecture for the `Jacobs-portfolio` redesign.

### Key Findings
1. **Current Build Pipeline**: Vite 5.0.8 + React 18.2.0 + TypeScript 5.2.2. Currently, Vite is configured with zero bundle splitting, resulting in a single monolithic JavaScript bundle (`dist/assets/index-*.js`, ~334 KB uncompressed, ~100 KB gzipped) containing React, React-DOM, Framer Motion, Lucide icons, and all component logic.
2. **Performance Bottlenecks**:
   - Heavy dependencies (`framer-motion` at ~110 KB, `react-dom` at ~130 KB, `lucide-react`) are downloaded synchronously on initial page load.
   - All below-the-fold components (`Skills`, `Projects` with all modal metadata, `Contact`) are eagerly bundled into the critical path.
   - No granular browser caching: any minor code change invalidates all vendor and application code simultaneously.
3. **Recommended Performance Strategy**:
   - **Lazy Loading**: Eagerly render `Hero.tsx` (above-the-fold) for instant FCP/LCP; dynamically import `Skills.tsx`, `Projects.tsx`, `Contact.tsx` using `React.lazy` and `Suspense` with glassmorphic skeleton fallbacks.
   - **Rollup `manualChunks`**: Split vendor libraries into isolated chunks: `vendor-react` (react, react-dom), `vendor-framer-motion`, `vendor-lucide`, and `vendor-utils` (clsx, tailwind-merge).
   - **Asset Pipeline**: Image serving via `public/screenshots/`, native `loading="lazy"` on modal/card images, GPU-accelerated glassmorphic styling with `transform-gpu` to prevent repaint thrashing.
4. **Verification & Testing Suite**:
   - Modular verification scripts (`scripts/verify-build.mjs`, `scripts/verify-bundle.mjs`, `scripts/verify-screenshots.mjs`, `scripts/verify-fallback.mjs`, `scripts/verify-all.mjs`) satisfying all acceptance criteria with strict pass/fail assertions and exit codes.

---

## 2. Codebase Build & Dependency Inventory

### 2.1 Dependencies (`package.json`)

| Package | Version | Purpose | Bundle Impact & Chunk Recommendation |
|---|---|---|---|
| `react` | `^18.2.0` | Core React library | ~6 KB (chunk with `react-dom` in `vendor-react`) |
| `react-dom` | `^18.2.0` | React DOM renderer | ~130 KB (chunk in `vendor-react`) |
| `framer-motion` | `^11.0.0` | Animations & gesture library | ~110 KB (chunk in `vendor-framer-motion`) |
| `lucide-react` | `^0.300.0` | Iconography | ~35 KB (chunk in `vendor-lucide`) |
| `clsx` | `^2.1.0` | Class utility | ~1 KB (chunk in `vendor-utils`) |
| `tailwind-merge` | `^2.2.0` | Tailwind class merger | ~4 KB (chunk in `vendor-utils`) |

### 2.2 DevDependencies

- `vite`: `^5.0.8` (Bundler & dev server using Rollup 4)
- `@vitejs/plugin-react`: `^4.2.1` (Babel/Fast Refresh React plugin)
- `typescript`: `^5.2.2` (TypeScript compiler)
- `tailwindcss`: `^3.4.1`, `postcss`: `^8.4.33`, `autoprefixer`: `^10.4.17`

### 2.3 Current `vite.config.ts`

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
})
```

**Deficiency**:
- Missing `build.rollupOptions.output.manualChunks`.
- Missing `build.cssCodeSplit: true`.
- Missing asset categorization (`assets/js/`, `assets/css/`, `assets/images/`).
- Generates 1 single JS output bundle (`index-CelPlseE.js` 334 KB).

---

## 3. Performance Optimization Strategy

### 3.1 Component Lazy Loading & Suspense Strategy

#### A. Above-the-Fold vs Below-the-Fold Segmentation
- **Above-The-Fold (Eager)**: `Hero.tsx`
  - Rendered immediately in `App.tsx` without `React.lazy`.
  - Ensures First Contentful Paint (FCP) and Largest Contentful Paint (LCP) are sub-second.
  - Zero layout shift (CLS = 0) on initial header/hero render.
- **Below-The-Fold (Lazy)**: `Skills.tsx`, `Projects.tsx`, `Contact.tsx`
  - Loaded asynchronously using `React.lazy(() => import('./components/...'))`.
  - Each component is isolated into its own JS chunk (e.g. `Skills-[hash].js`, `Projects-[hash].js`, `Contact-[hash].js`).
  - Heavy modal logic and project descriptions in `Projects.tsx` are not parsed until scrolled or requested.

#### B. Glassmorphism Suspense Skeleton Fallback
To eliminate Cumulative Layout Shift (CLS) during lazy chunk resolution, each section is wrapped in a dedicated `Suspense` boundary with a matching skeleton placeholder:

```tsx
import React, { Suspense, lazy } from 'react';
import Hero from './components/Hero';

const Skills = lazy(() => import('./components/Skills'));
const Projects = lazy(() => import('./components/Projects'));
const Contact = lazy(() => import('./components/Contact'));

function SectionSkeleton({ height = "h-96" }: { height?: string }) {
  return (
    <div className={`w-full max-w-7xl mx-auto my-12 p-8 rounded-3xl backdrop-blur-xl bg-slate-900/40 border border-slate-800/60 shadow-2xl animate-pulse ${height} flex flex-col justify-center items-center`}>
      <div className="w-1/3 h-8 bg-slate-800/60 rounded-xl mb-6" />
      <div className="w-2/3 h-4 bg-slate-800/40 rounded-lg mb-3" />
      <div className="w-1/2 h-4 bg-slate-800/40 rounded-lg" />
    </div>
  );
}

function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500/30">
      <Hero />
      <Suspense fallback={<SectionSkeleton height="h-[500px]" />}>
        <Skills />
      </Suspense>
      <Suspense fallback={<SectionSkeleton height="h-[800px]" />}>
        <Projects />
      </Suspense>
      <Suspense fallback={<SectionSkeleton height="h-[400px]" />}>
        <Contact />
      </Suspense>
    </div>
  );
}

export default App;
```

---

### 3.2 Rollup Chunk Splitting Strategy (`vite.config.ts`)

#### A. Function-Based `manualChunks`
Using a function-based `manualChunks(id)` in Vite avoids circular dependency pitfalls associated with object-based chunking in Rollup:

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2020',
    cssCodeSplit: true,
    chunkSizeWarningLimit: 600,
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('scheduler')) {
              return 'vendor-react';
            }
            if (id.includes('framer-motion')) {
              return 'vendor-framer-motion';
            }
            if (id.includes('lucide-react')) {
              return 'vendor-lucide';
            }
            if (id.includes('clsx') || id.includes('tailwind-merge')) {
              return 'vendor-utils';
            }
            return 'vendor';
          }
        },
        entryFileNames: 'assets/js/[name]-[hash].js',
        chunkFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const name = assetInfo.name || '';
          if (/\.(png|jpe?g|svg|webp|gif|ico)$/i.test(name)) {
            return 'assets/images/[name]-[hash][extname]';
          }
          if (/\.css$/i.test(name)) {
            return 'assets/css/[name]-[hash][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        },
      },
    },
  },
});
```

#### B. Chunk Distribution Breakdown

| Output Chunk | Estimated Size | Invalidation Frequency | Loading Strategy |
|---|---|---|---|
| `vendor-react-[hash].js` | ~135 KB | Extremely Rare | Preloaded / Parallel |
| `vendor-framer-motion-[hash].js` | ~110 KB | Rare | Preloaded / Parallel |
| `vendor-lucide-[hash].js` | ~35 KB | Rare | Preloaded / Parallel |
| `vendor-utils-[hash].js` | ~5 KB | Rare | Preloaded / Parallel |
| `index-[hash].js` (Entry) | ~15-25 KB | Frequent (App/Hero changes) | Critical Entry |
| `Projects-[hash].js` | ~20-30 KB | Frequent (Project edits) | Lazy / On-Demand |
| `Skills-[hash].js` | ~10-15 KB | Moderate | Lazy / On-Demand |
| `Contact-[hash].js` | ~8-12 KB | Moderate | Lazy / On-Demand |

---

### 3.3 Asset Optimization & Image Pipeline Strategy

1. **Static Directory Structure**:
   - `public/screenshots/`: Vite serves static files placed in `public/` directly at root `/screenshots/...` with zero bundling overhead and immutable caching headers.
   - Naming convention: `/screenshots/<project-id>/screenshot-1.png` or `/screenshots/<project-id>-1.png`.
2. **Image Loading Optimization**:
   - **Native Lazy Loading**: All project screenshots rendered inside modal or cards use `loading="lazy"` and `decoding="async"`.
   - **Fixed Aspect Ratios**: Use Tailwind `aspect-video` (`aspect-16/9`) with `w-full h-auto object-cover rounded-xl` to prevent layout reflow.
   - **Placeholder & Error Boundaries**: When loading screenshots, show a sleek glassmorphic shimmer skeleton; on image loading error (`onError`), fall back to a styled preview card rather than a broken image link.
3. **CSS & Glassmorphism Rendering Performance**:
   - Glassmorphism effects (`backdrop-blur-md`, `backdrop-blur-lg`) are applied to isolated card containers, avoiding heavy full-page blur layers.
   - Use `transform-gpu` and `will-change-transform` on Framer Motion animated elements to delegate matrix transforms to the GPU and eliminate layout thrashing during scroll.

---

## 4. Testing & Verification Requirements

### 4.1 Requirement Matrix

| Verification Domain | Target Requirement | Pass Criteria | Verification Method |
|---|---|---|---|
| **V1: Clean TypeScript & Vite Build** | `npm run build` zero TS errors | Exit code 0, 0 TS errors, `dist/` directory generated | Automated CLI build execution |
| **V2: Production Bundle Optimization** | Rollup chunk splitting & lazy chunks | >= 4 distinct JS chunks in `dist/assets/js/`, entry bundle < 150 KB, vendor chunks present | Bundle inspector script |
| **V3: Modal Fallback Text** | Verbatim text: `"No screenshots available to display"` | `Projects.tsx` contains verbatim text and conditional rendering for empty screenshots | Static code analyzer & AST assertion |
| **V4: Copied Screenshots in `public/`** | Screenshots copied to `public/screenshots/` | `public/screenshots/` exists, contains valid non-zero byte images | Filesystem image inventory script |

---

## 5. Recommended Test Suite Architecture

We recommend creating modular, standalone Node.js verification scripts in a `scripts/` directory, coordinated by a master test runner:

```
scripts/
├── verify-all.mjs              # Master test suite runner (runs all checks sequentially)
├── verify-build.mjs            # Runs TypeScript & Vite build, asserts 0 errors
├── verify-bundle.mjs           # Inspects dist/ for chunk splitting & size metrics
├── verify-screenshots.mjs      # Validates public/screenshots directory & copied assets
└── verify-fallback.mjs         # Validates Projects.tsx fallback text & modal branching
```

### 5.1 Verification Scripts Specifications

#### A. `scripts/verify-build.mjs`
- **Purpose**: Executes `tsc --noEmit` and `vite build` (or `npm run build`).
- **Assertions**:
  - Process exits with code 0.
  - No TypeScript syntax or type checking errors.
  - Output directory `dist/` and `dist/index.html` exist.
- **Output**: Logs build execution duration and output status.

#### B. `scripts/verify-bundle.mjs`
- **Purpose**: Asserts that production bundle is properly split and optimized.
- **Assertions**:
  - Scans `dist/assets/` (and subdirectories like `dist/assets/js/`).
  - Total JavaScript chunk count is `>= 4` (asserts chunk splitting is active).
  - Specific chunks exist:
    - Vendor chunks matching `vendor-react`, `vendor-framer-motion`, `vendor-lucide`, `vendor-utils`.
    - Dynamic component chunks matching `Projects`, `Skills`, or `Contact`.
  - Main entry script size is `< 150 KB`.
  - No single chunk exceeds `350 KB`.
  - Output table displaying all chunks, sizes, and compression metrics.

#### C. `scripts/verify-fallback.mjs`
- **Purpose**: Validates the fallback text requirement for project modals.
- **Assertions**:
  - Inspects `src/components/Projects.tsx`.
  - Verifies exact string `"No screenshots available to display"` exists in the component source.
  - Verifies conditional check handles `screenshots` being undefined, null, or empty array `[]` (e.g. `!project.detailedContent.screenshots || project.detailedContent.screenshots.length === 0`).
  - Verifies that when screenshots exist, `img` tags or screenshot gallery components are rendered with `src` attribute.

#### D. `scripts/verify-screenshots.mjs`
- **Purpose**: Validates screenshot assets in `public/screenshots/`.
- **Assertions**:
  - Directory `public/screenshots/` exists.
  - Scans for image files (`.png`, `.jpg`, `.jpeg`, `.webp`, `.svg`).
  - Asserts file sizes are `> 0` bytes.
  - Lists all discovered image assets and matches them against `Projects.tsx` project definitions.

#### E. `scripts/verify-all.mjs` (Unified Runner)
- **Purpose**: Executes all 4 verification scripts sequentially.
- **Pass/Fail Criterion**:
  - Exits with code 0 only if all 4 suites pass.
  - Returns detailed pass/fail table and diagnostic logs.

---

### 5.2 `package.json` Scripts Integration

```json
"scripts": {
  "dev": "vite",
  "build": "tsc && vite build",
  "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
  "preview": "vite preview",
  "test:verify": "node scripts/verify-all.mjs",
  "verify:build": "node scripts/verify-build.mjs",
  "verify:bundle": "node scripts/verify-bundle.mjs",
  "verify:screenshots": "node scripts/verify-screenshots.mjs",
  "verify:fallback": "node scripts/verify-fallback.mjs"
}
```

---

## 6. Implementation Roadmap for Subsequent Milestones

1. **Milestone 1 (Asset Pipeline & Screenshots)**:
   - Ensure `public/screenshots/` exists and images are copied.
   - Run `verify:screenshots` to validate.
2. **Milestone 2 (UI/UX Redesign & Modal Fallback)**:
   - Implement glassmorphism dark theme across `Hero.tsx`, `Skills.tsx`, `Projects.tsx`, `Contact.tsx`.
   - Update `Projects.tsx` modal to render screenshots with exact fallback `"No screenshots available to display"`.
   - Run `verify:fallback` to validate.
3. **Milestone 3 (Performance Optimization & Chunk Splitting)**:
   - Update `vite.config.ts` with `manualChunks`, `cssCodeSplit`, and asset naming.
   - Refactor `App.tsx` to use `React.lazy` and `Suspense` with glassmorphic skeletons.
   - Run `verify:build` and `verify:bundle` to validate.
4. **Milestone 4 (Verification & Acceptance)**:
   - Run `npm run test:verify` (or `node scripts/verify-all.mjs`) to verify end-to-end compliance.
