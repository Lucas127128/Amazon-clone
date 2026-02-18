import { Elysia } from 'elysia';
import { Temporal } from 'temporal-polyfill-lite';

const products = await Bun.file('./src/api/rawProducts.json').text();
const clothings = await Bun.file('./src/api/clothing.json').text();

export const productsPlugin = new Elysia({ prefix: '/api' })
  .get('/products', async ({ request, server }) => {
    const clientIP = server?.requestIP(request)?.address;
    const now = Temporal.Now.plainTimeISO().toString();
    console.log(`new products request from ${clientIP} at ${now}`);
    return products;
  })
  .get('/clothingList', ({ request, server }) => {
    const clientIP = server?.requestIP(request)?.address;
    const now = Temporal.Now.plainTimeISO().toString();
    console.log(`new clothing request from ${clientIP} at ${now}`);
    return clothings;
  });

console.log(`🦊 Elysia is running`);

console.log('Products api service starts');
