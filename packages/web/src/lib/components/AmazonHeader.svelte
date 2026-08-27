<script lang="ts">
  import type { Cart } from 'shared/schema';

  import {
    searchProducts,
    searchProductsSuggestions,
  } from '#lib/data/search.ts';
  import { goto } from '$app/navigation';
  import { page } from '$app/state';

  const { cartQuantity, cart }: { cartQuantity: number; cart: Cart[] } =
    $props();
</script>

<div
  class="bg-[#2d2d2d] text-white pl-3.75 pr-3.75 flex items-center justify-between sticky top-0 right-0 left-0 h-15 [anchor-name:\--amazon-header]"
>
  {let searchTerm = $state(page.params.query ?? '')}
  <div class="lg:w-45 md:w-[unset]">
    <a
      href="/"
      class=" text-white inline-block p-1.5 rounded-xs cursor-pointer decoration-[#2d2d2d] hover:outline"
      onclick={() => {
        searchTerm = '';
      }}
    >
      <img
        class="w-25 mt-1.25 hidden sm:block"
        src="/images/amazon-logo-white.webp"
        fetchpriority="high"
        alt="amazon logo"
      />
      <img
        fetchpriority="high"
        class="h-8.75 mt-1.25 sm:hidden block"
        src="/images/amazon-mobile-logo-white.webp"
        alt="amazon logo"
      />
    </a>
  </div>

  <div class="flex flex-1 max-w-212.5 ml-2.5 mr-2.5">
    {let options = $state<string[]>([])}
    <input
      class="flex-1 w-0 text-[16px] h-9.5 pl-3.75 border-0 rounded-sm rounded-r-none"
      type="text"
      placeholder="Search"
      list="search-suggestions"
      bind:value={searchTerm}
      onkeyup={() => {
        searchProductsSuggestions.maybeExecute(searchTerm, (products) => {
          options = products.map((product) => product.name);
        });
      }}
    />
    <datalist id="search-suggestions">
      {#each options as option (option)}
        <option>{option}</option>
      {/each}
    </datalist>

    <button
      class="bg-[#febd69] border-0 w-11.25 h-10 shrink-0 rounded-r-sm"
      onclick={async () => {
        const products = await searchProducts(searchTerm);
        goto(`/${JSON.stringify(products)}/${searchTerm}`);
      }}
    >
      <img
        class="h-5.5 ml-0.5 mt-0.75"
        fetchpriority="high"
        src="/images/icons/search-icon.svg"
        alt="search icon"
      />
    </button>
  </div>

  <div class="w-45 shrink-0 flex justify-end">
    <a
      class="text-white inline-block p-1.5 rounded-xs cursor-pointer decoration-[#2d2d2d] hover:outline"
      href="/orders/[]"
    >
      <span class="block text-[13px]">Returns</span>
      <span class="block text-[15px] font-bold">& Orders</span>
    </a>

    <a
      class="hover:outline p-1.5 flex rounded-xs cursor-pointer text-white items-center relative text-[16px] decoration-0 decoration-[#2d2d2d]"
      href={`/checkout/${JSON.stringify(cart)}`}
    >
      <img
        class="w-12.5"
        fetchpriority="high"
        src="/images/icons/cart-icon.png"
        alt="checkout cart icon"
      />
      <div
        class="text-[#f08804] font-bold absolute top-1 left-5.5 w-6.5 text-center"
      >
        {cartQuantity}
      </div>
      <div class="mt-3 font-bold text-[15px]">Cart</div>
    </a>
  </div>
</div>
