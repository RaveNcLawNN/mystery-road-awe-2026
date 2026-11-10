import type { CaseData } from "../data/loadCaseData.ts";
import { FilterSelect } from "../components/FilterSelect.tsx";
import type { EvidenceFilters } from "./evidenceFilters.ts";

interface EvidenceToolbarProps {
  data: CaseData;
  filters: EvidenceFilters;
  // gets only the fields that changed, e.g. { status: "reviewed" }
  onFiltersChange: (changes: Partial<EvidenceFilters>) => void;
}

// Same controls as the vanilla toolbar, all controlled by the filters state.
export function EvidenceToolbar({ data, filters, onFiltersChange }: EvidenceToolbarProps) {
  // every type once, lowercased like the vanilla filter ("Test-Report" = "test-report")
  const types = [...new Set(data.evidence.map((ev) => ev.type.toLowerCase()))];

  return (
    <div className="toolbar">
      <div className="toolbar-row">
        <label htmlFor="evidenceSearch" className="visually-hidden">
          Search evidence
        </label>
        <input
          type="text"
          id="evidenceSearch"
          placeholder="Search evidence by title, summary, or tag…"
          autoComplete="off"
          // controlled: the box always shows the state, and every keystroke goes through the state
          value={filters.search}
          onChange={(event) => onFiltersChange({ search: event.target.value })}
        />
        <FilterSelect
          id="filterType"
          value={filters.type}
          onChange={(type) => onFiltersChange({ type })}
          label="Filter by type"
          options={[{ value: "", label: "All types" }, ...types.map((type) => ({ value: type, label: type }))]}
        />
        <FilterSelect
          id="filterPerson"
          value={filters.personId}
          onChange={(personId) => onFiltersChange({ personId })}
          label="Filter by person"
          options={[
            { value: "", label: "All people" },
            ...data.people.map((person) => ({ value: person.id, label: person.name })),
          ]}
        />
        <FilterSelect
          id="filterLocation"
          value={filters.locationId}
          onChange={(locationId) => onFiltersChange({ locationId })}
          label="Filter by location"
          options={[
            { value: "", label: "All locations" },
            ...data.locations.map((loc) => ({ value: loc.id, label: loc.id + " - " + loc.name })),
          ]}
        />
      </div>
      <div className="toolbar-row">
        <FilterSelect
          id="filterStatus"
          value={filters.status}
          onChange={(status) => onFiltersChange({ status })}
          label="Filter by status"
          options={[
            { value: "", label: "All statuses" },
            { value: "unreviewed", label: "Unreviewed" },
            { value: "reviewed", label: "Reviewed" },
            { value: "flagged", label: "Flagged" },
          ]}
        />
        <FilterSelect
          id="filterRelevance"
          value={filters.relevance}
          onChange={(relevance) => onFiltersChange({ relevance })}
          label="Filter by relevance"
          options={[
            { value: "", label: "All relevance" },
            { value: "unknown", label: "Unknown" },
            { value: "relevant", label: "Relevant" },
            { value: "irrelevant", label: "Irrelevant" },
          ]}
        />
        <FilterSelect
          id="sortEvidence"
          value={filters.sort}
          onChange={(sort) => onFiltersChange({ sort })}
          label="Sort evidence"
          options={[
            { value: "date-desc", label: "Newest first" },
            { value: "date-asc", label: "Oldest first" },
            { value: "title-asc", label: "Title (A–Z)" },
            { value: "title-desc", label: "Title (Z–A)" },
          ]}
        />
      </div>
    </div>
  );
}
