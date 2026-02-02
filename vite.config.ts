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
  server: {
    port: 5174,
  },
  plugins: [stripHTMLComments()],
});
