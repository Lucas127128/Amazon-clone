<script lang="ts">
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
</script>

<AmazonHeader {cartQuantity} {cart} />

<div class="main">
  <div class="page-title">Your Orders</div>
  <div class="orders-grid">
    {#each orders as order (order.id)}
      {const orderTime = getTimeString(order.orderTime)}
      <div class="order-container order-container-${order.id}">
        <div class="order-header">
          <div class="order-header-left-section">
            <div class="order-date">
              <div class="order-header-label">
                Order Placed: {orderTime}
              </div>
              <div></div>
            </div>
            <div class="order-total">
              <div class="order-header-label">Total:</div>
              <div>${formatCurrency(order.totalCostCents)}</div>
            </div>
          </div>

          <div class="order-header-right-section">
            <div class="order-header-label">Order ID:</div>
            <div class="order-id-container">
              <span id="order-id">{order.id}</span>
              {let showTick = $state(false)}
              <button
                class="copy-button"
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
        </div>
        <div
          class="order-details-grid order-details-grid-${order.id}"
          data-order-id={order.id}
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
              <div class="product-image-container">
                <img
                  src={matchingProduct.image}
                  alt={matchingProduct.name}
                />
              </div>

              <div class="product-details">
                <div class="product-name">${matchingProduct.name}</div>
                <div class="product-delivery-date">
                  Arriving on: {deliveryDate}
                </div>
                <div class="product-quantity">
                  Quantity: {product.quantity}
                </div>
                <button
                  class="buy-again-button button-primary"
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
                    class="buy-again-icon"
                    src="/images/icons/buy-again.png"
                    alt="buy again icon"
                  />
                  <span class="buy-again-message">Buy it again</span>
                  <span class="buy-again-success">&#x2713; Added</span>
                </button>
              </div>

              <div class="product-actions">
                <a
                  href={`/tracking/${JSON.stringify(order)}/${product.productId}`}
                >
                  <button class="track-package-button button-secondary">
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

<style>
  .button-secondary {
    color: rgb(33, 33, 33);
    background: white;
    border: 1px solid rgb(213, 217, 217);
    border-radius: 8px;
    cursor: pointer;
    box-shadow: 0 2px 5px rgba(213, 217, 217, 0.5);
  }

  .button-secondary:hover {
    background-color: rgb(247, 250, 250);
  }

  .button-secondary:active {
    background-color: rgb(237, 253, 255);
    box-shadow: none;
  }
  .amazon-header {
    background-color: #2d2d2d;
    color: white;
    padding-left: 15px;
    padding-right: 15px;

    display: flex;
    align-items: center;
    justify-content: space-between;

    position: sticky;
    top: 0;
    left: 0;
    right: 0;
    height: 60px;
  }

  .amazon-header-left-section {
    width: 180px;
  }

  @media (max-width: 800px) {
    .amazon-header-left-section {
      width: unset;
    }
  }

  .header-link {
    display: inline-block;
    padding: 6px;
    border-radius: 2px;
    cursor: pointer;
    text-decoration: none;
    border: 1px solid rgba(0, 0, 0, 0);
  }

  .header-link:hover {
    border: 1px solid white;
  }

  .amazon-logo {
    width: 100px;
    margin-top: 5px;
  }

  .amazon-mobile-logo {
    display: none;
  }

  @media (max-width: 575px) {
    .amazon-logo {
      display: none;
    }

    .amazon-mobile-logo {
      display: block;
      height: 35px;
      margin-top: 5px;
    }
  }

  .amazon-header-middle-section {
    flex: 1;
    max-width: 850px;
    margin-left: 10px;
    margin-right: 10px;
    display: flex;
  }

  .search-bar {
    flex: 1;
    width: 0;
    font-size: 16px;
    height: 38px;
    padding-left: 15px;
    border: none;
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }

  .search-button {
    background-color: rgb(254, 189, 105);
    border: none;
    width: 45px;
    height: 40px;
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
    flex-shrink: 0;
  }

  .search-icon {
    height: 22px;
    margin-left: 2px;
    margin-top: 3px;
  }

  .amazon-header-right-section {
    width: 180px;
    flex-shrink: 0;
    display: flex;
    justify-content: end;
  }

  .orders-link {
    color: white;
  }

  .returns-text {
    display: block;
    font-size: 13px;
  }

  .orders-text {
    display: block;
    font-size: 15px;
    font-weight: 700;
  }

  .cart-link {
    color: white;
    display: flex;
    align-items: center;
    position: relative;
  }

  .cart-icon {
    width: 50px;
  }

  .cart-text {
    margin-top: 12px;
    font-size: 15px;
    font-weight: 700;
  }

  .cart-quantity {
    color: rgb(240, 136, 4);
    font-size: 16px;
    font-weight: 700;

    position: absolute;
    top: 4px;
    left: 22px;

    width: 26px;
    text-align: center;
  }

  .main {
    max-width: 850px;
    margin-top: 90px;
    margin-bottom: 100px;
    padding-left: 20px;
    padding-right: 20px;

    margin-left: auto;
    margin-right: auto;
  }

  .page-title {
    margin-bottom: 25px;
    font-weight: 700;
    font-size: 26px;
  }

  .orders-grid {
    display: grid;
    grid-template-columns: 1fr;
    row-gap: 50px;
  }

  .order-header {
    background-color: rgb(240, 242, 242);
    border: 1px solid rgb(213, 217, 217);

    display: flex;
    align-items: center;
    justify-content: space-between;

    padding: 20px 25px;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
  }

  .order-header-left-section {
    display: flex;
    flex-shrink: 0;
  }

  .order-header-label {
    font-weight: 500;
  }

  .order-date,
  .order-total {
    margin-right: 45px;
  }

  .order-header-right-section {
    flex-shrink: 1;
  }

  @media (max-width: 575px) {
    .order-header {
      flex-direction: column;
      align-items: start;
      line-height: 23px;
      padding: 15px;
    }

    .order-header-left-section {
      flex-direction: column;
    }

    .order-header-label {
      margin-right: 5px;
    }

    .order-date,
    .order-total {
      display: grid;
      grid-template-columns: auto 1fr;
      margin-right: 0;
    }
  }

  .order-details-grid {
    padding: 40px 25px;
    border: 1px solid rgb(213, 217, 217);
    border-top: none;
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;

    display: grid;
    grid-template-columns: 110px 1fr 220px;
    column-gap: 35px;
    row-gap: 60px;
    align-items: center;
  }

  @media (max-width: 800px) {
    .order-details-grid {
      grid-template-columns: 110px 1fr;
      row-gap: 0;
      padding-bottom: 8px;
    }
  }

  @media (max-width: 450px) {
    .order-details-grid {
      grid-template-columns: 1fr;
    }
  }

  .product-image-container {
    text-align: center;
  }

  .product-image-container img {
    max-width: 110px;
    max-height: 110px;
  }

  .product-name {
    font-weight: 700;
    margin-bottom: 5px;
  }

  .product-delivery-date {
    margin-bottom: 3px;
  }

  .product-quantity {
    margin-bottom: 8px;
  }

  .buy-again-button {
    font-size: 15px;
    width: 140px;
    height: 36px;
    border-radius: 8px;

    display: flex;
    align-items: center;
    justify-content: center;
  }

  .buy-again-icon {
    width: 25px;
    margin-right: 15px;
  }

  .product-actions {
    align-self: start;
  }

  .track-package-button {
    width: 100%;
    font-size: 15px;
    padding: 8px;
  }

  @media (max-width: 800px) {
    .buy-again-button {
      margin-bottom: 10px;
    }

    .product-actions {
      /* grid-column: 2 means this element will be placed
           in column 2 in the grid. (Normally, the column that
           an element is placed in is determined by the order
           of the elements in the HTML. grid-column overrides
           this default ordering). */
      grid-column: 2;
      margin-bottom: 30px;
    }

    .track-package-button {
      width: 140px;
    }
  }

  @media (max-width: 450px) {
    .product-image-container {
      text-align: center;
      margin-bottom: 25px;
    }

    .product-image-container img {
      max-width: 150px;
      max-height: 150px;
    }

    .product-name {
      margin-bottom: 10px;
    }

    .product-quantity {
      margin-bottom: 15px;
    }

    .buy-again-button {
      width: 100%;
      margin-bottom: 15px;
    }

    .product-actions {
      /* grid-column: auto; undos grid-column: 2; from above.
           This element will now be placed in its normal column
           in the grid. */
      grid-column: auto;
      margin-bottom: 70px;
    }

    .track-package-button {
      width: 100%;
      padding: 12px;
    }
  }

  .buy-again-success {
    opacity: 0;
    display: none;
  }

  .order-container {
    contain-intrinsic-size: auto 500px;
  }

  .order-header-right-section {
    display: grid;
    grid-template-rows: 0.7fr 1fr;
  }

  .order-id-container {
    display: grid;
    grid-template-columns: 1.8fr 1fr;
    align-items: center;
  }

  .copy-button {
    border: none;
    background-color: inherit;
  }
</style>
