export const UI_TIMEOUTS = {
  ADDED_TO_CART_DISPLAY: 1500, // ms
  //TODO: Implement search debounce using AbortController
  SEARCH_DEBOUNCE: 300, // ms
} as const;

export const FETCH_CONFIG = {
  // First 14 products get high fetch priority
  HIGH_PRIORITY_THRESHOLD: 14,
} as const;

export const CART_CONFIG = {
  DEFAULT_DELIVERY_OPTION: '1',
  //TODO: Implement max quantity in cart
  MAX_QUANTITY_PER_ITEM: 10,
} as const;

export const STORAGE_KEYS = {
  CART: 'cart',
  PRODUCTS_CACHE: 'products',
} as const;
