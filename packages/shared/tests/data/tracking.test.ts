import type { Cart, Order } from 'shared/schema';
import { getDeliveryProgress } from 'shared/tracking';
import { checkNullish } from 'shared/typeChecker';
import { cartJson as cart, orderJson as order } from 'testdata';
import { describe, expect, it } from 'vitest';

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
