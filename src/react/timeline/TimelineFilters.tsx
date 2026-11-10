import type { CaseLocation, Person, TimelineEvent } from "../../types.ts";
import { FilterSelect } from "../components/FilterSelect.tsx";

interface TimelineFiltersProps {
  people: Person[];
  locations: CaseLocation[];
  events: TimelineEvent[];
  // person id from the URL (?person=…), shown as the initial selection
  selectedPersonId: string;
}

// The toolbar with the same four dropdowns as the vanilla Timeline. They
// are visually complete but do not filter yet (Exercise 5).
export function TimelineFilters({ people, locations, events, selectedPersonId }: TimelineFiltersProps) {
  // every event type once, in order of first appearance
  const eventTypes = [...new Set(events.map((evt) => evt.type))];

  return (
    <div className="toolbar">
      <div className="toolbar-row">
        <FilterSelect
          id="timelineOrder"
          label="Order"
          options={[
            { value: "asc", label: "Oldest first" },
            { value: "desc", label: "Newest first" },
          ]}
        />
        <FilterSelect
          id="timelinePersonFilter"
          label="Filter by person"
          defaultValue={selectedPersonId}
          options={[
            { value: "", label: "All people" },
            ...people.map((person) => ({ value: person.id, label: person.name })),
          ]}
        />
        <FilterSelect
          id="timelineLocationFilter"
          label="Filter by location"
          options={[
            { value: "", label: "All locations" },
            ...locations.map((location) => ({ value: location.id, label: location.id })),
          ]}
        />
        <FilterSelect
          id="timelineTypeFilter"
          label="Filter by event type"
          options={[
            { value: "", label: "All event types" },
            ...eventTypes.map((type) => ({ value: type, label: type })),
          ]}
        />
      </div>
    </div>
  );
}
