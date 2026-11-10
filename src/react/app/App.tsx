import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router";
import { readStoredBookmarks, writeStoredBookmarks } from "../../storage.ts";
import { loadCaseData, type CaseData } from "../data/loadCaseData.ts";
import { toggleId } from "../data/toggleId.ts";
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
  // The one source of truth for bookmarks: the Dashboard count, the Evidence
  // stars and the Workspace list are all derived from this array.
  // readonly: push/splice are a type error, so it can only be replaced.
  const [bookmarks, setBookmarks] = useState<readonly string[]>(readStoredBookmarks);

  function toggleBookmark(evidenceId: string) {
    const nextBookmarks = toggleId(bookmarks, evidenceId);
    setBookmarks(nextBookmarks);
    writeStoredBookmarks(nextBookmarks);
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
        <Route path="/" element={<DashboardPage data={data} bookmarks={bookmarks} />} />
        <Route
          path="/evidence"
          element={<EvidencePage data={data} bookmarks={bookmarks} onToggleBookmark={toggleBookmark} />}
        />
        <Route path="/team" element={<Navigate to="/team/people" replace />} />
        <Route path="/team/people" element={<PeoplePage data={data} tab="people" />} />
        <Route path="/team/people/:personId" element={<PersonDetailPage data={data} />} />
        <Route path="/team/locations" element={<PeoplePage data={data} tab="locations" />} />
        <Route path="/timeline" element={<TimelinePage data={data} />} />
        <Route path="/workspace" element={<WorkspacePage data={data} bookmarks={bookmarks} />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    );
  }

  return <AppLayout>{content}</AppLayout>;
}
