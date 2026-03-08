import { dateFormatOption } from './deliveryOption';
import { Temporal } from 'temporal-polyfill-lite';
import { app } from './edenTreaty';
import type { Order, Cart } from '../schema';

export async function getTimeString(
  ISOOrderTime: string,
): Promise<string> {
  const orderTime = Temporal.Instant.from(ISOOrderTime)
    .toZonedDateTimeISO(Temporal.Now.timeZoneId())
    .toLocaleString('en-US', dateFormatOption);
  return orderTime;
}

export const getMatchingOrder = (orders: Order[], orderId: string) =>
  orders.find((order) => order.id === orderId);

export async function fetchOrders(cart: Cart[]): Promise<Order> {
  const { data, error } = await app.api.orders.post(cart);
  if (error) throw error;
  return data;
}
