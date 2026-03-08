import { test, describe, expect } from 'bun:test';
import { Cart, Order } from '#root/shared/src/schema.ts';
import { fetchOrders } from '#root/shared/src/data/orders.ts';

describe.concurrent('order api test', async () => {
  const cart: Cart[] = await Bun.file('./tests/cart.json').json();
  const order = await fetchOrders(cart);

  const correctOrder: Order = await Bun.file('./tests/order.json').json();

  test('Return right totalCostCents ', async () => {
    expect(order.totalCostCents).toBe(correctOrder.totalCostCents);
  });

  test('Return right products', () => {
    expect(order.products).toEqual(correctOrder.products);
  });
});
