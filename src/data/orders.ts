import { dateFormatOption } from './deliveryOption';
import { CartSchema } from './cart';
import { Temporal } from 'temporal-polyfill-lite';
import { object, number, string, array, InferOutput } from 'valibot';

export const OrderSchema = object({
  id: string(),
  orderTime: string(),
  totalCostCents: number(),
  products: array(CartSchema),
});
export type Order = InferOutput<typeof OrderSchema>;

export function addToOrders(order: Order) {
  const savedOrders = localStorage.getItem('orders');
  const orders: Order[] = savedOrders
    ? (JSON.parse(savedOrders) as Order[])
    : [];
  orders.unshift(order);
  localStorage.setItem('orders', JSON.stringify(orders));
}

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
