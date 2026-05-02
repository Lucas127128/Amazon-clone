import { getMatchingProduct, type Product } from 'shared/products';
import type { Cart, Order } from 'shared/schema';
import { checkNullish } from 'shared/typeChecker';
import { describe, expect, it } from 'vitest';

import { generateTrackingHTML } from '#pages/htmlGenerators/trackingHTML.ts';
import order from '#testData/order.json' with { type: 'json' };
import products from '#testData/products.json' with { type: 'json' };
import correctTrackingHTML from '#testData/trackingHTML.html?raw' with { type: 'text' };

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
