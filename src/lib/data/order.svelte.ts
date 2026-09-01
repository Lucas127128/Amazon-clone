import { createContext } from 'svelte';

import { STORAGE_KEYS } from '#lib/data/constants.ts';
import { getMatchingOrder, getOrders } from '#lib/data/orders.ts';
import { createOrder } from '#lib/orders.remote.ts';
import type { Cart, Order as OrderRecord } from '#lib/schema.ts';

import { saveJson } from './storage.ts';

export class Order {
  readonly #items = $state<OrderRecord[]>([]);
  get items() {
    return this.#items as readonly OrderRecord[];
  }

  constructor(items: OrderRecord[] = getOrders()) {
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
