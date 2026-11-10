import type { CaseData } from "../data/loadCaseData.ts";
import { FilterSelect } from "../components/FilterSelect.tsx";

interface EvidenceToolbarProps {
  data: CaseData;
  onSearchChange: (term: string) => void;
}

// Same controls as the vanilla toolbar. The search box works; the dropdowns
// are display only until they get their state (Exercise 5, Demo 7).
export function EvidenceToolbar({ data, onSearchChange }: EvidenceToolbarProps) {
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
          onChange={(event) => onSearchChange(event.target.value)}
        />
        <FilterSelect
          id="filterType"
          label="Filter by type"
          options={[{ value: "", label: "All types" }, ...types.map((type) => ({ value: type, label: type }))]}
        />
        <FilterSelect
          id="filterPerson"
          label="Filter by person"
          options={[
            { value: "", label: "All people" },
            ...data.people.map((person) => ({ value: person.id, label: person.name })),
          ]}
        />
        <FilterSelect
          id="filterLocation"
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
