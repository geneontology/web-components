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

export function normalizeRibbonSubjectIdForUrl(
  subjectId: string,
  baseURL?: string,
): string {
  // AmiGO's bioentity URL scheme expects <db>:<curie>, so mouse genes need
  // an extra "MGI:" prepended (e.g. MGI:107461 -> /gene_product/MGI:MGI:107461).
  // Only apply when targeting AmiGO; other consumers (e.g. Alliance) use the
  // bare CURIE.
  if (
    baseURL?.includes("amigo.geneontology.org") &&
    subjectId.startsWith("MGI:")
  ) {
    return "MGI:" + subjectId;
  }

  return subjectId;
}
