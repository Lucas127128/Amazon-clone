import { cors } from '@elysiajs/cors';
import { fromTypes, openapi } from '@elysiajs/openapi';
import { toJsonSchema } from '@valibot/to-json-schema';
import { Elysia } from 'elysia';
import { localHttps } from 'elysia-local-https';
import { GLOBAL_CONFIG } from 'shared/constants';

import { initEvlog } from '../utils/logger.ts';
import { orderPlugin } from './orders.ts';
import { productsPlugin } from './products.ts';
import { searchPlugin } from './search.ts';
import { staticPlugin } from './static.ts';

initEvlog();

export const app = new Elysia({ precompile: true, aot: true })
  .onBeforeHandle(({ set }) => {
    set.headers['content-type'] = 'application/json';
    set.headers['cache-control'] = 'public, max-age=86400';
  })
  .use(
    cors({
      origin: [
        'http://localhost:63315',
        GLOBAL_CONFIG.API_URL,
        GLOBAL_CONFIG.PREVIEW_URL,
        GLOBAL_CONFIG.CADDY_URL,
      ],
      allowedHeaders: ['Content-Type'],
    }),
  )
  .use(
    openapi({
      references: fromTypes('src/api/server.ts'),
      mapJsonSchema: {
        valibot: toJsonSchema,
      },
    }),
  )
  .use(staticPlugin)
  .use(productsPlugin)
  .use(orderPlugin)
  .use(searchPlugin)
  .listen(localHttps({ port: 8080 }));

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port} on pid: ${process.pid}`,
);

export type App = typeof app;
