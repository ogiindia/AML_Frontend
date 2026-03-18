import react from '@vitejs/plugin-react';
import path, { resolve } from 'path';
import { defineConfig, loadEnv } from 'vite';




export default defineConfig(({ mode }) => {

  // Load env file based on `mode`
  const env = loadEnv(mode, path.resolve(__dirname, '../../'), 'VITE');
  console.log(env);
  return {
    base: env.VITE_APP_CONTEXT || '/',
    plugins: [react()],
    define: {
      __APP_NAME__: JSON.stringify(env.VITE_APP_NAME || 'AML'),
      __CONTEXT_PATH__: JSON.stringify(env.VITE_APP_CONTEXT || ''),
      __PLUGIN_URL__: JSON.stringify(env.VITE_APP_PLUGIN_URL || 'http://localhost:9000'),
      __BACKEND_URL__: JSON.stringify(env.VITE_BACKEND_URL || 'http://localhost:8080'),
      __GRAPHQL_URL__: JSON.stringify(env.VITE_BACKEND_GRAPHQL_URL || 'http://localhost:8080/graphql')
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
      },
    },
    build: {
      outDir: 'build',
    },

    optimizeDeps: {
      include: ['graphiql'],
    },

    server: {
      port: 3000, // Optional: set to whatever port you used in CRA
      proxy: {
        '/api': {
          target: 'https://iasuat.fisglobal.com/ngpdev/ais/hub/api',
          changeOrigin: true,
          // rewrite: (path) => path.replace(/^\/ngpdev/, '')
        },
      },
    },
  };
});

// export default defineConfig(
// });
