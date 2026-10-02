// ---------------------------------------------------------------------
// SHARED STATE
// ---------------------------------------------------------------------
// Other modules read these through live import bindings. Imports are
// read-only, so reassignment has to go through the setters below.

export let allEvidence = [];
export let filteredEvidence = [];
export let bookmarks = [];
export let currentPage = "dashboard";

export let allPeople = [];
export let allLocations = [];
export let allTimeline = [];
export let caseData = {};

export let evidenceViewLoading = true;

export const viewRendered = {
  dashboard: false,
  evidence: false,
  people: false,
  timeline: false,
  workspace: false
};

export let notesStore = {};

export function setAllEvidence(value) {
  allEvidence = value;
}

export function setFilteredEvidence(value) {
  filteredEvidence = value;
}

export function setBookmarks(value) {
  bookmarks = value;
}

export function setCurrentPage(value) {
  currentPage = value;
}

export function setAllPeople(value) {
  allPeople = value;
}

export function setAllLocations(value) {
  allLocations = value;
}

export function setAllTimeline(value) {
  allTimeline = value;
}

export function setCaseData(value) {
  caseData = value;
}

export function setNotesStore(value) {
  notesStore = value;
}
