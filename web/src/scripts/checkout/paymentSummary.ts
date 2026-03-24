import { fetchOrders, getOrders } from '#root/shared/src/data/orders.ts';
// import { cart } from '#root/shared/src/data/cart.ts';
import { checkNullish } from '../../../../shared/src/utils/typeChecker.ts';
import { calculatePrices } from '#root/shared/src/data/payment.ts';
import { fetchProducts } from '#root/shared/src/data/products.ts';
import { generatePaymentSummary } from '../htmlGenerators/paymentSummaryHTML.ts';
import { policy } from '../../../../shared/src/utils/trustedTypes.ts';
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
  const trustedPaymentSummaryHTML =
    policy?.createHTML(paymentSummaryHTML) ?? paymentSummaryHTML;
  checkNullish(trustedPaymentSummaryHTML);
  paymentSummary.innerHTML = trustedPaymentSummaryHTML as any;

  const placeOrderHTML = document.querySelector('.place-order-button');
  checkNullish(placeOrderHTML, 'Fail to get the HTML element');
  placeOrderHTML.addEventListener(
    'click',
    async () => {
      const order = await fetchOrders(cart);
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
