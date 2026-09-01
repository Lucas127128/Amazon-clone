import { describe, expect, it } from 'vitest';

import { saveJson } from '#lib/data/storage.ts';

describe.concurrent('saveJson', () => {
  it('no-ops when localStorage is missing', () => {
    expect(() => {
      saveJson('orders', []);
    }).not.toThrow();
  });
});
