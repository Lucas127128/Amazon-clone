import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';
import { fromTypes, openapi } from '@elysiajs/openapi';
import { localHttps } from 'elysia-local-https';
import { productsPlugin } from './products.ts';
import { orderPlugin } from './orders.ts';
import { staticPlugin } from './static.ts';
import { searchPlugin } from './search.ts';
import { toJsonSchema } from '@valibot/to-json-schema';
import { GLOBAL_CONFIG } from '#root/config/constants.ts';

export const app = new Elysia({ precompile: true })
  .onBeforeHandle(({ set }) => {
    set.headers['content-type'] = 'application/json';
    set.headers['cache-control'] = 'public, max-age=86400';
  })
  .onAfterResponse(({ set }) => {
    console.log(set.status);
  })
  .use(
    cors({
      origin: [
        'http://localhost:63315',
        GLOBAL_CONFIG.API_URL,
        GLOBAL_CONFIG.PREVIEW_URL,
        GLOBAL_CONFIG.CADDY_URL,
      ],
      credentials: true,
      allowedHeaders: ['Content-Type', 'Authorization'],
    }),
  )
  .use(
    openapi({
      references: fromTypes('server/src/api/server.ts'),
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
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);

export type App = typeof app;
