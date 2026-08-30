import Fuse from 'fuse.js';

import type { Product } from '#lib/data/products.ts';

export function searchProductNames(
  query: string,
  products: Product[],
  limit: number = 3,
) {
  return new Fuse(products, {
    useTokenSearch: true,
    keys: ['name'],
  })
    .search(query, { limit })
    .map((r) => r.item.name);
}

export function searchProductIds(
  query: string,
  products: Product[],
  limit: number = 5,
) {
  return new Fuse(products, {
    useTokenSearch: true,
    keys: ['name'],
  })
    .search(query, { limit })
    .map((r) => r.item.id);
}
