import {
  describe,
  expect,
  test,
  beforeAll,
  afterAll,
  setSystemTime,
} from 'bun:test';
import order from '../../../order.json' with { type: 'json' };
import cart from '../../../cart.json' with { type: 'json' };
import { getDeliveryProgress } from '#root/shared/src/data/tracking.ts';
import { Cart, Order } from '#root/shared/src/schema.ts';

describe('test suite: getDeliveryProgress', () => {
  beforeAll(() => {
    const fakeTime = new Date('2026-03-05T12:00:00.000');
    setSystemTime(fakeTime);
  });
  afterAll(() => {
    setSystemTime();
  });

  test('get correct delivery progress', () => {
    const deliveryProgress = getDeliveryProgress(
      order as Order,
      cart[0] as Cart,
    );
    expect(Math.round(deliveryProgress)).toBe(34);
  });
});
