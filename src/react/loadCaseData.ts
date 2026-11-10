// Loads and validates all case files for the React version. Uses the same
// files, fetch helper and validation as the vanilla app (data.ts), but
// returns the data instead of writing it into the shared state.

import type { CaseFile, CaseLocation, Evidence, Person, TimelineEvent } from "../types.ts";
import { parseCaseFile, parseEvidence, parseLocations, parsePeople, parseTimeline } from "../validate.ts";
import { fetchJson } from "../utils/fetchJson.ts";

export interface CaseData {
  caseFile: CaseFile;
  evidence: Evidence[];
  people: Person[];
  locations: CaseLocation[];
  timeline: TimelineEvent[];
}

// One request after another, as in data.ts; people come first because
// evidence and timeline resolve their person references against them.
export async function loadCaseData(): Promise<CaseData> {
  const caseFile = parseCaseFile(await fetchJson("data/case.json"));
  const people = parsePeople(await fetchJson("data/people.json"));
  const locations = parseLocations(await fetchJson("data/locations.json"));
  const evidence = parseEvidence(await fetchJson("data/evidence.json"), people);
  const timeline = parseTimeline(await fetchJson("data/timeline.json"), people);
  return { caseFile, evidence, people, locations, timeline };
}
