import { useEffect, useState } from "react";
import { navigateTo } from "../navigation.ts";
import { Header } from "./components/Header.tsx";
import { NavBar } from "./components/NavBar.tsx";
import { DashboardPage } from "./pages/DashboardPage.tsx";
import { PlaceholderPage } from "./pages/PlaceholderPage.tsx";
import { NotFoundPage } from "./pages/NotFoundPage.tsx";

// "#evidence" -> "evidence"; no hash at all -> "dashboard"
function readRouteFromHash(): string {
  return window.location.hash.slice(1) || "dashboard";
}

function renderPage(route: string) {
  switch (route) {
    case "dashboard":
      return <DashboardPage />;
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

  useEffect(() => {
    const handleHashChange = () => setRoute(readRouteFromHash());
    window.addEventListener("hashchange", handleHashChange);
    // cleanup: remove the listener when App is removed from the page
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  return (
    <>
      <Header>
        <NavBar currentRoute={route} onNavigate={navigateTo} />
      </Header>
      <main className="app-main">{renderPage(route)}</main>
      <footer className="app-footer">
        <p>
          Project ReMotion Investigation Portal &mdash; Research Center AI, Software and IT-Security of HCW (fictional
          case study)
        </p>
      </footer>
    </>
  );
}
