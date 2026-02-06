import { Elysia } from "elysia";
import Products from "./rawProducts.json";
import clothingList from "./clothing.json";
import { Temporal } from "temporal-polyfill";

export const productsPlugin = new Elysia()
  .get("/products", ({ request, server }) => {
    const clientIP = server?.requestIP(request)?.address;
    console.log(
      `new products request from ${clientIP} at ${Temporal.PlainTime.toString()}`,
    );
    return Products;
  })
  .get("/clothingList", ({ request, server }) => {
    const clientIP = server?.requestIP(request)?.address;
    console.log(
      `new clothing request from ${clientIP} at ${Temporal.PlainTime.toString()}`,
    );
    return clothingList;
  });

console.log(`🦊 Elysia is running`);

console.log("Products api service starts");
