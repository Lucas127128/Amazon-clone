import { status } from 'elysia';
import { getMatchingRawProduct } from 'shared/products';
import { ClothingListSchema, RawProductSchemaArray } from 'shared/schema';
import { parse } from 'valibot';

const products = parse(
  RawProductSchemaArray,
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
      return status(404, { message: 'Product not found' });
    }
    return status(200, matchingProduct);
  },
};
