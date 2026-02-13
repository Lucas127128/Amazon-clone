import { Cart } from '../../data/cart';
import { getDeliveryDate } from '../../data/deliveryOption';
import { Order } from '../../data/orders';
import { Product } from '../../data/products';
import { formatCurrency } from '../Utils/Money';

const html = String.raw;

export function generateOrdersProductHTML(
  product: Cart,
  matchingProduct: Product,
  orderId: string,
): string {
  const deliveryDate = getDeliveryDate(product.deliveryOptionId);
  const placedOrderProductHTML = html`
    <div class="product-image-container">
      <img src="${matchingProduct.image}" />
    </div>

    <div class="product-details">
      <div class="product-name">${matchingProduct.name}</div>
      <div class="product-delivery-date">Arriving on: ${deliveryDate}</div>
      <div class="product-quantity">Quantity: ${product.quantity}</div>
      <button
        class="buy-again-button button-primary"
        data-product-id="${product.productId}"
      >
        <img class="buy-again-icon" src="images/icons/buy-again.png" />
        <span class="buy-again-message buy-again-message-${product.productId}"
          >Buy it again</span
        >
        <span class="buy-again-success buy-again-success-${product.productId}"
          >✓ Added</span
        >
      </button>
    </div>

    <div class="product-actions">
      <a href="tracking.html?orderId=${orderId}&productId=${product.productId}">
        <button class="track-package-button button-secondary">
          Track package
        </button>
      </a>
    </div>
  `;
  return placedOrderProductHTML;
}

export function generateOrderContainerHTML(
  order: Order,
  orderTime: string,
  ordersProductHTML: string,
): string {
  const html = String.raw;
  const orderContainerHTML = html`
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
      <div class="order-details-grid order-details-grid-${order.id} data-order-id="${order.id}">
      ${ordersProductHTML}
      </div>
    </div>
  `;
  return orderContainerHTML;
}
