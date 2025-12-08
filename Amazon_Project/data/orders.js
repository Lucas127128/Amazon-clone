const orders = JSON.parse(localStorage.getItem("order"))||[];

export function addToOrders(order) {
  orders.unshift(order);
  localStorage.setItem("orders", JSON.stringify(orders));
}
