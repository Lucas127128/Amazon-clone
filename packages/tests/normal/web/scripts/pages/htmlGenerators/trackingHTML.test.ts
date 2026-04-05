import { getMatchingCart } from 'shared/cart';
import { getMatchingProduct } from 'shared/products';
import type { Order } from 'shared/schema';
import { checkNullish } from 'shared/typeChecker';
import { describe, expect, test } from 'vitest';
import { generateTrackingHTML } from 'web/trackingHTML';

import order from '../../../../order.json' with { type: 'json' };
import products from '../../../../products.json' with { type: 'json' };

describe.concurrent('test suite: generateTrackingHTML', () => {
  test('generate correct HTML', async () => {
    const matchingProduct = getMatchingProduct(products, '59LXo');
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
    const correctTrackingHTML = (
      await Bun.file('./normal/trackingHTML.html').text()
    )
      .replaceAll('\n', '')
      .replaceAll(' ', '');
    expect(trackingHTML).toBe(correctTrackingHTML);
  });
});
