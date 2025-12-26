import dayjs from "dayjs";

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

export function getDeliveryISOTime(DeliveryOptionId: string) {
  if (DeliveryOptionId === "1") {
    return addWeekDays(7).toISOString();
  } else if (DeliveryOptionId === "2") {
    return addWeekDays(3).toISOString();
  } else if (DeliveryOptionId === "3") {
    return addWeekDays(1).toISOString();
  }
}
