import { getMatchingProduct, fetchProducts } from '#data/products.ts';
import { app } from '#root/shared/src/data/edenTreaty.ts';
import { checkNullish } from '#root/shared/src/utils/typeChecker.ts';
import 'typed-query-selector';

const searchBar = document.querySelector('input.search-bar');
checkNullish(searchBar);
const searchButton =
  document.querySelector<HTMLButtonElement>('.search-button');

function handleSearchBar() {
  checkNullish(searchBar);
  const searchQuery = searchBar.value;
  location.href = `/index.html?q=${searchQuery}`;
}

export async function handleSearchInput() {
  searchButton?.addEventListener('click', handleSearchBar);
  searchBar?.addEventListener('keyup', (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSearchBar();
    }
  });
}

export async function handleSearch(searchQuery: string) {
  checkNullish(searchBar);
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
    checkNullish(matchingProduct);
    matchingProduct.name = searchResult.name;
    return matchingProduct;
  });
}
