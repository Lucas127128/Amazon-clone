import { defineConfig } from "vite";
import htmlMinifier from "vite-plugin-html-minifier";
import removeConsole from "vite-plugin-remove-console";
// import { DevTools } from "@vitejs/devtools";

export default defineConfig({
  build: {
    rolldownOptions: {
      input: {
        main: "index.html",
        checkout: "checkout.html",
        orders: "orders.html",
        tracking: "tracking.html",
      },
      plugins: [removeConsole()],
      // devtools: {},
    },
    target: "es2022",
  },
  plugins: [htmlMinifier({ minify: true }) /* DevTools()*/],
  server: {
    port: 5174,
  },
});
