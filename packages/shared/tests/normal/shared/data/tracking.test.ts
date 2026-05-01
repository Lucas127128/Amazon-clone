import { describe, expect, it } from 'vitest';

import cart from '#testData/cart.json' with { type: 'json' };
import order from '#testData/order.json' with { type: 'json' };

import { getDeliveryProgress } from '../../../../src/data/tracking';
import type { Cart, Order } from '../../../../src/schema';
import { checkNullish } from '../../../../src/utils/typeChecker';

describe.concurrent('test suite: getDeliveryProgress', () => {
  it('get correct delivery progress', () => {
    const matchingCart = cart.find(
      (cartItem) => cartItem.productId === '59LXo',
    ) as Cart;
    checkNullish(matchingCart);
    const deliveryProgress = getDeliveryProgress(
      order as Order,
      matchingCart,
    );
    expect(Math.round(deliveryProgress)).toBe(88);
  });
});
