import { afterEach, vi } from 'vitest';

const fakeTime = new Date('2026-03-05T12:00:00.000Z');
vi.setSystemTime(fakeTime);
vi.useFakeTimers();

afterEach(() => {
  localStorage.clear();
});
