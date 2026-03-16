import {
  getMatchingProduct,
  getProducts,
} from '#root/shared/src/data/products.ts';
import { app } from '#root/shared/src/data/edenTreaty.ts';
import {
  checkTruthy,
  isHTMLInputElement,
} from '#root/shared/src/utils/typeChecker.ts';

const searchBar = document.querySelector('.search-bar');
isHTMLInputElement(searchBar);
const searchButton =
  document.querySelector<HTMLButtonElement>('.search-button');

function handleSearchBar() {
  isHTMLInputElement(searchBar);
  const searchQuery = searchBar.value;
  location.href = `/index.html?q=${searchQuery}`;
}

export function handleSearchInput() {
  searchButton?.addEventListener('click', handleSearchBar);
  isHTMLInputElement(searchBar);
  searchBar?.addEventListener('keyup', (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSearchBar();
    }
  });
}

export async function handleSearch(searchQuery: string) {
  isHTMLInputElement(searchBar);
  searchBar.value = searchQuery;
  const { data: searchResults, error } = await app.api.search
    .products({ q: searchQuery })
    .get();
  if (error) throw error;
  const fullProducts = await getProducts();
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
