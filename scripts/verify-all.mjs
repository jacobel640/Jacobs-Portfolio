#!/usr/bin/env node
/**
 * scripts/verify-all.mjs
 * 
 * Master Test Runner for Jacobs Portfolio Verification Suite.
 * Executes all 4 verification scripts sequentially and outputs a unified
 * test report.
 * 
 * Suites executed:
 * 1. scripts/verify-build.mjs
 * 2. scripts/verify-bundle.mjs
 * 3. scripts/verify-screenshots.mjs
 * 4. scripts/verify-fallback.mjs
 */

import { spawnSync } from 'child_process';
import { resolve, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = resolve(fileURLToPath(import.meta.url), '..');
const ROOT_DIR = resolve(__dirname, '..');
const SCRIPTS_DIR = join(ROOT_DIR, 'scripts');

const SUITES = [
  {
    id: 'V1-BUILD',
    name: 'Build & TypeScript Compilation',
    script: join(SCRIPTS_DIR, 'verify-build.mjs'),
    description: 'Runs `npm run build` and checks for 0 compilation errors'
  },
  {
    id: 'V2-BUNDLE',
    name: 'Bundle Chunk Splitting & Size',
    script: join(SCRIPTS_DIR, 'verify-bundle.mjs'),
    description: 'Inspects dist/assets for chunk splitting (>= 4 chunks) and size metrics'
  },
  {
    id: 'V3-SCREENSHOTS',
    name: 'Screenshot Asset Pipeline',
    script: join(SCRIPTS_DIR, 'verify-screenshots.mjs'),
    description: 'Verifies 22 PNG screenshots in public/screenshots/ (9 TaskFlow, 13 Files)'
  },
  {
    id: 'V4-FALLBACK',
    name: 'Modal Fallback & Screenshot Logic',
    script: join(SCRIPTS_DIR, 'verify-fallback.mjs'),
    description: 'Asserts verbatim "No screenshots available to display" in Projects.tsx'
  }
];

console.log('\n================================================================================');
console.log('🚀 JACOBS PORTFOLIO ACCEPTANCE TEST RUNNER');
console.log('================================================================================');
console.log(`📁 Project Directory: ${ROOT_DIR}`);
console.log(`📋 Total Verification Suites: ${SUITES.length}`);
console.log('================================================================================\n');

const suiteResults = [];
let overallStartTime = Date.now();

for (let i = 0; i < SUITES.length; i++) {
  const suite = SUITES[i];
  console.log(`\n▶️ [${i + 1}/${SUITES.length}] Running Suite: ${suite.name} (${suite.id})...`);
  console.log(`   ${suite.description}`);
  
  const suiteStartTime = Date.now();
  const result = spawnSync(process.execPath, [suite.script], {
    cwd: ROOT_DIR,
    encoding: 'utf-8',
    shell: false,
    env: { ...process.env, FORCE_COLOR: '1' }
  });
  
  const duration = ((Date.now() - suiteStartTime) / 1000).toFixed(2);
  const passed = result.status === 0;

  // Print output from child script
  if (result.stdout) {
    console.log(result.stdout);
  }
  if (result.stderr && !passed) {
    console.error(result.stderr);
  }

  suiteResults.push({
    ...suite,
    passed,
    exitCode: result.status,
    duration: `${duration}s`,
    error: passed ? null : (result.stderr || result.stdout || 'Process failed')
  });

  if (passed) {
    console.log(`🟢 SUITE PASSED: ${suite.name} (${duration}s)`);
  } else {
    console.error(`🔴 SUITE FAILED: ${suite.name} (Exit code: ${result.status}, ${duration}s)`);
  }
}

const totalDuration = ((Date.now() - overallStartTime) / 1000).toFixed(2);
const allPassed = suiteResults.every(r => r.passed);
const passedCount = suiteResults.filter(r => r.passed).length;
const failedCount = suiteResults.filter(r => !r.passed).length;

console.log('\n\n================================================================================');
console.log('📊 FINAL TEST EXECUTION REPORT');
console.log('================================================================================');
console.log(
  String('Suite ID').padEnd(16) +
  String('Suite Name').padEnd(35) +
  String('Duration').padEnd(12) +
  String('Status')
);
console.log('--------------------------------------------------------------------------------');

suiteResults.forEach(r => {
  const statusStr = r.passed ? '✅ PASS' : '❌ FAIL';
  console.log(
    r.id.padEnd(16) +
    r.name.padEnd(35) +
    r.duration.padEnd(12) +
    statusStr
  );
});

console.log('--------------------------------------------------------------------------------');
console.log(`⏱️ Total Execution Time: ${totalDuration}s`);
console.log(`📈 Results: ${passedCount} Passed, ${failedCount} Failed (Total: ${SUITES.length})`);
console.log('================================================================================');

if (allPassed) {
  console.log('\n🎉 ALL ACCEPTANCE TEST SUITES PASSED CLEANLY (Exit Code: 0)');
  process.exit(0);
} else {
  console.error('\n💥 ONE OR MORE TEST SUITES FAILED (Exit Code: 1)');
  console.error('Inspect individual suite failure logs above for troubleshooting details.');
  process.exit(1);
}
