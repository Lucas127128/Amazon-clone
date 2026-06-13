import * as Effect from 'effect/Effect';

import { PRICE_CONFIG } from '../../config/constants.ts';
import type { Cart } from '../schema.ts';
import { PriceCalculationError } from '../taggedError.ts';
import { getDeliveryPriceCents } from './deliveryOption.ts';
import { getMatchingProduct, type Product } from './products.ts';

export type Prices = {
  totalProductPrice: number;
  totalDeliveryFee: number;
  cartQuantity: number;
  totalPriceBeforeTax: number;
  totalTax: number;
  totalOrderPrice: number;
};

export function calculatePrices(cart: Cart[], products: readonly Product[]) {
  let totalProductPrice = 0;
  let totalDeliveryFee = 0;
  let cartQuantity = 0;
  for (const cartItem of cart) {
    const product = getMatchingProduct(products, cartItem.productId);
    if (!product)
      return Effect.fail(
        new PriceCalculationError(
          cartItem.productId,
          'Fail to get matching product',
        ),
      );
    const totalPrice = product.priceCents * cartItem.quantity;
    totalProductPrice += totalPrice;
    cartQuantity += cartItem.quantity;

    const deliveryFee = getDeliveryPriceCents(cartItem.deliveryOptionId);
    totalDeliveryFee += deliveryFee;
  }

  const totalPriceBeforeTax = totalDeliveryFee + totalProductPrice;
  const totalTax = totalPriceBeforeTax * PRICE_CONFIG.TAX_RATE;
  const totalOrderPrice = totalPriceBeforeTax + totalTax;
  return Effect.succeed({
    totalProductPrice,
    totalDeliveryFee,
    cartQuantity,
    totalPriceBeforeTax,
    totalTax,
    totalOrderPrice,
  });
}
