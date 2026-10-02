// ---------------------------------------------------------------------
// TIMELINE
// ---------------------------------------------------------------------

import { allPeople, allLocations, allTimeline } from "../state.ts";
import { findEvidenceById, findLocationById } from "../utils/lookup.ts";
import { formatDate } from "../utils/format.ts";
import { getRequiredElement } from "../utils/dom.ts";
import { navigateTo } from "../navigation.ts";
import { openEvidenceDetail } from "./evidence.js";

export function populateTimelineDropdowns(): void {
  const personSelect = document.getElementById("timelinePersonFilter");
  const locationSelect = document.getElementById("timelineLocationFilter");
  const typeSelect = document.getElementById("timelineTypeFilter");
  if (!personSelect || !locationSelect || !typeSelect) return;

  personSelect.innerHTML = '<option value="">All people</option>';
  for (const person of allPeople) {
    personSelect.innerHTML += '<option value="' + person.id + '">' + person.name + "</option>";
  }

  locationSelect.innerHTML = '<option value="">All locations</option>';
  for (const loc of allLocations) {
    locationSelect.innerHTML += '<option value="' + loc.id + '">' + loc.id + "</option>";
  }

  const types: string[] = [];
  for (const evt of allTimeline) {
    if (!types.includes(evt.type)) types.push(evt.type);
  }
  typeSelect.innerHTML = '<option value="">All event types</option>';
  for (const type of types) {
    typeSelect.innerHTML += '<option value="' + type + '">' + type + "</option>";
  }
}

export function renderTimeline(): void {
  const container = document.getElementById("timelineContainer");
  if (!container) return;

  const order = getRequiredElement("timelineOrder", HTMLSelectElement).value;
  const personFilter = getRequiredElement("timelinePersonFilter", HTMLSelectElement).value;
  const locationFilter = getRequiredElement("timelineLocationFilter", HTMLSelectElement).value;
  const typeFilter = getRequiredElement("timelineTypeFilter", HTMLSelectElement).value;

  const events = allTimeline
    .filter(
      (evt) =>
        // a <select> value is a plain string, the event holds PersonIds
        (!personFilter || evt.personIds.some((id) => id === personFilter)) &&
        (!locationFilter || evt.locationIds.includes(locationFilter)) &&
        (!typeFilter || evt.type === typeFilter),
    )
    .sort((a, b) => {
      const diff = Date.parse(a.time) - Date.parse(b.time);
      return order === "desc" ? -diff : diff;
    });

  let html = "";
  for (const item of events) {
    html += '<div class="timeline-event certainty-' + item.certainty + '">';
    html +=
      '<div class="timeline-time">' +
      formatDate(item.time) +
      '&nbsp;&middot;&nbsp;<span class="badge badge-' +
      certaintyBadgeClass(item.certainty) +
      '">' +
      item.certainty +
      "</span></div>";
    html += "<h3>" + item.title + "</h3>";
    html += "<p>" + item.description + "</p>";

    const eventLocationNames = item.locationIds.map((locationId) => {
      const evtLoc = findLocationById(locationId);
      return evtLoc ? evtLoc.id + " - " + evtLoc.name : locationId;
    });
    if (eventLocationNames.length > 0) {
      html += '<p class="evidence-meta">Location: ' + eventLocationNames.join(", ") + "</p>";
    }

    for (const evidenceId of item.evidenceIds) {
      html +=
        '<button type="button" class="evidence-link-btn" data-evidence-id="' +
        evidenceId +
        '">View ' +
        evidenceId +
        "</button>";
    }
    html += "</div>";
  }
  if (events.length === 0) {
    html = "<p>No timeline events match the current filters.</p>";
  }
  container.innerHTML = html;

  container.querySelectorAll<HTMLButtonElement>(".evidence-link-btn").forEach((button) => {
    button.addEventListener("click", () => {
      openEvidenceModal(button.dataset.evidenceId ?? "");
    });
  });
}

function certaintyBadgeClass(certainty: string): string {
  if (certainty === "confirmed") return "reviewed";
  if (certainty === "contradictory") return "critical";
  if (certainty === "reported") return "flagged";
  return "unreviewed";
}

// --- Quick-view modal (used from the timeline) -------------------------
function openEvidenceModal(evidenceId: string): void {
  const ev = findEvidenceById(evidenceId);
  if (!ev) return;

  let modal = document.getElementById("quickViewModal");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "quickViewModal";
    document.body.appendChild(modal);
    // registered once: the element is reused for every later quick view
    modal.addEventListener("click", handleModalClick);
  }

  modal.innerHTML =
    '<div class="modal-backdrop"><div class="modal-box">' +
    '<button type="button" class="modal-close-btn" aria-label="Close">&times;</button>' +
    "<h3>" +
    ev.title +
    "</h3>" +
    '<p class="evidence-meta">' +
    ev.id +
    " &middot; " +
    ev.type +
    " &middot; " +
    formatDate(ev.timestamp) +
    "</p>" +
    "<p>" +
    ev.summary +
    "</p>" +
    '<button type="button" class="btn btn-primary btn-small" data-open-full="' +
    ev.id +
    '">Open full evidence</button>' +
    "</div></div>";
}

function handleModalClick(e: MouseEvent): void {
  const modal = e.currentTarget;
  const target = e.target;
  if (!(modal instanceof HTMLElement) || !(target instanceof Element)) return;
  if (target.classList.contains("modal-close-btn") || target.classList.contains("modal-backdrop")) {
    modal.innerHTML = "";
  }
  const evidenceId = target.getAttribute("data-open-full");
  if (evidenceId) {
    modal.innerHTML = "";
    navigateTo("evidence");
    setTimeout(() => {
      openEvidenceDetail(evidenceId);
    }, 0);
  }
}
