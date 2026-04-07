import type { Product } from 'shared/products';
import { describe, expect, test } from 'vitest';
import { generateAmazonHTML } from 'web/amazonHTML';

import amazonHTML from '#testData/amazonHTML.html?raw' with { type: 'text' };
import products from '#testData/products.json';

describe.concurrent('generateAmazonHTML', () => {
  test('generate correct amazon HTML', () => {
    const html = generateAmazonHTML(products[0] as Product, true)
      .replaceAll('\n', '')
      .replaceAll(' ', '');
    expect(html).toBe(amazonHTML.replaceAll('\n', '').replaceAll(' ', ''));
  });
});
