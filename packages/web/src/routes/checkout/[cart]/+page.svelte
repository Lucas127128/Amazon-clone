<script lang="ts">
  import { app } from 'api-client';
  import { CartsSchema } from 'shared/schema';
  import { parse } from 'valibot';

  import { goto } from '$app/navigation';

  import CartItems from './CartItems.svelte';
  import PaymentSummary from './PaymentSummary.svelte';

  const { params, data } = $props();
  // svelte-ignore  state_referenced_locally
  const products = $state(data.products);
</script>

<div class="checkout-header">
  <div class="checkout-header-left-section">
    <a href="/">
      <img
        class="amazon-logo"
        src="/images/amazon-logo.webp"
        alt="amazon logo"
      />
      <img
        class="amazon-mobile-logo"
        src="/images/amazon-mobile-logo.webp"
        alt="amazon logo"
      />
    </a>
  </div>

  <div class="checkout-header-middle-section">
    Checkout (<a class="return-to-home-link" href="/">3 items</a>)
  </div>

  <div class="checkout-header-right-section">
    <img
      src="/images/icons/checkout-lock-icon.svg"
      alt="locked checkout cart icon"
    />
  </div>
</div>

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

  <div class="page-title">Review your order</div>

  <div class="checkout-grid">
    {let cart = $state(parse(CartsSchema, JSON.parse(params.cart)))}
    <div class="order-summary">
      <CartItems {products} bind:cart />
    </div>

    <div class="payment-summary">
      <div class="payment-summary-title">Order Summary</div>
      <PaymentSummary {cart} {products} />
      <button
        class="place-order-button button-primary"
        onclick={async () => {
          const { data: order, error } = await app.api.orders.post(cart);
          if (error) throw error;
          await goto(`/orders/${JSON.stringify([order])}`);
        }}
      >
        Place your order
      </button>
    </div>
  </div>
</div>

<style>
  .main {
    max-width: 1100px;
    padding-left: 30px;
    padding-right: 30px;

    margin-top: 140px;
    margin-bottom: 100px;
    margin-left: auto;
    margin-right: auto;
  }

  .page-title {
    font-weight: 700;
    font-size: 22px;
    margin-bottom: 18px;
  }

  .checkout-grid {
    display: grid;
    grid-template-columns: 1fr 350px;
    column-gap: 12px;

    align-items: start;
  }

  @media (max-width: 1000px) {
    .main {
      max-width: 500px;
    }

    .checkout-grid {
      grid-template-columns: 1fr;
    }
  }

  .payment-summary {
    border: 1px solid rgb(222, 222, 222);
    border-radius: 4px;
    padding: 18px;
    padding-bottom: 5px;
  }

  @media (max-width: 1000px) {
    .payment-summary {
      grid-row: 1;
      margin-bottom: 12px;
    }
  }

  .place-order-button {
    width: 100%;
    padding-top: 12px;
    padding-bottom: 12px;
    border-radius: 8px;

    margin-top: 11px;
    margin-bottom: 15px;
  }

  .payment-summary-title {
    font-weight: 700;
    font-size: 18px;
    margin-bottom: 12px;
  }

  .checkout-header {
    contain: strict;

    height: 3em;
    padding: 1.5vw;
    padding-top: 18px;
    padding-bottom: 4px;
    background-color: white;

    display: grid;
    place-content: center;
    place-items: top;
    grid-template-columns: 6.2vw min(270px, 28vw) 3.5vw;
    grid-template-rows: 48px;
    gap: 21em;

    position: fixed;
    top: 0;
    left: 0;
    right: 0;
  }

  .amazon-logo {
    width: 6.2em;
  }

  .amazon-mobile-logo {
    display: none;
  }

  .checkout-header-middle-section {
    font-size: 24px;
    font-weight: 600;
    margin-top: -0.15em;
    margin-right: 2.5vw;
  }

  .return-to-home-link {
    color: rgb(0, 113, 133);
    font-weight: 500;
    font-size: 24px;
    text-decoration: none;
    cursor: pointer;
  }

  @media (width < 650px) {
    .amazon-mobile-logo {
      display: block;
      width: 2em;
    }

    .amazon-logo {
      display: none;
    }

    .checkout-header {
      grid-template-columns: 6vw min(270px, 28vw) 8vw;
      gap: 27vw !important;
    }
  }

  @media (width < 1100px) {
    .checkout-header {
      gap: 28vw;
    }
  }
</style>
