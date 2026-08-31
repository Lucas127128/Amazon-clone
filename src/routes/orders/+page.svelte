<script lang="ts">
  import AmazonHeader from '#lib/components/AmazonHeader.svelte';
  import { getOrders, getTimeString } from '#lib/data/orders.ts';
  import { getMatchingProduct } from '#lib/data/products.ts';
  import { formatCurrency } from '#lib/utils/money.ts';

  import OrderId from './OrderId.svelte';
  import Product from './Product.svelte';

  const { data } = $props();
  const orders = $state(getOrders());
</script>

<AmazonHeader products={data.products} />

<div class="mt-22.5 mr-auto mb-25 ml-auto max-w-212.5 pr-5 pl-5">
  <div class="mb-6.25 text-[26px] font-bold">Your Orders</div>
  <div class="grid grid-cols-[1fr] gap-y-12.5">
    {#each orders as order (order.id)}
      {const orderTime = getTimeString(order.orderTime)}
      <div class="[contain-intrinsic-size:auto_500px]">
        <div
          class="grid grid-cols-[6fr_1fr] grid-rows-1 items-center justify-between rounded-t-lg border border-solid border-[#d5d9d9] bg-[#f0f2f2] px-6.25 py-5 leading-5.75 md:leading-4"
        >
          <div class="flex shrink-0 flex-col sm:flex-row">
            <div class="mr-11.25 grid grid-cols-[auto_1fr]">
              <div class="mr-1.25 font-medium sm:mr-0">
                Order Placed: {orderTime}
              </div>
            </div>
            <div class="mr-0 grid grid-cols-[auto_1fr] sm:mr-11.25 sm:block">
              <div class="mr-1.25 font-medium sm:mr-0">Total:</div>
              <div>${formatCurrency(order.totalCostCents)}</div>
            </div>
          </div>
          <OrderId orderId={order.id} />
        </div>
        <div
          class="xs:grid-cols-[110px_1fr] grid grid-cols-[1fr] items-center gap-x-8.75 rounded-b-lg border border-t-0 border-solid border-[#d5d9d9] px-6.25 py-10 sm:gap-y-0 sm:pb-2 md:grid-cols-[110px_1fr_220px] md:gap-y-15 md:pb-0"
        >
          {#each order.products as product (product.productId)}
            {const matchingProduct = getMatchingProduct(
              data.products,
              product.productId,
            )}
            {#if matchingProduct}
              <Product {matchingProduct} cartItem={product} {order} />
            {/if}
          {/each}
        </div>
      </div>
    {/each}
  </div>
</div>
