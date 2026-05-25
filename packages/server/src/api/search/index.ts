import { Elysia } from 'elysia';
import { log } from 'evlog';
import { evlog } from 'evlog/elysia';
import { SearchResultSchema } from 'shared/schema';
import { SearchOptionsSchema } from 'shared/schema';

import { Service } from './service';

export const searchPlugin = new Elysia({ prefix: '/api/search' })
  .onStart(() => {
    log.info('api', 'Search api service starts');
  })
  .use(evlog())
  .use(Service)
  .onBeforeHandle(({ request, server, log, query }) => {
    const clientIP = server?.requestIP(request)?.address;
    log.set({ clientIp: clientIP, query: query.q });
  })
  .post(
    '/products',
    async ({ body, Search }) =>
      await Search.searchProducts(body.q, body.limit),
    {
      response: SearchResultSchema,
      body: SearchOptionsSchema,
      detail: {
        description:
          'Get the search query with body and return the search result.',
      },
    },
  );
