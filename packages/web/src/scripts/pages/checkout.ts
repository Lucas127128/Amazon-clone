import type { Cart } from 'shared/schema';

import { fetchProducts } from '#data/products.ts';

import { cartStore } from '../data/cart.ts';
import { subscribe } from '../utils/store.ts';
import { renderOrderSummary } from './checkout/cartSummary.ts';
import { renderPaymentSummary } from './checkout/paymentSummary.ts';

subscribe(cartStore, async (cart: Cart[]) => {
  const products = fetchProducts();
  await Promise.allSettled([
    renderOrderSummary({ cart: cart, products }),
    renderPaymentSummary({ cart: cart, products }),
  ]);
});
