import { Temporal } from "temporal-polyfill";

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

export function addWeekDays(
  businessDaysToAdd: number,
  currentDate: Temporal.Instant | Temporal.PlainDate,
) {
  let currentTime = currentDate;
  if (currentTime instanceof Temporal.Instant) {
    let daysAdded = 0;
    const duration = Temporal.Duration.from({ hours: 24 });
    while (daysAdded < businessDaysToAdd) {
      currentTime = currentTime.add(duration);
      const dayOfWeek = currentTime.toZonedDateTimeISO("UTC").dayOfWeek;
      if (dayOfWeek !== 6 && dayOfWeek !== 7) {
        daysAdded++;
      }
    }
  } else if (currentTime instanceof Temporal.PlainDate) {
    let daysAdded = 0;
    const duration = Temporal.Duration.from({ hours: 24 });
    while (daysAdded < businessDaysToAdd) {
      currentTime = currentTime.add(duration);
      const dayOfWeek = currentTime.dayOfWeek;
      if (dayOfWeek !== 6 && dayOfWeek !== 7) {
        daysAdded++;
      }
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
  let deliveryDate = "";
  const localNow = Temporal.Now.plainDateISO();
  if (deliveryOptionId === "1") {
    deliveryDate = addWeekDays(7, localNow).toLocaleString(
      "en-US",
      dateFormatOption,
    );
  } else if (deliveryOptionId === "2") {
    deliveryDate = addWeekDays(3, localNow).toLocaleString(
      "en-US",
      dateFormatOption,
    );
  } else if (deliveryOptionId === "3") {
    deliveryDate = addWeekDays(1, localNow).toLocaleString(
      "en-US",
      dateFormatOption,
    );
  }
  return deliveryDate;
}

export function getPriceString(priceCents: number): string {
  let priceString = "";
  if (priceCents === 0) {
    priceString = "FREE - ";
  } else if (priceCents === 499) {
    priceString = "$4.99 - ";
  } else if (priceCents === 999) {
    priceString = "$9.99 - ";
  }
  return priceString;
}

export function getDeliveryISOTime(deliveryOptionId: string) {
  const isoNow = Temporal.Now.instant();
  let deliveryISOTime = "";
  if (deliveryOptionId === "1") {
    deliveryISOTime = addWeekDays(7, isoNow).toJSON();
  } else if (deliveryOptionId === "2") {
    deliveryISOTime = addWeekDays(3, isoNow).toJSON();
  } else if (deliveryOptionId === "3") {
    deliveryISOTime = addWeekDays(1, isoNow).toJSON();
  } else {
    throw new Error("deliveryOptionId is not valid");
  }
  console.log(deliveryISOTime);
  return deliveryISOTime;
}
