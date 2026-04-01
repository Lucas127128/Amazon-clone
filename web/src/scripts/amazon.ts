import { cartQuantity } from '#data/cart.ts';
import { fetchProducts, type Product } from '#data/products.ts';
import { checkNullish } from '#root/shared/src/utils/typeChecker.ts';
import { handleSearch, handleSearchInput } from './header';
import { effect } from '@preact/signals-core';
import { renderProducts } from './amazon/products';
import { handleSortSelect } from './amazon/sort';

async function renderAmazonHomePage() {
  const url = new URL(location.href);
  const searchQuery = url.searchParams.get('q');

  const products: readonly Product[] = searchQuery
    ? await handleSearch(searchQuery)
    : await fetchProducts();
  renderProducts(products);

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

await Promise.allSettled([
  renderAmazonHomePage(),
  handleSearchInput(),
  handleSortSelect(),
]);
