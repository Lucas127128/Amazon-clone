class cart {
  cartItems = [
    /*{
    ProductId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
    Quantity: 2,
    deliveryOptionId: '1'
},{
    ProductId: "15b6fc6f-327a-4ec4-896f-486349e85a3d",
    Quantity: 1,
    deliveryOptionId: '2'
    }*/
  ];

  localStorageKey = "";

  Add_To_cart(productId, quantityToAdd) {
    let MatchingItem;
    this.cartItems.forEach((cartItem) => {
      if (productId === cartItem.ProductId) {
        MatchingItem = cartItem;
      }
    });
    if (MatchingItem) {
      MatchingItem.Quantity += quantityToAdd;
    } else {
      this.cartItems.push({
        ProductId: productId,
        Quantity: quantityToAdd,
        deliveryOptionId: "1",
      });
    }
    localStorage.setItem(this.localStorageKey, JSON.stringify(this.cartItems));
  }

  RemoveFromCart(productId) {
    let newCart = [];
    JSON.parse(localStorage.getItem(this.localStorageKey)).forEach(
      (Product) => {
        if (Product.ProductId != productId) {
          newCart.push(Product);
        }
      }
    );
    localStorage.setItem(this.localStorageKey, JSON.stringify(newCart));
    this.cartItems = newCart;
  }

  UpdateDeliveryOption(productId, deliveryOptionId, checkoutCart) {
    let MatchingItem;
    checkoutCart.forEach((cartItem) => {
      if (productId === cartItem.ProductId) {
        MatchingItem = cartItem;
        MatchingItem.deliveryOptionId = deliveryOptionId;
      }
    });

    localStorage.setItem(this.localStorageKey, JSON.stringify(checkoutCart));
  }
}

const Cart = new cart();
const businessCart = new cart();
Cart.localStorageKey = "local_Storage_Cart";
businessCart.localStorageKey = "local_Storage_business_Cart";
Cart.Add_To_cart("e43638ce-6aa0-4b85-b27f-e1d07eb678c6", 3);
console.log(JSON.stringify(businessCart));
console.log(businessCart instanceof cart);
