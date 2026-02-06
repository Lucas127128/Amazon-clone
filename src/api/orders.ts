import { Elysia } from "elysia";
import { RawProduct, transformProducts } from "../data/products.ts";
import { Cart } from "../data/cart.ts";
import { Temporal } from "temporal-polyfill";
import { calculatePrices } from "../data/payment.ts";
import { nanoid } from "nanoid";

const rawProducts: RawProduct[] = await Bun.file(
  "./src/api/rawProducts.json",
).json();
const clothings: string[] = await Bun.file("./src/api/clothing.json").json();
const products = transformProducts(rawProducts, clothings);

class Order {
  constructor(cart: Cart[]) {
    const { totalOrderPrice } = calculatePrices(cart, products);
    this.totalCostCents = totalOrderPrice;
    this.id = nanoid(7);
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
      `new orders request from ${clientIP} at ${Temporal.PlainTime.toString()}`,
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
