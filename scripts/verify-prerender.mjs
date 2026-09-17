#!/usr/bin/env node
/**
 * scripts/verify-prerender.mjs
 *
 * Guards the property the prerender exists for: that every route ships as HTML
 * carrying its own content and its own head, readable without executing the
 * bundle.
 *
 * A regression here is silent — the site looks perfect in a browser while
 * crawlers, unfurlers and LLM fetchers see an empty document — so the checks
 * are on the shipped artefacts rather than on the source that produces them.
 *
 * Assertions, per route:
 * 1. The route's HTML file exists and `#root` is not empty.
 * 2. It carries a substantial amount of real text.
 * 3. Its title, canonical and og:url are its own, not the template's.
 * Across the site:
 * 4. Every project page includes prose that only exists in `detailedContent`,
 *    which is what used to be trapped behind the modal.
 * 5. The home page links to every project page.
 * 6. sitemap.xml lists every route, and 404.html exists.
 * 7. A project's route matches the name of its GitHub repository, so the two
 *    cannot drift apart after a repo is renamed.
 */

import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT_DIR = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DIST_DIR = join(ROOT_DIR, 'dist');
const PROJECTS_SRC = join(ROOT_DIR, 'src', 'data', 'projects.ts');

/** Comfortably above the skeletons, comfortably below any real page. */
const MIN_HOME_CHARS = 2000;
const MIN_PROJECT_CHARS = 1500;

const failures = [];
const rows = [];

console.log('\n============================================================');
console.log('🧪 TEST: Prerendered Static Routes');
console.log('============================================================');

if (!existsSync(join(DIST_DIR, 'index.html'))) {
  console.error('\n❌ FAILED:\n  1. dist/index.html is missing. Run `npm run build` first.');
  process.exit(1);
}

const rootMarkupOf = (html) => {
  const match = html.match(/<div id="root">([\s\S]*)<\/div>\s*<\/body>/);
  return match?.[1] ?? '';
};

const textOf = (markup) =>
  markup
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&#x27;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim();

const tagOf = (html, pattern) => html.match(pattern)?.[1] ?? '';

// Parse the project ids, titles and a distinctive detail phrase from the data file.
const projectsSrc = await readFile(PROJECTS_SRC, 'utf8');
const blocks = projectsSrc.split(/\n  \{\n/).slice(1);
const projects = blocks
  .map((block) => ({
    id: block.match(/^\s*id: '([^']+)'/m)?.[1],
    title: block.match(/^\s*title: '([^']+)'/m)?.[1],
    // Private projects have no repository, so there is nothing to match.
    repo: block.match(/^\s*github: '([^']+)'/m)?.[1]?.replace(/\/$/, '').split('/').pop(),
    // The longest overview sentence fragment: present only in detailedContent.
    detail: (block.match(/overview: \[\s*\n\s*'([^']{40,200})/m)?.[1] ?? '')
      .replace(/\*\*/g, '')
      .split(/[.,—]/)[0]
      .trim(),
  }))
  .filter((project) => project.id && project.title);

if (projects.length === 0) failures.push(`Could not parse any projects from ${PROJECTS_SRC}.`);

const homeHtml = await readFile(join(DIST_DIR, 'index.html'), 'utf8');
const homeText = textOf(rootMarkupOf(homeHtml));
rows.push(['/', homeText.length, tagOf(homeHtml, /<title>([^<]*)<\/title>/)]);

if (homeText.length < MIN_HOME_CHARS) {
  failures.push(`Home page has ${homeText.length} chars of text, expected ≥ ${MIN_HOME_CHARS}.`);
}
for (const id of ['hero', 'skills', 'projects', 'contact']) {
  if (!rootMarkupOf(homeHtml).includes(`id="${id}"`)) {
    failures.push(`Home page is missing section landmark id="${id}".`);
  }
}

const seenTitles = new Map();
seenTitles.set(tagOf(homeHtml, /<title>([^<]*)<\/title>/), '/');

for (const project of projects) {
  // The trailing slash is the form the host serves and the site declares.
  const routePath = `/projects/${project.id}/`;
  const file = join(DIST_DIR, 'projects', project.id, 'index.html');

  if (!existsSync(file)) {
    failures.push(`Missing prerendered page for ${routePath}.`);
    continue;
  }

  const html = await readFile(file, 'utf8');
  const text = textOf(rootMarkupOf(html));
  const title = tagOf(html, /<title>([^<]*)<\/title>/);
  rows.push([routePath, text.length, title]);

  if (text.length < MIN_PROJECT_CHARS) {
    failures.push(`${routePath} has ${text.length} chars of text, expected ≥ ${MIN_PROJECT_CHARS}.`);
  }
  if (!text.includes(project.title)) {
    failures.push(`${routePath} does not contain its own title "${project.title}".`);
  }
  // The point of the exercise: prose that used to live only inside the modal.
  if (project.detail && !text.includes(project.detail)) {
    failures.push(`${routePath} is missing its case-study prose ("${project.detail.slice(0, 40)}…").`);
  }
  if (seenTitles.has(title)) {
    failures.push(`${routePath} shares its <title> with ${seenTitles.get(title)} — the head was not rewritten.`);
  }
  seenTitles.set(title, routePath);

  const canonical = tagOf(html, /<link rel="canonical" href="([^"]*)"/);
  if (!canonical.endsWith(routePath)) {
    failures.push(`${routePath} has canonical "${canonical}", which is not its own URL.`);
  }
  const ogUrl = tagOf(html, /<meta property="og:url" content="([^"]*)"/);
  if (!ogUrl.endsWith(routePath)) {
    failures.push(`${routePath} has og:url "${ogUrl}", which is not its own URL.`);
  }

  if (!homeHtml.includes(`href="${routePath}"`)) {
    failures.push(`The home page has no crawlable link to ${routePath}.`);
  }
}

// The route and the repository should be the same name.
for (const project of projects) {
  if (project.repo && project.id !== project.repo.toLowerCase()) {
    failures.push(
      `Project route "/projects/${project.id}" does not match its GitHub repo ` +
        `"${project.repo}" — expected id "${project.repo.toLowerCase()}".`,
    );
  }
}

// Sitemap and 404.
if (!existsSync(join(DIST_DIR, 'sitemap.xml'))) {
  failures.push('dist/sitemap.xml is missing.');
} else {
  const sitemap = await readFile(join(DIST_DIR, 'sitemap.xml'), 'utf8');
  const count = (sitemap.match(/<url>/g) ?? []).length;
  if (count !== projects.length + 1) {
    failures.push(`sitemap.xml lists ${count} URLs, expected ${projects.length + 1}.`);
  }
  for (const project of projects) {
    // Matched with the trailing slash so the sitemap cannot quietly go back to
    // listing URLs that redirect.
    if (!sitemap.includes(`/projects/${project.id}/</loc>`)) {
      failures.push(`sitemap.xml is missing /projects/${project.id}/.`);
    }
  }
}
if (!existsSync(join(DIST_DIR, '404.html'))) failures.push('dist/404.html is missing.');

console.log('\n--- Prerendered routes ---');
for (const [routePath, chars, title] of rows) {
  console.log(`  ${routePath.padEnd(30)} ${String(chars).padStart(6)} chars   ${title.slice(0, 46)}`);
}
console.log(`\n  Total readable text: ${rows.reduce((sum, r) => sum + r[1], 0).toLocaleString()} chars`);

if (failures.length > 0) {
  console.error('\n❌ PRERENDER VERIFICATION FAILED:');
  failures.forEach((f, i) => console.error(`  ${i + 1}. ${f}`));
  process.exit(1);
}

console.log('\n✅ PASS: every route ships as static HTML with its own head and content.');
process.exit(0);
