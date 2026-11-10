import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router";
import { readStoredBookmarks } from "../../storage.ts";
import { loadCaseData, type CaseData } from "../data/loadCaseData.ts";
import { AppLayout } from "./AppLayout.tsx";
import { DashboardPage } from "../dashboard/DashboardPage.tsx";
import { PeoplePage } from "../people-locations/PeoplePage.tsx";
import { PersonDetailPage } from "../people-locations/PersonDetailPage.tsx";
import { TimelinePage } from "../timeline/TimelinePage.tsx";
import { PlaceholderPage } from "./PlaceholderPage.tsx";
import { NotFoundPage } from "./NotFoundPage.tsx";

export function App() {
  // The case data lives here, above all pages, so it is loaded once and
  // survives switching between pages. null = not loaded yet.
  const [data, setData] = useState<CaseData | null>(null);
  const [loadFailed, setLoadFailed] = useState(false);
  // nothing in the React version changes the bookmarks yet, so they are
  // simply read from localStorage (no state needed)
  const bookmarks = readStoredBookmarks();

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
        <Route path="/evidence" element={<PlaceholderPage title="Evidence Catalogue" />} />
        <Route path="/team" element={<Navigate to="/team/people" replace />} />
        <Route path="/team/people" element={<PeoplePage data={data} tab="people" />} />
        <Route path="/team/people/:personId" element={<PersonDetailPage data={data} />} />
        <Route path="/team/locations" element={<PeoplePage data={data} tab="locations" />} />
        <Route path="/timeline" element={<TimelinePage data={data} />} />
        <Route path="/workspace" element={<PlaceholderPage title="Investigator Workspace" />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    );
  }

  return <AppLayout>{content}</AppLayout>;
}
