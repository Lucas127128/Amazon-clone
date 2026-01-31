import { Temporal } from "temporal-polyfill";
import { dateFormatOption } from "./deliveryOption";

export interface Product {
  productId: string;
  quantity: number;
  estimatedDeliveryTime: string;
}
export interface Order {
  id: string;
  orderTime: string;
  totalCostCents: number;
  products: Product[];
}

export function addToOrders(order: Order) {
  const savedOrders = localStorage.getItem("orders");
  const orders: Order[] = savedOrders
    ? (JSON.parse(savedOrders) as Order[])
    : [];
  orders.unshift(order);
  localStorage.setItem("orders", JSON.stringify(orders));
}

export function getTimeString(ISOOrderTime: string): string {
  const orderInstantTime = Temporal.Instant.from(ISOOrderTime);
  const orderLocalTime = orderInstantTime.toZonedDateTimeISO(
    Temporal.Now.timeZoneId(),
  );
  const orderTime = Temporal.PlainDate.from(orderLocalTime).toLocaleString(
    "en-US",
    dateFormatOption,
  );
  return orderTime;
}
