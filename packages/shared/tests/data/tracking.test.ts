import type { Cart, Order } from 'shared/schema';
import { getDeliveryProgress } from 'shared/tracking';
import { checkNullish } from 'shared/typeChecker';
import { describe, expect, it } from 'vitest';

import cart from '#testData/cart.json' with { type: 'json' };
import order from '#testData/order.json' with { type: 'json' };

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
