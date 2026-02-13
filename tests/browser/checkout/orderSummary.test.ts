import { test, describe, beforeEach } from "vitest";
import {
  getMatchingProduct,
  getProducts,
} from "../../../src/data/products.ts";
import {
  addToCart,
  updateDeliveryOption,
  getCart,
} from "../../../src/data/cart.ts";
import { getDeliveryDate } from "../../../src/data/deliveryOption.ts";
import { renderOrderSummary } from "../../../src/Scripts/checkout/cartSummary.ts";
import sleep from "../../../src/Scripts/Utils/sleep.ts";
import {
  checkTruthy,
  isDeliveryOptionId,
} from "../../../src/Scripts/Utils/typeChecker.ts";

document.body.innerHTML = `
<div class="test-container">
  <div class="order-summary"></div>
  <div class="return-to-home-link"></div>
  <div class="payment-summary"></div>
</div>`;

describe("test suite: Render order summary", () => {
  beforeEach(async () => {
    localStorage.clear();
    addToCart(false, "59LXo", 1);
    addToCart(false, "Hwme8", 2);

    await renderOrderSummary();
  });

  describe("display the cart", async () => {
    const cartItemContainers = document.querySelector(".order-summary");
    console.log(cartItemContainers);
    test.concurrent("number of cart items rendered", ({ expect }) => {
      expect(cartItemContainers?.childElementCount).toBe(2);
    });

    const checkoutCart = getCart();
    checkoutCart.forEach(async (cartItem, cartOrder) => {
      const { productId } = cartItem;

      test.concurrent("display cart quantity", ({ expect }) => {
        const quantityHTML = document.querySelector(
          `.js-product-quantity-${productId}`,
        );
        checkTruthy(quantityHTML, "Fail to select HTML element");
        expect(quantityHTML.textContent).toContain(
          `Quantity: ${cartItem.quantity}`,
        );
      });

      test.concurrent("delivery date", async ({ expect }) => {
        const deliveryOptionId = String(cartOrder + 1);
        isDeliveryOptionId(deliveryOptionId);
        updateDeliveryOption(productId, deliveryOptionId);
        await renderOrderSummary();
        const updatedCheckoutCart = getCart();
        const deliveryDate = getDeliveryDate(
          updatedCheckoutCart[cartOrder].deliveryOptionId,
        );
        const deliveryDateHTML = document.querySelector(
          `.delivery-date-${productId}`,
        );
        checkTruthy(deliveryDateHTML);
        expect(deliveryDateHTML.textContent).toContain(deliveryDate);
      });

      test.concurrent("products price", async ({ expect }) => {
        const products = await getProducts();
        const matchingProduct = getMatchingProduct(products, productId);
        const productPrice = document.querySelector(
          `.product-price-${productId}`,
        );
        checkTruthy(productPrice);
        checkTruthy(matchingProduct, "Fail to get the cart");
        expect(productPrice.textContent).toContain(
          `$${matchingProduct.price}`,
        );
      });
    });
    checkTruthy(cartItemContainers, "Fail to select HTML element");
    cartItemContainers.innerHTML = "";
  });

  test.concurrent("removes the product", async ({ expect }) => {
    let checkoutCart = getCart();

    const productId1 = checkoutCart[0].productId;
    const productId2 = checkoutCart[1].productId;
    const deleteQuantityHTML1 = document.querySelector<HTMLButtonElement>(
      `.delete-quantity-link-${productId1}`,
    );
    checkTruthy(deleteQuantityHTML1);
    deleteQuantityHTML1.click();
    await sleep(40);
    checkoutCart = getCart();
    expect(checkoutCart.length).toBe(1);
    expect(checkoutCart[0].productId).toBe(productId2);

    const cartItemContainer = document.querySelectorAll(
      ".cart-item-container",
    );
    expect(cartItemContainer.length).toBe(1);

    const cartItemContainer1 = document.querySelector(
      `.cart-item-container-${productId1}`,
    );
    const cartItemContainer2 = document.querySelector(
      `.cart-item-container-${productId2}`,
    );
    expect(cartItemContainer1).toBe(null);
    expect(cartItemContainer2).not.toBe(null);
    checkTruthy(cartItemContainer2);
    cartItemContainer2.innerHTML = "";
  });
});
