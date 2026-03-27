import { checkNullish } from '../utils/typeChecker.ts';
import type { DeliveryOptionId } from '../schema.ts';
import { CartSchemaArray } from '../schema.ts';
import type { Cart } from '../schema.ts';
import { parse } from 'valibot';
import type { Signal } from '@preact/signals-core';
import { signal, effect, computed } from '@preact/signals-core';
import { STORAGE_KEYS } from '#root/config/constants.ts';

export const cart: Signal<Cart[]> = signal(
  JSON.parse(localStorage.getItem(STORAGE_KEYS.CART_STATE) ?? '[]'),
);
effect(() => {
  localStorage.setItem(
    STORAGE_KEYS.CART_STATE,
    JSON.stringify(cart.value),
  );
});

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

export const cartQuantity = computed(() => {
  let tempCartQuantity = 0;
  for (const cartItem of cart.value) {
    tempCartQuantity += cartItem.quantity;
  }
  return tempCartQuantity;
});
