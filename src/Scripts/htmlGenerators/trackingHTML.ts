import { Cart } from '#data/cart.ts';
import { getDeliveryDate } from '#data/deliveryOption.ts';
import { Order } from '#data/orders.ts';
import { Product } from '#data/products.ts';
import { getDeliveryProgress } from '#data/tracking.ts';

export function generateTrackingHTML(
  matchingProduct: Product,
  matchingOrder: Order,
  matchingCart: Cart,
): string {
  const deliveryProgressPercent = getDeliveryProgress(
    matchingOrder,
    matchingCart,
  );
  const html = String.raw;
  const trackingHTML = html`
    <div class="delivery-date">Arriving on ${getDeliveryDate(matchingCart.deliveryOptionId)}</div>

    <div class="product-info">
      ${matchingProduct.name}
    </div>

    <div class="product-info">Quantity: ${matchingCart.quantity}</div>

    <img
      class="product-image"
      src="${matchingProduct.image}"
    />

    <div class="progress-labels-container">
      <div class="progress-label">Preparing</div>
      <div class="progress-label current-status">Shipped</div>
      <div class="progress-label">Delivered</div>
    </div>

    <div class="progress-bar-container">
      <div class="progress-bar" style='width:${deliveryProgressPercent}%'></div>
    </div>
  `;
  return trackingHTML;
}
