import {
  addToCart,
  calculateCartQuantity,
} from '#root/shared/src/data/cart.ts';
import { getProducts, Product } from '#root/shared/src/data/products.ts';
import { checkTruthy } from '../../../shared/src/utils/typeChecker';
import { generateAmazonHTML } from './htmlGenerators/amazonHTML';
import { handleSearch, handleSearchInput } from './header';
import { policy } from '../../../shared/src/utils/trustedTypes';

async function renderAmazonHomePage() {
  const productsGrid = document.querySelector('.products-grid');
  checkTruthy(productsGrid, 'Fail to select HTML element');
  const products: readonly Product[] =
    (await handleSearch()) || (await getProducts());

  let productsHTML = '';
  products.forEach((product, index) => {
    const highFetchPriority = index <= 14 ? true : false;
    productsHTML += generateAmazonHTML(product, highFetchPriority);
  });
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
    }, 1500);
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
        deliveryOptionId: '1',
      },
      true,
    );
    const cartQuantity = calculateCartQuantity();
    const returnToHomeLink = document.querySelector('.cart-quantity');
    checkTruthy(returnToHomeLink);
    returnToHomeLink.textContent = `${cartQuantity} items`;

    displayAdded(productId);
  });
  const cartQuantity = calculateCartQuantity();
  const returnToHomeLink = document.querySelector('.cart-quantity');
  checkTruthy(returnToHomeLink);
  returnToHomeLink.textContent = `${cartQuantity} items`;

  const url = new URL(location.href);
  url.searchParams.delete('q');
  history.replaceState(null, '', url.toString());
}

await Promise.allSettled([renderAmazonHomePage(), handleSearchInput()]);
