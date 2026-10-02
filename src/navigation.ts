// ---------------------------------------------------------------------
// NAVIGATION
// ---------------------------------------------------------------------
// Kept separate from router.js so views can navigate without importing
// the router, which itself imports every view.

// one per <section id="view-…"> in index.html
export type ViewName = "dashboard" | "evidence" | "people" | "timeline" | "workspace";

export function navigateTo(viewName: ViewName): void {
  window.location.hash = viewName;
  // handleHashChange() will pick this up via the hashchange listener
}
