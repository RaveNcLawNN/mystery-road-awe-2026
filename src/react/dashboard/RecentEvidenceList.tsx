import type { Evidence } from "../../types.ts";
import { getStatusBadgeClass } from "../../utils/format.ts";
import { Badge } from "../components/Badge.tsx";
import { MiniListItem } from "../components/MiniListItem.tsx";
import { Panel } from "../components/Panel.tsx";

interface RecentEvidenceListProps {
  items: Evidence[];
}

export function RecentEvidenceList({ items }: RecentEvidenceListProps) {
  return (
    <Panel title="Recent evidence">
      {items.length === 0 && <p>No evidence loaded yet.</p>}
      {items.map((ev) => (
        <MiniListItem key={ev.id} title={ev.id}>
          {" — " + ev.title + " "}
          <Badge text={ev.status} variant={getStatusBadgeClass(ev.status)} />
        </MiniListItem>
      ))}
    </Panel>
  );
}
