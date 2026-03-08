import { deliveryOptionId } from '#root/shared/src/schema.ts';
import {
  checkTruthy,
  isDeliveryOptionId,
  isHTMLInputElement,
} from '#root/shared/src/utils/typeChecker.ts';
import { describe, expect, test } from 'bun:test';

describe.concurrent('checkTruthy', () => {
  describe('accept truthy and reject falsy', () => {
    test('accept truthy number', () => {
      expect(() => checkTruthy(1)).not.toThrow();
    });
    test('reject falsy number', () => {
      expect(() => checkTruthy(0)).toThrow();
    });
    test('accept truthy string', () => {
      expect(() => checkTruthy('foo')).not.toThrow();
    });
    test('reject falsy string', () => {
      expect(() => checkTruthy('')).toThrow();
    });
    test('reject null', () => {
      expect(() => checkTruthy(null)).toThrow();
    });
    test('reject undefined', () => {
      expect(() => checkTruthy(undefined)).toThrow();
    });
  });

  describe('throw custom message', () => {
    test('throw custom message when falsy', () => {
      expect(() => checkTruthy(undefined, 'success throw')).toThrow(
        `success throw: The value of undefined is falsy`,
      );
    });
    test('throw default error', () => {
      expect(() => checkTruthy(undefined)).toThrowError(
        'Error: The value of undefined is falsy',
      );
    });
  });
});

describe.concurrent('isHTMLInputElement', () => {
  test('accept HTMLInputElement', () => {
    const inputElement = document.createElement('input');
    expect(() => isHTMLInputElement(inputElement)).not.toThrow();
  });
  test('reject other html element', () => {
    const textElement = document.createElement('h1');
    const divElement = document.createElement('div');
    expect(() => isHTMLInputElement(textElement)).toThrow();
    expect(() => isHTMLInputElement(divElement)).toThrow();
  });
});

describe.concurrent('isDeliveryOptionId', () => {
  test('accept deliveryOptionId', () => {
    const deliveryOptions: deliveryOptionId[] = ['1', '2', '3'];
    for (const deliveryOption of deliveryOptions) {
      expect(() => isDeliveryOptionId(deliveryOption)).not.toThrow();
    }
  });
  test('reject not deliveryOptionId', () => {
    expect(() => isDeliveryOptionId('4')).toThrow();
  });
});
