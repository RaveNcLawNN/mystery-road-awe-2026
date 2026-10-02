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

// A reference to a person by id ("nova-byte"), never by display name
// ("Nova Byte"). Both are strings, so a plain string type could not tell
// them apart; the brand makes PersonId a distinct type that only
// validate.ts creates, after checking it against people.json.
export type PersonId = string & { readonly __brand: "PersonId" };

// people.json
export interface Person {
  id: PersonId;
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
  // evidence.json mixes ids and display names here (E04: "Nova Byte");
  // names are resolved to ids when the file is loaded
  personIds: PersonId[];
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
  personIds: PersonId[];
  locationIds: string[];
  evidenceIds: string[];
}
