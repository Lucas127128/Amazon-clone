import { match } from "ts-pattern";
import { deliveryOptionId } from "../../data/deliveryOption";

export function checkInstanceOf(
  variable: any,
  expectInstance: any,
  customMessage: string = "Error",
): asserts variable {
  if (!(variable instanceof expectInstance)) {
    throw new Error(`
    ${customMessage}: 
    Expect ${variable} is ${expectInstance} but it is not
    `);
  }
}

export function checkTruthy(
  variable: any,
  customMessage: string = "Error",
): asserts variable {
  if (!variable) {
    throw new Error(`
    ${customMessage}:
    The value of ${variable} is falsy
    `);
  }
  return;
}

export function checkManyTruthy(
  variables: any[],
  customMessage: string = "Error",
): asserts variables {
  variables.forEach((variable) => {
    if (!variable) {
      throw new Error(`
    ${customMessage}:
    The value of ${variable} is falsy
    `);
    }
  });
}

export function isDeliveryOptionId(
  variable: any,
  customMessage: string = "Error",
): asserts variable is deliveryOptionId {
  match(variable)
    .with("1", () => true)
    .with("2", () => true)
    .with("3", () => true)
    .otherwise(() => {
      throw new Error(`
    ${customMessage}:
    variable ${variable} is not deliveryOptionId
    `);
    });
}
