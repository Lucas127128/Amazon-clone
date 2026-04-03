import { STORAGE_KEYS } from 'shared/constants';
import { fetchOrders, getOrders } from 'shared/orders';
import { calculatePrices } from 'shared/payment';
import { fetchProducts } from 'shared/products';
import type { Cart, Order } from 'shared/schema';
import { policy } from 'shared/trustedType';
import { checkNullish } from 'shared/typeChecker';

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
    policy();
    paymentSummary.innerHTML = paymentSummaryHTML;
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
