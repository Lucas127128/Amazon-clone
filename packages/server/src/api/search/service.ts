import { create, insertMultiple, search } from '@orama/orama';
import { Elysia } from 'elysia';
import { FETCH_CONFIG } from 'shared/constants';
import { RawProductSchemaArray, type SearchResult } from 'shared/schema';
import { Temporal } from 'temporal-polyfill-lite';
import { parse } from 'valibot';

const products = parse(
  RawProductSchemaArray,
  await Bun.file('./rawData/rawProducts.json').json(),
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

export const Service = new Elysia()
  .onAfterResponse(() => {
    if (cachedSearches.size > 2000) {
      // cleanup cache
      const now = Temporal.Now.zonedDateTimeISO();
      for (const key of cachedSearches.keys()) {
        const expirationTime = key.time.add(FETCH_CONFIG.CACHE_TTL);
        if (Temporal.ZonedDateTime.compare(now, expirationTime) > 0) {
          cachedSearches.delete(key);
        }
      }
    }
  })
  .decorate('Search', {
    async searchProducts(query: string) {
      const results = (
        await search(productsSearch, {
          term: query,
          properties: ['name'],
          tolerance: 2,
        })
      ).hits.map((result) => {
        const name = result.document.name.replaceAll(
          query,
          `<em>${query}</em>`,
        );
        return Object.assign(result.document, { name: name });
      });
      return cachedSearches.getOrInsert(
        { q: query, time: Temporal.Now.zonedDateTimeISO() },
        results,
      );
    },
  });
