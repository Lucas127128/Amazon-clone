import { STORAGE_KEYS } from 'shared/constants';
import { dateFormatOption } from 'shared/deliveryOption';
import { app } from 'shared/edenTreaty';
import { type Cart, type Order, OrderSchemaArray } from 'shared/schema';
import { Temporal } from 'temporal-polyfill-lite';
import { parse } from 'valibot';

export function getTimeString(ISOOrderTime: string) {
  return Temporal.Instant.from(ISOOrderTime)
    .toZonedDateTimeISO(Temporal.Now.timeZoneId())
    .toLocaleString('en-US', dateFormatOption);
}

export const getMatchingOrder = (orders: Order[], orderId: string) =>
  orders.find((order) => order.id === orderId);

export async function fetchOrders(cart: Cart[]) {
  const { data, error } = await app.api.orders.post(cart);
  if (error) {
    alert('Unexpected network issue. Please try again later.');
    throw error;
  }
  return data;
}

export function getOrders() {
  const savedOrders = localStorage.getItem(STORAGE_KEYS.ORDER);

  const orders = parse(OrderSchemaArray, JSON.parse(savedOrders ?? '[]'));
  return orders;
}
