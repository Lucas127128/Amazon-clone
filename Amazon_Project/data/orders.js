const orders = JSON.parse(localStorage.getItem("orders")) || [];

export function addToOrders(order) {
  orders.unshift(order);
  localStorage.setItem("orders", JSON.stringify(orders));
}
