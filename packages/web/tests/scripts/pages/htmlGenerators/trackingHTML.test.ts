import { getMatchingProduct, type Product } from 'shared/products';
import type { Cart, Order } from 'shared/schema';
import { checkNullish } from 'shared/typeChecker';
import {
  orderJson as order,
  productsJson as products,
  trackingHTML as correctTrackingHTML,
} from 'testdata';
import { describe, expect, it } from 'vitest';

import { generateTrackingHTML } from '#pages/htmlGenerators/trackingHTML.ts';

const getMatchingCart = (cart: Cart[], productId: string) =>
  cart.find((cartItem) => cartItem.productId === productId);

describe.concurrent('generateTrackingHTML', () => {
  it('generate correct HTML', () => {
    const matchingProduct = getMatchingProduct(
      products as Product[],
      '59LXo',
    );
    const matchingCart = getMatchingCart(
      (order as Order).products,
      '59LXo',
    );
    checkNullish(matchingProduct);
    checkNullish(matchingCart);

    const trackingHTML = generateTrackingHTML(
      matchingProduct,
      order as Order,
      matchingCart,
    )
      .replaceAll('\n', '')
      .replaceAll(' ', '');

    expect(trackingHTML).toBe(
      correctTrackingHTML.replaceAll('\n', '').replaceAll(' ', ''),
    );
  });
});
