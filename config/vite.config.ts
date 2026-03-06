import { defineConfig } from 'vite';
import htmlMinifier from 'vite-plugin-html-minifier';
import TurboConsole from 'unplugin-turbo-console/vite';
import config from '#root/config/config.json' with { type: 'json' };

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
  ],
  css: {
    transformer: 'lightningcss',
  },
  server: {
    port: 5174,
    allowedHosts: [config.previewURL.replace('https://', '')],
  },
});
