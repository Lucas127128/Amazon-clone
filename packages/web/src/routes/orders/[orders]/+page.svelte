<script lang="ts">
  import { cn } from 'cnfast';
  import { getDeliveryDate } from 'shared/deliveryOption';
  import { formatCurrency } from 'shared/money';
  import { getMatchingProduct } from 'shared/products';
  import type { Cart } from 'shared/schema';
  import { OrdersSchema } from 'shared/schema';
  import { parse } from 'valibot';

  import AmazonHeader from '#lib/components/AmazonHeader.svelte';
  import { getMatchingCart } from '#lib/data/cart.js';
  import { getTimeString } from '#lib/data/orders.ts';

  const { params, data } = $props();
  const orders = $derived(parse(OrdersSchema, JSON.parse(params.orders)));
  const cart = $state<Cart[]>([]);
  const cartQuantity = $derived(
    cart.reduce((acc, item) => acc + item.quantity, 0),
  );
  const buttonSecondaryTwClass =
    'cursor-pointer rounded-lg border border-solid border-[#d5d9d9] bg-white text-[#212121] shadow-[0_2px_5px_rgba(213,217,217,0.5)] hover:bg-[#f7fafa] active:bg-[#edfdfd] active:shadow-none';
</script>

<AmazonHeader {cartQuantity} {cart} />

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

          <div class="grid shrink grid-cols-[2fr_1fr] grid-rows-[0.7fr_1fr]">
            <div class="col-span-2 mr-1.25 font-medium sm:mr-0">
              Order ID:
            </div>
            <span>{order.id}</span>
            {let showTick = $state(false)}
            <button
              class="justify-self-start border-none bg-inherit p-0"
              onclick={async () => {
                await navigator.clipboard.writeText(order.id);
                showTick = true;
                setTimeout(() => {
                  showTick = false;
                }, 3000);
              }}
            >
              {#if showTick}
                <img src="/images/icons/tick.svg" alt="tick icon" />
              {:else}
                <img src="/images/icons/copy.svg" alt="copy icon" />
              {/if}
            </button>
          </div>
        </div>
        <div
          class="xs:grid-cols-[110px_1fr] grid grid-cols-[1fr] items-center gap-x-8.75 rounded-b-lg border border-t-0 border-solid border-[#d5d9d9] px-6.25 py-10 sm:gap-y-0 sm:pb-2 md:grid-cols-[110px_1fr_220px] md:gap-y-15 md:pb-0"
        >
          {#each order.products as product (product.productId)}
            {let matchingProduct = getMatchingProduct(
              data.products,
              product.productId,
            )}
            {#if matchingProduct}
              {const deliveryDate = getDeliveryDate(
                product.deliveryOptionId,
              )}
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
                  Quantity: {product.quantity}
                </div>
                <button
                  class="button-primary xs:w-35 mb-3.75 flex h-9 w-full items-center justify-center rounded-lg text-[15px] sm:mb-0"
                  onclick={() => {
                    const matchingCart = getMatchingCart(
                      cart,
                      product.productId,
                    );
                    if (matchingCart) {
                      matchingCart.quantity += 1;
                    } else {
                      cart.push({
                        productId: product.productId,
                        quantity: 1,
                        deliveryOptionId: '1',
                      });
                    }
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

              <div
                class="xs:col-2 xs:mb-7.5 mb-17.5 self-start md:col-auto md:mb-0"
              >
                <a
                  href={`/tracking/${JSON.stringify(order)}/${product.productId}`}
                >
                  <button
                    class={cn`${buttonSecondaryTwClass} xs:w-35 w-full p-2 text-[15px] sm:w-35 md:w-full`}
                  >
                    Track package
                  </button>
                </a>
              </div>
            {/if}
          {/each}
        </div>
      </div>
    {/each}
  </div>
</div>
