import { Elysia } from 'elysia';
import { evlog } from 'evlog/elysia';
import { ClothingListSchema, RawProductSchemaArray } from 'shared/schema';
import { parse } from 'valibot';

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
