import { renderOrderSummary } from "./checkout/cartSummary.ts";
import { renderPaymentSummary } from "./checkout/paymentSummary.ts";

async function loadPage() {
  try {
    renderOrderSummary();
    renderPaymentSummary();
  } catch (error) {
    console.error(`unexpected network error: ${error}`);
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
