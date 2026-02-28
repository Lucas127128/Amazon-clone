import { Product, transformProducts } from '#data/products.ts';
import { app } from '../data/edenTreaty';
import { isHTMLInputElement } from './Utils/typeChecker';

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

export const handleSearch =
  async function searchProductsFromQuery(): Promise<
    readonly Product[] | undefined
  > {
    const url = new URL(location.href);
    const searchQuery = url.searchParams.get('q');
    if (!searchQuery) return;
    searchBar.value = searchQuery;
    const [
      { data: rawProducts, error: productsError },
      { data: clothings, error: clothingError },
    ] = await Promise.all([
      app.api.search.products({ q: searchQuery }).get(),
      app.api.clothingList.get(),
    ]);
    if (productsError) throw productsError;
    if (clothingError) throw clothingError;
    return transformProducts(rawProducts, clothings);
  };
