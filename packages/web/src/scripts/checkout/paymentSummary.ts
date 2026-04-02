import { fetchOrders, getOrders } from 'shared/orders';
import { checkNullish } from 'shared/typeChecker';
import { calculatePrices } from 'shared/payment';
import { fetchProducts } from 'shared/products';
import { generatePaymentSummary } from '../htmlGenerators/paymentSummaryHTML.ts';
import { policy } from 'shared/trustedType';
import type { Cart, Order } from 'shared/schema';
import { STORAGE_KEYS } from 'shared/constants';

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
    const trustedPaymentSummaryHTML =
      policy?.createHTML(paymentSummaryHTML);
    checkNullish(trustedPaymentSummaryHTML);

    paymentSummary.innerHTML =
      trustedPaymentSummaryHTML as unknown as string;
  }

  const placeOrderHTML = document.querySelector('.place-order-button');
  checkNullish(placeOrderHTML, 'Fail to get the HTML element');

  const order = await fetchOrders(cart);
  placeOrderHTML.addEventListener(
    'click',
    () => {
      checkNullish(order);

      const orders: Order[] = getOrders();
      orders.unshift(order);
      localStorage.setItem(STORAGE_KEYS.ORDER, JSON.stringify(orders));
      localStorage.removeItem(STORAGE_KEYS.CART_STATE);
      location.href = '/orders.html';
    },
    { signal },
  );
}
