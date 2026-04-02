import { cartQuantity } from 'shared/cart';
import { fetchProducts } from 'shared/products';
import { checkNullish } from 'shared/typeChecker';
import { handleSearch, handleSearchInput } from './header.ts';
import { effect } from '@preact/signals-core';
import { renderProducts } from './amazon/products.ts';
import { handleSortSelect } from './amazon/sort.ts';
import { all } from 'better-all';
import { getURLParams } from 'shared/url';

function renderAmazonHomePage() {
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
    handleSearch() {
      return handleSearchInput();
    },
    renderHomePage() {
      return renderAmazonHomePage();
    },
    async products() {
      const { q: searchQuery } = getURLParams();
      return searchQuery === null
        ? await fetchProducts()
        : await handleSearch(searchQuery);
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
