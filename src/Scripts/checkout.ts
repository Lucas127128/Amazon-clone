import { fetchProducts } from "../data/products.ts";
import { renderOrderSummary } from "./checkout/orderSummary.ts";
import { renderPaymentSummary } from "./checkout/paymentSummary.ts";

async function loadPage() {
  try {
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
