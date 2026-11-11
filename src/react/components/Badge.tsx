import type { RelevanceBadgeClass, StatusBadgeClass } from "../../utils/format.ts";

// the badge classes styles.css defines, so a typo is a type error
export type BadgeVariant = StatusBadgeClass | RelevanceBadgeClass | "badge-critical";

interface BadgeProps {
  text: string;
  variant: BadgeVariant;
}

export function Badge({ text, variant }: BadgeProps) {
  return <span className={"badge " + variant}>{text}</span>;
}
