import { nanoid } from 'nanoid';
import { Temporal } from 'temporal-polyfill-lite';

import { CartsSchema, type Order } from '#lib/schema.ts';
import { command } from '$app/server';

import { Prices } from './data/payment.svelte';
import { getProducts } from './products.remote';

export const createOrder = command(CartsSchema, async (cart) => {
  const prices = new Prices(cart, await getProducts());
  return {
    id: nanoid(7),
    orderTime: Temporal.Now.instant().toJSON(),
    products: cart,
    totalCostCents: prices.totalOrderPrice,
  } satisfies Order;
});
