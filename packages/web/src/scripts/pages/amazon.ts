import { all } from 'better-all';
import { cartQuantity } from 'shared/cart';
import { fetchProducts } from 'shared/products';
import { checkNullish } from 'shared/typeChecker';

import { subscribe } from '../utils/store.ts';
import { getURLParams } from '../utils/url.ts';
import { renderProducts } from './amazon/products.ts';
import { handleSortSelect } from './amazon/sort.ts';
import { handleSearch, handleSearchInput } from './header.ts';

function renderAmazonHomePage() {
  const returnToHomeLink = document.querySelector('.cart-quantity');
  checkNullish(returnToHomeLink);
  subscribe(cartQuantity, (cartQuantity) => {
    returnToHomeLink.textContent = `${cartQuantity}`;
  });
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
