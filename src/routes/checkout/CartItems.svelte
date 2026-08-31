<script lang="ts">
  import { getCartContext } from '#lib/data/cart.svelte.ts';
  import {
    deliveryOptions,
    getDeliveryDate,
    getPriceString,
  } from '#lib/data/deliveryOption.ts';
  import type { Product } from '#lib/data/products.ts';

  let {
    // eslint-disable-next-line
    products,
  }: { products: Product[] } = $props();

  const cart = getCartContext();

  const buttonLinkTwClass =
    'border-none bg-inherit text-[#017cb6] text-[16px] hover:text-[#c45000]';
</script>

{#each cart.items as cartItem (cartItem.productId)}
  {const product = products.find((p) => p.id === cartItem.productId)}
  {#if product}
    <div class="mb-3 rounded-sm border border-solid border-[#dedede] p-4.5">
      <div class=" mt-1.25 mb-5.5 text-[19px] font-bold text-[#007600]">
        Delivery date: {getDeliveryDate(cartItem.deliveryOptionId)}
      </div>

      <div
        class="grid gap-x-6.25 sm:grid-cols-[100px_1fr] sm:gap-y-7.5 md:grid-cols-[100px_1fr_1fr]"
      >
        <img
          class="mr-auto ml-auto max-h-30 max-w-full"
          src={product.image}
          alt={product.name}
        />

        <div class="cart-item-details">
          <div class="mb-2 font-bold">{product.name}</div>
          <div class=" mb-1.25 font-bold text-[#b12704]">
            ${product.price}
          </div>
          <div>
            <span>
              Quantity:
              <span>{cartItem.quantity}</span>
            </span>
            {let open = $state(false)}
            <button
              class={buttonLinkTwClass}
              onclick={() => {
                open = true;
              }}
            >
              Update
            </button>
            {#if open}
              {let quantity = $state(cartItem.quantity)}
              <input
                type="number"
                placeholder="quantity"
                min="1"
                max="10"
                bind:value={quantity}
                class="w-10 focus:outline-none"
              />
              <button
                class={buttonLinkTwClass}
                onclick={() => {
                  cart.updateQuantity(cartItem.productId, quantity);
                  open = false;
                }}
              >
                Save</button
              >
            {/if}

            <button
              class={buttonLinkTwClass}
              onclick={() => {
                cart.remove(cartItem.productId);
              }}
            >
              Delete
            </button>
            <span class="text-sm text-red-700"></span>
          </div>
        </div>
        <div class="sm:col-span-2 md:col-span-1">
          <div class="mb-2.5 font-bold">Choose a delivery option:</div>
          {let option: '1' | '2' | '3' = $state(cartItem.deliveryOptionId)}
          {#each deliveryOptions as deliveryOption (deliveryOption.id)}
            {const deliveryDate = getDeliveryDate(deliveryOption.id)}
            {const priceString = getPriceString(deliveryOption.priceCents)}
            <div>
              <input
                type="radio"
                class="ml-0 cursor-pointer"
                bind:group={option}
                value={deliveryOption.id}
                onchange={() => {
                  cart.updateDeliveryOption(cartItem.productId, option);
                }}
              />
              <div>
                <div class="mb-0.75 font-semibold text-[#007600]">
                  {deliveryDate}
                </div>
              </div>
              <div class="text-[15px] text-[#787878]">
                {priceString}Shipping
              </div>
            </div>
          {/each}
        </div>
      </div>
    </div>
  {/if}
{/each}
