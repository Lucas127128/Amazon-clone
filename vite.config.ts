import { defineConfig } from "vite";

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
  server: {
    port: 5174,
  },
});
