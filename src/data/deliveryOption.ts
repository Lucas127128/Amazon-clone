import { Temporal } from "temporal-polyfill";
import { match } from "ts-pattern";
import { formatCurrency } from "../Scripts/Utils/Money";

export const deliveryOptions = [
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

export function addWeekDays(
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
  const deliveryDate = match(deliveryOptionId)
    .with("1", () => addWeekDays(7, localNow))
    .with("2", () => addWeekDays(3, localNow))
    .with("3", () => addWeekDays(1, localNow))
    .otherwise(() => {
      throw new Error(`deliveryOptionId ${deliveryOptionId} is not valid`);
    });
  return deliveryDate.toLocaleString("en-US", dateFormatOption);
}

export function getPriceString(priceCents: number): string {
  const priceString = match(priceCents)
    .returnType<string>()
    .with(0, () => "FREE - ")
    .with(499, () => `$${formatCurrency(499)} - `)
    .with(999, () => `$${formatCurrency(999)} - `)
    .otherwise(() => {
      throw new Error(`priceCents ${priceCents} is not valid`);
    });
  return priceString;
}

export function getDeliveryPriceCents(deliveryOptionId: string): number {
  const deliveryFee = match(deliveryOptionId)
    .returnType<number>()
    .with("1", () => 0)
    .with("2", () => 499)
    .with("3", () => 999)
    .otherwise(() => {
      throw new Error(`deliveryOptionId ${deliveryOptionId} is not valid`);
    });
  return deliveryFee;
}
