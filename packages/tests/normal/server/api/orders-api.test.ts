import type { Cart } from 'shared/schema';
import { describe, expect, test } from 'vitest';
import { fetchOrders } from 'web/orders';

import cart from '#testData/cart.json' with { type: 'json' };
import correctOrder from '#testData/order.json' with { type: 'json' };

const order = await fetchOrders(cart as Cart[]);

describe.concurrent('order api test', () => {
  test('Return right totalCostCents', () => {
    expect(order.totalCostCents).toBe(correctOrder.totalCostCents);
  });

  test('Return right products', () => {
    expect(order.products).toEqual(correctOrder.products);
  });
});
