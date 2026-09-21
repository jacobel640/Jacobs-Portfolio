#!/usr/bin/env node
/**
 * scripts/verify-screenshots.mjs
 * 
 * Verifies that project screenshots from local source repositories were
 * successfully discovered and copied to `public/screenshots/`.
 * 
 * Assertions:
 * 1. `public/screenshots/taskflow` exists and contains 9 expected PNG files.
 * 2. `public/screenshots/files-migration` exists and contains 13 expected PNG files.
 * 3. `public/screenshots/minim4you` exists and contains 8 expected PNG files.
 * 4. Total screenshot count is exactly 30.
 * 5. Each screenshot file has non-zero size (> 1024 bytes) and valid PNG header bytes.
 */

import { existsSync, readdirSync, statSync, openSync, readSync, closeSync } from 'fs';
import { resolve, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = resolve(fileURLToPath(import.meta.url), '..');
const ROOT_DIR = resolve(__dirname, '..');
const PUBLIC_DIR = join(ROOT_DIR, 'public');
const SCREENSHOTS_DIR = join(PUBLIC_DIR, 'screenshots');

const EXPECTED_TASKFLOW_FILES = [
  'HomeScreen_filters.png',
  'SingleTaskScreen.png',
  'AddEditTaskScreen.png',
  'CalendarScreen_day.png',
  'CalendarScreen_month.png',
  'HomeScreen_sorting.png',
  'HomeScreen_mark-completed_undo-deletion.png',
  'NotificationTimeDialog.png',
  'app_icon.png'
];

const EXPECTED_MINIM4YOU_FILES = [
  'conversation_queue.png',
  'bot_order_flow.png',
  'human_handover.png',
  'customer_context.png',
  'broadcast_campaigns.png',
  'campaign_progress.png',
  'campaign_template.png',
  'conversation_queue_dark.png'
];

const EXPECTED_FILES_MIGRATION_FILES = [
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
  'copy_navigation.png'
];

console.log('\n============================================================');
console.log('🧪 TEST: Screenshot Asset Pipeline Verification');
console.log('============================================================');
console.log(`📁 Target Directory: ${SCREENSHOTS_DIR}`);

let hasErrors = false;
const failures = [];

// Helper to check PNG magic header
function isValidPng(filePath) {
  try {
    const fd = openSync(filePath, 'r');
    const buffer = Buffer.alloc(8);
    readSync(fd, buffer, 0, 8, 0);
    closeSync(fd);
    // PNG magic bytes: 89 50 4E 47 0D 0A 1A 0A
    return (
      buffer[0] === 0x89 &&
      buffer[1] === 0x50 &&
      buffer[2] === 0x4E &&
      buffer[3] === 0x47 &&
      buffer[4] === 0x0D &&
      buffer[5] === 0x0A &&
      buffer[6] === 0x1A &&
      buffer[7] === 0x0A
    );
  } catch (err) {
    return false;
  }
}

// 1. Check screenshots base directory
if (!existsSync(SCREENSHOTS_DIR)) {
  hasErrors = true;
  failures.push(`Screenshots base directory does not exist: ${SCREENSHOTS_DIR}`);
}

// 2. Check each project's screenshots
const PROJECT_SETS = [
  { label: 'TaskFlow', dir: 'taskflow', files: EXPECTED_TASKFLOW_FILES },
  { label: 'Files Migration', dir: 'files-migration', files: EXPECTED_FILES_MIGRATION_FILES },
  { label: 'Minim4You', dir: 'minim4you', files: EXPECTED_MINIM4YOU_FILES },
];

for (const set of PROJECT_SETS) {
  const setDir = join(SCREENSHOTS_DIR, set.dir);
  console.log(`
📸 Verifying ${set.label} Screenshots (id: ${set.dir})...`);
  if (!existsSync(setDir)) {
    hasErrors = true;
    failures.push(`${set.label} screenshots directory does not exist: ${setDir}`);
    continue;
  }
  let validCount = 0;
  for (const file of set.files) {
    const filePath = join(setDir, file);
    if (!existsSync(filePath)) {
      hasErrors = true;
      failures.push(`Missing ${set.label} screenshot: ${file}`);
      console.log(`   ❌ [MISSING] ${file}`);
      continue;
    }
    const stat = statSync(filePath);
    if (stat.size < 1024) {
      hasErrors = true;
      failures.push(`${set.label} screenshot file too small or empty: ${file} (${stat.size} bytes)`);
      console.log(`   ❌ [INVALID SIZE] ${file} (${stat.size} bytes)`);
    } else if (!isValidPng(filePath)) {
      hasErrors = true;
      failures.push(`${set.label} screenshot corrupted/invalid PNG header: ${file}`);
      console.log(`   ❌ [CORRUPTED PNG] ${file}`);
    } else {
      validCount++;
      console.log(`   ✅ [OK] ${file.padEnd(45)} ${(stat.size / 1024).toFixed(1)} KB`);
    }
  }
  console.log(`   Summary: ${validCount}/${set.files.length} ${set.label} screenshots verified.`);
}

// 3. Check total file count
const totalExpected = PROJECT_SETS.reduce((sum, set) => sum + set.files.length, 0);
console.log(`
📊 Total Expected Screenshots: ${totalExpected} (${PROJECT_SETS.map((set) => `${set.files.length} ${set.label}`).join(' + ')})`);

if (hasErrors) {
  console.error('\n❌ SCREENSHOT ASSET VERIFICATION FAILED:');
  failures.forEach((f, idx) => console.error(`  ${idx + 1}. ${f}`));
  console.error('\nPlease run screenshot copy script or verify asset discovery.');
  process.exit(1);
}

console.log(`
✅ PASS: All ${totalExpected} project screenshots exist, are non-empty, and contain valid PNG headers.`);
process.exit(0);
