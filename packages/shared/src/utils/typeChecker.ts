export function checkNullish<T extends unknown>(
  variable: T,
  customMessage: string = 'Error',
): asserts variable is NonNullable<T> {
  if (variable == null)
    throw new Error(
      `${customMessage}: The value of ${typeof variable} is falsy`,
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

export function isHTMLElement(
  variable: any,
  variableName: string,
): asserts variable is HTMLElement {
  if (!(variable instanceof HTMLElement)) {
    throw new Error(
      `Error: variable ${variableName} is not HTMLInputElement`,
    );
  }
}
