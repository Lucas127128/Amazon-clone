import { cors } from '@elysiajs/cors';
import { Elysia } from 'elysia';
import { localHttps } from 'elysia-local-https';
import { GLOBAL_CONFIG } from 'shared/constants';

import { initEvlog } from '../utils/logger.ts';
import { openApi } from '../utils/openApi.ts';
import { orderPlugin } from './orders/index.ts';
import { productsPlugin } from './products/index.ts';
import { searchPlugin } from './search/index.ts';
import { staticPlugin } from './static.ts';

initEvlog();

export const app = new Elysia({ precompile: true, aot: true })
  .onStart(({ server }) => {
    console.log(
      `🦊 Elysia is running at ${server?.hostname}:${server?.port} on pid: ${process.pid}`,
    );
  })
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
        GLOBAL_CONFIG.API_URL,
        GLOBAL_CONFIG.PREVIEW_URL,
        GLOBAL_CONFIG.CADDY_URL,
      ],
      allowedHeaders: ['Content-Type'],
    }),
  )
  .use(openApi())
  .use(staticPlugin)
  .use(productsPlugin)
  .use(orderPlugin)
  .use(searchPlugin)
  .listen(localHttps({ port: Bun.env.PORT ?? 8080 }));

export type App = typeof app;
