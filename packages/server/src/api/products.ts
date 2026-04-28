import { Elysia } from 'elysia';
import { evlog } from 'evlog/elysia';
import { getMatchingRawProduct } from 'shared/products';
import {
  ClothingListSchema,
  RawProductSchema,
  RawProductSchemaArray,
} from 'shared/schema';
import { object, parse, string } from 'valibot';

const products = parse(
  RawProductSchemaArray,
  await Bun.file('./src/api/rawProducts.json').json(),
);
const clothings = parse(
  ClothingListSchema,
  await Bun.file('./src/api/clothing.json').json(),
);

export const productsPlugin = new Elysia({ prefix: '/api' })
  .use(evlog())
  .get(
    '/products',
    ({ server, request, log }) => {
      const clientIP = server?.requestIP(request)?.address;
      log.set({ clientIp: clientIP });
      return products;
    },
    {
      response: RawProductSchemaArray,
      detail: {
        description: 'Return an array of products',
      },
    },
  )
  .get(
    '/matchingProduct',
    ({ server, request, log, query, status }) => {
      const clientIP = server?.requestIP(request)?.address;
      log.set({ clientIp: clientIP });
      const matchingProduct = getMatchingRawProduct(
        products,
        query.productId,
      );
      if (!matchingProduct) {
        return status('Not Found', { message: 'Product not found' });
      }
      return matchingProduct;
    },
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
  .get(
    '/clothingList',
    ({ server, request, log }) => {
      const clientIP = server?.requestIP(request)?.address;
      log.set({ clientIp: clientIP });
      return clothings;
    },
    {
      response: ClothingListSchema,
      detail: {
        description: 'Return a list of product ids that are clothing',
      },
    },
  );

console.log('Products api service starts');
