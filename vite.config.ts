import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve("index.html"),
        checkout: resolve("checkout.html"),
        orders: resolve("orders.html"),
        tracking: resolve("tracking.html"),
      },
    },
    minify: "esbuild",
  },
});
