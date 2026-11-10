// ---------------------------------------------------------------------
// ENTRY POINT of the React version (react.html)
// ---------------------------------------------------------------------

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.tsx";

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error('Element "#root" not found in react.html');
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
