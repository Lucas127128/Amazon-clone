<script lang="ts">
  import {
    deliveryOptions,
    getDeliveryDate,
    getPriceString,
  } from 'shared/deliveryOption';
  import type { Product } from 'shared/products';
  import type { Cart } from 'shared/schema';

  let {
    // eslint-disable-next-line
    products,
    // eslint-disable-next-line
    cart = $bindable(),
  }: { products: Product[]; cart: Cart[] } = $props();
</script>

{#each cart as cartItem (cartItem.productId)}
  {const product = products.find((p) => p.id === cartItem.productId)}
  {#if product}
    <div
      class="cart-item-container cart-item-container-{product.id}"
      data-product-id={product.id}
    >
      <div class="delivery-date">
        Delivery date: {getDeliveryDate(cartItem.deliveryOptionId)}
      </div>

      <div class="cart-item-details-grid">
        <img class="product-image" src={product.image} alt={product.name} />

        <div class="cart-item-details">
          <div class="product-name">{product.name}</div>
          <div class="product-price product-price-{product.id} ">
            ${product.price}
          </div>
          <div class="product-quantity">
            <span>
              Quantity:
              <span class="quantity-label">{cartItem.quantity}</span>
            </span>
            {let open = $state(false)}
            <button
              class="button-link"
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
                class="quantity-input"
              />
              <button
                class="button-link"
                onclick={() => {
                  cartItem.quantity = quantity;
                  open = false;
                }}
              >
                Save</button
              >
            {/if}

            <button
              class="button-link"
              onclick={() => {
                cart = cart.filter(
                  (item) => item.productId !== cartItem.productId,
                );
              }}
            >
              Delete
            </button>
            <span class="invalid-quantity-warning"> </span>
          </div>
        </div>
        <div class="delivery-options">
          <div class="delivery-options-title">Choose a delivery option:</div>
          {let option: '1' | '2' | '3' = $state('1')}
          {#each deliveryOptions as deliveryOption (deliveryOption.id)}
            {const deliveryDate = getDeliveryDate(deliveryOption.id)}
            {const priceString = getPriceString(deliveryOption.priceCents)}
            <div>
              <input
                type="radio"
                class="delivery-option-input"
                bind:group={option}
                value={deliveryOption.id}
                onchange={() => {
                  cartItem.deliveryOptionId = option;
                }}
              />
              <div>
                <div class="delivery-option-date">{deliveryDate}</div>
              </div>
              <div class="delivery-option-price">
                {priceString}Shipping
              </div>
            </div>
          {/each}
        </div>
      </div>
    </div>
  {/if}
{/each}

<style>
  .product-image {
    max-width: 100%;
    max-height: 120px;

    margin-left: auto;
    margin-right: auto;
  }

  .cart-item-container {
    border: 1px solid rgb(222, 222, 222);
    border-radius: 4px;
    padding: 18px;
  }

  .cart-item-container {
    margin-bottom: 12px;
  }

  .delivery-date {
    color: rgb(0, 118, 0);
    font-weight: 700;
    font-size: 19px;
    margin-top: 5px;
    margin-bottom: 22px;
  }

  .cart-item-details-grid {
    display: grid;
    /* 100px 1fr 1fr; means the 2nd and 3rd column will
         take up half the remaining space in the grid
         (they will divide up the remaining space evenly). */
    grid-template-columns: 100px 1fr 1fr;
    column-gap: 25px;
  }

  @media (max-width: 1000px) {
    .cart-item-details-grid {
      grid-template-columns: 100px 1fr;
      row-gap: 30px;
    }
  }

  .product-name {
    font-weight: 700;
    margin-bottom: 8px;
  }

  .product-price {
    color: rgb(177, 39, 4);
    font-weight: 700;
    margin-bottom: 5px;
  }

  .product-quantity .link-primary {
    margin-left: 3px;
  }

  @media (max-width: 1000px) {
    .delivery-options {
      grid-column: 1 / span 2;
    }
  }

  .delivery-options-title {
    font-weight: 700;
    margin-bottom: 10px;
  }

  .delivery-option {
    display: grid;
    grid-template-columns: 24px 1fr;
    margin-bottom: 12px;
    cursor: pointer;
  }

  .delivery-option-input {
    margin-left: 0px;
    cursor: pointer;
  }

  .delivery-option-date {
    color: rgb(0, 118, 0);
    font-weight: 600;
    margin-bottom: 3px;
  }

  .delivery-option-price {
    color: rgb(120, 120, 120);
    font-size: 15px;
  }

  .quantity-input {
    width: 40px;
  }
  .quantity-input:focus {
    outline: none;
  }
  .quantity-input-warning {
    border: red solid 1.5px;
  }

  .button-link {
    border: none;
    background-color: inherit;
    color: rgb(1, 124, 182);
    font-size: 1em;
  }
  .button-link:hover {
    color: rgb(196, 80, 0);
  }

  .invalid-quantity-warning {
    color: red;
    font-size: 0.9em;
  }
</style>
