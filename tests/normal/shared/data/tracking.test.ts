import { describe, expect, test } from 'bun:test';
import order from '../../order.json' with { type: 'json' };
import cart from '../../cart.json' with { type: 'json' };
import { getDeliveryProgress } from '#root/shared/src/data/tracking.ts';
import { Cart, Order } from '#root/shared/src/schema.ts';

describe.concurrent('test suite: getDeliveryProgress', () => {
  test('get correct delivery progress', () => {
    const deliveryProgress = getDeliveryProgress(
      order as Order,
      cart[0] as Cart,
    );
    expect(Math.round(deliveryProgress)).toBe(88);
  });
});
