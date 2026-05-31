import { effect } from 'alien-signals';
import { checkNullish } from 'shared/typeChecker';

import { fetchProducts } from '#data/products.ts';

import { cartQuantity } from '../data/cart.ts';
import { getURLParams } from '../utils/url.ts';
import { handleAddToCart, renderProducts } from './amazon/products.ts';
import { handleSortSelect } from './amazon/sort.ts';
import { handleSearch, handleSearchInput } from './header.ts';

const a = new Image();
a.src = '/images/products/electric-glass-and-steel-hot-water-kettle.webp';
a.fetchPriority = 'high';
a.loading = 'eager';

function renderAmazonHomePage() {
  const returnToHomeLink = document.querySelector('.cart-quantity');
  checkNullish(returnToHomeLink);
  effect(() => {
    returnToHomeLink.textContent = `${cartQuantity()}`;
  });
}

const { q: searchQuery } = getURLParams();

if (searchQuery === null) {
  const { data: products, error } = await fetchProducts();
  if (error) throw error;
  renderProducts(products);
  handleSortSelect(products);
} else {
  const products = await handleSearch(searchQuery);
  renderProducts(products);
  handleSortSelect(products);
}
renderAmazonHomePage();
handleAddToCart();
handleSearchInput();

if (searchQuery !== null) {
  const url = new URL(location.href);
  url.searchParams.delete('q');
  history.replaceState(null, '', url.toString());
}
