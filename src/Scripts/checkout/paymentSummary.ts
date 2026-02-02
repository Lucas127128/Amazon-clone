import { formatCurrency } from "../Utils/Money.ts";
import { addToOrders } from "../../data/orders.ts";
import { getCart } from "../../data/cart.ts";
import { checkTruthy } from "../Utils/typeChecker.ts";
import { external } from "../../data/axios.ts";
import { calculatePrices } from "../../data/payment.ts";
import { fetchProducts } from "../../data/products.ts";

export async function renderPaymentSummary() {
  const checkoutCart = getCart();
  const products = await fetchProducts();
  const prices = calculatePrices(checkoutCart, products);

  const paymentSummary = document.querySelector(".payment-summary");
  const html = String.raw;
  const paymentSummaryHTML = html`
    <div class="payment-summary-title">Order Summary</div>
    <div class="payment-summary-row">
      <div class="cart-item-quantity">Items (${prices.cartQuantity}):</div>
      <div class="payment-summary-money total-products-price">
        $${formatCurrency(prices.totalProductPrice)}
      </div>
    </div>

    <div class="payment-summary-row">
      <div>Shipping &amp; handling:</div>
      <div class="payment-summary-money total-delivery-fee">
        $${formatCurrency(prices.totalDeliveryFee)}
      </div>
    </div>

    <div class="payment-summary-row subtotal-row">
      <div>Total before tax:</div>
      <div class="payment-summary-money total-price-before-tax">
        $${formatCurrency(prices.totalPriceBeforeTax)}
      </div>
    </div>

    <div class="payment-summary-row">
      <div>Estimated tax (10%):</div>
      <div class="payment-summary-money total-tax">
        $${formatCurrency(prices.totalTax)}
      </div>
    </div>

    <div class="payment-summary-row total-row">
      <div>Order total:</div>
      <div class="payment-summary-money total-cost">
        $${formatCurrency(prices.totalOrderPrice)}
      </div>
    </div>

    <button class="place-order-button button-primary">Place your order</button>
  `;
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
