import { GlobalRegistrator } from '@happy-dom/global-registrator';
import { afterAll, afterEach, beforeAll, setSystemTime } from 'bun:test';

GlobalRegistrator.register({
  settings: {
    fetch: { disableStrictSSL: true, disableSameOriginPolicy: true },
  },
});

const fakeTime = new Date('2026-03-05T12:00:00.000Z');
setSystemTime(fakeTime);

afterEach(() => {
  localStorage.clear();
});

beforeAll(() => {
  localStorage.clear();
});

afterAll(() => {
  document.body.innerHTML = '';
  localStorage.clear();
});
