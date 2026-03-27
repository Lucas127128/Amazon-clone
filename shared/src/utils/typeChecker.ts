export function checkNullish(
  variable: any,
  customMessage: string = 'Error',
): asserts variable {
  if (variable === undefined || variable === null)
    throw new Error(`${customMessage}: The value of ${variable} is falsy`);
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
