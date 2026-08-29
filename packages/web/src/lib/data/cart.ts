import { parse } from 'valibot';

import { STORAGE_KEYS } from '#lib/data/constants.ts';
import { type Cart, CartsSchema } from '#lib/schema.ts';

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
