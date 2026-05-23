import 'typed-query-selector';

import { Highlight } from '@orama/highlight';
import { liteDebounce } from '@tanstack/pacer-lite';
import { app } from 'api-client';
import { checkNullish } from 'shared/typeChecker';

import { fetchProducts } from '#data/products.ts';

const searchBar = document.querySelector('input.search-bar');
checkNullish(searchBar);
const searchButton =
  document.querySelector<HTMLButtonElement>('.search-button');

function handleSearchBar() {
  checkNullish(searchBar);
  const searchQuery = searchBar.value;
  location.href = `/index.html?q=${searchQuery}`;
}

const debouncedSearch = liteDebounce(
  async (searchTerm: string) => {
    const { data: searchResults, error } =
      await app.api.search.products.post({
        q: searchTerm,
        limit: 1,
      });
    if (error) throw error;
    const products = await fetchProducts(searchResults);
    const searchSuggestions = document.querySelector(
      'datalist#search-suggestions',
    );
    for (const product of products) {
      const option = document.createElement('option');
      option.value = product.name;
      searchSuggestions?.replaceChildren();
      searchSuggestions?.insertAdjacentElement('beforeend', option);
    }
  },
  { wait: 450 },
);

export function handleSearchInput() {
  searchButton?.addEventListener('click', handleSearchBar);
  searchBar?.addEventListener('keyup', (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSearchBar();
    }
    if (location.pathname === '/index.html') {
      debouncedSearch(searchBar.value);
    }
  });
}

export async function handleSearch(searchQuery: string) {
  checkNullish(searchBar);
  searchBar.value = searchQuery;
  const { data: searchResults, error } =
    await app.api.search.products.post({ q: searchQuery });
  if (error) throw error;
  const products = await fetchProducts(searchResults);
  return products.map((product) => {
    const highlighter = new Highlight({
      HTMLTag: 'em',
      strategy: 'partialMatch',
    });
    const highlighted = highlighter.highlight(product.name, searchQuery);
    product.name = highlighted.HTML;
    return product;
  });
}
