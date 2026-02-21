import { addToCart, displayCartQuantity } from '../data/cart';
import { getProducts, Product } from '../data/products';
import { checkTruthy } from './Utils/typeChecker';
import { generateAmazonHTML } from './htmlGenerators/amazonHTML';
import { handleSearch } from './header';

async function renderAmazonHomePage() {
  const productsGrid = document.querySelector('.products-grid');
  checkTruthy(productsGrid, 'Fail to select HTML element');
  const url = new URL(location.href);
  const productsFromURL = url.searchParams.get('products');
  const products: Product[] = productsFromURL
    ? JSON.parse(productsFromURL)
    : await getProducts();

  products.forEach((product) => {
    const productsHTML = generateAmazonHTML(product);
    productsGrid.insertAdjacentHTML('beforeend', productsHTML);
  });

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
    displayCartQuantity('cart-quantity');
    displayAdded(productId);
  });
  displayCartQuantity('cart-quantity');
  url.searchParams.delete('products');
  history.replaceState(null, '', url.toString());
}

Promise.try(() => {
  return Promise.all([renderAmazonHomePage(), handleSearch()]);
}).catch((error) => {
  console.error(`unexpected error: ${error}`);
});
