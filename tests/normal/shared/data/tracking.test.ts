import { describe, expect, test } from 'bun:test';
import order from '../../order.json' with { type: 'json' };
// import cart from '../../cart.json' with { type: 'json' };
import { getDeliveryProgress } from '#root/shared/src/data/tracking.ts';
import type { Cart, Order } from '#root/shared/src/schema.ts';
import { getMatchingCart } from '#root/shared/src/data/cart.ts';
import { checkNullish } from '#root/shared/src/utils/typeChecker.ts';

describe.concurrent('test suite: getDeliveryProgress', () => {
  test('get correct delivery progress', async () => {
    const cart = await Bun.file('./tests/normal/cart.json').json();
    const matchingCart = getMatchingCart(cart as Cart[], '59LXo');
    checkNullish(matchingCart);
    const deliveryProgress = getDeliveryProgress(
      order as Order,
      matchingCart,
    );
    expect(Math.round(deliveryProgress)).toBe(88);
  });
});
