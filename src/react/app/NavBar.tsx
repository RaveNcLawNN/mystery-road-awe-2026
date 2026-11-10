import type { ViewName } from "../../navigation.ts";

const NAV_ITEMS: { view: ViewName; label: string }[] = [
  { view: "dashboard", label: "Dashboard" },
  { view: "evidence", label: "Evidence" },
  { view: "people", label: "People & Locations" },
  { view: "timeline", label: "Timeline" },
  { view: "workspace", label: "Workspace" },
];

interface NavBarProps {
  // the route from the URL hash; may be an unknown view (then no button is active)
  currentRoute: string;
  onNavigate: (view: ViewName) => void;
}

export function NavBar({ currentRoute, onNavigate }: NavBarProps) {
  return (
    <nav className="main-nav" aria-label="Main navigation">
      {NAV_ITEMS.map((item) => (
        <button
          key={item.view}
          type="button"
          className={item.view === currentRoute ? "nav-btn active" : "nav-btn"}
          onClick={() => onNavigate(item.view)}
        >
          {item.label}
        </button>
      ))}
    </nav>
  );
}
