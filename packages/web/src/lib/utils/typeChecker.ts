export function checkNullish<T extends unknown>(
  variable: T,
  customMessage: string = 'Error',
): asserts variable is NonNullable<T> {
  if (variable == null)
    throw new Error(
      `${customMessage}: The value of ${variable as string} is falsy`,
    );
}
