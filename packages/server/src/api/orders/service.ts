import * as Effect from 'effect/Effect';
import { status } from 'elysia';
import { nanoid } from 'nanoid';
import { calculatePrices } from 'shared/payment';
import type { Product } from 'shared/products';
import { transformProducts } from 'shared/products';
import type { Cart, Order } from 'shared/schema';
import { Temporal } from 'temporal-polyfill-lite';

import type { DataProvider } from '#utils/dataProvider.ts';
import { createLogger } from '#utils/logger.ts';

export const createOrder = (cart: Cart[], products: readonly Product[]) =>
  Effect.gen(function* () {
    const { totalOrderPrice } = yield* calculatePrices(cart, products);
    return {
      id: nanoid(7),
      orderTime: Temporal.Now.instant().toJSON(),
      products: cart,
      totalCostCents: totalOrderPrice,
    } satisfies Order;
  });

export function createOrdersService(provider: DataProvider) {
  const { error, rawProducts, clothings } = provider;
  if (error) throw new Error(error.message as string);
  const products = transformProducts(rawProducts, clothings);
  return {
    createOrder: (cart: Cart[]) => {
      return Effect.runSync(
        Effect.match(createOrder(cart, products), {
          onFailure: (err) => {
            createLogger()?.error(`${err.message}: ${err.productId}`);
            return status('Unprocessable Content', {
              status: 422,
              value: {
                type: 'validation',
                on: 'body',
                message: 'productId is not found',
                found: err.productId,
                expected: 'valid productId',
              },
            });
          },
          onSuccess: (order) => {
            return status('OK', order);
          },
        }),
      );
    },
  };
}
