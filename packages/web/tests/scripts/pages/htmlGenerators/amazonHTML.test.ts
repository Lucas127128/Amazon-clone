import type { Product } from 'shared/products';
import { productsJson } from 'testdata';
import { describe, it } from 'vitest';

import { generateAmazonHTML } from '#pages/htmlGenerators/amazonHTML.ts';

describe.concurrent('generateAmazonHTML', () => {
  it('generate correct amazon HTML for non-clothing product', ({
    expect,
  }) => {
    const html = generateAmazonHTML(productsJson[0] as Product, true);
    expect(html).toMatchSnapshot();
  });
  it('generate correct amazon HTML for clothing product', ({ expect }) => {
    const product = productsJson.find((p) => p.id === '_7u2l') as Product;
    const html = generateAmazonHTML(product, false);
    expect(html).toMatchSnapshot();
  });
});
