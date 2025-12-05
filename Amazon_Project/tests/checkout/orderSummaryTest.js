import { renderOrderSummary } from "../../Scripts/checkout/orderSummary.js";
import { fetchProducts } from "../../data/products.js";
function runTestSuite() {
  describe("test suite: render order summary", () => {
    beforeEach(() => {
      localStorage.setItem(
        "local_Storage_Cart",
        JSON.stringify([
          {
            ProductId: "15b6fc6f-327a-4ec4-896f-486349e85a3d",
            Quantity: 1,
            deliveryOptionId: "1",
          },
          {
            ProductId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
            Quantity: 2,
            deliveryOptionId: "1",
          },
        ])
      );
      let CheckoutCart = JSON.parse(localStorage.getItem("local_Storage_Cart"));
    });

    it("display the cart", () => {
      let CheckoutCart = JSON.parse(localStorage.getItem("local_Storage_Cart"));
      const productId1 = CheckoutCart[0].ProductId;
      const productId2 = CheckoutCart[1].ProductId;
      const quantityHTML1 = document.querySelector(
        `.js-product-quantity-${productId1}`
      );
      const quantityHTML2 = document.querySelector(
        `.js-product-quantity-${productId2}`
      );
      const cartItemContainer = document.querySelectorAll(
        ".cart-item-container"
      );

      expect(cartItemContainer.length).toEqual(2);
      expect(quantityHTML1.innerText).toContain("Quantity: 1");
      expect(quantityHTML2.innerText).toContain("Quantity: 2");
      cartItemContainer.innerHTML = "";
    });

    it("removes the product", () => {
      let CheckoutCart = JSON.parse(localStorage.getItem("local_Storage_Cart"));
      let cartItemContainer = document.querySelectorAll(".cart-item-container");
      const productId1 = CheckoutCart[0].ProductId;
      const productId2 = CheckoutCart[1].ProductId;
      let cartItemContainer1 = document.querySelector(
        `.cart-item-container-${productId1}`
      );
      let cartItemContainer2 = document.querySelector(
        `.cart-item-container-${productId2}`
      );
      const deleteQuantityHTML1 = document.querySelector(
        `.delete-quantity-link-${productId1}`
      );
      const deleteQuantityHTML2 = document.querySelector(
        `.delete-quantity-link-${productId2}`
      );
      deleteQuantityHTML1.click();
      cartItemContainer = document.querySelectorAll(".cart-item-container");
      cartItemContainer1 = document.querySelector(
        `.cart-item-container-${productId1}`
      );
      cartItemContainer2 = document.querySelector(
        `.cart-item-container-${productId2}`
      );
      CheckoutCart = JSON.parse(localStorage.getItem("local_Storage_Cart"));
      expect(cartItemContainer.length).toEqual(1);
      expect(cartItemContainer1).toEqual(null);
      expect(cartItemContainer2).not.toEqual(null);
      expect(CheckoutCart.length).toEqual(1);
      expect(CheckoutCart[0].ProductId).toEqual(productId2);
      cartItemContainer.innerHTML = "";
      document.querySelector(".test-container").innerHTML = "";
    });
  });
}

async function loadPage() {
  await fetchProducts();
  runTestSuite();
  renderPaymentSummary();
}
loadPage();
