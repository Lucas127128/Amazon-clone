import { describe, expect, test } from 'bun:test';
import order from '../../order.json' with { type: 'json' };
import { getDeliveryProgress } from 'shared/tracking';
import type { Cart, Order } from 'shared/schema';
import { getMatchingCart } from 'shared/cart';
import { checkNullish } from 'shared/typeChecker';

describe.concurrent('test suite: getDeliveryProgress', () => {
  test('get correct delivery progress', async () => {
    const cart = (await Bun.file('./normal/cart.json').json()) as Cart[];
    const matchingCart = getMatchingCart(cart, '59LXo');
    checkNullish(matchingCart);
    const deliveryProgress = getDeliveryProgress(
      order as Order,
      matchingCart,
    );
    expect(Math.round(deliveryProgress)).toBe(88);
  });
});
