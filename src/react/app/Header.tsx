import type { ReactNode } from "react";
// importing the file lets Vite include it in the build and return its final URL
import logoUrl from "../../../assets/logo/logo.svg";

interface HeaderProps {
  // rendered next to the branding (the navigation bar)
  children: ReactNode;
}

export function Header({ children }: HeaderProps) {
  return (
    <header className="app-header">
      <div className="header-inner">
        <div className="brand">
          <img src={logoUrl} alt="Project ReMotion logo" className="brand-logo" />
          <div>
            <h1>Project ReMotion</h1>
            <p className="subtitle">Investigate the failure of an AI-assisted rehabilitation robot.</p>
          </div>
        </div>
        {children}
      </div>
    </header>
  );
}
