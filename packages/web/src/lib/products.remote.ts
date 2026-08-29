import { parse } from 'valibot';

import { transformProducts } from '#lib/data/products.ts';
import { ClothingListSchema, RawProductsSchema } from '#lib/schema.ts';
import { query } from '$app/server';

import clothingsJson from '../../rawData/clothing.json';
import productsJson from '../../rawData/rawProducts.json';

const rawProducts = parse(RawProductsSchema, productsJson);
const clothings = parse(ClothingListSchema, clothingsJson);

export const getProducts = query(() => {
  return transformProducts(rawProducts, clothings);
});
