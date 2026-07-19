import * as Option from 'effect/Option';
import { status } from 'elysia';
import { getMatchingRawProduct } from 'shared/products';
import type { RawProduct } from 'shared/schema';

import type { DataProvider } from '../../utils/dataProvider.ts';
import { createLogger } from '../../utils/logger.ts';

const findProduct = (rawProducts: RawProduct[], productId: string) =>
  Option.fromNullishOr(getMatchingRawProduct(rawProducts, productId));

export function createProductsService(provider: DataProvider) {
  const { error, rawProducts, clothings } = provider;
  if (error) throw new Error(error.message as string);
  return {
    getProducts: () => rawProducts,
    getClothingList: () => clothings,
    getMatchingProduct(productId: string) {
      const log = createLogger();
      const product = findProduct(rawProducts, productId);
      if (Option.isNone(product)) {
        log?.error(`Product ${productId} not found`);
        return status(404, { message: `Product ${productId} not found` });
      }
      return status(200, product.value);
    },
    getMatchingProducts(productIds: string[]) {
      const log = createLogger();
      const matchingProducts: RawProduct[] = [];
      for (const productId of productIds) {
        const rawProduct = findProduct(rawProducts, productId);
        if (Option.isNone(rawProduct)) {
          log?.error(`Product ${productId} not found`);
          return status(404, {
            message: `Product ${productId} not found`,
          });
        } else {
          matchingProducts.push(rawProduct.value);
        }
      }
      return status(200, matchingProducts);
    },
  };
}
