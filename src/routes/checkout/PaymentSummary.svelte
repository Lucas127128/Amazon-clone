<script lang="ts">
  import { cn } from 'cnfast';

  import { getCartContext } from '#lib/data/cart.svelte.ts';
  import { Prices } from '#lib/data/payment.svelte.ts';
  import type { Product } from '#lib/data/products.ts';
  import { formatCurrency } from '#lib/utils/money.ts';

  const { products }: { products: Product[] } = $props();
  const cart = getCartContext();
  const prices = $derived(new Prices(cart.items, products));

  const paymentSummaryRowTwClass =
    'grid grid-cols-[1fr_auto] text-[15px] mb-2.25';
</script>

<div class={paymentSummaryRowTwClass}>
  <div>Items ({cart.quantity}):</div>
  <div class="text-right">
    ${formatCurrency(prices.totalProductPrice)}
  </div>
</div>

<div class={paymentSummaryRowTwClass}>
  <div>Shipping &amp; handling:</div>
  <div class="text-right">
    ${formatCurrency(prices.totalDeliveryFee)}
  </div>
</div>

<div class={paymentSummaryRowTwClass}>
  <div class="pt-2.25">Total before tax:</div>
  <div
    class="border-0 border-t border-solid border-[#dedede] pt-2.25 text-right"
  >
    ${formatCurrency(prices.totalPriceBeforeTax)}
  </div>
</div>

<div class={paymentSummaryRowTwClass}>
  <div>Estimated tax (10%):</div>
  <div class="text-right">
    ${formatCurrency(prices.totalTax)}
  </div>
</div>

<div
  class={cn`${paymentSummaryRowTwClass} border-0 border-t border-solid border-[#dedede] pt-4.5 text-[18px] font-bold text-[#b12704]`}
>
  <div>Order total:</div>
  <div class="text-right">
    ${formatCurrency(prices.totalOrderPrice)}
  </div>
</div>
