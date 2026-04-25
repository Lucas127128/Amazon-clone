import { dateFormatOption } from 'shared/deliveryOption';
import type { Cart, Order } from 'shared/schema';
import { Temporal } from 'temporal-polyfill-lite';
import { describe, expect, it } from 'vitest';
import { fetchOrders, getMatchingOrder, getTimeString } from 'web/orders';

import cart from '#testData/cart.json' with { type: 'json' };
import orderJson from '#testData/order.json' with { type: 'json' };

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

describe.concurrent('fetchOrders', async () => {
  const orders = await fetchOrders(cart as Cart[]);
  it('return same totalCostCents', () => {
    expect(orders.totalCostCents).toBe(orderJson.totalCostCents);
  });

  it('return same products', () => {
    expect(orders.products).toBe(orders.products);
  });
});

describe.concurrent('getMatchingOrder', () => {
  const orders: Order[] = [
    {
      id: 'cYVCXw_',
      orderTime: '2026-03-03T13:02:18.976Z',
      totalCostCents: 2519,
      products: [
        { productId: 'ADSpL', quantity: 1, deliveryOptionId: '1' },
      ],
    },
    {
      id: 'WpkDfne',
      orderTime: '2026-03-03T13:02:12.216Z',
      totalCostCents: 4288.9,
      products: [
        { productId: 'cXh3C', quantity: 1, deliveryOptionId: '1' },
      ],
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
