import { status } from 'elysia';
import { getMatchingRawProduct } from 'shared/products';
import type { RawProduct } from 'shared/schema';
import { ClothingListSchema, RawProductsSchema } from 'shared/schema';
import { parse } from 'valibot';

const products = parse(
  RawProductsSchema,
  await Bun.file('./rawData/rawProducts.json').json(),
);
const clothings = parse(
  ClothingListSchema,
  await Bun.file('./rawData/clothing.json').json(),
);

export const Service = {
  getProducts: () => products,
  getClothingList: () => clothings,
  getMatchingProduct(productId: string) {
    const matchingProduct = getMatchingRawProduct(products, productId);
    if (!matchingProduct) {
      return status(404, { message: `Product ${productId} not found` });
    }
    return status(200, matchingProduct);
  },
  getMatchingProducts(productIds: string[]) {
    const matchingProducts: RawProduct[] = [];
    for (const productId of productIds) {
      const rawProduct = getMatchingRawProduct(products, productId);
      if (!rawProduct) {
        return status(404, {
          message: `Product ${productId} not found`,
        });
      }
      matchingProducts.push(rawProduct);
    }
    return status(200, matchingProducts);
  },
};
