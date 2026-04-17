import { createStore } from '@tanstack/store';
import { describe, expect, test } from 'vitest';
import { subscribe } from 'web/store';

describe.concurrent('subscribe', () => {
  test('execute once defined', () => {
    const sampleStore = createStore(0);
    let count = 0;
    subscribe(sampleStore, () => {
      count++;
    });
    expect(count).toBe(1);
  });
  test('subscribe to state change', () => {
    const sampleStore = createStore(0);
    let count = 0;
    subscribe(sampleStore, () => {
      count++;
    });
    expect(count).toBe(1);
    sampleStore.setState(() => 1);
    expect(count).toBe(2);
  });
});
