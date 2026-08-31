# Original User Request

## Initial Request — 2026-08-31T16:12:58+03:00

# Teamwork Project Prompt

Redesign the existing React portfolio website to feature an ultra-modern dark theme with glassmorphism, optimize it for fast loading, and integrate project screenshots from the local filesystem into the project modals.

Working directory: C:\Users\jacob\Files\Programming\Antigravity\Jacobs-protofilio
Integrity mode: development

## Requirements

### R1. UI/UX Professional Redesign
Implement a strategic, high-end redesign of the portfolio website using an ultra-modern dark theme with glassmorphism (Tailwind CSS, Framer Motion). The layout and components should look extremely professional and polished.

### R2. Screenshot Integration
Search the user's local workspace directories (e.g., `C:\Users\jacob\Files\Programming\AndroidStudio`, `C:\Users\jacob\Files\Programming\IntelliJ`) specifically for folders named "screenshots" or "images". Copy any found project images to the portfolio's `public/screenshots` directory. Update the `Projects.tsx` modal to display these images. If a project has no screenshots, display the exact text: "No screenshots available to display".

### R3. Performance Optimization
Optimize the Vite React application for fast loading. Implement techniques such as component lazy loading and asset optimization to ensure a highly performant production build.

## Acceptance Criteria

### Design & Performance Verification
- [ ] `npm run build` completes successfully with zero TypeScript or Vite errors.
- [ ] A verification script runs `npm run build` and asserts that the production bundle is successfully optimized (e.g., chunks are properly split).

### Screenshot Integration Verification
- [ ] A verification script confirms that the `Projects.tsx` component correctly handles the fallback text "No screenshots available to display".
- [ ] The agent team runs a script to verify that any images found in the local source directories were successfully copied to `C:\Users\jacob\Files\Programming\Antigravity\Jacobs-protofilio\public\screenshots`.
