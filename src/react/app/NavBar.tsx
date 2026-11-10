import { NavLink } from "react-router";

// also used by App for the document title
export const NAV_ITEMS: { to: string; label: string }[] = [
  { to: "/", label: "Dashboard" },
  { to: "/evidence", label: "Evidence" },
  // active for /team/people and /team/locations
  { to: "/team", label: "People & Locations" },
  { to: "/timeline", label: "Timeline" },
  { to: "/workspace", label: "Workspace" },
];

// NavLink knows the current URL itself and tells us whether it matches.
export function NavBar() {
  return (
    <nav className="main-nav" aria-label="Main navigation">
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          // "/" would match every URL; end = only the exact path counts
          end={item.to === "/"}
          className={({ isActive }) => (isActive ? "nav-btn active" : "nav-btn")}
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}
