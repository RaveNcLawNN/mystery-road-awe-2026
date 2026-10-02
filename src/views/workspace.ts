// ---------------------------------------------------------------------
// WORKSPACE
// ---------------------------------------------------------------------

import { allEvidence, allPeople, notesStore } from "../state.ts";
import { STORAGE_KEY_HYPOTHESIS } from "../storage.ts";
import { getRequiredElement } from "../utils/dom.ts";
import { navigateTo } from "../navigation.ts";
import { openEvidenceDetail } from "./evidence.ts";

// The hypothesis form as saved in localStorage (all values as the form
// controls hold them, i.e. strings).
interface HypothesisDraft {
  suspectId: string;
  nature: string;
  evidenceIds: string[];
  confidence: string;
  explanation: string;
  alternative: string;
  savedAt: string;
}

let savedMessageTimer: number | undefined;
let hypothesisDraftRestored = false;
// Saved evidence ids that could not be selected yet because evidence.json
// had not resolved when the draft was restored.
let pendingEvidenceSelection: string[] = [];

export function renderWorkspace(): void {
  renderBookmarksList();
  renderNotesList();
  populateHypothesisDropdowns();
  // The form keeps its own (possibly unsaved) state across visits;
  // the stored draft is only the starting point after a page load.
  if (!hypothesisDraftRestored) {
    loadHypothesisFromStorage();
    hypothesisDraftRestored = true;
  }
}

function renderBookmarksList(): void {
  const container = document.getElementById("bookmarksList");
  if (!container) return;

  const bookmarkedItems = allEvidence.filter((ev) => ev.bookmarked);

  if (bookmarkedItems.length === 0) {
    container.innerHTML = "<p>No bookmarked evidence yet. Bookmark items from the Evidence view.</p>";
    return;
  }

  let html = "";
  for (const ev of bookmarkedItems) {
    html +=
      '<div class="mini-list-item"><strong>' +
      ev.id +
      "</strong> &mdash; " +
      ev.title +
      ' <button type="button" class="btn btn-small btn-secondary" data-open-evidence="' +
      ev.id +
      '">Open</button></div>';
  }
  container.innerHTML = html;

  container.querySelectorAll<HTMLButtonElement>("[data-open-evidence]").forEach((button) => {
    button.addEventListener("click", () => {
      navigateTo("evidence");
      const id = button.dataset.openEvidence ?? "";
      setTimeout(() => {
        openEvidenceDetail(id);
      }, 0);
    });
  });
}

function renderNotesList(): void {
  const container = document.getElementById("notesList");
  if (!container) return;

  const noteEntries: { index: number; evidenceId: string; title: string; text: string }[] = [];
  allEvidence.forEach((ev, index) => {
    const note = notesStore[ev.id];
    if (note) {
      noteEntries.push({ index, evidenceId: ev.id, title: ev.title, text: note });
    }
  });

  if (noteEntries.length === 0) {
    container.innerHTML = "<p>No notes yet. Add one from an evidence item's detail view.</p>";
    return;
  }

  const items = noteEntries.map((entry) => {
    const item = document.createElement("div");
    item.className = "mini-list-item";

    const id = document.createElement("strong");
    id.textContent = entry.evidenceId;

    const text = document.createElement("div");
    text.id = "noteText-" + entry.index;
    text.textContent = entry.text;

    item.append(id, " — " + entry.title, text);
    return item;
  });
  container.replaceChildren(...items);
}

export function populateHypothesisDropdowns(): void {
  const suspectSelect = document.getElementById("hypSuspect");
  const evidenceSelect = document.getElementById("hypEvidence");
  if (!(suspectSelect instanceof HTMLSelectElement) || !(evidenceSelect instanceof HTMLSelectElement)) return;

  const currentSuspect = suspectSelect.value;
  suspectSelect.innerHTML = '<option value="">Select a person…</option>';
  for (const person of allPeople) {
    suspectSelect.innerHTML += '<option value="' + person.id + '">' + person.name + "</option>";
  }
  suspectSelect.value = currentSuspect;

  const selectedEvidenceIds = [...getSelectedOptions(evidenceSelect), ...pendingEvidenceSelection];
  evidenceSelect.innerHTML = "";
  for (const ev of allEvidence) {
    evidenceSelect.innerHTML += '<option value="' + ev.id + '">' + ev.id + " - " + ev.title + "</option>";
  }
  for (const option of evidenceSelect.options) {
    option.selected = selectedEvidenceIds.includes(option.value);
  }
  if (allEvidence.length > 0) pendingEvidenceSelection = [];
}

export function saveHypothesis(): void {
  const draft: HypothesisDraft = {
    suspectId: getRequiredElement("hypSuspect", HTMLSelectElement).value,
    nature: getRequiredElement("hypNature", HTMLSelectElement).value,
    evidenceIds: getSelectedOptions(getRequiredElement("hypEvidence", HTMLSelectElement)),
    confidence: getRequiredElement("hypConfidence", HTMLInputElement).value,
    explanation: getRequiredElement("hypExplanation", HTMLTextAreaElement).value,
    alternative: getRequiredElement("hypAlternative", HTMLTextAreaElement).value,
    savedAt: new Date().toISOString(),
  };

  try {
    localStorage.setItem(STORAGE_KEY_HYPOTHESIS, JSON.stringify(draft));
  } catch (err) {
    console.error("Could not save hypothesis draft", err);
    alert("Your hypothesis could not be saved to local storage.");
    return;
  }

  const msg = getRequiredElement("hypothesisSavedMsg", HTMLElement);
  msg.classList.remove("hidden");
  clearTimeout(savedMessageTimer);
  savedMessageTimer = setTimeout(() => {
    msg.classList.add("hidden");
  }, 2000);
}

function getSelectedOptions(selectEl: HTMLSelectElement): string[] {
  return [...selectEl.options].filter((option) => option.selected).map((option) => option.value);
}

// Valid JSON is not necessarily a valid draft: a field is only used if it
// has the type saveHypothesis() writes, otherwise it gets the empty default.
function parseHypothesisDraft(json: unknown): HypothesisDraft | null {
  if (json === null || typeof json !== "object") return null;
  // safe: an object whose property values are still unknown
  const fields = json as Record<string, unknown>;
  const text = (value: unknown): string => (typeof value === "string" ? value : "");
  const evidenceIds = fields.evidenceIds;
  return {
    suspectId: text(fields.suspectId),
    nature: text(fields.nature),
    evidenceIds: Array.isArray(evidenceIds) ? evidenceIds.filter((id): id is string => typeof id === "string") : [],
    confidence: text(fields.confidence) || "50",
    explanation: text(fields.explanation),
    alternative: text(fields.alternative),
    savedAt: text(fields.savedAt),
  };
}

function loadHypothesisFromStorage(): void {
  const raw = localStorage.getItem(STORAGE_KEY_HYPOTHESIS);
  if (!raw) return;

  let draft: HypothesisDraft | null;
  try {
    draft = parseHypothesisDraft(JSON.parse(raw));
  } catch (err) {
    console.warn("Could not read stored hypothesis draft, ignoring it", err);
    return;
  }
  if (!draft) return;

  getRequiredElement("hypSuspect", HTMLSelectElement).value = draft.suspectId;
  getRequiredElement("hypNature", HTMLSelectElement).value = draft.nature;
  const confidenceInput = getRequiredElement("hypConfidence", HTMLInputElement);
  confidenceInput.value = draft.confidence;
  // the range input discards values it cannot represent; show what it kept
  getRequiredElement("hypConfidenceValue", HTMLOutputElement).textContent = confidenceInput.value;
  getRequiredElement("hypExplanation", HTMLTextAreaElement).value = draft.explanation;
  getRequiredElement("hypAlternative", HTMLTextAreaElement).value = draft.alternative;

  const savedIds = draft.evidenceIds;
  for (const option of getRequiredElement("hypEvidence", HTMLSelectElement).options) {
    option.selected = savedIds.includes(option.value);
  }
  if (allEvidence.length === 0) pendingEvidenceSelection = savedIds;
}
