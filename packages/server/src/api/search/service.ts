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
    `${string}:${number}`,
    { results: SearchResult; time: Temporal.ZonedDateTime }
  >();

  Bun.cron('10 * * * *', () => {
    setTimeout(() => {
      const now = Temporal.Now.zonedDateTimeISO();
      for (const [key, value] of cachedSearches) {
        const expirationTime = value.time.add(FETCH_CONFIG.SERVER_CACHE_TTL);
        if (Temporal.ZonedDateTime.compare(now, expirationTime) > 0) {
          cachedSearches.delete(key);
        }
      }
    }, 0);
  });
  return new Elysia().decorate('Search', {
    async searchProducts(query: string, limit: number = 5) {
      const log = createLogger();
      const cachedResult = cachedSearches.get(`${query}:${limit}`);
      if (cachedResult) return cachedResult.results;

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
      setTimeout(() => {
        cachedSearches.set(`${query}:${limit}`, {
          results,
          time: Temporal.Now.zonedDateTimeISO(),
        });
      }, 0);
      return results;
    },
  });
}
