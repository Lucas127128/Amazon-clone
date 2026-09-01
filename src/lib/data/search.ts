import Fuse from 'fuse.js';

import type { Product } from '#lib/data/products.ts';

export function searchProducts(
  query: string,
  products: Product[],
  limit: number = 5,
) {
  return new Fuse(products, {
    useTokenSearch: true,
    keys: ['name'],
  }).search(query, { limit });
}
