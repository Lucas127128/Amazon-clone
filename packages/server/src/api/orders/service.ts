import { status } from 'elysia';
import { useLogger } from 'evlog/elysia';
import { nanoid } from 'nanoid';
import { calculatePrices } from 'shared/payment';
import type { Product } from 'shared/products';
import { transformProducts } from 'shared/products';
import type { Cart, Order } from 'shared/schema';
import { Temporal } from 'temporal-polyfill-lite';

import type { DataProvider } from '#utils/dataProvider.ts';

export function createOrder(cart: Cart[], products: readonly Product[]) {
  const { data: prices, error } = calculatePrices(cart, products);
  if (error) {
    return { data: null, error };
  }
  const order: Order = {
    id: nanoid(7),
    orderTime: Temporal.Now.instant().toJSON(),
    products: cart,
    totalCostCents: prices.totalOrderPrice,
  };
  return { data: order, error: null };
}

export function createOrdersService(provider: DataProvider) {
  const { error, rawProducts, clothings } = provider;
  if (error) throw error;
  const products = transformProducts(rawProducts, clothings);
  return {
    createOrder: (cart: Cart[]) => {
      const { data: order, error } = createOrder(cart, products);
      if (error) {
        const log = Bun.env.NODE_ENV === 'test' ? undefined : useLogger();
        log?.error(error.message);
        return status('Unprocessable Content', {
          status: 422,
          value: {
            type: 'validation',
            on: 'body',
            message: 'productId is not found',
            found: error.productId,
            expected: 'valid productId',
          },
        });
      }
      return status('OK', order);
    },
  };
}
