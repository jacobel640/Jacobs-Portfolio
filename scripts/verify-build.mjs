#!/usr/bin/env node
/**
 * scripts/verify-build.mjs
 * 
 * Verifies that the TypeScript compilation (tsc) and Vite production build
 * execute successfully with zero compilation or bundling errors.
 * 
 * Assertions:
 * 1. Executes `npm run build` with exit code 0.
 * 2. Asserts no TypeScript type errors (e.g. TS2xxx) in build output.
 * 3. Asserts that `dist/index.html` was generated.
 * 4. Asserts that `dist/assets` directory exists and contains generated assets.
 */

import { spawnSync } from 'child_process';
import { existsSync, readdirSync } from 'fs';
import { resolve, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = resolve(fileURLToPath(import.meta.url), '..');
const ROOT_DIR = resolve(__dirname, '..');
const DIST_DIR = join(ROOT_DIR, 'dist');
const DIST_INDEX_HTML = join(DIST_DIR, 'index.html');
const DIST_ASSETS_DIR = join(DIST_DIR, 'assets');

console.log('\n============================================================');
console.log('🧪 TEST: Production Build & TypeScript Verification');
console.log('============================================================');
console.log(`📁 Project Root: ${ROOT_DIR}`);
console.log('⏳ Running `npm run build`...');

const startTime = Date.now();
const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';

const buildProcess = spawnSync(npmCmd, ['run', 'build'], {
  cwd: ROOT_DIR,
  encoding: 'utf-8',
  shell: true,
  env: { ...process.env, FORCE_COLOR: '1' }
});

const duration = ((Date.now() - startTime) / 1000).toFixed(2);
const stdout = buildProcess.stdout || '';
const stderr = buildProcess.stderr || '';
const combinedOutput = `${stdout}\n${stderr}`;

let hasErrors = false;
const failures = [];

// 1. Check exit code
if (buildProcess.status !== 0) {
  hasErrors = true;
  failures.push(`Build process exited with non-zero status code: ${buildProcess.status}`);
}

// 2. Check for TypeScript errors in output
const tsErrorRegex = /(?:error\s+TS\d+|TS\d+:)/i;
if (tsErrorRegex.test(combinedOutput)) {
  hasErrors = true;
  failures.push('TypeScript compilation errors detected in build output.');
}

// 3. Check for Vite build errors
const viteErrorRegex = /\[vite:.*\]\s+error|error\s+during\s+build/i;
if (viteErrorRegex.test(combinedOutput)) {
  hasErrors = true;
  failures.push('Vite build error detected in build output.');
}

// 4. Assert dist/index.html exists
if (!existsSync(DIST_INDEX_HTML)) {
  hasErrors = true;
  failures.push(`Expected output file missing: ${DIST_INDEX_HTML}`);
}

// 5. Assert dist/assets directory exists and has files
if (!existsSync(DIST_ASSETS_DIR)) {
  hasErrors = true;
  failures.push(`Expected output directory missing: ${DIST_ASSETS_DIR}`);
} else {
  const assetFiles = readdirSync(DIST_ASSETS_DIR, { recursive: true });
  if (!assetFiles || assetFiles.length === 0) {
    hasErrors = true;
    failures.push(`Assets directory is empty: ${DIST_ASSETS_DIR}`);
  }
}

// Summary Reporting
console.log('\n--- Build Output Summary ---');
console.log(`⏱️ Duration: ${duration}s`);
console.log(`📦 Status Code: ${buildProcess.status}`);

if (hasErrors) {
  console.error('\n❌ BUILD VERIFICATION FAILED:');
  failures.forEach((f, idx) => console.error(`  ${idx + 1}. ${f}`));
  if (stderr.trim()) {
    console.error('\n--- STDERR ---');
    console.error(stderr);
  }
  if (stdout.trim()) {
    console.log('\n--- STDOUT (last 20 lines) ---');
    console.log(stdout.trim().split('\n').slice(-20).join('\n'));
  }
  process.exit(1);
}

console.log('\n✅ PASS: TypeScript compilation and Vite build succeeded with 0 errors.');
console.log(`📄 Generated: ${DIST_INDEX_HTML}`);
console.log(`📁 Assets: ${DIST_ASSETS_DIR}`);
process.exit(0);
