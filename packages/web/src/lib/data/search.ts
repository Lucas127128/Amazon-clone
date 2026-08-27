import { LiteDebouncer } from '@tanstack/pacer-lite';
import { app } from 'api-client';
import type { Product } from 'shared/products';

import { fetchProducts } from './products.ts';

export const searchProductsSuggestions = new LiteDebouncer(
  async (searchTerm: string, fn: (products: readonly Product[]) => void) => {
    const { data: searchResults, error } =
      await app.api.search.products.post({
        q: searchTerm,
        limit: 3,
      });
    if (error) throw error;
    const { data: products, error: fetchError } =
      await fetchProducts(searchResults);
    if (fetchError) throw fetchError;
    fn(products);
  },
  { wait: 400 },
);

export async function searchProducts(query: string, limit: number = 5) {
  const { data: searchResults, error } = await app.api.search.products.post({
    q: query,
    limit,
  });
  if (error) throw error;
  return searchResults;
}
