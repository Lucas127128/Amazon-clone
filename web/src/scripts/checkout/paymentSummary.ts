import { fetchOrders, getOrders } from '#root/shared/src/data/orders.ts';
import { checkNullish } from '#utils/typeChecker.ts';
import { calculatePrices } from '#root/shared/src/data/payment.ts';
import { fetchProducts } from '#root/shared/src/data/products.ts';
import { generatePaymentSummary } from '../htmlGenerators/paymentSummaryHTML.ts';
import { policy } from '#utils/trustedTypes.ts';
import type { Cart, Order } from '#root/shared/src/schema.ts';
import { STORAGE_KEYS } from '#root/config/constants.ts';

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
