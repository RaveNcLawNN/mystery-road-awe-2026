import type { Evidence } from "../../../types.ts";
import { getStatusBadgeClass } from "../../../utils/format.ts";
import { Badge } from "../../components/Badge.tsx";
import { MiniListItem } from "../../components/MiniListItem.tsx";

interface RecentEvidenceListProps {
  items: Evidence[];
}

export function RecentEvidenceList({ items }: RecentEvidenceListProps) {
  return (
    <div className="dashboard-panel">
      <h3>Recent evidence</h3>
      {items.length === 0 && <p>No evidence loaded yet.</p>}
      {items.map((ev) => (
        <MiniListItem key={ev.id} title={ev.id}>
          {" — " + ev.title + " "}
          <Badge text={ev.status} variant={getStatusBadgeClass(ev.status)} />
        </MiniListItem>
      ))}
    </div>
  );
}
