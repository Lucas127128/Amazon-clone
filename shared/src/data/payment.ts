import type { Cart } from '../schema';
import { checkNullish } from '../utils/typeChecker';
import { getMatchingProduct, type Product } from './products';
import { getDeliveryPriceCents } from './deliveryOption';

export type Prices = {
  totalProductPrice: number;
  totalDeliveryFee: number;
  cartQuantity: number;
  totalPriceBeforeTax: number;
  totalTax: number;
  totalOrderPrice: number;
};

export function calculatePrices(
  cart: Cart[],
  products: readonly Product[],
) {
  let totalProductPrice = 0;
  let totalDeliveryFee = 0;
  let cartQuantity = 0;
  for (const cartItem of cart) {
    const product = getMatchingProduct(products, cartItem.productId);
    checkNullish(product, 'Fail to get matching product');
    const totalPrice = product.priceCents * cartItem.quantity;
    totalProductPrice += totalPrice;
    cartQuantity += cartItem.quantity;

    const deliveryFee = getDeliveryPriceCents(cartItem.deliveryOptionId);
    totalDeliveryFee += deliveryFee;
  }

  const totalPriceBeforeTax = totalDeliveryFee + totalProductPrice;
  const totalTax = totalPriceBeforeTax / 10;
  const totalOrderPrice = totalPriceBeforeTax + totalTax;
  return {
    totalProductPrice,
    totalDeliveryFee,
    cartQuantity,
    totalPriceBeforeTax,
    totalTax,
    totalOrderPrice,
  } satisfies Prices;
}
