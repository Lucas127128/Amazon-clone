import { addToCart, cartQuantity } from '#data/cart.ts';
import { fetchProducts, type Product } from '#data/products.ts';
import { checkNullish } from '#root/shared/src/utils/typeChecker.ts';
import { generateAmazonHTML } from './htmlGenerators/amazonHTML';
import { handleSearch, handleSearchInput } from './header';
import { policy } from '#utils/trustedTypes.ts';
import {
  CART_CONFIG,
  FETCH_CONFIG,
  UI_TIMEOUTS,
} from '#root/config/constants.ts';
import { effect } from '@preact/signals-core';

async function renderAmazonHomePage() {
  const productsGrid = document.querySelector('.products-grid');
  checkNullish(productsGrid, 'Fail to select HTML element');

  const url = new URL(location.href);
  const searchQuery = url.searchParams.get('q');
  const products: readonly Product[] = searchQuery
    ? await handleSearch(searchQuery)
    : await fetchProducts();

  let productsHTML = '';
  for (const [index, product] of products.entries()) {
    const highFetchPriority =
      index <= FETCH_CONFIG.HIGH_PRIORITY_THRESHOLD ? true : false;
    productsHTML += generateAmazonHTML(product, highFetchPriority);
  }
  const trustedProductsHTML = policy?.createHTML(productsHTML);
  checkNullish(trustedProductsHTML);
  productsGrid.insertAdjacentHTML('beforeend', trustedProductsHTML as any);

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

  productsGrid.addEventListener('click', (event) => {
    const button = event.target as HTMLElement;
    if (!button.classList.contains('add-to-cart-button')) return;

    const { productId } = button.dataset;
    const productContainer = button.parentElement;
    const quantitySelectorHTML =
      productContainer?.querySelector<HTMLInputElement>(
        '.ProductQuantitySelector',
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
  });
  const returnToHomeLink = document.querySelector('.cart-quantity');
  checkNullish(returnToHomeLink);
  effect(
    () => {
      returnToHomeLink.textContent = `${cartQuantity.value}`;
    },
    { name: 'update cart quantity in dom' },
  );

  url.searchParams.delete('q');
  history.replaceState(null, '', url.toString());
}

await Promise.allSettled([renderAmazonHomePage(), handleSearchInput()]);
