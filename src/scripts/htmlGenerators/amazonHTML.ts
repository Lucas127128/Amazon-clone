import { Product } from '#data/products.ts';
export function generateAmazonHTML(
  product: Product,
  highFetchPriority: boolean,
  lazyLoading: boolean,
  asyncDecode: boolean,
): string {
  const html = String.raw;
  const productHTML = html`
      <div class="product-container" data-product-id='${product.id}'>
          <div class="product-image-container">
              <img class="product-image"
              fetchpriority=${highFetchPriority ? 'high' : 'auto'}
              load=${lazyLoading ? 'lazy' : 'eager'}
              decode=${asyncDecode ? 'async' : 'sync'}
              src="${product.image}">
          </div>

          <div class="product-name limit-text-to-2-lines">
              ${product.name}
          </div>

          <div class="product-rating-container">
              <img class="product-rating-stars"
              src="${product.starsUrl}">
              <div class="product-rating-count link-primary">
              ${product.ratingCount}
              </div>
          </div>

          <div class="product-price">
              $${product.price}
          </div>

          <div class="product-quantity-container">
              <select class = "ProductQuantitySelector">
              <option selected value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
              <option value="10">10</option>
              </select>
          </div>
          ${product.extraInfoHTML}

          <div class="product-spacer"></div>

          <div class="added-to-cart added-to-cart-${product.id}">
              <img src="/images/icons/checkmark.svg">
              Added
          </div>

          <button class="add-to-cart-button button-primary"
          data-product-id="${product.id}">
              Add to Cart
          </button>
          </div>
      </div>
    `;
  return productHTML;
}
