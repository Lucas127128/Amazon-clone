import type { Cart } from '../schema.ts';
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

export function calculatePrices(
  cart: Cart[],
  products: readonly Product[],
):
  | { data: Prices; error: null }
  | {
      data: null;
      error: {
        message: 'Fail to get matching product';
        productId: string;
      };
    } {
  let totalProductPrice = 0;
  let totalDeliveryFee = 0;
  let cartQuantity = 0;
  for (const cartItem of cart) {
    const product = getMatchingProduct(products, cartItem.productId);
    if (!product)
      return {
        data: null,
        error: {
          message: 'Fail to get matching product',
          productId: cartItem.productId,
        },
      };
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
    data: {
      totalProductPrice,
      totalDeliveryFee,
      cartQuantity,
      totalPriceBeforeTax,
      totalTax,
      totalOrderPrice,
    },
    error: null,
  };
}
