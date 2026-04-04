import { describe, expect, test } from 'bun:test';
import { getMatchingCart } from 'shared/cart';
import { getMatchingProduct, type Product } from 'shared/products';
import type { Cart } from 'shared/schema';
import {
  deliveryOptionsHTML,
  generateCartSummary,
} from 'web/cartSummaryHTML';

describe.concurrent('deliveryOptionsHTML', () => {
  test('generate correct html', async () => {
    const html = deliveryOptionsHTML('7nDww')
      .replaceAll('\n', '')
      .replaceAll(' ', '');
    const correctHTML = (
      await Bun.file('./normal/deliveryOptionsHTML.html').text()
    )
      .replaceAll('\n', '')
      .replaceAll(' ', '');
    expect(html).toBe(correctHTML);
  });
});

describe.concurrent('generateCartSummary', () => {
  test('generate correct html', async () => {
    const cart = (await Bun.file('./normal/cart.json').json()) as Cart[];
    const products = (await Bun.file(
      './normal/products.json',
    ).json()) as Product[];
    const html = generateCartSummary(
      getMatchingProduct(products, '59LXo')!,
      getMatchingCart(cart, '59LXo')!,
    )
      .replaceAll('\n', '')
      .replaceAll(' ', '');
    const correctHTML = (
      await Bun.file('./normal/cartSummaryHTML.html').text()
    )
      .replaceAll('\n', '')
      .replaceAll(' ', '');
    expect(html).toBe(correctHTML);
  });
});
