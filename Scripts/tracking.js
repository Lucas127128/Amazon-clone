const url = new URL(location.href);
const orderId = url.searchParams.get("orderId");
const prductId = url.searchParams.get("productId");
console.log(orderId);
console.log(prductId);
