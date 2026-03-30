import { describe, expect, test } from 'bun:test';
import order from '../../order.json' with { type: 'json' };
import { getDeliveryProgress } from '#data/tracking.ts';
import type { Cart, Order } from '#root/shared/src/schema.ts';
import { getMatchingCart } from '#root/shared/src/data/cart.ts';
import { checkNullish } from '#utils/typeChecker.ts';

describe.concurrent('test suite: getDeliveryProgress', () => {
  test('get correct delivery progress', async () => {
    const cart = (await Bun.file(
      './tests/normal/cart.json',
    ).json()) as Cart[];
    const matchingCart = getMatchingCart(cart, '59LXo');
    checkNullish(matchingCart);
    const deliveryProgress = getDeliveryProgress(
      order as Order,
      matchingCart,
    );
    expect(Math.round(deliveryProgress)).toBe(88);
  });
});
