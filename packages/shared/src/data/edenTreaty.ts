import { treaty } from '@elysiajs/eden';
import type { App } from 'server';
import { Temporal } from 'temporal-polyfill-lite';
import { FETCH_CONFIG, GLOBAL_CONFIG } from '../../config/constants.ts';
import type { HttpMethods } from '../schema.ts';

type CacheData = {
  body: string;
  time: Temporal.InstantLike;
};
type CacheKey = `${HttpMethods}:${string}:${string}`;
const cacheMap = new Map<CacheKey, CacheData>();

async function cachedFetch(
  input: string | URL | Request,
  init?: RequestInit,
) {
  // eslint-disable-next-line
  if (globalThis.Bun && Bun.env.NODE_ENV === 'test')
    return await fetch(input, init);
  const url =
    typeof input === 'string'
      ? input
      : input instanceof URL
        ? input.toString()
        : input.url;
  const method = (init?.method ??
    (input instanceof Request ? input.method : 'GET')) as HttpMethods;
  const body = JSON.stringify(init?.body);
  const cacheKey = `${method}:${url}:${body}` satisfies CacheKey;

  const now = Temporal.Now.instant();

  const cacheData = cacheMap.get(cacheKey);
  if (
    cacheData &&
    now.since(cacheData.time).subtract(FETCH_CONFIG.CACHE_TTL).seconds < 0
  )
    return new Response(cacheData.body);

  const response = await fetch(input, init);

  Promise.resolve()
    .then(async () => {
      if (!response.ok) return;
      const cacheData = {
        body: await response.clone().text(),
        time: now.toJSON(),
      };
      cacheMap.set(cacheKey, cacheData);
    })
    .catch((err: unknown) => console.error(err));
  return response;
}

export const app = treaty<App>(GLOBAL_CONFIG.API_URL, {
  fetcher: cachedFetch as typeof fetch,
});
