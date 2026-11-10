import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import checker from "vite-plugin-checker";

export default defineConfig({
  plugins: [
    // Compiles JSX in .tsx files to react/jsx-runtime calls and enables
    // Fast Refresh (component edits keep their state in the dev server).
    react(),
    // Vite only strips types and never reports type errors. The checker runs
    // tsc in watch mode next to the dev server and shows errors in the
    // terminal and as a browser overlay. Builds are checked by the "build"
    // script (tsc && vite build) instead.
    checker({ typescript: true, enableBuild: false }),
  ],
  // Relative asset URLs, so the built app works from any sub-path
  // (e.g. a GitHub Pages project site), not only from the domain root.
  base: "./",
  // Copied as-is and served from the site root. The app fetches data/*.json
  // and loads assets/people/*.png by URL at runtime, so Vite cannot see
  // them as imports.
  publicDir: "public",
  // The app routes via #hash, so it needs no SPA history fallback. With the
  // default ("spa") a missing data file is answered with index.html and
  // status 200, which defeats the res.ok check in fetchJson.
  appType: "mpa",
  build: {
    // Two pages during the migration: the vanilla app stays at index.html,
    // the React version is built from react.html next to it.
    rolldownOptions: {
      input: {
        main: "index.html",
        react: "react.html",
      },
    },
  },
  server: {
    port: 5173,
    strictPort: true,
  },
});
