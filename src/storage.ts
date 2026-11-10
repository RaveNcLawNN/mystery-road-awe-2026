// ---------------------------------------------------------------------
// LOCAL STORAGE HELPERS (bookmarks, notes, hypothesis draft)
// ---------------------------------------------------------------------
// Plain read…/write… functions, used by the React app and the vanilla app.
// The vanilla app's wrappers around its shared state are in
// vanilla/vanillaStorage.ts.

const STORAGE_KEY_BOOKMARKS = "remotion_bookmarks";
const STORAGE_KEY_NOTES = "remotion_notes";
const STORAGE_KEY_HYPOTHESIS = "remotion_hypothesis";
const STORAGE_KEY_REVIEWS = "remotion_reviews";

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

// Review status / relevance changed in the app, per evidence id. Only the
// changes are stored; evidence.json itself stays as it is.
export type StoredReviews = Record<string, { status?: string; relevance?: string }>;

export function readStoredReviews(): StoredReviews {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_REVIEWS);
    const parsed: unknown = raw ? JSON.parse(raw) : {};
    const reviews: StoredReviews = {};
    if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) return reviews;
    // keep only entries that are objects, and only their string fields
    for (const [evidenceId, entry] of Object.entries(parsed)) {
      if (entry === null || typeof entry !== "object") continue;
      const fields = entry as Record<string, unknown>;
      const review: { status?: string; relevance?: string } = {};
      if (typeof fields.status === "string") review.status = fields.status;
      if (typeof fields.relevance === "string") review.relevance = fields.relevance;
      reviews[evidenceId] = review;
    }
    return reviews;
  } catch (err) {
    console.warn("Could not read stored review changes, ignoring them", err);
    return {};
  }
}

export function writeStoredReviews(reviews: StoredReviews): void {
  localStorage.setItem(STORAGE_KEY_REVIEWS, JSON.stringify(reviews));
}

// The hypothesis form as saved in localStorage (all values as the form
// controls hold them, i.e. strings).
export interface HypothesisDraft {
  suspectId: string;
  nature: string;
  evidenceIds: string[];
  confidence: string;
  explanation: string;
  alternative: string;
  savedAt: string;
}

// the form before anything was entered or saved
export const EMPTY_HYPOTHESIS_DRAFT: HypothesisDraft = {
  suspectId: "",
  nature: "",
  evidenceIds: [],
  confidence: "50",
  explanation: "",
  alternative: "",
  savedAt: "",
};

// Valid JSON is not necessarily a valid draft: a field is only used if it
// has the type the form writes, otherwise it gets the empty default.
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

// null if nothing (usable) is stored
export function readStoredHypothesis(): HypothesisDraft | null {
  const raw = localStorage.getItem(STORAGE_KEY_HYPOTHESIS);
  if (!raw) return null;
  try {
    return parseHypothesisDraft(JSON.parse(raw));
  } catch (err) {
    console.warn("Could not read stored hypothesis draft, ignoring it", err);
    return null;
  }
}

export function writeStoredHypothesis(draft: HypothesisDraft): void {
  localStorage.setItem(STORAGE_KEY_HYPOTHESIS, JSON.stringify(draft));
}
