import '@awesome.me/webawesome/dist/components/copy-button/copy-button.js';

import { effect } from '@preact/signals-core';
import { addToCart, cartQuantity } from 'shared/cart';
import { CART_CONFIG, STORAGE_KEYS, UI_TIMEOUTS } from 'shared/constants';
import { fetchProducts, getMatchingProduct } from 'shared/products';
import { type Order, OrderSchemaArray } from 'shared/schema';
import { checkNullish } from 'shared/typeChecker';
import { parse } from 'valibot';

import { getTimeString } from '../data/orders.ts';
import { policy } from '../utils/trustedTypes.ts';
import { handleSearchInput } from './header.ts';
import {
  generateOrderContainerHTML,
  generateOrdersProductHTML,
} from './htmlGenerators/ordersHTML.ts';

async function renderPlacedOrder() {
  policy();
  const savedOrders = localStorage.getItem(STORAGE_KEYS.ORDER);
  checkNullish(savedOrders);
  const orders: readonly Order[] = parse(
    OrderSchemaArray,
    JSON.parse(savedOrders),
  );
  const ordersHTML = document.querySelector('div.orders-grid');
  checkNullish(ordersHTML);
  const products = await fetchProducts();
  for (const order of orders) {
    let placedOrderHTML = '';
    for (const product of order.products) {
      const matchingProduct = getMatchingProduct(
        products,
        product.productId,
      );
      checkNullish(matchingProduct);
      placedOrderHTML += generateOrdersProductHTML(
        product,
        matchingProduct,
        order.id,
      );
    }
    const orderTime = getTimeString(order.orderTime);
    const placedOrderContainerHTML = generateOrderContainerHTML(
      order,
      orderTime,
      placedOrderHTML,
    );
    ordersHTML.insertAdjacentHTML('beforeend', placedOrderContainerHTML);
  }

  type Timer = {
    timer: NodeJS.Timeout;
    key: `${string}-${string}`;
  };
  const timers: Timer[] = [];

  function displayBuyAgainMessage(
    buyAgainMessageHTML: HTMLElement,
    buyAgainSuccessHTML: HTMLElement,
    productId: string,
    orderId: string,
  ) {
    buyAgainSuccessHTML.style.display = 'block';
    buyAgainSuccessHTML.style.opacity = '1';
    buyAgainMessageHTML.style.display = 'none';
    buyAgainMessageHTML.style.opacity = '0';

    let matchingTimer = timers.find(
      (timer) => timer.key === `${productId}-${orderId}`,
    );
    const timer: Timer = {
      timer: setTimeout(() => {
        buyAgainMessageHTML.style.display = 'block';
        buyAgainMessageHTML.style.opacity = '1';
        buyAgainSuccessHTML.style.display = 'none';
        buyAgainSuccessHTML.style.opacity = '0';
      }, UI_TIMEOUTS.ADDED_TO_CART_DISPLAY),
      key: `${productId}-${orderId}`,
    };
    if (matchingTimer) {
      clearTimeout(matchingTimer.timer);
      matchingTimer = timer;
    } else {
      timers.push(timer);
    }
  }
  ordersHTML.addEventListener('click', (event) => {
    let buyAgainButton = event.target;
    if (!(buyAgainButton instanceof HTMLElement)) return;
    /*
    The event target may be the child element inside the buy again button and
    do not contain the "buy-again-button" class. If this is the situation,
    I need to set the buyAgainButton to its parent element, which is the
    actual buy again button element, not the child element of it.
    */
    if (
      !buyAgainButton.classList.contains('buy-again-button') &&
      !buyAgainButton.parentElement?.classList.contains('buy-again-button')
    ) {
      return;
    } else if (
      !buyAgainButton.classList.contains('buy-again-button') &&
      buyAgainButton.parentElement?.classList.contains('buy-again-button')
    ) {
      buyAgainButton = buyAgainButton.parentElement;
      if (!(buyAgainButton instanceof HTMLButtonElement)) return;
    }

    const { productId, orderId } = buyAgainButton.dataset;
    const buyAgainSuccessHTML = buyAgainButton.querySelector(
      `span.buy-again-success-${productId}`,
    );
    const buyAgainMessageHTML = buyAgainButton.querySelector(
      `span.buy-again-message-${productId}`,
    );

    checkNullish(productId, 'Fail to get productId');
    addToCart(
      {
        productId: productId,
        quantity: 1,
        deliveryOptionId: CART_CONFIG.DEFAULT_DELIVERY_OPTION,
      },
      true,
    );

    checkNullish(buyAgainMessageHTML);
    checkNullish(buyAgainSuccessHTML);
    checkNullish(orderId);
    displayBuyAgainMessage(
      buyAgainMessageHTML,
      buyAgainSuccessHTML,
      productId,
      orderId,
    );
  });
  const returnToHomeLink = document.querySelector('.cart-quantity');
  checkNullish(returnToHomeLink);
  effect(
    () => {
      returnToHomeLink.textContent = `${cartQuantity.value}`;
    },
    { name: 'update cart quantity in dom' },
  );
}

await renderPlacedOrder();
handleSearchInput();
