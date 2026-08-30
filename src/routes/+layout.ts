import { getProducts } from '#lib/products.remote.ts';

import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async () => {
  const products = await getProducts();
  return { products };
};
