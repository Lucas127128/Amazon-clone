import { removeFromCart, addToCart, getCart } from "../../data/cart.js";
import {
  Products,
  getMatchingCart,
  fetchProducts,
} from "../../data/products.js";
import {
  deliveryOption,
  getDeliveryDate,
  addWeekDays,
  getPriceString,
} from "../../data/deliveryOption.js";
import { updateDeliveryOption } from "../../data/cart.js";
import { getMatchingProduct } from "../../data/products.js";
import { renderPaymentSummary } from "./paymentSummary.js";

export function renderOrderSummary() {
  let CheckoutCart = "";
  CheckoutCart = getCart(CheckoutCart);
  const checkoutCart = CheckoutCart;

  let cartSummaryHTML = "";
  checkoutCart.forEach((cartItem, cartOrder)=> {
    const matchingProduct = getMatchingProduct(Products, cartItem.ProductId);
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
          Quantity: <span class="quantity-label">${cartItem.Quantity}</span>
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
  orderSummary.innerHTML = cartSummaryHTML;
  let cartQuantity = 0;
  checkoutCart.forEach((cartItem) => {
    cartQuantity += cartItem.Quantity;
  });
  function deliveryOptionsHTML(matchingProductId) {
    let html = "";
    let priceString = "";
    deliveryOption.forEach((deliveryOptions) => {
      const deliveryDate = addWeekDays(deliveryOptions.deliveryDays).format(
        "dddd, MMMM D"
      );
      priceString = getPriceString(deliveryOptions.priceCents, priceString);
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
  returnHomeHTML.innerHTML = `${cartQuantity} items`;
  document
    .querySelectorAll(`.update-quantity-link`)
    .forEach((updateQuantityHTML) => {
      updateQuantityHTML.addEventListener("click", function () {
        const productId = updateQuantityHTML.dataset.productId;
        const quantityInputHTML = document.querySelector(
          `.quantity_Input_${productId}`
        );
        const saveQuantityHTML = document.querySelector(
          `.save-quantity-link-${productId}`
        );
        quantityInputHTML.classList.add("Display_Update_Element");
        saveQuantityHTML.classList.add("Display_Update_Element");
      });
    });
  let quantityToAdd = "";
  const quantityInputHTML = document.querySelectorAll(`.quantity_Input`);
  quantityInputHTML.forEach((quantityInput) => {
    quantityInput.addEventListener("keyup", (e) => {
      quantityToAdd = Number(quantityInput.value);
    });
  });
  const saveQuantityHTML = document.querySelectorAll(`.save-quantity-link`);
  saveQuantityHTML.forEach((saveQuantity) => {
    saveQuantity.addEventListener("click", function () {
      const ProductId = saveQuantity.dataset.productId;
      addToCart(ProductId, quantityToAdd);
      renderOrderSummary();
      renderPaymentSummary();
    });
  });
  document
    .querySelectorAll(".delete-quantity-link")
    .forEach((deleteProductHTML) => {
      deleteProductHTML.addEventListener("click", () => {
        const productId = deleteProductHTML.dataset.productId;
        removeFromCart(productId);
        renderOrderSummary();
        renderPaymentSummary();
      });
    });
  const deliveryOptionsInputHTML = document.querySelectorAll(
    ".delivery-option-input"
  );
  deliveryOptionsInputHTML.forEach((deliveryOptionInputHTML) => {
    deliveryOptionInputHTML.addEventListener("change", () => {
      const deliveryChoiceId = deliveryOptionInputHTML.dataset.deliveryChoiceId;
      const ProductId = deliveryOptionInputHTML.dataset.productId;
      updateDeliveryOption(ProductId, deliveryChoiceId, checkoutCart);
      renderOrderSummary();
      renderPaymentSummary();
    });
  });
  checkoutCart.forEach((cartItem) => {
    document.getElementById(
      `${cartItem.deliveryOptionId}-${cartItem.ProductId}`
    ).checked = true;
  });

  function deliveryDateHTML(productId) {
    let cartItem = getMatchingCart(checkoutCart, productId);
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
//renderOrderSummary();
