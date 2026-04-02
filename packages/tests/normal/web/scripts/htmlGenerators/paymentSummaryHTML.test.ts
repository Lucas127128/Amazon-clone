import type { Prices } from 'shared/payment';
import { calculatePrices } from 'shared/payment';
import { describe, expect, test } from 'bun:test';
import products from '../../../products.json';
import { generatePaymentSummary } from 'web/paymentSummaryHTML';
import type { Cart } from 'shared/schema';

describe.concurrent('test suite: generatePaymentSummary', () => {
  test('generate correct HTML', async () => {
    const cart = (await Bun.file(
      './tests/normal/cart.json',
    ).json()) as Cart[];
    const price: Prices = calculatePrices(cart, products);
    const html = generatePaymentSummary(price)
      .replaceAll('\n', '')
      .replaceAll(' ', '');
    const correctHTML = (
      await Bun.file('./tests/normal/paymentSummaryHTML.html').text()
    )
      .replaceAll('\n', '')
      .replaceAll(' ', '');
    expect(html).toBe(correctHTML);
  });
});
