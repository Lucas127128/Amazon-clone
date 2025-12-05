import { Products, fetchProducts } from "../../data/products.js";
import { getMatchingProduct } from "../../data/products.js";
import { formatCurrency } from "../Utils/Money.js";
export function renderPaymentSummary() {
  const CheckoutCart = JSON.parse(localStorage.getItem("local_Storage_Cart"));
  let totalProductPrice = 0;
  let totalDeliveryFee = 0;
  let cartQuantity = 0;
  const paymentSummary = document.querySelector(".payment-summary");
  CheckoutCart.forEach((cartItem) => {
    const productItem = getMatchingProduct(Products, cartItem.ProductId);
    let totalPrice = productItem.priceCents * cartItem.Quantity;
    totalProductPrice += totalPrice;
    cartQuantity += cartItem.Quantity;
  });

  CheckoutCart.forEach((cartItem) => {
    let delivery_Fee = 0;
    if (cartItem.deliveryOptionId === "1") {
      delivery_Fee = 0;
    } else if (cartItem.deliveryOptionId === "2") {
      delivery_Fee = 499;
    } else if (cartItem.deliveryOptionId === "3") {
      delivery_Fee = 999;
    }
    totalDeliveryFee += delivery_Fee;
  });

  const totalPriceBeforeTax = totalDeliveryFee + totalProductPrice;
  const totalTax = totalPriceBeforeTax / 10;
  const totalOrderPrice = totalPriceBeforeTax + totalTax;

  const paymentSummaryHTML = `
    <div class="payment-summary-title">
        Order Summary
        </div>
        <div class="payment-summary-row">
        <div>Items (${cartQuantity}):</div>
        <div class="payment-summary-money">$${formatCurrency(
          totalProductPrice
        )}</div>
        </div>

        <div class="payment-summary-row">
        <div>Shipping &amp; handling:</div>
        <div class="payment-summary-money">$${formatCurrency(
          totalDeliveryFee
        )}</div>
        </div>

        <div class="payment-summary-row subtotal-row">
        <div>Total before tax:</div>
        <div class="payment-summary-money">$${formatCurrency(
          totalPriceBeforeTax
        )}</div>
        </div>

        <div class="payment-summary-row">
        <div>Estimated tax (10%):</div>
        <div class="payment-summary-money">$${formatCurrency(totalTax)}</div>
        </div>

        <div class="payment-summary-row total-row">
        <div>Order total:</div>
        <div class="payment-summary-money">$${formatCurrency(
          totalOrderPrice
        )}</div>
        </div>

        <button class="place-order-button button-primary">
        Place your order
        </button>
    `;
  paymentSummary.innerHTML = paymentSummaryHTML;
}

async function loadPage() {
  await fetchProducts();
  renderPaymentSummary();
}
loadPage();
