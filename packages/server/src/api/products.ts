import { Elysia } from 'elysia';
import { evlog } from 'evlog/elysia';
import { getMatchingRawProduct } from 'shared/products';
import {
  ClothingListSchema,
  RawProductSchema,
  RawProductSchemaArray,
} from 'shared/schema';
import { checkNullish } from 'shared/typeChecker';
import { object, parse } from 'valibot';

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
    ({ server, request, log, query }) => {
      const clientIP = server?.requestIP(request)?.address;
      log.set({ clientIp: clientIP });
      const matchingProduct = getMatchingRawProduct(
        products,
        query.productId,
      );
      checkNullish(matchingProduct);
      return matchingProduct;
    },
    {
      response: RawProductSchema,
      query: object({ productId: RawProductSchema.entries.id }),
      detail: {
        description: 'Return an matching product id from query',
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
