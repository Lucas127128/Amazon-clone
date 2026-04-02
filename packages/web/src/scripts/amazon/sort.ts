import { ProductSortOptionsSchema } from 'shared/schema';
import type { Product } from 'shared/products';
import { checkNullish } from 'shared/typeChecker';
import { renderProducts } from './products.ts';
import { parse } from 'valibot';

export function handleSortSelect(products: readonly Product[]) {
  const sortSelectHTML = document.querySelector('select.sort-select');
  checkNullish(sortSelectHTML);
  sortSelectHTML.addEventListener('change', () => {
    const productSortOption = parse(
      ProductSortOptionsSchema,
      sortSelectHTML.value,
    );
    switch (productSortOption) {
      case 'most-stars':
        renderProducts(
          products.toSorted((a, b) => {
            if (a.ratingStars === b.ratingStars) {
              return b.ratingCount - a.ratingCount;
            }
            return b.ratingStars - a.ratingStars;
          }),
        );
        break;
      case 'least-stars':
        renderProducts(
          products.toSorted((a, b) => {
            if (b.ratingStars === a.ratingStars) {
              return a.ratingCount - b.ratingCount;
            }
            return a.ratingStars - b.ratingStars;
          }),
        );
        break;
      case 'most-people-star':
        renderProducts(
          products.toSorted((a, b) => {
            if (b.ratingCount === a.ratingCount) {
              return b.ratingStars - a.ratingStars;
            }
            return b.ratingCount - a.ratingCount;
          }),
        );
        break;
      case 'least-people-star':
        renderProducts(
          products.toSorted((a, b) => {
            if (a.ratingCount === b.ratingCount) {
              return a.ratingStars - b.ratingStars;
            }
            return a.ratingCount - b.ratingCount;
          }),
        );
        break;
      case 'most-expensive':
        renderProducts(
          products.toSorted((a, b) => b.priceCents - a.priceCents),
        );
        break;
      case 'least-expensive':
        renderProducts(
          products.toSorted((a, b) => a.priceCents - b.priceCents),
        );
        break;
    }
  });
}
