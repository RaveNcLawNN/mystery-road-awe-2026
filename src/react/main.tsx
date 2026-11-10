// ---------------------------------------------------------------------
// ENTRY POINT of the app (index.html)
// ---------------------------------------------------------------------

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router";
import { App } from "./app/App.tsx";

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error('Element "#root" not found in index.html');
}

createRoot(rootElement).render(
  <StrictMode>
    {/* The route lives in the URL hash (index.html#/team/people): works on
        GitHub Pages and the "mpa" dev server, which have no fallback for
        unknown paths like /team/people. */}
    <HashRouter>
      <App />
    </HashRouter>
  </StrictMode>,
);
