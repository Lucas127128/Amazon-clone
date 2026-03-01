import { getMatchingOrder } from '#data/orders.ts';
import { getMatchingProduct, getProducts } from '#data/products.ts';
import { generateTrackingHTML } from './htmlGenerators/trackingHTML';
import { checkTruthy } from './Utils/typeChecker';
import { Order } from '#data/orders.ts';
import { getMatchingCart } from '#data/cart.ts';
import { handleSearchInput } from './header';
import { policy } from './Utils/trustedTypes';

async function renderTrackingSummary() {
  const url = new URL(location.href);
  const orderId = url.searchParams.get('orderId');
  const productId = url.searchParams.get('productId');
  checkTruthy(orderId);
  checkTruthy(productId);

  const products = await getProducts();
  const matchingProducts = getMatchingProduct(products, productId);
  checkTruthy(matchingProducts);

  const savedOrders = localStorage.getItem('orders');
  checkTruthy(savedOrders);
  const orders: Order[] = JSON.parse(savedOrders);
  checkTruthy(orders);
  const matchingOrder = getMatchingOrder(orders, orderId);
  checkTruthy(matchingOrder);

  const cart = matchingOrder?.products;
  const matchingCart = getMatchingCart(cart, productId);
  checkTruthy(matchingCart);

  const trackingHTML = generateTrackingHTML(
    matchingProducts,
    matchingOrder,
    matchingCart,
  );
  const backToOrderLink = document.querySelector('.back-to-orders-link');
  const trustedTrackingHTML = policy?.createHTML(trackingHTML);
  checkTruthy(trustedTrackingHTML);
  backToOrderLink?.insertAdjacentHTML(
    'afterend',
    trustedTrackingHTML as any,
  );
}

await Promise.allSettled([renderTrackingSummary(), handleSearchInput()]);
