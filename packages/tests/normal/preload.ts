import clothing from 'server/clothing' with { type: 'json' };
import rawProducts from 'server/rawProducts' with { type: 'json' };
import { GLOBAL_CONFIG } from 'shared/constants';
import { wrapper } from 'shared/edenTreaty';
import { afterEach, vi } from 'vitest';

const fakeTime = new Date('2026-03-05T12:00:00.000Z');
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
