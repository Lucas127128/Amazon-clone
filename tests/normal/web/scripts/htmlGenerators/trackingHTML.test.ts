import { getMatchingCart } from '#data/cart.ts';
import { getMatchingProduct, type Product } from '#data/products.ts';
import type { Order } from '#root/shared/src/schema.ts';
import { checkNullish } from '#utils/typeChecker.ts';
import { generateTrackingHTML } from '#root/web/src/scripts/htmlGenerators/trackingHTML.ts';
import { describe, expect, test } from 'bun:test';

describe.concurrent('test suite: generateTrackingHTML', () => {
  test('generate correct HTML', async () => {
    const products = (await Bun.file(
      './tests/normal/products.json',
    ).json()) as Product[];
    const order = (await Bun.file(
      './tests/normal/order.json',
    ).json()) as Order;

    const matchingProduct = getMatchingProduct(products, '59LXo');
    const matchingCart = getMatchingCart(order.products, '59LXo');
    checkNullish(matchingProduct);
    checkNullish(matchingCart);

    const trackingHTML = generateTrackingHTML(
      matchingProduct,
      order,
      matchingCart,
    )
      .replaceAll('\n', '')
      .replaceAll(' ', '');
    const correctTrackingHTML = (
      await Bun.file('./tests/normal/trackingHTML.html').text()
    )
      .replaceAll('\n', '')
      .replaceAll(' ', '');
    expect(trackingHTML).toBe(correctTrackingHTML);
  });
});
