import {
  removeFromCart,
  addToCart,
  getCart,
  updateDeliveryOption,
  displayCartQuantity,
} from "../../data/cart.ts";
import { getMatchingProduct, getProducts } from "../../data/products.ts";
import { renderPaymentSummary } from "./paymentSummary.ts";
import { checkTruthy } from "../Utils/typeChecker.ts";
import { generateCartSummary } from "../htmlGenerators/cartSummaryHTML.ts";

export async function renderOrderSummary() {
  const checkoutCart = getCart();
  const products = await getProducts();

  const orderSummary = document.querySelector(".order-summary");
  checkTruthy(orderSummary, "Fail to select HTML element");
  orderSummary.innerHTML = "";
  checkoutCart.forEach((cartItem) => {
    const matchingProduct = getMatchingProduct(products, cartItem.productId);
    checkTruthy(matchingProduct);
    const cartSummaryHTML = generateCartSummary(matchingProduct, cartItem);
    orderSummary.insertAdjacentHTML("beforeend", cartSummaryHTML);
  });

  displayCartQuantity("return-to-home-link", " items");

  function renderCart() {
    renderOrderSummary();
    renderPaymentSummary();
  }

  function handleUpdateQuantity(target: HTMLElement, productId: string) {
    const quantityInputHTML = target?.parentElement?.querySelector(
      `.quantity_Input_${productId}`,
    );
    const saveQuantityHTML = target?.parentElement?.querySelector(
      `.save-quantity-link-${productId}`,
    );
    checkTruthy(saveQuantityHTML, "Fail to select HTML element");
    checkTruthy(quantityInputHTML, "Fail to select HTML element");
    quantityInputHTML.classList.add("Display_Update_Element");
    saveQuantityHTML.classList.add("Display_Update_Element");
  }

  const cartItemContainers = document.querySelectorAll<HTMLElement>(
    ".cart-item-container",
  );
  cartItemContainers.forEach((cartItemContainer) => {
    const productId = cartItemContainer.dataset.productId;
    checkTruthy(productId, "Fail to get productId from dataset");
    let quantityToAdd = 0;

    cartItemContainer.addEventListener("click", (event) => {
      const target = <HTMLElement>event.target;
      checkTruthy(target);

      if (target.classList.contains("update-quantity-link")) {
        handleUpdateQuantity(target, productId);
      } else if (target.classList.contains("save-quantity-link")) {
        addToCart(productId, quantityToAdd);
        renderCart();
      } else if (target.classList.contains("delete-quantity-link")) {
        removeFromCart(productId);
        renderCart();
      }
    });
    cartItemContainer.addEventListener("change", (event) => {
      const target = <HTMLInputElement>event.target;
      checkTruthy(target, "Fail to get the event target");
      if (target.classList.contains("quantity_Input")) {
        quantityToAdd = Number(target.value);
      } else if (target.classList.contains("delivery-option-input")) {
        const deliveryChoiceId = target.dataset.deliveryChoiceId;
        checkTruthy(
          deliveryChoiceId,
          "Fail to get productId from HTML dataset",
        );
        updateDeliveryOption(productId, deliveryChoiceId);
        renderCart();
      }
    });
  });

  checkoutCart.forEach((cartItem) => {
    const deliveryOptionButtonHTML = document.getElementById(
      `${cartItem.deliveryOptionId}-${cartItem.productId}`,
    );
    if (!(deliveryOptionButtonHTML instanceof HTMLInputElement)) {
      console.error("Fail to get the HTML element");
      return;
    }
    deliveryOptionButtonHTML.checked = true;
  });
}
