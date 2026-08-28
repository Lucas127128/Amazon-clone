<script lang="ts">
  import * as Effect from 'effect/Effect';
  import { getDeliveryDate } from 'shared/deliveryOption';
  import { getMatchingProduct } from 'shared/products';
  import { OrderSchema } from 'shared/schema';
  import { parse } from 'valibot';

  import AmazonHeader from '#lib/components/AmazonHeader.svelte';
  import { getMatchingCart } from '#lib/data/cart.js';
  import { getDeliveryProgress } from '#lib/data/tracking.ts';

  const { params, data } = $props();
  const order = $derived(parse(OrderSchema, JSON.parse(params.order)));
  const matchingCart = $derived(
    getMatchingCart(order.products, params.productId),
  );
  const matchingProduct = $derived(
    getMatchingProduct(data.products, params.productId),
  );
  const deliveryProgressPercent = $derived(
    Effect.runSync(getDeliveryProgress(order, matchingCart!)),
  );
</script>

<AmazonHeader cartQuantity={1} cart={[]} products={data.products} />

<div class="mt-22.5 mr-auto mb-25 ml-auto max-w-212.5 pr-7.5 pl-7.5">
  <dialog class="border-none bg-inherit" id="general-error-dialog">
    <div
      class="grid w-60 grid-cols-1 grid-rows-[2fr_1fr] gap-4 rounded-2xl border-2 border-solid border-red-700 bg-white p-2.5"
    >
      <p>
        Sorry, something went wrong in our website. Please try again later.
      </p>
      <button
        class="overflow-hidden rounded-xl border-none bg-green-700 text-white"
        command="close"
        commandfor="general-error-dialog"
      >
        OK
      </button>
    </div>
  </dialog>
  <div class="order-tracking">
    <a
      class="link-primary mb-7.5 inline-block"
      href="/orders"
      onclick={(e) => {
        e.preventDefault();
        navigation.back();
      }}
    >
      View all orders
    </a>
    {#if matchingCart && matchingProduct}
      <div class="mb-2.5 text-[25px] font-bold">
        Arriving on {getDeliveryDate(matchingCart.deliveryOptionId)}
      </div>

      <div class="mb-0.75">{matchingProduct.name}</div>

      <div class="mb-0.75">Quantity: {matchingCart.quantity}</div>

      <img
        class="mt-6.25 mb-12.5 max-h-37.5 max-w-37.5"
        src={matchingProduct.image}
        alt={matchingProduct.name}
      />

      <div
        class="mb-3.75 flex justify-between font-medium sm:text-[16px] md:text-xl"
      >
        <div class="progress-label">Preparing</div>
        <div class="progress-label text-[#067d62]">Shipped</div>
        <div class="progress-label">Delivered</div>
      </div>

      <div
        class="h-6.25 w-full overflow-hidden rounded-[50px] border border-solid border-[#c8c8c8]"
      >
        <div
          class="h-full w-1/2 rounded-[50px] bg-green-700"
          style:width={`${deliveryProgressPercent}%`}
        ></div>
      </div>
    {/if}
  </div>
</div>
