import { match, P } from "ts-pattern";
import { deliveryOptionId } from "../../data/deliveryOption";
import { Order } from "../../data/orders";

export function checkInstanceOf(
  variable: unknown,
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
  variable: unknown,
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
  variable: any | unknown,
  customMessage: string = "Error",
): asserts variable is deliveryOptionId {
  const result = match(variable)
    .returnType<boolean>()
    .with("1", () => true)
    .with("2", () => true)
    .with("3", () => true)
    .with(P._, () => false);
  if (!result) {
    throw new Error(`
    ${customMessage}:
    variable ${variable} is not deliveryOptionId
    `);
  }
}

export function isOrder(
  variable: any | unknown,
  customMessage: string = "Error",
): asserts variable is Order {
  const error = new Error(`
  ${customMessage}:
  variable ${variable} is not deliveryOptionId
  `);

  if (typeof variable.id !== "string") {
    throw error;
  } else if (typeof variable.orderTime !== "string") {
    throw error;
  } else if (typeof variable.totalCostCents !== "number") {
    throw error;
  } else if (!Array.isArray(variable.products)) {
    throw error;
  }
}
