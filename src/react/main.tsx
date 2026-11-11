// entry point of the app (index.html)

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
    {/* hash URLs (index.html#/team/people) need no server fallback (GitHub Pages, dev server) */}
    <HashRouter>
      <App />
    </HashRouter>
  </StrictMode>,
);
