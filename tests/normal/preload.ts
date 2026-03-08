import 'fake-indexeddb/auto';
import { GlobalRegistrator } from '@happy-dom/global-registrator';
import { afterAll, afterEach, beforeAll } from 'bun:test';
import { clear } from 'idb-keyval';

GlobalRegistrator.register({
  settings: {
    fetch: { disableStrictSSL: true, disableSameOriginPolicy: true },
  },
});

afterEach(async () => {
  localStorage.clear();
  await clear();
});

beforeAll(async () => {
  localStorage.clear();
  await clear();
});

afterAll(async () => {
  document.body.innerHTML = '';
  localStorage.clear();
  await clear();
});
