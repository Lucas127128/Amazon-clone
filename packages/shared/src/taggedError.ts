import { Data } from 'effect';

export class UnexpectedError extends Data.TaggedError('UnexpectedError') {}
export class UnexpectedNetworkError extends Data.TaggedError(
  'UnexpectedNetworkError',
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

export class PriceCalculationError extends Data.TaggedError(
  'PriceCalculationError',
)<{ message: string; productId: string }> {
  constructor(productId: string, message = 'Fail to get matching product') {
    super({ message, productId });
  }
}
