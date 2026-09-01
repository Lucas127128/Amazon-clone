import { createContext } from 'svelte';

import { CART_CONFIG, STORAGE_KEYS } from '#lib/data/constants.ts';
import type { Cart as CartItem, DeliveryOptionId } from '#lib/schema.ts';

import { getCart, getMatchingCart } from './cart.ts';
import { saveJson } from './storage.ts';

export class Cart {
  #items = $state<CartItem[]>([]);
  get items() {
    return this.#items as readonly CartItem[];
  }

  quantity = $derived(
    this.#items.reduce((sum, item) => sum + item.quantity, 0),
  );

  constructor(items: CartItem[] = getCart()) {
    this.#items = items;
  }

  add(productId: string, quantity = 1) {
    if (quantity < 1) return;
    const matching = getMatchingCart(this.#items, productId);
    if (matching !== undefined) {
      matching.quantity = Math.min(
        matching.quantity + quantity,
        CART_CONFIG.MAX_QUANTITY_PER_ITEM,
      );
    } else {
      this.#items.push({
        productId,
        quantity: Math.min(quantity, CART_CONFIG.MAX_QUANTITY_PER_ITEM),
        deliveryOptionId: '1',
      });
    }
    this.#save();
  }

  updateQuantity(productId: string, quantity: number) {
    const matching = getMatchingCart(this.#items, productId);
    if (matching === undefined) return;
    matching.quantity = Math.min(
      Math.max(quantity, 1),
      CART_CONFIG.MAX_QUANTITY_PER_ITEM,
    );
    this.#save();
  }

  updateDeliveryOption(
    productId: string,
    deliveryOptionId: DeliveryOptionId,
  ) {
    const matching = getMatchingCart(this.#items, productId);
    if (matching === undefined) return;
    matching.deliveryOptionId = deliveryOptionId;
    this.#save();
  }

  remove(productId: string) {
    this.#items = this.#items.filter((item) => item.productId !== productId);
    this.#save();
  }

  clear() {
    this.#items = [];
    this.#save();
  }

  #save() {
    saveJson(STORAGE_KEYS.CART, this.#items);
  }
}

export const [getCartContext, setCartContext] = createContext<Cart>();
