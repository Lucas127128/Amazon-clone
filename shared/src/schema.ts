import {
  object,
  number,
  string,
  union,
  literal,
  pipe,
  isoTimestamp,
  array,
  InferOutput,
  minValue,
  maxValue,
  any,
  record,
  intersect,
} from 'valibot';
import { CART_CONFIG } from './constants';

export const DeliveryOptionIdSchema = union([
  literal('1'),
  literal('2'),
  literal('3'),
]);
export type DeliveryOptionId = InferOutput<typeof DeliveryOptionIdSchema>;

export const CartSchema = object({
  productId: string(),
  quantity: pipe(
    number(),
    minValue(1),
    maxValue(CART_CONFIG.MAX_QUANTITY_PER_ITEM),
  ),
  deliveryOptionId: DeliveryOptionIdSchema,
});
export const CartSchemaArray = array(CartSchema);
export type Cart = InferOutput<typeof CartSchema>;

export const OrderSchema = object({
  id: string(),
  orderTime: pipe(string(), isoTimestamp()),
  totalCostCents: number(),
  products: array(CartSchema),
});
export type Order = InferOutput<typeof OrderSchema>;
export type OrderType = Order;

const RatingSchema = object({
  stars: number(),
  count: number(),
});

export const PriceCentsSchema = pipe(number(), minValue(0));

export const RawProductSchema = object({
  id: string(),
  image: string(),
  name: string(),
  rating: RatingSchema,
  priceCents: PriceCentsSchema,
  keywords: array(string()),
});
export const RawProductSchemaArray = array(RawProductSchema);
export type RawProduct = InferOutput<typeof RawProductSchema>;

export const ClothingListSchema = array(string());

export const SearchResultSchema = intersect([
  object({
    id: any(),
    terms: array(string()),
    queryTerms: array(string()),
    score: number(),
    match: record(string(), array(string())),
  }),
  record(string(), any()),
]);

export type HttpMethods =
  | 'GET'
  | 'DELETE'
  | 'OPTIONS'
  | 'POST'
  | 'PUT'
  | 'PATCH'
  | 'QUERY';
