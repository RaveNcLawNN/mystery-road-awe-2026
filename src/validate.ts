// Checks the fetched JSON against the domain types (TypeScript types do not
// exist at runtime). Throws on the first mismatch, naming file and field.

import type { CaseFile, CaseLocation, Evidence, Person, PersonId, TimelineEvent } from "./types.ts";

type JsonObject = Record<string, unknown>;

function expectObject(value: unknown, where: string): JsonObject {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new Error(`${where}: expected an object`);
  }
  return value as JsonObject;
}

function expectArray(value: unknown, where: string): unknown[] {
  if (!Array.isArray(value)) throw new Error(`${where}: expected an array`);
  return value;
}

function stringField(obj: JsonObject, key: string, where: string): string {
  const value = obj[key];
  if (typeof value !== "string") throw new Error(`${where}: "${key}" must be a string`);
  return value;
}

function stringArrayField(obj: JsonObject, key: string, where: string): string[] {
  const items = expectArray(obj[key], `${where}: "${key}"`);
  if (!items.every((item): item is string => typeof item === "string")) {
    throw new Error(`${where}: "${key}" must contain only strings`);
  }
  return items;
}

// Turns person references into ids (E04 uses the name "Nova Byte").
// Unknown references are reported and left out.
function resolvePersonRefs(refs: string[], people: readonly Person[], where: string): PersonId[] {
  const ids: PersonId[] = [];
  for (const ref of refs) {
    const person = people.find((p) => p.id === ref) ?? people.find((p) => p.name === ref);
    if (person) ids.push(person.id);
    else console.warn(`${where}: unknown person "${ref}" ignored`);
  }
  return ids;
}

export function parseCaseFile(json: unknown): CaseFile {
  const where = "case.json";
  const obj = expectObject(json, where);
  return {
    caseId: stringField(obj, "caseId", where),
    title: stringField(obj, "title", where),
    subtitle: stringField(obj, "subtitle", where),
    status: stringField(obj, "status", where),
    opened: stringField(obj, "opened", where),
    summary: stringField(obj, "summary", where),
    location: stringField(obj, "location", where),
    leadInvestigator: stringField(obj, "leadInvestigator", where),
    notes: stringField(obj, "notes", where),
  };
}

export function parsePeople(json: unknown): Person[] {
  return expectArray(json, "people.json").map((item, i) => {
    const where = `people.json[${i}]`;
    const obj = expectObject(item, where);
    return {
      // the only place a PersonId is created
      id: stringField(obj, "id", where) as PersonId,
      name: stringField(obj, "name", where),
      role: stringField(obj, "role", where),
      speciality: stringField(obj, "speciality", where),
      responsibilities: stringArrayField(obj, "responsibilities", where),
      statement: stringField(obj, "statement", where),
      background: stringField(obj, "background", where),
      avatar: stringField(obj, "avatar", where),
    };
  });
}

export function parseLocations(json: unknown): CaseLocation[] {
  return expectArray(json, "locations.json").map((item, i) => {
    const where = `locations.json[${i}]`;
    const obj = expectObject(item, where);
    return {
      id: stringField(obj, "id", where),
      name: stringField(obj, "name", where),
      description: stringField(obj, "description", where),
      contains: stringArrayField(obj, "contains", where),
    };
  });
}

export function parseEvidence(json: unknown, people: readonly Person[]): Evidence[] {
  return expectArray(json, "evidence.json").map((item, i) => {
    const where = `evidence.json[${i}]`;
    const obj = expectObject(item, where);
    return {
      id: stringField(obj, "id", where),
      type: stringField(obj, "type", where),
      title: stringField(obj, "title", where),
      timestamp: stringField(obj, "timestamp", where),
      summary: stringField(obj, "summary", where),
      content: stringField(obj, "content", where),
      personIds: resolvePersonRefs(stringArrayField(obj, "personIds", where), people, where),
      locationIds: stringArrayField(obj, "locationIds", where),
      tags: stringArrayField(obj, "tags", where),
      status: stringField(obj, "status", where),
      relevance: stringField(obj, "relevance", where),
      bookmarked: false,
    };
  });
}

export function parseTimeline(json: unknown, people: readonly Person[]): TimelineEvent[] {
  return expectArray(json, "timeline.json").map((item, i) => {
    const where = `timeline.json[${i}]`;
    const obj = expectObject(item, where);
    return {
      id: stringField(obj, "id", where),
      time: stringField(obj, "time", where),
      title: stringField(obj, "title", where),
      description: stringField(obj, "description", where),
      type: stringField(obj, "type", where),
      certainty: stringField(obj, "certainty", where),
      personIds: resolvePersonRefs(stringArrayField(obj, "personIds", where), people, where),
      locationIds: stringArrayField(obj, "locationIds", where),
      evidenceIds: stringArrayField(obj, "evidenceIds", where),
    };
  });
}
