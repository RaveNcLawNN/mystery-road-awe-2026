// ---------------------------------------------------------------------
// ENTRY POINT: event listener setup & app start
// ---------------------------------------------------------------------

import { loadBookmarksFromStorage, loadNotesFromStorage } from "./storage.ts";
import { loadAllData } from "./data.ts";
import { isViewName, navigateTo } from "./navigation.ts";
import { handleHashChange } from "./router.ts";
import { getRequiredElement } from "./utils/dom.ts";
import { renderEvidenceList, handleSearchInput, clearFilters } from "./views/evidence.ts";
import { switchPeopleTab } from "./views/people.ts";
import { renderTimeline } from "./views/timeline.ts";
import { saveHypothesis } from "./views/workspace.ts";

function setupEventListeners(): void {
  window.addEventListener("hashchange", handleHashChange);

  // top navigation and the dashboard's "Go to ..." buttons
  document.querySelectorAll<HTMLButtonElement>("button[data-view]").forEach((button) => {
    const view = button.dataset.view;
    if (!isViewName(view)) {
      console.warn(`Button with unknown data-view "${view}" ignored`);
      return;
    }
    button.addEventListener("click", () => navigateTo(view));
  });

  getRequiredElement("tabPeopleBtn", HTMLButtonElement).addEventListener("click", () => switchPeopleTab("people"));
  getRequiredElement("tabLocationsBtn", HTMLButtonElement).addEventListener("click", () =>
    switchPeopleTab("locations"),
  );
  getRequiredElement("saveHypothesisBtn", HTMLButtonElement).addEventListener("click", saveHypothesis);

  // async handlers: addEventListener ignores the returned Promise, so it is
  // discarded explicitly (`void`) instead of silently
  getRequiredElement("evidenceSearch", HTMLInputElement).addEventListener("input", (event) => {
    void handleSearchInput(event);
  });
  getRequiredElement("sortEvidence", HTMLSelectElement).addEventListener("change", renderEvidenceList);

  getRequiredElement("filterType", HTMLSelectElement).addEventListener("change", renderEvidenceList);
  getRequiredElement("filterPerson", HTMLSelectElement).addEventListener("change", renderEvidenceList);
  getRequiredElement("filterLocation", HTMLSelectElement).addEventListener("change", renderEvidenceList);

  getRequiredElement("filterStatus", HTMLSelectElement).addEventListener("change", renderEvidenceList);

  getRequiredElement("filterRelevance", HTMLSelectElement).addEventListener("change", renderEvidenceList);

  getRequiredElement("clearFiltersBtn", HTMLButtonElement).addEventListener("click", clearFilters);

  getRequiredElement("timelineOrder", HTMLSelectElement).addEventListener("change", renderTimeline);
  getRequiredElement("timelinePersonFilter", HTMLSelectElement).addEventListener("change", renderTimeline);
  getRequiredElement("timelineLocationFilter", HTMLSelectElement).addEventListener("change", renderTimeline);
  getRequiredElement("timelineTypeFilter", HTMLSelectElement).addEventListener("change", renderTimeline);

  const confidenceInput = getRequiredElement("hypConfidence", HTMLInputElement);
  confidenceInput.addEventListener("input", () => {
    getRequiredElement("hypConfidenceValue", HTMLOutputElement).textContent = confidenceInput.value;
  });
}

async function initApp(): Promise<void> {
  loadBookmarksFromStorage();
  loadNotesFromStorage();
  setupEventListeners();

  await loadAllData();
  handleHashChange();
}

window.addEventListener("DOMContentLoaded", () => {
  void initApp();
});
