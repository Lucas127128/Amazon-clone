import { getMatchingProduct, type Product } from 'shared/products';
import type { Cart, Order } from 'shared/schema';
import { checkNullish } from 'shared/typeChecker';
import { orderJson as order, productsJson as products } from 'testdata';
import { describe, it } from 'vitest';

import { generateTrackingHTML } from '#pages/htmlGenerators/trackingHTML.ts';

const getMatchingCart = (cart: Cart[], productId: string) =>
  cart.find((cartItem) => cartItem.productId === productId);

describe.concurrent('generateTrackingHTML', () => {
  it('generate correct HTML', ({ expect }) => {
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
    );

    expect(trackingHTML).toMatchSnapshot();
  });
});
