import dayjs from "dayjs";
import { checkTruthy } from "../Scripts/Utils/typeChecker";
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
const Today = dayjs();
export function addWeekDays(businessDaysToAdd: number) {
  let currentDate = Today;
  let daysAdded = 0;
  while (daysAdded < businessDaysToAdd) {
    currentDate = currentDate.add(1, "day");
    const dayOfWeek = currentDate.day();
    if (dayOfWeek !== 6 && dayOfWeek !== 0) {
      daysAdded++;
    }
  }
  return currentDate;
}
export function getDeliveryDate(deliveryOptionId: string): string {
  let deliveryDate = "";
  if (deliveryOptionId === "1") {
    deliveryDate = addWeekDays(7).format("dddd, MMMM D");
  } else if (deliveryOptionId === "2") {
    deliveryDate = addWeekDays(3).format("dddd, MMMM D");
  } else if (deliveryOptionId === "3") {
    deliveryDate = addWeekDays(1).format("dddd, MMMM D");
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
  if (deliveryOptionId === "1") {
    return addWeekDays(7).toISOString();
  } else if (deliveryOptionId === "2") {
    return addWeekDays(3).toISOString();
  } else if (deliveryOptionId === "3") {
    return addWeekDays(1).toISOString();
  }
}
