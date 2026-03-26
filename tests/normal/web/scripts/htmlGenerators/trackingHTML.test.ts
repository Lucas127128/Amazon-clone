import { getMatchingCart } from '#root/shared/src/data/cart.ts';
import { getMatchingProduct } from '#root/shared/src/data/products.ts';
import { Order } from '#root/shared/src/schema.ts';
import { checkNullish } from '#root/shared/src/utils/typeChecker.ts';
import { generateTrackingHTML } from '#root/web/src/scripts/htmlGenerators/trackingHTML.ts';
import { describe, expect, test } from 'bun:test';

describe.concurrent('test suite: generateTrackingHTML', () => {
  test('generate correct HTML', async () => {
    const products = await Bun.file('./tests/normal/products.json').json();
    const order: Order = await Bun.file(
      './tests/normal/order.json',
    ).json();

    const matchingProduct = getMatchingProduct(products, '59LXo');
    const matchingCart = getMatchingCart(order.products, '59LXo');
    checkNullish(matchingProduct);
    checkNullish(matchingCart);

    console.log(
      generateTrackingHTML(matchingProduct, order, matchingCart),
    );

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
