import type { Cart, Order } from 'shared/schema';
import { describe, expect, test } from 'vitest';
import { fetchOrders } from 'web/orders';

import cart from '../../cart.json' with { type: 'json' };

const order = await fetchOrders(cart as Cart[]);

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
