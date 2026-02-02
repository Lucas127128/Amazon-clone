import { Elysia } from "elysia";
import { Product, RawProduct } from "../data/products.ts";
import { Cart } from "../data/cart.ts";
import { Temporal } from "temporal-polyfill";
import { calculatePrices } from "../data/payment.ts";

const products: RawProduct[] = await Bun.file("./src/api/products.json").json();
class Order {
  constructor(cart: Cart[]) {
    const { totalOrderPrice } = calculatePrices(cart, products as Product[]);
    this.totalCostCents = totalOrderPrice;
    this.id = crypto.randomUUID();
    this.orderTime = Temporal.Now.instant().toJSON();
    this.products = cart;
  }
  id;
  orderTime;
  totalCostCents;
  products: Cart[] = [];
}

export const orderPlugin = new Elysia().post(
  "/orders",
  ({ body, request, server }) => {
    const clientIP = server?.requestIP(request)?.address;
    console.log(
      `new orders request from ${clientIP} at ${new Date().toLocaleTimeString()}`,
    );
    const order = new Order(body as Cart[]);
    return new Response(JSON.stringify(order), {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
    });
  },
);
console.log(`🦊 Elysia is running`);
console.log("Orders api service starts");
