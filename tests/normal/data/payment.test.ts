import { describe, expect, it } from 'vitest';

import { Prices } from '#lib/data/payment.svelte.ts';
import { transformProducts } from '#lib/data/products.ts';
import type { Cart, RawProduct } from '#lib/schema.ts';
import { cartJson, clothingsJson, rawProductsJson } from '#testdata';

describe.concurrent('calculatePrices', () => {
  const cart = cartJson.slice(0, 2) as Cart[];
  const products = transformProducts(
    rawProductsJson as RawProduct[],
    clothingsJson,
  );
  const prices = new Prices(cart, products);

  it('calculate totalProductPrice', () => {
    expect(prices.totalProductPrice).toBe(6289);
  });

  it('calculate totalDeliveryFee', () => {
    expect(prices.totalDeliveryFee).toBe(1498);
  });

  it('calculate totalPriceBeforeTax', () => {
    expect(prices.totalPriceBeforeTax).toBe(7787);
  });

  it('calculate totalTax', () => {
    expect(prices.totalTax).toBe(778.7);
  });

  it('calculate totalOrderPrice', () => {
    expect(prices.totalOrderPrice).toBe(8565.7);
  });
});
