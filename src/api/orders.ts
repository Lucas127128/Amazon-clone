import { Elysia } from "elysia";
import {
  getMatchingProductInterface,
  ProductInterface,
} from "../data/products.ts";
import { getDeliveryISOTime } from "../data/deliveryOption.ts";
import { Cart } from "../data/cart.ts";
import { checkTruthy } from "../Scripts/Utils/typeChecker.ts";
import { Temporal } from "temporal-polyfill";

async function startOrdersAPI() {
  class Product {
    constructor(cartItem: Cart) {
      try {
        console.log(cartItem.deliveryOptionId);
        const deliveryTime = getDeliveryISOTime(cartItem.deliveryOptionId);
        console.log(deliveryTime);
        this.productId = cartItem.productId;
        this.quantity = cartItem.quantity;
        this.estimatedDeliveryTime = deliveryTime;
      } catch (error) {
        console.error(error);
      }
    }
    productId;
    quantity;
    estimatedDeliveryTime;
  }

  const products: ProductInterface[] = await Bun.file(
    "./src/api/products.json",
  ).json();
  class Order {
    constructor(cart: Cart[]) {
      let totalCostsCents = 0;
      cart.forEach((cartItem) => {
        const matchingProduct = getMatchingProductInterface(
          products,
          cartItem.productId,
        );
        checkTruthy(matchingProduct);
        totalCostsCents += matchingProduct.priceCents;
        const product = new Product(cartItem);
        this.products.push(product);
      });
      this.id = crypto.randomUUID();
      this.orderTime = Temporal.Now.instant().toJSON();
      this.totalCostCents = totalCostsCents;
    }
    id;
    orderTime;
    totalCostCents;
    products: Product[] = [];
  }

  const orderPlugin = new Elysia().post(
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
  return orderPlugin;
}

export const ordersPlugin = startOrdersAPI();
