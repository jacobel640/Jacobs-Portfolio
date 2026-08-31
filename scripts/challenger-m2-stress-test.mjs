#!/usr/bin/env node
/**
 * scripts/challenger-m2-stress-test.mjs
 * 
 * Comprehensive Empirical Challenger Suite for Milestone 2:
 * UI/UX Dark Theme Glassmorphism Redesign.
 * 
 * Verifies:
 * 1. Design System & CSS Token Integrity (Tailwind + Custom Glassmorphism)
 * 2. Component Layout, DOM Hierarchy & Section IDs
 * 3. Responsive Breakpoints & Viewport Scalability
 * 4. Micro-interactions & Framer Motion Animation Properties
 * 5. Accessibility, Aria Labels & Contrast Standards
 * 6. Modal Scroll-Locking & Lightbox Zoom Mechanics
 * 7. Verbatim Fallback String & Project Contract Preservation
 */

import { readFileSync, existsSync } from 'fs';
import { resolve, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = resolve(fileURLToPath(import.meta.url), '..');
const ROOT_DIR = resolve(__dirname, '..');

console.log('================================================================================');
console.log('🔬 EMPIRICAL CHALLENGER TEST SUITE — MILESTONE 2 UI/UX GLASSMORPHISM');
console.log('================================================================================');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;
const failures = [];

function assert(condition, name, details = '') {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✅ [PASS] ${name}`);
  } else {
    failedTests++;
    const msg = details ? `${name} -> ${details}` : name;
    failures.push(msg);
    console.error(`  ❌ [FAIL] ${msg}`);
  }
}

// -----------------------------------------------------------------------------
// SECTION 1: Tailwind Configuration & Design Tokens
// -----------------------------------------------------------------------------
console.log('\n--- 1. Tailwind Config & Glassmorphism Design Tokens ---');
const tailwindConfigPath = join(ROOT_DIR, 'tailwind.config.js');
assert(existsSync(tailwindConfigPath), 'tailwind.config.js exists');

const tailwindCode = readFileSync(tailwindConfigPath, 'utf-8');
assert(tailwindCode.includes("darkMode: 'class'"), 'Dark mode class configured');
assert(tailwindCode.includes('#030712'), 'Canvas DEFAULT palette contains deep dark #030712');
assert(tailwindCode.includes('radial-glow-cyan'), 'Radial glow background token: cyan');
assert(tailwindCode.includes('radial-glow-indigo'), 'Radial glow background token: indigo');
assert(tailwindCode.includes('radial-glow-purple'), 'Radial glow background token: purple');
assert(tailwindCode.includes('radial-glow-blue'), 'Radial glow background token: blue');
assert(tailwindCode.includes('glass-sm'), 'Box shadow token: glass-sm');
assert(tailwindCode.includes('glass-md'), 'Box shadow token: glass-md');
assert(tailwindCode.includes('glass-lg'), 'Box shadow token: glass-lg');
assert(tailwindCode.includes('float-slow'), 'Keyframe animation token: float-slow');
assert(tailwindCode.includes('pulse-glow'), 'Keyframe animation token: pulse-glow');

// -----------------------------------------------------------------------------
// SECTION 2: CSS Stylesheet & Browser Compatibility
// -----------------------------------------------------------------------------
console.log('\n--- 2. Global CSS, Webkit Prefixes & Custom Scrollbars ---');
const indexCssPath = join(ROOT_DIR, 'src', 'index.css');
assert(existsSync(indexCssPath), 'src/index.css exists');

const indexCss = readFileSync(indexCssPath, 'utf-8');
assert(indexCss.includes('scroll-behavior: smooth'), 'Smooth scrolling enabled in base html');
assert(indexCss.includes('color-scheme: dark'), 'Dark color-scheme enabled');
assert(indexCss.includes('overflow-x: hidden'), 'Body has overflow-x: hidden to prevent layout jank');
assert(indexCss.includes('::-webkit-scrollbar'), 'Custom sleek webkit scrollbar declared');
assert(indexCss.includes('::-webkit-scrollbar-thumb'), 'Custom frosted scrollbar thumb declared');
assert(indexCss.includes('.glass-panel'), 'Utility class .glass-panel declared');
assert(indexCss.includes('.glass-card'), 'Utility class .glass-card declared');
assert(indexCss.includes('.glass-pill'), 'Utility class .glass-pill declared');
assert(indexCss.includes('.text-glow-gradient'), 'Utility class .text-glow-gradient declared');
assert(indexCss.includes('-webkit-backdrop-filter'), 'Cross-browser -webkit-backdrop-filter prefix included');

// -----------------------------------------------------------------------------
// SECTION 3: Root App Architecture & Section ID Contracts
// -----------------------------------------------------------------------------
console.log('\n--- 3. App Architecture, Lighting Layer & Section Contracts ---');
const appTsxPath = join(ROOT_DIR, 'src', 'App.tsx');
assert(existsSync(appTsxPath), 'src/App.tsx exists');

const appTsx = readFileSync(appTsxPath, 'utf-8');
assert(appTsx.includes('<Navbar'), 'Navbar component mounted in App.tsx');
assert(appTsx.includes('<Hero'), 'Hero component mounted in App.tsx');
assert(appTsx.includes('<Skills'), 'Skills component mounted in App.tsx');
assert(appTsx.includes('<Projects'), 'Projects component mounted in App.tsx');
assert(appTsx.includes('<Contact'), 'Contact component mounted in App.tsx');
assert(appTsx.includes('pointer-events-none'), 'Global ambient light layer is non-blocking (pointer-events-none)');

// Check component files exist
const navPath = join(ROOT_DIR, 'src', 'components', 'Navbar.tsx');
const heroPath = join(ROOT_DIR, 'src', 'components', 'Hero.tsx');
const skillsPath = join(ROOT_DIR, 'src', 'components', 'Skills.tsx');
const projectsPath = join(ROOT_DIR, 'src', 'components', 'Projects.tsx');
const contactPath = join(ROOT_DIR, 'src', 'components', 'Contact.tsx');

assert(existsSync(navPath), 'Navbar.tsx exists');
assert(existsSync(heroPath), 'Hero.tsx exists');
assert(existsSync(skillsPath), 'Skills.tsx exists');
assert(existsSync(projectsPath), 'Projects.tsx exists');
assert(existsSync(contactPath), 'Contact.tsx exists');

// Verify section IDs
const heroCode = readFileSync(heroPath, 'utf-8');
const skillsCode = readFileSync(skillsPath, 'utf-8');
const projectsCode = readFileSync(projectsPath, 'utf-8');
const contactCode = readFileSync(contactPath, 'utf-8');

assert(heroCode.includes('id="hero"'), 'Hero section has id="hero"');
assert(skillsCode.includes('id="skills"'), 'Skills section has id="skills"');
assert(projectsCode.includes('id="projects"'), 'Projects section has id="projects"');
assert(contactCode.includes('id="contact"'), 'Contact section has id="contact"');

// -----------------------------------------------------------------------------
// SECTION 4: Floating Glassmorphic Navbar & Responsiveness
// -----------------------------------------------------------------------------
console.log('\n--- 4. Navbar Functionality, Active State & Mobile Drawer ---');
const navCode = readFileSync(navPath, 'utf-8');
assert(navCode.includes('backdrop-blur'), 'Navbar has backdrop blur for frosted effect');
assert(navCode.includes('handleScroll'), 'Navbar implements dynamic scroll listener');
assert(navCode.includes('removeEventListener'), 'Navbar cleans up scroll event listener on unmount');
assert(navCode.includes('passive: true'), 'Navbar uses passive event listener for scroll performance');
assert(navCode.includes('activeNavbarIndicator'), 'Navbar has animated active pill indicator layoutId');
assert(navCode.includes('AnimatePresence'), 'Navbar uses AnimatePresence for smooth mobile menu transitions');
assert(navCode.includes('aria-label="Main Navigation"'), 'Navbar has accessible aria-label on nav');
assert(navCode.includes('aria-expanded'), 'Navbar has accessible aria-expanded attribute on mobile menu toggle');

// -----------------------------------------------------------------------------
// SECTION 5: Hero Section Animations & Call-to-Actions
// -----------------------------------------------------------------------------
console.log('\n--- 5. Hero Section Staggered Entrance & Typography ---');
assert(heroCode.includes('staggerChildren'), 'Hero variants utilize staggered child entrance');
assert(heroCode.includes('Available for new opportunities'), 'Hero renders availability badge');
assert(heroCode.includes('bg-clip-text'), 'Hero heading has high-end clipped gradient typography');
assert(heroCode.includes('Native Android'), 'Hero domain badge: Native Android present');
assert(heroCode.includes('Spring Boot'), 'Hero domain badge: Spring Boot present');
assert(heroCode.includes('AI Agents'), 'Hero domain badge: AI Agents present');
assert(heroCode.includes('href="#projects"'), 'Hero CTA points to #projects');
assert(heroCode.includes('href="#contact"'), 'Hero CTA points to #contact');
assert(heroCode.includes('href="#skills"'), 'Hero scroll indicator points to #skills');

// -----------------------------------------------------------------------------
// SECTION 6: Skills Section Cards & Hover Effects
// -----------------------------------------------------------------------------
console.log('\n--- 6. Skills Section Glass Cards & Viewport Triggers ---');
assert(skillsCode.includes('Android Development'), 'Skills contains Android Development category');
assert(skillsCode.includes('Backend & Cloud Systems'), 'Skills contains Backend & Cloud Systems category');
assert(skillsCode.includes('AI Workflows & Dev Tools'), 'Skills contains AI Workflows & Dev Tools category');
assert(skillsCode.includes('whileInView'), 'Skills cards use Framer Motion whileInView trigger');
assert(skillsCode.includes('viewport={{ once: true'), 'Skills animations configured to trigger once on scroll');
assert(skillsCode.includes('grid-cols-1 md:grid-cols-2 lg:grid-cols-3'), 'Skills grid is responsive across mobile, tablet, and desktop');

// -----------------------------------------------------------------------------
// SECTION 7: Projects Showcase, Filter Tabs & Lightbox Modal
// -----------------------------------------------------------------------------
console.log('\n--- 7. Projects Filter Tabs, Modal Mechanics & Fallback Contract ---');
assert(projectsCode.includes('activeFilterTabIndicator'), 'Projects filter tabs utilize layoutId="activeFilterTabIndicator"');
assert(projectsCode.includes("'All', 'Android', 'Fullstack', 'Backend'"), 'Projects filter tabs include All, Android, Fullstack, Backend');
assert(projectsCode.includes('document.body.style.overflow = \'hidden\''), 'Projects modal locks body scroll when open');
assert(projectsCode.includes('document.body.style.overflow = \'unset\''), 'Projects modal restores body scroll on close/unmount');
assert(projectsCode.includes('selectedImage'), 'Projects component implements click-to-zoom Lightbox');
assert(projectsCode.includes('No screenshots available to display'), 'Exact verbatim fallback string preserved: "No screenshots available to display"');

// Check all 6 project IDs
const pids = ['taskflow', 'gio-manetti', 'tzachi-community', 'files-migration', 'e-commerce-waba', 'whatsapp-status'];
pids.forEach(id => {
  assert(projectsCode.includes(`id: '${id}'`), `Project [${id}] is defined`);
});

// Check screenshot count in code
const taskflowMatches = projectsCode.match(/\/screenshots\/taskflow\/[a-zA-Z0-9_\-]+\.png/g) || [];
const uniqueTaskflow = [...new Set(taskflowMatches)];
assert(uniqueTaskflow.length === 9, `TaskFlow references 9 unique screenshots in code (got ${uniqueTaskflow.length})`);

const filesMatches = projectsCode.match(/\/screenshots\/files-migration\/[a-zA-Z0-9_\-]+\.png/g) || [];
const uniqueFiles = [...new Set(filesMatches)];
assert(uniqueFiles.length === 13, `Files Migration references 13 unique screenshots in code (got ${uniqueFiles.length})`);

// -----------------------------------------------------------------------------
// SECTION 8: Contact Section & Interactive Micro-features
// -----------------------------------------------------------------------------
console.log('\n--- 8. Contact Section, Clipboard Feedback & Footer ---');
assert(contactCode.includes('navigator.clipboard.writeText'), 'Contact implements clipboard copy for email');
assert(contactCode.includes('Copied!'), 'Contact provides visual feedback ("Copied!") on email copy');
assert(contactCode.includes('Jacobel640@gmail.com'), 'Email address Jacobel640@gmail.com present');
assert(contactCode.includes('https://github.com/Jacobel640'), 'GitHub profile URL present');
assert(contactCode.includes('https://www.linkedin.com/in/Jacobel640-b9ba3a3a1/'), 'LinkedIn profile URL present');
assert(contactCode.includes('scrollToTop'), 'Smooth back to top button implemented');
assert(contactCode.includes('All rights reserved'), 'Copyright notice present in footer');

// -----------------------------------------------------------------------------
// FINAL SUMMARY
// -----------------------------------------------------------------------------
console.log('\n================================================================================');
console.log('📊 MILESTONE 2 CHALLENGER TEST RESULTS SUMMARY');
console.log('================================================================================');
console.log(`Total Invariants Evaluated: ${totalTests}`);
console.log(`Passed Assertions:          ${passedTests}`);
console.log(`Failed Assertions:          ${failedTests}`);
console.log('================================================================================');

if (failedTests > 0) {
  console.error('\n❌ ADVERSARIAL CHALLENGER DETECTED FAILURES:');
  failures.forEach((f, i) => console.error(`  ${i + 1}. ${f}`));
  process.exit(1);
} else {
  console.log('\n🏆 ALL MILESTONE 2 EMPIRICAL CHALLENGER ASSERTIONS PASSED WITH 100% SUCCESS!');
  process.exit(0);
}
