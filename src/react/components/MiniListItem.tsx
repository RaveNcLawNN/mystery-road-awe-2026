import type { ReactNode } from "react";

interface MiniListItemProps {
  // shown in bold at the start, e.g. an evidence id or a date
  title: string;
  children: ReactNode;
}

export function MiniListItem({ title, children }: MiniListItemProps) {
  return (
    <div className="mini-list-item">
      <strong>{title}</strong>
      {children}
    </div>
  );
}
