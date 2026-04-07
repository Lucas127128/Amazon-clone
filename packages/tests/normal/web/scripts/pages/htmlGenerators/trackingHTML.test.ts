import { getMatchingCart } from 'shared/cart';
import { getMatchingProduct, type Product } from 'shared/products';
import type { Order } from 'shared/schema';
import { checkNullish } from 'shared/typeChecker';
import { describe, expect, test } from 'vitest';
import { generateTrackingHTML } from 'web/trackingHTML';

import order from '#testData/order.json' with { type: 'json' };
import products from '#testData/products.json' with { type: 'json' };
import correctTrackingHTML from '#testData/trackingHTML.html?raw' with { type: 'text' };

describe.concurrent('test suite: generateTrackingHTML', () => {
  test('generate correct HTML', () => {
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
