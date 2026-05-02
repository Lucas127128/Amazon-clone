import type { Product } from 'shared/products';
import { amazonHTML, productsJson as products } from 'testdata';
import { describe, expect, it } from 'vitest';

import { generateAmazonHTML } from '#pages/htmlGenerators/amazonHTML.ts';

describe.concurrent('generateAmazonHTML', () => {
  it('generate correct amazon HTML', () => {
    const html = generateAmazonHTML(products[0] as Product, true)
      .replaceAll('\n', '')
      .replaceAll(' ', '');
    expect(html).toBe(amazonHTML.replaceAll('\n', '').replaceAll(' ', ''));
  });
});
