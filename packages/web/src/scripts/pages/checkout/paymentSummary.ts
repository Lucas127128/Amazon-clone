import { comptime } from 'comptime';
import { STORAGE_KEYS } from 'shared/constants';
import { calculatePrices } from 'shared/payment';
import type { Product } from 'shared/products';
import { type Cart, OrdersSchema } from 'shared/schema';
import { checkNullish } from 'shared/typeChecker';
import { parse } from 'valibot';

import { fetchOrders } from '../../data/orders.ts';
import { sanitizer } from '../../utils/trustedTypes.ts';
import { generatePaymentSummary } from '../htmlGenerators/paymentSummaryHTML.ts';

let controller = new AbortController();
export async function renderPaymentSummary(params: {
  cart: Cart[];
  products: Promise<readonly Product[]> | Product[];
}) {
  controller.abort();
  controller = new AbortController();
  const { signal } = controller;

  const products = await params.products;
  const { data: prices, error } = calculatePrices(params.cart, products);
  if (error) throw new Error(error.message);

  const paymentSummary = document.querySelector('.payment-summary');
  const paymentSummaryHTML = generatePaymentSummary(prices);
  checkNullish(paymentSummary, 'Fail to select HTML element');
  if (!window.trustedTypes) {
    paymentSummary.innerHTML = paymentSummaryHTML;
  } else {
    paymentSummary.innerHTML = sanitizer?.createHTML(
      paymentSummaryHTML,
    ) as unknown as string;
  }

  const placeOrderHTML = document.querySelector('.place-order-button');
  checkNullish(placeOrderHTML, 'Fail to get the HTML element');

  placeOrderHTML.addEventListener(
    'click',
    () => {
      fetchOrders(params.cart)
        .then((response) => {
          const savedOrders = localStorage.getItem(
            comptime(() => STORAGE_KEYS.ORDER),
          );
          const orders = parse(
            OrdersSchema,
            JSON.parse(savedOrders ?? '[]'),
          );
          const { data: order, error } = response;
          if (error) throw error;
          orders.unshift(order);
          localStorage.setItem(
            comptime(() => STORAGE_KEYS.ORDER),
            JSON.stringify(orders),
          );
          localStorage.removeItem(comptime(() => STORAGE_KEYS.CART_STATE));
          location.href = '/orders.html';
        })
        .catch((err: unknown) => console.error(err));
    },
    { signal },
  );
}
