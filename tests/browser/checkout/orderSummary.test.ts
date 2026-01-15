import { expect, test, describe, beforeEach } from "vitest";
import {
  fetchProducts,
  Products,
  getMatchingProduct,
} from "../../../src/data/products.ts";
import {
  addToCart,
  updateDeliveryOption,
  getCart,
} from "../../../src/data/cart.ts";
import { getDeliveryDate } from "../../../src/data/deliveryOption.ts";
import { renderOrderSummary } from "../../../src/Scripts/checkout/orderSummary.ts";
document.body.innerHTML = `
<div class="test-container">
  <div class="order-summary"></div>
  <div class="return-to-home-link"></div>
  <div class="payment-summary"></div>
</div>`;

describe("test suite: Render order summary", () => {
  beforeEach(async () => {
    localStorage.clear();
    addToCart("15b6fc6f-327a-4ec4-896f-486349e85a3d", 1);
    addToCart("e43638ce-6aa0-4b85-b27f-e1d07eb678c6", 2);
    await fetchProducts();
    renderOrderSummary();
  });

  test("display the cart", () => {
    //test number of cart items rendered
    const cartItemContainers = document.querySelectorAll(
      ".cart-item-container"
    );
    expect(cartItemContainers.length).toBe(2);

    const checkoutCart = getCart();
    checkoutCart.forEach((cartItem, cartOrder) => {
      //cart quantity test
      const productId = cartItem.productId;
      const quantityHTML = document.querySelector(
        `.js-product-quantity-${productId}`
      );
      if (!quantityHTML) {
        console.error("Fail to select HTML element");
        return;
      }
      expect(quantityHTML.textContent).toContain(
        `Quantity: ${cartItem.quantity}`
      );

      //delivery date test
      updateDeliveryOption(productId, String(cartOrder + 1));
      renderOrderSummary();
      const updatedCheckoutCart = getCart();
      const deliveryDate = getDeliveryDate(
        updatedCheckoutCart[cartOrder].deliveryOptionId
      );
      const deliveryDateHTML = document.querySelector(
        `.delivery-date-${productId}`
      );
      if (!deliveryDateHTML) {
        return;
      }
      expect(deliveryDateHTML.innerHTML).toContain(deliveryDate);

      //products price test
      const matchingProduct = getMatchingProduct(Products, productId);
      const productPrice = document.querySelector(
        `.product-price-${productId}`
      );
      if (!productPrice) {
        console.error("Fail to select HTML element");
        return;
      }
      if (!matchingProduct) {
        console.error("Fail to get the cart");
        return;
      }
      expect(productPrice.textContent).toContain(
        `$${matchingProduct.getPrice()}`
      );
    });
    if (!cartItemContainers) {
      console.error("Fail to select HTML element");
      return;
    }
    cartItemContainers.forEach((cartItemHTML) => {
      cartItemHTML.innerHTML = "";
    });
  });

  test("removes the product", () => {
    let checkoutCart = getCart();

    const productId1 = checkoutCart[0].productId;
    const productId2 = checkoutCart[1].productId;
    const deleteQuantityHTML1 = document.querySelector<HTMLButtonElement>(
      `.delete-quantity-link-${productId1}`
    );
    if (!deleteQuantityHTML1) {
      console.error("Fail to select HTML element");
      return;
    }
    deleteQuantityHTML1.click();
    checkoutCart = getCart();
    expect(checkoutCart.length).toBe(1);
    expect(checkoutCart[0].productId).toBe(productId2);

    const cartItemContainer = document.querySelectorAll(".cart-item-container");
    expect(cartItemContainer.length).toBe(1);

    const cartItemContainer1 = document.querySelector(
      `.cart-item-container-${productId1}`
    );
    const cartItemContainer2 = document.querySelector(
      `.cart-item-container-${productId2}`
    );
    expect(cartItemContainer1).toBe(null);
    expect(cartItemContainer2).not.toBe(null);
    if (!cartItemContainer2) {
      console.error("Fail to select HTML element");
      return;
    }
    cartItemContainer2.innerHTML = "";
    const testContainerHTML = document.querySelector(".test-container");
    if (!testContainerHTML) {
      console.error("Fail to select HTML element");
      return;
    }
    testContainerHTML.innerHTML = "";
  });
});
