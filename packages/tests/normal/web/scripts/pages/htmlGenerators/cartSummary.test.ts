import { getMatchingCart } from 'shared/cart';
import { getMatchingProduct, type Product } from 'shared/products';
import type { Cart } from 'shared/schema';
import { describe, expect, test } from 'vitest';
import {
  deliveryOptionsHTML,
  generateCartSummary,
} from 'web/cartSummaryHTML';

import cart from '#testData/cart.json' with { type: 'json' };
import cartSummaryHTML from '#testData/cartSummaryHTML.html?raw' with { type: 'text' };
import deliveryOptionsHTMLText from '#testData/deliveryOptionsHTML.html?raw' with { type: 'text' };
import products from '#testData/products.json' with { type: 'json' };

describe.concurrent('deliveryOptionsHTML', () => {
  test('generate correct html', () => {
    const html = deliveryOptionsHTML('7nDww')
      .replaceAll('\n', '')
      .replaceAll(' ', '');
    expect(html).toBe(
      deliveryOptionsHTMLText.replaceAll('\n', '').replaceAll(' ', ''),
    );
  });
});

describe.concurrent('generateCartSummary', () => {
  test('generate correct html', () => {
    const html = generateCartSummary(
      getMatchingProduct(products as Product[], '59LXo')!,
      getMatchingCart(cart as Cart[], '59LXo')!,
    )
      .replaceAll('\n', '')
      .replaceAll(' ', '');
    expect(html).toBe(
      cartSummaryHTML.replaceAll('\n', '').replaceAll(' ', ''),
    );
  });
});
