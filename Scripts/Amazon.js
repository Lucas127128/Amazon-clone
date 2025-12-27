import { addToCart, displayCartQuantity, getCart } from "../data/cart.ts";
import { Products, fetchProducts } from "../data/products.js";
let ProductsHTML = "";
function renderAmazonHomePage() {
  Products.forEach((products) => {
    ProductsHTML += `
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
            ${products.extraInfoHTML()}

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
  });
  const productsGrid = document.querySelector(".products-grid");
  productsGrid.innerHTML = ProductsHTML;
  function displayAdded(ProductId) {
    const addedToCart = document.querySelector(`.added-to-cart-${ProductId}`);
    addedToCart.classList.add("display-added-to-cart");
    setTimeout(() => {
      addedToCart.classList.remove("display-added-to-cart");
    }, 1500);
  }
  const addToCartButton = document.querySelectorAll(".add-to-cart-button");
  addToCartButton.forEach((button) => {
    button.addEventListener("click", () => {
      const productId = button.dataset.productId;
      const productContainer = button.closest(".product-container");
      const quantitySelectorHTML = productContainer.querySelector(
        ".ProductQuantitySelector"
      );
      const quantityToAdd = parseInt(quantitySelectorHTML.value);
      addToCart(productId, quantityToAdd);
      displayCartQuantity();
      displayAdded(productId);
    });
  });
}

async function loadPage() {
  try {
    await fetchProducts();
    renderAmazonHomePage();
  } catch (error) {
    console.log(`unexpected network error: ${error}`);
  }
}
loadPage();
