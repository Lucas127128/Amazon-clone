import {
  getMatchingProduct,
  fetchProducts,
} from '#root/shared/src/data/products.ts';
import { app } from '#root/shared/src/data/edenTreaty.ts';
import { checkTruthy } from '#root/shared/src/utils/typeChecker.ts';
import 'typed-query-selector';

const searchBar = document.querySelector('input.search-bar');
checkTruthy(searchBar);
const searchButton =
  document.querySelector<HTMLButtonElement>('.search-button');

function handleSearchBar() {
  checkTruthy(searchBar);
  const searchQuery = searchBar.value;
  location.href = `/index.html?q=${searchQuery}`;
}

export function handleSearchInput() {
  searchButton?.addEventListener('click', handleSearchBar);
  searchBar?.addEventListener('keyup', (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSearchBar();
    }
  });
}

export async function handleSearch(searchQuery: string) {
  checkTruthy(searchBar);
  searchBar.value = searchQuery;
  const { data: searchResults, error } = await app.api.search
    .products({ q: searchQuery })
    .get();
  if (error) throw error;
  const fullProducts = await fetchProducts();
  return searchResults.map((searchResult) => {
    const matchingProduct = getMatchingProduct(
      fullProducts,
      searchResult.id,
    );
    checkTruthy(matchingProduct);
    matchingProduct.name = matchingProduct.name.replaceAll(
      searchQuery,
      `<em>${searchQuery}</em>`,
    );
    return matchingProduct;
  });
}
