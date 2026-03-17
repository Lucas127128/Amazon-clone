import { test, describe, beforeEach, expect, beforeAll } from 'vitest';
import {
  getMatchingProduct,
  fetchProducts,
} from '#root/shared/src/data/products.ts';
import {
  addToCart,
  updateDeliveryOption,
  getCart,
} from '#root/shared/src/data/cart.ts';
import { getDeliveryDate } from '#root/shared/src/data/deliveryOption.ts';
import { renderOrderSummary } from '#root/web/src/scripts/checkout/cartSummary.ts';
import sleep from '#root/shared/src/utils/sleep.ts';
import {
  checkTruthy,
  isDeliveryOptionId,
} from '#root/shared/src/utils/typeChecker.ts';
import { CART_CONFIG } from '#root/shared/src/constants.ts';

describe('test suite: Render order summary', () => {
  beforeAll(() => {
    document.body.innerHTML = `
      <div class="test-container">
        <div class="order-summary"></div>
        <div class="return-to-home-link"></div>
        <div class="payment-summary"></div>
      </div>`;
  });
  beforeEach(async () => {
    const orderSummary = document.querySelector('.order-summary');
    checkTruthy(orderSummary);
    orderSummary.innerHTML = '';
    localStorage.clear();
    addToCart(
      {
        productId: '59LXo',
        quantity: 1,
        deliveryOptionId: CART_CONFIG.DEFAULT_DELIVERY_OPTION,
      },
      false,
    );
    addToCart(
      {
        productId: 'Hwme8',
        quantity: 2,
        deliveryOptionId: CART_CONFIG.DEFAULT_DELIVERY_OPTION,
      },
      false,
    );

    await renderOrderSummary();
  });

  describe('display the cart', async () => {
    test.concurrent('number of cart items rendered', () => {
      const cartItemContainers = document.querySelector('.order-summary');
      expect(cartItemContainers?.childElementCount).toBe(2);
    });

    const checkoutCart = getCart();
    for (const [cartOrder, cartItem] of checkoutCart.entries()) {
      const { productId } = cartItem;

      test.concurrent('display cart quantity', () => {
        const quantityHTML = document.querySelector(
          `.js-product-quantity-${productId}`,
        );
        checkTruthy(quantityHTML, 'Fail to select HTML element');
        expect(
          quantityHTML.textContent
            .replaceAll('\n', '')
            .replaceAll(' ', ''),
        ).toContain(`Quantity: ${cartItem.quantity}`.replaceAll(' ', ''));
      });

      test.concurrent('delivery date', async () => {
        const deliveryOptionId = String(cartOrder + 1);
        isDeliveryOptionId(deliveryOptionId);
        updateDeliveryOption(productId, deliveryOptionId);
        await renderOrderSummary();
        const updatedCheckoutCart = getCart();
        const deliveryDate = getDeliveryDate(
          updatedCheckoutCart[cartOrder].deliveryOptionId,
        );
        const deliveryDateHTML = document.querySelector(
          `.delivery-date-${productId}`,
        );
        checkTruthy(deliveryDateHTML);
        expect(deliveryDateHTML.textContent).toContain(deliveryDate);
      });

      test.concurrent('products price', async () => {
        const products = await fetchProducts();
        const matchingProduct = getMatchingProduct(products, productId);
        const productPrice = document.querySelector(
          `.product-price-${productId}`,
        );
        checkTruthy(productPrice);
        checkTruthy(matchingProduct, 'Fail to get the cart');
        expect(productPrice.textContent).toContain(
          `$${matchingProduct.price}`,
        );
      });
    }
  });

  test.concurrent('removes the product', async () => {
    let checkoutCart = getCart();

    const productId1 = checkoutCart[0].productId;
    const productId2 = checkoutCart[1].productId;
    const deleteQuantityHTML1 = document.querySelector<HTMLButtonElement>(
      `.delete-quantity-link-${productId1}`,
    );
    checkTruthy(deleteQuantityHTML1);
    deleteQuantityHTML1.click();
    await sleep(40);
    checkoutCart = getCart();
    expect(checkoutCart.length).toBe(1);
    expect(checkoutCart[0].productId).toBe(productId2);

    const cartItemContainer = document.querySelectorAll(
      '.cart-item-container',
    );
    expect(cartItemContainer.length).toBe(1);

    const cartItemContainer1 = document.querySelector(
      `.cart-item-container-${productId1}`,
    );
    const cartItemContainer2 = document.querySelector(
      `.cart-item-container-${productId2}`,
    );
    expect(cartItemContainer1).toBe(null);
    expect(cartItemContainer2).not.toBe(null);
    checkTruthy(cartItemContainer2);
    cartItemContainer2.innerHTML = '';
  });
});
