import type { Product } from 'shared/products';
import { ProductSortOptionsSchema } from 'shared/schema';
import { checkNullish } from 'shared/typeChecker';
import { parse } from 'valibot';

import { renderProducts } from './products.ts';

export function handleSortSelect(products: readonly Product[]) {
  const sortSelectHTML = document.querySelector('select.sort-select');
  checkNullish(sortSelectHTML);
  sortSelectHTML.addEventListener('change', () => {
    const productSortOption = parse(
      ProductSortOptionsSchema,
      sortSelectHTML.value,
    );
    type Comparator = Required<Parameters<typeof products.toSorted>>[0];
    const sortStrategies: Record<typeof productSortOption, Comparator> = {
      'most-people-star': (a, b) => b.ratingCount - a.ratingCount,
      'least-people-star': (a, b) => a.ratingCount - b.ratingCount,
      'most-expensive': (a, b) => b.priceCents - a.priceCents,
      'least-expensive': (a, b) => a.priceCents - b.priceCents,
      'most-stars': (a, b) =>
        b.ratingStars - a.ratingStars || b.ratingCount - a.ratingCount,
      'least-stars': (a, b) =>
        a.ratingStars - b.ratingStars || a.ratingCount - b.ratingCount,
    };
    renderProducts(products.toSorted(sortStrategies[productSortOption]));
  });
}
