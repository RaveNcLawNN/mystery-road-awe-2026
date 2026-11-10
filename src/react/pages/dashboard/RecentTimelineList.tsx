import type { TimelineEvent } from "../../../types.ts";
import { formatDate } from "../../../utils/format.ts";
import { MiniListItem } from "../../components/MiniListItem.tsx";

interface RecentTimelineListProps {
  events: TimelineEvent[];
}

export function RecentTimelineList({ events }: RecentTimelineListProps) {
  return (
    <div className="dashboard-panel">
      <h3>Recent timeline events</h3>
      {events.length === 0 && <p>No timeline events loaded yet.</p>}
      {events.map((evt) => (
        <MiniListItem key={evt.id} title={formatDate(evt.time)}>
          <br />
          {evt.title}
        </MiniListItem>
      ))}
    </div>
  );
}
