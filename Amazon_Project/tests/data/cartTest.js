import { addToCart, Cart } from "../../data/cart.js";
let cart = JSON.parse(localStorage.getItem("local_Storage_Cart"));
describe("test suite: addToCart", () => {
  it("add a new product to cart", () => {
    console.log(cart);
    //spyOn(localStorage, 'setItem')
    //spyOn(localStorage, 'getItem').and.callFake(() => {
    //    return JSON.stringify([]);
    //});
    cart = [];
    console.log(cart.length);
    addToCart("6b07d4e7-f540-454e-8a1e-363f25dbae7d", 4);
    cart = JSON.parse(localStorage.getItem("local_Storage_Cart"));
    console.log(cart.length);
    expect(cart.length).toEqual(1);
    expect(cart[0].ProductId).toEqual("6b07d4e7-f540-454e-8a1e-363f25dbae7d");
    expect(cart[0].Quantity).toEqual(4);
    //expect(localStorage).toHaveBeenCalledTimes(0)
    console.log(cart.length);
    localStorage.setItem("local_Storage_Cart", JSON.stringify([]));
    cart = [];
  });
  it("add an existing product to cart", () => {
    localStorage.setItem(
      "local_Storage_Cart",
      JSON.stringify([
        {
          ProductId: "6b07d4e7-f540-454e-8a1e-363f25dbae7d",
          Quantity: 4,
          deliveryOptionId: "1",
        },
      ])
    );
    console.log(JSON.parse(localStorage.getItem("local_Storage_Cart")))
    addToCart("6b07d4e7-f540-454e-8a1e-363f25dbae7d", 4);
    cart = JSON.parse(localStorage.getItem("local_Storage_Cart"));
    console.log(cart)
    expect(cart.length).toEqual(1);
    expect(cart[0].ProductId).toEqual("6b07d4e7-f540-454e-8a1e-363f25dbae7d");
    expect(cart[0].Quantity).toEqual(8);
    console.log(cart.length);
    localStorage.setItem("local_Storage_Cart", JSON.stringify([]));
    cart = [];
  });
});
