import { status } from 'elysia';
import { getMatchingRawProduct } from 'shared/products';
import type { RawProduct } from 'shared/schema';

import type { DataProvider } from '#utils/dataProvider.ts';
import { createLogger } from '#utils/logger.ts';

export function createProductsService(provider: DataProvider) {
  const { error, rawProducts, clothings } = provider;
  if (error) throw new Error(error.message as string);
  return {
    getProducts: (): RawProduct[] => rawProducts,
    getClothingList: (): string[] => clothings,
    getMatchingProduct(productId: string) {
      const log = createLogger();
      const matchingProduct = getMatchingRawProduct(rawProducts, productId);
      if (!matchingProduct) {
        log?.error(`Product ${productId} not found`);
        return status(404, { message: `Product ${productId} not found` });
      }
      return status(200, matchingProduct);
    },
    getMatchingProducts(productIds: string[]) {
      const log = createLogger();
      const matchingProducts: RawProduct[] = [];
      for (const productId of productIds) {
        const rawProduct = getMatchingRawProduct(rawProducts, productId);
        if (!rawProduct) {
          log?.error(`Product ${productId} not found`);
          return status(404, {
            message: `Product ${productId} not found`,
          });
        }
        matchingProducts.push(rawProduct);
      }
      return status(200, matchingProducts);
    },
  };
}
