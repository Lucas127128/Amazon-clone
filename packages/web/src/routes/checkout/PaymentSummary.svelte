<script lang="ts">
  import { cn } from 'cnfast';
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

  const paymentSummaryRowTwClass =
    'grid grid-cols-[1fr_auto] text-[15px] mb-2.25';
</script>

<div class={paymentSummaryRowTwClass}>
  <div>Items ({cartQuantity}):</div>
  <div class="text-right">
    ${formatCurrency(totalProductPrice)}
  </div>
</div>

<div class={paymentSummaryRowTwClass}>
  <div>Shipping &amp; handling:</div>
  <div class="text-right">
    ${formatCurrency(totalDeliveryFee)}
  </div>
</div>

<div class={paymentSummaryRowTwClass}>
  <div class="pt-2.25">Total before tax:</div>
  <div
    class="border-0 border-t border-solid border-[#dedede] pt-2.25 text-right"
  >
    ${formatCurrency(totalPriceBeforeTax)}
  </div>
</div>

<div class={paymentSummaryRowTwClass}>
  <div>Estimated tax (10%):</div>
  <div class="text-right">
    ${formatCurrency(totalTax)}
  </div>
</div>

<div
  class={cn`${paymentSummaryRowTwClass} border-0 border-t border-solid border-[#dedede] pt-4.5 text-[18px] font-bold text-[#b12704]`}
>
  <div>Order total:</div>
  <div class="text-right">
    ${formatCurrency(totalOrderPrice)}
  </div>
</div>
