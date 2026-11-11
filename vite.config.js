import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import checker from "vite-plugin-checker";

export default defineConfig({
  plugins: [
    // JSX and Fast Refresh
    react(),
    // Vite does not report type errors; this shows tsc errors in the dev server
    checker({ typescript: true, enableBuild: false }),
  ],
  // relative URLs, so the build also works from a sub-path (GitHub Pages)
  base: "./",
  // copied as-is: data/*.json and images are loaded by URL at runtime
  publicDir: "public",
  // no SPA fallback: a missing data file must give 404, not index.html
  appType: "mpa",
  build: {
    // React app (index.html) and the old vanilla app (vanilla.html)
    rolldownOptions: {
      input: {
        main: "index.html",
        vanilla: "vanilla.html",
      },
    },
  },
  server: {
    port: 5173,
    strictPort: true,
  },
});
