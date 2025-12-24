import "./general-B6K0KYea.js";
import { f as fetchProducts, g as getMatchingProduct, P as Products, b as formatCurrency, c as getCart, a as addToCart, r as removeFromCart, u as updateDeliveryOption, e as getMatchingCart } from "./cart-C9ab77dg.js";
import dayjs from "https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js";
import { a as addToOrders } from "./orders-Ezh0RDI8.js";
const deliveryOption = [
  {
    id: "1",
    deliveryDays: 7,
    priceCents: 0
  },
  {
    id: "2",
    deliveryDays: 3,
    priceCents: 499
  },
  {
    id: "3",
    deliveryDays: 1,
    priceCents: 999
  }
];
const Today = dayjs();
function addWeekDays(businessDaysToAdd) {
  let currentDate = Today;
  let daysAdded = 0;
  while (daysAdded < businessDaysToAdd) {
    currentDate = currentDate.add(1, "day");
    const dayOfWeek = currentDate.day();
    if (dayOfWeek !== 6 && dayOfWeek !== 0) {
      daysAdded++;
    }
  }
  return currentDate;
}
function getDeliveryDate(DeliveryOptionId) {
  let deliveryDate = "";
  if (DeliveryOptionId === "1") {
    deliveryDate = addWeekDays(7).format("dddd, MMMM D");
  } else if (DeliveryOptionId === "2") {
    deliveryDate = addWeekDays(3).format("dddd, MMMM D");
  } else if (DeliveryOptionId === "3") {
    deliveryDate = addWeekDays(1).format("dddd, MMMM D");
  }
  return deliveryDate;
}
function getPriceString(priceCents, priceString) {
  if (priceCents === 0) {
    priceString = "FREE - ";
  } else if (priceCents === 499) {
    priceString = "$4.99 - ";
  } else if (priceCents === 999) {
    priceString = "$9.99 - ";
  }
  return priceString;
}
function renderPaymentSummary() {
  const CheckoutCart = JSON.parse(localStorage.getItem("local_Storage_Cart"));
  let totalProductPrice = 0;
  let totalDeliveryFee = 0;
  let cartQuantity = 0;
  const paymentSummary = document.querySelector(".payment-summary");
  CheckoutCart.forEach((cartItem) => {
    const productItem = getMatchingProduct(Products, cartItem.ProductId);
    let totalPrice = productItem.priceCents * cartItem.Quantity;
    totalProductPrice += totalPrice;
    cartQuantity += cartItem.Quantity;
  });
  CheckoutCart.forEach((cartItem) => {
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
  const totalPriceBeforeTax = totalDeliveryFee + totalProductPrice;
  const totalTax = totalPriceBeforeTax / 10;
  const totalOrderPrice = totalPriceBeforeTax + totalTax;
  const paymentSummaryHTML = `
    <div class="payment-summary-title">
        Order Summary
        </div>
        <div class="payment-summary-row">
        <div>Items (${cartQuantity}):</div>
        <div class="payment-summary-money">$${formatCurrency(
    totalProductPrice
  )}</div>
        </div>

        <div class="payment-summary-row">
        <div>Shipping &amp; handling:</div>
        <div class="payment-summary-money">$${formatCurrency(
    totalDeliveryFee
  )}</div>
        </div>

        <div class="payment-summary-row subtotal-row">
        <div>Total before tax:</div>
        <div class="payment-summary-money">$${formatCurrency(
    totalPriceBeforeTax
  )}</div>
        </div>

        <div class="payment-summary-row">
        <div>Estimated tax (10%):</div>
        <div class="payment-summary-money">$${formatCurrency(totalTax)}</div>
        </div>

        <div class="payment-summary-row total-row">
        <div>Order total:</div>
        <div class="payment-summary-money">$${formatCurrency(
    totalOrderPrice
  )}</div>
        </div>

        <button class="place-order-button button-primary">
        Place your order
        </button>
    `;
  paymentSummary.innerHTML = paymentSummaryHTML;
  const checkoutCart = CheckoutCart;
  checkoutCart.map((cartItem) => {
    cartItem.productId = cartItem.ProductId;
    cartItem.quantity = cartItem.Quantity;
    delete cartItem.Quantity;
    delete cartItem.ProductId;
    return cartItem;
  });
  const placeOrderHTML = document.querySelector(".place-order-button");
  placeOrderHTML.addEventListener("click", async () => {
    try {
      console.log(JSON.stringify(checkoutCart));
      const response = await fetch("https://localhost:3001/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(
          checkoutCart
        )
      });
      const order = await response.json();
      addToOrders(order);
      localStorage.setItem("local_Storage_Cart", JSON.stringify([]));
      location.href = "/orders.html";
    } catch (error) {
      console.log(`Unexpected network issue: ${error}`);
    }
  });
}
async function loadPage$2() {
  try {
    await fetchProducts();
    renderPaymentSummary();
  } catch (error) {
    console.log(`unexpected network error: ${error}`);
  }
}
loadPage$2();
function renderOrderSummary() {
  let CheckoutCart = "";
  CheckoutCart = getCart(CheckoutCart);
  const checkoutCart = CheckoutCart;
  let cartSummaryHTML = "";
  checkoutCart.forEach((cartItem, cartOrder) => {
    const matchingProduct = getMatchingProduct(Products, cartItem.ProductId);
    cartSummaryHTML += `
    <div class="cart-item-container cart-item-container-${matchingProduct.id}">
      <div class="delivery-date-${matchingProduct.id} delivery-date" data-product-id="${matchingProduct.id}">
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
          <span class="update-quantity-link link-primary" data-product-id="${matchingProduct.id}">
          Update
          </span>
          <input type="number" class="quantity_Input_${matchingProduct.id} quantity_Input" style="width: 40px;">
          <span class="save-quantity-link-${matchingProduct.id} link-primary save-quantity-link" 
          data-product-id="${matchingProduct.id}">Save</span>
          <span class="delete-quantity-link delete-quantity-link-${matchingProduct.id} link-primary" data-product-Id="${matchingProduct.id}">
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
  document.querySelectorAll(`.update-quantity-link`).forEach((updateQuantityHTML) => {
    updateQuantityHTML.addEventListener("click", function() {
      const productId = updateQuantityHTML.dataset.productId;
      const quantityInputHTML2 = document.querySelector(
        `.quantity_Input_${productId}`
      );
      const saveQuantityHTML2 = document.querySelector(
        `.save-quantity-link-${productId}`
      );
      quantityInputHTML2.classList.add("Display_Update_Element");
      saveQuantityHTML2.classList.add("Display_Update_Element");
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
    saveQuantity.addEventListener("click", function() {
      const ProductId = saveQuantity.dataset.productId;
      addToCart(ProductId, quantityToAdd);
      renderOrderSummary();
      renderPaymentSummary();
    });
  });
  document.querySelectorAll(".delete-quantity-link").forEach((deleteProductHTML) => {
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
async function loadPage$1() {
  try {
    await fetchProducts();
    renderOrderSummary();
  } catch (error) {
    console.log(`unexpected network error: ${error}`);
  }
}
loadPage$1();
async function loadPage() {
  try {
    await fetchProducts();
    renderOrderSummary();
    renderPaymentSummary();
  } catch (error) {
    console.log(`unexpected network error: ${error}`);
  }
}
loadPage();
