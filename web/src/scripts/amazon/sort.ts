import type { ProductSortOptions } from '#root/shared/src/schema.ts';
import type { Product } from '#data/products.ts';
import { checkNullish } from '#root/shared/src/utils/typeChecker.ts';
import { renderProducts } from '../amazon/products';

export async function handleSortSelect(products: readonly Product[]) {
  const sortSelectHTML = document.querySelector('select.sort-select');
  checkNullish(sortSelectHTML);
  sortSelectHTML.addEventListener('change', async () => {
    const productSortOption = sortSelectHTML.value as ProductSortOptions;
    switch (productSortOption) {
      case 'most-stars':
        await renderProducts(
          products.toSorted((a, b) => {
            if (a.ratingStars === b.ratingStars) {
              return b.ratingCount - a.ratingCount;
            }
            return b.ratingStars - a.ratingStars;
          }),
        );
        break;
      case 'least-stars':
        await renderProducts(
          products.toSorted((a, b) => {
            if (b.ratingStars === a.ratingStars) {
              return a.ratingCount - b.ratingCount;
            }
            return a.ratingStars - b.ratingStars;
          }),
        );
        break;
      case 'most-people-star':
        await renderProducts(
          products.toSorted((a, b) => {
            if (b.ratingCount === a.ratingCount) {
              return b.ratingStars - a.ratingStars;
            }
            return b.ratingCount - a.ratingCount;
          }),
        );
        break;
      case 'least-people-star':
        await renderProducts(
          products.toSorted((a, b) => {
            if (a.ratingCount === b.ratingCount) {
              return a.ratingStars - b.ratingStars;
            }
            return a.ratingCount - b.ratingCount;
          }),
        );
        break;
      case 'most-expensive':
        await renderProducts(
          products.toSorted((a, b) => b.priceCents - a.priceCents),
        );
        break;
      case 'least-expensive':
        await renderProducts(
          products.toSorted((a, b) => a.priceCents - b.priceCents),
        );
        break;
    }
  });
}
