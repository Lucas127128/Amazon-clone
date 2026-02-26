import { Elysia } from 'elysia';
import { RawProduct, transformProducts } from '../data/products.ts';
import { Cart, CartSchema } from '../data/cart.ts';
import { Temporal } from 'temporal-polyfill-lite';
import { calculatePrices } from '../data/payment.ts';
import { nanoid } from 'nanoid';
import { OrderSchema } from '../data/orders.ts';
import { InferOutput, array } from 'valibot';

const rawProducts: RawProduct[] = await Bun.file(
  './src/api/rawProducts.json',
).json();
const clothings: string[] = await Bun.file(
  './src/api/clothing.json',
).json();
const products = transformProducts(rawProducts, clothings);

type OrderType = InferOutput<typeof OrderSchema>;
class Order implements OrderType {
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
    body: array(CartSchema),
  },
);
console.log(`🦊 Elysia is running`);
console.log('Orders api service starts');
