import { afterAll, describe, expect, it } from 'vitest';

import { getOrders } from '#lib/data/orders.ts';
import { orderJson } from '#testdata';

describe.concurrent('getOrders', () => {
  afterAll(() => {
    localStorage.clear();
  });
  it('get truthy localStorage orders in happy dom environment', () => {
    localStorage.setItem('orders', JSON.stringify([orderJson]));
    const orders = getOrders();
    expect(orders).toEqual([orderJson]);
  });
  it('get falsy localStorage orders in happy dom environment', () => {
    localStorage.removeItem('orders');

    const orders = getOrders();
    expect(orders).toEqual([]);
  });
});
