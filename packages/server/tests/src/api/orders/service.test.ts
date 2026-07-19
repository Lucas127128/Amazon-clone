import * as Effect from 'effect/Effect';
import clothingListJson from 'server/clothing' with { type: 'json' };
import rawProductsJson from 'server/rawProducts' with { type: 'json' };
import { transformProducts } from 'shared/products';
import type { Cart, RawProduct } from 'shared/schema';
import { cartJson as cart, orderJson } from 'testdata';
import { describe, expect, it } from 'vitest';

import {
  createOrder,
  createOrdersService,
} from '../../../../src/api/orders/service.ts';
import type { DataProvider } from '../../../../src/utils/dataProvider.ts';

const products = transformProducts(
  rawProductsJson as RawProduct[],
  clothingListJson,
);
const OrderService = createOrdersService({
  rawProducts: rawProductsJson as RawProduct[],
  clothings: clothingListJson,
  error: undefined,
} satisfies DataProvider);

describe.concurrent('createOrder', () => {
  it('return right order if success', () => {
    const order = Effect.runSync(createOrder(cart as Cart[], products));
    expect(order.products).toEqual(orderJson.products);
    expect(order.totalCostCents).toEqual(orderJson.totalCostCents);
  });
  it('return error if cart is invalid', () => {
    const invalidCart: Cart[] = [
      ...(cart as Cart[]),
      { productId: 'abcde', quantity: 10, deliveryOptionId: '3' as const },
    ];
    const exit = Effect.runSyncExit(createOrder(invalidCart, products));
    expect(exit._tag).toBe('Failure');
  });
});

describe.concurrent('OrderService.createOrder', () => {
  it('returns right order with status', () => {
    const order = OrderService.createOrder(cart as Cart[]);
    expect(order.code).toEqual(200);
  });
  it('return 4xx error if cart is invalid', () => {
    const order = OrderService.createOrder([
      ...(cart as Cart[]),
      {
        productId: 'abcde',
        quantity: 10,
        deliveryOptionId: '3',
      },
    ]);
    expect(order.code).toBe(422);
  });
});
