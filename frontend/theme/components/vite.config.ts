import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    dts({
      outDir: 'dist',
      include: ['src'],
      rollupTypes: true,
      exclude: ['src/**/*.js', 'src/**/*.jsx'],
    }),
  ],
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'aisshadui',
      formats: ['es', 'umd'],
      fileName: (format) => `ais-theme-shad-ui.${format}.ts`,
    },
    rollupOptions: {
      plugins: [],
      external: [
        'react',
        'react-dom',
        'react-jsx-runtime',
        'react/jsx-runtime',
        'react/jsx-runtime.js',
        'react-jsx-runtime.production.min.js',
        'lucide-react',
        /^@ais\//,

        'react-bootstrap',
        'react-bootstrap-icons',
        /^react-bootstrap\//,

        'antd',
        '@ant-design/icons',
        /^@ant-design\/icons.*/,

        'framer-motion',
      ],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react/jsx-runtime': 'ReactJsxRuntime',
          'lucide-react': 'lucideReact',
          'react-bootstrap': 'reactBootstrap',
          'framer-motion': 'FramerMotion',
          '@ais/api': 'api',
          '@ais/utils': 'utils',
          antd: 'antd',
          'react-bootstrap-icons': 'IconMap',
          '@ais/graphql/BuildGPLQuery': 'BuildGPLQuery',
          'react-bootstrap/Modal': 'Modal',
        },
        exports: 'named',
      },
    },
    sourcemap: false,
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
