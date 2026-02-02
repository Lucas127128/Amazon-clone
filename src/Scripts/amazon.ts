import { incrementAddToCart, displayCartQuantity } from "../data/cart";
import { fetchProducts } from "../data/products";
import { checkTruthy } from "./Utils/typeChecker";

async function renderAmazonHomePage() {
  const productsGrid = document.querySelector(".products-grid");
  checkTruthy(productsGrid, "Fail to select HTML element");
  const products = await fetchProducts();
  const html = String.raw;
  products.forEach((products) => {
    const productsHTML = html`
      <div class="product-container">
          <div class="product-image-container">
              <img class="product-image"
              src="${products.image}">
          </div>

          <div class="product-name limit-text-to-2-lines">
              ${products.name}
          </div>

          <div class="product-rating-container">
              <img class="product-rating-stars"
              src="${products.getStarsUrl()}">
              <div class="product-rating-count link-primary">
              ${products.rating.count}
              </div>
          </div>

          <div class="product-price">
              $${products.getPrice()}
          </div>

          <div class="product-quantity-container">
              <select class = "ProductQuantitySelector">
              <option selected value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
              <option value="10">10</option>
              </select>
          </div>
          ${products.extraInfoHTML}

          <div class="product-spacer"></div>

          <div class="added-to-cart added-to-cart-${products.id}">
              <img src="/images/icons/checkmark.png">
              Added
          </div>

          <button class="add-to-cart-button button-primary"
          data-product-id="${products.id}">
              Add to Cart
          </button>
          </div>
      </div>
    `;
    productsGrid.insertAdjacentHTML("beforeend", productsHTML);
  });

  function displayAdded(productId: string) {
    const addedToCart = document.querySelector(`.added-to-cart-${productId}`);
    checkTruthy(addedToCart, "Fail to select HTML element");
    addedToCart.classList.add("display-added-to-cart");
    setTimeout(() => {
      addedToCart.classList.remove("display-added-to-cart");
    }, 1500);
  }

  productsGrid.addEventListener("click", (event) => {
    const button = <HTMLButtonElement>event.target;
    if (!button.classList.contains("add-to-cart-button")) {
      return;
    }

    const productId = button.dataset.productId;
    const productContainer = button.parentElement;
    const quantitySelectorHTML =
      productContainer?.querySelector<HTMLInputElement>(
        ".ProductQuantitySelector",
      );
    checkTruthy(
      quantitySelectorHTML,
      "Fail to get the HTML element or the product id dataset is incorrect",
    );
    checkTruthy(
      productId,
      "Fail to get the HTML element or the product id dataset is incorrect",
    );
    const quantityToAdd = parseInt(quantitySelectorHTML.value);
    incrementAddToCart(productId, quantityToAdd);
    displayCartQuantity("cart-quantity");
    displayAdded(productId);
  });
  displayCartQuantity("cart-quantity");
}

async function loadPage() {
  try {
    renderAmazonHomePage();
  } catch (error) {
    console.log(`unexpected network error: ${error}`);
  }
}
loadPage();
