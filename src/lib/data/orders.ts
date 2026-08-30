import { Temporal } from 'temporal-polyfill-lite';
import { parse } from 'valibot';

import { STORAGE_KEYS } from '#lib/data/constants.ts';
import { dateFormatOption } from '#lib/data/deliveryOption.ts';
import { type Order, OrdersSchema } from '#lib/schema.ts';

export function getTimeString(ISOOrderTime: string) {
  return Temporal.Instant.from(ISOOrderTime)
    .toZonedDateTimeISO(Temporal.Now.timeZoneId())
    .toLocaleString('en-US', dateFormatOption);
}

export const getMatchingOrder = (orders: Order[], orderId: string) =>
  orders.find((order) => order.id === orderId);

export const getOrders = () => {
  // oxlint-disable-next-line typescript/no-unnecessary-condition
  if (globalThis?.localStorage !== undefined) {
    const storedOrders = localStorage.getItem(STORAGE_KEYS.ORDER);
    return storedOrders !== null
      ? parse(OrdersSchema, JSON.parse(storedOrders))
      : [];
  } else {
    return [];
  }
};
