import { calculatePrices } from 'shared/payment';
import { type Product, transformProducts } from 'shared/products';
import type { Cart, RawProduct } from 'shared/schema';
import { cartJson, clothingsJson, rawProductsJson } from 'testdata';
import { describe, expect, it } from 'vitest';

describe.concurrent('calculatePrices', () => {
  describe.concurrent('calculate price for right product id', () => {
    const cart = cartJson.slice(0, 2) as Cart[];
    const products: readonly Product[] = transformProducts(
      rawProductsJson as RawProduct[],
      clothingsJson,
    );
    const { data: prices, error } = calculatePrices(cart, products);
    if (error) throw new Error(error.message);

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

  describe.concurrent('calculate price for wrong product id', () => {
    const cart = cartJson.slice(0, 2) as Cart[];
    const products: readonly Product[] = transformProducts(
      rawProductsJson as RawProduct[],
      clothingsJson,
    );
    const { data: prices, error } = calculatePrices(
      [
        ...cart,
        { productId: 'abcde', quantity: 1, deliveryOptionId: '1' },
      ],
      products,
    );
    it('returns error', () => {
      expect(error).toBeDefined();
      expect(prices).toBeNull();
    });
    it('has right error message', () => {
      expect(error?.message).toBe('Fail to get matching product');
      expect(error?.productId).toBe('abcde');
    });
  });
});
