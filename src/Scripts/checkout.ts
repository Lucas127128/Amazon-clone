import { renderOrderSummary } from './checkout/cartSummary.ts';
import { renderPaymentSummary } from './checkout/paymentSummary.ts';

export function loadPage() {
  Promise.try(() => {
    return Promise.all([renderOrderSummary(), renderPaymentSummary()]);
  }).catch((error) => {
    console.error(`unexpected network error: ${error}`);
  });
}
loadPage();
