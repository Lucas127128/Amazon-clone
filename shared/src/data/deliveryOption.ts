import { Temporal } from 'temporal-polyfill-lite';
import { formatCurrency } from '../utils/money.ts';
import { type deliveryOptionId } from '../schema.ts';
import { checkTruthy } from '../utils/typeChecker.ts';

export const deliveryOptions = [
  {
    id: '1',
    deliveryDays: 7,
    priceCents: 0,
  },
  {
    id: '2',
    deliveryDays: 3,
    priceCents: 499,
  },
  {
    id: '3',
    deliveryDays: 1,
    priceCents: 999,
  },
] as const;

const getMatchingDeliveryOption = (deliveryOptionId: deliveryOptionId) =>
  deliveryOptions.find(
    (deliveryOption) => deliveryOption.id === deliveryOptionId,
  );

export function addWeekDays(
  businessDaysToAdd: number,
  currentDate: Temporal.PlainDate,
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

export function getDeliveryDate(
  deliveryOptionId: deliveryOptionId,
): string {
  const localNow = Temporal.Now.plainDateISO();
  const matchingDeliveryOption =
    getMatchingDeliveryOption(deliveryOptionId);
  checkTruthy(matchingDeliveryOption);

  const deliveryDate = addWeekDays(
    matchingDeliveryOption.deliveryDays,
    localNow,
  );
  return deliveryDate.toLocaleString('en-US', dateFormatOption);
}

export function getDeliveryDateISO(
  deliveryOptionId: deliveryOptionId,
): Temporal.PlainDate {
  const localNow = Temporal.Now.plainDateISO();
  const matchingDeliveryOption =
    getMatchingDeliveryOption(deliveryOptionId);
  checkTruthy(matchingDeliveryOption);
  return addWeekDays(matchingDeliveryOption.deliveryDays, localNow);
}

export function getPriceString(priceCents: number): string {
  if (priceCents === 0) return 'FREE - ';
  return `$${formatCurrency(priceCents)} - `;
}

export function getDeliveryPriceCents(
  deliveryOptionId: deliveryOptionId,
): number {
  const matchingDeliveryOption =
    getMatchingDeliveryOption(deliveryOptionId);
  checkTruthy(matchingDeliveryOption);
  return matchingDeliveryOption?.priceCents;
}
