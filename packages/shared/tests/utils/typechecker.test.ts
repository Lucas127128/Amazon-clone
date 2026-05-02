import {
  checkNullish,
  isHTMLElement,
  isHTMLInputElement,
} from 'shared/typeChecker';
import { describe, expect, it } from 'vitest';

describe.concurrent('checkNullish', () => {
  describe('accept truthy and reject nullish', () => {
    it('accept truthy', () => {
      expect(() => checkNullish(1)).not.toThrow();
      expect(() => checkNullish('foo')).not.toThrow();
    });
    it('accept falsy', () => {
      expect(() => checkNullish('')).not.toThrow();
      expect(() => checkNullish(0)).not.toThrow();
    });
    it('reject nullish', () => {
      expect(() => checkNullish(null)).toThrow(
        'Error: The value of null is falsy',
      );
      expect(() => checkNullish(undefined)).toThrow(
        'Error: The value of undefined is falsy',
      );
    });
  });

  describe('throw custom message', () => {
    it('throw custom message when falsy', () => {
      expect(() => checkNullish(undefined, 'success throw')).toThrow(
        `success throw: The value of undefined is falsy`,
      );
    });
    it('throw default error', () => {
      expect(() => checkNullish(undefined)).toThrow(
        'Error: The value of undefined is falsy',
      );
    });
  });
});

describe.concurrent('isHTMLInputElement', () => {
  it('accept HTMLInputElement', () => {
    const inputElement = document.createElement('input');
    expect(() => isHTMLInputElement(inputElement)).not.toThrow();
  });
  it('reject other html element', () => {
    const divElement = document.createElement('div');
    expect(() => isHTMLInputElement(divElement)).toThrow(
      'Error: variable <div></div> is not HTMLInputElement',
    );
  });
});

describe.concurrent('isHTMLElement', () => {
  it('accept HTMLElement', () => {
    const htmlElement = document.createElement('div');
    expect(() => isHTMLElement(htmlElement, 'htmlElement')).not.toThrow();
  });
  it('reject event target', () => {
    const eventTarget = new EventTarget();
    expect(() => isHTMLElement(eventTarget, 'eventTarget')).toThrow(
      'Error: variable eventTarget is not HTMLElement',
    );
  });
});
