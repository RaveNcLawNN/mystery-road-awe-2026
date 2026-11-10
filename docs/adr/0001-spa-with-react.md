# ADR 0001: Keep the app a single-page application and build it with React

- **Status:** accepted; implemented (Exercise 5: all five views in React, `index.html` is the React app, the vanilla app
  remains at `vanilla.html`)
- **Date:** 2026-11-10
- **Context of the decision:** Exercise 3 (React migration of the shell and the Dashboard)

## Context

What the app is and does, as far as it matters for the architecture:

- **A personal investigation tool,** not a public website. One person reviews a fixed case: 18 evidence items, 6
  people, 6 locations, 15 timeline events.
- **No backend.** The data is five static JSON files (~28 kB together), hosted on GitHub Pages. Everything the user
  creates (bookmarks, notes, hypothesis draft) is stored in their own browser (`localStorage`).
- **Highly interactive:** search, six filters and sorting in the Evidence view, four filters in the Timeline, bookmark
  toggles, review status and relevance changes, notes, a hypothesis form.
- **Views share state:** a status change in the Evidence view must show up in the Dashboard's counts; bookmarks appear in
  Evidence, Workspace and the Dashboard.
- **It already is an SPA** (one `index.html`, hash routing, views shown and hidden by JavaScript), but written by hand.
  That caused real bugs in Exercises 1 and 2: views that showed stale numbers because of a manual "already rendered" flag
  (`viewRendered`), views that had to be re-rendered by hand after a change (`renderEvidenceList()` after a status
  change), and XSS risks from building HTML strings for `innerHTML`.

## Decision

1. **Stay a single-page application** (client-side rendering, all data loaded once, views switched without a page load).
2. **Build the UI with React + TypeScript,** migrated step by step: the React version grows in `react.html` next to the
   vanilla app until it can replace it.

## Why

**SPA:**

- All the state is **on the client** (`localStorage`). A server-rendered app would need a server that knows the user's
  bookmarks and notes, i.e. accounts and a database. That is a lot of new infrastructure for a single-user tool.
- The data is **small and static**. Loading it once and then filtering in the browser is instant; a server round trip
  per filter change would be slower.
- Switching views keeps the in-memory state (open filters, the open evidence item) without extra work.
- It stays **static hosting** (GitHub Pages, no server to run or pay for).

**React:**

- **The UI is calculated from the state** (`UI = f(state)`). When a status changes, every component that shows it
  re-renders. This removes exactly the bug class of the vanilla app: no forgotten manual re-render, no stale
  "already rendered" flag.
- **Components** replace the copied HTML strings (e.g. the badge markup written six times, see
  `docs/component-hierarchy.md`).
- **JSX escapes text by default,** so the `innerHTML` XSS problem disappears without having to remember it each time.
- **TypeScript support** for props and state, which fits the strict TypeScript setup from Exercise 2.
- Widely used, well documented, good developer tools. Also: it is the library this course teaches.

## Alternatives considered

| Alternative                                                      | Why not (for this app)                                                                                                                                      |
| ---------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Server-rendered multi-page app** (e.g. PHP, Express templates) | needs a server and a database for the per-user data; every filter change or view switch is a page load; no benefit from SEO, because the app is not public. |
| **Static multi-page site** (one HTML file per view)              | possible, but shared state (bookmarks, status changes) would have to be saved and re-read on every page load, and filters reset on every switch.            |
| **Keep vanilla TypeScript, add a small router library**          | smallest bundle, but the main problem stays: updating the DOM by hand after every state change, which is where the bugs came from.                          |
| **A lighter library** (Preact, Svelte, Lit)                      | much smaller (Preact: same API in ~4 kB), a real option. React wins on documentation, ecosystem and being the course's subject, not on technical need.      |

## Consequences

**Positive**

- Fewer state bugs: the UI cannot get out of sync with the data as easily.
- Reusable, typed components; less duplicated markup.
- Safer by default (no `innerHTML`).

**Negative (honest trade-offs)**

- **Bigger download:** the JavaScript grows from **24 kB to ~219 kB** (gzip: ~7 kB to ~68 kB), almost all of it React
  itself. For an app with 28 kB of data, the library is larger than the content.
- **Nothing works without JavaScript,** and the first paint waits for the bundle to load and run (also true for the
  vanilla app, but now more code has to run first).
- **More tooling and concepts:** build step, JSX, hooks, re-render rules. More to learn and more that can go wrong than
  plain DOM code.
- **Migration cost:** two versions exist side by side until Exercise 5, and the work does not add any feature for the
  user.
- **Honestly, React is more than this app needs.** Five views and ~50 records could be handled with less. The decision is
  justified by maintainability and by the learning goal, not because the app could not work without it.
- Things an SPA has to do itself remain: back button and deep links (hash routing), and in-memory state is lost on
  reload unless saved.

## When to revisit

- If the app must run well on **very low-end devices or poor connections** (see CHANGES.md, Demo 8): prefer a lighter
  library (Preact) or pre-rendered static HTML.
- If it gets **multiple users** with shared data: a backend becomes necessary anyway, and server rendering becomes a
  real option.
