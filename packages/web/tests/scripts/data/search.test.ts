// import { GLOBAL_CONFIG } from 'shared/constants';
import type { Product } from 'shared/products';
import { describe, expect, it, vi } from 'vitest';

import {
  searchProducts,
  searchProductsSuggestions,
} from '#data/search.ts';

describe.concurrent('searchProducts', () => {
  it('return correct unhighlighted products', async () => {
    const result = await searchProducts(
      '2 Slot Toaster - Black',
      5,
      false,
    );
    expect(
      result.some((product) => product.name === '2 Slot Toaster - Black'),
    ).toBe(true);
    expect(result.length).toBe(5);
  });
  it('returns correct highlighted products', async () => {
    const result = await searchProducts('2 Slot Toaster - Black', 4, true);
    expect(
      result.some(
        (product) =>
          product.name
            .replaceAll('<em class="orama-highlight">', '')
            .replaceAll('</em>', '') === '2 Slot Toaster - Black',
      ),
    ).toBe(true);
    expect(result.length).toBe(4);
  });
});

describe('searchProductsSuggestions', { concurrent: false }, () => {
  it('runs callback with products', async () => {
    const productsArg: Product[] = [];
    const fn = (products: readonly Product[]) => {
      productsArg.push(...products);
    };
    searchProductsSuggestions.maybeExecute('2 Slot Toaster - Black', fn);
    expect(productsArg.length).toBe(0);
    searchProductsSuggestions.flush();
    await vi.waitUntil(() => productsArg.length === 3, {
      timeout: 35,
      interval: 5,
    });
    expect(productsArg.length).toBe(3);
  });
});
