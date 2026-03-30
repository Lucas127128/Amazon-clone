import { getMatchingProduct, fetchProducts } from '#data/products.ts';
import { addToCart, cartQuantity } from '#data/cart.ts';
import { getTimeString } from '#data/orders.ts';
import { checkNullish } from '#utils/typeChecker.ts';
import {
  generateOrderContainerHTML,
  generateOrdersProductHTML,
} from './htmlGenerators/ordersHTML.ts';
import { handleSearchInput } from './header.ts';
import { policy } from '#root/shared/src/utils/trustedTypes.ts';
import {
  CART_CONFIG,
  STORAGE_KEYS,
  UI_TIMEOUTS,
} from '#root/config/constants.ts';
import { OrderSchemaArray, type Order } from '#root/shared/src/schema.ts';
import { effect } from '@preact/signals-core';
import { parse } from 'valibot';

async function renderPlacedOrder() {
  const savedOrders = localStorage.getItem(STORAGE_KEYS.ORDER);
  checkNullish(savedOrders);
  const orders: readonly Order[] = parse(
    OrderSchemaArray,
    JSON.parse(savedOrders),
  );
  const ordersHTML = document.querySelector('.orders-grid');
  checkNullish(ordersHTML);
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
      checkNullish(matchingProduct);
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
    checkNullish(trustedOrderContainerHTML);
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
    buyAgainSuccessHTML.style.display = 'block';
    buyAgainSuccessHTML.style.opacity = '1';
    buyAgainMessageHTML.style.display = 'none';
    buyAgainMessageHTML.style.opacity = '0';

    clearTimeout(timer);
    timer = setTimeout(() => {
      buyAgainMessageHTML.style.display = 'block';
      buyAgainMessageHTML.style.opacity = '1';
      buyAgainSuccessHTML.style.display = 'none';
      buyAgainSuccessHTML.style.opacity = '0';
    }, UI_TIMEOUTS.ADDED_TO_CART_DISPLAY);
  }
  ordersHTML.addEventListener('click', (event) => {
    let buyAgainButton = event.target as HTMLButtonElement;
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
      buyAgainButton = buyAgainButton.parentElement as HTMLButtonElement;
    }

    const { productId } = buyAgainButton.dataset;
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
    displayBuyAgainMessage(buyAgainMessageHTML, buyAgainSuccessHTML);
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

await Promise.allSettled([renderPlacedOrder(), handleSearchInput()]);
