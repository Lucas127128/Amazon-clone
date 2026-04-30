import { cors } from '@elysiajs/cors';
import { fromTypes, openapi } from '@elysiajs/openapi';
import { toJsonSchema } from '@valibot/to-json-schema';
import { Elysia } from 'elysia';
import { localHttps } from 'elysia-local-https';
import { GLOBAL_CONFIG } from 'shared/constants';

import { initEvlog } from '../utils/logger.ts';
import { orderPlugin } from './orders/index.ts';
import { productsPlugin } from './products/index.ts';
import { searchPlugin } from './search/index.ts';
import { staticPlugin } from './static.ts';

initEvlog();

export const app = new Elysia({ precompile: true, aot: true })
  .onError({ as: 'global' }, ({ code, error, status }) => {
    if (code === 'VALIDATION') {
      return Bun.env.PROD
        ? status(422, error.messageValue?.message)
        : status(422, error);
    }
    if (code === 'PARSE') {
      return Bun.env.PROD
        ? status(400, error.message)
        : status(400, error);
    }
    return error;
  })
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
