import { test, describe, expect, beforeAll } from "vitest";
import cart from "../../src/api/cart.json";
import { getTimeString } from "../../src/data/orders.ts";
import { getDeliveryDate } from "../../src//data/deliveryOption.ts";
import {
  getMatchingProduct,
  fetchProducts,
  Products,
} from "../../src/data/products-backend.ts";
import { Order, Product } from "../../src/data/orders.ts";

const response = await fetch("https://localhost:3001/orders", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(cart),
});
const order: Order = await response.json();

await fetchProducts();

describe("order api test", () => {
  test.concurrent("order id test", ({ expect }) => {
    console.log(order);
    expect(typeof order.id).toBe("string");
  });

  test.concurrent("order time test", ({ expect }) => {
    expect(typeof order.orderTime).toBe("string");
    const date = String(new Date());
    expect(getTimeString(order.orderTime)).toBe(getTimeString(date));
  });

  test.concurrent("order products test", ({ expect }) => {
    //test products length
    expect(cart.length).toBe(order.products.length);

    //test delivery time
    order.products.forEach((products, productNumber: number) => {
      expect(typeof products.estimatedDeliveryTime).toBe("string");

      const cartItem = cart[productNumber];
      const estimatedDeliveryTime = getDeliveryDate(cartItem.deliveryOptionId);
      expect(estimatedDeliveryTime).toBe(
        getTimeString(products.estimatedDeliveryTime)
      );
    });

    let matchingProduct;
    cart.forEach((cartItem) => {
      matchingProduct = order.products.find(
        (product) => cartItem.productId === product.productId
      );
      //test product quantity
      if (matchingProduct) {
        expect(matchingProduct.quantity).toBe(cartItem.quantity);
      }
    });

    //test products id
    expect(typeof matchingProduct).toBe("object");
  });

  test.concurrent("order cost test", ({ expect }) => {
    expect(typeof order.totalCostCents).toBe("number");

    let totalCostCents = 0;
    cart.forEach((cartItem) => {
      const product = getMatchingProduct(Products, cartItem?.productId);
      if (product) {
        totalCostCents += product.priceCents;
      } else {
        console.error("There is no matching product.");
      }
    });
    expect(order.totalCostCents).toBe(totalCostCents);
  });
});
