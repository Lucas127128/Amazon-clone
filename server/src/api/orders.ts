import { Elysia } from 'elysia';
import { transformProducts } from '#root/shared/src/data/products.ts';
import { Temporal } from 'temporal-polyfill-lite';
import { calculatePrices } from '#root/shared/src/data/payment.ts';
import { nanoid } from 'nanoid';
import { OrderSchema, CartSchemaArray } from '#root/shared/src/schema.ts';
import { Cart, RawProduct, OrderType } from '#root/shared/src/schema.ts';
import { Exact } from 'type-fest';

const rawProducts: RawProduct[] = await Bun.file(
  './server/src/api/rawProducts.json',
).json();
const clothings: string[] = await Bun.file(
  './server/src/api/clothing.json',
).json();
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
    body: CartSchemaArray,
  },
);
console.log(`🦊 Elysia is running`);
console.log('Orders api service starts');
