import { STORAGE_KEYS } from 'shared/constants';
import { type Cart, CartsSchema } from 'shared/schema';
import { parse } from 'valibot';

export const getMatchingCart = (cart: Cart[], productId: string) =>
  cart.find((cartItem) => cartItem.productId === productId);

export const getCart = () => {
  // oxlint-disable-next-line typescript/no-unnecessary-condition
  if (globalThis?.localStorage !== undefined) {
    const storedCart = localStorage.getItem(STORAGE_KEYS.CART);
    return storedCart !== null
      ? parse(CartsSchema, JSON.parse(storedCart))
      : [];
  } else {
    return [];
  }
};
