export function checkType(
  variable: any,
  expectType: any,
  customMessage: string = "Error",
): void {
  if (typeof variable !== expectType) {
    const actualType = typeof variable;
    throw new Error(`
    ${customMessage}: 
    Expect ${variable} is ${expectType} but get ${actualType}
    `);
  }
}

export function checkTruthy(
  variable: any | undefined | null,
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
