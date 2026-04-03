import {
  computed,
  effect,
  type Signal,
  signal,
} from '@preact/signals-core';
import { parse } from 'valibot';

import { STORAGE_KEYS } from '../../config/constants.ts';
import {
  type Cart,
  CartSchemaArray,
  type DeliveryOptionId,
} from '../schema.ts';
import { checkNullish } from '../utils/typeChecker.ts';

if (import.meta.env.DEV) {
  const { setDebugOptions } = await import('@preact/signals-debug');
  setDebugOptions({ enabled: true, grouped: true });
}

export const cart: Signal<Cart[]> = signal(
  parse(
    CartSchemaArray,
    JSON.parse(localStorage.getItem(STORAGE_KEYS.CART_STATE) ?? '[]'),
  ),
  { name: 'cart' },
);

effect(
  () => {
    localStorage.setItem(
      STORAGE_KEYS.CART_STATE,
      JSON.stringify(cart.value),
    );
  },
  { name: 'persistent cart state' },
);

export const getMatchingCart = (cart: Cart[], productId: string) =>
  cart.find((cartItem) => cartItem.productId === productId);

export function addToCart(cartItem: Cart, increment: boolean = false) {
  const newCart = structuredClone(cart.value);
  const matchingCart = getMatchingCart(newCart, cartItem.productId);
  matchingCart
    ? increment
      ? (matchingCart.quantity += cartItem.quantity)
      : (matchingCart.quantity = cartItem.quantity)
    : newCart.push(cartItem);
  const parsedNewCart = parse(CartSchemaArray, newCart);
  cart.value = parsedNewCart;
}

export function removeFromCart(productId: string) {
  cart.value = cart.value.filter(
    (cartItem: Cart) => cartItem.productId !== productId,
  );
}

export function updateDeliveryOption(
  productId: string,
  deliveryOptionId: DeliveryOptionId,
) {
  const newCart = structuredClone(cart.value);
  const matchingItem = getMatchingCart(newCart, productId);
  checkNullish(matchingItem, 'The product id is not valid.');
  matchingItem.deliveryOptionId = deliveryOptionId;
  cart.value = parse(CartSchemaArray, newCart);
}

export const cartQuantity = computed(
  () => {
    let tempCartQuantity = 0;
    for (const cartItem of cart.value) {
      tempCartQuantity += cartItem.quantity;
    }
    return tempCartQuantity;
  },
  { name: 'cart quantity' },
);
