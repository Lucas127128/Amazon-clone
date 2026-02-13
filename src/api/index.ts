import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';
import { fetchProducts } from '../data/products.ts';
import { productsPlugin } from './products.ts';
import { orderPlugin } from './orders.ts';
import { kyInternal } from '../data/ky.ts';
import { Temporal } from 'temporal-polyfill';

export async function loadProducts() {
  try {
    await fetchProducts(kyInternal);
  } catch (error) {
    console.log(error);
  }
}

const app = new Elysia()
  .onAfterResponse(({ set }) => {
    console.log(set.status);
  })
  .use(
    cors({
      origin: [
        'http://localhost:5174',
        'http://localhost:63315',
        'https://localhost:8080',
        'https://localhost',
      ],
      credentials: true,
      allowedHeaders: ['Content-Type', 'Authorization'],
    }),
  )
  .use(productsPlugin)
  .use(orderPlugin)
  .decorate('getTime', Temporal.PlainTime.toString())
  .get('/', () => 'Hello Elysia')
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
