import { getMatchingProduct, getProducts } from '../data/products';
import { checkTruthy, isHTMLInputElement } from './Utils/typeChecker';
import MiniSearch from 'minisearch';

const searchBar = document.querySelector('.search-bar');
const searchButton =
  document.querySelector<HTMLButtonElement>('.search-button');

export async function handleSearch() {
  const products = await getProducts();
  const productsSearch = new MiniSearch({
    fields: ['name', 'keywords'],
    storeFields: ['id'],
  });
  productsSearch.addAll(products);

  searchButton?.addEventListener('click', () => {
    console.time('search');
    isHTMLInputElement(searchBar);
    const searchQuery = searchBar.value;
    const results = productsSearch.search(searchQuery, {
      boost: { name: 2 },
      fuzzy: 0.3,
    });
    const resultProducts = results
      .sort((a, b) => b.score - a.score)
      .map((result) => {
        const product = getMatchingProduct(products, result.id);
        checkTruthy(product);
        return product;
      });
    const resultProductsString = JSON.stringify(resultProducts);
    console.timeEnd('search');
    location.href = `/index.html?products=${resultProductsString}`;
  });
}
