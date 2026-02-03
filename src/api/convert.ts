import products from "./products.json";
import { nanoid } from "nanoid";

const newProducts = [...products];
newProducts.map((newProduct) => {
  newProduct.id = nanoid(5);
});

// console.log(newProducts);
Bun.write("./products.json", JSON.stringify(newProducts));
