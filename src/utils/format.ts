// ---------------------------------------------------------------------
// FORMATTING HELPERS
// ---------------------------------------------------------------------

export type StatusBadgeClass = "badge-reviewed" | "badge-flagged" | "badge-unreviewed";
export type RelevanceBadgeClass = "badge-relevant" | "badge-unreviewed";

// ISO timestamp → localized "Oct 16, 2026 08:49". Values that are not a
// parsable date are shown as they are.
export function formatDate(ts: string | undefined): string {
  if (!ts) return "Unknown date";
  const d = new Date(ts);
  if (isNaN(d.getTime())) return ts;
  return (
    d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" }) +
    " " +
    d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })
  );
}

// ISO date without a time ("2026-10-16") → localized "Oct 16, 2026".
// Date-only strings are parsed as UTC midnight, so they are formatted in UTC
// too; in local time the day would shift back by one west of UTC.
export function formatDay(isoDate: string): string {
  const d = new Date(isoDate);
  if (isNaN(d.getTime())) return isoDate;
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric", timeZone: "UTC" });
}

export function getStatusBadgeClass(status: string | undefined): StatusBadgeClass {
  const s = (status || "").toLowerCase();
  if (s === "reviewed") return "badge-reviewed";
  if (s === "flagged") return "badge-flagged";
  return "badge-unreviewed";
}

export function getRelevanceBadgeClass(relevance: string | undefined): RelevanceBadgeClass {
  const r = (relevance || "").toLowerCase();
  if (r === "relevant") return "badge-relevant";
  return "badge-unreviewed";
}
