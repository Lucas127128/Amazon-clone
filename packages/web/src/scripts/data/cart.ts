import { persistentAtom } from '@nanostores/persistent';
import { computed } from 'nanostores';
import { STORAGE_KEYS } from 'shared/constants';
import {
  type Cart,
  CartsSchema,
  type DeliveryOptionId,
} from 'shared/schema';
import { checkNullish } from 'shared/typeChecker';
import { parse } from 'valibot';

export const cartStore = persistentAtom<Cart[]>(
  STORAGE_KEYS.CART_STATE,
  [],
  {
    encode(value) {
      return JSON.stringify(value);
    },
    decode(value) {
      const decoded = value ? (JSON.parse(value) as unknown) : [];
      return parse(CartsSchema, decoded);
    },
  },
);

export const getMatchingCart = (cart: Cart[], productId: string) =>
  cart.find((cartItem) => cartItem.productId === productId);

export function addToCart(cartItem: Cart, increment: boolean = false) {
  const newCart = structuredClone(cartStore.get());
  const matchingCart = getMatchingCart(newCart, cartItem.productId);
  if (matchingCart) {
    matchingCart.deliveryOptionId = cartItem.deliveryOptionId;
    if (increment) {
      matchingCart.quantity += cartItem.quantity;
    } else {
      matchingCart.quantity = cartItem.quantity;
    }
  } else {
    newCart.push(cartItem);
  }
  cartStore.set(parse(CartsSchema, newCart));
}

export function removeFromCart(productId: string) {
  cartStore.set(
    cartStore.get().filter((cartItem) => cartItem.productId !== productId),
  );
}

export function updateDeliveryOption(
  productId: string,
  deliveryOptionId: DeliveryOptionId,
) {
  const newCart = structuredClone(cartStore.get());
  const matchingItem = getMatchingCart(newCart, productId);
  checkNullish(matchingItem, 'The product id is not valid.');
  matchingItem.deliveryOptionId = deliveryOptionId;
  cartStore.set(parse(CartsSchema, newCart));
}

export const cartQuantity = computed(cartStore, (cart) => {
  let tempCartQuantity = 0;
  for (const cartItem of cart) {
    tempCartQuantity += cartItem.quantity;
  }
  return tempCartQuantity;
});
