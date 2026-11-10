# Architecture

## Two apps side by side (during the migration)

| Page         | Entry point          | Code                                                                           |
| ------------ | -------------------- | ------------------------------------------------------------------------------ |
| `index.html` | `src/main.ts`        | the vanilla TypeScript app: `src/views/`, `src/router.ts`, `src/state.ts`, ... |
| `react.html` | `src/react/main.tsx` | the React version: everything in `src/react/`                                  |

Modules that hold no UI and no app state are used by both: `src/types.ts` (domain types), `src/validate.ts` (checking
the JSON files), `src/utils/fetchJson.ts`, `src/utils/format.ts`, `src/storage.ts` (`readStoredBookmarks`). The React
code never imports a vanilla view or `src/state.ts` itself; `storage.ts` still imports `state.ts` for its vanilla
functions, so that module ends up in the React bundle unused. Navigation in React is done by React Router, not by
`src/navigation.ts`.

## Folder structure of the React version: by feature

```
src/react/
├── main.tsx               entry point: mounts <App /> into #root
├── app/                   the shell: App (data, loading/error, routes), AppLayout, NavBar,
│                          NotFoundPage, PlaceholderPage
├── data/                  loadCaseData.ts: loads and validates the case files, the CaseData type
├── components/            UI pieces used by more than one feature: Badge
├── dashboard/             DashboardPage + CaseSummary, HowToCard, StatCard, ReviewProgress, Panel,
│                          RecentEvidenceList, RecentTimelineList
├── people-locations/      PeoplePage, PersonDetailPage, PersonCard, LocationCard, BulletList
└── timeline/              TimelinePage, TimelineEventCard, TimelineFilters, FilterSelect
```

One folder per feature (= one view of the app), plus `app/` for what surrounds all views, `components/` for UI pieces
several features use, and `data/` for the data access every feature depends on. Evidence and Workspace get their own
folders when they are migrated.

## Rule: shared or feature-local?

1. **A component starts in the folder of the feature that needs it.**
2. **It moves to `components/` only when a second feature actually uses it**, and only if it knows nothing about either
   feature (generic props like `text`, `title`, `items`, `children`).
3. **Feature folders may import from `components/`, `data/` and `src/` (types, utils), but not from each other.** Only
   `app/` imports the feature pages, to route to them.

Examples:

- `Badge` is in `components/`: used by the dashboard (`CaseSummary`, `RecentEvidenceList`) and the timeline
  (`TimelineEventCard`), and it only knows `text` and `variant`.
- `PersonCard` is in `people-locations/`: only the People page uses it, and it is built around a `Person`.
- `StatCard` stays in `dashboard/` although it is generic: nothing else uses it yet. It moves when a second feature
  does.

## Routing (React Router, hash URLs)

`main.tsx` wraps `App` in `<HashRouter>`; `App` declares the routes with `<Routes>`/`<Route>`.

| URL (`react.html#…`)      | Page                                                                        |
| ------------------------- | --------------------------------------------------------------------------- |
| `#/`                      | Dashboard                                                                   |
| `#/team`                  | redirects to `#/team/people`                                                |
| `#/team/people`           | People & Locations, People tab                                              |
| `#/team/people/:personId` | one person, e.g. `#/team/people/nova-byte`; unknown id → "Person not found" |
| `#/team/locations`        | People & Locations, Locations tab                                           |
| `#/timeline`              | Timeline                                                                    |
| `#/evidence`              | placeholder (Exercise 5)                                                    |
| `#/workspace`             | placeholder (Exercise 5)                                                    |
| anything else             | "Page not found"                                                            |

Why `HashRouter` and not `BrowserRouter`: with real paths (`/team/people`) the server must answer every unknown path
with the app's HTML. GitHub Pages cannot do that for a project site, and the dev server runs with `appType: "mpa"`
(no SPA fallback, see `vite.config.js`). Hash URLs need no server support and are still real, bookmarkable addresses.
