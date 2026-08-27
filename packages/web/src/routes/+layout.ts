import { fetchProducts } from '#lib/data/products.ts';

import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async () => {
  const { data: products, error } = await fetchProducts();
  if (error) throw error;
  return { products };
};
