import { Elysia } from "elysia";
import { fetchProducts, getMatchingProduct } from "../data/products.ts";
import { getDeliveryISOTime } from "../data/deliveryOption.ts";
import { Cart } from "../data/cart.ts";
import { checkTruthy } from "../Scripts/Utils/typeChecker.ts";
import { internal } from "../data/axios.ts";

async function getProducts() {
  await Bun.sleep(100);
  await fetchProducts(internal);
}

async function startOrdersAPI() {
  await Bun.sleep(100);
  await fetchProducts(internal);
  class Product {
    constructor(cartItem: Cart) {
      const deliveryTime = getDeliveryISOTime(cartItem.deliveryOptionId);
      this.productId = cartItem.productId;
      this.quantity = cartItem.quantity;
      this.estimatedDeliveryTime = deliveryTime;
    }
    productId;
    quantity;
    estimatedDeliveryTime;
  }

  const Products = await fetchProducts();
  class Order {
    constructor(cart: Cart[]) {
      let totalCostsCents = 0;
      cart.forEach((cartItem) => {
        const matchingProduct = getMatchingProduct(
          Products,
          cartItem.productId,
        );
        checkTruthy(matchingProduct);
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

function startOrderAPI() {
  getProducts();
  startOrdersAPI();
}
startOrderAPI();
export const ordersPlugin = startOrdersAPI();
