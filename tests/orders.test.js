import { test, describe, expect, beforeAll } from "vitest";
import cart from "../backend/api/cart.json";
import { getTimeString } from "../data/orders.js";
import { getDeliveryDate } from "../data/deliveryOption.js";

const response = await fetch("https://localhost:3001/orders", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(cart),
});
const order = await response.json();
console.log(order);

describe("order api test", () => {
  test.concurrent("order id test", ({ expect }) => {
    expect(typeof order.id).toBe("string");
  });

  test.concurrent("order time test", ({ expect }) => {
    expect(order.orderTime).not.toBe(null || undefined);
    expect(typeof order.orderTime).toBe("string");
    expect(getTimeString(order.orderTime)).toBe(getTimeString(new Date()));
  });

  test.concurrent("order products test", ({ expect }) => {
    order.products.forEach((product, productNumber) => {
      const cartItem = cart[productNumber];
      const estimatedDeliveryTime = getDeliveryDate(cartItem.deliveryOptionId);
      console.log(estimatedDeliveryTime);
      expect(estimatedDeliveryTime).toBe(
        getTimeString(product.estimatedDeliveryTime)
      );
    });
  });
});
