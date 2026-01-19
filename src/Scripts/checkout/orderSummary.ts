import { checkTruthy, checkInstanceOf } from "../Utils/typeChecker.ts";
const cartModule = import("../../data/cart");
const productsModule = import("../../data/products");
const deliveryOptionModule = import("../../data/deliveryOption");
const paymentSummaryModule = import("./paymentSummary.ts");

export async function renderOrderSummary() {
  const checkoutCart = (await cartModule).getCart();
  const orderSummary = document.querySelector(".order-summary");
  checkTruthy(orderSummary, "Fail to select HTML element");
  orderSummary.innerHTML = "";
  for (const cartItem of checkoutCart) {
    const Products = (await productsModule).Products;
    const matchingProduct = (await productsModule).getMatchingProduct(
      Products,
      cartItem.productId,
    );
    checkTruthy(matchingProduct);
    const cartSummaryHTML = `
    <div class="cart-item-container cart-item-container-${matchingProduct.id}" data-product-id="${matchingProduct.id}">
      <div class="delivery-date-${matchingProduct.id} delivery-date" >
        ${await deliveryDateHTML(matchingProduct.id)}
      </div>

      <div class="cart-item-details-grid">
        <img class="product-image"
        src="${matchingProduct.image}">

        <div class="cart-item-details">
        <div class="product-name">
          ${matchingProduct.name}
        </div>
        <div class="product-price product-price-${matchingProduct.id} ">
          $${matchingProduct.getPrice()}
        </div>
        <div class="product-quantity">
          <span class="js-product-quantity-${matchingProduct.id}">
          Quantity: <span class="quantity-label">${cartItem.quantity}</span>
          </span>
          <span class="update-quantity-link link-primary" >
          Update
          </span>
          <input type="number" class="quantity_Input_${
            matchingProduct.id
          } quantity_Input" style="width: 40px;">
          <span class="save-quantity-link-${
            matchingProduct.id
          } link-primary save-quantity-link" >
            Save</span>
          <span class="delete-quantity-link delete-quantity-link-${
            matchingProduct.id
          } link-primary">
          Delete
          </span>
        </div>
        </div>
        <div class="delivery-options">
        <div class="delivery-options-title">
          Choose a delivery option:
        </div>
        ${await deliveryOptionsHTML(matchingProduct.id)}
        </div>
      </div>
    </div>
    `;
    orderSummary.insertAdjacentHTML("beforeend", cartSummaryHTML);
  }

  async function deliveryOptionsHTML(
    matchingProductId: string,
  ): Promise<string> {
    const deliveryOption = (await deliveryOptionModule).deliveryOption;
    const addWeekDays = (await deliveryOptionModule).addWeekDays;
    const getPriceString = (await deliveryOptionModule).getPriceString;
    let html = "";
    deliveryOption.forEach((deliveryOptions) => {
      const deliveryDate = addWeekDays(deliveryOptions.deliveryDays).format(
        "dddd, MMMM D",
      );
      const priceString = getPriceString(deliveryOptions.priceCents);
      html += `
        <div>
          <input type="radio" 
          class="delivery-option-input"
          data-delivery-choice-id="${deliveryOptions.id}"
          id="${deliveryOptions.id}-${matchingProductId}">
          <div>
            <div class="delivery-option-date">
              ${deliveryDate}
            </div>
          </div>
          <div class="delivery-option-price">
            ${priceString}Shipping
          </div>
        </div>
      `;
    });
    return html;
  }
  (await cartModule).displayCartQuantity("return-to-home-link", " items");
  async function deliveryDateHTML(productId: string) {
    const getMatchingCart = (await productsModule).getMatchingCart;
    const getDeliveryDate = (await deliveryOptionModule).getDeliveryDate;
    const cartItem = getMatchingCart(checkoutCart, productId);
    checkTruthy(cartItem);
    const deliveryDate = getDeliveryDate(cartItem.deliveryOptionId);
    const html = `Delivery date: ${deliveryDate}`;
    return html;
  }

  async function renderCart() {
    await renderOrderSummary();
    (await paymentSummaryModule).renderPaymentSummary();
  }

  function handleUpdateQuantity(target: HTMLElement, productId: string) {
    const quantityInputHTML = target?.parentElement?.querySelector(
      `.quantity_Input_${productId}`,
    );
    const saveQuantityHTML = target?.parentElement?.querySelector(
      `.save-quantity-link-${productId}`,
    );
    checkTruthy(saveQuantityHTML, "Fail to select HTML element");
    checkTruthy(quantityInputHTML, "Fail to select HTML element");
    quantityInputHTML.classList.add("Display_Update_Element");
    saveQuantityHTML.classList.add("Display_Update_Element");
  }

  const cartItemContainers = document.querySelectorAll<HTMLElement>(
    ".cart-item-container",
  );
  cartItemContainers.forEach((cartItemContainer) => {
    const productId = cartItemContainer.dataset.productId;
    checkTruthy(productId, "Fail to get productId from dataset");
    let quantityToAdd = 0;

    cartItemContainer.addEventListener("click", async (event) => {
      const target = <HTMLElement>event.target;
      checkTruthy(target);

      if (target.classList.contains("update-quantity-link")) {
        handleUpdateQuantity(target, productId);
      } else if (target.classList.contains("save-quantity-link")) {
        (await cartModule).addToCart(productId, quantityToAdd);
        await renderCart();
      } else if (target.classList.contains("delete-quantity-link")) {
        (await cartModule).removeFromCart(productId);
        await renderCart();
      }
    });
    cartItemContainer.addEventListener("change", async (event) => {
      const target = <HTMLInputElement>event.target;
      checkTruthy(target, "Fail to get the event target");
      if (target.classList.contains("quantity_Input")) {
        checkInstanceOf(
          target,
          HTMLInputElement,
          "Fail to get the event target",
        );
        quantityToAdd = Number(target.value);
      } else if (target.classList.contains("delivery-option-input")) {
        const deliveryChoiceId = target.dataset.deliveryChoiceId;
        checkTruthy(
          deliveryChoiceId,
          "Fail to get productId from HTML dataset",
        );
        (await cartModule).updateDeliveryOption(productId, deliveryChoiceId);
        await renderCart();
      }
    });
  });

  checkoutCart.forEach((cartItem) => {
    const deliveryOptionButtonHTML = document.getElementById(
      `${cartItem.deliveryOptionId}-${cartItem.productId}`,
    );
    if (!(deliveryOptionButtonHTML instanceof HTMLInputElement)) {
      console.error("Fail to get the HTML element");
      return;
    }
    deliveryOptionButtonHTML.checked = true;
  });
}

async function loadPage() {
  try {
    const fetchProducts = (await productsModule).fetchProducts;
    await fetchProducts();
    await renderOrderSummary();
  } catch (error) {
    console.error(`unexpected network error: ${error}`);
  }
}
loadPage();
