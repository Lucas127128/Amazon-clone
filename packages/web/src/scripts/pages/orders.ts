import '@awesome.me/webawesome/dist/components/tooltip/tooltip.js';

import { effect } from '@preact/signals-core';
import { cartQuantity } from 'shared/cart';
import { GLOBAL_CONFIG, STORAGE_KEYS } from 'shared/constants';
import { app, cacheMap } from 'shared/edenTreaty';
import { fetchMatchingProduct } from 'shared/products';
import { OrderSchemaArray } from 'shared/schema';
import { checkNullish } from 'shared/typeChecker';
import { parse } from 'valibot';

import { getTimeString } from '../data/orders.ts';
import { policy } from '../utils/trustedTypes.ts';
import { handleSearchInput } from './header.ts';
import {
  generateOrderContainerHTML,
  generateOrdersProductHTML,
} from './htmlGenerators/ordersHTML.ts';
import { handleBuyAgainBtn } from './orders/handleBuyAgain.ts';

async function renderPlacedOrder() {
  policy();
  const savedOrders = localStorage.getItem(STORAGE_KEYS.ORDER);
  checkNullish(savedOrders);
  const orders = parse(OrderSchemaArray, JSON.parse(savedOrders));
  const ordersHTML = document.querySelector('div.orders-grid');
  checkNullish(ordersHTML);
  // cache the clothings first to avoid duplicated fetches
  const { data: clothingList, error } = await app.api.clothingList.get();
  if (error) throw error;
  cacheMap.set(`GET:${GLOBAL_CONFIG.API_URL}/api/clothingList:undefined`, {
    body: JSON.stringify(clothingList),
    time: Temporal.Now.instant().toJSON(),
  });
  await Promise.all(
    orders.map(async (order) => {
      let placedOrderHTML = '';
      await Promise.all(
        order.products.map(async (product) => {
          const matchingProduct = await fetchMatchingProduct(
            product.productId,
          );
          placedOrderHTML += generateOrdersProductHTML(
            product,
            matchingProduct,
            order.id,
          );
        }),
      );

      const orderTime = getTimeString(order.orderTime);
      const placedOrderContainerHTML = generateOrderContainerHTML(
        order,
        orderTime,
        placedOrderHTML,
      );
      ordersHTML.insertAdjacentHTML('beforeend', placedOrderContainerHTML);
    }),
  );

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
handleBuyAgainBtn();
