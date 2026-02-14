import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';
import { productsPlugin } from './products.ts';
import { orderPlugin } from './orders.ts';
import { Temporal } from 'temporal-polyfill';

const app = new Elysia({ precompile: true })
  .onAfterHandle(({ set }) => {
    set.headers['content-type'] = 'application/json';
  })
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
