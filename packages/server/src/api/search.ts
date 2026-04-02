import { Elysia } from 'elysia';
import { create, insertMultiple, search } from '@orama/orama';
import {
  RawProductSchemaArray,
  type SearchResult,
  SearchResultSchema,
} from 'shared/schema';
import { array, parse } from 'valibot';

const products = parse(
  RawProductSchemaArray,
  await Bun.file('../server/src/api/rawProducts.json').json(),
);

const productsSearch = create({
  schema: {
    name: 'string',
    id: 'string',
  },
});
await insertMultiple(productsSearch, products);

const cachedSearches = new Map<string, SearchResult[]>();
function cleanupCache() {
  const keys = [...cachedSearches.keys()];
  for (const key in cachedSearches) {
    const index = keys.indexOf(key);
    //remove the oldest 250 cache
    if (index < 250) cachedSearches.delete(key);
  }
}

export const searchPlugin = new Elysia({ prefix: '/api/search' }).get(
  '/products/:q',
  async ({ params: { q } }) => {
    if (cachedSearches.size > 2000) {
      Promise.resolve()
        .then(() => cleanupCache())
        .catch((err: unknown) => console.error(err));
    }
    const results = (
      await search(productsSearch, {
        term: q,
        properties: ['name'],
        tolerance: 2,
      })
    ).hits.map((result) => {
      const name = result.document.name.replaceAll(q, `<em>${q}</em>`);
      result.document.name = name;
      return result.document;
    });
    return cachedSearches.getOrInsert(q, results);
  },
  {
    response: array(SearchResultSchema),
    detail: {
      description:
        'Get the search query using path params and return the search result.',
    },
  },
);
