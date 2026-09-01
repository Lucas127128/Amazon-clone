import { searchProducts } from '#lib/data/search.ts';

import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent, url }) => {
  const { products } = await parent();
  const query = url.searchParams.get('q');

  if (query !== null) {
    return {
      searchedProducts: searchProducts(query, products).map(
        (result) => result.item,
      ),
      products,
      query,
    };
  } else {
    return { products };
  }
};
