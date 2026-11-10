import type { Person } from "../../types.ts";
import type { CaseData } from "../data/loadCaseData.ts";
import { TimelineFilters } from "./TimelineFilters.tsx";
import { TimelineEventCard } from "./TimelineEventCard.tsx";

interface TimelinePageProps {
  data: CaseData;
}

export function TimelinePage({ data }: TimelinePageProps) {
  // oldest first, like the vanilla default; sort a copy, not the loaded array
  const events = [...data.timeline].sort((a, b) => Date.parse(a.time) - Date.parse(b.time));

  // "L01" -> "L01 - Robotics Lab"; unknown ids are shown as they are
  function locationNamesFor(locationIds: string[]): string[] {
    return locationIds.map((locationId) => {
      const location = data.locations.find((loc) => loc.id === locationId);
      return location ? location.id + " - " + location.name : locationId;
    });
  }

  // person ids -> Person records (ids are checked against people.json when loading)
  function peopleFor(personIds: string[]): Person[] {
    return data.people.filter((person) => personIds.includes(person.id));
  }

  return (
    <section>
      <h2>Investigation Timeline</h2>
      <TimelineFilters people={data.people} locations={data.locations} events={data.timeline} />
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
