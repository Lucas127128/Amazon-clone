import { checkNullish } from 'shared/typeChecker';

import { fetchProducts } from '#data/products.ts';

import { cartQuantity } from '../data/cart.ts';
import { getURLParams } from '../utils/url.ts';
import { renderProducts } from './amazon/products.ts';
import { handleSortSelect } from './amazon/sort.ts';
import { handleSearch, handleSearchInput } from './header.ts';

function renderAmazonHomePage() {
  const returnToHomeLink = document.querySelector('.cart-quantity');
  checkNullish(returnToHomeLink);
  cartQuantity.subscribe((cartQuantity) => {
    returnToHomeLink.textContent = `${cartQuantity}`;
  });
}

const { q: searchQuery } = getURLParams();
const products =
  searchQuery === null
    ? await fetchProducts()
    : await handleSearch(searchQuery);

renderProducts(products);
renderAmazonHomePage();
handleSortSelect(products);
handleSearchInput();
