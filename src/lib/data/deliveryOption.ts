import { Temporal } from 'temporal-polyfill-lite';

import type { DeliveryOptionId } from '../schema.ts';
import { formatCurrency } from '../utils/money.ts';

export const deliveryOptions = {
  '1': {
    deliveryDays: 7,
    priceCents: 0,
  },
  '2': {
    deliveryDays: 3,
    priceCents: 499,
  },
  '3': {
    deliveryDays: 1,
    priceCents: 999,
  },
} as const;

export function addWeekDays(
  businessDaysToAdd: number,
  currentDate: Temporal.ZonedDateTime,
) {
  let currentTime = currentDate;
  let daysAdded = 0;
  const duration = Temporal.Duration.from({ hours: 24 });
  while (daysAdded < businessDaysToAdd) {
    currentTime = currentTime.add(duration);
    const { dayOfWeek } = currentTime;
    if (dayOfWeek !== 6 && dayOfWeek !== 7) {
      daysAdded++;
    }
  }
  return currentTime;
}

export const dateFormatOption: Intl.DateTimeFormatOptions = {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
} as const;

export function getDeliveryDate(deliveryOptionId: DeliveryOptionId) {
  const localNow = Temporal.Now.zonedDateTimeISO();
  const matchingDeliveryOption = deliveryOptions[deliveryOptionId];

  const deliveryDate = addWeekDays(
    matchingDeliveryOption.deliveryDays,
    localNow,
  );
  return deliveryDate.toLocaleString('en-US', dateFormatOption);
}

export function getDeliveryDateISO(deliveryOptionId: DeliveryOptionId) {
  const localNow = Temporal.Now.zonedDateTimeISO();
  const matchingDeliveryOption = deliveryOptions[deliveryOptionId];
  return addWeekDays(matchingDeliveryOption.deliveryDays, localNow);
}

export function getPriceString(priceCents: number) {
  if (priceCents === 0) return 'FREE - ';
  return `$${formatCurrency(priceCents)} - `;
}

export function getDeliveryPriceCents(deliveryOptionId: DeliveryOptionId) {
  const matchingDeliveryOption = deliveryOptions[deliveryOptionId];
  return matchingDeliveryOption.priceCents;
}
