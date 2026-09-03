import { Temporal } from 'temporal-polyfill-lite';
import { describe, expect, it } from 'vitest';

import { dateFormatOption } from '#lib/data/deliveryOption.ts';
import {
  getMatchingOrder,
  getTimeString,
  Order as OrderClass,
} from '#lib/data/order.svelte.ts';
import type { Cart, Order } from '#lib/schema.ts';
import { cartJson, orderJson } from '#testdata';

describe.concurrent('getTimeString', () => {
  it('get time string from ISO time', () => {
    const ISOOrderTime = Temporal.Now.instant().toJSON();
    const orderTime = Temporal.Instant.from(ISOOrderTime).toLocaleString(
      'en-US',
      dateFormatOption,
    );
    expect(getTimeString(ISOOrderTime)).toBe(orderTime);
  });
  it('throw if iso time invalid', () => {
    expect(() => getTimeString('abc')).toThrow('parse error');
  });
});

describe.concurrent('getMatchingOrder', () => {
  const orders: Order[] = [
    {
      id: 'cYVCXw_',
      orderTime: '2026-03-03T13:02:18.976Z',
      totalCostCents: 2519,
      products: [{ productId: 'ADSpL', quantity: 1, deliveryOptionId: '1' }],
    },
    {
      id: 'WpkDfne',
      orderTime: '2026-03-03T13:02:12.216Z',
      totalCostCents: 4288.9,
      products: [{ productId: 'cXh3C', quantity: 1, deliveryOptionId: '1' }],
    },
  ];
  it('get correct order', () => {
    const order = getMatchingOrder(orders, 'WpkDfne');
    expect(order).toEqual(orders[1]);
  });

  it('Return undefined orderId is invalid', () => {
    const order = getMatchingOrder(orders, 'abc');
    expect(order).toBe(undefined);
  });
});

describe.concurrent('Order class', () => {
  it('creates an order', () => {
    const order = new OrderClass();
    expect(order).toEqual({});
  });

  it('add adds order to beginning of list', () => {
    const order = new OrderClass();
    order.add(orderJson as Order);
    expect(order.items).toEqual([orderJson]);
  });

  it('getById returns undefined if order not found', () => {
    const order = new OrderClass();
    expect(order.getById('abc')).toBe(undefined);
  });

  it('getById returns order if found', () => {
    const order = new OrderClass();
    order.add(orderJson as Order);
    expect(order.getById('gsZyI1l')).toEqual(orderJson);
  });

  it('placeOrder', async () => {
    const order = new OrderClass();
    const result = await order.placeOrder(cartJson as Cart[]);
    expect(result.products).toEqual(orderJson.products);
    expect(result.totalCostCents).toEqual(orderJson.totalCostCents);
  });
});
