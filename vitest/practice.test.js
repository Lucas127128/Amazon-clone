import { expect, test,vi } from "vitest";
import { Window } from "happy-dom";
const window = new Window()
const document = window.document
test("mocking practice", async ({ expect }) => {
    let apples = 0;
    const cart = {
      getApples: () => 42,
    };
    const spy = vi.spyOn(cart, "getApples").mockImplementation(() => apples);
    apples = 1;
    expect(cart.getApples()).toBe(1);
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveReturnedWith(1);
  });

test("happy-dom practice", ()=>{
  document.body.innerHTML="<h1 class='test'>hello world!</h1>"
  console.log(window.localStorage)
  const testHTML=document.querySelector(".test")
  expect(testHTML.innerText).toBe("hello world!")
})