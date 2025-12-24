import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    base: "/",
    rollupOptions: {
      input: {
        main: resolve("index.html"),
        checkout: resolve("checkout.html"),
        orders: resolve("orders.html"),
        tracking: resolve("tracking.html"),
      },
    },
  },
});
