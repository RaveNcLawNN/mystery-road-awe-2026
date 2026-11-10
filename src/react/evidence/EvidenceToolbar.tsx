import type { CaseData } from "../data/loadCaseData.ts";
import { FilterSelect } from "../components/FilterSelect.tsx";
import type { EvidenceFilters, FilterAction } from "./evidenceFilters.ts";

interface EvidenceToolbarProps {
  data: CaseData;
  filters: EvidenceFilters;
  // sends an action to the filters reducer in EvidencePage
  dispatch: (action: FilterAction) => void;
}

// Same controls as the vanilla toolbar, all controlled by the filters state.
export function EvidenceToolbar({ data, filters, dispatch }: EvidenceToolbarProps) {
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
          onChange={(event) => dispatch({ type: "SET_FILTER", field: "search", value: event.target.value })}
        />
        <FilterSelect
          id="filterType"
          value={filters.type}
          onChange={(value) => dispatch({ type: "SET_FILTER", field: "type", value })}
          label="Filter by type"
          options={[{ value: "", label: "All types" }, ...types.map((type) => ({ value: type, label: type }))]}
        />
        <FilterSelect
          id="filterPerson"
          value={filters.personId}
          onChange={(value) => dispatch({ type: "SET_FILTER", field: "personId", value })}
          label="Filter by person"
          options={[
            { value: "", label: "All people" },
            ...data.people.map((person) => ({ value: person.id, label: person.name })),
          ]}
        />
        <FilterSelect
          id="filterLocation"
          value={filters.locationId}
          onChange={(value) => dispatch({ type: "SET_FILTER", field: "locationId", value })}
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
          onChange={(value) => dispatch({ type: "SET_FILTER", field: "status", value })}
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
          onChange={(value) => dispatch({ type: "SET_FILTER", field: "relevance", value })}
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
          onChange={(sort) => dispatch({ type: "SET_SORT", sort })}
          label="Sort evidence"
          options={[
            { value: "date-desc", label: "Newest first" },
            { value: "date-asc", label: "Oldest first" },
            { value: "title-asc", label: "Title (A–Z)" },
            { value: "title-desc", label: "Title (Z–A)" },
          ]}
        />
        <button type="button" className="btn btn-secondary" onClick={() => dispatch({ type: "CLEAR_FILTERS" })}>
          Clear filters
        </button>
      </div>
    </div>
  );
}
