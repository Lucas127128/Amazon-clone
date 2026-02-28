import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';
import { localHttps } from 'elysia-local-https';
import { productsPlugin } from './products.ts';
import { orderPlugin } from './orders.ts';
import { staticPlugin } from './static.ts';
import { searchPlugin } from './search.ts';
import config from '#root/config.json';

const app = new Elysia({ precompile: true })
  .onBeforeHandle(({ set }) => {
    set.headers['content-type'] = 'application/json';
  })
  .onAfterResponse(({ set }) => {
    console.log(set.status);
  })
  .use(
    cors({
      origin: [
        'http://localhost:63315',
        config.apiURL,
        config.previewURL,
        config.caddyURL,
      ],
      credentials: true,
      allowedHeaders: ['Content-Type', 'Authorization'],
    }),
  )
  .use(staticPlugin)
  .use(productsPlugin)
  .use(orderPlugin)
  .use(searchPlugin)
  .listen(localHttps({ port: 8080 }));

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);

export type App = typeof app;
