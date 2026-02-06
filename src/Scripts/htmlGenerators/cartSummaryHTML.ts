import { Cart } from "../../data/cart";
import { Product } from "../../data/products";
import {
  deliveryOptions,
  getDeliveryDate,
  getPriceString,
} from "../../data/deliveryOption";

const html = String.raw;

function deliveryOptionsHTML(matchingProductId: string): string {
  let deliveryOptionsHTML = "";
  deliveryOptions.forEach((deliveryOptions) => {
    const deliveryDate = getDeliveryDate(deliveryOptions.id);
    const priceString = getPriceString(deliveryOptions.priceCents);
    deliveryOptionsHTML += html`
      <div>
        <input
          type="radio"
          class="delivery-option-input"
          data-delivery-choice-id="${deliveryOptions.id}"
          id="${deliveryOptions.id}-${matchingProductId}"
        />
        <div>
          <div class="delivery-option-date">${deliveryDate}</div>
        </div>
        <div class="delivery-option-price">${priceString}Shipping</div>
      </div>
    `;
  });
  return deliveryOptionsHTML;
}

function deliveryDateHTML(cartItem: Cart) {
  const deliveryDate = getDeliveryDate(cartItem.deliveryOptionId);
  const html = `Delivery date: ${deliveryDate}`;
  return html;
}

export function generateCartSummary(
  matchingProduct: Product,
  cartItem: Cart,
): string {
  const cartSummaryHTML = html`
    <div
      class="cart-item-container cart-item-container-${matchingProduct.id}"
      data-product-id="${matchingProduct.id}"
    >
      <div class="delivery-date-${matchingProduct.id} delivery-date">
        ${deliveryDateHTML(cartItem)}
      </div>

      <div class="cart-item-details-grid">
        <img class="product-image" src="${matchingProduct.image}" />

        <div class="cart-item-details">
          <div class="product-name">${matchingProduct.name}</div>
          <div class="product-price product-price-${matchingProduct.id} ">
            $${matchingProduct.price}
          </div>
          <div class="product-quantity">
            <span class="js-product-quantity-${matchingProduct.id}">
              Quantity:
              <span class="quantity-label">${cartItem.quantity}</span>
            </span>
            <span class="update-quantity-link link-primary"> Update </span>
            <input
              type="number"
              class="quantity_Input_${matchingProduct.id} quantity_Input"
              style="width: 40px;"
            />
            <span
              class="save-quantity-link-${matchingProduct.id} link-primary save-quantity-link"
            >
              Save</span
            >
            <span
              class="delete-quantity-link delete-quantity-link-${matchingProduct.id} link-primary"
            >
              Delete
            </span>
          </div>
        </div>
        <div class="delivery-options">
          <div class="delivery-options-title">Choose a delivery option:</div>
          ${deliveryOptionsHTML(matchingProduct.id)}
        </div>
      </div>
    </div>
  `;
  return cartSummaryHTML;
}
