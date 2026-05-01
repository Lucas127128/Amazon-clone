import { createOrder, OrderService } from 'server/orderService';
import { CART_CONFIG } from 'shared/constants';
import type { Cart } from 'shared/schema';
import { describe, expect, it } from 'vitest';

import cart from '#testData/cart.json' with { type: 'json' };
import orderJson from '#testData/order.json' with { type: 'json' };

describe.concurrent('createOrder', () => {
  it('return right order if success', () => {
    const { data: order } = createOrder(cart as Cart[]);
    expect(order?.products).toEqual(orderJson.products);
    expect(order?.totalCostCents).toEqual(orderJson.totalCostCents);
  });
  it('return error if cart is invalid', () => {
    const { error } = createOrder([
      ...(cart as Cart[]),
      {
        productId: 'abcde',
        quantity: CART_CONFIG.MAX_QUANTITY_PER_ITEM + 1,
        deliveryOptionId: '3',
      },
    ]);
    expect(error).toBeTruthy();
    expect(error?.message).toBe('Fail to get matching product');
    expect(error?.productId).toBe('abcde');
  });
});

describe.concurrent('OrderService.createOrder', () => {
  it('returns right order with status', () => {
    const order = OrderService.createOrder(cart as Cart[]);
    expect(order.code).toEqual(200);
  });
  it('return 4xx error if cart is invalid', () => {
    const order = OrderService.createOrder([
      ...(cart as Cart[]),
      {
        productId: 'abcde',
        quantity: CART_CONFIG.MAX_QUANTITY_PER_ITEM + 1,
        deliveryOptionId: '3',
      },
    ]);
    expect(order.code).toBe(422);
  });
});
