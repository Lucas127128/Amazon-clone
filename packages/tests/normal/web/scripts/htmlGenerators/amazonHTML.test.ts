import { describe, expect, test } from 'bun:test';
import { generateAmazonHTML } from 'web/amazonHTML';
import products from '../../../products.json';

describe.concurrent('generateAmazonHTML', () => {
  test('generate correct amazon HTML', async () => {
    const html = generateAmazonHTML(products[0], true)
      .replaceAll('\n', '')
      .replaceAll(' ', '');
    const correctHTML = (await Bun.file('./normal/amazonHTML.html').text())
      .replaceAll('\n', '')
      .replaceAll(' ', '');
    expect(html).toBe(correctHTML);
  });
});
