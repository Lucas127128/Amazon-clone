import { Elysia, file } from 'elysia';
import { Temporal } from 'temporal-polyfill';

export const productsPlugin = new Elysia()
  .get('/products', ({ request, server }) => {
    const clientIP = server?.requestIP(request)?.address;
    const now = Temporal.Now.plainTimeISO().toString();
    console.log(`new products request from ${clientIP} at ${now}`);
    return file('./src/api/rawProducts.json');
  })
  .get('/clothingList', ({ request, server }) => {
    const clientIP = server?.requestIP(request)?.address;
    const now = Temporal.Now.plainTimeISO().toString();
    console.log(`new clothing request from ${clientIP} at ${now}`);
    return file('./src/api/clothing.json');
  });

console.log(`🦊 Elysia is running`);

console.log('Products api service starts');
