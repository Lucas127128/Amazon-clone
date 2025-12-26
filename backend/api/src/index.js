import { Elysia, t } from "elysia";
import { cors } from "@elysiajs/cors";
import {
  Products,
  fetchInternalProducts,
} from "../../../data/products-backend.js";
import { productsPlugin } from "./products.js";
import { ordersPlugin } from "./orders.js";
export const date = new Date();

export async function loadProducts() {
  //wait for the products api service to start
  try {
    await fetchInternalProducts();
  } catch (error) {
    console.log(error);
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
      method: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      credentials: true,
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  )
  .use(productsPlugin)
  .use(ordersPlugin)
  .decorate("getTime", date.toLocaleTimeString())
  .get("/", () => "Hello Elysia")
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
