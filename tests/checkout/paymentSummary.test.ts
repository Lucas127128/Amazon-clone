import { afterAll, beforeAll, describe, expect, test } from "vitest";
import {
  addToCart,
  updateDeliveryOption,
  getCart,
} from "../../src/data/cart.ts";
import {
  fetchProducts,
  getMatchingProduct,
  Products,
} from "../../src/data/products.ts";
import { formatCurrency } from "../../src/Scripts/Utils/Money.ts";
import { renderPaymentSummary } from "../../src/Scripts/checkout/paymentSummary.ts";
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
    updateDeliveryOption("15b6fc6f-327a-4ec4-896f-486349e85a3d", "2");
    renderPaymentSummary();
  });

  afterAll(() => {
    localStorage.clear();
  });

  test.concurrent("display cart quantity", ({ expect }) => {
    const cartQuantity = document.querySelector(".cart-item-quantity");
    if (!cartQuantity) {
      console.error("Fail to select HTML element");
      return;
    }
    expect(cartQuantity.innerHTML).toContain(3);
  });

  test.concurrent("display products cost", ({ expect }) => {
    const cart = getCart();
    let totalProductPrice = 0;
    cart.forEach((cartItem) => {
      const matchingProduct = getMatchingProduct(Products, cartItem.productId);
      if (!matchingProduct) {
        console.error("Fail to get the cart");
        return;
      }
      totalProductPrice += matchingProduct.priceCents * cartItem.quantity;
    });
    const totalProductsPriceHTML = document.querySelector(
      ".total-products-price"
    );
    if (!totalProductsPriceHTML) {
      console.error("Fail to select HTML element");
      return;
    }
    expect(totalProductsPriceHTML.textContent).toBe(
      `$${formatCurrency(totalProductPrice)}`
    );

    localStorage.setItem("totalProductPrice", String(totalProductPrice));
  });

  test.concurrent("display delivery fee", ({ expect }) => {
    let totalDeliveryFee = 0;
    const cart = getCart();
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
    if (!totalDeliveryFeeHTML) {
      console.error("Fail to select HTML element");
      return;
    }
    expect(totalDeliveryFeeHTML.textContent).toBe(
      `$${formatCurrency(totalDeliveryFee)}`
    );
    localStorage.setItem("totalDeliveryFee", String(totalDeliveryFee));
  });

  test.concurrent("display total price before tax", ({ expect }) => {
    const totalProductPrice = Number(localStorage.getItem("totalProductPrice"));
    const totalDeliveryFee = Number(localStorage.getItem("totalDeliveryFee"));
    const totalPriceBeforeTax = totalProductPrice + totalDeliveryFee;
    const totalPriceBeforeTaxHTML = document.querySelector(
      ".total-price-before-tax"
    );
    if (!totalPriceBeforeTaxHTML) {
      console.error("Fail to select HTML element");
      return;
    }
    expect(totalPriceBeforeTaxHTML.textContent).toBe(
      `$${formatCurrency(totalPriceBeforeTax)}`
    );
    localStorage.setItem("totalPriceBeforeTax", String(totalPriceBeforeTax));
  });

  test.concurrent("display tax", ({ expect }) => {
    const totalPriceBeforeTax = Number(
      localStorage.getItem("totalPriceBeforeTax")
    );
    const estimatedTax = totalPriceBeforeTax * 0.1;
    const totalTaxHTML = document.querySelector(".total-tax");
    if (!totalTaxHTML) {
      console.error("Fail to select HTML element");
      return;
    }
    expect(totalTaxHTML.textContent).toBe(`$${formatCurrency(estimatedTax)}`);
    localStorage.setItem("estimatedTax", String(estimatedTax));
  });

  test.concurrent("display total cost", ({ expect }) => {
    const estimatedTax = Number(localStorage.getItem("estimatedTax"));
    const totalPriceBeforeTax = Number(
      localStorage.getItem("totalPriceBeforeTax")
    );
    const totalCost = estimatedTax + totalPriceBeforeTax;
    const totalCostHTML = document.querySelector(".total-cost");
    if (!totalCostHTML) {
      console.error("Fail to select HTML element");
      return;
    }
    expect(totalCostHTML.textContent).toBe(`$${formatCurrency(totalCost)}`);
  });
});
