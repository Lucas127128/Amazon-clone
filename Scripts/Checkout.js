import { fetchProducts } from "../data/products.ts";
import { renderOrderSummary } from "./checkout/orderSummary.js";
import { renderPaymentSummary } from "./checkout/paymentSummary.ts";

async function loadPage() {
  try {
    //throw "error";
    await fetchProducts();
    renderOrderSummary();
    renderPaymentSummary();
  } catch (error) {
    console.log(`unexpected network error: ${error}`);
  }
}
loadPage();
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
