import { getMatchingCart } from "./products.js";
export let Cart: Cart[] = [
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
export function addToCart(productId: string, quantityToAdd: number) {
  const cart = getCart();
  const matchingItem = getMatchingCart(cart, productId);
  if (matchingItem) {
    matchingItem.Quantity = quantityToAdd;
  } else {
    cart.push({
      ProductId: productId,
      Quantity: quantityToAdd,
      deliveryOptionId: "1",
    });
  }
  localStorage.setItem("cart", JSON.stringify(cart));
}

interface Cart {
  ProductId: string;
  Quantity: number;
  deliveryOptionId: string;
}
export function removeFromCart(productId: string) {
  let newCart: Cart[] = [];
  getCart().forEach((cartItem: Cart) => {
    if (cartItem.ProductId != productId) {
      newCart.push(cartItem);
    }
  });
  localStorage.setItem("cart", JSON.stringify(newCart));
  Cart = newCart;
}

export function updateDeliveryOption(
  productId: string,
  deliveryOptionId: string,
  checkoutCart: Cart[]
) {
  const matchingItem: Cart = checkoutCart?.find(
    (cartItem) => cartItem.ProductId === productId
  )!;
  matchingItem.deliveryOptionId = deliveryOptionId;
  localStorage.setItem("cart", JSON.stringify(checkoutCart));
}

export function getCart() {
  const savedCart = localStorage.getItem("cart");
  const cart: Cart[] = savedCart ? JSON.parse(savedCart) : [];
  return cart;
}

export function displayCartQuantity() {
  let cartQuantity = 0;
  const cartQuantityHTML = document.querySelector(".cart-quantity")!;
  const cart = getCart();
  cart.forEach((cartItem) => {
    cartQuantity += cartItem.Quantity;
  });
  cartQuantityHTML.innerHTML = String(cartQuantity);
}
