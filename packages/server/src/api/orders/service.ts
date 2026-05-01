import { status } from 'elysia';
import { nanoid } from 'nanoid';
import { calculatePrices } from 'shared/payment';
import { transformProducts } from 'shared/products';
import {
  type Cart,
  type Order,
  RawProductSchemaArray,
} from 'shared/schema';
import { Temporal } from 'temporal-polyfill-lite';
import { array, parse, string } from 'valibot';

const rawProducts = parse(
  RawProductSchemaArray,
  await Bun.file('./rawData/rawProducts.json').json(),
);
const clothings = parse(
  array(string()),
  await Bun.file('./rawData/clothing.json').json(),
);
const products = transformProducts(rawProducts, clothings);

export function createOrder(cart: Cart[]) {
  const { data: prices, error } = calculatePrices(cart, products);
  if (error) {
    return { data: null, error };
  } else {
    const order: Order = {
      id: nanoid(7),
      orderTime: Temporal.Now.instant().toJSON(),
      products: cart,
      totalCostCents: prices.totalOrderPrice,
    };
    return { data: order, error: null };
  }
}

export const OrderService = {
  createOrder: (cart: Cart[]) => {
    const { data: order, error } = createOrder(cart);
    if (error) {
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
