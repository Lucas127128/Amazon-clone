import { Elysia } from 'elysia';
import { log } from 'evlog';
import {
  ClothingListSchema,
  ProductIdSchema,
  RawProductSchema,
  RawProductsSchema,
} from 'shared/schema';
import { array, object, string } from 'valibot';

import { createProdDataProvider } from '#utils/dataProvider.ts';
import { createEvlogMiddleware } from '#utils/logger.ts';

import { createProductsService } from './service.ts';

const Service = createProductsService(await createProdDataProvider());

export const productsPlugin = new Elysia({ prefix: '/api' })
  .use(createEvlogMiddleware())
  .onStart(() => {
    log.info({ event: 'service.start', service: 'products' });
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
      query: object({ productId: ProductIdSchema }),
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
      body: array(ProductIdSchema),
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
