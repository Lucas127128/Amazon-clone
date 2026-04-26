import {
  addWeekDays,
  getDeliveryDate,
  getDeliveryDateISO,
  getDeliveryPriceCents,
  getPriceString,
} from 'shared/deliveryOption';
import { Temporal } from 'temporal-polyfill-lite';
import { describe, expect, it } from 'vitest';

describe.concurrent('Delivery time test', () => {
  it('addWeekDays', () => {
    const localNow = Temporal.Now.zonedDateTimeISO();
    expect(addWeekDays(7, localNow).toPlainDate()).toEqual(
      Temporal.ZonedDateTime.from('2026-03-16[UTC]').toPlainDate(),
    );
    expect(addWeekDays(3, localNow).toPlainDate()).toEqual(
      Temporal.ZonedDateTime.from('2026-03-10[UTC]').toPlainDate(),
    );
    expect(addWeekDays(1, localNow).toPlainDate()).toEqual(
      Temporal.ZonedDateTime.from('2026-03-06[UTC]').toPlainDate(),
    );
  });

  it('getDeliveryDate', () => {
    expect(getDeliveryDate('1')).toBe('Monday, March 16');
    expect(getDeliveryDate('2')).toBe('Tuesday, March 10');
    expect(getDeliveryDate('3')).toBe('Friday, March 6');
  });

  it('getDeliveryDateISO', () => {
    expect(getDeliveryDateISO('1').toPlainDate()).toEqual(
      Temporal.ZonedDateTime.from('2026-03-16[UTC]').toPlainDate(),
    );
    expect(getDeliveryDateISO('2').toPlainDate()).toEqual(
      Temporal.ZonedDateTime.from('2026-03-10[UTC]').toPlainDate(),
    );
    expect(getDeliveryDateISO('3').toPlainDate()).toEqual(
      Temporal.ZonedDateTime.from('2026-03-06[UTC]').toPlainDate(),
    );
  });
});

describe.concurrent('Delivery price test', () => {
  it('getPriceString', () => {
    expect(getPriceString(0)).toBe('FREE - ');
    expect(getPriceString(499)).toBe('$4.99 - ');
    expect(getPriceString(999)).toBe('$9.99 - ');
  });

  it('getDeliveryPriceCents', () => {
    expect(getDeliveryPriceCents('1')).toBe(0);
    expect(getDeliveryPriceCents('2')).toBe(499);
    expect(getDeliveryPriceCents('3')).toBe(999);
  });
});
