import type { RelevanceBadgeClass, StatusBadgeClass } from "../../utils/format.ts";

// Exactly the color classes styles.css defines (.badge-critical,
// .badge-unreviewed, .badge-reviewed, .badge-flagged, .badge-relevant), so
// a typo is a type error instead of a silently uncolored badge.
export type BadgeVariant = StatusBadgeClass | RelevanceBadgeClass | "badge-critical";

interface BadgeProps {
  text: string;
  variant: BadgeVariant;
}

export function Badge({ text, variant }: BadgeProps) {
  return <span className={"badge " + variant}>{text}</span>;
}
