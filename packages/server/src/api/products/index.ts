import { Elysia } from 'elysia';
import { evlog } from 'evlog/elysia';
import {
  ClothingListSchema,
  RawProductSchema,
  RawProductSchemaArray,
} from 'shared/schema';
import { object, string } from 'valibot';

import { Service } from './service';

export const productsPlugin = new Elysia({ prefix: '/api' })
  .use(evlog())
  .onBeforeHandle(({ request, server, log }) => {
    const clientIP = server?.requestIP(request)?.address;
    log.set({ clientIp: clientIP });
  })
  .get('/products', () => Service.getProducts(), {
    response: RawProductSchemaArray,
    detail: {
      description: 'Return an array of products',
    },
  })
  .get(
    '/matchingProduct',
    ({ query }) => Service.getMatchingProduct(query.productId),
    {
      response: {
        200: RawProductSchema,
        404: object({ message: string() }),
      },
      query: object({ productId: RawProductSchema.entries.id }),
      detail: {
        description: 'Return a matching product from query',
      },
    },
  )
  .get('/clothingList', () => Service.getClothingList(), {
    response: ClothingListSchema,
    detail: {
      description: 'Return a list of product ids that are clothing',
    },
  });

console.log('Products api service starts');
