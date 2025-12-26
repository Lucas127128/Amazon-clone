import { beforeEach, describe, test } from "vitest";
import { getTimeString, addToOrders } from "../../data/orders.ts";
import cart from "../../backend/api/cart.json";

const response = await fetch("https://localhost:3001/orders", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(cart),
});
const order = await response.json();

describe("test suite: addToOrders", () => {
  beforeEach(() => {
    localStorage.clear();
  });
  test.concurrent("add a new order to an empty orders array", ({ expect }) => {
    addToOrders(order);
    const orders = JSON.parse(localStorage.getItem("orders")) || [];
    expect(orders[0]).toEqual(order);
    localStorage.clear();
  });
  test.concurrent(
    "add a new order to an existing orders array",
    ({ expect }) => {
      localStorage.clear();
      localStorage.setItem("orders", JSON.stringify([]));
      let orders = JSON.parse(localStorage.getItem("orders")) || [];
      orders.unshift(order);
      localStorage.setItem("orders", JSON.stringify(orders));
      addToOrders(order);
      addToOrders(order);
      orders = JSON.parse(localStorage.getItem("orders")) || [];
      expect(orders.length).toBe(3);
      expect(orders[0]).toEqual(order);
      expect(orders[1]).toEqual(order);
      expect(orders[2]).toEqual(order);
      localStorage.setItem("orders", JSON.stringify([]));
      localStorage.clear();
    }
  );
});
