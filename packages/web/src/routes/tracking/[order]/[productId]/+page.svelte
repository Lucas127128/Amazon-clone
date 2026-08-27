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

<AmazonHeader cartQuantity={1} cart={[]} />

<div class="main">
  <dialog class="border-none bg-inherit" id="general-error-dialog">
    <div
      class="w-60 p-2.5 border-2 border-solid border-red-700 rounded-2xl bg-white grid grid-cols-1 grid-rows-[2fr_1fr] gap-4"
    >
      <p>
        Sorry, something went wrong in our website. Please try again later.
      </p>
      <button
        class="bg-green-700 text-white border-none rounded-xl overflow-hidden"
        command="close"
        commandfor="general-error-dialog"
      >
        OK
      </button>
    </div>
  </dialog>
  <div class="order-tracking">
    <a
      class="back-to-orders-link link-primary"
      href="/orders"
      onclick={(e) => {
        e.preventDefault();
        navigation.back();
      }}
    >
      View all orders
    </a>
    {#if matchingCart && matchingProduct}
      <div class="delivery-date">
        Arriving on {getDeliveryDate(matchingCart.deliveryOptionId)}
      </div>

      <div class="product-info">{matchingProduct.name}</div>

      <div class="product-info">Quantity: {matchingCart.quantity}</div>

      <img
        class="product-image"
        src={matchingProduct.image}
        alt={matchingProduct.name}
      />

      <div class="progress-labels-container">
        <div class="progress-label">Preparing</div>
        <div class="progress-label current-status">Shipped</div>
        <div class="progress-label">Delivered</div>
      </div>

      <div class="progress-bar-container">
        <div
          class="progress-bar"
          style:width={`${deliveryProgressPercent}%`}
        ></div>
      </div>
    {/if}
  </div>
</div>

<style>
  .main {
    max-width: 850px;
    margin-top: 90px;
    margin-bottom: 100px;
    padding-left: 30px;
    padding-right: 30px;

    /* margin-left: auto;
         margin-right auto;
         Is a trick for centering an element horizontally
         without needing a container. */
    margin-left: auto;
    margin-right: auto;
  }

  .back-to-orders-link {
    display: inline-block;
    margin-bottom: 30px;
  }

  .delivery-date {
    font-size: 25px;
    font-weight: 700;
    margin-bottom: 10px;
  }

  .product-info {
    margin-bottom: 3px;
  }

  .product-image {
    max-width: 150px;
    max-height: 150px;
    margin-top: 25px;
    margin-bottom: 50px;
  }

  .progress-labels-container {
    display: flex;
    justify-content: space-between;
    font-size: 20px;
    font-weight: 500;
    margin-bottom: 15px;
  }

  .current-status {
    color: rgb(6, 125, 98);
  }

  @media (max-width: 575px) {
    .progress-labels-container {
      font-size: 16px;
    }
  }

  @media (max-width: 450px) {
    .progress-labels-container {
      flex-direction: column;
      margin-bottom: 5px;
    }

    .progress-label {
      margin-bottom: 3px;
    }
  }

  .progress-bar-container {
    height: 25px;
    width: 100%;

    border: 1px solid rgb(200, 200, 200);
    border-radius: 50px;
    overflow: hidden;
  }

  .progress-bar {
    height: 100%;
    background-color: green;
    border-radius: 50px;
    width: 50%;
  }
</style>
