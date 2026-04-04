import { STORAGE_KEYS } from 'shared/constants';
import { calculatePrices } from 'shared/payment';
import { fetchProducts } from 'shared/products';
import type { Cart, Order } from 'shared/schema';
import { checkNullish } from 'shared/typeChecker';

import { fetchOrders, getOrders } from '../../data/orders.ts';
import { sanitize } from '../../utils/trustedTypes.ts';
import { generatePaymentSummary } from '../htmlGenerators/paymentSummaryHTML.ts';

let controller = new AbortController();
export async function renderPaymentSummary(cart: Cart[]) {
  controller.abort();
  controller = new AbortController();
  const { signal } = controller;

  const products = await fetchProducts();
  const prices = calculatePrices(cart, products);

  const paymentSummary = document.querySelector('.payment-summary');
  const paymentSummaryHTML = generatePaymentSummary(prices);
  checkNullish(paymentSummary, 'Fail to select HTML element');
  if (!window.trustedTypes) {
    paymentSummary.innerHTML = paymentSummaryHTML;
  } else {
    paymentSummary.innerHTML = sanitize?.createHTML(
      paymentSummaryHTML,
    ) as unknown as string;
  }

  const placeOrderHTML = document.querySelector('.place-order-button');
  checkNullish(placeOrderHTML, 'Fail to get the HTML element');

  placeOrderHTML.addEventListener(
    'click',
    () => {
      fetchOrders(cart)
        .then((order) => {
          checkNullish(order);
          const orders: Order[] = getOrders();
          orders.unshift(order);
          localStorage.setItem(STORAGE_KEYS.ORDER, JSON.stringify(orders));
          localStorage.removeItem(STORAGE_KEYS.CART_STATE);
          location.href = '/orders.html';
        })
        .catch((err: unknown) => console.error(err));
    },
    { signal },
  );
}
