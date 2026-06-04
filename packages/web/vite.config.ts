// import { DevTools } from '@vitejs/devtools';
import { comptime } from 'comptime/vite';
import jsShaker from 'rollup-plugin-jsshaker';
import { GLOBAL_CONFIG } from 'shared/constants';
import Sonda from 'sonda/vite';
import { defineConfig } from 'vite';
import htmlMinifier from 'vite-plugin-html-minifier';
import htmlPurge from 'vite-plugin-purgecss';

export default defineConfig(({ command }) => {
  const isBuild = command === 'build';

  return {
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
        // devtools: {}
      },
      target: 'baseline-widely-available',
      assetsInlineLimit: 0,
      // sourcemap: true,
    },
    plugins: [
      isBuild && htmlMinifier({ minify: true }),
      isBuild && htmlPurge({}),
      isBuild && Sonda({ open: false }),
      isBuild && jsShaker(),
      comptime(),
      // DevTools(),
    ],
    css: {
      transformer: 'lightningcss',
      lightningcss: {
        targets: {
          safari: 15,
          chrome: 100,
          firefox: 100,
        },
      },
    },
    server: {
      port: 5174,
      allowedHosts: [new URL(GLOBAL_CONFIG.PREVIEW_URL).hostname],
      forwardConsole: true,
    },
  };
});
