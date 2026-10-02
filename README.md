# Project ReMotion – Investigation Portal

Investigate the failure of an AI-assisted rehabilitation robot.

## About

Project ReMotion is a browser-based investigation platform built around a fictional incident.
During a pre-demonstration calibration test, the AI-assisted rehabilitation robot **ReMotion**
loaded the wrong calibration profile and triggered its emergency stop. This application lets an
investigator review the evidence, people, locations, and timeline surrounding the incident, and
build up a working hypothesis about what happened.

This repository contains an existing vanilla-JavaScript (no frameworks used) investigation application. The system is
functional but has accumulated technical debt and inconsistent implementation decisions. Your task
during the course will be to analyse, maintain, refactor, migrate, and extend it.

## Running the application

The project is built and served with [Vite](https://vite.dev/). You need Node.js
`^20.19.0 || >=22.12.0` (see `engines` in `package.json`).

```bash
npm ci        # install the exact dependency versions from package-lock.json
npm run dev   # start the Vite dev server with hot module replacement
```

Then open `http://localhost:5173`. Type errors are reported in the terminal and as an overlay in
the browser while the dev server runs.

For a production build:

```bash
npm run build     # type-check, then bundle + minify into dist/ (fails on type errors)
npm run preview   # serve dist/ locally on http://localhost:4173
```

Checks:

```bash
npm run typecheck      # tsc, no output files
npm run lint           # ESLint (lint:fix applies safe fixes)
npm run format:check   # Prettier (format rewrites files)
```

Opening `index.html` directly from the filesystem (`file://`) does not work: the app loads its case
data with `fetch()` and is made of ES modules, and both need HTTP. A plain static file server on the
project root no longer works either, because the runtime files live in `public/` (see below).

### Project layout

- `index.html`: entry page, loads `src/main.ts`
- `src/`: application code, TypeScript ES modules (`types.ts`: the data model, `validate.ts`:
  runtime checks of the JSON files, `views/`: one module per view)
- `tsconfig.json`: TypeScript settings (type-checking only, Vite does the compiling)
- `styles.css`, `assets/logo/`: processed by Vite
- `public/data/*.json`, `public/assets/people/*.png`: copied as-is and served from the site root,
  because they are loaded by URL at runtime

## Features

- **Dashboard** — case summary and key statistics calculated from the loaded case data.
- **Evidence catalogue** — search, filter (by type, person, location, status, relevance), sort,
  bookmark, and open detailed evidence records.
- **People & Locations** — profile cards for the investigation team and the six key locations.
- **Timeline** — chronological view of case events with filtering and links to related evidence.
- **Investigator workspace** — bookmarked evidence, personal notes, and a hypothesis draft form.
  Workspace data is saved to your browser's local storage and will still be there when you reload
  the page.

## Browser requirements

A recent version of any evergreen desktop browser (Chrome, Firefox, Edge, Safari). JavaScript must
be enabled. The layout targets common desktop and tablet widths.

## Project status

This is an existing brownfield application, not a fresh scaffold. It works for everyday use, but
you should expect to find rough edges, inconsistent patterns, and a handful of bugs as you work
with it — that discovery process is part of the course.
