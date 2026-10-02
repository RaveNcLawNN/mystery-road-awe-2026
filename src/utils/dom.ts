// ---------------------------------------------------------------------
// DOM HELPERS
// ---------------------------------------------------------------------

// For elements the page always contains (index.html, or markup the view has
// just rendered). getElementById() returns HTMLElement | null and knows
// nothing about the element's kind; this checks both at runtime, so a
// renamed id or a changed tag fails here with a clear message instead of as
// "Cannot read properties of null" or a silently missing .value.
// Optional elements keep using getElementById() with an explicit null check.
export function getRequiredElement<T extends HTMLElement>(id: string, type: new () => T): T {
  const element = document.getElementById(id);
  if (!(element instanceof type)) {
    throw new Error(`#${id} is missing or not a ${type.name}`);
  }
  return element;
}
