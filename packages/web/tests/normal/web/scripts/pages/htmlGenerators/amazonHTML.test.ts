import type { Product } from 'shared/products';
import { describe, expect, it } from 'vitest';

import amazonHTML from '#testData/amazonHTML.html?raw' with { type: 'text' };
import products from '#testData/products.json';

import { generateAmazonHTML } from '../../../../../../src/scripts/pages/htmlGenerators/amazonHTML';

describe.concurrent('generateAmazonHTML', () => {
  it('generate correct amazon HTML', () => {
    const html = generateAmazonHTML(products[0] as Product, true)
      .replaceAll('\n', '')
      .replaceAll(' ', '');
    expect(html).toBe(amazonHTML.replaceAll('\n', '').replaceAll(' ', ''));
  });
});
