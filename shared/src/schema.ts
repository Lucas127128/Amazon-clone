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
  minLength,
  maxLength,
  check,
} from 'valibot';
import { CART_CONFIG } from '../../config/constants';

const RatingSchema = object({
  stars: pipe(
    number(),
    minValue(0),
    maxValue(5),
    check(
      (val) => (val * 10) % 5 === 0,
      'Stars must be in 0.5 increments.',
    ),
  ),
  count: number(),
});

export const PriceCentsSchema = pipe(number(), minValue(0));

export const RawProductSchema = object({
  id: pipe(string(), minLength(5), maxLength(5)),
  image: pipe(string(), minLength(1)),
  name: pipe(string(), minLength(1)),
  rating: RatingSchema,
  priceCents: PriceCentsSchema,
});
export const RawProductSchemaArray = array(RawProductSchema);
export type RawProduct = InferOutput<typeof RawProductSchema>;

export const DeliveryOptionIdSchema = union([
  literal('1'),
  literal('2'),
  literal('3'),
]);
export type DeliveryOptionId = InferOutput<typeof DeliveryOptionIdSchema>;

export const CartSchema = object({
  productId: RawProductSchema.entries.id,
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
  id: pipe(string(), minLength(7), maxLength(7)),
  orderTime: pipe(string(), isoTimestamp()),
  totalCostCents: pipe(number(), minValue(0)),
  products: array(CartSchema),
});
export const OrderSchemaArray = array(OrderSchema);
export type Order = InferOutput<typeof OrderSchema>;
export type OrderType = Order;

export const ClothingListSchema = array(RawProductSchema.entries.id);

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
