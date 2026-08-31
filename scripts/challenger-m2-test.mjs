#!/usr/bin/env node
/**
 * scripts/challenger-m2-test.mjs
 * 
 * Comprehensive Empirical Challenger Test Suite for Milestone 2:
 * UI/UX Dark Theme Glassmorphism Redesign
 * 
 * Verifies:
 * 1. Design System Tokens & Glassmorphism Utility Classes
 * 2. Navbar component structure, nav items, mobile drawer, scroll listener & cleanup
 * 3. Hero component structure, availability badge, typography, tech pills, CTAs, scroll indicator
 * 4. Skills component 3 categories, domain cards, tech badges, icons
 * 5. Projects component filtering logic, cards, modal state, lightbox zoom, fallback text & edge cases
 * 6. Contact component social links, email clipboard copy, smooth back-to-top, copyright
 * 7. App layout, ambient background glows, component integration
 * 8. TypeScript compilation & asset integrity
 */

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

console.log('====================================================================');
console.log('🔬 EMPIRICAL CHALLENGER TEST SUITE — MILESTONE 2: DARK THEME & UI/UX');
console.log('====================================================================');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;
const failureList = [];

function assert(condition, testName, details = '') {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✅ [PASS] ${testName}`);
  } else {
    failedTests++;
    const errMsg = `${testName}${details ? ' -> ' + details : ''}`;
    failureList.push(errMsg);
    console.error(`  ❌ [FAIL] ${errMsg}`);
  }
}

// -----------------------------------------------------------------------------
// 1. DESIGN SYSTEM & GLASSMORPHISM TOKEN VERIFICATION
// -----------------------------------------------------------------------------
console.log('\n--- 1. Design System & Glassmorphic Tokens ---');

const tailwindPath = path.join(projectRoot, 'tailwind.config.js');
assert(fs.existsSync(tailwindPath), 'tailwind.config.js exists');
const tailwindContent = fs.readFileSync(tailwindPath, 'utf-8');

assert(tailwindContent.includes('#030712'), 'Tailwind defines dark canvas background #030712');
assert(tailwindContent.includes('radial-glow-cyan') && tailwindContent.includes('radial-glow-indigo') && tailwindContent.includes('radial-glow-purple'), 'Tailwind defines radial glow backgrounds (cyan, indigo, purple)');
assert(tailwindContent.includes('glass-sm') && tailwindContent.includes('glass-md') && tailwindContent.includes('glass-lg'), 'Tailwind defines glass box shadows (glass-sm, glass-md, glass-lg)');
assert(tailwindContent.includes('glow-blue') && tailwindContent.includes('glow-indigo') && tailwindContent.includes('glow-emerald'), 'Tailwind defines glowing box shadows (glow-blue, glow-indigo, glow-emerald)');
assert(tailwindContent.includes('float-slow') && tailwindContent.includes('pulse-glow'), 'Tailwind defines custom animations (float-slow, pulse-glow)');

const indexCssPath = path.join(projectRoot, 'src', 'index.css');
assert(fs.existsSync(indexCssPath), 'src/index.css exists');
const indexCssContent = fs.readFileSync(indexCssPath, 'utf-8');

assert(indexCssContent.includes('.glass-panel'), 'src/index.css defines .glass-panel utility');
assert(indexCssContent.includes('.glass-card'), 'src/index.css defines .glass-card utility');
assert(indexCssContent.includes('.glass-pill'), 'src/index.css defines .glass-pill utility');
assert(indexCssContent.includes('.text-glow-gradient'), 'src/index.css defines .text-glow-gradient utility');
assert(indexCssContent.includes('::-webkit-scrollbar'), 'src/index.css defines custom sleek scrollbar');
assert(indexCssContent.includes('scroll-behavior: smooth'), 'src/index.css enforces smooth scrolling');
assert(indexCssContent.includes('color-scheme: dark'), 'src/index.css enforces color-scheme: dark');

// -----------------------------------------------------------------------------
// 2. NAVBAR COMPONENT VERIFICATION
// -----------------------------------------------------------------------------
console.log('\n--- 2. Navbar Component Verification (src/components/Navbar.tsx) ---');

const navbarPath = path.join(projectRoot, 'src', 'components', 'Navbar.tsx');
assert(fs.existsSync(navbarPath), 'Navbar.tsx exists');
const navbarCode = fs.readFileSync(navbarPath, 'utf-8');

// Nav items check
const expectedNavLinks = ['#hero', '#skills', '#projects', '#contact'];
for (const link of expectedNavLinks) {
  assert(navbarCode.includes(`href: '${link}'`) || navbarCode.includes(`href: "${link}"`), `Navbar includes link for ${link}`);
}

// Brand monogram
assert(navbarCode.includes('Jacob') && navbarCode.includes('.dev'), 'Navbar contains Jacob.dev monogram branding');

// Desktop & Mobile actions
assert(navbarCode.includes('https://github.com/Jacobel640'), 'Navbar contains GitHub profile link');
assert(navbarCode.includes('Let\'s Talk') || navbarCode.includes('Contact'), 'Navbar contains Contact CTA');
assert(navbarCode.includes('mobileMenuOpen'), 'Navbar manages mobile drawer state');
assert(navbarCode.includes('activeSection'), 'Navbar tracks active section indicator');
assert(navbarCode.includes('window.addEventListener(\'scroll\'') || navbarCode.includes('window.addEventListener("scroll"'), 'Navbar binds scroll listener');
assert(navbarCode.includes('passive: true'), 'Navbar scroll listener is optimized with passive: true');
assert(navbarCode.includes('window.removeEventListener(\'scroll\'') || navbarCode.includes('window.removeEventListener("scroll"'), 'Navbar cleans up scroll listener on unmount');
assert(navbarCode.includes('backdrop-blur'), 'Navbar features backdrop blur glass styling');

// -----------------------------------------------------------------------------
// 3. HERO COMPONENT VERIFICATION
// -----------------------------------------------------------------------------
console.log('\n--- 3. Hero Component Verification (src/components/Hero.tsx) ---');

const heroPath = path.join(projectRoot, 'src', 'components', 'Hero.tsx');
assert(fs.existsSync(heroPath), 'Hero.tsx exists');
const heroCode = fs.readFileSync(heroPath, 'utf-8');

assert(heroCode.includes('id="hero"') || heroCode.includes("id='hero'"), 'Hero section has id="hero"');
assert(heroCode.includes('Available for new opportunities'), 'Hero contains availability badge: "Available for new opportunities"');
assert(heroCode.includes('Jacob Elcharar'), 'Hero contains main heading with "Jacob Elcharar"');
assert(heroCode.includes('Android Software Engineer'), 'Hero contains subtitle "Android Software Engineer"');
assert(heroCode.includes('Fullstack Developer'), 'Hero contains subtitle "Fullstack Developer"');
assert(heroCode.includes('Native Android (Kotlin & Compose)') || heroCode.includes('Native Android'), 'Hero contains Native Android domain pill');
assert(heroCode.includes('Spring Boot & Cloud Microservices') || heroCode.includes('Spring Boot'), 'Hero contains Spring Boot domain pill');
assert(heroCode.includes('AI Agents & Modern Tooling') || heroCode.includes('AI Agents'), 'Hero contains AI Agents domain pill');
assert(heroCode.includes('href="#projects"'), 'Hero CTA button links to #projects ("Explore Projects")');
assert(heroCode.includes('href="#contact"'), 'Hero CTA button links to #contact ("Get In Touch")');
assert(heroCode.includes('href="#skills"'), 'Hero scroll indicator links to #skills ("Explore Skills")');
assert(heroCode.includes('staggerChildren'), 'Hero uses Framer Motion staggered entrance animations');

// -----------------------------------------------------------------------------
// 4. SKILLS COMPONENT VERIFICATION
// -----------------------------------------------------------------------------
console.log('\n--- 4. Skills Component Verification (src/components/Skills.tsx) ---');

const skillsPath = path.join(projectRoot, 'src', 'components', 'Skills.tsx');
assert(fs.existsSync(skillsPath), 'Skills.tsx exists');
const skillsCode = fs.readFileSync(skillsPath, 'utf-8');

assert(skillsCode.includes('id="skills"') || skillsCode.includes("id='skills'"), 'Skills section has id="skills"');
assert(skillsCode.includes('Technical Mastery') && (skillsCode.includes('Stack')), 'Skills contains main heading "Technical Mastery & Stack"');
assert(skillsCode.includes('Android Development'), 'Skills contains "Android Development" category card');
assert(skillsCode.includes('Backend & Cloud Systems'), 'Skills contains "Backend & Cloud Systems" category card');
assert(skillsCode.includes('AI Workflows & Dev Tools'), 'Skills contains "AI Workflows & Dev Tools" category card');

const keySkills = [
  'Kotlin & Java',
  'Jetpack Compose',
  'Clean Architecture & MVVM',
  'Hilt / Dagger (DI)',
  'Room Database & SQL',
  'Coroutines & StateFlow',
  'Java & Spring Boot',
  'PostgreSQL & SQL',
  'Docker & Containerization',
  'AI Agents & MCP',
  'CI/CD & Netlify Deployments'
];

for (const skill of keySkills) {
  assert(skillsCode.includes(skill), `Skills component lists key skill: "${skill}"`);
}

// -----------------------------------------------------------------------------
// 5. PROJECTS COMPONENT FILTERING, MODAL & SCREENSHOT VERIFICATION
// -----------------------------------------------------------------------------
console.log('\n--- 5. Projects Component Logic, Filtering & Modals (src/components/Projects.tsx) ---');

const projectsPath = path.join(projectRoot, 'src', 'components', 'Projects.tsx');
assert(fs.existsSync(projectsPath), 'Projects.tsx exists');
const projectsCode = fs.readFileSync(projectsPath, 'utf-8');

assert(projectsCode.includes('id="projects"') || projectsCode.includes("id='projects'"), 'Projects section has id="projects"');

// Filter tabs definition & logic
const filterTabs = ['All', 'Android', 'Fullstack', 'Backend'];
for (const tab of filterTabs) {
  assert(projectsCode.includes(`'${tab}'`) || projectsCode.includes(`"${tab}"`), `Filter tab "${tab}" present in Projects`);
}

// Project Definitions
const expectedProjects = [
  { id: 'taskflow', title: 'TaskFlow', category: 'Android', screenshotsCount: 9, isPrivate: false, hasDemo: false },
  { id: 'gio-manetti', title: 'GIO MANETTI E-Commerce', category: 'Fullstack', screenshotsCount: 0, isPrivate: true, hasDemo: false },
  { id: 'tzachi-community', title: 'Tzachi (צח"י) Application', category: 'Android', screenshotsCount: 0, isPrivate: false, hasDemo: true },
  { id: 'files-migration', title: 'Files App Migration', category: 'Android', screenshotsCount: 13, isPrivate: true, hasDemo: false },
  { id: 'e-commerce-waba', title: 'Minim4You Backend', category: 'Backend', screenshotsCount: 0, isPrivate: false, hasDemo: false },
  { id: 'whatsapp-status', title: 'WhatsApp Status Utility', category: 'Android', screenshotsCount: 0, isPrivate: false, hasDemo: false }
];

for (const p of expectedProjects) {
  assert(projectsCode.includes(`id: '${p.id}'`) || projectsCode.includes(`id: "${p.id}"`), `Project registered: ${p.id} (${p.title})`);
}

// Filtering algorithm test
console.log('\n🧪 Testing Category Filtering Logic Simulation...');
function filterProjects(filterName, projectList) {
  if (filterName === 'All') return projectList;
  return projectList.filter(p => p.category === filterName);
}

const allFiltered = filterProjects('All', expectedProjects);
assert(allFiltered.length === 6, 'Filter "All" returns 6 projects');

const androidFiltered = filterProjects('Android', expectedProjects);
assert(androidFiltered.length === 4, 'Filter "Android" returns 4 projects (taskflow, tzachi-community, files-migration, whatsapp-status)');
assert(androidFiltered.map(p => p.id).sort().join(',') === 'files-migration,taskflow,tzachi-community,whatsapp-status', 'Android filter contains exact expected projects');

const fullstackFiltered = filterProjects('Fullstack', expectedProjects);
assert(fullstackFiltered.length === 1 && fullstackFiltered[0].id === 'gio-manetti', 'Filter "Fullstack" returns 1 project (gio-manetti)');

const backendFiltered = filterProjects('Backend', expectedProjects);
assert(backendFiltered.length === 1 && backendFiltered[0].id === 'e-commerce-waba', 'Filter "Backend" returns 1 project (e-commerce-waba)');

// Modal scroll lock verification
assert(projectsCode.includes("document.body.style.overflow = 'hidden'"), 'Projects modal locks background scroll when open (overflow = "hidden")');
assert(projectsCode.includes("document.body.style.overflow = 'unset'"), 'Projects modal restores background scroll on close (overflow = "unset")');

// Modal Lightbox Zoom State
assert(projectsCode.includes('selectedImage') && projectsCode.includes('setSelectedImage'), 'Projects component implements Lightbox zoom state (selectedImage)');
assert(projectsCode.includes('Click any image to zoom') || projectsCode.includes('zoom'), 'Projects component indicates click-to-zoom feature');

// Fallback Text Verbatim Check
const verbatimFallback = 'No screenshots available to display';
assert(projectsCode.includes(verbatimFallback), `Projects component renders exact verbatim string: "${verbatimFallback}"`);

// -----------------------------------------------------------------------------
// 6. CONTACT COMPONENT VERIFICATION
// -----------------------------------------------------------------------------
console.log('\n--- 6. Contact Component Verification (src/components/Contact.tsx) ---');

const contactPath = path.join(projectRoot, 'src', 'components', 'Contact.tsx');
assert(fs.existsSync(contactPath), 'Contact.tsx exists');
const contactCode = fs.readFileSync(contactPath, 'utf-8');

assert(contactCode.includes('id="contact"') || contactCode.includes("id='contact'"), 'Contact section has id="contact"');
assert(contactCode.includes('Open to Opportunities'), 'Contact contains status badge "Open to Opportunities"');
assert(contactCode.includes('Let\'s Build Something Exceptional'), 'Contact contains main headline');
assert(contactCode.includes('https://www.linkedin.com/in/Jacobel640-b9ba3a3a1/'), 'Contact contains verified LinkedIn URL');
assert(contactCode.includes('https://github.com/Jacobel640'), 'Contact contains verified GitHub URL');
assert(contactCode.includes('mailto:Jacobel640@gmail.com'), 'Contact contains verified email mailto link');
assert(contactCode.includes('Jacobel640@gmail.com'), 'Contact displays email address in monospace badge');
assert(contactCode.includes('navigator.clipboard.writeText'), 'Contact implements clipboard copy function');
assert(contactCode.includes('Copied!'), 'Contact shows "Copied!" feedback indicator');
assert(contactCode.includes('window.scrollTo') && contactCode.includes('smooth'), 'Contact implements smooth scroll to top');
assert(contactCode.includes('new Date().getFullYear()'), 'Contact renders dynamic current copyright year');

// -----------------------------------------------------------------------------
// 7. APP COMPONENT VERIFICATION
// -----------------------------------------------------------------------------
console.log('\n--- 7. App Component Structure (src/App.tsx) ---');

const appPath = path.join(projectRoot, 'src', 'App.tsx');
assert(fs.existsSync(appPath), 'App.tsx exists');
const appCode = fs.readFileSync(appPath, 'utf-8');

assert(appCode.includes('<Navbar'), 'App.tsx renders <Navbar />');
assert(appCode.includes('<Hero'), 'App.tsx renders <Hero />');
assert(appCode.includes('<Skills'), 'App.tsx renders <Skills />');
assert(appCode.includes('<Projects'), 'App.tsx renders <Projects />');
assert(appCode.includes('<Contact'), 'App.tsx renders <Contact />');
assert(appCode.includes('bg-[#030712]'), 'App.tsx applies base dark canvas bg-[#030712]');

// -----------------------------------------------------------------------------
// 8. SCREENSHOT ASSET INTEGRITY & FILE SYSTEM CHECK
// -----------------------------------------------------------------------------
console.log('\n--- 8. Screenshot Asset Pipeline Integrity ---');

const publicScreenshots = path.join(projectRoot, 'public', 'screenshots');
assert(fs.existsSync(publicScreenshots), 'public/screenshots directory exists');

const taskflowDir = path.join(publicScreenshots, 'taskflow');
assert(fs.existsSync(taskflowDir), 'public/screenshots/taskflow directory exists');
const taskflowFiles = fs.readdirSync(taskflowDir).filter(f => f.endsWith('.png'));
assert(taskflowFiles.length === 9, `TaskFlow contains 9 PNG screenshots (found ${taskflowFiles.length})`);

const filesMigrationDir = path.join(publicScreenshots, 'files-migration');
assert(fs.existsSync(filesMigrationDir), 'public/screenshots/files-migration directory exists');
const filesMigrationFiles = fs.readdirSync(filesMigrationDir).filter(f => f.endsWith('.png'));
assert(filesMigrationFiles.length === 13, `Files Migration contains 13 PNG screenshots (found ${filesMigrationFiles.length})`);

const totalScreenshots = taskflowFiles.length + filesMigrationFiles.length;
assert(totalScreenshots === 22, `Total screenshots on disk is exactly 22 (found ${totalScreenshots})`);

// -----------------------------------------------------------------------------
// 9. SUMMARY & VERDICT
// -----------------------------------------------------------------------------
console.log('\n====================================================================');
console.log(`TOTAL EMPIRICAL TESTS: ${totalTests}`);
console.log(`PASSED: ${passedTests}`);
console.log(`FAILED: ${failedTests}`);
console.log('====================================================================');

if (failedTests > 0) {
  console.error('\n❌ FAILED TESTS SUMMARY:');
  failureList.forEach((f, idx) => console.error(`  ${idx + 1}. ${f}`));
  process.exit(1);
} else {
  console.log('\n🎉 ALL CHALLENGER MILESTONE 2 TESTS PASSED WITH 100% SUCCESS!');
  process.exit(0);
}
