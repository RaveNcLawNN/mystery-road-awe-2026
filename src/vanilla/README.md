# Vanilla app (legacy, not used by the React app)

This folder is the **previous vanilla TypeScript version** of the portal (Exercises 1–2). It is served only at
`vanilla.html` and kept for comparison in presentations. **The app is the React version** in `src/react/`
(`index.html`).

- Nothing in `src/react/` imports from this folder.
- This folder uses the shared, UI-free modules one level up: `../types.ts`, `../validate.ts`, `../storage.ts`,
  `../utils/format.ts`, `../utils/fetchJson.ts`.
- `vanillaStorage.ts` connects the plain helpers in `../storage.ts` to this app's shared state (`state.ts`).

To remove the vanilla version completely: delete this folder and `vanilla.html`, and remove the `vanilla` entry from
`build.rolldownOptions.input` in `vite.config.js`.
