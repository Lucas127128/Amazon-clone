import { app } from 'api-client';
import { createProduct } from 'shared/products';

export async function fetchMatchingProduct(productId: string) {
  const [
    { data: clothings, error: clothingsError },
    { data: rawProduct, error: productError },
  ] = await Promise.all([
    app.api.clothingList.get(),
    app.api.matchingProduct.get({ query: { productId } }),
  ]);
  if (clothingsError) return { data: null, error: clothingsError };
  if (productError) return { data: null, error: productError };
  const isClothing = clothings.includes(rawProduct.id);
  return { data: createProduct(rawProduct, isClothing), error: null };
}
