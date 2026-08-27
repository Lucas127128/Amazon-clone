import { dateFormatOption } from 'shared/deliveryOption';
import type { Order } from 'shared/schema';
import { Temporal } from 'temporal-polyfill-lite';

export function getTimeString(ISOOrderTime: string) {
  return Temporal.Instant.from(ISOOrderTime)
    .toZonedDateTimeISO(Temporal.Now.timeZoneId())
    .toLocaleString('en-US', dateFormatOption);
}

export const getMatchingOrder = (orders: Order[], orderId: string) =>
  orders.find((order) => order.id === orderId);
