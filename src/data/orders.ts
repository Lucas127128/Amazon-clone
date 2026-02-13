import { dateFormatOption } from './deliveryOption';
import { Cart } from './cart';
import { Temporal } from 'temporal-polyfill-lite';

export interface Order {
  id: string;
  orderTime: string;
  totalCostCents: number;
  products: Cart[];
}

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
