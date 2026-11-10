import { useEffect, useState } from "react";
import { navigateTo } from "../navigation.ts";
import { readStoredBookmarks } from "../storage.ts";
import { loadCaseData, type CaseData } from "./loadCaseData.ts";
import { Header } from "./components/Header.tsx";
import { NavBar } from "./components/NavBar.tsx";
import { DashboardPage } from "./pages/DashboardPage.tsx";
import { PlaceholderPage } from "./pages/PlaceholderPage.tsx";
import { NotFoundPage } from "./pages/NotFoundPage.tsx";

// "#evidence" -> "evidence"; no hash at all -> "dashboard"
function readRouteFromHash(): string {
  return window.location.hash.slice(1) || "dashboard";
}

function renderPage(route: string, data: CaseData, bookmarks: string[]) {
  switch (route) {
    case "dashboard":
      return <DashboardPage data={data} bookmarks={bookmarks} />;
    case "evidence":
      return <PlaceholderPage title="Evidence Catalogue" />;
    case "people":
      return <PlaceholderPage title="People & Locations" />;
    case "timeline":
      return <PlaceholderPage title="Investigation Timeline" />;
    case "workspace":
      return <PlaceholderPage title="Investigator Workspace" />;
    default:
      return <NotFoundPage route={route} onBackToDashboard={() => navigateTo("dashboard")} />;
  }
}

export function App() {
  // The URL hash is the source of truth, as in the vanilla app: the nav
  // buttons only change the hash, and this state follows it. That keeps
  // the back button and links like react.html#timeline working.
  const [route, setRoute] = useState(readRouteFromHash);

  // The case data lives here, above all pages, so it is loaded once and
  // survives switching between pages. null = not loaded yet.
  const [data, setData] = useState<CaseData | null>(null);
  const [loadFailed, setLoadFailed] = useState(false);
  // read once from localStorage; nothing in the React version changes them yet
  const [bookmarks] = useState(readStoredBookmarks);

  useEffect(() => {
    const handleHashChange = () => setRoute(readRouteFromHash());
    window.addEventListener("hashchange", handleHashChange);
    // cleanup: remove the listener when App is removed from the page
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

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
    content = renderPage(route, data, bookmarks);
  }

  return (
    <>
      <Header>
        <NavBar currentRoute={route} onNavigate={navigateTo} />
      </Header>
      <main className="app-main">{content}</main>
      <footer className="app-footer">
        <p>
          Project ReMotion Investigation Portal &mdash; Research Center AI, Software and IT-Security of HCW (fictional
          case study)
        </p>
      </footer>
    </>
  );
}
