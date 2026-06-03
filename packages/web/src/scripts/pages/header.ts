import 'typed-query-selector';

import { checkNullish } from 'shared/typeChecker';

import { searchProducts, searchProductsSuggestions } from '#data/search.ts';

const searchBar = document.querySelector('input.search-bar');
checkNullish(searchBar);
const searchButton = document.querySelector('button.search-button');

function handleSearchBar() {
  checkNullish(searchBar);
  const searchQuery = searchBar.value;
  location.href = `/index.html?q=${searchQuery}`;
}

export function handleSearchInput() {
  searchButton?.addEventListener('click', handleSearchBar);
  searchBar?.addEventListener('keyup', (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSearchBar();
    }
    if (location.pathname === '/index.html') {
      searchProductsSuggestions.maybeExecute(searchBar.value, (products) => {
        const searchSuggestions = document.querySelector(
          'datalist#search-suggestions',
        );
        searchSuggestions?.replaceChildren();
        for (const product of products) {
          const option = document.createElement('option');
          option.value = product.name;
          searchSuggestions?.insertAdjacentElement('beforeend', option);
        }
      });
    }
  });
}

export async function handleSearch(searchQuery: string) {
  checkNullish(searchBar);
  searchBar.value = searchQuery;
  return await searchProducts(searchQuery);
}
