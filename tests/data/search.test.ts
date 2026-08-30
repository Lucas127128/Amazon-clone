import { describe, expect, it } from 'vitest';

import type { Product } from '#lib/data/products.ts';
import { searchProductIds, searchProductNames } from '#lib/data/search.ts';
import { productsJson } from '#testdata';

describe.concurrent('searchProductNames', () => {
  it('return correct product names', () => {
    const result = searchProductNames(
      '2 Slot Toaster - Black',
      productsJson as Product[],
      5,
    );
    expect(
      result.some((productName) => productName === '2 Slot Toaster - Black'),
    ).toBe(true);
    expect(result.length).toBe(5);
  });
});

describe.concurrent('searchProductIds', () => {
  it('return correct product ids', () => {
    const ids = searchProductIds(
      '2 Slot Toaster - Black',
      productsJson as Product[],
      3,
    );
    expect(ids.length).toBe(3);
  });
});
