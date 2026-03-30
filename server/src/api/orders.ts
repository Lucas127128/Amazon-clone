import { Elysia } from 'elysia';
import { transformProducts } from '#data/products.ts';
import { Temporal } from 'temporal-polyfill-lite';
import { calculatePrices } from '#data/payment.ts';
import { nanoid } from 'nanoid';
import {
  OrderSchema,
  CartSchemaArray,
  RawProductSchemaArray,
} from '#root/shared/src/schema.ts';
import type { Cart, Order as OrderType } from '#root/shared/src/schema.ts';
import type { Exact } from 'type-fest';
import { array, minLength, parse, pipe, string } from 'valibot';

const rawProducts = parse(
  RawProductSchemaArray,
  await Bun.file('./server/src/api/rawProducts.json').json(),
);
const clothings = parse(
  array(string()),
  await Bun.file('./server/src/api/clothing.json').json(),
);
const products = transformProducts(rawProducts, clothings);

class Order implements Exact<OrderType, Order> {
  constructor(cart: Cart[]) {
    const { totalOrderPrice } = calculatePrices(cart, products);
    this.totalCostCents = totalOrderPrice;
    this.id = nanoid(7);
    this.orderTime = Temporal.Now.instant().toJSON();
    this.products = cart;
  }
  id;
  orderTime;
  totalCostCents;
  products: Cart[] = [];
}

export const orderPlugin = new Elysia({ prefix: '/api' }).post(
  '/orders',
  ({ body, request, server }) => {
    const clientIP = server?.requestIP(request)?.address;
    const now = Temporal.Now.plainTimeISO().toJSON();
    console.log(`new orders request from ${clientIP} at ${now}`);
    const order = new Order(body);
    return order;
  },
  {
    response: OrderSchema,
    body: pipe(CartSchemaArray, minLength(1)),
    detail: {
      description:
        'generate order from a cart(No actual database involved, only for demo)',
    },
  },
);
console.log(`🦊 Elysia is running`);
console.log('Orders api service starts');
