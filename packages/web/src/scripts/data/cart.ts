import { computed, effect, signal } from 'alien-signals';
import { STORAGE_KEYS } from 'shared/constants';
import { type Cart, CartsSchema } from 'shared/schema';
import { parse } from 'valibot';

export const cartStore = signal<Cart[]>(
  parse(
    CartsSchema,
    JSON.parse(localStorage.getItem(STORAGE_KEYS.CART_STATE) ?? '[]'),
  ),
);

effect(() => {
  localStorage.setItem(STORAGE_KEYS.CART_STATE, JSON.stringify(cartStore()));
});

export const cartQuantity = computed(() => {
  let tempCartQuantity = 0;
  for (const cartItem of cartStore()) {
    tempCartQuantity += cartItem.quantity;
  }
  return tempCartQuantity;
});

export const getMatchingCart = (cart: Cart[], productId: string) =>
  cart.find((cartItem) => cartItem.productId === productId);

export function addToCart(cartItem: Cart, increment: boolean = false) {
  const newCart = structuredClone(cartStore());
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
  cartStore(parse(CartsSchema, newCart));
}

export function removeFromCart(productId: string) {
  cartStore(
    cartStore().filter((cartItem) => cartItem.productId !== productId),
  );
}
