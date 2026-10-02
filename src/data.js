// ---------------------------------------------------------------------
// DATA LOADING
// ---------------------------------------------------------------------

import {
  allEvidence,
  currentPage,
  setAllEvidence,
  setFilteredEvidence,
  setAllPeople,
  setAllLocations,
  setAllTimeline,
  setCaseData,
  setEvidenceViewLoading
} from "./state.js";
import { renderDashboard } from "./views/dashboard.js";
import { populateEvidenceDropdowns, renderEvidenceList, applyStoredBookmarkFlags } from "./views/evidence.js";
import { populateTimelineDropdowns, renderTimeline } from "./views/timeline.js";
import { populateHypothesisDropdowns } from "./views/workspace.js";

let loadingStepsRemaining = 2;

function showLoadingOverlay(msg) {
  var overlay = document.getElementById("loadingOverlay");
  var text = document.getElementById("loadingText");
  if (text) text.textContent = msg;
  if (overlay) overlay.classList.remove("hidden");
}

function hideLoadingStep() {
  loadingStepsRemaining--;
  if (loadingStepsRemaining <= 0) {
    var overlay = document.getElementById("loadingOverlay");
    if (overlay) overlay.classList.add("hidden");
  }
}

function populateAllDropdowns() {
  populateEvidenceDropdowns();
  populateTimelineDropdowns();
  populateHypothesisDropdowns();
}

function loadCorePeopleAndLocations() {
  return fetch("data/case.json").then(function (caseRes) {
    return caseRes.json().then(function (caseJson) {
      setCaseData(caseJson);

      return fetch("data/people.json").then(function (peopleRes) {
        return peopleRes.json().then(function (peopleJson) {
          setAllPeople(peopleJson);

          return fetch("data/locations.json").then(function (locationsRes) {
            return locationsRes.json().then(function (locationsJson) {
              setAllLocations(locationsJson);

              hideLoadingStep();
              renderDashboard();
              populateAllDropdowns();
            });
          });
        });
      });
    });
  });
}

function loadEvidenceData() {
  fetch("data/evidence.json")
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      setAllEvidence(data);
      applyStoredBookmarkFlags();
      setFilteredEvidence([...allEvidence]);
      renderDashboard();
      populateAllDropdowns();
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
      console.log("timeline load error", err);
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
