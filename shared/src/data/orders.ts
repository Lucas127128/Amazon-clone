import { dateFormatOption } from './deliveryOption';
import { CartSchema, Cart } from './cart';
import { Temporal } from 'temporal-polyfill-lite';
import {
  object,
  number,
  string,
  InferOutput,
  array,
  isoTimestamp,
  pipe,
} from 'valibot';
import { app } from './edenTreaty';

export const OrderSchema = object({
  id: string(),
  orderTime: pipe(string(), isoTimestamp()),
  totalCostCents: number(),
  products: array(CartSchema),
});
export type Order = InferOutput<typeof OrderSchema>;

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
