import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * Makes `npm run preview` resolve directory indexes the way the host does.
 *
 * The build writes one file per route — `/projects/taskflow` is
 * `dist/projects/taskflow/index.html` — and Netlify serves it directly. Vite's
 * preview server is an SPA server: it hands any extensionless path back to the
 * root `index.html`, so every project URL previewed as the home page with the
 * case study hydrating over it. That is a convincing imitation of a hydration
 * bug, and it is worth not having to diagnose twice.
 */
function serveDirectoryIndexes(): Plugin {
  return {
    name: 'serve-directory-indexes',
    configurePreviewServer(server) {
      const outDir = join(server.config.root, server.config.build.outDir);
      server.middlewares.use((req, _res, next) => {
        const path = (req.url ?? '/').split('?')[0];
        if (path !== '/' && !path.includes('.')) {
          const trimmed = path.replace(/\/$/, '');
          if (existsSync(join(outDir, trimmed, 'index.html'))) {
            req.url = `${trimmed}/index.html`;
          } else if (existsSync(join(outDir, '404.html'))) {
            // What the host does with an unmatched path. Without this the SPA
            // fallback returns the home page, and the 404 page hydrates over
            // the wrong markup.
            req.url = '/404.html';
          }
        }
        next();
      });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), serveDirectoryIndexes()],
  build: {
    target: 'es2020',
    cssCodeSplit: true,
    chunkSizeWarningLimit: 600,
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          const normalized = id.replace(/\\/g, '/');
          if (normalized.includes('node_modules')) {
            if (
              normalized.includes('/react/') ||
              normalized.includes('/react-dom/') ||
              normalized.includes('/scheduler/') ||
              normalized.includes('/use-sync-external-store/') ||
              normalized.includes('/react-is/')
            ) {
              return 'vendor-react';
            }
            if (normalized.includes('framer-motion') || normalized.includes('motion-dom') || normalized.includes('motion-utils')) {
              return 'vendor-framer-motion';
            }
            if (normalized.includes('lucide-react')) {
              return 'vendor-lucide';
            }
            if (normalized.includes('clsx') || normalized.includes('tailwind-merge')) {
              return 'vendor-utils';
            }
            return 'vendor';
          }
        },
        entryFileNames: 'assets/js/[name]-[hash].js',
        chunkFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const name = assetInfo.name || '';
          if (/\.(png|jpe?g|svg|webp|gif|ico)$/i.test(name)) {
            return 'assets/images/[name]-[hash][extname]';
          }
          if (/\.css$/i.test(name)) {
            return 'assets/css/[name]-[hash][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        },
      },
    },
  },
});
