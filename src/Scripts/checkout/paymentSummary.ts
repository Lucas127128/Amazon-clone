import { addToOrders, Order } from '../../data/orders.ts';
import { getCart } from '../../data/cart.ts';
import { checkTruthy } from '../Utils/typeChecker.ts';
import { kyExternal } from '../../data/ky.ts';
import { calculatePrices } from '../../data/payment.ts';
import { getProducts } from '../../data/products.ts';
import { generatePaymentSummary } from '../htmlGenerators/paymentSummaryHTML.ts';

export async function renderPaymentSummary() {
  const checkoutCart = getCart();
  const products = await getProducts();
  const prices = calculatePrices(checkoutCart, products);

  const paymentSummary = document.querySelector('.payment-summary');
  const paymentSummaryHTML = generatePaymentSummary(prices);
  checkTruthy(paymentSummary, 'Fail to select HTML element');
  paymentSummary.innerHTML = paymentSummaryHTML;

  const placeOrderHTML = document.querySelector('.place-order-button');
  checkTruthy(placeOrderHTML, 'Fail to get the HTML element');
  placeOrderHTML.addEventListener('click', async () => {
    Promise.try(async () => {
      const order: Order = await kyExternal
        .post('orders', { json: checkoutCart })
        .json();
      checkTruthy(order);
      addToOrders(order);
      location.href = '/orders.html';
    }).catch((error) => {
      console.error(`Unexpected promise error: ${error}`);
    });
  });
}
