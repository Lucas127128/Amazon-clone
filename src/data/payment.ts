import { Cart } from "./cart";
import { checkTruthy } from "../Scripts/Utils/typeChecker";
import { getMatchingProduct, Product } from "./products";
import { getDeliveryPriceCents } from "./deliveryOption";

export interface Prices {
  totalProductPrice: number;
  totalDeliveryFee: number;
  cartQuantity: number;
  totalPriceBeforeTax: number;
  totalTax: number;
  totalOrderPrice: number;
}

export function calculatePrices(cart: Cart[], products: Product[]): Prices {
  let totalProductPrice = 0;
  let totalDeliveryFee = 0;
  let cartQuantity = 0;
  cart.forEach((cartItem) => {
    const product = getMatchingProduct(products, cartItem.productId);
    checkTruthy(product, "Fail to get matching product");
    const totalPrice = product.priceCents * cartItem.quantity;
    totalProductPrice += totalPrice;
    cartQuantity += cartItem.quantity;

    const deliveryFee = getDeliveryPriceCents(cartItem.deliveryOptionId);
    totalDeliveryFee += deliveryFee;
  });

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
  };
}
