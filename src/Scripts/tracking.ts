const url = new URL(location.href);
const orderId = url.searchParams.get('orderId');
const productId = url.searchParams.get('productId');
console.log(orderId);
console.log(productId);
