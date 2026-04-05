import { getMatchingCart } from 'shared/cart';
import type { Cart, Order } from 'shared/schema';
import { getDeliveryProgress } from 'shared/tracking';
import { checkNullish } from 'shared/typeChecker';
import { describe, expect, test } from 'vitest';

import order from '../../order.json' with { type: 'json' };

describe.concurrent('test suite: getDeliveryProgress', () => {
  test('get correct delivery progress', async () => {
    const cart = (await Bun.file('./normal/cart.json').json()) as Cart[];
    const matchingCart = getMatchingCart(cart, '59LXo');
    checkNullish(matchingCart);
    const deliveryProgress = getDeliveryProgress(
      order as Order,
      matchingCart,
    );
    expect(Math.round(deliveryProgress)).toBe(90);
  });
});
