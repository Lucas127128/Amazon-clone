import { fetchProducts } from '#data/products.ts';

import { cartStore } from '../data/cart.ts';
import { renderOrderSummary } from './checkout/cartSummary.ts';
import { renderPaymentSummary } from './checkout/paymentSummary.ts';

cartStore.subscribe(async (cartData) => {
  const products = fetchProducts();
  const cart = [...cartData];
  await Promise.allSettled([
    renderOrderSummary({ cart: cart, products }),
    renderPaymentSummary({ cart: cart, products }),
  ]);
});
