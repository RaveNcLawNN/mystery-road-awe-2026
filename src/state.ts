// ---------------------------------------------------------------------
// SHARED STATE
// ---------------------------------------------------------------------
// Other modules read these through live import bindings. Imports are
// read-only, so reassignment has to go through the setters below.
//
// The loaded collections are readonly arrays: views may read, filter and
// copy them, but not sort or splice them in place (Exercise 1, Demo 2).
// The items themselves stay mutable (status, relevance, bookmarked).

import type { CaseFile, CaseLocation, Evidence, Person, TimelineEvent } from "./types.ts";
import type { ViewName } from "./navigation.ts";

export let allEvidence: readonly Evidence[] = [];
export let bookmarks: string[] = []; // evidence ids
export let currentPage: ViewName = "dashboard";

export let allPeople: readonly Person[] = [];
export let allLocations: readonly CaseLocation[] = [];
export let allTimeline: readonly TimelineEvent[] = [];
// empty until case.json has loaded (the dashboard falls back to defaults)
export let caseData: Partial<CaseFile> = {};

export let evidenceViewLoading = true;

export const viewRendered = {
  evidence: false,
  people: false,
  timeline: false,
};

export let notesStore: Record<string, string> = {}; // evidence id -> note text

export function setAllEvidence(value: readonly Evidence[]): void {
  allEvidence = value;
}

export function setBookmarks(value: string[]): void {
  bookmarks = value;
}

export function setCurrentPage(value: ViewName): void {
  currentPage = value;
}

export function setAllPeople(value: readonly Person[]): void {
  allPeople = value;
}

export function setAllLocations(value: readonly CaseLocation[]): void {
  allLocations = value;
}

export function setAllTimeline(value: readonly TimelineEvent[]): void {
  allTimeline = value;
}

export function setCaseData(value: CaseFile): void {
  caseData = value;
}

export function setEvidenceViewLoading(value: boolean): void {
  evidenceViewLoading = value;
}

export function setNotesStore(value: Record<string, string>): void {
  notesStore = value;
}
