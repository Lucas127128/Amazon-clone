import {
  Products,
  getMatchingProduct,
  fetchProducts,
} from "../data/products.js";
import { formatCurrency } from "./Utils/Money.js";
function renderPlacedOrder() {
  const orders = JSON.parse(localStorage.getItem("orders")) || [];
  console.log(orders);
  const ordersHTML = document.querySelector(".orders-grid");
  orders.forEach((order) => {
    const ISOOrderTime = order.orderTime;
    const orderTime = new Date(ISOOrderTime).toLocaleDateString();

    const placedOrderContainerHTML = `
          <div class="order-container order-container-${order.id}">
          <div class="order-header">
                <div class="order-header-left-section">
                  <div class="order-date">
                    <div class="order-header-label">Order Placed:${orderTime}</div>
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
    ordersHTML.innerHTML += placedOrderContainerHTML;
    order.products.forEach((product) => {
      const matchingProduct = getMatchingProduct(Products, product.productId);
      const ISOdeliveryDate = product.estimatedDeliveryTime;
      const deliveryDate = new Date(ISOdeliveryDate).toLocaleDateString();
      const orderDetail = document.querySelector(
        `.order-details-grid-${order.id}`
      );
      const placedOrderHTML = `
                <div class="product-image-container">
                  <img src="${matchingProduct.image}" />
                </div>

                <div class="product-details">
                  <div class="product-name">
                    ${matchingProduct.name}
                  </div>
                  <div class="product-delivery-date">Arriving on: ${deliveryDate}</div>
                  <div class="product-quantity">Quantity: ${product.quantity}</div>
                  <button class="buy-again-button button-primary">
                    <img class="buy-again-icon" src="images/icons/buy-again.png" />
                    <span class="buy-again-message">Buy it again</span>
                  </button>
                </div>

                <div class="product-actions">
                  <a href="tracking.html?orderId=123&productId=456">
                    <button class="track-package-button button-secondary">
                      Track package
                    </button>
                  </a>
                </div>
        `;
      orderDetail.innerHTML += placedOrderHTML;
    });
  });
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
