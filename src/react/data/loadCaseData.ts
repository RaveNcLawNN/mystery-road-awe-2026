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

// dev: from the backend (npm run server), e.g. "/api/evidence";
// the GitHub Pages build has no backend, so the static file, e.g. "data/evidence.json"
function dataUrl(name: string): string {
  return import.meta.env.DEV ? `/api/${name}` : `data/${name}.json`;
}

// people first: evidence and timeline resolve their person references against them
export async function loadCaseData(): Promise<CaseData> {
  const caseFile = parseCaseFile(await fetchJson(dataUrl("case")));
  const people = parsePeople(await fetchJson(dataUrl("people")));
  const locations = parseLocations(await fetchJson(dataUrl("locations")));
  const evidence = parseEvidence(await fetchJson(dataUrl("evidence")), people);
  const timeline = parseTimeline(await fetchJson(dataUrl("timeline")), people);
  return { caseFile, evidence, people, locations, timeline };
}
