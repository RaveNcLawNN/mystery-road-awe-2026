import { useEffect, useState } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router";
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
import { NAV_ITEMS } from "./NavBar.tsx";
import { DashboardPage } from "../dashboard/DashboardPage.tsx";
import { PeoplePage } from "../people-locations/PeoplePage.tsx";
import { PersonDetailPage } from "../people-locations/PersonDetailPage.tsx";
import { TimelinePage } from "../timeline/TimelinePage.tsx";
import { EvidencePage } from "../evidence/EvidencePage.tsx";
import { WorkspacePage } from "../workspace/WorkspacePage.tsx";
import { NotFoundPage } from "./NotFoundPage.tsx";

export function App() {
  // loaded once from the JSON files; null = not loaded yet
  const [data, setData] = useState<CaseData | null>(null);
  // status / relevance changes by the user, saved in localStorage
  const [reviews, setReviews] = useState(readStoredReviews);
  const [loadFailed, setLoadFailed] = useState(false);
  // evidence id -> note text
  const [notes, setNotes] = useState(readStoredNotes);

  // kept here, not in the form, so unsaved input survives leaving the Workspace
  const [hypothesisDraft, setHypothesisDraft] = useState(() => readStoredHypothesis() ?? EMPTY_HYPOTHESIS_DRAFT);

  // e.g. "/team/people/P03" -> "People & Locations"
  const { pathname } = useLocation();
  const currentPage = NAV_ITEMS.find((item) => pathname === item.to || pathname.startsWith(item.to + "/"));
  const pageName = currentPage?.label ?? "Page not found";

  function saveNote(evidenceId: string, text: string) {
    const nextNotes = { ...notes, [evidenceId]: text };
    setNotes(nextNotes);
    writeStoredNotes(nextNotes);
  }

  // saves a status / relevance change, so it survives a reload
  function updateEvidence(evidenceId: string, changes: Partial<Pick<Evidence, "status" | "relevance">>) {
    const nextReviews = { ...reviews, [evidenceId]: { ...reviews[evidenceId], ...changes } };
    setReviews(nextReviews);
    writeStoredReviews(nextReviews);
  }

  // outside of what React renders, so set in an effect; runs again when pageName changes
  useEffect(() => {
    document.title = `${pageName} – Project ReMotion`;
  }, [pageName]);

  // [] = runs only once, after the first render
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
    // the loaded evidence with the user's review changes applied (derived, not stored)
    const caseData: CaseData = {
      ...data,
      evidence: data.evidence.map((ev) => ({ ...ev, ...reviews[ev.id] })),
    };

    // the first matching route is shown; "*" catches the rest
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

  return (
    <BookmarksProvider>
      <AppLayout>{content}</AppLayout>
    </BookmarksProvider>
  );
}
