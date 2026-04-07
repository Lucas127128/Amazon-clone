import '@awesome.me/webawesome/dist/components/tooltip/tooltip.js';

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
    key: HTMLElement;
  };
  const timers: Timer[] = [];

  function displayBuyAgainMessage(
    buyAgainMessageHTML: HTMLElement,
    buyAgainSuccessHTML: HTMLElement,
  ) {
    buyAgainSuccessHTML.style.display = 'block';
    buyAgainSuccessHTML.style.opacity = '1';
    buyAgainMessageHTML.style.display = 'none';
    buyAgainMessageHTML.style.opacity = '0';

    let matchingTimer = timers.find(
      (timer) => timer.key === buyAgainMessageHTML,
    );
    const timer: Timer = {
      timer: setTimeout(() => {
        buyAgainMessageHTML.style.display = 'block';
        buyAgainMessageHTML.style.opacity = '1';
        buyAgainSuccessHTML.style.display = 'none';
        buyAgainSuccessHTML.style.opacity = '0';
      }, UI_TIMEOUTS.ADDED_TO_CART_DISPLAY),
      key: buyAgainMessageHTML,
    };
    if (matchingTimer) {
      clearTimeout(matchingTimer.timer);
      matchingTimer = timer;
    } else {
      timers.push(timer);
    }
  }
  const buyAgainButtons = document.querySelectorAll(
    'button.buy-again-button',
  );
  for (const buyAgainButton of buyAgainButtons) {
    buyAgainButton.addEventListener('click', () => {
      const { productId } = buyAgainButton.dataset;
      checkNullish(productId, 'Fail to get productId');
      addToCart(
        {
          productId,
          quantity: 1,
          deliveryOptionId: CART_CONFIG.DEFAULT_DELIVERY_OPTION,
        },
        true,
      );

      const buyAgainSuccessHTML = buyAgainButton.querySelector(
        `span.buy-again-success`,
      );
      const buyAgainMessageHTML = buyAgainButton.querySelector(
        `span.buy-again-message`,
      );
      checkNullish(buyAgainMessageHTML);
      checkNullish(buyAgainSuccessHTML);
      displayBuyAgainMessage(buyAgainMessageHTML, buyAgainSuccessHTML);
    });
  }
  const copyButtons = document.querySelectorAll('button.copy-button');
  for (const copyButton of copyButtons) {
    copyButton.addEventListener('click', async () => {
      const tooltip =
        copyButton.parentElement?.querySelector('wa-tooltip');
      checkNullish(tooltip);
      tooltip.textContent = 'copied';
      const icon = copyButton.querySelector('img');
      checkNullish(icon);
      icon.src = '/images/icons/tick.svg';
      setTimeout(() => {
        tooltip.textContent = 'copy';
        icon.src = '/images/icons/copy.svg';
      }, 1000);

      const { orderId } = copyButton.dataset;
      checkNullish(orderId);
      await navigator.clipboard.writeText(orderId);
    });
  }
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
