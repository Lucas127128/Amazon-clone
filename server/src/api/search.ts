import { Elysia } from 'elysia';
import MiniSearch from 'minisearch';
import { getMatchingRawProduct } from '#root/shared/src/data/products.ts';
import { checkTruthy } from '#root/shared/src/utils/typeChecker.ts';
import {
  RawProduct,
  RawProductSchemaArray,
} from '#root/shared/src/schema.ts';

const products = await Bun.file(
  './server/src/api/rawProducts.json',
).json();
const productsSearch = new MiniSearch({
  fields: ['name', 'keywords'],
  storeFields: ['id'],
});
productsSearch.addAll(products);

const cachedSearches = new Map<string, RawProduct[]>();

function cleanupCache() {
  const keys = [...cachedSearches.keys()];
  for (const key in cachedSearches) {
    const index = keys.indexOf(key);
    if (index < 250) cachedSearches.delete(key);
  }
}

function setCache(q: string, resultProducts: RawProduct[]) {
  new Promise(() => {
    cachedSearches.size < 2000
      ? cachedSearches.set(q, resultProducts)
      : cleanupCache();
  }).catch((error) => {
    console.error(`Fail to set cache for products search: ${error}`);
  });
}

export const searchPlugin = new Elysia({ prefix: '/api/search' }).get(
  '/products/:q',
  ({ params: { q } }) => {
    const cachedSearch = cachedSearches.get(q);
    if (cachedSearch) return cachedSearch;

    const results = productsSearch.search(q, {
      boost: { name: 2 },
      fuzzy: 0.1,
      prefix: true,
    });
    const resultProducts = results.map((result) => {
      const product = getMatchingRawProduct(products, result.id);
      checkTruthy(product);
      return product;
    });
    setCache(q, resultProducts);
    return resultProducts;
  },
  {
    response: RawProductSchemaArray,
  },
);
