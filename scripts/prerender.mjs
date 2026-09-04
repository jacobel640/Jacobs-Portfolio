#!/usr/bin/env node
/**
 * scripts/prerender.mjs
 *
 * Bakes the rendered app into `dist/index.html` after `vite build`.
 *
 * Vite ships a client bundle and an empty `<div id="root">`, so the HTML served
 * to anything that does not execute JavaScript — Google's raw fetch pass, Slack
 * and LinkedIn unfurlers, LLM fetchers like Gemini — contains no content at all.
 * This renders the same component tree to a string at build time and writes it
 * into `#root`, so the shipped HTML carries the real copy. The client then
 * hydrates that markup rather than replacing it (see `src/main.tsx`).
 *
 * The tree is loaded through Vite's own SSR pipeline rather than a second
 * `vite build --ssr`, so there is one config and one dependency graph; the dev
 * server here is a module loader only and never listens on a port.
 */

import { readFile, writeFile } from 'node:fs/promises';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Writable } from 'node:stream';

import { createServer } from 'vite';
import { renderToPipeableStream } from 'react-dom/server';

const ROOT_DIR = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DIST_INDEX_HTML = join(ROOT_DIR, 'dist', 'index.html');

/** The empty mount point Vite emits, and the marker we replace it with. */
const ROOT_DIV = '<div id="root"></div>';

/** A render that has not settled by here is a bug, not a slow machine. */
const RENDER_TIMEOUT_MS = 30_000;

/**
 * Renders `element` to a complete HTML string.
 *
 * `renderToPipeableStream` rather than `renderToString`: the sections below the
 * hero are `React.lazy` behind `Suspense`, and a synchronous render would emit
 * the loading skeletons instead of waiting for those chunks. `onAllReady` fires
 * only once every boundary has resolved, so the string this returns is the
 * fully populated page — which is the entire point of the exercise.
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
      // nothing is ever piped and `finish` never fires. Without this the build
      // would hang on a render error rather than report it.
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

async function main() {
  console.log('\n⏳ Prerendering dist/index.html...');

  const html = await readFile(DIST_INDEX_HTML, 'utf8');
  if (!html.includes(ROOT_DIV)) {
    throw new Error(
      `Could not find ${ROOT_DIV} in ${DIST_INDEX_HTML}. ` +
        'Did the mount point in index.html change?'
    );
  }

  // `appType: 'custom'` and middleware mode keep this to a module loader: no
  // HTTP listener, no HMR websocket, nothing to shut down but the server itself.
  const vite = await createServer({
    root: ROOT_DIR,
    logLevel: 'error',
    appType: 'custom',
    server: { middlewareMode: true },
  });

  let rendered;
  try {
    const { createApp } = await vite.ssrLoadModule('/src/entry-server.tsx');
    rendered = await renderToHtml(createApp());
  } finally {
    await vite.close();
  }

  if (!rendered.trim()) {
    throw new Error('Prerender produced an empty string.');
  }

  // A function replacement, not a string: in a string, `$&`, `$\`` and `$'`
  // are substitution patterns, so any of them occurring in the page copy would
  // be silently rewritten into the output. A function is inserted verbatim.
  await writeFile(
    DIST_INDEX_HTML,
    html.replace(ROOT_DIV, () => `<div id="root">${rendered}</div>`),
    'utf8'
  );

  const textLength = rendered
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim().length;

  console.log(
    `✅ Prerendered ${rendered.length.toLocaleString()} bytes of markup ` +
      `(${textLength.toLocaleString()} chars of text) into #root.`
  );
}

main().catch((error) => {
  console.error('\n❌ Prerender failed:');
  console.error(error);
  process.exit(1);
});
