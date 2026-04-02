import { bench } from 'vitest';
import { app } from 'shared/edenTreaty';

bench('fetch', async () => {
  const products = await fetch('https://localhost:8080/api/products');
  const productsJSON = await products.json();
  // console.log(await productsJSON);
});

bench('eden treaty', async () => {
  const { data: products, error } = await app.api.products.get();
  if (error) throw error;
  // console.log(products);
});
