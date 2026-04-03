import { create, insertMultiple, search } from '@orama/orama';
import { Elysia } from 'elysia';
import { FETCH_CONFIG } from 'shared/constants';
import {
  RawProductSchemaArray,
  type SearchResult,
  SearchResultSchema,
} from 'shared/schema';
import { Temporal } from 'temporal-polyfill-lite';
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

const cachedSearches = new Map<
  { q: string; time: Temporal.ZonedDateTime },
  SearchResult[]
>();
function cleanupCache() {
  const now = Temporal.Now.zonedDateTimeISO();
  for (const key of cachedSearches.keys()) {
    const expirationTime = key.time.add(FETCH_CONFIG.CACHE_TTL);
    if (Temporal.ZonedDateTime.compare(now, expirationTime) > 0) {
      cachedSearches.delete(key);
    }
  }
}

export const searchPlugin = new Elysia({ prefix: '/api/search' })
  .onAfterResponse(() => {
    if (cachedSearches.size > 2000) {
      cleanupCache();
    }
  })
  .get(
    '/products/:q',
    async ({ params: { q } }) => {
      const results = (
        await search(productsSearch, {
          term: q,
          properties: ['name'],
          tolerance: 2,
        })
      ).hits.map((result) => {
        const name = result.document.name.replaceAll(q, `<em>${q}</em>`);
        return Object.assign(result.document, { name: name });
      });
      return cachedSearches.getOrInsert(
        { q, time: Temporal.Now.zonedDateTimeISO() },
        results,
      );
    },
    {
      response: array(SearchResultSchema),
      detail: {
        description:
          'Get the search query using path params and return the search result.',
      },
    },
  );
