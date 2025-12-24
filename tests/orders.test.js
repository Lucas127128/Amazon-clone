import { test, describe, expect, beforeAll } from "vitest";
import cart from "../backend/api/cart.json";
import { getTimeString } from "../data/orders.js";
import { getDeliveryDate } from "../data/deliveryOption.js";
import {
  getMatchingProduct,
  fetchProducts,
  Products,
} from "../data/products-backend.js";

const response = await fetch("https://localhost:3001/orders", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(cart),
});
const order = await response.json();
console.log(order);

await fetchProducts();

describe("order api test", () => {
  test.concurrent("order id test", ({ expect }) => {
    expect(typeof order.id).toBe("string");
  });

  test.concurrent("order time test", ({ expect }) => {
    expect(typeof order.orderTime).toBe("string");

    expect(getTimeString(order.orderTime)).toBe(getTimeString(new Date()));
  });

  test.concurrent("order products test", ({ expect }) => {
    //test products length
    expect(cart.length).toBe(order.products.length);

    //test delivery time
    order.products.forEach((products, productNumber) => {
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
      expect(matchingProduct.quantity).toBe(cartItem.quantity);
    });

    //test products id
    expect(typeof matchingProduct).toBe("object");
  });

  test.concurrent("order cost test", ({ expect }) => {
    expect(typeof order.totalCostCents).toBe("number");

    let totalCostCents = 0;
    cart.forEach((cartItem) => {
      const product = getMatchingProduct(Products, cartItem.productId);
      totalCostCents += product.priceCents;
    });
    expect(order.totalCostCents).toBe(totalCostCents);
  });
});
