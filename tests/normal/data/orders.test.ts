import { describe, test, expect } from 'bun:test';
import {
  fetchOrders,
  getMatchingOrder,
  getTimeString,
  Order,
} from '#data/orders.ts';
import { dateFormatOption } from '#data/deliveryOption.ts';
import { Temporal } from 'temporal-polyfill-lite';
import cartJSON from '../../cart.json';
import { Cart } from '#root/src/data/cart.ts';

describe('test suite: getTimeString', () => {
  test.concurrent('get time string from ISO time', async () => {
    const ISOOrderTime = Temporal.Now.instant().toJSON();
    const orderTime = Temporal.Instant.from(ISOOrderTime).toLocaleString(
      'en-US',
      dateFormatOption,
    );
    expect(await getTimeString(ISOOrderTime)).toBe(orderTime);
  });
});

describe('test suite: fetchOrders', async () => {
  const cart = <Cart[]>cartJSON;
  const orders = await fetchOrders(cart);
  const ordersJSON = <Order>(await import('../../order.json')).default;

  test('same totalCostCents', () => {
    expect(orders.totalCostCents).toBe(ordersJSON.totalCostCents);
  });

  test('same products', () => {
    expect(orders.products).toBe(orders.products);
  });
});

describe('test suite: getMatchingOrder', () => {
  test('get correct order', () => {
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

    const order = getMatchingOrder(orders, 'WpkDfne');
    expect(order).toEqual(orders[1]);
  });
});
