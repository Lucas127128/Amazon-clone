import { checkNullish, isHTMLInputElement } from 'shared/typeChecker';
import { describe, expect, test } from 'bun:test';

describe.concurrent('checkNullish', () => {
  describe('accept truthy and reject falsy', () => {
    test('accept truthy', () => {
      expect(() => checkNullish(1)).not.toThrow();
      expect(() => checkNullish('foo')).not.toThrow();
    });
    test('accept falsy', () => {
      expect(() => checkNullish('')).not.toThrow();
      expect(() => checkNullish(0)).not.toThrow();
    });
    test('reject nullish', () => {
      expect(() => checkNullish(null)).toThrow();
      expect(() => checkNullish(undefined)).toThrow();
    });
  });

  describe('throw custom message', () => {
    test('throw custom message when falsy', () => {
      expect(() => checkNullish(undefined, 'success throw')).toThrow(
        `success throw: The value of undefined is falsy`,
      );
    });
    test('throw default error', () => {
      expect(() => checkNullish(undefined)).toThrowError(
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
    const divElement = document.createElement('div');
    expect(() => isHTMLInputElement(divElement)).toThrow();
  });
});
