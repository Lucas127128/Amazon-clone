import { checkTruthy } from '../utils/typeChecker.ts';
import { CartSchemaArray, DeliveryOptionId } from '../schema.ts';
import { STORAGE_KEYS } from '../constants.ts';
import { Cart } from '../schema.ts';
import { is } from 'valibot';

export const getMatchingCart = (cart: Cart[], productId: string) =>
  cart.find((cartItem) => cartItem.productId === productId);

export function getCart() {
  const cart: Cart[] = JSON.parse(
    localStorage.getItem(STORAGE_KEYS.CART) ?? '[]',
  );
  return cart;
}

export function addToCart(cartItem: Cart, increment: boolean = false) {
  const cart = getCart();
  const matchingCart = getMatchingCart(cart, cartItem.productId);
  matchingCart
    ? increment
      ? (matchingCart.quantity += cartItem.quantity)
      : (matchingCart.quantity = cartItem.quantity)
    : cart.push(cartItem);
  if (is(CartSchemaArray, cart)) {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
  } else {
    throw new Error('Cart is not valid');
  }
}

export function removeFromCart(productId: string) {
  const cart: Cart[] = getCart().filter(
    (cartItem: Cart) => cartItem.productId !== productId,
  );
  localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
}

export function updateDeliveryOption(
  productId: string,
  deliveryOptionId: DeliveryOptionId,
) {
  const cart = getCart();
  const matchingItem = getMatchingCart(cart, productId);
  checkTruthy(matchingItem, 'The product id is not valid.');
  matchingItem.deliveryOptionId = deliveryOptionId;
  localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
}

export function calculateCartQuantity() {
  const cart = getCart();
  let cartQuantity = 0;
  for (const cartItem of cart) {
    cartQuantity += cartItem.quantity;
  }
  return cartQuantity;
}
