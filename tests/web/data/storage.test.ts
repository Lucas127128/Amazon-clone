import { parse } from 'valibot';
import { afterAll, describe, expect, it } from 'vitest';

import { STORAGE_KEYS } from '#lib/data/constants.ts';
import { saveJson } from '#lib/data/storage.ts';
import { OrderSchema } from '#lib/schema.ts';
import { orderJson } from '#testdata';

describe.concurrent('saveJson', () => {
  afterAll(() => {
    localStorage.clear();
  });

  it('writes JSON to localStorage', () => {
    const order = parse(OrderSchema, orderJson);
    saveJson(STORAGE_KEYS.ORDER, [order]);
    expect(
      JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDER) ?? 'null'),
    ).toEqual([order]);
  });
});
