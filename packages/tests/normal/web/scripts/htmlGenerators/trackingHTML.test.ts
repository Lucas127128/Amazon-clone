import { getMatchingCart } from 'shared/cart';
import { getMatchingProduct, type Product } from 'shared/products';
import { OrderSchema } from 'shared/schema';
import { checkNullish } from 'shared/typeChecker';
import { generateTrackingHTML } from 'web/trackingHTML';
import { describe, expect, test } from 'bun:test';
import { parse } from 'valibot';

describe.concurrent('test suite: generateTrackingHTML', () => {
  test('generate correct HTML', async () => {
    const products = (await Bun.file(
      './normal/products.json',
    ).json()) as Product[];
    const order = parse(
      OrderSchema,
      await Bun.file('./normal/order.json').json(),
    );

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
      await Bun.file('./normal/trackingHTML.html').text()
    )
      .replaceAll('\n', '')
      .replaceAll(' ', '');
    expect(trackingHTML).toBe(correctTrackingHTML);
  });
});
