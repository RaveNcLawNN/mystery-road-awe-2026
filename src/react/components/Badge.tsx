interface BadgeProps {
  text: string;
  // the color variant, e.g. "badge-reviewed" (see getStatusBadgeClass in utils/format.ts)
  variant: string;
}

export function Badge({ text, variant }: BadgeProps) {
  return <span className={"badge " + variant}>{text}</span>;
}
