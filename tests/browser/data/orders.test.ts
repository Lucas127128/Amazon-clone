import { beforeEach, describe, test } from "vitest";
import { getTimeString, addToOrders, Order } from "../../../src/data/orders.ts";
import dayjs from "dayjs";
import { Temporal } from "temporal-polyfill";

const order: Order = {
  id: "7259cc88-e5b2-4445-a21a-eaafa8e7e8bb",
  orderTime: "2025-12-27T14:53:47.359Z",
  totalCostCents: 1899,
  products: [
    {
      productId: "54e0eccd-8f36-462b-b68a-8182611d9add",
      quantity: 1,
      estimatedDeliveryTime: "2026-01-06T14:51:43.042Z",
    },
  ],
};

describe("test suite: addToOrders", () => {
  beforeEach(() => {
    localStorage.clear();
  });
  test.concurrent("add a new order to an empty orders array", ({ expect }) => {
    addToOrders(order);
    const savedOrders = localStorage.getItem("orders");
    const orders: Order[] = savedOrders
      ? (JSON.parse(savedOrders) as Order[])
      : [];
    expect(orders[0]).toEqual(order);
    localStorage.clear();
  });
  test.concurrent(
    "add a new order to an existing orders array",
    ({ expect }) => {
      localStorage.clear();
      localStorage.setItem("orders", JSON.stringify([]));
      let savedOrders = localStorage.getItem("orders");
      let orders: Order[] = savedOrders
        ? (JSON.parse(savedOrders) as Order[])
        : [];
      orders.unshift(order);
      localStorage.setItem("orders", JSON.stringify(orders));
      addToOrders(order);
      addToOrders(order);
      savedOrders = localStorage.getItem("orders");
      orders = savedOrders ? (JSON.parse(savedOrders) as Order[]) : [];
      expect(orders.length).toBe(3);
      expect(orders[0]).toEqual(order);
      expect(orders[1]).toEqual(order);
      expect(orders[2]).toEqual(order);
    },
  );

  test.concurrent("get time string from ISO time", ({ expect }) => {
    const ISOOrderTime = Temporal.Now.instant().toJSON();
    const orderTime = dayjs(ISOOrderTime).format("dddd, MMMM D");
    expect(getTimeString(ISOOrderTime)).toBe(orderTime);
  });
});
