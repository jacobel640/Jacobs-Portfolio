#!/usr/bin/env node
/**
 * scripts/prerender.mjs
 *
 * Turns the Vite client build into a static site: one HTML file per route,
 * each carrying that route's content and its own head.
 *
 * Vite ships a bundle and an empty `<div id="root">`, so the HTML served to
 * anything that does not execute JavaScript — Google's raw fetch pass, Slack
 * and LinkedIn unfurlers, LLM fetchers like Gemini — contains no content at
 * all. This renders every route to a string at build time and writes it into
 * `#root`. The client then hydrates that markup rather than replacing it (see
 * `src/main.tsx`).
 *
 * Because each route becomes a real file, Netlify serves it directly and the
 * site needs no SPA redirect rule: `/projects/taskflow` is a document, not a
 * rewrite of the home page.
 *
 * The tree is loaded through Vite's own SSR pipeline rather than a second
 * `vite build --ssr`, so there is one config and one dependency graph; the dev
 * server here is a module loader only and never listens on a port.
 */

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Writable } from 'node:stream';

import { createServer } from 'vite';
import { renderToPipeableStream } from 'react-dom/server';

const ROOT_DIR = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DIST_DIR = join(ROOT_DIR, 'dist');
const TEMPLATE = join(DIST_DIR, 'index.html');

/** The empty mount point Vite emits. */
const ROOT_DIV = '<div id="root"></div>';

/** A render that has not settled by here is a bug, not a slow machine. */
const RENDER_TIMEOUT_MS = 30_000;

/** Escapes a string for use inside a double-quoted HTML attribute. */
const attr = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

/**
 * Renders `element` to a complete HTML string.
 *
 * `renderToPipeableStream` rather than `renderToString`: the sections below the
 * hero and the case-study page are `React.lazy` behind `Suspense`, and a
 * synchronous render would emit the loading skeletons instead of waiting for
 * those chunks. `onAllReady` fires only once every boundary has resolved, so
 * the string this returns is the fully populated page — which is the entire
 * point of the exercise.
 */
function renderToHtml(element) {
  return new Promise((resolvePromise, rejectPromise) => {
    const chunks = [];
    let renderError = null;
    let timer = null;
    let settled = false;

    // Every path out of the render has to end at exactly one of these. React
    // reports failures through three different callbacks and the timeout is a
    // fourth, so the guard is what keeps a second report from resolving a
    // promise that already rejected — and, more importantly, what guarantees
    // there is no path that reports nothing at all and leaves the build hanging.
    const settle = (fn, value) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      fn(value);
    };
    const fail = (error) => settle(rejectPromise, error);

    const sink = new Writable({
      write(chunk, _encoding, callback) {
        chunks.push(chunk);
        callback();
      },
    });

    sink.on('finish', () => {
      if (renderError) fail(renderError);
      else settle(resolvePromise, Buffer.concat(chunks).toString('utf8'));
    });
    sink.on('error', fail);

    const { pipe, abort } = renderToPipeableStream(element, {
      onAllReady() {
        pipe(sink);
      },
      // The shell failing is the one case where `onAllReady` never runs, so
      // nothing is ever piped and `finish` never fires.
      onShellError(error) {
        fail(error ?? new Error('Prerender shell failed without an error.'));
      },
      onError(error) {
        // Recorded rather than thrown: React reports the error and then keeps
        // going, and rejecting from inside the callback would strand the sink.
        // The first error is kept, since later ones tend to be its fallout.
        renderError ??= error;
      },
    });

    timer = setTimeout(() => {
      // Abort first so React tears down its pending work, then fail directly:
      // aborting alone does not guarantee another callback, and waiting for one
      // is what a hang looks like.
      abort(new Error(`Prerender did not settle within ${RENDER_TIMEOUT_MS}ms`));
      fail(new Error(`Prerender did not settle within ${RENDER_TIMEOUT_MS}ms`));
    }, RENDER_TIMEOUT_MS);
  });
}

/**
 * Rewrites the shared template's head for one route.
 *
 * Each tag is matched loosely and replaced with a normalised single-line form,
 * so the substitutions survive the template being reformatted or its
 * attributes wrapped across lines.
 */
function applyMeta(template, meta, origin, jsonLd) {
  const url = `${origin}${meta.path}`;
  const swaps = [
    [/<title>[\s\S]*?<\/title>/, `<title>${attr(meta.title)}</title>`],
    [/<meta\s+name="description"[\s\S]*?\/>/, `<meta name="description" content="${attr(meta.description)}" />`],
    [/<link\s+rel="canonical"[\s\S]*?\/>/, `<link rel="canonical" href="${attr(url)}" />`],
    [/<meta\s+property="og:type"[\s\S]*?\/>/, `<meta property="og:type" content="${attr(meta.ogType)}" />`],
    [/<meta\s+property="og:url"[\s\S]*?\/>/, `<meta property="og:url" content="${attr(url)}" />`],
    [/<meta\s+property="og:title"[\s\S]*?\/>/, `<meta property="og:title" content="${attr(meta.ogTitle)}" />`],
    [/<meta\s+property="og:description"[\s\S]*?\/>/, `<meta property="og:description" content="${attr(meta.ogDescription)}" />`],
    [/<meta\s+name="twitter:title"[\s\S]*?\/>/, `<meta name="twitter:title" content="${attr(meta.ogTitle)}" />`],
    [/<meta\s+name="twitter:description"[\s\S]*?\/>/, `<meta name="twitter:description" content="${attr(meta.ogDescription)}" />`],
  ];

  let html = template;
  for (const [pattern, replacement] of swaps) {
    if (!pattern.test(html)) {
      throw new Error(`Head tag not found in template for ${meta.path}: ${pattern}`);
    }
    // A function replacement, not a string: in a string, `$&`, `$\`` and `$'`
    // are substitution patterns, so any of them in the copy would be silently
    // rewritten into the output.
    html = html.replace(pattern, () => replacement);
  }

  if (jsonLd) {
    html = html.replace(
      /<script type="application\/ld\+json">[\s\S]*?<\/script>/,
      () => `<script type="application/ld+json">\n${JSON.stringify(jsonLd, null, 2)}\n    </script>`,
    );
  }

  return html;
}

/** Structured data for a case study, which is what AI readers parse first. */
function projectJsonLd(project, url, origin) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title,
    headline: `${project.title} — ${project.categoryLabel}`,
    url,
    abstract: project.description,
    keywords: project.tags.join(', '),
    genre: project.categoryLabel,
    author: {
      '@type': 'Person',
      name: 'Jacob Elcharar',
      url: `${origin}/`,
      jobTitle: 'Android Software Engineer',
    },
    isPartOf: { '@type': 'WebSite', name: 'Jacob Elcharar', url: `${origin}/` },
    ...(project.github ? { codeRepository: project.github } : {}),
  };
}

function buildSitemap(routes, origin, lastmod) {
  const urls = routes
    .map(
      (route) =>
        `  <url>\n    <loc>${origin}${route.path === '/' ? '/' : route.path}</loc>\n` +
        `    <lastmod>${lastmod}</lastmod>\n` +
        `    <changefreq>monthly</changefreq>\n` +
        `    <priority>${route.path === '/' ? '1.0' : '0.8'}</priority>\n  </url>`,
    )
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

/** `/` → dist/index.html, `/projects/x` → dist/projects/x/index.html */
async function writePage(routePath, html) {
  const file =
    routePath === '/'
      ? TEMPLATE
      : join(DIST_DIR, routePath.replace(/^\//, ''), 'index.html');
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, html, 'utf8');
  return file;
}

const textLength = (markup) =>
  markup.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().length;

async function main() {
  console.log('\n⏳ Prerendering routes...');

  const template = await readFile(TEMPLATE, 'utf8');
  if (!template.includes(ROOT_DIV)) {
    throw new Error(
      `Could not find ${ROOT_DIV} in ${TEMPLATE}. Did the mount point in index.html change?`,
    );
  }

  const vite = await createServer({
    root: ROOT_DIR,
    logLevel: 'error',
    appType: 'custom',
    server: { middlewareMode: true, hmr: false },
    // The dep optimizer only serves a browser; this loads modules for Node.
    // Leaving it on means `vite.close()` tears down an esbuild run that is
    // still in flight, which prints a spurious "build was canceled" error
    // after a build that in fact succeeded.
    optimizeDeps: { noDiscovery: true, include: [] },
  });

  try {
    const { createApp } = await vite.ssrLoadModule('/src/entry-server.tsx');
    const { ALL_ROUTES, SITE_ORIGIN } = await vite.ssrLoadModule('/src/routes.ts');
    const { projects } = await vite.ssrLoadModule('/src/data/projects.ts');

    let totalText = 0;
    for (const meta of ALL_ROUTES) {
      const markup = await renderToHtml(createApp(meta.path));
      if (!markup.trim()) throw new Error(`Prerender produced nothing for ${meta.path}`);

      const project = projects.find((candidate) => `/projects/${candidate.id}` === meta.path);
      const jsonLd = project
        ? projectJsonLd(project, `${SITE_ORIGIN}${meta.path}`, SITE_ORIGIN)
        : null;

      const html = applyMeta(template, meta, SITE_ORIGIN, jsonLd).replace(
        ROOT_DIV,
        () => `<div id="root">${markup}</div>`,
      );

      const file = await writePage(meta.path, html);
      const chars = textLength(markup);
      totalText += chars;
      console.log(`   ${meta.path.padEnd(34)} ${String(chars).padStart(6)} chars  →  ${file.replace(DIST_DIR, 'dist')}`);
    }

    // A 404 that is a real page rather than the home page under a wrong URL.
    // Netlify serves dist/404.html for unmatched paths automatically.
    const notFoundMarkup = await renderToHtml(createApp('/__not-found__'));
    await writeFile(
      join(DIST_DIR, '404.html'),
      applyMeta(
        template,
        {
          path: '/404',
          title: 'Page not found | Jacob Elcharar',
          description: 'That page does not exist.',
          ogTitle: 'Page not found',
          ogDescription: 'That page does not exist.',
          ogType: 'website',
        },
        SITE_ORIGIN,
        null,
      ).replace(ROOT_DIV, () => `<div id="root">${notFoundMarkup}</div>`),
      'utf8',
    );

    const lastmod = new Date().toISOString().slice(0, 10);
    await writeFile(join(DIST_DIR, 'sitemap.xml'), buildSitemap(ALL_ROUTES, SITE_ORIGIN, lastmod), 'utf8');

    console.log(
      `\n✅ Prerendered ${ALL_ROUTES.length} routes + 404 ` +
        `(${totalText.toLocaleString()} chars of text), sitemap.xml has ${ALL_ROUTES.length} URLs.`,
    );
  } finally {
    await vite.close();
  }
}

main().catch((error) => {
  console.error('\n❌ Prerender failed:');
  console.error(error);
  process.exit(1);
});
