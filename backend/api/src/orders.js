import { Elysia, t } from "elysia";
import { getMatchingProduct, Products } from "../../../data/products.js";
import { getDeliveryISOTime } from "./deliveryOption.js";
import { date, loadProducts } from "./index.js";

async function getProducts() {
  await Bun.sleep(100);
  await loadProducts();
}

async function startOrdersAPI() {
  await Bun.sleep(100);
  await loadProducts();
  class Product {
    constructor(cartItem) {
      const deliveryTime = getDeliveryISOTime(cartItem.deliveryOptionId);
      this.productId = cartItem.productId;
      this.quantity = cartItem.quantity;
      this.estimatedDeliveryTime = deliveryTime;
    }
    productId;
    quantity;
    estimatedDeliveryTime;
  }

  class Order {
    constructor(cart) {
      let totalCostsCents = 0;
      cart.forEach((cartItem) => {
        const matchingProduct = getMatchingProduct(
          Products,
          cartItem.productId
        );
        totalCostsCents += matchingProduct.priceCents;
        const product = new Product(cartItem);
        this.products.push(product);
      });
      this.id = crypto.randomUUID();
      this.orderTime = new Date();
      this.totalCostCents = totalCostsCents;
    }
    id;
    orderTime;
    totalCostCents;
    products = [];
  }

  const orderPlugin = new Elysia().post(
    "/orders",
    ({ body, request, server, getTime }) => {
      const clientIP = server?.requestIP(request);
      console.log(`new orders request from ${clientIP.address} at ${getTime}`);
      const order = new Order(body);
      return new Response(JSON.stringify(order), {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      });
    }
  );
  console.log(`🦊 Elysia is running`);
  console.log("Orders api service starts");
  return orderPlugin;
}

async function startOrderAPI() {
  await getProducts();
  startOrdersAPI();
}
startOrderAPI();
getProducts();
export const ordersPlugin = startOrdersAPI();
