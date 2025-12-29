import {
  Products,
  fetchProducts,
  getMatchingProduct,
} from "../../data/products.ts";
import { formatCurrency } from "../Utils/Money.ts";
import { addToOrders } from "../../data/orders.ts";
import { getCart } from "../../data/cart.ts";
export function renderPaymentSummary() {
  const CheckoutCart = getCart();
  let totalProductPrice = 0;
  let totalDeliveryFee = 0;
  let cartQuantity = 0;
  const paymentSummary = document.querySelector(".payment-summary");
  CheckoutCart.forEach((cartItem) => {
    const productItem = getMatchingProduct(Products, cartItem.ProductId);
    const totalPrice = productItem.priceCents * cartItem.Quantity;
    totalProductPrice += totalPrice;
    cartQuantity += cartItem.Quantity;
  });

  CheckoutCart.forEach((cartItem) => {
    let deliveryFee = 0;
    if (cartItem.deliveryOptionId === "1") {
      deliveryFee = 0;
    } else if (cartItem.deliveryOptionId === "2") {
      deliveryFee = 499;
    } else if (cartItem.deliveryOptionId === "3") {
      deliveryFee = 999;
    }
    totalDeliveryFee += deliveryFee;
  });

  const totalPriceBeforeTax = totalDeliveryFee + totalProductPrice;
  const totalTax = totalPriceBeforeTax / 10;
  const totalOrderPrice = totalPriceBeforeTax + totalTax;

  const paymentSummaryHTML = `
    <div class="payment-summary-title">
        Order Summary
        </div>
        <div class="payment-summary-row">
        <div class="cart-item-quantity">Items (${cartQuantity}):</div>
        <div class="payment-summary-money total-products-price">$${formatCurrency(
          totalProductPrice
        )}</div>
        </div>

        <div class="payment-summary-row">
        <div>Shipping &amp; handling:</div>
        <div class="payment-summary-money total-delivery-fee">$${formatCurrency(
          totalDeliveryFee
        )}</div>
        </div>

        <div class="payment-summary-row subtotal-row">
        <div>Total before tax:</div>
        <div class="payment-summary-money total-price-before-tax">$${formatCurrency(
          totalPriceBeforeTax
        )}</div>
        </div>

        <div class="payment-summary-row">
        <div>Estimated tax (10%):</div>
        <div class="payment-summary-money total-tax">$${formatCurrency(
          totalTax
        )}</div>
        </div>

        <div class="payment-summary-row total-row">
        <div>Order total:</div>
        <div class="payment-summary-money total-cost">$${formatCurrency(
          totalOrderPrice
        )}</div>
        </div>

        <button class="place-order-button button-primary">
        Place your order
        </button>
    `;
  paymentSummary.innerHTML = paymentSummaryHTML;

  const checkoutCart = CheckoutCart;
  checkoutCart.map((cartItem) => {
    cartItem.productId = cartItem.ProductId;
    cartItem.quantity = cartItem.Quantity;
    delete cartItem.Quantity;
    delete cartItem.ProductId;
    return cartItem;
  });
  const placeOrderHTML = document.querySelector(".place-order-button");
  placeOrderHTML.addEventListener("click", async () => {
    try {
      const response = await fetch("https://localhost:3001/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(checkoutCart),
      });
      const order = await response.json();
      addToOrders(order);
      localStorage.setItem("cart", JSON.stringify([]));
      location.href = "/orders.html";
    } catch (error) {
      console.log(`Unexpected network issue: ${error}`);
    }
  });
}

async function loadPage() {
  try {
    await fetchProducts();
    renderPaymentSummary();
  } catch (error) {
    console.log(`unexpected network error: ${error}`);
  }
}
loadPage();
