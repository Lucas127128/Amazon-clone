import { Elysia } from "elysia";
import Products from "./products.json";
import clothingList from "./clothing.json";

export const productsPlugin = new Elysia()
  .get("/products", ({ request, server }) => {
    const clientIP = server?.requestIP(request)?.address;
    console.log(
      `new products request from ${clientIP} at ${new Date().toLocaleTimeString()}`,
    );
    return Products;
  })
  .get("/clothingList", ({ request, server }) => {
    const clientIP = server?.requestIP(request)?.address;
    console.log(
      `new clothing request from ${clientIP} at ${new Date().toLocaleTimeString()}`,
    );
    return clothingList;
  });

console.log(`🦊 Elysia is running`);

console.log("Products api service starts");
