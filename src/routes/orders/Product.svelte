<script lang="ts">
  import { cn } from 'cnfast';

  import { getCartContext } from '#lib/data/cart.svelte.js';
  import { getDeliveryDate } from '#lib/data/deliveryOption.ts';
  import type { Product } from '#lib/data/products.ts';
  import type { Cart, Order } from '#lib/schema.ts';

  const {
    matchingProduct,
    cartItem,
    order,
  }: {
    matchingProduct: Product;
    cartItem: Cart;
    order: Order;
  } = $props();
  const cart = getCartContext();

  const deliveryDate = $derived(getDeliveryDate(cartItem.deliveryOptionId));
  const buttonSecondaryTwClass =
    'cursor-pointer rounded-lg border border-solid border-[#d5d9d9] bg-white text-[#212121] shadow-[0_2px_5px_rgba(213,217,217,0.5)] hover:bg-[#f7fafa] active:bg-[#edfdfd] active:shadow-none';
</script>

<div class="text-center">
  <img
    src={matchingProduct.image}
    alt={matchingProduct.name}
    class="xs:max-h-27.5 mb-5 max-h-37.5 max-w-37.5"
  />
</div>

<div>
  <div class="mb-2.5 font-bold sm:mb-1.25">
    {matchingProduct.name}
  </div>
  <div class="mb-0.75">
    Arriving on: {deliveryDate}
  </div>
  <div class="mb-3.75 sm:mb-2">
    Quantity: {cartItem.quantity}
  </div>
  <button
    class="button-primary xs:w-35 mb-3.75 flex h-9 w-full items-center justify-center rounded-lg text-[15px] sm:mb-0"
    onclick={() => {
      cart.add(cartItem.productId, 1);
    }}
  >
    <img
      class="mr-3.75 w-6.25"
      src="/images/icons/buy-again.png"
      alt="buy again icon"
    />
    <span>Buy it again</span>
    <span class="hidden opacity-0">&#x2713; Added</span>
  </button>
</div>

<div class="xs:col-2 xs:mb-7.5 mb-17.5 self-start md:col-auto md:mb-0">
  <a href={`/tracking/${JSON.stringify(order)}/${cartItem.productId}`}>
    <button
      class={cn`${buttonSecondaryTwClass} xs:w-35 w-full p-2 text-[15px] sm:w-35 md:w-full`}
    >
      Track package
    </button>
  </a>
</div>
