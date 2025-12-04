import { getProducts, fetchProducts } from "../data/products.js";
import { renderOrderSummary } from "./checkout/orderSummary.js";
import { renderPaymentSummary } from "./checkout/paymentSummary.js";

fetchProducts().then(()=>{
  renderOrderSummary();
  renderPaymentSummary();
})
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