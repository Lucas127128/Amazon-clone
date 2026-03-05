import { describe, expect, test } from 'bun:test';
import sleep from '#root/src/scripts/utils/sleep.ts';

describe.concurrent('test suite: sleep', () => {
  test('sleep for correct time', async () => {
    const before = Number(performance.now());
    await sleep(200);
    const after = Number(performance.now());
    expect(after - before).toBeGreaterThan(196);
    expect(after - before).toBeLessThan(204);
  });
});
