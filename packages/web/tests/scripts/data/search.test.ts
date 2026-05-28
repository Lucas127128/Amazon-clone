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
  it('throws on search API error', async () => {
    await expect(searchProducts('SEARCH_ERROR')).rejects.toThrow(
      '[object Object]',
    );
  });
  it('throws on fetchProducts error', async () => {
    await expect(searchProducts('FETCH_ERROR')).rejects.toThrow(
      '[object Object]',
    );
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
  it('handles search API error', () => {
    const fn = vi.fn<() => void>();
    process.on('unhandledRejection', async () => await Promise.resolve());
    searchProductsSuggestions.maybeExecute('SEARCH_ERROR', fn);
    searchProductsSuggestions.flush();
    expect(fn).not.toHaveBeenCalled();
  });
  it('handles fetchProducts error', () => {
    const fn = vi.fn<() => void>();
    process.on('unhandledRejection', async () => await Promise.resolve());
    searchProductsSuggestions.maybeExecute('FETCH_ERROR', fn);
    searchProductsSuggestions.flush();
    expect(fn).not.toHaveBeenCalled();
  });
});
