import { Elysia } from 'elysia';
import { log } from 'evlog';
import { SearchOptionsSchema, SearchResultSchema } from 'shared/schema';

import { createProdDataProvider } from '../../utils/dataProvider.ts';
import { createEvlogMiddleware } from '../../utils/logger.ts';
import { createSearchService } from './service.ts';

const Service = await createSearchService(await createProdDataProvider());

export const searchPlugin = new Elysia({ prefix: '/api/search' })
  .onStart(() => {
    log.info({ event: 'service.start', service: 'search' });
  })
  .use(createEvlogMiddleware())
  .use(Service)
  .onBeforeHandle(({ request, server, log }) => {
    const clientIP = server?.requestIP(request)?.address;
    log.set({ clientIp: clientIP });
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
