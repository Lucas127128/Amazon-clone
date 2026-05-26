import { fetchProducts } from '#data/products.ts';

import { cartStore } from '../data/cart.ts';
import { renderOrderSummary } from './checkout/cartSummary.ts';
import {
  handlePlaceOrder,
  renderPaymentSummary,
} from './checkout/paymentSummary.ts';

cartStore.subscribe(async (cartData) => {
  const cart = [...cartData];
  const products = fetchProducts(cart.map((item) => item.productId));
  await Promise.allSettled([
    renderOrderSummary({ cart: cart, products }),
    renderPaymentSummary({ cart: cart, products }),
  ]);
});

handlePlaceOrder();
