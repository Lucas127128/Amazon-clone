import { parse } from 'valibot';
import { describe, expect, it } from 'vitest';

import { loadJson, saveJson } from '#lib/data/storage.ts';
import { OrderSchema, OrdersSchema } from '#lib/schema.ts';
import { orderJson } from '#testdata';

const order = parse(OrderSchema, orderJson);

describe.concurrent('saveJson', () => {
  it('no-ops when localStorage is missing', () => {
    expect(() => {
      saveJson('orders', [order]);
    }).not.toThrow();
  });
});

describe.concurrent('loadJson', () => {
  it('returns an empty array when localStorage is missing', () => {
    expect(loadJson('orders', OrdersSchema)).toEqual([]);
  });

  it('returns the provided default when localStorage is missing', () => {
    expect(loadJson('orders', OrdersSchema, [order])).toEqual([order]);
  });
});
