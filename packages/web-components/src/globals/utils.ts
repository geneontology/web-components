export function sameArray<T = never>(
  array1: T[],
  array2: T[],
  eqFn?: (a: T, b: T) => boolean,
): boolean {
  if (!eqFn) {
    eqFn = (a, b) => a === b;
  }

  if (array1.length !== array2.length) {
    return false;
  }

  for (let i = 0; i < array1.length; i++) {
    if (!eqFn(array1[i], array2[i])) {
      return false;
    }
  }
  return true;
}
