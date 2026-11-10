// Returns a NEW list with the id added (if missing) or removed (if present).
// The list it gets is never changed: React only re-renders when setState
// receives a different array, and older renders may still use the old one.
export function toggleId(ids: readonly string[], id: string): string[] {
  return ids.includes(id) ? ids.filter((existing) => existing !== id) : [...ids, id];
}
