import {
  removeFromCart,
  addToCart,
  getCart,
  updateDeliveryOption,
} from "../../data/cart.ts";
import {
  Products,
  getMatchingCart,
  fetchProducts,
  getMatchingProduct,
} from "../../data/products.ts";
import {
  deliveryOption,
  getDeliveryDate,
  addWeekDays,
  getPriceString,
} from "../../data/deliveryOption.ts";
import { renderPaymentSummary } from "./paymentSummary.ts";

export function renderOrderSummary() {
  const checkoutCart = getCart();
  let cartSummaryHTML = "";
  checkoutCart.forEach((cartItem) => {
    const matchingProduct = getMatchingProduct(Products, cartItem.productId);
    if (!matchingProduct) {
      console.error("Fail to get the product");
      return;
    }
    cartSummaryHTML += `
    <div class="cart-item-container cart-item-container-${matchingProduct.id}">
      <div class="delivery-date-${
        matchingProduct.id
      } delivery-date" data-product-id="${matchingProduct.id}">
        ${deliveryDateHTML(matchingProduct.id)}
      </div>

      <div class="cart-item-details-grid">
        <img class="product-image"
        src="${matchingProduct.image}">

        <div class="cart-item-details">
        <div class="product-name">
          ${matchingProduct.name}
        </div>
        <div class="product-price product-price-${matchingProduct.id} ">
          $${matchingProduct.getPrice()}
        </div>
        <div class="product-quantity">
          <span class="js-product-quantity-${matchingProduct.id}">
          Quantity: <span class="quantity-label">${cartItem.quantity}</span>
          </span>
          <span class="update-quantity-link link-primary" data-product-id="${
            matchingProduct.id
          }">
          Update
          </span>
          <input type="number" class="quantity_Input_${
            matchingProduct.id
          } quantity_Input" style="width: 40px;">
          <span class="save-quantity-link-${
            matchingProduct.id
          } link-primary save-quantity-link" 
          data-product-id="${matchingProduct.id}">Save</span>
          <span class="delete-quantity-link delete-quantity-link-${
            matchingProduct.id
          } link-primary" data-product-Id="${matchingProduct.id}">
          Delete
          </span>
        </div>
        </div>
        <div class="delivery-options">
        <div class="delivery-options-title">
          Choose a delivery option:
        </div>
        ${deliveryOptionsHTML(matchingProduct.id)}
        </div>
      </div>
    </div>
    `;
  });

  const orderSummary = document.querySelector(".order-summary");
  const returnHomeHTML = document.querySelector(".return-to-home-link");
  if (!orderSummary) {
    console.error("Fail to select HTML element");
    return;
  }
  orderSummary.innerHTML = cartSummaryHTML;
  let cartQuantity = 0;
  checkoutCart.forEach((cartItem) => {
    cartQuantity += cartItem.quantity;
  });
  function deliveryOptionsHTML(matchingProductId: string) {
    let html = "";
    deliveryOption.forEach((deliveryOptions) => {
      const deliveryDate = addWeekDays(deliveryOptions.deliveryDays).format(
        "dddd, MMMM D"
      );
      const priceString = getPriceString(deliveryOptions.priceCents);
      html += `<div>
            <input type="radio" class="delivery-option-input"
                name="delivery-option-${matchingProductId}"
                data-delivery-choice-id="${deliveryOptions.id}"
                data-product-id="${matchingProductId}"
                value='${deliveryDate}'
                id="${deliveryOptions.id}-${matchingProductId}">
                <div>
                <div class="delivery-option-date">
                    ${deliveryDate}
                </div>
            </div>
                <div class="delivery-option-price">
                    ${priceString}Shipping
                </div>
                </div>
                `;
    });
    return html;
  }
  if (!returnHomeHTML) {
    console.error("Fail to select HTML element");
    return;
  }
  returnHomeHTML.innerHTML = `${cartQuantity} items`;
  document
    .querySelectorAll<HTMLElement>(`.update-quantity-link`)
    .forEach((updateQuantityHTML) => {
      updateQuantityHTML.addEventListener("click", function () {
        const productId = updateQuantityHTML.dataset.productId;
        const quantityInputHTML = document.querySelector(
          `.quantity_Input_${productId}`
        );
        const saveQuantityHTML = document.querySelector(
          `.save-quantity-link-${productId}`
        );
        if (!quantityInputHTML || !saveQuantityHTML) {
          console.error("Fail to select HTML element");
          return;
        }
        quantityInputHTML.classList.add("Display_Update_Element");
        saveQuantityHTML.classList.add("Display_Update_Element");
      });
    });
  let quantityToAdd = 0;
  const quantityInputHTML = document.querySelectorAll(`.quantity_Input`);
  quantityInputHTML.forEach((quantityInput) => {
    quantityInput.addEventListener("change", (e) => {
      if (e.target instanceof HTMLInputElement) {
        quantityToAdd = Number(e.target.value);
      } else {
        console.error("Fail to get the event target");
        return;
      }
    });
  });
  const saveQuantityHTML =
    document.querySelectorAll<HTMLElement>(`.save-quantity-link`);
  saveQuantityHTML.forEach((saveQuantity) => {
    saveQuantity.addEventListener("click", function () {
      const productId = saveQuantity?.dataset?.productId;
      if (!productId) {
        console.error("Fail to get productId from HTML dataset");
        return;
      }
      addToCart(productId, quantityToAdd);
      renderOrderSummary();
      renderPaymentSummary();
    });
  });
  document
    .querySelectorAll<HTMLElement>(".delete-quantity-link")
    .forEach((deleteProductHTML) => {
      deleteProductHTML.addEventListener("click", () => {
        const productId = deleteProductHTML.dataset.productId;
        if (!productId) {
          console.error("Fail to get productId from HTML dataset");
          return;
        }
        removeFromCart(productId);
        renderOrderSummary();
        renderPaymentSummary();
      });
    });
  const deliveryOptionsInputHTML = document.querySelectorAll<HTMLElement>(
    ".delivery-option-input"
  );
  deliveryOptionsInputHTML.forEach((deliveryOptionInputHTML) => {
    deliveryOptionInputHTML.addEventListener("change", () => {
      const deliveryChoiceId = deliveryOptionInputHTML.dataset.deliveryChoiceId;
      const productId = deliveryOptionInputHTML.dataset.productId;
      if (!productId || !deliveryChoiceId) {
        console.error("Fail to get productId from HTML dataset");
        return;
      }
      updateDeliveryOption(productId, deliveryChoiceId);
      renderOrderSummary();
      renderPaymentSummary();
    });
  });
  checkoutCart.forEach((cartItem) => {
    const deliveryOptionButtonHTML = document.getElementById(
      `${cartItem.deliveryOptionId}-${cartItem.productId}`
    );
    if (deliveryOptionButtonHTML instanceof HTMLInputElement) {
      deliveryOptionButtonHTML.checked = true;
    } else {
      console.error("Fail to get the HTML element");
    }
  });

  function deliveryDateHTML(productId: string) {
    let cartItem = getMatchingCart(checkoutCart, productId);
    if (!cartItem) {
      console.error("Fail to get the cart");
      return;
    }
    const deliveryDate = getDeliveryDate(cartItem.deliveryOptionId);
    const html = `Delivery date: ${deliveryDate}`;
    return html;
  }
}

async function loadPage() {
  try {
    await fetchProducts();
    renderOrderSummary();
  } catch (error) {
    console.log(`unexpected network error: ${error}`);
  }
}
loadPage();
