import { addToOrders } from "../../data/orders.ts";
import { getCart } from "../../data/cart.ts";
import { checkTruthy } from "../Utils/typeChecker.ts";
import { external } from "../../data/axios.ts";
import { calculatePrices } from "../../data/payment.ts";
import { getProducts } from "../../data/products.ts";
import { generatePaymentSummary } from "../htmlGenerators/paymentSummaryHTML.ts";

export async function renderPaymentSummary() {
  const checkoutCart = getCart();
  const products = await getProducts();
  const prices = calculatePrices(checkoutCart, products);

  const paymentSummary = document.querySelector(".payment-summary");
  const paymentSummaryHTML = generatePaymentSummary(prices);
  checkTruthy(paymentSummary, "Fail to select HTML element");
  paymentSummary.innerHTML = paymentSummaryHTML;

  const placeOrderHTML = document.querySelector(".place-order-button");
  checkTruthy(placeOrderHTML, "Fail to get the HTML element");
  placeOrderHTML.addEventListener("click", async () => {
    try {
      const order = (await external.post("/orders", checkoutCart)).data;
      addToOrders(order);
      localStorage.setItem("cart", JSON.stringify([]));
      location.href = "/orders.html";
    } catch (error) {
      console.error(`Unexpected network issue: ${error}`);
    }
  });
}
