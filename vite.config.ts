import { defineConfig } from "vite";
import htmlMinifier from "vite-plugin-html-minifier";
import removeConsole from "vite-plugin-remove-console";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: "index.html",
        checkout: "checkout.html",
        orders: "orders.html",
        tracking: "tracking.html",
      },
      plugins: [removeConsole()],
    },
    target: "es2022",
  },
  plugins: [htmlMinifier({ minify: true })],
  server: {
    port: 5174,
  },
});
