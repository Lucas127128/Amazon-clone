import * as Effect from 'effect/Effect';
import type { Cart, Order } from 'shared/schema';
import { checkNullish } from 'shared/typeChecker';
import { cartJson as cart, orderJson as order } from 'testdata';
import { describe, expect, it } from 'vitest';

import { getDeliveryProgress } from '#data/tracking.ts';

describe.concurrent('test suite: getDeliveryProgress', () => {
  it('get correct delivery progress', () => {
    const matchingCart = cart.find(
      (cartItem) => cartItem.productId === '59LXo',
    ) as Cart;
    checkNullish(matchingCart);
    const deliveryProgress = Effect.runSync(
      getDeliveryProgress(order as Order, matchingCart),
    );
    expect(Math.round(deliveryProgress)).toBe(88);
  });
});
