import { defineConfig } from 'vite';
import htmlMinifier from 'vite-plugin-html-minifier';
import removeConsole from 'vite-plugin-remove-console';
import TurboConsole from 'unplugin-turbo-console/vite';
// import { DevTools } from "@vitejs/devtools";
// import Macro from "unplugin-macros/vite"

export default defineConfig({
  build: {
    rolldownOptions: {
      input: {
        main: 'index.html',
        checkout: 'checkout.html',
        orders: 'orders.html',
        tracking: 'tracking.html',
      },
      plugins: [removeConsole()],
      // devtools: {},
    },
    target: 'es2022',
  },
  plugins: [
    htmlMinifier({ minify: true }),
    TurboConsole({
      highlight: {
        extendedPathFileNames: ['index', 'checkout', 'order', 'tracking'],
        themeDetect: true,
      },
    }),
    // Macro()
    // DevTools(),
  ],
  server: {
    port: 5174,
  },
});
