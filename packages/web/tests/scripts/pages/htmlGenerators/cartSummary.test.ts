import { getMatchingProduct, type Product } from 'shared/products';
import type { Cart } from 'shared/schema';
import { describe, expect, it } from 'vitest';

import {
  deliveryOptionsHTML,
  generateCartSummary,
} from '#pages/htmlGenerators/cartSummaryHTML.ts';
import cart from '#testData/cart.json' with { type: 'json' };
import cartSummaryHTML from '#testData/cartSummaryHTML.html?raw' with { type: 'text' };
import deliveryOptionsHTMLText from '#testData/deliveryOptionsHTML.html?raw' with { type: 'text' };
import products from '#testData/products.json' with { type: 'json' };

const getMatchingCart = (cart: Cart[], productId: string) =>
  cart.find((cartItem) => cartItem.productId === productId);

describe.concurrent('deliveryOptionsHTML', () => {
  it('generate correct html', () => {
    const html = deliveryOptionsHTML('1')
      .replaceAll('\n', '')
      .replaceAll(' ', '');
    expect(html).toBe(
      deliveryOptionsHTMLText.replaceAll('\n', '').replaceAll(' ', ''),
    );
  });
});

describe.concurrent('generateCartSummary', () => {
  it('generate correct html', () => {
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
