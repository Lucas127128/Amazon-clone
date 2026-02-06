import { defineConfig } from "vite";
import htmlMinifier from "vite-plugin-html-minifier";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: "index.html",
        checkout: "checkout.html",
        orders: "orders.html",
        tracking: "tracking.html",
      },
    },
  },
  plugins: [htmlMinifier({ minify: true })],
  server: {
    port: 5174,
  },
});
