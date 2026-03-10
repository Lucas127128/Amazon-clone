import {
  DeliveryOptionId,
  DeliveryOptionIdSchema,
} from '#root/shared/src/schema.ts';
import { is } from 'valibot';

export function checkTruthy(
  variable: any,
  customMessage: string = 'Error',
): asserts variable {
  if (!variable)
    throw new Error(`${customMessage}: The value of ${variable} is falsy`);
}

export function isDeliveryOptionId(
  variable: any,
  customMessage: string = 'Error',
): asserts variable is DeliveryOptionId {
  if (!is(DeliveryOptionIdSchema, variable))
    throw new Error(
      `${customMessage}: variable ${variable} is not deliveryOptionId`,
    );
}

export function isHTMLInputElement(
  variable: any,
  customMessage: string = 'Error',
): asserts variable is HTMLInputElement {
  if (!(variable instanceof HTMLInputElement))
    throw new Error(
      `${customMessage}: variable ${variable} is not HTMLInputElement`,
    );
}
