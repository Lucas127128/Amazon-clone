import { dateFormatOption } from './deliveryOption.ts';
import { Temporal } from 'temporal-polyfill-lite';
import { app } from './edenTreaty';
import { type Order, type Cart, OrderSchemaArray } from '../schema.ts';
import { STORAGE_KEYS } from '../../config/constants.ts';
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
  return parse(OrderSchemaArray, orders);
}
