import { Elysia } from 'elysia';
import { array, string } from 'valibot';
import { Temporal } from 'temporal-polyfill-lite';
import { RawProductSchema } from '../data/products';

const products = await Bun.file('./src/api/rawProducts.json').json();
const clothings = await Bun.file('./src/api/clothing.json').json();

export const productsPlugin = new Elysia({ prefix: '/api' })
  .get(
    '/products',
    async ({ request, server }) => {
      const clientIP = server?.requestIP(request)?.address;
      const now = Temporal.Now.plainTimeISO().toString();
      console.log(`new products request from ${clientIP} at ${now}`);
      return products;
    },
    {
      response: array(RawProductSchema),
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
      response: array(string()),
    },
  );

console.log(`🦊 Elysia is running`);

console.log('Products api service starts');
