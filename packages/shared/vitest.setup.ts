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
