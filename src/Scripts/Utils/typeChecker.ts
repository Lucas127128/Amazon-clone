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
