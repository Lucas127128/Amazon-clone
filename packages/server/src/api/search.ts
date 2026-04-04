import { create, insertMultiple, search } from '@orama/orama';
import { Elysia } from 'elysia';
import { evlog } from 'evlog/elysia';
import { FETCH_CONFIG } from 'shared/constants';
import {
  RawProductSchemaArray,
  type SearchResult,
  SearchResultSchema,
} from 'shared/schema';
import { Temporal } from 'temporal-polyfill-lite';
import { array, object, parse, string } from 'valibot';

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
  .use(evlog())
  .onAfterResponse(() => {
    if (cachedSearches.size > 2000) {
      cleanupCache();
    }
  })
  .get(
    '/products',
    async ({ query, log, server, request }) => {
      const clientIP = server?.requestIP(request)?.address;
      log.set({ clientIp: clientIP });
      const results = (
        await search(productsSearch, {
          term: query.q,
          properties: ['name'],
          tolerance: 2,
        })
      ).hits.map((result) => {
        const name = result.document.name.replaceAll(
          query.q,
          `<em>${query.q}</em>`,
        );
        return Object.assign(result.document, { name: name });
      });
      return cachedSearches.getOrInsert(
        { q: query.q, time: Temporal.Now.zonedDateTimeISO() },
        results,
      );
    },
    {
      response: array(SearchResultSchema),
      query: object({ q: string() }),
      detail: {
        description:
          'Get the search query using path params and return the search result.',
      },
    },
  );
