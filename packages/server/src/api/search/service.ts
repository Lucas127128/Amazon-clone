import { create, insertMultiple, search } from '@orama/orama';
import { Elysia } from 'elysia';
import { FETCH_CONFIG } from 'shared/constants';
import type { SearchResult } from 'shared/schema';
import { Temporal } from 'temporal-polyfill-lite';

import type { DataProvider } from '#utils/dataProvider.ts';
import { createLogger } from '#utils/logger.ts';

export async function createSearchService(provider: DataProvider) {
  const { error, rawProducts } = provider;
  if (error) throw new Error(error.message as string);

  const productsSearch = create({
    schema: {
      id: 'string',
      name: 'string',
    },
  });
  await insertMultiple(productsSearch, rawProducts);

  const cachedSearches = new Map<
    { q: string; time: Temporal.ZonedDateTime },
    SearchResult
  >();

  return new Elysia()
    .onAfterResponse(() => {
      if (cachedSearches.size > 2000) {
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
      async searchProducts(query: string, limit: number = 5) {
        const log = createLogger();
        const results = (
          await search(productsSearch, {
            term: query,
            properties: ['name'],
            limit,
          })
        ).hits.map((result) => {
          return result.document.id;
        });
        log?.set({ query, resultCount: results.length });
        return cachedSearches.getOrInsert(
          { q: query, time: Temporal.Now.zonedDateTimeISO() },
          results,
        );
      },
    });
}
