import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router";
import {
  EMPTY_HYPOTHESIS_DRAFT,
  readStoredHypothesis,
  readStoredNotes,
  readStoredReviews,
  writeStoredNotes,
  writeStoredReviews,
} from "../../storage.ts";
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
  // The case data as loaded from the JSON files, once; never changed afterwards.
  // null = not loaded yet.
  const [data, setData] = useState<CaseData | null>(null);
  // Review status / relevance changed by the user, per evidence id, saved in
  // localStorage. The single source for these changes (see caseData below).
  const [reviews, setReviews] = useState(readStoredReviews);
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
  // Records a status/relevance change for one item (new objects, never
  // `ev.status = …`) and saves it, so it survives a reload.
  function updateEvidence(evidenceId: string, changes: Partial<Pick<Evidence, "status" | "relevance">>) {
    const nextReviews = { ...reviews, [evidenceId]: { ...reviews[evidenceId], ...changes } };
    setReviews(nextReviews);
    writeStoredReviews(nextReviews);
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
    // What every page sees: the loaded evidence with the user's review changes
    // applied. Derived on every render, never stored.
    const caseData: CaseData = {
      ...data,
      evidence: data.evidence.map((ev) => ({ ...ev, ...reviews[ev.id] })),
    };

    // React Router renders the element of the first route whose path
    // matches the URL; "*" matches everything that is left.
    content = (
      <Routes>
        <Route path="/" element={<DashboardPage data={caseData} />} />
        <Route
          path="/evidence"
          element={
            <EvidencePage data={caseData} onUpdateEvidence={updateEvidence} notes={notes} onSaveNote={saveNote} />
          }
        />
        <Route path="/team" element={<Navigate to="/team/people" replace />} />
        <Route path="/team/people" element={<PeoplePage data={caseData} tab="people" />} />
        <Route path="/team/people/:personId" element={<PersonDetailPage data={caseData} />} />
        <Route path="/team/locations" element={<PeoplePage data={caseData} tab="locations" />} />
        <Route path="/timeline" element={<TimelinePage data={caseData} />} />
        <Route
          path="/workspace"
          element={
            <WorkspacePage
              data={caseData}
              notes={notes}
              hypothesisDraft={hypothesisDraft}
              onHypothesisDraftChange={setHypothesisDraft}
            />
          }
        />
        {/* old vanilla links (index.html#people, #dashboard) whose React path differs */}
        <Route path="/people" element={<Navigate to="/team/people" replace />} />
        <Route path="/dashboard" element={<Navigate to="/" replace />} />
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
