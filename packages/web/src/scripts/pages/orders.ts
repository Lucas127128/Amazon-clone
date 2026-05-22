import { comptime } from 'comptime';
import { STORAGE_KEYS } from 'shared/constants';
import { getMatchingProduct } from 'shared/products';
import { OrdersSchema } from 'shared/schema';
import { checkNullish } from 'shared/typeChecker';
import { parse } from 'valibot';

import { fetchProducts } from '#data/products.ts';

import { cartQuantity } from '../data/cart.ts';
import { getTimeString } from '../data/orders.ts';
import { sanitizer } from '../utils/trustedTypes.ts';
import { handleSearchInput } from './header.ts';
import {
  generateOrderContainerHTML,
  generateOrdersProductHTML,
} from './htmlGenerators/ordersHTML.ts';
import { handleBuyAgainBtn } from './orders/handleBuyAgain.ts';

async function renderPlacedOrder() {
  const savedOrders = localStorage.getItem(
    comptime(() => STORAGE_KEYS.ORDER),
  );
  checkNullish(savedOrders);
  const orders = parse(OrdersSchema, JSON.parse(savedOrders));
  const ordersHTML = document.querySelector('div.orders-grid');
  checkNullish(ordersHTML);

  const products = await fetchProducts(
    orders.flatMap((order) =>
      order.products.map((product) => product.productId),
    ),
  );
  let placedOrderContainerHTML = '';
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
    placedOrderContainerHTML += generateOrderContainerHTML(
      order,
      orderTime,
      placedOrderHTML,
    );
  }

  const trustedHTML = sanitizer?.createHTML(placedOrderContainerHTML);
  checkNullish(trustedHTML);
  ordersHTML.insertAdjacentHTML(
    'beforeend',
    trustedHTML as unknown as string,
  );

  const copyButtons = document.querySelectorAll('button.copy-button');
  for (const copyButton of copyButtons) {
    copyButton.addEventListener('click', async () => {
      const icon = copyButton.querySelector('img');
      checkNullish(icon);
      icon.src = '/images/icons/tick.svg';

      const { orderId } = copyButton.dataset;
      checkNullish(orderId);
      await navigator.clipboard.writeText(orderId);
    });
  }
  const returnToHomeLink = document.querySelector('.cart-quantity');
  checkNullish(returnToHomeLink);
  cartQuantity.subscribe((cartQuantity) => {
    returnToHomeLink.textContent = cartQuantity.toString();
  });
}

await renderPlacedOrder();

handleSearchInput();
handleBuyAgainBtn();
