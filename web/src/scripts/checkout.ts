import { renderOrderSummary } from './checkout/cartSummary.ts';
import { renderPaymentSummary } from './checkout/paymentSummary.ts';
import { cart } from '#root/shared/src/data/cart.ts';
import { effect } from '@preact/signals-core';

effect(
  () => {
    Promise.allSettled([
      renderOrderSummary(cart.value),
      renderPaymentSummary(cart.value),
    ]).catch((err) => console.error(err));
  },
  { name: 'render checkout page fully' },
);
