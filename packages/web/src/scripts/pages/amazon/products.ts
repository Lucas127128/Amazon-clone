import 'typed-query-selector';

import { comptime } from 'comptime';
import { CART_CONFIG, FETCH_CONFIG, UI_TIMEOUTS } from 'shared/constants';
import type { Product } from 'shared/products';
import { checkNullish, isHTMLElement } from 'shared/typeChecker';

import { addToCart } from '../../data/cart.ts';
import { sanitizer } from '../../utils/trustedTypes.ts';
import { generateAmazonHTML } from '../htmlGenerators/amazonHTML.ts';

function displayAdded(productId: string) {
  const addedToCart = document.querySelector(
    `div.added-to-cart-${productId}`,
  );
  checkNullish(addedToCart, 'Fail to select HTML element');
  addedToCart.style.opacity = '1';
  setTimeout(
    () => {
      addedToCart.style.opacity = '0';
    },
    comptime(() => UI_TIMEOUTS.ADDED_TO_CART_DISPLAY),
  );
}

const productsGrid = document.querySelector('.products-grid');

export function renderProducts(products: readonly Product[]) {
  let productsHTML = '';
  for (const [index, product] of products.entries()) {
    const highFetchPriority =
      index <= comptime(() => FETCH_CONFIG.HIGH_PRIORITY_THRESHOLD)
        ? true
        : false;
    productsHTML += generateAmazonHTML(product, highFetchPriority);
  }
  const trustedProductsHTML = sanitizer?.createHTML(productsHTML);
  checkNullish(trustedProductsHTML);
  checkNullish(productsGrid, 'Fail to select HTML element');
  productsGrid.innerHTML = window.trustedTypes
    ?.emptyHTML as unknown as string;
  productsGrid.insertAdjacentHTML(
    'beforeend',
    trustedProductsHTML as unknown as string,
  );
}

export function handleAddToCart() {
  productsGrid?.addEventListener('click', (event) => {
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
        deliveryOptionId: comptime(
          () => CART_CONFIG.DEFAULT_DELIVERY_OPTION,
        ),
      },
      true,
    );
    displayAdded(productId);
  });
}
