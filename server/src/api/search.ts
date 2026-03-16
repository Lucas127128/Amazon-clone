import { Elysia } from 'elysia';
import MiniSearch, { SearchResult } from 'minisearch';
import { SearchResultSchema } from '#root/shared/src/schema.ts';
import { array } from 'valibot';

const products = await Bun.file(
  './server/src/api/rawProducts.json',
).json();
const productsSearch = new MiniSearch({
  fields: ['name'],
  storeFields: ['id'],
});
productsSearch.addAll(products);

const cachedSearches = new Map<string, SearchResult[]>();

function cleanupCache() {
  const keys = [...cachedSearches.keys()];
  for (const key in cachedSearches) {
    const index = keys.indexOf(key);
    //remove the oldest 250 cache
    if (index < 250) cachedSearches.delete(key);
  }
}

function setCache(q: string, result: SearchResult[]) {
  Promise.resolve()
    .then(() => {
      cachedSearches.size < 2000
        ? cachedSearches.set(q, result)
        : cleanupCache();
    })
    .catch((error) => {
      console.error(`Fail to set cache for products search: ${error}`);
    });
}

export const searchPlugin = new Elysia({ prefix: '/api/search' }).get(
  '/products/:q',
  ({ params: { q } }) => {
    const cachedSearch = cachedSearches.get(q);
    if (cachedSearch) return cachedSearch;

    const results = productsSearch.search(q, {
      fuzzy: 0.1,
      prefix: true,
    });
    setCache(q, results);
    return results;
  },
  {
    response: array(SearchResultSchema),
    detail: {
      description:
        'Get the search query using path params and return the products matching the query inside a product array',
    },
  },
);
