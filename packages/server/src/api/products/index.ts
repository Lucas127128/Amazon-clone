import { Elysia } from 'elysia';
import { log } from 'evlog';
import { evlog } from 'evlog/elysia';
import {
  ClothingListSchema,
  RawProductSchema,
  RawProductsSchema,
} from 'shared/schema';
import { array, object, string } from 'valibot';

import { createProdDataProvider } from '#utils/dataProvider.ts';

import { createProductsService } from './service.ts';

const Service = createProductsService(await createProdDataProvider());

export const productsPlugin = new Elysia({ prefix: '/api' })
  .use(evlog())
  .onStart(() => {
    log.info('api', 'Products api service starts');
  })
  .onBeforeHandle(({ request, server, log }) => {
    const clientIP = server?.requestIP(request)?.address;
    log.set({ clientIp: clientIP });
  })
  .get('/products', () => Service.getProducts(), {
    response: RawProductsSchema,
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
  .post(
    '/matchingProducts',
    ({ body }) => Service.getMatchingProducts(body),
    {
      response: {
        200: RawProductsSchema,
        404: object({ message: string() }),
      },
      body: array(RawProductSchema.entries.id),
      detail: {
        description: 'Return matching products from requested product ids',
      },
    },
  )
  .get('/clothingList', () => Service.getClothingList(), {
    response: ClothingListSchema,
    detail: {
      description: 'Return a list of product ids that are clothing',
    },
  });
