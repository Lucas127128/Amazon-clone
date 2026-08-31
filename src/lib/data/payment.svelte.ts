import { getMatchingProduct, type Product } from '#lib/data/products.ts';
import type { Cart } from '#lib/schema.ts';

import { PRICE_CONFIG } from './constants';
import { getDeliveryPriceCents } from './deliveryOption';

export class Prices {
  constructor(
    private readonly cart: readonly Cart[],
    private readonly products: Product[],
  ) {}
  get totalProductPrice() {
    return this.cart.reduce((acc, item) => {
      const product = getMatchingProduct(this.products, item.productId);
      if (!product) throw new Error(`Product not found: ${item.productId}`);
      return acc + item.quantity * product.priceCents;
    }, 0);
  }
  get totalDeliveryFee() {
    return this.cart.reduce((acc, item) => {
      const deliveryFee = getDeliveryPriceCents(item.deliveryOptionId);
      return acc + deliveryFee;
    }, 0);
  }
  get totalPriceBeforeTax() {
    return this.totalDeliveryFee + this.totalProductPrice;
  }
  get totalTax() {
    return this.totalPriceBeforeTax * PRICE_CONFIG.TAX_RATE;
  }
  get totalOrderPrice() {
    return this.totalPriceBeforeTax + this.totalTax;
  }
}
