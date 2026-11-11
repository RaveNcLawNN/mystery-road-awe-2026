import { Link, useSearchParams } from "react-router";
import type { Person } from "../../types.ts";
import type { CaseData } from "../data/loadCaseData.ts";
import { TimelineFilters } from "./TimelineFilters.tsx";
import { TimelineEventCard } from "./TimelineEventCard.tsx";

interface TimelinePageProps {
  data: CaseData;
}

export function TimelinePage({ data }: TimelinePageProps) {
  // ?person=… in the URL decides which events are shown ("" = all)
  const [searchParams] = useSearchParams();
  const personFilter = searchParams.get("person") ?? "";
  const filterPerson = data.people.find((person) => person.id === personFilter);

  // oldest first; sorts a copy, not the loaded array
  const events = [...data.timeline]
    .filter((evt) => personFilter === "" || evt.personIds.some((id) => id === personFilter))
    .sort((a, b) => Date.parse(a.time) - Date.parse(b.time));

  // "L01" -> "L01 - Robotics Lab"; unknown ids are shown as they are
  function locationNamesFor(locationIds: string[]): string[] {
    return locationIds.map((locationId) => {
      const location = data.locations.find((loc) => loc.id === locationId);
      return location ? location.id + " - " + location.name : locationId;
    });
  }

  // person ids -> Person records
  function peopleFor(personIds: string[]): Person[] {
    return data.people.filter((person) => personIds.includes(person.id));
  }

  return (
    <section>
      <h2>Investigation Timeline</h2>
      {/* key: a new ?person= recreates the dropdowns, so the selection follows the URL */}
      <TimelineFilters
        key={personFilter}
        people={data.people}
        locations={data.locations}
        events={data.timeline}
        selectedPersonId={personFilter}
      />
      {personFilter !== "" && (
        <p className="hint-text">
          Showing only events involving <strong>{filterPerson ? filterPerson.name : personFilter}</strong>.{" "}
          <Link to="/timeline">Show all events</Link>
        </p>
      )}
      <div className="timeline-container">
        {events.length === 0 ? (
          <p>No timeline events match the current filters.</p>
        ) : (
          events.map((event) => (
            <TimelineEventCard
              key={event.id}
              event={event}
              locationNames={locationNamesFor(event.locationIds)}
              people={peopleFor(event.personIds)}
            />
          ))
        )}
      </div>
    </section>
  );
}
