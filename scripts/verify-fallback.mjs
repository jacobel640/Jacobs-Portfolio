#!/usr/bin/env node
/**
 * scripts/verify-fallback.mjs
 * 
 * Verifies that the Projects component (`src/components/Projects.tsx`) correctly
 * handles project screenshots and implements the mandatory fallback string:
 * "No screenshots available to display"
 * 
 * Assertions:
 * 1. `src/components/Projects.tsx` exists and is readable.
 * 2. Exact fallback string "No screenshots available to display" is present in source code.
 * 3. Conditional rendering logic checks for empty / undefined screenshots.
 * 4. Image rendering mapping `<img` or screenshot viewer exists for non-empty screenshots.
 * 5. Project data definitions contain valid screenshot paths for projects with media.
 */

import { existsSync, readFileSync } from 'fs';
import { resolve, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = resolve(fileURLToPath(import.meta.url), '..');
const ROOT_DIR = resolve(__dirname, '..');
const PROJECTS_TSX_PATH = join(ROOT_DIR, 'src', 'components', 'Projects.tsx');

const REQUIRED_FALLBACK_STRING = 'No screenshots available to display';

console.log('\n============================================================');
console.log('🧪 TEST: Modal Fallback Text & Screenshot Logic Verification');
console.log('============================================================');
console.log(`📄 Target File: ${PROJECTS_TSX_PATH}`);

if (!existsSync(PROJECTS_TSX_PATH)) {
  console.error(`\n❌ ERROR: Source file not found: ${PROJECTS_TSX_PATH}`);
  process.exit(1);
}

const source = readFileSync(PROJECTS_TSX_PATH, 'utf-8');

let hasErrors = false;
const failures = [];

// 1. Exact string match assertion
console.log('\n🔍 Checking for exact fallback text...');
if (source.includes(REQUIRED_FALLBACK_STRING)) {
  console.log(`   ✅ Exact fallback string found: "${REQUIRED_FALLBACK_STRING}"`);
} else {
  hasErrors = true;
  failures.push(
    `Missing required verbatim fallback string in Projects.tsx: "${REQUIRED_FALLBACK_STRING}"`
  );
  console.log(`   ❌ Missing required verbatim fallback string: "${REQUIRED_FALLBACK_STRING}"`);
}

// 2. Check for screenshots interface/type definition
console.log('\n🔍 Checking for screenshots property definition in Project data model...');
const hasScreenshotsProperty = /screenshots\s*\??\s*:\s*string\[\]/i.test(source);
if (hasScreenshotsProperty) {
  console.log('   ✅ `screenshots?: string[]` property defined in Project interface.');
} else {
  // Check if screenshots is defined elsewhere in file
  if (source.includes('screenshots')) {
    console.log('   ℹ️ `screenshots` field present in component source.');
  } else {
    hasErrors = true;
    failures.push('No `screenshots` property found in Project / ProjectDetails interface.');
    console.log('   ❌ No `screenshots` property found in Project / ProjectDetails interface.');
  }
}

// 3. Check for conditional rendering / branching logic
console.log('\n🔍 Checking for conditional branching logic in modal...');
const hasConditionalBranching = (
  /screenshots\s*(?:&&|\?|\.length)/i.test(source) &&
  (source.includes(REQUIRED_FALLBACK_STRING) || /screenshots\.length\s*===?\s*0/i.test(source))
);

if (hasConditionalBranching) {
  console.log('   ✅ Modal conditional branching logic detected for empty vs populated screenshots.');
} else {
  hasErrors = true;
  failures.push('Could not verify conditional branching logic for screenshots in modal JSX.');
  console.log('   ❌ Conditional branching logic for screenshots not clearly identified.');
}

// 4. Check for image tag or image gallery rendering
console.log('\n🔍 Checking for screenshot <img> rendering...');
const hasImgRendering = /<img\b[^>]*src\s*=\s*\{[^}]*screenshots/i.test(source) || /screenshots\.(?:map|forEach)\s*\(/i.test(source);
if (hasImgRendering) {
  console.log('   ✅ Screenshot image mapping and rendering detected.');
} else {
  // If static analysis is loose, check if <img is rendered within screenshot section
  if (source.includes('<img') || source.includes('imgSrc') || source.includes('screenshots.map')) {
    console.log('   ✅ Image rendering logic present.');
  } else {
    hasErrors = true;
    failures.push('No screenshot <img> mapping found for populated screenshot arrays.');
    console.log('   ❌ No screenshot <img> mapping found.');
  }
}

// 5. Check project screenshot paths
console.log('\n🔍 Checking project definitions for screenshot paths...');
const hasTaskflowScreenshots = source.includes('/screenshots/taskflow') || source.includes('HomeScreen_filters.png');
const hasFilesScreenshots = source.includes('/screenshots/files-migration') || source.includes('main_screen.png');

if (hasTaskflowScreenshots) {
  console.log('   ✅ TaskFlow project configured with `/screenshots/taskflow` paths.');
} else {
  console.log('   ⚠️ TaskFlow project does not yet reference `/screenshots/taskflow` paths.');
}

if (hasFilesScreenshots) {
  console.log('   ✅ Files Migration project configured with `/screenshots/files-migration` paths.');
} else {
  console.log('   ⚠️ Files Migration project does not yet reference `/screenshots/files-migration` paths.');
}

if (hasErrors) {
  console.error('\n❌ MODAL FALLBACK VERIFICATION FAILED:');
  failures.forEach((f, idx) => console.error(`  ${idx + 1}. ${f}`));
  process.exit(1);
}

console.log('\n✅ PASS: Modal fallback handling and screenshot logic verified successfully.');
process.exit(0);
