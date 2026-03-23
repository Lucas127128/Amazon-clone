import { checkTruthy } from '../utils/typeChecker.ts';
import { CartSchemaArray, DeliveryOptionId } from '../schema.ts';
import { Cart } from '../schema.ts';
import { is } from 'valibot';
import { Signal, signal, effect, computed } from '@preact/signals-core';
import { STORAGE_KEYS } from '../../../config/constants.ts';

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
  const matchingCart = getMatchingCart(cart.value, cartItem.productId);
  matchingCart
    ? increment
      ? (matchingCart.quantity += cartItem.quantity)
      : (matchingCart.quantity = cartItem.quantity)
    : cart.value.push(cartItem);
  if (!is(CartSchemaArray, cart.value))
    throw new Error('Cart is not valid');
  cart.value = [...cart.value];
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
  const matchingItem = getMatchingCart(cart.value, productId);
  checkTruthy(matchingItem, 'The product id is not valid.');
  matchingItem.deliveryOptionId = deliveryOptionId;
  cart.value = [...cart.value];
}

export const cartQuantity = computed(() => {
  let tempCartQuantity = 0;
  for (const cartItem of cart.value) {
    tempCartQuantity += cartItem.quantity;
  }
  return tempCartQuantity;
});
