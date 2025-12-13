import {
  Products,
  getMatchingProduct,
  fetchProducts,
} from "../data/products.js";
import { formatCurrency } from "./Utils/Money.js";
import { addToCart, displayCartQuantity } from "../data/cart.js";
import { getTimeString } from "../data/orders.js";
function renderPlacedOrder() {
  const orders = JSON.parse(localStorage.getItem("orders")) || [];
  const ordersHTML = document.querySelector(".orders-grid");
  orders.forEach((order) => {
    const orderTime = getTimeString(order.orderTime);
    let placedOrderContainerHTML = "";
    placedOrderContainerHTML += `
          <div class="order-container order-container-${order.id}">
          <div class="order-header">
                <div class="order-header-left-section">
                  <div class="order-date">
                    <div class="order-header-label">Order Placed: ${orderTime}</div>
                    <div></div>
                  </div>
                  <div class="order-total">
                    <div class="order-header-label">Total:</div>
                    <div>$${formatCurrency(order.totalCostCents)}</div>
                  </div>
                </div>

                <div class="order-header-right-section">
                  <div class="order-header-label">Order ID:</div>
                  <div>27cba69d-4c3d-4098-b42d-ac7fa62b7664</div>
                </div>
              </div>
              <div class="order-details-grid order-details-grid-${order.id}">
              </div>
          </div>
    `;
    ordersHTML.innerHTML = placedOrderContainerHTML;
    order.products.forEach((product) => {
      const matchingProduct = getMatchingProduct(Products, product.productId);
      const deliveryDate = getTimeString(product.estimatedDeliveryTime);
      const orderDetail = document.querySelector(
        `.order-details-grid-${order.id}`
      );
      let placedOrderHTML = "";
      placedOrderHTML = `
                <div class="product-image-container">
                  <img src="${matchingProduct.image}" />
                </div>

                <div class="product-details">
                  <div class="product-name">
                    ${matchingProduct.name}
                  </div>
                  <div class="product-delivery-date">Arriving on: ${deliveryDate}</div>
                  <div class="product-quantity">Quantity: ${product.quantity}</div>
                  <button class="buy-again-button button-primary" data-product-id="${product.productId}">
                    <img class="buy-again-icon" src="images/icons/buy-again.png" />
                    <span class="buy-again-message buy-again-message-${product.productId}">Buy it again</span>
                    <span class="buy-again-success buy-again-success-${product.productId}">✓ Added</span>
                  </button>
                </div>

                <div class="product-actions">
                  <a href="tracking.html?orderId=${order.id}&productId=${product.productId}">
                    <button class="track-package-button button-secondary">
                      Track package
                    </button>
                  </a>
                </div>
        `;
      orderDetail.innerHTML += placedOrderHTML;
    });
  });
  const buyAgainButtons = document.querySelectorAll(".buy-again-button");
      buyAgainButtons.forEach((buyAgainButton) => {
        const productId = buyAgainButton.dataset.productId;
        buyAgainButton.addEventListener("click", () => {
          let productQuantity =
            JSON.parse(localStorage.getItem(`${productId}-productQuantity`)) ||
            0;
          productQuantity += 1;
          localStorage.setItem(`${productId}-productQuantity`, productQuantity);
          addToCart(productId, productQuantity);
          const buyAgainSuccessHTML = document.querySelector(
            `.buy-again-success-${productId}`
          );
          const buyAgainMessageHTML = document.querySelector(
            `.buy-again-message-${productId}`
          );
          buyAgainSuccessHTML.classList.add("display-buy-again-success");
          buyAgainMessageHTML.classList.add("hide-buy-again-message");
          displayCartQuantity()
          setTimeout(() => {
            buyAgainSuccessHTML.classList.remove("display-buy-again-success");
            buyAgainMessageHTML.classList.remove("hide-buy-again-message");
          }, 1500);
        });
      });
  displayCartQuantity();
}

async function loadPage() {
  try {
    await fetchProducts();
    renderPlacedOrder();
  } catch (error) {
    console.log(`unexpected network error: ${error}`);
  }
}
loadPage();
