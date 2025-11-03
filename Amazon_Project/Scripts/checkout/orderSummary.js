import { Cart, RemoveFromCart } from "../../data/cart.js";
import { Products } from "../../data/products.js";
import { FormatCurrency } from "../Utils/Money.js";
import dayjs from "https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js";
import {
  deliveryOption,
  getDeliveryDate,
  addWeekDays,
} from "../../data/deliveryOption.js";
import { UpdateDeliveryOption } from "../../data/cart.js";
import { getMatchingCart, getMatchingProduct } from "../../data/products.js";
import { renderPaymentSummary } from "./paymentSummary.js";
const Today = dayjs();
let deliveryDate = Today.add(7, "days");
deliveryDate = deliveryDate.format("dddd, MMMM D");

export function renderOrderSummary() {
  let Local_Storage_Cart = localStorage.getItem("local_Storage_Cart");
  if (Local_Storage_Cart === null) {
    let CheckoutCart = Cart;
  }
  let CheckoutCart = JSON.parse(localStorage.getItem("local_Storage_Cart"));
  let cartSummaryHTML = "";
  function Add_To_cart(productId, quantityToAdd) {
    let MatchingItem = getMatchingCart(CheckoutCart, productId);
    if (MatchingItem) {
      MatchingItem.Quantity = quantityToAdd;
    } else {
      CheckoutCart.push({
        ProductId: productId,
        Quantity: quantityToAdd,
      });
    }
    localStorage.setItem("local_Storage_Cart", JSON.stringify(CheckoutCart));
  }
  CheckoutCart.forEach(function (cartItem) {
    let matchingProduct = getMatchingProduct(Products, cartItem.ProductId);
    cartSummaryHTML += `
    <div class="cart-item-container cart-item-container-${matchingProduct.id}">
        <div class="delivery-date-${
          matchingProduct.id
        } delivery-date" data-product-id="${matchingProduct.id}">
            Delivery date: 
        </div>

        <div class="cart-item-details-grid">
            <img class="product-image"
            src="${matchingProduct.image}">

            <div class="cart-item-details">
            <div class="product-name">
                ${matchingProduct.name}
            </div>
            <div class="product-price">
                $${FormatCurrency(matchingProduct.priceCents)}
            </div>
            <div class="product-quantity">
                <span class="js-product-quantity-${matchingProduct.id}">
                Quantity: <span class="quantity-label">${
                  cartItem.Quantity
                }</span>
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
                } link-primary" data-product-id="${matchingProduct.id}">
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

  const Order_Summary = document.querySelector(".order-summary");
  const return_to_home_link = document.querySelector(".return-to-home-link");
  Order_Summary.innerHTML = cartSummaryHTML;
  let Checkout_Cart_Quantity = 0;
  CheckoutCart.forEach((value) => {
    Checkout_Cart_Quantity += value.Quantity;
  });
  function deliveryOptionsHTML(matchingProductId) {
    let html = "";
    let priceString = "";
    deliveryOption.forEach((deliveryOptions) => {
      deliveryDate = addWeekDays(deliveryOptions.deliveryDays);
      deliveryDate = deliveryDate.format("dddd, MMMM D");
      if (deliveryOptions.priceCents === 0) {
        priceString = "FREE - ";
      } else if (deliveryOptions.priceCents === 499) {
        priceString = "$4.99 - ";
      } else if (deliveryOptions.priceCents === 999) {
        priceString = "$9.99 - ";
      } else {
        priceString = "fail";
      }
      html += `<div>
            <input type="radio" class="delivery-option-input"
                name="delivery-option-${matchingProductId}"
                data-delivery-choice-id="${deliveryOptions.id}"
                data-product-id="${matchingProductId}"
                value='${deliveryDate}'
                id="${deliveryOptions.id}-${matchingProductId}"
                checked>
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
  return_to_home_link.innerHTML = `${Checkout_Cart_Quantity} items`;
  document.querySelectorAll(`.update-quantity-link`).forEach((Link) => {
    Link.addEventListener("click", function () {
      const ProductId = Link.dataset.productId;
      const quantity_Input = document.querySelector(
        `.quantity_Input_${ProductId}`
      );
      const save_quantity_link = document.querySelector(
        `.save-quantity-link-${ProductId}`
      );
      console.log(ProductId);
      quantity_Input.classList.add("Display_Update_Element");
      save_quantity_link.classList.add("Display_Update_Element");
    });
  });
  let QuantityToAdd = 0;
  document.querySelectorAll(`.quantity_Input`).forEach((Link) => {
    Link.addEventListener("keyup", function (e) {
      QuantityToAdd += Link.value;
    });
  });
  document.querySelectorAll(`.save-quantity-link`).forEach((Link) => {
    Link.addEventListener("click", function () {
      const ProductId = Link.dataset.productId;
      const quantityInput = document.querySelector(
        `.quantity_Input_${ProductId}`
      );
      QuantityToAdd = Number(quantityInput.value);
      Add_To_cart(ProductId, QuantityToAdd);
      renderOrderSummary();
      renderPaymentSummary();
    });
  });
  document.querySelectorAll(".delete-quantity-link").forEach((Link) => {
    Link.addEventListener("click", function () {
      const ProductId = Link.dataset.productId;
      RemoveFromCart(ProductId);
      localStorage.setItem("local_Storage_Cart", JSON.stringify(Cart));
      renderOrderSummary();
      renderPaymentSummary();
    });
  });
  let Delivery_Date = "";
  const delivery_option_input = document.querySelectorAll(
    ".delivery-option-input"
  );
  delivery_option_input.forEach((element) => {
    element.addEventListener("change", () => {
      const deliveryChoiceId = element.dataset.deliveryChoiceId;
      const ProductId = element.dataset.productId;
      Delivery_Date = document.querySelector(`.delivery-date-${ProductId}`);
      Delivery_Date.innerHTML = `Delivery date: ${element.value}`;
      UpdateDeliveryOption(ProductId, deliveryChoiceId, CheckoutCart);
      renderOrderSummary();
      renderPaymentSummary();
    });
  });
  CheckoutCart.forEach((cartItem) => {
    document.getElementById(
      `${cartItem.deliveryOptionId}-${cartItem.ProductId}`
    ).checked = true;
    let deliveryDate = getDeliveryDate(cartItem.deliveryOptionId);
    delivery_option_input.forEach((element) => {
      Delivery_Date = document.querySelector(
        `.delivery-date-${cartItem.ProductId}`
      );
      Delivery_Date.innerHTML = `Delivery date: ${deliveryDate}`;
    });
  });
}
renderOrderSummary();
