## 2026-08-31T13:33:52Z
You are a Worker subagent (teamwork_preview_worker) implementing Milestone 3: Performance Optimization & Chunk Splitting.
Your working directory is C:\Users\jacob\Files\Programming\Antigravity\Jacobs-protofilio\.agents\worker_m3
The workspace directory is C:\Users\jacob\Files\Programming\Antigravity\Jacobs-protofilio
Read:
- Original Request: C:\Users\jacob\Files\Programming\Antigravity\Jacobs-protofilio\ORIGINAL_REQUEST.md
- Project Scope: C:\Users\jacob\Files\Programming\Antigravity\Jacobs-protofilio\PROJECT.md
- Survey Report: C:\Users\jacob\Files\Programming\Antigravity\Jacobs-protofilio\.agents\explorer_survey_3\survey_performance_and_verification.md

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Tasks for Milestone 3:
1. Optimize `vite.config.ts`:
   - Implement function-based `manualChunks` in `build.rollupOptions.output`:
     * Isolate `vendor-react` (`react`, `react-dom`)
     * Isolate `vendor-framer-motion` (`framer-motion`)
     * Isolate `vendor-lucide` (`lucide-react`)
     * Isolate `vendor-utils` (`clsx`, `tailwind-merge`)
   - Enable `cssCodeSplit: true`.
   - Set optimal chunk and asset file names.
2. Optimize `src/App.tsx`:
   - Keep `Hero.tsx` eagerly loaded for instant initial render / LCP.
   - Code-split and lazy load below-the-fold components (`Skills.tsx`, `Projects.tsx`, `Contact.tsx`) via `React.lazy()` with `<Suspense>` wrapped in smooth dark glassmorphic loading skeletons to prevent layout shift.
3. Verify Build and Optimization:
   - Run `cmd.exe /c "npm run build"` (or `npm.cmd run build`) and confirm build succeeds with zero errors.
   - Run `node scripts/verify-bundle.mjs` and confirm chunk count >= 4, separated vendor chunks, and optimized bundle sizes.
   - Run `node scripts/verify-screenshots.mjs` and `node scripts/verify-fallback.mjs` to ensure zero regressions.
4. Document all changes and verification in C:\Users\jacob\Files\Programming\Antigravity\Jacobs-protofilio\.agents\worker_m3\handoff.md and send completion message.
