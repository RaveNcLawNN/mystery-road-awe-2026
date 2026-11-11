import type { ReactNode } from "react";

interface PanelProps {
  title: string;
  // any JSX between <Panel> and </Panel>
  children: ReactNode;
}

// a white box with a heading around any content
export function Panel({ title, children }: PanelProps) {
  return (
    <div className="dashboard-panel">
      <h3>{title}</h3>
      {children}
    </div>
  );
}
