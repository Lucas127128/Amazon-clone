import { bench } from 'vitest';
// import ky from "ky";
// import axios from "axios";
import { Product } from '../src/data/products';

bench('fetch', async () => {
  const products = await fetch('http://localhost:3000/products');
  const productsJSON = await products.json();
  //   console.log(await productsJSON);
});

bench('ky', async () => {
  const ky = (await import('ky')).default;
  const products: Product[] = await ky
    .get('http://localhost:3000/products')
    .json();
  //   console.log(products);
});

bench('axios', async () => {
  const axios = (await import('axios')).default;
  const products: Product[] = (
    await axios.get('http://localhost:3000/products')
  ).data;
  //   console.log(products);
});
