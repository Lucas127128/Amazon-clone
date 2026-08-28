import { LiteDebouncer } from '@tanstack/pacer-lite';
import { app } from 'api-client';

import { getProductsName } from '#lib/products.remote.ts';

export const searchProductsSuggestions = new LiteDebouncer(
  async (searchTerm: string, fn: (productsName: string[]) => void) => {
    const { data: searchResults, error } =
      await app.api.search.products.post({
        q: searchTerm,
        limit: 3,
      });
    if (error) throw error;
    const names = await getProductsName(searchResults);
    fn(names);
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
