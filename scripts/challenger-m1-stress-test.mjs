#!/usr/bin/env node
import { readFileSync, existsSync } from 'fs';
import { resolve, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = resolve(fileURLToPath(import.meta.url), '..');
const ROOT_DIR = resolve(__dirname, '..');
const PROJECTS_TSX_PATH = join(ROOT_DIR, 'src', 'components', 'Projects.tsx');
const PUBLIC_DIR = join(ROOT_DIR, 'public');

console.log('============================================================');
console.log('🔬 ADVERSARIAL CHALLENGER: Milestone 1 Modal & Project Test Harness');
console.log('============================================================');

const source = readFileSync(PROJECTS_TSX_PATH, 'utf-8');

// Extract projects data using AST-like regex evaluation or evaluated object
// Let's verify all 6 required projects are defined and inspect their properties
const expectedProjects = [
  { id: 'taskflow', name: 'TaskFlow', expectedScreenshotsCount: 9, expectFallback: false },
  { id: 'gio-manetti', name: 'GIO MANETTI E-Commerce', expectedScreenshotsCount: 0, expectFallback: true },
  { id: 'tzachi-community', name: 'Tzachi (צח"י) Application', expectedScreenshotsCount: 0, expectFallback: true },
  { id: 'files-migration', name: 'Files App Migration', expectedScreenshotsCount: 13, expectFallback: false },
  { id: 'e-commerce-waba', name: 'Minim4You Backend', expectedScreenshotsCount: 0, expectFallback: true },
  { id: 'whatsapp-status', name: 'WhatsApp Status Utility', expectedScreenshotsCount: 0, expectFallback: true },
];

let allPassed = true;
const testResults = [];

console.log('\n--- 1. Testing Project Metadata & Modal Display Rules ---');

for (const proj of expectedProjects) {
  const hasId = source.includes(`id: '${proj.id}'`);
  if (!hasId) {
    console.error(`❌ Project '${proj.id}' not found in Projects.tsx!`);
    allPassed = false;
    continue;
  }

  // Find the project block in source
  const projBlockRegex = new RegExp(`id:\\s*'${proj.id}'[\\s\\S]*?(?=(?:\\{[\\s\\n]*id:|\\];))`, 'g');
  const match = projBlockRegex.exec(source);
  const block = match ? match[0] : '';

  // Extract screenshot paths in this block
  const screenshotPaths = [...block.matchAll(/'(\/screenshots\/[^']+)'/g)].map(m => m[1]);
  // Unique screenshot paths
  const uniquePaths = [...new Set(screenshotPaths)];

  console.log(`\n📦 Project: [${proj.id}] ${proj.name}`);
  console.log(`   Expected Screenshots: ${proj.expectedScreenshotsCount}`);
  console.log(`   Found Unique Screenshot Paths: ${uniquePaths.length}`);
  console.log(`   Expected Modal Behavior: ${proj.expectFallback ? 'Displays fallback "No screenshots available to display"' : 'Displays screenshot gallery'}`);

  if (uniquePaths.length !== proj.expectedScreenshotsCount) {
    console.error(`   ❌ Screenshot count mismatch: expected ${proj.expectedScreenshotsCount}, got ${uniquePaths.length}`);
    allPassed = false;
  } else {
    console.log(`   ✅ Screenshot count matches expectation.`);
  }

  // If screenshots are present, verify each path exists on disk in public folder
  if (uniquePaths.length > 0) {
    let filesExist = true;
    for (const relPath of uniquePaths) {
      const diskPath = join(PUBLIC_DIR, relPath.replace(/^\//, ''));
      if (!existsSync(diskPath)) {
        console.error(`   ❌ Missing file on disk: ${diskPath}`);
        filesExist = false;
        allPassed = false;
      }
    }
    if (filesExist) {
      console.log(`   ✅ All ${uniquePaths.length} screenshot files exist on disk.`);
    }
  }

  // Simulate modal render condition
  const mockProject = {
    detailedContent: {
      screenshots: uniquePaths
    },
    screenshots: uniquePaths
  };

  const hasScreenshots = (
    (mockProject.detailedContent?.screenshots && mockProject.detailedContent.screenshots.length > 0) ||
    (mockProject.screenshots && mockProject.screenshots.length > 0)
  );

  const rendersFallback = !hasScreenshots;
  if (rendersFallback === proj.expectFallback) {
    console.log(`   ✅ Modal render simulation: ${rendersFallback ? 'FALLBACK TRIGGERED' : 'GALLERY RENDERED'} (MATCHES EXPECTATION)`);
  } else {
    console.error(`   ❌ Modal render simulation mismatch! Expected fallback=${proj.expectFallback}, got ${rendersFallback}`);
    allPassed = false;
  }
}

console.log('\n--- 2. Stress-Testing Adversarial Edge Cases ---');

const edgeCases = [
  { name: 'detailedContent.screenshots is undefined, screenshots is undefined', proj: {}, expectFallback: true },
  { name: 'detailedContent.screenshots is [], screenshots is []', proj: { detailedContent: { screenshots: [] }, screenshots: [] }, expectFallback: true },
  { name: 'detailedContent.screenshots is null, screenshots is null', proj: { detailedContent: { screenshots: null }, screenshots: null }, expectFallback: true },
  { name: 'detailedContent is undefined, screenshots has 1 image', proj: { screenshots: ['/screenshots/taskflow/app_icon.png'] }, expectFallback: false },
  { name: 'screenshots is undefined, detailedContent has 1 image', proj: { detailedContent: { screenshots: ['/screenshots/taskflow/app_icon.png'] } }, expectFallback: false },
  { name: 'detailedContent.screenshots is empty, screenshots has 1 image', proj: { detailedContent: { screenshots: [] }, screenshots: ['/screenshots/taskflow/app_icon.png'] }, expectFallback: false },
];

for (const ec of edgeCases) {
  try {
    const hasScreenshots = Boolean(
      (ec.proj.detailedContent?.screenshots && ec.proj.detailedContent.screenshots.length > 0) ||
      (ec.proj.screenshots && ec.proj.screenshots.length > 0)
    );
    const rendersFallback = !hasScreenshots;
    if (rendersFallback === ec.expectFallback) {
      console.log(`   ✅ [PASS] Edge case: ${ec.name} -> fallback: ${rendersFallback}`);
    } else {
      console.error(`   ❌ [FAIL] Edge case: ${ec.name} -> expected fallback ${ec.expectFallback}, got ${rendersFallback}`);
      allPassed = false;
    }
  } catch (err) {
    console.error(`   ❌ [CRASH] Edge case threw exception: ${ec.name}`, err);
    allPassed = false;
  }
}

console.log('\n--- 3. Verifying Exact Verbatim Fallback String in JSX ---');
const REQUIRED_STRING = 'No screenshots available to display';
if (source.includes(REQUIRED_STRING)) {
  console.log(`   ✅ Exact string "${REQUIRED_STRING}" is present in Projects.tsx JSX.`);
} else {
  console.error(`   ❌ Verbatim string "${REQUIRED_STRING}" NOT found in Projects.tsx!`);
  allPassed = false;
}

console.log('\n============================================================');
if (allPassed) {
  console.log('🏆 ALL ADVERSARIAL & EMPIRICAL CHALLENGER TESTS PASSED!');
  process.exit(0);
} else {
  console.error('💥 ADVERSARIAL CHALLENGER TESTS FAILED!');
  process.exit(1);
}
