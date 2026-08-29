import * as Effect from 'effect/Effect';
import { nanoid } from 'nanoid';
import { Temporal } from 'temporal-polyfill-lite';

import { calculatePrices } from '#lib/data/payment.ts';
import type { Product } from '#lib/data/products.ts';
import { type Cart, CartsSchema, type Order } from '#lib/schema.ts';
import { command } from '$app/server';

import { getProducts } from './products.remote';

const createOrderEffect = (cart: Cart[], products: readonly Product[]) =>
  Effect.gen(function* () {
    const { totalOrderPrice } = yield* calculatePrices(cart, products);
    return {
      id: nanoid(7),
      orderTime: Temporal.Now.instant().toJSON(),
      products: cart,
      totalCostCents: totalOrderPrice,
    } satisfies Order;
  });

export const createOrder = command(CartsSchema, async (cart) => {
  return Effect.runSync(
    Effect.match(createOrderEffect(cart, await getProducts()), {
      onSuccess: (order) => ({ data: order, error: null }),
      onFailure: (error) => {
        console.log(error);
        return { data: null, error: error._tag };
      },
    }),
  );
});
