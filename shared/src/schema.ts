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
} from 'valibot';

export const DeliveryOptionIdSchema = union([
  literal('1'),
  literal('2'),
  literal('3'),
]);
export type deliveryOptionId = InferOutput<typeof DeliveryOptionIdSchema>;

export const CartSchema = object({
  productId: string(),
  quantity: number(),
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

export const RawProductSchema = object({
  id: string(),
  image: string(),
  name: string(),
  rating: RatingSchema,
  priceCents: number(),
  keywords: array(string()),
});
export const RawProductSchemaArray = array(RawProductSchema);
export type RawProduct = InferOutput<typeof RawProductSchema>;

export const ClothingListSchema = array(string());
