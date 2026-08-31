import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
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
