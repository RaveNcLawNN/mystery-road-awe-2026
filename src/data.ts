// ---------------------------------------------------------------------
// DATA LOADING
// ---------------------------------------------------------------------

import {
  allPeople,
  currentPage,
  viewRendered,
  setAllEvidence,
  setAllPeople,
  setAllLocations,
  setAllTimeline,
  setCaseData,
  setEvidenceViewLoading,
} from "./state.ts";
import { parseCaseFile, parseEvidence, parseLocations, parsePeople, parseTimeline } from "./validate.ts";
import { renderDashboard } from "./views/dashboard.ts";
import { populateEvidenceDropdowns, renderEvidenceList, applyStoredBookmarkFlags } from "./views/evidence.js";
import { populateTimelineDropdowns, renderTimeline } from "./views/timeline.ts";
import { renderPeople } from "./views/people.ts";
import { populateHypothesisDropdowns, renderWorkspace } from "./views/workspace.ts";

let loadingStepsRemaining = 2;

function showLoadingOverlay(msg: string): void {
  const overlay = document.getElementById("loadingOverlay");
  const text = document.getElementById("loadingText");
  if (text) text.textContent = msg;
  if (overlay) overlay.classList.remove("hidden");
}

function hideLoadingStep(): void {
  loadingStepsRemaining--;
  if (loadingStepsRemaining <= 0) {
    const overlay = document.getElementById("loadingOverlay");
    if (overlay) overlay.classList.add("hidden");
  }
}

function populateAllDropdowns(): void {
  populateEvidenceDropdowns();
  populateTimelineDropdowns();
  populateHypothesisDropdowns();
}

function showLoadingError(msg: string): void {
  const text = document.getElementById("loadingText");
  const spinner = document.querySelector<HTMLElement>("#loadingOverlay .spinner");
  if (text) text.textContent = msg;
  if (spinner) spinner.hidden = true;
}

// fetch() only rejects on network failure; a 404/500 resolves normally, so
// the status has to be checked before the body is parsed as JSON.
// res.json() is typed any; returning unknown forces every caller to
// validate the data before it can be used as a domain type.
async function fetchJson(url: string): Promise<unknown> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${url} responded with HTTP ${res.status}`);
  const data: unknown = await res.json();
  return data;
}

// The three requests intentionally run one after another (each awaits the
// previous one); parallel loading is a later exercise.
async function loadCorePeopleAndLocations(): Promise<void> {
  setCaseData(parseCaseFile(await fetchJson("data/case.json")));
  setAllPeople(parsePeople(await fetchJson("data/people.json")));
  setAllLocations(parseLocations(await fetchJson("data/locations.json")));

  hideLoadingStep();
  renderDashboard();
  populateAllDropdowns();
}

async function loadEvidenceData(): Promise<void> {
  try {
    setAllEvidence(parseEvidence(await fetchJson("data/evidence.json"), allPeople));
    applyStoredBookmarkFlags();
    renderDashboard();
    populateAllDropdowns();
    // per-person evidence counts are computed at render time
    if (viewRendered.people) renderPeople();
    // the bookmarks and notes lists are built from allEvidence
    if (currentPage === "workspace") renderWorkspace();
  } catch (err) {
    console.error("Failed to load evidence.json", err);
    alert("Evidence could not be loaded. Some views may be incomplete.");
  } finally {
    setEvidenceViewLoading(false);
    renderEvidenceList();
  }
}

async function loadTimelineData(): Promise<void> {
  try {
    setAllTimeline(parseTimeline(await fetchJson("data/timeline.json"), allPeople));
    renderDashboard();
    if (currentPage === "timeline") renderTimeline();
    populateAllDropdowns();
  } catch (err) {
    console.error("Failed to load timeline.json", err);
  } finally {
    hideLoadingStep();
  }
}

export async function loadAllData(): Promise<void> {
  showLoadingOverlay("Loading case file…");
  loadingStepsRemaining = 2;
  try {
    await loadCorePeopleAndLocations();
  } catch (err) {
    console.error("Failed to load the case file", err);
    showLoadingError("The case file could not be loaded. Please check your connection and reload the page.");
    return;
  }
  // Deliberately not awaited: the app starts once the core data is there,
  // evidence and timeline fill in when they arrive.
  loadEvidenceData();
  loadTimelineData();
}
