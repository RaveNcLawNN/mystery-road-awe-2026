// ---------------------------------------------------------------------
// GENERIC LOOKUP HELPERS
// ---------------------------------------------------------------------

import { allEvidence, allPeople, allLocations } from "../state.ts";
import type { CaseLocation, Evidence, Person } from "../types.ts";

// The id parameters are plain strings: they also come from <select> values,
// data-* attributes and localStorage, and an unknown id simply finds nothing.

export function findEvidenceById(id: string): Evidence | null {
  return allEvidence.find((ev) => ev.id === id) ?? null;
}

export function findPersonById(id: string): Person | null {
  return allPeople.find((person) => person.id === id) ?? null;
}

export function findLocationById(id: string): CaseLocation | null {
  return allLocations.find((loc) => loc.id === id) ?? null;
}

// personIds holds ids only (display names are resolved when evidence.json
// is loaded), so matching by id is enough.
export function evidenceMentionsPerson(ev: Evidence, person: Person): boolean {
  return ev.personIds.includes(person.id);
}
