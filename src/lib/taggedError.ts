import { Data } from 'effect';

export class UnexpectedError extends Data.TaggedError('UnexpectedError') {}

export class PriceCalculationError extends Data.TaggedError(
  'PriceCalculationError',
)<{ message: string; productId: string }> {
  constructor(productId: string, message = 'Fail to get matching product') {
    super({ message, productId });
  }
}
