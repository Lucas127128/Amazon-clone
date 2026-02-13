import products from './rawProducts.json';
import { nanoid } from 'nanoid';

const newProducts = [...products];
newProducts.map((newProduct) => {
  newProduct.id = nanoid(5);
  return newProduct;
});

// console.log(newProducts);
await Bun.write('./rawProducts.json', JSON.stringify(newProducts));
