import products from './rawProducts.json';
import { nanoid } from 'nanoid';

// const newProducts = [...products];
// newProducts.map((newProduct) => {
//   newProduct.id = nanoid(5);
//   return newProduct;
// });

// // console.log(newProducts);
const newProducts = [...products];
newProducts[42].id = nanoid(5);
console.log(newProducts);
await Bun.write('./src/api/rawProducts.json', JSON.stringify(newProducts));
