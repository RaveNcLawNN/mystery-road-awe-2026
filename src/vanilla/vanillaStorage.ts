// ---------------------------------------------------------------------
// LOCAL STORAGE, vanilla app: connects the plain helpers in ../storage.ts
// to the vanilla app's shared state (state.ts)
// ---------------------------------------------------------------------

import { readStoredBookmarks, readStoredNotes, writeStoredBookmarks, writeStoredNotes } from "../storage.ts";
import { bookmarks, notesStore, setBookmarks, setNotesStore } from "./state.ts";

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
