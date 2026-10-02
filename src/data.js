// ---------------------------------------------------------------------
// DATA LOADING
// ---------------------------------------------------------------------

import {
  currentPage,
  viewRendered,
  setAllEvidence,
  setAllPeople,
  setAllLocations,
  setAllTimeline,
  setCaseData,
  setEvidenceViewLoading
} from "./state.js";
import { renderDashboard } from "./views/dashboard.js";
import { populateEvidenceDropdowns, renderEvidenceList, applyStoredBookmarkFlags } from "./views/evidence.js";
import { populateTimelineDropdowns, renderTimeline } from "./views/timeline.js";
import { renderPeople } from "./views/people.js";
import { populateHypothesisDropdowns, renderWorkspace } from "./views/workspace.js";

let loadingStepsRemaining = 2;

function showLoadingOverlay(msg) {
  const overlay = document.getElementById("loadingOverlay");
  const text = document.getElementById("loadingText");
  if (text) text.textContent = msg;
  if (overlay) overlay.classList.remove("hidden");
}

function hideLoadingStep() {
  loadingStepsRemaining--;
  if (loadingStepsRemaining <= 0) {
    const overlay = document.getElementById("loadingOverlay");
    if (overlay) overlay.classList.add("hidden");
  }
}

function populateAllDropdowns() {
  populateEvidenceDropdowns();
  populateTimelineDropdowns();
  populateHypothesisDropdowns();
}

function showLoadingError(msg) {
  const text = document.getElementById("loadingText");
  const spinner = document.querySelector("#loadingOverlay .spinner");
  if (text) text.textContent = msg;
  if (spinner) spinner.hidden = true;
}

// fetch() only rejects on network failure; a 404/500 resolves normally, so
// the status has to be checked before the body is parsed as JSON.
async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${url} responded with HTTP ${res.status}`);
  return res.json();
}

// The three requests intentionally run one after another (each awaits the
// previous one); parallel loading is a later exercise.
async function loadCorePeopleAndLocations() {
  setCaseData(await fetchJson("data/case.json"));
  setAllPeople(await fetchJson("data/people.json"));
  setAllLocations(await fetchJson("data/locations.json"));

  hideLoadingStep();
  renderDashboard();
  populateAllDropdowns();
}

async function loadEvidenceData() {
  try {
    setAllEvidence(await fetchJson("data/evidence.json"));
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

async function loadTimelineData() {
  try {
    setAllTimeline(await fetchJson("data/timeline.json"));
    renderDashboard();
    if (currentPage === "timeline") renderTimeline();
    populateAllDropdowns();
  } catch (err) {
    console.error("Failed to load timeline.json", err);
  } finally {
    hideLoadingStep();
  }
}

export async function loadAllData() {
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
