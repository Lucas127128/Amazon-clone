import {
  getMatchingProduct,
  fetchProducts,
} from '#root/shared/src/data/products.ts';
import { addToCart, cartQuantity } from '#root/shared/src/data/cart.ts';
import { getTimeString } from '#root/shared/src/data/orders.ts';
import { checkTruthy } from '../../../shared/src/utils/typeChecker.ts';
import {
  generateOrderContainerHTML,
  generateOrdersProductHTML,
} from './htmlGenerators/ordersHTML.ts';
import { handleSearchInput } from './header.ts';
import { policy } from '../../../shared/src/utils/trustedTypes.ts';
import {
  CART_CONFIG,
  STORAGE_KEYS,
  UI_TIMEOUTS,
} from '#root/config/constants.ts';
import { Order } from '#root/shared/src/schema.ts';
import { effect } from '@preact/signals-core';

async function renderPlacedOrder() {
  const savedOrders = localStorage.getItem(STORAGE_KEYS.ORDER);
  const orders: readonly Order[] = savedOrders
    ? JSON.parse(savedOrders)
    : [];
  const ordersHTML = document.querySelector('.orders-grid');
  checkTruthy(ordersHTML);
  const ordersTime = await Promise.all(
    orders.map((order) => getTimeString(order.orderTime)),
  );
  const products = await fetchProducts();
  for (const [index, order] of orders.entries()) {
    let placedOrderHTML = '';
    for (const product of order.products) {
      const matchingProduct = getMatchingProduct(
        products,
        product.productId,
      );
      checkTruthy(matchingProduct);
      placedOrderHTML += generateOrdersProductHTML(
        product,
        matchingProduct,
        order.id,
      );
    }
    const orderTime = ordersTime[index];
    const placedOrderContainerHTML = generateOrderContainerHTML(
      order,
      orderTime,
      placedOrderHTML,
    );
    const trustedOrderContainerHTML = policy?.createHTML(
      placedOrderContainerHTML,
    );
    checkTruthy(trustedOrderContainerHTML);
    ordersHTML.insertAdjacentHTML(
      'beforeend',
      trustedOrderContainerHTML as any,
    );
  }

  let timer: NodeJS.Timeout;
  function displayBuyAgainMessage(
    buyAgainMessageHTML: HTMLElement,
    buyAgainSuccessHTML: HTMLElement,
  ) {
    checkTruthy(buyAgainSuccessHTML);
    checkTruthy(buyAgainMessageHTML);
    buyAgainSuccessHTML.style.display = 'block';
    buyAgainSuccessHTML.style.opacity = '1';
    buyAgainMessageHTML.style.display = 'none';
    buyAgainMessageHTML.style.opacity = '0';

    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      buyAgainMessageHTML.style.display = 'block';
      buyAgainMessageHTML.style.opacity = '1';
      buyAgainSuccessHTML.style.display = 'none';
      buyAgainSuccessHTML.style.opacity = '0';
    }, UI_TIMEOUTS.ADDED_TO_CART_DISPLAY);
  }
  ordersHTML.addEventListener('click', (event) => {
    let buyAgainButton = <HTMLButtonElement>event.target;
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
      buyAgainButton = <HTMLButtonElement>buyAgainButton.parentElement;
    }

    const { productId } = buyAgainButton.dataset;
    const buyAgainSuccessHTML = buyAgainButton.querySelector(
      `span.buy-again-success-${productId}`,
    );
    const buyAgainMessageHTML = buyAgainButton.querySelector(
      `span.buy-again-message-${productId}`,
    );

    checkTruthy(productId, 'Fail to get productId');
    addToCart(
      {
        productId: productId,
        quantity: 1,
        deliveryOptionId: CART_CONFIG.DEFAULT_DELIVERY_OPTION,
      },
      true,
    );

    checkTruthy(buyAgainMessageHTML);
    checkTruthy(buyAgainSuccessHTML);
    displayBuyAgainMessage(buyAgainMessageHTML, buyAgainSuccessHTML);
  });
  const returnToHomeLink = document.querySelector('.cart-quantity');
  checkTruthy(returnToHomeLink);
  effect(() => {
    returnToHomeLink.textContent = `${cartQuantity.value}`;
  });
}

await Promise.allSettled([renderPlacedOrder(), handleSearchInput()]);
