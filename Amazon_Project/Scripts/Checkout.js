import { getProducts } from "../data/products.js";
import { renderOrderSummary } from "./checkout/orderSummary.js";
import { renderPaymentSummary } from "./checkout/paymentSummary.js";

new Promise((resolve) => {
  getProducts(() => {
    resolve("value1");
  });
}).then((value) => {
  return new Promise((resolve) => {
    console.log(value)
    renderOrderSummary();
    renderPaymentSummary();
    resolve();
  });
});

// Promise.all([
//   new Promise((resolve) => {
//     getProducts(() => {
//       resolve();
//     });
//   }), new Promise((resolve) => {
//     renderOrderSummary();
//     renderPaymentSummary();
//     resolve();
//   })
// ])
console.log("")