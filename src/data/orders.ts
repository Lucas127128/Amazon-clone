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
  const format: Intl.DateTimeFormatOptions = {
    weekday: "long",
    month: "long",
    day: "numeric",
  };
  const orderTime = new Date(ISOOrderTime).toLocaleDateString("en-US", format);
  return orderTime;
}
