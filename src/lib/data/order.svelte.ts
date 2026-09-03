import { createContext } from 'svelte';
import { Temporal } from 'temporal-polyfill-lite';

import { STORAGE_KEYS } from '#lib/data/constants.ts';
import { dateFormatOption } from '#lib/data/deliveryOption.ts';
import { createOrder } from '#lib/orders.remote.ts';
import {
  type Cart,
  type Order as OrderRecord,
  OrdersSchema,
} from '#lib/schema.ts';

import { loadJson, saveJson } from './storage.ts';

export function getTimeString(ISOOrderTime: string) {
  return Temporal.Instant.from(ISOOrderTime)
    .toZonedDateTimeISO(Temporal.Now.timeZoneId())
    .toLocaleString('en-US', dateFormatOption);
}

export const getMatchingOrder = (orders: OrderRecord[], orderId: string) =>
  orders.find((order) => order.id === orderId);

export class Order {
  readonly #items = $state<OrderRecord[]>([]);
  get items() {
    return this.#items as readonly OrderRecord[];
  }

  constructor(
    items: OrderRecord[] = loadJson(STORAGE_KEYS.ORDER, OrdersSchema),
  ) {
    this.#items = items;
  }

  getById(orderId: string) {
    return getMatchingOrder(this.#items, orderId);
  }

  add(order: OrderRecord) {
    this.#items.unshift(order);
    this.#save();
  }

  async placeOrder(cartItems: readonly Cart[]) {
    const order = await createOrder([...cartItems]);
    this.add(order);
    return order;
  }

  #save() {
    saveJson(STORAGE_KEYS.ORDER, this.#items);
  }
}

export const [getOrderContext, setOrderContext] = createContext<Order>();
