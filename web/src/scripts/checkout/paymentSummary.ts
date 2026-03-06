import { Order, fetchOrders } from '#root/shared/src/data/orders.ts';
import { getCart } from '#root/shared/src/data/cart.ts';
import { checkTruthy } from '../../../../shared/src/utils/typeChecker.ts';
import { calculatePrices } from '#root/shared/src/data/payment.ts';
import { getProducts } from '#root/shared/src/data/products.ts';
import { generatePaymentSummary } from '../htmlGenerators/paymentSummaryHTML.ts';
import { policy } from '../../../../shared/src/utils/trustedTypes.ts';

export async function renderPaymentSummary() {
  const checkoutCart = getCart();
  const products = await getProducts();
  const prices = calculatePrices(checkoutCart, products);

  const paymentSummary = document.querySelector('.payment-summary');
  const paymentSummaryHTML = generatePaymentSummary(prices);
  checkTruthy(paymentSummary, 'Fail to select HTML element');
  const trustedPaymentSummaryHTML =
    policy?.createHTML(paymentSummaryHTML) ?? paymentSummaryHTML;
  checkTruthy(trustedPaymentSummaryHTML);
  paymentSummary.innerHTML = trustedPaymentSummaryHTML as any;

  const placeOrderHTML = document.querySelector('.place-order-button');
  checkTruthy(placeOrderHTML, 'Fail to get the HTML element');
  placeOrderHTML.addEventListener('click', async () => {
    const order: Order = await fetchOrders(checkoutCart);
    checkTruthy(order);

    const savedOrders = localStorage.getItem('orders');
    const orders: Order[] = savedOrders ? JSON.parse(savedOrders) : [];
    orders.unshift(order);
    localStorage.setItem('orders', JSON.stringify(orders));
    location.href = '/orders.html';
  });
}
