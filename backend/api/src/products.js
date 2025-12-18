import { Elysia } from "elysia";
import Products from "../../products.json";

export const productsPlugin = new Elysia().get(
  "/products",
  ({ request, server, getTime }) => {
    const clientIP = server?.requestIP(request);
    console.log(`new products request from ${clientIP.address} at ${getTime}`);
    return Products;
  }
);

console.log(`🦊 Elysia is running`);

console.log("Products api service starts");
