import { treaty } from '@elysiajs/eden';
import type { App } from '#root/server/src/api/server.ts';
import { Temporal } from 'temporal-polyfill-lite';
import { FETCH_CONFIG, GLOBAL_CONFIG } from '#root/config/constants.ts';
import type { HttpMethods } from '../schema';

type CacheData = {
  body: string;
  time: Temporal.InstantLike;
};
type CacheKey = { method: HttpMethods; url: string; requestBody: string };
const cacheMap = new Map<CacheKey, CacheData>();

async function cachedFetch(
  input: string | URL | Request,
  init?: RequestInit,
) {
  try {
    if (Bun.env.NODE_ENV === 'test') return fetch(input, init);
  } catch (err) {
    const _err = err;
  }
  const url =
    typeof input === 'string'
      ? input
      : input instanceof URL
        ? input.toString()
        : input.url;
  const method = (init?.method ??
    (input instanceof Request ? input.method : 'GET')) as HttpMethods;
  const body = JSON.stringify(init?.body);
  const cacheKey = {
    method: method,
    url: url,
    requestBody: body,
  } satisfies CacheKey;

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
    .catch((err) => console.error(err));
  return response;
}

export const app = treaty<App>(GLOBAL_CONFIG.API_URL, {
  fetcher: cachedFetch as typeof fetch,
});
