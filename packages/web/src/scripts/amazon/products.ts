import type { Product } from 'shared/products';
import { checkNullish, isHTMLElement } from 'shared/typeChecker';
import { CART_CONFIG, FETCH_CONFIG, UI_TIMEOUTS } from 'shared/constants';
import { generateAmazonHTML } from '../htmlGenerators/amazonHTML.ts';
import { policy } from 'shared/trustedType';
import { addToCart } from 'shared/cart';

policy();

const timers: { timer: NodeJS.Timeout; productId: string }[] = [];
function displayAdded(productId: string) {
  const addedToCart = document.querySelector(
    `div.added-to-cart-${productId}`,
  );
  checkNullish(addedToCart, 'Fail to select HTML element');
  addedToCart.style.opacity = '1';

  let matchingTimer = timers.find(
    (timer) => timer.productId === productId,
  );
  const timer = {
    timer: setTimeout(() => {
      addedToCart.style.opacity = '0';
    }, UI_TIMEOUTS.ADDED_TO_CART_DISPLAY),
    productId: productId,
  };
  if (matchingTimer) {
    clearTimeout(matchingTimer.timer);
    matchingTimer = timer;
  } else {
    timers.push(timer);
  }
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
  const trustedProductsHTML = productsHTML;
  checkNullish(trustedProductsHTML);
  productsGrid.innerHTML = '';
  productsGrid.insertAdjacentHTML('beforeend', trustedProductsHTML as any);

  productsGrid.addEventListener(
    'click',
    (event) => {
      const button = event.target;
      isHTMLElement(button, 'button');
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
  const url = new URL(location.href);
  if (url.searchParams.has('q')) {
    url.searchParams.delete('q');
    history.replaceState(null, '', url.toString());
  }
}
