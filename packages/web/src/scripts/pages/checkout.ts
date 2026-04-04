import { effect } from '@preact/signals-core';
import { cart } from 'shared/cart';

import { renderOrderSummary } from './checkout/cartSummary.ts';
import { renderPaymentSummary } from './checkout/paymentSummary.ts';

effect(
  () => {
    Promise.allSettled([
      renderOrderSummary(cart.value),
      renderPaymentSummary(cart.value),
    ]).catch((err: unknown) => console.error(err));
  },
  { name: 'render checkout page fully' },
);
