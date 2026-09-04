#!/usr/bin/env node
/**
 * scripts/verify-prerender.mjs
 *
 * Guards the property the prerender exists for: that `dist/index.html` carries
 * the page's content as HTML, readable without executing the bundle.
 *
 * A regression here is silent — the site looks perfect in a browser while
 * crawlers, unfurlers and LLM fetchers see an empty document — so the checks
 * are on the shipped artefact rather than on the source that produces it.
 *
 * Assertions:
 * 1. `#root` is not empty.
 * 2. The prerendered markup carries a substantial amount of real text.
 * 3. Each section landmark (hero/about/skills/projects/contact) is present.
 * 4. Every project title from the data file appears in the HTML.
 * 5. The head still carries title, description and the Open Graph tags.
 */

import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT_DIR = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DIST_INDEX_HTML = join(ROOT_DIR, 'dist', 'index.html');
const PROJECTS_SRC = join(ROOT_DIR, 'src', 'data', 'projects.ts');

/** Comfortably above the skeletons, comfortably below the real page (~4.7k). */
const MIN_TEXT_CHARS = 2000;

const SECTION_IDS = ['hero', 'about', 'skills', 'projects', 'contact'];

const HEAD_TAGS = [
  '<title>',
  'name="description"',
  'property="og:title"',
  'property="og:description"',
  'property="og:image"',
];

console.log('\n============================================================');
console.log('🧪 TEST: Prerendered HTML Verification');
console.log('============================================================');

const failures = [];

if (!existsSync(DIST_INDEX_HTML)) {
  console.error(`\n❌ PRERENDER VERIFICATION FAILED:\n  1. Missing ${DIST_INDEX_HTML}. Run \`npm run build\` first.`);
  process.exit(1);
}

const html = await readFile(DIST_INDEX_HTML, 'utf8');

// 1. #root must have been filled in.
const rootMatch = html.match(/<div id="root">([\s\S]*)<\/div>\s*<\/body>/);
const rootMarkup = rootMatch?.[1] ?? '';
if (!rootMarkup.trim()) {
  failures.push('#root is empty — the prerender pass did not run or produced nothing.');
}

// 2. That markup must be mostly content, not a wrapper full of empty divs.
const text = rootMarkup
  .replace(/<script[\s\S]*?<\/script>/gi, ' ')
  .replace(/<[^>]*>/g, ' ')
  .replace(/&#x27;/g, "'")
  .replace(/&amp;/g, '&')
  .replace(/\s+/g, ' ')
  .trim();
if (text.length < MIN_TEXT_CHARS) {
  failures.push(
    `Prerendered text is ${text.length} chars, expected at least ${MIN_TEXT_CHARS}. ` +
      'Suspense fallbacks may have been serialised instead of the resolved sections.'
  );
}

// 3. Every section landmark should be reachable by anchor without JavaScript.
for (const id of SECTION_IDS) {
  if (!rootMarkup.includes(`id="${id}"`)) {
    failures.push(`Section landmark id="${id}" missing from the prerendered markup.`);
  }
}

// 4. Project titles are the content most worth indexing, so check them by name.
const projectsSrc = await readFile(PROJECTS_SRC, 'utf8');
const titles = [...projectsSrc.matchAll(/^\s{4}title:\s*'([^']+)'/gm)].map((m) => m[1]);
if (titles.length === 0) {
  failures.push(`Could not read any project titles from ${PROJECTS_SRC}.`);
}
// The renderer escapes quotes, so compare on the same escaping the HTML uses.
const escaped = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;');
const missingTitles = titles.filter((t) => !rootMarkup.includes(escaped(t)));
if (missingTitles.length > 0) {
  failures.push(`Project titles absent from prerendered HTML: ${missingTitles.join(', ')}`);
}

// 5. The prerender rewrites index.html, so confirm it did not eat the head.
for (const tag of HEAD_TAGS) {
  if (!html.includes(tag)) {
    failures.push(`Head tag ${tag} missing from dist/index.html.`);
  }
}

console.log('\n--- Prerender Summary ---');
console.log(`📄 File: ${DIST_INDEX_HTML}`);
console.log(`📏 Markup in #root: ${rootMarkup.length.toLocaleString()} bytes`);
console.log(`📝 Extractable text: ${text.length.toLocaleString()} chars`);
console.log(`🔖 Sections found: ${SECTION_IDS.filter((id) => rootMarkup.includes(`id="${id}"`)).join(', ') || 'none'}`);
console.log(`📦 Projects found: ${titles.length - missingTitles.length}/${titles.length}`);

if (failures.length > 0) {
  console.error('\n❌ PRERENDER VERIFICATION FAILED:');
  failures.forEach((f, i) => console.error(`  ${i + 1}. ${f}`));
  process.exit(1);
}

console.log('\n✅ PASS: dist/index.html contains the full page as static HTML.');
process.exit(0);
