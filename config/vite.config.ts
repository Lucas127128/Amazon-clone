import { defineConfig } from 'vite';
import htmlMinifier from 'vite-plugin-html-minifier';
import TurboConsole from 'unplugin-turbo-console/vite';
import config from '#root/config/config.json' with { type: 'json' };
// import { DevTools } from '@vitejs/devtools';

export default defineConfig({
  build: {
    rolldownOptions: {
      input: {
        main: './web/src/index.html',
        checkout: './web/src/checkout.html',
        orders: './web/src/orders.html',
        tracking: './web/src/tracking.html',
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
    target: 'es2022',
    assetsInlineLimit: 0,
  },
  plugins: [
    htmlMinifier({ minify: true }),
    TurboConsole({
      highlight: {
        extendedPathFileNames: ['index', 'checkout', 'order', 'tracking'],
        themeDetect: true,
      },
    }),
    // DevTools(),
  ],
  css: {
    transformer: 'lightningcss',
  },
  server: {
    port: 5174,
    allowedHosts: [config.previewURL.replace('https://', '')],
  },
});
