import { comptime } from 'comptime';
import { STORAGE_KEYS } from 'shared/constants';
import { calculatePrices } from 'shared/payment';
import type { Product } from 'shared/products';
import { type Cart, OrdersSchema } from 'shared/schema';
import { checkNullish } from 'shared/typeChecker';
import { parse } from 'valibot';

import { cartStore } from '#data/cart.ts';

import { fetchOrders } from '../../data/orders.ts';
import { sanitizer } from '../../utils/trustedTypes.ts';
import { generatePaymentSummary } from '../htmlGenerators/paymentSummaryHTML.ts';

export async function renderPaymentSummary(params: {
  cart: Cart[];
  products: Promise<readonly Product[]> | Product[];
}) {
  const products = await params.products;
  const { data: prices, error } = calculatePrices(params.cart, products);
  if (error) throw new Error(error.message);

  const paymentSummary = document.querySelector('.payment-summary-body');
  const paymentSummaryHTML = generatePaymentSummary(prices);
  checkNullish(paymentSummary, 'Fail to select HTML element');
  if (!window.trustedTypes) {
    paymentSummary.innerHTML = paymentSummaryHTML;
  } else {
    paymentSummary.innerHTML = sanitizer?.createHTML(
      paymentSummaryHTML,
    ) as unknown as string;
  }
}

export function handlePlaceOrder() {
  document
    .querySelector('.place-order-button')
    ?.addEventListener('click', async () => {
      const response = await fetchOrders(cartStore.get());
      const savedOrders = localStorage.getItem(
        comptime(() => STORAGE_KEYS.ORDER),
      );
      const orders = parse(OrdersSchema, JSON.parse(savedOrders ?? '[]'));
      const { data: order, error } = response;
      if (error) throw error;
      orders.unshift(order);
      localStorage.setItem(
        comptime(() => STORAGE_KEYS.ORDER),
        JSON.stringify(orders),
      );
      localStorage.removeItem(comptime(() => STORAGE_KEYS.CART_STATE));
      location.href = '/orders.html';
    });
}
