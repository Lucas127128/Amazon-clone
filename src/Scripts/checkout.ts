import { renderOrderSummary } from './checkout/cartSummary.ts';
import { renderPaymentSummary } from './checkout/paymentSummary.ts';

await Promise.all([renderOrderSummary(), renderPaymentSummary()]);
