import {
  describe,
  test,
  setSystemTime,
  beforeAll,
  expect,
  afterAll,
} from 'bun:test';
import {
  addWeekDays,
  getDeliveryDate,
  getPriceString,
  getDeliveryPriceCents,
  getDeliveryDateISO,
} from '#root/shared/src/data/deliveryOption.ts';
import { Temporal } from 'temporal-polyfill-lite';

describe.concurrent('Delivery time test', () => {
  beforeAll(() => {
    const fakeTime = new Date('2026-02-09T16:00:00.000');
    setSystemTime(fakeTime);
  });

  afterAll(() => {
    setSystemTime();
  });
  test('addWeekDays', () => {
    const localNow = Temporal.Now.plainDateISO();
    expect(addWeekDays(7, localNow).toJSON()).toBe('2026-02-18');
    expect(addWeekDays(3, localNow).toJSON()).toBe('2026-02-12');
    expect(addWeekDays(1, localNow).toJSON()).toBe('2026-02-10');
  });

  test('getDeliveryDate', () => {
    expect(getDeliveryDate('1')).toEqual('Wednesday, February 18');
    expect(getDeliveryDate('2')).toEqual('Thursday, February 12');
    expect(getDeliveryDate('3')).toEqual('Tuesday, February 10');
  });

  test('getDeliveryDateISO', () => {
    expect(getDeliveryDateISO('1')).toEqual(
      Temporal.PlainDate.from('2026-02-18'),
    );
    expect(getDeliveryDateISO('2')).toEqual(
      Temporal.PlainDate.from('2026-02-12'),
    );
    expect(getDeliveryDateISO('3')).toEqual(
      Temporal.PlainDate.from('2026-02-10'),
    );
  });
});

describe.concurrent('Delivery price test', () => {
  test('getPriceString', () => {
    expect(getPriceString(0)).toBe('FREE - ');
    expect(getPriceString(499)).toBe('$4.99 - ');
    expect(getPriceString(999)).toBe('$9.99 - ');
  });

  test('getDeliveryPriceCents', () => {
    expect(getDeliveryPriceCents('1')).toBe(0);
    expect(getDeliveryPriceCents('2')).toBe(499);
    expect(getDeliveryPriceCents('3')).toBe(999);
  });
});
