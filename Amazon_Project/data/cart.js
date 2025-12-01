import { getMatchingCart } from "./products.js";
export let Cart = [
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
export function addToCart(productId, quantityToAdd) {
  const MatchingItem = getMatchingCart(Cart, productId)
  if (MatchingItem) {
    MatchingItem.Quantity = quantityToAdd;
  } else {
    Cart.push({
      ProductId: productId,
      Quantity: quantityToAdd,
      deliveryOptionId: "1",
    });
  }
  localStorage.setItem("local_Storage_Cart", JSON.stringify(Cart));
}

export function removeFromCart(productId) {
  let newCart = [];
  JSON.parse(localStorage.getItem("local_Storage_Cart")).forEach((Product) => {
    if (Product.ProductId != productId) {
      newCart.push(Product);
    }
  });
  localStorage.setItem("local_Storage_Cart", JSON.stringify(newCart));
  Cart = newCart;
}

export function updateDeliveryOption(
  productId,
  deliveryOptionId,
  checkoutCart
) {
  let MatchingItem;
  checkoutCart.forEach((cartItem) => {
    if (productId === cartItem.ProductId) {
      MatchingItem = cartItem;
      MatchingItem.deliveryOptionId = deliveryOptionId;
    }
  });

  localStorage.setItem("local_Storage_Cart", JSON.stringify(checkoutCart));
}

export function getCart(cart) {
  if (
    localStorage.getItem("local_Storage_Cart") === null ||
    localStorage.getItem("local_Storage_Cart") === undefined
  ) {
    localStorage.setItem("local_Storage_Cart", JSON.stringify([]));
    cart = JSON.parse(localStorage.getItem("local_Storage_Cart"));
  } else {
    cart = JSON.parse(localStorage.getItem("local_Storage_Cart"));
  }
  return cart;
}