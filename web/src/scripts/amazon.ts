import { cartQuantity } from '#data/cart.ts';
import { fetchProducts } from '#data/products.ts';
import { checkNullish } from '#root/shared/src/utils/typeChecker.ts';
import { handleSearch, handleSearchInput } from './header';
import { effect } from '@preact/signals-core';
import { renderProducts } from './amazon/products';
import { handleSortSelect } from './amazon/sort';
import { all } from 'better-all';
import { getURLParams } from '#root/shared/src/utils/url.ts';

async function renderAmazonHomePage() {
  const returnToHomeLink = document.querySelector('.cart-quantity');
  checkNullish(returnToHomeLink);
  effect(
    () => {
      returnToHomeLink.textContent = `${cartQuantity.value}`;
    },
    { name: 'update cart quantity in dom' },
  );
}

await all(
  {
    async handleSearch() {
      return handleSearchInput();
    },
    async renderHomePage() {
      return renderAmazonHomePage();
    },
    async products() {
      const { q: searchQuery } = getURLParams();
      return searchQuery
        ? await handleSearch(searchQuery)
        : await fetchProducts();
    },
    async renderProducts() {
      return renderProducts(await this.$.products);
    },
    async handleSortSelect() {
      return handleSortSelect(await this.$.products);
    },
  },
  { debug: true },
);
