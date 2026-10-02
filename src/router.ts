// ---------------------------------------------------------------------
// HASH ROUTING
// ---------------------------------------------------------------------

import { viewRendered, setCurrentPage } from "./state.ts";
import { isViewName, type ViewName } from "./navigation.ts";
import { getRequiredElement } from "./utils/dom.ts";
import { renderDashboard } from "./views/dashboard.ts";
import { renderEvidenceList } from "./views/evidence.ts";
import { renderPeople, renderLocations } from "./views/people.ts";
import { renderTimeline } from "./views/timeline.ts";
import { renderWorkspace } from "./views/workspace.ts";

export function handleHashChange(): void {
  const requested = window.location.hash.replace("#", "");
  const hash: ViewName = isViewName(requested) ? requested : "dashboard";
  console.log("route ->", hash);
  setCurrentPage(hash);

  document.querySelectorAll(".view").forEach((section) => {
    section.classList.remove("active");
  });
  getRequiredElement("view-" + hash, HTMLElement).classList.add("active");

  document.querySelectorAll(".nav-btn").forEach((button) => {
    button.classList.remove("active");
    if (button.getAttribute("data-view") === hash) {
      button.classList.add("active");
    }
  });

  if (hash === "dashboard") {
    // the stats derive from bookmarks and review status, which change in other views
    renderDashboard();
  } else if (hash === "evidence" && !viewRendered.evidence) {
    renderEvidenceList();
    viewRendered.evidence = true;
  } else if (hash === "people" && !viewRendered.people) {
    renderPeople();
    renderLocations();
    viewRendered.people = true;
  } else if (hash === "timeline" && !viewRendered.timeline) {
    renderTimeline();
    viewRendered.timeline = true;
  } else if (hash === "workspace") {
    // workspace is cheap enough that it always re-renders
    renderWorkspace();
  }
}
