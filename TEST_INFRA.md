# Test Infrastructure & Verification Architecture

**Project**: Jacobs Portfolio Ultra-Modern Glassmorphic Redesign & Optimization  
**Location**: `C:\Users\jacob\Files\Programming\Antigravity\Jacobs-protofilio`  
**Standard**: Teamwork High-Integrity Opaque-Box & 4-Tier Verification Architecture  
**Authoritative Sources**: `ORIGINAL_REQUEST.md`, `PROJECT.md`

---

## 1. Testing Philosophy & Principles

### 1.1 Opaque-Box & Requirement-Driven Testing
All verification suites in this project are designed using **opaque-box requirement-driven testing**. Test cases do not rely on internal ephemeral implementation details; instead, they rigorously assert against the contracts, invariants, and acceptance criteria documented in `ORIGINAL_REQUEST.md` and `PROJECT.md`:
1. **Contract Invariants**: Exact strings (e.g. `"No screenshots available to display"`), structural layouts (e.g. `public/screenshots/<project-id>/`), chunk distribution rules, and build exit codes.
2. **Deterministic Derivations**: Every expected value is derived from documented project specifications or physical filesystem oracles.
3. **No Facade Tests**: Tests execute actual builds, read physical disk bytes, inspect compiled bundle distributions, and parse component syntax trees. Tests never mock away real failures.
4. **Platform Resilience**: Cross-platform compatibility supporting Windows PowerShell / CMD environments (`npm.cmd`, Windows path separators) as well as POSIX runtimes.

---

## 2. 4-Tier Verification Methodology

```
┌───────────────────────────────────────────────────────────────────┐
│              TIER 4: Real-World User Scenarios                    │
│     (Full build-to-deploy journey, end-to-end modal & navigation) │
├───────────────────────────────────────────────────────────────────┤
│            TIER 3: Cross-Feature Combinations                     │
│  (Rollup chunks + Lazy routes, Asset pipeline + Modal rendering)  │
├───────────────────────────────────────────────────────────────────┤
│            TIER 2: Boundary & Corner Conditions                   │
│   (Empty/null screenshots, 0-byte assets, oversized bundle chunks)│
├───────────────────────────────────────────────────────────────────┤
│            TIER 1: Feature Coverage (>=5 / feature)               │
│   (Build compilation, screenshot inventory, fallback text, etc.)  │
└───────────────────────────────────────────────────────────────────┘
```

### 2.1 Tier 1: Core Feature Coverage Matrix (>= 5 Assertions Per Feature)

#### Feature 1: Screenshot Asset Discovery & Pipeline (`scripts/verify-screenshots.mjs`)
- **T1.F1.1**: Directory `public/screenshots/taskflow` exists.
- **T1.F1.2**: All 9 TaskFlow screenshot PNG files are present with exact filenames (`HomeScreen_filters.png`, `SingleTaskScreen.png`, `AddEditTaskScreen.png`, `CalendarScreen_day.png`, `CalendarScreen_month.png`, `HomeScreen_sorting.png`, `HomeScreen_mark-completed_undo-deletion.png`, `NotificationTimeDialog.png`, `app_icon.png`).
- **T1.F1.3**: Directory `public/screenshots/files-migration` exists.
- **T1.F1.4**: All 13 Files Migration screenshot PNG files are present with exact filenames (`main_screen.png`, `file_explorer_grid.png`, `file_explorer_row.png`, `file_actions.png`, `search_screen.png`, `search_filters_1.png`, `search_filters_2.png`, `sort_options_sheet.png`, `selected_file_details.png`, `multi_selected_details.png`, `last_files.png`, `storage_analizer.png`, `copy_navigation.png`).
- **T1.F1.5**: Total count of project screenshots in `public/screenshots` equals exactly 22 PNGs.
- **T1.F1.6**: Each screenshot file has non-zero file size (> 1024 bytes) and contains valid PNG magic header bytes (`0x89 0x50 0x4E 0x47`).

#### Feature 2: Projects Data Model & Screenshot Integration (`scripts/verify-fallback.mjs`)
- **T1.F2.1**: `src/components/Projects.tsx` defines `screenshots?: string[]` on `ProjectDetails` interface.
- **T1.F2.2**: `taskflow` project definition contains `screenshots` array populated with 9 valid public URL paths (`/screenshots/taskflow/...`).
- **T1.F2.3**: `files-migration` project definition contains `screenshots` array populated with 13 valid public URL paths (`/screenshots/files-migration/...`).
- **T1.F2.4**: Modal rendering logic maps over `screenshots` array rendering `<img>` tags with responsive aspect ratios and lazy loading.
- **T1.F2.5**: Project cards / modal components render properly without undefined property access errors.

#### Feature 3: Modal Fallback Text & Empty State (`scripts/verify-fallback.mjs`)
- **T1.F3.1**: Verbatim string `"No screenshots available to display"` exists in `src/components/Projects.tsx`.
- **T1.F3.2**: Modal screenshot conditional checks for falsy or empty `screenshots` array (`!screenshots || screenshots.length === 0`).
- **T1.F3.3**: Projects without screenshots (`gio-manetti`, `tzachi-community`, `e-commerce-waba`, `whatsapp-status`) omit `screenshots` or supply empty array `[]`.
- **T1.F3.4**: Fallback container includes an icon placeholder (`ImageIcon`) with muted glassmorphic styling.
- **T1.F3.5**: Fallback text does not flicker or display when valid screenshots exist.

#### Feature 4: TypeScript & Production Build Integrity (`scripts/verify-build.mjs`)
- **T1.F4.1**: `tsc --noEmit` completes with exit code 0 and zero TypeScript type errors.
- **T1.F4.2**: `vite build` completes successfully with exit code 0.
- **T1.F4.3**: Production distribution directory `dist/` is created.
- **T1.F4.4**: `dist/index.html` exists and contains valid HTML structure referencing bundle assets.
- **T1.F4.5**: Build output produces no fatal compilation warnings or unhandled module resolutions.

#### Feature 5: Production Bundle & Chunk Splitting (`scripts/verify-bundle.mjs`)
- **T1.F5.1**: `dist/assets` (or `dist/assets/js`) contains at least 4 distinct JavaScript chunks.
- **T1.F5.2**: Vendor chunk `vendor-react` is isolated into its own bundle file (`vendor-react-*.js`).
- **T1.F5.3**: Vendor chunk `vendor-framer-motion` is isolated into its own bundle file (`vendor-framer-motion-*.js`).
- **T1.F5.4**: Vendor chunk `vendor-lucide` is isolated into its own bundle file (`vendor-lucide-*.js`).
- **T1.F5.5**: Vendor chunk `vendor-utils` or lazy component chunks (`Projects-*.js`, `Skills-*.js`, `Contact-*.js`) are generated.
- **T1.F5.6**: Entry bundle size remains lightweight (< 150 KB uncompressed) for rapid initial page load.

---

### 2.2 Tier 2: Boundary & Corner Conditions

- **T2.1: Empty vs Undefined Screenshots**: Verifies that both `screenshots: []` and `screenshots: undefined` correctly trigger the fallback message without throwing runtime exceptions.
- **T2.2: Screenshot Corruption Check**: Verifies that 0-byte, truncated, or non-image files placed in screenshot directories are flagged as invalid.
- **T2.3: Chunk Size Limits**: Asserts that no single vendor or component chunk exceeds 400 KB uncompressed, preventing browser main thread starvation.
- **T2.4: URL Path Formats**: Asserts that screenshot URLs in `Projects.tsx` use web-standard forward slashes (`/screenshots/...`) rather than Windows backslashes (`\screenshots\...`).
- **T2.5: Missing Build Artifacts Graceful Exit**: Verifies that `verify-bundle.mjs` properly checks for `dist/` existence before scanning and provides clear actionable diagnostics if the build has not yet run.

---

### 2.3 Tier 3: Cross-Feature Combinations

- **T3.1: Chunk Splitting + Lazy Component Dynamic Imports**: Asserts that dynamic imports in `src/App.tsx` (`React.lazy`) correctly interact with Vite's `manualChunks` configuration, generating independent on-demand chunks for `Skills`, `Projects`, and `Contact`.
- **T3.2: Static Asset Serving + Modal Image Resolution**: Asserts that the relative URL paths registered in `Projects.tsx` match the exact directory and file structure under `public/screenshots/`.
- **T3.3: Glassmorphic Tailwind Utilities + CSS Code Splitting**: Asserts that custom glassmorphism styles (`backdrop-blur`, border glows, radial gradients) compile cleanly through PostCSS / Tailwind without breaking Vite's CSS code splitting.

---

### 2.4 Tier 4: Real-World Application Scenarios

- **T4.1: Fresh Production Build & Full Verification Pipeline**: Executes `node scripts/verify-all.mjs` on a clean build, verifying all 4 suites pass with exit code 0.
- **T4.2: First Contentful Paint (FCP) Path**: Validates that `Hero.tsx` is eagerly bundled into the entry chunk while heavy modals and below-the-fold assets are deferred.
- **T4.3: Project Modal Interaction Journey**:
  - User clicks `TaskFlow` -> Modal opens -> 9 screenshot assets render with native lazy loading.
  - User clicks `GIO MANETTI` -> Modal opens -> Fallback message `"No screenshots available to display"` renders cleanly.

---

## 3. Test Architecture & Runner Specification

### 3.1 Script Inventory (`scripts/`)

| Script | Responsibility | Primary Assertions |
|---|---|---|
| `scripts/verify-build.mjs` | TypeScript & Vite compilation | Exit code 0, 0 TS errors, `dist/index.html` exists |
| `scripts/verify-bundle.mjs` | Bundle chunk analysis & size limits | >= 4 JS chunks, vendor chunks isolated, entry < 150 KB |
| `scripts/verify-screenshots.mjs` | Screenshot asset filesystem inventory | 22 PNG files present, valid headers, > 1KB size |
| `scripts/verify-fallback.mjs` | Modal fallback & project data parsing | Verbatim string present, empty/undefined branching, project mappings |
| `scripts/verify-all.mjs` | Master test runner | Runs all 4 scripts sequentially, formats diagnostic report, exits 0/1 |

### 3.2 CLI Execution Standards

```bash
# Run all verification suites
node scripts/verify-all.mjs

# Run individual verification suites
node scripts/verify-build.mjs
node scripts/verify-bundle.mjs
node scripts/verify-screenshots.mjs
node scripts/verify-fallback.mjs
```

### 3.3 Exit Codes & Reporting
- **Exit Code `0`**: All assertions passed cleanly.
- **Exit Code `1`**: One or more assertions failed (detailed error diagnostics printed to `stderr` / `stdout`).
