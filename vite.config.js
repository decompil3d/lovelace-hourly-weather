import { defineConfig } from 'vite';
import fs from 'fs';
import path from 'path';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig(({ mode }) => {
  const isDev = mode === 'development';

  // Read Tippy CSS at config load time
  const tippyCss = fs.readFileSync(path.join(import.meta.dirname, 'node_modules/tippy.js/dist/tippy.css'), 'utf8');

  return {
    define: {
      'process.env.NODE_ENV': JSON.stringify(isDev ? 'development' : 'production'),
      'process.env.TIPPY_CSS': JSON.stringify(tippyCss),
    },

    // Dev server for `npm start`
    server: {
      host: '0.0.0.0',
      port: 3000,
      cors: true,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    },

    // Preview server for `npm run preview` (use for HA core testing)
    preview: {
      host: '0.0.0.0',
      port: 5555,
      cors: true,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    },

    build: {
      outDir: 'dist',
      // Generate a single standalone ES module bundle for Home Assistant
      lib: {
        entry: path.resolve(import.meta.dirname, 'src/hourly-weather.ts'),
        formats: ['es'],
        fileName: () => 'hourly-weather.js',
      },
      // Target ES2020 to match your tsconfig
      target: 'es2020',
      // Enable minify in production, disable in dev
      minify: !isDev,
      // Enable inline source maps in dev
      sourcemap: isDev ? 'inline' : false,
      // Prevent code-splitting so HA gets one single file
      rollupOptions: {
        output: {
          codeSplitting: false,
        },
        // Keeps visualizer working in Vite
        plugins: [
          visualizer({
            filename: 'stats.html',
            open: false,
          }),
        ],
      },
    },
  };
});
