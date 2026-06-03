import { comptime } from 'comptime';
import * as Effect from 'effect/Effect';
import { minify } from 'html-minifier-next';
import { getDeliveryDate } from 'shared/deliveryOption';
import type { Product } from 'shared/products';
import type { Cart, Order } from 'shared/schema';

import { getDeliveryProgress } from '#data/tracking.ts';

export const generateTrackingHTML = (
  matchingProduct: Product,
  matchingOrder: Order,
  matchingCart: Cart,
) =>
  Effect.gen(function* () {
    const deliveryProgressPercent = yield* getDeliveryProgress(
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

      ${comptime(
        async () =>
          await minify(
            `<div class="progress-labels-container">
              <div class="progress-label">Preparing</div>
              <div class="progress-label current-status">Shipped</div>
              <div class="progress-label">Delivered</div>
          </div>`,
            { collapseWhitespace: true },
          ),
      )}

      <div class="progress-bar-container">
        <div
          class="progress-bar"
          style="width:${deliveryProgressPercent}%"
        ></div>
      </div>
    `;
    return trackingHTML;
  });
