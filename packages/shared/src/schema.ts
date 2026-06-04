import {
  array,
  cache,
  type InferOutput,
  integer,
  isoTimestamp,
  literal,
  maxLength,
  maxValue,
  minLength,
  minValue,
  number,
  object,
  optional,
  pipe,
  string,
  undefined as Undefined,
  union,
  unknown,
} from 'valibot';

import { CART_CONFIG } from '../config/constants.ts';

export const RatingSchema = object({
  stars: union([
    literal(0),
    literal(0.5),
    literal(1),
    literal(1.5),
    literal(2),
    literal(2.5),
    literal(3),
    literal(3.5),
    literal(4),
    literal(4.5),
    literal(5),
  ]),
  count: pipe(number(), integer()),
});

export const PriceCentsSchema = pipe(number(), minValue(0));
export const ProductIdSchema = pipe(string(), minLength(5), maxLength(5));

export const RawProductSchema = cache(
  object({
    id: ProductIdSchema,
    image: pipe(string(), minLength(1)),
    name: pipe(string(), minLength(1)),
    rating: RatingSchema,
    priceCents: PriceCentsSchema,
  }),
);
export const RawProductsSchema = array(RawProductSchema);
export type RawProduct = InferOutput<typeof RawProductSchema>;

export const DeliveryOptionIdSchema = union([
  literal('1'),
  literal('2'),
  literal('3'),
]);
export type DeliveryOptionId = InferOutput<typeof DeliveryOptionIdSchema>;

export const CartSchema = object({
  productId: ProductIdSchema,
  quantity: pipe(
    number(),
    minValue(1),
    maxValue(CART_CONFIG.MAX_QUANTITY_PER_ITEM),
  ),
  deliveryOptionId: DeliveryOptionIdSchema,
});
export const CartsSchema = array(CartSchema);
export type Cart = InferOutput<typeof CartSchema>;

export const OrderSchema = object({
  id: pipe(string(), minLength(7), maxLength(7)),
  orderTime: pipe(string(), isoTimestamp()),
  totalCostCents: pipe(number(), minValue(0)),
  products: array(CartSchema),
});
export const OrdersSchema = array(OrderSchema);
export type Order = InferOutput<typeof OrderSchema>;

export const ClothingListSchema = cache(array(ProductIdSchema));

export const SearchResultSchema = array(ProductIdSchema);
export const SearchOptionsSchema = object({
  q: string(),
  limit: optional(number()),
});

export type SearchResult = InferOutput<typeof SearchResultSchema>;

export const ProductSortOptionsSchema = union([
  literal('most-stars'),
  literal('least-stars'),
  literal('most-people-star'),
  literal('least-people-star'),
  literal('most-expensive'),
  literal('least-expensive'),
]);

export const ElysiaValidationErrorSchema = object({
  status: literal(422),
  value: object({
    type: literal('validation'),
    on: string(),
    summary: optional(union([string(), Undefined()])),
    message: optional(union([string(), Undefined()])),
    found: optional(unknown()),
    property: optional(union([string(), Undefined()])),
    expected: optional(union([string(), Undefined()])),
  }),
});

export type ElysiaValidationError = InferOutput<
  typeof ElysiaValidationErrorSchema
>;

export const FileExtensionSchema = union([
  literal('html'),
  literal('css'),
  literal('js'),
  literal('webp'),
  literal('png'),
  literal('svg'),
  literal('jpg'),
  literal('ico'),
  literal('ttf'),
  literal('webmanifest'),
]);
export type FileExtension = InferOutput<typeof FileExtensionSchema>;
