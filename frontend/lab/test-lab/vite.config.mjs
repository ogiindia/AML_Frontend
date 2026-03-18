import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig } from 'vite';
import compression from 'vite-plugin-compression';

export default defineConfig({
  plugins: [
    react(),
    compression({
      algorithm: 'gzip',
      ext: '.gz',
      threshold: 10240,
      deleteOriginFile: false,
    }),
    visualizer({
      open: true,
      gzipSize: true,
      brotliSize: true,
      filenam: 'dist/stats.html',
    }),
  ],
  base: './',
  root: '.',
  server: {
    port: 3000, // Optional: set to whatever port you used in CRA
    proxy: {
      '/ngpdev': {
        target: 'https://aisworld.space/',
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/ngpdev/, '')
      },
    },
  },
  build: {
    manifest: true,
    chunkSizeWarningLimit: '1024',
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('flowbite')) {
              return 'vendor-flowbite';
            }

            if (id.includes('@patternfly')) {
              return 'vendor-patterfly';
            }

            if (id.includes('lodash')) {
              return 'vendor-lodash';
            }
            if (id.includes('monaco')) {
              return 'vendor-monaco';
            }

            // if (id.includes('react')) {
            //     return 'vendor-react';
            // }

            return 'vendor';
          }
        },
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
  },
  optimizeDeps: {
    exclude: ['express', 'http-proxy-middleware'],
    esbuildOptions: {
      // Node.js global to browser globalThis
      define: {
        global: 'globalThis',
      },
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        quietDeps: true,
      },
    },
    postcss: {
      plugins: [
        // eslint-disable-next-line global-require
        // require('autoprefixer'),
      ],
    },
  },
});
