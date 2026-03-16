import {
  addToCart,
  calculateCartQuantity,
} from '#root/shared/src/data/cart.ts';
import { getProducts, Product } from '#root/shared/src/data/products.ts';
import { checkTruthy } from '#root/shared/src/utils/typeChecker.ts';
import { generateAmazonHTML } from './htmlGenerators/amazonHTML';
import { handleSearch, handleSearchInput } from './header';
import { policy } from '#root/shared/src/utils/trustedTypes.ts';
import {
  CART_CONFIG,
  FETCH_CONFIG,
  UI_TIMEOUTS,
} from '#root/shared/src/constants.ts';

async function renderAmazonHomePage() {
  const productsGrid = document.querySelector('.products-grid');
  checkTruthy(productsGrid, 'Fail to select HTML element');

  const url = new URL(location.href);
  const searchQuery = url.searchParams.get('q');
  const products: readonly Product[] = searchQuery
    ? await handleSearch(searchQuery)
    : await getProducts();

  let productsHTML = '';
  for (const [index, product] of products.entries()) {
    const highFetchPriority =
      index <= FETCH_CONFIG.HIGH_PRIORITY_THRESHOLD ? true : false;
    productsHTML += generateAmazonHTML(product, highFetchPriority);
  }
  const trustedProductsHTML = policy?.createHTML(productsHTML);
  checkTruthy(trustedProductsHTML);
  productsGrid.insertAdjacentHTML('beforeend', trustedProductsHTML as any);

  function displayAdded(productId: string) {
    const addedToCart = document.querySelector(
      `.added-to-cart-${productId}`,
    );
    checkTruthy(addedToCart, 'Fail to select HTML element');
    addedToCart.classList.add('display-added-to-cart');
    setTimeout(() => {
      addedToCart.classList.remove('display-added-to-cart');
    }, UI_TIMEOUTS.ADDED_TO_CART_DISPLAY);
  }

  productsGrid.addEventListener('click', (event) => {
    const button = <HTMLElement>event.target;
    if (!button.classList.contains('add-to-cart-button')) {
      return;
    }

    const { productId } = button.dataset;
    const productContainer = button.parentElement;
    const quantitySelectorHTML =
      productContainer?.querySelector<HTMLInputElement>(
        '.ProductQuantitySelector',
      );
    checkTruthy(
      quantitySelectorHTML,
      'Fail to get the HTML element or the product id dataset is incorrect',
    );
    checkTruthy(
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
    const cartQuantity = calculateCartQuantity();
    const returnToHomeLink = document.querySelector('.cart-quantity');
    checkTruthy(returnToHomeLink);
    returnToHomeLink.textContent = `${cartQuantity}`;

    displayAdded(productId);
  });
  const cartQuantity = calculateCartQuantity();
  const returnToHomeLink = document.querySelector('.cart-quantity');
  checkTruthy(returnToHomeLink);
  returnToHomeLink.textContent = `${cartQuantity}`;

  url.searchParams.delete('q');
  history.replaceState(null, '', url.toString());
}

await Promise.allSettled([renderAmazonHomePage(), handleSearchInput()]);
