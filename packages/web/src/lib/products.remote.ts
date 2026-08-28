import { getMatchingRawProduct, transformProducts } from 'shared/products';
import {
  ClothingListSchema,
  ProductIdsSchema,
  RawProductsSchema,
} from 'shared/schema';
import { parse } from 'valibot';

import { query } from '$app/server';

import clothingsJson from '../../rawData/clothing.json';
import productsJson from '../../rawData/rawProducts.json';

const rawProducts = parse(RawProductsSchema, productsJson);
const clothings = parse(ClothingListSchema, clothingsJson);

export const getProducts = query(() => {
  return transformProducts(rawProducts, clothings);
});
