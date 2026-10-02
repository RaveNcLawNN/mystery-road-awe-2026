// ---------------------------------------------------------------------
// EVIDENCE CATALOGUE & EVIDENCE DETAIL
// ---------------------------------------------------------------------

import {
  allEvidence,
  allPeople,
  allLocations,
  bookmarks,
  currentPage,
  evidenceViewLoading,
  viewRendered,
  setBookmarks,
} from "../state.ts";
import type { Evidence } from "../types.ts";
import { findEvidenceById, findPersonById, findLocationById, evidenceMentionsPerson } from "../utils/lookup.ts";
import { formatDate, getStatusBadgeClass, getRelevanceBadgeClass } from "../utils/format.ts";
import { getRequiredElement } from "../utils/dom.ts";
import { saveBookmarksToStorage, saveNoteForEvidence, loadNoteForEvidence } from "../storage.ts";

let latestSearchRequestId = 0;

export function populateEvidenceDropdowns(): void {
  const typeSelect = document.getElementById("filterType");
  const personSelect = document.getElementById("filterPerson");
  const locationSelect = document.getElementById("filterLocation");
  if (!typeSelect || !personSelect || !locationSelect) return;

  const types: string[] = [];
  for (const ev of allEvidence) {
    const t = ev.type.toLowerCase();
    if (!types.includes(t)) types.push(t);
  }
  typeSelect.innerHTML = '<option value="">All types</option>';
  for (const type of types) {
    typeSelect.innerHTML += '<option value="' + type + '">' + type + "</option>";
  }

  personSelect.innerHTML = '<option value="">All people</option>';
  for (const person of allPeople) {
    personSelect.innerHTML += '<option value="' + person.id + '">' + person.name + "</option>";
  }

  locationSelect.innerHTML = '<option value="">All locations</option>';
  for (const loc of allLocations) {
    locationSelect.innerHTML += '<option value="' + loc.id + '">' + loc.id + " - " + loc.name + "</option>";
  }
}

function getFilteredEvidence(): Evidence[] {
  const searchBox = document.getElementById("evidenceSearch");
  const searchTerm = searchBox instanceof HTMLInputElement ? searchBox.value.toLowerCase().trim() : "";
  const typeVal = getRequiredElement("filterType", HTMLSelectElement).value;
  const personVal = getRequiredElement("filterPerson", HTMLSelectElement).value;
  const locationVal = getRequiredElement("filterLocation", HTMLSelectElement).value;
  const statusVal = getRequiredElement("filterStatus", HTMLSelectElement).value;
  const relevanceVal = getRequiredElement("filterRelevance", HTMLSelectElement).value;

  const results: Evidence[] = [];
  for (const item of allEvidence) {
    let matches = true;

    if (searchTerm) {
      const haystack = (item.title + " " + item.summary + " " + item.tags.join(" ")).toLowerCase();
      if (!haystack.includes(searchTerm)) matches = false;
    }
    if (matches && typeVal && item.type.toLowerCase() !== typeVal) matches = false;
    if (matches && personVal) {
      const person = findPersonById(personVal);
      if (!person || !evidenceMentionsPerson(item, person)) matches = false;
    }
    if (matches && locationVal && !item.locationIds.includes(locationVal)) matches = false;
    if (matches && statusVal && item.status.toLowerCase() !== statusVal) matches = false;
    if (matches && relevanceVal && item.relevance.toLowerCase() !== relevanceVal) matches = false;

    if (matches) results.push(item);
  }

  return sortEvidence(results, getRequiredElement("sortEvidence", HTMLSelectElement).value);
}

// Returns a sorted copy: Array.prototype.sort works in place, and the input
// may be (or share items with) the master allEvidence array.
function sortEvidence(items: readonly Evidence[], sortValue: string): Evidence[] {
  const sorted = [...items];
  if (sortValue === "title-asc") {
    sorted.sort((a, b) => a.title.localeCompare(b.title));
  } else if (sortValue === "title-desc") {
    sorted.sort((a, b) => b.title.localeCompare(a.title));
  } else if (sortValue === "date-asc") {
    sorted.sort((a, b) => Date.parse(a.timestamp) - Date.parse(b.timestamp));
  } else {
    sorted.sort((a, b) => Date.parse(b.timestamp) - Date.parse(a.timestamp));
  }
  return sorted;
}

export function renderEvidenceList(): void {
  const container = document.getElementById("evidenceList");
  if (!container) return;

  const loadingIndicator = document.getElementById("evidenceLoadingIndicator");
  if (evidenceViewLoading) {
    if (loadingIndicator) loadingIndicator.classList.remove("hidden");
    container.innerHTML = "";
    return;
  }
  if (loadingIndicator) loadingIndicator.classList.add("hidden");

  const results = getFilteredEvidence();

  let html = "";
  if (results.length === 0) {
    html = "<p>No evidence matches the current filters.</p>";
  }
  for (const ev of results) {
    html += renderEvidenceCardHTML(ev);
  }
  container.innerHTML = html;

  // Event delegation for card clicks / bookmark button.
  container.addEventListener("click", handleEvidenceListClick);
}

function renderEvidenceCardHTML(ev: Evidence): string {
  const isBookmarked = bookmarks.includes(ev.id);
  let html = '<div class="evidence-card" data-id="' + ev.id + '">';
  html +=
    '<button class="bookmark-btn ' +
    (isBookmarked ? "active" : "") +
    '" data-action="bookmark" data-id="' +
    ev.id +
    '" aria-label="Toggle bookmark for ' +
    ev.title +
    '"><span class="bookmark-icon">' +
    (isBookmarked ? "★" : "☆") +
    "</span></button>";
  html += "<h3>" + ev.title + "</h3>";
  html +=
    '<div class="evidence-meta">' + ev.id + " &middot; " + ev.type + " &middot; " + formatDate(ev.timestamp) + "</div>";
  html += '<div class="evidence-summary">' + ev.summary + "</div>";

  if (ev.tags.includes("critical")) {
    html += '<span class="badge badge-critical">Critical</span>';
  }
  html += '<span class="badge ' + getStatusBadgeClass(ev.status) + '">' + ev.status + "</span>";
  html += '<span class="badge ' + getRelevanceBadgeClass(ev.relevance) + '">' + ev.relevance + "</span>";
  html += "<div>";
  for (const tag of ev.tags) {
    html += '<span class="tag-chip">' + tag + "</span>";
  }
  html += "</div>";
  html += "</div>";
  return html;
}

function handleEvidenceListClick(event: MouseEvent): void {
  const target = event.target;
  if (!(target instanceof Element)) return;

  const bookmarkButton = target.closest<HTMLElement>("[data-action='bookmark']");
  if (bookmarkButton) {
    event.stopPropagation();
    handleBookmarkClick(bookmarkButton.dataset.id ?? "");
    return;
  }

  const card = target.closest<HTMLElement>(".evidence-card");
  if (card) {
    openEvidenceDetail(card.dataset.id ?? "");
  }
}

function handleBookmarkClick(evidenceId: string): void {
  const ev = findEvidenceById(evidenceId);
  if (!ev) return;

  if (!bookmarks.includes(evidenceId)) {
    setBookmarks([...bookmarks, evidenceId]);
    ev.bookmarked = true;
  } else {
    setBookmarks(bookmarks.filter((id) => id !== evidenceId));
    ev.bookmarked = false;
  }
  saveBookmarksToStorage();
  if (currentPage === "evidence") renderEvidenceList();
}

export function applyStoredBookmarkFlags(): void {
  for (const ev of allEvidence) {
    ev.bookmarked = bookmarks.includes(ev.id);
  }
}

export function clearFilters(): void {
  getRequiredElement("evidenceSearch", HTMLInputElement).value = "";
  getRequiredElement("filterType", HTMLSelectElement).value = "";
  getRequiredElement("filterPerson", HTMLSelectElement).value = "";
  getRequiredElement("filterLocation", HTMLSelectElement).value = "";
  getRequiredElement("filterStatus", HTMLSelectElement).value = "";
  getRequiredElement("filterRelevance", HTMLSelectElement).value = "";
  renderEvidenceList();
}

function simulateAsyncSearch(term: string): Promise<string> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(term), 300);
  });
}

export async function handleSearchInput(event: Event): Promise<void> {
  const term = event.target instanceof HTMLInputElement ? event.target.value : "";
  const requestId = ++latestSearchRequestId;

  await simulateAsyncSearch(term);
  // Only apply this response if nothing newer has been typed meanwhile.
  if (requestId !== latestSearchRequestId) return;
  renderEvidenceList();
}

// --- Evidence detail ----------------------------------------------------

export function openEvidenceDetail(evidenceId: string): void {
  const ev = findEvidenceById(evidenceId);
  if (!ev) return;

  const section = getRequiredElement("evidenceDetailSection", HTMLElement);
  section.classList.remove("hidden");

  renderEvidenceDetail(ev);
  section.scrollIntoView({ behavior: "smooth", block: "start" });
}

function closeEvidenceDetail(): void {
  const section = getRequiredElement("evidenceDetailSection", HTMLElement);
  section.classList.add("hidden");
  section.innerHTML = "";
}

function renderEvidenceDetail(ev: Evidence): void {
  const section = getRequiredElement("evidenceDetailSection", HTMLElement);

  const personNames = ev.personIds.map((personId) => {
    const person = findPersonById(personId);
    return person ? person.name : personId;
  });

  const locationNames = ev.locationIds.map((locationId) => {
    const loc = findLocationById(locationId);
    return loc ? loc.id + " - " + loc.name : locationId;
  });

  let tagsHtml = "";
  for (const tag of ev.tags) {
    tagsHtml += '<span class="tag-chip">' + tag + "</span>";
  }

  const storedNote = loadNoteForEvidence(ev.id);

  let html = "";
  html += '<div class="evidence-detail-header">';
  html += "<div><h2>" + ev.title + "</h2>";
  html +=
    '<div class="evidence-meta">' +
    ev.id +
    " &middot; " +
    ev.type +
    " &middot; " +
    formatDate(ev.timestamp) +
    "</div></div>";
  html += '<button type="button" id="closeEvidenceDetailBtn" class="btn btn-secondary btn-small">Close</button>';
  html += "</div>";

  if (ev.tags.includes("critical")) {
    html += '<div class="warning-banner">This item is tagged as critical evidence.</div>';
  }

  html += '<div class="detail-field"><strong>Summary</strong>' + ev.summary + "</div>";
  html += '<div class="evidence-detail-content">' + ev.content + "</div>";
  html += '<div class="detail-field"><strong>Related people</strong>' + personNames.join(", ") + "</div>";
  html += '<div class="detail-field"><strong>Related locations</strong>' + locationNames.join(", ") + "</div>";
  html += '<div class="detail-field"><strong>Tags</strong>' + tagsHtml + "</div>";

  html += '<div class="detail-field"><strong>Review status</strong>';
  html += '<select id="detailStatusSelect">';
  html += statusOptionHTML(ev.status, "unreviewed", "Unreviewed");
  html += statusOptionHTML(ev.status, "reviewed", "Reviewed");
  html += statusOptionHTML(ev.status, "flagged", "Flagged");
  html += "</select></div>";

  html += '<div class="detail-field"><strong>Relevance</strong>';
  html += '<select id="detailRelevanceSelect">';
  html += statusOptionHTML(ev.relevance, "unknown", "Unknown");
  html += statusOptionHTML(ev.relevance, "relevant", "Relevant");
  html += statusOptionHTML(ev.relevance, "irrelevant", "Irrelevant");
  html += "</select></div>";

  html += '<div class="detail-field"><strong>Investigator note</strong>';
  html +=
    '<textarea id="evidenceNoteInput" class="note-textarea" rows="3" data-evidence-id="' +
    ev.id +
    '" placeholder="Add a private note about this evidence..."></textarea>';
  html +=
    '<button type="button" id="saveNoteBtn" class="btn btn-primary btn-small" style="margin-top:6px;">Save note</button>';
  html += "</div>";

  html += '<div class="detail-field"><strong>Note preview</strong><div id="notePreview"></div></div>';

  section.innerHTML = html;

  // The note is user input: insert it as text, never as markup.
  getRequiredElement("evidenceNoteInput", HTMLTextAreaElement).value = storedNote;
  getRequiredElement("notePreview", HTMLElement).textContent = storedNote;

  getRequiredElement("closeEvidenceDetailBtn", HTMLButtonElement).addEventListener("click", closeEvidenceDetail);
  getRequiredElement("saveNoteBtn", HTMLButtonElement).addEventListener("click", saveCurrentNote);

  const statusSelect = getRequiredElement("detailStatusSelect", HTMLSelectElement);
  statusSelect.addEventListener("change", () => {
    ev.status = statusSelect.value; // direct mutation of the loaded evidence object
    if (viewRendered.evidence) renderEvidenceList();
  });
  const relevanceSelect = getRequiredElement("detailRelevanceSelect", HTMLSelectElement);
  relevanceSelect.addEventListener("change", () => {
    ev.relevance = relevanceSelect.value;
    if (viewRendered.evidence) renderEvidenceList();
  });
}

function statusOptionHTML(current: string, value: string, label: string): string {
  const selected = current.toLowerCase() === value ? " selected" : "";
  return '<option value="' + value + '"' + selected + ">" + label + "</option>";
}

function saveCurrentNote(): void {
  const textarea = document.getElementById("evidenceNoteInput");
  if (!(textarea instanceof HTMLTextAreaElement)) return;
  const evidenceId = textarea.dataset.evidenceId; // note id is read back off the DOM
  if (!evidenceId) return;
  const text = textarea.value;
  saveNoteForEvidence(evidenceId, text);
  const preview = document.getElementById("notePreview");
  if (preview) preview.textContent = text;
}
