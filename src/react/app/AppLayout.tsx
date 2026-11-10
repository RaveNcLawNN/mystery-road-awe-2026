import type { ReactNode } from "react";
import { Header } from "./Header.tsx";
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
      <Header>
        <NavBar />
      </Header>
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
