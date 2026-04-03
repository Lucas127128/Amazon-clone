import { describe, expect, test } from 'bun:test';
import {
  addWeekDays,
  getDeliveryDate,
  getDeliveryDateISO,
  getDeliveryPriceCents,
  getPriceString,
} from 'shared/deliveryOption';
import { Temporal } from 'temporal-polyfill-lite';

describe.concurrent('Delivery time test', () => {
  test('addWeekDays', () => {
    const localNow = Temporal.Now.plainDateISO();
    expect(addWeekDays(7, localNow).toJSON()).toBe('2026-03-16');
    expect(addWeekDays(3, localNow).toJSON()).toBe('2026-03-10');
    expect(addWeekDays(1, localNow).toJSON()).toBe('2026-03-06');
  });

  test('getDeliveryDate', () => {
    expect(getDeliveryDate('1')).toBe('Monday, March 16');
    expect(getDeliveryDate('2')).toBe('Tuesday, March 10');
    expect(getDeliveryDate('3')).toBe('Friday, March 6');
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
