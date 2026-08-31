import * as Effect from 'effect/Effect';
import { describe, expect, it } from 'vitest';

import { getDeliveryProgress } from '#lib/data/tracking.ts';
import type { Cart, Order } from '#lib/schema.ts';
import { cartJson as cart, orderJson as order } from '#testdata';

describe.concurrent('test suite: getDeliveryProgress', () => {
  it('get correct delivery progress', () => {
    const matchingCart = cart.find(
      (cartItem) => cartItem.productId === '59LXo',
    ) as Cart;
    const deliveryProgress = Effect.runSync(
      getDeliveryProgress(order as Order, matchingCart),
    );
    expect(Math.round(deliveryProgress)).toBe(88);
  });
});
