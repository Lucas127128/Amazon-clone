import { getMatchingOrder } from '#root/shared/src/data/orders.ts';
import {
  getMatchingProduct,
  fetchProducts,
} from '#root/shared/src/data/products.ts';
import { generateTrackingHTML } from './htmlGenerators/trackingHTML';
import { checkNullish } from '../../../shared/src/utils/typeChecker';
import { getMatchingCart } from '#root/shared/src/data/cart.ts';
import { handleSearchInput } from './header';
import { policy } from '../../../shared/src/utils/trustedTypes';
import { Order } from '#root/shared/src/schema.ts';
import { STORAGE_KEYS } from '#root/config/constants.ts';

async function renderTrackingSummary() {
  const url = new URL(location.href);
  const orderId = url.searchParams.get('orderId');
  const productId = url.searchParams.get('productId');
  checkNullish(orderId);
  checkNullish(productId);

  const products = await fetchProducts();
  const matchingProducts = getMatchingProduct(products, productId);
  checkNullish(matchingProducts);

  const savedOrders = localStorage.getItem(STORAGE_KEYS.ORDER);
  checkNullish(savedOrders);
  const orders: Order[] = JSON.parse(savedOrders);
  const matchingOrder = getMatchingOrder(orders, orderId);
  checkNullish(matchingOrder);

  const cart = matchingOrder?.products;
  const matchingCart = getMatchingCart(cart, productId);
  checkNullish(matchingCart);

  const trackingHTML = generateTrackingHTML(
    matchingProducts,
    matchingOrder,
    matchingCart,
  );
  const backToOrderLink = document.querySelector('.back-to-orders-link');
  const trustedTrackingHTML = policy?.createHTML(trackingHTML);
  checkNullish(trustedTrackingHTML);
  backToOrderLink?.insertAdjacentHTML(
    'afterend',
    trustedTrackingHTML as any,
  );
}

await Promise.allSettled([renderTrackingSummary(), handleSearchInput()]);
