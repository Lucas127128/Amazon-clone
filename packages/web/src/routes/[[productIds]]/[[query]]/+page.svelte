<script lang="ts">
  import { Highlight } from '@ark-ui/svelte/highlight';
  import {
    type Cart,
    ProductIdsSchema,
    type ProductSortOption,
  } from 'shared/schema';
  import { parse } from 'valibot';

  import AmazonHeader from '#lib/components/AmazonHeader.svelte';
  import { getMatchingCart } from '#lib/data/cart.js';

  const { data, params } = $props();
  // svelte-ignore state_referenced_locally
  const products = $derived.by(() => {
    if (!params.productIds) return data.products;
    const productIds = parse(
      ProductIdsSchema,
      JSON.parse(params.productIds),
    );
    return data.products.filter((product) =>
      productIds.includes(product.id),
    );
  });
  const cart = $state<Cart[]>([]);
  const cartQuantity = $derived(
    cart.reduce((acc, item) => acc + item.quantity, 0),
  );
</script>

<AmazonHeader {cartQuantity} {cart} products={data.products} />

<div
  class="absolute top-[anchor(bottom)] left-[anchor(left)] grid h-9 w-2xs grid-cols-[1fr_7fr] items-center overflow-hidden rounded-br-xl bg-[#2d2d2d] p-1.25 [position-anchor:\--amazon-header]"
>
  {let sortOption = $state<ProductSortOption>('most-stars')}
  <img src="/images/icons/sort.svg" alt="sort icon" />
  <select
    class="h-8 overflow-hidden rounded-[9px] border-0 bg-[#464646] text-white shadow-none focus:outline-0"
    bind:value={sortOption}
    onchange={() => {
      type Comparator = Required<Parameters<typeof products.toSorted>>[0];
      const sortStrategies: Record<typeof sortOption, Comparator> = {
        'most-people-star': (a, b) => b.ratingCount - a.ratingCount,
        'least-people-star': (a, b) => a.ratingCount - b.ratingCount,
        'most-expensive': (a, b) => b.priceCents - a.priceCents,
        'least-expensive': (a, b) => a.priceCents - b.priceCents,
        'most-stars': (a, b) =>
          b.ratingStars - a.ratingStars || b.ratingCount - a.ratingCount,
        'least-stars': (a, b) =>
          a.ratingStars - b.ratingStars || a.ratingCount - b.ratingCount,
      };
      products.sort(sortStrategies[sortOption]);
    }}
  >
    <option value="most-stars" selected>stars - more to less</option>
    <option value="least-stars">stars - less to more</option>
    <option value="most-people-star">
      commented people - more to less
    </option>
    <option value="least-people-star">
      commented people - less to more
    </option>
    <option value="most-expensive">price - high to low</option>
    <option value="least-expensive">price - low to high</option>
  </select>
</div>

<div>
  <div class="grid grid-cols-[repeat(auto-fill,minmax(255px,1fr))]">
    {#each products as product (product.id)}
      {let addedToCart = $state(false)}
      {let productQuantity = $state('1')}
      <div
        class="grid grid-rows-[1fr_0.3fr_0.15fr_0.15fr_0.15fr_0.15fr_0.14fr_0.09fr] border-[0.4px] border-solid border-[#dedddd] p-6.25 pt-7.5"
      >
        <div class="mb-5 flex h-45 justify-center">
          <img
            class="max-h-full max-w-full"
            src={product.image}
            alt={product.name}
          />
        </div>

        <div class="mb-1.25">
          {#if params.query}
            <Highlight text={product.name} query={params.query!} />
          {:else}
            {product.name}
          {/if}
        </div>

        <div class="mb-2.5 flex items-end">
          <img class="w-25" src={product.starsUrl} alt={product.name} />
          <div class="link-primary cursor-pointer text-[#017cb6]">
            {product.ratingCount}
          </div>
        </div>

        <div class="md-4 font-bold">
          ${product.price}
        </div>
        <div>
          <select
            class="ProductQuantitySelector"
            bind:value={productQuantity}
          >
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
            <option value="10">10</option>
          </select>
        </div>

        <div
          class="flex font-semibold text-[#067d62]"
          style:opacity={addedToCart ? 1 : 0}
        >
          <img
            src="/images/icons/checkmark.svg"
            alt="tick"
            class="mr-1.25 h-5"
          />
          Added
        </div>

        <button
          class="button-primary rounded-[50px] p-2 font-[13.5px]"
          onclick={() => {
            const matchingCart = getMatchingCart(cart, product.id);
            if (matchingCart) {
              matchingCart.quantity += Number(productQuantity);
            } else {
              cart.push({
                productId: product.id,
                quantity: Number(productQuantity),
                deliveryOptionId: '1',
              });
            }
            addedToCart = true;
            setTimeout(() => {
              addedToCart = false;
            }, 3000);
          }}
        >
          Add to Cart
        </button>

        <div class="max-h-5">
          {#if product.isClothing}
            <a
              href="/images/clothing-size-chart.webp"
              target="_blank"
              class="size-chart"
            >
              Size chart
            </a>
          {/if}
        </div>
      </div>
    {/each}
  </div>
</div>
