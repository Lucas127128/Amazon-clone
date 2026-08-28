<script lang="ts">
  import type { Product } from 'shared/products';
  import type { Cart } from 'shared/schema';

  import { searchProductIds, searchProductNames } from '#lib/data/search.ts';
  import { goto } from '$app/navigation';
  import { page } from '$app/state';

  const {
    cartQuantity,
    cart,
    products,
  }: { cartQuantity: number; cart: Cart[]; products: Product[] } = $props();
</script>

<div
  class="sticky top-0 right-0 left-0 flex h-15 items-center justify-between bg-[#2d2d2d] pr-3.75 pl-3.75 text-white [anchor-name:\--amazon-header]"
>
  {let searchTerm = $state(page.params.query ?? '')}
  <div class="md:w-[unset] lg:w-45">
    <a
      href="/"
      class=" inline-block cursor-pointer rounded-xs p-1.5 text-white decoration-[#2d2d2d] hover:outline"
      onclick={() => {
        searchTerm = '';
      }}
    >
      <img
        class="mt-1.25 hidden w-25 sm:block"
        src="/images/amazon-logo-white.webp"
        fetchpriority="high"
        alt="amazon logo"
      />
      <img
        fetchpriority="high"
        class="mt-1.25 block h-8.75 sm:hidden"
        src="/images/amazon-mobile-logo-white.webp"
        alt="amazon logo"
      />
    </a>
  </div>

  <div class="mr-2.5 ml-2.5 flex max-w-212.5 flex-1">
    {let options = $state<string[]>([])}
    <input
      class="h-9.5 w-0 flex-1 rounded-sm rounded-r-none border-0 pl-3.75 text-[16px]"
      type="text"
      placeholder="Search"
      list="search-suggestions"
      bind:value={searchTerm}
      onkeyup={() => {
        options = searchProductNames(searchTerm, products);
      }}
    />
    <datalist id="search-suggestions">
      {#each options as option (option)}
        <option>{option}</option>
      {/each}
    </datalist>

    <button
      class="h-10 w-11.25 shrink-0 rounded-r-sm border-0 bg-[#febd69]"
      onclick={async () => {
        const searchResults = searchProductIds(searchTerm, products);
        goto(`/${JSON.stringify(searchResults)}/${searchTerm}`);
      }}
    >
      <img
        class="mt-0.75 ml-0.5 h-5.5"
        fetchpriority="high"
        src="/images/icons/search-icon.svg"
        alt="search icon"
      />
    </button>
  </div>

  <div class="flex w-45 shrink-0 justify-end">
    <a
      class="inline-block cursor-pointer rounded-xs p-1.5 text-white decoration-[#2d2d2d] hover:outline"
      href="/orders/[]"
    >
      <span class="block text-[13px]">Returns</span>
      <span class="block text-[15px] font-bold">& Orders</span>
    </a>

    <a
      class="relative flex cursor-pointer items-center rounded-xs p-1.5 text-[16px] text-white decoration-[#2d2d2d] decoration-0 hover:outline"
      href={`/checkout/${JSON.stringify(cart)}`}
    >
      <img
        class="w-12.5"
        fetchpriority="high"
        src="/images/icons/cart-icon.png"
        alt="checkout cart icon"
      />
      <div
        class="absolute top-1 left-5.5 w-6.5 text-center font-bold text-[#f08804]"
      >
        {cartQuantity}
      </div>
      <div class="mt-3 text-[15px] font-bold">Cart</div>
    </a>
  </div>
</div>
