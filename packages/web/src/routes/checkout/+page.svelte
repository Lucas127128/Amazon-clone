<script lang="ts">
  import { STORAGE_KEYS } from 'shared/constants';
  import { OrdersSchema } from 'shared/schema';
  import { parse } from 'valibot';

  import { getCart } from '#lib/data/cart.js';
  import { createOrder } from '#lib/orders.remote.js';
  import { goto } from '$app/navigation';

  import CartItems from './CartItems.svelte';
  import PaymentSummary from './PaymentSummary.svelte';

  const { data } = $props();
  // svelte-ignore  state_referenced_locally
  const products = $state(data.products);

  let cart = $state(getCart());
  const cartQuantity = $derived(
    cart.reduce((acc, item) => acc + item.quantity, 0),
  );
  $effect(() => {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
  });
</script>

<div
  class="fixed top-0 right-0 left-0 grid h-12 grid-cols-[3em_14em_3.5em] grid-rows-[48px] place-content-center place-items-start gap-[12dvw] bg-white p-[1.5dvw] pt-4.5 pb-1 contain-strict sm:gap-[14dvw] md:grid-cols-[6.5em_14em_3.5em] lg:gap-[27dvw]"
>
  <div class="pl-5">
    <a href="/">
      <img
        class="hidden w-25 sm:block"
        src="/images/amazon-logo.webp"
        alt="amazon logo"
      />
      <img
        class="block h-8.75 sm:hidden"
        src="/images/amazon-mobile-logo.webp"
        alt="amazon logo"
      />
    </a>
  </div>

  <div class="mt-[-0.15em] text-2xl font-semibold">
    Checkout (<a
      class="cursor-pointer text-2xl font-medium text-[#007185] decoration-white decoration-0"
      href="/">{cartQuantity} items</a
    >)
  </div>

  <div class="pr-5">
    <img
      src="/images/icons/checkout-lock-icon.svg"
      alt="locked checkout cart icon"
    />
  </div>
</div>

<div
  class="mt-35 mr-auto mb-25 ml-auto pr-7.5 pl-7.5 md:max-w-125 lg:max-w-275"
>
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

  <div class="mb-4.5 text-[22px] font-bold">Review your order</div>

  <div
    class="grid items-start gap-x-3 md:grid-cols-[1fr] lg:grid-cols-[1fr_350px]"
  >
    <div class="row-2 lg:row-auto">
      <CartItems {products} bind:cart />
    </div>

    <div
      class="row-1 mb-3 rounded-sm border border-solid border-[#dedede] p-4.5 pb-1.25 lg:row-auto"
    >
      <div class="mb-3 text-lg font-bold">Order Summary</div>
      <PaymentSummary {cart} {products} />
      <button
        class="button-primary mt-2.75 mb-3.75 w-full rounded-lg pt-3 pb-3"
        onclick={async () => {
          const { data: order, error } = await createOrder(cart);
          if (error) throw error;
          const orders = parse(
            OrdersSchema,
            JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDER) ?? '[]'),
          );
          orders.unshift(order);
          localStorage.setItem(STORAGE_KEYS.ORDER, JSON.stringify(orders));
          localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify([]));
          await goto('/orders');
        }}
      >
        Place your order
      </button>
    </div>
  </div>
</div>
