import { defineConfig } from 'vite';
import htmlMinifier from 'vite-plugin-html-minifier';
import { GLOBAL_CONFIG } from './constants';
import htmlPurge from 'vite-plugin-purgecss';
// import { analyzer, unstableRolldownAdapter } from 'vite-bundle-analyzer';
// import { DevTools } from '@vitejs/devtools';

export default defineConfig({
  root: 'web/src',
  publicDir: '../public',
  build: {
    outDir: '../../dist',
    emptyOutDir: true,
    rolldownOptions: {
      input: {
        main: 'index.html',
        checkout: 'checkout.html',
        orders: 'orders.html',
        tracking: 'tracking.html',
      },
      output: {
        codeSplitting: {
          groups: [
            {
              test: /node_modules\/temporal-polyfill-lite/,
              name: 'temporal',
            },
            {
              test: /node_modules\/dompurify/,
              name: 'dompurify',
            },
          ],
        },
      },
      // devtools: {},
    },
    target: 'baseline-widely-available',
    assetsInlineLimit: 0,
  },
  // experimental: { bundledDev: true },
  plugins: [
    htmlMinifier({ minify: true }),
    htmlPurge({}),
    // unstableRolldownAdapter(analyzer({ openAnalyzer: true })),
    // DevTools(),
  ],
  css: {
    transformer: 'lightningcss',
  },
  server: {
    port: 5174,
    allowedHosts: [GLOBAL_CONFIG.PREVIEW_URL.replace('https://', '')],
    forwardConsole: true,
  },
});
