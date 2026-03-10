import 'fake-indexeddb/auto';
import { GlobalRegistrator } from '@happy-dom/global-registrator';
import { afterAll, afterEach, beforeAll, setSystemTime } from 'bun:test';
import { clear } from 'idb-keyval';

GlobalRegistrator.register({
  settings: {
    fetch: { disableStrictSSL: true, disableSameOriginPolicy: true },
  },
});

const fakeTime = new Date('2026-03-05T12:00:00.000Z');
setSystemTime(fakeTime);

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
