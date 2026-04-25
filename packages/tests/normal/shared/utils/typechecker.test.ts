import {
  checkNullish,
  isHTMLElement,
  isHTMLInputElement,
} from 'shared/typeChecker';
import { describe, expect, test } from 'vitest';

describe.concurrent('checkNullish', () => {
  describe('accept truthy and reject nullish', () => {
    test('accept truthy', () => {
      expect(() => checkNullish(1)).not.toThrow();
      expect(() => checkNullish('foo')).not.toThrow();
    });
    test('accept falsy', () => {
      expect(() => checkNullish('')).not.toThrow();
      expect(() => checkNullish(0)).not.toThrow();
    });
    test('reject nullish', () => {
      expect(() => checkNullish(null)).toThrow(
        'Error: The value of null is falsy',
      );
      expect(() => checkNullish(undefined)).toThrow(
        'Error: The value of undefined is falsy',
      );
    });
  });

  describe('throw custom message', () => {
    test('throw custom message when falsy', () => {
      expect(() => checkNullish(undefined, 'success throw')).toThrow(
        `success throw: The value of undefined is falsy`,
      );
    });
    test('throw default error', () => {
      expect(() => checkNullish(undefined)).toThrow(
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
    expect(() => isHTMLInputElement(divElement)).toThrow(
      'Error: variable <div></div> is not HTMLInputElement',
    );
  });
});

describe.concurrent('isHTMLElement', () => {
  test('accept HTMLElement', () => {
    const htmlElement = document.createElement('div');
    expect(() => isHTMLElement(htmlElement, 'htmlElement')).not.toThrow();
  });
  test('reject event target', () => {
    const eventTarget = new EventTarget();
    expect(() => isHTMLElement(eventTarget, 'eventTarget')).toThrow(
      'Error: variable eventTarget is not HTMLElement',
    );
  });
});
