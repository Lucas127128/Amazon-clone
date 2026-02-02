import { Elysia } from "elysia";
import { getMatchingRawProduct, RawProduct } from "../data/products.ts";
import { Cart } from "../data/cart.ts";
import { checkTruthy } from "../Scripts/Utils/typeChecker.ts";
import { Temporal } from "temporal-polyfill";

const products: RawProduct[] = await Bun.file("./src/api/products.json").json();
class Order {
  constructor(cart: Cart[]) {
    let totalCostsCents = 0;
    cart.forEach((cartItem) => {
      const matchingProduct = getMatchingRawProduct(
        products,
        cartItem.productId,
      );
      checkTruthy(matchingProduct);
      totalCostsCents += matchingProduct.priceCents;
      this.products.push(cartItem);
    });
    this.id = crypto.randomUUID();
    this.orderTime = Temporal.Now.instant().toJSON();
    this.totalCostCents = totalCostsCents;
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
