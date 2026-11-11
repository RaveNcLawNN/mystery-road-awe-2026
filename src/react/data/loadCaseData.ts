// Loads and validates all case files (same files and checks as the vanilla app).

import type { CaseFile, CaseLocation, Evidence, Person, TimelineEvent } from "../../types.ts";
import { parseCaseFile, parseEvidence, parseLocations, parsePeople, parseTimeline } from "../../validate.ts";
import { fetchJson } from "../../utils/fetchJson.ts";

export interface CaseData {
  caseFile: CaseFile;
  evidence: Evidence[];
  people: Person[];
  locations: CaseLocation[];
  timeline: TimelineEvent[];
}

// people first: evidence and timeline resolve their person references against them
export async function loadCaseData(): Promise<CaseData> {
  const caseFile = parseCaseFile(await fetchJson("data/case.json"));
  const people = parsePeople(await fetchJson("data/people.json"));
  const locations = parseLocations(await fetchJson("data/locations.json"));
  const evidence = parseEvidence(await fetchJson("data/evidence.json"), people);
  const timeline = parseTimeline(await fetchJson("data/timeline.json"), people);
  return { caseFile, evidence, people, locations, timeline };
}
