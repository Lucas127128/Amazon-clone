import { Elysia } from 'elysia';
import MiniSearch from 'minisearch';
import {
  RawProduct,
  RawProductSchema,
  getMatchingRawProduct,
} from '../data/products';
import { checkTruthy } from '../scripts/Utils/typeChecker';
import { array } from 'valibot';

const products = await Bun.file('./src/api/rawProducts.json').json();
const productsSearch = new MiniSearch({
  fields: ['name', 'keywords'],
  storeFields: ['id'],
});
productsSearch.addAll(products);

export const searchPlugin = new Elysia({ prefix: '/api/search' }).get(
  '/products/:q',
  ({ params: { q } }) => {
    const results = productsSearch.search(q, {
      boost: { name: 2 },
      fuzzy: 0.1,
      prefix: true,
    });
    const resultProducts = results
      .sort((a, b) => b.score - a.score)
      .map((result): RawProduct => {
        const product = getMatchingRawProduct(products, result.id);
        checkTruthy(product);
        return product;
      });

    return resultProducts;
  },
  {
    response: array(RawProductSchema),
  },
);
