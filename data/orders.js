const orders = JSON.parse(localStorage.getItem("orders")) || [];
export function addToOrders(order) {
  orders.unshift(order);
  localStorage.setItem("orders", JSON.stringify(orders));
}

export function getTimeString(ISOOrderTime) {
  const format = {
    weekday: "long",
    month: "long",
    day: "numeric",
  };
  const orderTime = new Date(ISOOrderTime).toLocaleDateString("en-US", format);
  return orderTime;
}
