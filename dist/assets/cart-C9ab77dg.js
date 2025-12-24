function formatCurrency(priceCents) {
  return (Math.round(priceCents) / 100).toFixed(2);
}
function getMatchingCart(cart, productId) {
  const matchingItem = cart.find(
    (cartItem) => cartItem.ProductId === productId
  );
  return matchingItem;
}
function getMatchingProduct(products, productId) {
  const MatchingItem = products.find((product) => product.id === productId);
  return MatchingItem;
}
class Product {
  constructor(productDetails) {
    this.id = productDetails.id;
    this.image = productDetails.image;
    this.name = productDetails.name;
    this.rating = productDetails.rating;
    this.priceCents = productDetails.priceCents;
  }
  getStarsUrl() {
    return `/images/ratings/rating-${this.rating.stars * 10}.png`;
  }
  getPrice() {
    return `${formatCurrency(this.priceCents)}`;
  }
  extraInfoHTML() {
    return ``;
  }
  getImageURL() {
    return this.image;
  }
  id;
  image;
  name;
  rating;
  priceCents;
}
class Clothing extends Product {
  sizeChartLink;
  constructor(productDetails) {
    super(productDetails);
    this.sizeChartLink = productDetails.sizeChartLink;
  }
  extraInfoHTML() {
    return `
    <a href="${this.sizeChartLink}" target="_blank">
      Size chart
    </a>
    `;
  }
}
new Clothing({
  id: "83d4ca15-0f35-48f5-b7a3-1ea210004f2e",
  image: "images/products/adults-plain-cotton-tshirt-2-pack-teal.jpg",
  name: "Adults Plain Cotton T-Shirt - 2 Pack",
  rating: {
    stars: 4.5,
    count: 56
  },
  priceCents: 799,
  keywords: ["tshirts", "apparel", "mens"],
  type: "clothing",
  sizeChartLink: "images/clothing-size-chart.png"
});
new Product({
  id: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
  image: "images/products/athletic-cotton-socks-6-pairs.jpg",
  name: "Black and Gray Athletic Cotton Socks - 6 Pairs",
  rating: {
    stars: 4.5,
    count: 87
  },
  priceCents: 1090,
  keywords: ["socks", "sports", "apparel"]
});
let Products = [];
function fetchProducts() {
  const promise = fetch("https://localhost:3001/products").then((response) => {
    return response.json();
  }).then((productsData) => {
    Products = productsData.map((productDetails) => {
      if (productDetails.type === "clothing") {
        return new Clothing(productDetails);
      }
      return new Product(productDetails);
    });
  });
  return promise;
}
function addToCart(productId, quantityToAdd) {
  let cart = JSON.parse(localStorage.getItem("local_Storage_Cart")) || [];
  const MatchingItem = getMatchingCart(cart, productId);
  if (MatchingItem) {
    MatchingItem.Quantity = quantityToAdd;
  } else {
    cart.push({
      ProductId: productId,
      Quantity: quantityToAdd,
      deliveryOptionId: "1"
    });
  }
  localStorage.setItem("local_Storage_Cart", JSON.stringify(cart));
}
function removeFromCart(productId) {
  let newCart = [];
  JSON.parse(localStorage.getItem("local_Storage_Cart")).forEach((Product2) => {
    if (Product2.ProductId != productId) {
      newCart.push(Product2);
    }
  });
  localStorage.setItem("local_Storage_Cart", JSON.stringify(newCart));
}
function updateDeliveryOption(productId, deliveryOptionId, checkoutCart) {
  const MatchingItem = checkoutCart.find(
    (cartItem) => cartItem.ProductId === productId
  );
  MatchingItem.deliveryOptionId = deliveryOptionId;
  localStorage.setItem("local_Storage_Cart", JSON.stringify(checkoutCart));
}
function getCart(cart) {
  if (localStorage.getItem("local_Storage_Cart") === null || localStorage.getItem("local_Storage_Cart") === void 0) {
    localStorage.setItem("local_Storage_Cart", JSON.stringify([]));
    cart = JSON.parse(localStorage.getItem("local_Storage_Cart"));
  } else {
    cart = JSON.parse(localStorage.getItem("local_Storage_Cart"));
  }
  return cart;
}
function displayCartQuantity() {
  let cartQuantity = 0;
  const cartQuantityHTML = document.querySelector(".cart-quantity");
  const cart = JSON.parse(localStorage.getItem("local_Storage_Cart")) || [];
  cart.forEach((cartItem) => {
    cartQuantity += cartItem.Quantity;
  });
  cartQuantityHTML.innerHTML = cartQuantity;
}
export {
  Products as P,
  addToCart as a,
  formatCurrency as b,
  getCart as c,
  displayCartQuantity as d,
  getMatchingCart as e,
  fetchProducts as f,
  getMatchingProduct as g,
  removeFromCart as r,
  updateDeliveryOption as u
};
