import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

console.log('================================================================================');
console.log('🔬 EMPIRICAL CHALLENGER ADVERSARIAL STRESS TEST SUITE — MILESTONE 4 (TIER 5)');
console.log('================================================================================\n');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition, description, details = '') {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✅ PASS: ${description}`);
  } else {
    failedTests++;
    console.error(`  ❌ FAIL: ${description}`);
    if (details) console.error(`     Details: ${details}`);
  }
}

// -----------------------------------------------------------------------------
// 1. White-box Build Artifacts & HTML Entry Invariants
// -----------------------------------------------------------------------------
console.log('🔍 [SECTION 1] Production Distribution Invariants & Entry Integrity');
const distDir = path.join(projectRoot, 'dist');
assert(fs.existsSync(distDir), 'Directory dist/ exists');

const indexHtmlPath = path.join(distDir, 'index.html');
assert(fs.existsSync(indexHtmlPath), 'dist/index.html exists');

if (fs.existsSync(indexHtmlPath)) {
  const htmlContent = fs.readFileSync(indexHtmlPath, 'utf8');
  assert(htmlContent.includes('<div id="root"></div>'), 'dist/index.html includes root mount container');
  assert(htmlContent.includes('<script type="module"'), 'dist/index.html includes ES module script entry');
  assert(htmlContent.includes('rel="stylesheet"'), 'dist/index.html includes linked production CSS');
  assert(htmlContent.includes('charset="UTF-8"'), 'dist/index.html declares UTF-8 charset');
  assert(htmlContent.includes('viewport'), 'dist/index.html declares responsive viewport');
}

// -----------------------------------------------------------------------------
// 2. JavaScript Chunk Isolation & Payload Limits
// -----------------------------------------------------------------------------
console.log('\n🔍 [SECTION 2] Bundle Chunk Distribution & Budget Enforcements');
const jsDir = path.join(distDir, 'assets', 'js');
assert(fs.existsSync(jsDir), 'dist/assets/js exists');

if (fs.existsSync(jsDir)) {
  const jsFiles = fs.readdirSync(jsDir).filter((f) => f.endsWith('.js'));
  assert(jsFiles.length >= 4, `JS chunk count (${jsFiles.length}) satisfies requirement >= 4`);

  const entryChunk = jsFiles.find((f) => f.startsWith('index-'));
  assert(!!entryChunk, 'Entry chunk index-*.js exists');
  if (entryChunk) {
    const entrySize = fs.statSync(path.join(jsDir, entryChunk)).size;
    assert(entrySize < 150 * 1024, `Initial JS payload (${(entrySize / 1024).toFixed(2)} KB) is strictly < 150 KB budget`);
  }

  const reactVendor = jsFiles.find((f) => f.startsWith('vendor-react-'));
  assert(!!reactVendor, 'Isolated vendor-react chunk exists');
  if (reactVendor) {
    const reactSize = fs.statSync(path.join(jsDir, reactVendor)).size;
    assert(reactSize < 300 * 1024, `vendor-react chunk (${(reactSize / 1024).toFixed(2)} KB) is < 300 KB budget`);
  }

  const motionVendor = jsFiles.find((f) => f.startsWith('vendor-framer-motion-'));
  assert(!!motionVendor, 'Isolated vendor-framer-motion chunk exists');
  if (motionVendor) {
    const motionSize = fs.statSync(path.join(jsDir, motionVendor)).size;
    assert(motionSize < 250 * 1024, `vendor-framer-motion chunk (${(motionSize / 1024).toFixed(2)} KB) is < 250 KB budget`);
  }

  const lucideVendor = jsFiles.find((f) => f.startsWith('vendor-lucide-'));
  assert(!!lucideVendor, 'Isolated vendor-lucide chunk exists');

  const lazyChunks = ['Skills-', 'Projects-', 'Contact-'];
  for (const prefix of lazyChunks) {
    const chunk = jsFiles.find((f) => f.startsWith(prefix));
    assert(!!chunk, `Lazy route chunk ${prefix}*.js exists independently`);
  }
}

// -----------------------------------------------------------------------------
// 3. Binary Screenshot Asset Deep Integrity
// -----------------------------------------------------------------------------
console.log('\n🔍 [SECTION 3] Binary Screenshot Asset Deep Integrity');
const screenshotsBase = path.join(projectRoot, 'public', 'screenshots');
assert(fs.existsSync(screenshotsBase), 'public/screenshots base directory exists');

const taskflowDir = path.join(screenshotsBase, 'taskflow');
const filesDir = path.join(screenshotsBase, 'files-migration');

assert(fs.existsSync(taskflowDir), 'public/screenshots/taskflow exists');
assert(fs.existsSync(filesDir), 'public/screenshots/files-migration exists');

const expectedTaskflow = [
  'HomeScreen_filters.png',
  'SingleTaskScreen.png',
  'AddEditTaskScreen.png',
  'CalendarScreen_day.png',
  'CalendarScreen_month.png',
  'HomeScreen_sorting.png',
  'HomeScreen_mark-completed_undo-deletion.png',
  'NotificationTimeDialog.png',
  'app_icon.png',
];

const expectedFiles = [
  'main_screen.png',
  'file_explorer_grid.png',
  'file_explorer_row.png',
  'file_actions.png',
  'search_screen.png',
  'search_filters_1.png',
  'search_filters_2.png',
  'sort_options_sheet.png',
  'selected_file_details.png',
  'multi_selected_details.png',
  'last_files.png',
  'storage_analizer.png',
  'copy_navigation.png',
];

let validPngs = 0;
const checkPngFile = (filePath) => {
  if (!fs.existsSync(filePath)) return false;
  const stat = fs.statSync(filePath);
  if (stat.size < 1024) return false;
  const fd = fs.openSync(filePath, 'r');
  const buffer = Buffer.alloc(8);
  fs.readSync(fd, buffer, 0, 8, 0);
  fs.closeSync(fd);
  // PNG Magic bytes: 89 50 4E 47 0D 0A 1A 0A
  return (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  );
};

for (const tf of expectedTaskflow) {
  const p = path.join(taskflowDir, tf);
  const ok = checkPngFile(p);
  if (ok) validPngs++;
  assert(ok, `TaskFlow image '${tf}' is valid PNG (>=1KB + valid magic bytes)`);
}

for (const ff of expectedFiles) {
  const p = path.join(filesDir, ff);
  const ok = checkPngFile(p);
  if (ok) validPngs++;
  assert(ok, `Files Migration image '${ff}' is valid PNG (>=1KB + valid magic bytes)`);
}

assert(validPngs === 22, `Total valid PNG assets equals exactly 22 (${validPngs}/22)`);

// -----------------------------------------------------------------------------
// 4. Projects.tsx Fallback Text & Modal Logic Invariants
// -----------------------------------------------------------------------------
console.log('\n🔍 [SECTION 4] Projects.tsx Fallback Text & Modal Logic Invariants');
const projectsFile = path.join(projectRoot, 'src', 'components', 'Projects.tsx');
assert(fs.existsSync(projectsFile), 'src/components/Projects.tsx exists');

const projectsSrc = fs.readFileSync(projectsFile, 'utf8');

const targetFallback = 'No screenshots available to display';
assert(projectsSrc.includes(targetFallback), `Exact fallback string "${targetFallback}" is present in Projects.tsx`);

// Verify no Windows backslashes in URL paths
const hasBackslashUrls = /['"]\/screenshots\\[^'"]+['"]/.test(projectsSrc);
assert(!hasBackslashUrls, 'All screenshot paths use web-standard forward slashes (/screenshots/...)');

// Verify all paths in Projects.tsx map to actual files
const urlMatches = projectsSrc.match(/\/screenshots\/[a-zA-Z0-9_\-./]+\.png/g) || [];
const uniqueUrls = [...new Set(urlMatches)];
assert(uniqueUrls.length === 22, `Found ${uniqueUrls.length} unique screenshot URLs in Projects.tsx (expected 22)`);

for (const url of uniqueUrls) {
  const relPath = url.replace(/^\//, '');
  const physicalPath = path.join(projectRoot, 'public', relPath);
  assert(fs.existsSync(physicalPath), `URL path "${url}" resolves to existing file on disk`);
}

// -----------------------------------------------------------------------------
// 5. Tailwind & CSS Compilation Artifacts
// -----------------------------------------------------------------------------
console.log('\n🔍 [SECTION 5] CSS Compilation & PostCSS Output');
const cssDir = path.join(distDir, 'assets', 'css');
assert(fs.existsSync(cssDir), 'dist/assets/css exists');

if (fs.existsSync(cssDir)) {
  const cssFiles = fs.readdirSync(cssDir).filter((f) => f.endsWith('.css'));
  assert(cssFiles.length >= 1, `Compiled CSS file count (${cssFiles.length}) >= 1`);
  if (cssFiles.length > 0) {
    const cssContent = fs.readFileSync(path.join(cssDir, cssFiles[0]), 'utf8');
    assert(cssContent.includes('backdrop-blur'), 'Compiled CSS contains backdrop-blur utilities');
    assert(cssContent.includes('#030712'), 'Compiled CSS contains dark theme base color #030712');
  }
}

// -----------------------------------------------------------------------------
// Final Evaluation
// -----------------------------------------------------------------------------
console.log('\n================================================================================');
console.log(`📊 TIER 5 STRESS TEST RESULTS: ${passedTests}/${totalTests} Passed (${failedTests} Failed)`);
console.log('================================================================================');

if (failedTests > 0) {
  console.error('❌ TIER 5 ADVERSARIAL VERIFICATION FAILED');
  process.exit(1);
} else {
  console.log('🎉 TIER 5 ADVERSARIAL VERIFICATION COMPLETED WITH 100% SUCCESS (Exit Code 0)');
  process.exit(0);
}
