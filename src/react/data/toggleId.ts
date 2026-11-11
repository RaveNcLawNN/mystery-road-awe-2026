// Returns a NEW list with the id added or removed. The given list is not
// changed, because React only re-renders when it gets a different array.
export function toggleId(ids: readonly string[], id: string): string[] {
  return ids.includes(id) ? ids.filter((existing) => existing !== id) : [...ids, id];
}
