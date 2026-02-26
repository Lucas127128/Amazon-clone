import {
  getMatchingProduct,
  getProducts,
  Product,
} from '#data/products.ts';
import { checkTruthy, isHTMLInputElement } from './Utils/typeChecker';
import MiniSearch from 'minisearch';

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
    Product[] | undefined
  > {
    const products = await getProducts();
    const productsSearch = new MiniSearch({
      fields: ['name', 'keywords'],
      storeFields: ['id'],
    });
    productsSearch.addAll(products);
    const url = new URL(location.href);
    const searchQuery = url.searchParams.get('q');
    if (!searchQuery) return;
    searchBar.value = searchQuery;

    const results = productsSearch.search(searchQuery, {
      boost: { name: 2 },
      fuzzy: 0.1,
      prefix: true,
    });
    const resultProducts = results
      .sort((a, b) => b.score - a.score)
      .map((result): Product => {
        const product = getMatchingProduct(products, result.id);
        checkTruthy(product);
        return product;
      });
    return resultProducts;
  };
