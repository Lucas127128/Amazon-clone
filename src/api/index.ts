import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';
import { localHttps } from 'elysia-local-https';
import { productsPlugin } from './products.ts';
import { orderPlugin } from './orders.ts';
import { staticPlugin } from './static.ts';

const app = new Elysia({ precompile: true })
  .mapResponse(async ({ responseValue }) => {
    const body = <string>await responseValue;
    const compressed = Bun.deflateSync(body);
    return new Response(compressed, {
      headers: {
        'Content-Encoding': 'deflate',
      },
    });
  })
  .onBeforeHandle(({ set }) => {
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
  .use(staticPlugin)
  .use(productsPlugin)
  .use(orderPlugin)
  .listen(localHttps({ port: 8080 }));

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
