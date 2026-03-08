import { checkTruthy } from '../utils/typeChecker.ts';
import { deliveryOptionId } from '../schema.ts';
import { STORAGE_KEYS } from '../constants.ts';
import { Cart } from '../schema.ts';

export const getMatchingCart = (cart: Cart[], productId: string) =>
  cart.find((cartItem) => cartItem.productId === productId);

export function getCart(): Cart[] {
  const savedCart = localStorage.getItem(STORAGE_KEYS.CART);
  const cart = savedCart
    ? (JSON.parse(savedCart) satisfies Cart[])
    : ([] satisfies Cart[]);
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
  localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
}

export function removeFromCart(productId: string) {
  const cart: Cart[] = getCart().filter(
    (cartItem: Cart) => cartItem.productId !== productId,
  );
  localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
}

export function updateDeliveryOption(
  productId: string,
  deliveryOptionId: deliveryOptionId,
) {
  const cart = getCart();
  const matchingItem = getMatchingCart(cart, productId);
  checkTruthy(matchingItem, 'The product id is not valid.');
  matchingItem.deliveryOptionId = deliveryOptionId;
  localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
}

export function calculateCartQuantity(): number {
  const cart = getCart();
  let cartQuantity = 0;
  for (const cartItem of cart) {
    cartQuantity += cartItem.quantity;
  }
  return cartQuantity;
}
