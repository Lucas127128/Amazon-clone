import { test, describe, expect } from 'bun:test';
import type { Cart, Order } from 'shared/schema';
import { fetchOrders } from 'shared/orders';

const cart = (await Bun.file('./normal/cart.json').json()) as Cart[];
const order = await fetchOrders(cart);

const correctOrder = (await Bun.file(
  './normal/order.json',
).json()) as Order;
describe.concurrent('order api test', () => {
  test('Return right totalCostCents ', () => {
    expect(order.totalCostCents).toBe(correctOrder.totalCostCents);
  });

  test('Return right products', () => {
    expect(order.products).toEqual(correctOrder.products);
  });
});
