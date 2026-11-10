import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router";
import { EMPTY_HYPOTHESIS_DRAFT, readStoredHypothesis, readStoredNotes, writeStoredNotes } from "../../storage.ts";
import type { Evidence } from "../../types.ts";
import { loadCaseData, type CaseData } from "../data/loadCaseData.ts";
import { BookmarksProvider } from "../data/BookmarksContext.tsx";
import { AppLayout } from "./AppLayout.tsx";
import { DashboardPage } from "../dashboard/DashboardPage.tsx";
import { PeoplePage } from "../people-locations/PeoplePage.tsx";
import { PersonDetailPage } from "../people-locations/PersonDetailPage.tsx";
import { TimelinePage } from "../timeline/TimelinePage.tsx";
import { EvidencePage } from "../evidence/EvidencePage.tsx";
import { WorkspacePage } from "../workspace/WorkspacePage.tsx";
import { NotFoundPage } from "./NotFoundPage.tsx";

export function App() {
  // The case data lives here, above all pages, so it is loaded once and
  // survives switching between pages. null = not loaded yet.
  const [data, setData] = useState<CaseData | null>(null);
  const [loadFailed, setLoadFailed] = useState(false);
  // evidence id -> note text; the single source for the Evidence detail and the Workspace list
  const [notes, setNotes] = useState(readStoredNotes);

  // The hypothesis form's current (possibly unsaved) input. Kept here, not in
  // the form, so it survives leaving and re-entering the Workspace.
  const [hypothesisDraft, setHypothesisDraft] = useState(() => readStoredHypothesis() ?? EMPTY_HYPOTHESIS_DRAFT);

  function saveNote(evidenceId: string, text: string) {
    const nextNotes = { ...notes, [evidenceId]: text };
    setNotes(nextNotes);
    writeStoredNotes(nextNotes);
  }
  // Review status and relevance are part of the case data, which App owns.
  // New objects instead of `ev.status = …`: a new evidence array with one
  // new evidence object, the others are reused unchanged. Like in the
  // vanilla app, the change is not saved (gone after a reload).
  function updateEvidence(evidenceId: string, changes: Partial<Pick<Evidence, "status" | "relevance">>) {
    if (data === null) return;
    setData({
      ...data,
      evidence: data.evidence.map((ev) => (ev.id === evidenceId ? { ...ev, ...changes } : ev)),
    });
  }

  // Runs once after the first render ([] = no dependencies).
  useEffect(() => {
    async function load() {
      try {
        setData(await loadCaseData());
      } catch (err) {
        console.error("Failed to load the case data", err);
        setLoadFailed(true);
      }
    }
    void load();
  }, []);

  let content;
  if (loadFailed) {
    content = <p>The case file could not be loaded. Please check your connection and reload the page.</p>;
  } else if (data === null) {
    content = (
      <div className="evidence-loading">
        <div className="spinner"></div>
        <p>Loading case file&hellip;</p>
      </div>
    );
  } else {
    // React Router renders the element of the first route whose path
    // matches the URL; "*" matches everything that is left.
    content = (
      <Routes>
        <Route path="/" element={<DashboardPage data={data} />} />
        <Route
          path="/evidence"
          element={<EvidencePage data={data} onUpdateEvidence={updateEvidence} notes={notes} onSaveNote={saveNote} />}
        />
        <Route path="/team" element={<Navigate to="/team/people" replace />} />
        <Route path="/team/people" element={<PeoplePage data={data} tab="people" />} />
        <Route path="/team/people/:personId" element={<PersonDetailPage data={data} />} />
        <Route path="/team/locations" element={<PeoplePage data={data} tab="locations" />} />
        <Route path="/timeline" element={<TimelinePage data={data} />} />
        <Route
          path="/workspace"
          element={
            <WorkspacePage
              data={data}
              notes={notes}
              hypothesisDraft={hypothesisDraft}
              onHypothesisDraftChange={setHypothesisDraft}
            />
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    );
  }

  // the bookmarks are provided to every page through context (see BookmarksContext.tsx)
  return (
    <BookmarksProvider>
      <AppLayout>{content}</AppLayout>
    </BookmarksProvider>
  );
}
