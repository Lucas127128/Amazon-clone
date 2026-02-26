import { getMatchingProduct, getProducts } from '#data/products.ts';
import { addToCart, displayCartQuantity } from '#data/cart.ts';
import { getTimeString, Order } from '#data/orders.ts';
import { checkTruthy } from './Utils/typeChecker.ts';
import {
  generateOrderContainerHTML,
  generateOrdersProductHTML,
} from './htmlGenerators/ordersHTML.ts';
import { handleSearchInput } from './header.ts';
import { policy } from './Utils/trustedTypes.ts';

function renderPlacedOrder() {
  localStorage.setItem('cart', JSON.stringify([]));
  const savedOrders = localStorage.getItem('orders');
  const orders: readonly Order[] = savedOrders
    ? JSON.parse(savedOrders)
    : [];
  const ordersHTML = document.querySelector('.orders-grid');
  checkTruthy(ordersHTML);
  orders.forEach(async (order) => {
    let placedOrderHTML = '';
    const products = await getProducts();
    order.products.forEach((product) => {
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
    });
    const orderTime = await getTimeString(order.orderTime);
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
  });

  function displayBuyAgainMessage(
    buyAgainMessageHTML: Element,
    buyAgainSuccessHTML: Element,
  ): void {
    checkTruthy(buyAgainSuccessHTML);
    checkTruthy(buyAgainMessageHTML);
    buyAgainSuccessHTML.classList.add('display-buy-again-success');
    buyAgainMessageHTML.classList.add('hide-buy-again-message');
    displayCartQuantity('cart-quantity');
    setTimeout(() => {
      buyAgainSuccessHTML.classList.remove('display-buy-again-success');
      buyAgainMessageHTML.classList.remove('hide-buy-again-message');
    }, 1500);
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
      { productId: productId, quantity: 1, deliveryOptionId: '1' },
      true,
    );

    checkTruthy(buyAgainMessageHTML);
    checkTruthy(buyAgainSuccessHTML);
    displayBuyAgainMessage(buyAgainMessageHTML, buyAgainSuccessHTML);
  });
  displayCartQuantity('cart-quantity');
}

await Promise.all([renderPlacedOrder(), handleSearchInput()]);
