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
import { populateHypothesisDropdowns } from "./views/workspace.js";

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

// The three requests intentionally run one after another (each awaits the
// previous one); parallel loading is a later exercise.
async function loadCorePeopleAndLocations() {
  const caseRes = await fetch("data/case.json");
  setCaseData(await caseRes.json());

  const peopleRes = await fetch("data/people.json");
  setAllPeople(await peopleRes.json());

  const locationsRes = await fetch("data/locations.json");
  setAllLocations(await locationsRes.json());

  hideLoadingStep();
  renderDashboard();
  populateAllDropdowns();
}

function loadEvidenceData() {
  fetch("data/evidence.json")
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      setAllEvidence(data);
      applyStoredBookmarkFlags();
      renderDashboard();
      populateAllDropdowns();
      // per-person evidence counts are computed at render time
      if (viewRendered.people) renderPeople();
    })
    .catch(function (err) {
      console.error("Failed to load evidence.json", err);
      alert("Evidence could not be loaded. Some views may be incomplete.");
    })
    .finally(function () {
      setEvidenceViewLoading(false);
      renderEvidenceList();
    });
}

function loadTimelineData() {
  return fetch("data/timeline.json")
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      setAllTimeline(data);
      renderDashboard();
      if (currentPage === "timeline") renderTimeline();
      populateAllDropdowns();
    })
    .catch(function (err) {
      console.error("Failed to load timeline.json", err);
    })
    .finally(function () {
      hideLoadingStep();
    });
}

export function loadAllData() {
  showLoadingOverlay("Loading case file…");
  loadingStepsRemaining = 2;
  return loadCorePeopleAndLocations().then(function () {
    loadEvidenceData();
    loadTimelineData();
  });
}
