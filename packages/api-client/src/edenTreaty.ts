import { treaty } from '@elysiajs/eden';
import ExpiryMap from 'expiry-map';
import pRetry from 'p-retry';
import type { App } from 'server';
import { FETCH_CONFIG, GLOBAL_CONFIG } from 'shared/constants';

type URL = string;
type ResponseBody = string;

export const cacheMap = new ExpiryMap<URL, ResponseBody>(
  FETCH_CONFIG.CLIENT_CACHE_TTL.seconds,
);

export const cachedFetch = async (
  input: string | Request,
  init?: RequestInit,
) => {
  const method =
    init?.method ?? (input instanceof Request ? input.method : 'GET');
  if (method !== 'GET')
    return await fetch(input, {
      signal: AbortSignal.timeout(5000),
      ...init,
    });
  const url =
    typeof input === 'string'
      ? input
      : input instanceof URL
        ? input.toString()
        : input.url;

  const cacheData = cacheMap.get(url);
  if (cacheData !== undefined) return new Response(cacheData);

  const response = await fetch(input, {
    signal: AbortSignal.timeout(5000),
    ...init,
  });

  Promise.resolve()
    .then(async () => {
      if (!response.ok) return;
      const cacheData = await response.clone().text();
      cacheMap.set(url, cacheData);
    })
    .catch((err: unknown) => console.error(err));
  return response;
};

const fetcher = async (input: string | Request, init?: RequestInit) => {
  return await pRetry(async () => await cachedFetch(input, init), {
    retries: 2,
  });
};

export const app = treaty<App>(GLOBAL_CONFIG.API_URL, {
  fetcher: fetcher as typeof fetch,
});
