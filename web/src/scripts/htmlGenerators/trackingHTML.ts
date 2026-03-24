import { Cart } from '#root/shared/src/schema.ts';
import { getDeliveryDate } from '#root/shared/src/data/deliveryOption.ts';
import { Order } from '#root/shared/src/schema.ts';
import { type Product } from '#root/shared/src/data/products.ts';
import { getDeliveryProgress } from '#root/shared/src/data/tracking.ts';

export function generateTrackingHTML(
  matchingProduct: Product,
  matchingOrder: Order,
  matchingCart: Cart,
) {
  const deliveryProgressPercent = getDeliveryProgress(
    matchingOrder,
    matchingCart,
  );
  const html = String.raw;
  const trackingHTML = html`
    <div class="delivery-date">
      Arriving on ${getDeliveryDate(matchingCart.deliveryOptionId)}
    </div>

    <div class="product-info">${matchingProduct.name}</div>

    <div class="product-info">Quantity: ${matchingCart.quantity}</div>

    <img class="product-image" src="${matchingProduct.image}" />

    <div class="progress-labels-container">
      <div class="progress-label">Preparing</div>
      <div class="progress-label current-status">Shipped</div>
      <div class="progress-label">Delivered</div>
    </div>

    <div class="progress-bar-container">
      <div
        class="progress-bar"
        style="width:${deliveryProgressPercent}%"
      ></div>
    </div>
  `;
  return trackingHTML;
}
