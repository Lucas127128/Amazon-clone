import { describe, expect, it } from 'vitest';

import type { Product } from '#lib/data/products.ts';
import { searchProducts } from '#lib/data/search.ts';
import { productsJson } from '#testdata';

describe.concurrent('searchProducts', () => {
  it('return correct product names with explicit limit', () => {
    const result = searchProducts(
      '2 Slot Toaster - Black',
      productsJson as Product[],
      5,
    ).map((r) => r.item.name);
    expect(
      result.some((productName) => productName === '2 Slot Toaster - Black'),
    ).toBe(true);
    expect(result.length).toBe(5);
  });

  it('return correct product names with default limit', () => {
    const result = searchProducts(
      '2 Slot Toaster - Black',
      productsJson as Product[],
    ).map((r) => r.item.name);
    expect(
      result.some((productName) => productName === '2 Slot Toaster - Black'),
    ).toBe(true);
    expect(result.length).toBe(5);
  });

  it('return correct product ids with explicit limit', () => {
    const ids = searchProducts(
      '2 Slot Toaster - Black',
      productsJson as Product[],
      3,
    ).map((r) => r.item.id);
    expect(ids.length).toBe(3);
  });

  it('return correct product ids with default limit', () => {
    const ids = searchProducts(
      '2 Slot Toaster - Black',
      productsJson as Product[],
    ).map((r) => r.item.id);
    expect(ids.length).toBe(5);
  });
});
