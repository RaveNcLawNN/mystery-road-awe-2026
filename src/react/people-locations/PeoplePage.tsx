import type { CaseData } from "../data/loadCaseData.ts";
import { PersonCard } from "./PersonCard.tsx";
import { LocationCard } from "./LocationCard.tsx";

interface PeoplePageProps {
  data: CaseData;
}

// Both lists one below the other for now; the vanilla app's People/Locations
// tabs come back as two real routes (Exercise 4, Demo 8).
export function PeoplePage({ data }: PeoplePageProps) {
  return (
    <section>
      <h2>People &amp; Locations</h2>

      <h3>People</h3>
      <div className="people-grid">
        {data.people.map((person) => (
          <PersonCard
            key={person.id}
            person={person}
            evidenceCount={data.evidence.filter((ev) => ev.personIds.includes(person.id)).length}
          />
        ))}
      </div>

      <h3>Locations</h3>
      <div className="locations-grid">
        {data.locations.map((location) => (
          <LocationCard key={location.id} location={location} />
        ))}
      </div>
    </section>
  );
}
