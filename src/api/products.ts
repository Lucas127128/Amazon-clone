import { Elysia } from "elysia";
import Products from "./products.json";

export const productsPlugin = new Elysia().get(
  "/products",
  ({ request, server }) => {
    const clientIP = server?.requestIP(request)?.address;
    console.log(
      `new products request from ${clientIP} at ${new Date().toLocaleTimeString()}`
    );
    return Products;
  }
);

console.log(`🦊 Elysia is running`);

console.log("Products api service starts");
