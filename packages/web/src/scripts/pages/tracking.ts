import { getMatchingCart } from 'shared/cart';
import { STORAGE_KEYS } from 'shared/constants';
import { fetchProducts, getMatchingProduct } from 'shared/products';
import { OrderSchemaArray } from 'shared/schema';
import { checkNullish } from 'shared/typeChecker';
import { parse } from 'valibot';

import { getMatchingOrder } from '../data/orders.ts';
import { policy } from '../utils/trustedTypes.ts';
import { getURLParams } from '../utils/url.ts';
import { handleSearchInput } from './header';
import { generateTrackingHTML } from './htmlGenerators/trackingHTML';

async function renderTrackingSummary() {
  policy();
  const { orderId, productId } = getURLParams();
  checkNullish(orderId);
  checkNullish(productId);

  const products = await fetchProducts();
  const matchingProducts = getMatchingProduct(products, productId);
  checkNullish(matchingProducts);

  const savedOrders = localStorage.getItem(STORAGE_KEYS.ORDER);
  checkNullish(savedOrders);
  const orders = parse(OrderSchemaArray, JSON.parse(savedOrders));
  const matchingOrder = getMatchingOrder(orders, orderId);
  checkNullish(matchingOrder);

  const cart = matchingOrder.products;
  const matchingCart = getMatchingCart(cart, productId);
  checkNullish(matchingCart);

  const trackingHTML = generateTrackingHTML(
    matchingProducts,
    matchingOrder,
    matchingCart,
  );
  const backToOrderLink = document.querySelector('.back-to-orders-link');
  // const trustedTrackingHTML = policy?.createHTML(trackingHTML);
  // checkNullish(trustedTrackingHTML);
  backToOrderLink?.insertAdjacentHTML('afterend', trackingHTML);
}

await renderTrackingSummary();
handleSearchInput();
