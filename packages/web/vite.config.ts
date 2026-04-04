import { GLOBAL_CONFIG } from 'shared/constants';
import Sonda from 'sonda/vite';
import { defineConfig } from 'vite';
import htmlMinifier from 'vite-plugin-html-minifier';
import htmlPurge from 'vite-plugin-purgecss';
// import { DevTools } from '@vitejs/devtools';

export default defineConfig({
  root: './src',
  publicDir: '../public',
  build: {
    outDir: '../dist',
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
    // sourcemap: true,
  },
  // experimental: { bundledDev: true },
  plugins: [
    htmlMinifier({ minify: true }),
    htmlPurge({}),
    Sonda({ open: false }),
    // DevTools(),
  ],
  css: {
    transformer: 'lightningcss',
  },
  server: {
    port: 5174,
    allowedHosts: [GLOBAL_CONFIG.PREVIEW_URL.replace('https://', '')],
    forwardConsole: true,
    warmup: {
      clientFiles: [
        '../../shared/src/schema.ts',
        '../../shared/src/data/cart.ts',
        '../../shared/src/data/products.ts',
        './scripts/pages/amazon/products.ts',
        './scripts/pages/amazon/sort.ts',
        '../../shared/src/data/deliveryOption.ts',
        '../../shared/src/data/tracking.ts',
      ],
    },
  },
});
