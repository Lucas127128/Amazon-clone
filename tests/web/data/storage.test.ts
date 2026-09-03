import { parse } from 'valibot';
import { afterAll, describe, expect, it } from 'vitest';

import { loadJson, saveJson } from '#lib/data/storage.ts';
import { OrderSchema, OrdersSchema } from '#lib/schema.ts';
import { orderJson } from '#testdata';

const order = parse(OrderSchema, orderJson);

afterAll(() => {
  localStorage.clear();
});

describe.concurrent('saveJson', () => {
  it('writes JSON to localStorage', () => {
    saveJson('saveJson-write', [order]);
    expect(
      JSON.parse(localStorage.getItem('saveJson-write') ?? 'null'),
    ).toEqual([order]);
  });
});

describe.concurrent('loadJson', () => {
  it('returns an empty array when the key is missing', () => {
    expect(loadJson('loadJson-missing', OrdersSchema)).toEqual([]);
  });

  it('returns the provided default when the key is missing', () => {
    expect(
      loadJson('loadJson-custom-default', OrdersSchema, [order]),
    ).toEqual([order]);
  });

  it('parses stored JSON with the schema', () => {
    localStorage.setItem('loadJson-valid', JSON.stringify([order]));
    expect(loadJson('loadJson-valid', OrdersSchema)).toEqual([order]);
  });

  it('roundtrips values written by saveJson', () => {
    saveJson('loadJson-roundtrip', [order]);
    expect(loadJson('loadJson-roundtrip', OrdersSchema)).toEqual([order]);
  });

  it('throws when stored JSON fails the schema', () => {
    localStorage.setItem(
      'loadJson-invalid-schema',
      JSON.stringify([{ id: 'bad' }]),
    );
    expect(() => {
      loadJson('loadJson-invalid-schema', OrdersSchema);
    }).toThrow('Invalid length: Expected >=7 but received 3');
  });

  it('throws when stored value is not JSON', () => {
    localStorage.setItem('loadJson-invalid-json', 'not-json');
    expect(() => {
      loadJson('loadJson-invalid-json', OrdersSchema);
    }).toThrow('JSON Parse error');
  });
});
