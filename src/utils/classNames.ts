/**
 * A utility function to conditionally join class names together
 * @param classes An array of class names that may include falsy values
 * @returns A string of joined class names with falsy values filtered out
 */
export function classNames(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
} 