import { Temporal } from 'temporal-polyfill-lite';

export const UI_TIMEOUTS = {
  ADDED_TO_CART_DISPLAY: 1500, // ms
} as const;

export const FETCH_CONFIG = {
  HIGH_PRIORITY_THRESHOLD: 14,
  SERVER_CACHE_TTL: Temporal.Duration.from({ hours: 24 }),
  CLIENT_CACHE_TTL: Temporal.Duration.from({ hours: 3 }),
} as const;

export const CART_CONFIG = {
  DEFAULT_DELIVERY_OPTION: '1',
  MAX_QUANTITY_PER_ITEM: 10,
} as const;

export const PRICE_CONFIG = {
  TAX_RATE: 0.1,
} as const;

export const STORAGE_KEYS = {
  CART: 'cart',
  ORDER: 'orders',
} as const;
