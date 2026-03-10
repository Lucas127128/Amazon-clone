import { describe, expect, test } from 'bun:test';
import sleep from '#root/shared/src/utils/sleep.ts';

describe.concurrent('test suite: sleep', () => {
  test('sleep for correct time', async () => {
    const before = Number(performance.now());
    await sleep(10);
    // 1ms is typical time to generate performance.now()
    const after = Number(performance.now()) - 1;
    expect(after - before).toBeGreaterThan(8);
    expect(after - before).toBeLessThan(12);
  });
});
