import { StandardSchemaV1 } from '@sveltejs/kit/internal/types';
import { Temporal } from 'temporal-polyfill-lite';
import { vi } from 'vitest';

vi.stubEnv('TZ', 'UTC');
const fakeTime = Temporal.ZonedDateTime.from({
  year: 2026,
  month: 3,
  day: 5,
  hour: 12,
  timeZone: 'UTC',
}).toString({ timeZoneName: 'never' });
vi.setSystemTime(fakeTime);
vi.useFakeTimers();

vi.mock('$app/server', () => ({
  query:
    (
      first: (arg?: unknown) => unknown,
      second?: (arg?: unknown) => unknown,
    ) =>
    (arg: unknown) => {
      if (!second) {
        return first(arg);
      } else {
        return second(arg);
      }
    },
  command:
    (
      first: (arg?: unknown) => unknown,
      second?: (arg?: unknown) => unknown,
    ) =>
    (arg: unknown) => {
      if (!second) {
        return first(arg);
      } else {
        return second(arg);
      }
    },
}));
