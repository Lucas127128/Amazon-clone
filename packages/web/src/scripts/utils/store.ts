import type { ReadonlyStore, Store } from '@tanstack/store';
import { cartStore } from 'shared/cart';

/** Run Tanstack store observer callback immediately */
export function subscribe<T>(
  store: Store<T> | ReadonlyStore<T>,
  fn: (state: T) => void,
) {
  fn(store.get());
  store.subscribe(fn);
}

subscribe(cartStore, () => {});
