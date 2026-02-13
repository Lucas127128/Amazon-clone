import { match } from 'ts-pattern';
import { deliveryOptionId } from '../../data/deliveryOption';

export function checkTruthy(
  variable: any,
  customMessage: string = 'Error',
): asserts variable {
  if (!variable) {
    throw new Error(`
    ${customMessage}:
    The value of ${variable} is falsy
    `);
  }
  return;
}

export function isDeliveryOptionId(
  variable: any,
  customMessage: string = 'Error',
): asserts variable is deliveryOptionId {
  match(variable)
    .with('1', () => true)
    .with('2', () => true)
    .with('3', () => true)
    .otherwise(() => {
      throw new Error(`
    ${customMessage}:
    variable ${variable} is not deliveryOptionId
    `);
    });
}

export function isHTMLInputElement(
  variable: any,
  customMessage: string = 'Error',
): asserts variable is HTMLInputElement {
  if (!(variable instanceof HTMLInputElement)) {
    throw new Error(`
    ${customMessage}:
    variable ${variable} is not deliveryOptionId
    `);
  }
}
