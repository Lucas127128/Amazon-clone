import { getMatchingProduct, fetchProducts } from "../data/products.ts";
import { formatCurrency } from "./Utils/Money.ts";
import { incrementAddToCart, displayCartQuantity } from "../data/cart.ts";
import { getTimeString, Order } from "../data/orders.ts";
import { checkTruthy } from "./Utils/typeChecker.ts";
function renderPlacedOrder() {
  const savedOrders = localStorage.getItem("orders");
  const orders: Order[] = savedOrders ? JSON.parse(savedOrders) : [];
  const ordersHTML = document.querySelector(".orders-grid");
  checkTruthy(ordersHTML);
  orders.forEach(async (order) => {
    console.log(order);
    let placedOrderHTML = "";
    const products = await fetchProducts();
    order.products.forEach((product) => {
      const matchingProduct = getMatchingProduct(products, product.productId);
      const deliveryDate = getTimeString(product.estimatedDeliveryTime);
      checkTruthy(matchingProduct);
      placedOrderHTML += `
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
    });
    const orderTime = getTimeString(order.orderTime);
    console.log(order.id);
    const placedOrderContainerHTML = `
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
            <div>${order.id}</div>
          </div>
        </div>
        <div class="order-details-grid order-details-grid-${
          order.id
        } data-order-id="${order.id}">
        ${placedOrderHTML}
        </div>
      </div>
    `;
    ordersHTML.insertAdjacentHTML("beforeend", placedOrderContainerHTML);
  });

  function displayBuyAgainMessage(
    buyAgainMessageHTML: Element,
    buyAgainSuccessHTML: Element,
  ): void {
    checkTruthy(buyAgainSuccessHTML);
    checkTruthy(buyAgainMessageHTML);
    buyAgainSuccessHTML.classList.add("display-buy-again-success");
    buyAgainMessageHTML.classList.add("hide-buy-again-message");
    displayCartQuantity("cart-quantity");
    setTimeout(() => {
      buyAgainSuccessHTML.classList.remove("display-buy-again-success");
      buyAgainMessageHTML.classList.remove("hide-buy-again-message");
    }, 1500);
  }
  ordersHTML.addEventListener("click", (event) => {
    let buyAgainButton = <HTMLButtonElement>event.target;
    /*
    The event target may be the child element inside the buy again button and
    do not contain the "buy-again-button" class. If this is the situation,
    I need to set the buyAgainButton to its parent element, which is the 
    actual buy again button element, not the child element of it. 
    */
    if (
      !buyAgainButton.classList.contains("buy-again-button") &&
      !buyAgainButton.parentElement?.classList.contains("buy-again-button")
    ) {
      return;
    } else if (
      !buyAgainButton.classList.contains("buy-again-button") &&
      buyAgainButton.parentElement?.classList.contains("buy-again-button")
    ) {
      buyAgainButton = <HTMLButtonElement>buyAgainButton.parentElement;
    }

    const productId = buyAgainButton.dataset.productId;
    const buyAgainSuccessHTML = buyAgainButton.querySelector(
      `span.buy-again-success-${productId}`,
    );
    const buyAgainMessageHTML = buyAgainButton.querySelector(
      `span.buy-again-message-${productId}`,
    );

    checkTruthy(productId, "Fail to get productId");
    incrementAddToCart(productId, 1);

    checkTruthy(buyAgainMessageHTML);
    checkTruthy(buyAgainSuccessHTML);
    displayBuyAgainMessage(buyAgainMessageHTML, buyAgainSuccessHTML);
  });
  displayCartQuantity("cart-quantity");
}

async function loadPage() {
  try {
    renderPlacedOrder();
  } catch (error) {
    console.error(`unexpected network error: ${error}`);
  }
}
loadPage();
