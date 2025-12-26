interface Product {
  productId: string;
  quantity: number;
  estimatedDeliveryTime: string;
}
interface Order {
  id: string;
  orderTime: string;
  totalCostsCents: number;
  products: Product;
}
const savedOrders = localStorage.getItem("orders");
const orders: Order[] = savedOrders ? JSON.parse(savedOrders) : [];

export function addToOrders(order: Order) {
  orders.unshift(order);
  localStorage.setItem("orders", JSON.stringify(orders));
}

export function getTimeString(ISOOrderTime: string) {
  const format: Intl.DateTimeFormatOptions = {
    weekday: "long",
    month: "long",
    day: "numeric",
  };
  const orderTime = new Date(ISOOrderTime).toLocaleDateString("en-US", format);
  return orderTime;
}
