import { Elysia, t } from "elysia";
import { cors } from "@elysiajs/cors";
import {
  Products,
  fetchInternalProducts,
} from "../../../data/products-backend.js";
import { productsPlugin } from "./products.ts";
import { ordersPlugin } from "./orders.ts";
export const date = new Date();

export async function loadProducts() {
  //wait for the products api service to start
  try {
    await fetchInternalProducts();
  } catch (error) {
    console.log(error);
  }
}

class Time {
  get(value: string) {
    return date.toLocaleTimeString();
  }
}
const app = new Elysia()
  .use(
    cors({
      origin: [
        "http://localhost:5173",
        "http://localhost:63315",
        "https://localhost:8080",
        "https://localhost",
      ],
      credentials: true,
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  )
  .use(productsPlugin)
  .use(ordersPlugin)
  .decorate("getTime", new Time())
  .get("/", () => "Hello Elysia")
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
