import type { ReactNode } from "react";

interface PanelProps {
  title: string;
  // the panel's content; any JSX the caller puts between <Panel> and </Panel>
  children: ReactNode;
}

// A white box with a heading. Only the frame is fixed, the content is up to the caller.
export function Panel({ title, children }: PanelProps) {
  return (
    <div className="dashboard-panel">
      <h3>{title}</h3>
      {children}
    </div>
  );
}
