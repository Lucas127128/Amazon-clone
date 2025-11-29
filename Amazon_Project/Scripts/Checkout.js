import { checkProductReady } from "../data/products.js";
import { renderOrderSummary } from "./checkout/orderSummary.js";
import { renderPaymentSummary } from "./checkout/paymentSummary.js";
checkProductReady(renderOrderSummary)
checkProductReady(renderPaymentSummary)