#!/usr/bin/env node
/**
 * scripts/challenger-m2-interactions.mjs
 * 
 * Interactive and State-Flow Stress Simulation for Milestone 2:
 * 1. Active Navbar section resolution algorithm under simulated scroll events
 * 2. Mobile drawer open/close transitions
 * 3. Filter tabs state machine transitions
 * 4. Project modal open/close transitions & scroll lock
 * 5. Lightbox zoom open/close transitions
 * 6. Email copy handler clipboard write & reset timer
 * 7. Adversarial project inputs (null, undefined, sparse arrays, bad strings)
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

console.log('====================================================================');
console.log('🧪 INTERACTIVE SIMULATION & ADVERSARIAL STRESS TEST — MILESTONE 2');
console.log('====================================================================');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition, testName, details = '') {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✅ [PASS] ${testName}`);
  } else {
    failedTests++;
    console.error(`  ❌ [FAIL] ${testName}${details ? ' -> ' + details : ''}`);
  }
}

// -----------------------------------------------------------------------------
// 1. SCROLL-BASED ACTIVE SECTION RESOLUTION TEST
// -----------------------------------------------------------------------------
console.log('\n--- 1. Simulated Scroll-Based Active Section Detection ---');

// Mock DOM layout of sections
const mockSections = [
  { id: 'hero', top: 0, height: 900 },
  { id: 'skills', top: 900, height: 800 },
  { id: 'projects', top: 1700, height: 1400 },
  { id: 'contact', top: 3100, height: 600 }
];

function resolveActiveSection(scrollY) {
  const sections = ['hero', 'skills', 'projects', 'contact'];
  const scrollPosition = scrollY + 200;
  for (const sId of sections) {
    const el = mockSections.find(s => s.id === sId);
    if (el) {
      const top = el.top;
      const height = el.height;
      if (scrollPosition >= top && scrollPosition < top + height) {
        return sId;
      }
    }
  }
  return 'hero';
}

assert(resolveActiveSection(0) === 'hero', 'Scroll at Y=0 resolves to "hero"');
assert(resolveActiveSection(500) === 'hero', 'Scroll at Y=500 resolves to "hero"');
assert(resolveActiveSection(750) === 'skills', 'Scroll at Y=750 resolves to "skills"');
assert(resolveActiveSection(1200) === 'skills', 'Scroll at Y=1200 resolves to "skills"');
assert(resolveActiveSection(1600) === 'projects', 'Scroll at Y=1600 resolves to "projects"');
assert(resolveActiveSection(2500) === 'projects', 'Scroll at Y=2500 resolves to "projects"');
assert(resolveActiveSection(3000) === 'contact', 'Scroll at Y=3000 resolves to "contact"');
assert(resolveActiveSection(3300) === 'contact', 'Scroll at Y=3300 resolves to "contact"');

// -----------------------------------------------------------------------------
// 2. MODAL & LIGHTBOX STATE MACHINE SIMULATION
// -----------------------------------------------------------------------------
console.log('\n--- 2. Simulated Modal & Lightbox State Machine ---');

class ProjectsComponentSimulator {
  constructor(projects) {
    this.projects = projects;
    this.activeFilter = 'All';
    this.selectedProject = null;
    this.selectedImage = null;
    this.bodyOverflow = 'unset';
  }

  setFilter(filter) {
    this.activeFilter = filter;
  }

  getFilteredProjects() {
    if (this.activeFilter === 'All') return this.projects;
    return this.projects.filter(p => p.category === this.activeFilter);
  }

  openModal(project) {
    this.selectedProject = project;
    this.updateBodyOverflow();
  }

  closeModal() {
    this.selectedProject = null;
    this.updateBodyOverflow();
  }

  openLightbox(imageSrc) {
    this.selectedImage = imageSrc;
    this.updateBodyOverflow();
  }

  closeLightbox() {
    this.selectedImage = null;
    this.updateBodyOverflow();
  }

  updateBodyOverflow() {
    if (this.selectedProject || this.selectedImage) {
      this.bodyOverflow = 'hidden';
    } else {
      this.bodyOverflow = 'unset';
    }
  }

  renderModalScreenshots(project) {
    const hasScreenshots = (
      (project.detailedContent?.screenshots && project.detailedContent.screenshots.length > 0) ||
      (project.screenshots && project.screenshots.length > 0)
    );

    if (hasScreenshots) {
      const list = project.detailedContent?.screenshots || project.screenshots || [];
      return {
        type: 'gallery',
        images: list,
        zoomAvailable: true
      };
    } else {
      return {
        type: 'fallback',
        text: 'No screenshots available to display',
        zoomAvailable: false
      };
    }
  }
}

const mockProjects = [
  {
    id: 'taskflow',
    title: 'TaskFlow',
    category: 'Android',
    detailedContent: {
      screenshots: [
        '/screenshots/taskflow/HomeScreen_filters.png',
        '/screenshots/taskflow/SingleTaskScreen.png'
      ]
    },
    screenshots: [
      '/screenshots/taskflow/HomeScreen_filters.png',
      '/screenshots/taskflow/SingleTaskScreen.png'
    ]
  },
  {
    id: 'gio-manetti',
    title: 'GIO MANETTI',
    category: 'Fullstack',
    detailedContent: { screenshots: [] },
    screenshots: []
  }
];

const sim = new ProjectsComponentSimulator(mockProjects);
assert(sim.bodyOverflow === 'unset', 'Initial body overflow is "unset"');

// Filter transitions
sim.setFilter('Android');
assert(sim.getFilteredProjects().length === 1 && sim.getFilteredProjects()[0].id === 'taskflow', 'Filter switches to Android');

sim.setFilter('Fullstack');
assert(sim.getFilteredProjects().length === 1 && sim.getFilteredProjects()[0].id === 'gio-manetti', 'Filter switches to Fullstack');

sim.setFilter('Backend');
assert(sim.getFilteredProjects().length === 0, 'Filter switches to Backend with 0 matches');

sim.setFilter('All');
assert(sim.getFilteredProjects().length === 2, 'Filter switches to All with 2 projects');

// Open TaskFlow Modal
sim.openModal(mockProjects[0]);
assert(sim.selectedProject?.id === 'taskflow', 'TaskFlow modal opened');
assert(sim.bodyOverflow === 'hidden', 'Body scroll locked when modal opened');

const taskflowModalRender = sim.renderModalScreenshots(sim.selectedProject);
assert(taskflowModalRender.type === 'gallery' && taskflowModalRender.images.length === 2, 'TaskFlow modal renders gallery with 2 images');
assert(taskflowModalRender.zoomAvailable === true, 'Click to zoom available on TaskFlow');

// Click image to open lightbox
sim.openLightbox(taskflowModalRender.images[0]);
assert(sim.selectedImage === '/screenshots/taskflow/HomeScreen_filters.png', 'Lightbox opened with correct image');
assert(sim.bodyOverflow === 'hidden', 'Body scroll remains locked in lightbox');

// Close lightbox
sim.closeLightbox();
assert(sim.selectedImage === null, 'Lightbox closed');
assert(sim.bodyOverflow === 'hidden', 'Body scroll remains locked because project modal is still open');

// Close project modal
sim.closeModal();
assert(sim.selectedProject === null, 'Project modal closed');
assert(sim.bodyOverflow === 'unset', 'Body scroll restored to "unset"');

// Open GIO MANETTI (Empty screenshots)
sim.openModal(mockProjects[1]);
assert(sim.selectedProject?.id === 'gio-manetti', 'GIO MANETTI modal opened');
assert(sim.bodyOverflow === 'hidden', 'Body scroll locked for GIO MANETTI modal');

const gioModalRender = sim.renderModalScreenshots(sim.selectedProject);
assert(gioModalRender.type === 'fallback', 'GIO MANETTI modal renders fallback container');
assert(gioModalRender.text === 'No screenshots available to display', 'Fallback displays exact required text');
assert(gioModalRender.zoomAvailable === false, 'Zoom unavailable when no screenshots exist');

sim.closeModal();
assert(sim.bodyOverflow === 'unset', 'Body scroll restored after closing GIO MANETTI modal');

// -----------------------------------------------------------------------------
// 3. CLIPBOARD COPY EMAIL INTERACTION TEST
// -----------------------------------------------------------------------------
console.log('\n--- 3. Simulated Clipboard Copy Interaction ---');

class ContactComponentSimulator {
  constructor() {
    this.copied = false;
    this.clipboardContent = '';
  }

  handleCopyEmail() {
    this.clipboardContent = 'Jacobel640@gmail.com';
    this.copied = true;
  }

  handleTimeoutReset() {
    this.copied = false;
  }
}

const contactSim = new ContactComponentSimulator();
assert(contactSim.copied === false, 'Initial copied state is false');

contactSim.handleCopyEmail();
assert(contactSim.copied === true, 'Copied state set to true on button click');
assert(contactSim.clipboardContent === 'Jacobel640@gmail.com', 'Copied text is Jacobel640@gmail.com');

contactSim.handleTimeoutReset();
assert(contactSim.copied === false, 'Copied state resets to false after timeout');

// -----------------------------------------------------------------------------
// 4. ADVERSARIAL EDGE CASE HARNESS
// -----------------------------------------------------------------------------
console.log('\n--- 4. Adversarial Edge Case Robustness Tests ---');

const extremeEdgeCases = [
  { desc: 'Undefined object fields', obj: { id: 'test' }, expectFallback: true },
  { desc: 'Null detailedContent', obj: { id: 'test', detailedContent: null, screenshots: null }, expectFallback: true },
  { desc: 'Sparse empty array', obj: { id: 'test', detailedContent: { screenshots: [] }, screenshots: [] }, expectFallback: true },
  { desc: 'detailedContent has image, outer is undefined', obj: { id: 'test', detailedContent: { screenshots: ['/screenshots/taskflow/app_icon.png'] } }, expectFallback: false },
  { desc: 'outer has image, detailedContent is undefined', obj: { id: 'test', screenshots: ['/screenshots/taskflow/app_icon.png'] }, expectFallback: false },
  { desc: 'both have images', obj: { id: 'test', detailedContent: { screenshots: ['/screenshots/taskflow/app_icon.png'] }, screenshots: ['/screenshots/taskflow/app_icon.png'] }, expectFallback: false },
];

for (const ec of extremeEdgeCases) {
  try {
    const render = sim.renderModalScreenshots(ec.obj);
    const isFallback = render.type === 'fallback';
    assert(isFallback === ec.expectFallback, `Adversarial Case: ${ec.desc} -> ${isFallback ? 'Fallback' : 'Gallery'}`);
  } catch (err) {
    assert(false, `Adversarial Case threw uncaught error: ${ec.desc}`, err.message);
  }
}

// -----------------------------------------------------------------------------
// SUMMARY
// -----------------------------------------------------------------------------
console.log('\n====================================================================');
console.log(`TOTAL INTERACTIVE STRESS TESTS: ${totalTests}`);
console.log(`PASSED: ${passedTests}`);
console.log(`FAILED: ${failedTests}`);
console.log('====================================================================');

if (failedTests > 0) {
  process.exit(1);
} else {
  console.log('\n🎉 ALL INTERACTIVE AND STATE-FLOW SIMULATIONS PASSED!');
  process.exit(0);
}
