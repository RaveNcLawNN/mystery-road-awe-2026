import type { TimelineEvent } from "../../types.ts";
import { formatDate } from "../../utils/format.ts";
import { MiniListItem } from "../components/MiniListItem.tsx";
import { Panel } from "../components/Panel.tsx";

interface RecentTimelineListProps {
  events: TimelineEvent[];
}

export function RecentTimelineList({ events }: RecentTimelineListProps) {
  return (
    <Panel title="Recent timeline events">
      {events.length === 0 && <p>No timeline events loaded yet.</p>}
      {events.map((evt) => (
        <MiniListItem key={evt.id} title={formatDate(evt.time)}>
          <br />
          {evt.title}
        </MiniListItem>
      ))}
    </Panel>
  );
}
