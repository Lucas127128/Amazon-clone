import { describe, expect, it, vi } from 'vitest';

import {
  searchProducts,
  searchProductsSuggestions,
} from '#lib/data/search.ts';

describe.concurrent('searchProducts', () => {
  it('return correct unhighlighted products', async () => {
    const result = await searchProducts('2 Slot Toaster - Black', 5);
    expect(result.some((productId) => productId === '7nDww')).toBe(true);
    expect(result.length).toBe(5);
  });
});

describe('searchProductsSuggestions', { concurrent: false }, () => {
  it('runs callback with products', async () => {
    const productIdsArg: string[] = [];
    const fn = (productIds: string[]) => {
      productIdsArg.push(...productIds);
    };
    searchProductsSuggestions.maybeExecute('2 Slot Toaster - Black', fn);
    expect(productIdsArg.length).toBe(0);
    searchProductsSuggestions.flush();
    await vi.waitUntil(() => productIdsArg.length === 3, {
      timeout: 35,
      interval: 5,
    });
    expect(productIdsArg.length).toBe(3);
  });
  it('handles search API error', () => {
    const fn = vi.fn<() => void>();
    process.on('unhandledRejection', async () => await Promise.resolve());
    searchProductsSuggestions.maybeExecute('SEARCH_ERROR', fn);
    searchProductsSuggestions.flush();
    expect(fn).not.toHaveBeenCalled();
  });
});
