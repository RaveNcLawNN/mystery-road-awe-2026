import type { Evidence } from "../../types.ts";

// Everything the Evidence toolbar can set. "" = no filter for that field.
export interface EvidenceFilters {
  search: string;
  type: string;
  personId: string;
  locationId: string;
  status: string;
  relevance: string;
  sort: string; // "date-desc" | "date-asc" | "title-asc" | "title-desc"
}

export const NO_FILTERS: EvidenceFilters = {
  search: "",
  type: "",
  personId: "",
  locationId: "",
  status: "",
  relevance: "",
  sort: "date-desc",
};

// --- reducer: every way the filters can change, in one place -----------

// the fields that filter the list (everything except the sort order)
type FilterField = Exclude<keyof EvidenceFilters, "sort">;

export type FilterAction =
  | { type: "SET_FILTER"; field: FilterField; value: string }
  | { type: "SET_SORT"; sort: string }
  | { type: "CLEAR_FILTERS" };

// Gets the current filters and an action, returns the NEW filters.
// Pure: no side effects, never changes `filters` itself.
export function filtersReducer(filters: EvidenceFilters, action: FilterAction): EvidenceFilters {
  switch (action.type) {
    case "SET_FILTER":
      return { ...filters, [action.field]: action.value };
    case "SET_SORT":
      return { ...filters, sort: action.sort };
    case "CLEAR_FILTERS":
      // like the vanilla "Clear filters": every filter back to "all", the sort order stays
      return { ...NO_FILTERS, sort: filters.sort };
  }
}

// The visible list is calculated from the full list and the filters on every
// render and never stored. Same rules as the vanilla getFilteredEvidence().
export function filterAndSortEvidence(evidence: readonly Evidence[], filters: EvidenceFilters): Evidence[] {
  const search = filters.search.trim().toLowerCase();

  // filter() returns a new array, so sort() below never reorders the full list
  const visible = evidence.filter(
    (ev) =>
      (ev.title + " " + ev.summary + " " + ev.tags.join(" ")).toLowerCase().includes(search) &&
      (filters.type === "" || ev.type.toLowerCase() === filters.type) &&
      (filters.personId === "" || ev.personIds.some((id) => id === filters.personId)) &&
      (filters.locationId === "" || ev.locationIds.includes(filters.locationId)) &&
      (filters.status === "" || ev.status.toLowerCase() === filters.status) &&
      (filters.relevance === "" || ev.relevance.toLowerCase() === filters.relevance),
  );

  if (filters.sort === "title-asc") return visible.sort((a, b) => a.title.localeCompare(b.title));
  if (filters.sort === "title-desc") return visible.sort((a, b) => b.title.localeCompare(a.title));
  if (filters.sort === "date-asc") return visible.sort((a, b) => Date.parse(a.timestamp) - Date.parse(b.timestamp));
  return visible.sort((a, b) => Date.parse(b.timestamp) - Date.parse(a.timestamp));
}
