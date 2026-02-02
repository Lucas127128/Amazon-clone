import { defineConfig } from "vite";
import { stripHTMLComments } from "@zade/vite-plugin-strip-html-comments";

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
  plugins: [stripHTMLComments()],
  server: {
    port: 5174,
  },
});
