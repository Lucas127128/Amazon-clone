import { createStore } from '@tanstack/store';
import { parse } from 'valibot';

import { STORAGE_KEYS } from '../../config/constants.ts';
import {
  type Cart,
  CartSchemaArray,
  type DeliveryOptionId,
} from '../schema.ts';
import { checkNullish } from '../utils/typeChecker.ts';

export const cartStore = createStore(
  parse(
    CartSchemaArray,
    JSON.parse(localStorage.getItem(STORAGE_KEYS.CART_STATE) ?? '[]'),
  ),
);

cartStore.subscribe((cart) => {
  localStorage.setItem(STORAGE_KEYS.CART_STATE, JSON.stringify(cart));
});

export const getMatchingCart = (cart: Cart[], productId: string) =>
  cart.find((cartItem) => cartItem.productId === productId);

export function addToCart(cartItem: Cart, increment: boolean = false) {
  cartStore.setState(() => {
    const newCart = cartStore.get();
    const matchingCart = getMatchingCart(newCart, cartItem.productId);
    matchingCart
      ? increment
        ? (matchingCart.quantity += cartItem.quantity)
        : (matchingCart.quantity = cartItem.quantity)
      : newCart.push(cartItem);
    return parse(CartSchemaArray, newCart);
  });
}

export function removeFromCart(productId: string) {
  cartStore.setState(() =>
    cartStore
      .get()
      .filter((cartItem: Cart) => cartItem.productId !== productId),
  );
}

export function updateDeliveryOption(
  productId: string,
  deliveryOptionId: DeliveryOptionId,
) {
  cartStore.setState(() => {
    const newCart = cartStore.get();
    const matchingItem = getMatchingCart(newCart, productId);
    checkNullish(matchingItem, 'The product id is not valid.');
    matchingItem.deliveryOptionId = deliveryOptionId;
    return parse(CartSchemaArray, newCart);
  });
}

export const cartQuantity = createStore(() => {
  let tempCartQuantity = 0;
  for (const cartItem of cartStore.get()) {
    tempCartQuantity += cartItem.quantity;
  }
  return tempCartQuantity;
});
