import { effect } from 'alien-signals';

import { fetchProducts } from '#data/products.ts';

import { cartStore } from '../data/cart.ts';
import { renderOrderSummary } from './checkout/cartSummary.ts';
import {
  handlePlaceOrder,
  renderPaymentSummary,
} from './checkout/paymentSummary.ts';

effect(() => {
  fetchProducts(cartStore().map((item) => item.productId))
    .then(({ data: products, error }) => {
      if (error) throw error;
      return products;
    })
    .then(
      async (products) =>
        await Promise.allSettled([
          renderOrderSummary({ cart: cartStore(), products }),
          renderPaymentSummary({ cart: cartStore(), products }),
        ]),
    )
    .catch((err) => console.error(err));
});

handlePlaceOrder();
