import type { Evidence } from "../../types.ts";
import { getStatusBadgeClass } from "../../utils/format.ts";
import { Badge } from "../components/Badge.tsx";
import { Panel } from "./Panel.tsx";

interface RecentEvidenceListProps {
  items: Evidence[];
}

export function RecentEvidenceList({ items }: RecentEvidenceListProps) {
  return (
    <Panel title="Recent evidence">
      {items.length === 0 && <p>No evidence loaded yet.</p>}
      {items.map((ev) => (
        <div key={ev.id} className="mini-list-item">
          <strong>{ev.id}</strong> &mdash; {ev.title}{" "}
          <Badge text={ev.status} variant={getStatusBadgeClass(ev.status)} />
        </div>
      ))}
    </Panel>
  );
}
