import { afterAll, beforeAll, describe, expect, test } from "vitest";
import { addToCart, updateDeliveryOption } from "../../data/cart.js";
import {
  fetchProducts,
  getMatchingProduct,
  Products,
} from "../../data/products.js";
import { formatCurrency } from "../../Scripts/Utils/Money.js";
import { renderPaymentSummary } from "../../Scripts/checkout/paymentSummary.js";
document.body.innerHTML = `
<div class="test-container">
  <div class="order-summary"></div>
  <div class="return-to-home-link"></div>
  <div class="payment-summary"></div>
</div>`;

describe("test suite: Render payment summary", () => {
  beforeAll(async () => {
    localStorage.clear();
    addToCart("15b6fc6f-327a-4ec4-896f-486349e85a3d", 1);
    addToCart("e43638ce-6aa0-4b85-b27f-e1d07eb678c6", 2);
    await fetchProducts();
    const cart = JSON.parse(localStorage.getItem("local_Storage_Cart")) || [];
    updateDeliveryOption("15b6fc6f-327a-4ec4-896f-486349e85a3d", "2", cart);
    renderPaymentSummary();
  });

  afterAll(() => {
    localStorage.clear();
  });

  test.concurrent("display cart quantity", ({ expect }) => {
    const cartQuantity = document.querySelector(".cart-item-quantity");
    expect(cartQuantity.innerHTML).toContain(3);
  });

  test.concurrent("display products cost", ({ expect }) => {
    const cart = JSON.parse(localStorage.getItem("local_Storage_Cart")) || [];
    let totalProductPrice = 0;
    cart.forEach((cartItem) => {
      const matchingProduct = getMatchingProduct(Products, cartItem.ProductId);
      totalProductPrice += matchingProduct.priceCents * cartItem.Quantity;
    });
    const totalProductsPriceHTML = document.querySelector(
      ".total-products-price"
    );
    expect(totalProductsPriceHTML.innerText).toBe(
      `$${formatCurrency(totalProductPrice)}`
    );
    localStorage.setItem("totalProductPrice", totalProductPrice);
  });

  test.concurrent("display delivery fee", ({ expect }) => {
    let totalDeliveryFee = 0;
    const cart = JSON.parse(localStorage.getItem("local_Storage_Cart")) || [];
    cart.forEach((cartItem) => {
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
    const totalDeliveryFeeHTML = document.querySelector(".total-delivery-fee");
    expect(totalDeliveryFeeHTML.innerText).toBe(
      `$${formatCurrency(totalDeliveryFee)}`
    );
    localStorage.setItem("totalDeliveryFee", totalDeliveryFee);
  });

  test.concurrent("display total price before tax", ({ expect }) => {
    const totalProductPrice = Number(localStorage.getItem("totalProductPrice"));
    const totalDeliveryFee = Number(localStorage.getItem("totalDeliveryFee"));
    const totalPriceBeforeTax = totalProductPrice + totalDeliveryFee;
    const totalPriceBeforeTaxHTML = document.querySelector(
      ".total-price-before-tax"
    );
    expect(totalPriceBeforeTaxHTML.innerText).toBe(
      `$${formatCurrency(totalPriceBeforeTax)}`
    );
    localStorage.setItem("totalPriceBeforeTax", totalPriceBeforeTax);
  });

  test.concurrent("display tax", ({ expect }) => {
    const totalPriceBeforeTax = Number(
      localStorage.getItem("totalPriceBeforeTax")
    );
    const estimatedTax = totalPriceBeforeTax * 0.1;
    const totalTaxHTML = document.querySelector(".total-tax");
    expect(totalTaxHTML.innerText).toBe(`$${formatCurrency(estimatedTax)}`);
    localStorage.setItem("estimatedTax", estimatedTax);
  });

  test.concurrent("display total cost", ({ expect }) => {
    const estimatedTax = Number(localStorage.getItem("estimatedTax"));
    const totalPriceBeforeTax = Number(
      localStorage.getItem("totalPriceBeforeTax")
    );
    const totalCost = estimatedTax + totalPriceBeforeTax;
    const totalCostHTML = document.querySelector(".total-cost");
    expect(totalCostHTML.innerText).toBe(`$${formatCurrency(totalCost)}`);
  });
});
