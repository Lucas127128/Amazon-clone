import { comptime } from 'comptime';
import { STORAGE_KEYS } from 'shared/constants';
import { OrdersSchema } from 'shared/schema';
import { checkNullish } from 'shared/typeChecker';
import { parse } from 'valibot';

import { fetchMatchingProduct } from '#data/products.ts';

import { getMatchingCart } from '../data/cart.ts';
import { getMatchingOrder } from '../data/orders.ts';
import { sanitizer } from '../utils/trustedTypes.ts';
import { getURLParams } from '../utils/url.ts';
import { handleSearchInput } from './header';
import { generateTrackingHTML } from './htmlGenerators/trackingHTML';

async function renderTrackingSummary() {
  const { orderId, productId } = getURLParams();
  checkNullish(orderId);
  checkNullish(productId);

  const { data: product, error: productError } =
    await fetchMatchingProduct(productId);
  if (productError) throw productError;
  const savedOrders = localStorage.getItem(
    comptime(() => STORAGE_KEYS.ORDER),
  );
  checkNullish(savedOrders);
  const orders = parse(OrdersSchema, JSON.parse(savedOrders));
  const matchingOrder = getMatchingOrder(orders, orderId);
  checkNullish(matchingOrder);

  const cart = matchingOrder.products;
  const matchingCart = getMatchingCart(cart, productId);
  checkNullish(matchingCart);

  const trackingHTML = generateTrackingHTML(
    product,
    matchingOrder,
    matchingCart,
  );
  const backToOrderLink = document.querySelector('.back-to-orders-link');
  checkNullish(backToOrderLink);
  const trustedHTML = sanitizer?.createHTML(trackingHTML);
  checkNullish(trustedHTML);
  backToOrderLink.insertAdjacentHTML(
    'afterend',
    trustedHTML as unknown as string,
  );
}

await renderTrackingSummary();
handleSearchInput();
