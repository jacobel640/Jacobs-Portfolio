import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

console.log('====================================================');
console.log('EMPIRICAL CHALLENGER TEST SUITE — MILESTONE 1');
console.log('====================================================');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition, testName, details = '') {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  [PASS] ${testName}`);
  } else {
    failedTests++;
    console.error(`  [FAIL] ${testName}: ${details}`);
  }
}

// 1. Source vs Dest byte-level hash comparison
console.log('\n--- 1. Asset Integrity & Hash Verification ---');
const mappings = [
  {
    name: 'TaskFlow',
    sourceDir: 'C:\\Users\\jacob\\Files\\Programming\\AndroidStudio\\TaskFlow\\screenshots',
    destDir: path.join(projectRoot, 'public', 'screenshots', 'taskflow'),
    expectedCount: 9
  },
  {
    name: 'Files Migration',
    sourceDir: 'C:\\Users\\jacob\\Files\\Programming\\AndroidStudio\\Files\\screenshots',
    destDir: path.join(projectRoot, 'public', 'screenshots', 'files-migration'),
    expectedCount: 13
  }
];

function getFileSha256(filePath) {
  const fileBuffer = fs.readFileSync(filePath);
  const hashSum = crypto.createHash('sha256');
  hashSum.update(fileBuffer);
  return hashSum.digest('hex');
}

function verifyPngDimensions(filePath) {
  const buf = fs.readFileSync(filePath);
  // PNG signature: 89 50 4E 47 0D 0A 1A 0A
  const isPng = buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4E && buf[3] === 0x47 &&
                buf[4] === 0x0D && buf[5] === 0x0A && buf[6] === 0x1A && buf[7] === 0x0A;
  if (!isPng) return { valid: false, reason: 'Invalid PNG magic bytes' };
  
  // IHDR chunk starts at byte 12 (chunk type 'IHDR' at 12-15, width at 16-19, height at 20-23)
  const ihdr = buf.toString('ascii', 12, 16);
  if (ihdr !== 'IHDR') return { valid: false, reason: 'Missing IHDR chunk' };

  const width = buf.readUInt32BE(16);
  const height = buf.readUInt32BE(20);
  return { valid: true, width, height, size: buf.length };
}

let totalVerifiedScreenshots = 0;

for (const m of mappings) {
  assert(fs.existsSync(m.destDir), `Destination directory exists: ${m.name}`);
  const destFiles = fs.readdirSync(m.destDir).filter(f => f.endsWith('.png'));
  assert(destFiles.length === m.expectedCount, `${m.name} count matches expected (${destFiles.length}/${m.expectedCount})`);

  for (const file of destFiles) {
    const destPath = path.join(m.destDir, file);
    const srcPath = path.join(m.sourceDir, file);

    assert(fs.existsSync(srcPath), `Source file exists for ${file}`);
    const srcHash = getFileSha256(srcPath);
    const destHash = getFileSha256(destPath);
    assert(srcHash === destHash, `SHA256 hash match for ${file}`, `src=${srcHash} dest=${destHash}`);

    const pngInfo = verifyPngDimensions(destPath);
    assert(pngInfo.valid && pngInfo.width > 0 && pngInfo.height > 0, `Valid PNG header & dimensions for ${file} (${pngInfo.width}x${pngInfo.height}, ${pngInfo.size} bytes)`);
    totalVerifiedScreenshots++;
  }
}

assert(totalVerifiedScreenshots === 22, `Total verified screenshots across projects is exactly 22 (${totalVerifiedScreenshots}/22)`);

// 2. Static Analysis & Edge Case Evaluation of Projects.tsx
console.log('\n--- 2. Project Data & Modal Rendering Logic Analysis ---');
const projectsFilePath = path.join(projectRoot, 'src', 'components', 'Projects.tsx');
assert(fs.existsSync(projectsFilePath), 'src/components/Projects.tsx exists');

const code = fs.readFileSync(projectsFilePath, 'utf-8');

// Check exact fallback string
const exactFallback = 'No screenshots available to display';
assert(code.includes(exactFallback), `Projects.tsx contains verbatim fallback: "${exactFallback}"`);

// Check project definitions
const expectedProjectIds = ['taskflow', 'gio-manetti', 'tzachi-community', 'files-migration', 'e-commerce-waba', 'whatsapp-status'];
for (const pid of expectedProjectIds) {
  assert(code.includes(`id: '${pid}'`) || code.includes(`id: "${pid}"`), `Project ID registered: ${pid}`);
}

// 3. Simulated Pure Logic Edge Case Harness for Modal Screenshot Condition
console.log('\n--- 3. Modal Screenshots Conditional Logic Simulation ---');

function evaluateModalScreenshotCondition(project) {
  // Logic mirrored from Projects.tsx:
  // (selectedProject.detailedContent?.screenshots && selectedProject.detailedContent.screenshots.length > 0) ||
  // (selectedProject.screenshots && selectedProject.screenshots.length > 0)
  const hasScreenshots = (project.detailedContent?.screenshots && project.detailedContent.screenshots.length > 0) ||
                         (project.screenshots && project.screenshots.length > 0);
  
  if (hasScreenshots) {
    const list = project.detailedContent?.screenshots || project.screenshots || [];
    return { render: 'gallery', count: list.length, items: list };
  } else {
    return { render: 'fallback', text: exactFallback };
  }
}

// Edge case 1: TaskFlow with 9 screenshots
const testTaskFlow = {
  id: 'taskflow',
  detailedContent: {
    screenshots: [
      '/screenshots/taskflow/HomeScreen_filters.png',
      '/screenshots/taskflow/SingleTaskScreen.png',
      '/screenshots/taskflow/AddEditTaskScreen.png',
      '/screenshots/taskflow/CalendarScreen_day.png',
      '/screenshots/taskflow/CalendarScreen_month.png',
      '/screenshots/taskflow/HomeScreen_sorting.png',
      '/screenshots/taskflow/HomeScreen_mark-completed_undo-deletion.png',
      '/screenshots/taskflow/NotificationTimeDialog.png',
      '/screenshots/taskflow/app_icon.png'
    ]
  },
  screenshots: []
};
const res1 = evaluateModalScreenshotCondition(testTaskFlow);
assert(res1.render === 'gallery' && res1.count === 9, 'TaskFlow renders gallery with 9 images');

// Edge case 2: Empty array on both
const testEmpty = {
  id: 'gio-manetti',
  detailedContent: { screenshots: [] },
  screenshots: []
};
const res2 = evaluateModalScreenshotCondition(testEmpty);
assert(res2.render === 'fallback' && res2.text === exactFallback, 'Empty screenshot array renders verbatim fallback');

// Edge case 3: Undefined screenshots property
const testUndefined = {
  id: 'unknown-project',
  detailedContent: {}
};
const res3 = evaluateModalScreenshotCondition(testUndefined);
assert(res3.render === 'fallback' && res3.text === exactFallback, 'Undefined screenshots renders verbatim fallback');

// Edge case 4: Screenshots defined on outer project but not detailedContent
const testOuterOnly = {
  id: 'outer-only',
  detailedContent: {},
  screenshots: ['/screenshots/files-migration/main_screen.png']
};
const res4 = evaluateModalScreenshotCondition(testOuterOnly);
assert(res4.render === 'gallery' && res4.count === 1, 'Outer screenshots fallback works');

// Edge case 5: Null / undefined project detailedContent object safe navigation
const testNullDetailed = {
  id: 'null-detailed',
  detailedContent: null,
  screenshots: undefined
};
let nullSafePassed = false;
try {
  const res5 = evaluateModalScreenshotCondition(testNullDetailed);
  nullSafePassed = (res5.render === 'fallback' && res5.text === exactFallback);
} catch (e) {
  nullSafePassed = false;
}
assert(nullSafePassed, 'Null detailedContent does not throw and renders fallback');

console.log('\n====================================================');
console.log(`TOTAL TESTS: ${totalTests}`);
console.log(`PASSED: ${passedTests}`);
console.log(`FAILED: ${failedTests}`);
console.log('====================================================');

if (failedTests > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
