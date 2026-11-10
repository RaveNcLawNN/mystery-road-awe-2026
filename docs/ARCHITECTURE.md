# Architecture

## Two pages: the React app and the previous vanilla app

| Page           | Entry point           | Code                                                                                                            |
| -------------- | --------------------- | --------------------------------------------------------------------------------------------------------------- |
| `index.html`   | `src/react/main.tsx`  | **the app** (React, all five views): everything in `src/react/`                                                 |
| `vanilla.html` | `src/vanilla/main.ts` | the previous vanilla TypeScript app, kept for comparison: everything in `src/vanilla/` (legacy, see its README) |

```
src/
├── react/          the app (index.html)
├── vanilla/        the previous vanilla app (vanilla.html) – legacy, nothing in react/ imports it
├── types.ts        ┐
├── validate.ts     │ shared by both: no UI, no app state
├── storage.ts      │ (domain types, JSON validation, localStorage read/write helpers,
└── utils/          ┘  fetchJson.ts, format.ts)
```

Checked by following the imports from each entry point: `src/react/main.tsx` reaches only `src/react/` and the five
shared modules; `src/vanilla/main.ts` reaches only `src/vanilla/` and the same five.

## Folder structure of the React version: by feature

```
src/react/
├── main.tsx               entry point: mounts <App /> into #root
├── app/                   the shell: App (data, loading/error, routes), AppLayout, NavBar,
│                          NotFoundPage
├── data/                  loadCaseData.ts: loads and validates the case files, the CaseData type
├── components/            UI pieces used by more than one feature: Badge, FilterSelect
├── dashboard/             DashboardPage + CaseSummary, HowToCard, StatCard, ReviewProgress, Panel,
│                          RecentEvidenceList, RecentTimelineList
├── people-locations/      PeoplePage, PersonDetailPage, PersonCard, LocationCard, BulletList
├── timeline/              TimelinePage, TimelineEventCard, TimelineFilters
├── evidence/              EvidencePage, EvidenceToolbar, EvidenceCard, EvidenceDetail
└── workspace/             WorkspacePage, HypothesisForm
```

One folder per feature (= one view of the app), plus `app/` for what surrounds all views, `components/` for UI pieces
several features use, and `data/` for the data access every feature depends on. All five views are in
React now.

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

## Rule: render, event handler or effect?

1. **Render only calculates.** The body of a component turns props, state and context into JSX. Values derived from
   them (`filterAndSortEvidence(...)`, the Dashboard counts) belong here. It changes nothing outside the component, so
   React may call it twice, or again at any time, with the same result.
2. **A change the user caused goes into the event handler**: set state, save to `localStorage` (`toggleBookmark`,
   `saveNote`, `updateEvidence`).
3. **Work that is needed because the component is on screen goes into an effect** (`useEffect`): loading the data,
   timers, listeners on `window`, the document title.

Test: "Would it matter if React called this function twice?" If yes, it does not belong in render.

The `useState(readStoredNotes)` initializers read `localStorage` during the first render. That is a read, done once,
and a second call gives the same value; a write would not be allowed there.

## Routing (React Router, hash URLs)

`main.tsx` wraps `App` in `<HashRouter>`; `App` declares the routes with `<Routes>`/`<Route>`.

| URL (`index.html#…`)      | Page                                                                        |
| ------------------------- | --------------------------------------------------------------------------- |
| `#/`                      | Dashboard                                                                   |
| `#/team`                  | redirects to `#/team/people`                                                |
| `#/team/people`           | People & Locations, People tab                                              |
| `#/team/people/:personId` | one person, e.g. `#/team/people/nova-byte`; unknown id → "Person not found" |
| `#/team/locations`        | People & Locations, Locations tab                                           |
| `#/timeline`              | Timeline                                                                    |
| `#/evidence`              | Evidence Catalogue                                                          |
| `#/workspace`             | Investigator Workspace                                                      |
| `#people`, `#dashboard`   | old vanilla links: redirect to `#/team/people` and `#/`                     |
| anything else             | "Page not found"                                                            |

Why `HashRouter` and not `BrowserRouter`: with real paths (`/team/people`) the server must answer every unknown path
with the app's HTML. GitHub Pages cannot do that for a project site, and the dev server runs with `appType: "mpa"`
(no SPA fallback, see `vite.config.js`). Hash URLs need no server support and are still real, bookmarkable addresses.
