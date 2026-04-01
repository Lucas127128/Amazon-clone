import type { ProductSortOptions } from '#root/shared/src/schema.ts';
import { fetchProducts } from '#data/products.ts';
import { checkNullish } from '#root/shared/src/utils/typeChecker.ts';
import { renderProducts } from '../amazon/products';

export async function handleSortSelect() {
  const sortSelectHTML = document.querySelector('select.sort-select');
  checkNullish(sortSelectHTML);
  sortSelectHTML.addEventListener('change', async () => {
    const productSortOption = sortSelectHTML.value as ProductSortOptions;
    switch (productSortOption) {
      case 'most-stars':
        renderProducts(await fetchProducts());
        break;
      case 'least-stars':
        renderProducts(
          await fetchProducts((a, b) => {
            if (b.rating.stars === a.rating.stars) {
              return a.rating.count - b.rating.count;
            }
            return a.rating.stars - b.rating.stars;
          }),
        );
        break;
      case 'most-people-star':
        renderProducts(
          await fetchProducts((a, b) => {
            if (b.rating.count === a.rating.count) {
              return b.rating.stars - a.rating.stars;
            }
            return b.rating.count - a.rating.count;
          }),
        );
        break;
      case 'least-people-star':
        renderProducts(
          await fetchProducts((a, b) => {
            if (a.rating.count === b.rating.count) {
              return a.rating.stars - b.rating.stars;
            }
            return a.rating.count - b.rating.count;
          }),
        );
        break;
      case 'most-expensive':
        renderProducts(
          await fetchProducts((a, b) => b.priceCents - a.priceCents),
        );
        break;
      case 'least-expensive':
        renderProducts(
          await fetchProducts((a, b) => a.priceCents - b.priceCents),
        );
        break;
    }
  });
}
