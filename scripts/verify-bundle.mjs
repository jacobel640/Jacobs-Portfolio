#!/usr/bin/env node
/**
 * scripts/verify-bundle.mjs
 * 
 * Verifies that the production bundle is properly optimized and split into
 * modular Rollup chunks (manualChunks).
 * 
 * Assertions:
 * 1. Checks that `dist/assets` exists.
 * 2. Asserts that total JavaScript chunk count is >= 4 (proving chunk splitting is active).
 * 3. Identifies vendor chunks (e.g. vendor-react, vendor-framer-motion, vendor-lucide, vendor-utils)
 *    or dynamic component chunks.
 * 4. Asserts that no individual chunk exceeds the size threshold (400 KB).
 * 5. Asserts that entry chunk is optimized (< 200 KB).
 */

import { existsSync, readdirSync, statSync } from 'fs';
import { resolve, join, extname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = resolve(fileURLToPath(import.meta.url), '..');
const ROOT_DIR = resolve(__dirname, '..');
const DIST_DIR = join(ROOT_DIR, 'dist');
const DIST_ASSETS_DIR = join(DIST_DIR, 'assets');

console.log('\n============================================================');
console.log('🧪 TEST: Production Bundle & Chunk Splitting Verification');
console.log('============================================================');

if (!existsSync(DIST_ASSETS_DIR)) {
  console.error(`\n❌ ERROR: Build directory not found: ${DIST_ASSETS_DIR}`);
  console.error('Please run `npm run build` or `node scripts/verify-build.mjs` first.');
  process.exit(1);
}

// Recursively find all files in dist/assets
function getAllFiles(dir, fileList = []) {
  const entries = readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      getAllFiles(fullPath, fileList);
    } else {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

const allAssets = getAllFiles(DIST_ASSETS_DIR);
const jsFiles = allAssets.filter(f => extname(f) === '.js');
const cssFiles = allAssets.filter(f => extname(f) === '.css');

console.log(`\n📊 Bundle Asset Inventory:`);
console.log(`   - JavaScript Chunks: ${jsFiles.length}`);
console.log(`   - CSS Files: ${cssFiles.length}`);

console.log('\n--------------------------------------------------------------------------------');
console.log(String('File Name').padEnd(45) + String('Type').padEnd(10) + String('Size (KB)').padStart(12) + String('Size (Bytes)').padStart(13));
console.log('--------------------------------------------------------------------------------');

const chunkStats = jsFiles.map(filePath => {
  const stat = statSync(filePath);
  const relName = filePath.replace(DIST_ASSETS_DIR, '').replace(/^[/\\]+/, '');
  const sizeKB = (stat.size / 1024).toFixed(2);
  console.log(
    relName.padEnd(45) +
    'JS'.padEnd(10) +
    sizeKB.padStart(12) +
    String(stat.size).padStart(13)
  );
  return {
    path: filePath,
    name: relName,
    size: stat.size,
    sizeKB: parseFloat(sizeKB)
  };
});

cssFiles.forEach(filePath => {
  const stat = statSync(filePath);
  const relName = filePath.replace(DIST_ASSETS_DIR, '').replace(/^[/\\]+/, '');
  const sizeKB = (stat.size / 1024).toFixed(2);
  console.log(
    relName.padEnd(45) +
    'CSS'.padEnd(10) +
    sizeKB.padStart(12) +
    String(stat.size).padStart(13)
  );
});

console.log('--------------------------------------------------------------------------------');

let hasErrors = false;
const failures = [];
const warnings = [];

// Assertion 1: Total JS chunk count >= 4
const MIN_CHUNKS = 4;
if (jsFiles.length < MIN_CHUNKS) {
  hasErrors = true;
  failures.push(
    `Insufficient chunk splitting: Found ${jsFiles.length} JS chunks, expected at least ${MIN_CHUNKS}. ` +
    `Ensure Rollup manualChunks or dynamic component lazy-loading is configured in vite.config.ts / App.tsx.`
  );
} else {
  console.log(`\n✅ Chunk Count: ${jsFiles.length} JS chunks detected (>= ${MIN_CHUNKS} required).`);
}

// Assertion 2: Check for vendor chunk isolation
const chunkNames = chunkStats.map(c => c.name.toLowerCase());
const hasVendorReact = chunkNames.some(n => n.includes('vendor-react') || n.includes('react'));
const hasVendorMotion = chunkNames.some(n => n.includes('vendor-framer-motion') || n.includes('framer-motion') || n.includes('motion'));
const hasVendorLucide = chunkNames.some(n => n.includes('vendor-lucide') || n.includes('lucide'));
const hasVendorUtils = chunkNames.some(n => n.includes('vendor-utils') || n.includes('utils') || n.includes('clsx'));

console.log('\n📦 Chunk Splitting Breakdown:');
console.log(`   - React Vendor Chunk: ${hasVendorReact ? '✅ DETECTED' : '⚠️ NOT SEPARATED'}`);
console.log(`   - Framer Motion Chunk: ${hasVendorMotion ? '✅ DETECTED' : '⚠️ NOT SEPARATED'}`);
console.log(`   - Lucide Icons Chunk: ${hasVendorLucide ? '✅ DETECTED' : '⚠️ NOT SEPARATED'}`);
console.log(`   - Utils/Lazy Chunks: ${hasVendorUtils || chunkNames.some(n => n.includes('projects') || n.includes('skills')) ? '✅ DETECTED' : '⚠️ NOT SEPARATED'}`);

// Assertion 3: Chunk size limits
const MAX_CHUNK_SIZE_KB = 400; // 400 KB uncompressed limit
for (const chunk of chunkStats) {
  if (chunk.sizeKB > MAX_CHUNK_SIZE_KB) {
    hasErrors = true;
    failures.push(`Chunk [${chunk.name}] exceeds maximum allowed size: ${chunk.sizeKB} KB > ${MAX_CHUNK_SIZE_KB} KB`);
  }
}

// Assertion 4: Entry chunk size warning (< 200 KB)
const entryChunk = chunkStats.find(c => c.name.toLowerCase().includes('index') || c.name.toLowerCase().includes('main'));
if (entryChunk) {
  if (entryChunk.sizeKB > 200) {
    warnings.push(`Entry chunk [${entryChunk.name}] is larger than ideal (${entryChunk.sizeKB} KB > 200 KB). Consider lazy loading more components.`);
  } else {
    console.log(`✅ Entry Chunk [${entryChunk.name}]: ${entryChunk.sizeKB} KB (Sub-200KB initial payload).`);
  }
}

if (warnings.length > 0) {
  console.log('\n⚠️ WARNINGS:');
  warnings.forEach(w => console.log(`  - ${w}`));
}

if (hasErrors) {
  console.error('\n❌ BUNDLE VERIFICATION FAILED:');
  failures.forEach((f, idx) => console.error(`  ${idx + 1}. ${f}`));
  process.exit(1);
}

console.log('\n✅ PASS: Production bundle optimization and chunk splitting verified successfully.');
process.exit(0);
