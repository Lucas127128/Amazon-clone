<script lang="ts">
  import { PRICE_CONFIG } from 'shared/constants';
  import { getDeliveryPriceCents } from 'shared/deliveryOption';
  import { formatCurrency } from 'shared/money';
  import { getMatchingProduct, type Product } from 'shared/products';
  import type { Cart } from 'shared/schema';

  const { cart, products }: { cart: Cart[]; products: Product[] } = $props();
  const totalProductPrice = $derived(
    cart.reduce((acc, item) => {
      const product = getMatchingProduct(products, item.productId);
      if (!product) throw new Error(`Product not found: ${item.productId}`);
      return acc + item.quantity * product.priceCents;
    }, 0),
  );
  const totalDeliveryFee = $derived(
    cart.reduce((acc, item) => {
      const deliveryFee = getDeliveryPriceCents(item.deliveryOptionId);
      return acc + deliveryFee;
    }, 0),
  );
  const cartQuantity = $derived(
    cart.reduce((acc, item) => acc + item.quantity, 0),
  );
  const totalPriceBeforeTax = $derived(totalDeliveryFee + totalProductPrice);
  const totalTax = $derived(totalPriceBeforeTax * PRICE_CONFIG.TAX_RATE);
  const totalOrderPrice = $derived(totalPriceBeforeTax + totalTax);
</script>

<div class="payment-summary-row">
  <div class="cart-item-quantity">Items ({cartQuantity}):</div>
  <div class="payment-summary-money total-products-price">
    ${formatCurrency(totalProductPrice)}
  </div>
</div>

<div class="payment-summary-row">
  <div>Shipping &amp; handling:</div>
  <div class="payment-summary-money total-delivery-fee">
    ${formatCurrency(totalDeliveryFee)}
  </div>
</div>

<div class="payment-summary-row subtotal-row">
  <div>Total before tax:</div>
  <div class="payment-summary-money total-price-before-tax">
    ${formatCurrency(totalPriceBeforeTax)}
  </div>
</div>

<div class="payment-summary-row">
  <div>Estimated tax (10%):</div>
  <div class="payment-summary-money total-tax">
    ${formatCurrency(totalTax)}
  </div>
</div>

<div class="payment-summary-row total-row">
  <div>Order total:</div>
  <div class="payment-summary-money total-cost">
    ${formatCurrency(totalOrderPrice)}
  </div>
</div>

<style>
  .payment-summary-row {
    display: grid;
    grid-template-columns: 1fr auto;

    font-size: 15px;
    margin-bottom: 9px;
  }

  .payment-summary-money {
    text-align: right;
  }

  .subtotal-row .payment-summary-money {
    border-top: 1px solid rgb(222, 222, 222);
  }

  .subtotal-row div {
    padding-top: 9px;
  }

  .total-row {
    color: rgb(177, 39, 4);
    font-weight: 700;
    font-size: 18px;

    border-top: 1px solid rgb(222, 222, 222);
    padding-top: 18px;
  }
</style>
