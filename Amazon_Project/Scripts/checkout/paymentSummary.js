import { Cart } from "../../data/cart.js";
import { Products } from "../../data/products.js";
import { getMatchingProduct } from "../../data/products.js";
import { FormatCurrency } from "../Utils/Money.js";
export function renderPaymentSummary() {
  let CheckoutCart = JSON.parse(localStorage.getItem("local_Storage_Cart"));
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
  console.log(totalPriceBeforeTax);
  const totalTax = totalPriceBeforeTax / 10;
  console.log(totalTax);
  const totalOrderPrice = totalPriceBeforeTax + totalTax;
  console.log(totalOrderPrice);

  const paymentSummaryHTML = `
    <div class="payment-summary-title">
        Order Summary
        </div>
        <div class="payment-summary-row">
        <div>Items (${cartQuantity}):</div>
        <div class="payment-summary-money">$${FormatCurrency(
          totalProductPrice
        )}</div>
        </div>

        <div class="payment-summary-row">
        <div>Shipping &amp; handling:</div>
        <div class="payment-summary-money">$${FormatCurrency(
          totalDeliveryFee
        )}</div>
        </div>

        <div class="payment-summary-row subtotal-row">
        <div>Total before tax:</div>
        <div class="payment-summary-money">$${FormatCurrency(
          totalPriceBeforeTax
        )}</div>
        </div>

        <div class="payment-summary-row">
        <div>Estimated tax (10%):</div>
        <div class="payment-summary-money">$${FormatCurrency(totalTax)}</div>
        </div>

        <div class="payment-summary-row total-row">
        <div>Order total:</div>
        <div class="payment-summary-money">$${FormatCurrency(
          totalOrderPrice
        )}</div>
        </div>

        <button class="place-order-button button-primary">
        Place your order
        </button>
    `;
  paymentSummary.innerHTML = paymentSummaryHTML;
}
let checkProductReady = setInterval(() => {
  if (Products === null) {
    return;
  } else if (Products[0].id === "e43638ce-6aa0-4b85-b27f-e1d07eb678c6") {
    renderPaymentSummary();
    clearInterval(checkProductReady);
  }
}, 200);
