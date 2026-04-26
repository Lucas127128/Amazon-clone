import { createAtom, createStore } from '@tanstack/store';
import { describe, expect, expectTypeOf, it } from 'vitest';
import { subscribe } from 'web/store';

describe.concurrent('subscribe', () => {
  it('execute once defined', () => {
    const sampleStore = createStore(0);
    let count = 0;
    subscribe(sampleStore, () => {
      count++;
    });
    expect(count).toBe(1);
  });
  it('subscribe to state change', () => {
    const sampleStore = createStore(0);
    let count = 0;
    subscribe(sampleStore, () => {
      count++;
    });
    expect(count).toBe(1);
    sampleStore.setState(() => 1);
    expect(count).toBe(2);
  });
  it('infer type from store', () => {
    const sampleStore = createStore(0);
    subscribe(sampleStore, (data) => {
      expectTypeOf(data).toBeNumber();
    });
  });
  it('infer type from atom', () => {
    const sampleAtom = createAtom(0);
    subscribe(sampleAtom, (data) => {
      expectTypeOf(data).toBeNumber();
    });
  });
});
