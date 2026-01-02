import { expect, test, describe, beforeEach } from "vitest";
import {
  fetchProducts,
  Products,
  getMatchingProduct,
} from "../../data/products.ts";
import { addToCart, updateDeliveryOption, getCart } from "../../data/cart.ts";
import { getDeliveryDate } from "../../data/deliveryOption.ts";
import { renderOrderSummary } from "../../Scripts/checkout/orderSummary.ts";
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
      const productId = cartItem.ProductId;
      const quantityHTML = document.querySelector(
        `.js-product-quantity-${productId}`
      );
      expect(quantityHTML.textContent).toContain(
        `Quantity: ${cartItem.Quantity}`
      );

      //delivery date test
      updateDeliveryOption(productId, String(cartOrder + 1), checkoutCart);
      renderOrderSummary();
      const updatedCheckoutCart = getCart();
      const deliveryDate = getDeliveryDate(
        updatedCheckoutCart[cartOrder].deliveryOptionId
      );
      const deliveryDateHTML = document.querySelector(
        `.delivery-date-${productId}`
      );
      expect(deliveryDateHTML.innerHTML).toContain(deliveryDate);

      //products price test
      const product = getMatchingProduct(Products, productId);
      const productPrice = document.querySelector(
        `.product-price-${productId}`
      );
      expect(productPrice.textContent).toContain(`$${product.getPrice()}`);
    });
    cartItemContainers.innerHTML = [];
  });

  test("removes the product", () => {
    let checkoutCart = getCart();

    const productId1 = checkoutCart[0].ProductId;
    const productId2 = checkoutCart[1].ProductId;
    const deleteQuantityHTML1 = document.querySelector(
      `.delete-quantity-link-${productId1}`
    );
    deleteQuantityHTML1.click();
    checkoutCart = getCart();
    expect(checkoutCart.length).toBe(1);
    expect(checkoutCart[0].ProductId).toBe(productId2);

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

    cartItemContainer2.innerHTML = [];
    document.querySelector(".test-container").innerHTML = "";
  });
});
