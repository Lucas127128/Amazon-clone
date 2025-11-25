import { Products } from "../data/products.js";
import { renderOrderSummary } from "./checkout/orderSummary.js";
import { renderPaymentSummary } from "./checkout/paymentSummary.js";
//import "../data/cart-class.js";
//import "../data/backend-practice.js"
let checkProductReady = setInterval(() => {
  if (Products === null) {
    return;
  } else if (Products[0].id === "e43638ce-6aa0-4b85-b27f-e1d07eb678c6") {
    renderOrderSummary();
    renderPaymentSummary
    clearInterval(checkProductReady);
  }
}, 200);
