import { Elysia } from 'elysia';
import { evlog } from 'evlog/elysia';
import { SearchResultSchema } from 'shared/schema';
import { array, object, string } from 'valibot';

import { Service } from './service';

export const searchPlugin = new Elysia({ prefix: '/api/search' })
  .use(evlog())
  .use(Service)
  .onBeforeHandle(({ request, server, log, query }) => {
    const clientIP = server?.requestIP(request)?.address;
    log.set({ clientIp: clientIP, query: query.q });
  })
  .get(
    '/products',
    async ({ query, Search }) => await Search.searchProducts(query.q),
    {
      response: array(SearchResultSchema),
      query: object({ q: string() }),
      detail: {
        description:
          'Get the search query using path params and return the search result.',
      },
    },
  );
