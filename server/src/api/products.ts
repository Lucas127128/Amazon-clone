import { Elysia } from 'elysia';
import { Temporal } from 'temporal-polyfill-lite';
import {
  ClothingListSchema,
  RawProductSchemaArray,
} from '#root/shared/src/schema.ts';
import { array, parse, string } from 'valibot';

const products = parse(
  RawProductSchemaArray,
  await Bun.file('./server/src/api/rawProducts.json').json(),
);
const clothings = parse(
  array(string()),
  await Bun.file('./server/src/api/clothing.json').json(),
);

export const productsPlugin = new Elysia({ prefix: '/api' })
  .get(
    '/products',
    async ({ request, server, set }) => {
      const clientIP = server?.requestIP(request)?.address;
      const now = Temporal.Now.plainTimeISO().toString();
      set.headers['cache-control'] = 'public, max-age=86400';

      console.log(`new products request from ${clientIP} at ${now}`);
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
    ({ request, server }) => {
      const clientIP = server?.requestIP(request)?.address;
      const now = Temporal.Now.plainTimeISO().toString();
      console.log(`new clothing request from ${clientIP} at ${now}`);
      return clothings;
    },
    {
      response: ClothingListSchema,
      detail: {
        description: 'Return a list of product ids that are clothing',
      },
    },
  );

console.log(`🦊 Elysia is running`);

console.log('Products api service starts');
