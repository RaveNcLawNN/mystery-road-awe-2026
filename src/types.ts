// ---------------------------------------------------------------------
// DOMAIN TYPES
// ---------------------------------------------------------------------
// The shapes of public/data/*.json as the app uses them.

// case.json
export interface CaseFile {
  caseId: string;
  title: string;
  subtitle: string;
  status: string;
  opened: string; // ISO date, "2026-10-16"
  summary: string;
  location: string;
  leadInvestigator: string;
  notes: string;
}

// people.json
export interface Person {
  id: string; // "nova-byte"
  name: string; // "Nova Byte"
  role: string;
  speciality: string;
  responsibilities: string[];
  statement: string;
  background: string;
  avatar: string; // URL relative to the site root
}

// locations.json (not "Location": that name is taken by the DOM's window.location type)
export interface CaseLocation {
  id: string; // "L01"
  name: string;
  description: string;
  contains: string[];
}

// evidence.json
export interface Evidence {
  id: string; // "E01"
  type: string;
  title: string;
  timestamp: string; // ISO date-time
  summary: string;
  content: string;
  // Person ids, except that E04 lists "Nova Byte", a display name.
  personIds: string[];
  locationIds: string[];
  tags: string[];
  // free text in the file ("unreviewed", "Reviewed"); the detail view writes
  // "unreviewed" | "reviewed" | "flagged"
  status: string;
  relevance: string;
  // not in the file: set from the stored bookmarks after loading
  bookmarked: boolean;
}

// timeline.json
export interface TimelineEvent {
  id: string; // "T01"
  time: string; // ISO date-time
  title: string;
  description: string;
  type: string;
  certainty: string; // "confirmed" | "reported" | "contradictory" in the current file
  personIds: string[];
  locationIds: string[];
  evidenceIds: string[];
}
