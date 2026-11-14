#!/usr/bin/env node
/**
 * scripts/render-brand-assets.mjs — `npm run brand`
 *
 * Renders the raster brand assets from the same sources the site uses:
 *
 *   public/og-image.png          1200×630 share card (Open Graph / Twitter)
 *   public/apple-touch-icon.png  180×180 home-screen icon (iOS has no SVG icons)
 *   public/favicon-32.png        32×32 fallback for browsers without SVG favicons
 *
 * Colours come from `themeVars(BRAND_SEED)` and the decorative shape from
 * `src/theme/shapes.ts`, imported directly (Node strips the TypeScript types),
 * so the share card cannot drift from the site's scheme. The page is laid out
 * in HTML with the site's own Roboto Variable and photographed by a headless
 * Chromium (Edge or Chrome), which is what every unfurler will have expected
 * the image to look like in the first place.
 *
 * Not part of `npm run build`: the outputs are committed, and re-rendering
 * needs a local browser. Set BROWSER_PATH if yours is not found.
 */

import { execFile } from 'node:child_process';
import { existsSync } from 'node:fs';
import { mkdtemp, rm, stat, unlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { promisify } from 'node:util';

import { BRAND_SEED, themeVars } from '../src/theme/color.ts';
import { SHAPES } from '../src/theme/shapes.ts';

const run = promisify(execFile);

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const PUBLIC = join(ROOT, 'public');
const FONT = pathToFileURL(
  join(ROOT, 'node_modules/@fontsource-variable/roboto/files/roboto-latin-wght-normal.woff2'),
).href;

const BROWSERS = [
  process.env.BROWSER_PATH,
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
].filter(Boolean);

const browser = BROWSERS.find((path) => existsSync(path));
if (!browser) {
  console.error('No Chromium-based browser found. Set BROWSER_PATH to Edge or Chrome.');
  process.exit(1);
}

/** The scheme as a `:root` block, exactly as Tailwind emits it for the site. */
const rootVars = Object.entries(themeVars(BRAND_SEED))
  .map(([name, value]) => `${name}: ${value};`)
  .join('\n');

const BASE_CSS = `
  @font-face {
    font-family: 'Roboto Variable';
    src: url('${FONT}') format('woff2');
    font-weight: 100 900;
  }
  :root { ${rootVars} }
  * { box-sizing: border-box; margin: 0; }
  html, body { width: 100%; height: 100%; }
  body {
    font-family: 'Roboto Variable', sans-serif;
    -webkit-font-smoothing: antialiased;
    color: var(--md-sys-color-on-surface);
  }
`;

/** lucide-react's Code2 glyph, the brand mark used in the navbar. */
const CODE_GLYPH = `
  <path d="m18 16 4-4-4-4"/><path d="m6 8-4 4 4 4"/><path d="m14.5 4-5 16"/>`;

/** The three focus areas, with the same lucide glyphs and roles as the hero chips. */
const CHIPS = [
  {
    role: 'primary',
    label: 'Native Android · Kotlin & Compose',
    glyph: '<rect x="5" y="2" width="14" height="20" rx="2"/><path d="M12 18h.01"/>',
  },
  {
    role: 'secondary',
    label: 'Spring Boot & Cloud',
    glyph:
      '<rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/><path d="M6 6h.01"/><path d="M6 18h.01"/>',
  },
  {
    role: 'tertiary',
    label: 'AI Agents & Tooling',
    glyph:
      '<rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6" rx="1"/><path d="M15 2v2"/><path d="M15 20v2"/><path d="M2 15h2"/><path d="M2 9h2"/><path d="M20 15h2"/><path d="M20 9h2"/><path d="M9 2v2"/><path d="M9 20v2"/>',
  },
];

// The colour goes in `style`, not the `stroke` attribute: SVG presentation
// attributes do not resolve `var()`, so the scheme's roles would be ignored.
const icon = (glyph, size, colour, stroke = 2) =>
  `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" style="stroke: ${colour}" stroke-width="${stroke}" stroke-linecap="round" stroke-linejoin="round">${glyph}</svg>`;

const OG_HTML = `<!doctype html><html><head><meta charset="utf-8"><style>
  ${BASE_CSS}
  body {
    position: relative;
    overflow: hidden;
    background: var(--md-sys-color-surface);
  }
  .shape { position: absolute; color: var(--md-sys-color-primary-container); }
  .shape.big { width: 700px; right: -250px; top: -330px; opacity: 0.45; transform: rotate(8deg); }
  .shape.small { width: 380px; left: -150px; bottom: -190px; opacity: 0.35; color: var(--md-sys-color-tertiary-container); }
  .content { position: absolute; inset: 0; padding: 72px 80px; display: flex; flex-direction: column; }
  .brand { display: flex; align-items: center; gap: 16px; font-size: 30px; font-weight: 500; letter-spacing: -0.2px; }
  .brand .mark {
    width: 56px; height: 56px; border-radius: 50%;
    display: grid; place-items: center;
    background: var(--md-sys-color-primary);
  }
  .brand .dev { color: var(--md-sys-color-primary); font-weight: 400; }
  .status {
    margin-top: auto;
    align-self: flex-start;
    display: inline-flex; align-items: center; gap: 12px;
    height: 44px; padding: 0 20px; border-radius: 22px;
    font-size: 20px; font-weight: 500; letter-spacing: 0.1px;
    color: var(--md-sys-color-on-surface-variant);
    background: var(--md-sys-color-surface-container-high);
    border: 1px solid color-mix(in srgb, var(--md-sys-color-outline-variant) 60%, transparent);
  }
  .status .dot { width: 10px; height: 10px; border-radius: 50%; background: var(--md-sys-color-success); }
  h1 { margin-top: 24px; font-size: 92px; line-height: 1.02; font-weight: 400; letter-spacing: -1.5px; }
  h1 .name { color: var(--md-sys-color-primary); }
  .role { margin-top: 18px; font-size: 34px; font-weight: 400; color: var(--md-sys-color-on-surface); }
  .role .sep { color: var(--md-sys-color-tertiary); margin: 0 14px; }
  .role .muted { color: var(--md-sys-color-on-surface-variant); }
  .chips { margin-top: 36px; display: flex; gap: 14px; }
  .chip {
    display: inline-flex; align-items: center; gap: 12px;
    height: 52px; padding: 0 22px; border-radius: 12px;
    font-size: 21px; font-weight: 500; letter-spacing: 0.1px;
  }
  ${CHIPS.map(
    ({ role }) => `.chip.${role} {
      background: color-mix(in srgb, var(--md-sys-color-${role}) 12%, var(--md-sys-color-surface-container-low));
      border: 1px solid color-mix(in srgb, var(--md-sys-color-${role}) 35%, transparent);
    }`,
  ).join('\n')}
  .url {
    position: absolute; right: 80px; top: 84px;
    font-size: 22px; font-weight: 500; letter-spacing: 0.2px;
    color: var(--md-sys-color-on-surface-variant);
  }
</style></head><body>
  <svg class="shape big" viewBox="0 0 100 100"><path fill="currentColor" d="${SHAPES.cookie12}"/></svg>
  <svg class="shape small" viewBox="0 0 100 100"><path fill="currentColor" d="${SHAPES.flower}"/></svg>
  <div class="content">
    <div class="brand">
      <span class="mark">${icon(CODE_GLYPH, 31, 'var(--md-sys-color-on-primary)', 2.5)}</span>
      <span>Jacob<span class="dev">.dev</span></span>
    </div>
    <span class="status"><span class="dot"></span>Available for new opportunities</span>
    <h1>Hi, I'm <span class="name">Jacob Elcharar</span></h1>
    <p class="role">Android Software Engineer<span class="sep">•</span><span class="muted">Fullstack Developer</span></p>
    <div class="chips">
      ${CHIPS.map(
        ({ role, label, glyph }) =>
          `<span class="chip ${role}">${icon(glyph, 24, `var(--md-sys-color-${role})`)}${label}</span>`,
      ).join('')}
    </div>
  </div>
  <span class="url">jacobelcharar.dev</span>
</body></html>`;

/**
 * The home-screen icon. iOS masks it to its own rounded square and shows
 * transparency as black, so the mark fills the whole tile.
 */
const TOUCH_ICON_HTML = `<!doctype html><html><head><meta charset="utf-8"><style>
  ${BASE_CSS}
  /* Sized in pixels, not to the viewport: headless Chromium enforces a minimum
     window width, so a centred layout would land outside the 180px crop. */
  html, body { width: 180px; height: 180px; }
  body { display: grid; place-items: center; background: var(--md-sys-color-primary); }
</style></head><body>${icon(CODE_GLYPH, 100, 'var(--md-sys-color-on-primary)', 2.5)}</body></html>`;

/** The SVG favicon itself, on a transparent page, at the PNG's pixel size. */
const faviconHtml = (size) => `<!doctype html><html><head><style>
  * { margin: 0; } body { background: transparent; }
  img { display: block; width: ${size}px; height: ${size}px; }
</style></head><body><img src="${pathToFileURL(join(PUBLIC, 'favicon.svg')).href}"></body></html>`;

const sleep = (ms) => new Promise((done) => setTimeout(done, ms));

/**
 * Waits for the screenshot to land and stop growing. On Windows the Edge
 * launcher hands off to a browser process and exits at once, so the command
 * returning says nothing about whether the file has been written yet.
 */
async function waitForFile(file, timeoutMs = 30_000) {
  const deadline = Date.now() + timeoutMs;
  let lastSize = -1;
  while (Date.now() < deadline) {
    const size = await stat(file).then((info) => info.size, () => -1);
    if (size > 0 && size === lastSize) return;
    lastSize = size;
    await sleep(250);
  }
  throw new Error(`Timed out waiting for ${file}`);
}

async function render(html, width, height, outFile, workDir) {
  const page = join(workDir, `${width}x${height}.html`);
  await writeFile(page, html, 'utf8');
  // A stale file from a previous run would satisfy the wait below.
  await unlink(outFile).catch(() => {});
  await run(browser, [
    '--headless=new',
    '--disable-gpu',
    '--hide-scrollbars',
    '--force-device-scale-factor=1',
    '--default-background-color=00000000',
    // Gives the web font time to load before the shutter: virtual time only
    // advances once the page is otherwise idle.
    '--virtual-time-budget=3000',
    `--user-data-dir=${join(workDir, `profile-${width}x${height}`)}`,
    `--window-size=${width},${height}`,
    `--screenshot=${outFile}`,
    pathToFileURL(page).href,
  ]);
  await waitForFile(outFile);
  console.log(`   ${outFile.replace(ROOT, '.')}  (${width}×${height})`);
}

const workDir = await mkdtemp(join(tmpdir(), 'brand-assets-'));
try {
  console.log(`Rendering brand assets with ${browser}`);
  await render(OG_HTML, 1200, 630, join(PUBLIC, 'og-image.png'), workDir);
  await render(TOUCH_ICON_HTML, 180, 180, join(PUBLIC, 'apple-touch-icon.png'), workDir);
  await render(faviconHtml(32), 32, 32, join(PUBLIC, 'favicon-32.png'), workDir);
} finally {
  // The browser can hold its profile lock for a moment after exiting.
  await rm(workDir, { recursive: true, force: true, maxRetries: 10, retryDelay: 200 }).catch(() => {});
}
