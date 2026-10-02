// ---------------------------------------------------------------------
// ENTRY POINT: event listener setup & app start
// ---------------------------------------------------------------------

import { loadBookmarksFromStorage, loadNotesFromStorage } from "./storage.ts";
import { loadAllData } from "./data.ts";
import { navigateTo } from "./navigation.ts";
import { handleHashChange } from "./router.js";
import { renderEvidenceList, handleSearchInput, clearFilters } from "./views/evidence.js";
import { switchPeopleTab } from "./views/people.ts";
import { renderTimeline } from "./views/timeline.js";
import { saveHypothesis } from "./views/workspace.js";

function setupEventListeners() {
  window.addEventListener("hashchange", handleHashChange);

  // top navigation and the dashboard's "Go to ..." buttons
  document.querySelectorAll("button[data-view]").forEach((button) => {
    button.addEventListener("click", () => navigateTo(button.dataset.view));
  });

  document.getElementById("tabPeopleBtn").addEventListener("click", () => switchPeopleTab("people"));
  document.getElementById("tabLocationsBtn").addEventListener("click", () => switchPeopleTab("locations"));
  document.getElementById("saveHypothesisBtn").addEventListener("click", saveHypothesis);

  document.getElementById("evidenceSearch").addEventListener("input", handleSearchInput);
  document.getElementById("sortEvidence").addEventListener("change", renderEvidenceList);

  document.getElementById("filterType").addEventListener("change", renderEvidenceList);
  document.getElementById("filterPerson").addEventListener("change", renderEvidenceList);
  document.getElementById("filterLocation").addEventListener("change", renderEvidenceList);

  document.getElementById("filterStatus").addEventListener("change", renderEvidenceList);

  document.getElementById("filterRelevance").addEventListener("change", renderEvidenceList);

  document.getElementById("clearFiltersBtn").addEventListener("click", clearFilters);

  document.getElementById("timelineOrder").addEventListener("change", renderTimeline);
  document.getElementById("timelinePersonFilter").addEventListener("change", renderTimeline);
  document.getElementById("timelineLocationFilter").addEventListener("change", renderTimeline);
  document.getElementById("timelineTypeFilter").addEventListener("change", renderTimeline);

  document.getElementById("hypConfidence").addEventListener("input", (e) => {
    document.getElementById("hypConfidenceValue").textContent = e.target.value;
  });
}

async function initApp() {
  loadBookmarksFromStorage();
  loadNotesFromStorage();
  setupEventListeners();

  await loadAllData();
  handleHashChange();
}

window.addEventListener("DOMContentLoaded", initApp);
