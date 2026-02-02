import { Temporal } from "temporal-polyfill";
import { match } from "ts-pattern";

export const deliveryOption = [
  {
    id: "1",
    deliveryDays: 7,
    priceCents: 0,
  },
  {
    id: "2",
    deliveryDays: 3,
    priceCents: 499,
  },
  {
    id: "3",
    deliveryDays: 1,
    priceCents: 999,
  },
];

function addWeekDays(
  businessDaysToAdd: number,
  currentDate: Temporal.PlainDate,
) {
  let currentTime = currentDate;
  let daysAdded = 0;
  const duration = Temporal.Duration.from({ hours: 24 });
  while (daysAdded < businessDaysToAdd) {
    currentTime = currentTime.add(duration);
    const dayOfWeek = currentTime.dayOfWeek;
    if (dayOfWeek !== 6 && dayOfWeek !== 7) {
      daysAdded++;
    }
  }
  return currentTime;
}

export const dateFormatOption: Intl.DateTimeFormatOptions = {
  weekday: "long",
  month: "long",
  day: "numeric",
};

export function getDeliveryDate(deliveryOptionId: string): string {
  const localNow = Temporal.Now.plainDateISO();
  const deliveryDate = addWeekDays(
    getDeliveryPriceCents(deliveryOptionId),
    localNow,
  );
  return deliveryDate.toLocaleString("en-US", dateFormatOption);
}

export function getPriceString(priceCents: number): string {
  const priceString = match(priceCents)
    .with(0, () => "FREE - ")
    .with(499, () => "$4.99 - ")
    .with(999, () => "$9.99 - ")
    .otherwise(() => {
      throw new Error(`priceCents ${priceCents} is not valid`);
    });
  return priceString;
}

export function getDeliveryPriceCents(deliveryOptionId: string): number {
  const deliveryFee = match(deliveryOptionId)
    .with("1", () => 0)
    .with("2", () => 499)
    .with("3", () => 999)
    .otherwise(() => {
      throw new Error(`deliveryOptionId ${deliveryOptionId} is not valid`);
    });
  return deliveryFee;
}
