// ---------------------------------------------------------------------
// NAVIGATION
// ---------------------------------------------------------------------
// Kept separate from router.ts so views can navigate without importing
// the router, which itself imports every view.

// one per <section id="view-…"> in index.html
export const VIEW_NAMES = ["dashboard", "evidence", "people", "timeline", "workspace"] as const;
export type ViewName = (typeof VIEW_NAMES)[number];

// for strings from outside the type system: the URL hash, data-view attributes
export function isViewName(value: string | undefined): value is ViewName {
  return VIEW_NAMES.some((name) => name === value);
}

export function navigateTo(viewName: ViewName): void {
  window.location.hash = viewName;
  // handleHashChange() will pick this up via the hashchange listener
}
