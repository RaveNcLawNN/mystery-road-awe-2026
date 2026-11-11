import { NavLink } from "react-router";
import type { CaseData } from "../data/loadCaseData.ts";
import { PersonCard } from "./PersonCard.tsx";
import { LocationCard } from "./LocationCard.tsx";

interface PeoplePageProps {
  data: CaseData;
  // from the route (/team/people or /team/locations)
  tab: "people" | "locations";
}

function tabClass({ isActive }: { isActive: boolean }): string {
  return isActive ? "tab-btn active" : "tab-btn";
}

export function PeoplePage({ data, tab }: PeoplePageProps) {
  return (
    <section>
      <h2>People &amp; Locations</h2>

      {/* the tabs are links, so a tab change changes the URL */}
      <div className="tab-bar">
        <NavLink to="/team/people" className={tabClass}>
          People
        </NavLink>
        <NavLink to="/team/locations" className={tabClass}>
          Locations
        </NavLink>
      </div>

      {tab === "people" ? (
        <div className="people-grid">
          {data.people.map((person) => (
            <PersonCard
              key={person.id}
              person={person}
              evidenceCount={data.evidence.filter((ev) => ev.personIds.includes(person.id)).length}
            />
          ))}
        </div>
      ) : (
        <div className="locations-grid">
          {data.locations.map((location) => (
            <LocationCard key={location.id} location={location} />
          ))}
        </div>
      )}
    </section>
  );
}
