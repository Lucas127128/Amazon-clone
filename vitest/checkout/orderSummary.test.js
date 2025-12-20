import { Window } from "happy-dom";
import { expect, test, describe, beforeEach,vi } from "vitest";
const window = new Window();
const document = window.document;
async function initialOrderSummaryHTML() {
  const initialOrderSummaryHTML = `
  <div class='test-container'>
  <div class='order-summary'></div>
  <div class='return-to-home-link'></div>
  <div class='payment-summary'></div>
  </div>`;
  document.body.innerHTML = initialOrderSummaryHTML;
}
await initialOrderSummaryHTML();
import { renderOrderSummary } from "../../Scripts/checkout/orderSummary.js";
import { fetchProducts } from "../../data/products.js";
import { addToCart } from "../../data/cart.js";

import "bun-storage/auto";
import { localStorage } from "happy-dom/lib/PropertySymbol.js";
function runTestSuite() {
  describe("test suite: render order summary", () => {
    beforeEach(() => {
      initialOrderSummaryHTML();
      addToCart("15b6fc6f-327a-4ec4-896f-486349e85a3d", 1);
      addToCart("e43638ce-6aa0-4b85-b27f-e1d07eb678c6", 2);
    });

    test("display the cart", () => {
      const checkoutCart =
        JSON.parse(localStorage.getItem("local_Storage_Cart")) || [];
      const productId1 = checkoutCart[0].ProductId;
      const productId2 = checkoutCart[1].ProductId;
      const quantityHTML1 = document.querySelector(
        `.js-product-quantity-${productId1}`
      );
      const quantityHTML2 = document.querySelector(
        `.js-product-quantity-${productId2}`
      );
      const cartItemContainer = document.querySelectorAll(
        ".cart-item-container"
      );

      expect(cartItemContainer.length).toBe(2);
      expect(quantityHTML1.innerText).toContain("Quantity: 1");
      expect(quantityHTML2.innerText).toContain("Quantity: 2");
      cartItemContainer.innerHTML = "";
    });

    test("removes the product", () => {
      let checkoutCart =
        JSON.parse(localStorage.getItem("local_Storage_Cart")) || [];
      const productId1 = checkoutCart[0].ProductId;
      const productId2 = checkoutCart[1].ProductId;

      const cartItemContainer1 = document.querySelector(
        `.cart-item-container-${productId1}`
      );
      const cartItemContainer2 = document.querySelector(
        `.cart-item-container-${productId2}`
      );

      const deleteQuantityHTML1 = document.querySelector(
        `.delete-quantity-link-${productId1}`
      );
      deleteQuantityHTML1.click();

      checkoutCart =
        JSON.parse(localStorage.getItem("local_Storage_Cart")) || [];
      const cartItemContainer = document.querySelectorAll(
        ".cart-item-container"
      );
      expect(cartItemContainer.length).toBe(1);
      expect(cartItemContainer1).toBe(null);
      expect(cartItemContainer2).not.toBe(null);
      expect(checkoutCart.length).toBe(1);
      expect(checkoutCart[0].ProductId).toBe(productId2);
      cartItemContainer.innerHTML = "";
      document.querySelector(".test-container").innerHTML = "";
    });
  });
}

async function loadPage() {
  try {
    await fetchProducts();
    renderOrderSummary();
    runTestSuite();
  } catch (error) {
    console.log(`unexpected network error: ${error}`);
  }
}
loadPage();
