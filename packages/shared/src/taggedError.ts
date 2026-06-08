import { Data } from 'effect';

import type { ElysiaValidationError } from './schema.ts';

export class UnexpectedError extends Data.TaggedError('UnexpectedError') {}
export class UnexpectedNetworkError extends Data.TaggedError(
  'UnexpectedNetworkError',
) {}
export class CreateTrustedHTMLError extends Data.TaggedError(
  'CreateTrustedHTMLError',
) {}
export class JsonParseError extends Data.TaggedError('JsonParseError')<{
  message: string;
}> {
  constructor(message: string) {
    super({ message });
  }
}
export class ValidationError extends Data.TaggedError('ValidationError')<{
  expected: string | null;
  received: string | null;
  message: string;
}> {
  constructor({
    expected,
    received,
    message,
  }: {
    expected: string | null;
    received: string | null;
    message: string;
  }) {
    super({ expected, received, message });
  }
}
export class EdenTreatyValidationError extends Data.TaggedError(
  'EdenTreatyValidationError',
)<ElysiaValidationError['value']> {
  constructor(params: Omit<ElysiaValidationError['value'], 'type'>) {
    super({
      ...params,
      type: 'validation',
    });
  }
}

export class ProductApiNotFoundError extends Data.TaggedError(
  'ProductApiNotFoundError',
)<{ message: string }> {
  constructor(message: string) {
    super({ message });
  }
}

export class URLParamsError extends Data.TaggedError('URLParamsError')<{
  urlParam: string;
  issue: 'missing' | 'invalid';
}> {
  constructor(urlParam: string, issue: 'missing' | 'invalid') {
    super({ urlParam, issue });
  }
}

export class LocalStorageError extends Data.TaggedError(
  'LocalStorageError',
)<{
  key: string;
  issue: 'missing';
}> {
  constructor(key: string, issue: 'missing') {
    super({ key, issue });
  }
}

export class MatchingOrderError extends Data.TaggedError(
  'MatchingOrderError',
)<{
  orderId: string;
}> {
  constructor(orderId: string) {
    super({ orderId });
  }
}

export class MatchingCartError extends Data.TaggedError(
  'MatchingCartError',
)<{
  productId: string;
}> {
  constructor(productId: string) {
    super({ productId });
  }
}
export class HTMLSelectionError extends Data.TaggedError(
  'HTMLSelectionError',
)<{
  querySelector: string;
}> {
  constructor(querySelector: string) {
    super({ querySelector });
  }
}

export class PriceCalculationError extends Data.TaggedError(
  'PriceCalculationError',
)<{ message: string; productId: string }> {
  constructor(productId: string, message = 'Fail to get matching product') {
    super({ message, productId });
  }
}
