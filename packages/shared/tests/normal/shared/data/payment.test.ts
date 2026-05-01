import clothings from 'server/clothing';
import rawProducts from 'server/rawProducts';
import { describe, expect, expectTypeOf, it } from 'vitest';

import cartJson from '#testData/cart.json';

import {
  calculatePrices,
  type Prices,
} from '../../../../src/data/payment';
import {
  type Product,
  transformProducts,
} from '../../../../src/data/products';
import type { Cart, RawProduct } from '../../../../src/schema';

describe.concurrent('calculatePrices', () => {
  const cart = cartJson.slice(0, 2) as Cart[];
  const products: readonly Product[] = transformProducts(
    rawProducts as RawProduct[],
    clothings,
  );
  const { data: prices, error } = calculatePrices(cart, products);
  if (error) throw new Error(error.message);

  it('have right type', () => {
    expectTypeOf(prices).toEqualTypeOf<Prices>();
  });

  it('calculate totalProductPrice', () => {
    const { totalProductPrice } = prices;
    expect(totalProductPrice).toBe(6289);
  });

  it('calculate totalDeliveryFee', () => {
    const { totalDeliveryFee } = prices;
    expect(totalDeliveryFee).toBe(1498);
  });

  it('calculate cartQuantity', () => {
    const { cartQuantity } = prices;
    expect(cartQuantity).toBe(2);
  });

  it('calculate totalPriceBeforeTax', () => {
    const { totalPriceBeforeTax } = prices;
    expect(totalPriceBeforeTax).toBe(7787);
  });

  it('calculate totalTax', () => {
    const { totalTax } = prices;
    expect(totalTax).toBe(778.7);
  });

  it('calculate totalOrderPrice', () => {
    const { totalOrderPrice } = prices;
    expect(totalOrderPrice).toBe(8565.7);
  });
});
