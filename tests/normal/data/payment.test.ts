import { describe, test, expect } from 'bun:test';
import rawProducts from '#root/src/api/rawProducts.json';
import clothings from '#root/src/api/clothing.json';
import { Cart } from '#data/cart.ts';
import { calculatePrices } from '#data/payment.ts';
import { Product, transformProducts } from '#data/products.ts';

describe('test suite: calculatePrices', () => {
  const cart: Cart[] = [
    { productId: '59LXo', quantity: 1, deliveryOptionId: '2' },
    { productId: 'Hwme8', quantity: 1, deliveryOptionId: '3' },
  ];
  const products: readonly Product[] = transformProducts(
    rawProducts,
    clothings,
  );
  const prices = calculatePrices(cart, products);

  test('calculate totalProductPrice', () => {
    const { totalProductPrice } = prices;
    expect(totalProductPrice).toBe(6289);
  });

  test('calculate totalDeliveryFee', () => {
    const { totalDeliveryFee } = prices;
    expect(totalDeliveryFee).toBe(1498);
  });

  test('calculate cartQuantity', () => {
    const { cartQuantity } = prices;
    expect(cartQuantity).toBe(2);
  });

  test('calculate totalPriceBeforeTax', () => {
    const { totalPriceBeforeTax } = prices;
    expect(totalPriceBeforeTax).toBe(7787);
  });

  test('calculate totalTax', () => {
    const { totalTax } = prices;
    expect(totalTax).toBe(778.7);
  });

  test('calculate totalOrderPrice', () => {
    const { totalOrderPrice } = prices;
    expect(totalOrderPrice).toBe(8565.7);
  });
});
