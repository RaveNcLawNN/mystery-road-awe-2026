// ---------------------------------------------------------------------
// LOCAL STORAGE HELPERS (bookmarks & notes)
// ---------------------------------------------------------------------
// read…/write… work on plain values and are used by both versions; the
// other functions connect them to the vanilla app's shared state.

import { bookmarks, notesStore, setBookmarks, setNotesStore } from "./state.ts";

const STORAGE_KEY_BOOKMARKS = "remotion_bookmarks";
const STORAGE_KEY_NOTES = "remotion_notes";
export const STORAGE_KEY_HYPOTHESIS = "remotion_hypothesis";

export function readStoredBookmarks(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_BOOKMARKS);
    // JSON.parse returns any; unknown forces the checks below
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    // valid JSON is not necessarily a list of evidence ids
    return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === "string") : [];
  } catch (err) {
    console.warn("Could not read stored bookmarks, starting empty", err);
    return [];
  }
}

export function writeStoredBookmarks(ids: readonly string[]): void {
  localStorage.setItem(STORAGE_KEY_BOOKMARKS, JSON.stringify(ids));
}

// evidence id -> note text
export function readStoredNotes(): Record<string, string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_NOTES);
    const parsed: unknown = raw ? JSON.parse(raw) : {};
    const isPlainObject = parsed !== null && typeof parsed === "object" && !Array.isArray(parsed);
    // keep only entries whose note is text
    const notes: Record<string, string> = {};
    if (isPlainObject) {
      for (const [evidenceId, text] of Object.entries(parsed)) {
        if (typeof text === "string") notes[evidenceId] = text;
      }
    }
    return notes;
  } catch (err) {
    console.warn("Could not read stored notes, starting empty", err);
    return {};
  }
}

export function writeStoredNotes(notes: Record<string, string>): void {
  localStorage.setItem(STORAGE_KEY_NOTES, JSON.stringify(notes));
}

// --- vanilla app -------------------------------------------------------

export function saveBookmarksToStorage(): void {
  writeStoredBookmarks(bookmarks);
}

export function loadBookmarksFromStorage(): void {
  setBookmarks(readStoredBookmarks());
}

export function saveNoteForEvidence(evidenceId: string, text: string): void {
  notesStore[evidenceId] = text;
  writeStoredNotes(notesStore);
}

export function loadNoteForEvidence(evidenceId: string): string {
  return notesStore[evidenceId] || "";
}

export function loadNotesFromStorage(): void {
  setNotesStore(readStoredNotes());
}
