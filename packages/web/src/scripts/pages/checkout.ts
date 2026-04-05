import { effect } from '@preact/signals-core';
import { cart } from 'shared/cart';
import { fetchProducts } from 'shared/products';

import { renderOrderSummary } from './checkout/cartSummary.ts';
import { renderPaymentSummary } from './checkout/paymentSummary.ts';

effect(
  () => {
    const products = fetchProducts();
    Promise.allSettled([
      renderOrderSummary({ cart: cart.value, products }),
      renderPaymentSummary({ cart: cart.value, products }),
    ]).catch((err: unknown) => console.error(err));
  },
  { name: 'render checkout page fully' },
);
