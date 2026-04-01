import type { Product } from '#root/shared/src/data/products.ts';
import { checkNullish } from '#root/shared/src/utils/typeChecker.ts';
import {
  CART_CONFIG,
  FETCH_CONFIG,
  UI_TIMEOUTS,
} from '#root/config/constants.ts';
import { generateAmazonHTML } from '../htmlGenerators/amazonHTML';
import { policy } from '#root/shared/src/utils/trustedTypes.ts';
import { addToCart } from '#data/cart.ts';

let timer: NodeJS.Timeout;
function displayAdded(productId: string) {
  const addedToCart = document.querySelector(
    `div.added-to-cart-${productId}`,
  );
  checkNullish(addedToCart, 'Fail to select HTML element');
  addedToCart.style.opacity = '1';

  clearTimeout(timer);
  timer = setTimeout(() => {
    addedToCart.style.opacity = '0';
  }, UI_TIMEOUTS.ADDED_TO_CART_DISPLAY);
}

let controller = new AbortController();
export function renderProducts(products: readonly Product[]) {
  controller.abort();
  controller = new AbortController();
  const { signal } = controller;

  const productsGrid = document.querySelector('.products-grid');
  checkNullish(productsGrid, 'Fail to select HTML element');

  let productsHTML = '';
  for (const [index, product] of products.entries()) {
    const highFetchPriority =
      index <= FETCH_CONFIG.HIGH_PRIORITY_THRESHOLD ? true : false;
    productsHTML += generateAmazonHTML(product, highFetchPriority);
  }
  const trustedProductsHTML = policy?.createHTML(productsHTML);
  checkNullish(trustedProductsHTML);
  productsGrid.innerHTML = policy?.createHTML('') as unknown as string;
  productsGrid.insertAdjacentHTML('beforeend', trustedProductsHTML as any);

  productsGrid.addEventListener(
    'click',
    (event) => {
      const button = event.target as HTMLElement;
      if (!button.classList.contains('add-to-cart-button')) return;

      const { productId } = button.dataset;
      const productContainer = button.parentElement;
      const quantitySelectorHTML = productContainer?.querySelector(
        'select.ProductQuantitySelector',
      );
      checkNullish(
        quantitySelectorHTML,
        'Fail to get the HTML element or the product id dataset is incorrect',
      );
      checkNullish(
        productId,
        'Fail to get the HTML element or the product id dataset is incorrect',
      );
      const quantityToAdd = parseInt(quantitySelectorHTML.value);
      addToCart(
        {
          productId: productId,
          quantity: quantityToAdd,
          deliveryOptionId: CART_CONFIG.DEFAULT_DELIVERY_OPTION,
        },
        true,
      );
      displayAdded(productId);
    },
    { signal },
  );
}
