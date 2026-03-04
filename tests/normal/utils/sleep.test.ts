import { describe, expect, test } from 'bun:test';
import sleep from '#root/src/scripts/Utils/sleep.ts';

describe.concurrent('test suite: sleep', () => {
  test('sleep for correct time', async () => {
    const before = Number(performance.now());
    await sleep(200);
    const after = Number(performance.now());
    expect(after - before).toBeGreaterThan(198);
    expect(after - before).toBeLessThan(202);
  });
});
