import clothing from 'server/clothing' with { type: 'json' };
import rawProducts from 'server/rawProducts' with { type: 'json' };
import { GLOBAL_CONFIG } from 'shared/constants';
import { wrapper } from 'shared/edenTreaty';
import { Temporal } from 'temporal-polyfill-lite';
import { afterEach, vi } from 'vitest';

vi.stubEnv('TZ', 'UTC');
const fakeTime = Temporal.ZonedDateTime.from(
  '2026-03-05T12:00:00.000[UTC]',
).toString({
  timeZoneName: 'never',
});
vi.setSystemTime(fakeTime);
vi.useFakeTimers();

vi.spyOn(wrapper, 'cachedFetch').mockImplementation(
  async (input: string | URL | Request, init?: RequestInit) => {
    const url =
      typeof input === 'string'
        ? input
        : input instanceof URL
          ? input.toString()
          : input.url;
    if (url === `${GLOBAL_CONFIG.API_URL}/api/products`) {
      return Response.json(rawProducts);
    } else if (url === `${GLOBAL_CONFIG.API_URL}/api/clothingList`) {
      return Response.json(clothing);
    } else {
      return await fetch(input, init);
    }
  },
);

afterEach(() => {
  localStorage.clear();
});
