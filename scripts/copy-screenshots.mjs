#!/usr/bin/env node

/**
 * Script: copy-screenshots.mjs
 * Purpose: Discovers and copies project screenshots from local development folders
 *          (e.g., AndroidStudio/TaskFlow and AndroidStudio/Files) to public/screenshots/
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const searchRoots = [
  'C:\\Users\\jacob\\Files\\Programming\\AndroidStudio',
  'C:\\Users\\jacob\\Files\\Programming\\IntelliJ',
  'C:\\Users\\jacob\\Files\\Programming\\Antigravity',
];

const targetMappings = [
  {
    projectId: 'taskflow',
    possibleSourcePaths: [
      path.join('C:\\Users\\jacob\\Files\\Programming\\AndroidStudio', 'TaskFlow', 'screenshots'),
      path.join('C:\\Users\\jacob\\Files\\Programming\\AndroidStudio', 'TaskFlow', 'images'),
    ],
    destDir: path.join(projectRoot, 'public', 'screenshots', 'taskflow'),
    expectedMinCount: 9,
  },
  {
    projectId: 'files-migration',
    possibleSourcePaths: [
      path.join('C:\\Users\\jacob\\Files\\Programming\\AndroidStudio', 'Files', 'screenshots'),
      path.join('C:\\Users\\jacob\\Files\\Programming\\AndroidStudio', 'Files', 'images'),
    ],
    destDir: path.join(projectRoot, 'public', 'screenshots', 'files-migration'),
    expectedMinCount: 13,
  },
];

console.log('=== Screenshot Discovery & Copy Pipeline ===');
console.log(`Target portfolio root: ${projectRoot}`);

let totalCopied = 0;
let errors = 0;

for (const mapping of targetMappings) {
  console.log(`\nProcessing project: ${mapping.projectId}`);
  
  // Locate source directory
  let sourceDir = null;
  for (const candidate of mapping.possibleSourcePaths) {
    if (fs.existsSync(candidate) && fs.statSync(candidate).isDirectory()) {
      sourceDir = candidate;
      break;
    }
  }

  if (!sourceDir) {
    console.error(`[ERROR] Could not find source screenshot directory for ${mapping.projectId}`);
    errors++;
    continue;
  }

  console.log(`  Source directory found: ${sourceDir}`);
  console.log(`  Destination directory: ${mapping.destDir}`);

  // Ensure destination directory exists
  if (!fs.existsSync(mapping.destDir)) {
    fs.mkdirSync(mapping.destDir, { recursive: true });
    console.log(`  Created destination directory: ${mapping.destDir}`);
  }

  // Read images from source
  const entries = fs.readdirSync(sourceDir);
  const imageFiles = entries.filter((file) => {
    const ext = path.extname(file).toLowerCase();
    return ext === '.png' || ext === '.jpg' || ext === '.jpeg' || ext === '.webp';
  });

  console.log(`  Discovered ${imageFiles.length} images in source`);

  let projectCopied = 0;
  for (const img of imageFiles) {
    const srcPath = path.join(sourceDir, img);
    const destPath = path.join(mapping.destDir, img);

    try {
      fs.copyFileSync(srcPath, destPath);
      const srcStat = fs.statSync(srcPath);
      const destStat = fs.statSync(destPath);

      if (srcStat.size === destStat.size) {
        console.log(`  [OK] Copied ${img} (${destStat.size} bytes)`);
        projectCopied++;
        totalCopied++;
      } else {
        console.error(`  [FAIL] Size mismatch copying ${img}: src=${srcStat.size}, dest=${destStat.size}`);
        errors++;
      }
    } catch (err) {
      console.error(`  [FAIL] Failed to copy ${img}:`, err.message);
      errors++;
    }
  }

  if (projectCopied < mapping.expectedMinCount) {
    console.warn(`  [WARN] Expected at least ${mapping.expectedMinCount} images for ${mapping.projectId}, but copied ${projectCopied}`);
  } else {
    console.log(`  [SUCCESS] All ${projectCopied} images copied and verified for ${mapping.projectId}`);
  }
}

console.log('\n===========================================');
console.log(`Total images copied: ${totalCopied}`);
console.log(`Errors encountered: ${errors}`);

if (errors > 0 || totalCopied < 22) {
  console.error('Screenshot copy pipeline finished with errors or incomplete count.');
  process.exit(1);
}

console.log('Screenshot copy pipeline finished successfully!');
process.exit(0);
