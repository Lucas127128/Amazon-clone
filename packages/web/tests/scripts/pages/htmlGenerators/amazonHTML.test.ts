import type { Product } from 'shared/products';
import { amazonHTML1, amazonHTML2, productsJson } from 'testdata';
import { describe, expect, it } from 'vitest';

import { generateAmazonHTML } from '#pages/htmlGenerators/amazonHTML.ts';

describe.concurrent('generateAmazonHTML', () => {
  it('generate correct amazon HTML for non-clothing product', () => {
    const html = generateAmazonHTML(productsJson[0] as Product, true)
      .replaceAll('\n', '')
      .replaceAll(' ', '');
    expect(html).toBe(
      amazonHTML1.replaceAll('\n', '').replaceAll(' ', ''),
    );
  });
  it('generate correct amazon HTML for clothing product', () => {
    const product = productsJson.find((p) => p.id === '_7u2l') as Product;
    const html = generateAmazonHTML(product, false)
      .replaceAll('\n', '')
      .replaceAll(' ', '');
    expect(html).toBe(
      amazonHTML2.replaceAll('\n', '').replaceAll(' ', ''),
    );
  });
});
