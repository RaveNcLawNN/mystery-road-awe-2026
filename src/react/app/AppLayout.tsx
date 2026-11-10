import type { ReactNode } from "react";
// importing the file lets Vite include it in the build and return its final URL
import logoUrl from "../../../assets/logo/logo.svg";
import { NavBar } from "./NavBar.tsx";

interface AppLayoutProps {
  // the current page (or the loading / error message)
  children: ReactNode;
}

// The frame around every page: header with navigation, main area, footer.
// It only arranges what it is given; it does not know about data or routing.
export function AppLayout({ children }: AppLayoutProps) {
  return (
    <>
      <header className="app-header">
        <div className="header-inner">
          <div className="brand">
            <img src={logoUrl} alt="Project ReMotion logo" className="brand-logo" />
            <div>
              <h1>Project ReMotion</h1>
              <p className="subtitle">Investigate the failure of an AI-assisted rehabilitation robot.</p>
            </div>
          </div>
          <NavBar />
        </div>
      </header>
      <main className="app-main">{children}</main>
      <footer className="app-footer">
        <p>
          Project ReMotion Investigation Portal &mdash; Research Center AI, Software and IT-Security of HCW (fictional
          case study)
        </p>
      </footer>
    </>
  );
}
