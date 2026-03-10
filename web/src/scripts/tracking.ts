import { getMatchingOrder } from '#root/shared/src/data/orders.ts';
import {
  getMatchingProduct,
  getProducts,
} from '#root/shared/src/data/products.ts';
import { generateTrackingHTML } from './htmlGenerators/trackingHTML';
import { checkTruthy } from '../../../shared/src/utils/typeChecker';
import { getMatchingCart } from '#root/shared/src/data/cart.ts';
import { handleSearchInput } from './header';
import { policy } from '../../../shared/src/utils/trustedTypes';
import { Order } from '#root/shared/src/schema.ts';
import { STORAGE_KEYS } from '#root/shared/src/constants.ts';

async function renderTrackingSummary() {
  const url = new URL(location.href);
  const orderId = url.searchParams.get('orderId');
  const productId = url.searchParams.get('productId');
  checkTruthy(orderId);
  checkTruthy(productId);

  const products = await getProducts();
  const matchingProducts = getMatchingProduct(products, productId);
  checkTruthy(matchingProducts);

  const savedOrders = localStorage.getItem(STORAGE_KEYS.ORDER);
  checkTruthy(savedOrders);
  const orders: Order[] = JSON.parse(savedOrders);
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
