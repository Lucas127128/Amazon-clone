import { app } from 'api-client';
import { createProduct, transformProducts } from 'shared/products';
import type { RawProduct } from 'shared/schema';

export async function fetchProducts(
  compareFn?: (a: RawProduct, b: RawProduct) => number,
) {
  const [
    { data: clothings, error: clothingsError },
    { data: rawProducts, error: productsError },
  ] = await Promise.all([
    app.api.clothingList.get(),
    app.api.products.get(),
  ]);
  if (clothingsError) throw clothingsError;
  if (productsError) throw productsError;

  return transformProducts(rawProducts, clothings, compareFn);
}

export async function fetchMatchingProduct(productId: string) {
  const [
    { data: clothings, error: clothingsError },
    { data: rawProduct, error: productError },
  ] = await Promise.all([
    app.api.clothingList.get(),
    app.api.matchingProduct.get({ query: { productId } }),
  ]);
  if (clothingsError) throw clothingsError;
  if (productError) throw productError;
  const isClothing = clothings.includes(rawProduct.id);
  return createProduct(rawProduct, isClothing);
}
