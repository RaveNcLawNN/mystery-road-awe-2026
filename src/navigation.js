// ---------------------------------------------------------------------
// NAVIGATION
// ---------------------------------------------------------------------
// Kept separate from router.js so views can navigate without importing
// the router, which itself imports every view.

export function navigateTo(viewName) {
  window.location.hash = viewName;
  // handleHashChange() will pick this up via the hashchange listener
}
