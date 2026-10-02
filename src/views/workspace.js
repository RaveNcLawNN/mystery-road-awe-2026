// ---------------------------------------------------------------------
// WORKSPACE
// ---------------------------------------------------------------------

import { allEvidence, allPeople, notesStore } from "../state.js";
import { STORAGE_KEY_HYPOTHESIS } from "../storage.js";
import { navigateTo } from "../navigation.js";
import { openEvidenceDetail } from "./evidence.js";

let savedMessageTimer = null;
let hypothesisDraftRestored = false;
// Saved evidence ids that could not be selected yet because evidence.json
// had not resolved when the draft was restored.
let pendingEvidenceSelection = [];

export function renderWorkspace() {
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

function renderBookmarksList() {
  const container = document.getElementById("bookmarksList");
  if (!container) return;

  const bookmarkedItems = allEvidence.filter(function (ev) {
    return ev.bookmarked;
  });

  if (bookmarkedItems.length === 0) {
    container.innerHTML = "<p>No bookmarked evidence yet. Bookmark items from the Evidence view.</p>";
    return;
  }

  let html = "";
  for (let i = 0; i < bookmarkedItems.length; i++) {
    const ev = bookmarkedItems[i];
    html += '<div class="mini-list-item"><strong>' + ev.id + "</strong> &mdash; " + ev.title +
      ' <button type="button" class="btn btn-small btn-secondary" data-open-evidence="' + ev.id + '">Open</button></div>';
  }
  container.innerHTML = html;

  const openButtons = container.querySelectorAll("[data-open-evidence]");
  for (let b = 0; b < openButtons.length; b++) {
    openButtons[b].addEventListener("click", function (e) {
      navigateTo("evidence");
      const id = e.target.getAttribute("data-open-evidence");
      setTimeout(function () {
        openEvidenceDetail(id);
      }, 0);
    });
  }
}

function renderNotesList() {
  const container = document.getElementById("notesList");
  if (!container) return;

  const noteEntries = [];
  for (let i = 0; i < allEvidence.length; i++) {
    const note = notesStore[allEvidence[i].id];
    if (note) {
      noteEntries.push({ index: i, evidenceId: allEvidence[i].id, title: allEvidence[i].title, text: note });
    }
  }

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

export function populateHypothesisDropdowns() {
  const suspectSelect = document.getElementById("hypSuspect");
  const evidenceSelect = document.getElementById("hypEvidence");
  if (!suspectSelect || !evidenceSelect) return;

  const currentSuspect = suspectSelect.value;
  suspectSelect.innerHTML = '<option value="">Select a person…</option>';
  for (let p = 0; p < allPeople.length; p++) {
    suspectSelect.innerHTML += '<option value="' + allPeople[p].id + '">' + allPeople[p].name + "</option>";
  }
  suspectSelect.value = currentSuspect;

  const selectedEvidenceIds = [...getSelectedOptions(evidenceSelect), ...pendingEvidenceSelection];
  evidenceSelect.innerHTML = "";
  for (let i = 0; i < allEvidence.length; i++) {
    evidenceSelect.innerHTML += '<option value="' + allEvidence[i].id + '">' + allEvidence[i].id + " - " + allEvidence[i].title + "</option>";
  }
  for (const option of evidenceSelect.options) {
    option.selected = selectedEvidenceIds.includes(option.value);
  }
  if (allEvidence.length > 0) pendingEvidenceSelection = [];
}

export function saveHypothesis() {
  const draft = {
    suspectId: document.getElementById("hypSuspect").value,
    nature: document.getElementById("hypNature").value,
    evidenceIds: getSelectedOptions(document.getElementById("hypEvidence")),
    confidence: document.getElementById("hypConfidence").value,
    explanation: document.getElementById("hypExplanation").value,
    alternative: document.getElementById("hypAlternative").value,
    savedAt: new Date().toISOString()
  };

  try {
    localStorage.setItem(STORAGE_KEY_HYPOTHESIS, JSON.stringify(draft));
  } catch (err) {
    console.error("Could not save hypothesis draft", err);
    alert("Your hypothesis could not be saved to local storage.");
    return;
  }

  const msg = document.getElementById("hypothesisSavedMsg");
  msg.classList.remove("hidden");
  clearTimeout(savedMessageTimer);
  savedMessageTimer = setTimeout(function () {
    msg.classList.add("hidden");
  }, 2000);
}

function getSelectedOptions(selectEl) {
  const result = [];
  for (let i = 0; i < selectEl.options.length; i++) {
    if (selectEl.options[i].selected) result.push(selectEl.options[i].value);
  }
  return result;
}

function loadHypothesisFromStorage() {
  const raw = localStorage.getItem(STORAGE_KEY_HYPOTHESIS);
  if (!raw) return;

  let draft;
  try {
    draft = JSON.parse(raw);
  } catch (err) {
    console.warn("Could not read stored hypothesis draft, ignoring it", err);
    return;
  }
  if (draft === null || typeof draft !== "object") return;

  document.getElementById("hypSuspect").value = draft.suspectId || "";
  document.getElementById("hypNature").value = draft.nature || "";
  document.getElementById("hypConfidence").value = draft.confidence || 50;
  document.getElementById("hypConfidenceValue").textContent = draft.confidence || 50;
  document.getElementById("hypExplanation").value = draft.explanation || "";
  document.getElementById("hypAlternative").value = draft.alternative || "";

  const evidenceSelect = document.getElementById("hypEvidence");
  const savedIds = draft.evidenceIds || [];
  for (let i = 0; i < evidenceSelect.options.length; i++) {
    evidenceSelect.options[i].selected = savedIds.indexOf(evidenceSelect.options[i].value) !== -1;
  }
  if (allEvidence.length === 0) pendingEvidenceSelection = savedIds;
}
