import { describe, expect, it } from 'vitest';

import { checkNullish } from '#lib/utils/typeChecker.ts';

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
